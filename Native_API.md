Native API Documentation
========================

This documents the APIs that can be used to implement native wrappers. There are
three types of APIs:

- `student_view_data`: Exposes block settings and content as JSON data. Can be
  retrieved via the edX
  [Course Blocks API](https://openedx.atlassian.net/wiki/spaces/EDUCATOR/pages/29688043/Course+Blocks+API).
  Does not include user-specific data, which is available from `student_view_user_state`.
- `student_view_user_state`: XBlock handler which returns the currently logged
  in user's state data in JSON format.
- Custom XBlock handlers used for submitting user input and recording user actions.

Drag and Drop (`drag-and-drop-v2`)
-----------------------------------

### `student_view_data`

- `block_id`: (string) The XBlock's usage ID.
- `display_name`: (string) The XBlock's display name.
- `mode`: (string) A choice of between \[standard, assessment\].
- `type`: (string) Always equal to `drag-and-drop-v2`.
- `weight`: (float) The weight of the problem.
- `zones`: (list) A list of `zone` objects.
- `max_attempts`: (int) Maximum number of attempts in assessment mode.
- `graded`: (boolean) `true` if grading is enabled.
- `weighted_max_score`: (float) The maximum score multiplied by the weight.
- `max_items_per_zone`: (int) Maximum number of items in a zone.
- `url_name`: (string) Url path for the lesson.
- `display_zone_labels`: (boolean)
- `display_zone_borders`: (boolean)
- `items`: (array) A list of draggable `item`.
- `title`: (string) Title to be shown.
- `show_title`:  (boolean) `true` indicates the title should be shown.
- `problem_text`: (string) Problem description.
- `show_problem_header`: (boolean) `true` indicates the description should be shown.
- `target_img_expanded_url`: (string) URL for the background image.
- `target_img_description`: (string) Description of the background image.
- `item_background_color`: (string) Background color for the draggable items.
- `item_text_color`: (string) Text color for the draggable items.

### `student_view_user_state`

Contains the current state of the user interaction with the block.

- `attempts`: (integer) Number of attempts used so far.
- `finished`: (boolean) `true` if the user successfully completed the problem at least once.
- `grade`: (float) Current grade.
- `items`: (object) Object indexing each draggable `item`
- `overall_feedback`: (array) List of feedback `message`

#### `zone`

The zones are the target for dropping the draggable elements and contains information specific for each one:

- `uid`: (string) Unique id.
- `title`: (string) Description.
- `align`: (string) Alignment of items.
- `height`: (int) Vertical size.
- `width`: (int) Horizontal size.
- `x`: (int) Horizontal position.
- `y`: (int) Vertical position.
- `description`: (string) Long description.

### `item`

Information about each draggable item and their placement.

- `imageURL`: (string) Relative URL for image.
- `displayName`: (string) Text description.
- `expandedImageURL`: (string) Full URL to image.
- `id`: (int) Unique id for item.
- `correct`: (boolean) `true` if the item was dragged to the correct place.
- `zone`: (string) Reference to the uid of the target zone.

### `message`

Contains feedback shown to the user

- `message`: (string) Content of the feedback.

### Custom Handlers

#### `drop_item`

This JSON handler is used to handle dropping an item in a zone. The arguments are
- `val`: (string) The number of the item.
- `zone`: (string) The uid of the zone.

In assessment mode will return an empty object, while in standard mode it returns the following:
- `correct`: (boolean) `true` if correct.
- `grade`: (float) Current grade for the problem.
- `finished`: (boolean) `true` if finished.
- `overall_feedback`: (message) Feedback when finished.
- `feedback`: (message) Feedback for the current try.

#### `do_attempt`

Check submitted solution and return feedback if in assessment mode.

- `correct`: (boolean) `true` if solution is correct.
- `attempts`: (int) Number of attempts remaining.
- `grade`: (float) Final grade.
- `misplaced_items`: (array) List of misplaced items ids.
- `feedback`: (message) Feedback message for current try.
- `overall_feedback`: (message) Feedback when finished.

#### `publish_event`

This endpoint is used to publish XBlock event from frontend

##### `event`

- `event_type`: (string) Event identifier.

#### `reset`

This resets the current try in assessment mode and returns the previous state.

#### `show_answer`

Returns correct answer in assessment mode.

#### `expand_static_url`

AJAX-accessible handler for expanding URLs to static image files that can be used as background.