
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
    "Feedback": "Realimentaci\u00f3n", 
    "Keyboard Help": "\u952e\u76d8\u8bf4\u660e", 
    "Loading drag and drop problem.": "Cargando problema de arrastrar y soltar.", 
    "Navigate using TAB and SHIFT+TAB to the appropriate dropzone and press CTRL+M once more to drop it here.": "Para navegar, utilice las teclas Tab y May\u00fas+Tab hasta el panel Colocar zonas correspondiente, y luego presione las teclas CTRL+M una vez m\u00e1s para soltar el elemento.", 
    "Press CTRL+M to select a draggable item (effectively picking it up).": "Para seleccionar un elemento que se puede arrastrar, presione las teclas CTRL+M. (Esta es una forma efectiva de selecci\u00f3n).", 
    "Press ESC if you want to cancel the drop operation (for example, to select a different item).": "Si desea cancelar la operaci\u00f3n de colocar, presione la tecla Esc. (Por ejemplo, para seleccionar otro elemento).", 
    "Problem": "Problema", 
    "Reset": "Restablecer", 
    "TAB back to the list of draggable items and repeat this process until all of the draggable items have been placed on their respective dropzones.": "Presione las teclas May\u00fas+Tab para desplazarse hacia atr\u00e1s por la lista de elementos que se pueden seleccionar; luego, repita el proceso hasta que todos los elementos que se pueden seleccionar se hayan colocado en sus respectivos paneles Colocar zonas.", 
    "Use only TAB and SHIFT+TAB to navigate between draggable items and drop zones.": "Para navegar entre los elementos que se pueden arrastrar y el panel Colocar zonas, utilice solo las teclas Tab y May\u00fas+Tab.", 
    "You can complete this problem using only your keyboard by following the guidance below:": "Puede completar este problema utilizando solo el teclado. Para ello, siga las indicaciones a continuaci\u00f3n:", 
    "You cannot add any more items to this zone.": "No se pueden agregar m\u00e1s elementos a esta zona."
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
    "DATETIME_FORMAT": "j \\d\\e F \\d\\e Y \\a \\l\\a\\s H:i", 
    "DATETIME_INPUT_FORMATS": [
      "%d/%m/%Y %H:%M:%S", 
      "%d/%m/%Y %H:%M:%S.%f", 
      "%d/%m/%Y %H:%M", 
      "%d/%m/%y %H:%M:%S", 
      "%d/%m/%y %H:%M:%S.%f", 
      "%d/%m/%y %H:%M", 
      "%Y-%m-%d %H:%M:%S", 
      "%Y-%m-%d %H:%M:%S.%f", 
      "%Y-%m-%d %H:%M", 
      "%Y-%m-%d"
    ], 
    "DATE_FORMAT": "j \\d\\e F \\d\\e Y", 
    "DATE_INPUT_FORMATS": [
      "%d/%m/%Y", 
      "%d/%m/%y", 
      "%Y-%m-%d"
    ], 
    "DECIMAL_SEPARATOR": ",", 
    "FIRST_DAY_OF_WEEK": "1", 
    "MONTH_DAY_FORMAT": "j \\d\\e F", 
    "NUMBER_GROUPING": "3", 
    "SHORT_DATETIME_FORMAT": "d/m/Y H:i", 
    "SHORT_DATE_FORMAT": "d/m/Y", 
    "THOUSAND_SEPARATOR": ".", 
    "TIME_FORMAT": "H:i", 
    "TIME_INPUT_FORMATS": [
      "%H:%M:%S", 
      "%H:%M:%S.%f", 
      "%H:%M"
    ], 
    "YEAR_MONTH_FORMAT": "F \\d\\e Y"
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
        