# Drag and Drop XBlock v2

This XBlock implements a friendly drag-and-drop style question, where the student has to drag items on zones on a target image.

The editor is fully guided. Features include:

* custom target image
* free target zone positioning and sizing
* custom size items
* image items
* decoy items that don't have a zone
* feedback popups for both correct and incorrect attempts
* introductory and final feedback

It supports progressive grading and keeps progress across refreshes.

All checking and record keeping is done at server side.

## Installing

Just run

```
$ pip install -e .
```

from the XBlock folder and add `drag-and-drop-v2` to your Advanced Module List.
