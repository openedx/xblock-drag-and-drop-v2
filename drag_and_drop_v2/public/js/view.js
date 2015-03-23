(function(h) {

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

    var px = function(n) {
        return n + 'px';
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
                h('button.submit-input', {disabled: input.has_value}, 'ok')
            ])
        );
    };

    var itemTemplate = function(item) {
        return (
            h('div.option', {className: item.class_name,
                             attributes: {'data-value': item.value, 'data-drag-disabled': item.drag_disabled},
                             style: {width: item.width, height: item.height,
                                     top: item.top, left: item.left, position: item.position}}, [
                h('div', {innerHTML: item.content_html}),
                itemInputTemplate(item.input)
            ])
        );
    };

    var zoneTemplate = function(zone, ctx) {
        return (
            h('div.zone', {id: zone.id, attributes: {'data-zone': zone.title},
                           style: {top: px(zone.y), left: px(zone.x),
                                   width: px(zone.width), height: px(zone.height)}},
              h('p', {style: {visibility: ctx.display_zone_labels ? 'visible': 'hidden'}}, zone.title))
        );
    };

    var feedbackTemplate = function(ctx) {
        var feedback_display = ctx.feedback_html ? 'block' : 'none';
        var reset_button_display = ctx.display_reset_button ? 'block' : 'none';
        return (
            h('section.feedback', [
                h('div.reset-button', {style: {display: reset_button_display}}, 'Reset exercise'),
                h('div.title1', {style: {display: feedback_display}}, 'Feedback'),
                h('p.message', {style: {display: feedback_display},
                                innerHTML: ctx.feedback_html})
            ])
        );
    };

    var mainTemplate = function(ctx) {
        return (
            h('section.xblock--drag-and-drop', [
                h('h2.problem-header', {innerHTML: ctx.header_html}),
                h('section.problem', {role: 'application'}, [
                    h('div.title1', 'Question'),
                    h('p', {innerHTML: ctx.question_html})
                ]),
                h('section.drag-container', [
                    h('div.items', renderCollection(itemTemplate, ctx.items, ctx)),
                    h('div.target', [
                        h('div.popup', {style: {display: ctx.popup_html ? 'block' : 'none'}}, [
                            h('div.close.icon-remove-sign.fa-times-circle'),
                            h('p.popup-content', {innerHTML: ctx.popup_html})
                        ]),
                        h('div.target-img', {style: {backgroundImage: ctx.target_img_src ?
                                                                          'url(' + ctx.target_img_src + ')' :
                                                                          undefined}},
                          renderCollection(zoneTemplate, ctx.zones, ctx))
                    ]),
                    h('div.clear')
                ]),
                feedbackTemplate(ctx)
            ])
        );
    };

    DragAndDropBlock.renderView = mainTemplate;

})(virtualDom.h);
