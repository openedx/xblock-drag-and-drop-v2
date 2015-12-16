function DragAndDropEditBlock(runtime, element, params) {

    // Set up gettext in case it isn't available in the client runtime:
    if (typeof gettext == "undefined") {
        window.gettext = function gettext_stub(string) { return string; };
    }

    // Make gettext available in Handlebars templates
    Handlebars.registerHelper('i18n', function(str) { return gettext(str); });

    var $element = $(element);

    var dragAndDrop = (function($) {
        var _fn = {
            // Templates
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
                        form: $('.drag-builder .feedback-form', element),
                        tab: $('.drag-builder .feedback-tab', element)
                    },
                    zones: {
                        form: $('.drag-builder .zones-form', element),
                        tab: $('.drag-builder .zones-tab', element)
                    },
                    items: {
                        form: $('.drag-builder .items-form', element),
                        tab: $('.drag-builder .items-tab', element)
                    },
                    targetImage: $('.drag-builder .target .target-img', element),
                    zonesPreview: $('.drag-builder .target .zones-preview', element),
                },
                init: function() {
                    _fn.data = params.data;

                    // Compile templates
                    _fn.tpl.init();

                    // Display target image
                    _fn.build.$el.targetImage.show();

                    _fn.build.clickHandlers();
                },
                clickHandlers: function() {
                    var $fbkTab = _fn.build.$el.feedback.tab,
                        $zoneTab = _fn.build.$el.zones.tab,
                        $itemTab = _fn.build.$el.items.tab;

                    $element.one('click', '.continue-button', function(e) {
                        // $fbkTab -> $zoneTab

                        e.preventDefault();
                        _fn.build.form.feedback(_fn.build.$el.feedback.form);
                        for (var i = 0; i < _fn.data.zones.length; i++) {
                            _fn.build.form.zone.add(_fn.data.zones[i]);
                        }
                        if (_fn.data.zones.length === 0) {
                            _fn.build.form.zone.add();
                        }

                        // Set the target image and bind its event handler:
                        $('.target-image-form input', element).val(_fn.data.targetImg);
                        _fn.build.$el.targetImage.load(_fn.build.form.zone.imageLoaded);
                        _fn.build.$el.targetImage.attr('src', params.target_img_expanded_url);

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
                        .on('input', '.zone-row input', _fn.build.form.zone.changedInputHandler)
                        .on('click', '.target-image-form button', function(e) {
                            e.preventDefault();

                            var new_img_url = $.trim($('.target-image-form input', element).val());
                            if (new_img_url) {
                                // We may need to 'expand' the URL before it will be valid.
                                // e.g. '/static/blah.png' becomes '/asset-v1:course+id/blah.png'
                                var handlerUrl = runtime.handlerUrl(element, 'expand_static_url');
                                $.post(handlerUrl, JSON.stringify(new_img_url), function(result) {
                                    _fn.build.$el.targetImage.attr('src', result.url);
                                });
                            } else {
                                new_img_url = params.default_background_image_url;
                                _fn.build.$el.targetImage.attr('src', new_img_url);
                            }
                            _fn.data.targetImg = new_img_url;

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
                        zoneObjects: [],
                        getObjByIndex: function(num) {
                            for (var i = 0; i < _fn.build.form.zone.zoneObjects.length; i++) {
                                if (_fn.build.form.zone.zoneObjects[i].index == num)
                                    return _fn.build.form.zone.zoneObjects[i];
                            }
                        },
                        add: function(oldZone) {
                            var inputTemplate = _fn.tpl.zoneInput,
                                name = 'zone-',
                                $elements = _fn.build.$el,
                                num;

                            if (!oldZone) oldZone = {};

                            _fn.build.form.zone.count++;
                            _fn.build.form.zone.formCount++;
                            num = _fn.build.form.zone.count;
                            name += num;

                            // Update zone obj
                            var zoneObj = {
                                title: oldZone.title || 'Zone ' + num,
                                id: name,
                                index: num,
                                width: oldZone.width || 200,
                                height: oldZone.height || 100,
                                x: oldZone.x || 0,
                                y: oldZone.y || 0,
                            };

                            _fn.build.form.zone.zoneObjects.push(zoneObj);

                            // Add fields to zone position form
                            $zoneNode = $(inputTemplate(zoneObj));
                            $zoneNode.data('index', num);
                            $elements.zones.form.append($zoneNode);
                            _fn.build.form.zone.enableDelete();

                            // Add zone div to target
                            _fn.build.form.zone.renderZonesPreview();

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

                            // Find the index of the zone in the array and remove it.
                            for (array_index = 0; array_index < _fn.build.form.zone.zoneObjects.length;
                                 array_index++) {
                                if (_fn.build.form.zone.zoneObjects[array_index].index == index) break;
                            }
                            _fn.build.form.zone.zoneObjects.splice(array_index, 1);
                            _fn.build.form.zone.renderZonesPreview();

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
                        renderZonesPreview: function() {
                            // Refresh the div which shows a preview of the zones over top of
                            // the background image.
                            _fn.build.$el.zonesPreview.html('');
                            var imgWidth = _fn.build.$el.targetImage[0].naturalWidth;
                            var imgHeight = _fn.build.$el.targetImage[0].naturalHeight;
                            if (imgWidth == 0 || imgHeight == 0) {
                                // Set a non-zero value to avoid divide-by-zero:
                                imgWidth = imgHeight = 400;
                            }
                            this.zoneObjects.forEach(function(zoneObj) {
                                _fn.build.$el.zonesPreview.append(
                                    _fn.tpl.zoneElement({
                                        id: zoneObj.id,
                                        title: zoneObj.title,
                                        x_percent: (+zoneObj.x) / imgWidth * 100,
                                        y_percent: (+zoneObj.y) / imgHeight * 100,
                                        width_percent: (+zoneObj.width) / imgWidth * 100,
                                        height_percent: (+zoneObj.height) / imgHeight * 100,
                                    })
                                );
                            });
                        },
                        getZoneNames: function() {
                            var zoneNames = [];
                            var $form = _fn.build.$el.zones.form.find('.title');

                            $form.each(function(i, el) {
                                var val = $(el).val();
                                if (val.length > 0) {
                                    zoneNames.push(val);
                                }
                            });
                            return zoneNames;
                        },
                        changedInputHandler: function(ev) {
                            // Called when any of the inputs have changed.
                            var $changedInput = $(ev.currentTarget);
                            var $row = $changedInput.closest('.zone-row');
                            var record = _fn.build.form.zone.getObjByIndex($row.data('index'));
                            if ($changedInput.hasClass('title')) {
                                record.title = $changedInput.val();
                            } else if ($changedInput.hasClass('width')) {
                                record.width = $changedInput.val();
                            } else if ($changedInput.hasClass('height')) {
                                record.height = $changedInput.val();
                            } else if ($changedInput.hasClass('x')) {
                                record.x = $changedInput.val();
                            } else if ($changedInput.hasClass('y')) {
                                record.y = $changedInput.val();
                            }
                            _fn.build.form.zone.renderZonesPreview();
                        },
                        imageLoaded: function() {
                            // The target background image has loaded (or reloaded, if changed).
                            _fn.build.form.zone.renderZonesPreview();
                        },
                    },
                    createDropdown: function(selected) {
                        var tpl = _fn.tpl.zoneDropdown,
                            dropdown = [],
                            html,
                            dropdown_items = _fn.build.form.zone.getZoneNames().concat('none');

                        for (var i=0; i<dropdown_items.length; i++) {
                            var is_sel = (dropdown_items[i] == selected) ? 'selected' : '';
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

                            // Item width/height are ignored in new versions of the block, but
                            // preserve the data in case we change back to using those values.
                            if (oldItem && oldItem.size && oldItem.size.width != 'auto') {
                                ctx.width = oldItem.size.width.substr(0, oldItem.size.width.length - 2); // Remove 'px'
                            } else {
                                ctx.width = '0';
                            }
                            if (oldItem && oldItem.size && oldItem.size.height != 'auto') {
                                ctx.height = oldItem.size.height.substr(0, oldItem.size.height.length - 2); // Remove 'px'
                            } else {
                                ctx.height = '0';
                            }

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
                                // Item width/height are ignored, but preserve the data:
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
                        _fn.data.zones = _fn.build.form.zone.zoneObjects;

                        var data = {
                            'display_name': $element.find('.display-name').val(),
                            'show_title': $element.find('.show-title').is(':checked'),
                            'weight': $element.find('.weight').val(),
                            'question_text': $element.find('.question-text').val(),
                            'show_question_header': $element.find('.show-question-header').is(':checked'),
                            'item_background_color': $element.find('.item-background-color').val(),
                            'item_text_color': $element.find('.item-text-color').val(),
                            'data': _fn.data,
                        };

                        $('.xblock-editor-error-message', element).html();
                        $('.xblock-editor-error-message', element).css('display', 'none');
                        var handlerUrl = runtime.handlerUrl(element, 'studio_submit');
                        $.post(handlerUrl, JSON.stringify(data), 'json').done(function(response) {
                            if (response.result === 'success') {
                                window.location.reload(false);
                            } else {
                                $('.xblock-editor-error-message', element)
                                    .html(gettext('Error: ') + response.message);
                                $('.xblock-editor-error-message', element).css('display', 'block');
                            }
                        });
                    }
                }
            },

            data: null
        };

        return {
            init: _fn.build.init
        };
    })(jQuery);

    $element.find('.cancel-button').bind('click', function() {
        runtime.notify('cancel', {});
    });

    dragAndDrop.init();
}
