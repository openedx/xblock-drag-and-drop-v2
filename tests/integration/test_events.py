from ddt import data, ddt, unpack
from mock import Mock, patch
from selenium.webdriver.common.keys import Keys

from workbench.runtime import WorkbenchRuntime

from drag_and_drop_v2.default_data import (
    TOP_ZONE_TITLE, TOP_ZONE_ID, MIDDLE_ZONE_TITLE, MIDDLE_ZONE_ID, BOTTOM_ZONE_ID, ITEM_CORRECT_FEEDBACK_TOP,
    ITEM_INCORRECT_FEEDBACK, ITEM_TOP_ZONE_NAME, ITEM_MIDDLE_ZONE_NAME,
)
from tests.integration.test_base import (BaseIntegrationTest, InteractionTestBase, ItemDefinition,
                                         FreeSizingInteractionTestBase)
from tests.integration.test_interaction import DefaultDataTestMixin, ParameterizedTestsMixin
from tests.integration.test_interaction_assessment import DefaultAssessmentDataTestMixin, AssessmentTestMixin
from drag_and_drop_v2.utils import Constants


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
    item_sizing = Constants.FIXED_SIZING
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
            'data': {'max_value': 1, 'value': (2.0 / 5), 'only_if_higher': None},
        },
        {
            'name': 'progress',
            'data': {}
        },
        {
            'name': 'edx.drag_and_drop_v2.item.dropped',
            'data': {
                'is_correct': True,
                'item': ITEM_TOP_ZONE_NAME,
                'item_id': 0,
                'location': TOP_ZONE_TITLE,
                'location_id': TOP_ZONE_ID,
            },
        },
        {
            'name': 'edx.drag_and_drop_v2.feedback.opened',
            'data': {
                'content': ITEM_CORRECT_FEEDBACK_TOP,
                'truncated': False,
            },
        },
        {
            'name': 'edx.drag_and_drop_v2.feedback.closed',
            'data': {
                'manually': True,
                'content': ITEM_CORRECT_FEEDBACK_TOP,
                'truncated': False,
            },
        },
    )

    def _get_scenario_xml(self):  # pylint: disable=no-self-use
        return "<vertical_demo><drag-and-drop-v2 item_sizing='{item_sizing}' /></vertical_demo>"\
            .format(item_sizing=self.item_sizing)

    @data(*enumerate(scenarios))  # pylint: disable=star-args
    @unpack
    def test_event(self, index, event):
        self.parameterized_item_positive_feedback_on_good_move_standard(self.items_map)
        _, name, published_data = self.publish.call_args_list[index][0]
        self.assertEqual(name, event['name'])
        self.assertEqual(published_data, event['data'])


@ddt
class FreeSizingEventsFiredTest(EventsFiredTest, FreeSizingInteractionTestBase):
    item_sizing = Constants.FREE_SIZING


@ddt
class AssessmentEventsFiredTest(
    DefaultAssessmentDataTestMixin, AssessmentTestMixin, BaseEventsTests
):
    item_sizing = Constants.FIXED_SIZING
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
                'item': ITEM_TOP_ZONE_NAME,
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
                'item': ITEM_MIDDLE_ZONE_NAME,
                'item_id': 1,
                'location': TOP_ZONE_TITLE,
                'location_id': TOP_ZONE_ID,
            },
        },
        {
            'name': 'grade',
            'data': {'max_value': 1, 'value': (1.0 / 5), 'only_if_higher': None},
        },
        {
            'name': 'progress',
            'data': {}
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
            _, name, published_data = self.publish.call_args_list[index][0]
            self.assertEqual(name, event['name'])
            self.assertEqual(published_data, event['data'])

    def test_grade(self):
        """
        Test grading after submitting solution in assessment mode
        """
        self.place_item(0, TOP_ZONE_ID, Keys.RETURN)  # Correctly placed item
        self.place_item(1, BOTTOM_ZONE_ID, Keys.RETURN)  # Incorrectly placed item
        self.place_item(4, MIDDLE_ZONE_ID, Keys.RETURN)  # Incorrectly placed decoy
        self.click_submit()

        events = self.publish.call_args_list
        published_grade = next((event[0][2] for event in events if event[0][1] == 'grade'))
        expected_grade = {'max_value': 1, 'value': (1.0 / 5.0), 'only_if_higher': None}
        self.assertEqual(published_grade, expected_grade)


@ddt
class FreeSizingAssessmentEventsFiredTest(
    AssessmentEventsFiredTest, FreeSizingInteractionTestBase
):

    item_sizing = Constants.FREE_SIZING


@ddt
class ItemDroppedEventTest(DefaultDataTestMixin, BaseEventsTests):
    """
    Test that the item.dropped event behaves properly.

    """
    item_sizing = Constants.FIXED_SIZING
    items_map = {
        0: ItemDefinition(0, "Has name", "", 'zone-1', "Zone 1", "Yes", "No"),
        1: ItemDefinition(1, "", "https://placehold.it/100x100", 'zone-2', "Zone 2", "Yes", "No"),
    }

    scenarios = (
        (
            ['zone-1', 'zone-2'],
            [
                {
                    'is_correct': True,
                    'item': "Has name",
                    'item_id': 0,
                    'location': 'Zone 1',
                    'location_id': 'zone-1'
                },
                {
                    'is_correct': True,
                    'item': "https://placehold.it/100x100",
                    'item_id': 1,
                    'location': 'Zone 2',
                    'location_id': 'zone-2'
                }
            ],
        ),
        (
            ['zone-2', 'zone-1'],
            [
                {
                    'is_correct': False,
                    'item': "Has name",
                    'item_id': 0,
                    'location': 'Zone 2',
                    'location_id': 'zone-2'
                },
                {
                    'is_correct': False,
                    'item': "https://placehold.it/100x100",
                    'item_id': 1,
                    'location': 'Zone 1',
                    'location_id': 'zone-1'
                }
            ],
        ),
    )

    def _get_scenario_xml(self):
        return self._get_custom_scenario_xml("data/test_item_dropped.json")

    @data(*scenarios)  # pylint: disable=star-args
    @unpack
    def test_item_dropped_event(self, placement, expected_events):
        for i, zone in enumerate(placement):
            self.place_item(i, zone, Keys.RETURN)

        events = self.publish.call_args_list
        event_name = 'edx.drag_and_drop_v2.item.dropped'
        published_events = [event[0][2] for event in events if event[0][1] == event_name]
        self.assertEqual(published_events, expected_events)


@ddt
class FreeSizingItemDroppedEventTest(ItemDroppedEventTest, FreeSizingInteractionTestBase):
    item_sizing = Constants.FREE_SIZING
