from __future__ import division
import base64
from collections import namedtuple
import os.path

from xblockutils.resources import ResourceLoader

from .test_base import BaseIntegrationTest
from .test_interaction import InteractionTestBase

loader = ResourceLoader(__name__)


def _svg_to_data_uri(path):
    """ Convert an SVG image (by path) to a data URI """
    data_path = os.path.dirname(__file__) + "/data/"
    with open(data_path + path, "rb") as svg_fh:
        encoded = base64.b64encode(svg_fh.read())
    return "data:image/svg+xml;base64,{}".format(encoded)


Expectation = namedtuple('Expectation', [
    'item_id', 'zone_id', 'width_percent', 'wh_ratio',
])
Expectation.__new__.__defaults__ = (None,) * len(Expectation._fields)  # pylint: disable=protected-access
ZONE_33 = "Zone 1/3"  # Title of top zone in each image used in these tests (33% width)
ZONE_50 = "Zone 50%"
ZONE_75 = "Zone 75%"
AUTO_MAX_WIDTH = 29  # Maximum width (as % of the parent container) for items with automatic sizing


class SizingTests(InteractionTestBase, BaseIntegrationTest):
    """
    Tests that cover features like draggable blocks with automatic sizes vs. specified sizes,
    different background image ratios, and responsive behavior.

    Tip: To see how these tests work, throw in an 'import time; time.sleep(200)' at the start of
    one of the tests, so you can check it out in the selenium browser window that opens.
    """
    PAGE_TITLE = 'Drag and Drop v2 Sizing'
    PAGE_ID = 'drag_and_drop_v2_sizing'

    @staticmethod
    def _get_scenario_xml():
        """
        Set up the test scenario:
            * An upper dndv2 xblock with a wide image (1600x900 SVG)
              (on desktop and mobile, this background image will always fill the available width
                and should have the same width as the item bank above)
            * A lower dndv2 xblock with a small square image (500x500 SVG)
              (on desktop, the square image is not as wide as the item bank, but on mobile it
               may take up the whole width of the screen)
        """
        params = {
            "img": "wide",
            "img_wide_url": _svg_to_data_uri('dnd-bg-wide.svg'),
            "img_square_url": _svg_to_data_uri('dnd-bg-square.svg'),
            "img_400x300_url": _svg_to_data_uri('400x300.svg'),
            "img_200x200_url": _svg_to_data_uri('200x200.svg'),
        }
        upper_block = "<drag-and-drop-v2 data='{data}'/>".format(
            data=loader.render_django_template("data/test_sizing_template.json", params)
        )
        params["img"] = "square"
        lower_block = "<drag-and-drop-v2 data='{data}'/>".format(
            data=loader.render_django_template("data/test_sizing_template.json", params)
        )

        return "<vertical_demo>{}\n{}</vertical_demo>".format(upper_block, lower_block)

    def test_wide_image(self):
        expectations = [
            # The text 'Auto' with no fixed size specified should be 5-20% wide
            Expectation(item_id=0, zone_id=ZONE_33, width_percent=[5, 20]),
            # The long text with no fixed size specified should be wrapped at the maximum width
            Expectation(item_id=1, zone_id=ZONE_33, width_percent=AUTO_MAX_WIDTH),
            # The text items that specify specific widths as a percentage of the background image:
            Expectation(item_id=2, zone_id=ZONE_33, width_percent=33.3),
            Expectation(item_id=3, zone_id=ZONE_33, width_percent=50),
            Expectation(item_id=4, zone_id=ZONE_33, width_percent=75),
        ]
        self._check_sizes(0, expectations)

    def _check_sizes(self, block_index, expectations):
        """ Test the actual dimensions that each draggable has, in the bank and when placed """
        # Check assumptions - the container wrapping this XBlock should be 770px wide
        self._switch_to_block(block_index)
        self.assertEqual(self._page.size["width"], 770)  # self._page is the .xblock--drag-and-drop div

        target_img = self._page.find_element_by_css_selector('.target-img')
        target_img_width = target_img.size["width"]
        self.assertEqual(target_img_width, 755)

        item_bank = self._page.find_element_by_css_selector('.item-bank')
        item_bank_width = item_bank.size["width"]
        self.assertEqual(item_bank_width, 755)

        # Test each element, before it is placed.
        for expect in expectations:
            item_unplaced = self._get_item_by_value(expect.item_id)
            if expect.width_percent is not None:
                width_percent = item_unplaced.size["width"] / item_bank_width * 100
                if isinstance(expect.width_percent, list):
                    min_expected, max_expected = expect.width_percent
                    msg = "Unplaced item {} should have width of {}% - {}%. Actual: {:.2f}%".format(
                        expect.item_id, min_expected, max_expected, width_percent
                    )
                    self.assertGreaterEqual(width_percent, min_expected, msg)
                    self.assertLessEqual(width_percent, max_expected, msg)
                else:
                    self.assertAlmostEqual(
                        width_percent, expect.width_percent, delta=1,
                        msg="Unplaced item {} should have width of ~{}% (+/- 1%). Actual: {:.2f}%".format(
                            expect.item_id, expect.width_percent, width_percent
                        )
                    )

        # Test each element, after it it placed.

        for expect in expectations:
            self.place_item(expect.item_id, expect.zone_id)
            item_placed = self._get_placed_item_by_value(expect.item_id)

            if expect.width_percent is not None:
                width_percent = item_placed.size["width"] / target_img_width * 100
                if isinstance(expect.width_percent, list):
                    min_expected, max_expected = expect.width_percent
                    msg = "Placed item {} should have width of {}% - {}%. Actual: {:.2f}%".format(
                        expect.item_id, min_expected, max_expected, width_percent
                    )
                    self.assertGreaterEqual(width_percent, min_expected, msg)
                    self.assertLessEqual(width_percent, max_expected, msg)
                else:
                    self.assertAlmostEqual(
                        width_percent, expect.width_percent, delta=1,
                        msg="Placed item {} should have width of ~{}% (+/- 1%). Actual: {:.2f}%".format(
                            expect.item_id, expect.width_percent, width_percent
                        )
                    )
