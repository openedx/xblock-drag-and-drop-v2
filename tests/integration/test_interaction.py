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

    def test_correct_item_positive_feedback(self):
        items_container = self._page.find_element_by_css_selector('ul.items')
        zones_container = self._page.find_element_by_css_selector('div.target')
        element = items_container.find_elements_by_xpath("//li[@data-value='0']")[0]
        target = zones_container.find_elements_by_xpath("//div[@data-zone='Zone A']")[0]
        action_chains = ActionChains(self.browser)

        action_chains.drag_and_drop(element, target).perform()

        self.assertEqual(self._page.find_element_by_css_selector(".popup-content").text, "Yes, it's an A")



