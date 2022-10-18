function DragAndDropTemplates(configuration) {
    "use strict";

    var gettext;
    var ngettext;
    if ('DragAndDropI18N' in window) {
        // Use DnDv2's local translations
        gettext = function(string) {
            var translated = window.DragAndDropI18N.gettext(string);
            // if DnDv2's translation is the same as the input, check if global has a different value
            // This is useful for overriding the XBlock's string by themes (only for English)
            if (string === translated && 'gettext' in window) {
                translated = window.gettext(string);
            }
            return translated;
        };
        ngettext = function(strA, strB, n) {
            var translated = window.DragAndDropI18N.ngettext(strA, strB, n);
            var string = n == 1 ? strA : strB;
            if (string === translated && 'gettext' in window) {
                translated = window.gettext(strA, strB, n);
            }
            return translated;
        };
    } else if ('gettext' in window) {
        // Use edxapp's global translations
        gettext = window.gettext;
        ngettext = window.ngettext;
    }
    if (typeof gettext == "undefined") {
        // No translations -- used by test environment
        gettext = function(string) { return string; };
        ngettext = function(strA, strB, n) { return n == 1 ? strA : strB; };
    }
    var h = virtualDom.h;

    var isMobileScreen = function() {
        return window.matchMedia('screen and (max-width: 480px)').matches;
    };

    var itemSpinnerTemplate = function(item) {
        if (!item.xhr_active) {
            return null;
        }
        return (
            h("div.spinner-wrapper", {key: item.value + '-spinner'}, [
                h("span.fa.fa-spin.fa-spinner", {attributes: {'aria-hidden': true}}),
                h("span.sr", gettext('Submitting'))
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
            // convert it to pixels. But if the browser window is not as wide as the image,
            // then the background image will be scaled down and this pixel value would be too large,
            // so we also specify it as a max-width percentage.
            // On mobile, the image is never scaled down, so we don't specify the max-width.
            style.width = (item.widthPercent / 100 * ctx.bg_image_width) + "px";
            style.maxWidth = isMobileScreen() ? 'none' : item.widthPercent + "%";
        }
        return style;
    };

    var itemContentTemplate = function(item) {
        var item_content_html = gettext(item.displayName);
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
        var attributes = {
            'role': 'button',
            'draggable': !item.drag_disabled,
            'aria-grabbed': item.grabbed,
            'data-value': item.value,
            'tabindex': item.focusable ? 0 : undefined,
            'aria-live': 'polite'
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
        if (item.is_dragged) {
            style.position = 'absolute';
            var left = Math.max(0, Math.min(item.max_left, item.drag_position.left));
            var top = Math.max(0, Math.min(item.max_top, item.drag_position.top));
            style.left = left + 'px';
            style.top = top + 'px';
        }
        if (item.is_placed) {
            var maxWidth = (item.widthPercent || 30) / 100;
            var widthPercent = zone.width_percent / 100;
            var possiblemaxWidth = ((1 / (widthPercent / maxWidth)) * 100);
            style.maxWidth = (possiblemaxWidth < 100) ? possiblemaxWidth + '%' : '100%';
            if (item.widthPercent) {
                style.width = style.maxWidth;
            }
            // Finally, if the item is using automatic sizing and contains an image, we
            // always prefer the natural width of the image (subject to the max-width):
            if (item.imgNaturalWidth && !item.widthPercent && !item.noPadding) {
                style.width = (item.imgNaturalWidth + 22) + "px"; // 22px is for 10px padding + 1px border each side
                // ^ Hack to detect image width at runtime and make webkit consistent with Firefox
            }
            if (item.noPadding) {
                style.width = item.imgNaturalWidth + "px";
                style.padding = '0';
            }
        } else {
            $.extend(style, bankItemWidthStyles(item, ctx));
        }
        if (item.grabbed_with) {
            className += " grabbed-with-" + item.grabbed_with;
            // Clear width and maxWidth styles and use the bankItemWidthStyles
            // This prevents inconsistency in width for grabbed items
            delete style.width
            delete style.maxWidth
            $.extend(style, bankItemWidthStyles(item, ctx));
        }
        // Define children

        var item_content = itemContentTemplate(item);
        var item_description = null;
        // Insert information about zone in which this item has been placed

        if (item.is_placed) {
            var zone_title = (gettext(zone.title) || gettext("Unknown Zone"));
            var description_content;
            if (configuration.mode === DragAndDropBlock.ASSESSMENT_MODE && !ctx.showing_answer) {
                // In assessment mode placed items will "stick" even when not in correct zone.
                description_content = gettext('Placed in: {zone_title}').replace('{zone_title}', zone_title);
            } else {
                // In standard mode item is immediately returned back to the bank if dropped on a wrong zone,
                // so all placed items are always in the correct zone.
                description_content = gettext('Correctly placed in: {zone_title}').replace('{zone_title}', zone_title);
            }
            var item_description_id = configuration.url_name + '-item-' + item.value + '-description';
            item_content.properties.attributes = { 'aria-describedby': item_description_id };
            item_description = h(
                'div.sr.description',
                { key: item_description_id, id: item_description_id},
                description_content
            );
        }
        var itemSRNote = h(
            'span.sr.draggable',
            (item.grabbed) ? gettext(", draggable, grabbed") : gettext(", draggable")
        );

        var children = [
            itemSpinnerTemplate(item), item_content, itemSRNote, item_description
        ];

        // Unique key for virtual dom change tracking. Key must be different for
        // Placed vs Dragged vs Unplaced, or weird bugs can occur.
        var key = item.value;
        if (item.is_placed && item.is_dragged) {
            key += '-pd';
        } else if (item.is_placed) {
            key += '-p';
        } else if (item.is_dragged) {
            key += '-d';
        } else {
            key += '-u';
        }

        return (
            h(
                'div.option',
                {
                    key: key,
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
        // Mark item alignment and render its placed items as children
        var item_wrapper = 'div.item-wrapper.item-align.item-align-' + zone.align;
        // In assessment mode already placed items can be dragged out of their current zone.
        // Only render placed items that are not currently being dragged out of the zone.
        var is_item_in_zone = function(i) { return i.is_placed && !i.is_dragged && (i.zone === zone.uid); };
        var items_in_zone = $.grep(ctx.items, is_item_in_zone);
        var zone_description_id = zone.prefixed_uid + '-description';
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
                    h(
                        'p',
                        {
                            className: className,
                            innerHTML: gettext(zone.title)
                        },
                        [
                            h('span.sr', gettext(', dropzone'))
                        ]
                    ),
                    h('p', { className: 'zone-description sr' }, gettext(zone.description) || gettext('droppable')),
                    h(item_wrapper, renderCollection(itemTemplate, items_in_zone, ctx)),
                    gettext(zone_description)
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
            return h(selector, {innerHTML: gettext(message.message)}, []);
        });

        return (
            h('div.feedback', {
                attributes: {'role': 'group', 'aria-label': gettext('Feedback')},
                style: { display: feedback_display }
            }, [
                h('div.feedback-content',[
                    h('h3.title1', gettext('Feedback')),
                    h('div.messages', gettext(feedback_messages)),
                ])
            ])
        );
    };

    var explanationTemplate = function (ctx) {
        var explanation_display = ctx.explanation ? 'block' : 'none';
        return (
            h('.solution-span', {
                attributes: {'aria-label': gettext('Explanation')},
                style: {display: explanation_display}
            }, [
                h('span', [
                    h('.detailed-solution', [
                        h('p', gettext('Explanation')),
                        h('p', {innerHTML: gettext(ctx.explanation)}),
                    ])
                ])
            ])
        );
    };

    var keyboardHelpPopupTemplate = function(ctx) {
        var labelledby_id = 'modal-window-title-'+configuration.url_name;
        return (
            h('div.keyboard-help-dialog', [
                h('div.modal-window-overlay'),
                h('div.modal-window', {attributes: {role: 'dialog', 'aria-labelledby': labelledby_id, tabindex: -1}}, [
                    h('button.modal-dismiss-button.unbutton', [
                        h('span.fa.fa-remove', {attributes: {'aria-hidden': true}}),
                        h('span.sr', gettext('Close'))
                    ]),
                    h('div.modal-header', [
                        h('h2.modal-window-title', {id: labelledby_id}, gettext('Keyboard Help'))
                    ]),
                    h('div.modal-content', [
                        h('p.sr', gettext('This is a screen reader-friendly problem.')),
                        h('p.sr', gettext('Drag and Drop problems consist of draggable items and dropzones. Users should select a draggable item with their keyboard and then navigate to an appropriate dropzone to drop it.')),
                        h('p', gettext('You can complete this problem using only your keyboard by following the guidance below:')),
                        h('ul', [
                            h('li', gettext('Use only TAB and SHIFT+TAB to navigate between draggable items and drop zones.')),
                            h('li', gettext('Press CTRL+M to select a draggable item (effectively picking it up).')),
                            h('li', gettext('Navigate using TAB and SHIFT+TAB to the appropriate dropzone and press CTRL+M once more to drop it here.')),
                            h('li', gettext('Press ESC if you want to cancel the drop operation (for example, to select a different item).')),
                            h('li', gettext('TAB back to the list of draggable items and repeat this process until all of the draggable items have been placed on their respective dropzones.')),
                        ])
                    ])
                ])
            ])
        );
    };

    var submitAnswerTemplate = function(ctx) {
        var submitButtonProperties = {
            disabled: ctx.disable_submit_button || ctx.submit_spinner,
            attributes: {}
        };

        var attemptsUsedInfo = null;
        if (ctx.max_attempts && ctx.max_attempts > 0) {
            var attemptsUsedId = "attempts-used-" + configuration.url_name;
            submitButtonProperties.attributes["aria-describedby"] = attemptsUsedId;
            var attemptsUsedTemplate = gettext("You have used {used} of {total} attempts.");
            var attemptsUsedText = attemptsUsedTemplate.
                replace("{used}", ctx.attempts).replace("{total}", ctx.max_attempts);
            attemptsUsedInfo = h("div.submission-feedback", {id: attemptsUsedId}, attemptsUsedText);
        }

        var submitSpinner = null;
        if (ctx.submit_spinner) {
            submitSpinner = h('span', [
                h('span.fa.fa-spin.fa-spinner', {attributes: {'aria-hidden': true}}),
                h('span.sr', gettext('Submitting'))
            ]);
        }

        return (
            h("div.submit-attempt-container", {}, [
                h(
                    "button.btn-brand.submit",
                    submitButtonProperties,
                    [
                        h("span.submit-label", [
                            submitSpinner,
                            ' ',  // whitespace between spinner icon and text
                            gettext("Submit")
                        ])
                    ]
                ),
                attemptsUsedInfo
            ])
        );
    };

    var sidebarButtonTemplate = function(buttonClass, iconClass, buttonText, options) {
        options = options || {};
        if (options.spinner) {
            iconClass = 'fa-spin fa-spinner';
        }
        return (
            h('span.problem-action-button-wrapper', {}, [
                h(
                    'button.problem-action-btn.btn-default.btn-small',
                    {
                        className: buttonClass,
                        disabled: options.disabled || options.spinner || false
                    },
                    [
                        h("span.btn-icon.fa", {className: iconClass, attributes: {"aria-hidden": true}}),
                        buttonText
                    ]
                )
            ])
        );
    };

    var sidebarTemplate = function(ctx) {
        var showAnswerButton = null;
        if (ctx.show_show_answer) {
            var options = {
                disabled: !!ctx.showing_answer,
                spinner: ctx.show_answer_spinner
            };
            showAnswerButton = sidebarButtonTemplate(
                "show",
                "fa-info-circle",
                gettext('Show Answer'),
                options
            );
        }
        var go_to_beginning_button_class = 'go-to-beginning-button';
        if (!ctx.show_go_to_beginning_button) {
            go_to_beginning_button_class += ' sr';
        }
        return(
            h("div.problem-action-buttons-wrapper", {attributes: {'role': 'group', 'aria-label': gettext('Actions')}}, [
                sidebarButtonTemplate(
                    go_to_beginning_button_class,
                    "fa-arrow-up",
                    gettext("Go to Beginning"),
                    {disabled: ctx.disable_go_to_beginning_button}
                ),
                sidebarButtonTemplate(
                    "reset",
                    "fa-refresh",
                    gettext('Reset'),
                    {disabled: ctx.disable_reset_button}
                ),
                showAnswerButton,
            ])
        )
    };

    var itemFeedbackPopupTemplate = function(ctx) {
        var popupSelector = 'div.popup.item-feedback-popup.popup-wrapper';
        var msgs = ctx.feedback_messages || [];
        var have_messages = msgs.length > 0;
        var popup_content;

        if (msgs.length > 0 && !ctx.last_action_correct) {
            popupSelector += '.popup-incorrect';
        }

        if (ctx.mode == DragAndDropBlock.ASSESSMENT_MODE) {
            var content_items;
            // Check if we are dealing with feedback of limit of items in a zone
            var limit_popup = msgs.reduce(
                (previous, actualMessage) => previous || actualMessage.message_class === DragAndDropBlock.FEEDBACK_CLASS_ZONE_LIMIT,
                false
            );

            if (limit_popup) {
                content_items = [
                    msgs.map(function(message) {
                        return h("p", {innerHTML: gettext(message.message)});
                    })
                ];
            } else {
                content_items = [
                    (!ctx.last_action_correct) ? h("p", {}, gettext("Some of your answers were not correct.")) : null,
                    h("p.hints", {}, gettext("Hints:")),
                    h("ul", {}, msgs.map(function(message) {
                        return h("li", {innerHTML: gettext(message.message)});
                    }))
                ];
            }

            popup_content = h(
                ctx.last_action_correct ? "div.popup-content" : "div.popup-content.popup-content-incorrect",
                {},
                have_messages ? content_items : []
            );
        } else {
            popup_content = h(
                ctx.last_action_correct ? "div.popup-content" : "div.popup-content.popup-content-incorrect",
                {},
                msgs.map(function(message) {
                    return h("p", {innerHTML: gettext(message.message)});
                })
            );
        }

        var popup_style = {};
        if (!have_messages) {
            popup_style.display = 'none';
        }

        return h(
            popupSelector,
            {
                style: popup_style
            },
            [
                h(
                    'button.unbutton.close-feedback-popup-button.close-feedback-popup-desktop-button',
                    {},
                    [
                        h(
                            'span.sr',
                            {
                                innerHTML: gettext("Close")
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
                h(
                    ctx.last_action_correct ? 'div.popup-header-icon' : 'div.popup-header-icon.popup-header-icon-incorrect',
                    {},
                    [
                        h(
                            ctx.last_action_correct ? 'span.icon.fa.fa-check-circle' : 'span.icon.fa.fa-exclamation-circle',
                            {
                                attributes: {
                                    'aria-hidden': true
                                }
                            }
                        )
                    ]
                ),
                h(
                    'div.popup-header-text',
                    {},
                    ctx.last_action_correct ? gettext("Correct") : gettext("Incorrect")
                ),
                popup_content
            ]
        )
    };

    var forwardKeyboardHelpButtonTemplate = function(ctx) {
        return h(
            'button.unbutton.btn-link.keyboard-help-button',
            [
                h(
                    "span.btn-icon.fa.fa-keyboard-o",
                    {attributes: {"aria-hidden": true}}
                ),
                // appending space is the simplest way to avoid sticking text to the button, but also to have
                // them underlined together on hover. When margin was used there was a gap in underlining
                " ",
                gettext('Keyboard Help')
            ]
        );
    };

    var progressTemplate = function(ctx) {
        // Formats a number to 4 decimals without trailing zeros
        // (1.00 -> '1'; 1.50 -> '1.5'; 1.333333333 -> '1.3333').
        var formatNumber = function(n) { return n.toFixed(4).replace(/\.?0+$/, ''); };
        var is_graded = ctx.graded && ctx.weighted_max_score > 0;
        var progress_template;
        if (ctx.grade !== null && ctx.weighted_max_score > 0) {
            if (is_graded) {
                progress_template = ngettext(
                    // Translators: {earned} is the number of points earned. {possible} is the total number of points (examples: 0/1, 1/1, 2/3, 5/10). The total number of points will always be at least 1. We pluralize based on the total number of points (example: 0/1 point; 1/2 points).
                    '{earned}/{possible} point (graded)',
                    '{earned}/{possible} points (graded)',
                    ctx.weighted_max_score
                );
            } else {
                progress_template = ngettext(
                    // Translators: {earned} is the number of points earned. {possible} is the total number of points (examples: 0/1, 1/1, 2/3, 5/10). The total number of points will always be at least 1. We pluralize based on the total number of points (example: 0/1 point; 1/2 points).
                    '{earned}/{possible} point (ungraded)',
                    '{earned}/{possible} points (ungraded)',
                    ctx.weighted_max_score
                );
            }
            progress_template = progress_template.replace('{earned}', formatNumber(ctx.grade));
        } else {
            if (is_graded) {
                progress_template = ngettext(
                    // Translators: {possible} is the number of points possible (examples: 1, 3, 10).
                    '{possible} point possible (graded)',
                    '{possible} points possible (graded)',
                    ctx.weighted_max_score
                );
            } else {
                progress_template = ngettext(
                    // Translators: {possible} is the number of points possible (examples: 1, 3, 10).
                    '{possible} point possible (ungraded)',
                    '{possible} points possible (ungraded)',
                    ctx.weighted_max_score
                );
            }
        }
        var progress_text = progress_template.replace('{possible}', formatNumber(ctx.weighted_max_score));
        return h('div.problem-progress', {
            id: configuration.url_name + '-problem-progress',
            attributes: {role: 'status'}
        }, progress_text);
    };

    var mainTemplate = function(ctx) {
        var main_element_properties = {attributes: {role: 'group'}};
        var problemProgress = progressTemplate(ctx);
        var problemTitle = null;
        if (ctx.show_title) {
            var problem_title_id = configuration.url_name + '-problem-title';
            problemTitle = h('h3.hd.hd-3.problem-header', {
                id: problem_title_id,
                innerHTML: gettext(ctx.title_html),
                attributes: {'aria-describedby': problemProgress.properties.id}
            });
            main_element_properties.attributes['arial-labelledby'] = problem_title_id;
        } else {
            main_element_properties.attributes['aria-label'] = gettext('Drag and Drop Problem');
        }
        var problemHeader = ctx.show_problem_header ? h('h4.title1', gettext('Problem')) : null;
        // Render only items in the bank here, including placeholders.  Placed
        // items will be rendered by zoneTemplate.
        var items_in_bank = [];
        var items_dragged = [];
        var items_placed = [];
        ctx.items.forEach(function(item) {
            if (item.is_dragged) {
                items_dragged.push(item);
                // Dragged items require a placeholder in the bank.
                // In assessment mode, already placed items can be dragged.
                if (item.is_placed) {
                    items_placed.push(item)
                } else {
                    items_in_bank.push(item);
                }
            } else if (item.is_placed) {
                items_placed.push(item);
            } else {
                items_in_bank.push(item);
            }
        });
        var item_bank_properties = {
            attributes: {
                'role': 'group',
                'aria-label': gettext('Item Bank')
            }
        };
        if (ctx.item_bank_focusable) {
            item_bank_properties.attributes['tabindex'] = 0;
            item_bank_properties.attributes['dropzone'] = 'move';
            item_bank_properties.attributes['aria-dropeffect'] = 'move';
            item_bank_properties.attributes['role'] = 'button';
        }
        // Render items in the bank. If the item is currently being dragged, it should be
        // rendered as a placeholder. All already placed items should also be rendered as
        // placedholders (as the last content in the bank) to maintain original bank dimensions.
        var bank_children = [];
        items_in_bank.forEach(function(item) {
            if (item.is_dragged) {
                bank_children.push(itemPlaceholderTemplate(item, ctx));
            } else {
                bank_children.push(itemTemplate(item, ctx));
            }
        });
        bank_children = bank_children.concat(renderCollection(itemPlaceholderTemplate, items_placed, ctx));
        var drag_container_style = {};
        var target_img_style = {};
        // If drag_container_max_width is null, we are going to measure the container width after this render.
        // To be able to accurately measure the natural container width, we have to set max-width of the target
        // image to 100%, so that it doesn't expand the container.
        if (ctx.drag_container_max_width === null) {
            target_img_style.maxWidth = '100%';
            item_bank_properties.style = {display: 'none'};
        } else {
            drag_container_style.maxWidth = ctx.drag_container_max_width + 'px';
        }
        return (
            h('div.themed-xblock.xblock--drag-and-drop', main_element_properties, [
                h('object.resize-detector', {
                    attributes: {type: 'text/html', tabindex: -1, data: 'about:blank'}
                }),
                gettext(problemTitle),
                gettext(problemProgress),
                h('div', [forwardKeyboardHelpButtonTemplate(ctx)]),
                h('div.problem', [
                    problemHeader,
                    h('p', {innerHTML: ctx.problem_html}),
                    h('div.drag-container', {style: drag_container_style}, [
                        h('div.item-bank', item_bank_properties, bank_children),
                        h('div.target', {attributes: {'role': 'group', 'arial-label': gettext('Drop Targets')}}, [
                            itemFeedbackPopupTemplate(ctx),
                            h('div.target-img-wrapper', [
                                h('img.target-img', {
                                    src: ctx.target_img_src,
                                    alt: ctx.target_img_description,
                                    style: target_img_style
                                }),
                                renderCollection(zoneTemplate, ctx.zones, ctx)
                            ]),
                        ]),
                        h('div.dragged-items', renderCollection(itemTemplate, items_dragged, ctx)),
                    ]),
                    explanationTemplate(ctx),
                    h('div.action', [
                        (ctx.show_submit_answer ? submitAnswerTemplate(ctx) : null),
                        sidebarTemplate(ctx)
                    ]),
                    keyboardHelpPopupTemplate(ctx),
                    feedbackTemplate(ctx),
                    h('div.sr.reader-feedback-area', {
                        attributes: {'aria-live': 'polite', 'aria-atomic': true},
                        innerHTML: ctx.screen_reader_messages
                    }),
                ]),
            ])
        );
    };

    return mainTemplate;
}

function DragAndDropBlock(runtime, element, configuration) {
    "use strict";

    DragAndDropBlock.STANDARD_MODE = 'standard';
    DragAndDropBlock.ASSESSMENT_MODE = 'assessment';
    DragAndDropBlock.FEEDBACK_CLASS_ZONE_LIMIT = 'limit';

    var Selector = {
        popup_box: '.popup',
        close_button: '.popup .close-feedback-popup-button'
    };
    var gettext;
    if ('DragAndDropI18N' in window) {
        // Use DnDv2's local translations
        gettext = window.DragAndDropI18N.gettext;
    } else if ('gettext' in window) {
        // Use edxapp's global translations
        gettext = window.gettext;
    }
    if (typeof gettext == "undefined") {
        // No translations -- used by test environment
        gettext = function(string) { return string; };
    }

    var renderView = DragAndDropTemplates(configuration);

    var $element = $(element);

    // root: root node managed by the virtual DOM
    var $root = $element.find('.xblock--drag-and-drop');
    var root = $root[0];

    var state = undefined;
    var bgImgNaturalWidth = undefined;  // pixel width of the background image (when not scaled)
    var containerMaxWidth = null;  // measured and set after first render
    var fixedHeaderHeight = 0; // measured in checkForFixedHeader
    var __vdom = virtualDom.h();  // blank virtual DOM

    // Event string size limit.
    var MAX_LENGTH = 255;

    var DEFAULT_ZONE_ALIGN = 'center';

    // Number of miliseconds the user has to keep their finger on the item
    // without moving for drag to begin.
    // This allows user to scroll the container without accidentally dragging the items.
    var TOUCH_DRAG_DELAY = 250;

    // Keyboard accessibility
    var ESC = 27;
    var RET = 13;
    var SPC = 32;
    var TAB = 9;
    var M = 77;

    var $selectedItem;

    var init = function() {
        // Load the current user state, and load the image, then render the block.
        // We load the user state via AJAX rather than passing it in statically (like we do with
        // configuration) due to how the LMS handles unit tabs. If you click on a unit with this
        // block, make changes, click on the tab for another unit, then click back, this block
        // would re-initialize with the old state. To avoid that, we always fetch the state
        // using AJAX during initialization.
        $.when(
            $.ajax(runtime.handlerUrl(element, 'student_view_user_state'), {dataType: 'json'}),
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
            $element.on('keydown', '.item-feedback-popup .close-feedback-popup-button', closePopupKeydownHandler);
            $element.on('keyup', '.item-feedback-popup .close-feedback-popup-button', preventFauxPopupCloseButtonClick);

            $element.on('click', '.xblock--drag-and-drop .submit-attempt-container .submit', doAttempt);
            $element.on('click', '.keyboard-help-button', showKeyboardHelp);
            $element.on('keydown', '.keyboard-help-button', function(evt) {
                runOnKey(evt, RET, showKeyboardHelp);
            });
            $element.on('click', '.xblock--drag-and-drop .problem-action-button-wrapper .reset', resetProblem);
            $element.on('keydown', '.xblock--drag-and-drop .problem-action-button-wrapper .reset', function(evt) {
                runOnKey(evt, RET, resetProblem);
            });
            $element.on('click', '.xblock--drag-and-drop .problem-action-button-wrapper .show', showAnswer);
            $element.on('keydown', '.xblock--drag-and-drop .problem-action-button-wrapper .show', function(evt) {
                runOnKey(evt, RET, showAnswer);
            });

            // We need to register both mousedown and click event handlers because in some browsers the blur
            // event is emitted right after mousedown, hiding our button and preventing the click event from
            // being emitted.
            // We still need the click handler to catch keydown events (other than RET which is handled below),
            // since in some browser/OS combinations some other keyboard button presses (for example space bar)
            // are also treated as clicks,
            $element.on('mousedown click', '.go-to-beginning-button', onGoToBeginningButtonClick);
            $element.on('keydown', '.go-to-beginning-button', function(evt) {
                runOnKey(evt, RET, onGoToBeginningButtonClick);
            });
            // Go to Beginning button should only be visible when it has focus.
            $element.on('focus', '.go-to-beginning-button', showGoToBeginningButton);
            $element.on('blur', '.go-to-beginning-button', hideGoToBeginningButton);

            // For the next one, we need to use addEventListener with useCapture 'true' in order
            // to watch for load events on any child element, since load events do not bubble.
            $element.get(0).addEventListener('load', webkitFix, true);
            // Whenever the container div resizes, re-render to take new available width into account.
            $element.get(0).addEventListener('load', bindContainerResize, true);

            // Re-render when window size changes.
            $(window).on('resize', measureWidthAndRender);

            // Remove the spinner and create a blank slate for virtualDom to take over.
            $root.empty();

            measureWidthAndRender();

            checkForFixedHeader();

            initDraggable();
            initDroppable();

            // Indicate that problem is done loading
            publishEvent({event_type: 'edx.drag_and_drop_v2.loaded'});
        }).fail(function() {
            $root.text(gettext("An error occurred. Unable to load drag and drop problem."));
        });
    };

    // Handler to react when the size of this XBlock changes:
    var last_width = 0;
    var last_height = 0;
    var raf_id = null;
    var handleResizeEvent = function(watchedObject) {
        cancelAnimationFrame(raf_id);
        raf_id = requestAnimationFrame(function() {
            var new_width = watchedObject.width();
            var new_height = watchedObject.height();
            if (last_width !== new_width || last_height !== new_height) {
                last_width = new_width;
                last_height = new_height;
                measureWidthAndRender();
            }
        });
    }

    // Listens to the 'resize' event of the object element, which is absolutely positioned
    // and fit to the edges of the container, so that its size always equals the container size.
    // This hack is needed because not all browsers support native 'resize' events on arbitrary
    // DOM elements.
    var bindContainerResize = function(evt) {
        var object = evt.target;
        var $object = $(object);
        if ($object.is('.resize-detector')) {
            if (object.contentDocument) {
                object.contentDocument.defaultView.addEventListener('resize', handleResizeEvent.bind(null, $object));
            } else {
                // In an IFrame, we might not have permission to access object.contentDocument
                // so just watch for window resize events instead, which should be good enough.
                // It would just miss the case where surrounding HTML changes affect this element's
                // size, but that should be rare in an IFrame.
                window.addEventListener('resize', handleResizeEvent.bind(null, $(window)));
            }
        }
    };

    var measureWidthAndRender = function() {
        // First set containerMaxWidth to null to hide the container.
        containerMaxWidth = null;
        // Render with container hidden to be able to measure max available width.
        applyState();
        // Mesure available width.
        containerMaxWidth = $root.width();
        // Re-render now that correct max-width is known.
        applyState();
    };

    var checkForFixedHeader = function() {
        // There might be a fixed header covering the upper part of the screen,
        // which needs to be taken into account when scrolling while dragging.
        var windowHeight = $(window).height();

        var topElement = $(document.elementFromPoint(0, 0));
        if (topElement) {
            var topElementParents = topElement.parents();
            for (var i = 0; i < topElementParents.length; i++) {
                var parent = $(topElementParents[i]);
                if (parent.css('position') === 'fixed') {
                    fixedHeaderHeight = parent.height();
                    break;
                }
            }
        }
    }

    var runOnKey = function(evt, key, handler) {
        if (evt.which === key) {
            handler(evt);
        }
    };

    var keyboardEventDispatcher = function(evt, focusId) {
        if (evt.which === TAB) {
            trapFocus(evt);
        } else if (evt.which === ESC) {
            hideKeyboardHelp(evt, focusId);
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

    var onGoToBeginningButtonClick = function(evt) {
        evt.preventDefault();
        // In theory the blur event handler should hide the button,
        // but the blur event does not fire consistently in all browsers,
        // so invoke hideGoToBeginningButton now to make sure it gets hidden.
        // Invoking hideGoToBeginningButton multiple times is harmless.
        hideGoToBeginningButton();
        focusFirstDraggable();
    };

    var showGoToBeginningButton = function() {
        if (!state.go_to_beginning_button_visible) {
            state.go_to_beginning_button_visible = true;
            applyState();
        }
    };

    var hideGoToBeginningButton = function() {
        if (state.go_to_beginning_button_visible) {
            state.go_to_beginning_button_visible = false;
            applyState();
        }
    };

    // Browsers will emulate click events on keyboard keyup events.
    // The feedback popup is shown very quickly after the user drops the item on the board.
    // If the user uses the keyboard to drop the item, and the popup gets displayed and focused
    // *before* the user releases the key, most browsers will emit an emulated click event on the
    // close popup button. We prevent these from happenning by only letting the browser emulate
    // a click event on keyup if the close button received a keydown event prior to the keyup.
    var _popup_close_button_keydown_received = false;

    var closePopupKeydownHandler = function(evt) {
        _popup_close_button_keydown_received = true;
        // Don't let user tab out of the button until the feedback is closed.
        if (evt.which === TAB) {
            evt.preventDefault();
        }
    };

    var preventFauxPopupCloseButtonClick = function(evt) {
        if (_popup_close_button_keydown_received) {
            // The close button received a keydown event prior to this keyup,
            // so this event is genuine.
            _popup_close_button_keydown_received = false;
        } else {
            // There was no keydown prior to this keyup, so the keydown must have happend *before*
            // the popup was displayed and focused and the keypress is still in progress.
            // Make the browser ignore this keyup event.
            evt.preventDefault();
        }
    };

    var focusModalButton = function() {
        $root.find('.keyboard-help-dialog .modal-dismiss-button').focus();
    };

    var showKeyboardHelp = function(evt) {
        var focusId = document.activeElement;
        evt.preventDefault();

        // Show dialog
        var $keyboardHelpDialog = $root.find('.keyboard-help-dialog');
        $keyboardHelpDialog.find('.modal-window-overlay').show();
        $keyboardHelpDialog.find('.modal-window').show().focus();

        // Set up event handlers
        $(document).on('keydown.keyboard-help', function(evt) {
            keyboardEventDispatcher(evt, focusId);
        });

        $keyboardHelpDialog.find('.modal-dismiss-button').on('click', function(evt) {
            hideKeyboardHelp(evt, focusId)
        });
    };

    var hideKeyboardHelp = function(evt, focusId) {
        evt.preventDefault();

        // Hide dialog
        var $keyboardHelpDialog = $root.find('.keyboard-help-dialog');
        $keyboardHelpDialog.find('.modal-window-overlay').hide();
        $keyboardHelpDialog.find('.modal-window').hide();

        // Remove event handlers
        $(document).off('keydown.keyboard-help');
        $keyboardHelpDialog.find('.modal-dismiss-button').off();

        // Handle focus
        $(focusId).focus();
    };

    /** Asynchronously load the main background image used for this block. */
    var loadBackgroundImage = function() {
        var promise = $.Deferred();
        var img = new Image();
        img.addEventListener("load", function() {
            if (img.width == 0 || img.height == 0) {
                // Workaround for IE11 issue with SVG images
                document.body.appendChild(img);
                var width = img.offsetWidth;
                var height = img.offsetHeight;
                document.body.removeChild(img);
                img.width = width, img.height = height;
            }
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
        sendFeedbackPopupEvents();
        updateDOM();
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
        if (state.feedback && state.feedback.length > 0) {
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

    var updateDOM = function() {
        var new_vdom = render(state);
        var patches = virtualDom.diff(__vdom, new_vdom);
        root = virtualDom.patch(root, patches);
        $root = $(root);
        __vdom = new_vdom;
    };

    var sr_clear_timeout = null;

    var setScreenReaderMessages = function() {
        clearTimeout(sr_clear_timeout);

        var pluckMessages = function(feedback_items) {
            return feedback_items.map(function(item) {
                return item.message;
            });
        };
        var messages = [];
        // In standard mode, it makes more sense to read the per-item feedback before overall feedback.
        if (state.feedback && configuration.mode === DragAndDropBlock.STANDARD_MODE) {
            messages = messages.concat(pluckMessages(state.feedback));
        }
        if (state.overall_feedback) {
            messages = messages.concat(pluckMessages(state.overall_feedback));
        }
        // In assessment mode overall feedback comes first then multiple per-item feedbacks.
        if (state.feedback && configuration.mode === DragAndDropBlock.ASSESSMENT_MODE) {
            if (state.feedback.length > 0) {
                if (!state.last_action_correct) {
                    messages.push(gettext("Some of your answers were not correct."));
                }
                messages = messages.concat(
                    gettext("Hints:"),
                    pluckMessages(state.feedback)
                );
            }
        }
        var paragraphs = messages.map(function(msg) {
            return '<p>' + msg + '</p>';
        });

        state.screen_reader_messages = paragraphs.join('');

        // Remove the text after a short time. This will make screen readers read the message again,
        // next time the user performs an action, even if next feedback message did not change from
        // last attempt (for example: if user drops the same item on two wrong zones one after another,
        // the negative feedback should be read out twice, not only on first drop).
        sr_clear_timeout = setTimeout(function() {
            state.screen_reader_messages = '';
        }, 250);
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
        return evt.which == RET || (evt.ctrlKey && evt.which == M);
    };

    var isSpaceKey = function(evt) {
        var key = evt.which;
        return key === SPC;
    };

    var isTabKey = function(evt) {
        var key = evt.which;
        return key === TAB;
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

    var focusGoToBeginningButton = function() {
        $root.find('.go-to-beginning-button').focus();
    };

    var focusFirstDraggable = function() {
        $root.find('.item-bank .option').first().focus();
    };

    var focusItemFeedbackPopup = function() {
        var popup = $root.find('.item-feedback-popup');
        if (popup.length && popup.is(":visible")) {
            popup.find('.close-feedback-popup-button:visible').focus();
            return true;
        }
        return false;
    };

    var returnItemToBank = function(item_id) {
        if (!state.items[item_id]) {
            // Nothing to do here, item is already in the bank.
            return;
        }
        delete state.items[item_id];
        applyState();
        var url = runtime.handlerUrl(element, 'drop_item');
        var data = {val: item_id, zone: null};
        $.post(url, JSON.stringify(data), 'json');
    };

    var placeGrabbedItem = function($zone) {
        var zone = String($zone.data('uid'));
        var zone_align = $zone.data('zone_align');
        var items = configuration.items;

        var item_id;
        for (var i = 0; i < items.length; i++) {
            if (items[i].grabbed) {
                item_id = items[i].id;
                break;
            }
        }

        if (state.items[item_id] && state.items[item_id].zone === zone) {
            // Nothing to do here, item already in zone.
            return;
        }

        var items_in_zone_count = countItemsInZone(zone, [item_id.toString()]);
        if (configuration.max_items_per_zone && configuration.max_items_per_zone <= items_in_zone_count) {
            state.last_action_correct = false;
            state.feedback = [{
                message: gettext("You cannot add any more items to this zone."),
                message_class: DragAndDropBlock.FEEDBACK_CLASS_ZONE_LIMIT
            }];
            applyState();
            return;
        }

        state.items[item_id] = {
            zone: zone,
            zone_align: zone_align,
            submitting_location: true,
        };

        applyState();
        submitLocation(item_id, zone);
    };

    var countItemsInZone = function(zone, exclude_ids) {
        var ids_to_exclude = exclude_ids ? exclude_ids : [];
        return Object.keys(state.items).filter(function(item_id) {
            return state.items[item_id].zone === zone && $.inArray(item_id, ids_to_exclude) === -1;
        }).length;
    };

    var canGoToBeginning = function() {
        var all_items_placed = configuration.items.length === Object.keys(state.items).length;
        return !all_items_placed && !state.finished;
    };

    var initDroppable = function() {
        // Set up zones for keyboard interaction
        $root.on('keydown', '.zone, .item-bank', function(evt) {
            var $zone = $(this);
            if (state.keyboard_placement_mode) {
                if (isCycleKey(evt)) {
                    focusNextZone(evt, $zone);
                } else if (isCancelKey(evt)) {
                    evt.preventDefault();
                    state.keyboard_placement_mode = false;
                    releaseGrabbedItems();
                } else if (isActionKey(evt)) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    state.keyboard_placement_mode = false;
                    if ($zone.is('.item-bank')) {
                        delete state.items[$selectedItem.data('value')];
                    } else {
                        placeGrabbedItem($zone);
                    }
                    releaseGrabbedItems();
                }
            } else if (isTabKey(evt) && !evt.shiftKey) {
                // If the user just dropped an item to this zone, next TAB keypress
                // should move focus to "Go to Beginning" button.
                if (state.tab_to_go_to_beginning_button && canGoToBeginning()) {
                    evt.preventDefault();
                    focusGoToBeginningButton();
                }
            } else if (isSpaceKey(evt)) {
                // Pressing the space bar moves the page down by default in most browsers.
                // That can be distracting while moving items with the keyboard, so prevent
                // the default scroll from happening while a zone is focused.
                evt.preventDefault();
            }
        });

        $root.on('blur', '.zone, .item-bank', function(evt) {
            delete state.tab_to_go_to_beginning_button;
        });
    };

    var getItemById = function(item_id) {
        for (var i = 0; i < configuration.items.length; i++) {
            if (configuration.items[i].id === item_id) {
                return configuration.items[i];
            }
        }
    };

    var initDraggable = function() {
        var $container = $root.find('.drag-container');

        // Allow items to be "picked up" using the keyboard
        $container.on('keydown', '.option[draggable=true]', function(evt) {
            if (isActionKey(evt)) {
                var $item = $(this);
                evt.preventDefault();
                evt.stopPropagation();
                state.keyboard_placement_mode = true;
                grabItem($item, 'keyboard');
                $selectedItem = $item;
                $root.find('.target .zone').first().focus();
            }
        });

        // Helper functions that return pageX/pageY from either touch or mouse events.
        var pageX = function(evt) {
            if (evt.type === 'touchstart' || evt.type === 'touchmove') {
                return evt.originalEvent.targetTouches[0].pageX;
            } else {
                return evt.pageX;
            }
        };

        var pageY = function(evt) {
            if (evt.type === 'touchstart' || evt.type === 'touchmove') {
                return evt.originalEvent.targetTouches[0].pageY;
            } else {
                return evt.pageY;
            }
        };

        var isValidDropTarget = function(element) {
            var valid = element.classList.contains('zone');
            if (!valid && configuration.mode === DragAndDropBlock.ASSESSMENT_MODE) {
                // In assessment mode, items can be dropped back into the item bank.
                valid = element.classList.contains('item-bank');
            }
            return valid;
        };

        // If the drag ended on a valid target zone, returns the zone, otherwise returns null;
        var getTargetZone = function(evt) {
            var $zone = null;
            var x, y;
            if (evt.type === 'mouseup' || evt.type === 'mousemove') {
                x = evt.clientX;
                y = evt.clientY;
            } else {
                x = evt.originalEvent.changedTouches[0].clientX;
                y = evt.originalEvent.changedTouches[0].clientY;
            }
            // We have to temporarily hide the dragged item so that we can get the
            // to the element below it.
            var $dragged_items_container = $container.find('.dragged-items');
            $dragged_items_container.hide();
            var element = document.elementFromPoint(x, y);
            while (element) {
                if (isValidDropTarget(element)) {
                    $zone = $(element);
                    break;
                } else {
                    element = element.parentElement;
                }
            }
            $dragged_items_container.show();
            return $zone;
        };

        var onDragStart = function(interaction_type, $item, drag_origin) {
            var item_id = $item.data('value');
            var item = getItemById(item_id);
            var $document = $(document);
            publishEvent({
                event_type: 'edx.drag_and_drop_v2.item.picked_up',
                item_id: item_id
            });

            var container_width = $container.innerWidth();
            var container_height = $container.innerHeight();

            // We need to get the item position relative to the $container.
            var item_offset = $item.offset();
            var container_offset = $container.offset();

            // We need to drag the item by its center.
            var mid_position = {
                x: item_offset.left + $item.innerWidth() / 2,
                y: item_offset.top + $item.innerHeight() / 2
            };

            var centered_position = {
                left: item_offset.left - container_offset.left + (drag_origin.x - mid_position.x),
                top: item_offset.top - container_offset.top + (drag_origin.y - mid_position.y)
            };

            item.max_left =  container_width - $item.outerWidth();
            item.max_top = container_height - $item.outerHeight();
            item.drag_position = centered_position;
            grabItem($item, 'mouse');

            // Animate the item back to its original position in the bank.
            var revertDrag = function() {
                var revert_duration = 150;
                var start_position = item.drag_position;
                var start_ts = null;
                var step = function(ts) {
                    if (!start_ts) {
                        start_ts = ts;
                    }
                    var progress = Math.min(1, (ts - start_ts) / revert_duration);
                    item.drag_position = {
                        left: start_position.left + (progress * (centered_position.left - start_position.left)),
                        top: start_position.top + (progress * (centered_position.top - start_position.top)),
                    };
                    if (progress === 1) {
                        delete item.drag_position;
                        releaseGrabbedItems();
                    } else {
                        applyState();
                        requestAnimationFrame(step);
                    }
                }
                requestAnimationFrame(step);
            };

            var raf_id = null;
            var $last_target_zone = null;
            var onDragMove = function(evt) {
                evt.preventDefault();
                var $zone = getTargetZone(evt);
                if (configuration.display_zone_borders_dragging) {
                    if ($zone) {
                        if ($last_target_zone && $zone.attr('id') !== $last_target_zone.attr('id')) {
                            $last_target_zone.removeClass('zone-border');
                        }
                        $zone.addClass('zone-border');
                        $last_target_zone = $zone;
                    } else if ($last_target_zone) {
                        $last_target_zone.removeClass('zone-border');
                        $last_target_zone = null;
                    }
                }
                if (raf_id) {
                    cancelAnimationFrame(raf_id);
                }
                raf_id = requestAnimationFrame(function() {
                    var x = pageX(evt);
                    var y = pageY(evt);

                    var thresholdWidth = 50;

                    var $target = $container.find('.target');
                    var targetRect = $target.get(0).getBoundingClientRect();
                    var top = targetRect.top + window.scrollY;
                    var bottom = targetRect.bottom + window.scrollY;
                    var left = targetRect.left + window.scrollX - thresholdWidth;
                    var right = targetRect.right + window.scrollX + thresholdWidth;

                    if (top <= y && bottom >= y && left <= x && right >= x) {
                        var viewportTop = window.scrollY + fixedHeaderHeight;
                        var viewportBottom = window.scrollY + $(window).height();
                        var viewportLeft = window.scrollX;
                        var viewportRight = window.scrollX + $(window).width();

                        var scrollAmount = 50;

                        if (x < (viewportLeft + thresholdWidth)) {
                            $target.scrollLeft($target.scrollLeft() - scrollAmount);
                        }

                        if (x > (viewportRight - thresholdWidth)) {
                            $target.scrollLeft($target.scrollLeft() + scrollAmount);
                        }

                        if (y > (viewportBottom - thresholdWidth)) {
                            $document.scrollTop($document.scrollTop() + scrollAmount);
                        }

                        if (top < viewportTop + thresholdWidth && y < (viewportTop + thresholdWidth)) {
                            $document.scrollTop($document.scrollTop() - scrollAmount);
                        }
                    }

                    var dx = x - drag_origin.x;
                    var dy = y - drag_origin.y;
                    var next_left = centered_position.left + dx;
                    var next_top = centered_position.top + dy;
                    next_left = Math.max(0, Math.min(item.max_left, next_left));
                    next_top = Math.max(0, Math.min(item.max_top, next_top));
                    item.drag_position = {left: next_left, top: next_top};
                    applyState();
                    raf_id = null;
                });
            };

            var onDragEnd = function(evt) {
                if (raf_id) {
                    cancelAnimationFrame(raf_id);
                }
                if (evt.type === 'mouseup') {
                    $document.off('mousemove', onDragMove);
                    $document.off('mouseup', onDragEnd);
                } else {
                    $item.off('touchmove', onDragMove);
                    $item.off('touchend touchcancel', onDragEnd);
                }
                if (evt.type === 'touchcancel') {
                    revertDrag();
                    return;
                }
                var $zone = getTargetZone(evt);
                if ($zone) {
                    delete item.drag_position;
                    if ($zone.is('.item-bank')) {
                        returnItemToBank(item_id);
                    } else {
                        placeGrabbedItem($zone);
                    }
                    releaseGrabbedItems();
                } else {
                    revertDrag();
                }
                if (configuration.display_zone_borders_dragging && $last_target_zone) {
                    $last_target_zone.removeClass('zone-border');
                    $last_target_zone = null;
                }
            };

            if (interaction_type === 'mouse') {
                // Mouse events have to be bound to the document or they won't fire after
                // the item is removed from the bank.
                $document.on('mousemove', onDragMove);
                $document.on('mouseup', onDragEnd);
            } else {
                // Touch events behave in the opposite way - they have to be bound to the item
                // where the touchstart event was fired, or touchmove will not fire if the item
                // gets removed from the DOM; see: https://stackoverflow.com/a/45760014/51397
                $item.on('touchmove', onDragMove);
                $item.on('touchend touchcancel', onDragEnd);
            }
        };


        // Touch devices emulate mousedown events after touchstart, which would cause our drag
        // start event to be handled twice.
        // One way to prevent that would be to call evt.preventDefault() in the touchstart handler,
        // but that would also prevent scrolling, which we do not want.
        // Instead of preventing the default, we use the handled_by_touch flag, which we set to true
        // in the touchstart handler (and set it back to false after the event is processed).
        // If the mousedown handler sees the flag set to true, it will simply ignore the event.
        var handled_by_touch = false;

        // Mousedown events should start the drag immediately.
        $container.on('mousedown', '.option[draggable=true]', function(evt) {
            if (!handled_by_touch) {
                evt.preventDefault();
                var $item = $(this);
                var drag_origin = {x: pageX(evt), y: pageY(evt)};
                onDragStart('mouse', $(this), drag_origin);
            }
        });

        // Touchstart events should start the event after a timeout.
        // If the user starts moving the finger during the timeout, the drag should be cancelled.
        // This allows users to scroll the item bank with their finger without accidentally starting
        // to drag items.
        $container.on('touchstart', '.option[draggable=true]', function(evt) {
            handled_by_touch = true;
            var $item = $(this);
            var drag_origin = {x: pageX(evt), y: pageY(evt)};
            var timeout_id = null;
            var cancelDrag = function() {
                clearTimeout(timeout_id);
                // We need to reset the handled_by_touch in a timeout,
                // so that it happens after the potentially emulated mousedown event.
                setTimeout(function() {
                    handled_by_touch = false;
                }, 0);
            };

            $item.one('touchmove touchend touchcancel', cancelDrag);

            timeout_id = setTimeout(function() {
                handled_by_touch = false;
                $item.off('touchmove touchend touchcancel', cancelDrag);
                onDragStart('touch', $item, drag_origin);
            }, TOUCH_DRAG_DELAY);
        });

        // Prevent long tap on draggable items from causing the context menu to pop up on android.
        $container.on('contextmenu', '.option[draggable=true]', function(evt) {
            evt.preventDefault();
        });

        // Prevent touchmove events fired on the dragged item causing scroll.
        $container.on('touchmove', '.dragged-items .options[draggable=true]', function(evt) {
            evt.preventDefault();
        });
    };

    var grabItem = function($item, interaction_type) {
        var item_id = $item.data('value');
        configuration.items.forEach(function(item) {
            if (item.id === item_id) {
                item.grabbed = true;
                item.grabbed_with = interaction_type;
            } else {
                item.grabbed = false;
                delete item.grabbed_with;
            }
        });
        closePopup(false);
        applyState();
    };

    var releaseGrabbedItems = function() {
        configuration.items.forEach(function(item) {
            item.grabbed = false;
            delete item.grabbed_with;
        });
        applyState();
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
                    state.grade = data.grade;
                    if (!data.correct) {
                        delete state.items[item_id];
                    }
                    if (data.finished) {
                        state.finished = true;
                        state.overall_feedback = data.overall_feedback;
                    }
                    setScreenReaderMessages();
                }
                applyState();
                if (state.feedback && state.feedback.length > 0) {
                    // Move focus the the close button of the feedback popup.
                    focusItemFeedbackPopup();
                } else {
                    // Next tab press should take us to the "Go to Beginning" button.
                    state.tab_to_go_to_beginning_button = true;
                }
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

        var manually_closed = target.is(Selector.close_button) || target.parent().is(Selector.close_button);
        closePopup(manually_closed);
        applyState();

        if (manually_closed) {
            focusFirstDraggable();
        }
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

    var showAnswer = function(evt) {
        evt.preventDefault();
        state.show_answer_spinner = true;
        applyState();

        $.ajax({
            type: 'POST',
            url: runtime.handlerUrl(element, 'show_answer'),
            data: '{}',
        }).done(function(data) {
            state.items = data.items;
            state.showing_answer = true;
            state.explanation = data.explanation;
            delete state.feedback;
        }).always(function() {
            state.show_answer_spinner = false;
            applyState();
            $root.find('.item-bank').focus();
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
            state.grade = data.grade;
            state.feedback = data.feedback;
            state.overall_feedback = data.overall_feedback;
            state.answer_available = data.answer_available;
            state.last_action_correct = data.correct;
            if (attemptsRemain()) {
                data.misplaced_items.forEach(function(misplaced_item_id) {
                    delete state.items[misplaced_item_id]
                });
            } else {
                state.finished = true;
            }
            setScreenReaderMessages();
        }).always(function() {
            state.submit_spinner = false;
            applyState();
            focusItemFeedbackPopup() || focusFirstDraggable();
        });
    };

    var canSubmitAttempt = function() {
        return Object.keys(state.items).length > 0 && !isPastDue() && attemptsRemain() && !submittingLocation();
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

    var isPastDue = function () {
        return configuration.has_deadline_passed;
    };


    var attemptsRemain = function() {
        return !configuration.max_attempts || configuration.max_attempts > state.attempts;
    };
    var canShowAnswer = function() {
        if(state.answer_available === undefined) return configuration.answer_available;
        return state.answer_available;
    }

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
                is_dragged: Boolean(item.drag_position),
                drag_position: item.drag_position,
                max_left: item.max_left,
                max_top: item.max_top,
                is_placed: Boolean(item_user_state),
                widthPercent: item.widthPercent, // widthPercent may be undefined (auto width)
                imgNaturalWidth: item.imgNaturalWidth,
                noPadding: item.noPadding,
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
        var item_bank_focusable = (state.keyboard_placement_mode || state.showing_answer) &&
            configuration.mode === DragAndDropBlock.ASSESSMENT_MODE;

        var context = {
            drag_container_max_width: containerMaxWidth,
            // configuration - parts that never change:
            bg_image_width: bgImgNaturalWidth, // Not stored in configuration since it's unknown on the server side
            title_html: configuration.title,
            show_title: configuration.show_title,
            mode: configuration.mode,
            max_attempts: configuration.max_attempts,
            graded: configuration.graded,
            weighted_max_score: configuration.weighted_max_score,
            problem_html: configuration.problem_text,
            show_problem_header: configuration.show_problem_header,
            show_submit_answer: configuration.mode == DragAndDropBlock.ASSESSMENT_MODE,
            show_show_answer: canShowAnswer(),
            target_img_src: configuration.target_img_expanded_url,
            target_img_description: configuration.target_img_description,
            display_zone_labels: configuration.display_zone_labels,
            display_zone_borders: configuration.display_zone_borders,
            display_zone_borders_dragging: configuration.display_zone_borders_dragging,
            zones: configuration.zones,
            items: items,
            // state - parts that can change:
            attempts: state.attempts,
            grade: state.grade,
            last_action_correct: state.last_action_correct,
            item_bank_focusable: item_bank_focusable,
            feedback_messages: state.feedback,
            overall_feedback_messages: state.overall_feedback,
            explanation: state.explanation,
            disable_reset_button: !canReset(),
            disable_submit_button: !canSubmitAttempt(),
            submit_spinner: state.submit_spinner,
            showing_answer: state.showing_answer,
            show_answer_spinner: state.show_answer_spinner,
            disable_go_to_beginning_button: !canGoToBeginning(),
            show_go_to_beginning_button: state.go_to_beginning_button_visible,
            screen_reader_messages: (state.screen_reader_messages || '')
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
