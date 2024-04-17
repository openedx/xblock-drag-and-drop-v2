from __future__ import absolute_import

import json

from xblock.utils.resources import ResourceLoader

from tests.utils import TestCaseMixin, make_block

loader = ResourceLoader(__name__)


class BaseDragAndDropAjaxFixture(TestCaseMixin):
    ZONE_1 = None
    ZONE_2 = None

    OVERALL_FEEDBACK_KEY = 'overall_feedback'
    FEEDBACK_KEY = 'feedback'

    FEEDBACK = {
        0: {"correct": None, "incorrect": None},
        1: {"correct": None, "incorrect": None},
        2: {"correct": None, "incorrect": None},
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
        return json.loads(loader.load_unicode(f'data/{cls.FOLDER}/data.json'))

    @classmethod
    def initial_settings(cls):
        return json.loads(loader.load_unicode(f'data/{cls.FOLDER}/settings.json'))

    @classmethod
    def expected_student_data(cls):
        return json.loads(loader.load_unicode(f'data/{cls.FOLDER}/config_out.json'))

    def test_student_view_data(self):
        data = self.block.student_view_data()
        expected = self.expected_student_data()
        expected['block_id'] = data['block_id']  # Block ids aren't stable
        self.assertEqual(data, expected)
