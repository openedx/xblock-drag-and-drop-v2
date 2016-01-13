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
$ pip install -e .
```

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
zone labels to be shown to students or not. It is possible to define
an arbitrary number of drop zones as long as their titles are unique.

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

Analytics Events
----------------

The following analytics events are provided by this block.

## `xblock.drag-and-drop-v2.loaded`

Fired when the Drag and Drop XBlock is finished loading.

### Example

```
{
    "username": "staff",
    "event_type": "xblock.drag-and-drop-v2.loaded",
    "ip": "10.0.2.2",
    "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:43.0) Gecko/20100101 Firefox/43.0",
    "host": "precise64",
    "referer": "http://localhost:8000/courses/course-v1:DnD+DnD+DnD/courseware/ec546c58d2f447b7a9223c57b5de7344/756071f8de7f47c3b0ae726586ebbe16/1?activate_block_id=block-v1%3ADnD%2BDnD%2BDnD%2Btype%40vertical%2Bblock%40d2fc47476ca14c55816c4a1264a27280",
    "accept_language": "en;q=1.0, en;q=0.5",
    "event": {
        "component_id": "6b80ce1e8b78426898b47a834d72ffd3",
        "user_id": 5
    },
    "event_source": "server",
    "context": {
        "course_user_tags": {},
        "user_id": 5,
        "org_id": "DnD",
        "module": {
            "usage_key": "block-v1:DnD+DnD+DnD+type@drag-and-drop-v2+block@6b80ce1e8b78426898b47a834d72ffd3",
            "display_name": "Drag and Drop"
        },
        "course_id": "course-v1:DnD+DnD+DnD",
        "path": "/courses/course-v1:DnD+DnD+DnD/xblock/block-v1:DnD+DnD+DnD+type@drag-and-drop-v2+block@6b80ce1e8b78426898b47a834d72ffd3/handler/publish_event"
    },
    "time": "2016-01-13T01:52:41.330049+00:00",
    "page": "x_module"
}
```

## `xblock.drag-and-drop-v2.item.picked-up`

Fired when a student picks up a draggable item.

### Example

```
{
    "username": "staff",
    "event_type": "xblock.drag-and-drop-v2.item.picked-up",
    "ip": "10.0.2.2",
    "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:43.0) Gecko/20100101 Firefox/43.0",
    "host": "precise64",
    "referer": "http://localhost:8000/courses/course-v1:DnD+DnD+DnD/courseware/ec546c58d2f447b7a9223c57b5de7344/756071f8de7f47c3b0ae726586ebbe16/1?activate_block_id=block-v1%3ADnD%2BDnD%2BDnD%2Btype%40vertical%2Bblock%40d2fc47476ca14c55816c4a1264a27280",
    "accept_language": "en;q=1.0, en;q=0.5",
    "event": {
        "item_id": 0,
        "component_id": "6b80ce1e8b78426898b47a834d72ffd3",
        "user_id": 5
    },
    "event_source": "server",
    "context": {
        "course_user_tags": {},
        "user_id": 5,
        "org_id": "DnD",
        "module": {
            "usage_key": "block-v1:DnD+DnD+DnD+type@drag-and-drop-v2+block@6b80ce1e8b78426898b47a834d72ffd3",
            "display_name": "Drag and Drop"
        },
        "course_id": "course-v1:DnD+DnD+DnD",
        "path": "/courses/course-v1:DnD+DnD+DnD/xblock/block-v1:DnD+DnD+DnD+type@drag-and-drop-v2+block@6b80ce1e8b78426898b47a834d72ffd3/handler/publish_event"
    },
    "time": "2016-01-13T01:58:44.395935+00:00",
    "page": "x_module"
}
```

## `xblock.drag-and-drop-v2.item.dropped`

Fired when a student drops a draggable item.

### Example

```
{
    "username": "staff",
    "event_type": "xblock.drag-and-drop-v2.item.dropped",
    "ip": "10.0.2.2",
    "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:43.0) Gecko/20100101 Firefox/43.0",
    "host": "precise64",
    "referer": "http://localhost:8000/courses/course-v1:DnD+DnD+DnD/courseware/ec546c58d2f447b7a9223c57b5de7344/756071f8de7f47c3b0ae726586ebbe16/1?activate_block_id=block-v1%3ADnD%2BDnD%2BDnD%2Btype%40vertical%2Bblock%40d2fc47476ca14c55816c4a1264a27280",
    "accept_language": "en;q=1.0, en;q=0.5",
    "event": {
        "component_id": "6b80ce1e8b78426898b47a834d72ffd3",
        "user_id": 5,
        "is_correct_location": true,
        "is_correct": true,
        "location": "The Top Zone",
        "item_id": 0,
        "input": null
    },
    "event_source": "server",
    "context": {
        "course_user_tags": {},
        "user_id": 5,
        "org_id": "DnD",
        "module": {
            "usage_key": "block-v1:DnD+DnD+DnD+type@drag-and-drop-v2+block@6b80ce1e8b78426898b47a834d72ffd3",
            "display_name": "Drag and Drop"
        },
        "course_id": "course-v1:DnD+DnD+DnD",
        "path": "/courses/course-v1:DnD+DnD+DnD/xblock/block-v1:DnD+DnD+DnD+type@drag-and-drop-v2+block@6b80ce1e8b78426898b47a834d72ffd3/handler/do_attempt"
    },
    "time": "2016-01-13T01:58:45.202313+00:00",
    "page": "x_module"
}
```

## `xblock.drag-and-drop-v2.feedback.opened`

Fired when the feedback pop-up is opened.

### Example

```
{
    "username": "staff",
    "event_type": "xblock.drag-and-drop-v2.feedback.opened",
    "ip": "10.0.2.2",
    "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:43.0) Gecko/20100101 Firefox/43.0",
    "host": "precise64",
    "referer": "http://localhost:8000/courses/course-v1:DnD+DnD+DnD/courseware/ec546c58d2f447b7a9223c57b5de7344/756071f8de7f47c3b0ae726586ebbe16/1?activate_block_id=block-v1%3ADnD%2BDnD%2BDnD%2Btype%40vertical%2Bblock%40d2fc47476ca14c55816c4a1264a27280",
    "accept_language": "en;q=1.0, en;q=0.5",
    "event": {
        "content": "Correct! This one belongs to The Top Zone.",
        "component_id": "6b80ce1e8b78426898b47a834d72ffd3",
        "user_id": 5
    },
    "event_source": "server",
    "context": {
        "course_user_tags": {},
        "user_id": 5,
        "org_id": "DnD",
        "module": {
            "usage_key": "block-v1:DnD+DnD+DnD+type@drag-and-drop-v2+block@6b80ce1e8b78426898b47a834d72ffd3",
            "display_name": "Drag and Drop"
        },
        "course_id": "course-v1:DnD+DnD+DnD",
        "path": "/courses/course-v1:DnD+DnD+DnD/xblock/block-v1:DnD+DnD+DnD+type@drag-and-drop-v2+block@6b80ce1e8b78426898b47a834d72ffd3/handler/publish_event"
    },
    "time": "2016-01-13T01:58:45.844986+00:00",
    "page": "x_module"
}
```

## `xblock.drag-and-drop-v2.feedback.closed`

Fired when the feedback popup is closed.

### Example

```
{
    "username": "staff",
    "event_type": "xblock.drag-and-drop-v2.feedback.closed",
    "ip": "10.0.2.2",
    "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:43.0) Gecko/20100101 Firefox/43.0",
    "host": "precise64",
    "referer": "http://localhost:8000/courses/course-v1:DnD+DnD+DnD/courseware/ec546c58d2f447b7a9223c57b5de7344/756071f8de7f47c3b0ae726586ebbe16/1?activate_block_id=block-v1%3ADnD%2BDnD%2BDnD%2Btype%40vertical%2Bblock%40d2fc47476ca14c55816c4a1264a27280",
    "accept_language": "en;q=1.0, en;q=0.5",
    "event": {
        "component_id": "13d1b859a2304c858e1810ccc23f29b2",
        "user_id": 5,
        "manually": true
    },
    "event_source": "server",
    "context": {
        "course_user_tags": {},
        "user_id": 5,
        "org_id": "DnD",
        "module": {
            "usage_key": "block-v1:DnD+DnD+DnD+type@drag-and-drop-v2+block@13d1b859a2304c858e1810ccc23f29b2",
            "display_name": "Drag and Drop"
        },
        "course_id": "course-v1:DnD+DnD+DnD",
        "path": "/courses/course-v1:DnD+DnD+DnD/xblock/block-v1:DnD+DnD+DnD+type@drag-and-drop-v2+block@13d1b859a2304c858e1810ccc23f29b2/handler/publish_event"
    },
    "time": "2016-01-13T02:07:00.988534+00:00",
    "page": "x_module"
}
```


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
