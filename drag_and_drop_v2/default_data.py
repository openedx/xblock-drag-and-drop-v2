from .utils import _

INCORRECT_FEEDBACK = _("No, this item does not belong here. Try again.")
CORRECT_FEEDBACK = _("Correct! This one belongs to {zone}.")

DEFAULT_DATA = {
  "zones": [
    {
      "index": 1,
      "id": "zone-1",
      "title": _("The Top Zone"),
      "x": 160,
      "y": 30,
      "width": 196,
      "height": 178,
    },
    {
      "index": 2,
      "id": "zone-2",
      "title": _("The Middle Zone"),
      "x": 86,
      "y": 210,
      "width": 340,
      "height": 138,
    },
    {
      "index": 3,
      "id": "zone-3",
      "title": _("The Bottom Zone"),
      "x": 15,
      "y": 350,
      "width": 485,
      "height": 135,
    }
  ],
  "items": [
    {
      "displayName": "Goes to the top",
      "feedback": {
        "incorrect": INCORRECT_FEEDBACK,
        "correct": CORRECT_FEEDBACK.format(zone="the top")
      },
      "zone": "The Top Zone",
      "imageURL": "",
      "id": 0,
    },
    {
      "displayName": "Goes to the middle",
      "feedback": {
        "incorrect": INCORRECT_FEEDBACK,
        "correct": CORRECT_FEEDBACK.format(zone="the middle")
      },
      "zone": "The Middle Zone",
      "imageURL": "",
      "id": 1,
    },
    {
      "displayName": "Goes to the bottom",
      "feedback": {
        "incorrect": INCORRECT_FEEDBACK,
        "correct": CORRECT_FEEDBACK.format(zone="the bottom")
      },
      "zone": "The Bottom Zone",
      "imageURL": "",
      "id": 2,
    },
    {
      "displayName": "I don't belong anywhere",
      "feedback": {
        "incorrect": _("You silly, there are no zones for this one."),
        "correct": ""
      },
      "zone": "none",
      "imageURL": "",
      "id": 3,
    },
  ],
  "feedback": {
    "start": _("Drag the items onto the image above."),
    "finish": _("Good work! You have completed this drag and drop exercise.")
  },
}
