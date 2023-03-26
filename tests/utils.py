from __future__ import absolute_import

import json
import random
import re

from mock import Mock, patch
from six.moves import range
from webob import Request
from workbench.runtime import WorkbenchRuntime
from xblock.fields import ScopeIds
from xblock.runtime import DictKeyValueStore, KvsFieldData

import drag_and_drop_v2


def make_request(data, method='POST'):
    """ Make a webob JSON Request """
    request = Request.blank('/')
    request.method = 'POST'
    data = json.dumps(data).encode('utf-8') if data is not None else b''
    request.body = data
    request.method = method
    return request


def make_block():
    """ Instantiate a DragAndDropBlock XBlock inside a WorkbenchRuntime """
    block_type = 'drag_and_drop_v2'
    key_store = DictKeyValueStore()
    field_data = KvsFieldData(key_store)
    runtime = WorkbenchRuntime()
    runtime.course_id = "dummy_course_id"
    # noinspection PyProtectedMember
    runtime._services['replace_urls'] = Mock(  # pylint: disable=protected-access
        replace_urls=lambda html, static_replace_only=False: re.sub(
            r'"/static/([^"]*)"', r'"/course/test-course/assets/\1"', html
        )
    )
    def_id = runtime.id_generator.create_definition(block_type)
    usage_id = runtime.id_generator.create_usage(def_id)
    scope_ids = ScopeIds('user', block_type, def_id, usage_id)
    return drag_and_drop_v2.DragAndDropBlock(runtime, field_data, scope_ids=scope_ids)


def generate_max_and_attempts(count=100):
    for _ in range(count):
        max_attempts = random.randint(1, 100)
        attempts = random.randint(0, 100)
        expect_validation_error = max_attempts <= attempts
        yield max_attempts, attempts, expect_validation_error


class TestCaseMixin(object):
    """ Helpful mixins for unittest TestCase subclasses """
    maxDiff = None

    DROP_ITEM_HANDLER = 'drop_item'
    DO_ATTEMPT_HANDLER = 'do_attempt'
    RESET_HANDLER = 'reset'
    SHOW_ANSWER_HANDLER = 'show_answer'
    USER_STATE_HANDLER = 'student_view_user_state'

    def patch_workbench(self):
        self.apply_patch(
            'workbench.runtime.WorkbenchRuntime.local_resource_url',
            lambda _, _block, path: '/expanded/url/to/drag_and_drop_v2/' + path
        )
        self.apply_patch(
            'drag_and_drop_v2.drag_and_drop_v2.get_grading_ignore_decoys_waffle_flag',
            lambda: Mock(is_enabled=lambda _: False),
        )

    def apply_patch(self, *args, **kwargs):
        new_patch = patch(*args, **kwargs)
        mock = new_patch.start()
        self.addCleanup(new_patch.stop)
        return mock

    def call_handler(self, handler_name, data=None, expect_json=True, method='POST'):
        response = self.block.handle(handler_name, make_request(data, method=method))
        if expect_json:
            self.assertEqual(response.status_code, 200)
            return json.loads(response.body.decode('utf-8'))
        return response
