import ddt
import unittest
import random

from drag_and_drop_v2.utils import Constants
from drag_and_drop_v2.default_data import (
    TARGET_IMG_DESCRIPTION, TOP_ZONE_ID, MIDDLE_ZONE_ID, BOTTOM_ZONE_ID,
    START_FEEDBACK, FINISH_FEEDBACK, DEFAULT_DATA
)
from ..utils import make_block, TestCaseMixin


@ddt.ddt
class BasicTests(TestCaseMixin, unittest.TestCase):
    """ Basic unit tests for the Drag and Drop block, using its default settings """

    def setUp(self):
        self.block = make_block()
        self.patch_workbench()

    @staticmethod
    def _make_submission(modify_submission=None):
        modify = modify_submission if modify_submission else lambda x: x

        submission = {
            'display_name': "Test Drag & Drop",
            'mode': Constants.STANDARD_MODE,
            'item_sizing': Constants.FREE_SIZING,
            'max_attempts': 1,
            'show_title': False,
            'problem_text': "Problem Drag & Drop",
            'show_problem_header': False,
            'item_background_color': 'cornflowerblue',
            'item_text_color': 'coral',
            'weight': '5',
            'data': {
                'foo': 1,
                'items': []
            },
        }

        modify(submission)

        return submission

    def test_template_contents(self):
        context = {}
        student_fragment = self.block.runtime.render(self.block, 'student_view', context)
        self.assertIn('<div class="themed-xblock xblock--drag-and-drop">', student_fragment.content)
        self.assertIn('Loading drag and drop problem.', student_fragment.content)

    def test_student_view_data(self):
        """
        Test the student_view_data() method.
        The result of this method is passed to the block's JavaScript during initialization.
        """
        config = self.block.student_view_data()
        zones = config.pop("zones")
        items = config.pop("items")
        self.assertEqual(config, {
            "block_id": config['block_id'],  # Block ids aren't stable
            "display_name": "Drag and Drop",
            "type": "drag-and-drop-v2",
            "weight": 1,
            "mode": Constants.STANDARD_MODE,
            "item_sizing": Constants.FREE_SIZING,
            "max_attempts": None,
            "graded": False,
            "weighted_max_score": 1,
            "display_zone_borders": False,
            "display_zone_labels": False,
            "title": "Drag and Drop",
            "show_title": True,
            "problem_text": "",
            "max_items_per_zone": None,
            "show_problem_header": True,
            "target_img_expanded_url": '/expanded/url/to/drag_and_drop_v2/public/img/triangle.png',
            "target_img_description": TARGET_IMG_DESCRIPTION,
            "item_background_color": None,
            "item_text_color": None,
            "url_name": "",
        })
        self.assertEqual(zones, DEFAULT_DATA["zones"])
        # Items should contain no answer data:
        self.assertEqual(items, [
            {"id": i, "displayName": display_name, "imageURL": "", "expandedImageURL": ""}
            for i, display_name in enumerate(
                [
                    "Goes to the top",
                    "Goes to the middle",
                    "Goes to the bottom",
                    "Goes anywhere",
                    "I don't belong anywhere"
                ]
            )
        ])

    @ddt.data(*[random.randint(1, 50) for _ in xrange(5)])  # pylint: disable=star-args
    def test_grading_interface(self, weight):
        """
        Test that the methods required by the LMS grading interface work as expected.
        """
        self.block.weight = weight
        # Max score is different from weight and should always equal 1 for drag and drop problems.
        # See: https://openedx.atlassian.net/wiki/display/TNL/Robust+Grades+Design
        self.assertEqual(self.block.max_score(), 1)
        self.assertTrue(self.block.has_score)

    def test_ajax_solve_and_reset(self):
        # Check assumptions / initial conditions:
        self.assertFalse(self.block.completed)

        def assert_user_state_empty(grade=None):
            self.assertEqual(self.block.item_state, {})
            self.assertEqual(self.call_handler("student_view_user_state"), {
                "grade": grade,
                'items': {},
                'finished': False,
                "attempts": 0,
                'overall_feedback': [{"message": START_FEEDBACK, "message_class": None}]
            })
        assert_user_state_empty()

        # Drag three items into the correct spot:
        data = {"val": 0, "zone": TOP_ZONE_ID}
        self.call_handler(self.DROP_ITEM_HANDLER, data)
        data = {"val": 1, "zone": MIDDLE_ZONE_ID}
        self.call_handler(self.DROP_ITEM_HANDLER, data)
        data = {"val": 2, "zone": BOTTOM_ZONE_ID}
        self.call_handler(self.DROP_ITEM_HANDLER, data)
        data = {"val": 3, "zone": MIDDLE_ZONE_ID}
        self.call_handler(self.DROP_ITEM_HANDLER, data)

        # Check the result:
        self.assertTrue(self.block.completed)
        self.assertEqual(self.block.item_state, {
            '0': {'correct': True, 'zone': TOP_ZONE_ID},
            '1': {'correct': True, 'zone': MIDDLE_ZONE_ID},
            '2': {'correct': True, 'zone': BOTTOM_ZONE_ID},
            '3': {'correct': True, "zone": MIDDLE_ZONE_ID},
        })
        self.assertEqual(self.call_handler('student_view_user_state'), {
            'items': {
                '0': {'correct': True, 'zone': TOP_ZONE_ID},
                '1': {'correct': True, 'zone': MIDDLE_ZONE_ID},
                '2': {'correct': True, 'zone': BOTTOM_ZONE_ID},
                '3': {'correct': True, "zone": MIDDLE_ZONE_ID},
            },
            'finished': True,
            "attempts": 0,
            "grade": 1,
            'overall_feedback': [{"message": FINISH_FEEDBACK, "message_class": None}],
        })

        # Reset to initial conditions
        self.call_handler('reset', {})
        self.assertTrue(self.block.completed)
        assert_user_state_empty(grade=1)  # resetting student state does not reset the grade

    def test_legacy_state_support(self):
        """
        The form of items stored in user item_state has changed several times.
        This test makes sure that legacy forms are properly converted to compatible format.
        """
        self.assertEqual(self.block.item_state, {})
        self.assertEqual(self.call_handler('student_view_user_state')['items'], {})

        self.block.item_state = {
            # Legacy tuple (top, left) representation.
            '0': [60, 20],
            # Legacy dict with absolute values and no correctness or zone info.
            '1': {'top': 45, 'left': 99},
            # Legacy dict with no correctness info.
            '2': {'x_percent': '99%', 'y_percent': '95%', 'zone': BOTTOM_ZONE_ID},
            # Legacy with absolute placement info.
            '3': {'x_percent': '67%', 'y_percent': '80%', 'zone': BOTTOM_ZONE_ID, 'correct': False},
            # Current state form
            '4': {'zone': BOTTOM_ZONE_ID, 'correct': False},
        }
        self.block.save()

        self.assertEqual(self.call_handler('student_view_user_state')['items'], {
            '0': {'correct': True, 'zone': TOP_ZONE_ID},
            '1': {'correct': True, 'zone': MIDDLE_ZONE_ID},
            '2': {'correct': True, 'zone': BOTTOM_ZONE_ID},
            '3': {'correct': False, "zone": BOTTOM_ZONE_ID},
            '4': {'correct': False, "zone": BOTTOM_ZONE_ID},
        })

    def test_studio_submit(self):
        body = self._make_submission()
        res = self.call_handler('studio_submit', body)
        self.assertEqual(res, {'result': 'success'})

        self.assertEqual(self.block.show_title, False)
        self.assertEqual(self.block.mode, Constants.STANDARD_MODE)
        self.assertEqual(self.block.item_sizing, Constants.FREE_SIZING)
        self.assertEqual(self.block.max_attempts, 1)
        self.assertEqual(self.block.display_name, "Test Drag & Drop")
        self.assertEqual(self.block.question_text, "Problem Drag & Drop")
        self.assertEqual(self.block.show_question_header, False)
        self.assertEqual(self.block.item_background_color, "cornflowerblue")
        self.assertEqual(self.block.item_text_color, "coral")
        self.assertEqual(self.block.weight, 5)
        self.assertEqual(self.block.max_items_per_zone, None)
        self.assertEqual(self.block.data, {'foo': 1, 'items': []})

    def test_studio_submit_assessment(self):
        def modify_submission(submission):
            submission.update({
                'mode': Constants.ASSESSMENT_MODE,
                'max_items_per_zone': 4,
                'show_problem_header': True,
                'show_title': True,
                'max_attempts': 12,
                'item_text_color': 'red',
                'data': {'foo': 2, 'items': [{'zone': '1', 'title': 'qwe'}]},
            })

        body = self._make_submission(modify_submission)
        res = self.call_handler('studio_submit', body)
        self.assertEqual(res, {'result': 'success'})

        self.assertEqual(self.block.show_title, True)
        self.assertEqual(self.block.mode, Constants.ASSESSMENT_MODE)
        self.assertEqual(self.block.item_sizing, Constants.FREE_SIZING)
        self.assertEqual(self.block.max_attempts, 12)
        self.assertEqual(self.block.display_name, "Test Drag & Drop")
        self.assertEqual(self.block.question_text, "Problem Drag & Drop")
        self.assertEqual(self.block.show_question_header, True)
        self.assertEqual(self.block.item_background_color, "cornflowerblue")
        self.assertEqual(self.block.item_text_color, "red")
        self.assertEqual(self.block.weight, 5)
        self.assertEqual(self.block.max_items_per_zone, 4)
        self.assertEqual(self.block.data, {'foo': 2, 'items': [{'zone': '1', 'title': 'qwe'}]})

    def test_studio_submit_empty_max_items(self):
        def modify_submission(submission):
            submission['max_items_per_zone'] = ''

        body = self._make_submission(modify_submission)
        res = self.call_handler('studio_submit', body)
        self.assertEqual(res, {'result': 'success'})

        self.assertIsNone(self.block.max_items_per_zone)

    def test_studio_submit_coerce_to_integer(self):
        # Validate that numbers submitted as strings are being
        # coerced to integers rather than being saved as strings
        def modify_submission(submission):
            submission['max_attempts'] = '1234567890'

        body = self._make_submission(modify_submission)
        self.call_handler('studio_submit', body)
        self.assertEqual(self.block.max_attempts, 1234567890)
        self.assertEqual(type(self.block.max_attempts), int)

    def test_expand_static_url(self):
        """ Test the expand_static_url handler needed in Studio when changing the image """
        res = self.call_handler('expand_static_url', '/static/blah.png')
        self.assertEqual(res, {'url': '/course/test-course/assets/blah.png'})

    def test_image_url(self):
        """ Ensure that the default image and custom URLs are both expanded by the runtime """
        self.assertEqual(self.block.data.get("targetImg"), None)
        self.assertEqual(
            self.block.student_view_data()["target_img_expanded_url"],
            '/expanded/url/to/drag_and_drop_v2/public/img/triangle.png',
        )

        self.block.data["targetImg"] = "/static/foo.png"
        self.assertEqual(
            self.block.student_view_data()["target_img_expanded_url"],
            '/course/test-course/assets/foo.png',
        )
