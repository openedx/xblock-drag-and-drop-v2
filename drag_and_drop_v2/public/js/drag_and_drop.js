function DragNDropTemplates(url_name) {
    "use strict";
    var h = virtualDom.h;
    // Set up a mock for gettext if it isn't available in the client runtime:
    if (!window.gettext) { window.gettext = function gettext_stub(string) { return string; }; }

    var FocusHook = function() {
        if (!(this instanceof FocusHook)) {
            return new FocusHook();
        }
    };

    FocusHook.prototype.hook = function(node, prop, prev) {
        setTimeout(function() {
            if (document.activeElement !== node) {
                node.focus();
            }
        }, 0);
    };

    var itemSpinnerTemplate = function(xhr_active) {
        if (!xhr_active) {
            return null;
        }
        return (h(
            "div.spinner-wrapper",
            [
                h("i.fa.fa-spin.fa-spinner")
            ]
        ));
    };

    var renderCollection = function(template, collection, ctx) {
        return collection.map(function(item) {
            return template(item, ctx);
        });
    };

    var itemInputTemplate = function(input) {
        if (!input) {
            return null;
        }
        var focus_hook = input.has_value ? undefined : FocusHook();
        return (
            h('div.numerical-input', {className: input.class_name,
                style: {display: input.is_visible ? 'block' : 'none'}}, [
                h('input.input', {type: 'text', value: input.value, disabled: input.has_value,
                    focusHook: focus_hook}),
                itemSpinnerTemplate(input.xhr_active),
                h('button.submit-input', {disabled: input.has_value}, gettext('ok'))
            ])
        );
    };

    var getZone = function(zoneUID, ctx) {
        for (var i = 0; i < ctx.zones.length; i++) {
            if (ctx.zones[i].uid === zoneUID) {
                return ctx.zones[i];
            }
        }
    };

    var itemTemplate = function(item, ctx) {
        // Define properties
        var className = (item.class_name) ? item.class_name : "";
        var zone = getZone(item.zone, ctx) || {};
        if (item.has_image) {
            className += " " + "option-with-image";
        }
        if (item.widthPercent) {
            className += " specified-width";  // The author has specified a width for this item.
        }
        var attributes = {
            'role': 'button',
            'draggable': !item.drag_disabled,
            'aria-grabbed': item.grabbed,
            'data-value': item.value,
            'data-drag-disabled': item.drag_disabled
        };
        var style = {};
        if (item.background_color) {
            style['background-color'] = item.background_color;
        }
        if (item.color) {
            style.color = item.color;
            // Ensure contrast between outline-color and background color
            // matches contrast between text color and background color:
            style['outline-color'] = item.color;
        }
        if (item.is_placed) {
            if (item.zone_align === 'none') {
                // This is not an "aligned" zone, so the item gets positioned where the learner dropped it.
                style.left = item.x_percent + "%";
                style.top = item.y_percent + "%";
                if (item.widthPercent) {  // This item has an author-defined explicit width
                    style.width = item.widthPercent + "%";
                    style.maxWidth = item.widthPercent + "%"; // default maxWidth is ~30%
                }
            } else {
                // This is an "aligned" zone, so the item position within the zone is calculated by the browser.
                // Allow for the input + button width for aligned items
                if (item.input) {
                    style.marginRight = '190px';
                }
                // Make up for the fact we're in a wrapper container by calculating percentage differences.
                var maxWidth = (item.widthPercent || 30) / 100;
                var widthPercent = zone.width_percent / 100;
                style.maxWidth = ((1 / (widthPercent / maxWidth)) * 100) + '%';
                if (item.widthPercent) {
                    style.width = style.maxWidth;
                }
            }
            // Finally, if the item is using automatic sizing and contains an image, we
            // always prefer the natural width of the image (subject to the max-width):
            if (item.imgNaturalWidth && !item.widthPercent) {
                style.width = (item.imgNaturalWidth + 22) + "px"; // 22px is for 10px padding + 1px border each side
                // ^ Hack to detect image width at runtime and make webkit consistent with Firefox
            }
        } else {
            // If an item has not been placed it must be possible to move focus to it using the keyboard:
            attributes.tabindex = 0;
            if (item.widthPercent) {
                // The item bank container is often wider than the background image, and the
                // widthPercent is specified relative to the background image so we have to
                // convert it to pixels. But if the browser window / mobile screen is not as
                // wide as the image, then the background image will be scaled down and this
                // pixel value would be too large, so we also specify it as a max-width
                // percentage.
                style.width = (item.widthPercent / 100 * ctx.bg_image_width) + "px";
                style.maxWidth = item.widthPercent + "%";
            }
        }
        // Define children
        var children = [
            itemSpinnerTemplate(item.xhr_active),
            itemInputTemplate(item.input)
        ];
        var item_content_html = item.displayName;
        if (item.imageURL) {
            item_content_html = '<img src="' + item.imageURL + '" alt="' + item.imageDescription + '" />';
        }
        var item_content = h('div', { innerHTML: item_content_html, className: "item-content" });
        if (item.is_placed) {
            // Insert information about zone in which this item has been placed
            var item_description_id = url_name + '-item-' + item.value + '-description';
            item_content.properties.attributes = { 'aria-describedby': item_description_id };
            var zone_title = (zone.title || "Unknown Zone");  // This "Unknown" text should never be seen, so does not need i18n
            var item_description = h(
                'div',
                { id: item_description_id, className: 'sr' },
                gettext('Correctly placed in: ') + zone_title
            );
            children.splice(1, 0, item_description);
        }
        children.splice(1, 0, item_content);
        return (
            h(
                'div.option',
                {
                    // Unique key for virtual dom change tracking. Key must be different for
                    // Placed vs Unplaced, or weird bugs can occur.
                    key: item.value + (item.is_placed ? "-p" : "-u"),
                    className: className,
                    attributes: attributes,
                    style: style
                },
                children
            )
        );
    };

    var zoneTemplate = function(zone, ctx) {
        var className = ctx.display_zone_labels ? 'zone-name' : 'zone-name sr';
        var selector = ctx.display_zone_borders ? 'div.zone.zone-with-borders' : 'div.zone';

        // If zone is aligned, mark its item alignment
        // and render its placed items as children
        var item_wrapper = 'div.item-wrapper';
        var items_in_zone = [];
        if (zone.align !== 'none') {
            item_wrapper += '.item-align.item-align-' + zone.align;
            var is_item_in_zone = function(i) { return i.is_placed && (i.zone === zone.uid); };
            items_in_zone = $.grep(ctx.items, is_item_in_zone);
        }

        return (
            h(
                selector,
                {
                    id: zone.prefixed_uid,
                    attributes: {
                        'tabindex': 0,
                        'dropzone': 'move',
                        'aria-dropeffect': 'move',
                        'data-uid': zone.uid,
                        'data-zone_id': zone.id,
                        'data-zone_align': zone.align,
                        'role': 'button',
                    },
                    style: {
                        top: zone.y_percent + '%', left: zone.x_percent + "%",
                        width: zone.width_percent + '%', height: zone.height_percent + "%",
                    }
                },
                [
                    h('p', { className: className }, zone.title),
                    h('p', { className: 'zone-description sr' }, zone.description),
                    h(item_wrapper, renderCollection(itemTemplate, items_in_zone, ctx))
                ]
            )
        );
    };

    var feedbackTemplate = function(ctx) {
        var feedback_display = ctx.feedback_html ? 'block' : 'none';
        var reset_button_display = ctx.display_reset_button ? 'block' : 'none';
        var properties = { attributes: { 'aria-live': 'polite' } };
        return (
            h('section.feedback', properties, [
                h(
                    'button.reset-button.unbutton.link-button',
                    { style: { display: reset_button_display }, attributes: { tabindex: 0 }, 'aria-live': 'off'},
                    gettext('Reset problem')
                ),
                h('h3.title1', { style: { display: feedback_display } }, gettext('Feedback')),
                h('p.message', { style: { display: feedback_display }, innerHTML: ctx.feedback_html })
            ])
        );
    };

    var keyboardHelpTemplate = function(ctx) {
        var dialog_attributes = { role: 'dialog', 'aria-labelledby': 'modal-window-title' };
        var dialog_style = {};
        return (
            h('section.keyboard-help', [
                h('button.keyboard-help-button.unbutton.link-button', { attributes: { tabindex: 0 } }, gettext('Keyboard Help')),
                h('div.keyboard-help-dialog', [
                    h('div.modal-window-overlay'),
                    h('div.modal-window', { attributes: dialog_attributes, style: dialog_style }, [
                        h('div.modal-header', [
                            h('h2.modal-window-title', gettext('Keyboard Help'))
                        ]),
                        h('div.modal-content', [
                            h('p', gettext('You can complete this problem using only your keyboard.')),
                            h('ul', [
                                h('li', gettext('Use "Tab" and "Shift-Tab" to navigate between items and zones.')),
                                h('li', gettext('Press "Enter", "Space", "Ctrl-m", or "⌘-m" on an item to select it for dropping, then navigate to the zone you want to drop it on.')),
                                h('li', gettext('Press "Enter", "Space", "Ctrl-m", or "⌘-m" to drop the item on the current zone.')),
                                h('li', gettext('Press "Esc" if you want to cancel the drop operation (for example, to select a different item).')),
                            ])
                        ]),
                        h('div.modal-actions', [
                            h('button.modal-dismiss-button', gettext("OK"))
                        ])
                    ])
                ])
            ])
        );
    };

    var mainTemplate = function(ctx) {
        var problemTitle = ctx.show_title ? h('h2.problem-title', {innerHTML: ctx.title_html}) : null;
        var problemHeader = ctx.show_problem_header ? h('h3.title1', gettext('Problem')) : null;
        var popupSelector = 'div.popup';
        if (ctx.popup_html && !ctx.last_action_correct) {
            popupSelector += '.popup-incorrect';
        }
        // Render only items_in_bank and items_placed_unaligned here;
        // items placed in aligned zones will be rendered by zoneTemplate.
        var is_item_placed = function(i) { return i.is_placed; };
        var items_placed = $.grep(ctx.items, is_item_placed);
        var items_in_bank = $.grep(ctx.items, is_item_placed, true);
        var is_item_placed_unaligned = function(i) { return i.zone_align === 'none'; };
        var items_placed_unaligned = $.grep(items_placed, is_item_placed_unaligned);
        return (
            h('section.themed-xblock.xblock--drag-and-drop', [
                problemTitle,
                h('section.problem', [
                    problemHeader,
                    h('p', {innerHTML: ctx.problem_html}),
                ]),
                h('section.drag-container', {}, [
                    h(
                        'div.item-bank',
                        renderCollection(itemTemplate, items_in_bank, ctx)
                    ),
                    h('div.target',
                        {
                            attributes: {
                                'aria-live': 'polite',
                                'aria-atomic': 'true',
                                'aria-relevant': 'additions',
                            },
                        },
                        [
                            h(
                                popupSelector,
                                {
                                    style: {display: ctx.popup_html ? 'block' : 'none'},
                                },
                                [
                                    h('div.close.icon-remove-sign.fa-times-circle'),
                                    h('p.popup-content', {innerHTML: ctx.popup_html}),
                                ]
                            ),
                            h('div.target-img-wrapper', [
                                h('img.target-img', {src: ctx.target_img_src, alt: ctx.target_img_description}),
                            ]
                        ),
                        renderCollection(zoneTemplate, ctx.zones, ctx),
                        renderCollection(itemTemplate, items_placed_unaligned, ctx)
                    ]
                    ),
                ]),
                keyboardHelpTemplate(ctx),
                feedbackTemplate(ctx),
            ])
        );
    };

    DragAndDropBlock.renderView = mainTemplate;

}

function DragAndDropBlock(runtime, element, configuration) {
    "use strict";

    DragNDropTemplates(configuration.url_name);
    // Set up a mock for gettext if it isn't available in the client runtime:
    if (!window.gettext) { window.gettext = function gettext_stub(string) { return string; }; }

    var $element = $(element);
    element = $element[0]; // TODO: This line can be removed when we no longer support Dogwood.
                           // It works around this Studio bug: https://github.com/edx/edx-platform/pull/11433
    // root: root node managed by the virtual DOM
    var $root = $element.find('.xblock--drag-and-drop');
    var root = $root[0];

    var state = undefined;
    var bgImgNaturalWidth = undefined; // pixel width of the background image (when not scaled)
    var __vdom = virtualDom.h();  // blank virtual DOM

    // Event string size limit.
    var MAX_LENGTH = 255;

    // Keyboard accessibility
    var ESC = 27;
    var RET = 13;
    var SPC = 32;
    var TAB = 9;
    var M = 77;

    var placementMode = false;
    var $selectedItem;
    var $focusedElement;

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
            // Render problem
            configuration.zones.forEach(function (zone) {
                computeZoneDimension(zone, bgImg.width, bgImg.height);
            });
            state = stateResult[0]; // stateResult is an array of [data, statusText, jqXHR]
            migrateConfiguration(bgImg.width);
            migrateState(bgImg.width, bgImg.height);
            markItemZoneAlign();
            bgImgNaturalWidth = bgImg.width;

            // Set up event handlers:

            $(document).on('keydown mousedown touchstart', closePopup);
            $element.on('click', '.keyboard-help-button', showKeyboardHelp);
            $element.on('keydown', '.keyboard-help-button', function(evt) {
                runOnKey(evt, RET, showKeyboardHelp);
            });
            $element.on('click', '.reset-button', resetProblem);
            $element.on('keydown', '.reset-button', function(evt) {
                runOnKey(evt, RET, resetProblem);
            });
            $element.on('click', '.submit-input', submitInput);

            // For the next one, we need to use addEventListener with useCapture 'true' in order
            // to watch for load events on any child element, since load events do not bubble.
            element.addEventListener('load', webkitFix, true);

            applyState();
            initDroppable();

            // Indicate that problem is done loading
            publishEvent({event_type: 'edx.drag_and_drop_v2.loaded'});
        }).fail(function() {
            $root.text(gettext("An error occurred. Unable to load drag and drop problem."));
        });
    };

    var runOnKey = function(evt, key, handler) {
        if (evt.which === key) {
            handler(evt);
        }
    };

    var keyboardEventDispatcher = function(evt) {
        if (evt.which === TAB) {
            trapFocus(evt);
        } else if (evt.which === ESC) {
            hideKeyboardHelp(evt);
        }
    };

    var trapFocus = function(evt) {
        if (evt.which === TAB) {
            evt.preventDefault();
            focusModalButton();
        }
    };

    var truncateField = function(data, fieldName){
        if (data[fieldName].length > MAX_LENGTH) {
            data[fieldName] = data[fieldName].substring(0, MAX_LENGTH);
            data['truncated'] = true;
        } else {
            data['truncated'] = false;
        }
    };

    var focusModalButton = function() {
        $root.find('.keyboard-help-dialog .modal-dismiss-button ').focus();
    };

    var showKeyboardHelp = function(evt) {
        evt.preventDefault();

        // Show dialog
        var $keyboardHelpDialog = $root.find('.keyboard-help-dialog');
        $keyboardHelpDialog.find('.modal-window-overlay').show();
        $keyboardHelpDialog.find('.modal-window').show();

        // Handle focus
        $focusedElement = $(':focus');
        focusModalButton();

        // Set up event handlers
        $(document).on('keydown', keyboardEventDispatcher);
        $keyboardHelpDialog.find('.modal-dismiss-button').on('click', hideKeyboardHelp);
    };

    var hideKeyboardHelp = function(evt) {
        evt.preventDefault();

        // Hide dialog
        var $keyboardHelpDialog = $root.find('.keyboard-help-dialog');
        $keyboardHelpDialog.find('.modal-window-overlay').hide();
        $keyboardHelpDialog.find('.modal-window').hide();

        // Handle focus
        $focusedElement.focus();

        // Remove event handlers
        $(document).off('keydown', keyboardEventDispatcher);
        $keyboardHelpDialog.find('.modal-dismiss-button').off();
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
        img.addEventListener("error", function() { promise.reject(); });
        img.src = configuration.target_img_expanded_url;
        img.alt = configuration.target_img_description;
        return promise;
    };

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
            // Generate an HTML ID value that's unique within the DOM and not containing spaces etc:
            zone.prefixed_uid = configuration.url_name + '-' + zone.uid.replace(/([^\w\-])/g, "_");
        }
    };

    /**
     * webkitFix:
     * When our draggables do not have a width specified by the author, we want them sized using
     * the following algorithm: "be as wide as possible but never wider than ~30% of the
     * background image width and never wider than the natural size of the text or image
     * that is this draggable's content." (this works well for both desktop and mobile)
     *
     * The current CSS rules to achieve this work fine for draggables in the "tray" at the top,
     * but when they are placed (position:absolute), there seems to be no way to achieve this
     * that works consistently in both Webkit and firefox. (Using display: table works in Webkit
     * but not Firefox; using the current CSS works in Firefox but not Webkit. This is due to
     * the amiguous nature of 'max-width' when refering to a parent whose width is computed from
     * the child (<div style='width: auto;'><img style='width:auto; max-width: x%;'></div>)
     *
     * This workaround simply detects the image width when any image loads, then sets the width
     * on the [grand]parent element, resolving the ambiguity.
     */
    var webkitFix = function(event) {
        var $img = $(event.target);
        var $option = $img.parent().parent();
        if (!$option.is('.option')) {
            return;
        }
        var itemId = $option.data('value');
        configuration.items.forEach(function(item) {
            if (item.id == itemId) {
                item.imgNaturalWidth = event.target.naturalWidth;
            }
        });
        setTimeout(applyState, 0); // Apply changes to the DOM after the event handling completes.
    };


    var previousFeedback = undefined;
    /**
     * Update the DOM to reflect 'state'.
     */
    var applyState = function() {
        // Has the feedback popup been closed?
        if (state.closing) {
            var data = {
                event_type: 'edx.drag_and_drop_v2.feedback.closed',
                content: previousFeedback || state.feedback,
                manually: state.manually_closed,
            };
            truncateField(data, 'content');
            publishEvent(data);
            delete state.feedback;
            delete state.closing;
        }
        // Has feedback been set?
        if (state.feedback) {
            var data = {
                event_type: 'edx.drag_and_drop_v2.feedback.opened',
                content: state.feedback,
            };
            truncateField(data, 'content');
            publishEvent(data);
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

    var isCycleKey = function(evt) {
        return !evt.ctrlKey && !evt.metaKey && evt.which === TAB;
    };

    var isCancelKey = function(evt) {
        return !evt.ctrlKey && !evt.metaKey  && evt.which === ESC;
    };

    var isActionKey = function(evt) {
        var key = evt.which;
        if (evt.ctrlKey || evt.metaKey) {
            return key === M;
        }
        return key === RET || key === SPC;
    };

    var focusNextZone = function(evt, $currentZone) {
        if (evt.shiftKey) {  // Going backward
            var isFirstZone = $currentZone.prev('.zone').length === 0;
            if (isFirstZone) {
                evt.preventDefault();
                $root.find('.target .zone').last().focus();
            }
        } else {  // Going forward
            var isLastZone = $currentZone.next('.zone').length === 0;
            if (isLastZone) {
                evt.preventDefault();
                $root.find('.target .zone').first().focus();
            }
        }
    };

    var placeItem = function($zone, $item) {
        var item_id;
        var $anchor;
        if ($item !== undefined) {
            item_id = $item.data('value');
            // Element was placed using the mouse,
            // so use relevant properties of *item* when calculating new position below.
            $anchor = $item;
        } else {
            item_id = $selectedItem.data('value');
            // Element was placed using the keyboard,
            // so use relevant properties of *zone* when calculating new position below.
            $anchor = $zone;
        }
        var zone = String($zone.data('uid'));
        var zone_id = $zone.data('zone_id');
        var zone_align = $zone.data('zone_align');
        var $target_img = $root.find('.target-img');

        // Calculate the position of the item to place relative to the image.
        var x_pos = $anchor.offset().left + ($anchor.outerWidth()/2) - $target_img.offset().left;
        var y_pos = $anchor.offset().top + ($anchor.outerHeight()/2) - $target_img.offset().top;
        var x_pos_percent = x_pos / $target_img.width() * 100;
        var y_pos_percent = y_pos / $target_img.height() * 100;

        state.items[item_id] = {
            zone: zone,
            zone_align: zone_align,
            x_percent: x_pos_percent,
            y_percent: y_pos_percent,
            submitting_location: true,
        };
        // Wrap in setTimeout to let the droppable event finish.
        setTimeout(function() {
            applyState();
            submitLocation(item_id, zone, x_pos_percent, y_pos_percent);
        }, 0);
    };

    var initDroppable = function() {
        // Set up zones for keyboard interaction
        $root.find('.zone').each(function() {
            var $zone = $(this);
            $zone.on('keydown', function(evt) {
                if (placementMode) {
                    if (isCycleKey(evt)) {
                        focusNextZone(evt, $zone);
                    } else if (isCancelKey(evt)) {
                        evt.preventDefault();
                        placementMode = false;
                        releaseItem($selectedItem);
                    } else if (isActionKey(evt)) {
                        evt.preventDefault();
                        placementMode = false;
                        placeItem($zone);
                        releaseItem($selectedItem);
                    }
                }
            });
        });

        // Make zone accept items that are dropped using the mouse
        $root.find('.zone').droppable({
            accept: '.item-bank .option',
            tolerance: 'pointer',
            drop: function(evt, ui) {
                var $zone = $(this);
                var $item = ui.helper;
                placeItem($zone, $item);
            }
        });
    };

    var initDraggable = function() {
        $root.find('.item-bank .option').not('[data-drag-disabled=true]').each(function() {
            var $item = $(this);

            // Allow item to be "picked up" using the keyboard
            $item.on('keydown', function(evt) {
                if (isActionKey(evt)) {
                    evt.preventDefault();
                    placementMode = true;
                    grabItem($item);
                    $selectedItem = $item;
                    $root.find('.target .zone').first().focus();
                }
            });

            // Make item draggable using the mouse
            try {
                $item.draggable({
                    containment: $root.find('.drag-container'),
                    cursor: 'move',
                    stack: $root.find('.item-bank .option'),
                    revert: 'invalid',
                    revertDuration: 150,
                    start: function(evt, ui) {
                        var $item = $(this);
                        grabItem($item);
                        publishEvent({
                            event_type: 'edx.drag_and_drop_v2.item.picked_up',
                            item_id: $item.data('value'),
                        });
                    },
                    stop: function(evt, ui) {
                        releaseItem($(this));
                    }
                });
            } catch (e) {
                // Initializing the draggable will fail if draggable was already
                // initialized. That's expected, ignore the exception.
            }
        });
    };

    var grabItem = function($item) {
        var item_id = $item.data('value');
        setGrabbedState(item_id, true);
        updateDOM();
    };

    var releaseItem = function($item) {
        var item_id = $item.data('value');
        setGrabbedState(item_id, false);
        updateDOM();
    };

    var setGrabbedState = function(item_id, grabbed) {
        for (var i = 0; i < configuration.items.length; i++) {
            if (configuration.items[i].id === item_id) {
                configuration.items[i].grabbed = grabbed;
            }
        }
    };

    var destroyDraggable = function() {
        $root.find('.item-bank .option[data-drag-disabled=true]').each(function() {
            var $item = $(this);

            $item.off();

            try {
                $item.draggable('destroy');
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

        $.post(url, JSON.stringify(data), 'json')
            .done(function(data){
                state.last_action_correct = data.correct_location;
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
                applyState();
            })
            .fail(function (data) {
                delete state.items[item_id];
                applyState();
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

        state.items[item_id].input = input_value;
        state.items[item_id].submitting_input = true;
        applyState();

        var url = runtime.handlerUrl(element, 'do_attempt');
        var data = {val: item_id, input: input_value};
        $.post(url, JSON.stringify(data), 'json')
            .done(function(data) {
                state.last_action_correct = data.correct;
                state.items[item_id].submitting_input = false;
                state.items[item_id].correct_input = data.correct;
                state.feedback = data.feedback;
                if (data.finished) {
                    state.finished = true;
                    state.overall_feedback = data.overall_feedback;
                }
                applyState();
            })
            .fail(function(data) {
                state.items[item_id].submitting_input = false;
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

        state.closing = true;
        previousFeedback = state.feedback;
        if (target.is(close_button)) {
            state.manually_closed = true;
        } else {
            state.manually_closed = false;
        }

        applyState();
    };

    var resetProblem = function(evt) {
        evt.preventDefault();
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
                    xhr_active: (item_user_state && item_user_state.submitting_input)
                };
                if (input.has_value && !item_user_state.submitting_input) {
                    input.class_name = item_user_state.correct_input ? 'correct' : 'incorrect';
                }
            }
            var grabbed = false;
            if (item.grabbed !== undefined) {
                grabbed = item.grabbed;
            }
            var placed = item_user_state && ('input' in item_user_state || item_user_state.correct_input);
            var itemProperties = {
                value: item.id,
                drag_disabled: Boolean(item_user_state || state.finished),
                class_name: placed || state.finished ? 'fade' : undefined,
                xhr_active: (item_user_state && item_user_state.submitting_location),
                input: input,
                displayName: item.displayName,
                imageURL: item.expandedImageURL,
                imageDescription: item.imageDescription,
                has_image: !!item.expandedImageURL,
                grabbed: grabbed,
                widthPercent: item.widthPercent, // widthPercent may be undefined (auto width)
                imgNaturalWidth: item.imgNaturalWidth,
            };
            if (item_user_state) {
                itemProperties.is_placed = true;
                itemProperties.zone = item_user_state.zone;
                itemProperties.zone_align = item_user_state.zone_align;
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
            bg_image_width: bgImgNaturalWidth, // Not stored in configuration since it's unknown on the server side
            title_html: configuration.title,
            show_title: configuration.show_title,
            problem_html: configuration.problem_text,
            show_problem_header: configuration.show_problem_header,
            target_img_src: configuration.target_img_expanded_url,
            target_img_description: configuration.target_img_description,
            display_zone_labels: configuration.display_zone_labels,
            display_zone_borders: configuration.display_zone_borders,
            zones: configuration.zones,
            items: items,
            // state - parts that can change:
            last_action_correct: state.last_action_correct,
            popup_html: state.feedback || '',
            feedback_html: $.trim(state.overall_feedback),
            display_reset_button: Object.keys(state.items).length > 0,
        };

        return DragAndDropBlock.renderView(context);
    };

    /**
     * migrateConfiguration: Apply any changes to support older versions of the configuration.
     * We have to do this in JS, not python, since some migrations depend on the image size,
     * which is not known in Python-land.
     */
    var migrateConfiguration = function(bg_image_width) {
        for (var i in configuration.items) {
            var item = configuration.items[i];
            // Convert from old-style pixel widths to new-style percentage widths:
            if (item.widthPercent === undefined && item.size && parseInt(item.size.width) > 0) {
                item.widthPercent = parseInt(item.size.width) / bg_image_width * 100;
            }
        }
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

    /**
     * markItemZoneAlign: Mark the items placed in an aligned zone with the zone
     * alignment, so they can be properly placed inside the zone.
     * We have do this in JS, not python, since zone configurations may change.
     */
    var markItemZoneAlign = function() {
        var zone_alignments = {};
        configuration.zones.forEach(function(zone) {
            if (!zone.align) zone.align = 'none';
            zone_alignments[zone.uid] = zone.align;
        });
        Object.keys(state.items).forEach(function(item_id) {
            var item = state.items[item_id];
            item.zone_align = zone_alignments[item.zone] || 'none';
        });
    };

    init();
}
