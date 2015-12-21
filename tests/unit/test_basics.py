import unittest

from ..utils import (
    DEFAULT_START_FEEDBACK,
    DEFAULT_FINISH_FEEDBACK,
    make_block,
    TestCaseMixin,
)


class BasicTests(TestCaseMixin, unittest.TestCase):
    """ Basic unit tests for the Drag and Drop block, using its default settings """

    def setUp(self):
        self.block = make_block()
        self.patch_workbench()

    def test_template_contents(self):
        context = {}
        student_fragment = self.block.runtime.render(self.block, 'student_view', context)
        self.assertIn('<section class="xblock--drag-and-drop">', student_fragment.content)
        self.assertIn('Loading drag and drop exercise.', student_fragment.content)

    def test_get_configuration(self):
        """
        Test the get_configuration() method.
        The result of this method is passed to the block's JavaScript during initialization.
        """
        config = self.block.get_configuration()
        zones = config.pop("zones")
        items = config.pop("items")
        self.assertEqual(config, {
            "display_zone_labels": False,
            "title": "Drag and Drop",
            "show_title": True,
            "question_text": "",
            "show_question_header": True,
            "target_img_expanded_url": '/expanded/url/to/drag_and_drop_v2/public/img/triangle.png',
            "target_img_description": "",
            "item_background_color": None,
            "item_text_color": None,
            "initial_feedback": DEFAULT_START_FEEDBACK,
        })
        self.assertEqual(zones, [
            {
                "index": 1,
                "title": "Zone 1",
                "id": "zone-1",
                "x": 160,
                "y": 30,
                "width": 196,
                "height": 178,
            },
            {
                "index": 2,
                "title": "Zone 2",
                "id": "zone-2",
                "x": 86,
                "y": 210,
                "width": 340,
                "height": 140,
            }
        ])
        # Items should contain no answer data:
        self.assertEqual(items, [
            {"id": 0, "displayName": "1", "imageURL": "", "inputOptions": False},
            {"id": 1, "displayName": "2", "imageURL": "", "inputOptions": False},
            {"id": 2, "displayName": "X", "imageURL": "", "inputOptions": False},
        ])

    def test_ajax_solve_and_reset(self):
        # Check assumptions / initial conditions:
        self.assertFalse(self.block.completed)

        def assert_user_state_empty():
            self.assertEqual(self.block.item_state, {})
            self.assertEqual(self.call_handler("get_user_state"), {
                'items': {},
                'finished': False,
                'overall_feedback': DEFAULT_START_FEEDBACK,
            })
        assert_user_state_empty()

        # Drag both items into the correct spot:
        data = {"val": 0, "zone": "Zone 1", "x_percent": "33%", "y_percent": "11%"}
        self.call_handler('do_attempt', data)
        data = {"val": 1, "zone": "Zone 2", "x_percent": "67%", "y_percent": "80%"}
        self.call_handler('do_attempt', data)

        # Check the result:
        self.assertTrue(self.block.completed)
        self.assertEqual(self.block.item_state, {
            '0': {'x_percent': '33%', 'y_percent': '11%'},
            '1': {'x_percent': '67%', 'y_percent': '80%'},
        })
        self.assertEqual(self.call_handler('get_user_state'), {
            'items': {
                '0': {'x_percent': '33%', 'y_percent': '11%', 'correct_input': True},
                '1': {'x_percent': '67%', 'y_percent': '80%', 'correct_input': True},
            },
            'finished': True,
            'overall_feedback': DEFAULT_FINISH_FEEDBACK,
        })

        # Reset to initial conditions
        self.call_handler('reset', {})
        self.assertTrue(self.block.completed)
        assert_user_state_empty()

    def test_studio_submit(self):
        body = {
            'display_name': "Test Drag & Drop",
            'show_title': False,
            'question_text': "Question Drag & Drop",
            'show_question_header': False,
            'item_background_color': 'cornflowerblue',
            'item_text_color': 'coral',
            'weight': '5',
            'data': {
                'foo': 1
            },
        }
        res = self.call_handler('studio_submit', body)
        self.assertEqual(res, {'result': 'success'})

        self.assertEqual(self.block.show_title, False)
        self.assertEqual(self.block.display_name, "Test Drag & Drop")
        self.assertEqual(self.block.question_text, "Question Drag & Drop")
        self.assertEqual(self.block.show_question_header, False)
        self.assertEqual(self.block.item_background_color, "cornflowerblue")
        self.assertEqual(self.block.item_text_color, "coral")
        self.assertEqual(self.block.weight, 5)
        self.assertEqual(self.block.data, {'foo': 1})

    def test_expand_static_url(self):
        """ Test the expand_static_url handler needed in Studio when changing the image """
        res = self.call_handler('expand_static_url', '/static/blah.png')
        self.assertEqual(res, {'url': '/course/test-course/assets/blah.png'})

    def test_image_url(self):
        """ Ensure that the default image and custom URLs are both expanded by the runtime """
        self.assertEqual(self.block.data.get("targetImg"), None)
        self.assertEqual(
            self.block.get_configuration()["target_img_expanded_url"],
            '/expanded/url/to/drag_and_drop_v2/public/img/triangle.png',
        )

        self.block.data["targetImg"] = "/static/foo.png"
        self.assertEqual(
            self.block.get_configuration()["target_img_expanded_url"],
            '/course/test-course/assets/foo.png',
        )
