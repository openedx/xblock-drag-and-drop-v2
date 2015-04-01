function DragAndDropEditBlock(runtime, element) {
    var dragAndDrop = (function($) {
        var _fn = {

            // DOM Elements
            $target: $('.xblock--drag-and-drop .target-img', element),

            tpl: {
                init: function() {
                    _fn.tpl = {
                        zoneInput: Handlebars.compile($("#zone-input-tpl", element).html()),
                        zoneElement: Handlebars.compile($("#zone-element-tpl", element).html()),
                        zoneDropdown: Handlebars.compile($("#zone-dropdown-tpl", element).html()),
                        itemInput: Handlebars.compile($("#item-input-tpl", element).html()),
                    };
                }
            },

            build: {
                $el: {
                    feedback: {
                        form: $('.xblock--drag-and-drop .drag-builder .feedback-form', element),
                        tab: $('.xblock--drag-and-drop .drag-builder .feedback-tab', element)
                    },
                    zones: {
                        form: $('.xblock--drag-and-drop .drag-builder .zones-form', element),
                        tab: $('.xblock--drag-and-drop .drag-builder .zones-tab', element)
                    },
                    items: {
                        form: $('.xblock--drag-and-drop .drag-builder .items-form', element),
                        tab: $('.xblock--drag-and-drop .drag-builder .items-tab', element)
                    },
                    target: $('.xblock--drag-and-drop .drag-builder .target-img', element)
                },
                init: function(data) {
                    _fn.data = data;

                    // Compile templates
                    _fn.tpl.init();

                    // Display target image
                    _fn.$target.show();

                    _fn.build.clickHandlers();
                },
                clickHandlers: function() {
                    var $fbkTab = _fn.build.$el.feedback.tab,
                        $zoneTab = _fn.build.$el.zones.tab,
                        $itemTab = _fn.build.$el.items.tab;

                    $(element).one('click', '.continue-button', function(e) {
                        // $fbkTab -> $zoneTab

                        e.preventDefault();
                        _fn.build.form.feedback(_fn.build.$el.feedback.form);
                        for (var i = 0; i < _fn.data.zones.length; i++) {
                            _fn.build.form.zone.add(_fn.data.zones[i]);
                        }
                        if (_fn.data.zones.length === 0) {
                            _fn.build.form.zone.add();
                        }

                        if (_fn.data.targetImg) {
                            _fn.$target.css('background', 'url(' + _fn.data.targetImg + ') no-repeat');
                        }

                        if (_fn.data.displayLabels) {
                            $('.display-labels-form input', element).prop('checked', true);
                        }

                        $fbkTab.addClass('hidden');
                        $zoneTab.removeClass('hidden');

                        // Placeholder shim for IE9
                        $.placeholder.shim();

                        $(this).one('click', function(e) {
                            // $zoneTab -> $itemTab
                            e.preventDefault();
                            _fn.build.form.zone.setAll();
                            for (var i = 0; i < _fn.data.items.length; i++) {
                                _fn.build.form.item.add(_fn.data.items[i]);
                            }
                            if (_fn.data.items.length === 0) {
                                _fn.build.form.item.add();
                            }

                            $zoneTab.addClass('hidden');
                            $itemTab.removeClass('hidden');

                            // Placeholder shim for IE9
                            $.placeholder.shim();

                            $(this).addClass('hidden');
                            $('.save-button', element).parent()
                                .removeClass('hidden')
                                .one('click', function(e) {
                                    // $itemTab -> submit

                                    e.preventDefault();
                                    _fn.build.form.submit();
                                });
                        });
                    });

                    $zoneTab
                        .on('click', '.add-zone', function(e) {
                            _fn.build.form.zone.add();
                        })
                        .on('click', '.remove-zone', _fn.build.form.zone.remove)
                        .on('click', '.target-image-form button', function(e) {
                            e.preventDefault();

                            _fn.data.targetImg = $('.target-image-form input', element).val();
                            _fn.$target.css('background', 'url(' + _fn.data.targetImg + ') no-repeat');

                            // Placeholder shim for IE9
                            $.placeholder.shim();
                        })
                        .on('click', '.display-labels-form input', function(e) {
                            _fn.data.displayLabels = $('.display-labels-form input', element).is(':checked');
                        });

                    $itemTab
                        .on('click', '.add-item', function(e) {
                            _fn.build.form.item.add();
                        })
                        .on('click', '.remove-item', _fn.build.form.item.remove);
                },
                form: {
                    zone: {
                        count: 0,
                        formCount: 0,
                        list: [],
                        obj: [],
                        getObjByIndex: function(num) {
                            for (var i = 0; i < _fn.build.form.zone.obj.length; i++) {
                                if (_fn.build.form.zone.obj[i].index == num)
                                    return _fn.build.form.zone.obj[i];
                            }
                        },
                        add: function(oldZone) {
                            var inputTemplate = _fn.tpl.zoneInput,
                                zoneTemplate = _fn.tpl.zoneElement,
                                name = 'zone-',
                                $elements = _fn.build.$el,
                                num,
                                zoneObj;

                            if (!oldZone) oldZone = {};

                            _fn.build.form.zone.count++;
                            _fn.build.form.zone.formCount++;
                            num = _fn.build.form.zone.count;
                            name += num;

                            // Update zone obj
                            zoneObj = {
                                title: oldZone.title || 'Zone ' + num,
                                id: name,
                                index: num,
                                width: oldZone.width || 200,
                                height: oldZone.height || 100,
                                x: oldZone.x || 0,
                                y: oldZone.y || 0
                            };

                            _fn.build.form.zone.obj.push(zoneObj);

                            // Add fields to zone position form
                            $zoneNode = $(inputTemplate(zoneObj));
                            $zoneNode.data('index', num);
                            $elements.zones.form.append($zoneNode);
                            _fn.build.form.zone.enableDelete();

                            // Add zone div to target
                            $elements.target.append(zoneTemplate(zoneObj));

                            // Listen to changes in form to update zone div
                            _fn.build.form.zone.clickHandler(num);

                            // Placeholder shim for IE9
                            $.placeholder.shim();
                        },
                        remove: function(e) {
                            var $el = $(e.currentTarget).closest('.zone-row'),
                                classes = $el.attr('class'),
                                id = classes.slice(classes.indexOf('zone-row') + 9),
                                index = $el.data('index'),
                                array_index;

                            e.preventDefault();
                            $el.detach();
                            $('#' + id, element).detach();

                            // Find the index of the zone in the array and remove it.
                            for (array_index = 0; array_index < _fn.build.form.zone.obj.length;
                                 array_index++) {
                                if (_fn.build.form.zone.obj[array_index].index == index) break;
                            }
                            _fn.build.form.zone.obj.splice(array_index, 1);

                            _fn.build.form.zone.formCount--;
                            _fn.build.form.zone.disableDelete();

                            // Placeholder shim for IE9
                            $.placeholder.shim();
                        },
                        enableDelete: function() {
                            if (_fn.build.form.zone.formCount > 1) {
                                _fn.build.$el.zones.form.find('.remove-zone').removeClass('hidden');
                            }
                        },
                        disableDelete: function() {
                            if (_fn.build.form.zone.formCount === 1) {
                                _fn.build.$el.zones.form.find('.remove-zone').addClass('hidden');
                            }
                        },
                        setAll: function() {
                            var zones = [],
                                $form = _fn.build.$el.zones.form.find('.title');

                            $form.each(function(i, el) {
                                var val = $(el).val();

                                if (val.length > 0) {
                                    zones.push(val);
                                }
                            });

                            _fn.build.form.zone.list = zones;
                        },
                        clickHandler: function(num) {
                            var $div = $('#zone-' + num, element),
                                $form = _fn.build.$el.zones.form.find('.zone-row.zone-' + num);

                            // Listen to form changes and update zone div position
                            $form.on('keyup', '.title', function(e) {
                                    var text = $(e.currentTarget).val(),
                                        record = _fn.build.form.zone.getObjByIndex(num);

                                    $div.find('p').html(text);
                                    record.title = text;
                                }).on('keyup', '.width', function(e) {
                                    var width = $(e.currentTarget).val(),
                                        record = _fn.build.form.zone.getObjByIndex(num);

                                    $div.css('width', width + 'px');
                                    record.width = width;
                                }).on('keyup', '.height', function(e) {
                                    var height = $(e.currentTarget).val(),
                                        record = _fn.build.form.zone.getObjByIndex(num);

                                    $div.css('height', height + 'px');
                                    record.height = height;
                                }).on('keyup', '.x', function(e) {
                                    var x = $(e.currentTarget).val(),
                                        record = _fn.build.form.zone.getObjByIndex(num);

                                    $div.css('left', x + 'px');
                                    record.x = x;
                                }).on('keyup', '.y', function(e) {
                                    var y = $(e.currentTarget).val(),
                                        record = _fn.build.form.zone.getObjByIndex(num);

                                    $div.css('top', y + 'px');
                                    record.y = y;
                                });
                        },
                        cleanObject: function(arr) {
                            var clean = [],
                                i,
                                len = arr.length;

                            for (i=0; i<len; i++) {
                                clean.push(arr[i]);
                            }

                            return clean;
                        }
                    },
                    createDropdown: function(selected) {
                        var tpl = _fn.tpl.zoneDropdown,
                            i,
                            is_sel,
                            arr = _fn.build.form.zone.list,
                            dropdown = [],
                            html,
                            dropdown_items = arr.concat('none');

                        for (i=0; i<dropdown_items.length; i++) {
                            is_sel = (dropdown_items[i] == selected) ? 'selected' : '';
                            dropdown.push(tpl({ value: dropdown_items[i], selected: is_sel }));
                        }

                        html = dropdown.join('');
                        return new Handlebars.SafeString(html);
                    },
                    feedback: function($form) {
                        _fn.data.feedback = {
                            start: $form.find('.intro-feedback').val(),
                            finish: $form.find('.final-feedback').val()
                        };
                    },
                    item: {
                        count: 0,
                        add: function(oldItem) {
                            var $form = _fn.build.$el.items.form,
                                tpl = _fn.tpl.itemInput,
                                ctx = {};

                            if (oldItem) ctx = oldItem;

                            ctx.dropdown = _fn.build.form.createDropdown(ctx.zone);

                            if (!oldItem) ctx.width = '190';
                            else ctx.width = oldItem.size.width.substr(0,
                                oldItem.size.width.length - 2);
                            if (ctx.width == 'au') ctx.width = '0';

                            if (!oldItem) ctx.height = '0';
                            else ctx.height = oldItem.size.height.substr(0,
                                oldItem.size.height.length - 2);
                            if (ctx.height == 'au') ctx.height = '0';

                            if (oldItem && oldItem.inputOptions) {
                                ctx.numericalValue = oldItem.inputOptions.value;
                                ctx.numericalMargin = oldItem.inputOptions.margin;
                            }

                            _fn.build.form.item.count++;
                            $form.append(tpl(ctx));
                            _fn.build.form.item.enableDelete();

                            // Placeholder shim for IE9
                            $.placeholder.shim();
                        },
                        remove: function(e) {
                            var $el = $(e.currentTarget).closest('.item');

                            e.preventDefault();
                            $el.detach();

                            _fn.build.form.item.count--;
                            _fn.build.form.item.disableDelete();

                            // Placeholder shim for IE9
                            $.placeholder.shim();
                        },
                        enableDelete: function() {
                            if (_fn.build.form.item.count > 1) {
                                _fn.build.$el.items.form.find('.remove-item').removeClass('hidden');
                            }
                        },
                        disableDelete: function() {
                            if (_fn.build.form.item.count === 1) {
                                _fn.build.$el.items.form.find('.remove-item').addClass('hidden');
                            }
                        }
                    },
                    submit: function() {
                        var items = [],
                            $form = _fn.build.$el.items.form.find('.item');

                        $form.each(function(i, el) {
                            var $el = $(el),
                                name = $el.find('.item-text').val(),
                                backgroundImage = $el.find('.background-image').val();

                            if (name.length > 0 || backgroundImage.length > 0) {
                                var width = $el.find('.item-width').val(),
                                    height = $el.find('.item-height').val();

                                if (height === '0') height = 'auto';
                                else height = height + 'px';

                                if (width === '0') width = 'auto';
                                else width = width + 'px';

                                var data = {
                                    displayName: name,
                                    zone: $el.find('.zone-select').val(),
                                    id: i,
                                    feedback: {
                                        correct: $el.find('.success-feedback').val(),
                                        incorrect: $el.find('.error-feedback').val()
                                    },
                                    size: {
                                        width: width,
                                        height: height
                                    },
                                    backgroundImage: backgroundImage
                                };

                                var numValue = parseFloat($el.find('.item-numerical-value').val());
                                var numMargin = parseFloat($el.find('.item-numerical-margin').val());
                                if (isFinite(numValue)) {
                                    data.inputOptions = {
                                        value: numValue,
                                        margin: isFinite(numMargin) ? numMargin : 0
                                    }
                                }

                                items.push(data);
                            }
                        });

                        _fn.data.items = items;
                        _fn.data.zones = _fn.build.form.zone.cleanObject(_fn.build.form.zone.obj);

                        var data = {
                            'display_name': $(element).find('.display-name').val(),
                            'weight': $(element).find('.weight').val(),
                            'question_text': $(element).find('.question-text').val(),
                            'data': _fn.data,
                        };

                        $('.xblock-editor-error-message', element).html();
                        $('.xblock-editor-error-message', element).css('display', 'none');
                        var handlerUrl = runtime.handlerUrl(element, 'studio_submit');
                        $.post(handlerUrl, JSON.stringify(data), 'json').done(function(response) {
                            if (response.result === 'success') {
                                window.location.reload(false);
                            } else {
                                $('.xblock-editor-error-message', element).html('Error: '+response.message);
                                $('.xblock-editor-error-message', element).css('display', 'block');
                            }
                        });
                    }
                }
            },

            data: null
        };

        return {
            builder: _fn.build.init
        };
    })(jQuery);

    $(element).find('.cancel-button').bind('click', function() {
        runtime.notify('cancel', {});
    });

    dragAndDrop.builder(window.DragAndDropV2BlockPreviousData);
}
