# Imports ###########################################################
from xml.sax.saxutils import escape
from tests.utils import load_resource

from workbench import scenarios
from workbench.test.selenium_test import SeleniumTest

# Classes ###########################################################


class BaseIntegrationTest(SeleniumTest):

    _additional_escapes = {
        '"': "&quot;",
        "'": "&apos;"
    }

    def setUp(self):
        super(BaseIntegrationTest, self).setUp()

        # Use test scenarios
        self.browser.get(self.live_server_url)  # Needed to load tests once
        scenarios.SCENARIOS.clear()

        # Suzy opens the browser to visit the workbench
        self.browser.get(self.live_server_url)

        # She knows it's the site by the header
        header1 = self.browser.find_element_by_css_selector('h1')
        self.assertEqual(header1.text, 'XBlock scenarios')

    def _make_scenario_xml(self, display_name, question_text, completed):
        return """
<vertical_demo>
    <drag-and-drop-v2 display_name='{display_name}' question_text='{question_text}' weight='1' completed='{completed}'/>
</vertical_demo>
    """.format(display_name=escape(display_name), question_text=escape(question_text), completed=completed)

    def _get_custom_scenario_xml(self, filename):
        data = load_resource(filename)
        return "<vertical_demo><drag-and-drop-v2 data='{data}'/></vertical_demo>".format(
            data=escape(data, self._additional_escapes)
        )

    def _add_scenario(self, identifier, title, xml):
        scenarios.add_xml_scenario(identifier, title, xml)
        self.addCleanup(scenarios.remove_scenario, identifier)

    def _get_items(self):
        items_container = self._page.find_element_by_css_selector('ul.items')
        return items_container.find_elements_by_css_selector('li.option')

    def _get_zones(self):
        return self._page.find_elements_by_css_selector(".drag-container .zone")

    def _get_feedback_message(self):
        return self._page.find_element_by_css_selector(".feedback .message")

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

    def get_element_classes(self, element):
        return element.get_attribute('class').split()

    def scroll_by(self, y):
        self.browser.execute_script('window.scrollTo(0, {0})'.format(y))