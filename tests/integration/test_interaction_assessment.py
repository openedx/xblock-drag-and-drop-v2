# -*- coding: utf-8 -*-

# Imports ###########################################################

from ddt import ddt, data
from mock import Mock, patch
import time
import re

from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys

from xblockutils.resources import ResourceLoader

from drag_and_drop_v2.default_data import (
    TOP_ZONE_ID, MIDDLE_ZONE_ID, BOTTOM_ZONE_ID,
    TOP_ZONE_TITLE, START_FEEDBACK, FINISH_FEEDBACK
)
from drag_and_drop_v2.utils import FeedbackMessages, Constants
from .test_base import BaseIntegrationTest
from .test_interaction import (
    InteractionTestBase, DefaultDataTestMixin, ParameterizedTestsMixin, TestMaxItemsPerZone, ITEM_DRAG_KEYBOARD_KEYS
)


# Globals ###########################################################

loader = ResourceLoader(__name__)


# Classes ###########################################################

class DefaultAssessmentDataTestMixin(DefaultDataTestMixin):
    """
    Provides a test scenario with default options in assessment mode.
    """
    MAX_ATTEMPTS = 5
    item_sizing = Constants.FREE_SIZING

    def _get_scenario_xml(self):  # pylint: disable=no-self-use
        return """
            <vertical_demo><drag-and-drop-v2 mode='{mode}'
             item_sizing='{item_sizing}' max_attempts='{max_attempts}'/></vertical_demo>
        """.format(mode=Constants.ASSESSMENT_MODE, max_attempts=self.MAX_ATTEMPTS, item_sizing=self.item_sizing)


class AssessmentTestMixin(object):
    """
    Provides helper methods for assessment tests
    """
    @staticmethod
    def _wait_until_enabled(element):
        wait = WebDriverWait(element, 2)
        wait.until(lambda e: e.is_displayed() and e.get_attribute('disabled') is None)

    def click_submit(self):
        submit_button = self._get_submit_button()

        self._wait_until_enabled(submit_button)

        submit_button.click()
        self.wait_for_ajax()

    def click_show_answer(self):
        show_answer_button = self._get_show_answer_button()

        self._wait_until_enabled(show_answer_button)

        show_answer_button.click()
        self.wait_for_ajax()


@ddt
class AssessmentInteractionTest(
    DefaultAssessmentDataTestMixin, AssessmentTestMixin, ParameterizedTestsMixin,
    InteractionTestBase, BaseIntegrationTest
):
    """
    Testing interactions with Drag and Drop XBlock against default data in assessment mode.
    All interactions are tested using mouse (action_key=None) and four different keyboard action keys.
    If default data changes this will break.
    """

    item_sizing = Constants.FIXED_SIZING

    @data(*ITEM_DRAG_KEYBOARD_KEYS)
    def test_item_no_feedback_on_good_move(self, action_key):
        self.parameterized_item_positive_feedback_on_good_move_assessment(self.items_map, action_key=action_key)

    @data(*ITEM_DRAG_KEYBOARD_KEYS)
    def test_item_no_feedback_on_bad_move(self, action_key):
        self.parameterized_item_negative_feedback_on_bad_move_assessment(
            self.items_map, self.all_zones, action_key=action_key
        )

    @data(*ITEM_DRAG_KEYBOARD_KEYS)
    def test_move_items_between_zones(self, action_key):
        self.parameterized_move_items_between_zones(
            self.items_map, self.all_zones, action_key=action_key
        )

    @data(*ITEM_DRAG_KEYBOARD_KEYS)
    def test_final_feedback_and_reset(self, action_key):
        self.parameterized_final_feedback_and_reset(
            self.items_map, self.feedback, action_key=action_key, assessment_mode=True
        )

    @data(False, True)
    def test_keyboard_help(self, use_keyboard):
        self.interact_with_keyboard_help(use_keyboard=use_keyboard)

    def test_submit_button_shown(self):
        first_item_definition = self._get_items_with_zone(self.items_map).values()[0]

        submit_button = self._get_submit_button()
        self.assertTrue(submit_button.is_displayed())
        self.assertEqual(submit_button.get_attribute('disabled'), 'true')  # no items are placed

        attempts_info = self._get_attempts_info()
        expected_text = "{num} / {max}\nAttempts".format(num=0, max=self.MAX_ATTEMPTS)
        self.assertEqual(attempts_info.text, expected_text)
        self.assertEqual(attempts_info.is_displayed(), self.MAX_ATTEMPTS > 0)

        self.place_item(first_item_definition.item_id, first_item_definition.zone_ids[0], None)

        self.assertEqual(submit_button.get_attribute('disabled'), None)

    def test_misplaced_items_returned_to_bank(self):
        """
        Test items placed to incorrect zones are returned to item bank after submitting solution
        """
        correct_items = {0: TOP_ZONE_ID}
        misplaced_items = {1: BOTTOM_ZONE_ID, 2: MIDDLE_ZONE_ID}

        for item_id, zone_id in correct_items.iteritems():
            self.place_item(item_id, zone_id)

        for item_id, zone_id in misplaced_items.iteritems():
            self.place_item(item_id, zone_id)

        self.click_submit()
        for item_id in correct_items:
            self.assert_placed_item(item_id, TOP_ZONE_TITLE, assessment_mode=True)

        for item_id in misplaced_items:
            self.assert_reverted_item(item_id)

    def test_misplaced_items_not_returned_to_bank_on_final_attempt(self):
        """
        Test items placed on incorrect zones are not returned to item bank
        after submitting solution on the final attempt, and remain placed after
        subsequently refreshing the page.
        """
        self.place_item(0, TOP_ZONE_ID, action_key=Keys.RETURN)

        # Reach final attempt
        for _ in xrange(self.MAX_ATTEMPTS-1):
            self.click_submit()

        # Place incorrect item on final attempt
        self.place_item(1, TOP_ZONE_ID, action_key=Keys.RETURN)
        self.click_submit()

        # Incorrect item remains placed
        def _assert_placed(item_id, zone_title):
            item = self._get_placed_item_by_value(item_id)
            item_description = item.find_element_by_css_selector('.sr.description')
            self.assertEqual(item_description.text, 'Placed in: {}'.format(zone_title))

        _assert_placed(1, TOP_ZONE_TITLE)

        # Refresh the page
        self._page = self.go_to_page(self.PAGE_TITLE)

        # Incorrect item remains placed after refresh
        _assert_placed(1, TOP_ZONE_TITLE)

    def test_max_attempts_reached_submit_and_reset_disabled(self):
        """
        Test "Submit" and "Reset" buttons are disabled when no more attempts remaining
        """
        self.place_item(0, TOP_ZONE_ID)

        submit_button, reset_button = self._get_submit_button(), self._get_reset_button()

        attempts_info = self._get_attempts_info()

        for index in xrange(self.MAX_ATTEMPTS):
            expected_text = "{num} / {max}\nAttempts".format(num=index, max=self.MAX_ATTEMPTS)
            self.assertEqual(attempts_info.text, expected_text)  # precondition check
            self.assertEqual(submit_button.get_attribute('disabled'), None)
            self.assertEqual(reset_button.get_attribute('disabled'), None)
            self.click_submit()

        self.assertEqual(submit_button.get_attribute('disabled'), 'true')
        self.assertEqual(reset_button.get_attribute('disabled'), 'true')

    def _assert_show_answer_item_placement(self):
        zones = dict(self.all_zones)
        for item in self._get_items_with_zone(self.items_map).values():
            zone_titles = [zones[zone_id] for zone_id in item.zone_ids]
            # When showing answers, correct items are placed as if assessment_mode=False
            self.assert_placed_item(item.item_id, zone_titles, assessment_mode=False)

        for item_definition in self._get_items_without_zone(self.items_map).values():
            self.assertNotDraggable(item_definition.item_id)
            item = self._get_item_by_value(item_definition.item_id)
            self.assertEqual(item.get_attribute('aria-grabbed'), 'false')
            self.assertEqual(item.get_attribute('class'), 'option fade')

            item_content = item.find_element_by_css_selector('.item-content')
            self.assertEqual(item_content.get_attribute('aria-describedby'), None)

            try:
                item.find_element_by_css_selector('.sr.description')
                self.fail("Description element should not be present")
            except NoSuchElementException:
                pass

    def test_do_attempt_feedback_is_updated(self):
        """
        Test updating overall feedback after submitting solution in assessment mode
        """
        def check_feedback(overall_feedback_lines, per_item_feedback_lines=None):
            # Check that the feedback is correctly displayed in the overall feedback area.
            expected_overall_feedback = "\n".join(["FEEDBACK"] + overall_feedback_lines)
            self.assertEqual(self._get_feedback().text, expected_overall_feedback)

            # Check that the SR.readText function was passed correct feedback messages.
            sr_feedback_lines = overall_feedback_lines
            if per_item_feedback_lines:
                sr_feedback_lines += ["Some of your answers were not correct.", "Hints:"]
                sr_feedback_lines += per_item_feedback_lines
            self.assert_reader_feedback_messages(sr_feedback_lines)

        # used keyboard mode to avoid bug/feature with selenium "selecting" everything instead of dragging an element
        self.place_item(0, TOP_ZONE_ID, Keys.RETURN)

        self.click_submit()

        # There are five items total (4 items with zones and one decoy item).
        # We place the first item into correct zone and left the decoy item in the bank,
        # which means the current grade is 2/5.
        expected_grade = 2.0 / 5.0

        feedback_lines = [
            FeedbackMessages.correctly_placed(1),
            FeedbackMessages.not_placed(3),
            START_FEEDBACK,
            FeedbackMessages.GRADE_FEEDBACK_TPL.format(score=expected_grade)
        ]
        check_feedback(feedback_lines)

        # Place the item into incorrect zone. The score does not change.
        self.place_item(1, BOTTOM_ZONE_ID, Keys.RETURN)
        self.click_submit()

        feedback_lines = [
            FeedbackMessages.correctly_placed(1),
            FeedbackMessages.misplaced_returned(1),
            FeedbackMessages.not_placed(2),
            START_FEEDBACK,
            FeedbackMessages.GRADE_FEEDBACK_TPL.format(score=expected_grade)
        ]
        check_feedback(feedback_lines, ["No, this item does not belong here. Try again."])

        # reach final attempt
        for _ in xrange(self.MAX_ATTEMPTS-3):
            self.click_submit()

        self.place_item(1, MIDDLE_ZONE_ID, Keys.RETURN)
        self.place_item(2, BOTTOM_ZONE_ID, Keys.RETURN)
        self.place_item(3, TOP_ZONE_ID, Keys.RETURN)

        self.click_submit()

        # All items are correctly placed, so we get the full score (1.0).
        expected_grade = 1.0

        feedback_lines = [
            FeedbackMessages.correctly_placed(4),
            FINISH_FEEDBACK,
            FeedbackMessages.FINAL_ATTEMPT_TPL.format(score=expected_grade)
        ]
        check_feedback(feedback_lines)

    def test_per_item_feedback_multiple_misplaced(self):
        self.place_item(0, MIDDLE_ZONE_ID, Keys.RETURN)
        self.place_item(1, BOTTOM_ZONE_ID, Keys.RETURN)
        self.place_item(2, TOP_ZONE_ID, Keys.RETURN)

        self.click_submit()

        placed_item_definitions = [self.items_map[item_id] for item_id in (1, 2, 3)]

        expected_message_elements = [
            "<li>{msg}</li>".format(msg=definition.feedback_negative)
            for definition in placed_item_definitions
        ]

        for message_element in expected_message_elements:
            self.assertIn(message_element, self._get_popup_content().get_attribute('innerHTML'))

    def test_submit_disabled_during_drop_item(self):
        def delayed_drop_item(item_attempt, suffix=''):  # pylint: disable=unused-argument
            # some delay to allow selenium check submit button disabled status while "drop_item"
            # XHR is still executing
            time.sleep(0.1)
            return {}

        self.place_item(0, TOP_ZONE_ID)
        self.assert_placed_item(0, TOP_ZONE_TITLE, assessment_mode=True)

        submit_button = self._get_submit_button()
        self.assert_button_enabled(submit_button)  # precondition check
        with patch('drag_and_drop_v2.DragAndDropBlock._drop_item_assessment', Mock(side_effect=delayed_drop_item)):
            item_id = 1
            self.place_item(item_id, MIDDLE_ZONE_ID, wait=False)
            # do not wait for XHR to complete
            self.assert_button_enabled(submit_button, enabled=False)
            self.wait_until_ondrop_xhr_finished(self._get_placed_item_by_value(item_id))

            self.assert_button_enabled(submit_button, enabled=True)

    def test_grade_display(self):
        progress = self._page.find_element_by_css_selector('.problem-progress')
        self.assertEqual(progress.text, '1 point possible (ungraded)')

        items_with_zones = self._get_items_with_zone(self.items_map).values()
        items_without_zones = self._get_items_without_zone(self.items_map).values()
        total_items = len(items_with_zones) + len(items_without_zones)

        # Place items into correct zones one by one:
        for idx, item in enumerate(items_with_zones):
            self.place_item(item.item_id, item.zone_ids[0])
            # The number of items in correct positions currently equals:
            # the number of items already placed + any decoy items which should stay in the bank.
            grade = (idx + 1 + len(items_without_zones)) / float(total_items)
            formatted_grade = '{:.04f}'.format(grade)  # display 4 decimal places
            formatted_grade = re.sub(r'\.?0+$', '', formatted_grade)  # remove trailing zeros
            expected_progress = '{}/1 point (ungraded)'.format(formatted_grade)
            # Selenium does not see the refreshed text unless the text is in view (wtf??), so scroll back up.
            self.scroll_down(pixels=0)
            # Grade does NOT change until we submit.
            self.assertNotEqual(progress.text, expected_progress)
            self.click_submit()
            self.scroll_down(pixels=0)
            self.assertEqual(progress.text, expected_progress)

        # After placing all items, we get the full score.
        self.assertEqual(progress.text, '1/1 point (ungraded)')


class TestMaxItemsPerZoneAssessment(TestMaxItemsPerZone):
    assessment_mode = True

    def _get_scenario_xml(self):
        scenario_data = loader.load_unicode("data/test_zone_align.json")
        return self._make_scenario_xml(data=scenario_data, max_items_per_zone=2, mode=Constants.ASSESSMENT_MODE)

    def test_drop_item_to_same_zone_does_not_show_popup(self):
        """
        Tests that picking item from saturated zone and dropping it back again does not trigger error popup
        """
        zone_id = "Zone Left Align"
        self.place_item(6, zone_id)
        self.place_item(7, zone_id)

        popup = self._get_popup()

        # precondition check - max items placed into zone
        self.assert_placed_item(6, zone_id, assessment_mode=self.assessment_mode)
        self.assert_placed_item(7, zone_id, assessment_mode=self.assessment_mode)

        self.place_item(6, zone_id, Keys.RETURN)
        self.assertFalse(popup.is_displayed())

        self.place_item(7, zone_id, Keys.RETURN)
        self.assertFalse(popup.is_displayed())
