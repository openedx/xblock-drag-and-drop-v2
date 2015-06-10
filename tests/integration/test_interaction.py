from selenium.webdriver import ActionChains

from tests.integration.test_base import BaseIntegrationTest


class ItemDefinition(object):
    def __init__(self, item_id, zone_id, feedback_positive, feedback_negative, input=None):
        self.feedback_negative = feedback_negative
        self.feedback_positive = feedback_positive
        self.zone_id = zone_id
        self.item_id = item_id
        self.input = input


class InteractionTestFixture(BaseIntegrationTest):
    """
    Verifying Drag and Drop XBlock rendering against default data - if default data changes this would probably broke
    """
    PAGE_TITLE = 'Drag and Drop v2'
    PAGE_ID = 'drag_and_drop_v2'

    items_map = {
        0: ItemDefinition(0, 'Zone 1', "Yes, it's a 1", "No, 1 does not belong here"),
        1: ItemDefinition(1, 'Zone 2', "Yes, it's a 2", "No, 2 does not belong here"),
        2: ItemDefinition(2, None, "", "You silly, there are no zones for X")
    }

    all_zones = ['Zone 1', 'Zone 2']

    feedback = {
        "intro": "Intro Feed",
        "final": "Final Feed"
    }

    def _get_scenario_xml(self):
        return "<vertical_demo><drag-and-drop-v2/></vertical_demo>"

    @classmethod
    def _get_correct_item_for_zone(cls):
        return {
            item_key: definition for item_key, definition in cls.items_map.items()
            if definition.zone_id is not None
        }

    def setUp(self):
        super(InteractionTestFixture, self).setUp()

        scenario_xml = self._get_scenario_xml()
        self._add_scenario(self.PAGE_ID, self.PAGE_TITLE, scenario_xml)

        self._page = self.go_to_page(self.PAGE_TITLE)
        # Resize window so that the entire drag container is visible.
        # Selenium has issues when dragging to an area that is off screen.
        self.browser.set_window_size(1024, 800)

    def _get_item_by_value(self, item_value):
        items_container = self._page.find_element_by_css_selector('.items')
        return items_container.find_elements_by_xpath("//div[@data-value='{item_id}']".format(item_id=item_value))[0]

    def _get_zone_by_id(self, zone_id):
        zones_container = self._page.find_element_by_css_selector('.target')
        return zones_container.find_elements_by_xpath("//div[@data-zone='{zone_id}']".format(zone_id=zone_id))[0]

    def _get_input_div_by_value(self, item_value):
        element = self._get_item_by_value(item_value)
        return element.find_element_by_class_name('numerical-input')

    def _send_input(self, item_value, value):
        element = self._get_item_by_value(item_value)
        element.find_element_by_class_name('input').send_keys(value)
        element.find_element_by_class_name('submit-input').click()

    def drag_item_to_zone(self, item_value, zone_id):
        element = self._get_item_by_value(item_value)
        target = self._get_zone_by_id(zone_id)
        action_chains = ActionChains(self.browser)
        action_chains.drag_and_drop(element, target).perform()

    def test_item_positive_feedback_on_good_move(self):
        for definition in self._get_correct_item_for_zone().values():
            if not definition.input:
                self.drag_item_to_zone(definition.item_id, definition.zone_id)
                feedback_popup = self._page.find_element_by_css_selector(".popup-content")
                self.wait_until_html_in(definition.feedback_positive, feedback_popup)

    def test_item_positive_feedback_on_good_input(self):
        feedback_popup = self._page.find_element_by_css_selector(".popup-content")
        for definition in self._get_correct_item_for_zone().values():
            if definition.input:
                self.drag_item_to_zone(definition.item_id, definition.zone_id)
                self._send_input(definition.item_id, definition.input)
                input_div = self._get_input_div_by_value(definition.item_id)
                self.wait_until_has_class('correct', input_div)
                self.wait_until_html_in(definition.feedback_positive, feedback_popup)

    def test_item_negative_feedback_on_bad_move(self):
        feedback_popup = self._page.find_element_by_css_selector(".popup-content")

        for definition in self.items_map.values():
            for zone in self.all_zones:
                if zone == definition.zone_id:
                    continue
                self.drag_item_to_zone(definition.item_id, zone)
                self.wait_until_html_in(definition.feedback_negative, feedback_popup)

    def test_item_positive_feedback_on_bad_input(self):
        feedback_popup = self._page.find_element_by_css_selector(".popup-content")
        for definition in self._get_correct_item_for_zone().values():
            if definition.input:
                self.drag_item_to_zone(definition.item_id, definition.zone_id)
                self._send_input(definition.item_id, '1999999')
                input_div = self._get_input_div_by_value(definition.item_id)
                self.wait_until_has_class('incorrect', input_div)
                self.wait_until_html_in(definition.feedback_negative, feedback_popup)

    def test_final_feedback_and_reset(self):
        feedback_message = self._get_feedback_message()
        self.assertEqual(self.get_element_html(feedback_message), self.feedback['intro'])  # precondition check

        items = self._get_correct_item_for_zone()
        get_locations = lambda: {item_id: self._get_item_by_value(item_id).location for item_id in items.keys()}

        initial_locations = get_locations()

        for item_key, definition in items.items():
            self.drag_item_to_zone(item_key, definition.zone_id)
            if definition.input:
                self._send_input(item_key, definition.input)
                input_div = self._get_input_div_by_value(item_key)
                self.wait_until_has_class('correct', input_div)

        self.wait_until_exists('.reset-button')
        self.wait_until_html_in(self.feedback['final'], self._get_feedback_message())

        reset = self._page.find_element_by_css_selector('.reset-button')
        reset.click()

        self.wait_until_html_in(self.feedback['intro'], self._get_feedback_message())

        locations_after_reset = get_locations()
        for item_key in items.keys():
            self.assertDictEqual(locations_after_reset[item_key], initial_locations[item_key])


class CustomDataInteractionTest(InteractionTestFixture):
    items_map = {
        0: ItemDefinition(0, 'Zone 1', "Yes 1", "No 1"),
        1: ItemDefinition(1, 'Zone 2', "Yes 2", "No 2", "102"),
        2: ItemDefinition(2, None, "", "No Zone for this")
    }

    all_zones = ['Zone 1', 'Zone 2']

    feedback = {
        "intro": "Other Intro Feed",
        "final": "Other Final Feed"
    }

    def _get_scenario_xml(self):
        return self._get_custom_scenario_xml("integration/data/test_data.json")


class CustomHtmlDataInteractionTest(InteractionTestFixture):
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
