import json
import pkg_resources
import re

from mock import patch
from webob import Request
from workbench.runtime import WorkbenchRuntime
from xblock.fields import ScopeIds
from xblock.runtime import KvsFieldData, DictKeyValueStore

import drag_and_drop_v2


def make_request(data, method='POST'):
    """ Make a webob JSON Request """
    request = Request.blank('/')
    request.method = 'POST'
    request.body = json.dumps(data).encode('utf-8') if data is not None else ""
    request.method = method
    return request


def make_block():
    """ Instantiate a DragAndDropBlock XBlock inside a WorkbenchRuntime """
    block_type = 'drag_and_drop_v2'
    key_store = DictKeyValueStore()
    field_data = KvsFieldData(key_store)
    runtime = WorkbenchRuntime()
    def_id = runtime.id_generator.create_definition(block_type)
    usage_id = runtime.id_generator.create_usage(def_id)
    scope_ids = ScopeIds('user', block_type, def_id, usage_id)
    return drag_and_drop_v2.DragAndDropBlock(runtime, field_data, scope_ids=scope_ids)


def load_resource(resource_path):
    """
    Gets the content of a resource
    """
    resource_content = pkg_resources.resource_string(__name__, resource_path)
    return unicode(resource_content)


class TestCaseMixin(object):
    """ Helpful mixins for unittest TestCase subclasses """
    maxDiff = None

    def patch_workbench(self):
        self.apply_patch(
            'workbench.runtime.WorkbenchRuntime.local_resource_url',
            lambda _, _block, path: '/expanded/url/to/drag_and_drop_v2/' + path
        )
        self.apply_patch(
            'workbench.runtime.WorkbenchRuntime.replace_urls',
            lambda _, html: re.sub(r'"/static/([^"]*)"', r'"/course/test-course/assets/\1"', html),
            create=True,
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
            return json.loads(response.body)
        return response
