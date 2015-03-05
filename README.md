Drag and Drop XBlock v2
=======================

This XBlock implements a friendly drag-and-drop style question, where
the student has to drag items on zones on a target image.

The editor is fully guided. Features include:

* custom target image
* free target zone positioning and sizing
* custom size items
* image items
* decoy items that don't have a zone
* feedback popups for both correct and incorrect attempts
* introductory and final feedback

It supports progressive grading and keeps progress across
refreshes. All checking and record keeping is done on the server side.

The screenshot shows the Drag and Drop XBlock rendered inside the edX
LMS before starting before the user starts solving the problem:

![Student view start](https://raw.githubusercontent.com/edx-solutions/xblock-drag-and-drop-v2/5ff71f56ba454c66d8f2749bc1d55d5f1df3b792/doc/img/student-view-start.png)

This screenshot shows the XBlock after the student successfully
completed the drag and drop problem:

![Student view finish](https://raw.githubusercontent.com/edx-solutions/xblock-drag-and-drop-v2/5ff71f56ba454c66d8f2749bc1d55d5f1df3b792/doc/img/student-view-finish.png)

Installation
------------

Install the requirements into the python virtual environment of your
`edx-platform` installation by running the following command from the
root folder:

```bash
$ pip install -e .
```

Enabling in Studio
------------------

You can enable the Drag and Drop XBlock in studio through the advanced
settings.

1. From the main page of a specific course, navigate to `Settings ->
   Advanced Settings` from the top menu.
2. Check for the `advanced_modules` policy key, and add
   `"drag-and-drop-v2"` to the policy value list.
3. Click the "Save changes" button.

Usage
-----

The Drag and Drop XBlock features an interactive editor. Add the Drag
and Drop component to a lesson, then click the 'Edit' button.

![Edit view](https://raw.githubusercontent.com/edx-solutions/xblock-drag-and-drop-v2/5ff71f56ba454c66d8f2749bc1d55d5f1df3b792/doc/img/edit-view.png)

In the first step, you can set some basic properties of the component,
such as the title, question text that rendered above the background
image, the introduction feedback (shown initially) and the final
feedback (shown after the student successfully completes the drag and
drop problem).

![Drop zone edit](https://raw.githubusercontent.com/edx-solutions/xblock-drag-and-drop-v2/5ff71f56ba454c66d8f2749bc1d55d5f1df3b792/doc/img/edit-view-zones.png)

In the next step, you set the background image URL and define the
properties of the drop zones. The properties include the title/text
rendered in the drop zone, the zone's dimensions and position
coordinates. You can define an arbitrary number of drop zones as long
as their titles are unique.

![Drag item edit](https://raw.githubusercontent.com/edx-solutions/xblock-drag-and-drop-v2/5ff71f56ba454c66d8f2749bc1d55d5f1df3b792/doc/img/edit-view-items.png)

In the final step, you define the drag items. A drag item can contain
either text or an image. You can define the success and error feedback
texts. The feedback text is displayed in a popup after the student
drops the item into a zone - the success feedback is shown if the item
is dropped into the correct zone, while the error feedback is shown
when dropping the item into a wrong drop zone.

![Zone dropdown](https://raw.githubusercontent.com/edx-solutions/xblock-drag-and-drop-v2/5ff71f56ba454c66d8f2749bc1d55d5f1df3b792/doc/img/edit-view-zone-dropdown.png)

The zone that the item belongs is selected from a dropdown that
includes all drop zones defined in the previous step and a `none`
option that can be used for "decoy" items - items that don't belong to
any zone.

You can define an arbitrary number of drag items.

Testing
-------

Inside a fresh virtualenv, run

```bash
$ cd .../xblock-drag-and-drop-v2/
$ sh install_test_deps.sh
```

To run the tests, from the xblock-drag-and-drop-v2 repository root:

```bash
$ python run_tests.py
```
