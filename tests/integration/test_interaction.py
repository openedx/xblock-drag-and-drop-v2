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
        0: ItemDefinition(0, 'Zone A', "Yes, it's an A", "No, A does not belong here"),
        1: ItemDefinition(1, 'Zone B', "Yes, it's a B", "No, B does not belong here"),
        2: ItemDefinition(2, None, "", "You silly, there are no zones for X")
    }

    all_zones = ['Zone A', 'Zone B']

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

        self.browser.get(self.live_server_url)
        self._page = self.go_to_page(self.PAGE_TITLE)

    def _get_item_by_value(self, item_value):
        items_container = self._page.find_element_by_css_selector('ul.items')
        return items_container.find_elements_by_xpath("//li[@data-value='{item_id}']".format(item_id=item_value))[0]

    def _get_zone_by_id(self, zone_id):
        zones_container = self._page.find_element_by_css_selector('div.target')
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
        feedback_popup = self._page.find_element_by_css_selector(".popup-content")
        for definition in self._get_correct_item_for_zone().values():
            if not definition.input:
                self.drag_item_to_zone(definition.item_id, definition.zone_id)
                self.wait_until_contains_html(definition.feedback_positive, feedback_popup)

    def test_item_positive_feedback_on_good_input(self):
        feedback_popup = self._page.find_element_by_css_selector(".popup-content")
        for definition in self._get_correct_item_for_zone().values():
            if definition.input:
                self.drag_item_to_zone(definition.item_id, definition.zone_id)
                self._send_input(definition.item_id, definition.input)
                input_div = self._get_input_div_by_value(definition.item_id)
                self.wait_until_has_class('correct', input_div)
                self.wait_until_contains_html(definition.feedback_positive, feedback_popup)

    def test_item_negative_feedback_on_bad_move(self):
        feedback_popup = self._page.find_element_by_css_selector(".popup-content")

        for definition in self.items_map.values():
            for zone in self.all_zones:
                if zone == definition.zone_id:
                    continue
                self.drag_item_to_zone(definition.item_id, zone)
                self.wait_until_contains_html(definition.feedback_negative, feedback_popup)

    def test_item_positive_feedback_on_bad_input(self):
        feedback_popup = self._page.find_element_by_css_selector(".popup-content")
        for definition in self._get_correct_item_for_zone().values():
            if definition.input:
                self.drag_item_to_zone(definition.item_id, definition.zone_id)
                self._send_input(definition.item_id, '1999999')
                input_div = self._get_input_div_by_value(definition.item_id)
                self.wait_until_has_class('incorrect', input_div)
                self.wait_until_contains_html(definition.feedback_negative, feedback_popup)

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

        self.wait_until_contains_html(self.feedback['final'], feedback_message)

        # scrolling to have `reset` visible, otherwise it does not receive a click
        # this is due to xblock workbench header that consumes top 40px - selenium scrolls so page so that target
        # element is a the very top.
        self.scroll_to(100)
        reset = self._page.find_element_by_css_selector(".reset-button")
        reset.click()

        self.wait_until_contains_html(self.feedback['intro'], feedback_message)

        locations_after_reset = get_locations()
        for item_key in items.keys():
            self.assertDictEqual(locations_after_reset[item_key], initial_locations[item_key])


class CustomDataInteractionTest(InteractionTestFixture):
    items_map = {
        0: ItemDefinition(0, 'Zone A', "Yes A", "No A"),
        1: ItemDefinition(1, 'Zone B', "Yes B", "No B", "102"),
        2: ItemDefinition(2, None, "", "No Zone for this")
    }

    all_zones = ['Zone A', 'Zone B']

    feedback = {
        "intro": "Other Intro Feed",
        "final": "Other Final Feed"
    }

    def _get_scenario_xml(self):
        return self._get_custom_scenario_xml("integration/data/test_data.json")


class CustomHtmlDataInteractionTest(InteractionTestFixture):
    items_map = {
        0: ItemDefinition(0, 'Zone <i>A</i>', "Yes <b>A</b>", "No <b>A</b>"),
        1: ItemDefinition(1, 'Zone <b>B</b>', "Yes <i>B</i>", "No <i>B</i>", "95"),
        2: ItemDefinition(2, None, "", "No Zone for <i>X</i>")
    }

    all_zones = ['Zone <i>A</i>', 'Zone <b>B</b>']

    feedback = {
        "intro": "Intro <i>Feed</i>",
        "final": "Final <b>Feed</b>"
    }

    def _get_scenario_xml(self):
        return self._get_custom_scenario_xml("integration/data/test_html_data.json")
