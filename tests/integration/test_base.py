# Imports ###########################################################
from xml.sax.saxutils import escape

from workbench import scenarios
from workbench.test.selenium_test import SeleniumTest

# Classes ###########################################################


class BaseIntegrationTest(SeleniumTest):

    def setUp(self):
        super(BaseIntegrationTest, self).setUp()

        self.browser.get(self.live_server_url)  # Needed to load scenarios once
        scenarios.SCENARIOS.clear()

        self.browser.get(self.live_server_url)

        header1 = self.browser.find_element_by_css_selector('h1')
        self.assertEqual(header1.text, 'XBlock scenarios')

    def _make_scenario_xml(self, display_name, question_text, completed):
        return """
<vertical_demo>
    <drag-and-drop-v2 display_name='{display_name}' question_text='{question_text}' weight='1' completed='{completed}'/>
</vertical_demo>
    """.format(display_name=escape(display_name), question_text=escape(question_text), completed=completed)

    def go_to_page(self, page_name, css_selector='section.xblock--drag-and-drop'):
        """
        Navigate to the page `page_name`, as listed on the workbench home
        Returns the DOM element on the visited page located by the `css_selector`
        """
        self.browser.get(self.live_server_url)
        self.browser.find_element_by_link_text(page_name).click()
        return self.browser.find_element_by_css_selector(css_selector)

    def get_element_html(self, element):
        return element.get_attribute('innerHTML').strip()


class SingleScenarioIntegrationTest(BaseIntegrationTest):
    def setUp(self):
        super(SingleScenarioIntegrationTest, self).setUp()

    def _get_scenarios_for_test(self):
        identifier, title, scenario = self._get_scenario_for_test()
        self._page_title = title
        return [(identifier, title, scenario)]
