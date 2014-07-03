function DragAndDropBlock(runtime, element) {
    var dragAndDrop = (function($) {
        var _fn = {

            // DOM Elements
            $block: $('.xblock--drag-and-drop'),
            $app: $('.xblock--drag-and-drop .drag-container'),
            $ul: $('.xblock--drag-and-drop .items'),
            $target: $('.xblock--drag-and-drop .target-img'),
            $feedback: $('.xblock--drag-and-drop .feedback .message'),

            // Cannot set until items added to DOM
            $items: {}, // $('.xblock--drag-and-drop .items .option'),
            $zones: {}, // $('.xblock--drag-and-drop .target .zone'),

            // jQuery UI Draggable options
            options: {
                drag: {
                    containment: '.xblock--drag-and-drop .drag-container',
                    cursor: 'move',
                    stack: '.xblock--drag-and-drop .items .option'
                },
                drop: {
                    accept: '.xblock--drag-and-drop .items .option',
                    tolerance: 'pointer'
                }
            },

            // item template
            tpl: {
                item: function() {
                    return [
                        '<li class="option" data-value="<%= id %>"',
                            'style="width: <%= size.width %>; height: <%= size.height %>">',
                            '<%= displayName %>',
                        '</li>'
                    ].join('');
                },
                image_item: function() {
                    return [
                        '<li class="option" data-value="<%= id %>"',
                            'style="width: <%= size.width %>; height: <%= size.height %>">',
                            '<img src="<%= backgroundImage %>" />',
                        '</li>'
                    ].join('');
                },
                zoneElement: function() {
                    return [
                        '<div id="<%= id %>" class="zone" data-zone="<%= title %>" style="',
                            'top:<%= y %>px;',
                            'left:<%= x %>px;',
                            'width:<%= width %>px;',
                            'height:<%= height %>px;">',
                            '<p><%= title %></p>',
                        '</div>'
                    ].join('');
                }
            },

            init: function(data) {
                _fn.data = data;

                // Add the items to the page
                _fn.items.draw();
                _fn.zones.draw();

                // Load welcome feedback
                _fn.feedback.set(_fn.data.feedback.start);

                // Init drag and drop plugin
                _fn.$items.draggable(_fn.options.drag);
                _fn.$zones.droppable(_fn.options.drop);

                // Init click handlers
                _fn.clickHandlers.init(_fn.$items, _fn.$zones);

                // Get count of all active items
                _fn.items.init();

                // Set the target image
                if (_fn.data.targetImg)
                    _fn.$target.css('background', 'url(' + _fn.data.targetImg + ') no-repeat');
            },

            finish: function() {
                // Disable any decoy items
                _fn.$items.draggable('disable');

                // Show final feedback
                _fn.feedback.set(_fn.data.feedback.finish);
            },

            clickHandlers: {
                init: function($drag, $dropzone) {
                    var clk = _fn.clickHandlers;

                    $drag.on('dragstart', clk.drag.start);
                    $drag.on('dragstop', clk.drag.stop);

                    $dropzone.on('drop', clk.drop.success);
                    $dropzone.on('dropover', clk.drop.hover.in);
                    $dropzone.on('dropout', clk.drop.hover.out);
                },
                drag: {
                    start: function(event, ui) {
                        $(event.currentTarget).removeClass('within-dropzone fade');
                    },

                    stop: function(event, ui) {
                        var $el = $(event.currentTarget),
                            val = $el.data('value'),
                            zone = $el.data('zone') || null;

                        if ($el.hasClass('within-dropzone') && _fn.test.match(val, zone)) {
                            $el.removeClass('hover')
                                .draggable('disable');

                            _fn.test.completed++;
                            _fn.feedback.popup(_fn.feedback.get(val, true), true);

                            if (_fn.items.allSubmitted()) {
                                _fn.finish();
                            }
                        } else {
                            // Return to original position
                            _fn.clickHandlers.drag.reset($el);
                            _fn.feedback.popup(_fn.feedback.get(val, false), false);
                        }
                    },

                    reset: function($el) {
                        $el.removeClass('within-dropzone fade hover')
                            .css({
                                top: '',
                                left: ''
                            });
                    }
                },
                drop: {
                    hover: {
                        in: function(event, ui) {
                            var zone = $(event.currentTarget).data('zone');

                            ui.draggable.addClass('hover').data('zone', zone);
                        },
                        out: function(event, ui) {
                            ui.draggable.removeClass('hover');
                        }
                    },
                    success: function(event, ui) {
                        ui.draggable.addClass('within-dropzone');
                    }
                }
            },

            items: {
                count: 0,
                init: function() {
                    var items = _fn.data.items,
                        i,
                        len = items.length,
                        total = 0;

                    for (i=0; i<len; i++) {
                        if (items[i].zone !== 'none') {
                            total++;
                        }
                    }

                    _fn.items.count = total;
                },
                allSubmitted: function() {
                    return _fn.test.completed === _fn.items.count;
                },
                draw: function() {
                    var list = [],
                        items = _fn.data.items,
                        tpl = _fn.tpl.item(),
                        img_tpl = _fn.tpl.image_item();

                    _.each(items, function(item) {
                        if (item.backgroundImage.length > 0) {
                            list.push(_.template(img_tpl, item));
                        } else {
                            list.push(_.template(tpl, item));
                        }
                    });

                    // Update DOM
                    _fn.$ul.html(list.join(''));

                    // Set variable
                    _fn.$items = $('.xblock--drag-and-drop .items .option');
                }
            },

            zones: {
                draw: function() {
                    var html = [],
                        zones = _fn.data.zones,
                        tpl = _fn.tpl.zoneElement(),
                        i,
                        len = zones.length;

                    for (i=0; i<len; i++) {
                        html.push(_.template(tpl, zones[i]));
                    }

                    // Update DOM
                    _fn.$target.html(html.join(''));

                    // Set variable
                    _fn.$zones = _fn.$target.find('.zone');
                }
            },

            test: {
                completed: 0,
                match: function(id, zone) {
                    var item = _.findWhere(_fn.data.items, { id: id });

                    return item.zone === zone;
                }
            },

            feedback: {
                // Returns string based on user's answer
                get: function(id, boo) {
                    var item,
                        type = boo ? 'correct' : 'incorrect';

                    // Null loses its string-ness
                    if (id === null) {
                        id = 'null';
                    }

                    // Get object from data.items that matches val
                    item = _.findWhere(_fn.data.items, { id: id });

                    return item.feedback[type];
                },

                // Update DOM with feedback
                set: function(str) {
                    return _fn.$feedback.html(str);
                },

                // Show a feedback popup
                popup: function(str, boo) {
                    if (str === undefined || str === '') return;
                    return $("<div>").attr('title', boo ? 'Correct' : 'Incorrect')
                                     .text(str)
                                     .dialog({
                                       dialogClass: "no-close",
                                       modal: true,
                                       buttons: {
                                         Ok: function() {
                                           $(this).dialog("close");
                                         }
                                       }
                                     });
                }
            },

            data: null
        };

        return {
            init: _fn.init,
        };
    })(jQuery);

    $.ajax(runtime.handlerUrl(element, 'get_data')).done(function(data){
        dragAndDrop.init(data);
    });
}
