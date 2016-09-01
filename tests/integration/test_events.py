from ddt import ddt, data, unpack
from mock import Mock, patch
from workbench.runtime import WorkbenchRuntime

from drag_and_drop_v2.default_data import TOP_ZONE_TITLE, TOP_ZONE_ID, ITEM_CORRECT_FEEDBACK

from .test_base import BaseIntegrationTest, DefaultDataTestMixin
from .test_interaction import ParameterizedTestsMixin
from tests.integration.test_base import InteractionTestBase


@ddt
class EventsFiredTest(DefaultDataTestMixin, ParameterizedTestsMixin, InteractionTestBase, BaseIntegrationTest):
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

    def setUp(self):
        mock = Mock()
        context = patch.object(WorkbenchRuntime, 'publish', mock)
        context.start()
        self.addCleanup(context.stop)
        self.publish = mock
        super(EventsFiredTest, self).setUp()

    def _get_scenario_xml(self):  # pylint: disable=no-self-use
        return "<vertical_demo><drag-and-drop-v2/></vertical_demo>"

    @data(*enumerate(scenarios))  # pylint: disable=star-args
    @unpack
    def test_event(self, index, event):
        self.parameterized_item_positive_feedback_on_good_move(self.items_map)
        dummy, name, published_data = self.publish.call_args_list[index][0]
        self.assertEqual(name, event['name'])
        self.assertEqual(
                published_data, event['data']
        )
