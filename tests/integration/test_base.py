# -*- coding: utf-8 -*-
#
# Imports ###########################################################

import json
from xml.sax.saxutils import escape
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from collections import namedtuple

from bok_choy.promise import EmptyPromise
from workbench import scenarios
from xblockutils.resources import ResourceLoader

from xblockutils.base_test import SeleniumBaseTest

from drag_and_drop_v2.utils import Constants

from drag_and_drop_v2.default_data import (
    DEFAULT_DATA, START_FEEDBACK, FINISH_FEEDBACK, TOP_ZONE_ID, TOP_ZONE_TITLE, MIDDLE_ZONE_ID, MIDDLE_ZONE_TITLE,
    BOTTOM_ZONE_ID, BOTTOM_ZONE_TITLE, ITEM_CORRECT_FEEDBACK_TOP, ITEM_CORRECT_FEEDBACK_MIDDLE,
    ITEM_CORRECT_FEEDBACK_BOTTOM, ITEM_INCORRECT_FEEDBACK, ITEM_ANY_ZONE_FEEDBACK, ITEM_NO_ZONE_FEEDBACK,
    ITEM_TOP_ZONE_NAME, ITEM_MIDDLE_ZONE_NAME, ITEM_BOTTOM_ZONE_NAME, ITEM_ANY_ZONE_NAME, ITEM_NO_ZONE_NAME,
)

# Globals ###########################################################

loader = ResourceLoader(__name__)


# Classes ###########################################################

ItemDefinition = namedtuple(  # pylint: disable=invalid-name
    "ItemDefinition",
    [
        "item_id",
        "item_name",
        "image_url",
        "zone_ids",
        "zone_title",
        "feedback_positive",
        "feedback_negative",
    ]
)


class BaseIntegrationTest(SeleniumBaseTest):
    default_css_selector = '.themed-xblock.xblock--drag-and-drop'
    item_sizing = Constants.FIXED_SIZING
    module_name = __name__

    _additional_escapes = {
        '"': "&quot;",
        "'": "&apos;"
    }

    # pylint: disable=too-many-arguments
    @classmethod
    def _make_scenario_xml(
        cls, display_name="Test DnDv2", show_title=True, problem_text="Question", completed=False,
        show_problem_header=True, max_items_per_zone=0, data=None, mode=Constants.STANDARD_MODE
    ):
        if not data:
            data = json.dumps(DEFAULT_DATA)
        return """
            <vertical_demo>
                <drag-and-drop-v2
                    display_name='{display_name}'
                    show_title='{show_title}'
                    question_text='{problem_text}'
                    show_question_header='{show_problem_header}'
                    weight='1'
                    completed='{completed}'
                    max_items_per_zone='{max_items_per_zone}'
                    mode='{mode}'
                    data='{data}'
                    item_sizing='{item_sizing}'
                />
            </vertical_demo>
        """.format(
            display_name=escape(display_name),
            show_title=show_title,
            problem_text=escape(problem_text),
            show_problem_header=show_problem_header,
            completed=completed,
            max_items_per_zone=max_items_per_zone,
            mode=mode,
            data=escape(data, cls._additional_escapes),
            item_sizing=cls.item_sizing
        )

    def _get_custom_scenario_xml(self, filename):
        data = loader.load_unicode(filename)
        return "<vertical_demo><drag-and-drop-v2 data='{data}' item_sizing='{item_sizing}' /></vertical_demo>".format(
            data=escape(data, self._additional_escapes), item_sizing=self.item_sizing
        )

    def _add_scenario(self, identifier, title, xml):
        scenarios.add_xml_scenario(identifier, title, xml)
        self.addCleanup(scenarios.remove_scenario, identifier)

    def _get_items(self):
        items_container = self._page.find_element_by_css_selector('.item-bank')
        return items_container.find_elements_by_css_selector('.option')

    def _get_zones(self):
        return self._page.find_elements_by_css_selector(".drag-container .zone")

    def _get_popup(self):
        return self._page.find_element_by_css_selector(".popup")

    def _get_popup_wrapper(self):
        return self._page.find_element_by_css_selector(".popup-wrapper")

    def _get_popup_content(self):
        return self._page.find_element_by_css_selector(".popup .popup-content")

    def _get_keyboard_help(self):
        return self._page.find_element_by_css_selector(".keyboard-help")

    def _get_keyboard_help_button(self):
        return self._page.find_element_by_css_selector(".keyboard-help-button")

    def _get_keyboard_help_dialog(self):
        return self._page.find_element_by_css_selector(".keyboard-help-dialog")

    def _get_go_to_beginning_button(self):
        return self._page.find_element_by_css_selector('.go-to-beginning-button')

    def _get_reset_button(self):
        return self._page.find_element_by_css_selector('.reset-button')

    def _load_current_slide_by_item_id(self, item_id):
        self._go_to_first_slide()
        self._load_slide_with_item(item_id)

    def _go_to_first_slide(self):
        while not self._is_first_slide_visible():
            current_slide = self._get_current_slide()
            previous_slide_button = self._get_previous_slide_button()
            self._scroll_to_reset_button()

            ActionChains(self.browser).click(previous_slide_button).perform()
            self.wait_until_hidden(current_slide)

    def _load_slide_with_item(self, item_id):
        item = self._get_item_by_value(item_id)
        self._scroll_to_reset_button()

        while not item.is_displayed():
            current_slide = self._get_current_slide()
            next_slide_button = self._get_next_slide_button()
            self._scroll_to_reset_button()

            ActionChains(self.browser).click(next_slide_button).perform()
            self.wait_until_hidden(current_slide)

    def _get_previous_slide_button(self):
        return self._page.find_element_by_css_selector('.bx-prev')

    def _get_current_slide(self):
        css = '.item-bank .slide[aria-hidden=false] .option'
        return self._page.find_element_by_css_selector(css)

    def _is_first_slide_visible(self):
        css = '.item-bank .slide:first-of-type[aria-hidden=false]'
        return self._page.find_elements_by_css_selector(css)

    def _get_next_slide_button(self):
        return self._page.find_element_by_css_selector('.bx-next')

    def _scroll_to_reset_button(self):
        reset = self._page.find_element_by_css_selector('.actions-toolbar')
        self.browser.execute_script("arguments[0].scrollIntoView(0);", reset)
        self.wait_until_visible(reset)

    def _scroll_to_item_bank(self):
        item_bank = self._page.find_element_by_css_selector('.item-bank')
        self.browser.execute_script("arguments[0].scrollIntoView(0);", item_bank)

    def _get_show_answer_button(self):
        return self._page.find_element_by_css_selector('.show-answer-button')

    def _get_submit_button(self):
        return self._page.find_element_by_css_selector('.submit-answer-button')

    def _get_attempts_info(self):
        return self._page.find_element_by_css_selector('.attempts-used')

    def _get_feedback(self):
        return self._page.find_element_by_css_selector(".feedback-content")

    def _get_feedback_message(self):
        return self._page.find_element_by_css_selector(".feedback .message")

    def scroll_down(self, pixels=50):
        self.browser.execute_script("$(window).scrollTop({})".format(pixels))

    def is_element_in_viewport(self, element):
        """Determines if the element lies at least partially in the viewport."""
        viewport = self.browser.execute_script(
            "return {"
            "top: window.scrollY,"
            "left: window.scrollX,"
            "bottom: window.scrollY + window.outerHeight,"
            "right: window.scrollX + window.outerWidth"
            "};"
        )

        return all([
            any([
                viewport["top"] <= element.rect["y"] <= viewport["bottom"],
                viewport["top"] <= element.rect["y"] + element.rect["height"] <= viewport["bottom"]
            ]),
            any([
                viewport["left"] <= element.rect["x"] <= viewport["right"],
                viewport["left"] <= element.rect["x"] + element.rect["width"] <= viewport["right"]
            ])
        ])

    def _get_style(self, selector, style, computed=True):
        if computed:
            query = 'return getComputedStyle($("{selector}").get(0)).{style}'
        else:
            query = 'return $("{selector}").get(0).style.{style}'
        return self.browser.execute_script(query.format(selector=selector, style=style))

    def assertFocused(self, element):
        focused_element = self.browser.switch_to.active_element
        self.assertTrue(element == focused_element, 'expected element to have focus')

    def assertNotFocused(self, element):
        focused_element = self.browser.switch_to.active_element
        self.assertTrue(element != focused_element, 'expected element to not have focus')

    @staticmethod
    def get_element_html(element):
        return element.get_attribute('innerHTML').strip()

    @staticmethod
    def get_element_classes(element):
        return element.get_attribute('class').split()

    def wait_until_html_in(self, html, elem):
        wait = WebDriverWait(elem, 4)
        wait.until(lambda e: html in e.get_attribute('innerHTML'),
                   u"{} should be in {}".format(html, elem.get_attribute('innerHTML')))

    @staticmethod
    def wait_until_has_class(class_name, elem):
        wait = WebDriverWait(elem, 2)
        wait.until(lambda e: class_name in e.get_attribute('class').split(),
                   u"Class name {} not in {}".format(class_name, elem.get_attribute('class')))

    @staticmethod
    def wait_until_has_attribute_value(attribute, attribute_value, elem, timeout=4):
        wait = WebDriverWait(elem, timeout)
        wait.until(lambda e: attribute_value == e.get_attribute(attribute),
                   u"attribute {} is {} instead of {}".format(
                       attribute, elem.get_attribute(attribute), attribute_value))

    def wait_for_ajax(self, timeout=15):
        """
        Wait for jQuery to be loaded and for all ajax requests to finish.
        Same as bok-choy's PageObject.wait_for_ajax()
        """
        def is_ajax_finished():
            """ Check if all the ajax calls on the current page have completed. """
            return self.browser.execute_script("return typeof(jQuery)!='undefined' && jQuery.active==0")

        EmptyPromise(is_ajax_finished, "Finished waiting for ajax requests.", timeout=timeout).fulfill()


class DefaultDataTestMixin(object):
    """
    Provides a test scenario with default options.
    """
    PAGE_TITLE = 'Drag and Drop v2'
    PAGE_ID = 'drag_and_drop_v2'

    items_map = {
        0: ItemDefinition(
            0, ITEM_TOP_ZONE_NAME, "", [TOP_ZONE_ID], TOP_ZONE_TITLE,
            ITEM_CORRECT_FEEDBACK_TOP, ITEM_INCORRECT_FEEDBACK
        ),
        1: ItemDefinition(
            1, ITEM_MIDDLE_ZONE_NAME, "", [MIDDLE_ZONE_ID], MIDDLE_ZONE_TITLE,
            ITEM_CORRECT_FEEDBACK_MIDDLE, ITEM_INCORRECT_FEEDBACK
        ),
        2: ItemDefinition(
            2, ITEM_BOTTOM_ZONE_NAME, "", [BOTTOM_ZONE_ID], BOTTOM_ZONE_TITLE,
            ITEM_CORRECT_FEEDBACK_BOTTOM, ITEM_INCORRECT_FEEDBACK
        ),
        3: ItemDefinition(
            3, ITEM_ANY_ZONE_NAME, "", [MIDDLE_ZONE_ID, TOP_ZONE_ID, BOTTOM_ZONE_ID], MIDDLE_ZONE_TITLE,
            ITEM_ANY_ZONE_FEEDBACK, ITEM_INCORRECT_FEEDBACK
        ),
        4: ItemDefinition(4, ITEM_NO_ZONE_NAME, "", [], None, "", ITEM_NO_ZONE_FEEDBACK),
    }

    all_zones = [
        (TOP_ZONE_ID, TOP_ZONE_TITLE),
        (MIDDLE_ZONE_ID, MIDDLE_ZONE_TITLE),
        (BOTTOM_ZONE_ID, BOTTOM_ZONE_TITLE)
    ]

    feedback = {
        "intro": START_FEEDBACK,
        "final": FINISH_FEEDBACK,
    }
    item_sizing = Constants.FREE_SIZING

    def _get_scenario_xml(self):  # pylint: disable=no-self-use
        return "<vertical_demo><drag-and-drop-v2 item_sizing='{item_sizing}' /></vertical_demo>"\
            .format(item_sizing=self.item_sizing)


class InteractionTestBase(object):
    POPUP_ERROR_CLASS = "popup-incorrect"

    def setUp(self):
        super(InteractionTestBase, self).setUp()

        scenario_xml = self._get_scenario_xml()
        self._add_scenario(self.PAGE_ID, self.PAGE_TITLE, scenario_xml)
        self._page = self.go_to_page(self.PAGE_TITLE)
        # Resize window so that the entire drag container is visible.
        # Selenium has issues when dragging to an area that is off screen.
        self.browser.set_window_size(1024, 1024)

    @staticmethod
    def _get_items_with_zone(items_map):
        return {
            item_key: definition for item_key, definition in items_map.items()
            if definition.zone_ids != []
        }

    @staticmethod
    def _get_items_without_zone(items_map):
        return {
            item_key: definition for item_key, definition in items_map.items()
            if definition.zone_ids == []
        }

    @staticmethod
    def _get_items_by_zone(items_map):
        zone_ids = set([definition.zone_ids[0] for _, definition in items_map.items() if definition.zone_ids])
        return {
            zone_id: {item_key: definition for item_key, definition in items_map.items()
                      if definition.zone_ids and definition.zone_ids[0] is zone_id}
            for zone_id in zone_ids
        }

    @staticmethod
    def _get_incorrect_zone_for_item(item, zones):
        """Returns the first zone that is not correct for this item."""
        zone_id = None
        zone_title = None
        for z_id, z_title in zones:
            if z_id not in item.zone_ids:
                zone_id = z_id
                zone_title = z_title
                break
        return [zone_id, zone_title]

    def _get_item_by_value(self, item_value):
        return self._page.find_elements_by_xpath(".//div[@data-value='{item_id}']".format(item_id=item_value))[0]

    def _get_unplaced_item_by_value(self, item_value):
        items_container = self._get_item_bank()
        return items_container.find_elements_by_xpath(".//div[@data-value='{item_id}']".format(item_id=item_value))[0]

    def _get_placed_item_by_value(self, item_value):
        css = ".target div[data-value='{item_value}']".format(item_value=item_value)
        return self._page.find_element_by_css_selector(css)

    def _get_zone_by_id(self, zone_id):
        zones_container = self._page.find_element_by_css_selector('.target')
        return zones_container.find_elements_by_xpath(".//div[@data-uid='{zone_id}']".format(zone_id=zone_id))[0]

    def _get_dialog_components(self, dialog):  # pylint: disable=no-self-use
        dialog_modal_overlay = dialog.find_element_by_css_selector('.modal-window-overlay')
        dialog_modal = dialog.find_element_by_css_selector('.modal-window')
        return dialog_modal_overlay, dialog_modal

    def _get_dialog_dismiss_button(self, dialog_modal):  # pylint: disable=no-self-use
        return dialog_modal.find_element_by_css_selector('.modal-dismiss-button')

    def _get_item_bank(self):
        return self._page.find_element_by_css_selector('.item-bank')

    def _get_zone_position(self, zone_id):
        return self.browser.execute_script(
            'return $("div[data-uid=\'{zone_id}\']").prevAll(".zone").length'.format(zone_id=zone_id)
        )

    def _get_draggable_property(self, item_value):
        """
        Returns the value of the 'draggable' property of item.

        Selenium has the element.get_attribute method that looks up properties and attributes,
        but for some reason it *always* returns "true" for the 'draggable' property, event though
        both the HTML attribute and the DOM property are set to false.
        We work around that selenium bug by using JavaScript to get the correct value of 'draggable'.
        """
        script = "return $('.option[data-value={}]').prop('draggable')".format(item_value)
        return self.browser.execute_script(script)

    def assertDraggable(self, item_value):
        self.assertTrue(self._get_draggable_property(item_value))

    def assertNotDraggable(self, item_value):
        self.assertFalse(self._get_draggable_property(item_value))

    @staticmethod
    def wait_until_ondrop_xhr_finished(elem):
        """
        Waits until the XHR request triggered by dropping the item finishes loading.
        """
        wait = WebDriverWait(elem, 2)
        # While the XHR is in progress, a spinner icon is shown inside the item.
        # When the spinner disappears, we can assume that the XHR request has finished.
        wait.until(
            lambda e: 'fa-spinner' not in e.get_attribute('innerHTML'),
            u"Spinner should not be in {}".format(elem.get_attribute('innerHTML'))
        )

    def place_item(self, item_value, zone_id, action_key=None, wait=True):
        """
        Place item with ID of item_value into zone with ID of zone_id.
        zone_id=None means place item back to the item bank.
        action_key=None means simulate mouse drag/drop instead of placing the item with keyboard.
        """
        self._load_current_slide_by_item_id(item_value)

        if action_key is None:
            self.drag_item_to_zone(item_value, zone_id)
        else:
            self.move_item_to_zone(item_value, zone_id, action_key)

        if wait:
            self.wait_for_ajax()

    def drag_item_to_zone(self, item_value, zone_id):
        """
        Drag item to desired zone using mouse interaction.
        zone_id=None means drag item back to the item bank.
        """
        element = self._get_item_by_value(item_value)
        if zone_id is None:
            target = self._get_current_slide()
        else:
            target = self._get_zone_by_id(zone_id)

        self.browser.execute_script("arguments[0].scrollIntoView(0);", element)

        ActionChains(self.browser).drag_and_drop(element, target).perform()

    def move_item_to_zone(self, item_value, zone_id, action_key):
        """
        Place item to descired zone using keybard interaction.
        zone_id=None means place item back into the item bank.
        """
        # Focus on the item, then press the action key:
        item = self._get_item_by_value(item_value)
        item.send_keys("")
        item.send_keys(action_key)
        self.wait_until_has_attribute_value('aria-grabbed', 'true', item, timeout=10)
        # Focus is on first *zone* now
        self.assert_item_grabbed(item)
        # Get desired zone and figure out how many times we have to press Tab to focus the zone.
        if zone_id is None:  # moving back to the bank
            zone = self._get_item_bank()
            # When switching focus between zones in keyboard placement mode,
            # the item bank always gets focused last (after all regular zones),
            # so we have to press Tab once for every regular zone to move focus to the item bank.
            tab_press_count = len(self.all_zones)
        else:
            zone = self._get_zone_by_id(zone_id)
            # The number of times we have to press Tab to focus the desired zone equals the zero-based
            # position of the zone (zero presses for first zone, one press for second zone, etc).
            tab_press_count = self._get_zone_position(zone_id)
        for _ in range(tab_press_count):
            ActionChains(self.browser).send_keys(Keys.TAB).perform()
        zone.send_keys(action_key)

    def close_feedback_popup(self):
        css = '.close-feedback-popup-button'
        popup = self._page.find_element_by_css_selector(css)
        self.wait_until_visible(popup)
        popup.click()

    def place_item_and_close_popup(self, item_value, zone_id, action_key=None, wait=True):
        self.place_item(item_value, zone_id, action_key, wait)
        self.close_feedback_popup()

    def assert_item_grabbed(self, item):
        self.assertEqual(item.get_attribute('aria-grabbed'), 'true')

    def assert_item_not_grabbed(self, item):
        self.assertEqual(item.get_attribute('aria-grabbed'), 'false')

    def assert_placed_item(self, item_value, zone_title, assessment_mode=False):
        item = self._get_placed_item_by_value(item_value)
        self.wait_until_visible(item)
        self.wait_until_ondrop_xhr_finished(item)
        item_content = item.find_element_by_css_selector('.item-content')
        self.wait_until_visible(item_content)
        item_description = item.find_element_by_css_selector('.sr.description')
        self.wait_until_visible(item_description)
        item_description_id = '-item-{}-description'.format(item_value)

        self.assertEqual(item.get_attribute('aria-grabbed'), 'false')
        self.assertEqual(item_content.get_attribute('aria-describedby'), item_description_id)
        self.assertEqual(item_description.get_attribute('id'), item_description_id)
        if assessment_mode:
            self.assertDraggable(item_value)
            self.assertEqual(item.get_attribute('class'), 'option')
            self.assertEqual(item.get_attribute('tabindex'), '0')
            description = 'Placed in: {}'
        else:
            self.assertNotDraggable(item_value)
            self.assertEqual(item.get_attribute('class'), 'option fade')
            self.assertIsNone(item.get_attribute('tabindex'))
            description = 'Correctly placed in: {}'

        # An item with multiple drop zones could be located in any one of these
        # zones. In that case, zone_title will be a list, and we need to check
        # whether the zone info in the description of the item matches any of
        # the zones in that list.
        if isinstance(zone_title, list):
            self.assertIn(item_description.text, [description.format(title) for title in zone_title])
        else:
            self.assertEqual(item_description.text, description.format(zone_title))

    def assert_reverted_item(self, item_value):
        item = self._get_item_by_value(item_value)
        self._load_current_slide_by_item_id(item_value)
        self.wait_until_visible(item)
        self.wait_until_ondrop_xhr_finished(item)
        item_content = item.find_element_by_css_selector('.item-content')

        self.assertDraggable(item_value)
        self.assertEqual(item.get_attribute('class'), 'option')
        self.assertEqual(item.get_attribute('tabindex'), '0')
        self.assertEqual(item.get_attribute('aria-grabbed'), 'false')
        self.assertEqual(item_content.get_attribute('aria-describedby'), None)

        try:
            item.find_element_by_css_selector('.sr.description')
            self.fail("Description element exists")
        except NoSuchElementException:
            pass

    def place_decoy_items(self, items_map, action_key):
        decoy_items = self._get_items_without_zone(items_map)
        # Place decoy items into first available zone.
        zone_id, zone_title = self.all_zones[0]
        for definition in decoy_items.values():
            self.place_item(definition.item_id, zone_id, action_key)
            self.assert_placed_item(definition.item_id, zone_title, assessment_mode=True)

    def assert_decoy_items(self, items_map, assessment_mode=False):
        decoy_items = self._get_items_without_zone(items_map)
        for item_key in decoy_items:
            item = self._get_item_by_value(item_key)
            self.assertEqual(item.get_attribute('aria-grabbed'), 'false')
            if assessment_mode:
                self.assertDraggable(item_key)
                self.assertEqual(item.get_attribute('class'), 'option')
            else:
                self.assertNotDraggable(item_key)
                self.assertEqual(item.get_attribute('class'), 'option fade')

    def _switch_to_block(self, idx):
        """ Only needed if there are multiple blocks on the page. """
        self._page = self.browser.find_elements_by_css_selector(self.default_css_selector)[idx]
        self.scroll_down(0)

    def assert_popup_correct(self, popup):
        self.assertNotIn(self.POPUP_ERROR_CLASS, popup.get_attribute('class'))

    def assert_popup_incorrect(self, popup):
        self.assertIn(self.POPUP_ERROR_CLASS, popup.get_attribute('class'))

    def assert_button_enabled(self, submit_button, enabled=True):
        self.assertEqual(submit_button.is_enabled(), enabled)

    def assert_reader_feedback_messages(self, expected_message_lines):
        expected_paragraphs = ['<p>{}</p>'.format(l) for l in expected_message_lines]
        expected_html = ''.join(expected_paragraphs)
        feedback_area = self._page.find_element_by_css_selector('.reader-feedback-area')
        actual_html = feedback_area.get_attribute('innerHTML')
        self.assertEqual(actual_html, expected_html)


class FreeSizingInteractionTestBase(InteractionTestBase):

    def _load_current_slide_by_item_id(self, item_id):
        pass

    def _get_current_slide(self):
        css = '.item-bank .option'
        return self._page.find_element_by_css_selector(css)
