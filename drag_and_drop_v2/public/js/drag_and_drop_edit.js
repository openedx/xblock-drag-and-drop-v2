function DragAndDropEditBlock(runtime, element, params) {

    // Set up gettext in case it isn't available in the client runtime:
    if (typeof gettext == "undefined") {
        window.gettext = function gettext_stub(string) { return string; };
    }

    // Make gettext available in Handlebars templates
    Handlebars.registerHelper('i18n', function(str) { return gettext(str); });
    // Numeric rounding in Handlebars templates
    Handlebars.registerHelper('singleDecimalFloat', function(value) {
        if (value === "" || isNaN(Number(value))) {
            return "";
        }
        return Number(value).toFixed(Number(value) == parseInt(value) ? 0 : 1);
    });
    Handlebars.registerHelper('ifeq', function(v1, v2, options) {
      if (v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    var $element = $(element);

    var dragAndDrop = (function($) {
        var _fn = {
            // Templates
            tpl: {
                init: function() {
                    _fn.tpl = {
                        zoneInput: Handlebars.compile($(".zone-input-tpl", element).html()),
                        zoneElement: Handlebars.compile($(".zone-element-tpl", element).html()),
                        zoneCheckbox: Handlebars.compile($(".zone-checkbox-tpl", element).html()),
                        itemInput: Handlebars.compile($(".item-input-tpl", element).html()),
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

                    // Hide settings that are specific to assessment mode
                    _fn.build.$el.feedback.form.find('.problem-mode').trigger('change');

                    // Set focus on first input field.
                    $element.find('input:first').select();
                },

                validate: function() {
                    var fields = $element.find('.tab').not('.hidden').find('input, textarea');
                    var success = true;
                    fields.each(function(index, field) {
                        field = $(field);
                        // Right now our only check is if a field is set or not.
                        field.removeClass('field-error');
                        if (! field[0].checkValidity()) {
                            field.addClass('field-error');
                            success = false;
                        }
                    });
                    if (! success) {
                        runtime.notify('error', {
                            'title': window.gettext("There was an error with your form."),
                            'message': window.gettext("Please check over your submission.")
                        });
                    }
                    return success
                },

                scrollToTop: function() {
                    $('.drag-builder', element).scrollTop(0);
                },

                clickHandlers: function() {
                    var $fbkTab = _fn.build.$el.feedback.tab,
                        $zoneTab = _fn.build.$el.zones.tab,
                        $itemTab = _fn.build.$el.items.tab;

                    var self = this;

                    $element.one('click', '.continue-button', function loadSecondTab(e) {
                        // $fbkTab -> $zoneTab

                        e.preventDefault();

                        if (!self.validate()) {
                            $(e.target).one('click', loadSecondTab);
                            return
                        }

                        _fn.build.form.feedback(_fn.build.$el.feedback.form);
                        for (var i = 0; i < _fn.data.zones.length; i++) {
                            _fn.build.form.zone.add(_fn.data.zones[i]);
                        }
                        if (_fn.data.zones.length === 0) {
                            _fn.build.form.zone.add();
                        }

                        // Set the target image and bind its event handler:
                        $('.target-image-form .background-url', element).val(_fn.data.targetImg);
                        $('.target-image-form .background-description', element).val(_fn.data.targetImgDescription);
                        _fn.build.$el.targetImage.load(_fn.build.form.zone.imageLoaded);
                        _fn.build.$el.targetImage.attr('src', params.target_img_expanded_url);
                        _fn.build.$el.targetImage.attr('alt', _fn.data.targetImgDescription);

                        if (_fn.data.displayLabels) {
                            $('.display-labels-form input', element).prop('checked', true);
                        }

                        if (_fn.data.displayBorders) {
                            $('.display-borders-form input', element).prop('checked', true);
                        }

                        $fbkTab.addClass('hidden');
                        $zoneTab.removeClass('hidden');
                        self.scrollToTop();
                        $zoneTab.find('input:first').select();

                        $(this).one('click', function loadThirdTab(e) {
                            // $zoneTab -> $itemTab
                            e.preventDefault();

                            if (!self.validate()) {
                                $(e.target).one('click', loadThirdTab);
                                return
                            }

                            for (var i = 0; i < _fn.data.items.length; i++) {
                                _fn.build.form.item.add(_fn.data.items[i]);
                            }
                            if (_fn.data.items.length === 0) {
                                _fn.build.form.item.add();
                            }

                            $zoneTab.addClass('hidden');
                            $itemTab.removeClass('hidden');
                            self.scrollToTop();
                            $itemTab.find('input:first').select();

                            $(this).addClass('hidden');
                            $('.save-button', element).parent()
                                .removeClass('hidden')
                                .on('click', function submitForm(e) {
                                    // $itemTab -> submit

                                    e.preventDefault();
                                    _fn.build.form.submit();
                                });
                        });
                    });

                    $fbkTab
                        .on('change', '.problem-mode', _fn.build.form.problem.toggleAssessmentSettings);

                    $zoneTab
                        .on('click', '.add-zone', function(e) {
                            _fn.build.form.zone.add();
                            // Set focus to first field of the new zone.
                            $('.zones-form .zone-row:last input[type=text]:first', element).select();
                        })
                        .on('click', '.remove-zone', _fn.build.form.zone.remove)
                        .on('input', '.zone-row input', _fn.build.form.zone.changedInputHandler)
                        .on('change', '.zone-align-select', _fn.build.form.zone.changedInputHandler)
                        .on('click', '.target-image-form button', function(e) {
                            var new_img_url = $.trim($('.target-image-form .background-url', element).val());
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
                        })
                        .on('input', '.target-image-form .background-description', function(e) {
                            var new_description = $.trim(
                                $('.target-image-form .background-description', element).val()
                            );
                            _fn.build.$el.targetImage.attr('alt', new_description);
                            _fn.data.targetImgDescription = new_description;
                        })
                        .on('click', '.display-labels-form input', function(e) {
                            _fn.data.displayLabels = $('.display-labels-form input', element).is(':checked');
                        })
                        .on('click', '.display-borders-form input', function(e) {
                            _fn.data.displayBorders = $('.display-borders-form input', element).is(':checked');
                        });

                    $itemTab
                        .on('click', '.add-item', function(e) {
                            _fn.build.form.item.add();
                            // Set focus to first field of the new item.
                            $('.items-form .item:last input[type=text]:first', element).select();
                        })
                        .on('click', '.remove-item', _fn.build.form.item.remove)
                        .on('click', '.advanced-link button', _fn.build.form.item.showAdvancedSettings)
                        .on('input', '.item-image-url', _fn.build.form.item.imageURLChanged);
                },
                form: {
                    problem: {
                        toggleAssessmentSettings: function(e) {
                            e.preventDefault();
                            var $modeSetting = $(e.currentTarget),
                                $problemForm = $modeSetting.closest('form'),
                                $assessmentSettings = $problemForm.find('.assessment-setting');
                            if ($modeSetting.val() === 'assessment') {
                                $assessmentSettings.show();
                            } else {
                                $assessmentSettings.hide();
                            }
                        }
                    },
                    zone: {
                        totalZonesCreated: 0, // This counter is used for HTML IDs. Never decremented.
                        zoneObjects: [],
                        getZoneObjByUID: function(uid) {
                            for (var i = 0; i < _fn.build.form.zone.zoneObjects.length; i++) {
                                if (_fn.build.form.zone.zoneObjects[i].uid == uid) {
                                    return _fn.build.form.zone.zoneObjects[i];
                                }
                            }
                        },
                        add: function(oldZone) {
                            if (!oldZone) oldZone = {};
                            var num = _fn.build.form.zone.zoneObjects.length + 1;

                            // Update zone obj
                            var zoneObj = {
                                title: oldZone.title || 'Zone ' + num,
                                description: oldZone.description,
                                // uid: unique ID for this zone. For backwards compatibility,
                                // this field cannot be called "id" and must inherit the "title"
                                // property if no 'uid' value is present, since old versions of
                                // this block used the title as the primary identifier.
                                uid: oldZone.uid || oldZone.title || _fn.build.form.zone.generateUID(),
                                width: oldZone.width || 200,
                                height: oldZone.height || 100,
                                x: oldZone.x || 0,
                                y: oldZone.y || 0,
                                align: oldZone.align || ''
                            };

                            _fn.build.form.zone.zoneObjects.push(zoneObj);

                            // Add fields to zone form
                            $zoneNode = $(_fn.tpl.zoneInput({
                                zone: zoneObj,
                                index: _fn.build.form.zone.totalZonesCreated++,
                            }));
                            _fn.build.$el.zones.form.append($zoneNode);
                            _fn.build.form.zone.enableDelete();

                            // Add zone div to target
                            _fn.build.form.zone.renderZonesPreview();

                        },
                        generateUID: function() {
                            // Generate a unique ID for a new zone.
                            for (var i = 1; true; i++) {
                                var uid = "zone-" + i;
                                if (!_fn.build.form.zone.getZoneObjByUID(uid)) {
                                    return uid;
                                }
                            }
                        },
                        remove: function(e) {
                            var $el = $(e.currentTarget).closest('.zone-row'),
                                classes = $el.attr('class'),
                                id = classes.slice(classes.indexOf('zone-row') + 9),
                                uid = String($el.data('uid')),  // cast to string since UID must be string but .data() converts data-uid="5" to 5
                                array_index;

                            $el.detach();

                            // Find the uid of the zone in the array and remove it.
                            for (array_index = 0; array_index < _fn.build.form.zone.zoneObjects.length;
                                 array_index++) {
                                if (_fn.build.form.zone.zoneObjects[array_index].uid == uid) break;
                            }
                            _fn.build.form.zone.zoneObjects.splice(array_index, 1);
                            _fn.build.form.zone.renderZonesPreview();

                            _fn.build.form.zone.disableDelete();

                        },
                        enableDelete: function() {
                            if (_fn.build.form.zone.zoneObjects.length > 1) {
                                _fn.build.$el.zones.form.find('.remove-zone').removeClass('hidden');
                            }
                        },
                        disableDelete: function() {
                            if (_fn.build.form.zone.zoneObjects.length === 1) {
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
                                        uid: zoneObj.uid,
                                        title: zoneObj.title,
                                        description: zoneObj.description,
                                        x_percent: (+zoneObj.x) / imgWidth * 100,
                                        y_percent: (+zoneObj.y) / imgHeight * 100,
                                        width_percent: (+zoneObj.width) / imgWidth * 100,
                                        height_percent: (+zoneObj.height) / imgHeight * 100,
                                        align: zoneObj.align
                                    })
                                );
                            });
                        },

                        changedInputHandler: function(ev) {
                            // Called when any of the inputs have changed.
                            var $changedInput = $(ev.currentTarget);
                            var $row = $changedInput.closest('.zone-row');
                            var record = _fn.build.form.zone.getZoneObjByUID(String($row.data('uid')));
                            if ($changedInput.hasClass('zone-title')) {
                                record.title = $changedInput.val();
                            } else if ($changedInput.hasClass('zone-width')) {
                                record.width = $changedInput.val();
                            } else if ($changedInput.hasClass('zone-description')) {
                                record.description = $changedInput.val();
                            } else if ($changedInput.hasClass('zone-height')) {
                                record.height = $changedInput.val();
                            } else if ($changedInput.hasClass('zone-x')) {
                                record.x = $changedInput.val();
                            } else if ($changedInput.hasClass('zone-y')) {
                                record.y = $changedInput.val();
                            } else if ($changedInput.hasClass('zone-align-select')) {
                                record.align = $changedInput.val();
                            }
                            _fn.build.form.zone.renderZonesPreview();
                        },
                        imageLoaded: function() {
                            // The target background image has loaded (or reloaded, if changed).
                            _fn.build.form.zone.renderZonesPreview();
                        },
                    },
                    createCheckboxes: function(selectedZones) {
                        var template = _fn.tpl.zoneCheckbox;
                        var checkboxes = [];
                        var zoneObjects = _fn.build.form.zone.zoneObjects;

                        zoneObjects.forEach(function(zoneObj) {
                            checkboxes.push(template({
                                zoneUid: zoneObj.uid,
                                title: zoneObj.title,
                                checked: $.inArray(zoneObj.uid, selectedZones) !== -1 ? 'checked' : '',
                            }));
                        });

                        var html = checkboxes.join('');
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
                        add: function(itemData) {
                            var $form = _fn.build.$el.items.form,
                                tpl = _fn.tpl.itemInput,
                                ctx = {};

                            if (itemData) {
                                ctx = itemData;
                                if (itemData.backgroundImage && !ctx.imageURL) {
                                    ctx.imageURL = itemData.backgroundImage; // This field was renamed.
                                }
                                if (itemData.size && parseInt(itemData.size.width) > 0) {
                                    // Convert old fixed pixel width setting values (hard to
                                    // make mobile friendly) to new percentage format.
                                    // Note itemData.size.width is a string like "380px" (it can
                                    // also be "auto" but that's excluded by the if condition above)
                                    var bgImgWidth = _fn.build.$el.targetImage[0].naturalWidth;
                                    if (bgImgWidth > 0 && typeof ctx.widthPercent === "undefined") {
                                        ctx.widthPercent = parseInt(itemData.size.width) / bgImgWidth * 100;
                                    }
                                    // Preserve the old-style data in case we need it again:
                                    ctx.pixelWidth = itemData.size.width.substr(0, itemData.size.width.length - 2); // Remove 'px'
                                }
                                if (itemData.size && parseInt(itemData.size.height) > 0) {
                                    // Item fixed pixel height is ignored in new versions of the
                                    // block, but preserve the data in case we need it again:
                                    ctx.pixelHeight = itemData.size.height.substr(0, itemData.size.height.length - 2); // Remove 'px'
                                }
                            }
                            ctx.checkboxes = _fn.build.form.createCheckboxes(ctx.zones);

                            ctx.index = _fn.build.form.item.count++;
                            $form.append(tpl(ctx));
                            _fn.build.form.item.enableDelete();

                        },
                        remove: function(e) {
                            var $el = $(e.currentTarget).closest('.item');

                            $el.detach();

                            _fn.build.form.item.count--;
                            _fn.build.form.item.disableDelete();

                        },
                        imageURLChanged: function(e) {
                            // Mark the image description field as required if (and only if) an image is specified.
                            var $imageUrlField = $(e.currentTarget);
                            var $descriptionField = $imageUrlField.closest('.item').find('.item-image-description');
                            $descriptionField.prop("required", $imageUrlField.val() != "");
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
                        },
                        showAdvancedSettings: function(e) {
                            var $el = $(e.currentTarget).closest('.item');
                            $el.find('.row.advanced').show();
                            $el.find('.row.advanced-link').hide();
                        },
                    },
                    submit: function() {
                        var items = [],
                            $form = _fn.build.$el.items.form.find('.item');

                        $form.each(function(i, el) {
                            var $el = $(el),
                                name = $el.find('.item-text').val(),
                                imageURL = $el.find('.item-image-url').val(),
                                imageDescription = $el.find('.item-image-description').val(),
                                selectedZones = $el.find('.zone-checkbox:checked');

                            if (name.length > 0 || imageURL.length > 0) {
                                var data = {
                                    displayName: name,
                                    zones: $.map(selectedZones, function(checkbox){
                                        return checkbox.value;
                                    }),
                                    id: i,
                                    feedback: {
                                        correct: $el.find('.success-feedback').val(),
                                        incorrect: $el.find('.error-feedback').val()
                                    },
                                    imageURL: imageURL,
                                    imageDescription: imageDescription,
                                };
                                // Optional preferred width as a percentage of the bg image's width:
                                var widthPercent = $el.find('.item-width').val();
                                if (widthPercent && +widthPercent > 0) { data.widthPercent = widthPercent; }

                                items.push(data);
                            }
                        });

                        _fn.data.items = items;
                        _fn.data.zones = _fn.build.form.zone.zoneObjects;

                        var data = {
                            'display_name': $element.find('.display-name').val(),
                            'mode': $element.find(".problem-mode").val(),
                            'max_attempts': $element.find(".max-attempts").val(),
                            'show_title': $element.find('.show-title').is(':checked'),
                            'weight': $element.find('.weight').val(),
                            'problem_text': $element.find('.problem-text').val(),
                            'show_problem_header': $element.find('.show-problem-header').is(':checked'),
                            'item_background_color': $element.find('.item-background-color').val(),
                            'item_text_color': $element.find('.item-text-color').val(),
                            'max_items_per_zone': $element.find('.max-items-per-zone').val(),
                            'data': _fn.data,
                        };

                        var handlerUrl = runtime.handlerUrl(element, 'studio_submit');
                        runtime.notify('save', {state: 'start', message: gettext("Saving")});
                        $.post(handlerUrl, JSON.stringify(data), 'json').done(function(response) {
                            if (response.result === 'success') {
                                runtime.notify('save', {state: 'end'});
                            } else {
                                var message = response.messages.join(", ");
                                runtime.notify('error', {
                                    'title': window.gettext("There was an error with your form."),
                                    'message': message
                                });
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
