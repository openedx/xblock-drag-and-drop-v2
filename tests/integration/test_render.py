from tests.integration.test_base import BaseIntegrationTest


class TestDragAndDropRender(BaseIntegrationTest):
    """
    Verifying Drag and Drop XBlock rendering against default data - if default data changes this would probably broke
    """
    PAGE_TITLE = 'Drag and Drop v2'
    PAGE_ID = 'drag_and_drop_v2'

    def setUp(self):
        super(TestDragAndDropRender, self).setUp()

        scenario_xml = "<vertical_demo><drag-and-drop-v2/></vertical_demo>"
        self._add_scenario(self.PAGE_ID, self.PAGE_TITLE, scenario_xml)

        self.browser.get(self.live_server_url)
        self._page = self.go_to_page(self.PAGE_TITLE)

    def _test_style(self, item, style_settings):
        style = item.get_attribute('style')
        for style_prop, expected_value in style_settings.items():
            expected = u"{0}: {1}".format(style_prop, expected_value)
            self.assertIn(expected, style)

    def test_items(self):
        items = self._get_items()

        self.assertEqual(len(items), 3)

        self.assertEqual(items[0].get_attribute('data-value'), '0')
        self.assertEqual(items[0].text, '1')
        self.assertIn('ui-draggable', self.get_element_classes(items[0]))
        self._test_style(items[0], {'width': '190px', 'height': 'auto'})

        self.assertEqual(items[1].get_attribute('data-value'), '1')
        self.assertEqual(items[1].text, '2')
        self.assertIn('ui-draggable', self.get_element_classes(items[1]))
        self._test_style(items[1], {'width': '190px', 'height': 'auto'})

        self.assertEqual(items[2].get_attribute('data-value'), '2')
        self.assertEqual(items[2].text, 'X')
        self.assertIn('ui-draggable', self.get_element_classes(items[2]))
        self._test_style(items[2], {'width': '100px', 'height': '100px'})

    def test_zones(self):
        zones = self._get_zones()

        self.assertEqual(len(zones), 2)

        self.assertEqual(zones[0].get_attribute('data-zone'), 'Zone 1')
        self.assertIn('ui-droppable', self.get_element_classes(zones[0]))
        self._test_style(zones[0], {'top': '200px', 'left': '120px', 'width': '200px', 'height': '100px'})

        self.assertEqual(zones[1].get_attribute('data-zone'), 'Zone 2')
        self.assertIn('ui-droppable', self.get_element_classes(zones[1]))
        self._test_style(zones[1], {'top': '360px', 'left': '120px', 'width': '200px', 'height': '100px'})

    def test_feedback(self):
        feedback_message = self._get_feedback_message()

        self.assertEqual(feedback_message.text, "Intro Feed")

    def test_background_image(self):
        bg_image = self.browser.execute_script('return jQuery(".target-img").css("background-image")')
        image_path = '/resource/drag-and-drop-v2/public/img/triangle.png'
        self.assertEqual(bg_image, 'url("{0}{1}")'.format(self.live_server_url, image_path))
