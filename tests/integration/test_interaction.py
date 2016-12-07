# pylint: disable=too-many-lines
# -*- coding: utf-8 -*-

# Imports ###########################################################

from ddt import ddt, data, unpack
import re

from selenium.common.exceptions import WebDriverException
from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from xblockutils.resources import ResourceLoader

from tests.integration.test_base import (
    DefaultDataTestMixin, InteractionTestBase, ItemDefinition
)
from .test_base import BaseIntegrationTest

# Globals ###########################################################

loader = ResourceLoader(__name__)

# Classes ###########################################################

ITEM_DRAG_KEYBOARD_KEYS = (None, Keys.RETURN, Keys.CONTROL+'m')


class ParameterizedTestsMixin(object):
    def parameterized_item_positive_feedback_on_good_move(
            self, items_map, scroll_down=100, action_key=None, assessment_mode=False
    ):
        popup = self._get_popup()
        feedback_popup_content = self._get_popup_content()

        # Scroll drop zones into view to make sure Selenium can successfully drop items
        self.scroll_down(pixels=scroll_down)

        for definition in self._get_items_with_zone(items_map).values():
            self.place_item(definition.item_id, definition.zone_ids[0], action_key)
            self.wait_until_ondrop_xhr_finished(self._get_item_by_value(definition.item_id))
            self.assert_placed_item(definition.item_id, definition.zone_title, assessment_mode=assessment_mode)
            feedback_popup_html = feedback_popup_content.get_attribute('innerHTML')
            if assessment_mode:
                self.assertEqual(feedback_popup_html, '')
                self.assertFalse(popup.is_displayed())
            else:
                self.assertEqual(feedback_popup_html, "<p>{}</p>".format(definition.feedback_positive))
                self.assert_popup_correct(popup)
                self.assertTrue(popup.is_displayed())

    def parameterized_item_negative_feedback_on_bad_move(
            self, items_map, all_zones, scroll_down=100, action_key=None, assessment_mode=False
    ):
        popup = self._get_popup()
        feedback_popup_content = self._get_popup_content()

        # Scroll drop zones into view to make sure Selenium can successfully drop items
        self.scroll_down(pixels=scroll_down)

        for definition in items_map.values():
            # Get first zone that is not correct for this item.
            zone_id = None
            zone_title = None
            for z_id, z_title in all_zones:
                if z_id not in definition.zone_ids:
                    zone_id = z_id
                    zone_title = z_title
                    break
            if zone_id is not None:  # Some items may be placed in any zone, ignore those.
                self.place_item(definition.item_id, zone_id, action_key)
                if assessment_mode:
                    self.wait_until_ondrop_xhr_finished(self._get_item_by_value(definition.item_id))
                    feedback_popup_html = feedback_popup_content.get_attribute('innerHTML')
                    self.assertEqual(feedback_popup_html, '')
                    self.assertFalse(popup.is_displayed())
                    self.assert_placed_item(definition.item_id, zone_title, assessment_mode=True)
                else:
                    self.wait_until_html_in(definition.feedback_negative, feedback_popup_content)
                    self.assert_popup_incorrect(popup)
                    self.assertTrue(popup.is_displayed())
                    self.assert_reverted_item(definition.item_id)

    def parameterized_move_items_between_zones(self, items_map, all_zones, scroll_down=100, action_key=None):
        # Scroll drop zones into view to make sure Selenium can successfully drop items
        self.scroll_down(pixels=scroll_down)

        # Take each item, place it into first zone, then continue moving it until it has visited all zones.
        for item_key in items_map.keys():
            for zone_id, zone_title in all_zones:
                self.place_item(item_key, zone_id, action_key)
                self.assert_placed_item(item_key, zone_title, assessment_mode=True)
            # Finally, move them all back to the bank.
            self.place_item(item_key, None, action_key)
            self.assert_reverted_item(item_key)

    def parameterized_cannot_move_items_between_zones(self, items_map, all_zones, scroll_down=100, action_key=None):
        # Scroll drop zones into view to make sure Selenium can successfully drop items
        self.scroll_down(pixels=scroll_down)

        # Take each item an assigned zone, place it into the correct zone, then ensure it cannot be moved to other.
        # zones or back to the bank.
        for item_key, definition in items_map.items():
            if definition.zone_ids:  # skip decoy items
                self.place_item(definition.item_id, definition.zone_ids[0], action_key)
                self.assert_placed_item(definition.item_id, definition.zone_title, assessment_mode=False)
                if action_key:
                    item = self._get_item_by_value(definition.item_id)
                    # When using the keyboard, ensure that dropped items cannot get "grabbed".
                    # Assert item has no tabindex.
                    self.assertIsNone(item.get_attribute('tabindex'))
                    # Focus on the item, then press the action key:
                    ActionChains(self.browser).move_to_element(item).send_keys(action_key).perform()
                    # Assert item is not grabbed.
                    self.assertEqual(item.get_attribute('aria-grabbed'), 'false')
                else:
                    # When using the mouse, try to drag items and observe it doesn't work.
                    for zone_id, _zone_title in all_zones:
                        if zone_id not in definition.zone_ids:
                            self.place_item(item_key, zone_id, action_key)
                            self.assert_placed_item(definition.item_id, definition.zone_title, assessment_mode=False)
                        # Finally, try to move item back to the bank.
                        self.place_item(item_key, None, action_key)
                        self.assert_placed_item(definition.item_id, definition.zone_title, assessment_mode=False)

    def parameterized_final_feedback_and_reset(
            self, items_map, feedback, scroll_down=100, action_key=None, assessment_mode=False
    ):
        feedback_message = self._get_feedback_message()
        self.assertEqual(self.get_element_html(feedback_message), feedback['intro'])  # precondition check

        items = self._get_items_with_zone(items_map)

        def get_locations():
            return {item_id: self._get_item_by_value(item_id).location for item_id in items.keys()}

        initial_locations = get_locations()

        # Scroll drop zones into view to make sure Selenium can successfully drop items
        self.scroll_down(pixels=scroll_down)

        for item_key, definition in items.items():
            self.place_item(definition.item_id, definition.zone_ids[0], action_key)
            self.assert_placed_item(definition.item_id, definition.zone_title, assessment_mode=assessment_mode)

        if assessment_mode:
            # In assessment mode we also place decoy items onto the board,
            # to make sure they are correctly reverted back to the bank on problem reset.
            self.place_decoy_items(items_map, action_key)
        else:
            self.wait_until_html_in(feedback['final'], self._get_feedback_message())

        # Check decoy items
        self.assert_decoy_items(items_map, assessment_mode=assessment_mode)

        # Scroll "Reset problem" button into view to make sure Selenium can successfully click it
        self.scroll_down(pixels=scroll_down+150)

        reset = self._get_reset_button()
        if action_key is not None:  # Using keyboard to interact with block
            reset.send_keys(Keys.RETURN)
        else:
            reset.click()

        self.wait_until_html_in(feedback['intro'], self._get_feedback_message())

        locations_after_reset = get_locations()
        for item_key in items.keys():
            self.assertDictEqual(locations_after_reset[item_key], initial_locations[item_key])
            self.assert_reverted_item(item_key)

    def interact_with_keyboard_help(self, scroll_down=100, use_keyboard=False):
        keyboard_help_button = self._get_keyboard_help_button()
        keyboard_help_dialog = self._get_keyboard_help_dialog()
        dialog_modal_overlay, dialog_modal = self._get_dialog_components(keyboard_help_dialog)
        dialog_dismiss_button = self._get_dialog_dismiss_button(dialog_modal)

        # Scroll "Keyboard help" button into view to make sure Selenium can successfully click it
        self.scroll_down(pixels=scroll_down)

        if use_keyboard:
            keyboard_help_button.send_keys(Keys.RETURN)
        else:
            keyboard_help_button.click()

        self.assertTrue(dialog_modal_overlay.is_displayed())
        self.assertTrue(dialog_modal.is_displayed())

        if use_keyboard:
            dialog_dismiss_button.send_keys(Keys.RETURN)
        else:
            dialog_dismiss_button.click()

        self.assertFalse(dialog_modal_overlay.is_displayed())
        self.assertFalse(dialog_modal.is_displayed())

        if use_keyboard:  # Check if "Keyboard Help" dialog can be dismissed using "ESC"
            keyboard_help_button.send_keys(Keys.RETURN)

            self.assertTrue(dialog_modal_overlay.is_displayed())
            self.assertTrue(dialog_modal.is_displayed())

            ActionChains(self.browser).send_keys(Keys.ESCAPE).perform()

            self.assertFalse(dialog_modal_overlay.is_displayed())
            self.assertFalse(dialog_modal.is_displayed())


@ddt
class StandardInteractionTest(DefaultDataTestMixin, InteractionTestBase, ParameterizedTestsMixin, BaseIntegrationTest):
    """
    Testing interactions with Drag and Drop XBlock against default data.
    All interactions are tested using mouse (action_key=None) and four different keyboard action keys.
    If default data changes this will break.
    """
    @data(*ITEM_DRAG_KEYBOARD_KEYS)
    def test_item_positive_feedback_on_good_move(self, action_key):
        self.parameterized_item_positive_feedback_on_good_move(self.items_map, action_key=action_key)

    @data(*ITEM_DRAG_KEYBOARD_KEYS)
    def test_item_negative_feedback_on_bad_move(self, action_key):
        self.parameterized_item_negative_feedback_on_bad_move(self.items_map, self.all_zones, action_key=action_key)

    @data(*ITEM_DRAG_KEYBOARD_KEYS)
    def test_cannot_move_items_between_zones(self, action_key):
        self.parameterized_cannot_move_items_between_zones(
            self.items_map, self.all_zones, action_key=action_key
        )

    def test_alt_text_image(self):
        target_img = self._page.find_element_by_css_selector('.target-img')
        alt_text = target_img.get_attribute('alt')
        items_container = self._page.find_element_by_css_selector('.target')
        if items_container.get_attribute('aria-describedby'):
            self.assertEqual(items_container.get_attribute('aria-describedby').text, alt_text)

    def test_alt_text_keyboard_help_over_item(self):
        for _, definition in self.items_map.items():
            item = self._get_unplaced_item_by_value(definition.item_id)
            ActionChains(self.browser).move_to_element(item).perform()
            self.assertEqual(item.find_element_by_css_selector('.sr.draggable').text, ", draggable")
            item.send_keys("")
            item.send_keys(Keys.ENTER)  # grabbed an item
            self.assertEqual(item.find_element_by_css_selector('.sr.draggable').text, ", draggable, grabbed")
            item.send_keys(Keys.ESCAPE)
            self.assertEqual(item.find_element_by_css_selector('.sr.draggable').text, ", draggable")

    def test_alt_text_for_zones(self):
        self._get_popup()
        self._get_popup_content()
        self.scroll_down(pixels=100)

        # Place all items in zones where they belong
        for definition in self._get_items_with_zone(self.items_map).values():
            self.place_item(definition.item_id, definition.zone_ids[0])

        # Check if alt text appears for that item when the user tabs over the zone
        for zone_id, items_dict in self._get_items_by_zone(self.items_map).items():
            if zone_id is None:
                continue
            zone = self._get_zone_by_id(zone_id)
            zone_description = zone.find_element_by_id(zone.get_attribute('aria-describedby')).text

            # Iterate over all items placed in that zone and save a list of their descriptions
            for _, definition in items_dict.items():
                item = self._get_placed_item_by_value(definition.item_id)
                self.wait_until_visible(item)
                item_content = item.find_element_by_css_selector('.item-content')
                self.wait_until_visible(item_content)
                self.assertTrue(item_content.text in zone_description)

    @data(*ITEM_DRAG_KEYBOARD_KEYS)
    def test_final_feedback_and_reset(self, action_key):
        self.parameterized_final_feedback_and_reset(self.items_map, self.feedback, action_key=action_key)

    @data(False, True)
    def test_keyboard_help(self, use_keyboard):
        self.interact_with_keyboard_help(use_keyboard=use_keyboard)

    def test_grade_display(self):
        items_with_zones = self._get_items_with_zone(self.items_map).values()
        items_without_zones = self._get_items_without_zone(self.items_map).values()
        total_items = len(items_with_zones) + len(items_without_zones)

        progress = self._page.find_element_by_css_selector('.problem-progress')
        self.assertEqual(progress.text, '1 point possible (ungraded)')

        # Place items into correct zones one by one:
        for idx, item in enumerate(items_with_zones):
            self.place_item(item.item_id, item.zone_ids[0])
            # The number of items in correct positions currently equals:
            # the number of items already placed + any decoy items which should stay in the bank.
            grade = (idx + 1 + len(items_without_zones)) / float(total_items)
            formatted_grade = '{:.04f}'.format(grade)  # display 4 decimal places
            formatted_grade = re.sub(r'\.?0+$', '', formatted_grade)  # remove trailing zeros
            # Selenium does not see the refreshed text unless the text is in view (wtf??), so scroll back up.
            self.scroll_down(pixels=0)
            self.assertEqual(progress.text, '{}/1 point (ungraded)'.format(formatted_grade))

        # After placing all items, we get the full score.
        self.assertEqual(progress.text, '1/1 point (ungraded)')


class MultipleValidOptionsInteractionTest(DefaultDataTestMixin, InteractionTestBase, BaseIntegrationTest):

    items_map = {
        0: ItemDefinition(
            0,
            "Item",
            "",
            ['zone-1', 'zone-2'],
            ["Zone 1", "Zone 2"],
            ["Yes 1", "Yes 1"],
            ["No 1", "No 1"]
        ),
    }

    def test_multiple_positive_feedback(self):
        popup = self._get_popup()
        feedback_popup_content = self._get_popup_content()
        reset = self._get_reset_button()
        self.scroll_down(pixels=100)

        for item in self.items_map.values():
            for i, zone in enumerate(item.zone_ids):
                self.place_item(item.item_id, zone, None)
                self.wait_until_html_in(item.feedback_positive[i], feedback_popup_content)
                self.assert_popup_correct(popup)
                self.assert_placed_item(item.item_id, item.zone_title[i])
                reset.click()
                self.wait_until_disabled(reset)

    def _get_scenario_xml(self):
        return self._get_custom_scenario_xml("data/test_multiple_options_data.json")


class PreventSpaceBarScrollTest(DefaultDataTestMixin, InteractionTestBase, BaseIntegrationTest):
    """"
    Test that browser default page down action is prevented when pressing the space bar while
    any zone is focused.
    """
    def get_scroll(self):
        return self.browser.execute_script('return $(window).scrollTop()')

    def hit_spacebar(self):
        """ Send a spacebar event to the page/browser """
        try:
            self._page.send_keys(Keys.SPACE)  # Firefox (chrome doesn't allow sending keys to non-focusable elements)
        except WebDriverException:
            ActionChains(self.browser).send_keys(Keys.SPACE).perform()  # Chrome (Firefox types this into the URL bar)

    def test_space_bar_scroll(self):
        # Window should not be scrolled at first.
        self.assertEqual(self.get_scroll(), 0)
        # Pressing space bar while no zone is focused should scroll the window down (default browser action).
        self.hit_spacebar()
        # Window should be scrolled down a bit.
        wait = WebDriverWait(self, 2)
        # While the XHR is in progress, a spinner icon is shown inside the item.
        # When the spinner disappears, we can assume that the XHR request has finished.
        wait.until(lambda s: s.get_scroll() > 0)
        # Scroll the window back.
        self.scroll_down(pixels=0)
        self.assertEqual(self.get_scroll(), 0)
        # Now press Space while one of the zones is focused.
        zone = self._get_zone_by_id(self.all_zones[0][0])
        zone.send_keys(Keys.SPACE)
        # No scrolling should occur.
        self.assertEqual(self.get_scroll(), 0)


class CustomDataInteractionTest(StandardInteractionTest):
    items_map = {
        0: ItemDefinition(0, "Item 0", "", ['zone-1'], "Zone 1", "Yes 1", "No 1"),
        1: ItemDefinition(1, "Item 1", "", ['zone-2'], "Zone 2", "Yes 2", "No 2"),
        2: ItemDefinition(2, "Item 2", "", [], None, "", "No Zone for this")
    }

    all_zones = [('zone-1', 'Zone 1'), ('zone-2', 'Zone 2')]

    feedback = {
        "intro": "Some Intro Feed",
        "final": "Some Final Feed"
    }

    def _get_scenario_xml(self):
        return self._get_custom_scenario_xml("data/test_data.json")


class CustomHtmlDataInteractionTest(StandardInteractionTest):
    items_map = {
        0: ItemDefinition(0, "Item 0", "", ['zone-1'], 'Zone <i>1</i>', "Yes <b>1</b>", "No <b>1</b>"),
        1: ItemDefinition(1, "Item 1", "", ['zone-2'], 'Zone <b>2</b>', "Yes <i>2</i>", "No <i>2</i>"),
        2: ItemDefinition(2, "Item 2", "", [], None, "", "No Zone for <i>X</i>")
    }

    all_zones = [('zone-1', 'Zone 1'), ('zone-2', 'Zone 2')]

    feedback = {
        "intro": "Intro <i>Feed</i>",
        "final": "Final <b>Feed</b>"
    }

    def _get_scenario_xml(self):
        return self._get_custom_scenario_xml("data/test_html_data.json")


class MultipleBlocksDataInteraction(ParameterizedTestsMixin, InteractionTestBase, BaseIntegrationTest):
    PAGE_TITLE = 'Drag and Drop v2 Multiple Blocks'
    PAGE_ID = 'drag_and_drop_v2_multi'

    BLOCK1_DATA_FILE = "data/test_data.json"
    BLOCK2_DATA_FILE = "data/test_data_other.json"

    item_maps = {
        'block1': {
            0: ItemDefinition(0, "Item 0", "", ['zone-1'], 'Zone 1', "Yes 1", "No 1"),
            1: ItemDefinition(1, "Item 1", "", ['zone-2'], 'Zone 2', "Yes 2", "No 2"),
            2: ItemDefinition(2, "Item 2", "", [], None, "", "No Zone for this")
        },
        'block2': {
            10: ItemDefinition(10, "Item 10", "", ['zone-51'], 'Zone 51', "Correct 1", "Incorrect 1"),
            20: ItemDefinition(20, "Item 20", "", ['zone-52'], 'Zone 52', "Correct 2", "Incorrect 2"),
            30: ItemDefinition(30, "Item 30", "", [], None, "", "No Zone for this")
        },
    }

    all_zones = {
        'block1': [('zone-1', 'Zone 1'), ('zone-2', 'Zone 2')],
        'block2': [('zone-51', 'Zone 51'), ('zone-52', 'Zone 52')]
    }

    feedback = {
        'block1': {"intro": "Some Intro Feed", "final": "Some Final Feed"},
        'block2': {"intro": "Other Intro Feed", "final": "Other Final Feed"},
    }

    def _get_scenario_xml(self):
        blocks_xml = "\n".join([
            "<drag-and-drop-v2 data='{data}'/>".format(data=loader.load_unicode(filename))
            for filename in (self.BLOCK1_DATA_FILE, self.BLOCK2_DATA_FILE)
        ])

        return "<vertical_demo>{dnd_blocks}</vertical_demo>".format(dnd_blocks=blocks_xml)

    def test_item_positive_feedback_on_good_move(self):
        self._switch_to_block(0)
        self.parameterized_item_positive_feedback_on_good_move(self.item_maps['block1'])
        self._switch_to_block(1)
        self.parameterized_item_positive_feedback_on_good_move(self.item_maps['block2'], scroll_down=1000)

    def test_item_negative_feedback_on_bad_move(self):
        self._switch_to_block(0)
        self.parameterized_item_negative_feedback_on_bad_move(self.item_maps['block1'], self.all_zones['block1'])
        self._switch_to_block(1)
        self.parameterized_item_negative_feedback_on_bad_move(
            self.item_maps['block2'], self.all_zones['block2'], scroll_down=1000
        )

    def test_final_feedback_and_reset(self):
        self._switch_to_block(0)
        self.parameterized_final_feedback_and_reset(self.item_maps['block1'], self.feedback['block1'])
        self._switch_to_block(1)
        self.parameterized_final_feedback_and_reset(self.item_maps['block2'], self.feedback['block2'], scroll_down=1000)

    def test_keyboard_help(self):
        self._switch_to_block(0)
        # Test mouse and keyboard interaction
        self.interact_with_keyboard_help()
        self.interact_with_keyboard_help(use_keyboard=True)

        self._switch_to_block(1)
        # Test mouse and keyboard interaction
        self.interact_with_keyboard_help(scroll_down=1000)
        self.interact_with_keyboard_help(scroll_down=0, use_keyboard=True)


@ddt
class ZoneAlignInteractionTest(InteractionTestBase, BaseIntegrationTest):
    """
    Verifying Drag and Drop XBlock interactions using zone alignment.
    """
    PAGE_TITLE = 'Drag and Drop v2'
    PAGE_ID = 'drag_and_drop_v2'
    ACTION_KEYS = ITEM_DRAG_KEYBOARD_KEYS

    def setUp(self):
        super(ZoneAlignInteractionTest, self).setUp()

    def _get_scenario_xml(self):
        return self._get_custom_scenario_xml("data/test_zone_align.json")

    def _assert_zone_align_item(self, item_id, zone_id, align, action_key=None):
        """
        Test items placed in a zone with the given align setting.
        Ensure that they are children of the zone.
        """
        # parent container has the expected alignment
        item_wrapper_selector = "div[data-uid='{zone_id}'] .item-wrapper".format(zone_id=zone_id)
        self.assertEquals(self._get_style(item_wrapper_selector, 'textAlign'), align)

        # Items placed in zones with align setting are children of the zone
        zone_item_selector = '{item_wrapper_selector} .option'.format(item_wrapper_selector=item_wrapper_selector)
        prev_placed_items = self._page.find_elements_by_css_selector(zone_item_selector)

        self.place_item(item_id, zone_id, action_key)
        placed_items = self._page.find_elements_by_css_selector(zone_item_selector)
        self.assertEquals(len(placed_items), len(prev_placed_items) + 1)

        # Not children of the target
        target_item = '.target > .option'
        self.assertEquals(len(self._page.find_elements_by_css_selector(target_item)), 0)

        # Aligned items are relative positioned, with no transform or top/left
        self.assertEquals(self._get_style(zone_item_selector, 'position'), 'relative')
        self.assertEquals(self._get_style(zone_item_selector, 'transform'), 'none')
        self.assertEquals(self._get_style(zone_item_selector, 'left'), '0px')
        self.assertEquals(self._get_style(zone_item_selector, 'top'), '0px')

        self.assertEquals(self._get_style(zone_item_selector, 'display'), 'inline-block')

    @data(
        ([0, 1, 2], "Zone No Align", "center"),
        ([3, 4, 5], "Zone Invalid Align", "center"),
        ([6, 7, 8], "Zone Left Align", "left"),
        ([9, 10, 11], "Zone Right Align", "right"),
        ([12, 13, 14], "Zone Center Align", "center"),
    )
    @unpack
    def test_zone_align(self, items, zone, alignment):
        reset = self._get_reset_button()
        for item in items:
            for action_key in self.ACTION_KEYS:
                self._assert_zone_align_item(item, zone, alignment, action_key)
                # Reset exercise
                self.scroll_down(pixels=200)
                reset.click()
                self.scroll_down(pixels=0)
                self.wait_until_disabled(reset)


class TestMaxItemsPerZone(InteractionTestBase, BaseIntegrationTest):
    """
    Tests for max items per dropzone feature
    """
    PAGE_TITLE = 'Drag and Drop v2'
    PAGE_ID = 'drag_and_drop_v2'

    assessment_mode = False

    def _get_scenario_xml(self):
        scenario_data = loader.load_unicode("data/test_zone_align.json")
        return self._make_scenario_xml(data=scenario_data, max_items_per_zone=2)

    def test_item_returned_to_bank(self):
        """
        Tests that an item is returned to bank if max items per zone reached
        """
        zone_id = "Zone No Align"
        self.place_item(0, zone_id)
        self.place_item(1, zone_id)

        # precondition check - max items placed into zone
        self.assert_placed_item(0, zone_id, assessment_mode=self.assessment_mode)
        self.assert_placed_item(1, zone_id, assessment_mode=self.assessment_mode)

        self.place_item(2, zone_id)

        self.assert_reverted_item(2)
        feedback_popup = self._get_popup()
        self.assertTrue(feedback_popup.is_displayed())

        feedback_popup_content = self._get_popup_content()
        self.assertIn(
            "You cannot add any more items to this zone.",
            feedback_popup_content.get_attribute('innerHTML')
        )

    def test_item_returned_to_bank_after_refresh(self):
        """
        Tests that an item returned to the bank stays there after page refresh
        """
        zone_id = "Zone Left Align"
        self.place_item(6, zone_id)
        self.place_item(7, zone_id)

        # precondition check - max items placed into zone
        self.assert_placed_item(6, zone_id, assessment_mode=self.assessment_mode)
        self.assert_placed_item(7, zone_id, assessment_mode=self.assessment_mode)

        self.place_item(8, zone_id)

        self.assert_reverted_item(8)

        self._page = self.go_to_page(self.PAGE_TITLE)  # refresh the page

        self.assert_placed_item(6, zone_id, assessment_mode=self.assessment_mode)
        self.assert_placed_item(7, zone_id, assessment_mode=self.assessment_mode)
        self.assert_reverted_item(8)
