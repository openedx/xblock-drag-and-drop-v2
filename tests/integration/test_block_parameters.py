from xml.sax.saxutils import escape
from nose_parameterized import parameterized
from workbench import scenarios

from tests.integration.test_base import BaseIntegrationTest


class TestBlockParameters(BaseIntegrationTest):
    @parameterized.expand([
        ("plain1", 'title1', 'question1'),
        ("plain2", 'title2', 'question2'),
        ("html1", 'title with <i>HTML</i>', 'Question with <i>HTML</i>'),
        ("html2", '<span style="color:red">Title: HTML?</span>', '<span style="color:red">Span question</span>'),
    ])
    def test_block_parameters(self, _, display_name, question_text):
        const_page_name = "Test block parameters"
        const_page_id = 'test_block_title'
        scenarios.add_xml_scenario(
            const_page_id, const_page_name,
            """
                <vertical_demo><drag-and-drop-v2
                    display_name='{display_name}' question_text='{question_text}'
                /></vertical_demo>
            """.format(display_name=escape(display_name), question_text=escape(question_text))
        )
        self.addCleanup(scenarios.remove_scenario, const_page_id)

        page = self.go_to_page(const_page_name)
        problem_header = page.find_element_by_css_selector('h2.problem-header')
        self.assertEqual(self.get_element_html(problem_header), display_name)

        question = page.find_element_by_css_selector("section.problem > p")
        self.assertEqual(self.get_element_html(question), question_text)

    def _get_scenarios_for_test(self):
        return []



