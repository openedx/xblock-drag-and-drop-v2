# -*- coding: utf-8 -*-
""" Drag and Drop v2 XBlock - Utils """
from collections import namedtuple


def _(text):
    """ Dummy `gettext` replacement to make string extraction tools scrape strings marked for translation """
    return text


def ngettext_fallback(text_singular, text_plural, number):
    """ Dummy `ngettext` replacement to make string extraction tools scrape strings marked for translation """
    if number == 1:
        return text_singular
    else:
        return text_plural


class DummyTranslationService(object):
    """
    Dummy drop-in replacement for i18n XBlock service
    """
    gettext = _
    ngettext = ngettext_fallback


class FeedbackMessages(object):
    """
    Feedback messages collection
    """
    class MessageClasses(object):
        """
        Namespace for message classes
        """
        CORRECT_SOLUTION = "correct"
        PARTIAL_SOLUTION = "partial"
        INCORRECT_SOLUTION = "incorrect"

        CORRECTLY_PLACED = CORRECT_SOLUTION
        MISPLACED = INCORRECT_SOLUTION
        NOT_PLACED = INCORRECT_SOLUTION

    FINAL_ATTEMPT_TPL = _('Final attempt was used, highest score is {score}')
    MISPLACED_ITEMS_RETURNED = _('Misplaced item(s) were returned to item bank.')

    @staticmethod
    def correctly_placed(number, ngettext=ngettext_fallback):
        """
        Formats "correctly placed items" message
        """
        return ngettext(
            'Correctly placed {correct_count} item.',
            'Correctly placed {correct_count} items.',
            number
        ).format(correct_count=number)

    @staticmethod
    def misplaced(number, ngettext=ngettext_fallback):
        """
        Formats "misplaced items" message
        """
        return ngettext(
            'Misplaced {misplaced_count} item. Misplaced item was returned to item bank.',
            'Misplaced {misplaced_count} items. Misplaced items were returned to item bank.',
            number
        ).format(misplaced_count=number)

    @staticmethod
    def not_placed(number, ngettext=ngettext_fallback):
        """
        Formats "did not place required items" message
        """
        return ngettext(
            'Did not place {missing_count} required item.',
            'Did not place {missing_count} required items.',
            number
        ).format(missing_count=number)


FeedbackMessage = namedtuple("FeedbackMessage", ["message", "message_class"])  # pylint: disable=invalid-name
