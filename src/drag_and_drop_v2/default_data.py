""" Default data for Drag and Drop v2 XBlock """
from .utils import _

TARGET_IMG_DESCRIPTION = _(
    "An isosceles triangle with three layers of similar height. "
    "It is shown upright, so the widest layer is located at the bottom, "
    "and the narrowest layer is located at the top."
)

TOP_ZONE_ID = "top"
MIDDLE_ZONE_ID = "middle"
BOTTOM_ZONE_ID = "bottom"

TOP_ZONE_TITLE = _("The Top Zone")
MIDDLE_ZONE_TITLE = _("The Middle Zone")
BOTTOM_ZONE_TITLE = _("The Bottom Zone")

TOP_ZONE_DESCRIPTION = _("Use this zone to associate an item with the top layer of the triangle.")
MIDDLE_ZONE_DESCRIPTION = _("Use this zone to associate an item with the middle layer of the triangle.")
BOTTOM_ZONE_DESCRIPTION = _("Use this zone to associate an item with the bottom layer of the triangle.")

ITEM_CORRECT_FEEDBACK_TOP = _("Correct! This one belongs to The Top Zone.")
ITEM_CORRECT_FEEDBACK_MIDDLE = _("Correct! This one belongs to The Middle Zone.")
ITEM_CORRECT_FEEDBACK_BOTTOM = _("Correct! This one belongs to The Bottom Zone.")
ITEM_INCORRECT_FEEDBACK = _("No, this item does not belong here. Try again.")
ITEM_NO_ZONE_FEEDBACK = _("You silly, there are no zones for this one.")
ITEM_ANY_ZONE_FEEDBACK = _("Of course it goes here! It goes anywhere!")

ITEM_TOP_ZONE_NAME = _("Goes to the top")
ITEM_MIDDLE_ZONE_NAME = _("Goes to the middle")
ITEM_BOTTOM_ZONE_NAME = _("Goes to the bottom")
ITEM_ANY_ZONE_NAME = _("Goes anywhere")
ITEM_NO_ZONE_NAME = _("I don't belong anywhere")

START_FEEDBACK = _("Drag the items onto the image above.")
FINISH_FEEDBACK = _("Good work! You have completed this drag and drop problem.")

DEFAULT_DATA = {
    "targetImgDescription": TARGET_IMG_DESCRIPTION,
    "zones": [
        {
            "uid": TOP_ZONE_ID,
            "title": TOP_ZONE_TITLE,
            "description": TOP_ZONE_DESCRIPTION,
            "x": 160,
            "y": 30,
            "width": 196,
            "height": 178,
            "align": "center"
        },
        {
            "uid": MIDDLE_ZONE_ID,
            "title": MIDDLE_ZONE_TITLE,
            "description": MIDDLE_ZONE_DESCRIPTION,
            "x": 86,
            "y": 210,
            "width": 340,
            "height": 138,
            "align": "center"
        },
        {
            "uid": BOTTOM_ZONE_ID,
            "title": BOTTOM_ZONE_TITLE,
            "description": BOTTOM_ZONE_DESCRIPTION,
            "x": 15,
            "y": 350,
            "width": 485,
            "height": 135,
            "align": "center"
        }
    ],
    "items": [
        {
            "displayName": ITEM_TOP_ZONE_NAME,
            "feedback": {
                "incorrect": ITEM_INCORRECT_FEEDBACK,
                "correct": ITEM_CORRECT_FEEDBACK_TOP
            },
            "zones": [
                TOP_ZONE_ID
            ],
            "imageURL": "",
            "id": 0,
        },
        {
            "displayName": ITEM_MIDDLE_ZONE_NAME,
            "feedback": {
                "incorrect": ITEM_INCORRECT_FEEDBACK,
                "correct": ITEM_CORRECT_FEEDBACK_MIDDLE
            },
            "zones": [
                MIDDLE_ZONE_ID
            ],
            "imageURL": "",
            "id": 1,
        },
        {
            "displayName": ITEM_BOTTOM_ZONE_NAME,
            "feedback": {
                "incorrect": ITEM_INCORRECT_FEEDBACK,
                "correct": ITEM_CORRECT_FEEDBACK_BOTTOM
            },
            "zones": [
                BOTTOM_ZONE_ID
            ],
            "imageURL": "",
            "id": 2,
        },
        {
            "displayName": ITEM_ANY_ZONE_NAME,
            "feedback": {
                "incorrect": "",
                "correct": ITEM_ANY_ZONE_FEEDBACK
            },
            "zones": [
                TOP_ZONE_ID,
                BOTTOM_ZONE_ID,
                MIDDLE_ZONE_ID
            ],
            "imageURL": "",
            "id": 3
        },
        {
            "displayName": ITEM_NO_ZONE_NAME,
            "feedback": {
                "incorrect": ITEM_NO_ZONE_FEEDBACK,
                "correct": ""
            },
            "zones": [],
            "imageURL": "",
            "id": 4,
        },
    ],
    "feedback": {
        "start": START_FEEDBACK,
        "finish": FINISH_FEEDBACK,
    },
}
