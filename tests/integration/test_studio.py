from selenium.webdriver.support.ui import Select
from xblockutils.studio_editable_test import StudioEditableBaseTest

from drag_and_drop_v2.utils import Constants


class TestStudio(StudioEditableBaseTest):
    """
    Tests that cover the editing interface in the Studio.
    """

    def load_scenario(self, xml='<drag-and-drop-v2 url_name="defaults" />'):
        self.set_scenario_xml(xml)
        self.element = self.go_to_view('studio_view')
        self.fix_js_environment()

    def click_continue(self):
        continue_button = self.element.find_element_by_css_selector('.continue-button')
        self.scroll_into_view(continue_button)
        continue_button.click()

    def scroll_into_view(self, element):
        """
        Scrolls to the element and places cursor above it.
        Useful when you want to click an element that is scrolled off
        the visible area of the screen.
        """
        # We have to use block: 'end' rather than the default 'start' because there's a fixed
        # title bar in the studio view in the workbench that can obstruct the element.
        script = "arguments[0].scrollIntoView({behavior: 'instant', block: 'end'})"
        self.browser.execute_script(script, element)

    @property
    def feedback_tab(self):
        return self.element.find_element_by_css_selector('.feedback-tab')

    @property
    def zones_tab(self):
        return self.element.find_element_by_css_selector('.zones-tab')

    @property
    def items_tab(self):
        return self.element.find_element_by_css_selector('.items-tab')

    @property
    def background_image_type_radio_buttons(self):
        radio_buttons = self.zones_tab.find_elements_by_css_selector('.background-image-type input[type="radio"]')
        self.assertEqual(len(radio_buttons), 2)
        self.assertEqual(radio_buttons[0].get_attribute('value'), 'manual')
        self.assertEqual(radio_buttons[1].get_attribute('value'), 'auto')
        return {'manual': radio_buttons[0], 'auto': radio_buttons[1]}

    @property
    def display_labels_checkbox(self):
        return self.zones_tab.find_element_by_css_selector('.display-labels')

    @property
    def background_image_url_field(self):
        return self.zones_tab.find_element_by_css_selector('.background-manual .background-url')

    @property
    def background_image_url_button(self):
        return self.zones_tab.find_element_by_css_selector('.background-manual button')

    @property
    def autozone_cols_field(self):
        return self.zones_tab.find_element_by_css_selector('.background-auto .autozone-layout-cols')

    @property
    def autozone_rows_field(self):
        return self.zones_tab.find_element_by_css_selector('.background-auto .autozone-layout-rows')

    @property
    def autozone_width_field(self):
        return self.zones_tab.find_element_by_css_selector('.background-auto .autozone-size-width')

    @property
    def autozone_height_field(self):
        return self.zones_tab.find_element_by_css_selector('.background-auto .autozone-size-height')

    @property
    def autozone_generate_button(self):
        return self.zones_tab.find_element_by_css_selector('.background-auto button')

    @property
    def target_preview_img(self):
        return self.zones_tab.find_element_by_css_selector('.target-img')

    @property
    def zones(self):
        return self.zones_tab.find_elements_by_css_selector('.zone-row')

    def test_defaults(self):
        """
        Basic test to verify stepping through the editor steps and saving works.
        """
        self.load_scenario()
        # We start on the feedback tab.
        self.assertTrue(self.feedback_tab.is_displayed())
        self.assertFalse(self.zones_tab.is_displayed())
        self.assertFalse(self.items_tab.is_displayed())
        # Continue to the zones tab.
        self.click_continue()
        self.assertFalse(self.feedback_tab.is_displayed())
        self.assertTrue(self.zones_tab.is_displayed())
        self.assertFalse(self.items_tab.is_displayed())
        # And finally to the items tab.
        self.click_continue()
        self.assertFalse(self.feedback_tab.is_displayed())
        self.assertFalse(self.zones_tab.is_displayed())
        self.assertTrue(self.items_tab.is_displayed())
        # Save the block and expect success.
        self.click_save(expect_success=True)

    def test_custom_image(self):
        """"
        Verify user can provide a custom background image URL.
        """
        default_bg_img_src = 'http://localhost:8081/resource/drag-and-drop-v2/public/img/triangle.png'
        # In order to use a working image and avoid load errors, we use the default image with a custom
        # query string
        custom_bg_img_src = '{}?my-custom-image=true'.format(default_bg_img_src)

        self.load_scenario()
        # Go to zones tab.
        self.click_continue()
        radio_buttons = self.background_image_type_radio_buttons
        # Manual mode should be selected by default.
        self.assertTrue(radio_buttons['manual'].is_selected())
        self.assertFalse(radio_buttons['auto'].is_selected())
        url_field = self.background_image_url_field
        self.assertEqual(url_field.get_attribute('value'), '')
        self.assertEqual(self.target_preview_img.get_attribute('src'), default_bg_img_src)
        url_field.send_keys(custom_bg_img_src)
        self.scroll_into_view(self.background_image_url_button)
        self.background_image_url_button.click()
        self.assertEqual(self.target_preview_img.get_attribute('src'), custom_bg_img_src)
        self.click_continue()
        self.click_save(expect_success=True)

        # Verify the custom image src was saved successfully.
        self.element = self.go_to_view('student_view')
        target_img = self.element.find_element_by_css_selector('.target-img')
        self.assertEqual(target_img.get_attribute('src'), custom_bg_img_src)

        # Verify the background image URL field is set to custom image src when we go back to studio view.
        self.element = self.go_to_view('studio_view')
        self.click_continue()
        self.assertEqual(self.background_image_url_field.get_attribute('value'), custom_bg_img_src)

    def _verify_autogenerated_zones(self, cols, rows, zone_width, zone_height, padding):
        zones = self.zones
        self.assertEqual(len(zones), rows * cols)
        for col in range(cols):
            for row in range(rows):
                idx = col + (row * cols)
                zone = zones[idx]
                expected_values = {
                    'zone-title': 'Zone {}'.format(idx + 1),
                    'zone-width': zone_width,
                    'zone-height': zone_height,
                    'zone-x': (zone_width * col) + (padding * (col + 1)),
                    'zone-y': (zone_height * row) + (padding * (row + 1)),
                }
                for name, expected_value in expected_values.iteritems():
                    field = zone.find_element_by_css_selector('.' + name)
                    self.assertEqual(field.get_attribute('value'), str(expected_value))

    def test_auto_generated_image(self):
        """
        Verify that background image and zones get generated successfully.
        """
        cols = 3
        rows = 2
        zone_width = 150
        zone_height = 100
        padding = 20

        self.load_scenario()
        # Go to zones tab.
        self.click_continue()
        radio_buttons = self.background_image_type_radio_buttons
        self.scroll_into_view(radio_buttons['auto'])
        radio_buttons['auto'].click()
        # Manual background controls should be hidden.
        self.assertFalse(self.background_image_url_field.is_displayed())
        self.assertFalse(self.background_image_url_button.is_displayed())
        # Display labels checkbox should be unchecked by default.
        self.assertFalse(self.display_labels_checkbox.is_selected())
        # Enter zone properties for automatic generation.
        self.autozone_cols_field.clear()
        self.autozone_cols_field.send_keys(cols)
        self.autozone_rows_field.clear()
        self.autozone_rows_field.send_keys(rows)
        self.autozone_width_field.clear()
        self.autozone_width_field.send_keys(zone_width)
        self.autozone_height_field.clear()
        self.autozone_height_field.send_keys(zone_height)
        # Click the generate button.
        self.scroll_into_view(self.autozone_generate_button)
        self.autozone_generate_button.click()
        # Verify generated data-uri was set successfully.
        generated_url = self.target_preview_img.get_attribute('src')
        self.assertTrue(generated_url.startswith('data:image/svg+xml;'))
        expected_width = (zone_width * cols) + (padding * (cols + 1))
        expected_height = (zone_height * rows) + (padding * (rows + 1))
        self.assertEqual(self.target_preview_img.get_attribute('naturalWidth'), str(expected_width))
        self.assertEqual(self.target_preview_img.get_attribute('naturalHeight'), str(expected_height))
        # Display labels checkbox should be automatically selected.
        self.assertTrue(self.display_labels_checkbox.is_selected())
        # Verify there are exactly 6 zones, and their properties are correct.
        self._verify_autogenerated_zones(cols, rows, zone_width, zone_height, padding)

        # Fill in zone descriptions to make the form valid (zone descriptions are required).
        for zone in self.zones:
            zone.find_element_by_css_selector('.zone-description').send_keys('Description')

        # Save the block.
        self.click_continue()
        self.click_save(expect_success=True)

        # Verify the custom image src was saved successfully.
        self.element = self.go_to_view('student_view')
        target_img = self.element.find_element_by_css_selector('.target-img')
        self.assertTrue(target_img.get_attribute('src').startswith('data:image/svg+xml'))
        self.assertEqual(target_img.get_attribute('naturalWidth'), str(expected_width))
        self.assertEqual(target_img.get_attribute('naturalHeight'), str(expected_height))

        # Verify the background image URL field is set to custom image src when we go back to studio view.
        self.element = self.go_to_view('studio_view')
        self.click_continue()
        radio_buttons = self.background_image_type_radio_buttons
        self.assertFalse(radio_buttons['manual'].is_selected())
        self.assertTrue(radio_buttons['auto'].is_selected())
        self.assertEqual(self.autozone_cols_field.get_attribute('value'), str(cols))
        self.assertEqual(self.autozone_rows_field.get_attribute('value'), str(rows))
        self.assertEqual(self.autozone_width_field.get_attribute('value'), str(zone_width))
        self.assertEqual(self.autozone_height_field.get_attribute('value'), str(zone_height))

    def test_autozone_parameter_validation(self):
        """
        Test that autozone parameters are verified to be valid.
        """
        self.load_scenario()
        # Go to zones tab.
        self.click_continue()
        radio_buttons = self.background_image_type_radio_buttons
        self.scroll_into_view(radio_buttons['auto'])
        radio_buttons['auto'].click()
        # All fields are valid initially.
        self.assertFalse('field-error' in self.autozone_cols_field.get_attribute('class'))
        self.assertFalse('field-error' in self.autozone_rows_field.get_attribute('class'))
        self.assertFalse('field-error' in self.autozone_width_field.get_attribute('class'))
        self.assertFalse('field-error' in self.autozone_height_field.get_attribute('class'))
        # Set two of the fields to invalid values.
        self.autozone_cols_field.clear()
        self.autozone_cols_field.send_keys('2.5')
        self.autozone_height_field.clear()
        self.autozone_height_field.send_keys('100A')
        # Try to generate the image.
        self.scroll_into_view(self.autozone_generate_button)
        self.autozone_generate_button.click()
        # The two bad fields should show errors.
        self.assertTrue('field-error' in self.autozone_cols_field.get_attribute('class'))
        self.assertFalse('field-error' in self.autozone_rows_field.get_attribute('class'))
        self.assertFalse('field-error' in self.autozone_width_field.get_attribute('class'))
        self.assertTrue('field-error' in self.autozone_height_field.get_attribute('class'))
        # Fix the faulty values.
        self.autozone_cols_field.clear()
        self.autozone_cols_field.send_keys('2')
        self.autozone_height_field.clear()
        self.autozone_height_field.send_keys('100')
        self.scroll_into_view(self.autozone_generate_button)
        self.autozone_generate_button.click()
        # All good now.
        self.assertFalse('field-error' in self.autozone_cols_field.get_attribute('class'))
        self.assertFalse('field-error' in self.autozone_rows_field.get_attribute('class'))
        self.assertFalse('field-error' in self.autozone_width_field.get_attribute('class'))
        self.assertFalse('field-error' in self.autozone_height_field.get_attribute('class'))

    def test_item_sizing_dropdown(self):
        """
        Test to verify that advanced settings for items toggle on changing item_sizing.
        """
        self.load_scenario()
        # We start on the feedback tab.
        self.click_continue()
        # And finally to the items tab.
        self.click_continue()
        self.assertTrue(self.items_tab.is_displayed())

        item_style_form = self.items_tab.find_element_by_css_selector('.item-styles-form')
        item_advanced_settings = self.items_tab.find_element_by_css_selector(
            '.items-form .advanced-settings'
        )
        # By default free sizing is selected, so advanced settings for items should be visible
        self.assertTrue(item_advanced_settings.is_displayed())

        # For fixed sizing option advanced settings for each items should be hidden
        Select(
            item_style_form.find_element_by_css_selector('.problem-item-sizing')
        ).select_by_value(Constants.FIXED_SIZING)
        self.assertFalse(item_advanced_settings.is_displayed())
