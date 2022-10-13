import unittest

from .test_fixtures import BaseDragAndDropAjaxFixture


class TestPlainDragAndDropIndexibility(BaseDragAndDropAjaxFixture, unittest.TestCase):
    FOLDER = "plain"

    def test_indexibility(self):
        expected_indexing_result = {
            'content': {
                'question_text': 'Can you solve this drag-and-drop problem?',
                'item_1_image_description': '',
                'background_image_description': 'This describes the target image',
                'item_2_display_name': 'X',
                'item_0_image_description': '',
                'zone_0_display_name': 'Zone 1',
                'item_3_image_description': '',
                'item_1_display_name': '2',
                'zone_1_display_name': 'Zone 2',
                'zone_1_description': '',
                'item_0_display_name': '1',
                'item_2_image_description': '',
                'zone_0_description': '',
                'item_3_display_name': '',
                'display_name': 'DnDv2 XBlock with plain text instructions'
            },
            'content_type': 'Drag and Drop'
        }
        self.assertEqual(self.block.index_dictionary(), expected_indexing_result)


class TestOldDragAndDropIndexibility(BaseDragAndDropAjaxFixture, unittest.TestCase):
    FOLDER = "old"

    def test_indexibility(self):
        expected_indexing_result = {
            'content_type': 'Drag and Drop',
            'content': {
                'item_3_image_description': '',
                'zone_1_description': '',
                'item_1_display_name': '2',
                'zone_1_display_name': 'Zone 2',
                'item_1_image_description': '',
                'item_0_display_name': '1',
                'question_text': '',
                'background_image_description': 'This describes the target image',
                'zone_0_description': '',
                'zone_0_display_name': 'Zone 1',
                'item_0_image_description': '',
                'item_3_display_name': '',
                'display_name': 'Drag and Drop',
                'item_2_image_description': '',
                'item_2_display_name': 'X'
            }
        }
        self.assertEqual(self.block.index_dictionary(), expected_indexing_result)


class TestHtmlDragAndDropIndexibility(BaseDragAndDropAjaxFixture, unittest.TestCase):
    FOLDER = "html"

    def test_indexibility(self):
        expected_indexing_result = {
            'content_type': 'Drag and Drop',
            'content': {
                'item_2_display_name': 'X',
                'zone_0_display_name': 'Zone 1',
                'item_1_display_name': '2',
                'item_3_image_description': '',
                'zone_0_description': '',
                'zone_1_display_name': 'Zone 2',
                'background_image_description': 'This describes the target image',
                'zone_1_description': '',
                'item_1_image_description': '',
                'item_0_image_description': '',
                'item_2_image_description': '',
                'question_text': 'Solve this drag-and-drop problem.',
                'item_3_display_name': '',
                'display_name': 'DnDv2 XBlock with HTML instructions',
                'item_0_display_name': '1'
            }
        }
        self.assertEqual(self.block.index_dictionary(), expected_indexing_result)


class TestAssessmentDragAndDropIndexibility(BaseDragAndDropAjaxFixture, unittest.TestCase):
    FOLDER = "assessment"

    def test_indexibility(self):
        expected_indexing_result = {
            'content_type': 'Drag and Drop',
            'content': {
                'item_3_image_description': '',
                'item_0_display_name': '1',
                'zone_0_description': '',
                'item_2_display_name': '3',
                'item_2_image_description': '',
                'background_image_description': 'This describes the target image',
                'display_name': 'DnDv2 XBlock with plain text instructions',
                'item_1_image_description': '',
                'item_4_display_name': '',
                'zone_1_description': '',
                'item_1_display_name': '2',
                'item_3_display_name': 'X',
                'question_text': 'Can you solve this drag-and-drop problem?',
                'zone_1_display_name': 'Zone 2',
                'zone_0_display_name': 'Zone 1',
                'item_4_image_description': '',
                'item_0_image_description': ''
            }
        }
        self.assertEqual(self.block.index_dictionary(), expected_indexing_result)
