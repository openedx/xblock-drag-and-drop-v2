# Imports ###########################################################
from xml.sax.saxutils import escape
from selenium.webdriver.support.ui import WebDriverWait
from tests.utils import load_resource

from workbench import scenarios

from xblockutils.base_test import SeleniumBaseTest

# Classes ###########################################################


class BaseIntegrationTest(SeleniumBaseTest):
    default_css_selector = 'section.xblock--drag-and-drop'
    module_name = __name__

    _additional_escapes = {
        '"': "&quot;",
        "'": "&apos;"
    }

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
        items_container = self._page.find_element_by_css_selector('.items')
        return items_container.find_elements_by_css_selector('.option')

    def _get_zones(self):
        return self._page.find_elements_by_css_selector(".drag-container .zone")

    def _get_feedback_message(self):
        return self._page.find_element_by_css_selector(".feedback .message")

    def get_element_html(self, element):
        return element.get_attribute('innerHTML').strip()

    def get_element_classes(self, element):
        return element.get_attribute('class').split()

    def wait_until_html_in(self, html, elem):
        wait = WebDriverWait(elem, 2)
        wait.until(lambda e: html in e.get_attribute('innerHTML'),
                   u"{} should be in {}".format(html, elem.get_attribute('innerHTML')))

    def wait_until_has_class(self, class_name, elem):
        wait = WebDriverWait(elem, 2)
        wait.until(lambda e: class_name in e.get_attribute('class').split(),
                   u"Class name {} not in {}".format(class_name, elem.get_attribute('class')))
