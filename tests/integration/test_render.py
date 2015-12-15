from ddt import ddt, unpack, data

from tests.integration.test_base import BaseIntegrationTest


class Colors(object):
    WHITE = 'rgb(255, 255, 255)'
    BLUE = 'rgb(46, 131, 205)'
    GREY = 'rgb(237, 237, 237)'
    CORAL = '#ff7f50'
    CORNFLOWERBLUE = 'cornflowerblue'

    @classmethod
    def rgb(cls, color):
        if color in (cls.WHITE, cls.BLUE, cls.GREY):
            return color
        elif color == cls.CORAL:
            return 'rgb(255, 127, 80)'
        elif color == cls.CORNFLOWERBLUE:
            return 'rgb(100, 149, 237)'


@ddt
class TestDragAndDropRender(BaseIntegrationTest):
    """
    Verifying Drag and Drop XBlock rendering against default data - if default data changes this
    will probably break.
    """
    PAGE_TITLE = 'Drag and Drop v2'
    PAGE_ID = 'drag_and_drop_v2'
    ITEM_PROPERTIES = [{'text': '1'}, {'text': '2'}, {'text': 'X'}, ]

    def load_scenario(self, item_background_color="", item_text_color=""):
        scenario_xml = """
<vertical_demo>
    <drag-and-drop-v2 item_background_color='{item_background_color}' item_text_color='{item_text_color}' />
</vertical_demo>
        """.format(item_background_color=item_background_color, item_text_color=item_text_color)
        self._add_scenario(self.PAGE_ID, self.PAGE_TITLE, scenario_xml)

        self.browser.get(self.live_server_url)
        self._page = self.go_to_page(self.PAGE_TITLE)

    def _get_style(self, selector, style, computed=True):
        if computed:
            query = 'return getComputedStyle($("{selector}").get(0)).{style}'
        else:
            query = 'return $("{selector}").get(0).style.{style}'
        return self.browser.execute_script(query.format(selector=selector, style=style))

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
        style = item_element.get_attribute('style')
        # Check background color
        background_color_property = 'background-color'
        if background_color_property not in style_settings:
            self.assertNotIn(background_color_property, style)
            expected_background_color = Colors.BLUE
        else:
            expected_background_color = Colors.rgb(style_settings['background-color'])
        background_color = self._get_style('.item-bank .option[data-value='+item_val+']', 'backgroundColor')
        self.assertEquals(background_color, expected_background_color)

        # Check text color
        color_property = 'color'
        if color_property not in style_settings:
            # Leading space below ensures that test does not find "color" in "background-color"
            self.assertNotIn(' ' + color_property, style)
            expected_color = Colors.WHITE
        else:
            expected_color = Colors.rgb(style_settings['color'])
        color = self._get_style('.item-bank .option[data-value='+item_val+']', 'color')
        self.assertEquals(color, expected_color)

    def test_items(self):
        self.load_scenario()

        items = self._get_items()

        self.assertEqual(len(items), 3)

        for index, item in enumerate(items):
            self.assertEqual(item.get_attribute('data-value'), str(index))
            self.assertEqual(item.text, self.ITEM_PROPERTIES[index]['text'])
            self.assertIn('ui-draggable', self.get_element_classes(item))
            self._test_item_style(item, {})

    @unpack
    @data(
        (Colors.CORNFLOWERBLUE, Colors.GREY),
        (Colors.CORAL, ''),
        ('', Colors.GREY),
    )
    def test_items_custom_colors(self, item_background_color, item_text_color):
        self.load_scenario(item_background_color, item_text_color)

        items = self._get_items()

        self.assertEqual(len(items), 3)

        color_settings = {}
        if item_background_color:
            color_settings['background-color'] = item_background_color
        if item_text_color:
            color_settings['color'] = item_text_color

        for index, item in enumerate(items):
            self.assertEqual(item.get_attribute('data-value'), str(index))
            self.assertEqual(item.text, self.ITEM_PROPERTIES[index]['text'])
            self.assertIn('ui-draggable', self.get_element_classes(item))
            self._test_item_style(item, color_settings)

    def test_zones(self):
        self.load_scenario()

        zones = self._get_zones()

        self.assertEqual(len(zones), 2)

        self.assertEqual(zones[0].get_attribute('data-zone'), 'Zone 1')
        self.assertIn('ui-droppable', self.get_element_classes(zones[0]))
        self._assert_box_percentages('#zone-1', left=31.1284, top=6.17284, width=38.1323, height=36.6255)

        self.assertEqual(zones[1].get_attribute('data-zone'), 'Zone 2')
        self.assertIn('ui-droppable', self.get_element_classes(zones[1]))
        self._assert_box_percentages('#zone-2', left=16.7315, top=43.2099, width=66.1479, height=28.8066)

    def test_feedback(self):
        self.load_scenario()

        feedback_message = self._get_feedback_message()

        self.assertEqual(feedback_message.text, "Drag the items onto the image above.")

    def test_background_image(self):
        self.load_scenario()

        bg_image = self.browser.find_element_by_css_selector(".xblock--drag-and-drop .target-img")
        image_path = '/resource/drag-and-drop-v2/public/img/triangle.png'
        self.assertTrue(bg_image.get_attribute("src").endswith(image_path))
