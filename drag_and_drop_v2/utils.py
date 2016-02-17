# -*- coding: utf-8 -*-
#


# Make '_' a no-op so we can scrape strings
def _(text):
    print "********** DRAG AND DROP V2 UTILS TEXT WRAPPER: '{0}'**********".format(text)
    return text
