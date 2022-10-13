
            (function(global){
                var DragAndDropI18N = {
                  init: function() {
                    

(function(globals) {

  var django = globals.django || (globals.django = {});

  
  django.pluralidx = function(n) {
    var v=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
    if (typeof(v) == 'boolean') {
      return v ? 1 : 0;
    } else {
      return v;
    }
  };
  

  /* gettext library */

  django.catalog = django.catalog || {};
  
  var newcatalog = {
    "Add a zone": "Aggiungi una zona",
    "Add an item": "Aggiungi un oggetto",
    "Assessment": "Valutazione",
    "Background URL": "URL di sfondo",
    "Background description": "Descrizione sfondo",
    "Cancel": "Annulla",
    "Change background": "Cambia sfondo",
    "Continue": "Continua",
    "Correct": "Corretto",
    "Correctly placed {correct_count} item": [
      "{correct_count} elementi posizionati correttamente",
      "{correct_count} elementi posizionati correttamente",
      "{correct_count} elementi posizionati correttamente"
    ],
    "Defines the number of points the problem is worth.": "Definisce il numero di punto che il problema vale.",
    "Defines the number of times a student can try to answer this problem. If the value is not set, infinite attempts are allowed.": "Definisce il numero di volte in cui uno studente pu\u00f2 provare a rispondere a questo problema. Se il valore non \u00e8 impostato, vengono consentiti infiniti tentativi.",
    "Display label names on the image": "Visualizza i nomi delle etichette sull'immagine",
    "Display the title to the learner?": "Mostra il titolo al discente?",
    "Drag and Drop": "Trascina e Rilascia",
    "Explanation": "Spiegazione",
    "Final feedback": "Feedback finale",
    "Hints:": "Suggerimenti:",
    "Incorrect": "Errato",
    "Introductory feedback": "Feedback introduttivo",
    "Item background color": "Colore di sfondo dell'oggetto",
    "Item text color": "Coloro del testo dell'oggetto",
    "Items": "Oggetti",
    "Loading drag and drop problem.": "Caricamento del problema di drag and drop.",
    "Max number of attempts reached": "Numero massimo di tentativi raggiunto",
    "Maximum attempts": "Tentativi massimi",
    "Misplaced {misplaced_count} item (misplaced item was returned to the item bank)": [
      "{misplaced_count} elementi fuori posto. Gli oggetti smarriti sono stati restituiti alla banca degli articoli.",
      "{misplaced_count} elementi fuori posto. Gli oggetti smarriti sono stati restituiti alla banca degli articoli.",
      "{misplaced_count} elementi fuori posto. Gli oggetti smarriti sono stati restituiti alla banca degli articoli."
    ],
    "Mode": "Modalit\u00e0",
    "Number of attempts learner used": "Numero di tentativi che il discente ha utilizzato",
    "Problem": "Problema",
    "Problem Weight": "Peso del problema",
    "Problem data": "Dato del problema",
    "Problem text": "Testo del problema",
    "Save": "Salva",
    "Saving": "Salvataggio in corso",
    "Show title": "Mostra titolo",
    "Some of your answers were not correct.": "Alcune delle tue risposte non erano corrette.",
    "Standard": "Standard",
    "Submitting": "In fase di invio",
    "The description of the problem or instructions shown to the learner.": "Descrizione del problema o istruzioni mostrate al discente.",
    "Title": "Titolo",
    "Your highest score is {score}": "Il tuo punteggio pi\u00f9 alto \u00e8 {score}",
    "Zone borders": "Bordi della zona",
    "Zone definitions": "Definizioni della zona",
    "Zone labels": "Etichette della zona",
    "Zones": "Zone"
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
    "DATETIME_FORMAT": "l d F Y H:i",
    "DATETIME_INPUT_FORMATS": [
      "%d/%m/%Y %H:%M:%S",
      "%d/%m/%Y %H:%M:%S.%f",
      "%d/%m/%Y %H:%M",
      "%d/%m/%Y",
      "%d/%m/%y %H:%M:%S",
      "%d/%m/%y %H:%M:%S.%f",
      "%d/%m/%y %H:%M",
      "%d/%m/%y",
      "%Y-%m-%d %H:%M:%S",
      "%Y-%m-%d %H:%M:%S.%f",
      "%Y-%m-%d %H:%M",
      "%Y-%m-%d",
      "%d-%m-%Y %H:%M:%S",
      "%d-%m-%Y %H:%M:%S.%f",
      "%d-%m-%Y %H:%M",
      "%d-%m-%Y",
      "%d-%m-%y %H:%M:%S",
      "%d-%m-%y %H:%M:%S.%f",
      "%d-%m-%y %H:%M",
      "%d-%m-%y"
    ],
    "DATE_FORMAT": "d F Y",
    "DATE_INPUT_FORMATS": [
      "%d/%m/%Y",
      "%Y/%m/%d",
      "%d-%m-%Y",
      "%Y-%m-%d",
      "%d-%m-%y",
      "%d/%m/%y"
    ],
    "DECIMAL_SEPARATOR": ",",
    "FIRST_DAY_OF_WEEK": "1",
    "MONTH_DAY_FORMAT": "j/F",
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
        