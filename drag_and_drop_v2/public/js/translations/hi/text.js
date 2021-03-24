
            (function(global){
                var DragAndDropI18N = {
                  init: function() {
                    

(function(globals) {

  var django = globals.django || (globals.django = {});

  
  django.pluralidx = function(n) {
    var v=(n != 1);
    if (typeof(v) == 'boolean') {
      return v ? 1 : 0;
    } else {
      return v;
    }
  };
  

  /* gettext library */

  django.catalog = django.catalog || {};
  
  var newcatalog = {
    "Cancel": "\u0930\u0926\u094d\u0926 \u0915\u0930\u0947\u0902",
    "Close": "\u092c\u0902\u0926 \u0915\u0930\u0947",
    "Continue": "\u091c\u093e\u0930\u0940 \u0930\u0916\u0947\u0902",
    "Correct": "\u0938\u0939\u0940",
    "Defines the number of times a student can try to answer this problem. If the value is not set, infinite attempts are allowed.": "\u0907\u0938 \u0938\u092e\u0938\u094d\u092f\u093e \u0915\u093e \u0909\u0924\u094d\u0924\u0930 \u0926\u0947\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u090f\u0915 \u091b\u093e\u0924\u094d\u0930 \u0915\u093f\u0924\u0928\u0940 \u092c\u093e\u0930 \u0915\u094b\u0936\u093f\u0936 \u0915\u0930 \u0938\u0915\u0924\u093e \u0939\u0948, \u0907\u0938\u0947 \u092a\u0930\u093f\u092d\u093e\u0937\u093f\u0924 \u0915\u0930\u0924\u093e \u0939\u0948\u0964 \u092f\u0926\u093f \u092e\u093e\u0928 \u0938\u0947\u091f \u0928\u0939\u0940\u0902 \u0939\u0948, \u0924\u094b \u0905\u0928\u0902\u0924 \u092a\u094d\u0930\u092f\u093e\u0938\u094b\u0902 \u0915\u0940 \u0905\u0928\u0941\u092e\u0924\u093f \u0939\u0948\u0964",
    "Drag the items onto the image above.": "\u090a\u092a\u0930 \u0915\u0940 \u091b\u0935\u093f \u092a\u0930 \u0906\u0907\u091f\u092e \u0916\u0940\u0902\u091a\u0947\u0902\u0964",
    "Feedback": "\u092a\u094d\u0930\u0924\u093f\u0915\u094d\u0930\u093f\u092f\u093e",
    "Goes anywhere": "\u0915\u0939\u0940\u0902 \u092d\u0940 \u091a\u0932\u093e \u091c\u093e\u0924\u093e \u0939\u0948 |",
    "I don't belong anywhere": "\u092e\u0948\u0902 \u0915\u0939\u0940\u0902 \u092d\u0940 \u0928\u0939\u0940\u0902 \u0939\u0942\u0902",
    "Incorrect": "\u0917\u093c\u0932\u0924",
    "Items": "\u0907\u091f\u0947\u092e\u094d\u0938 ",
    "Mode": "\u092a\u094d\u0930\u0923\u093e\u0932\u0940",
    "No, this item does not belong here. Try again.": "\u0928\u0939\u0940\u0902, \u092f\u0939 \u0906\u0907\u091f\u092e \u092f\u0939\u093e\u0901 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964 \u092a\u0941\u0928\u0903 \u092a\u094d\u0930\u092f\u093e\u0938 \u0915\u0930\u0947\u0902\u0964",
    "Of course it goes here! It goes anywhere!": "\u0915\u0939\u0940\u0902 \u092d\u0940 \u091a\u0932\u093e \u091c\u093e\u0924\u093e \u0939\u0948 |",
    "Problem": "\u0938\u092e\u0938\u094d\u092f\u093e",
    "Problem Weight": "\u0938\u092e\u0938\u094d\u092f\u093e \u0935\u091c\u0928",
    "Save": "\u0938\u0947\u0935 \u0915\u0930\u0947\u0902",
    "Saving": "\u0938\u0947\u0935 \u0939\u094b \u0930\u0939\u093e \u0939\u0948",
    "Submit": "\u092a\u094d\u0930\u0938\u094d\u0924\u0941\u0924",
    "Submitting": "\u092d\u0947\u091c\u0928\u0947 \u0938\u0947",
    "The Top Zone": "\u0936\u0940\u0930\u094d\u0937 \u0915\u094d\u0937\u0947\u0924\u094d\u0930",
    "Title": "\u0936\u0940\u0930\u094d\u0937\u0915",
    "You silly, there are no zones for this one.": "\u0906\u092a \u092e\u0942\u0930\u094d\u0916\u0924\u093e\u092a\u0942\u0930\u094d\u0923 \u0939\u0948\u0902, \u0907\u0938\u0915\u0947 \u0932\u093f\u090f \u0915\u094b\u0908 \u0915\u094d\u0937\u0947\u0924\u094d\u0930 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964"
  };
  for (var key in newcatalog) {
    django.catalog[key] = newcatalog[key];
  }
  

  if (!django.jsi18n_initialized) {
    django.gettext = function(msgid) {
      var value = django.catalog[msgid];
      if (typeof(value) == 'undefined') {
        return msgid;
      } else {
        return (typeof(value) == 'string') ? value : value[0];
      }
    };

    django.ngettext = function(singular, plural, count) {
      var value = django.catalog[singular];
      if (typeof(value) == 'undefined') {
        return (count == 1) ? singular : plural;
      } else {
        return value[django.pluralidx(count)];
      }
    };

    django.gettext_noop = function(msgid) { return msgid; };

    django.pgettext = function(context, msgid) {
      var value = django.gettext(context + '\x04' + msgid);
      if (value.indexOf('\x04') != -1) {
        value = msgid;
      }
      return value;
    };

    django.npgettext = function(context, singular, plural, count) {
      var value = django.ngettext(context + '\x04' + singular, context + '\x04' + plural, count);
      if (value.indexOf('\x04') != -1) {
        value = django.ngettext(singular, plural, count);
      }
      return value;
    };

    django.interpolate = function(fmt, obj, named) {
      if (named) {
        return fmt.replace(/%\(\w+\)s/g, function(match){return String(obj[match.slice(2,-2)])});
      } else {
        return fmt.replace(/%s/g, function(match){return String(obj.shift())});
      }
    };


    /* formatting library */

    django.formats = {
    "DATETIME_FORMAT": "N j, Y, P",
    "DATETIME_INPUT_FORMATS": [
      "%Y-%m-%d %H:%M:%S",
      "%Y-%m-%d %H:%M:%S.%f",
      "%Y-%m-%d %H:%M",
      "%Y-%m-%d",
      "%m/%d/%Y %H:%M:%S",
      "%m/%d/%Y %H:%M:%S.%f",
      "%m/%d/%Y %H:%M",
      "%m/%d/%Y",
      "%m/%d/%y %H:%M:%S",
      "%m/%d/%y %H:%M:%S.%f",
      "%m/%d/%y %H:%M",
      "%m/%d/%y"
    ],
    "DATE_FORMAT": "j F Y",
    "DATE_INPUT_FORMATS": [
      "%Y-%m-%d",
      "%m/%d/%Y",
      "%m/%d/%y",
      "%b %d %Y",
      "%b %d, %Y",
      "%d %b %Y",
      "%d %b, %Y",
      "%B %d %Y",
      "%B %d, %Y",
      "%d %B %Y",
      "%d %B, %Y"
    ],
    "DECIMAL_SEPARATOR": ".",
    "FIRST_DAY_OF_WEEK": "0",
    "MONTH_DAY_FORMAT": "j F",
    "NUMBER_GROUPING": "0",
    "SHORT_DATETIME_FORMAT": "m/d/Y P",
    "SHORT_DATE_FORMAT": "d-m-Y",
    "THOUSAND_SEPARATOR": ",",
    "TIME_FORMAT": "g:i A",
    "TIME_INPUT_FORMATS": [
      "%H:%M:%S",
      "%H:%M:%S.%f",
      "%H:%M"
    ],
    "YEAR_MONTH_FORMAT": "F Y"
  };

    django.get_format = function(format_type) {
      var value = django.formats[format_type];
      if (typeof(value) == 'undefined') {
        return format_type;
      } else {
        return value;
      }
    };

    /* add to global namespace */
    globals.pluralidx = django.pluralidx;
    globals.gettext = django.gettext;
    globals.ngettext = django.ngettext;
    globals.gettext_noop = django.gettext_noop;
    globals.pgettext = django.pgettext;
    globals.npgettext = django.npgettext;
    globals.interpolate = django.interpolate;
    globals.get_format = django.get_format;

    django.jsi18n_initialized = true;
  }

}(this));


                  }
                };
                DragAndDropI18N.init();
                global.DragAndDropI18N = DragAndDropI18N;
            }(this));
        