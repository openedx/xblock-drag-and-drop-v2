
            (function(global){
                var DragAndDropI18N = {
                  init: function() {
                    

(function(globals) {

  var django = globals.django || (globals.django = {});

  
  django.pluralidx = function(n) {
    var v=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);
    if (typeof(v) == 'boolean') {
      return v ? 1 : 0;
    } else {
      return v;
    }
  };
  

  /* gettext library */

  django.catalog = django.catalog || {};
  
  var newcatalog = {
    "Add a zone": "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0437\u043e\u043d\u0443", 
    "Add an item": "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u044d\u043b\u0435\u043c\u0435\u043d\u0442", 
    "Background description": "\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0444\u043e\u043d\u0430", 
    "Cancel": "\u041e\u0442\u043c\u0435\u043d\u0430", 
    "Continue": "\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c", 
    "Description": "\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435", 
    "Items": "\u042d\u043b\u0435\u043c\u0435\u0442\u044b", 
    "OK": "\u041e\u041a", 
    "Save": "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c", 
    "Text": "\u0422\u0435\u043a\u0441\u0442", 
    "The Bottom Zone": "\u041d\u0438\u0436\u043d\u044f\u044f \u0417\u043e\u043d\u0430", 
    "The Middle Zone": "\u0421\u0440\u0435\u0434\u043d\u044f\u044f \u0417\u043e\u043d\u0430", 
    "The Top Zone": "\u0412\u0435\u0440\u0445\u043d\u044f\u044f \u0417\u043e\u043d\u0430", 
    "Use this zone to associate an item with the bottom layer of the triangle.": "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435 \u044d\u0442\u0443 \u0437\u043e\u043d\u0443, \u0447\u0442\u043e\u0431\u044b \u0441\u0432\u044f\u0437\u0430\u0442\u044c \u044d\u043b\u0435\u043c\u0435\u043d\u0442 \u0441 \u043d\u0438\u0436\u043d\u0438\u043c \u0441\u043b\u043e\u0435\u043c \u0442\u0440\u0435\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a\u0430.", 
    "Use this zone to associate an item with the middle layer of the triangle.": "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435 \u044d\u0442\u0443 \u0437\u043e\u043d\u0443, \u0447\u0442\u043e\u0431\u044b \u0441\u0432\u044f\u0437\u0430\u0442\u044c \u044d\u043b\u0435\u043c\u0435\u043d\u0442 \u0441\u043e \u0441\u0440\u0435\u0434\u043d\u0438\u043c \u0441\u043b\u043e\u0435\u043c \u0442\u0440\u0435\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a\u0430.", 
    "Use this zone to associate an item with the top layer of the triangle.": "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435 \u044d\u0442\u0443 \u0437\u043e\u043d\u0443, \u0447\u0442\u043e\u0431\u044b \u0441\u0432\u044f\u0437\u0430\u0442\u044c \u044d\u043b\u0435\u043c\u0435\u043d\u0442 \u0441 \u0432\u0435\u0440\u0445\u043d\u0438\u043c \u0441\u043b\u043e\u0435\u043c \u0442\u0440\u0435\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a\u0430.", 
    "Zone": "\u0417\u043e\u043d\u0430", 
    "Zones": "\u0417\u043e\u043d\u044b", 
    "height": "\u0412\u044b\u0441\u043e\u0442\u0430", 
    "ok": "\u043e\u043a", 
    "width": "\u0428\u0438\u0440\u0438\u043d\u0430"
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
    "DATETIME_FORMAT": "j E Y \u0433. G:i", 
    "DATETIME_INPUT_FORMATS": [
      "%d.%m.%Y %H:%M:%S", 
      "%d.%m.%Y %H:%M:%S.%f", 
      "%d.%m.%Y %H:%M", 
      "%d.%m.%Y", 
      "%d.%m.%y %H:%M:%S", 
      "%d.%m.%y %H:%M:%S.%f", 
      "%d.%m.%y %H:%M", 
      "%d.%m.%y", 
      "%Y-%m-%d %H:%M:%S", 
      "%Y-%m-%d %H:%M:%S.%f", 
      "%Y-%m-%d %H:%M", 
      "%Y-%m-%d"
    ], 
    "DATE_FORMAT": "j E Y \u0433.", 
    "DATE_INPUT_FORMATS": [
      "%d.%m.%Y", 
      "%d.%m.%y", 
      "%Y-%m-%d"
    ], 
    "DECIMAL_SEPARATOR": ",", 
    "FIRST_DAY_OF_WEEK": "1", 
    "MONTH_DAY_FORMAT": "j F", 
    "NUMBER_GROUPING": "3", 
    "SHORT_DATETIME_FORMAT": "d.m.Y H:i", 
    "SHORT_DATE_FORMAT": "d.m.Y", 
    "THOUSAND_SEPARATOR": "\u00a0", 
    "TIME_FORMAT": "G:i", 
    "TIME_INPUT_FORMATS": [
      "%H:%M:%S", 
      "%H:%M:%S.%f", 
      "%H:%M"
    ], 
    "YEAR_MONTH_FORMAT": "F Y \u0433."
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
        