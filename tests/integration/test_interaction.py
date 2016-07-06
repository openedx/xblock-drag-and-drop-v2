# Imports ###########################################################

from ddt import ddt, data, unpack
from mock import Mock, patch

from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys

from workbench.runtime import WorkbenchRuntime
from xblockutils.resources import ResourceLoader

from drag_and_drop_v2.default_data import (
    TOP_ZONE_ID, MIDDLE_ZONE_ID, BOTTOM_ZONE_ID,
    TOP_ZONE_TITLE, MIDDLE_ZONE_TITLE, BOTTOM_ZONE_TITLE,
    ITEM_CORRECT_FEEDBACK, ITEM_INCORRECT_FEEDBACK, ITEM_NO_ZONE_FEEDBACK,
    START_FEEDBACK, FINISH_FEEDBACK
)
from .test_base import BaseIntegrationTest


# Globals ###########################################################

loader = ResourceLoader(__name__)


# Classes ###########################################################

class ItemDefinition(object):
    def __init__(self, item_id, zone_id, zone_title, feedback_positive, feedback_negative):
        self.feedback_negative = feedback_negative
        self.feedback_positive = feedback_positive
        self.zone_id = zone_id
        self.zone_title = zone_title
        self.item_id = item_id


class InteractionTestBase(object):
    @classmethod
    def _get_items_with_zone(cls, items_map):
        return {
            item_key: definition for item_key, definition in items_map.items()
            if definition.zone_id is not None
        }

    @classmethod
    def _get_items_without_zone(cls, items_map):
        return {
            item_key: definition for item_key, definition in items_map.items()
            if definition.zone_id is None
        }

    def setUp(self):
        super(InteractionTestBase, self).setUp()

        scenario_xml = self._get_scenario_xml()
        self._add_scenario(self.PAGE_ID, self.PAGE_TITLE, scenario_xml)

        self._page = self.go_to_page(self.PAGE_TITLE)
        # Resize window so that the entire drag container is visible.
        # Selenium has issues when dragging to an area that is off screen.
        self.browser.set_window_size(1024, 800)

    def _get_item_by_value(self, item_value):
        return self._page.find_elements_by_xpath(".//div[@data-value='{item_id}']".format(item_id=item_value))[0]

    def _get_unplaced_item_by_value(self, item_value):
        items_container = self._page.find_element_by_css_selector('.item-bank')
        return items_container.find_elements_by_xpath(".//div[@data-value='{item_id}']".format(item_id=item_value))[0]

    def _get_placed_item_by_value(self, item_value):
        items_container = self._page.find_element_by_css_selector('.target')
        return items_container.find_elements_by_xpath(".//div[@data-value='{item_id}']".format(item_id=item_value))[0]

    def _get_zone_by_id(self, zone_id):
        zones_container = self._page.find_element_by_css_selector('.target')
        return zones_container.find_elements_by_xpath(".//div[@data-uid='{zone_id}']".format(zone_id=zone_id))[0]

    def _get_dialog_components(self, dialog):  # pylint: disable=no-self-use
        dialog_modal_overlay = dialog.find_element_by_css_selector('.modal-window-overlay')
        dialog_modal = dialog.find_element_by_css_selector('.modal-window')
        return dialog_modal_overlay, dialog_modal

    def _get_dialog_dismiss_button(self, dialog_modal):  # pylint: disable=no-self-use
        return dialog_modal.find_element_by_css_selector('.modal-dismiss-button')

    def _get_zone_position(self, zone_id):
        return self.browser.execute_script(
            'return $("div[data-uid=\'{zone_id}\']").prevAll(".zone").length'.format(zone_id=zone_id)
        )

    def place_item(self, item_value, zone_id, action_key=None):
        if action_key is None:
            self.drag_item_to_zone(item_value, zone_id)
        else:
            self.move_item_to_zone(item_value, zone_id, action_key)

    def drag_item_to_zone(self, item_value, zone_id):
        element = self._get_unplaced_item_by_value(item_value)
        target = self._get_zone_by_id(zone_id)
        action_chains = ActionChains(self.browser)
        action_chains.drag_and_drop(element, target).perform()

    def move_item_to_zone(self, item_value, zone_id, action_key):
        # Get zone position
        zone_position = self._get_zone_position(zone_id)
        # Focus on the item:
        item = self._get_unplaced_item_by_value(item_value)
        ActionChains(self.browser).move_to_element(item).perform()
        # Press the action key:
        item.send_keys(action_key)  # Focus is on first *zone* now
        self.assert_grabbed_item(item)
        for _ in range(zone_position):
            self._page.send_keys(Keys.TAB)
        self._get_zone_by_id(zone_id).send_keys(action_key)

    def assert_grabbed_item(self, item):
        self.assertEqual(item.get_attribute('aria-grabbed'), 'true')

    def assert_placed_item(self, item_value, zone_title):
        item = self._get_placed_item_by_value(item_value)
        self.wait_until_visible(item)
        item_content = item.find_element_by_css_selector('.item-content')
        self.wait_until_visible(item_content)
        item_description = item.find_element_by_css_selector('.sr')
        self.wait_until_visible(item_description)
        item_description_id = '-item-{}-description'.format(item_value)

        self.assertIsNone(item.get_attribute('tabindex'))
        self.assertEqual(item.get_attribute('aria-grabbed'), 'false')
        self.assertEqual(item.get_attribute('data-drag-disabled'), 'true')
        self.assertEqual(item_content.get_attribute('aria-describedby'), item_description_id)
        self.assertEqual(item_description.get_attribute('id'), item_description_id)
        self.assertEqual(item_description.text, 'Correctly placed in: {}'.format(zone_title))

    def assert_reverted_item(self, item_value):
        item = self._get_item_by_value(item_value)
        self.wait_until_visible(item)
        item_content = item.find_element_by_css_selector('.item-content')

        self.assertEqual(item.get_attribute('class'), 'option ui-draggable')
        self.assertEqual(item.get_attribute('tabindex'), '0')
        self.assertEqual(item.get_attribute('draggable'), 'true')
        self.assertEqual(item.get_attribute('aria-grabbed'), 'false')
        self.assertEqual(item.get_attribute('data-drag-disabled'), 'false')
        self.assertIsNone(item_content.get_attribute('aria-describedby'))

        try:
            item.find_element_by_css_selector('.sr')
        except NoSuchElementException:
            pass
        else:
            self.fail('Reverted item should not have .sr description.')

    def assert_decoy_items(self, items_map):
        decoy_items = self._get_items_without_zone(items_map)
        for item_key in decoy_items:
            item = self._get_item_by_value(item_key)

            self.assertEqual(item.get_attribute('class'), 'option fade')
            self.assertEqual(item.get_attribute('aria-grabbed'), 'false')
            self.assertEqual(item.get_attribute('data-drag-disabled'), 'true')

    def parameterized_item_positive_feedback_on_good_move(self, items_map, scroll_down=100, action_key=None):
        popup = self._get_popup()
        feedback_popup_content = self._get_popup_content()

        # Scroll drop zones into view to make sure Selenium can successfully drop items
        self.scroll_down(pixels=scroll_down)

        for definition in self._get_items_with_zone(items_map).values():
            self.place_item(definition.item_id, definition.zone_id, action_key)
            self.wait_until_html_in(definition.feedback_positive, feedback_popup_content)
            self.assertEqual(popup.get_attribute('class'), 'popup')
            self.assert_placed_item(definition.item_id, definition.zone_title)

    def parameterized_item_negative_feedback_on_bad_move(self, items_map, all_zones, scroll_down=100, action_key=None):
        popup = self._get_popup()
        feedback_popup_content = self._get_popup_content()

        # Scroll drop zones into view to make sure Selenium can successfully drop items
        self.scroll_down(pixels=scroll_down)

        for definition in items_map.values():
            for zone in all_zones:
                if zone == definition.zone_id:
                    continue
                self.place_item(definition.item_id, zone, action_key)
                self.wait_until_html_in(definition.feedback_negative, feedback_popup_content)
                self.assertEqual(popup.get_attribute('class'), 'popup popup-incorrect')
                self.assert_reverted_item(definition.item_id)

    def parameterized_final_feedback_and_reset(self, items_map, feedback, scroll_down=100, action_key=None):
        feedback_message = self._get_feedback_message()
        self.assertEqual(self.get_element_html(feedback_message), feedback['intro'])  # precondition check

        items = self._get_items_with_zone(items_map)

        def get_locations():
            return {item_id: self._get_item_by_value(item_id).location for item_id in items.keys()}

        initial_locations = get_locations()

        # Scroll drop zones into view to make sure Selenium can successfully drop items
        self.scroll_down(pixels=scroll_down)

        for item_key, definition in items.items():
            self.place_item(definition.item_id, definition.zone_id, action_key)
            self.assert_placed_item(definition.item_id, definition.zone_title)

        self.wait_until_html_in(feedback['final'], self._get_feedback_message())

        # Check decoy items
        self.assert_decoy_items(items_map)

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

    def interact_with_keyboard_help(self, scroll_down=250, use_keyboard=False):
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

            self._page.send_keys(Keys.ESCAPE)

            self.assertFalse(dialog_modal_overlay.is_displayed())
            self.assertFalse(dialog_modal.is_displayed())

    def _switch_to_block(self, idx):
        """ Only needed if ther eare multiple blocks on the page. """
        self._page = self.browser.find_elements_by_css_selector(self.default_css_selector)[idx]
        self.scroll_down(0)


class DefaultDataTestMixin(object):
    """
    Provides a test scenario with default options.
    """
    PAGE_TITLE = 'Drag and Drop v2'
    PAGE_ID = 'drag_and_drop_v2'

    items_map = {
        0: ItemDefinition(
            0, TOP_ZONE_ID, TOP_ZONE_TITLE,
            ITEM_CORRECT_FEEDBACK.format(zone=TOP_ZONE_TITLE), ITEM_INCORRECT_FEEDBACK
        ),
        1: ItemDefinition(
            1, MIDDLE_ZONE_ID, MIDDLE_ZONE_TITLE,
            ITEM_CORRECT_FEEDBACK.format(zone=MIDDLE_ZONE_TITLE), ITEM_INCORRECT_FEEDBACK
        ),
        2: ItemDefinition(
            2, BOTTOM_ZONE_ID, BOTTOM_ZONE_TITLE,
            ITEM_CORRECT_FEEDBACK.format(zone=BOTTOM_ZONE_TITLE), ITEM_INCORRECT_FEEDBACK
        ),
        3: ItemDefinition(3, None, None, "", ITEM_NO_ZONE_FEEDBACK),
    }

    all_zones = [TOP_ZONE_ID, MIDDLE_ZONE_ID, BOTTOM_ZONE_ID]

    feedback = {
        "intro": START_FEEDBACK,
        "final": FINISH_FEEDBACK,
    }

    def _get_scenario_xml(self):  # pylint: disable=no-self-use
        return "<vertical_demo><drag-and-drop-v2/></vertical_demo>"


class BasicInteractionTest(DefaultDataTestMixin, InteractionTestBase):
    """
    Testing interactions with Drag and Drop XBlock against default data. If default data changes this will break.
    """
    def test_item_positive_feedback_on_good_move(self):
        self.parameterized_item_positive_feedback_on_good_move(self.items_map)

    def test_item_negative_feedback_on_bad_move(self):
        self.parameterized_item_negative_feedback_on_bad_move(self.items_map, self.all_zones)

    def test_final_feedback_and_reset(self):
        self.parameterized_final_feedback_and_reset(self.items_map, self.feedback)

    def test_keyboard_help(self):
        self.interact_with_keyboard_help()


@ddt
class EventsFiredTest(DefaultDataTestMixin, InteractionTestBase, BaseIntegrationTest):
    """
    Tests that the analytics events are fired and in the proper order.
    """
    # These events must be fired in this order.
    scenarios = (
        {
            'name': 'edx.drag_and_drop_v2.loaded',
            'data': {},
        },
        {
            'name': 'edx.drag_and_drop_v2.item.picked_up',
            'data': {'item_id': 0},
        },
        {
            'name': 'grade',
            'data': {'max_value': 1, 'value': (1.0 / 3)},
        },
        {
            'name': 'edx.drag_and_drop_v2.item.dropped',
            'data': {
                'is_correct': True,
                'item_id': 0,
                'location': TOP_ZONE_TITLE,
                'location_id': TOP_ZONE_ID,
            },
        },
        {
            'name': 'edx.drag_and_drop_v2.feedback.opened',
            'data': {
                'content': ITEM_CORRECT_FEEDBACK.format(zone=TOP_ZONE_TITLE),
                'truncated': False,
            },
        },
        {
            'name': 'edx.drag_and_drop_v2.feedback.closed',
            'data': {
                'manually': False,
                'content': ITEM_CORRECT_FEEDBACK.format(zone=TOP_ZONE_TITLE),
                'truncated': False,
            },
        },
    )

    def setUp(self):
        mock = Mock()
        context = patch.object(WorkbenchRuntime, 'publish', mock)
        context.start()
        self.addCleanup(context.stop)
        self.publish = mock
        super(EventsFiredTest, self).setUp()

    def _get_scenario_xml(self):  # pylint: disable=no-self-use
        return "<vertical_demo><drag-and-drop-v2/></vertical_demo>"

    @data(*enumerate(scenarios))  # pylint: disable=star-args
    @unpack
    def test_event(self, index, event):
        self.parameterized_item_positive_feedback_on_good_move(self.items_map)
        dummy, name, published_data = self.publish.call_args_list[index][0]
        self.assertEqual(name, event['name'])
        self.assertEqual(
                published_data, event['data']
        )


@ddt
class KeyboardInteractionTest(BasicInteractionTest, BaseIntegrationTest):
    @data(Keys.RETURN, Keys.SPACE, Keys.CONTROL+'m', Keys.COMMAND+'m')
    def test_item_positive_feedback_on_good_move_with_keyboard(self, action_key):
        self.parameterized_item_positive_feedback_on_good_move(self.items_map, action_key=action_key)

    @data(Keys.RETURN, Keys.SPACE, Keys.CONTROL+'m', Keys.COMMAND+'m')
    def test_item_negative_feedback_on_bad_move_with_keyboard(self, action_key):
        self.parameterized_item_negative_feedback_on_bad_move(self.items_map, self.all_zones, action_key=action_key)

    @data(Keys.RETURN, Keys.SPACE, Keys.CONTROL+'m', Keys.COMMAND+'m')
    def test_final_feedback_and_reset_with_keyboard(self, action_key):
        self.parameterized_final_feedback_and_reset(self.items_map, self.feedback, action_key=action_key)

    def test_keyboard_help(self):
        self.interact_with_keyboard_help(use_keyboard=True)


class CustomDataInteractionTest(BasicInteractionTest, BaseIntegrationTest):
    items_map = {
        0: ItemDefinition(0, 'zone-1', "Zone 1", "Yes 1", "No 1"),
        1: ItemDefinition(1, 'zone-2', "Zone 2", "Yes 2", "No 2"),
        2: ItemDefinition(2, None, None, "", "No Zone for this")
    }

    all_zones = ['zone-1', 'zone-2']

    feedback = {
        "intro": "Some Intro Feed",
        "final": "Some Final Feed"
    }

    def _get_scenario_xml(self):
        return self._get_custom_scenario_xml("data/test_data.json")


class CustomHtmlDataInteractionTest(BasicInteractionTest, BaseIntegrationTest):
    items_map = {
        0: ItemDefinition(0, 'zone-1', 'Zone <i>1</i>', "Yes <b>1</b>", "No <b>1</b>"),
        1: ItemDefinition(1, 'zone-2', 'Zone <b>2</b>', "Yes <i>2</i>", "No <i>2</i>"),
        2: ItemDefinition(2, None, None, "", "No Zone for <i>X</i>")
    }

    all_zones = ['zone-1', 'zone-2']

    feedback = {
        "intro": "Intro <i>Feed</i>",
        "final": "Final <b>Feed</b>"
    }

    def _get_scenario_xml(self):
        return self._get_custom_scenario_xml("data/test_html_data.json")


class MultipleBlocksDataInteraction(InteractionTestBase, BaseIntegrationTest):
    PAGE_TITLE = 'Drag and Drop v2 Multiple Blocks'
    PAGE_ID = 'drag_and_drop_v2_multi'

    BLOCK1_DATA_FILE = "data/test_data.json"
    BLOCK2_DATA_FILE = "data/test_data_other.json"

    item_maps = {
        'block1': {
            0: ItemDefinition(0, 'zone-1', 'Zone 1', "Yes 1", "No 1"),
            1: ItemDefinition(1, 'zone-2', 'Zone 2', "Yes 2", "No 2"),
            2: ItemDefinition(2, None, None, "", "No Zone for this")
        },
        'block2': {
            10: ItemDefinition(10, 'zone-51', 'Zone 51', "Correct 1", "Incorrect 1"),
            20: ItemDefinition(20, 'zone-52', 'Zone 52', "Correct 2", "Incorrect 2"),
            30: ItemDefinition(30, None, None, "", "No Zone for this")
        },
    }

    all_zones = {
        'block1': ['zone-1', 'zone-2'],
        'block2': ['zone-51', 'zone-52']
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
        self.parameterized_item_positive_feedback_on_good_move(self.item_maps['block2'], scroll_down=900)

    def test_item_negative_feedback_on_bad_move(self):
        self._switch_to_block(0)
        self.parameterized_item_negative_feedback_on_bad_move(self.item_maps['block1'], self.all_zones['block1'])
        self._switch_to_block(1)
        self.parameterized_item_negative_feedback_on_bad_move(
            self.item_maps['block2'], self.all_zones['block2'], scroll_down=900
        )

    def test_final_feedback_and_reset(self):
        self._switch_to_block(0)
        self.parameterized_final_feedback_and_reset(self.item_maps['block1'], self.feedback['block1'])
        self._switch_to_block(1)
        self.parameterized_final_feedback_and_reset(self.item_maps['block2'], self.feedback['block2'], scroll_down=900)

    def test_keyboard_help(self):
        self._switch_to_block(0)
        # Test mouse and keyboard interaction
        self.interact_with_keyboard_help()
        self.interact_with_keyboard_help(use_keyboard=True)

        self._switch_to_block(1)
        # Test mouse and keyboard interaction
        self.interact_with_keyboard_help(scroll_down=900)
        self.interact_with_keyboard_help(scroll_down=0, use_keyboard=True)


@ddt
class ZoneAlignInteractionTest(InteractionTestBase, BaseIntegrationTest):
    """
    Verifying Drag and Drop XBlock interactions using zone alignment.
    """
    PAGE_TITLE = 'Drag and Drop v2'
    PAGE_ID = 'drag_and_drop_v2'
    ACTION_KEYS = (None, Keys.RETURN, Keys.SPACE, Keys.CONTROL+'m', Keys.COMMAND+'m')

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

        # Center-aligned items are display block
        if align == 'center':
            self.assertEquals(self._get_style(zone_item_selector, 'display'), 'block')
        # but other aligned items are just inline-block
        else:
            self.assertEquals(self._get_style(zone_item_selector, 'display'), 'inline-block')

    def test_no_zone_align(self):
        """
        Test items placed in a zone with no align setting.
        Ensure that they are children of div.target, not the zone.
        """
        zone_id = "Zone No Align"
        self.place_item(0, zone_id)
        zone_item_selector = "div[data-uid='{zone_id}'] .item-wrapper .option".format(zone_id=zone_id)
        self.assertEquals(len(self._page.find_elements_by_css_selector(zone_item_selector)), 0)

        target_item_selector = '.target > .option'
        placed_items = self._page.find_elements_by_css_selector(target_item_selector)
        self.assertEquals(len(placed_items), 1)
        self.assertEquals(placed_items[0].get_attribute('data-value'), '0')

        # Non-aligned items are absolute positioned, with top/bottom set to px
        self.assertEquals(self._get_style(target_item_selector, 'position'), 'absolute')
        self.assertRegexpMatches(self._get_style(target_item_selector, 'left'), r'^\d+(\.\d+)?px$')
        self.assertRegexpMatches(self._get_style(target_item_selector, 'top'), r'^\d+(\.\d+)?px$')

    @data(
        ([3, 4, 5], "Zone Invalid Align", "start"),
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
