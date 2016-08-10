# Imports ###########################################################

import ddt
import json
import mock
import random
import unittest

from xblockutils.resources import ResourceLoader

from drag_and_drop_v2.utils import FeedbackMessages

from ..utils import make_block, TestCaseMixin, generate_max_and_attempts


# Globals ###########################################################

loader = ResourceLoader(__name__)


# Classes ###########################################################

class BaseDragAndDropAjaxFixture(TestCaseMixin):
    ZONE_1 = None
    ZONE_2 = None

    OVERALL_FEEDBACK_KEY = 'overall_feedback'
    FEEDBACK_KEY = 'feedback'

    FEEDBACK = {
        0: {"correct": None, "incorrect": None},
        1: {"correct": None, "incorrect": None},
        2: {"correct": None, "incorrect": None}
    }

    START_FEEDBACK = None
    FINAL_FEEDBACK = None

    FOLDER = None

    def setUp(self):
        self.patch_workbench()
        self.block = make_block()
        initial_settings = self.initial_settings()
        for field in initial_settings:
            setattr(self.block, field, initial_settings[field])
        self.block.data = self.initial_data()

    @staticmethod
    def _make_feedback_message(message=None, message_class=None):
        return {"message": message, "message_class": message_class}

    @classmethod
    def initial_data(cls):
        return json.loads(loader.load_unicode('data/{}/data.json'.format(cls.FOLDER)))

    @classmethod
    def initial_settings(cls):
        return json.loads(loader.load_unicode('data/{}/settings.json'.format(cls.FOLDER)))

    @classmethod
    def expected_configuration(cls):
        return json.loads(loader.load_unicode('data/{}/config_out.json'.format(cls.FOLDER)))

    def test_get_configuration(self):
        self.assertEqual(self.block.get_configuration(), self.expected_configuration())


class StandardModeFixture(BaseDragAndDropAjaxFixture):
    """
    Common tests for drag and drop in standard mode
    """
    def _make_item_feedback_message(self, item_id, key="incorrect"):
        if self.FEEDBACK[item_id][key]:
            return self._make_feedback_message(self.FEEDBACK[item_id][key])
        else:
            return None

    def test_reset_no_item_feedback(self):
        data = {"val": 1, "zone": self.ZONE_1, "x_percent": "33%", "y_percent": "11%"}
        self.call_handler(self.DROP_ITEM_HANDLER, data)

        res = self.call_handler(self.RESET_HANDLER, data={})
        expected_overall_feedback = [self._make_feedback_message(message=self.INITIAL_FEEDBACK)]
        self.assertEqual(res[self.OVERALL_FEEDBACK_KEY], expected_overall_feedback)

    def test_user_state_no_item_state(self):
        res = self.call_handler(self.USER_STATE_HANDLER, data={})
        expected_overall_feedback = [self._make_feedback_message(message=self.INITIAL_FEEDBACK)]
        self.assertEqual(res[self.OVERALL_FEEDBACK_KEY], expected_overall_feedback)

    def test_drop_item_wrong_with_feedback(self):
        item_id, zone_id = 0, self.ZONE_2
        data = {"val": item_id, "zone": zone_id}
        res = self.call_handler(self.DROP_ITEM_HANDLER, data)
        item_feedback_message = self._make_item_feedback_message(item_id)
        expected_feedback = [item_feedback_message] if item_feedback_message else []

        self.assertEqual(res, {
            "overall_feedback": [self._make_feedback_message(message=self.INITIAL_FEEDBACK)],
            "finished": False,
            "correct": False,
            "feedback": expected_feedback
        })

    def test_drop_item_wrong_without_feedback(self):
        item_id, zone_id = 2, self.ZONE_1
        data = {"val": item_id, "zone": zone_id}
        res = self.call_handler(self.DROP_ITEM_HANDLER, data)
        item_feedback_message = self._make_item_feedback_message(item_id)
        expected_feedback = [item_feedback_message] if item_feedback_message else []

        self.assertEqual(res, {
            "overall_feedback": [self._make_feedback_message(message=self.INITIAL_FEEDBACK)],
            "finished": False,
            "correct": False,
            "feedback": expected_feedback
        })

    def test_drop_item_correct(self):
        item_id, zone_id = 0, self.ZONE_1
        data = {"val": item_id, "zone": zone_id}
        res = self.call_handler(self.DROP_ITEM_HANDLER, data)
        item_feedback_message = self._make_item_feedback_message(item_id, key="correct")
        expected_feedback = [item_feedback_message] if item_feedback_message else []

        self.assertEqual(res, {
            "overall_feedback": [self._make_feedback_message(message=self.INITIAL_FEEDBACK)],
            "finished": False,
            "correct": True,
            "feedback": expected_feedback
        })

    def test_grading(self):
        published_grades = []

        def mock_publish(_, event, params):
            if event == 'grade':
                published_grades.append(params)
        self.block.runtime.publish = mock_publish

        self.call_handler(self.DROP_ITEM_HANDLER, {"val": 0, "zone": self.ZONE_1})

        self.assertEqual(1, len(published_grades))
        self.assertEqual({'value': 0.75, 'max_value': 1}, published_grades[-1])

        self.call_handler(self.DROP_ITEM_HANDLER, {"val": 1, "zone": self.ZONE_2})

        self.assertEqual(2, len(published_grades))
        self.assertEqual({'value': 1, 'max_value': 1}, published_grades[-1])

    def test_drop_item_final(self):
        data = {"val": 0, "zone": self.ZONE_1}
        self.call_handler(self.DROP_ITEM_HANDLER, data)

        expected_state = {
            "items": {
                "0": {"correct": True, "zone": self.ZONE_1}
            },
            "finished": False,
            "attempts": 0,
            'overall_feedback': [self._make_feedback_message(message=self.INITIAL_FEEDBACK)],
        }
        self.assertEqual(expected_state, self.call_handler('get_user_state', method="GET"))

        res = self.call_handler(self.DROP_ITEM_HANDLER, {"val": 1, "zone": self.ZONE_2})
        self.assertEqual(res, {
            "overall_feedback": [self._make_feedback_message(message=self.FINAL_FEEDBACK)],
            "finished": True,
            "correct": True,
            "feedback": [self._make_feedback_message(self.FEEDBACK[1]["correct"])]
        })

        expected_state = {
            "items": {
                "0": {"correct": True, "zone": self.ZONE_1},
                "1": {"correct": True, "zone": self.ZONE_2}
            },
            "finished": True,
            "attempts": 0,
            'overall_feedback': [self._make_feedback_message(self.FINAL_FEEDBACK)],
        }
        self.assertEqual(expected_state, self.call_handler('get_user_state', method="GET"))

    def test_do_attempt_not_available(self):
        """
        Tests that do_attempt handler returns 400 error for standard mode DnDv2
        """
        res = self.call_handler(self.DO_ATTEMPT_HANDLER, expect_json=False)

        self.assertEqual(res.status_code, 400)


@ddt.ddt
class AssessmentModeFixture(BaseDragAndDropAjaxFixture):
    """
    Common tests for drag and drop in assessment mode
    """
    @staticmethod
    def _make_submission(item_id, zone_id):
        return {"val": item_id, "zone": zone_id}

    def _submit_solution(self, solution):
        for item_id, zone_id in solution.iteritems():
            data = self._make_submission(item_id, zone_id)
            self.call_handler(self.DROP_ITEM_HANDLER, data)

    def _submit_complete_solution(self):  # pylint: disable=no-self-use
        raise NotImplementedError()

    def _submit_partial_solution(self):  # pylint: disable=no-self-use
        raise NotImplementedError()

    def _reset_problem(self):
        self.call_handler(self.RESET_HANDLER, data={})
        self.assertEqual(self.block.item_state, {})

    def _set_final_attempt(self):
        self.block.max_attempts = 5
        self.block.attempts = 4

    def _do_attempt(self):
        return self.call_handler(self.DO_ATTEMPT_HANDLER, data={})

    def test_multiple_drop_item(self):
        item_zone_map = {0: self.ZONE_1, 1: self.ZONE_2}
        for item_id, zone_id in item_zone_map.iteritems():
            data = self._make_submission(item_id, zone_id)
            res = self.call_handler(self.DROP_ITEM_HANDLER, data)

            self.assertEqual(res, {})

            expected_item_state = {'zone': zone_id, 'correct': True}

            self.assertIn(str(item_id), self.block.item_state)
            self.assertEqual(self.block.item_state[str(item_id)], expected_item_state)

        # make sure item_state is appended to, not reset
        for item_id in item_zone_map:
            self.assertIn(str(item_id), self.block.item_state)

    def test_get_user_state_no_attempts(self):
        self.block.attempts = 0

        res = self.call_handler(self.USER_STATE_HANDLER, data={})
        expected_feedback = [
            self._make_feedback_message(self.INITIAL_FEEDBACK)
        ]
        self.assertEqual(res[self.OVERALL_FEEDBACK_KEY], expected_feedback)

    def test_reset_no_item_feedback(self):
        self.block.attempts = 1
        self._submit_partial_solution()
        res = self.call_handler(self.RESET_HANDLER, data={})

        expected_overall_feedback = [self._make_feedback_message(message=self.INITIAL_FEEDBACK)]
        self.assertEqual(res[self.OVERALL_FEEDBACK_KEY], expected_overall_feedback)

    # pylint: disable=star-args
    @ddt.data(
        (None, 10, False),
        (0, 12, False),
        *(generate_max_and_attempts())
    )
    @ddt.unpack
    def test_do_attempt_validation(self, max_attempts, attempts, expect_validation_error):
        self.block.max_attempts = max_attempts
        self.block.attempts = attempts
        res = self.call_handler(self.DO_ATTEMPT_HANDLER, data={}, expect_json=False)

        if expect_validation_error:
            self.assertEqual(res.status_code, 409)
        else:
            self.assertEqual(res.status_code, 200)

    @ddt.data(*[random.randint(0, 100) for _ in xrange(10)])  # pylint: disable=star-args
    def test_do_attempt_raises_number_of_attempts(self, attempts):
        self.block.attempts = attempts
        self.block.max_attempts = attempts + 1

        res = self.call_handler(self.DO_ATTEMPT_HANDLER, data={})
        self.assertEqual(self.block.attempts, attempts + 1)
        self.assertEqual(res['attempts'], self.block.attempts)

    def test_do_attempt_correct_mark_complete_and_publish_grade(self):
        self._submit_complete_solution()

        with mock.patch('workbench.runtime.WorkbenchRuntime.publish', mock.Mock()) as patched_publish:
            res = self.call_handler(self.DO_ATTEMPT_HANDLER, data={})

            self.assertTrue(self.block.completed)
            patched_publish.assert_called_once_with(self.block, 'grade', {
                'value': self.block.weight,
                'max_value': self.block.weight,
            })
            self.assertTrue(res['correct'])

    def test_do_attempt_incorrect_publish_grade(self):
        correctness = self._submit_partial_solution()

        with mock.patch('workbench.runtime.WorkbenchRuntime.publish', mock.Mock()) as patched_publish:
            res = self.call_handler(self.DO_ATTEMPT_HANDLER, data={})

            self.assertFalse(self.block.completed)
            patched_publish.assert_called_once_with(self.block, 'grade', {
                'value': self.block.weight * correctness,
                'max_value': self.block.weight,
            })
            self.assertFalse(res['correct'])

    def test_do_attempt_post_correct_no_publish_grade(self):
        self._submit_complete_solution()

        self.call_handler(self.DO_ATTEMPT_HANDLER, data={})  # sets self.complete

        self._reset_problem()

        with mock.patch('workbench.runtime.WorkbenchRuntime.publish', mock.Mock()) as patched_publish:
            self.call_handler(self.DO_ATTEMPT_HANDLER, data={})

            self.assertTrue(self.block.completed)
            self.assertFalse(patched_publish.called)

    def test_get_user_state_finished_after_final_attempt(self):
        self._set_final_attempt()
        self._submit_partial_solution()
        self._do_attempt()

        self.assertFalse(self.block.attempts_remain)  # precondition check

        res = self.call_handler(self.USER_STATE_HANDLER, data={})
        self.assertTrue(res['finished'])

    def test_do_attempt_incorrect_final_attempt_publish_grade(self):
        self._set_final_attempt()

        correctness = self._submit_partial_solution()
        expected_grade = self.block.weight * correctness

        with mock.patch('workbench.runtime.WorkbenchRuntime.publish', mock.Mock()) as patched_publish:
            res = self.call_handler(self.DO_ATTEMPT_HANDLER, data={})

            self.assertTrue(self.block.completed)
            patched_publish.assert_called_once_with(self.block, 'grade', {
                'value': expected_grade,
                'max_value': self.block.weight,
            })

            expected_grade_feedback = self._make_feedback_message(
                FeedbackMessages.FINAL_ATTEMPT_TPL.format(score=expected_grade),
                FeedbackMessages.MessageClasses.PARTIAL_SOLUTION
            )
            self.assertIn(expected_grade_feedback, res[self.OVERALL_FEEDBACK_KEY])

    def test_do_attempt_incorrect_final_attempt_after_correct(self):
        self._submit_complete_solution()
        self.call_handler(self.DO_ATTEMPT_HANDLER, data={})

        self.assertTrue(self.block.completed)  # precondition check
        self.assertEqual(self.block.grade, 1.0)  # precondition check

        self._reset_problem()

        self._set_final_attempt()

        self._submit_partial_solution()

        with mock.patch('workbench.runtime.WorkbenchRuntime.publish', mock.Mock()) as patched_publish:
            res = self.call_handler(self.DO_ATTEMPT_HANDLER, data={})

            expected_grade_feedback = self._make_feedback_message(
                FeedbackMessages.FINAL_ATTEMPT_TPL.format(score=1.0),
                FeedbackMessages.MessageClasses.PARTIAL_SOLUTION
            )
            self.assertFalse(patched_publish.called)
            self.assertIn(expected_grade_feedback, res[self.OVERALL_FEEDBACK_KEY])
            self.assertEqual(self.block.grade, 1.0)

    def test_do_attempt_misplaced_ids(self):
        misplaced_ids = self._submit_incorrect_solution()

        res = self.call_handler(self.DO_ATTEMPT_HANDLER, data={})
        self.assertTrue(res['misplaced_items'], misplaced_ids)

    def test_do_attempt_shows_final_feedback_at_last_attempt(self):
        self._set_final_attempt()

        self._submit_partial_solution()
        res = self.call_handler(self.DO_ATTEMPT_HANDLER, data={})
        expected_message = self._make_feedback_message(self.FINAL_FEEDBACK)
        self.assertIn(expected_message, res[self.OVERALL_FEEDBACK_KEY])

    def test_get_user_state_does_not_include_correctness(self):
        self._submit_complete_solution()
        original_item_state = self.block.item_state

        res = self.call_handler(self.USER_STATE_HANDLER)

        item_data = res['items']
        for item in item_data:
            self.assertNotIn('correct', item)

        self.assertEqual(self.block.item_state, original_item_state)


class TestDragAndDropHtmlData(StandardModeFixture, unittest.TestCase):
    FOLDER = "html"

    ZONE_1 = "Zone <i>1</i>"
    ZONE_2 = "Zone <b>2</b>"

    FEEDBACK = {
        0: {"correct": "Yes <b>1</b>", "incorrect": "No <b>1</b>"},
        1: {"correct": "Yes <i>2</i>", "incorrect": "No <i>2</i>"},
        2: {"correct": "", "incorrect": ""}
    }

    INITIAL_FEEDBACK = "HTML <strong>Intro</strong> Feed"
    FINAL_FEEDBACK = "Final <strong>feedback</strong>!"


class TestDragAndDropPlainData(StandardModeFixture, unittest.TestCase):
    FOLDER = "plain"

    ZONE_1 = "zone-1"
    ZONE_2 = "zone-2"

    FEEDBACK = {
        0: {"correct": "Yes 1", "incorrect": "No 1"},
        1: {"correct": "Yes 2", "incorrect": "No 2"},
        2: {"correct": "", "incorrect": ""}
    }

    INITIAL_FEEDBACK = "This is the initial feedback."
    FINAL_FEEDBACK = "This is the final feedback."


class TestOldDataFormat(TestDragAndDropPlainData):
    """
    Make sure we can work with the slightly-older format for 'data' field values.
    """
    FOLDER = "old"

    INITIAL_FEEDBACK = "Intro Feed"
    FINAL_FEEDBACK = "Final Feed"

    ZONE_1 = "Zone 1"
    ZONE_2 = "Zone 2"


class TestDragAndDropAssessmentData(AssessmentModeFixture, unittest.TestCase):
    FOLDER = "assessment"

    ZONE_1 = "zone-1"
    ZONE_2 = "zone-2"

    FEEDBACK = {
        0: {"correct": "Yes 1", "incorrect": "No 1"},
        1: {"correct": "Yes 2", "incorrect": "No 2"},
        2: {"correct": "", "incorrect": ""},
        3: {"correct": "", "incorrect": ""}
    }

    INITIAL_FEEDBACK = "This is the initial feedback."
    FINAL_FEEDBACK = "This is the final feedback."

    def _assert_item_and_overall_feedback(self, res, expected_item_feedback, expected_overall_feedback):
        self.assertEqual(res[self.FEEDBACK_KEY], expected_item_feedback)
        self.assertEqual(res[self.OVERALL_FEEDBACK_KEY], expected_overall_feedback)

    def _submit_complete_solution(self):
        self._submit_solution({0: self.ZONE_1, 1: self.ZONE_2, 2: self.ZONE_2})

    def _submit_partial_solution(self):
        self._submit_solution({0: self.ZONE_1})
        return 3.0 / 5.0

    def _submit_incorrect_solution(self):
        self._submit_solution({0: self.ZONE_2, 1: self.ZONE_1})
        return 0, 1

    def test_do_attempt_feedback_incorrect_not_placed(self):
        self._submit_solution({0: self.ZONE_2, 1: self.ZONE_2})
        res = self._do_attempt()

        expected_item_feedback = [self._make_feedback_message(self.FEEDBACK[0]['incorrect'])]
        expected_overall_feedback = [
            self._make_feedback_message(
                FeedbackMessages.correctly_placed(1), FeedbackMessages.MessageClasses.CORRECTLY_PLACED
            ),
            self._make_feedback_message(FeedbackMessages.misplaced(1), FeedbackMessages.MessageClasses.MISPLACED),
            self._make_feedback_message(FeedbackMessages.not_placed(1), FeedbackMessages.MessageClasses.NOT_PLACED),
            self._make_feedback_message(self.INITIAL_FEEDBACK, None),
        ]

        self._assert_item_and_overall_feedback(res, expected_item_feedback, expected_overall_feedback)

    def test_do_attempt_no_item_state(self):
        """
        Test do_attempt overall feedback when no item state is saved - no items were ever dropped.
        """
        res = self._do_attempt()
        self.assertEqual(res[self.FEEDBACK_KEY], [])

        expected_item_feedback = []
        expected_overall_feedback = [
            self._make_feedback_message(FeedbackMessages.not_placed(3), FeedbackMessages.MessageClasses.NOT_PLACED),
            self._make_feedback_message(self.INITIAL_FEEDBACK, None),
        ]

        self._assert_item_and_overall_feedback(res, expected_item_feedback, expected_overall_feedback)

    def test_do_attempt_feedback_correct_and_decoy(self):
        self._submit_solution({0: self.ZONE_1, 1: self.ZONE_2, 3: self.ZONE_2})  # incorrect solution - decoy placed
        res = self._do_attempt()

        expected_item_feedback = []
        expected_overall_feedback = [
            self._make_feedback_message(
                FeedbackMessages.correctly_placed(2), FeedbackMessages.MessageClasses.CORRECTLY_PLACED
            ),
            self._make_feedback_message(FeedbackMessages.misplaced(1), FeedbackMessages.MessageClasses.MISPLACED),
            self._make_feedback_message(FeedbackMessages.not_placed(1), FeedbackMessages.MessageClasses.NOT_PLACED),
            self._make_feedback_message(self.INITIAL_FEEDBACK, None),
        ]

        self._assert_item_and_overall_feedback(res, expected_item_feedback, expected_overall_feedback)

    def test_do_attempt_feedback_correct(self):
        self._submit_solution({0: self.ZONE_1, 1: self.ZONE_2, 2: self.ZONE_2})  # correct solution
        res = self._do_attempt()

        expected_item_feedback = []
        expected_overall_feedback = [
            self._make_feedback_message(
                FeedbackMessages.correctly_placed(3), FeedbackMessages.MessageClasses.CORRECTLY_PLACED
            ),
            self._make_feedback_message(self.FINAL_FEEDBACK, FeedbackMessages.MessageClasses.CORRECT_SOLUTION),
        ]

        self._assert_item_and_overall_feedback(res, expected_item_feedback, expected_overall_feedback)

    def test_do_attempt_feedback_partial(self):
        self._submit_solution({0: self.ZONE_1})  # partial solution
        res = self._do_attempt()

        expected_item_feedback = []
        expected_overall_feedback = [
            self._make_feedback_message(
                FeedbackMessages.correctly_placed(1), FeedbackMessages.MessageClasses.CORRECTLY_PLACED
            ),
            self._make_feedback_message(FeedbackMessages.not_placed(2), FeedbackMessages.MessageClasses.NOT_PLACED),
            self._make_feedback_message(self.INITIAL_FEEDBACK, None),
        ]

        self._assert_item_and_overall_feedback(res, expected_item_feedback, expected_overall_feedback)

    def test_do_attempt_keeps_highest_score(self):
        self.assertFalse(self.block.completed)  # precondition check
        expected_score = 4.0 / 5.0

        self._submit_solution({0: self.ZONE_1, 1: self.ZONE_2})  # partial solution, 0.8 score
        self._do_attempt()
        self.assertEqual(self.block.grade, expected_score)

        self._reset_problem()
        # make it a last attempt so we can check feedback
        self._set_final_attempt()

        self._submit_solution({0: self.ZONE_1})  # partial solution, 0.6 score
        res = self._do_attempt()
        self.assertEqual(self.block.grade, expected_score)

        expected_feedback = self._make_feedback_message(
            FeedbackMessages.FINAL_ATTEMPT_TPL.format(score=expected_score),
            FeedbackMessages.MessageClasses.PARTIAL_SOLUTION
        )

        self.assertIn(expected_feedback, res[self.OVERALL_FEEDBACK_KEY])

    def test_do_attempt_check_score_with_decoy(self):
        self.assertFalse(self.block.completed)  # precondition check
        expected_score = 4.0 / 5.0
        self._submit_solution({
            0: self.ZONE_1,
            1: self.ZONE_2,
            2: self.ZONE_2,
            3: self.ZONE_1,
        })  # incorrect solution, 0.8 score
        self._do_attempt()
        self.assertEqual(self.block.grade, expected_score)

    def test_do_attempt_zero_score_with_all_decoys(self):
        self.assertFalse(self.block.completed)  # precondition check
        expected_score = 0
        self._submit_solution({
            3: self.ZONE_1,
            4: self.ZONE_2,
        })  # incorrect solution, 0 score
        self._do_attempt()
        self.assertEqual(self.block.grade, expected_score)

    def test_do_attempt_correct_takes_decoy_into_account(self):
        self._submit_solution({0: self.ZONE_1, 1: self.ZONE_2, 2: self.ZONE_2, 3: self.ZONE_2})
        res = self._do_attempt()

        self.assertFalse(res['correct'])
