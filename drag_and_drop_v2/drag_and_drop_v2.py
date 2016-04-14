# -*- coding: utf-8 -*-
#

# Imports ###########################################################

import json
import webob
import copy
import urllib

from xblock.core import XBlock
from xblock.exceptions import JsonHandlerError
from xblock.fields import Scope, String, Dict, Float, Boolean
from xblock.fragment import Fragment
from xblockutils.resources import ResourceLoader
from xblockutils.settings import XBlockWithSettingsMixin, ThemableXBlockMixin

from .utils import _  # pylint: disable=unused-import
from .default_data import DEFAULT_DATA


# Globals ###########################################################

loader = ResourceLoader(__name__)


# Classes ###########################################################

@XBlock.wants('settings')
@XBlock.needs('i18n')
class DragAndDropBlock(XBlock, XBlockWithSettingsMixin, ThemableXBlockMixin):
    """
    XBlock that implements a friendly Drag-and-Drop problem
    """
    display_name = String(
        display_name=_("Title"),
        help=_("The title of the drag and drop problem. The title is displayed to learners."),
        scope=Scope.settings,
        default=_("Drag and Drop"),
    )

    show_title = Boolean(
        display_name=_("Show title"),
        help=_("Display the title to the learner?"),
        scope=Scope.settings,
        default=True,
    )

    question_text = String(
        display_name=_("Problem text"),
        help=_("The description of the problem or instructions shown to the learner"),
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
        display_name=_("Weight"),
        help=_("The maximum score the learner can receive for the problem"),
        scope=Scope.settings,
        default=1,
    )

    item_background_color = String(
        display_name=_("Item background color"),
        help=_("The background color of draggable items in the problem."),
        scope=Scope.settings,
        default="",
    )

    item_text_color = String(
        display_name=_("Item text color"),
        help=_("Text color to use for draggable items."),
        scope=Scope.settings,
        default="",
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

    completed = Boolean(
        help=_("Indicates whether a learner has completed the problem at least once"),
        scope=Scope.user_state,
        default=False,
    )

    block_settings_key = 'drag-and-drop-v2'
    has_score = True

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
            items = copy.deepcopy(self.data.get('items', ''))
            for item in items:
                del item['feedback']
                del item['zone']
                item['inputOptions'] = 'inputOptions' in item
                # Fall back on "backgroundImage" to be backward-compatible.
                image_url = item.get('imageURL') or item.get('backgroundImage')
                if image_url:
                    item['expandedImageURL'] = self._expand_static_url(image_url)
                else:
                    item['expandedImageURL'] = ''
            return items

        return {
            "zones": self._get_zones(),
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
            "initial_feedback": self.data['feedback']['start'],
            # final feedback (data.feedback.finish) is not included - it may give away answers.
        }

    def studio_view(self, context):
        """
        Editing view in Studio
        """

        js_templates = loader.load_unicode('/templates/html/js_templates.html')
        help_texts = {
            field_name: self.ugettext(field.help)
            for field_name, field in self.fields.viewitems() if hasattr(field, "help")
        }
        context = {
            'js_templates': js_templates,
            'help_texts': help_texts,
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

        fragment.initialize_js('DragAndDropEditBlock', {
            'data': self.data,
            'target_img_expanded_url': self.target_img_expanded_url,
            'default_background_image_url': self.default_background_image_url,
        })

        return fragment

    @XBlock.json_handler
    def studio_submit(self, submissions, suffix=''):
        self.display_name = submissions['display_name']
        self.show_title = submissions['show_title']
        self.question_text = submissions['problem_text']
        self.show_question_header = submissions['show_problem_header']
        self.weight = float(submissions['weight'])
        self.item_background_color = submissions['item_background_color']
        self.item_text_color = submissions['item_text_color']
        self.data = submissions['data']

        return {
            'result': 'success',
        }

    @XBlock.json_handler
    def do_attempt(self, attempt, suffix=''):
        item = self._get_item_definition(attempt['val'])

        state = None
        zone = None
        feedback = item['feedback']['incorrect']
        overall_feedback = None
        is_correct = False
        is_correct_location = False

        if 'input' in attempt:  # Student submitted numerical value for item
            state = self._get_item_state().get(str(item['id']))
            if state:
                state['input'] = attempt['input']
                is_correct_location = True
                if self._is_correct_input(item, attempt['input']):
                    is_correct = True
                    feedback = item['feedback']['correct']
                else:
                    is_correct = False
        elif item['zone'] == attempt['zone']:  # Student placed item in correct zone
            is_correct_location = True
            if 'inputOptions' in item:
                # Input value will have to be provided for the item.
                # It is not (yet) correct and no feedback should be shown yet.
                is_correct = False
                feedback = None
            else:
                # If this item has no input value set, we are done with it.
                is_correct = True
                feedback = item['feedback']['correct']
            state = {
                'zone': attempt['zone'],
                'x_percent': attempt['x_percent'],
                'y_percent': attempt['y_percent'],
            }

        if state:
            self.item_state[str(item['id'])] = state
            zone = self._get_zone_by_uid(state['zone'])
        else:
            zone = self._get_zone_by_uid(attempt['zone'])
        if not zone:
            raise JsonHandlerError(400, "Item zone data invalid.")

        if self._is_finished():
            overall_feedback = self.data['feedback']['finish']

        # don't publish the grade if the student has already completed the problem
        if not self.completed:
            if self._is_finished():
                self.completed = True
            try:
                self.runtime.publish(self, 'grade', {
                    'value': self._get_grade(),
                    'max_value': self.weight,
                })
            except NotImplementedError:
                # Note, this publish method is unimplemented in Studio runtimes,
                # so we have to figure that we're running in Studio for now
                pass

        self.runtime.publish(self, 'edx.drag_and_drop_v2.item.dropped', {
            'item_id': item['id'],
            'location': zone.get("title"),
            'location_id': zone.get("uid"),
            'input': attempt.get('input'),
            'is_correct_location': is_correct_location,
            'is_correct': is_correct,
        })

        return {
            'correct': is_correct,
            'correct_location': is_correct_location,
            'finished': self._is_finished(),
            'overall_feedback': overall_feedback,
            'feedback': feedback
        }

    @XBlock.json_handler
    def reset(self, data, suffix=''):
        self.item_state = {}
        return self._get_user_state()

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

    @XBlock.json_handler
    def expand_static_url(self, url, suffix=''):
        """ AJAX-accessible handler for expanding URLs to static [image] files """
        return {'url': self._expand_static_url(url)}

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

    @XBlock.handler
    def get_user_state(self, request, suffix=''):
        """ GET all user-specific data, and any applicable feedback """
        data = self._get_user_state()
        return webob.Response(body=json.dumps(data), content_type='application/json')

    def _get_user_state(self):
        """ Get all user-specific data, and any applicable feedback """
        item_state = self._get_item_state()
        for item_id, item in item_state.iteritems():
            definition = self._get_item_definition(int(item_id))
            item['correct_input'] = self._is_correct_input(definition, item.get('input'))
            # If information about zone is missing
            # (because problem was completed before a11y enhancements were implemented),
            # deduce zone in which item is placed from definition:
            if item.get('zone') is None:
                item['zone'] = definition.get('zone', 'unknown')

        is_finished = self._is_finished()
        return {
            'items': item_state,
            'finished': is_finished,
            'overall_feedback': self.data['feedback']['finish' if is_finished else 'start'],
        }

    def _get_item_state(self):
        """
        Returns the user item state.
        Converts to a dict if data is stored in legacy tuple form.
        """
        state = {}

        for item_id, item in self.item_state.iteritems():
            if isinstance(item, dict):
                state[item_id] = item
            else:
                state[item_id] = {'top': item[0], 'left': item[1]}

        return state

    def _get_item_definition(self, item_id):
        """
        Returns definition (settings) for item identified by `item_id`.
        """
        return next(i for i in self.data['items'] if i['id'] == item_id)

    def _get_zones(self):
        """
        Get drop zone data, defined by the author.
        """
        # Convert zone data from old to new format if necessary
        zones = []
        for zone in self.data.get('zones', []):
            zone = zone.copy()
            if "uid" not in zone:
                zone["uid"] = zone.get("title")  # Older versions used title as the zone UID
            # Remove old, now-unused zone attributes, if present:
            zone.pop("id", None)
            zone.pop("index", None)
            zones.append(zone)
        return zones

    def _get_zone_by_uid(self, uid):
        """
        Given a zone UID, return that zone, or None.
        """
        for zone in self._get_zones():
            if zone["uid"] == uid:
                return zone

    def _get_grade(self):
        """
        Returns the student's grade for this block.
        """
        correct_count = 0
        total_count = 0
        item_state = self._get_item_state()

        for item in self.data['items']:
            if item['zone'] != 'none':
                total_count += 1
                item_id = str(item['id'])
                if item_id in item_state:
                    if self._is_correct_input(item, item_state[item_id].get('input')):
                        correct_count += 1

        return correct_count / float(total_count) * self.weight

    def _is_finished(self):
        """
        All items are at their correct place and a value has been
        submitted for each item that expects a value.
        """
        completed_count = 0
        total_count = 0
        item_state = self._get_item_state()
        for item in self.data['items']:
            if item['zone'] != 'none':
                total_count += 1
                item_id = str(item['id'])
                if item_id in item_state:
                    if 'inputOptions' in item:
                        if 'input' in item_state[item_id]:
                            completed_count += 1
                    else:
                        completed_count += 1

        return completed_count == total_count

    @XBlock.json_handler
    def publish_event(self, data, suffix=''):
        try:
            event_type = data.pop('event_type')
        except KeyError:
            return {'result': 'error', 'message': 'Missing event_type in JSON data'}

        self.runtime.publish(self, event_type, data)
        return {'result': 'success'}

    def _get_unique_id(self):
        usage_id = self.scope_ids.usage_id
        try:
            return usage_id.name
        except AttributeError:
            # workaround for xblock workbench
            return usage_id

    @staticmethod
    def _is_correct_input(item, val):
        """
        Is submitted numerical value within the tolerated margin for this item.
        """
        input_options = item.get('inputOptions')

        if input_options:
            try:
                submitted_value = float(val)
            except (ValueError, TypeError):
                return False
            else:
                expected_value = input_options['value']
                margin = input_options['margin']
                return abs(submitted_value - expected_value) <= margin
        else:
            return True

    @staticmethod
    def workbench_scenarios():
        """
        A canned scenario for display in the workbench.
        """
        return [("Drag-and-drop-v2 scenario", "<vertical_demo><drag-and-drop-v2/></vertical_demo>")]
