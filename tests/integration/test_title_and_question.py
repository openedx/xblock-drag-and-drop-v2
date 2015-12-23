from ddt import ddt, unpack, data
from selenium.common.exceptions import NoSuchElementException
from .test_base import BaseIntegrationTest
from workbench import scenarios


@ddt
class TestDragAndDropTitleAndQuestion(BaseIntegrationTest):
    @unpack
    @data(
        ('Plain text question 1, header visible.', True),
        ('Plain text question 2, header hidden.', False),
        ('Question/instructions with <i>HTML</i> and header.', True),
        ('<span style="color: red;">Span question, no header</span>', False),
    )
    def test_question_parameters(self, question_text, show_question_header):
        const_page_name = 'Test title and question parameters'
        const_page_id = 'test_block_title_and_question'
        scenario_xml = self._make_scenario_xml(
            display_name="Title",
            show_title=True,
            question_text=question_text,
            show_question_header=show_question_header,
        )
        scenarios.add_xml_scenario(const_page_id, const_page_name, scenario_xml)
        self.addCleanup(scenarios.remove_scenario, const_page_id)

        page = self.go_to_page(const_page_name)
        is_question_header_visible = len(page.find_elements_by_css_selector('section.problem > h3')) > 0
        self.assertEqual(is_question_header_visible, show_question_header)

        question = page.find_element_by_css_selector('section.problem > p')
        self.assertEqual(self.get_element_html(question), question_text)

    @unpack
    @data(
        ('plain shown', 'title1', True),
        ('plain hidden', 'title2', False),
        ('html shown', 'title with <i>HTML</i>', True),
        ('html hidden', '<span style="color:red">Title: HTML?</span>', False)
    )
    def test_title_parameters(self, _, display_name, show_title):
        const_page_name = 'Test show title parameter'
        const_page_id = 'test_block_show_title'
        scenario_xml = self._make_scenario_xml(
            display_name=display_name,
            show_title=show_title,
            question_text='Generic question',
        )
        scenarios.add_xml_scenario(const_page_id, const_page_name, scenario_xml)
        self.addCleanup(scenarios.remove_scenario, const_page_id)

        page = self.go_to_page(const_page_name)
        if show_title:
            problem_header = page.find_element_by_css_selector('h2.problem-header')
            expected_header = display_name + ' (1 point possible)'
            self.assertEqual(self.get_element_html(problem_header), expected_header)
        else:
            with self.assertRaises(NoSuchElementException):
                page.find_element_by_css_selector('h2.problem-header')
