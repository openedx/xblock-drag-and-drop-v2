function DragAndDropEditBlock(runtime, element) {
    $(element).find('.save-button').bind('click', function() {
        var data = {
            'display_name': $(element).find('.edit-display-name').val(),
            'question_text': $(element).find('.edit-question-text').val(),
            'data': $(element).find('.edit-data').val()
        };

        $('.xblock-editor-error-message', element).html();
        $('.xblock-editor-error-message', element).css('display', 'none');
        var handlerUrl = runtime.handlerUrl(element, 'studio_submit');
        $.post(handlerUrl, JSON.stringify(data)).done(function(response) {
            if (response.result === 'success') {
                window.location.reload(false);
            } else {
                $('.xblock-editor-error-message', element).html('Error: '+response.message);
                $('.xblock-editor-error-message', element).css('display', 'block');
            }
        });
    });

    $(element).find('.cancel-button').bind('click', function() {
        runtime.notify('cancel', {});
    });
}
