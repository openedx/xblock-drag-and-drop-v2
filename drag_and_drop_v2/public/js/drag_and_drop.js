function DragAndDropBlock(runtime, element) {

    // Set up gettext in case it isn't available in the client runtime:
    if (typeof gettext == "undefined") {
        window.gettext = function gettext_stub(string) { return string; };
    }

    var root = $(element).find('.xblock--drag-and-drop')[0];

    var __state;
    var __vdom = virtualDom.h();  // blank virtual DOM

    var init = function() {
        $.ajax(runtime.handlerUrl(element, 'get_data'), {
            dataType: 'json'
        }).done(function(data){
            setState(data);
            setItemsHeight();
            initDroppable();
        });

        $(document).on('mousedown touchstart', closePopup);
        $(element).on('click', '.reset-button', resetExercise);
        $(element).on('click', '.submit-input', submitInput);

        publishEvent({event_type: 'xblock.drag-and-drop-v2.loaded'});
    };

    var setItemsHeight = function() {
        var itemsHeight = $('.items', element).height();
        // Need to update the DOM here, otherwise .items will resize when first item is moved to target
        $('.items', element).height(itemsHeight);
        __state.itemsHeight = itemsHeight;
    };

    var getState = function() {
        return __state;
    };

    var setState = function(new_state) {
        var itemsHeight;
        if (__state === undefined) {
            itemsHeight = 'auto';
        } else {
            itemsHeight = __state.itemsHeight;
        }
        new_state.itemsHeight = itemsHeight;

        if (new_state.state.feedback) {
            if (new_state.state.feedback !== __state.state.feedback) {
                publishEvent({
                    event_type: 'xblock.drag-and-drop-v2.feedback.closed',
                    content: __state.state.feedback,
                    manually: false
                });
            }
            publishEvent({
                event_type: 'xblock.drag-and-drop-v2.feedback.opened',
                content: new_state.state.feedback
            });
        }
        __state = new_state;

        updateDOM(new_state);
        destroyDraggable();
        if (!new_state.state.finished) {
            initDraggable();
        }
    };

    var updateDOM = function(state) {
        var new_vdom = render(state);
        var patches = virtualDom.diff(__vdom, new_vdom);
        root = virtualDom.patch(root, patches);
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
        $(root).find('.zone').droppable({
            accept: '.xblock--drag-and-drop .items .option',
            tolerance: 'pointer',
            drop: function(evt, ui) {
                var item_id = ui.draggable.data('value');
                var zone = $(this).data('zone');
                var position = ui.draggable.position();
                var top = position.top + 'px';
                var left = position.left + 'px';
                var state = getState();
                state.state.items[item_id] = {
                    top: top,
                    left: left,
                    absolute: true,
                    submitting_location: true
                };
                // Wrap in setTimeout to let the droppable event finish.
                setTimeout(function() {
                    setState(state);
                    submitLocation(item_id, zone, top, left);
                }, 0);
            }
        });
    };

    var initDraggable = function() {
        $(root).find('.items .option').not('[data-drag-disabled=true]').each(function() {
            try {
                $(this).draggable({
                    containment: '.xblock--drag-and-drop .drag-container',
                    cursor: 'move',
                    stack: '.xblock--drag-and-drop .items .option',
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
        $(root).find('.items .option[data-drag-disabled=true]').each(function() {
            try {
                $(this).draggable('destroy');
            } catch (e) {
                // Destroying the draggable will fail if draggable was
                // not initialized in the first place. Ignore the exception.
            }
        });
    };

    var submitLocation = function(item_id, zone, top, left) {
        if (!zone) {
            return;
        }
        var url = runtime.handlerUrl(element, 'do_attempt');
        var data = {val: item_id, zone: zone, top: top, left: left};
        $.post(url, JSON.stringify(data), 'json').done(function(data){
            var state = getState();
            if (data.correct_location) {
                state.state.items[item_id].correct_input = Boolean(data.correct);
                state.state.items[item_id].submitting_location = false;
            } else {
                delete state.state.items[item_id];
            }
            state.state.feedback = data.feedback;
            if (data.finished) {
                state.state.finished = true;
                state.feedback.finish = data.final_feedback;
            }
            setState(state);
        });
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

        var state = getState();
        state.state.items[item_id].input = input_value;
        state.state.items[item_id].submitting_input = true;
        setState(state);

        var url = runtime.handlerUrl(element, 'do_attempt');
        var data = {val: item_id, input: input_value};
        $.post(url, JSON.stringify(data), 'json').done(function(data) {
            state.state.items[item_id].submitting_input = false;
            state.state.items[item_id].correct_input = data.correct;
            state.state.feedback = data.feedback;
            if (data.finished) {
                state.state.finished = true;
                state.feedback.finish = data.final_feedback;
            }
            setState(state);
        });
    };

    var closePopup = function(evt) {
        var target = $(evt.target);
        var popup_box = '.xblock--drag-and-drop .popup';
        var close_button = '.xblock--drag-and-drop .popup .close';
        var submit_input_button = '.xblock--drag-and-drop .submit-input';
        var state = getState();

        if (!state.state.feedback) {
            return;
        }
        if (target.is(popup_box) || target.is(submit_input_button)) {
            return;
        }
        if (target.parents(popup_box).length && !target.is(close_button)) {
            return;
        }

        publishEvent({
            event_type: 'xblock.drag-and-drop-v2.feedback.closed',
            content: state.state.feedback,
            manually: true
        });

        delete state.state.feedback;
        setState(state);
    };

    var resetExercise = function() {
        $.ajax({
            type: 'POST',
            url: runtime.handlerUrl(element, 'reset'),
            data: '{}',
            success: function(new_state) {
                setState(new_state);
            }
        });
    };

    var render = function(state) {
        var items = state.items.map(function(item) {
            var item_state = state.state.items[item.id];
            var position = item_state || {};
            var input = null;
            if (item.inputOptions) {
                input = {
                    is_visible: item_state && !item_state.submitting_location,
                    has_value: Boolean(item_state && 'input' in item_state),
                    value : (item_state && item_state.input) || '',
                    class_name: undefined
                };
                if (input.has_value && !item_state.submitting_input) {
                    input.class_name = item_state.correct_input ? 'correct' : 'incorrect';
                }
            }
            var itemProperties = {
                value: item.id,
                drag_disabled: Boolean(item_state || state.state.finished),
                width: item.size.width,
                height: item.size.height,
                top: position.top,
                left: position.left,
                position: position.absolute ? 'absolute' : 'relative',
                class_name: item_state && ('input' in item_state || item_state.correct_input) ? 'fade': undefined,
                input: input,
                content_html: item.backgroundImage ? '<img src="' + item.backgroundImage + '"/>' : item.displayName
            };
            if (state.item_background_color) {
                itemProperties.background_color = state.item_background_color;
            }
            if (state.item_text_color) {
                itemProperties.color = state.item_text_color;
            }
            return itemProperties;
        });

        var context = {
            header_html: state.title,
            show_title: state.show_title,
            question_html: state.question_text,
            show_question_header: state.show_question_header,
            popup_html: state.state.feedback || '',
            feedback_html: $.trim(state.state.finished ? state.feedback.finish : state.feedback.start),
            target_img_src: state.targetImg,
            display_zone_labels: state.displayLabels,
            display_reset_button: state.state.finished,
            zones: state.zones,
            items: items
        };

        return DragAndDropBlock.renderView(context);
    };

    init();
}
