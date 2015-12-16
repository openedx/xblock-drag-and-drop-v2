import json
import unittest

from ..utils import (
    make_block,
    load_resource,
    TestCaseMixin,
)


class BaseDragAndDropAjaxFixture(TestCaseMixin):
    ZONE_1 = None
    ZONE_2 = None

    FEEDBACK = {
        0: {"correct": None, "incorrect": None},
        1: {"correct": None, "incorrect": None},
        2: {"correct": None, "incorrect": None}
    }

    FINAL_FEEDBACK = None

    FOLDER = None

    def setUp(self):
        self.patch_workbench()
        self.block = make_block()
        initial_settings = self.initial_settings()
        for field in initial_settings:
            setattr(self.block, field, initial_settings[field])
        self.block.data = self.initial_data()

    @classmethod
    def initial_data(cls):
        return json.loads(load_resource('unit/data/{}/data.json'.format(cls.FOLDER)))

    @classmethod
    def initial_settings(cls):
        return json.loads(load_resource('unit/data/{}/settings.json'.format(cls.FOLDER)))

    @classmethod
    def expected_configuration(cls):
        return json.loads(load_resource('unit/data/{}/config_out.json'.format(cls.FOLDER)))

    @classmethod
    def initial_feedback(cls):
        """ The initial overall_feedback value """
        return cls.expected_configuration()["initial_feedback"]

    def test_get_configuration(self):
        self.assertEqual(self.expected_configuration(), self.block.get_configuration())

    def test_do_attempt_wrong_with_feedback(self):
        item_id, zone_id = 0, self.ZONE_2
        data = {"val": item_id, "zone": zone_id, "x_percent": "33%", "y_percent": "11%"}
        res = self.call_handler('do_attempt', data)
        self.assertEqual(res, {
            "overall_feedback": None,
            "finished": False,
            "correct": False,
            "correct_location": False,
            "feedback": self.FEEDBACK[item_id]["incorrect"]
        })

    def test_do_attempt_wrong_without_feedback(self):
        item_id, zone_id = 2, self.ZONE_1
        data = {"val": item_id, "zone": zone_id, "x_percent": "33%", "y_percent": "11%"}
        res = self.call_handler('do_attempt', data)
        self.assertEqual(res, {
            "overall_feedback": None,
            "finished": False,
            "correct": False,
            "correct_location": False,
            "feedback": self.FEEDBACK[item_id]["incorrect"]
        })

    def test_do_attempt_correct(self):
        item_id, zone_id = 0, self.ZONE_1
        data = {"val": item_id, "zone": zone_id, "x_percent": "33%", "y_percent": "11%"}
        res = self.call_handler('do_attempt', data)
        self.assertEqual(res, {
            "overall_feedback": None,
            "finished": False,
            "correct": True,
            "correct_location": True,
            "feedback": self.FEEDBACK[item_id]["correct"]
        })

    def test_do_attempt_with_input(self):
        data = {"val": 1, "zone": self.ZONE_2, "x_percent": "0%", "y_percent": "85%"}
        res = self.call_handler('do_attempt', data)
        self.assertEqual(res, {
            "finished": False,
            "correct": False,
            "correct_location": True,
            "feedback": None,
            "overall_feedback": None,
        })

        expected_state = {
            'items': {
                "1": {"x_percent": "0%", "y_percent": "85%", "correct_input": False},
            },
            'finished': False,
            'overall_feedback': self.initial_feedback(),
        }
        self.assertEqual(expected_state, self.call_handler('get_user_state', method="GET"))

        data = {"val": 1, "input": "250"}
        res = self.call_handler('do_attempt', data)
        self.assertEqual(res, {
            "finished": False,
            "correct": False,
            "correct_location": True,
            "feedback": self.FEEDBACK[1]['incorrect'],
            "overall_feedback": None
        })

        expected_state = {
            'items': {
                "1": {"x_percent": "0%", "y_percent": "85%", "input": "250", "correct_input": False},
            },
            'finished': False,
            'overall_feedback': self.initial_feedback(),
        }
        self.assertEqual(expected_state, self.call_handler('get_user_state', method="GET"))

        data = {"val": 1, "input": "103"}
        res = self.call_handler('do_attempt', data)
        self.assertEqual(res, {
            "finished": False,
            "correct": True,
            "correct_location": True,
            "feedback": self.FEEDBACK[1]['correct'],
            "overall_feedback": None,
        })

        expected_state = {
            'items': {
                "1": {"x_percent": "0%", "y_percent": "85%", "input": "103", "correct_input": True},
            },
            'finished': False,
            'overall_feedback': self.initial_feedback(),
        }
        self.assertEqual(expected_state, self.call_handler('get_user_state', method="GET"))

    def test_grading(self):
        published_grades = []

        def mock_publish(self, event, params):
            if event == 'grade':
                published_grades.append(params)
        self.block.runtime.publish = mock_publish

        self.call_handler('do_attempt', {
            "val": 0, "zone": self.ZONE_1, "y_percent": "11%", "x_percent": "33%"
        })

        self.assertEqual(1, len(published_grades))
        self.assertEqual({'value': 0.5, 'max_value': 1}, published_grades[-1])

        self.call_handler('do_attempt', {
            "val": 1, "zone": self.ZONE_2, "y_percent": "90%", "x_percent": "42%"
        })

        self.assertEqual(2, len(published_grades))
        self.assertEqual({'value': 0.5, 'max_value': 1}, published_grades[-1])

        self.call_handler('do_attempt', {"val": 1, "input": "99"})

        self.assertEqual(3, len(published_grades))
        self.assertEqual({'value': 1, 'max_value': 1}, published_grades[-1])

    def test_do_attempt_final(self):
        data = {"val": 0, "zone": self.ZONE_1, "x_percent": "33%", "y_percent": "11%"}
        self.call_handler('do_attempt', data)

        expected_state = {
            "items": {
                "0": {"x_percent": "33%", "y_percent": "11%", "correct_input": True}
            },
            "finished": False,
            'overall_feedback': self.initial_feedback(),
        }
        self.assertEqual(expected_state, self.call_handler('get_user_state', method="GET"))

        data = {"val": 1, "zone": self.ZONE_2, "x_percent": "22%", "y_percent": "22%"}
        res = self.call_handler('do_attempt', data)
        data = {"val": 1, "input": "99"}
        res = self.call_handler('do_attempt', data)
        self.assertEqual(res, {
            "overall_feedback": self.FINAL_FEEDBACK,
            "finished": True,
            "correct": True,
            "correct_location": True,
            "feedback": self.FEEDBACK[1]["correct"]
        })

        expected_state = {
            "items": {
                "0": {"x_percent": "33%", "y_percent": "11%", "correct_input": True},
                "1": {"x_percent": "22%", "y_percent": "22%", "input": "99", "correct_input": True}
            },
            "finished": True,
            'overall_feedback': self.FINAL_FEEDBACK,
        }
        self.assertEqual(expected_state, self.call_handler('get_user_state', method="GET"))


class TestDragAndDropHtmlData(BaseDragAndDropAjaxFixture, unittest.TestCase):
    FOLDER = "html"

    ZONE_1 = "Zone <i>1</i>"
    ZONE_2 = "Zone <b>2</b>"

    FEEDBACK = {
        0: {"correct": "Yes <b>1</b>", "incorrect": "No <b>1</b>"},
        1: {"correct": "Yes <i>2</i>", "incorrect": "No <i>2</i>"},
        2: {"correct": "", "incorrect": ""}
    }

    FINAL_FEEDBACK = "Final <strong>feedback</strong>!"


class TestDragAndDropPlainData(BaseDragAndDropAjaxFixture, unittest.TestCase):
    FOLDER = "plain"

    ZONE_1 = "Zone 1"
    ZONE_2 = "Zone 2"

    FEEDBACK = {
        0: {"correct": "Yes 1", "incorrect": "No 1"},
        1: {"correct": "Yes 2", "incorrect": "No 2"},
        2: {"correct": "", "incorrect": ""}
    }

    FINAL_FEEDBACK = "This is the final feedback."


class TestOldDataFormat(TestDragAndDropPlainData):
    """
    Make sure we can work with the slightly-older format for 'data' field values.
    """
    FOLDER = "old"
    FINAL_FEEDBACK = "Final Feed"
