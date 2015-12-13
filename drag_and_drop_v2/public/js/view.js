(function(h) {
    "use strict";
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
                h('button.submit-input', {disabled: input.has_value}, gettext('ok'))
            ])
        );
    };

    var itemTemplate = function(item) {
        var style = {};
        if (item.background_color) {
            style['background-color'] = item.background_color;
        }
        if (item.color) {
            style.color = item.color;
        }
        if (item.is_placed) {
            style.left = item.x_percent + "%";
            style.top = item.y_percent + "%";
        }
        return (
            h('div.option',
                {
                    key: item.value,
                    className: item.class_name,
                    attributes: {'data-value': item.value, 'data-drag-disabled': item.drag_disabled},
                    style: style
                }, [
                    h('div', {innerHTML: item.content_html}),
                    itemInputTemplate(item.input)
                ]
            )
        );
    };

    var zoneTemplate = function(zone, ctx) {
        return (
            h(
                'div.zone',
                {
                    id: zone.id,
                    attributes: {'data-zone': zone.title},
                    style: {
                        top: zone.y_percent + '%', left: zone.x_percent + "%",
                        width: zone.width_percent + '%', height: zone.height_percent + "%",
                    }
                },
                ctx.display_zone_labels ? h('p', zone.title) : null
            )
        );
    };

    var feedbackTemplate = function(ctx) {
        var feedback_display = ctx.feedback_html ? 'block' : 'none';
        var reset_button_display = ctx.display_reset_button ? 'block' : 'none';
        return (
            h('section.feedback', [
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
                            h('img.target-img', {src: ctx.target_img_src, alt: "Image Description here"}),
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
