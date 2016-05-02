from .utils import _

TARGET_IMG_DESCRIPTION = _(
    "An isosceles triangle with three layers of similar height. "
    "It is shown upright, so the widest layer is located at the bottom, "
    "and the narrowest layer is located at the top."
)

FIRST_ZONE_ID = "zone-1"
SECOND_ZONE_ID = "zone-2"
THIRD_ZONE_ID = "zone-3"
FOURTH_ZONE_ID = "zone-4"

FIRST_ZONE_TITLE = _("Discover")
SECOND_ZONE_TITLE = _("Design")
THIRD_ZONE_TITLE = _("Develop")
FOURTH_ZONE_TITLE = _("Deploy")

FIRST_ZONE_DESCRIPTION = _("Use this zone to associate an item with Discover.")
SECOND_ZONE_DESCRIPTION = _("Use this zone to associate an item with Design.")
THIRD_ZONE_DESCRIPTION = _("Use this zone to associate an item with Develop.")
FOURTH_ZONE_DESCRIPTION = _("Use this zone to associate an item with Deploy.")

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
    },
    {
      "uid": SECOND_ZONE_ID,
      "title": SECOND_ZONE_TITLE,
      "description": SECOND_ZONE_DESCRIPTION,
      "x": 50,
      "y": 0,
      "width": 50,
      "height": 178,
    },
    {
      "uid": THIRD_ZONE_ID,
      "title": THIRD_ZONE_TITLE,
      "description": THIRD_ZONE_DESCRIPTION,
      "x": 0,
      "y": 50,
      "width": 50,
      "height": 178,
    },
    {
      "uid": FOURTH_ZONE_ID,
      "title": FOURTH_ZONE_TITLE,
      "description": FOURTH_ZONE_DESCRIPTION,
      "x": 50,
      "y": 50,
      "width": 50,
      "height": 178,
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
