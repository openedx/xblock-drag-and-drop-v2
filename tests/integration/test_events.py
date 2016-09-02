from ddt import data, ddt, unpack
from mock import Mock, patch

from workbench.runtime import WorkbenchRuntime

from drag_and_drop_v2.default_data import (
    TOP_ZONE_TITLE, TOP_ZONE_ID, MIDDLE_ZONE_TITLE, MIDDLE_ZONE_ID, ITEM_CORRECT_FEEDBACK, ITEM_INCORRECT_FEEDBACK
)
from tests.integration.test_base import BaseIntegrationTest, DefaultDataTestMixin, InteractionTestBase
from tests.integration.test_interaction import DefaultDataTestMixin, ParameterizedTestsMixin
from tests.integration.test_interaction_assessment import DefaultAssessmentDataTestMixin, AssessmentTestMixin


class BaseEventsTests(InteractionTestBase, BaseIntegrationTest):
    def setUp(self):
        mock = Mock()
        context = patch.object(WorkbenchRuntime, 'publish', mock)
        context.start()
        self.addCleanup(context.stop)
        self.publish = mock
        super(BaseEventsTests, self).setUp()


@ddt
class EventsFiredTest(DefaultDataTestMixin, ParameterizedTestsMixin, BaseEventsTests):
    """
    Tests that the analytics events are fired and in the proper order.
    """
    # These events must be fired in this order.
    scenarios = (
        {
            'name': 'edx.drag_and_drop_v2.loaded',
            'data': {},
        },
        {
            'name': 'edx.drag_and_drop_v2.item.picked_up',
            'data': {'item_id': 0},
        },
        {
            'name': 'grade',
            'data': {'max_value': 1, 'value': (2.0 / 5)},
        },
        {
            'name': 'edx.drag_and_drop_v2.item.dropped',
            'data': {
                'is_correct': True,
                'item_id': 0,
                'location': TOP_ZONE_TITLE,
                'location_id': TOP_ZONE_ID,
            },
        },
        {
            'name': 'edx.drag_and_drop_v2.feedback.opened',
            'data': {
                'content': ITEM_CORRECT_FEEDBACK.format(zone=TOP_ZONE_TITLE),
                'truncated': False,
            },
        },
        {
            'name': 'edx.drag_and_drop_v2.feedback.closed',
            'data': {
                'manually': False,
                'content': ITEM_CORRECT_FEEDBACK.format(zone=TOP_ZONE_TITLE),
                'truncated': False,
            },
        },
    )

    def _get_scenario_xml(self):  # pylint: disable=no-self-use
        return "<vertical_demo><drag-and-drop-v2/></vertical_demo>"

    @data(*enumerate(scenarios))  # pylint: disable=star-args
    @unpack
    def test_event(self, index, event):
        self.parameterized_item_positive_feedback_on_good_move(self.items_map)
        dummy, name, published_data = self.publish.call_args_list[index][0]
        self.assertEqual(name, event['name'])
        self.assertEqual(published_data, event['data'])


@ddt
class AssessmentEventsFiredTest(
    DefaultAssessmentDataTestMixin, AssessmentTestMixin, BaseEventsTests
):
    scenarios = (
        {
            'name': 'edx.drag_and_drop_v2.loaded',
            'data': {},
        },
        {
            'name': 'edx.drag_and_drop_v2.item.picked_up',
            'data': {'item_id': 0},
        },
        {
            'name': 'edx.drag_and_drop_v2.item.dropped',
            'data': {
                'is_correct': False,
                'item_id': 0,
                'location': MIDDLE_ZONE_TITLE,
                'location_id': MIDDLE_ZONE_ID,
            },
        },
        {
            'name': 'edx.drag_and_drop_v2.item.picked_up',
            'data': {'item_id': 1},
        },
        {
            'name': 'edx.drag_and_drop_v2.item.dropped',
            'data': {
                'is_correct': False,
                'item_id': 1,
                'location': TOP_ZONE_TITLE,
                'location_id': TOP_ZONE_ID,
            },
        },
        {
            'name': 'grade',
            'data': {'max_value': 1, 'value': (1.0 / 5)},
        },
        {
            'name': 'edx.drag_and_drop_v2.feedback.opened',
            'data': {
                'content': "\n".join([ITEM_INCORRECT_FEEDBACK, ITEM_INCORRECT_FEEDBACK]),
                'truncated': False,
            },
        },
    )

    def test_event(self):
        self.scroll_down(pixels=100)

        self.place_item(0, MIDDLE_ZONE_ID)
        self.wait_until_ondrop_xhr_finished(self._get_item_by_value(0))
        self.place_item(1, TOP_ZONE_ID)
        self.wait_until_ondrop_xhr_finished(self._get_item_by_value(0))

        self.click_submit()
        self.wait_for_ajax()
        for index, event in enumerate(self.scenarios):
            dummy, name, published_data = self.publish.call_args_list[index][0]
            self.assertEqual(name, event['name'])
            self.assertEqual(published_data, event['data'])
