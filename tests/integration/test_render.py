# Imports ###########################################################

from __future__ import absolute_import

from ddt import data, ddt, unpack
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
from xblockutils.resources import ResourceLoader

from drag_and_drop_v2.default_data import START_FEEDBACK

from .test_base import BaseIntegrationTest

# Globals ###########################################################

loader = ResourceLoader(__name__)


# Classes ###########################################################

class Colors(object):
    WHITE = 'rgb(255, 255, 255)'
    BLUE = 'rgb(29, 82, 128)'
    GREY = 'rgb(237, 237, 237)'
    CORAL = '#ff7f50'
    DARK_GREY = 'rgb(86, 86, 86)'  # == #565656 in CSS-land
    CORNFLOWERBLUE = 'cornflowerblue'

    @classmethod
    def rgb(cls, color):
        if color in (cls.WHITE, cls.BLUE, cls.GREY):
            return color
        elif color == cls.CORAL:
            return 'rgb(255, 127, 80)'
        elif color == cls.CORNFLOWERBLUE:
            return 'rgb(100, 149, 237)'
        return None


@ddt
class TestDragAndDropRender(BaseIntegrationTest):
    """
    Verifying Drag and Drop XBlock rendering against default data - if default data changes this
    will probably break.
    """
    PAGE_TITLE = 'Drag and Drop v2'
    PAGE_ID = 'drag_and_drop_v2'
    ITEM_PROPERTIES = [{'text': '1'}, {'text': '2'}, {'text': 'X'}, ]
    SIDES = ['Top', 'Bottom', 'Left', 'Right']

    def load_scenario(self, item_background_color="", item_text_color="", zone_labels=False, zone_borders=False):
        problem_data = loader.load_unicode("data/test_data_a11y.json")
        problem_data = problem_data.replace('{display_labels_value}', 'true' if zone_labels else 'false')
        problem_data = problem_data.replace('{display_borders_value}', 'true' if zone_borders else 'false')
        scenario_xml = """
            <vertical_demo>
                <drag-and-drop-v2 item_background_color='{item_background_color}'
                                  item_text_color='{item_text_color}'
                                  data='{problem_data}' />
            </vertical_demo>
        """.format(
            item_background_color=item_background_color,
            item_text_color=item_text_color,
            problem_data=problem_data
        )
        self._add_scenario(self.PAGE_ID, self.PAGE_TITLE, scenario_xml)

        self.browser.get(self.live_server_url)
        self._page = self.go_to_page(self.PAGE_TITLE)

    def _assert_box_percentages(self, selector, left, top, width, height):
        """ Assert that the element 'selector' has the specified position/size percentages """
        values = {key: self._get_style(selector, key, False) for key in ['left', 'top', 'width', 'height']}
        for key in values:
            self.assertTrue(values[key].endswith('%'))
            values[key] = float(values[key][:-1])
        self.assertAlmostEqual(values['left'], left, places=2)
        self.assertAlmostEqual(values['top'], top, places=2)
        self.assertAlmostEqual(values['width'], width, places=2)
        self.assertAlmostEqual(values['height'], height, places=2)

    def _test_item_style(self, item_element, style_settings):
        item_val = item_element.get_attribute('data-value')
        item_selector = '.item-bank .option[data-value=' + item_val + ']'
        style = item_element.get_attribute('style')
        # Check background color
        background_color_property = 'background-color'
        if background_color_property not in style_settings:
            self.assertNotIn(background_color_property, style)
            expected_background_color = Colors.BLUE
        else:
            expected_background_color = Colors.rgb(style_settings['background-color'])
        background_color = self._get_style(item_selector, 'backgroundColor')
        self.assertEqual(background_color, expected_background_color)

        # Check text color
        color_property = 'color'
        if color_property not in style_settings:
            # Leading space below ensures that test does not find "color" in "background-color"
            self.assertNotIn(' ' + color_property, style)
            expected_color = Colors.WHITE
        else:
            expected_color = Colors.rgb(style_settings['color'])
        color = self._get_style(item_selector, 'color')
        self.assertEqual(color, expected_color)

        # Check outline color
        outline_color_property = 'outline-color'
        if outline_color_property not in style_settings:
            self.assertNotIn(outline_color_property, style)
        # Outline color should match text color to ensure it does not meld into background color:
        expected_outline_color = expected_color
        outline_color = self._get_style(item_selector, 'outlineColor')
        self.assertEqual(outline_color, expected_outline_color)

    def test_items_default_colors(self):
        self.load_scenario()
        self._test_items()

    @unpack
    @data(
        (Colors.CORNFLOWERBLUE, Colors.GREY),
        (Colors.CORAL, ''),
        ('', Colors.GREY),
    )
    def test_items_custom_colors(self, item_background_color, item_text_color):
        self.load_scenario(item_background_color, item_text_color)

        color_settings = {}
        if item_background_color:
            color_settings['background-color'] = item_background_color
        if item_text_color:
            color_settings['color'] = item_text_color
            color_settings['outline-color'] = item_text_color

        self._test_items(color_settings=color_settings)

    def _test_items(self, color_settings=None):
        color_settings = color_settings or {}

        items = self._get_items()

        self.assertEqual(len(items), 3)

        for index, item in enumerate(items):
            item_number = index + 1
            self.assertEqual(item.get_attribute('role'), 'button')
            self.assertEqual(item.get_attribute('tabindex'), '0')
            self.assertEqual(item.get_attribute('draggable'), 'true')
            self.assertEqual(item.get_attribute('aria-grabbed'), 'false')
            self.assertEqual(item.get_attribute('data-value'), str(index))
            self._test_item_style(item, color_settings)
            try:
                background_image = item.find_element_by_css_selector('img')
            except NoSuchElementException:
                item_content = item.find_element_by_css_selector('.item-content')
                self.assertEqual(item_content.text, self.ITEM_PROPERTIES[index]['text'])
            else:
                self.assertEqual(
                    background_image.get_attribute('alt'),
                    'This describes the background image of item {}'.format(item_number)
                )

    def test_drag_container(self):
        self.load_scenario()
        drag_container = self._page.find_element_by_css_selector('.drag-container')
        self.assertIsNone(drag_container.get_attribute('role'))

    def test_item_bank(self):
        self.load_scenario()
        item_bank = self._page.find_element_by_css_selector('.item-bank')
        self.assertEqual(item_bank.get_attribute("aria-label"), 'Item Bank')

    def test_zones(self):
        self.load_scenario()

        zones = self._get_zones()

        self.assertEqual(len(zones), 2)

        box_percentages = [
            {"left": 31.1284, "top": 6.17284, "width": 38.1323, "height": 36.6255},
            {"left": 16.7315, "top": 43.2099, "width": 66.1479, "height": 28.8066}
        ]

        for index, zone in enumerate(zones):
            zone_number = index + 1
            self.assertEqual(zone.get_attribute('tabindex'), '0')
            self.assertEqual(zone.get_attribute('dropzone'), 'move')
            self.assertEqual(zone.get_attribute('aria-dropeffect'), 'move')
            self.assertEqual(zone.get_attribute('data-uid'), 'Zone {}'.format(zone_number))
            self.assertEqual(zone.get_attribute('data-zone_align'), 'center')
            zone_box_percentages = box_percentages[index]
            self._assert_box_percentages(  # pylint: disable=star-args
                '#-Zone_{}'.format(zone_number), **zone_box_percentages
            )
            zone_name = zone.find_element_by_css_selector('p.zone-name')
            self.assertEqual(zone_name.text, 'Zone {}\n, dropzone'.format(zone_number))
            zone_description = zone.find_element_by_css_selector('p.zone-description')
            self.assertEqual(zone_description.text, 'This describes zone {}'.format(zone_number))
            # Zone description should only be visible to screen readers:
            self.assertEqual(zone_description.get_attribute('class'), 'zone-description sr')

    def test_popup(self):
        self.load_scenario()

        popup = self._get_popup()
        popup_content = self._get_popup_content()
        self.assertFalse(popup.is_displayed())
        self.assertIn('popup', popup.get_attribute('class'))
        self.assertEqual(popup_content.text, "")

    @data(None, Keys.RETURN)
    def test_go_to_beginning_button(self, action_key):
        self.load_scenario()
        self.scroll_down(250)

        button = self._get_go_to_beginning_button()
        # Button is only visible to screen reader users by default.
        self.assertIn('sr', button.get_attribute('class').split())
        # Set focus to the element. We have to use execute_script here because while TAB-ing
        # to the button to make it the active element works in selenium, the focus event is not
        # emitted unless the Firefox window controlled by selenium is the focused window, which
        # usually is not the case when running integration tests.
        # See: https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/7346
        self.browser.execute_script('$("button.go-to-beginning-button").focus()')

        # For unknown reasons the element only becomes visible when focus() is called twice.
        # See: https://openedx.atlassian.net/browse/TNL-6736
        self.browser.execute_script('$("button.go-to-beginning-button").focus()')
        self.assertFocused(button)
        # Button should be visible when focused.
        self.assertNotIn('sr', button.get_attribute('class').split())
        # Click/activate the button to move focus to the top.
        if action_key:
            button.send_keys(action_key)
        else:
            button.click()
        first_focusable_item = self._get_items()[0]
        self.assertFocused(first_focusable_item)
        # Button should only be visible to screen readers again.
        self.assertIn('sr', button.get_attribute('class').split())

    def test_keyboard_help(self):
        self.load_scenario()

        keyboard_help_dialog = self._get_keyboard_help_dialog()
        dialog_modal_overlay = keyboard_help_dialog.find_element_by_css_selector('.modal-window-overlay')
        dialog_modal = keyboard_help_dialog.find_element_by_css_selector('.modal-window')

        self.assertFalse(dialog_modal_overlay.is_displayed())
        self.assertFalse(dialog_modal.is_displayed())
        self.assertEqual(dialog_modal.get_attribute('role'), 'dialog')
        self.assertEqual(dialog_modal.get_attribute('aria-labelledby'), 'modal-window-title-')

    def test_feedback(self):
        self.load_scenario()

        feedback_message = self._get_feedback_message()
        self.assertEqual(feedback_message.text, START_FEEDBACK)

    def test_background_image(self):
        self.load_scenario()

        bg_image = self.browser.find_element_by_css_selector(".xblock--drag-and-drop .target-img")
        image_path = '/resource/drag-and-drop-v2/public/img/triangle.png'
        self.assertTrue(bg_image.get_attribute("src").endswith(image_path))
        self.assertEqual(bg_image.get_attribute("alt"), 'This describes the target image')

    def test_zone_borders_hidden(self):
        self.load_scenario()
        zones = self._get_zones()
        for index, dummy in enumerate(zones, start=1):
            zone = '#-Zone_{}'.format(index)
            for side in self.SIDES:
                self.assertEqual(self._get_style(zone, 'border{}Width'.format(side), True), '0px')
                self.assertEqual(self._get_style(zone, 'border{}Style'.format(side), True), 'none')

    def test_zone_borders_shown(self):
        self.load_scenario(zone_borders=True)
        zones = self._get_zones()
        for index, dummy in enumerate(zones, start=1):
            zone = '#-Zone_{}'.format(index)
            for side in self.SIDES:
                self.assertEqual(self._get_style(zone, 'border{}Width'.format(side), True), '1px')
                self.assertEqual(self._get_style(zone, 'border{}Style'.format(side), True), 'dotted')
                self.assertEqual(self._get_style(zone, 'border{}Color'.format(side), True), Colors.DARK_GREY)

    def test_zone_labels_hidden(self):
        self.load_scenario()
        zones = self._get_zones()
        for zone in zones:
            zone_name = zone.find_element_by_css_selector('p.zone-name')
            self.assertIn('sr', zone_name.get_attribute('class'))

    def test_zone_labels_shown(self):
        self.load_scenario(zone_labels=True)
        zones = self._get_zones()
        for zone in zones:
            zone_name = zone.find_element_by_css_selector('p.zone-name')
            self.assertNotIn('sr', zone_name.get_attribute('class'))

    def test_element_as_jquery_does_not_break_load_event_listeners(self):
        """
        DragAndDropBlock.init should accept a jQuery object or a DOM element.

        Some XBlock initialization routes supply the element argument as a plain DOM element, others pass in a jQuery
        object. DragAndDropBlock.init should cope with either, instead of throwing a TypeError when trying to call
        addEventListener on jQuery objects, which would cause an infinite "loading" message when adding the block to a
        unit in Studio.
        """
        self.load_scenario()

        for entry in self.browser.get_log('browser'):
            self.assertNotEqual(
                'TypeError: element.addEventListener is not a function',
                entry['message']
            )


@ddt
class TestDragAndDropRenderZoneAlign(BaseIntegrationTest):
    """
    Verifying Drag and Drop XBlock rendering using zone alignment.
    """
    PAGE_TITLE = 'Drag and Drop v2'
    PAGE_ID = 'drag_and_drop_v2'

    def setUp(self):
        super(TestDragAndDropRenderZoneAlign, self).setUp()
        scenario_xml = self._get_custom_scenario_xml("data/test_zone_align.json")
        self._add_scenario(self.PAGE_ID, self.PAGE_TITLE, scenario_xml)
        self._page = self.go_to_page(self.PAGE_TITLE)

    def test_zone_align(self):
        expected_alignments = {
            "#-Zone_No_Align": "center",
            "#-Zone_Invalid_Align": "center",
            "#-Zone_Left_Align": "left",
            "#-Zone_Right_Align": "right",
            "#-Zone_Center_Align": "center"
        }
        for zone_id, expected_alignment in expected_alignments.items():
            selector = "{zone_id} .item-wrapper".format(zone_id=zone_id)
            self.assertEqual(self._get_style(selector, "textAlign"), expected_alignment)
            self.assertEqual(self._get_style(selector, "textAlign", computed=True), expected_alignment)
