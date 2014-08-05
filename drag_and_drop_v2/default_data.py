default_data = {
  "zones": [
    {
      "index": 1,
      "width": 200,
      "title": "Zone A",
      "height": 100,
      "x": "120",
      "y": "200",
      "id": "zone-1"
    },
    {
      "index": 2,
      "width": 200,
      "title": "Zone B",
      "height": 100,
      "x": "120",
      "y": "360",
      "id": "zone-2"
    }
  ],
  "items": [
    {
      "displayName": "A",
      "feedback": {
        "incorrect": "No, A does not belong here",
        "correct": "Yes, it's an A"
      },
      "zone": "Zone A",
      "backgroundImage": "",
      "id": 0,
      "size": {
        "width": "190px",
        "height": "auto"
      }
    },
    {
      "displayName": "B",
      "feedback": {
        "incorrect": "No, B does not belong here",
        "correct": "Yes, it's a B"
      },
      "zone": "Zone B",
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
        "incorrect": "You silly, there are no zones for X",
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
    "start": "Intro Feed",
    "finish": "Final Feed"
  },
}
