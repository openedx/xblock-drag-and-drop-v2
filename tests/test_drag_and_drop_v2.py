import logging
import json
import re
import datetime
import time
import json
from webob import Request
from mock import Mock, patch

from workbench.runtime import WorkbenchRuntime
from xblock.runtime import KvsFieldData, DictKeyValueStore

from nose.tools import (
    assert_equals, assert_true, assert_in,
    assert_regexp_matches
)

import drag_and_drop_v2


# Silence too verbose Django logging
logging.disable(logging.DEBUG)


def make_request(body):
    request = Request.blank('/')
    request.method = 'POST'
    request.body = body.encode('utf-8')
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
    assert_in("Test Drag &amp; Drop", student_fragment.content)
    assert_in("Question Drag &amp; Drop", student_fragment.content)
    assert_in("(5 Points Possible)", student_fragment.content)

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

def test_ajax():
    assert_equals.__self__.maxDiff = None

    block = make_block()

    with open('tests/test_data.json') as f:
        block.data = json.load(f)

    with open('tests/test_get_data.json') as f:
        get_data = json.loads(block.handle('get_data', Mock()).body)
        assert_equals(json.load(f), get_data)

    # Wrong with feedback
    data = json.dumps({"val":0,"zone":"Zone B","top":"31px","left":"216px"})
    res = json.loads(block.handle('do_attempt', make_request(data)).body)
    assert_equals(res, {
        "final_feedback": None,
        "finished": False,
        "correct": False,
        "feedback": "No A"
    })
    with open('tests/test_get_data.json') as f:
        get_data = json.loads(block.handle('get_data', Mock()).body)
        assert_equals(json.load(f), get_data)

    # Wrong without feedback
    data = json.dumps({"val":2,"zone":"Zone B","top":"42px","left":"100px"})
    res = json.loads(block.handle('do_attempt', make_request(data)).body)
    assert_equals(res, {
        "final_feedback": None,
        "finished": False,
        "correct": False,
        "feedback": ""
    })
    with open('tests/test_get_data.json') as f:
        get_data = json.loads(block.handle('get_data', Mock()).body)
        assert_equals(json.load(f), get_data)

    # Correct
    data = json.dumps({"val":0,"zone":"Zone A","top":"11px","left":"111px"})
    res = json.loads(block.handle('do_attempt', make_request(data)).body)
    assert_equals(res, {
        "final_feedback": None,
        "finished": False,
        "correct": True,
        "feedback": "Yes A"
    })
    with open('tests/test_get_data.json') as f:
        expected = json.load(f)
        expected["state"] = {
            "items": {
                "0": ["11px", "111px"]
            },
            "finished": False
        }
        get_data = json.loads(block.handle('get_data', Mock()).body)
        assert_equals(expected, get_data)

    # Final
    data = json.dumps({"val":1,"zone":"Zone B","top":"22px","left":"222px"})
    res = json.loads(block.handle('do_attempt', make_request(data)).body)
    assert_equals(res, {
        "final_feedback": "Final Feed",
        "finished": True,
        "correct": True,
        "feedback": "Yes B"
    })
    with open('tests/test_get_data.json') as f:
        expected = json.load(f)
        expected["state"] = {
            "items": {
                "0": ["11px", "111px"],
                "1": ["22px", "222px"]
            },
            "finished": True
        }
        expected["feedback"]["finish"] = "Final Feed"
        get_data = json.loads(block.handle('get_data', Mock()).body)
        assert_equals(expected, get_data)

