from ddt import ddt, unpack, data

from tests.integration.test_base import BaseIntegrationTest


class Colors(object):
    GREY = 'rgb(237, 237, 237)'
    CORAL = '#ff7f50'
    CORNFLOWERBLUE = 'cornflowerblue'

    @classmethod
    def rgb(cls, color):
        if color == cls.GREY:
            return color
        elif color == cls.CORAL:
            return 'rgb(255, 127, 80)'
        elif color == cls.CORNFLOWERBLUE:
            return 'rgb(100, 149, 237)'

@ddt
class TestDragAndDropRender(BaseIntegrationTest):
    """
    Verifying Drag and Drop XBlock rendering against default data - if default data changes this would probably broke
    """
    PAGE_TITLE = 'Drag and Drop v2'
    PAGE_ID = 'drag_and_drop_v2'

    def load_scenario(self, item_background_color="", item_text_color=""):
        scenario_xml = """
<vertical_demo>
    <drag-and-drop-v2 item_background_color='{item_background_color}' item_text_color='{item_text_color}' />
</vertical_demo>
        """.format(item_background_color=item_background_color, item_text_color=item_text_color)
        self._add_scenario(self.PAGE_ID, self.PAGE_TITLE, scenario_xml)

        self.browser.get(self.live_server_url)
        self._page = self.go_to_page(self.PAGE_TITLE)

    def _test_style(self, element, style_settings, element_type):
        style = element.get_attribute('style')
        for style_prop, expected_value in style_settings.items():
            if style_prop == 'color' or style_prop == 'background-color' and expected_value.startswith('#'):
                expected_value = Colors.rgb(expected_value)
            expected = u"{0}: {1}".format(style_prop, expected_value)
            self.assertIn(expected, style)
        if element_type == "item":
            self._test_item_style(element, style_settings, style)

    def _test_item_style(self, item, style_settings, style):
        background_color_property = 'background-color'
        if background_color_property not in style_settings:
            self.assertNotIn(background_color_property, style)
        color_property = 'color'
        if color_property not in style_settings:
            self.assertNotIn(' ' + color_property, style) # Leading space makes sure that
                                                          # test does not find "color" in "background-color"

    def test_items(self):
        self.load_scenario()

        items = self._get_items()

        self.assertEqual(len(items), 3)

        self.assertEqual(items[0].get_attribute('data-value'), '0')
        self.assertEqual(items[0].text, '1')
        self.assertIn('ui-draggable', self.get_element_classes(items[0]))
        self._test_style(items[0], {'width': '190px', 'height': 'auto'}, element_type='item')

        self.assertEqual(items[1].get_attribute('data-value'), '1')
        self.assertEqual(items[1].text, '2')
        self.assertIn('ui-draggable', self.get_element_classes(items[1]))
        self._test_style(items[1], {'width': '190px', 'height': 'auto'}, element_type='item')

        self.assertEqual(items[2].get_attribute('data-value'), '2')
        self.assertEqual(items[2].text, 'X')
        self.assertIn('ui-draggable', self.get_element_classes(items[2]))
        self._test_style(items[2], {'width': '100px', 'height': '100px'}, element_type='item')

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
        print(color_settings)

        items = self._get_items()

        self.assertEqual(len(items), 3)

        self.assertEqual(items[0].get_attribute('data-value'), '0')
        self.assertEqual(items[0].text, '1')
        self.assertIn('ui-draggable', self.get_element_classes(items[0]))
        self._test_style(
            items[0], dict({'width': '190px', 'height': 'auto'}, **color_settings), element_type='item'
        )

        self.assertEqual(items[1].get_attribute('data-value'), '1')
        self.assertEqual(items[1].text, '2')
        self.assertIn('ui-draggable', self.get_element_classes(items[1]))
        self._test_style(
            items[1], dict({'width': '190px', 'height': 'auto'}, **color_settings), element_type='item'
        )

        self.assertEqual(items[2].get_attribute('data-value'), '2')
        self.assertEqual(items[2].text, 'X')
        self.assertIn('ui-draggable', self.get_element_classes(items[2]))
        self._test_style(
            items[2], dict({'width': '100px', 'height': '100px'}, **color_settings), element_type='item'
        )

    def test_zones(self):
        self.load_scenario()

        zones = self._get_zones()

        self.assertEqual(len(zones), 2)

        self.assertEqual(zones[0].get_attribute('data-zone'), 'Zone 1')
        self.assertIn('ui-droppable', self.get_element_classes(zones[0]))
        self._test_style(
            zones[0], {'top': '200px', 'left': '120px', 'width': '200px', 'height': '100px'}, element_type='zone'
        )

        self.assertEqual(zones[1].get_attribute('data-zone'), 'Zone 2')
        self.assertIn('ui-droppable', self.get_element_classes(zones[1]))
        self._test_style(
            zones[1], {'top': '360px', 'left': '120px', 'width': '200px', 'height': '100px'}, element_type='zone'
        )

    def test_feedback(self):
        self.load_scenario()

        feedback_message = self._get_feedback_message()

        self.assertEqual(feedback_message.text, "Intro Feed")

    def test_background_image(self):
        self.load_scenario()

        bg_image = self.browser.execute_script('return jQuery(".target-img").css("background-image")')
        image_path = '/resource/drag-and-drop-v2/public/img/triangle.png'
        self.assertEqual(bg_image, 'url("{0}{1}")'.format(self.live_server_url, image_path))
