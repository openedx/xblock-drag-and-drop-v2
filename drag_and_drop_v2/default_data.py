from .utils import _

TARGET_IMG_DESCRIPTION = _(
    "An isosceles triangle with three layers of similar height. "
    "It is shown upright, so the widest layer is located at the bottom, "
    "and the narrowest layer is located at the top."
)

TOP_LEFT_ZONE_ID = "top-left"
TOP_RIGHT_ZONE_ID = "top-right"
BOTTOM_LEFT_ZONE_ID = "bottom-left"
BOTTOM_RIGHT_ZONE_ID = "bottom-right"

TOP_LEFT_ZONE_TITLE = _("The Top Left Zone")
TOP_RIGHT_ZONE_TITLE = _("The Top Right Zone")
BOTTOM_LEFT_ZONE_TITLE = _("The Bottom Left Zone")
BOTTOM_RIGHT_ZONE_TITLE = _("The Bottom Right Zone")

TOP_LEFT_ZONE_DESCRIPTION = _("test")
TOP_RIGHT_ZONE_DESCRIPTION = _("Use this zone to associate an item with the top right box.")
BOTTOM_LEFT_ZONE_DESCRIPTION = _("Use this zone to associate an item with the bottom left box.")
BOTTOM_RIGHT_ZONE_DESCRIPTION = _("Use this zone to associate an item with the bottom right box.")

TOP_LEFT_ZONE_BACKGROUND = _("/xblock/resource/drag-and-drop-v2/public/img/discover_hover.png")
TOP_RIGHT_ZONE_BACKGROUND = _("/xblock/resource/drag-and-drop-v2/public/img/design_hover.png")
BOTTOM_LEFT_ZONE_BACKGROUND = _("/xblock/resource/drag-and-drop-v2/public/img/develop_hover.png")
BOTTOM_RIGHT_ZONE_BACKGROUND = _("/xblock/resource/drag-and-drop-v2/public/img/deploy_hover.png")

ITEM_CORRECT_FEEDBACK = _("Correct! This one belongs to {zone}.")
ITEM_INCORRECT_FEEDBACK = _("No, this item does not belong here. Try again.")
ITEM_NO_ZONE_FEEDBACK = _("You silly, there are no zones for this one.")

START_FEEDBACK = _("Drag the items onto the image above.")
FINISH_FEEDBACK = _("Good work! You have completed this drag and drop problem.")

DEFAULT_DATA = {
  "targetImgDescription": TARGET_IMG_DESCRIPTION,
  "zones": [
    {
      "uid": TOP_LEFT_ZONE_ID,
      "title": TOP_LEFT_ZONE_TITLE,
      "description": TOP_LEFT_ZONE_DESCRIPTION,
      "x": 0,
      "y": 0,
      "width": 50,
      "height": 50,
      "background": TOP_LEFT_ZONE_BACKGROUND,
      "test": 40,
    },
    {
      "uid": TOP_RIGHT_ZONE_ID,
      "title": TOP_RIGHT_ZONE_TITLE,
      "description": TOP_RIGHT_ZONE_DESCRIPTION,
      "x": 50,
      "y": 0,
      "width": 50,
      "height": 50,
      "background": TOP_RIGHT_ZONE_BACKGROUND,
    },
    {
      "uid": BOTTOM_LEFT_ZONE_ID,
      "title": BOTTOM_LEFT_ZONE_TITLE,
      "description": BOTTOM_LEFT_ZONE_DESCRIPTION,
      "x": 0,
      "y": 50,
      "width": 50,
      "height": 50,
      "background": BOTTOM_LEFT_ZONE_BACKGROUND,
    },
    {
      "uid": BOTTOM_RIGHT_ZONE_ID,
      "title": BOTTOM_RIGHT_ZONE_TITLE,
      "description": BOTTOM_RIGHT_ZONE_DESCRIPTION,
      "x": 50,
      "y": 50,
      "width": 50,
      "height": 50,
      "background": BOTTOM_RIGHT_ZONE_BACKGROUND,
    }
  ],
  "items": [
    {
      "displayName": _("Goes to the top left"),
      "feedback": {
        "incorrect": ITEM_INCORRECT_FEEDBACK,
        "correct": ITEM_CORRECT_FEEDBACK.format(zone=TOP_LEFT_ZONE_TITLE)
      },
      "zone": TOP_LEFT_ZONE_ID,
      "imageURL": "",
      "id": 0,
    },
    {
      "displayName": _("Goes to the top right"),
      "feedback": {
        "incorrect": ITEM_INCORRECT_FEEDBACK,
        "correct": ITEM_CORRECT_FEEDBACK.format(zone=TOP_RIGHT_ZONE_TITLE)
      },
      "zone": TOP_RIGHT_ZONE_ID,
      "imageURL": "",
      "id": 1,
    },
    {
      "displayName": _("Goes to the bottom left"),
      "feedback": {
        "incorrect": ITEM_INCORRECT_FEEDBACK,
        "correct": ITEM_CORRECT_FEEDBACK.format(zone=BOTTOM_LEFT_ZONE_TITLE)
      },
      "zone": BOTTOM_LEFT_ZONE_ID,
      "imageURL": "",
      "id": 2,
    },
    {
      "displayName": _("Goes to the bottom right"),
      "feedback": {
        "incorrect": ITEM_INCORRECT_FEEDBACK,
        "correct": ITEM_CORRECT_FEEDBACK.format(zone=BOTTOM_RIGHT_ZONE_TITLE)
      },
      "zone": BOTTOM_RIGHT_ZONE_ID,
      "imageURL": "",
      "id": 3,
    },
    {
      "displayName": _("I don't belong anywhere"),
      "feedback": {
        "incorrect": ITEM_NO_ZONE_FEEDBACK,
        "correct": ""
      },
      "zone": "none",
      "imageURL": "",
      "id": 4,
    },
  ],
  "feedback": {
    "start": START_FEEDBACK,
    "finish": FINISH_FEEDBACK,
  },
}
