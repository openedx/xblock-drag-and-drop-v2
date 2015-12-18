function DragAndDropBlock(runtime, element, configuration) {
    "use strict";

    // Set up a mock for gettext if it isn't available in the client runtime:
    if (!window.gettext) { window.gettext = function gettext_stub(string) { return string; }; }

    var $element = $(element);
    // root: root node managed by the virtual DOM
    var $root = $element.find('.xblock--drag-and-drop');
    var root = $root[0];

    var state = undefined;
    var __vdom = virtualDom.h();  // blank virtual DOM

    var init = function() {
        // Load the current user state, and load the image, then render the block.
        // We load the user state via AJAX rather than passing it in statically (like we do with
        // configuration) due to how the LMS handles unit tabs. If you click on a unit with this
        // block, make changes, click on the tab for another unit, then click back, this block
        // would re-initialize with the old state. To avoid that, we always fetch the state
        // using AJAX during initialization.
        $.when(
            $.ajax(runtime.handlerUrl(element, 'get_user_state'), {dataType: 'json'}),
            loadBackgroundImage()
        ).done(function(stateResult, bgImg){
            configuration.zones.forEach(function (zone) {
                computeZoneDimension(zone, bgImg.width, bgImg.height);
            });
            state = stateResult[0]; // stateResult is an array of [data, statusText, jqXHR]
            migrateState(bgImg.width, bgImg.height);
            applyState();
            initDroppable();

            $(document).on('mousedown touchstart', closePopup);
            $element.on('click', '.reset-button', resetExercise);
            $element.on('click', '.submit-input', submitInput);

            publishEvent({event_type: 'xblock.drag-and-drop-v2.loaded'});
        }).fail(function() {
            $root.text(gettext("An error occurred. Unable to load drag and drop exercise."));
        });
    };

    /** Asynchronously load the main background image used for this block. */
    var loadBackgroundImage = function() {
        var promise = $.Deferred();
        var img = new Image();
        img.addEventListener("load", function() {
            if (img.width > 0 && img.height > 0) {
                promise.resolve(img);
            } else {
                promise.reject();
            }
        }, false);
        img.addEventListener("error", function() { promise.reject() });
        img.src = configuration.target_img_expanded_url;
        return promise;
    }

    /** Zones are specified in the configuration via pixel values - convert to percentages */
    var computeZoneDimension = function(zone, bg_image_width, bg_image_height) {
        if (zone.x_percent === undefined) {
            // We can assume that if 'x_percent' is not set, 'y_percent', 'width_percent', and
            // 'height_percent' will also not be set.
            zone.x_percent = (+zone.x) / bg_image_width * 100;
            delete zone.x;
            zone.y_percent = (+zone.y) / bg_image_height * 100;
            delete zone.y;
            zone.width_percent = (+zone.width) / bg_image_width * 100;
            delete zone.width;
            zone.height_percent = (+zone.height) / bg_image_height * 100;
            delete zone.height;
        }
    };


    var previousFeedback = undefined;
    /**
     * Update the DOM to reflect 'state'.
     */
    var applyState = function() {
        // Is there a change to the feedback popup?
        if (state.feedback !== previousFeedback) {
            if (state.feedback) {
                if (previousFeedback) {
                    publishEvent({
                        event_type: 'xblock.drag-and-drop-v2.feedback.closed',
                        content: previousFeedback,
                        manually: false,
                    });
                }
                publishEvent({
                    event_type: 'xblock.drag-and-drop-v2.feedback.opened',
                    content: state.feedback,
                });
            } else {
                publishEvent({
                    event_type: 'xblock.drag-and-drop-v2.feedback.closed',
                    content: state.feedback,
                    manually: true,
                });
            }
            previousFeedback = state.feedback;
        }

        updateDOM();
        destroyDraggable();
        if (!state.finished) {
            initDraggable();
        }
    };

    var updateDOM = function(state) {
        var new_vdom = render(state);
        var patches = virtualDom.diff(__vdom, new_vdom);
        root = virtualDom.patch(root, patches);
        $root = $(root);
        __vdom = new_vdom;
    };

    var publishEvent = function(data) {
        $.ajax({
            type: 'POST',
            url: runtime.handlerUrl(element, 'publish_event'),
            data: JSON.stringify(data)
        });
    };

    var initDroppable = function() {
        $root.find('.zone').droppable({
            accept: '.xblock--drag-and-drop .item-bank .option',
            tolerance: 'pointer',
            drop: function(evt, ui) {
                var item_id = ui.draggable.data('value');
                var zone = $(this).data('zone');
                var $target_img = $root.find('.target-img');

                // Calculate the position of the center of the dropped element relative to
                // the image.
                var x_pos = (ui.helper.offset().left + (ui.helper.outerWidth()/2) - $target_img.offset().left);
                var x_pos_percent = x_pos / $target_img.width() * 100;
                var y_pos = (ui.helper.offset().top + (ui.helper.outerHeight()/2) - $target_img.offset().top);
                var y_pos_percent = y_pos / $target_img.height() * 100;

                state.items[item_id] = {
                    x_percent: x_pos_percent,
                    y_percent: y_pos_percent,
                    submitting_location: true,
                };
                // Wrap in setTimeout to let the droppable event finish.
                setTimeout(function() {
                    applyState();
                    submitLocation(item_id, zone, x_pos_percent, y_pos_percent);
                }, 0);
            }
        });
    };

    var initDraggable = function() {
        $root.find('.item-bank .option').not('[data-drag-disabled=true]').each(function() {
            try {
                $(this).draggable({
                    containment: $root.find('.xblock--drag-and-drop .drag-container'),
                    cursor: 'move',
                    stack: $root.find('.xblock--drag-and-drop .item-bank .option'),
                    revert: 'invalid',
                    revertDuration: 150,
                    start: function(evt, ui) {
                        var item_id = $(this).data('value');
                        publishEvent({
                            event_type: 'xblock.drag-and-drop-v2.item.picked-up',
                            item_id: item_id
                        });
                    }
                });
            } catch (e) {
                // Initializing the draggable will fail if draggable was already
                // initialized. That's expected, ignore the exception.
            }
        });
    };

    var destroyDraggable = function() {
        $root.find('.item-bank .option[data-drag-disabled=true]').each(function() {
            try {
                $(this).draggable('destroy');
            } catch (e) {
                // Destroying the draggable will fail if draggable was
                // not initialized in the first place. Ignore the exception.
            }
        });
    };

    var submitLocation = function(item_id, zone, x_percent, y_percent) {
        if (!zone) {
            return;
        }
        var url = runtime.handlerUrl(element, 'do_attempt');
        var data = {
            val: item_id,
            zone: zone,
            x_percent: x_percent,
            y_percent: y_percent,
        };
        var $item = $root.find(".option[data-value='"+item_id+"']");
        $item.find('.spinner-wrapper').show();

        $.post(url, JSON.stringify(data), 'json')
            .done(function(data){
                if (data.correct_location) {
                    state.items[item_id].correct_input = Boolean(data.correct);
                    state.items[item_id].submitting_location = false;
                } else {
                    delete state.items[item_id];
                }
                state.feedback = data.feedback;
                if (data.finished) {
                    state.finished = true;
                    state.overall_feedback = data.overall_feedback;
                }
                $item.find('.spinner-wrapper').hide();
                applyState();
            })
            .fail(function (data) { $item.find('.spinner-wrapper').hide(); });
    };

    var submitInput = function(evt) {
        var item = $(evt.target).closest('.option');
        var input_div = item.find('.numerical-input');
        var input = input_div.find('.input');
        var input_value = input.val();
        var item_id = item.data('value');

        if (!input_value) {
            // Don't submit if the user didn't enter anything yet.
            return;
        }

        state.items[item_id].input = input_value;
        state.items[item_id].submitting_input = true;
        applyState();

        var url = runtime.handlerUrl(element, 'do_attempt');
        var data = {val: item_id, input: input_value};
        $.post(url, JSON.stringify(data), 'json').done(function(data) {
            state.items[item_id].submitting_input = false;
            state.items[item_id].correct_input = data.correct;
            state.feedback = data.feedback;
            if (data.finished) {
                state.finished = true;
                state.overall_feedback = data.overall_feedback;
            }
            applyState();
        });
    };

    var closePopup = function(evt) {
        if (!state.feedback) {
            return;
        }

        var target = $(evt.target);
        var popup_box = '.xblock--drag-and-drop .popup';
        var close_button = '.xblock--drag-and-drop .popup .close';
        var submit_input_button = '.xblock--drag-and-drop .submit-input';

        if (target.is(popup_box) || target.is(submit_input_button)) {
            return;
        }
        if (target.parents(popup_box).length && !target.is(close_button)) {
            return;
        }

        delete state.feedback;
        applyState();
    };

    var resetExercise = function() {
        $.ajax({
            type: 'POST',
            url: runtime.handlerUrl(element, 'reset'),
            data: '{}',
        });
        state = {
            'items': [],
            'finished': false,
            'overall_feedback': configuration.initial_feedback,
        };
        applyState();
    };

    var render = function() {
        var items = configuration.items.map(function(item) {
            var input = null;
            var item_user_state = state.items[item.id];
            if (item.inputOptions) {
                input = {
                    is_visible: item_user_state && !item_user_state.submitting_location,
                    has_value: Boolean(item_user_state && 'input' in item_user_state),
                    value : (item_user_state && item_user_state.input) || '',
                    class_name: undefined,
                };
                if (input.has_value && !item_user_state.submitting_input) {
                    input.class_name = item_user_state.correct_input ? 'correct' : 'incorrect';
                }
            }
            var itemProperties = {
                value: item.id,
                drag_disabled: Boolean(item_user_state || state.finished),
                class_name: item_user_state && ('input' in item_user_state || item_user_state.correct_input) ? 'fade': undefined,
                input: input,
                content_html: item.backgroundImage ? '<img src="' + item.backgroundImage + '"/>' : item.displayName
            };
            if (item_user_state) {
                itemProperties.is_placed = true;
                itemProperties.x_percent = item_user_state.x_percent;
                itemProperties.y_percent = item_user_state.y_percent;
            }
            if (configuration.item_background_color) {
                itemProperties.background_color = configuration.item_background_color;
            }
            if (configuration.item_text_color) {
                itemProperties.color = configuration.item_text_color;
            }
            return itemProperties;
        });

        var context = {
            // configuration - parts that never change:
            header_html: configuration.title,
            show_title: configuration.show_title,
            question_html: configuration.question_text,
            show_question_header: configuration.show_question_header,
            target_img_src: configuration.target_img_expanded_url,
            display_zone_labels: configuration.display_zone_labels,
            zones: configuration.zones,
            items: items,
            // state - parts that can change:
            popup_html: state.feedback || '',
            feedback_html: $.trim(state.overall_feedback),
            display_reset_button: Object.keys(state.items).length > 0,
        };

        return DragAndDropBlock.renderView(context);
    };

    /**
     * migrateState: Apply any changes necessary to support the 'state' format used by older
     * versions of this XBlock.
     * We have to do this in JS, not python, since some migrations depend on the image size,
     * which is not known in Python-land.
     */
    var migrateState = function(bg_image_width, bg_image_height) {
        Object.keys(state.items).forEach(function(item_id) {
            var item = state.items[item_id];
            if (item.x_percent === undefined) {
                // Find the matching item in the configuration
                var width = 190;
                var height = 44;
                for (var i in configuration.items) {
                    if (configuration.items[i].id === +item_id) {
                        var size = configuration.items[i].size;
                        // size is an object like '{width: "50px", height: "auto"}'
                        if (parseInt(size.width ) > 0) {  width = parseInt(size.width); }
                        if (parseInt(size.height) > 0) { height = parseInt(size.height); }
                        break;
                    }
                }
                // Update the user's item state to use centered relative coordinates
                var left_px = parseFloat(item.left) - 220; // 220 px for the items container that used to be on the left
                var top_px = parseFloat(item.top);
                item.x_percent = (left_px + width/2) / bg_image_width * 100;
                item.y_percent = (top_px + height/2) / bg_image_height * 100;
                delete item.left;
                delete item.top;
                delete item.absolute;
            }
        });
    };

    init();
}
