from __future__ import division
import base64
from collections import namedtuple
import os.path
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait

from xblockutils.resources import ResourceLoader

from .test_base import BaseIntegrationTest
from tests.integration.test_base import InteractionTestBase, FreeSizingInteractionTestBase
from drag_and_drop_v2.utils import Constants

loader = ResourceLoader(__name__)


def _svg_to_data_uri(path):
    """ Convert an SVG image (by path) to a data URI """
    data_path = os.path.dirname(__file__) + "/data/"
    with open(data_path + path, "rb") as svg_fh:
        encoded = base64.b64encode(svg_fh.read())
    return "data:image/svg+xml;base64,{}".format(encoded)


Expectation = namedtuple('Expectation', [
    'item_id',
    'zone_id',
    'width_percent_bank',  # we expect this item to have this width relative to its container (item bank)
    'width_percent_image',  # we expect this item to have this width relative to its container (image target)
    'width_percent',  # we expect this item to have this width relative to its container (item bank or image target)
    'fixed_width_percent',  # we expect this item to have this width (always relative to the target image)
    'img_pixel_size_exact',  # we expect the image inside the draggable to have the exact size [w, h] in pixels
])
Expectation.__new__.__defaults__ = (None,) * len(Expectation._fields)  # pylint: disable=protected-access
ZONE_33 = "Zone 1/3"  # Title of top zone in each image used in these tests (33% width)
ZONE_50 = "Zone 50%"
ZONE_75 = "Zone 75%"

# iPhone 6 viewport size is 375x627; this is the closest Chrome can get.
MOBILE_WINDOW_WIDTH = 400
MOBILE_WINDOW_HEIGHT = 627

# Maximum widths (as % of the parent container) for items with automatic sizing
AUTO_MAX_WIDTH_DESKTOP = 30
AUTO_MAX_WIDTH_MOBILE_ITEM_BANK = 80
AUTO_MAX_WIDTH_MOBILE_TARGET_IMG = 30

FIXED_WIDTH_IN_PIXELS = 150


class SizingTests(InteractionTestBase, BaseIntegrationTest):
    """
    Tests that cover features like draggable blocks with automatic sizes vs. specified sizes,
    different background image ratios, and responsive behavior.

    Tip: To see how these tests work, throw in an 'import time; time.sleep(200)' at the start of
    one of the tests, so you can check it out in the selenium browser window that opens.

    These tests intentionally do not use ddt in order to run faster. Instead, each test iterates
    through data and uses verbose assertion messages to clearly indicate where failures occur.
    """
    PAGE_TITLE = 'Drag and Drop v2 Sizing'
    PAGE_ID = 'drag_and_drop_v2_sizing'
    ALIGN_ZONES = False  # Set to True to test the feature that aligns draggable items when dropped.
    item_sizing = Constants.FIXED_SIZING

    @classmethod
    def _get_scenario_xml(cls):
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
            "align_zones": cls.ALIGN_ZONES,
            "img_wide_url": _svg_to_data_uri('dnd-bg-wide.svg'),
            "img_square_url": _svg_to_data_uri('dnd-bg-square.svg'),
            "img_400x300_url": _svg_to_data_uri('400x300.svg'),
            "img_200x200_url": _svg_to_data_uri('200x200.svg'),
            "img_60x60_url": _svg_to_data_uri('60x60.svg'),
        }
        upper_block = "<drag-and-drop-v2 item_sizing='{item_sizing}' data='{data}'/>".format(
            data=loader.render_django_template("data/test_sizing_template.json", params),
            item_sizing=cls.item_sizing
        )
        params["img"] = "square"
        lower_block = "<drag-and-drop-v2 item_sizing='{item_sizing}' data='{data}'/>".format(
            data=loader.render_django_template("data/test_sizing_template.json", params),
            item_sizing=cls.item_sizing
        )

        return "<vertical_demo>{}\n{}</vertical_demo>".format(upper_block, lower_block)

    EXPECTATIONS_DESKTOP = [
        Expectation(item_id=0, zone_id=ZONE_33, fixed_width_percent=FIXED_WIDTH_IN_PIXELS),
        Expectation(item_id=1, zone_id=ZONE_33, fixed_width_percent=FIXED_WIDTH_IN_PIXELS),
        Expectation(item_id=2, zone_id=ZONE_33, fixed_width_percent=FIXED_WIDTH_IN_PIXELS),
        Expectation(item_id=3, zone_id=ZONE_50, fixed_width_percent=FIXED_WIDTH_IN_PIXELS),
        Expectation(item_id=4, zone_id=ZONE_75, fixed_width_percent=FIXED_WIDTH_IN_PIXELS),
        Expectation(item_id=5, zone_id=ZONE_50, fixed_width_percent=FIXED_WIDTH_IN_PIXELS),
        Expectation(item_id=6, zone_id=ZONE_50, fixed_width_percent=FIXED_WIDTH_IN_PIXELS),
        Expectation(item_id=7, zone_id=ZONE_50, fixed_width_percent=FIXED_WIDTH_IN_PIXELS),
        Expectation(item_id=8, zone_id=ZONE_50, fixed_width_percent=FIXED_WIDTH_IN_PIXELS),
        Expectation(item_id=9, zone_id=ZONE_33, fixed_width_percent=FIXED_WIDTH_IN_PIXELS),
    ]

    EXPECTATIONS_MOBILE = [
        # The text 'Auto' with no fixed size specified should be 3-20% wide
        Expectation(
            item_id=0,
            zone_id=ZONE_33,
            fixed_width_percent=FIXED_WIDTH_IN_PIXELS,
            width_percent_image=[3, AUTO_MAX_WIDTH_MOBILE_ITEM_BANK],
        ),
        # The long text with no fixed size specified should be wrapped at the maximum width
        Expectation(
            item_id=1,
            zone_id=ZONE_33,
            fixed_width_percent=FIXED_WIDTH_IN_PIXELS,
            width_percent_image=AUTO_MAX_WIDTH_MOBILE_TARGET_IMG,
        ),
        # The text items that specify specific widths as a percentage of the background image:
        Expectation(item_id=2, zone_id=ZONE_33, fixed_width_percent=FIXED_WIDTH_IN_PIXELS),
        Expectation(item_id=3, zone_id=ZONE_50, fixed_width_percent=FIXED_WIDTH_IN_PIXELS),
        Expectation(item_id=4, zone_id=ZONE_75, fixed_width_percent=FIXED_WIDTH_IN_PIXELS),
        # A 400x300 image with automatic sizing should be constrained to the maximum width,
        # except on a large background image, where its natural size is smaller than max allowed size.
        Expectation(
            item_id=5,
            zone_id=ZONE_50,
            fixed_width_percent=FIXED_WIDTH_IN_PIXELS,
            width_percent_image=[25, AUTO_MAX_WIDTH_MOBILE_TARGET_IMG],
        ),
        # A 200x200 image with automatic sizing
        Expectation(
            item_id=6,
            zone_id=ZONE_50,
            fixed_width_percent=FIXED_WIDTH_IN_PIXELS,
            width_percent_image=[10, AUTO_MAX_WIDTH_MOBILE_ITEM_BANK],
        ),
        # A 400x300 image with a specified width of 50%
        Expectation(item_id=7, zone_id=ZONE_50, fixed_width_percent=FIXED_WIDTH_IN_PIXELS),
        # A 200x200 image with a specified width of 50%
        Expectation(item_id=8, zone_id=ZONE_50, fixed_width_percent=FIXED_WIDTH_IN_PIXELS),
        # A 60x60 auto-sized image should appear with pixel dimensions of 60x60 since it's
        # too small to be shrunk be the default max-size.
        Expectation(item_id=9, zone_id=ZONE_33, img_pixel_size_exact=[60, 60]),
    ]

    def test_wide_image_desktop(self):
        """ Test the upper, larger, wide image in a desktop-sized window """

        self._check_sizes(0, self.EXPECTATIONS_DESKTOP)

    def test_square_image_desktop(self):
        """ Test the lower, smaller, square image in a desktop-sized window """
        self._check_sizes(1, self.EXPECTATIONS_DESKTOP, expected_img_width=500)

    def _size_for_mobile(self):
        self.browser.set_window_size(MOBILE_WINDOW_WIDTH, MOBILE_WINDOW_HEIGHT)
        wait = WebDriverWait(self.browser, 2)
        wait.until(lambda browser: browser.get_window_size()["width"] == MOBILE_WINDOW_WIDTH)
        # Fix platform inconsistencies caused by scrollbar size:
        self.browser.execute_script('$("body").css("margin-right", "40px")')
        scrollbar_width = self.browser.execute_script(
            "var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body');"
            "var widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();"
            "$outer.remove();"
            "return 100 - widthWithScroll;"
        )
        self.browser.execute_script('$(".wrapper-workbench").css("margin-right", "-{}px")'.format(40 + scrollbar_width))
        # And reduce the wasted space around our XBlock in the workbench:
        self.browser.execute_script('return $(".workbench .preview").css("margin", "0")')
        # Dynamically adjusting styles causes available screen width to change, but does not always emit
        # resize events consistently, so emit resize manually to make sure the block adapts to the new size.

        self.browser.execute_script('$(window).resize()')

    def _check_mobile_container_size(self):
        """ Verify that the drag-container tightly fits into the available space. """
        drag_container = self._page.find_element_by_css_selector('.drag-container')
        horizontal_padding = 20
        self.assertEqual(drag_container.size['width'], MOBILE_WINDOW_WIDTH - 2*horizontal_padding)

    def test_wide_image_mobile(self):
        """ Test the upper, larger, wide image in a mobile-sized window """
        self._size_for_mobile()
        self._check_mobile_container_size()
        self._check_sizes(0, self.EXPECTATIONS_MOBILE, expected_img_width=1600, is_desktop=False)

    def test_square_image_mobile(self):
        """ Test the lower, smaller, square image in a mobile-sized window """
        self._size_for_mobile()
        self._check_mobile_container_size()
        self._check_sizes(1, self.EXPECTATIONS_MOBILE, expected_img_width=500, is_desktop=False)

    def _check_width(self, item_description, item, expected_percent):
        """
        Check that item 'item' has a width that is approximately the specified percentage
        of container_width, or if expected_percent is a pair of numbers, that it is within
        that range.
        """
        width_pixels = item.size["width"]

        if isinstance(expected_percent, (list, tuple)):
            min_expected, max_expected = expected_percent
            msg = "{} should have width of {}px - {}px. Actual: {}px ".format(
                item_description, min_expected, max_expected, width_pixels
            )
            self.assertGreaterEqual(width_pixels, min_expected, msg)
            self.assertLessEqual(width_pixels, max_expected, msg)
        else:
            self.assertEqual(
                width_pixels, expected_percent,
                msg="{} should have width of {}px . Actual: {}px ".format(
                    item_description, expected_percent, width_pixels
                )
            )

        if item.find_elements_by_css_selector("img"):
            # This item contains an image. The image should always fill the width of the draggable.
            image = item.find_element_by_css_selector("img")
            image_width_expected = item.size["width"] - 22
            self.assertAlmostEqual(
                image.size["width"], image_width_expected, delta=1,
                msg="{} image does not take up the full width of the draggable (width is {}px; expected {}px)".format(
                    item_description, image.size["width"], image_width_expected,
                )
            )

    def _check_img_pixel_dimensions(self, item_description, item, expect_w, expect_h):
        img_element = item.find_element_by_css_selector("img")
        if self.item_sizing == Constants.FIXED_SIZING:
            return

        self.assertEqual(
            img_element.size, {"width": expect_w, "height": expect_h},
            msg="Expected {}'s image to have exact dimensions {}x{}px; found {}x{}px instead.".format(
                item_description, expect_w, expect_h, img_element.size["width"], img_element.size["height"]
            )
        )

    def _check_sizes(self, block_index, expectations, expected_img_width=None,  # pylint: disable=unused-argument
                     is_desktop=True):

        """ Test the actual dimensions that each draggable has, in the bank and when placed """
        # Check assumptions - the container wrapping this XBlock should be 770px wide
        self._switch_to_block(block_index)
        item_bank = self._page.find_element_by_css_selector('.item-bank')
        item_bank_width = item_bank.size["width"]
        item_bank_height = item_bank.size["height"]
        page_width = self._page.size["width"]  # self._page is the .xblock--drag-and-drop div

        if is_desktop:
            # If using a desktop-sized window, we can know the exact dimensions of various containers:
            self.assertEqual(page_width, 770)  # div has max-width: 770px
        else:
            window_width = self.browser.get_window_size()["width"]
            self.assertLessEqual(window_width, 400)
            self.assertEqual(page_width, window_width - 40)

        # item bank is inside slider so we are calculating slider's width
        slider_width = self._page.find_element_by_css_selector('.bx-wrapper').size["width"]
        self.assertAlmostEqual(slider_width, page_width * 0.98, delta=1)

        # Test each element, before it is placed (while it is in the item bank).
        for expect in expectations:
            self._load_current_slide_by_item_id(expect.item_id)
            if expect.fixed_width_percent is not None:
                self._check_width(
                    item_description="Unplaced item {} with fixed width".format(expect.item_id),
                    item=self._get_unplaced_item_by_value(expect.item_id),
                    expected_percent=expect.fixed_width_percent,
                )
            if expect.img_pixel_size_exact is not None:
                self._check_img_pixel_dimensions(
                    "Unplaced item {}".format(expect.item_id),
                    self._get_unplaced_item_by_value(expect.item_id),
                    *expect.img_pixel_size_exact
                )

        # Test each element, after it it placed.
        for expect in expectations:
            self.place_item(expect.item_id, expect.zone_id, action_key=Keys.RETURN)

            # V4 todo: Pass these test after placed tiles styling in MCKIN-7640
            # if expect.fixed_width_percent:
            #     expected_width_percent = expect.fixed_width_percent
            # else:
            #     expected_width_percent = expect.width_percent_image or expect.width_percent

            # if expected_width_percent is not None:
            #     self._check_width(
            #         item_description="Placed item {}".format(expect.item_id),
            #         item=self._get_placed_item_by_value(expect.item_id),
            #         expected_percent=[1, expected_width_percent],
            #     )
            # if expect.img_pixel_size_exact is not None:
            #     self._check_img_pixel_dimensions(
            #         "Placed item {}".format(expect.item_id),
            #         self._get_placed_item_by_value(expect.item_id),
            #         *expect.img_pixel_size_exact
            #     )

        # Test that the item bank maintains its original size.
        self.assertEqual(item_bank.size["width"], item_bank_width)
        self.assertEqual(item_bank.size["height"], item_bank_height)


class FreeSizingTests(SizingTests, FreeSizingInteractionTestBase):
    item_sizing = Constants.FREE_SIZING

    EXPECTATIONS_DESKTOP = [
        # The text 'Auto' with no fixed size specified should be 3-20% wide
        Expectation(item_id=0, zone_id=ZONE_33, width_percent=[3, AUTO_MAX_WIDTH_DESKTOP]),
        # The long text with no fixed size specified should be wrapped at the maximum width
        Expectation(item_id=1, zone_id=ZONE_33, width_percent=AUTO_MAX_WIDTH_DESKTOP),
        # The text items that specify specific widths as a percentage of the background image:
        Expectation(item_id=2, zone_id=ZONE_33, fixed_width_percent=33.3),
        Expectation(item_id=3, zone_id=ZONE_50, fixed_width_percent=50),
        Expectation(item_id=4, zone_id=ZONE_75, fixed_width_percent=75),
        # A 400x300 image with automatic sizing should be constrained to the maximum width
        Expectation(item_id=5, zone_id=ZONE_50, width_percent=AUTO_MAX_WIDTH_DESKTOP),
        # A 200x200 image with automatic sizing
        Expectation(item_id=6, zone_id=ZONE_50, width_percent=[25, 30.2]),
        # A 400x300 image with a specified width of 50%
        Expectation(item_id=7, zone_id=ZONE_50, fixed_width_percent=50),
        # A 200x200 image with a specified width of 50%
        Expectation(item_id=8, zone_id=ZONE_50, fixed_width_percent=50),
        # A 60x60 auto-sized image should appear with pixel dimensions of 60x60 since it's
        # too small to be shrunk be the default max-size.
        Expectation(item_id=9, zone_id=ZONE_33, img_pixel_size_exact=[60, 60]),
    ]

    EXPECTATIONS_MOBILE = [
         # The text 'Auto' with no fixed size specified should be 3-20% wide
         Expectation(
             item_id=0,
             zone_id=ZONE_33,
             width_percent_bank=[3, AUTO_MAX_WIDTH_MOBILE_TARGET_IMG],
             width_percent_image=[3, AUTO_MAX_WIDTH_MOBILE_ITEM_BANK],
         ),
         # The long text with no fixed size specified should be wrapped at the maximum width
         Expectation(
             item_id=1,
             zone_id=ZONE_33,
             width_percent_bank=AUTO_MAX_WIDTH_MOBILE_ITEM_BANK,
             width_percent_image=AUTO_MAX_WIDTH_MOBILE_TARGET_IMG,
         ),
         # The text items that specify specific widths as a percentage of the background image:
         Expectation(item_id=2, zone_id=ZONE_33, fixed_width_percent=33.3),
         Expectation(item_id=3, zone_id=ZONE_50, fixed_width_percent=50),
         Expectation(item_id=4, zone_id=ZONE_75, fixed_width_percent=75),
         # A 400x300 image with automatic sizing should be constrained to the maximum width,
         # except on a large background image, where its natural size is smaller than max allowed size.
         Expectation(
             item_id=5,
             zone_id=ZONE_50,
             width_percent_bank=AUTO_MAX_WIDTH_MOBILE_ITEM_BANK,
             width_percent_image=[25, AUTO_MAX_WIDTH_MOBILE_TARGET_IMG],
         ),
         # A 200x200 image with automatic sizing
         Expectation(
             item_id=6,
             zone_id=ZONE_50,
             width_percent_bank=[60, AUTO_MAX_WIDTH_MOBILE_ITEM_BANK],
             width_percent_image=[10, AUTO_MAX_WIDTH_MOBILE_ITEM_BANK],
         ),
         # A 400x300 image with a specified width of 50%
         Expectation(item_id=7, zone_id=ZONE_50, fixed_width_percent=50),
         # A 200x200 image with a specified width of 50%
         Expectation(item_id=8, zone_id=ZONE_50, fixed_width_percent=50),
         # A 60x60 auto-sized image should appear with pixel dimensions of 60x60 since it's
         # too small to be shrunk be the default max-size.
         Expectation(item_id=9, zone_id=ZONE_33, img_pixel_size_exact=[60, 60]),
    ]

    def _check_width(self, item_description, item,  # pylint: disable=arguments-differ
                     container_width, expected_percent):
        """
        Check that item 'item' has a width that is approximately the specified percentage
        of container_width, or if expected_percent is a pair of numbers, that it is within
        that range.
        """
        width_pixels = item.size["width"]
        width_percent = width_pixels / container_width * 100
        if isinstance(expected_percent, (list, tuple)):
            min_expected, max_expected = expected_percent
            msg = "{} should have width of {}% - {}%. Actual: {}px ({:.2f}% of {}px)".format(
                item_description, min_expected, max_expected, width_pixels, width_percent, container_width
            )
            self.assertGreaterEqual(width_percent, min_expected, msg)
            self.assertLessEqual(width_percent, max_expected, msg)
        else:
            self.assertAlmostEqual(
                width_percent, expected_percent, delta=1,
                msg="{} should have width of ~{}% (+/- 1%). Actual: {}px ({:.2f}% of {}px)".format(
                    item_description, expected_percent, width_pixels, width_percent, container_width
                )
            )

        if item.find_elements_by_css_selector("img"):
            # This item contains an image. The image should always fill the width of the draggable.
            image = item.find_element_by_css_selector("img")
            image_width_expected = item.size["width"] - 22
            self.assertAlmostEqual(
                image.size["width"], image_width_expected, delta=1,
                msg="{} image does not take up the full width of the draggable (width is {}px; expected {}px)".format(
                    item_description, image.size["width"], image_width_expected,
                )
            )

    def _check_sizes(self, block_index, expectations, expected_img_width=None, is_desktop=True):
        """ Test the actual dimensions that each draggable has, in the bank and when placed """
        # Check assumptions - the container wrapping this XBlock should be 770px wide
        self._switch_to_block(block_index)
        target_img = self._page.find_element_by_css_selector('.target-img')
        target_img_width = target_img.size["width"]
        item_bank = self._page.find_element_by_css_selector('.item-bank')
        item_bank_width = item_bank.size["width"]
        item_bank_height = item_bank.size["height"]
        page_width = self._page.size["width"]  # self._page is the .xblock--drag-and-drop div

        if is_desktop:
            # If using a desktop-sized window, we can know the exact dimensions of various containers:
            self.assertEqual(page_width, 770)  # div has max-width: 770px
        else:
            window_width = self.browser.get_window_size()["width"]
            self.assertLessEqual(window_width, 400)
            self.assertEqual(page_width, window_width - 40)

        # The item bank and other elements are inside a wrapper with 'padding: 1%', so we expect
        # their width to be 98% of item_bank_width in general
        self.assertAlmostEqual(target_img_width, expected_img_width or (page_width * 0.98), delta=1)
        self.assertAlmostEqual(item_bank_width, page_width * 0.98, delta=1)

        # Test each element, before it is placed (while it is in the item bank).
        for expect in expectations:
            self._load_current_slide_by_item_id(expect.item_id)
            expected_width_percent = expect.width_percent_bank or expect.width_percent
            if expected_width_percent is not None:
                self._check_width(
                    item_description="Unplaced item {}".format(expect.item_id),
                    item=self._get_unplaced_item_by_value(expect.item_id),
                    container_width=item_bank_width,
                    expected_percent=expected_width_percent
                )
            if expect.fixed_width_percent is not None:
                self._check_width(
                    item_description="Unplaced item {} with fixed width".format(expect.item_id),
                    item=self._get_unplaced_item_by_value(expect.item_id),
                    container_width=target_img_width,
                    expected_percent=expect.fixed_width_percent,
                )
            if expect.img_pixel_size_exact is not None:
                self._check_img_pixel_dimensions(
                    "Unplaced item {}".format(expect.item_id),
                    self._get_unplaced_item_by_value(expect.item_id),
                    *expect.img_pixel_size_exact
                )

        # Test each element, after it it placed.
        for expect in expectations:
            self.place_item(expect.item_id, expect.zone_id, action_key=Keys.RETURN)
            if expect.fixed_width_percent:
                expected_width_percent = expect.fixed_width_percent
            else:
                expected_width_percent = expect.width_percent_image or expect.width_percent
            if expected_width_percent is not None:
                self._check_width(
                    item_description="Placed item {}".format(expect.item_id),
                    item=self._get_placed_item_by_value(expect.item_id),
                    container_width=target_img_width,
                    expected_percent=expected_width_percent,
                )
            if expect.img_pixel_size_exact is not None:
                self._check_img_pixel_dimensions(
                    "Placed item {}".format(expect.item_id),
                    self._get_placed_item_by_value(expect.item_id),
                    *expect.img_pixel_size_exact
                )

        # Test that the item bank maintains its original size.
        self.assertEqual(item_bank.size["width"], item_bank_width)
        self.assertEqual(item_bank.size["height"], item_bank_height)


class AlignedSizingTests(SizingTests):
    """
    Run the same tests as SizingTests, but with aligned zones.

    The sizing of draggable items should be consistent when the "align" feature
    of each zone is enabled. (This is the feature that aligns draggable items
    once they're placed, rather than keeping them exactly where they were
    dropped.)
    """
    ALIGN_ZONES = True


class FreeSizingAlignedSizingTests(FreeSizingTests):
    """
    Run the same tests as FreeSizingTests, but with aligned zones.

    The sizing of draggable items should be consistent when the "align" feature
    of each zone is enabled. (This is the feature that aligns draggable items
    once they're placed, rather than keeping them exactly where they were
    dropped.)
    """
    ALIGN_ZONES = True


class SizingBackwardsCompatibilityTests(FreeSizingInteractionTestBase, BaseIntegrationTest):
    """
    Test backwards compatibility with data generated in older versions of this block.

    Older versions allowed authors to specify a fixed width and height for each draggable, in
    pixels (new versions only have a configurable width, and it is a percent width).
    """
    PAGE_TITLE = 'Drag and Drop v2 Sizing Backwards Compatibility'
    PAGE_ID = 'drag_and_drop_v2_sizing_backwards_compatibility'
    item_sizing = Constants.FREE_SIZING

    def _get_scenario_xml(self):
        """
        Set up the test scenario:
            * One DndDv2 block using 'old_version_data.json'
        """
        dnd_block = "<drag-and-drop-v2 item_sizing='{item_sizing}' data='{data}'/>".format(
            data=loader.load_unicode("data/old_version_data.json"),
            item_sizing=self.item_sizing
        )
        return "<vertical_demo>{}</vertical_demo>".format(dnd_block)

    def test_draggable_sizes(self):
        """ Test the fixed pixel widths set in old versions of the block """
        self._expect_width_px(item_id=0, width_px=190, zone_id="Zone 1")
        self._expect_width_px(item_id=1, width_px=190, zone_id="Zone 2")
        # popup wouldn't show for items whose feedback message is empty
        self._expect_width_px(item_id=2, width_px=100, zone_id="Zone 1", close_popup=False)

    def _expect_width_px(self, item_id, width_px, zone_id, close_popup=True):
        item = self._get_unplaced_item_by_value(item_id)
        self.assertEqual(item.size["width"], width_px)
        self.place_item(item_id, zone_id)
        if close_popup:
            self.close_feedback_popup()
        item = self._get_placed_item_by_value(item_id)
        self.assertEqual(item.size["width"], width_px)
