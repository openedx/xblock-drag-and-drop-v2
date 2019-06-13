
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
    "\n                            Please provide a description of the image for non-visual users.\n                            The description should provide sufficient information to allow anyone\n                            to solve the problem even without seeing the image.\n                        ": "\n                            Bitte geben Sie eine Beschreibung des Bildes f\u00fcr nicht visuelle Nutzer an.\n                            Die Beschreibung sollte ausreichende Informationen enthalten, um es jedem zu erm\u00f6glichen\n                        das Problem zu l\u00f6sen, ohne das Bild zu sehen.\n                        ", 
    "\"Maximum items per zone\" should be positive integer, got {max_items_per_zone}": "\"Maximale Objekte pro Bereich\" sollte positive ganze Zahl sein, bekam {max_items_per_zone}", 
    ", draggable": ", l\u00e4sst sich ziehen", 
    ", draggable, grabbed": ", l\u00e4sst sich ziehen, gegriffen", 
    ", dropzone": ", Dropbereich", 
    "Actions": "Aktionen", 
    "Add a zone": "Einen Bereich hinzuf\u00fcgen", 
    "Add an item": "Ein Objekt hinzuf\u00fcgen", 
    "Align dropped items to the left, center, or right.": "Richten Sie die abgelegten Objekte nach links, mittig oder nach rechts aus.", 
    "Alignment": "Ausrichtung", 
    "An error occurred. Unable to load drag and drop problem.": "Ein Fehler ist aufgetreten. Das Drag & Drop-Problem konnte nicht geladen werden.", 
    "An isosceles triangle with three layers of similar height. It is shown upright, so the widest layer is located at the bottom, and the narrowest layer is located at the top.": "Ein gleichschenkliges Dreieck mit drei \u00e4hnlich hohen Schichten. Es wird aufrecht dargestellt, also befindet sich die breiteste Schicht unten und die schmalste Schicht oben.", 
    "Assessment": "Bewertung", 
    "Background URL": "Hintergrund-URL", 
    "Background description": "Hintergrundbeschreibung", 
    "Cancel": "Abbrechen", 
    "Change background": "Hintergrund ver\u00e4ndern", 
    "Close": "Schlie\u00dfen", 
    "Continue": "Weiter", 
    "Correct! This one belongs to {zone}.": "Richtig! Das geh\u00f6rt zu {zone}.", 
    "Correctly placed in: {zone_title}": "Korrekt abgelegt in: {zone_title}", 
    "Correctly placed {correct_count} item.": [
      "Richtig platziertes {correct_count} Objekt.", 
      "Richtig platzierte {correct_count} Objekte."
    ], 
    "Defines the number of points the problem is worth.": "Definiert die Anzahl der Punkte, mit denen das Problem bewertet wird.", 
    "Defines the number of times a student can try to answer this problem. If the value is not set, infinite attempts are allowed.": "Definiert die H\u00e4ufigkeit, mit der ein Teilnehmer versuchen kann, dieses Problem zu l\u00f6sen. Wenn der Wert nicht festgelegt ist, sind unbegrenzte Versuche zul\u00e4ssig.", 
    "Describe this zone to non-visual users.": "Beschreibe diesen Bereich f\u00fcr nicht visuelle Benutzer.", 
    "Description": "Beschreibung", 
    "Did not place {missing_count} required item.": [
      "Das n\u00f6tige {missing_count} Objekt wurde nicht platziert.", 
      "Die n\u00f6tigen {missing_count} Objekte wurden nicht platziert."
    ], 
    "Display label names on the image": "Kennzeichnungen auf dem Bild anzeigen", 
    "Display the heading \"Problem\" above the problem text?": "Die \u00dcberschrift \"Problem\" \u00fcber dem Problemtext anzeigen?", 
    "Display the title to the learner?": "Dem Lernenden den Titel anzeigen?", 
    "Display zone borders on the image": "Bereichsgrenzen auf dem Bild anzeigen", 
    "Drag and Drop": "Drag & Drop", 
    "Drag and Drop Problem": "Drag & Drop-Problem", 
    "Drag and Drop problems consist of draggable items and dropzones. Users should select a draggable item with their keyboard and then navigate to an appropriate dropzone to drop it.": "Drag & Drop-Probleme bestehen aus ziehbaren Objekten und Dropbereichen. Nutzer sollten ein ziehbares Objekt mit ihrer Tastatur ausw\u00e4hlen und dann zu einem geeigneten Dropbereich navigieren, um es dort abzulegen.", 
    "Drag the items onto the image above.": "Ziehen Sie die Objekte auf das Bild dar\u00fcber.", 
    "Drop Targets": "Drop-Ziele", 
    "Error feedback": "Fehlerfeedback", 
    "Failed to parse \"Maximum items per zone\"": "Fehler beim Analysieren von \"Maximale Objekte pro Bereich\"", 
    "Feedback": "Feedback", 
    "Final attempt was used, highest score is {score}": "Der letzte Versuch wurde verwendet, die h\u00f6chste Punktzahl ist {score}", 
    "Final feedback": "Endg\u00fcltiges Feedback", 
    "For example, 'http://example.com/background.png' or '/static/background.png'.": "Beispiel: \"http://example.com/background.png\" oder \"/static/background.png\".", 
    "For example, 'http://example.com/image.png' or '/static/image.png'.": "Beispiel: \"http://example.com/image.png\" oder \"/static/image.png\".", 
    "Go to Beginning": "Zur\u00fcck zum Start", 
    "Goes anywhere": "Es passt \u00fcberallhin", 
    "Goes to the bottom": "Kommt nach unten", 
    "Goes to the middle": "Kommt in die Mitte", 
    "Goes to the top": "Kommt nach oben", 
    "Good work! You have completed this drag and drop problem.": "Gute Arbeit! Sie haben diese Drag & Drop-Aufgabe abgeschlossen.", 
    "Hide Answer": "Antwort ausblenden", 
    "Hints:": "Tipps:", 
    "I don't belong anywhere": "Ich geh\u00f6re nirgendwohin", 
    "Image URL (alternative to the text)": "Bild-URL (Alternative zum Text)", 
    "Image description (should provide sufficient information to place the item even if the image did not load)": "Bildbeschreibung (es sollten ausreichende Informationen zur Verf\u00fcgung gestellt werden, um das Objekt zu platzieren, selbst wenn das Bild nicht geladen wurde)", 
    "Indicates whether a learner has completed the problem at least once": "Gibt an, ob ein Lerner das Problem mindestens einmal abgeschlossen hat", 
    "Information about current positions of items that a learner has dropped on the target image.": "Informationen \u00fcber aktuelle Positionen von Objekten, die ein Lerner auf dem Zielbild abgelegt hat.", 
    "Information about zones, items, feedback, and background image for this problem. This information is derived from the input that a course author provides via the interactive editor when configuring the problem.": "Informationen zu Bereichen, Objekten, Feedback und Hintergrundbild f\u00fcr dieses Problem. Diese Informationen werden von der Eingabe abgeleitet, die ein Kursautor beim Konfigurieren des Problems \u00fcber den interaktiven Editor bereitstellt.", 
    "Introductory feedback": "Einleitendes Feedback", 
    "Item Bank": "Speicherbank des Objekts", 
    "Item background color": "Hintergrundfarbe der Objekte", 
    "Item text color": "Textfarbe der Objekte", 
    "Items": "Objekte", 
    "Keeps maximum score achieved by student": "H\u00e4lt maximale Punktzahl, die von Teilnehmern erreicht wurde", 
    "Keyboard Help": "Tastaturhilfe", 
    "Loading drag and drop problem.": "Drag & Drop-Problem wird geladen.", 
    "Max number of attempts reached": "Maximale Anzahl der Versuche erreicht", 
    "Maximum attempts": "Maximale Anzahl von Versuchen", 
    "Misplaced {misplaced_count} item.": [
      "Fehlplatziertes {misplaced_count} Objekt.", 
      "Fehlplatzierte {misplaced_count} Objekte."
    ], 
    "Misplaced {misplaced_count} item. Misplaced item was returned to item bank.": [
      "Fehlplatziertes {misplaced_count} Objekt. Fehlerhaftes Objekt wurde an die Speicherbank zur\u00fcckgegeben.", 
      "Fehlplatzierte {misplaced_count} Objekte. Fehlerhafte Objekte wurden an die Speicherbank zur\u00fcckgegeben."
    ], 
    "Mode": "Modus", 
    "Navigate using TAB and SHIFT+TAB to the appropriate dropzone and press CTRL+M once more to drop it here.": "Navigieren Sie mit TAB und UMSCHALT + TAB zum entsprechenden Dropbereich und dr\u00fccken Sie erneut STRG + M, um es hier abzulegen.", 
    "No, this item does not belong here. Try again.": "Nein, dieses Objekt geh\u00f6rt nicht hierher. Versuchen Sie es noch einmal.", 
    "None": "Keine", 
    "Note: do not edit the problem if students have already completed it. Delete the problem and create a new one.": "Hinweis: Bearbeiten Sie das Problem nicht, wenn die Teilnehmer es bereits abgeschlossen haben. L\u00f6schen Sie das Problem und erstellen Sie ein neues.", 
    "Number of attempts learner used": "Anzahl der Versuche, die der Lerner ben\u00f6tigt hat", 
    "Of course it goes here! It goes anywhere!": "Es passt hierhin! Es passt \u00fcberallhin.", 
    "Placed in: {zone_title}": "Abgelegt in: {zone_title}", 
    "Please check over your submission.": "Bitte \u00fcberpr\u00fcfen Sie Ihre Einreichung.", 
    "Preferred width": "Bevorzugte Breite", 
    "Press CTRL+M to select a draggable item (effectively picking it up).": "Dr\u00fccken Sie STRG + M, um ein ziehbares Objekt auszuw\u00e4hlen (effektiv aufzunehmen).", 
    "Press ESC if you want to cancel the drop operation (for example, to select a different item).": "Dr\u00fccken Sie ESC, wenn Sie den Dropvorgang abbrechen m\u00f6chten (um z. B. einen anderen Gegenstand auszuw\u00e4hlen).", 
    "Problem": "Problem", 
    "Problem Weight": "Gewichtung des Problems", 
    "Problem data": "Problemdaten", 
    "Problem text": "Problemtext", 
    "Remove item": "Objekt entfernen", 
    "Remove zone": "Bereich entfernen", 
    "Reset": "Zur\u00fccksetzen", 
    "Save": "Speichern", 
    "Show \"Problem\" heading": "Die \u00dcberschrift \"Problem\" anzeigen", 
    "Show Answer": "Antwort anzeigen", 
    "Show advanced settings": "Erweiterte Einstellungen anzeigen", 
    "Show title": "Titel anzeigen", 
    "Some of your answers were not correct.": "Manche Ihrer Antworten waren nicht korrekt.", 
    "Specify preferred width as percentage of the background image width. Leave blank for automatic width.": "Geben Sie die bevorzugte Breite als Prozentsatz der Breites des Hintergrundbilds an. Lassen Sie es leer, um die automatische Breite zu verwenden.", 
    "Standard": "Standard", 
    "Standard mode: the problem provides immediate feedback each time a learner drops an item on a target zone. Assessment mode: the problem provides feedback only after a learner drops all available items on target zones.": "Standardmodus: Von dem Problem wird jedes Mal ein unmittelbares Feedback abgegeben, wenn ein Lernender ein Objekt in einem Zielbereich abgelegt hat. Bewertungsmodus: Das Problem liefert Feedback erst, nachdem ein Lernender alle verf\u00fcgbaren Objekte in den Zielbereichen abgelegt hat.", 
    "Submit": "Einreichen", 
    "Submitting": "Wird eingereicht", 
    "Success feedback": "Erfolgsfeedback", 
    "TAB back to the list of draggable items and repeat this process until all of the draggable items have been placed on their respective dropzones.": "Wechseln Sie mit der TAB-Taste zur\u00fcck zur Liste der ziehbaren Objekte und wiederholen Sie diesen Vorgang, bis alle ziehbaren Objekte in den entsprechenden Dropbereichen platziert wurden.", 
    "Text": "Text", 
    "Text color to use for draggable items (example: 'white' or '#ffffff').": "Textfarbe f\u00fcr ziehbare Objekte (Beispiel: \"wei\u00df\" oder \"#ffffff\").", 
    "The Bottom Zone": "Der untere Bereich", 
    "The Middle Zone": "Der mittlere Bereich", 
    "The Top Zone": "Der obere Bereich", 
    "The background color of draggable items in the problem (example: 'blue' or '#0000ff').": "Die Hintergrundfarbe von ziehbaren Objekten im Problem (Beispiel: \"blau\" oder \"#0000ff\").", 
    "The description of the problem or instructions shown to the learner.": "Die Beschreibung des Problems oder die Anweisungen, die dem Lernenden angezeigt werden.", 
    "The title of the drag and drop problem. The title is displayed to learners.": "Der Titel der Drag & Drop-Aufgabe. Der Titel wird den Lernenden angezeigt.", 
    "There are attempts remaining": "Es sind Versuche \u00fcbrig", 
    "There was an error with your form.": "Es gab einen Fehler mit Ihrem Formular.", 
    "This is a screen reader-friendly problem": "Dies ist ein f\u00fcr Bildschirmleser geeignetes Problem", 
    "This setting limits the number of items that can be dropped into a single zone.": "Diese Einstellung begrenzt die Anzahl der Objekte, die in einen einzelnen Bereich fallen k\u00f6nnen.", 
    "Title": "Titel", 
    "Unknown DnDv2 mode {mode} - course is misconfigured": "Unbekannter DnDv2 Modus {mode} - der Kurs wurde falsch konfiguriert", 
    "Use only TAB and SHIFT+TAB to navigate between draggable items and drop zones.": "Verwenden Sie nur TAB und UMSCHALT + TAB, um zwischen ziehbaren Objekten und Dropbereichen zu navigieren.", 
    "Use text that is clear and descriptive of the item to be placed.": "Verwenden Sie einen Text, der das zu platzierende Objekt klar beschreibt.", 
    "Use this zone to associate an item with the bottom layer of the triangle.": "Verwenden Sie diesen Bereich, um ein Objekt mit der untersten Schicht des Dreiecks zu verkn\u00fcpfen.", 
    "Use this zone to associate an item with the middle layer of the triangle.": "Verwenden Sie diesen Bereich, um ein Objekt mit der mittleren Schicht des Dreiecks zu verkn\u00fcpfen.", 
    "Use this zone to associate an item with the top layer of the triangle.": "Verwenden Sie diesen Bereich, um ein Objekt mit der obersten Schicht des Dreiecks zu verkn\u00fcpfen.", 
    "You can complete this problem using only your keyboard by following the guidance below:": "Sie k\u00f6nnen dieses Problem nur mit Ihrer Tastatur l\u00f6sen, indem Sie die folgenden Anweisungen befolgen:", 
    "You have used {used} of {total} attempts.": "Sie haben {used} von {total} Versuchen verwendet.", 
    "You silly, there are no zones for this one.": "Nein, hierf\u00fcr gibt es keine Bereiche.", 
    "Your highest score is {score}": "Ihre h\u00f6chste Punktzahl {score}", 
    "Zone": "Bereich", 
    "Zone borders": "Bereichsgrenzen", 
    "Zone definitions": "Bereichsdefinitionen", 
    "Zone labels": "Bereichsbeschriftungen", 
    "Zones": "Bereiche", 
    "center": "mittig", 
    "do_attempt handler should only be called for assessment mode": "Der do_attempt Handler sollte nur f\u00fcr den Bewertungsmodus aufgerufen werden", 
    "height": "H\u00f6he", 
    "left": "links", 
    "none": "Keine", 
    "ok": "Ok", 
    "right": "rechts", 
    "show_answer handler should only be called for assessment mode": "Der show_answer Handler sollte nur f\u00fcr den Bewertungsmodus aufgerufen werden", 
    "width": "Breite", 
    "{earned}/{possible} point (graded)": [
      "{earned}/{possible} Punkt (benotet)", 
      "{earned}/{possible} Punkte (benotet)"
    ], 
    "{earned}/{possible} point (ungraded)": [
      "{earned}/{possible} Punkt (unbenotet)", 
      "{earned}/{possible} Punkte (unbenotet)"
    ], 
    "{possible} point possible (graded)": [
      "{possible} Punkt m\u00f6glich (benotet)", 
      "{possible} Punkte m\u00f6glich (benotet)"
    ], 
    "{possible} point possible (ungraded)": [
      "{possible} Punkt m\u00f6glich (unbenotet)", 
      "{possible} Punkte m\u00f6glich (unbenotet)"
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
        