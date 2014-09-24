import logging
import json
import unittest

from webob import Request
from mock import Mock

from workbench.runtime import WorkbenchRuntime
from xblock.runtime import KvsFieldData, DictKeyValueStore

from nose.tools import (
    assert_equals, assert_true, assert_false,
    assert_in
)

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
    runtime = WorkbenchRuntime()
    key_store = DictKeyValueStore()
    db_model = KvsFieldData(key_store)
    return drag_and_drop_v2.DragAndDropBlock(runtime, db_model, Mock())


def test_templates_contents():
    block = make_block()

    block.display_name = "Test Drag & Drop"
    block.question_text = "Question Drag & Drop"
    block.weight = 5

    student_fragment = block.render('student_view', Mock())
    assert_in('<section class="xblock--drag-and-drop">',
        student_fragment.content)
    assert_in('{{ value }}', student_fragment.content)
    assert_in("Test Drag & Drop", student_fragment.content)
    assert_in("Question Drag & Drop", student_fragment.content)

    studio_fragment = block.render('studio_view', Mock())
    assert_in('<div class="xblock--drag-and-drop editor-with-buttons">',
        studio_fragment.content)
    assert_in('{{ value }}', studio_fragment.content)

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

    ZONE_A = None
    ZONE_B = None

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
        raise NotImplemented

    def get_data_response(self):
        raise NotImplemented

    def test_get_data_returns_expected_data(self):
        expected_response = self.get_data_response()
        get_data_response = json.loads(self._block.handle('get_data', Mock()).body)
        assert_equals(expected_response, get_data_response)

    def test_do_attempt_wrong_with_feedback(self):
        item_id, zone_id = 0, self.ZONE_B
        data = json.dumps({"val": item_id, "zone": zone_id, "top": "31px", "left": "216px"})
        res = json.loads(self._block.handle('do_attempt', make_request(data)).body)
        assert_equals(res, {
            "final_feedback": None,
            "finished": False,
            "correct": False,
            "feedback": self.FEEDBACK[item_id]["incorrect"]
        })

    def test_do_attempt_wrong_without_feedback(self):
        item_id, zone_id = 2, self.ZONE_A
        data = json.dumps({"val": item_id, "zone": zone_id, "top": "42px", "left": "100px"})
        res = json.loads(self._block.handle('do_attempt', make_request(data)).body)
        assert_equals(res, {
            "final_feedback": None,
            "finished": False,
            "correct": False,
            "feedback": self.FEEDBACK[item_id]["incorrect"]
        })

    def test_do_attempt_correct(self):
        item_id, zone_id = 0, self.ZONE_A
        data = json.dumps({"val": item_id, "zone": zone_id, "top": "11px", "left": "111px"})
        res = json.loads(self._block.handle('do_attempt', make_request(data)).body)
        assert_equals(res, {
            "final_feedback": None,
            "finished": False,
            "correct": True,
            "feedback": self.FEEDBACK[item_id]["correct"]
        })

    def test_do_attempt_final(self):
        data = json.dumps({"val": 0, "zone": self.ZONE_A, "top": "11px", "left": "111px"})
        self._block.handle('do_attempt', make_request(data))

        expected = self.get_data_response()
        expected["state"] = {
            "items": {
                "0": ["11px", "111px"]
            },
            "finished": False
        }
        get_data = json.loads(self._block.handle('get_data', Mock()).body)
        assert_equals(expected, get_data)

        data = json.dumps({"val": 1, "zone": self.ZONE_B, "top": "22px", "left": "222px"})
        res = json.loads(self._block.handle('do_attempt', make_request(data)).body)
        assert_equals(res, {
            "final_feedback": self.FINAL_FEEDBACK,
            "finished": True,
            "correct": True,
            "feedback": self.FEEDBACK[1]["correct"]
        })

        expected = self.get_data_response()
        expected["state"] = {
            "items": {
                "0": ["11px", "111px"],
                "1": ["22px", "222px"]
            },
            "finished": True
        }
        expected["feedback"]["finish"] = self.FINAL_FEEDBACK
        get_data = json.loads(self._block.handle('get_data', Mock()).body)
        assert_equals(expected, get_data)


class TestDragAndDropHtmlData(BaseDragAndDropAjaxFixture, unittest.TestCase):
    ZONE_A = "Zone <i>A</i>"
    ZONE_B = "Zone <b>B</b>"

    FEEDBACK = {
        0: {"correct": "Yes <b>A</b>", "incorrect": "No <b>A</b>"},
        1: {"correct": "Yes <i>B</i>", "incorrect": "No <i>B</i>"},
        2: {"correct": "", "incorrect": ""}
    }

    FINAL_FEEDBACK = "Final <b>Feed</b>"

    def initial_data(self):
        with open('tests/data/test_html_data.json') as f:
            return json.load(f)

    def get_data_response(self):
        with open('tests/data/test_get_html_data.json') as f:
            return json.load(f)


class TestDragAndDropPlainData(BaseDragAndDropAjaxFixture, unittest.TestCase):
    ZONE_A = "Zone A"
    ZONE_B = "Zone B"

    FEEDBACK = {
        0: {"correct": "Yes A", "incorrect": "No A"},
        1: {"correct": "Yes B", "incorrect": "No B"},
        2: {"correct": "", "incorrect": ""}
    }

    FINAL_FEEDBACK = "Final Feed"

    def initial_data(self):
        with open('tests/data/test_data.json') as f:
            return json.load(f)

    def get_data_response(self):
        with open('tests/data/test_get_data.json') as f:
            return json.load(f)

def test_ajax_solve_and_reset():
    block = make_block()

    assert_false(block.completed)
    assert_equals(block.item_state, {})

    data = json.dumps({"val":0,"zone":"Zone A","top":"11px","left":"111px"})
    block.handle('do_attempt', make_request(data))
    data = json.dumps({"val":1,"zone":"Zone B","top":"22px","left":"222px"})
    block.handle('do_attempt', make_request(data))

    assert_true(block.completed)
    assert_equals(block.item_state, {0: ("11px", "111px"), 1: ("22px", "222px")})

    block.handle('reset', make_request("{}"))

    assert_true(block.completed)
    assert_equals(block.item_state, {})
