from tests.integration.test_base import SingleScenarioIntegrationTest
from tests.utils import load_scenario_from_file


class TestBlockContentsPlain(SingleScenarioIntegrationTest):
    def _get_scenario_for_test(self):
        return load_scenario_from_file('integration/data/drag_and_drop-whats_up.json')

    def test_check_item_labels(self):
        page = self.go_to_page(self._page_title)

        items_container = page.find_element_by_css_selector('ul.items')
        items = items_container.find_elements_by_css_selector('li.option')
        self.assertEqual(len(items), 3)

        self.assertEqual(items[0].text, 'A')
        self.assertEqual(items[1].text, 'B')
        self.assertEqual(items[2].text, 'X')