from ddt import ddt, data

from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys

from drag_and_drop_v2.default_data import (
    TOP_ZONE_TITLE, MIDDLE_ZONE_TITLE, BOTTOM_ZONE_TITLE,
    ITEM_CORRECT_FEEDBACK, ITEM_INCORRECT_FEEDBACK, ITEM_NO_ZONE_FEEDBACK,
    START_FEEDBACK, FINISH_FEEDBACK
)
from .test_base import BaseIntegrationTest
from ..utils import load_resource


ZONES_MAP = {
    0: TOP_ZONE_TITLE,
    1: MIDDLE_ZONE_TITLE,
    2: BOTTOM_ZONE_TITLE,
}


class ItemDefinition(object):
    def __init__(self, item_id, zone_id, feedback_positive, feedback_negative, input_value=None):
        self.feedback_negative = feedback_negative
        self.feedback_positive = feedback_positive
        self.zone_id = zone_id
        self.item_id = item_id
        self.input = input_value


class InteractionTestBase(object):
    @classmethod
    def _get_correct_item_for_zone(cls, items_map):
        return {
            item_key: definition for item_key, definition in items_map.items()
            if definition.zone_id is not None
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
        items_container = self._page.find_element_by_css_selector('.item-bank')
        return items_container.find_elements_by_xpath("//div[@data-value='{item_id}']".format(item_id=item_value))[0]

    def _get_placed_item_by_value(self, item_value):
        items_container = self._page.find_element_by_css_selector('.target')
        return items_container.find_elements_by_xpath("//div[@data-value='{item_id}']".format(item_id=item_value))[0]

    def _get_zone_by_id(self, zone_id):
        zones_container = self._page.find_element_by_css_selector('.target')
        return zones_container.find_elements_by_xpath("//div[@data-zone='{zone_id}']".format(zone_id=zone_id))[0]

    def _get_input_div_by_value(self, item_value):
        element = self._get_item_by_value(item_value)
        return element.find_element_by_class_name('numerical-input')

    def _send_input(self, item_value, value):
        element = self._get_item_by_value(item_value)
        self.wait_until_visible(element)
        element.find_element_by_class_name('input').send_keys(value)
        element.find_element_by_class_name('submit-input').click()

    def get_feedback_popup(self):
        return self._page.find_element_by_css_selector(".popup-content")

    def get_reset_button(self):
        return self._page.find_element_by_css_selector('.reset-button')

    def drag_item_to_zone(self, item_value, zone_id):
        element = self._get_item_by_value(item_value)
        target = self._get_zone_by_id(zone_id)
        action_chains = ActionChains(self.browser)
        action_chains.drag_and_drop(element, target).perform()

    def move_item_to_zone(self, item_value, zone_id, action_key):
        # Get item position
        item_position = item_value
        # Get zone position
        zone_position = self.get_zone_position(zone_id)

        self.focus_item(0)
        focused_item = self._get_item_by_value(0)
        for i in range(item_position):
            focused_item.send_keys(Keys.TAB)
            focused_item = self._get_item_by_value(i+1)
        focused_item.send_keys(action_key)  # Focus is on first *zone* now
        focused_zone = self._get_zone_by_id(ZONES_MAP[0])
        for i in range(zone_position):
            focused_zone.send_keys(Keys.TAB)
            focused_zone = self._get_zone_by_id(ZONES_MAP[i+1])
        focused_zone.send_keys(action_key)

    def get_zone_position(self, zone_id):
        return self.browser.execute_script(
            'return $("div[data-zone=\'{zone_id}\']").prevAll(".zone").length'.format(zone_id=zone_id)
        )

    def focus_item(self, item_position):
        self.browser.execute_script("$('.option:nth-child({n})').focus()".format(n=item_position+1))

    def assert_placed_item(self, item_value, zone_id):
        item = self._get_placed_item_by_value(item_value)
        item_content = item.find_element_by_css_selector('.item-content')
        item_description = item.find_element_by_css_selector('.sr')
        item_description_id = 'item-{}-description'.format(item_value)

        self.assertIsNone(item.get_attribute('tabindex'))
        self.assertEqual(item.get_attribute('aria-grabbed'), 'false')
        self.assertEqual(item.get_attribute('data-drag-disabled'), 'true')
        self.assertEqual(item_content.get_attribute('aria-describedby'), item_description_id)
        self.assertEqual(item_description.get_attribute('id'), item_description_id)
        self.assertEqual(item_description.text, 'Correctly placed in: {}'.format(zone_id))

    def assert_reverted_item(self, item_value):
        item = self._get_item_by_value(item_value)
        item_content = item.find_element_by_css_selector('.item-content')

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

    def parameterized_item_positive_feedback_on_good_move(
        self, items_map, scroll_down=100, use_keyboard=False, action_key=Keys.RETURN
    ):
        # Scroll drop zones into view to make sure Selenium can successfully drop items
        self.scroll_down(pixels=scroll_down)

        for definition in self._get_correct_item_for_zone(items_map).values():
            if not definition.input:
                if use_keyboard:
                    self.move_item_to_zone(definition.item_id, definition.zone_id, action_key)
                else:
                    self.drag_item_to_zone(definition.item_id, definition.zone_id)
                feedback_popup = self.get_feedback_popup()
                self.wait_until_html_in(definition.feedback_positive, feedback_popup)
                self.assert_placed_item(definition.item_id, definition.zone_id)

    def parameterized_item_positive_feedback_on_good_input(
        self, items_map, scroll_down=100, use_keyboard=False, action_key=Keys.RETURN
    ):
        self.scroll_down(pixels=scroll_down)
        feedback_popup = self.get_feedback_popup()
        for definition in self._get_correct_item_for_zone(items_map).values():
            if definition.input:
                if use_keyboard:
                    self.move_item_to_zone(definition.item_id, definition.zone_id, action_key)
                else:
                    self.drag_item_to_zone(definition.item_id, definition.zone_id)
                self._send_input(definition.item_id, definition.input)
                input_div = self._get_input_div_by_value(definition.item_id)
                self.wait_until_has_class('correct', input_div)
                self.wait_until_html_in(definition.feedback_positive, feedback_popup)
                self.assert_placed_item(definition.item_id, definition.zone_id)

    def parameterized_item_negative_feedback_on_bad_move(
        self, items_map, all_zones, scroll_down=100, use_keyboard=False, action_key=Keys.RETURN
    ):
        feedback_popup = self.get_feedback_popup()

        # Scroll drop zones into view to make sure Selenium can successfully drop items
        self.scroll_down(pixels=scroll_down)

        for definition in items_map.values():
            for zone in all_zones:
                if zone == definition.zone_id:
                    continue
                if use_keyboard:
                    self.move_item_to_zone(definition.item_id, zone, action_key)
                else:
                    self.drag_item_to_zone(definition.item_id, zone)
                self.wait_until_html_in(definition.feedback_negative, feedback_popup)
                self.assert_reverted_item(definition.item_id)

    def parameterized_item_negative_feedback_on_bad_input(
        self, items_map, scroll_down=100, use_keyboard=False, action_key=Keys.RETURN
    ):
        feedback_popup = self.get_feedback_popup()

        # Scroll drop zones into view to make sure Selenium can successfully drop items
        self.scroll_down(pixels=scroll_down)

        for definition in self._get_correct_item_for_zone(items_map).values():
            if definition.input:
                if use_keyboard:
                    self.move_item_to_zone(definition.item_id, definition.zone_id, action_key)
                else:
                    self.drag_item_to_zone(definition.item_id, definition.zone_id)
                self._send_input(definition.item_id, '1999999')
                input_div = self._get_input_div_by_value(definition.item_id)
                self.wait_until_has_class('incorrect', input_div)
                self.wait_until_html_in(definition.feedback_negative, feedback_popup)
                self.assert_placed_item(definition.item_id, definition.zone_id)

    def parameterized_final_feedback_and_reset(
        self, items_map, feedback, scroll_down=100, use_keyboard=False, action_key=Keys.RETURN
    ):
        feedback_message = self._get_feedback_message()
        self.assertEqual(self.get_element_html(feedback_message), feedback['intro'])  # precondition check

        items = self._get_correct_item_for_zone(items_map)

        def get_locations():
            return {item_id: self._get_item_by_value(item_id).location for item_id in items.keys()}

        initial_locations = get_locations()

        # Scroll drop zones into view to make sure Selenium can successfully drop items
        self.scroll_down(pixels=scroll_down)

        for item_key, definition in items.items():
            if use_keyboard:
                self.move_item_to_zone(definition.item_id, definition.zone_id, action_key)
            else:
                self.drag_item_to_zone(definition.item_id, definition.zone_id)
            if definition.input:
                self._send_input(item_key, definition.input)
                input_div = self._get_input_div_by_value(item_key)
                self.wait_until_has_class('correct', input_div)
            self.assert_placed_item(definition.item_id, definition.zone_id)

        self.wait_until_html_in(feedback['final'], self._get_feedback_message())

        # Scroll "Reset exercise" button into view to make sure Selenium can successfully click it
        self.scroll_down(pixels=scroll_down+150)

        reset = self.get_reset_button()
        if use_keyboard:
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
        dialog_modal_overlay = keyboard_help_dialog.find_element_by_css_selector('.modal-window-overlay')
        dialog_modal = keyboard_help_dialog.find_element_by_css_selector('.modal-window')
        dialog_dismiss_button = dialog_modal.find_element_by_css_selector('.modal-dismiss-button')

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


class BasicInteractionTest(InteractionTestBase):
    """
    Testing interactions with Drag and Drop XBlock against default data. If default data changes this will break.
    """
    PAGE_TITLE = 'Drag and Drop v2'
    PAGE_ID = 'drag_and_drop_v2'

    items_map = {
        0: ItemDefinition(
            0, TOP_ZONE_TITLE, ITEM_CORRECT_FEEDBACK.format(zone=TOP_ZONE_TITLE), ITEM_INCORRECT_FEEDBACK
        ),
        1: ItemDefinition(
            1, MIDDLE_ZONE_TITLE, ITEM_CORRECT_FEEDBACK.format(zone=MIDDLE_ZONE_TITLE), ITEM_INCORRECT_FEEDBACK
        ),
        2: ItemDefinition(
            2, BOTTOM_ZONE_TITLE, ITEM_CORRECT_FEEDBACK.format(zone=BOTTOM_ZONE_TITLE), ITEM_INCORRECT_FEEDBACK
        ),
        3: ItemDefinition(3, None, "", ITEM_NO_ZONE_FEEDBACK),
    }

    all_zones = [TOP_ZONE_TITLE, MIDDLE_ZONE_TITLE, BOTTOM_ZONE_TITLE]

    feedback = {
        "intro": START_FEEDBACK,
        "final": FINISH_FEEDBACK,
    }

    def _get_scenario_xml(self):  # pylint: disable=no-self-use
        return "<vertical_demo><drag-and-drop-v2/></vertical_demo>"

    def test_item_positive_feedback_on_good_move(self):
        self.parameterized_item_positive_feedback_on_good_move(self.items_map)

    def test_item_positive_feedback_on_good_input(self):
        self.parameterized_item_positive_feedback_on_good_input(self.items_map)

    def test_item_negative_feedback_on_bad_move(self):
        self.parameterized_item_negative_feedback_on_bad_move(self.items_map, self.all_zones)

    def test_item_negative_feedback_on_bad_input(self):
        self.parameterized_item_negative_feedback_on_bad_input(self.items_map)

    def test_final_feedback_and_reset(self):
        self.parameterized_final_feedback_and_reset(self.items_map, self.feedback)

    def test_keyboard_help(self):
        self.interact_with_keyboard_help()


@ddt
class KeyboardInteractionTest(BasicInteractionTest, BaseIntegrationTest):
    @data(Keys.RETURN, Keys.SPACE)
    def test_item_positive_feedback_on_good_move(self, action_key):
        self.parameterized_item_positive_feedback_on_good_move(
            self.items_map, use_keyboard=True, action_key=action_key
        )

    @data(Keys.RETURN, Keys.SPACE)
    def test_item_positive_feedback_on_good_input(self, action_key):
        self.parameterized_item_positive_feedback_on_good_input(
            self.items_map, use_keyboard=True, action_key=action_key
        )

    @data(Keys.RETURN, Keys.SPACE)
    def test_item_negative_feedback_on_bad_move(self, action_key):
        self.parameterized_item_negative_feedback_on_bad_move(
            self.items_map, self.all_zones, use_keyboard=True, action_key=action_key
        )

    @data(Keys.RETURN, Keys.SPACE)
    def test_item_negative_feedback_on_bad_input(self, action_key):
        self.parameterized_item_negative_feedback_on_bad_input(
            self.items_map, use_keyboard=True, action_key=action_key
        )

    @data(Keys.RETURN, Keys.SPACE)
    def test_final_feedback_and_reset(self, action_key):
        self.parameterized_final_feedback_and_reset(
            self.items_map, self.feedback, use_keyboard=True, action_key=action_key
        )

    def test_keyboard_help(self, use_keyboard=True):
        self.interact_with_keyboard_help()


class CustomDataInteractionTest(BasicInteractionTest, BaseIntegrationTest):
    items_map = {
        0: ItemDefinition(0, 'Zone 1', "Yes 1", "No 1"),
        1: ItemDefinition(1, 'Zone 2', "Yes 2", "No 2", "102"),
        2: ItemDefinition(2, None, "", "No Zone for this")
    }

    all_zones = ['Zone 1', 'Zone 2']

    feedback = {
        "intro": "Some Intro Feed",
        "final": "Some Final Feed"
    }

    def _get_scenario_xml(self):
        return self._get_custom_scenario_xml("integration/data/test_data.json")


class CustomHtmlDataInteractionTest(BasicInteractionTest, BaseIntegrationTest):
    items_map = {
        0: ItemDefinition(0, 'Zone <i>1</i>', "Yes <b>1</b>", "No <b>1</b>"),
        1: ItemDefinition(1, 'Zone <b>2</b>', "Yes <i>2</i>", "No <i>2</i>", "95"),
        2: ItemDefinition(2, None, "", "No Zone for <i>X</i>")
    }

    all_zones = ['Zone <i>1</i>', 'Zone <b>2</b>']

    feedback = {
        "intro": "Intro <i>Feed</i>",
        "final": "Final <b>Feed</b>"
    }

    def _get_scenario_xml(self):
        return self._get_custom_scenario_xml("integration/data/test_html_data.json")


class MultipleBlocksDataInteraction(InteractionTestBase, BaseIntegrationTest):
    PAGE_TITLE = 'Drag and Drop v2 Multiple Blocks'
    PAGE_ID = 'drag_and_drop_v2_multi'

    BLOCK1_DATA_FILE = "integration/data/test_data.json"
    BLOCK2_DATA_FILE = "integration/data/test_data_other.json"

    item_maps = {
        'block1': {
            0: ItemDefinition(0, 'Zone 1', "Yes 1", "No 1"),
            1: ItemDefinition(1, 'Zone 2', "Yes 2", "No 2", "102"),
            2: ItemDefinition(2, None, "", "No Zone for this")
        },
        'block2': {
            10: ItemDefinition(10, 'Zone 51', "Correct 1", "Incorrect 1"),
            20: ItemDefinition(20, 'Zone 52', "Correct 2", "Incorrect 2", "102"),
            30: ItemDefinition(30, None, "", "No Zone for this")
        },
    }

    all_zones = {
        'block1': ['Zone 1', 'Zone 2'],
        'block2': ['Zone 51', 'Zone 52']
    }

    feedback = {
        'block1': {"intro": "Some Intro Feed", "final": "Some Final Feed"},
        'block2': {"intro": "Other Intro Feed", "final": "Other Final Feed"},
    }

    def _get_scenario_xml(self):
        blocks_xml = "\n".join([
            "<drag-and-drop-v2 data='{data}'/>".format(data=load_resource(filename))
            for filename in (self.BLOCK1_DATA_FILE, self.BLOCK2_DATA_FILE)
        ])

        return "<vertical_demo>{dnd_blocks}</vertical_demo>".format(dnd_blocks=blocks_xml)

    def _switch_to_block(self, idx):
        self._page = self.browser.find_elements_by_css_selector(self.default_css_selector)[idx]
        self.scroll_down(0)

    def test_item_positive_feedback_on_good_move(self):
        self._switch_to_block(0)
        self.parameterized_item_positive_feedback_on_good_move(self.item_maps['block1'])
        self._switch_to_block(1)
        self.parameterized_item_positive_feedback_on_good_move(self.item_maps['block2'], scroll_down=900)

    def test_item_positive_feedback_on_good_input(self):
        self._switch_to_block(0)
        self.parameterized_item_positive_feedback_on_good_input(self.item_maps['block1'])
        self._switch_to_block(1)
        self.parameterized_item_positive_feedback_on_good_input(self.item_maps['block2'], scroll_down=900)

    def test_item_negative_feedback_on_bad_move(self):
        self._switch_to_block(0)
        self.parameterized_item_negative_feedback_on_bad_move(self.item_maps['block1'], self.all_zones['block1'])
        self._switch_to_block(1)
        self.parameterized_item_negative_feedback_on_bad_move(
            self.item_maps['block2'], self.all_zones['block2'], scroll_down=900
        )

    def test_item_negative_feedback_on_bad_input(self):
        self._switch_to_block(0)
        self.parameterized_item_negative_feedback_on_bad_input(self.item_maps['block1'])
        self._switch_to_block(1)
        self.parameterized_item_negative_feedback_on_bad_input(self.item_maps['block2'], scroll_down=900)

    def test_final_feedback_and_reset(self):
        self._switch_to_block(0)
        self.parameterized_final_feedback_and_reset(self.item_maps['block1'], self.feedback['block1'])
        self._switch_to_block(1)
        self.parameterized_final_feedback_and_reset(self.item_maps['block2'], self.feedback['block2'], scroll_down=900)
