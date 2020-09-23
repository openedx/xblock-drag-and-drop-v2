
            (function(global){
                var DragAndDropI18N = {
                  init: function() {
                    

(function(globals) {

  var django = globals.django || (globals.django = {});

  
  django.pluralidx = function(n) {
    var v=0;
    if (typeof(v) == 'boolean') {
      return v ? 1 : 0;
    } else {
      return v;
    }
  };
  

  /* gettext library */

  django.catalog = django.catalog || {};
  
  var newcatalog = {
    "Feedback": "\u53cd\u9988", 
    "Keyboard Help": "\u952e\u76d8\u8bf4\u660e", 
    "Loading drag and drop problem.": "\u52a0\u8f7d\u62d6\u653e\u3002", 
    "Navigate using TAB and SHIFT+TAB to the appropriate dropzone and press CTRL+M once more to drop it here.": "\u4f7f\u7528 Tab \u548c Shift + Tab \u5bfc\u822a\u5230\u9002\u5f53\u7684\u653e\u7f6e\u533a\uff0c\u7136\u540e\u518d\u6309\u4e00\u6b21 Ctrl + M \u5c06\u5176\u653e\u7f6e\u5728\u6b64\u5904\u3002", 
    "Press CTRL+M to select a draggable item (effectively picking it up).": "\u6309 CtrlL + M \u53ef\u9009\u62e9\u4e00\u4e2a\u53ef\u62d6\u52a8\u9879\u76ee\uff08\u76f8\u5f53\u4e8e\u9009\u53d6\u5b83\uff09\u3002", 
    "Problem": "\u95ee\u9898", 
    "Reset": "\u91cd\u7f6e", 
    "TAB back to the list of draggable items and repeat this process until all of the draggable items have been placed on their respective dropzones.": "\u6309 Tab \u53ef\u8fd4\u56de\u5230\u53ef\u62d6\u52a8\u9879\u76ee\u5217\u8868\uff0c\u7136\u540e\u91cd\u590d\u6b64\u8fc7\u7a0b\uff0c\u76f4\u5230\u6240\u6709\u53ef\u62d6\u52a8\u9879\u76ee\u90fd\u5df2\u653e\u7f6e\u5728\u5176\u5404\u81ea\u7684\u653e\u7f6e\u533a\u4e0a\u3002", 
    "Use only TAB and SHIFT+TAB to navigate between draggable items and drop zones.": "\u4ec5\u4f7f\u7528 Tab \u548c Shift + Tab \u5728\u53ef\u62d6\u52a8\u9879\u76ee\u548c\u653e\u7f6e\u533a\u57df\u4e4b\u95f4\u5bfc\u822a\u3002", 
    "You can complete this problem using only your keyboard by following the guidance below:": "\u60a8\u53ef\u4ee5\u6309\u7167\u4ee5\u4e0b\u6307\u5bfc\u4ec5\u4f7f\u7528\u952e\u76d8\u6765\u89e3\u51b3\u6b64\u95ee\u9898", 
    "You cannot add any more items to this zone.": "\u4e0d\u80fd\u518d\u5411\u6b64\u533a\u57df\u6dfb\u52a0\u66f4\u591a\u9879\u76ee\u3002"
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
    "DATE_FORMAT": "N j, Y", 
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
    "MONTH_DAY_FORMAT": "F j", 
    "NUMBER_GROUPING": "0", 
    "SHORT_DATETIME_FORMAT": "m/d/Y P", 
    "SHORT_DATE_FORMAT": "m/d/Y", 
    "THOUSAND_SEPARATOR": ",", 
    "TIME_FORMAT": "P", 
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
        