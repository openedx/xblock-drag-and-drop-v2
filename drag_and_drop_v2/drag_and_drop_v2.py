# -*- coding: utf-8 -*-
#
""" Drag and Drop v2 XBlock """

# Imports ###########################################################

import copy
import json
import logging
import urllib
import webob

from xblock.core import XBlock
from xblock.exceptions import JsonHandlerError
from xblock.fields import Scope, String, Dict, Float, Boolean, Integer
from xblock.fragment import Fragment
from xblockutils.resources import ResourceLoader
from xblockutils.settings import XBlockWithSettingsMixin, ThemableXBlockMixin

from .utils import _, DummyTranslationService, FeedbackMessage, FeedbackMessages, ItemStats, StateMigration, Constants
from .default_data import DEFAULT_DATA


# Globals ###########################################################

loader = ResourceLoader(__name__)
logger = logging.getLogger(__name__)

# Classes ###########################################################


@XBlock.wants('settings')
@XBlock.needs('i18n')
class DragAndDropBlock(XBlock, XBlockWithSettingsMixin, ThemableXBlockMixin):
    """
    XBlock that implements a friendly Drag-and-Drop problem
    """

    SOLUTION_CORRECT = "correct"
    SOLUTION_PARTIAL = "partial"
    SOLUTION_INCORRECT = "incorrect"

    GRADE_FEEDBACK_CLASSES = {
        SOLUTION_CORRECT: FeedbackMessages.MessageClasses.CORRECT_SOLUTION,
        SOLUTION_PARTIAL: FeedbackMessages.MessageClasses.PARTIAL_SOLUTION,
        SOLUTION_INCORRECT: FeedbackMessages.MessageClasses.INCORRECT_SOLUTION,
    }

    PROBLEM_FEEDBACK_CLASSES = {
        SOLUTION_CORRECT: FeedbackMessages.MessageClasses.CORRECT_SOLUTION,
        SOLUTION_PARTIAL: None,
        SOLUTION_INCORRECT: None
    }

    display_name = String(
        display_name=_("Title"),
        help=_("The title of the drag and drop problem. The title is displayed to learners."),
        scope=Scope.settings,
        default=_("Drag and Drop"),
    )

    mode = String(
        display_name=_("Mode"),
        help=_(
            "Standard mode: the problem provides immediate feedback each time "
            "a learner drops an item on a target zone. "
            "Assessment mode: the problem provides feedback only after "
            "a learner drops all available items on target zones."
        ),
        scope=Scope.settings,
        values=[
            {"display_name": _("Standard"), "value": Constants.STANDARD_MODE},
            {"display_name": _("Assessment"), "value": Constants.ASSESSMENT_MODE},
        ],
        default=Constants.STANDARD_MODE
    )

    max_attempts = Integer(
        display_name=_("Maximum attempts"),
        help=_(
            "Defines the number of times a student can try to answer this problem. "
            "If the value is not set, infinite attempts are allowed."
        ),
        scope=Scope.settings,
        default=None,
    )

    show_title = Boolean(
        display_name=_("Show title"),
        help=_("Display the title to the learner?"),
        scope=Scope.settings,
        default=True,
    )

    question_text = String(
        display_name=_("Problem text"),
        help=_("The description of the problem or instructions shown to the learner."),
        scope=Scope.settings,
        default="",
    )

    show_question_header = Boolean(
        display_name=_('Show "Problem" heading'),
        help=_('Display the heading "Problem" above the problem text?'),
        scope=Scope.settings,
        default=True,
    )

    weight = Float(
        display_name=_("Problem Weight"),
        help=_("Defines the number of points the problem is worth."),
        scope=Scope.settings,
        default=1,
    )

    item_background_color = String(
        display_name=_("Item background color"),
        help=_("The background color of draggable items in the problem (example: 'blue' or '#0000ff')."),
        scope=Scope.settings,
        default="",
    )

    item_text_color = String(
        display_name=_("Item text color"),
        help=_("Text color to use for draggable items (example: 'white' or '#ffffff')."),
        scope=Scope.settings,
        default="",
    )

    max_items_per_zone = Integer(
        display_name=_("Maximum items per zone"),
        help=_("This setting limits the number of items that can be dropped into a single zone."),
        scope=Scope.settings,
        default=None
    )

    data = Dict(
        display_name=_("Problem data"),
        help=_(
            "Information about zones, items, feedback, and background image for this problem. "
            "This information is derived from the input that a course author provides via the interactive editor "
            "when configuring the problem."
        ),
        scope=Scope.content,
        default=DEFAULT_DATA,
    )

    item_state = Dict(
        help=_("Information about current positions of items that a learner has dropped on the target image."),
        scope=Scope.user_state,
        default={},
    )

    attempts = Integer(
        help=_("Number of attempts learner used"),
        scope=Scope.user_state,
        default=0
    )

    completed = Boolean(
        help=_("Indicates whether a learner has completed the problem at least once"),
        scope=Scope.user_state,
        default=False,
    )

    grade = Float(
        help=_("Keeps maximum score achieved by student"),
        scope=Scope.user_state,
        default=0
    )

    block_settings_key = 'drag-and-drop-v2'
    has_score = True

    def max_score(self):  # pylint: disable=no-self-use
        """
        Return the problem's max score, which for DnDv2 always equals 1.
        Required by the grading system in the LMS.
        """
        return 1

    def _learner_raw_score(self):
        """
        Calculate raw score for learner submission.

        As it is calculated as ratio of correctly placed (or left in bank in case of decoys) items to
        total number of items, it lays in interval [0..1]
        """
        correct_count, total_count = self._get_item_stats()
        return correct_count / float(total_count)

    @XBlock.supports("multi_device")  # Enable this block for use in the mobile app via webview
    def student_view(self, context):
        """
        Player view, displayed to the student
        """

        fragment = Fragment()
        fragment.add_content(loader.render_template('/templates/html/drag_and_drop.html'))
        css_urls = (
            'public/css/vendor/jquery-ui-1.10.4.custom.min.css',
            'public/css/drag_and_drop.css'
        )
        js_urls = (
            'public/js/vendor/jquery-ui-1.10.4.custom.min.js',
            'public/js/vendor/jquery-ui-touch-punch-0.2.3.min.js',  # Makes it work on touch devices
            'public/js/vendor/virtual-dom-1.3.0.min.js',
            'public/js/drag_and_drop.js',
        )
        for css_url in css_urls:
            fragment.add_css_url(self.runtime.local_resource_url(self, css_url))
        for js_url in js_urls:
            fragment.add_javascript_url(self.runtime.local_resource_url(self, js_url))

        self.include_theme_files(fragment)

        fragment.initialize_js('DragAndDropBlock', self.get_configuration())

        return fragment

    def get_configuration(self):
        """
        Get the configuration data for the student_view.
        The configuration is all the settings defined by the author, except for correct answers
        and feedback.
        """

        def items_without_answers():
            """
            Removes feedback and answer from items
            """
            items = copy.deepcopy(self.data.get('items', ''))
            for item in items:
                del item['feedback']
                # Use item.pop to remove both `item['zone']` and `item['zones']`; we don't have
                # a guarantee that either will be present, so we can't use `del`. Legacy instances
                # will have `item['zone']`, while current versions will have `item['zones']`.
                item.pop('zone', None)
                item.pop('zones', None)
                # Fall back on "backgroundImage" to be backward-compatible.
                image_url = item.get('imageURL') or item.get('backgroundImage')
                if image_url:
                    item['expandedImageURL'] = self._expand_static_url(image_url)
                else:
                    item['expandedImageURL'] = ''
            return items

        return {
            "mode": self.mode,
            "zones": self.zones,
            "max_attempts": self.max_attempts,
            "graded": getattr(self, 'graded', False),
            "weighted_max_score": self.max_score() * self.weight,
            "max_items_per_zone": self.max_items_per_zone,
            # SDK doesn't supply url_name.
            "url_name": getattr(self, 'url_name', ''),
            "display_zone_labels": self.data.get('displayLabels', False),
            "display_zone_borders": self.data.get('displayBorders', False),
            "items": items_without_answers(),
            "title": self.display_name,
            "show_title": self.show_title,
            "problem_text": self.question_text,
            "show_problem_header": self.show_question_header,
            "target_img_expanded_url": self.target_img_expanded_url,
            "target_img_description": self.target_img_description,
            "item_background_color": self.item_background_color or None,
            "item_text_color": self.item_text_color or None,
            # final feedback (data.feedback.finish) is not included - it may give away answers.
        }

    def studio_view(self, context):
        """
        Editing view in Studio
        """

        js_templates = loader.load_unicode('/templates/html/js_templates.html')
        # Get a 'html_id' string that is unique for this block.
        # We append it to HTML element ID attributes to ensure multiple instances of the DnDv2 block
        # on the same page don't share the same ID value.
        # We avoid using ID attributes in preference to classes, but sometimes we still need IDs to
        # connect 'for' and 'aria-describedby' attributes to the associated elements.
        id_suffix = self.location.html_id()  # pylint: disable=no-member
        js_templates = js_templates.replace('{{id_suffix}}', id_suffix)
        context = {
            'js_templates': js_templates,
            'id_suffix': id_suffix,
            'fields': self.fields,
            'self': self,
            'data': urllib.quote(json.dumps(self.data)),
        }

        fragment = Fragment()
        fragment.add_content(loader.render_template('/templates/html/drag_and_drop_edit.html', context))

        css_urls = (
            'public/css/vendor/jquery-ui-1.10.4.custom.min.css',
            'public/css/drag_and_drop_edit.css'
        )
        js_urls = (
            'public/js/vendor/jquery-ui-1.10.4.custom.min.js',
            'public/js/vendor/handlebars-v1.1.2.js',
            'public/js/drag_and_drop_edit.js',
        )
        for css_url in css_urls:
            fragment.add_css_url(self.runtime.local_resource_url(self, css_url))
        for js_url in js_urls:
            fragment.add_javascript_url(self.runtime.local_resource_url(self, js_url))

        # Do a bit of manipulation so we get the appearance of a list of zone options on
        # items that still have just a single zone stored

        items = self.data.get('items', [])

        for item in items:
            zones = self.get_item_zones(item['id'])
            # Note that we appear to be mutating the state of the XBlock here, but because
            # the change won't be committed, we're actually just affecting the data that
            # we're going to send to the client, not what's saved in the backing store.
            item['zones'] = zones
            item.pop('zone', None)

        fragment.initialize_js('DragAndDropEditBlock', {
            'data': self.data,
            'target_img_expanded_url': self.target_img_expanded_url,
            'default_background_image_url': self.default_background_image_url,
        })

        return fragment

    @XBlock.json_handler
    def studio_submit(self, submissions, suffix=''):
        """
        Handles studio save.
        """
        self.display_name = submissions['display_name']
        self.mode = submissions['mode']
        self.max_attempts = submissions['max_attempts']
        self.show_title = submissions['show_title']
        self.question_text = submissions['problem_text']
        self.show_question_header = submissions['show_problem_header']
        self.weight = float(submissions['weight'])
        self.item_background_color = submissions['item_background_color']
        self.item_text_color = submissions['item_text_color']
        self.max_items_per_zone = self._get_max_items_per_zone(submissions)
        self.data = submissions['data']

        return {
            'result': 'success',
        }

    @staticmethod
    def _get_max_items_per_zone(submissions):
        """
        Parses Max items per zone value coming from editor.

        Returns:
            * None if invalid value is passed (i.e. not an integer)
            * None if value is parsed into zero or negative integer
            * Positive integer otherwise.

        Examples:
            * _get_max_items_per_zone(None) -> None
            * _get_max_items_per_zone('string') -> None
            * _get_max_items_per_zone('-1') -> None
            * _get_max_items_per_zone(-1) -> None
            * _get_max_items_per_zone('0') -> None
            * _get_max_items_per_zone('') -> None
            * _get_max_items_per_zone('42') -> 42
            * _get_max_items_per_zone(42) -> 42
        """
        raw_max_items_per_zone = submissions.get('max_items_per_zone', None)

        # Entries that aren't numbers should be treated as null. We assume that if we can
        # turn it into an int, a number was submitted.
        try:
            max_attempts = int(raw_max_items_per_zone)
            if max_attempts > 0:
                return max_attempts
            else:
                return None
        except (ValueError, TypeError):
            return None

    @XBlock.json_handler
    def drop_item(self, item_attempt, suffix=''):
        """
        Handles dropping item into a zone.
        """
        self._validate_drop_item(item_attempt)

        if self.mode == Constants.ASSESSMENT_MODE:
            return self._drop_item_assessment(item_attempt)
        elif self.mode == Constants.STANDARD_MODE:
            return self._drop_item_standard(item_attempt)
        else:
            raise JsonHandlerError(
                500,
                self.i18n_service.gettext("Unknown DnDv2 mode {mode} - course is misconfigured").format(self.mode)
            )

    @XBlock.json_handler
    def do_attempt(self, data, suffix=''):
        """
        Checks submitted solution and returns feedback.

        Raises:
             * JsonHandlerError with 400 error code in standard mode.
             * JsonHandlerError with 409 error code if no more attempts left
        """
        self._validate_do_attempt()

        self.attempts += 1
        # pylint: disable=fixme
        # TODO: Refactor this method to "freeze" item_state and pass it to methods that need access to it.
        # These implicit dependencies between methods exist because most of them use `item_state` or other
        # fields, either as an "input" (i.e. read value) or as output (i.e. set value) or both. As a result,
        # incorrect order of invocation causes issues:
        self._mark_complete_and_publish_grade()  # must happen before _get_feedback - sets grade
        correct = self._is_answer_correct()  # must happen before manipulating item_state - reads item_state

        overall_feedback_msgs, misplaced_ids = self._get_feedback(include_item_feedback=True)

        misplaced_items = []
        for item_id in misplaced_ids:
            # Don't delete misplaced item states on the final attempt.
            if self.attempts_remain:
                del self.item_state[item_id]
            misplaced_items.append(self._get_item_definition(int(item_id)))

        feedback_msgs = [FeedbackMessage(item['feedback']['incorrect'], None) for item in misplaced_items]

        return {
            'correct': correct,
            'attempts': self.attempts,
            'grade': self._get_grade_if_set(),
            'misplaced_items': list(misplaced_ids),
            'feedback': self._present_feedback(feedback_msgs),
            'overall_feedback': self._present_feedback(overall_feedback_msgs)
        }

    @XBlock.json_handler
    def publish_event(self, data, suffix=''):
        """
        Handler to publish XBlock event from frontend
        """
        try:
            event_type = data.pop('event_type')
        except KeyError:
            return {'result': 'error', 'message': 'Missing event_type in JSON data'}

        self.runtime.publish(self, event_type, data)
        return {'result': 'success'}

    @XBlock.json_handler
    def reset(self, data, suffix=''):
        """
        Resets problem to initial state
        """
        self.item_state = {}
        return self._get_user_state()

    @XBlock.json_handler
    def show_answer(self, data, suffix=''):
        """
        Returns correct answer in assessment mode.

        Raises:
             * JsonHandlerError with 400 error code in standard mode.
             * JsonHandlerError with 409 error code if there are still attempts left
        """
        if self.mode != Constants.ASSESSMENT_MODE:
            raise JsonHandlerError(
                400,
                self.i18n_service.gettext("show_answer handler should only be called for assessment mode")
            )
        if self.attempts_remain:
            raise JsonHandlerError(
                409,
                self.i18n_service.gettext("There are attempts remaining")
            )

        return self._get_correct_state()

    @XBlock.json_handler
    def expand_static_url(self, url, suffix=''):
        """ AJAX-accessible handler for expanding URLs to static [image] files """
        return {'url': self._expand_static_url(url)}

    @property
    def i18n_service(self):
        """ Obtains translation service """
        i18n_service = self.runtime.service(self, "i18n")
        if i18n_service:
            return i18n_service
        else:
            return DummyTranslationService()

    @property
    def target_img_expanded_url(self):
        """ Get the expanded URL to the target image (the image items are dragged onto). """
        if self.data.get("targetImg"):
            return self._expand_static_url(self.data["targetImg"])
        else:
            return self.default_background_image_url

    @property
    def target_img_description(self):
        """ Get the description for the target image (the image items are dragged onto). """
        return self.data.get("targetImgDescription", "")

    @property
    def default_background_image_url(self):
        """ The URL to the default background image, shown when no custom background is used """
        return self.runtime.local_resource_url(self, "public/img/triangle.png")

    @property
    def attempts_remain(self):
        """
        Checks if current student still have more attempts.
        """
        return self.max_attempts is None or self.max_attempts == 0 or self.attempts < self.max_attempts

    @XBlock.handler
    def get_user_state(self, request, suffix=''):
        """ GET all user-specific data, and any applicable feedback """
        data = self._get_user_state()

        return webob.Response(body=json.dumps(data), content_type='application/json')

    def _validate_do_attempt(self):
        """
        Validates if `do_attempt` handler should be executed
        """
        if self.mode != Constants.ASSESSMENT_MODE:
            raise JsonHandlerError(
                400,
                self.i18n_service.gettext("do_attempt handler should only be called for assessment mode")
            )
        if not self.attempts_remain:
            raise JsonHandlerError(
                409,
                self.i18n_service.gettext("Max number of attempts reached")
            )

    def _get_feedback(self, include_item_feedback=False):
        """
        Builds overall feedback for both standard and assessment modes
        """
        answer_correctness = self._answer_correctness()
        is_correct = answer_correctness == self.SOLUTION_CORRECT

        if self.mode == Constants.STANDARD_MODE or not self.attempts:
            feedback_key = 'finish' if is_correct else 'start'
            return [FeedbackMessage(self.data['feedback'][feedback_key], None)], set()

        items = self._get_item_raw_stats()
        missing_ids = items.required - items.placed
        misplaced_ids = items.placed - items.correctly_placed

        feedback_msgs = []

        def _add_msg_if_exists(ids_list, message_template, message_class):
            """ Adds message to feedback messages if corresponding items list is not empty """
            if ids_list:
                message = message_template(len(ids_list), self.i18n_service.ngettext)
                feedback_msgs.append(FeedbackMessage(message, message_class))

        if self.item_state or include_item_feedback:
            _add_msg_if_exists(
                items.correctly_placed,
                FeedbackMessages.correctly_placed,
                FeedbackMessages.MessageClasses.CORRECTLY_PLACED
            )

            # Misplaced items are not returned to the bank on the final attempt.
            if self.attempts_remain:
                misplaced_template = FeedbackMessages.misplaced_returned
            else:
                misplaced_template = FeedbackMessages.misplaced

            _add_msg_if_exists(misplaced_ids, misplaced_template, FeedbackMessages.MessageClasses.MISPLACED)
            _add_msg_if_exists(missing_ids, FeedbackMessages.not_placed, FeedbackMessages.MessageClasses.NOT_PLACED)

        if self.attempts_remain and (misplaced_ids or missing_ids):
            problem_feedback_message = self.data['feedback']['start']
        else:
            problem_feedback_message = self.data['feedback']['finish']

        problem_feedback_class = self.PROBLEM_FEEDBACK_CLASSES.get(answer_correctness, None)
        grade_feedback_class = self.GRADE_FEEDBACK_CLASSES.get(answer_correctness, None)

        feedback_msgs.append(FeedbackMessage(problem_feedback_message, problem_feedback_class))

        if self.weight > 0:
            if self.attempts_remain:
                grade_feedback_template = FeedbackMessages.GRADE_FEEDBACK_TPL
            else:
                grade_feedback_template = FeedbackMessages.FINAL_ATTEMPT_TPL

            feedback_msgs.append(
                FeedbackMessage(grade_feedback_template.format(score=self.grade), grade_feedback_class)
            )

        return feedback_msgs, misplaced_ids

    @staticmethod
    def _present_feedback(feedback_messages):
        """
        Transforms feedback messages into format expected by frontend code
        """
        return [
            {"message": msg.message, "message_class": msg.message_class}
            for msg in feedback_messages
            if msg.message
        ]

    def _drop_item_standard(self, item_attempt):
        """
        Handles dropping item to a zone in standard mode.
        """
        item = self._get_item_definition(item_attempt['val'])

        is_correct = self._is_attempt_correct(item_attempt)  # Student placed item in a correct zone
        if is_correct:  # In standard mode state is only updated when attempt is correct
            self.item_state[str(item['id'])] = self._make_state_from_attempt(item_attempt, is_correct)

        self._mark_complete_and_publish_grade()  # must happen before _get_feedback
        self._publish_item_dropped_event(item_attempt, is_correct)

        item_feedback_key = 'correct' if is_correct else 'incorrect'
        item_feedback = FeedbackMessage(item['feedback'][item_feedback_key], None)
        overall_feedback, __ = self._get_feedback()

        return {
            'correct': is_correct,
            'grade': self._get_grade_if_set(),
            'finished': self._is_answer_correct(),
            'overall_feedback': self._present_feedback(overall_feedback),
            'feedback': self._present_feedback([item_feedback])
        }

    def _drop_item_assessment(self, item_attempt):
        """
        Handles dropping item into a zone in assessment mode
        """
        if not self.attempts_remain:
            raise JsonHandlerError(409, self.i18n_service.gettext("Max number of attempts reached"))

        item = self._get_item_definition(item_attempt['val'])

        is_correct = self._is_attempt_correct(item_attempt)
        # State is always updated in assessment mode to store intermediate item positions
        self.item_state[str(item['id'])] = self._make_state_from_attempt(item_attempt, is_correct)

        self._publish_item_dropped_event(item_attempt, is_correct)

        return {}

    def _validate_drop_item(self, item):
        """
        Validates `drop_item` parameters
        """
        zone = self._get_zone_by_uid(item['zone'])
        if not zone:
            raise JsonHandlerError(400, "Item zone data invalid.")

    @staticmethod
    def _make_state_from_attempt(attempt, correct):
        """
        Converts "attempt" data coming from browser into "state" entry stored in item_state
        """
        return {
            'zone': attempt['zone'],
            'correct': correct
        }

    def _mark_complete_and_publish_grade(self):
        """
        Helper method to update `self.completed` and submit grade event if appropriate conditions met.
        """
        # pylint: disable=fixme
        # TODO: (arguable) split this method into "clean" functions (with no side effects and implicit state)
        # This method implicitly depends on self.item_state (via _is_answer_correct and _calculate_grade)
        # and also updates self.grade if some conditions are met. As a result this method implies some order of
        # invocation:
        # * it should be called after learner-caused updates to self.item_state is applied
        # * it should be called before self.item_state cleanup is applied (i.e. returning misplaced items to item bank)
        # * it should be called before any method that depends on self.grade (i.e. self._get_feedback)

        # Splitting it into a "clean" functions will allow to capture this implicit invocation order in caller method
        # and help avoid bugs caused by invocation order violation in future.

        # There's no going back from "completed" status to "incomplete"
        self.completed = self.completed or self._is_answer_correct() or not self.attempts_remain
        grade = self._calculate_grade()
        # ... and from higher grade to lower
        current_grade = self._get_grade_if_set()
        if current_grade is None or grade > current_grade:
            self.grade = grade
            self._publish_grade()

    def _publish_grade(self):
        """
        Publishes grade
        """
        try:
            self.runtime.publish(self, 'grade', {
                'value': self.grade,
                'max_value': self.weight,
            })
        except NotImplementedError:
            # Note, this publish method is unimplemented in Studio runtimes,
            # so we have to figure that we're running in Studio for now
            pass

    def _publish_item_dropped_event(self, attempt, is_correct):
        """
        Publishes item dropped event.
        """
        item = self._get_item_definition(attempt['val'])
        # attempt should already be validated here - not doing the check for existing zone again
        zone = self._get_zone_by_uid(attempt['zone'])

        item_label = item.get("displayName")
        if not item_label:
            item_label = item.get("imageURL")

        self.runtime.publish(self, 'edx.drag_and_drop_v2.item.dropped', {
            'item': item_label,
            'item_id': item['id'],
            'location': zone.get("title"),
            'location_id': zone.get("uid"),
            'is_correct': is_correct,
        })

    def _is_attempt_correct(self, attempt):
        """
        Check if the item was placed correctly.
        """
        correct_zones = self.get_item_zones(attempt['val'])
        return attempt['zone'] in correct_zones

    def _expand_static_url(self, url):
        """
        This is required to make URLs like '/static/dnd-test-image.png' work (note: that is the
        only portable URL format for static files that works across export/import and reruns).
        This method is unfortunately a bit hackish since XBlock does not provide a low-level API
        for this.
        """
        if hasattr(self.runtime, 'replace_urls'):
            url = self.runtime.replace_urls('"{}"'.format(url))[1:-1]
        elif hasattr(self.runtime, 'course_id'):
            # edX Studio uses a different runtime for 'studio_view' than 'student_view',
            # and the 'studio_view' runtime doesn't provide the replace_urls API.
            try:
                from static_replace import replace_static_urls  # pylint: disable=import-error
                url = replace_static_urls('"{}"'.format(url), None, course_id=self.runtime.course_id)[1:-1]
            except ImportError:
                pass
        return url

    def _get_user_state(self):
        """ Get all user-specific data, and any applicable feedback """
        item_state = self._get_item_state()
        # In assessment mode, we do not want to leak the correctness info for individual items to the frontend,
        # so we remove "correct" from all items when in assessment mode.
        if self.mode == Constants.ASSESSMENT_MODE:
            for item in item_state.values():
                del item["correct"]

        overall_feedback_msgs, __ = self._get_feedback()
        if self.mode == Constants.STANDARD_MODE:
            is_finished = self._is_answer_correct()
        else:
            is_finished = not self.attempts_remain

        return {
            'items': item_state,
            'finished': is_finished,
            'attempts': self.attempts,
            'grade': self._get_grade_if_set(),
            'overall_feedback': self._present_feedback(overall_feedback_msgs)
        }

    def _get_correct_state(self):
        """
        Returns one of the possible correct states for the configured data.
        """
        state = {}
        items = copy.deepcopy(self.data.get('items', []))
        for item in items:
            zones = item.get('zones')

            # For backwards compatibility
            if zones is None:
                zones = []
                zone = item.get('zone')
                if zone is not None and zone != 'none':
                    zones.append(zone)

            if zones:
                zone = zones.pop()
                state[str(item['id'])] = {
                    'zone': zone,
                    'correct': True,
                }

        return {'items': state}

    def _get_item_state(self):
        """
        Returns a copy of the user item state.
        Converts to a dict if data is stored in legacy tuple form.
        """

        # IMPORTANT: this method should always return a COPY of self.item_state - it is called from get_user_state
        # handler and the data it returns is manipulated there to hide correctness of items placed.
        state = {}
        migrator = StateMigration(self)

        for item_id, item in self.item_state.iteritems():
            state[item_id] = migrator.apply_item_state_migrations(item_id, item)

        return state

    def _get_item_definition(self, item_id):
        """
        Returns definition (settings) for item identified by `item_id`.
        """
        return next(i for i in self.data['items'] if i['id'] == item_id)

    def get_item_zones(self, item_id):
        """
        Returns a list of the zones that are valid options for the item.

        If the item is configured with a list of zones, return that list. If
        the item is configured with a single zone, encapsulate that zone's
        ID in a list and return the list. If the item is not configured with
        any zones, or if it's configured explicitly with no zones, return an
        empty list.
        """
        item = self._get_item_definition(item_id)
        if item.get('zones') is not None:
            return item.get('zones')
        elif item.get('zone') is not None and item.get('zone') != 'none':
            return [item.get('zone')]
        else:
            return []

    @property
    def zones(self):
        """
        Get drop zone data, defined by the author.
        """
        # Convert zone data from old to new format if necessary
        migrator = StateMigration(self)
        return [migrator.apply_zone_migrations(zone) for zone in self.data.get('zones', [])]

    def _get_zone_by_uid(self, uid):
        """
        Given a zone UID, return that zone, or None.
        """
        for zone in self.zones:
            if zone["uid"] == uid:
                return zone

    def _get_item_stats(self):
        """
        Returns a tuple representing the number of correctly placed items,
        and the total number of items required (including decoy items).
        """
        items = self._get_item_raw_stats()

        correct_count = len(items.correctly_placed) + len(items.decoy_in_bank)
        total_count = len(items.required) + len(items.decoy)

        return correct_count, total_count

    def _get_item_raw_stats(self):
        """
        Returns a named tuple containing required, decoy, placed, correctly
        placed, and correctly unplaced decoy items.

        Returns:
            namedtuple: (required, placed, correctly_placed, decoy, decoy_in_bank)
                * required - IDs of items that must be placed on the board
                * placed - IDs of items actually placed on the board
                * correctly_placed - IDs of items that were placed correctly
                * decoy - IDs of decoy items
                * decoy_in_bank - IDs of decoy items that were unplaced
        """
        item_state = self._get_item_state()

        all_items = set(str(item['id']) for item in self.data['items'])
        required = set(item_id for item_id in all_items if self.get_item_zones(int(item_id)) != [])
        placed = set(item_id for item_id in all_items if item_id in item_state)
        correctly_placed = set(item_id for item_id in placed if item_state[item_id]['correct'])
        decoy = all_items - required
        decoy_in_bank = set(item_id for item_id in decoy if item_id not in item_state)

        return ItemStats(required, placed, correctly_placed, decoy, decoy_in_bank)

    def _calculate_grade(self):
        """
        Calculates the student's grade for this block based on current item state.
        """
        return self._learner_raw_score() * self.weight

    def _get_grade_if_set(self):
        """
        Returns student's grade if already explicitly set, otherwise returns None.
        This is different from self.grade which returns 0 by default.
        """
        if self.fields['grade'].is_set_on(self):
            return self.grade
        else:
            return None

    def _answer_correctness(self):
        """
        Checks answer correctness:

        Returns:
            string: Correct/Incorrect/Partial
                * Correct: All items are at their correct place.
                * Partial: Some items are at their correct place.
                * Incorrect: None items are at their correct place.
        """
        correct_count, total_count = self._get_item_stats()
        if correct_count == total_count:
            return self.SOLUTION_CORRECT
        elif correct_count == 0:
            return self.SOLUTION_INCORRECT
        else:
            return self.SOLUTION_PARTIAL

    def _is_answer_correct(self):
        """
        Helper - checks if answer is correct

        Returns:
            bool: True if current answer is correct
        """
        return self._answer_correctness() == self.SOLUTION_CORRECT

    @staticmethod
    def workbench_scenarios():
        """
        A canned scenario for display in the workbench.
        """
        return [
            (
                "Drag-and-drop-v2 standard",
                "<vertical_demo><drag-and-drop-v2/></vertical_demo>"
            ),
            (
                "Drag-and-drop-v2 assessment",
                "<vertical_demo><drag-and-drop-v2 mode='assessment' max_attempts='3'/></vertical_demo>"
            ),
        ]
