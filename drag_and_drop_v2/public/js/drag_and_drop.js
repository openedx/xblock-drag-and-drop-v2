function DragAndDropBlock(runtime, element) {
    var dragAndDrop = (function($) {
        var _fn = {

            // DOM Elements
            $ul: $('.xblock--drag-and-drop .items', element),
            $target: $('.xblock--drag-and-drop .target-img', element),
            $feedback: $('.xblock--drag-and-drop .feedback .message', element),

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

                // Init drag and drop plugin
                _fn.$items.draggable(_fn.options.drag);
                _fn.$zones.droppable(_fn.options.drop);

                // Init click handlers
                _fn.clickHandlers.init(_fn.$items, _fn.$zones);

                // Position the already correct items
                _fn.items.init();

                // Load welcome or final feedback
                if (_fn.data.feedback.finish)
                    _fn.finish(_fn.data.feedback.finish);
                else
                    _fn.feedback.set(_fn.data.feedback.start);

                // Set the target image
                if (_fn.data.targetImg)
                    _fn.$target.css('background', 'url(' + _fn.data.targetImg + ') no-repeat');
            },

            finish: function(final_feedback) {
                // Disable any decoy items
                _fn.$items.draggable('disable');

                // Show final feedback
                _fn.feedback.set(final_feedback);
            },

            clickHandlers: {
                init: function($drag, $dropzone) {
                    var clk = _fn.clickHandlers;

                    $drag.on('dragstart', clk.drag.start);
                    $drag.on('dragstop', clk.drag.stop);

                    $dropzone.on('drop', clk.drop.success);
                    $dropzone.on('dropover', clk.drop.hover);
                },
                drag: {
                    start: function(event, ui) {
                        $(event.currentTarget).removeClass('within-dropzone fade');
                    },

                    stop: function(event, ui) {
                        var $el = $(event.currentTarget),
                            val = $el.data('value'),
                            zone = $el.data('zone') || null;

                        if (!$el.hasClass('within-dropzone')) {
                            // Return to original position
                            _fn.clickHandlers.drag.reset($el);
                            return;
                        }

                        $.post(runtime.handlerUrl(element, 'do_attempt'),
                            JSON.stringify({
                                val: val,
                                zone: zone,
                                top: $el.css('top'),
                                left: $el.css('left')
                        })).done(function(data){
                            if (data.correct) {
                                $el.draggable('disable');

                                if (data.final_feedback) {
                                    _fn.finish(data.final_feedback);
                                }
                            } else {
                                // Return to original position
                                _fn.clickHandlers.drag.reset($el);
                            }

                            if (data.feedback) {
                                _fn.feedback.popup(data.feedback, data.correct);
                            }
                        });
                    },

                    set: function($el, top, left) {
                        $el.addClass('within-dropzone fade')
                            .css({
                                top: top,
                                left: left
                            })
                            .draggable('disable');
                    },

                    reset: function($el) {
                        $el.removeClass('within-dropzone fade')
                            .css({
                                top: '',
                                left: ''
                            });
                    }
                },
                drop: {
                    hover: function(event, ui) {
                        var zone = $(event.currentTarget).data('zone');
                        ui.draggable.data('zone', zone);
                    },
                    success: function(event, ui) {
                        ui.draggable.addClass('within-dropzone');
                    }
                }
            },

            items: {
                init: function() {
                    _fn.$items.each(function (){
                        var $el = $(this),
                            saved_entry = _fn.data.state[$el.data('value')];
                        if (saved_entry) {
                            _fn.clickHandlers.drag.set($el,
                                saved_entry[0], saved_entry[1]);
                        }
                    });
                },
                draw: function() {
                    var list = [],
                        items = _fn.data.items,
                        tpl = _fn.tpl.item(),
                        img_tpl = _fn.tpl.image_item();

                    items.forEach(function(item) {
                        if (item.backgroundImage.length > 0) {
                            list.push(_.template(img_tpl, item));
                        } else {
                            list.push(_.template(tpl, item));
                        }
                    });

                    // Update DOM
                    _fn.$ul.html(list.join(''));

                    // Set variable
                    _fn.$items = $('.xblock--drag-and-drop .items .option', element);
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

            feedback: {
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
