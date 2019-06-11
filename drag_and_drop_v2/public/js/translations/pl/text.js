
            (function(global){
                var DragAndDropI18N = {
                  init: function() {
                    

(function(globals) {

  var django = globals.django || (globals.django = {});

  
  django.pluralidx = function(count) { return (count == 1) ? 0 : 1; };
  

  /* gettext library */

  django.catalog = django.catalog || {};
  
  var newcatalog = {
    "\n                            Please provide a description of the image for non-visual users.\n                            The description should provide sufficient information to allow anyone\n                            to solve the problem even without seeing the image.\n                        ": "\n                            Wprowad\u017a opisa\u0142 obrazu dla u\u017cytkownik\u00f3w niewidomych.\n                            Opis powinien zawiera\u0107 wystarczaj\u0105co informacji,\n                            aby wszyscy u\u017cytkownicy mogli rozwi\u0105za\u0107 problem bez patrzenia obraz.\n                        ", 
    ", draggable": ", przesuwalne", 
    ", draggable, grabbed": ", przesuwalne, z\u0142apane", 
    ", dropzone": ", obszar upuszczania element\u00f3w", 
    "Actions": "Dzia\u0142ania", 
    "Add a zone": "Dodaj obszar", 
    "Add an item": "Dodaj element", 
    "An error occurred. Unable to load drag and drop problem.": "Wyst\u0105pi\u0142 b\u0142\u0105d. Nie uda\u0142o si\u0119 wczyta\u0107 problemu typu \u201ePrzeci\u0105gnij i upu\u015b\u0107\u201d", 
    "An isosceles triangle with three layers of similar height. It is shown upright, so the widest layer is located at the bottom, and the narrowest layer is located at the top.": "Tr\u00f3jk\u0105t r\u00f3wnoramienny z trzema warstwami o podobnej wysoko\u015bci. Pokazany jest pionowo, a wi\u0119c najszersza warstwa jest zlokalizowana na dole, a najw\u0119\u017csza warstwa jest u g\u00f3ry.", 
    "Assessment": "Na ocen\u0119", 
    "Background Image": "Obraz t\u0142a", 
    "Background URL": "URL obrazu t\u0142a", 
    "Background description": "Opis t\u0142a", 
    "Basic Settings": "Ustawienia podstawowe", 
    "Cancel": "Anuluj", 
    "Change background": "Zmie\u0144 t\u0142o", 
    "Close": "Zamknij", 
    "Continue": "Kontynuuj", 
    "Correct": "Prawid\u0142owe", 
    "Correct! This one belongs to The Bottom Zone.": "Brawo! Ten element nale\u017cy do Dolnego Obszaru.", 
    "Correct! This one belongs to The Middle Zone.": "Brawo! Ten element nale\u017cy do \u015arodkowego Obszaru.", 
    "Correct! This one belongs to The Top Zone.": "Brawo! Ten element nale\u017cy do G\u00f3rnego Obszaru.", 
    "Correctly placed in: {zone_title}": "Poprawnie umieszczono w: {zone_title}", 
    "Correctly placed {correct_count} item.": [
      "Prawid\u0142owo przyporz\u0105dkowa\u0142e\u015b {correct_count} element.", 
      "Prawid\u0142owo przyporz\u0105dkowa\u0142e\u015b {correct_count} element\u00f3w."
    ], 
    "DEPRECATED. Keeps maximum score achieved by student as a weighted value.": "PRZESTARZA\u0141E. Zachowuje maksymalny osi\u0105gni\u0119ty przez ucznia wynik jako wynik do oceny.", 
    "Defines the number of points the problem is worth.": "Okre\u015bla liczb\u0119 punkt\u00f3w przyznawan\u0105 za rozwi\u0105zanie problemu.", 
    "Defines the number of times a student can try to answer this problem. If the value is not set, infinite attempts are allowed.": "Okre\u015bla liczb\u0119 razy ucze\u0144 mo\u017ce pr\u00f3bowa\u0107 rozwi\u0105za\u0107 ten problem. Je\u015bli warto\u015b\u0107 ta nie jest ustawiona, ucze\u0144 mo\u017ce pr\u00f3bowa\u0107 w niesko\u0144czono\u015b\u0107.", 
    "Did not place {missing_count} required item.": [
      "Nie przyporz\u0105dkowa\u0142e\u015b {missing_count} wymaganego elementu.", 
      "Nie przyporz\u0105dkowa\u0142e\u015b {missing_count} wymaganych element\u00f3w."
    ], 
    "Display label names on the image": "Poka\u017c nazwy etykiet na obrazie", 
    "Display the heading \"Problem\" above the problem text?": "Pokaza\u0107 nag\u0142\u00f3wek \u201eProblem\u201d nad tekstem?", 
    "Display the title to the learner?": "Pokaza\u0107 ten tytu\u0142 uczniowi?", 
    "Display zone borders on the image": "Poka\u017c granice obszar\u00f3w na obrazie", 
    "Drag and Drop": "Przeci\u0105gnij i upu\u015b\u0107", 
    "Drag and Drop Problem": "Problem typu \u201ePrzeci\u0105gnij i upu\u015b\u0107\u201d", 
    "Drag and Drop problems consist of draggable items and dropzones. Users should select a draggable item with their keyboard and then navigate to an appropriate dropzone to drop it.": "Problem typu \u201ePrzeci\u0105gnij i upu\u015b\u0107\u201d sk\u0142ada si\u0119 z przeci\u0105galnych element\u00f3w i obszar\u00f3w upuszczania. U\u017cytkownicy musz\u0105 wybra\u0107 przeci\u0105galnych element za pomoc\u0105 klawiatury i nast\u0119pnie przenie\u015b\u0107 go odpowiedniego obszaru i upu\u015bci\u0107.", 
    "Drag the items onto the image above.": "Przeci\u0105gnij elementy na powy\u017cszy obrazek.", 
    "Drop Targets": "Upu\u015b\u0107 elementy docelowe", 
    "Feedback": "Informacja zwrotna", 
    "Final attempt was used, highest score is {score}": "To by\u0142a ostatnia pr\u00f3ba, najwy\u017cszy wynik to {score}", 
    "Final feedback": "Ko\u0144cowa informacja zwrotna", 
    "For example, 'http://example.com/background.png' or '/static/background.png'.": "Na przyk\u0142ad: \u201ehttp://example.com/background.png' or '/static/background.png\u201d.", 
    "Generate image and zones": "Wygeneruj obraz i obszary", 
    "Generate image automatically": "Wygeneruj obraz automatycznie", 
    "Go to Beginning": "Powr\u00f3\u0107 do pocz\u0105tku", 
    "Goes anywhere": "Pasuje wsz\u0119dzie", 
    "Goes to the bottom": "Pasuje do dolnego obszaru", 
    "Goes to the middle": "Pasuje do \u015brodkowego obszaru", 
    "Goes to the top": "Pasuje do g\u00f3rnego obszaru", 
    "Good work! You have completed this drag and drop problem.": "Dobra robota! Poradzi\u0142e\u015b sobie z problemem typu \u201eprzeci\u0105gnij i upu\u015b\u0107\u201d.", 
    "Hints:": "Wskaz\u00f3wki:", 
    "I don't belong anywhere": "Nie pasuje nigdzie", 
    "Incorrect": "Nieprawid\u0142owe", 
    "Indicates whether a learner has completed the problem at least once": "Okre\u015bla, czy ucze\u0144 rozwi\u0105za\u0142 problem przynajmniej raz.", 
    "Information about current positions of items that a learner has dropped on the target image.": "Informacja o bie\u017c\u0105cych pozycja element\u00f3w, kt\u00f3re ucze\u0144 upu\u015b\u0107 na obraz docelowy.", 
    "Information about zones, items, feedback, and background image for this problem. This information is derived from the input that a course author provides via the interactive editor when configuring the problem.": "Informacje dotycz\u0105ce obszar\u00f3w, informacji zwrotnej i obrazu t\u0142a dla tego problemu. Informacja ta jest uzyskiwana z danych wprowadzanych przez autora kursu za po\u015brednictwem interaktywnego edytora podczas tworzenia problemu.", 
    "Introductory feedback": "Wst\u0119pna informacja zwrotna", 
    "Item Bank": "Bank element\u00f3w", 
    "Item background color": "Kolor t\u0142a elementu", 
    "Item definitions": "Definicje element\u00f3w", 
    "Item text color": "Kolor tekstu elementu", 
    "Items": "Elementy", 
    "Items placed here: ": "Elementy umieszczone tutaj:", 
    "Keeps maximum score achieved by student as a raw value between 0 and 1.": "Zakochuje maksymalny wynik osi\u0105gniemy przez ucznia jako surow\u0105 warto\u015b\u0107 pomi\u0119dzy 0 a 1.", 
    "Keyboard Help": "Pomoc klawiatury", 
    "Loading drag and drop problem.": "Wczytywanie problemu typu \u201eprzeci\u0105gnij i upu\u015b\u0107\u201d", 
    "Maximum attempts": "Maksymalna liczba pr\u00f3b", 
    "Maximum items per zone": "Maksymalna liczba element\u00f3w w obszarze", 
    "Misplaced {misplaced_count} item.": [
      "\u0179le przyporz\u0105dkowa\u0142e\u015b {misplaced_count} element.", 
      "\u0179le przyporz\u0105dkowa\u0142e\u015b {misplaced_count} element\u00f3w."
    ], 
    "Misplaced {misplaced_count} item. Misplaced item was returned to item bank.": [
      "\u0179le przyporz\u0105dkowa\u0142e\u015b {misplaced_count} element. Element zosta\u0142 od\u0142o\u017cony do banku.", 
      "\u0179le przyporz\u0105dkowa\u0142e\u015b {misplaced_count} element\u00f3w. Elementy zosta\u0142y od\u0142o\u017cone do banku."
    ], 
    "Mode": "Tryb", 
    "Navigate using TAB and SHIFT+TAB to the appropriate dropzone and press CTRL+M once more to drop it here.": "Przemieszczaj si\u0119 pomi\u0119dzy odpowiednimi obszarami upuszczenia za pomoc\u0105 klawisza TAB lub kombinacji SHIFT+TAB i naci\u015bnij jeszcze raz CTRL+M, aby upu\u015bci\u0107 element", 
    "No items placed here": "Nie umieszczono tu \u017cadnych element\u00f3w", 
    "No, this item does not belong here. Try again.": "Nie, ten element nie nale\u017cy do tego obszaru. Spr\u00f3buj jeszcze raz.", 
    "Number of attempts learner used": "Liczba pr\u00f3b ucznia", 
    "Number of columns": "Liczba kolumn", 
    "Number of columns and rows.": "Liczba kolumn i wierszy", 
    "Number of rows": "Liczba wierszy", 
    "Of course it goes here! It goes anywhere!": "Jasne, \u017ce ten element tu pasuje, bo pasuje do ka\u017cdego obszaru!", 
    "Placed in: {zone_title}": "Umieszczono w: {zone_title}", 
    "Please check over your submission.": "Prosimy sprawdzi\u0107 ponownie Twoje zg\u0142oszenie.", 
    "Please check the values you entered.": "Prosimy sprawdzi\u0107 wprowadzone warto\u015bci.", 
    "Press CTRL+M to select a draggable item (effectively picking it up).": "Naci\u015bnij CTRL+M, aby wybra\u0107 przeci\u0105galny element (to znaczy, \u017ceby go podnie\u015b\u0107).", 
    "Press ESC if you want to cancel the drop operation (for example, to select a different item).": "Naci\u015bnij ESC je\u015bli chcesz przerwa operacj\u0119 upuszczenia (na przyk\u0142ad je\u015bli chcesz wybra\u0107 inny element).", 
    "Problem": "Problem", 
    "Problem Weight": "Waga problemu", 
    "Problem data": "Dane problemu", 
    "Problem text": "Tekst problemu", 
    "Provide custom image": "Wczytaj w\u0142asny obraz", 
    "Reset": "Zresetuj", 
    "Save": "Zapisz", 
    "Saving": "Zapisywanie", 
    "Show \"Problem\" heading": "Poka\u017c nag\u0142\u00f3wek \u201eProblem\u201d", 
    "Show Answer": "Poka\u017c odpowied\u017a", 
    "Show title": "Poka\u017c tytu\u0142", 
    "Size of a single zone in pixels.": "Wielko\u015b\u0107 pojedynczego obszaru w pikselach", 
    "Some of your answers were not correct.": "Niekt\u00f3re z Twoich odpowiedzi by\u0142y niepoprawne.", 
    "Standard": "Standardowy", 
    "Standard mode: the problem provides immediate feedback each time a learner drops an item on a target zone. Assessment mode: the problem provides feedback only after a learner drops all available items on target zones.": "Tryb standardowy: problem zapewnia uczniowi natychmiastow\u0105 informacj\u0119 zwrotn\u0105 po ka\u017cdym upuszczeniu elementu w danym obszarze. Tryb na ocen\u0119: problem zapewnia uczniowi informacj\u0119 zwrotn\u0105 dopiero po przyporz\u0105dkowaniu wszystkich element\u00f3w do obszar\u00f3w", 
    "Submit": "Prze\u015blij", 
    "Submitting": "Przesy\u0142anie", 
    "TAB back to the list of draggable items and repeat this process until all of the draggable items have been placed on their respective dropzones.": "Za pomoc\u0105 klawisza TAB powr\u00f3\u0107 do listy przeci\u0105galnych element\u00f3w i powt\u00f3rz ca\u0142y proces, a\u017c wszystkie elementy znajd\u0105 si\u0119 w odpowiednich obszarach.", 
    "Text color to use for draggable items (example: 'white' or '#ffffff').": "Kolor tekstu u\u017cywanego w przeci\u0105galnych elementach (na przyk\u0142ad: \u201ebia\u0142y\u201d lub \u201e#ffffff\u201d)", 
    "The Bottom Zone": "Dolny obszar", 
    "The Middle Zone": "\u015arodkowy obszar", 
    "The Top Zone": "G\u00f3rny obszar", 
    "The background color of draggable items in the problem (example: 'blue' or '#0000ff').": "Kolor t\u0142a przeci\u0105galnych element\u00f3w w tym problemie (na przyk\u0142ad: \u201eniebieski\u201d lub \u201e#0000ff\u201d", 
    "The description of the problem or instructions shown to the learner.": "Opis problemu lub instrukcja dla ucznia", 
    "The title of the drag and drop problem. The title is displayed to learners.": "Nazwa problemu. Uczniowie b\u0119d\u0105 mogli zobaczy\u0107 ten tytu\u0142.", 
    "There was an error with your form.": "Wyst\u0105pi\u0142 b\u0142\u0105d z Twoim formularzem.", 
    "This is a screen reader-friendly problem.": "Ten problem jest dostosowany do czytnik\u00f3w ekranowych.", 
    "This setting limits the number of items that can be dropped into a single zone.": "To ustawienie ogranicza liczb\u0119 obszar\u00f3w, kt\u00f3re mog\u0105 zosta\u0107 upuszczone na jeden obszar.", 
    "Title": "Tytu\u0142", 
    "Unknown Zone": "Nieznany obszar", 
    "Use only TAB and SHIFT+TAB to navigate between draggable items and drop zones.": "U\u017cywaj jedynie klawisza TAB i kombinacji SHIFT+TAB, aby przemieszcza\u0107 si\u0119 pomi\u0119dzy przeci\u0105galnymi elementami i obszarami upuszczenia.", 
    "Use this zone to associate an item with the bottom layer of the triangle.": "U\u017cyj tego obszaru, \u017ceby przypisa\u0107 element do dolnej warstwy tr\u00f3jk\u0105ta.", 
    "Use this zone to associate an item with the middle layer of the triangle.": "U\u017cyj tego obszaru, \u017ceby przypisa\u0107 element do \u015brodkowej warstwy tr\u00f3jk\u0105ta.", 
    "Use this zone to associate an item with the top layer of the triangle.": "U\u017cyj tego obszaru, \u017ceby przypisa\u0107 element do g\u00f3rnej warstwy tr\u00f3jk\u0105ta.", 
    "You can complete this problem using only your keyboard by following the guidance below:": "Mo\u017cesz rozwi\u0105za\u0107 ten problem, u\u017cywaj\u0105c wy\u0142\u0105cznie klawiatury i wykonuj\u0105c nast\u0119puj\u0105ce instrukcje:", 
    "You cannot add any more items to this zone.": "Nie mo\u017cesz doda\u0107 wi\u0119cej element\u00f3w do tego obszaru.", 
    "You have used {used} of {total} attempts.": "Wykorzysta\u0142e\u015b {used} z {total} pr\u00f3b.", 
    "You silly, there are no zones for this one.": "G\u0142uptasie, ten element nie nale\u017cy do \u017cadnego obszaru.", 
    "Your highest score is {score}": "Tw\u00f3j najwy\u017cszy wynik to {score}", 
    "Zone Layout": "Layout obszar\u00f3w", 
    "Zone Size": "Wielko\u015b\u0107 obszaru", 
    "Zone borders": "Granice obszar\u00f3w", 
    "Zone definitions": "Definicje obszar\u00f3w", 
    "Zone height": "Wysoko\u015b\u0107 obszaru", 
    "Zone labels": "Etykiety obszar\u00f3w", 
    "Zone width": "Szeroko\u015b\u0107 obszaru", 
    "Zone {num}": [
      "Obszar {num}", 
      "Obszar {num}"
    ], 
    "Zones": "Obszary", 
    "droppable": "upuszczalne", 
    "{earned}/{possible} point (graded)": [
      "{earned}/{possible} punkt (podlega ocenie)", 
      "{earned}/{possible} punkt\u00f3w (podlega ocenie)"
    ], 
    "{earned}/{possible} point (ungraded)": [
      "{earned}/{possible} punkt (nie podlega ocenie)", 
      "{earned}/{possible} punkt\u00f3w (nie podlega ocenie)"
    ], 
    "{possible} point possible (graded)": [
      "{possible} punkt mo\u017cliwy (podlega ocenie)", 
      "{possible} punkt\u00f3w mo\u017cliwych (podlega ocenie)"
    ], 
    "{possible} point possible (ungraded)": [
      "{possible} punkt mo\u017cliwy (nie podlega ocenie)", 
      "{possible} punkt\u00f3w mo\u017cliwych (nie podlega ocenie)"
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
    "DATETIME_FORMAT": "j E Y H:i", 
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
    "DATE_FORMAT": "j E Y", 
    "DATE_INPUT_FORMATS": [
      "%d.%m.%Y", 
      "%d.%m.%y", 
      "%y-%m-%d", 
      "%Y-%m-%d"
    ], 
    "DECIMAL_SEPARATOR": ",", 
    "FIRST_DAY_OF_WEEK": "1", 
    "MONTH_DAY_FORMAT": "j F", 
    "NUMBER_GROUPING": "3", 
    "SHORT_DATETIME_FORMAT": "d-m-Y  H:i", 
    "SHORT_DATE_FORMAT": "d-m-Y", 
    "THOUSAND_SEPARATOR": "\u00a0", 
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
        