import logging
import json
import unittest

from webob import Request
from mock import Mock

from workbench.runtime import WorkbenchRuntime
from xblock.fields import ScopeIds
from xblock.runtime import KvsFieldData, DictKeyValueStore

from nose.tools import (
    assert_equals, assert_true, assert_false,
    assert_in
)

from tests.utils import load_resource

import drag_and_drop_v2



# Silence too verbose Django logging
logging.disable(logging.DEBUG)


def make_request(body, method='POST'):
    request = Request.blank('/')
    request.method = 'POST'
    request.body = body.encode('utf-8')
    request.method = method
    return request


def make_block():
    block_type = 'drag_and_drop_v2'
    key_store = DictKeyValueStore()
    field_data = KvsFieldData(key_store)
    runtime = WorkbenchRuntime()
    def_id = runtime.id_generator.create_definition(block_type)
    usage_id = runtime.id_generator.create_usage(def_id)
    scope_ids = ScopeIds('user', block_type, def_id, usage_id)
    return drag_and_drop_v2.DragAndDropBlock(runtime, field_data, scope_ids=scope_ids)


def test_templates_contents():
    block = make_block()

    block.display_name = "Test Drag & Drop"
    block.question_text = "Question Drag & Drop"
    block.weight = 5

    student_fragment = block.runtime.render(block, 'student_view', ['ingore'])# block.render('student_view', Mock())
    assert_in('<section class="xblock--drag-and-drop">',
        student_fragment.content)

def test_studio_submit():
    block = make_block()

    body = json.dumps({
        'display_name': "Test Drag & Drop",
        'question_text': "Question Drag & Drop",
        'weight': '5',
        'data': {
            'foo': 1
        }
    })
    res = block.handle('studio_submit', make_request(body))

    assert_equals(json.loads(res.body), {'result': 'success'})

    assert_equals(block.display_name, "Test Drag & Drop")
    assert_equals(block.question_text, "Question Drag & Drop")
    assert_equals(block.weight, 5)
    assert_equals(block.data, {'foo': 1})


class BaseDragAndDropAjaxFixture(object):
    _oldMaxDiff = None

    ZONE_1 = None
    ZONE_2 = None

    FEEDBACK = {
        0: {"correct": None, "incorrect": None},
        1: {"correct": None, "incorrect": None},
        2: {"correct": None, "incorrect": None}
    }

    FINAL_FEEDBACK = None

    def __init__(self, *args, **kwargs):
        self._initial_data = None
        self._block = None
        super(BaseDragAndDropAjaxFixture, self).__init__(*args, **kwargs)

    @classmethod
    def setUpClass(cls):
        cls._oldMaxDiff = assert_equals.__self__.maxDiff
        assert_equals.__self__.maxDiff = None

    @classmethod
    def tearDownClass(cls):
        assert_equals.__self__.maxDiff = cls._oldMaxDiff

    def setUp(self):
        self._block = make_block()
        self._initial_data = self.initial_data()
        self._block.data = self._initial_data

    def tearDown(self):
        self._block = None

    def initial_data(self):
        raise NotImplementedError

    def get_data_response(self):
        raise NotImplementedError

    def test_get_data_returns_expected_data(self):
        expected_response = self.get_data_response()
        get_data_response = json.loads(self._block.handle('get_data', Mock()).body)
        assert_equals(expected_response, get_data_response)

    def test_do_attempt_wrong_with_feedback(self):
        item_id, zone_id = 0, self.ZONE_2
        data = json.dumps({"val": item_id, "zone": zone_id, "top": "31px", "left": "216px"})
        res = json.loads(self._block.handle('do_attempt', make_request(data)).body)
        assert_equals(res, {
            "final_feedback": None,
            "finished": False,
            "correct": False,
            "correct_location": False,
            "feedback": self.FEEDBACK[item_id]["incorrect"]
        })

    def test_do_attempt_wrong_without_feedback(self):
        item_id, zone_id = 2, self.ZONE_1
        data = json.dumps({"val": item_id, "zone": zone_id, "top": "42px", "left": "100px"})
        res = json.loads(self._block.handle('do_attempt', make_request(data)).body)
        assert_equals(res, {
            "final_feedback": None,
            "finished": False,
            "correct": False,
            "correct_location": False,
            "feedback": self.FEEDBACK[item_id]["incorrect"]
        })

    def test_do_attempt_correct(self):
        item_id, zone_id = 0, self.ZONE_1
        data = json.dumps({"val": item_id, "zone": zone_id, "top": "11px", "left": "111px"})
        res = json.loads(self._block.handle('do_attempt', make_request(data)).body)
        assert_equals(res, {
            "final_feedback": None,
            "finished": False,
            "correct": True,
            "correct_location": True,
            "feedback": self.FEEDBACK[item_id]["correct"]
        })

    def test_do_attempt_with_input(self):
        data = json.dumps({"val": 1, "zone": self.ZONE_2, "top": "22px", "left": "222px"})
        res = json.loads(self._block.handle('do_attempt', make_request(data)).body)
        assert_equals(res, {
            "finished": False,
            "correct": False,
            "correct_location": True,
            "feedback": None,
            "final_feedback": None
        })

        expected = self.get_data_response()
        expected["state"] = {
            "items": {
                "1": {"top": "22px", "left": "222px", "absolute": True, "correct_input": False}
            },
            "finished": False
        }
        get_data = json.loads(self._block.handle('get_data', Mock()).body)
        assert_equals(expected, get_data)

        data = json.dumps({"val": 1, "input": "250"})
        res = json.loads(self._block.handle('do_attempt', make_request(data)).body)
        assert_equals(res, {
            "finished": False,
            "correct": False,
            "correct_location": True,
            "feedback": self.FEEDBACK[1]['incorrect'],
            "final_feedback": None
        })

        expected = self.get_data_response()
        expected["state"] = {
            "items": {
                "1": {"top": "22px", "left": "222px", "absolute": True,
                      "input": "250", "correct_input": False}
            },
            "finished": False
        }
        get_data = json.loads(self._block.handle('get_data', Mock()).body)
        assert_equals(expected, get_data)

        data = json.dumps({"val": 1, "input": "103"})
        res = json.loads(self._block.handle('do_attempt', make_request(data)).body)
        assert_equals(res, {
            "finished": False,
            "correct": True,
            "correct_location": True,
            "feedback": self.FEEDBACK[1]['correct'],
            "final_feedback": None
        })

        expected = self.get_data_response()
        expected["state"] = {
            "items": {
                "1": {"top": "22px", "left": "222px", "absolute": True,
                      "input": "103", "correct_input": True}
            },
            "finished": False
        }
        get_data = json.loads(self._block.handle('get_data', Mock()).body)
        assert_equals(expected, get_data)

    def test_grading(self):
        published_grades = []
        def mock_publish(self, event, params):
            if event == 'grade':
                published_grades.append(params)
        self._block.runtime.publish = mock_publish

        data = json.dumps({"val": 0, "zone": self.ZONE_1, "top": "11px", "left": "111px"})
        self._block.handle('do_attempt', make_request(data))

        assert_equals(1, len(published_grades))
        assert_equals({'value': 0.5, 'max_value': 1}, published_grades[-1])

        data = json.dumps({"val": 1, "zone": self.ZONE_2, "top": "22px", "left": "222px"})
        json.loads(self._block.handle('do_attempt', make_request(data)).body)

        assert_equals(2, len(published_grades))
        assert_equals({'value': 0.5, 'max_value': 1}, published_grades[-1])

        data = json.dumps({"val": 1, "input": "99"})
        json.loads(self._block.handle('do_attempt', make_request(data)).body)

        assert_equals(3, len(published_grades))
        assert_equals({'value': 1, 'max_value': 1}, published_grades[-1])

    def test_do_attempt_final(self):
        data = json.dumps({"val": 0, "zone": self.ZONE_1, "top": "11px", "left": "111px"})
        self._block.handle('do_attempt', make_request(data))

        expected = self.get_data_response()
        expected["state"] = {
            "items": {
                "0": {"top": "11px", "left": "111px", "absolute": True,
                      "correct_input": True}
            },
            "finished": False
        }
        get_data = json.loads(self._block.handle('get_data', Mock()).body)
        assert_equals(expected, get_data)

        data = json.dumps({"val": 1, "zone": self.ZONE_2, "top": "22px", "left": "222px"})
        res = json.loads(self._block.handle('do_attempt', make_request(data)).body)
        data = json.dumps({"val": 1, "input": "99"})
        res = json.loads(self._block.handle('do_attempt', make_request(data)).body)
        assert_equals(res, {
            "final_feedback": self.FINAL_FEEDBACK,
            "finished": True,
            "correct": True,
            "correct_location": True,
            "feedback": self.FEEDBACK[1]["correct"]
        })

        expected = self.get_data_response()
        expected["state"] = {
            "items": {
                "0": {"top": "11px", "left": "111px", "absolute": True, "correct_input": True},
                "1": {"top": "22px", "left": "222px", "absolute": True, "input": "99",
                      "correct_input": True}
            },
            "finished": True
        }
        expected["feedback"]["finish"] = self.FINAL_FEEDBACK
        get_data = json.loads(self._block.handle('get_data', Mock()).body)
        assert_equals(expected, get_data)


class TestDragAndDropHtmlData(BaseDragAndDropAjaxFixture, unittest.TestCase):
    ZONE_1 = "Zone <i>1</i>"
    ZONE_2 = "Zone <b>2</b>"

    FEEDBACK = {
        0: {"correct": "Yes <b>1</b>", "incorrect": "No <b>1</b>"},
        1: {"correct": "Yes <i>2</i>", "incorrect": "No <i>2</i>"},
        2: {"correct": "", "incorrect": ""}
    }

    FINAL_FEEDBACK = "Final <b>Feed</b>"

    def initial_data(self):
        return json.loads(load_resource('data/test_html_data.json'))

    def get_data_response(self):
        return json.loads(load_resource('data/test_get_html_data.json'))


class TestDragAndDropPlainData(BaseDragAndDropAjaxFixture, unittest.TestCase):
    ZONE_1 = "Zone 1"
    ZONE_2 = "Zone 2"

    FEEDBACK = {
        0: {"correct": "Yes 1", "incorrect": "No 1"},
        1: {"correct": "Yes 2", "incorrect": "No 2"},
        2: {"correct": "", "incorrect": ""}
    }

    FINAL_FEEDBACK = "Final Feed"

    def initial_data(self):
        return json.loads(load_resource('data/test_data.json'))

    def get_data_response(self):
        return json.loads(load_resource('data/test_get_data.json'))

def test_ajax_solve_and_reset():
    block = make_block()

    assert_false(block.completed)
    assert_equals(block.item_state, {})

    data = json.dumps({"val":0,"zone":"Zone 1","top":"11px","left":"111px"})
    block.handle('do_attempt', make_request(data))
    data = json.dumps({"val":1,"zone":"Zone 2","top":"22px","left":"222px"})
    block.handle('do_attempt', make_request(data))

    assert_true(block.completed)
    assert_equals(block.item_state, {'0': {"top": "11px", "left": "111px", "absolute": True},
                                     '1': {"top": "22px", "left": "222px", "absolute": True}})

    block.handle('reset', make_request("{}"))

    assert_true(block.completed)
    assert_equals(block.item_state, {})
