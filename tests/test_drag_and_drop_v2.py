import logging
import json
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


def do_ajax(orig_file, get_file):
    assert_equals.__self__.maxDiff = None

    block = make_block()

    with open(orig_file) as f:
        block.data = json.load(f)

    initial_data = block.data
    zoneA = initial_data["items"][0]["zone"]
    zoneB = initial_data["items"][1]["zone"]
    feedback_finish = initial_data["feedback"]["finish"]
    get_item_feedback = lambda item, type: initial_data["items"][item]["feedback"][type]

    with open(get_file) as f:
        get_data = json.loads(block.handle('get_data', Mock()).body)
        assert_equals(json.load(f), get_data)

    # Wrong with feedback
    data = json.dumps({"val":0,"zone":zoneB,"top":"31px","left":"216px"})
    res = json.loads(block.handle('do_attempt', make_request(data)).body)
    assert_equals(res, {
        "final_feedback": None,
        "finished": False,
        "correct": False,
        "feedback": get_item_feedback(0, "incorrect")
    })
    with open(get_file) as f:
        get_data = json.loads(block.handle('get_data', Mock()).body)
        assert_equals(json.load(f), get_data)

    # Wrong without feedback
    data = json.dumps({"val":2,"zone":zoneB,"top":"42px","left":"100px"})
    res = json.loads(block.handle('do_attempt', make_request(data)).body)
    assert_equals(res, {
        "final_feedback": None,
        "finished": False,
        "correct": False,
        "feedback": get_item_feedback(2, "incorrect")
    })
    with open(get_file) as f:
        get_data = json.loads(block.handle('get_data', Mock()).body)
        assert_equals(json.load(f), get_data)

    # Correct
    data = json.dumps({"val":0,"zone":zoneA,"top":"11px","left":"111px"})
    res = json.loads(block.handle('do_attempt', make_request(data)).body)
    assert_equals(res, {
        "final_feedback": None,
        "finished": False,
        "correct": True,
        "feedback": get_item_feedback(0, "correct")
    })
    with open(get_file) as f:
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
    data = json.dumps({"val":1,"zone":zoneB,"top":"22px","left":"222px"})
    res = json.loads(block.handle('do_attempt', make_request(data)).body)
    assert_equals(res, {
        "final_feedback": feedback_finish,
        "finished": True,
        "correct": True,
        "feedback": get_item_feedback(1, "correct")
    })
    with open(get_file) as f:
        expected = json.load(f)
        expected["state"] = {
            "items": {
                "0": ["11px", "111px"],
                "1": ["22px", "222px"]
            },
            "finished": True
        }
        expected["feedback"]["finish"] = feedback_finish
        get_data = json.loads(block.handle('get_data', Mock()).body)
        assert_equals(expected, get_data)

def test_ajax():
    do_ajax('tests/test_data.json', 'tests/test_get_data.json')


def test_html_ajax():
    do_ajax('tests/test_html_data.json', 'tests/test_get_html_data.json')

def test_ajax_solve_and_reset():
    block = make_block()

    assert_false(block.completed)
    assert_equals(block.item_state, {})

    data = json.dumps({"val":0,"zone":"Zone A","top":"11px","left":"111px"})
    block.handle('do_attempt', make_request(data))
    data = json.dumps({"val":1,"zone":"Zone B","top":"22px","left":"222px"})
    block.handle('do_attempt', make_request(data))

    assert_true(block.completed)
    assert_equals(block.item_state, {0:("11px", "111px"), 1:("22px", "222px")})

    block.handle('reset', make_request("{}"))

    assert_true(block.completed)
    assert_equals(block.item_state, {})
