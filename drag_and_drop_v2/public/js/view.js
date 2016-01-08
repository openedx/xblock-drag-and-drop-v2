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

    var itemTemplate = function(item) {
        var style = {};
        var className = (item.class_name) ? item.class_name : "";
        var tabindex = 0;
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
            tabindex = -1;  // If an item has been placed it can no longer be interacted with,
                            // so remove the ability to move focus to it using the keyboard
        }
        if (item.has_image) {
            className += " " + "option-with-image";
        }
        var content_html = item.displayName;
        if (item.imageURL) {
            content_html = '<img src="' + item.imageURL + '" alt="' + item.imageDescription + '" />';
        }
        return (
            h('div.option',
                {
                    key: item.value,
                    className: className,
                    attributes: {
                        'tabindex': tabindex,
                        'draggable': !item.drag_disabled,
                        'aria-grabbed': item.grabbed,
                        'data-value': item.value,
                        'data-drag-disabled': item.drag_disabled
                    },
                    style: style
                }, [
                    itemSpinnerTemplate(item.xhr_active),
                    h('div', {innerHTML: content_html, className: "item-content"}),
                    itemInputTemplate(item.input)
                ]
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
                        width: zone.width_percent + '%', height: zone.height_percent + "%"
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
                h('div.reset-button', {style: {display: reset_button_display}}, gettext('Reset exercise')),
                h('h3.title1', {style: {display: feedback_display}}, gettext('Feedback')),
                h('p.message', {style: {display: feedback_display},
                                innerHTML: ctx.feedback_html})
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
            h('section.xblock--drag-and-drop', [
                problemHeader,
                h('section.problem', {role: 'application'}, [
                    questionHeader,
                    h('p', {innerHTML: ctx.question_html}),
                ]),
                h('section.drag-container', [
                    h('div.item-bank', renderCollection(itemTemplate, items_in_bank, ctx)),
                    h('div.target', [
                        h('div.popup', {style: {display: ctx.popup_html ? 'block' : 'none'}}, [
                            h('div.close.icon-remove-sign.fa-times-circle'),
                            h('p.popup-content', {innerHTML: ctx.popup_html}),
                        ]),
                        h('div.target-img-wrapper', [
                            h('img.target-img', {src: ctx.target_img_src, alt: ctx.target_img_description}),
                        ]),
                        renderCollection(zoneTemplate, ctx.zones, ctx),
                        renderCollection(itemTemplate, items_placed, ctx),
                    ]),
                ]),
                feedbackTemplate(ctx),
            ])
        );
    };

    DragAndDropBlock.renderView = mainTemplate;

})(virtualDom.h);
