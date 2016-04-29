from .utils import _

TARGET_IMG_DESCRIPTION = _(
    "An isosceles triangle with three layers of similar height. "
    "It is shown upright, so the widest layer is located at the bottom, "
    "and the narrowest layer is located at the top."
)

FIRST_ZONE_ID = "zone-1"
SECOND_ZONE_ID = "zone-1"
THIRD_ZONE_ID = "zone-3"
FOURTH_ZONE_ID = "zone-4"

FIRST_ZONE_TITLE = _("The Top Left Zone")
SECOND_ZONE_TITLE = _("The Top Right Zone")
THIRD_ZONE_TITLE = _("The Bottom Left Zone")
FOURTH_ZONE_TITLE = _("The Bottom Right Zone")

FIRST_ZONE_DESCRIPTION = _("Use this zone to associate an item with the top left box.")
SECOND_ZONE_DESCRIPTION = _("Use this zone to associate an item with the top right box.")
THIRD_ZONE_DESCRIPTION = _("Use this zone to associate an item with the bottom left box.")
FOURTH_ZONE_DESCRIPTION = _("Use this zone to associate an item with the bottom right box.")

FIRST_ZONE_BACKGROUND = _("/xblock/resource/drag-and-drop-v2/public/img/discover.png")
SECOND_ZONE_BACKGROUND = _("/xblock/resource/drag-and-drop-v2/public/img/design.png")
THIRD_ZONE_BACKGROUND = _("/xblock/resource/drag-and-drop-v2/public/img/develop.png")
FOURTH_ZONE_BACKGROUND = _("/xblock/resource/drag-and-drop-v2/public/img/deploy.png")

ITEM_CORRECT_FEEDBACK = _("Correct! This one belongs to {zone}.")
ITEM_INCORRECT_FEEDBACK = _("No, this item does not belong here. Try again.")
ITEM_NO_ZONE_FEEDBACK = _("You silly, there are no zones for this one.")

START_FEEDBACK = _("Drag the items onto the image above.")
FINISH_FEEDBACK = _("Good work! You have completed this drag and drop problem.")

DEFAULT_DATA = {
  "targetImgDescription": TARGET_IMG_DESCRIPTION,
  "zones": [
    {
      "uid": FIRST_ZONE_ID,
      "title": FIRST_ZONE_TITLE,
      "description": FIRST_ZONE_DESCRIPTION,
      "x": 0,
      "y": 0,
      "width": 50,
      "height": 178,
      "background": FIRST_ZONE_BACKGROUND,
    },
    {
      "uid": SECOND_ZONE_ID,
      "title": SECOND_ZONE_TITLE,
      "description": SECOND_ZONE_DESCRIPTION,
      "x": 50,
      "y": 0,
      "width": 50,
      "height": 178,
      "background": SECOND_ZONE_BACKGROUND,
    },
    {
      "uid": THIRD_ZONE_ID,
      "title": THIRD_ZONE_TITLE,
      "description": THIRD_ZONE_DESCRIPTION,
      "x": 0,
      "y": 50,
      "width": 50,
      "height": 178,
      "background": THIRD_ZONE_BACKGROUND,
    },
    {
      "uid": FOURTH_ZONE_ID,
      "title": FOURTH_ZONE_TITLE,
      "description": FOURTH_ZONE_DESCRIPTION,
      "x": 50,
      "y": 50,
      "width": 50,
      "height": 178,
      "background": FOURTH_ZONE_BACKGROUND,
    }
  ],
  "items": [
    {
      "displayName": _("Goes to the top left"),
      "feedback": {
        "incorrect": ITEM_INCORRECT_FEEDBACK,
        "correct": ITEM_CORRECT_FEEDBACK.format(zone=FIRST_ZONE_TITLE)
      },
      "zone": FIRST_ZONE_ID,
      "imageURL": "",
      "id": 0,
    },
    {
      "displayName": _("Goes to the top right"),
      "feedback": {
        "incorrect": ITEM_INCORRECT_FEEDBACK,
        "correct": ITEM_CORRECT_FEEDBACK.format(zone=SECOND_ZONE_TITLE)
      },
      "zone": SECOND_ZONE_ID,
      "imageURL": "",
      "id": 1,
    },
    {
      "displayName": _("Goes to the bottom left"),
      "feedback": {
        "incorrect": ITEM_INCORRECT_FEEDBACK,
        "correct": ITEM_CORRECT_FEEDBACK.format(zone=THIRD_ZONE_TITLE)
      },
      "zone": THIRD_ZONE_ID,
      "imageURL": "",
      "id": 2,
    },
    {
      "displayName": _("Goes to the bottom right"),
      "feedback": {
        "incorrect": ITEM_INCORRECT_FEEDBACK,
        "correct": ITEM_CORRECT_FEEDBACK.format(zone=FOURTH_ZONE_TITLE)
      },
      "zone": FOURTH_ZONE_ID,
      "imageURL": "",
      "id": 3,
    },
  ],
  "feedback": {
    "start": START_FEEDBACK,
    "finish": FINISH_FEEDBACK,
  },
}
