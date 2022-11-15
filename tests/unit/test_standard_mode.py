from __future__ import absolute_import

import random
import unittest

import ddt

from drag_and_drop_v2.utils import FeedbackMessages
from mock import Mock, patch
from tests.unit.test_fixtures import BaseDragAndDropAjaxFixture


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
        expected_overall_feedback = [
            self._make_feedback_message(self.INITIAL_FEEDBACK, FeedbackMessages.MessageClasses.INITIAL_FEEDBACK)
        ]
        self.assertEqual(res[self.OVERALL_FEEDBACK_KEY], expected_overall_feedback)

    def test_user_state_no_item_state(self):
        res = self.call_handler(self.USER_STATE_HANDLER, data={})
        expected_overall_feedback = [
            self._make_feedback_message(self.INITIAL_FEEDBACK, FeedbackMessages.MessageClasses.INITIAL_FEEDBACK)
        ]
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
            "overall_feedback": [
                self._make_feedback_message(self.INITIAL_FEEDBACK, FeedbackMessages.MessageClasses.INITIAL_FEEDBACK)
            ],
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
            "overall_feedback": [
                self._make_feedback_message(self.INITIAL_FEEDBACK, FeedbackMessages.MessageClasses.INITIAL_FEEDBACK)
            ],
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
            "overall_feedback": [
                self._make_feedback_message(self.INITIAL_FEEDBACK, FeedbackMessages.MessageClasses.INITIAL_FEEDBACK)
            ],
            "finished": False,
            "correct": True,
            "grade": expected_grade,
            "feedback": expected_feedback
        })

    @ddt.data(*[random.randint(1, 50) for _ in range(5)])  # pylint: disable=star-args
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

    @patch(
        'drag_and_drop_v2.drag_and_drop_v2.get_grading_ignore_decoys_waffle_flag',
        lambda: Mock(is_enabled=lambda _: True),
    )
    @ddt.data(*[random.randint(1, 50) for _ in range(5)])  # pylint: disable=star-args
    def test_grading_ignore_decoy(self, weight):
        self.block.weight = weight

        published_grades = []

        def mock_publish(_, event, params):
            if event == 'grade':
                published_grades.append(params)
        self.block.runtime.publish = mock_publish

        # Before the user starts working on the problem, grade should equal zero.
        self.assertEqual(0, self.block.raw_earned)

        # Drag the decoy item into one of the zones
        self.call_handler(self.DROP_ITEM_HANDLER, {"val": 2, "zone": self.ZONE_1})

        self.assertEqual(1, len(published_grades))
        # Decoy items are not considered in the grading
        self.assertEqual(0, self.block.raw_earned)
        self.assertEqual(0, self.block.weighted_grade())
        self.assertEqual({'value': 0, 'max_value': 1, 'only_if_higher': None}, published_grades[-1])

        # Drag the first item into the correct zone.
        self.call_handler(self.DROP_ITEM_HANDLER, {"val": 0, "zone": self.ZONE_1})

        self.assertEqual(2, len(published_grades))
        # The DnD test block has four items defined in the data fixtures:
        # 1 item that belongs to ZONE_1, 1 item that belongs to ZONE_2, and two decoy items.
        # After we drop the first item into ZONE_1, 1 out of 2 items are in the expected correct positions.
        # The grade at this point is therefore 1/2 * weight.
        self.assertEqual(0.5, self.block.raw_earned)
        self.assertEqual(0.5 * self.block.weight, self.block.weighted_grade())
        self.assertEqual({'value': 0.5, 'max_value': 1, 'only_if_higher': None}, published_grades[-1])

        # Drag the second item into correct zone.
        self.call_handler(self.DROP_ITEM_HANDLER, {"val": 1, "zone": self.ZONE_2})

        self.assertEqual(3, len(published_grades))
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
            'overall_feedback': [
                self._make_feedback_message(self.INITIAL_FEEDBACK, FeedbackMessages.MessageClasses.INITIAL_FEEDBACK)
            ],
        }
        self.assertEqual(expected_state, self.call_handler('student_view_user_state', method="GET"))

        res = self.call_handler(self.DROP_ITEM_HANDLER, {"val": 1, "zone": self.ZONE_2})
        # All four items are in correct position, so the final raw grade is 4/4.
        expected_grade = self.block.weight * 4 / 4.0
        self.assertEqual(res, {
            "overall_feedback": [
                self._make_feedback_message(self.FINAL_FEEDBACK, FeedbackMessages.MessageClasses.FINAL_FEEDBACK)
            ],
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
            'overall_feedback': [
                self._make_feedback_message(self.FINAL_FEEDBACK, FeedbackMessages.MessageClasses.FINAL_FEEDBACK)
            ],
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
        Tests that show_answer handler returns 400 error for standard mode DnDv2
        """
        res = self.call_handler(self.SHOW_ANSWER_HANDLER, expect_json=False)

        self.assertEqual(res.status_code, 400)


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
