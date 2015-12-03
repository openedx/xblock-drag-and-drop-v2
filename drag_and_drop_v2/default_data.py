from .utils import _

DEFAULT_DATA = {
  "zones": [
    {
      "index": 1,
      "width": 200,
      "title": _("Zone 1"),
      "height": 100,
      "x": "120",
      "y": "200",
      "id": "zone-1"
    },
    {
      "index": 2,
      "width": 200,
      "title": _("Zone 2"),
      "height": 100,
      "x": "120",
      "y": "360",
      "id": "zone-2"
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
      "backgroundImage": "",
      "id": 0,
      "size": {
        "width": "190px",
        "height": "auto"
      }
    },
    {
      "displayName": "2",
      "feedback": {
        "incorrect": _("No, 2 does not belong here"),
        "correct": _("Yes, it's a 2")
      },
      "zone": "Zone 2",
      "backgroundImage": "",
      "id": 1,
      "size": {
        "width": "190px",
        "height": "auto"
      }
    },
    {
      "displayName": "X",
      "feedback": {
        "incorrect": _("You silly, there are no zones for X"),
        "correct": ""
      },
      "zone": "none",
      "backgroundImage": "",
      "id": 2,
      "size": {
        "width": "100px",
        "height": "100px"
      }
    },
  ],
  "state": {
    "items": {},
    "finished": True
  },
  "feedback": {
    "start": _("Intro Feed"),
    "finish": _("Final Feed")
  },
}
