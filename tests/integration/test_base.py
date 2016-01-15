# Imports ###########################################################

from xml.sax.saxutils import escape
from selenium.webdriver.support.ui import WebDriverWait

from workbench import scenarios
from xblockutils.resources import ResourceLoader

from xblockutils.base_test import SeleniumBaseTest


# Globals ###########################################################

loader = ResourceLoader(__name__)


# Classes ###########################################################


class BaseIntegrationTest(SeleniumBaseTest):
    default_css_selector = 'section.themed-xblock.xblock--drag-and-drop'
    module_name = __name__

    _additional_escapes = {
        '"': "&quot;",
        "'": "&apos;"
    }

    @staticmethod
    def _make_scenario_xml(display_name, show_title, question_text, completed=False, show_question_header=True):
        return """
            <vertical_demo>
                <drag-and-drop-v2
                    display_name='{display_name}'
                    show_title='{show_title}'
                    question_text='{question_text}'
                    show_question_header='{show_question_header}'
                    weight='1'
                    completed='{completed}'
                />
            </vertical_demo>
        """.format(
            display_name=escape(display_name),
            show_title=show_title,
            question_text=escape(question_text),
            show_question_header=show_question_header,
            completed=completed,
        )

    def _get_custom_scenario_xml(self, filename):
        data = loader.load_unicode(filename)
        return "<vertical_demo><drag-and-drop-v2 data='{data}'/></vertical_demo>".format(
            data=escape(data, self._additional_escapes)
        )

    def _add_scenario(self, identifier, title, xml):
        scenarios.add_xml_scenario(identifier, title, xml)
        self.addCleanup(scenarios.remove_scenario, identifier)

    def _get_items(self):
        items_container = self._page.find_element_by_css_selector('.item-bank')
        return items_container.find_elements_by_css_selector('.option')

    def _get_zones(self):
        return self._page.find_elements_by_css_selector(".drag-container .zone")

    def _get_popup(self):
        return self._page.find_element_by_css_selector(".popup")

    def _get_popup_content(self):
        return self._page.find_element_by_css_selector(".popup .popup-content")

    def _get_keyboard_help(self):
        return self._page.find_element_by_css_selector(".keyboard-help")

    def _get_keyboard_help_button(self):
        return self._page.find_element_by_css_selector(".keyboard-help .keyboard-help-button")

    def _get_keyboard_help_dialog(self):
        return self._page.find_element_by_css_selector(".keyboard-help .keyboard-help-dialog")

    def _get_keyboard_help_dialogs(self):
        return self.browser.find_elements_by_css_selector(".keyboard-help .keyboard-help-dialog")

    def _get_reset_button(self):
        return self._page.find_element_by_css_selector('.reset-button')

    def _get_feedback(self):
        return self._page.find_element_by_css_selector(".feedback")

    def _get_feedback_message(self):
        return self._page.find_element_by_css_selector(".feedback .message")

    def scroll_down(self, pixels=50):
        self.browser.execute_script("$(window).scrollTop({})".format(pixels))

    @staticmethod
    def get_element_html(element):
        return element.get_attribute('innerHTML').strip()

    @staticmethod
    def get_element_classes(element):
        return element.get_attribute('class').split()

    def wait_until_html_in(self, html, elem):
        wait = WebDriverWait(elem, 2)
        wait.until(lambda e: html in e.get_attribute('innerHTML'),
                   u"{} should be in {}".format(html, elem.get_attribute('innerHTML')))

    @staticmethod
    def wait_until_has_class(class_name, elem):
        wait = WebDriverWait(elem, 2)
        wait.until(lambda e: class_name in e.get_attribute('class').split(),
                   u"Class name {} not in {}".format(class_name, elem.get_attribute('class')))
