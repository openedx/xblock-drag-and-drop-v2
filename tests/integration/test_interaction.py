from nose_parameterized import parameterized
from selenium.webdriver import ActionChains
from selenium.webdriver.firefox import webdriver

from tests.integration.test_base import BaseIntegrationTest


class TestInteraction(BaseIntegrationTest):
    """
    Verifying Drag and Drop XBlock rendering against default data - if default data changes this would probably broke
    """
    PAGE_TITLE = 'Drag and Drop v2'
    PAGE_ID = 'drag_and_drop_v2'

    def setUp(self):
        super(TestInteraction, self).setUp()

        scenario_xml = "<vertical_demo><drag-and-drop-v2/></vertical_demo>"
        self._add_scenario(self.PAGE_ID, self.PAGE_TITLE, scenario_xml)

        self.browser.get(self.live_server_url)
        self._page = self.go_to_page(self.PAGE_TITLE)

    def _get_item_by_value(self, item_value):
        items_container = self._page.find_element_by_css_selector('ul.items')
        return items_container.find_elements_by_xpath("//li[@data-value='{item_id}']".format(item_id=item_value))[0]

    def _get_zone_by_id(self, zone_id):
        zones_container = self._page.find_element_by_css_selector('div.target')
        return zones_container.find_elements_by_xpath("//div[@data-zone='{zone_id}']".format(zone_id=zone_id))[0]

    def drag_item_to_zone(self, item_value, zone_id):
        element = self._get_item_by_value(item_value)
        target = self._get_zone_by_id(zone_id)

        action_chains = ActionChains(self.browser)

        action_chains.drag_and_drop(element, target).perform()

    @parameterized.expand([
        ("Item A", 0, 'Zone A', "Yes, it's an A"),
        ("Item B", 1, 'Zone B', "Yes, it's a B"),
    ])
    def test_correct_item_positive_feedback(self, _, item_value, zone_id, expected_feedback):
        self.drag_item_to_zone(item_value, zone_id)

        self.assertEqual(self._page.find_element_by_css_selector(".popup-content").text, expected_feedback)

    @parameterized.expand([
        ("Item A", 0, 'Zone B', "No, A does not belong here"),
        ("Item B", 1, 'Zone A', "No, B does not belong here"),
        ("Item X", 2, 'Zone A', "You silly, there are no zones for X"),
        ("Item X", 2, 'Zone B', "You silly, there are no zones for X"),
    ])
    def test_incorrect_item_negative_feedback(self, _, item_value, zone_id, expected_feedback):
        self.drag_item_to_zone(item_value, zone_id)

        self.assertEqual(self._page.find_element_by_css_selector(".popup-content").text, expected_feedback)

    def test_final_feedback_and_reset(self):
        feedback_message = self._get_feedback_message()
        self.assertEqual(feedback_message.text, "Intro Feed")  # precondition check

        item0_initial_position = self._get_item_by_value(0).location
        item1_initial_position = self._get_item_by_value(1).location

        self.drag_item_to_zone(0, 'Zone A')
        self.drag_item_to_zone(1, 'Zone B')

        self.assertEqual(feedback_message.text, "Final Feed")

        reset = self._page.find_element_by_css_selector(".reset-button")
        reset.click()

        self.assertEqual(feedback_message.text, "Intro Feed")

        self.assertDictEqual(self._get_item_by_value(0).location, item0_initial_position)
        self.assertDictEqual(self._get_item_by_value(1).location, item1_initial_position)


