Drag and Drop XBlock v2
=======================

This XBlock implements a friendly drag-and-drop style question, where
the student has to drag items on zones on a target image.

The editor is fully guided. Features include:

* custom target image
* free target zone positioning and sizing
* custom zone labels
* custom text and background colors for items
* image items
* decoy items that don't have a zone
* feedback popups for both correct and incorrect attempts
* introductory and final feedback

The XBlock supports progressive grading and keeps progress across
refreshes. All checking and record keeping is done on the server side.

The following screenshot shows the Drag and Drop XBlock rendered
inside the edX LMS before the user starts solving the problem:

![Student view start](https://raw.githubusercontent.com/edx-solutions/xblock-drag-and-drop-v2/5ff71f56ba454c66d8f2749bc1d55d5f1df3b792/doc/img/student-view-start.png)

This screenshot shows the XBlock after the student successfully
completed the Drag and Drop problem:

![Student view finish](https://raw.githubusercontent.com/edx-solutions/xblock-drag-and-drop-v2/5ff71f56ba454c66d8f2749bc1d55d5f1df3b792/doc/img/student-view-finish.png)

Installation
------------

Install the requirements into the Python virtual environment of your
`edx-platform` installation by running the following command from the
root folder:

```bash
$ pip install -r requirements.txt
```

Theming
-------

The Drag and Drop XBlock ships with an alternate theme called "Apros"
that you can enable by adding the following entry to `XBLOCK_SETTINGS`
in `lms.env.json`:

```json
        "drag-and-drop-v2": {
            "theme": {
                "package": "drag_and_drop_v2",
                "locations": ["public/themes/apros.css"]
            }
        }
```

You can use the same approach to apply a custom theme:

`"package"` can refer to any Python package in your virtualenv, which
means you can develop and maintain your own theme in a separate
package. There is no need to fork or modify this repository in any way
to customize the look and feel of your Drag and Drop exercises.

`"locations"` is a list of relative paths pointing to CSS files
belonging to your theme. While the XBlock loads, files will be added
to it in the order that they appear in this list. (This means that if
there are rules with identical selectors spread out over different
files, rules in files that appear later in the list will take
precedence over those that appear earlier.)

Finally, note that the default (unthemed) appearance of the Drag and
Drop XBlock has been optimized for accessibility, so its use is
encouraged -- especially for courses targeting large and/or
potentially diverse audiences.

Enabling in Studio
------------------

You can enable the Drag and Drop XBlock in Studio through the Advanced
Settings.

1. From the main page of a specific course, navigate to `Settings ->
   Advanced Settings` from the top menu.
2. Check for the `Advanced Module List` policy key, and add
   `"drag-and-drop-v2"` to the policy value list.
3. Click the "Save changes" button.

Usage
-----

The Drag and Drop XBlock features an interactive editor. Add the Drag
and Drop component to a lesson, then click the `EDIT` button.

![Edit view](https://raw.githubusercontent.com/edx-solutions/xblock-drag-and-drop-v2/5ff71f56ba454c66d8f2749bc1d55d5f1df3b792/doc/img/edit-view.png)

In the first step, you can set some basic properties of the component,
such as the title, the question text to render above the background
image, the introductory feedback (shown initially) and the final
feedback (shown after the student successfully completes the drag and
drop problem).

![Drop zone edit](https://raw.githubusercontent.com/edx-solutions/xblock-drag-and-drop-v2/5ff71f56ba454c66d8f2749bc1d55d5f1df3b792/doc/img/edit-view-zones.png)

In the next step, you set the background image URL and define the
properties of the drop zones. The properties include the title/text
rendered in the drop zone, the zone's dimensions and position
coordinates. In this step you can also specify whether you would like
zone labels to be shown to students or not, as well as whether or not
to display borders outlining the zones. It is possible to define an
arbitrary number of drop zones as long as their titles are unique.

![Drag item edit](https://raw.githubusercontent.com/edx-solutions/xblock-drag-and-drop-v2/5ff71f56ba454c66d8f2749bc1d55d5f1df3b792/doc/img/edit-view-items.png)

In the final step, you define the drag items. A drag item can contain
either text or an image. You can define custom success and error feedback
for each item. The feedback text is displayed in a popup after the student
drops the item on a zone - the success feedback is shown if the item
is dropped on the correct zone, while the error feedback is shown
when dropping the item on an incorrect drop zone.

Additionally, items can have a numerical value (and an optional error
margin) associated with them. When a student drops an item that has a
numerical value on the correct zone, an input field for entering a
value is shown next to the item. The value that the student submits is
checked against the expected value for the item. If you also specify a
margin, the value entered by the student will be considered correct if
it does not differ from the expected value by more than that margin
(and incorrect otherwise).

![Zone dropdown](https://raw.githubusercontent.com/edx-solutions/xblock-drag-and-drop-v2/5ff71f56ba454c66d8f2749bc1d55d5f1df3b792/doc/img/edit-view-zone-dropdown.png)

The zone that an item belongs to is selected from a dropdown that
includes all drop zones defined in the previous step and a `none`
option that can be used for "decoy" items - items that don't belong to
any zone.

You can define an arbitrary number of drag items.

Testing
-------

Inside a fresh virtualenv, `cd` into the root folder of this repository
(`xblock-drag-and-drop-v2`) and run

```bash
$ sh install_test_deps.sh
```

You can then run the entire test suite via

```bash
$ python run_tests.py
```

To only run the unit test suite, do

```bash
$ python run_tests.py tests/unit/
```

Similarly, you can run the integration test suite via

```bash
$ python run_tests.py tests/integration/
```
