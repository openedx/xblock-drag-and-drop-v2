
            (function(global){
                var DragAndDropI18N = {
                  init: function() {
                    

'use strict';
{
  const globals = this;
  const django = globals.django || (globals.django = {});

  
  django.pluralidx = function(n) {
    const v = (n > 1);
    if (typeof v === 'boolean') {
      return v ? 1 : 0;
    } else {
      return v;
    }
  };
  

  /* gettext library */

  django.catalog = django.catalog || {};
  
  const newcatalog = {
    "Background description": "Arkaplan a\u00e7\u0131klamas\u0131",
    "Cancel": "\u0130ptal",
    "Change background": "Arkaplan\u0131 de\u011fi\u015ftir",
    "Correctly placed {correct_count} item": [
      "Do\u011fru yerle\u015ftirilmi\u015f {correct_count} \u00f6\u011fe",
      "Do\u011fru yerle\u015ftirilmi\u015f {correct_count} \u00f6\u011fe"
    ],
    "Drag and Drop": "S\u00fcr\u00fckle ve B\u0131rak",
    "Feedback": "Geri Bildirim",
    "Hints:": "\u0130pu\u00e7lar\u0131:",
    "Misplaced {misplaced_count} item (misplaced item was returned to the item bank)": [
      "{misplaced_count} \u00f6\u011fe yanl\u0131\u015f yerle\u015ftirildi. Yanl\u0131\u015f yerle\u015ftirilen \u00f6\u011feler, \u00f6\u011fe bankas\u0131na iade edildi.",
      "{misplaced_count} \u00f6\u011fe yanl\u0131\u015f yerle\u015ftirildi. Yanl\u0131\u015f yerle\u015ftirilen \u00f6\u011feler, \u00f6\u011fe bankas\u0131na iade edildi."
    ],
    "Mode": "Mod",
    "Problem": "Sorun",
    "Save": "Kaydet",
    "Saving": "Kaydediliyor",
    "Show title": "Ba\u015fl\u0131\u011f\u0131 g\u00f6ster",
    "Some of your answers were not correct.": "Cevaplar\u0131n\u0131zdan baz\u0131lar\u0131 do\u011fru de\u011fildi.",
    "The Bottom Zone": "Alt B\u00f6lge",
    "The Middle Zone": "Orta B\u00f6lge",
    "The Top Zone": "\u00dcst B\u00f6lge",
    "Title": "Ba\u015fl\u0131k",
    "Your highest score is {score}": "En y\u00fcksek puan\u0131n\u0131z {score}"
  };
  for (const key in newcatalog) {
    django.catalog[key] = newcatalog[key];
  }
  

  if (!django.jsi18n_initialized) {
    django.gettext = function(msgid) {
      const value = django.catalog[msgid];
      if (typeof value === 'undefined') {
        return msgid;
      } else {
        return (typeof value === 'string') ? value : value[0];
      }
    };

    django.ngettext = function(singular, plural, count) {
      const value = django.catalog[singular];
      if (typeof value === 'undefined') {
        return (count == 1) ? singular : plural;
      } else {
        return value.constructor === Array ? value[django.pluralidx(count)] : value;
      }
    };

    django.gettext_noop = function(msgid) { return msgid; };

    django.pgettext = function(context, msgid) {
      let value = django.gettext(context + '\x04' + msgid);
      if (value.includes('\x04')) {
        value = msgid;
      }
      return value;
    };

    django.npgettext = function(context, singular, plural, count) {
      let value = django.ngettext(context + '\x04' + singular, context + '\x04' + plural, count);
      if (value.includes('\x04')) {
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
    "DATETIME_FORMAT": "d F Y H:i",
    "DATETIME_INPUT_FORMATS": [
      "%d/%m/%Y %H:%M:%S",
      "%d/%m/%Y %H:%M:%S.%f",
      "%d/%m/%Y %H:%M",
      "%Y-%m-%d %H:%M:%S",
      "%Y-%m-%d %H:%M:%S.%f",
      "%Y-%m-%d %H:%M",
      "%Y-%m-%d"
    ],
    "DATE_FORMAT": "d F Y",
    "DATE_INPUT_FORMATS": [
      "%d/%m/%Y",
      "%d/%m/%y",
      "%y-%m-%d",
      "%Y-%m-%d"
    ],
    "DECIMAL_SEPARATOR": ",",
    "FIRST_DAY_OF_WEEK": 1,
    "MONTH_DAY_FORMAT": "d F",
    "NUMBER_GROUPING": 3,
    "SHORT_DATETIME_FORMAT": "d M Y H:i",
    "SHORT_DATE_FORMAT": "d M Y",
    "THOUSAND_SEPARATOR": ".",
    "TIME_FORMAT": "H:i",
    "TIME_INPUT_FORMATS": [
      "%H:%M:%S",
      "%H:%M:%S.%f",
      "%H:%M"
    ],
    "YEAR_MONTH_FORMAT": "F Y"
  };

    django.get_format = function(format_type) {
      const value = django.formats[format_type];
      if (typeof value === 'undefined') {
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
};


                  }
                };
                DragAndDropI18N.init();
                global.DragAndDropI18N = DragAndDropI18N;
            }(this));
        