(function(h) {
    "use strict";

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

    var itemTemplate = function(item, ctx) {
        // Define properties
        var className = (item.class_name) ? item.class_name : "";
        if (item.has_image) {
            className += " " + "option-with-image";
        }
        var attributes = {
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
            style.left = item.x_percent + "%";
            style.top = item.y_percent + "%";
            if (item.widthPercent) {
                style.width = item.widthPercent + "%";
                style.maxWidth = item.widthPercent + "%"; // default maxWidth is ~33%
            } else if (item.imgNaturalWidth) {
                style.width = item.imgNaturalWidth + "px";
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
            var item_description_id = 'item-' + item.value + '-description';
            item_content.properties.attributes = { 'aria-describedby': item_description_id };
            var item_description = h(
                'div',
                { id: item_description_id, className: 'sr' },
                gettext('Correctly placed in: ') + item.zone
            );
            children.splice(1, 0, item_description);
        }
        children.splice(1, 0, item_content);
        return (
            h(
                'div.option',
                {
                    key: item.value,
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
        return (
            h(
                selector,
                {
                    id: zone.id,
                    attributes: {
                        'tabindex': 0,
                        'dropzone': 'move',
                        'aria-dropeffect': 'move',
                        'data-zone': zone.title
                    },
                    style: {
                        top: zone.y_percent + '%', left: zone.x_percent + "%",
                        width: zone.width_percent + '%', height: zone.height_percent + "%",
                    }
                },
                [
                    h('p', { className: className }, zone.title),
                    h('p', { className: 'zone-description sr' }, zone.description)
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
                    'a.reset-button',
                    { style: { display: reset_button_display }, attributes: { tabindex: 0 }},
                    gettext('Reset exercise')
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
                h('a.keyboard-help-button', { attributes: { tabindex: 0 } }, gettext('Keyboard Help')),
                h('div.keyboard-help-dialog', [
                    h('div.modal-window-overlay'),
                    h('div.modal-window', { attributes: dialog_attributes, style: dialog_style }, [
                        h('div.modal-header', [
                            h('h2.modal-window-title', gettext('Keyboard Help'))
                        ]),
                        h('div.modal-content', [
                            h('p', gettext('You can complete this exercise using only your keyboard.')),
                            h('ul', [
                                h('li', gettext('Use "Tab" and "Shift-Tab" to navigate between items and zones.')),
                                h('li', gettext('Press "Enter", "Space", "Ctrl-m", or "⌘-m" on an item to select it for dropping, then navigate to the zone you want to drop it on.')),
                                h('li', gettext('Press "Enter", "Space", "Ctrl-m", or "⌘-m" to drop the item on the current zone.')),
                                h('li', gettext('Press "Escape" if you want to cancel the drop operation (e.g. because you would like to select a different item).')),
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
        var problemHeader = ctx.show_title ? h('h2.problem-header', {innerHTML: ctx.header_html}) : null;
        var questionHeader = ctx.show_question_header ? h('h3.title1', gettext('Question')) : null;
        var is_item_placed = function(i) { return i.is_placed; };
        var items_placed = $.grep(ctx.items, is_item_placed);
        var items_in_bank = $.grep(ctx.items, is_item_placed, true);
        return (
            h('section.themed-xblock.xblock--drag-and-drop', [
                problemHeader,
                h('section.problem', {role: 'application'}, [
                    questionHeader,
                    h('p', {innerHTML: ctx.question_html}),
                ]),
                h('section.drag-container', [
                    h('div.item-bank', renderCollection(itemTemplate, items_in_bank, ctx)),
                    h('div.target', [
                        h(
                            'div.popup',
                            {
                                style: {display: ctx.popup_html ? 'block' : 'none'},
                                attributes: {'aria-live': 'polite'}
                            },
                            [
                                h('div.close.icon-remove-sign.fa-times-circle'),
                                h('p.popup-content', {innerHTML: ctx.popup_html}),
                            ]
                        ),
                        h('div.target-img-wrapper', [
                            h('img.target-img', {src: ctx.target_img_src, alt: ctx.target_img_description}),
                        ]),
                        renderCollection(zoneTemplate, ctx.zones, ctx),
                        renderCollection(itemTemplate, items_placed, ctx),
                    ]),
                ]),
                keyboardHelpTemplate(ctx),
                feedbackTemplate(ctx),
            ])
        );
    };

    DragAndDropBlock.renderView = mainTemplate;

})(virtualDom.h);
