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
    def expected_student_data(cls):
        return json.loads(loader.load_unicode('data/{}/config_out.json'.format(cls.FOLDER)))

    def test_student_view_data(self):
        data = self.block.student_view_data()
        expected = self.expected_student_data()
        expected['block_id'] = data['block_id']  # Block ids aren't stable
        self.assertEqual(data, expected)


@ddt.ddt
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
        self.block.weight = 2
        item_id, zone_id = 0, self.ZONE_2
        data = {"val": item_id, "zone": zone_id}
        res = self.call_handler(self.DROP_ITEM_HANDLER, data)
        item_feedback_message = self._make_item_feedback_message(item_id)
        expected_feedback = [item_feedback_message] if item_feedback_message else []
        # the item was dropped into wrong zone, but we have two items that were correctly left in the bank,
        # so the raw score is 2 / 4.0.
        expected_grade = self.block.weight * 2 / 4.0

        self.assertEqual(res, {
            "overall_feedback": [self._make_feedback_message(message=self.INITIAL_FEEDBACK)],
            "finished": False,
            "correct": False,
            "grade": expected_grade,
            "feedback": expected_feedback
        })

    def test_drop_item_wrong_without_feedback(self):
        self.block.weight = 2
        item_id, zone_id = 2, self.ZONE_1
        data = {"val": item_id, "zone": zone_id}
        res = self.call_handler(self.DROP_ITEM_HANDLER, data)
        item_feedback_message = self._make_item_feedback_message(item_id)
        expected_feedback = [item_feedback_message] if item_feedback_message else []
        # the item was dropped into wrong zone, but we have two items that were correctly left in the bank,
        # so the raw score is 2 / 4.0.
        expected_grade = self.block.weight * 2 / 4.0

        self.assertEqual(res, {
            "overall_feedback": [self._make_feedback_message(message=self.INITIAL_FEEDBACK)],
            "finished": False,
            "correct": False,
            "grade": expected_grade,
            "feedback": expected_feedback
        })

    def test_drop_item_correct(self):
        self.block.weight = 2
        item_id, zone_id = 0, self.ZONE_1
        data = {"val": item_id, "zone": zone_id}
        res = self.call_handler(self.DROP_ITEM_HANDLER, data)
        item_feedback_message = self._make_item_feedback_message(item_id, key="correct")
        expected_feedback = [item_feedback_message] if item_feedback_message else []
        # Item 0 is in correct zone, items 2 and 3 don't belong to any zone so it is correct to leave them in the bank.
        # The only item that is not in correct position yet is item 1. The grade is therefore 3/4. The weight of the
        # problem means that the displayed grade will be 1.5.
        expected_grade = self.block.weight * 3 / 4.0

        self.assertEqual(res, {
            "overall_feedback": [self._make_feedback_message(message=self.INITIAL_FEEDBACK)],
            "finished": False,
            "correct": True,
            "grade": expected_grade,
            "feedback": expected_feedback
        })

    @ddt.data(*[random.randint(1, 50) for _ in xrange(5)])  # pylint: disable=star-args
    def test_grading(self, weight):
        self.block.weight = weight

        published_grades = []

        def mock_publish(_, event, params):
            if event == 'grade':
                published_grades.append(params)
        self.block.runtime.publish = mock_publish

        # Before the user starts working on the problem, grade should equal zero.
        self.assertEqual(0, self.block.raw_earned)

        # Drag the first item into the correct zone.
        self.call_handler(self.DROP_ITEM_HANDLER, {"val": 0, "zone": self.ZONE_1})

        self.assertEqual(1, len(published_grades))
        # The DnD test block has four items defined in the data fixtures:
        # 1 item that belongs to ZONE_1, 1 item that belongs to ZONE_2, and two decoy items.
        # After we drop the first item into ZONE_1, 3 out of 4 items are already in correct positions
        # (1st item in ZONE_1 and two decoy items left in the bank). The grade at this point is therefore 3/4 * weight.
        self.assertEqual(0.75, self.block.raw_earned)
        self.assertEqual(0.75 * self.block.weight, self.block.weighted_grade())
        self.assertEqual({'value': 0.75, 'max_value': 1, 'only_if_higher': None}, published_grades[-1])

        # Drag the second item into correct zone.
        self.call_handler(self.DROP_ITEM_HANDLER, {"val": 1, "zone": self.ZONE_2})

        self.assertEqual(2, len(published_grades))
        # All items are now placed in the right place, the user therefore gets the full grade.
        self.assertEqual(1, self.block.raw_earned)
        self.assertEqual({'value': 1, 'max_value': 1, 'only_if_higher': None}, published_grades[-1])

    @ddt.data(True, False)
    def test_grading_deprecation(self, grade_below_one):
        self.assertFalse(self.block.has_submitted_answer())
        if grade_below_one:
            self.block.weight = 1.2
            self.block.grade = 0.96
        else:
            self.block.weight = 50
            self.block.grade = 40

        published_grades = []
        # for rescoring purposes has_submitted_answer should be true even if the block
        # only has a deprecated weighted grade
        self.assertTrue(self.block.has_submitted_answer())
        self.assertIsNone(self.block._get_raw_earned_if_set())  # pylint: disable=protected-access

        def mock_publish(_, event, params):
            if event == 'grade':
                published_grades.append(params)
        self.block.runtime.publish = mock_publish

        # Drag the first item into the correct zone.
        self.call_handler(self.DROP_ITEM_HANDLER, {"val": 0, "zone": self.ZONE_1})

        # The grade should be overridden even though self.grade will go down, since the block is at version 0
        self.assertEqual(1, len(published_grades))
        self.assertEqual(0.75, self.block.raw_earned)
        self.assertEqual({'value': 0.75, 'max_value': 1, 'only_if_higher': None}, published_grades[-1])

        # Drag the first item into the incorrect zone.
        self.call_handler(self.DROP_ITEM_HANDLER, {"val": 0, "zone": self.ZONE_2})

        # The grade should not be updated now that the block has a raw value in self.grade
        self.assertEqual(1, len(published_grades))
        self.assertEqual(0.75, self.block.raw_earned)

        # Drag the first item back into the correct zone.
        self.call_handler(self.DROP_ITEM_HANDLER, {"val": 0, "zone": self.ZONE_1})

        # The grade should not be updated because user has already achieved a 0.75 raw score
        self.assertEqual(1, len(published_grades))
        self.assertEqual(0.75, self.block.raw_earned)

        # Drag the second item into correct zone.
        self.call_handler(self.DROP_ITEM_HANDLER, {"val": 1, "zone": self.ZONE_2})

        self.assertEqual(2, len(published_grades))
        # All items are now placed in the right place, the user therefore gets the full grade.
        self.assertEqual(1, self.block.raw_earned)
        self.assertEqual({'value': 1, 'max_value': 1, 'only_if_higher': None}, published_grades[-1])

    def test_drop_item_final(self):
        self.block.weight = 2
        data = {"val": 0, "zone": self.ZONE_1}
        self.call_handler(self.DROP_ITEM_HANDLER, data)

        # Item 0 is in correct zone, items 2 and 3 don't belong to any zone so it is correct to leave them in the bank.
        # The only item that is not in correct position yet is item 1. The raw grade is therefore 3/4.
        expected_grade = self.block.weight * 3 / 4.0
        expected_state = {
            "items": {
                "0": {"correct": True, "zone": self.ZONE_1}
            },
            "finished": False,
            "attempts": 0,
            "grade": expected_grade,
            'overall_feedback': [self._make_feedback_message(message=self.INITIAL_FEEDBACK)],
        }
        self.assertEqual(expected_state, self.call_handler('student_view_user_state', method="GET"))

        res = self.call_handler(self.DROP_ITEM_HANDLER, {"val": 1, "zone": self.ZONE_2})
        # All four items are in correct position, so the final raw grade is 4/4.
        expected_grade = self.block.weight * 4 / 4.0
        self.assertEqual(res, {
            "overall_feedback": [self._make_feedback_message(message=self.FINAL_FEEDBACK)],
            "finished": True,
            "correct": True,
            "grade": expected_grade,
            "feedback": [self._make_feedback_message(self.FEEDBACK[1]["correct"])]
        })

        expected_state = {
            "items": {
                "0": {"correct": True, "zone": self.ZONE_1},
                "1": {"correct": True, "zone": self.ZONE_2}
            },
            "finished": True,
            "attempts": 0,
            "grade": expected_grade,
            'overall_feedback': [self._make_feedback_message(self.FINAL_FEEDBACK)],
        }
        self.assertEqual(expected_state, self.call_handler('student_view_user_state', method="GET"))

    def test_do_attempt_not_available(self):
        """
        Tests that do_attempt handler returns 400 error for standard mode DnDv2
        """
        res = self.call_handler(self.DO_ATTEMPT_HANDLER, expect_json=False)

        self.assertEqual(res.status_code, 400)

    def test_show_answer_not_available(self):
        """
        Tests that do_attempt handler returns 400 error for standard mode DnDv2
        """
        res = self.call_handler(self.SHOW_ANSWER_HANDLER, expect_json=False)

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

    def _get_all_solutions(self):  # pylint: disable=no-self-use
        raise NotImplementedError()

    def _get_all_decoys(self):  # pylint: disable=no-self-use
        raise NotImplementedError()

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

        expected_overall_feedback = [
            self._make_feedback_message(message=self.INITIAL_FEEDBACK),
            self._make_feedback_message(
                FeedbackMessages.GRADE_FEEDBACK_TPL.format(score=self.block.raw_earned),
                FeedbackMessages.MessageClasses.PARTIAL_SOLUTION
            )
        ]
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

    @ddt.data(
        (True, 409, True),
        (False, 200, False),
    )
    @ddt.unpack
    @mock.patch('drag_and_drop_v2.DragAndDropBlock.has_submission_deadline_passed', new_callable=mock.PropertyMock)
    def test_do_attempt_has_deadline_passed(self, is_past_deadline, status_code, expect_error, mock_deadline_passed):
        """
        Scenario: If the submission is past its deadline date, the attempt is not possible and
        409 Conflict error is thrown.
        """
        mock_deadline_passed.return_value = is_past_deadline
        response = self.call_handler(self.DO_ATTEMPT_HANDLER, data={}, expect_json=False)
        self.assertEqual(response.status_code, status_code)
        if expect_error:
            self.assertIn("Submission deadline has passed.", response.body)

    @ddt.data(*[random.randint(1, 50) for _ in xrange(5)])  # pylint: disable=star-args
    def test_do_attempt_correct_mark_complete_and_publish_grade(self, weight):
        self.block.weight = weight

        self._submit_complete_solution()

        with mock.patch('workbench.runtime.WorkbenchRuntime.publish', mock.Mock()) as patched_publish:
            res = self.call_handler(self.DO_ATTEMPT_HANDLER, data={})

            self.assertTrue(self.block.completed)
            self.assertTrue(res['correct'])
            self.assertEqual(res['grade'], self.block.weight)

            expected_calls = [
                mock.call(self.block, 'grade', {
                    'value': 1,
                    'max_value': 1,
                    'only_if_higher': None,
                }),
                mock.call(self.block, 'progress', {})
            ]
            self.assertEqual(patched_publish.mock_calls, expected_calls)

    @ddt.data(*[random.randint(1, 50) for _ in xrange(5)])  # pylint: disable=star-args
    def test_do_attempt_incorrect_publish_grade(self, weight):
        self.block.weight = weight

        correctness = self._submit_partial_solution()

        with mock.patch('workbench.runtime.WorkbenchRuntime.publish', mock.Mock()) as patched_publish:
            res = self.call_handler(self.DO_ATTEMPT_HANDLER, data={})

            self.assertFalse(self.block.completed)
            self.assertFalse(res['correct'])
            self.assertEqual(res['grade'], correctness * self.block.weight)

            expected_calls = [
                mock.call(self.block, 'grade', {
                    'value': correctness,
                    'max_value': 1,
                    'only_if_higher': None,
                }),
                mock.call(self.block, 'progress', {})
            ]
            self.assertEqual(patched_publish.mock_calls, expected_calls)

    @ddt.data(*[random.randint(1, 50) for _ in xrange(5)])  # pylint: disable=star-args
    def test_do_attempt_post_correct_no_publish_grade(self, weight):
        self.block.weight = weight

        self._submit_complete_solution()
        self.call_handler(self.DO_ATTEMPT_HANDLER, data={})  # sets self.complete
        self._reset_problem()

        with mock.patch('workbench.runtime.WorkbenchRuntime.publish', mock.Mock()) as patched_publish:
            self.call_handler(self.DO_ATTEMPT_HANDLER, data={})

            self.assertTrue(self.block.completed)
            self.assertEqual(self.block.raw_earned, 1)
            self.assertEqual(patched_publish.mock_calls, [mock.call(self.block, 'progress', {})])

    def test_get_user_state_finished_after_final_attempt(self):
        self._set_final_attempt()
        self._submit_partial_solution()
        self._do_attempt()

        self.assertFalse(self.block.attempts_remain)  # precondition check

        res = self.call_handler(self.USER_STATE_HANDLER, data={})
        self.assertTrue(res['finished'])

    @ddt.data(*[random.randint(1, 50) for _ in xrange(5)])  # pylint: disable=star-args
    def test_do_attempt_incorrect_final_attempt_publish_grade(self, weight):
        self.block.weight = weight

        self._set_final_attempt()

        expected_raw_grade = self._submit_partial_solution()
        expected_weighted_grade = expected_raw_grade * self.block.weight

        with mock.patch('workbench.runtime.WorkbenchRuntime.publish', mock.Mock()) as patched_publish:
            res = self.call_handler(self.DO_ATTEMPT_HANDLER, data={})

            self.assertTrue(self.block.completed)

            expected_grade_feedback = self._make_feedback_message(
                FeedbackMessages.FINAL_ATTEMPT_TPL.format(score=expected_weighted_grade),
                FeedbackMessages.MessageClasses.PARTIAL_SOLUTION
            )
            self.assertIn(expected_grade_feedback, res[self.OVERALL_FEEDBACK_KEY])
            self.assertEqual(res['grade'], expected_weighted_grade)

            expected_calls = [
                mock.call(self.block, 'grade', {
                    'value': expected_raw_grade,
                    'max_value': 1,
                    'only_if_higher': None,
                }),
                mock.call(self.block, 'progress', {})
            ]
            self.assertEqual(patched_publish.mock_calls, expected_calls)

    @ddt.data(*[random.randint(1, 50) for _ in xrange(5)])  # pylint: disable=star-args
    def test_do_attempt_incorrect_final_attempt_after_correct(self, weight):
        self.block.weight = weight

        self._submit_complete_solution()
        self.call_handler(self.DO_ATTEMPT_HANDLER, data={})

        self.assertTrue(self.block.completed)  # precondition check
        self.assertEqual(self.block.raw_earned, 1)  # precondition check

        self._reset_problem()

        self._set_final_attempt()

        self._submit_partial_solution()

        with mock.patch('workbench.runtime.WorkbenchRuntime.publish', mock.Mock()) as patched_publish:
            res = self.call_handler(self.DO_ATTEMPT_HANDLER, data={})

            expected_grade_feedback = self._make_feedback_message(
                FeedbackMessages.FINAL_ATTEMPT_TPL.format(score=float(weight)),
                FeedbackMessages.MessageClasses.PARTIAL_SOLUTION
            )
            self.assertIn(expected_grade_feedback, res[self.OVERALL_FEEDBACK_KEY])
            self.assertEqual(self.block.raw_earned, 1)
            self.assertEqual(patched_publish.mock_calls, [mock.call(self.block, 'progress', {})])

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

    def test_do_attempt_does_not_delete_misplaced_items_at_last_attempt(self):
        """
        Upon submitting the final attempt, test that misplaced items are not
        deleted from the item state.
        """
        self._set_final_attempt()
        misplaced_ids = self._submit_incorrect_solution()

        self.call_handler(self.DO_ATTEMPT_HANDLER, data={})

        self.assertFalse(self.block.attempts_remain)  # precondition check

        for i in misplaced_ids:
            self.assertIn(str(i), self.block.item_state.keys())

    def test_get_user_state_does_not_include_correctness(self):
        self._submit_complete_solution()
        original_item_state = self.block.item_state

        res = self.call_handler(self.USER_STATE_HANDLER)

        item_data = res['items']
        for item in item_data:
            self.assertNotIn('correct', item)

        self.assertEqual(self.block.item_state, original_item_state)

    @ddt.data(
        (None, 10, True),
        (0, 12, True),
        (3, 3, False),
    )
    @ddt.unpack
    def test_show_answer_validation(self, max_attempts, attempts, expect_validation_error):
        """
        Test that show_answer returns a 409 when max_attempts = None, or when
        there are still attempts remaining.
        """
        self.block.max_attempts = max_attempts
        self.block.attempts = attempts
        res = self.call_handler(self.SHOW_ANSWER_HANDLER, data={}, expect_json=False)

        if expect_validation_error:
            self.assertEqual(res.status_code, 409)
        else:
            self.assertEqual(res.status_code, 200)

    def test_get_correct_state(self):
        """
        Test that _get_correct_state returns one of the possible correct
        solutions for the configuration.
        """
        self._set_final_attempt()
        self._submit_incorrect_solution()
        self.call_handler(self.DO_ATTEMPT_HANDLER, data={})

        self.assertFalse(self.block.attempts_remain)  # precondition check

        res = self.call_handler(self.SHOW_ANSWER_HANDLER, data={})

        self.assertIn('items', res)

        decoys = self._get_all_decoys()
        solution = {}
        for item_id, item_state in res['items'].iteritems():
            self.assertIn('correct', item_state)
            self.assertIn('zone', item_state)
            self.assertNotIn(int(item_id), decoys)
            solution[int(item_id)] = item_state['zone']

        self.assertIn(solution, self._get_all_solutions())


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

    def _get_all_solutions(self):
        return [{0: self.ZONE_1, 1: self.ZONE_2, 2: self.ZONE_2}]

    def _get_all_decoys(self):
        return [3, 4]

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
                FeedbackMessages.correctly_placed(1),
                FeedbackMessages.MessageClasses.CORRECTLY_PLACED
            ),
            self._make_feedback_message(
                FeedbackMessages.misplaced_returned(1),
                FeedbackMessages.MessageClasses.MISPLACED
            ),
            self._make_feedback_message(
                FeedbackMessages.not_placed(1),
                FeedbackMessages.MessageClasses.NOT_PLACED
            ),
            self._make_feedback_message(
                self.INITIAL_FEEDBACK,
                None
            ),
            self._make_feedback_message(
                FeedbackMessages.GRADE_FEEDBACK_TPL.format(score=self.block.weighted_grade()),
                FeedbackMessages.MessageClasses.PARTIAL_SOLUTION
            ),
        ]

        self._assert_item_and_overall_feedback(res, expected_item_feedback, expected_overall_feedback)

    def test_do_attempt_shows_correct_misplaced_feedback_at_last_attempt(self):
        self._set_final_attempt()
        self._submit_solution({0: self.ZONE_2})
        res = self._do_attempt()
        misplaced_message = self._make_feedback_message(
            FeedbackMessages.misplaced(1),
            FeedbackMessages.MessageClasses.MISPLACED
        )
        self.assertIn(misplaced_message, res[self.OVERALL_FEEDBACK_KEY])

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
            self._make_feedback_message(
                FeedbackMessages.GRADE_FEEDBACK_TPL.format(score=self.block.weighted_grade()),
                FeedbackMessages.MessageClasses.PARTIAL_SOLUTION
            )
        ]

        self._assert_item_and_overall_feedback(res, expected_item_feedback, expected_overall_feedback)

    def test_do_attempt_feedback_correct_and_decoy(self):
        self._submit_solution({0: self.ZONE_1, 1: self.ZONE_2, 3: self.ZONE_2})  # incorrect solution - decoy placed
        res = self._do_attempt()

        expected_item_feedback = []
        expected_overall_feedback = [
            self._make_feedback_message(
                FeedbackMessages.correctly_placed(2),
                FeedbackMessages.MessageClasses.CORRECTLY_PLACED
            ),
            self._make_feedback_message(
                FeedbackMessages.misplaced_returned(1),
                FeedbackMessages.MessageClasses.MISPLACED
            ),
            self._make_feedback_message(
                FeedbackMessages.not_placed(1),
                FeedbackMessages.MessageClasses.NOT_PLACED
            ),
            self._make_feedback_message(
                self.INITIAL_FEEDBACK,
                None
            ),
            self._make_feedback_message(
                FeedbackMessages.GRADE_FEEDBACK_TPL.format(score=self.block.weighted_grade()),
                FeedbackMessages.MessageClasses.PARTIAL_SOLUTION
            ),
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
            self._make_feedback_message(
                FeedbackMessages.GRADE_FEEDBACK_TPL.format(score=self.block.weighted_grade()),
                FeedbackMessages.MessageClasses.CORRECT_SOLUTION
            ),
        ]

        self._assert_item_and_overall_feedback(res, expected_item_feedback, expected_overall_feedback)

    def test_do_attempt_no_grade_feedback_with_zero_weight(self):
        self.block.weight = 0
        self.block.save()

        self._submit_solution({0: self.ZONE_1})  # partial solution
        self._do_attempt()

        self._submit_solution({0: self.ZONE_1, 1: self.ZONE_2, 2: self.ZONE_2})  # correct solution
        res = self._do_attempt()

        expected_item_feedback = []
        expected_overall_feedback = [
            self._make_feedback_message(
                FeedbackMessages.correctly_placed(3), FeedbackMessages.MessageClasses.CORRECTLY_PLACED
            ),
            self._make_feedback_message(self.FINAL_FEEDBACK, FeedbackMessages.MessageClasses.CORRECT_SOLUTION)
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
            self._make_feedback_message(
                FeedbackMessages.GRADE_FEEDBACK_TPL.format(score=self.block.weighted_grade()),
                FeedbackMessages.MessageClasses.PARTIAL_SOLUTION
            ),
        ]

        self._assert_item_and_overall_feedback(res, expected_item_feedback, expected_overall_feedback)

    def test_do_attempt_keeps_highest_score(self):
        self.assertFalse(self.block.completed)  # precondition check
        expected_score = 4.0 / 5.0

        self._submit_solution({0: self.ZONE_1, 1: self.ZONE_2})  # partial solution, 0.8 score
        self._do_attempt()
        self.assertEqual(self.block.raw_earned, expected_score)

        self._reset_problem()
        # make it a last attempt so we can check feedback
        self._set_final_attempt()

        self._submit_solution({0: self.ZONE_1})  # partial solution, 0.6 score
        res = self._do_attempt()
        self.assertEqual(self.block.raw_earned, expected_score)

        expected_feedback = self._make_feedback_message(
            FeedbackMessages.FINAL_ATTEMPT_TPL.format(score=expected_score * self.block.weight),
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
        self.assertEqual(self.block.raw_earned, expected_score)

    def test_move_item_back_to_bank(self):
        self.assertFalse(self.block.completed)  # precondition check
        expected_score = 3.0 / 5.0
        self._submit_solution({
            0: self.ZONE_1,
            1: self.ZONE_2,
            2: self.ZONE_2,
            3: self.ZONE_1,
        })  # would get a 0.8 score
        self._submit_solution({
            0: None,
            1: self.ZONE_2,
            2: self.ZONE_2,
            3: self.ZONE_1,
        })  # will get a 0.6 score
        self._do_attempt()
        self.assertEqual(self.block.raw_earned, expected_score)

    def test_do_attempt_zero_score_with_all_decoys(self):
        published_grades = []

        def mock_publish(_, event, params):
            if event == 'grade':
                published_grades.append(params)
        self.block.runtime.publish = mock_publish

        self.assertFalse(self.block.completed)  # precondition check
        self._submit_solution({
            3: self.ZONE_1,
            4: self.ZONE_2,
        })  # incorrect solution, 0 score
        res = self._do_attempt()

        self.assertEqual(res['grade'], 0)
        self.assertEqual(self.block.raw_earned, 0)
        self.assertEqual(1, len(published_grades))
        self.assertEqual({'value': 0, 'max_value': 1, 'only_if_higher': None}, published_grades[-1])

        user_state = self.call_handler('student_view_user_state', method="GET")
        self.assertEqual(user_state['grade'], 0)

    def test_do_attempt_correct_takes_decoy_into_account(self):
        self._submit_solution({0: self.ZONE_1, 1: self.ZONE_2, 2: self.ZONE_2, 3: self.ZONE_2})
        res = self._do_attempt()

        self.assertFalse(res['correct'])
