
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
    "\n                            Please provide a description of the image for non-visual users.\n                            The description should provide sufficient information to allow anyone\n                            to solve the problem even without seeing the image.\n                        ": "\n Bitte geben Sie eine Beschreibung des Bildes f\u00fcr nicht-visuelle Benutzer an.\n Die Beschreibung sollte gen\u00fcgend Informationen enthalten, damit jeder\n die Fragestellung l\u00f6sen kann, auch ohne das Bild zu sehen. ",
    ", draggable": ", ziehbar",
    ", draggable, grabbed": ", ziehbar, ausgew\u00e4hlt",
    ", dropzone": ", Ablagebereich",
    "Actions": "Aktionen",
    "Add a zone": "Einen Ablagebereich hinzuf\u00fcgen",
    "Add an item": "Auswahlm\u00f6glichkeit/en hinzuf\u00fcgen",
    "An error occurred. Unable to load drag and drop problem.": "Es ist ein Fehler aufgetreten. Drag&Drop-Fragestellung kann nicht geladen werden.",
    "An isosceles triangle with three layers of similar height. It is shown upright, so the widest layer is located at the bottom, and the narrowest layer is located at the top.": "Ein gleichschenkliges Dreieck mit drei gleich gro\u00dfen Schichten. Es wird von unten nach oben betrachtet, die gr\u00f6\u00dfte Schicht befindet sich unten, die kleinste Schicht oben",
    "Assessment": "assessment",
    "Background Image": "Hintergrundbild",
    "Background URL": "Hintergrund URL",
    "Background description": "Hintergrundinformationen",
    "Basic Settings": "Grundeinstellungen",
    "Cancel": "Abbrechen",
    "Change background": "Hintergrund \u00e4ndern",
    "Close": "Schlie\u00dfen",
    "Continue": "Fortsetzen",
    "Correct": "Korrekt",
    "Correct! This one belongs to The Bottom Zone.": "Richtig! Dieses Element geh\u00f6rt zu dem unteren Ablagebereich.",
    "Correct! This one belongs to The Middle Zone.": "Richtig! Dieses Element geh\u00f6rt zu dem mittigen Ablagebereich.",
    "Correct! This one belongs to The Top Zone.": "Richtig! Dieses Element geh\u00f6rt zu dem oberen Ablagebereich.",
    "Correctly placed in: {zone_title}": "Richtig platziert in: {zone_title}",
    "Correctly placed {correct_count} item": [
      "Richtig platzierte {correct_count} Komponente",
      "{correct_count} Gegenst\u00e4nde richtig platziert"
    ],
    "DEPRECATED. Keeps maximum score achieved by student as a weighted value.": "VERALTET. H\u00e4lt die maximal erreichte Punktzahl eines Teilnehmers mittels eines festen Wertes fest.",
    "Defines the number of points the problem is worth.": "Definiert die Anzahl der Punkte, wie die Fragestellung gewertet wird.",
    "Defines the number of times a student can try to answer this problem. If the value is not set, infinite attempts are allowed.": "Legt fest, wie oft ein Teilnehmer versuchen kann, diese Fragestellung zu l\u00f6sen. Ist der Wert nicht gesetzt, sind unendlich viele Versuche erlaubt.",
    "Did not place {missing_count} required item": [
      "Die ben\u00f6tigte Auwahlm\u00f6glichkeit wurde nicht platziert {missing_count}",
      "Die ben\u00f6tigte Auswahlm\u00f6glichkeiten wurden nicht platziert {missing_count}"
    ],
    "Display label names on the image": "Beschriftung auf dem Bild anzeigen",
    "Display the heading \"Problem\" above the problem text?": "Anzeigen des Titels/ Fragestellung/ \u00fcber den Fragestellungstext?",
    "Display the title to the learner?": "Soll der Titel f\u00fcr die Teilnehmer angezeigt werden?",
    "Display zone borders on the image": "Rahmen auf dem Bild anzeigen ",
    "Drag and Drop": "Drag and Drop",
    "Drag and Drop Problem": "Drag&Drop Fragestellung",
    "Drag and Drop problems consist of draggable items and dropzones. Users should select a draggable item with their keyboard and then navigate to an appropriate dropzone to drop it.": "Drag & Drop-Fragestellungen bestehen aus ziehbaren Auswahlm\u00f6glichkeit/en und Ablagebereich. Nutzer sollten eine ziehbare Auswahlm\u00f6glichkeit mit ihrer Tastatur ausw\u00e4hlen und dann zu einem geeignetem Ablagebereich navigieren, um es dort zu platzieren.",
    "Drag the items onto the image above.": "Ziehen Sie die Auswahlm\u00f6glichkeit/en auf das obere Bild.",
    "Drop Targets": "Platzierungsm\u00f6glichkeiten ",
    "Explanation": "Erkl\u00e4rung",
    "Feedback": "R\u00fcckmeldung",
    "Final attempt was used, highest score is {score}": "Der letzter Versuch wurde gewertet, die h\u00f6chste Punktzahl ist {score}.",
    "Final feedback": "Abschlie\u00dfendes Feedback",
    "For example, 'http://example.com/background.png' or '/static/background.png'.": "Zum Beispiel 'http://beispiel.com/image.png' or '/static/image.png'",
    "Generate image and zones": "Bild und Ablagebereiche generieren",
    "Generate image automatically": "Bild automatisch generieren",
    "Go to Beginning": "Zur\u00fcck zum Anfang",
    "Goes anywhere": "Passt \u00fcberall",
    "Goes to the bottom": "Geh\u00f6rt nach unten.",
    "Goes to the middle": "Geh\u00f6rt zu Mitte.",
    "Goes to the top": "Geh\u00f6rt nach oben.",
    "Good work! You have completed this drag and drop problem.": "Gut gemacht! Sie haben die Drag & Drop Fragestellung gel\u00f6st.",
    "Hints:": "Hinweise:",
    "I don't belong anywhere": "Die Auswahlm\u00f6glichkeit geh\u00f6rt nirgendwo hin. ",
    "Incorrect": "Nicht richtig",
    "Indicates whether a learner has completed the problem at least once": "Gibt an, ob ein Lernender die Fragestellung mindestens einmal gel\u00f6st hat. ",
    "Information about current positions of items that a learner has dropped on the target image.": "Informationen \u00fcber aktuelle Positionen der Auswahlm\u00f6glichkeit/en, die ein Teilnehmer ins Zielbild gezogen hat.",
    "Introductory feedback": "Einleitendes Feedback",
    "Item Bank": "Auswahlm\u00f6glichkeit/en-Feld",
    "Item background color": "Hintergrundfarbe der Auswahlm\u00f6glichkeit/en",
    "Item definitions": "Element Definitionen",
    "Item text color": "Textfarbe der Auswahlm\u00f6glichkeit",
    "Items": "Auswahlm\u00f6glichkeit/en",
    "Items placed here: ": "Platzierte Elemente:",
    "Keeps maximum score achieved by student as a raw value between 0 and 1.": "H\u00e4lt die maximal erreichte Punktzahl eines Teilnehmers mittels eines Wertes zwischen 0 und 1 fest.",
    "Keyboard Help": "Tastaturhilfe",
    "Loading drag and drop problem.": "Laden der Drag&Drop Aufgabe",
    "Max number of attempts reached": "Maximale Anzahl der erreichten Versuche",
    "Maximum attempts": "Maximale Versuche",
    "Maximum items per zone": "Maximale Anzahl an Elementen pro Ablagebereich",
    "Misplaced {misplaced_count} item": [
      "Falsch platzierte {misplaced_count} Auswahm\u00f6glichkeit",
      "Falsch platzierte {misplaced_count} Auswahlm\u00f6glichkeiten"
    ],
    "Misplaced {misplaced_count} item (misplaced item was returned to the item bank)": [
      "Falsch platzierte {misplaced_count} Auswahlm\u00f6glichkeit. Falsch platzierte Auswahlm\u00f6glichkeit wurde zur\u00fcck auf die Ausgangsposition gezogen.",
      "{misplaced_count} Gegenst\u00e4nde verlegt. Falsch platzierte Artikel wurden an die Artikelbank zur\u00fcckgegeben."
    ],
    "Mode": "Modus",
    "Navigate using TAB and SHIFT+TAB to the appropriate dropzone and press CTRL+M once more to drop it here.": "Navigieren Sie mit TAB und SHIFT+TAB zum entsprechenden Ablagebereich und dr\u00fccken Sie noch einmal STRG+M, um es hier zu platzieren.",
    "No items placed here": "Keine Elemente platziert",
    "No, this item does not belong here. Try again.": "Nein, diese Auswahlm\u00f6glichkeit stimmt hier nicht. Versuchen Sie es erneut.",
    "Number of attempts learner used": "Anzahl der Versuche des Teilnehmers",
    "Number of columns": "Anzahl der Spalten",
    "Number of columns and rows.": "Anzahl der Spalten und Zeilen.",
    "Number of rows": "Anzahl der Zeilen",
    "Of course it goes here! It goes anywhere!": "Nat\u00fcrlich passt es hier! Es passt \u00fcberall! ",
    "Placed in: {zone_title}": "Platziert in: {zone_title}",
    "Please check over your submission.": "Bitte \u00fcberpr\u00fcfen Sie Ihre Eingaben.",
    "Please check the values you entered.": "Bitte \u00fcberpr\u00fcfen Sie die eingegebenen Werte.",
    "Press CTRL+M to select a draggable item (effectively picking it up).": "Dr\u00fccken Sie CTRL+M um eine ziehbare Auswahlm\u00f6glichkeit auszuw\u00e4hlen (um es effektiv aufzuheben)",
    "Press ESC if you want to cancel the drop operation (for example, to select a different item).": "Dr\u00fccken Sie ESC, wenn Sie die aktuelle Platzierung abbrechen m\u00f6chten (z.B. um eine andere Auswahlm\u00f6glichkeit auszuw\u00e4hlen)",
    "Problem": "Fragestellung",
    "Problem Weight": "Gewichtung der Fragestellung",
    "Problem data": "Daten der Fragestellung",
    "Problem text": "Fragestellungstext",
    "Provide custom image": "Benutzerdefiniertes Bild einf\u00fcgen",
    "Reset": "Zur\u00fccksetzen",
    "Save": "Speichern",
    "Saving": "Speichert",
    "Show \"Problem\" heading": "Anzeigen der Fragestellung/ Titel",
    "Show Answer": "Antwort anzeigen",
    "Show title": "Titel anzeigen",
    "Size of a single zone in pixels.": "Gr\u00f6\u00dfe eines einzelnen Ablagebereiches in Pixel.",
    "Some of your answers were not correct.": "Einige Ihrer Antworten waren nicht korrekt.",
    "Standard": "Standard",
    "Standard mode: the problem provides immediate feedback each time a learner drops an item on a target zone. Assessment mode: the problem provides feedback only after a learner drops all available items on target zones.": "Standardmodus: die Fragestellung liefert sofortiges Feedback jedes Mal wenn der Lernende eine Auswahlm\u00f6glichkeit in den Ablagebereich zieht. Assessmentmodus: die Fragestellung liefert Feedback nur nachdem ein Lernender alle verf\u00fcgbaren Auswahlm\u00f6glichkeit/en in den Ablagebereich gezogen hat.",
    "Submission deadline has passed.": "Einreichungsfrist ist abgelaufen.",
    "Submit": "Absenden",
    "Submitting": "\u00dcbermitteln, einreichen",
    "TAB back to the list of draggable items and repeat this process until all of the draggable items have been placed on their respective dropzones.": "TAB kehren Sie zur Liste der ziehbaren Auswahlm\u00f6glichkeit/en zur\u00fcck und wiederholen Sie diesen Vorgang bis alle ziehbaren Auswahlm\u00f6glichkeit/en auf ihren jeweiligen Ablagebereichen platziert sind.",
    "Text color to use for draggable items (example: 'white' or '#ffffff').": "Textfarbe der verschiebbaren Auswahlm\u00f6glichkeit (Beispiel: \"wei\u00df\" oder \"#fffff\")",
    "The Bottom Zone": "Unterer Ablagebereich",
    "The Middle Zone": "Mittiger Ablagebereich",
    "The Top Zone": "Oberer Ablagebereich",
    "The background color of draggable items in the problem (example: 'blue' or '#0000ff').": "Die Hintergrundfarbe der beweglichen Auswahlm\u00f6glichkeit bei der Fragestellung (Beispiel \"blau\" oder \"#0000ff\" )",
    "The description of the problem or instructions shown to the learner.": "Die Beschreibung des Problems oder die Anweisungen werden dem Lernenden angezeigt.",
    "The title of the drag and drop problem. The title is displayed to learners.": "Dies ist der Titel der Drag&Drop Aufgabe. Dieser Titel wird den Teilnehmern angezeigt.",
    "There was an error with your form.": "Es gab einen formalen Fehler.",
    "This is a screen reader-friendly problem.": "Dies ist eine Screen-Reader kompatible Aufgabe",
    "This setting limits the number of items that can be dropped into a single zone.": "Mit dieser Einstellung k\u00f6nnen Sie die Anzahl der Elemente limitieren, welche in den einzelnen Ablagebereichen abgelegt werden k\u00f6nnen.",
    "Title": "Titel",
    "Unknown DnDv2 mode {mode} - course is misconfigured": "Unknown DnDv2 mode {mode} - Kurs ist falsch konfiguriert",
    "Unknown Zone": "Unbekannter Ablagebereich",
    "Use only TAB and SHIFT+TAB to navigate between draggable items and drop zones.": "Nutzen Sie ausschlie\u00dflich TAB und SHIFT+TAB zum navigieren zwischen den ziehbaren Auswahlm\u00f6glichkeiten und den Ablagebereichen.",
    "Use this zone to associate an item with the bottom layer of the triangle.": "Benutze dieses Feld um eine Auswahlm\u00f6glichkeit/en dem unteren Ablagebereich des Dreiecks zuzuordnen",
    "Use this zone to associate an item with the middle layer of the triangle.": "Benutze dieses Feld um eine Auswahlm\u00f6glichkeit/en dem mittleren Ablagebereich des Dreiecks zuzuordnen",
    "Use this zone to associate an item with the top layer of the triangle.": "Benutze dieses Feld um eine Auswahlm\u00f6glichkeit/en dem oberen Ablagebereich des Dreiecks zuzuordnen",
    "You can complete this problem using only your keyboard by following the guidance below:": "Sie k\u00f6nnen dieses Problem/ Fragestellung nur mit Ihrer Tastatur l\u00f6sen, indem Sie der folgenden Anleitung folgen: ",
    "You cannot add any more items to this zone.": "Sie k\u00f6nnen nicht mehr Elemente in diesem Ablagebereich ablegen.",
    "You have used {used} of {total} attempts.": "Sie haben {used} von {total} Versuchen verwendet.",
    "You silly, there are no zones for this one.": "Nein, diese Auswahlm\u00f6glichkeit passt in kein Feld.",
    "Your highest score is {score}": "Ihre h\u00f6chste Punktzahl ist {score}.",
    "Zone Layout": "Layout der Ablagebereiche",
    "Zone Size": "Gr\u00f6\u00dfe des Ablagebereichs",
    "Zone borders": "Rahmen der Ablagebereiche",
    "Zone definitions": "Definitionen der Ablagebereiche",
    "Zone height": "H\u00f6he des Ablagebereichs",
    "Zone labels": "Beschriftungen der Ablagebereiche",
    "Zone width": "Breite des Ablagebereichs",
    "Zone {num}": [
      "Ablagebereich {num}",
      "Ablagebereiche {num}"
    ],
    "Zones": "Ablagebereiche",
    "do_attempt handler should only be called for assessment mode": "do_attempt handler sollte nur f\u00fcr den Assessmentmodus aufgerufen werden",
    "droppable": "beweglich",
    "show_answer handler should only be called for assessment mode": "show_answer handler sollten nur f\u00fcr den Assessmentmodus augerufen werden",
    "{earned}/{possible} point (graded)": [
      "{earned}/{possible} Punkt (graded)",
      "{earned}/{possible} Punkte (graded)"
    ],
    "{earned}/{possible} point (ungraded)": [
      "{earned}/{possible} Punkt (ungraded)",
      "{earned}/{possible} Punkte (ungraded)"
    ],
    "{possible} point possible (graded)": [
      "{possible} Punkt m\u00f6glich (graded)",
      "{possible} Punkte m\u00f6glich (graded)"
    ],
    "{possible} point possible (ungraded)": [
      "{possible} Punkt m\u00f6glich (ungraded)",
      "{possible} Punkte m\u00f6glich (ungraded)"
    ]
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
    "DATETIME_FORMAT": "j. F Y H:i",
    "DATETIME_INPUT_FORMATS": [
      "%d.%m.%Y %H:%M:%S",
      "%d.%m.%Y %H:%M:%S.%f",
      "%d.%m.%Y %H:%M",
      "%d.%m.%Y",
      "%Y-%m-%d %H:%M:%S",
      "%Y-%m-%d %H:%M:%S.%f",
      "%Y-%m-%d %H:%M",
      "%Y-%m-%d"
    ],
    "DATE_FORMAT": "j. F Y",
    "DATE_INPUT_FORMATS": [
      "%d.%m.%Y",
      "%d.%m.%y",
      "%Y-%m-%d"
    ],
    "DECIMAL_SEPARATOR": ",",
    "FIRST_DAY_OF_WEEK": "1",
    "MONTH_DAY_FORMAT": "j. F",
    "NUMBER_GROUPING": "3",
    "SHORT_DATETIME_FORMAT": "d.m.Y H:i",
    "SHORT_DATE_FORMAT": "d.m.Y",
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
        