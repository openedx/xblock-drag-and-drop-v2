from .utils import _

DEFAULT_DATA = {
  "zones": [
    {
      "index": 1,
      "id": "zone-1",
      "title": _("Zone 1"),
      "x": 160,
      "y": 30,
      "width": 196,
      "height": 178,
    },
    {
      "index": 2,
      "id": "zone-2",
      "title": _("Zone 2"),
      "x": 86,
      "y": 210,
      "width": 340,
      "height": 140,
    }
  ],
  "items": [
    {
      "displayName": "1",
      "feedback": {
        "incorrect": _("No, 1 does not belong here"),
        "correct": _("Yes, it's a 1")
      },
      "zone": "Zone 1",
      "imageURL": "",
      "id": 0,
    },
    {
      "displayName": "2",
      "feedback": {
        "incorrect": _("No, 2 does not belong here"),
        "correct": _("Yes, it's a 2")
      },
      "zone": "Zone 2",
      "imageURL": "",
      "id": 1,
    },
    {
      "displayName": "X",
      "feedback": {
        "incorrect": _("You silly, there are no zones for X"),
        "correct": ""
      },
      "zone": "none",
      "imageURL": "",
      "id": 2,
    },
  ],
  "feedback": {
    "start": _("Drag the items onto the image above."),
    "finish": _("Good work! You have completed this drag and drop exercise.")
  },
}
