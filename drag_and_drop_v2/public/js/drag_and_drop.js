function DragAndDropTemplates(configuration) {
    "use strict";
    var h = virtualDom.h;
    // Set up a mock for gettext if it isn't available in the client runtime:
    if (!window.gettext) { window.gettext = function gettext_stub(string) { return string; }; }

    var itemSpinnerTemplate = function(item) {
        if (!item.xhr_active) {
            return null;
        }
        return (
            h("div.spinner-wrapper", {key: item.value + '-spinner'}, [
                h("i.fa.fa-spin.fa-spinner")
            ])
        );
    };

    var renderCollection = function(template, collection, ctx) {
        return collection.map(function(item) {
            return template(item, ctx);
        });
    };

    var getZone = function(zoneUID, ctx) {
        for (var i = 0; i < ctx.zones.length; i++) {
            if (ctx.zones[i].uid === zoneUID) {
                return ctx.zones[i];
            }
        }
    };

    var bankItemWidthStyles = function(item, ctx) {
        var style = {};
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
        return style;
    };

    var itemContentTemplate = function(item) {
        var item_content_html = item.displayName;
        if (item.imageURL) {
            item_content_html = '<img src="' + item.imageURL + '" alt="' + item.imageDescription + '" />';
        }
        var key = item.value + '-content';
        return h('div', { key: key, innerHTML: item_content_html, className: "item-content" });
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
        if (item.grabbed_with) {
            className += " grabbed-with-" + item.grabbed_with;
        }
        var attributes = {
            'role': 'button',
            'draggable': !item.drag_disabled,
            'aria-grabbed': item.grabbed,
            'data-value': item.value,
            'tabindex': item.focusable ? 0 : undefined
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
            var maxWidth = (item.widthPercent || 30) / 100;
            var widthPercent = zone.width_percent / 100;
            style.maxWidth = ((1 / (widthPercent / maxWidth)) * 100) + '%';
            if (item.widthPercent) {
                style.width = style.maxWidth;
            }
            // Finally, if the item is using automatic sizing and contains an image, we
            // always prefer the natural width of the image (subject to the max-width):
            if (item.imgNaturalWidth && !item.widthPercent) {
                style.width = (item.imgNaturalWidth + 22) + "px"; // 22px is for 10px padding + 1px border each side
                // ^ Hack to detect image width at runtime and make webkit consistent with Firefox
            }
        } else {
            $.extend(style, bankItemWidthStyles(item, ctx));
        }
        // Define children
        var children = [
            itemSpinnerTemplate(item)
        ];
        var item_content = itemContentTemplate(item);
        // Insert information about zone in which this item has been placed
        var item_description_id = configuration.url_name + '-item-' + item.value + '-description';
        item_content.properties.attributes = { 'aria-describedby': item_description_id };
        if (item.is_placed) {
            var zone_title = (zone.title || "Unknown Zone");  // This "Unknown" text should never be seen, so does not need i18n
            var description_content;
            if (configuration.mode === DragAndDropBlock.ASSESSMENT_MODE) {
                // In assessment mode placed items will "stick" even when not in correct zone.
                description_content = gettext('Placed in: {zone_title}').replace('{zone_title}', zone_title);
            } else {
                // In standard mode item is immediately returned back to the bank if dropped on a wrong zone,
                // so all placed items are always in the correct zone.
                description_content = gettext('Correctly placed in: {zone_title}').replace('{zone_title}', zone_title);
            }
            var item_description = h(
                'div',
                { key: item.value + '-description', id: item_description_id, className: 'sr' },
                description_content
            );
        } else {
            var item_description = h(
              'div',
              { id: item_description_id, className: 'sr'},
              gettext('Press "Enter", "Space", "Ctrl-m", or "⌘-m" on an item to select it for dropping, then navigate to the zone you want to drop it on.')
            );
        }
        children.splice(1, 0, item_description);
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

    // When an item is dragged out of the bank, a hidden placeholder of the same width and height as
    // the original item is rendered in the bank. The function of the placeholder is to take up the
    // same amount of space as the original item so that the bank does not collapse when you've dragged
    // all items out.
    var itemPlaceholderTemplate = function(item, ctx) {
        var className = "";
        if (item.has_image) {
            className += " " + "option-with-image";
        }
        if (item.widthPercent) {
            className += " specified-width";  // The author has specified a width for this item.
        }
        var style = bankItemWidthStyles(item, ctx);
        // Placeholder should never be visible.
        style.visibility = 'hidden';
        return (
            h(
                'div.option',
                {
                    key: 'placeholder-' + item.value,
                    className: className,
                    attributes: {draggable: false},
                    style: style
                },
                itemContentTemplate(item)
            )
        );
    };

    var zoneTemplate = function(zone, ctx) {
        var className = ctx.display_zone_labels ? 'zone-name' : 'zone-name sr';
        var selector = ctx.display_zone_borders ? 'div.zone.zone-with-borders' : 'div.zone';
        // If zone is aligned, mark its item alignment
        // and render its placed items as children
        var item_wrapper = 'div.item-wrapper';
        var is_item_in_zone = function(i) { return i.is_placed && (i.zone === zone.uid); };
        var items_in_zone = $.grep(ctx.items, is_item_in_zone);
        var zone_description_id = 'zone-' + zone.uid + '-description';
        if (items_in_zone.length == 0) {
          var zone_description = h(
            'div',
            { id: zone_description_id, className: 'sr'},
            gettext("No items placed here")
          );
        } else {
          var zone_description = h(
            'div',
            { id: zone_description_id, className: 'sr'},
            gettext('Items placed here: ') + items_in_zone.map(function (item) { return item.displayName; }).join(", ")
          );
        }
        if (zone.align !== 'none') {
          item_wrapper += '.item-align.item-align-' + zone.align;
          //items_in_zone = $.grep(ctx.items, is_item_in_zone);
        } else {
          items_in_zone = [];
        }
        return (
            h(
                selector,
                {
                    key: zone.prefixed_uid,
                    id: zone.prefixed_uid,
                    attributes: {
                        'tabindex': 0,
                        'dropzone': 'move',
                        'aria-dropeffect': 'move',
                        'data-uid': zone.uid,
                        'data-zone_align': zone.align,
                        'role': 'button',
                        'aria-describedby': zone_description_id,
                    },
                    style: {
                        top: zone.y_percent + '%', left: zone.x_percent + "%",
                        width: zone.width_percent + '%', height: zone.height_percent + "%",
                    }
                },
                [
                    h('p', { className: className }, zone.title),
                    h('p', { className: 'zone-description sr' }, zone.description),
                    h(item_wrapper, renderCollection(itemTemplate, items_in_zone, ctx)),
                    zone_description
                ]
            )
        );
    };

    var feedbackTemplate = function(ctx) {
        var messages = ctx.overall_feedback_messages || [];
        var feedback_display = messages.length > 0 ? 'block' : 'none';
        var feedback_messages = messages.map(function(message) {
            var selector = "p.message";
            if (message.message_class) {
                selector += "."+message.message_class;
            }
            return h(selector, {innerHTML: message.message}, []);
        });

        return (
            h('section.feedback', {}, [
                h(
                    "div.feedback-content",
                    { attributes: { 'aria-live': 'polite' } },
                    [
                        h('h3.title1', { style: { display: feedback_display } }, gettext('Feedback')),
                        h('div.messages', { style: { display: feedback_display } }, feedback_messages),
                    ]
                )
            ])
        );
    };

    var popupTemplate = function(ctx) {
        var popupSelector = 'div.popup';
        if (ctx.popup_html && !ctx.last_action_correct) {
            popupSelector += '.popup-incorrect';
        }

        return (
            h(
                "div.popup-wrapper",
                {
                    attributes: {
                        'aria-live': 'polite',
                        'aria-atomic': 'true',
                        'aria-relevant': 'additions',
                    }
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
                    )
                ]
            )
        )
    };

    var keyboardHelpPopupTemplate = function(ctx) {
        var labelledby_id = 'modal-window-title-'+configuration.url_name;
        return (
            h('div.keyboard-help-dialog', [
                h('div.modal-window-overlay'),
                h('div.modal-window', {attributes: {role: 'dialog', 'aria-labelledby': labelledby_id}}, [
                    h('div.modal-header', [
                        h('h2.modal-window-title#'+labelledby_id, gettext('Keyboard Help'))
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
        );
    };

    var submitAnswerTemplate = function(ctx) {
        var attemptsUsedId = "attempts-used-"+configuration.url_name;
        var attemptsUsedDisplay = (ctx.max_attempts && ctx.max_attempts > 0) ? 'inline': 'none';

        return (
          h("section.action-toolbar-item.submit-answer", {}, [
              h(
                  "button.btn-brand.submit-answer-button",
                  {
                      disabled: ctx.disable_submit_button || ctx.submit_spinner, 
                      attributes: {"aria-describedby": attemptsUsedId}},
                  [
                      (ctx.submit_spinner ? h("span.fa.fa-spin.fa-spinner") : null),
                      gettext("Submit")
                  ]
              ),
              h(
                  "span.attempts-used#"+attemptsUsedId, {style: {display: attemptsUsedDisplay}},
                  gettext("You have used {used} of {total} attempts.")
                      .replace("{used}", ctx.attempts).replace("{total}", ctx.max_attempts)
              )
          ])
        );
    };

    var sidebarButtonTemplate = function(buttonClass, iconClass, buttonText, disabled) {
        return (
            h('span.sidebar-button-wrapper', {}, [
                h(
                    'button.unbutton.btn-default.btn-small.'+buttonClass,
                    {disabled: disabled || false, attributes: {tabindex: 0}},
                    [
                        h("span.btn-icon.fa."+iconClass, {attributes: {"aria-hidden": true}}, []),
                        buttonText
                    ]
                )
            ])
        );
    };

    var sidebarTemplate = function(ctx) {
        return(
            h("section.action-toolbar-item.sidebar-buttons", {}, [
                sidebarButtonTemplate("keyboard-help-button", "fa-question", gettext('Keyboard Help')),
                sidebarButtonTemplate("reset-button", "fa-refresh", gettext('Reset'), ctx.disable_reset_button),
            ])
        )
    };

    var itemFeedbackPopupTemplate = function(ctx) {
        var popupSelector = 'div.popup.item-feedback-popup.popup-wrapper';
        var msgs = ctx.feedback_messages || [];
        var have_messages = msgs.length > 0;
        var popup_content;

        var close_button_describedby_id = "close-popup-"+configuration.url_name;

        if (msgs.length > 0 && !ctx.last_action_correct) {
            popupSelector += '.popup-incorrect';
        }

        if (ctx.mode == DragAndDropBlock.ASSESSMENT_MODE) {
            var content_items = [
                (!ctx.last_action_correct) ? h("p", {}, gettext("Some of your answers were not correct.")) : null,
                h("p", {}, gettext("Hints:")),
                h("ul", {}, msgs.map(function(message) {
                    return h("li", {innerHTML: message.message});
                }))
            ];
            popup_content = h("div.popup-content", {}, have_messages ? content_items : []);
        } else {
            popup_content = h("div.popup-content", {}, msgs.map(function(message) {
                return h("p", {innerHTML: message.message});
            }))
        }

        return h(
            popupSelector,
            {
                style: {display: have_messages ? 'block' : 'none'},
                attributes: {
                    "tabindex": "-1",
                    'aria-live': 'polite',
                    'aria-atomic': 'true',
                    'aria-relevant': 'additions',
                }
            },
            [
                h(
                    'button.unbutton.close-feedback-popup-button',
                    {},
                    [
                        h(
                            'span.sr',
                            {
                                innerHTML: gettext("Close item feedback popup")
                            }
                        ),
                        h(
                            'span.icon.fa.fa-times-circle',
                            {
                                attributes: {
                                    'aria-hidden': true
                                }
                            }
                        )
                    ]
                ),
                popup_content
            ]
        )
    };

    var mainTemplate = function(ctx) {
        var problemTitle = ctx.show_title ? h('h3.problem-title', {innerHTML: ctx.title_html}) : null;
        var problemHeader = ctx.show_problem_header ? h('h4.title1', gettext('Problem')) : null;

        // Render only items_in_bank and items_placed_unaligned here;
        // items placed in aligned zones will be rendered by zoneTemplate.
        var is_item_placed = function(i) { return i.is_placed; };
        var items_placed = $.grep(ctx.items, is_item_placed);
        var items_in_bank = $.grep(ctx.items, is_item_placed, true);
        var item_bank_properties = {};
        if (ctx.item_bank_focusable) {
            item_bank_properties.attributes = {
                'tabindex': 0,
                'dropzone': 'move',
                'aria-dropeffect': 'move',
                'role': 'button'
            };
        }
        return (
            h('section.themed-xblock.xblock--drag-and-drop', [
                problemTitle,
                h('section.problem', [
                    problemHeader,
                    h('p', {innerHTML: ctx.problem_html}),
                ]),
                h('section.drag-container', {}, [
                    h('div.item-bank', item_bank_properties, [
                        h('p', { className: 'zone-description sr' }, gettext('Item Bank')),
                        renderCollection(itemTemplate, items_in_bank, ctx),
                        renderCollection(itemPlaceholderTemplate, items_placed, ctx)
                    ]),
                    h('div.target',
                        {},
                        [
                            itemFeedbackPopupTemplate(ctx),
                            h('div.target-img-wrapper', [
                                h('img.target-img', {src: ctx.target_img_src, alt: ctx.target_img_description}),
                            ]
                        ),
                        renderCollection(zoneTemplate, ctx.zones, ctx)
                    ]),
                ]),
                h("section.actions-toolbar", {}, [
                    sidebarTemplate(ctx),
                    (ctx.show_submit_answer ? submitAnswerTemplate(ctx) : null),
                ]),
                keyboardHelpPopupTemplate(ctx),
                feedbackTemplate(ctx),
            ])
        );
    };

    return mainTemplate;
}

function DragAndDropBlock(runtime, element, configuration) {
    "use strict";

    DragAndDropBlock.STANDARD_MODE = 'standard';
    DragAndDropBlock.ASSESSMENT_MODE = 'assessment';

    var Selector = {
        popup_box: '.popup',
        close_button: '.popup .close-feedback-popup-button'
    };

    var renderView = DragAndDropTemplates(configuration);

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

    var DEFAULT_ZONE_ALIGN = 'center';

    // Keyboard accessibility
    var ESC = 27;
    var RET = 13;
    var SPC = 32;
    var TAB = 9;
    var M = 77;

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
            migrateState();
            markItemZoneAlign();
            bgImgNaturalWidth = bgImg.width;

            // Set up event handlers:

            $element.on('click', '.item-feedback-popup .close-feedback-popup-button', closePopupEventHandler);
            $element.on('click', '.submit-answer-button', doAttempt);
            $element.on('click', '.keyboard-help-button', showKeyboardHelp);
            $element.on('keydown', '.keyboard-help-button', function(evt) {
                runOnKey(evt, RET, showKeyboardHelp);
            });
            $element.on('click', '.reset-button', resetProblem);
            $element.on('keydown', '.reset-button', function(evt) {
                runOnKey(evt, RET, resetProblem);
            });

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
    var applyState = function(keepDraggableInit) {
        sendFeedbackPopupEvents();
        updateDOM();
        if (!keepDraggableInit) {
            destroyDraggable();
            if (!state.finished) {
                initDraggable();
            }
        }
    };

    var sendFeedbackPopupEvents = function() {
        // Has the feedback popup been closed?
        if (state.closing) {
            var data = {
                event_type: 'edx.drag_and_drop_v2.feedback.closed',
                content: concatenateFeedback(previousFeedback || state.feedback),
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
                content: concatenateFeedback(state.feedback),
            };
            truncateField(data, 'content');
            publishEvent(data);
        }
    };

    var concatenateFeedback = function (feedback_msgs_list) {
        return feedback_msgs_list.map(function(message) { return message.message; }).join('\n');
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

    var isSpaceKey = function(evt) {
        var key = evt.which;
        return key === SPC;
    };

    var focusNextZone = function(evt, $currentZone) {
        var zones = $root.find('.target .zone').toArray();
        // In assessment mode, item bank is a valid drop zone
        if (configuration.mode === DragAndDropBlock.ASSESSMENT_MODE) {
            zones.push($root.find('.item-bank')[0]);
        }
        var idx = zones.indexOf($currentZone[0]);
        if (evt.shiftKey) {  // Going backward
            idx--;
            if (idx < 0) {
                idx = zones.length - 1;
            }
        } else {  // Going forward
            idx++;
            if (idx > zones.length - 1) {
                idx = 0;
            }
        }
        evt.preventDefault();
        zones[idx].focus();
    };

    var focusFirstDraggable = function() {
        $root.find('.item-bank .option').first().focus();
    };

    var focusItemFeedbackPopup = function() {
        var popup = $root.find('.item-feedback-popup');
        if (popup.length && popup.is(":visible")) {
            popup.focus();
            return true;
        }
        return false;
    };

    var placeItem = function($zone, $item) {
        var item_id;
        if ($item !== undefined) {
            item_id = $item.data('value');
        } else {
            item_id = $selectedItem.data('value');
        }

        var zone = String($zone.data('uid'));
        var zone_align = $zone.data('zone_align');

        var items_in_zone_count = countItemsInZone(zone, [item_id.toString()]);
        if (configuration.max_items_per_zone && configuration.max_items_per_zone <= items_in_zone_count) {
            state.last_action_correct = false;
            state.feedback = [{message: gettext("You cannot add any more items to this zone."), message_class: null}];
            applyState();
            return;
        }

        state.items[item_id] = {
            zone: zone,
            zone_align: zone_align,
            submitting_location: true,
        };

        // Wrap in setTimeout to let the droppable event finish.
        setTimeout(function() {
            applyState();
            submitLocation(item_id, zone);
        }, 0);
    };

    var countItemsInZone = function(zone, exclude_ids) {
        var ids_to_exclude = exclude_ids ? exclude_ids : [];
        return Object.keys(state.items).filter(function(item_id) {
            return state.items[item_id].zone === zone && $.inArray(item_id, ids_to_exclude) === -1;
        }).length;
    };

    var initDroppable = function() {
        // Set up zones for keyboard interaction
        $root.find('.zone, .item-bank').each(function() {
            var $zone = $(this);
            $zone.on('keydown', function(evt) {
                if (state.keyboard_placement_mode) {
                    if (isCycleKey(evt)) {
                        focusNextZone(evt, $zone);
                    } else if (isCancelKey(evt)) {
                        evt.preventDefault();
                        state.keyboard_placement_mode = false;
                        releaseItem($selectedItem);
                    } else if (isActionKey(evt)) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        state.keyboard_placement_mode = false;
                        releaseItem($selectedItem);
                        if ($zone.is('.item-bank')) {
                            delete state.items[$selectedItem.data('value')];
                            applyState();
                        } else {
                            placeItem($zone);
                        }
                    }
                } else if (isSpaceKey(evt)) {
                  // Pressing the space bar moves the page down by default in most browsers.
                  // That can be distracting while moving items with the keyboard, so prevent
                  // the default scroll from happening while a zone is focused.
                  evt.preventDefault();
                }
            });
        });

        // Make zones accept items that are dropped using the mouse
        $root.find('.zone').droppable({
            accept: '.drag-container .option',
            tolerance: 'pointer',
            drop: function(evt, ui) {
                var $zone = $(this);
                var $item = ui.helper;
                placeItem($zone, $item);
            }
        });

        if (configuration.mode === DragAndDropBlock.ASSESSMENT_MODE) {
            // Make item bank accept items that are returned to the bank using the mouse
            $root.find('.item-bank').droppable({
                accept: '.target .option',
                tolerance: 'pointer',
                drop: function(evt, ui) {
                    var $item = ui.helper;
                    var item_id = $item.data('value');
                    releaseItem($item);
                    delete state.items[item_id];
                    applyState();
                }
            });
        }
    };

    var initDraggable = function() {
        $root.find('.drag-container .option[draggable=true]').each(function() {
            var $item = $(this);

            // Allow item to be "picked up" using the keyboard
            $item.on('keydown', function(evt) {
                if (isActionKey(evt)) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    state.keyboard_placement_mode = true;
                    grabItem($item, 'keyboard');
                    $selectedItem = $item;
                    $root.find('.target .zone').first().focus();
                }
            });

            // Make item draggable using the mouse
            try {
                $item.draggable({
                    addClasses: false,  // don't add ui-draggable-* classes as they don't play well with virtual DOM.
                    containment: $root.find('.drag-container'),
                    cursor: 'move',
                    stack: $root.find('.drag-container .option'),
                    revert: 'invalid',
                    revertDuration: 150,
                    start: function(evt, ui) {
                        var $item = $(this);
                        // Store initial position of dragged item to be able to revert back to it on cancelled drag
                        // (when user drops the item onto an area that is not a droppable zone).
                        // The jQuery UI draggable library usually knows how to revert correctly, but our dropped items
                        // have a translation transform that confuses jQuery UI draggable, so we "help" it do the right
                        // thing by manually storing the initial position and resetting it in the 'stop' handler below.
                        $item.data('initial-position', {
                            left: $item.css('left'),
                            top: $item.css('top')
                        });
                        grabItem($item, 'mouse');
                        publishEvent({
                            event_type: 'edx.drag_and_drop_v2.item.picked_up',
                            item_id: $item.data('value'),
                        });
                    },
                    stop: function(evt, ui) {
                        // Revert to original position.
                        $item.css($item.data('initial-position'));
                        releaseItem($(this));
                    }
                });
            } catch (e) {
                // Initializing the draggable will fail if draggable was already
                // initialized. That's expected, ignore the exception.
            }
        });
    };

    var grabItem = function($item, interaction_type) {
        var item_id = $item.data('value');
        setGrabbedState(item_id, true, interaction_type);
        closePopup(false);
        // applyState(true) skips destroying and initializing draggable
        applyState(true);
    };

    var releaseItem = function($item) {
        var item_id = $item.data('value');
        setGrabbedState(item_id, false);
        // applyState(true) skips destroying and initializing draggable
        applyState(true);
    };

    var setGrabbedState = function(item_id, grabbed, interaction_type) {
        configuration.items.forEach(function(item) {
            if (item.id === item_id) {
                if (grabbed) {
                    item.grabbed = true;
                    item.grabbed_with = interaction_type;
                } else {
                    item.grabbed = false;
                    delete item.grabbed_with;
                }
            }
        });
    };

    var destroyDraggable = function() {
        $root.find('.drag-container .option[draggable=false]').each(function() {
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

    var submitLocation = function(item_id, zone) {
        if (!zone) {
            return;
        }
        var url = runtime.handlerUrl(element, 'drop_item');
        var data = {
            val: item_id,
            zone: zone
        };

        $.post(url, JSON.stringify(data), 'json')
            .done(function(data){
                state.items[item_id].submitting_location = false;
                // In standard mode we immediately return item to the bank if dropped on wrong zone.
                // In assessment mode we leave it in the chosen zone until explicit answer submission.
                if (configuration.mode === DragAndDropBlock.STANDARD_MODE) {
                    state.last_action_correct = data.correct;
                    state.feedback = data.feedback;
                    if (!data.correct) {
                        delete state.items[item_id];
                    }
                    if (data.finished) {
                        state.finished = true;
                        state.overall_feedback = data.overall_feedback;
                    }
                }
                applyState();
            })
            .fail(function (data) {
                delete state.items[item_id];
                applyState();
            });
    };

    var closePopupEventHandler = function(evt) {
        if (!state.feedback) {
            return;
        }

        var target = $(evt.target);

        if (target.is(Selector.popup_box)) {
            return;
        }
        if (target.parents(Selector.popup_box).length && !target.parent().is(Selector.close_button) && !target.is(Selector.close_button)) {
            return;
        }

        closePopup(target.is(Selector.close_button) || target.parent().is(Selector.close_button));
        applyState();
    };

    var closePopup = function(manually_closed) {
        // do not apply state here - callers are responsible to call it when other appropriate state changes are applied
        if ($root.find(Selector.popup_box).is(":visible")) {
            state.closing = true;
            previousFeedback = state.feedback;
            state.manually_closed = manually_closed;
        }
    };

    var resetProblem = function(evt) {
        evt.preventDefault();
        $.ajax({
            type: 'POST',
            url: runtime.handlerUrl(element, 'reset'),
            data: '{}',
        }).done(function(data) {
            state = data;
            applyState();
            focusFirstDraggable();
        });
    };

    var doAttempt = function(evt) {
        evt.preventDefault();
        state.submit_spinner = true;
        applyState();

        $.ajax({
            type: 'POST',
            url: runtime.handlerUrl(element, "do_attempt"),
            data: '{}'
        }).done(function(data){
            state.attempts = data.attempts;
            state.feedback = data.feedback;
            state.overall_feedback = data.overall_feedback;
            state.last_action_correct = data.correct;

            if (attemptsRemain()) {
                data.misplaced_items.forEach(function(misplaced_item_id) {
                    delete state.items[misplaced_item_id]
                });
            } else {
                state.finished = true;
            }
        }).always(function() {
            state.submit_spinner = false;
            applyState();
            focusItemFeedbackPopup() || focusFirstDraggable();
        });
    };

    var canSubmitAttempt = function() {
        return Object.keys(state.items).length > 0 && attemptsRemain() && !submittingLocation();
    };

    var canReset = function() {
        var any_items_placed = false;
        // Now set any_items_placed to true if any items have been successfully placed on the board.
        // Exclude just-dropped items that are making an AJAX call to the server, or else screen readers
        // will read out "Reset problem" instead of the contents of the correct popup.
        for (var key in state.items) {
            if (state.items.hasOwnProperty(key)) {
                if (!state.items[key].submitting_location) {
                    any_items_placed = true;
                    break;
                }
            }
        }
        return any_items_placed && (configuration.mode !== DragAndDropBlock.ASSESSMENT_MODE || attemptsRemain());
    };

    var attemptsRemain = function() {
        return !configuration.max_attempts || configuration.max_attempts > state.attempts;
    };

    var submittingLocation = function() {
        var result = false;
        Object.keys(state.items).forEach(function(item_id) {
            var item = state.items[item_id];
            result = result || item.submitting_location;
        });
        return result;
    }

    var render = function() {
        var items = configuration.items.map(function(item) {
            var item_user_state = state.items[item.id];
            var grabbed = false;
            if (item.grabbed !== undefined) {
                grabbed = item.grabbed;
            }
            var drag_disabled;
            // In standard mode items placed in correct zone are no longer draggable.
            // In assessment mode items are draggable and can be moved between zones
            // until user explicitly submits the problem.
            if (configuration.mode === DragAndDropBlock.STANDARD_MODE) {
                drag_disabled = Boolean(state.finished || item_user_state);
            } else {
                drag_disabled = Boolean(state.finished);
            }
            var itemProperties = {
                value: item.id,
                drag_disabled: drag_disabled,
                focusable: !drag_disabled,
                class_name: drag_disabled ? 'fade' : undefined,
                xhr_active: (item_user_state && item_user_state.submitting_location),
                displayName: item.displayName,
                imageURL: item.expandedImageURL,
                imageDescription: item.imageDescription,
                has_image: !!item.expandedImageURL,
                grabbed: grabbed,
                grabbed_with: item.grabbed_with,
                is_placed: Boolean(item_user_state),
                widthPercent: item.widthPercent, // widthPercent may be undefined (auto width)
                imgNaturalWidth: item.imgNaturalWidth,
            };
            if (item_user_state) {
                itemProperties.zone = item_user_state.zone;
                itemProperties.zone_align = item_user_state.zone_align;
            }
            if (configuration.item_background_color) {
                itemProperties.background_color = configuration.item_background_color;
            }
            if (configuration.item_text_color) {
                itemProperties.color = configuration.item_text_color;
            }
            return itemProperties;
        });

        // In assessment mode, it is possible to move items back to the bank, so the bank should be able to
        // gain focus while keyboard placement is in progress.
        var item_bank_focusable = state.keyboard_placement_mode &&
                configuration.mode === DragAndDropBlock.ASSESSMENT_MODE;

        var context = {
            // configuration - parts that never change:
            bg_image_width: bgImgNaturalWidth, // Not stored in configuration since it's unknown on the server side
            title_html: configuration.title,
            show_title: configuration.show_title,
            mode: configuration.mode,
            max_attempts: configuration.max_attempts,
            problem_html: configuration.problem_text,
            show_problem_header: configuration.show_problem_header,
            show_submit_answer: configuration.mode == DragAndDropBlock.ASSESSMENT_MODE,
            target_img_src: configuration.target_img_expanded_url,
            target_img_description: configuration.target_img_description,
            display_zone_labels: configuration.display_zone_labels,
            display_zone_borders: configuration.display_zone_borders,
            zones: configuration.zones,
            items: items,
            // state - parts that can change:
            attempts: state.attempts,
            last_action_correct: state.last_action_correct,
            item_bank_focusable: item_bank_focusable,
            feedback_messages: state.feedback,
            overall_feedback_messages: state.overall_feedback,
            disable_reset_button: !canReset(),
            disable_submit_button: !canSubmitAttempt(),
            submit_spinner: state.submit_spinner
        };

        return renderView(context);
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
     * Most migrations are applied in python, but migrations may depend on the image size,
     * which is not known in Python-land.
     */
    var migrateState = function() {
        // JS migrations were squashed down to "do nothing", but decided to keep the method
        // to give a hint to future developers that migrations can be applied in JS
    };

    /**
     * markItemZoneAlign: Mark the items placed in an aligned zone with the zone
     * alignment, so they can be properly placed inside the zone.
     * We have do this in JS, not python, since zone configurations may change.
     */
    var markItemZoneAlign = function() {
        var zone_alignments = {};
        configuration.zones.forEach(function(zone) {
            if (!zone.align) zone.align = DEFAULT_ZONE_ALIGN;
            zone_alignments[zone.uid] = zone.align;
        });
        Object.keys(state.items).forEach(function(item_id) {
            var item = state.items[item_id];
            item.zone_align = zone_alignments[item.zone] || DEFAULT_ZONE_ALIGN;
        });
    };

    init();
}
