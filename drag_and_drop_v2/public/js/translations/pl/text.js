
            (function(global){
                var DragAndDropI18N = {
                  init: function() {
                    

(function(globals) {

  var django = globals.django || (globals.django = {});

  
  django.pluralidx = function(n) {
    var v=(n==1 ? 0 : (n%10>=2 && n%10<=4) && (n%100<12 || n%100>14) ? 1 : n!=1 && (n%10>=0 && n%10<=1) || (n%10>=5 && n%10<=9) || (n%100>=12 && n%100<=14) ? 2 : 3);
    if (typeof(v) == 'boolean') {
      return v ? 1 : 0;
    } else {
      return v;
    }
  };
  

  /* gettext library */

  django.catalog = django.catalog || {};
  
  var newcatalog = {
    "\n                            Please provide a description of the image for non-visual users.\n                            The description should provide sufficient information to allow anyone\n                            to solve the problem even without seeing the image.\n                        ": "\nProsz\u0119 wprowadzi\u0107 opis obrazka. Opis powinien by\u0107 na tyle precyzyjny, aby umo\u017cliwi\u0107 rozwi\u0105zanie \u0107wiczenia, nawet je\u015bli obrazek si\u0119 nie wczyta (wytyczne WCAG).",
    "(inherited from Advanced Settings)": "(dziedziczone z ustawie\u0144 zaawansowanych)",
    ", draggable": ".",
    ", draggable, grabbed": ".",
    ", dropzone": ", strefa",
    "Actions": "Czynno\u015bci",
    "Add a zone": "Dodaj stref\u0119",
    "Add an item": "Dodaj element",
    "After All Attempts": "Po wszystkich pr\u00f3bach",
    "After All Attempts or Correct": "Po wszystkich pr\u00f3bach lub po odpowiedzi poprawnej",
    "Always": "Zawsze",
    "An error occurred. Unable to load drag and drop problem.": "Wyst\u0105pi\u0142 b\u0142\u0105d. Nie uda\u0142o si\u0119 za\u0142adowa\u0107 \u0107wiczenia \"Przeci\u0105gnij i upu\u015b\u0107\".",
    "Answered": "Udzielono odpowiedzi",
    "Assessment": "Oceny",
    "Attempted": "Podj\u0119to pr\u00f3b\u0119",
    "Attempted or Past Due": "Po podj\u0119tej pr\u00f3bie lub po terminie",
    "Background Image": "Obraz t\u0142a",
    "Background URL": "Adres URL t\u0142a",
    "Background description": "Opis t\u0142a",
    "Basic Settings": "Ustawienia podstawowe",
    "Cancel": "Anuluj",
    "Change background": "Zmie\u0144 t\u0142o",
    "Close": "Zamknij",
    "Closed": "Zamkni\u0119te",
    "Continue": "Kontynuuj",
    "Correct": "Poprawnie",
    "Correct or Past Due": "Prawid\u0142owo lub po terminie",
    "Correct! This one belongs to The Bottom Zone.": "Prawid\u0142owo! Element pasuje do dolnej strefy.",
    "Correct! This one belongs to The Middle Zone.": "Prawid\u0142owo! Element pasuje do \u015brodkowej strefy.",
    "Correct! This one belongs to The Top Zone.": "Prawid\u0142owo! Element pasuje do tej g\u00f3rnej strefy.",
    "Correctly placed in: {zone_title}": "Prawid\u0142owo umieszczono w strefie: {zone_title}",
    "Correctly placed {correct_count} item": [
      "Poprawnie dopasowano {correct_count} element",
      "Poprawnie dopasowano {correct_count} elementy",
      "Poprawnie dopasowano {correct_count} element\u00f3w",
      "Poprawnie dopasowano {correct_count} element\u00f3w"
    ],
    "DEPRECATED. Keeps maximum score achieved by student as a weighted value.": "NIEWSPIERANE: Zachowuje maksymalny wynik uzyskany przez studenta jako warto\u015b\u0107 wa\u017con\u0105.",
    "Default": "Domy\u015blnie",
    "Defines the number of points the problem is worth.": "Okre\u015bla liczb\u0119 punkt\u00f3w za wykonanie \u0107wiczenia.",
    "Defines the number of times a student can try to answer this problem. If the value is not set, infinite attempts are allowed.": "Pozwala okre\u015bli\u0107 liczb\u0119 pr\u00f3b, jak\u0105 student mo\u017ce podj\u0105\u0107 w celu wykonania \u0107wiczenia. W przypadku niewpisania warto\u015bci, dopuszcza si\u0119 nielimitowan\u0105 ilo\u015b\u0107 pr\u00f3b.",
    "Defines when to show the answer to the problem. A default value can be set in Advanced Settings. To revert setting a custom value, choose the 'Default' option.": "Okre\u015bl, kiedy wy\u015bwietli\u0107 odpowied\u017a na \u0107wiczenie. Mo\u017cna wskaza\u0107 domy\u015bln\u0105 warto\u015b\u0107 w ustawieniach zaawansowanych. Aby przywr\u00f3ci\u0107 ustawienie warto\u015bci niestandardowej, nale\u017cy wybra\u0107 opcj\u0119 \"Domy\u015blnie\".",
    "Did not place {missing_count} required item": [
      "Nie dopasowano {missing_count} wymaganego elementu",
      "Nie dopasowano {missing_count} wymaganych element\u00f3w",
      "Nie dopasowano {missing_count} wymaganych element\u00f3w",
      "Nie dopasowano {missing_count} wymaganych element\u00f3w"
    ],
    "Display label names on the image": "Wy\u015bwietl na obrazku nazwy etykiet",
    "Display the heading \"Problem\" above the problem text?": "Czy wy\u015bwietli\u0107 nag\u0142\u00f3wek \"\u0106wiczenie\" nad tre\u015bci\u0105 \u0107wiczenia?",
    "Display the title to the learner?": "Czy wy\u015bwietla\u0107 studentom tytu\u0142 \u0107wiczenia?",
    "Display zone borders on the image": "Wy\u015bwietl na obrazku granice strefy",
    "Display zone borders when dragging an item": "Wy\u015bwietl granice stref w trakcie przeci\u0105gania elementu",
    "Drag and Drop Problem": "\u0106wiczenie \"Przeci\u0105gnij i upu\u015b\u0107\"",
    "Drag and Drop problems consist of draggable items and dropzones. Users should select a draggable item with their keyboard and then navigate to an appropriate dropzone to drop it.": "\u0106wiczenia \"przeci\u0105gnij i upu\u015b\u0107\" sk\u0142adaj\u0105 si\u0119 z daj\u0105cych si\u0119 przeci\u0105ga\u0107 element\u00f3w oraz stref, do kt\u00f3rych te elementy nale\u017cy przyporz\u0105dkowa\u0107. Zadanie studenta polega na wyborze elementu, a nast\u0119pnie dopasowaniu elementu do odpowiedniej strefy.",
    "Drag the items onto the image above.": "Dopasuj elementy do odpowiednich stref obrazka.",
    "Drop Targets": "Upuszczaj elementy",
    "Explanation": "Instrukcja",
    "Explanation Text": "Tekst instrukcji",
    "Feedback": "Komentarz",
    "Final attempt was used, highest score is {score}": "Wykorzystano ostatni\u0105 pr\u00f3b\u0119, tw\u00f3j najlepszy wynik to {score}",
    "Final feedback": "Komentarz ko\u0144cowy",
    "Finished": "Uko\u0144czone",
    "For example, 'http://example.com/background.png' or '/static/background.png'.": "Na przyk\u0142ad 'http://example.com/background.png' lub '/static/background.png'.",
    "Generate image and zones": "Wygeneruj obrazek i strefy",
    "Generate image automatically": "Wygeneruj obraz automatycznie",
    "Go to Beginning": "Wr\u00f3\u0107 do pocz\u0105tku",
    "Goes anywhere": "Pasuje wsz\u0119dzie",
    "Goes to the bottom": "Pasuje do dolnej strefy",
    "Goes to the middle": "Pasuje do \u015brodkowej strefy",
    "Goes to the top": "Pasuje do g\u00f3rnej strefy",
    "Good work! You have completed this drag and drop problem.": "Dobra robota! \u0106wiczenie uko\u0144czone.",
    "Hints:": "Podpowiedzi:",
    "I don't belong anywhere": "Nie pasuje do \u017cadnej ze stref",
    "Incorrect": "B\u0142\u0119dnie",
    "Indicates whether a learner has completed the problem at least once": "Wskazuje, czy student wykona\u0142 \u0107wiczenie przynajmniej jeden raz.",
    "Information about current positions of items that a learner has dropped on the target image.": "Informacja na temat obecnych pozycji element\u00f3w upuszczonych przez studenta na obrazek docelowy.",
    "Information about zones, items, feedback, explanation and background image for this problem. This information is derived from the input that a course author provides via the interactive editor when configuring the problem.": "Informacje na temat stref, element\u00f3w, odpowiedzi zwrotnej, wyja\u015bnie\u0144 i t\u0142a \u0107wiczenia. Zbi\u00f3r informacji z p\u00f3l interaktywnego edytora uzupe\u0142nianych przez autora zadania w trakcie konfigurowania tre\u015bci.",
    "Introductory feedback": "Komentarz wst\u0119pny",
    "Item Bank": "Zbi\u00f3r element\u00f3w",
    "Item background color": "Kolor t\u0142a elementu",
    "Item definitions": "Zdefiniowania element\u00f3w",
    "Item text color": "Kolor tekstu elementu",
    "Items": "Elementy",
    "Items placed here: ": "Elementy umieszczone tutaj:",
    "Keeps maximum score achieved by student as a raw value between 0 and 1.": "Zachowuje maksymalny wynik uzyskany przez studenta jako warto\u015b\u0107 pomi\u0119dzy 0 a 1.",
    "Keyboard Help": "Pomoc klawiatury",
    "Loading drag and drop problem.": "\u0141adowanie \u0107wiczenia \"przeci\u0105gnij i upu\u015b\u0107\".",
    "Max number of attempts reached": "Wykorzystano maksymaln\u0105 liczb\u0119 pr\u00f3b",
    "Maximum attempts": "Maksymalna liczba pr\u00f3b",
    "Maximum items per zone": "Maksymalna liczba element\u00f3w w strefie",
    "Maximum score available of the problem as a raw value between 0 and 1.": "Maksymalny dost\u0119pny wynik \u0107wiczenia jako warto\u015b\u0107 pomi\u0119dzy 0 a 1.",
    "Misplaced {misplaced_count} item": [
      "B\u0142\u0119dnie dopasowano {misplaced_count} element",
      "B\u0142\u0119dnie dopasowano {misplaced_count} elementy",
      "B\u0142\u0119dnie dopasowano {misplaced_count} element\u00f3w",
      "B\u0142\u0119dnie dopasowano {misplaced_count} element\u00f3w"
    ],
    "Misplaced {misplaced_count} item (misplaced item was returned to the item bank)": [
      "B\u0142\u0119dnie dopasowano {misplaced_count} element (b\u0142\u0119dnie dopasowany element wr\u00f3ci\u0142 do puli)",
      "B\u0142\u0119dnie dopasowano {misplaced_count} elementy (b\u0142\u0119dnie dopasowane elementy wr\u00f3ci\u0142y do puli)",
      "B\u0142\u0119dnie dopasowano {misplaced_count} element\u00f3w (b\u0142\u0119dnie dopasowane elementy wr\u00f3ci\u0142y do puli)",
      "B\u0142\u0119dnie dopasowano {misplaced_count} element\u00f3w (b\u0142\u0119dnie dopasowane elementy wr\u00f3ci\u0142y do puli)"
    ],
    "Mode": "Tryb",
    "Navigate using TAB and SHIFT+TAB to the appropriate dropzone and press CTRL+M once more to drop it here.": "U\u017cywaj\u0105c TAB i SHIFT+TAB przenie\u015b si\u0119 do wybranej strefy i naci\u015bnij CTRL+M, aby umie\u015bci\u0107 w niej element.",
    "Never": "Nigdy",
    "No items placed here": "Nie umieszczono tutaj \u017cadnych element\u00f3w",
    "No, this item does not belong here. Try again.": "Nie, ten element tutaj nie pasuje. Spr\u00f3buj ponownie.",
    "Number of attempts learner used": "Liczba podej\u015b\u0107",
    "Number of columns": "Liczba kolumn",
    "Number of columns and rows.": "Liczba kolumn i wierszy",
    "Number of rows": "Liczba wierszy",
    "Of course it goes here! It goes anywhere!": "Oczywi\u015bcie! Element pasuje wsz\u0119dzie!",
    "Past Due": "Po terminie",
    "Placed in: {zone_title}": "Umieszczono w strefie: {zone_title}",
    "Please check over your submission.": "Prosz\u0119 ponownie sprawdzi\u0107 konfiguracj\u0119 \u0107wiczenia.",
    "Please check the values you entered.": "Prosz\u0119 sprawdzi\u0107 wprowadzone warto\u015bci",
    "Press CTRL+M to select a draggable item (effectively picking it up).": "Naci\u015bnij CTRL+M, aby wybra\u0107 element (i go \"podnie\u015b\u0107\").",
    "Press ESC if you want to cancel the drop operation (for example, to select a different item).": "Naci\u015bnij ESC, je\u015bli chcesz anulowa\u0107 rozpocz\u0119t\u0105 czynno\u015b\u0107 (np. chc\u0105c wybra\u0107 inny element).",
    "Problem": "\u0106wiczenie",
    "Problem Weight": "Waga \u0107wiczenia",
    "Problem data": "Dane \u0107wiczenia",
    "Problem text": "Opis \u0107wiczenia",
    "Provide custom image": "Wstaw w\u0142asny obraz",
    "Przeci\u0105gnij i upu\u015b\u0107": "Przeci\u0105gnij i upu\u015b\u0107",
    "Reset": "Reset",
    "Save": "Zapisz",
    "Saving": "Zapisywanie",
    "Show \"Problem\" heading": "Wy\u015bwietlanie nag\u0142\u00f3wka \"\u0106wiczenie\"",
    "Show Answer": "Poka\u017c odpowied\u017a",
    "Show answer": "Poka\u017c odpowied\u017a",
    "Show title": "Wy\u015bwietlanie tytu\u0142u",
    "Size of a single zone in pixels.": "Rozmiar pojedynczej strefy w pikselach",
    "Some of your answers were not correct.": "Cz\u0119\u015b\u0107 z twoich odpowiedzi nie by\u0142a poprawna.",
    "Standard": "Standardowy",
    "Standard mode: the problem provides immediate feedback each time a learner drops an item on a target zone. Assessment mode: the problem provides feedback only after a learner drops all available items on target zones.": "Tryb standardowy: odpowied\u017a zwrotna pojawia si\u0119 za ka\u017cdym razem, kiedy student przyporz\u0105dkowuje element do strefy. Tryb oceny: odpowied\u017a pojawia si\u0119 dopiero po przyporz\u0105dkowaniu wszystkich element\u00f3w do stref.",
    "Submission deadline has passed.": "Up\u0142yn\u0105\u0142 termin ko\u0144cowy na wykonanie \u0107wiczenia.",
    "Submit": "Wy\u015blij",
    "Submitting": "Przesy\u0142anie",
    "TAB back to the list of draggable items and repeat this process until all of the draggable items have been placed on their respective dropzones.": "Przyciskiem TAB wr\u00f3\u0107 do listy element\u00f3w i powtarzaj czynno\u015b\u0107 a\u017c wszystkie elementy zostan\u0105 przez ciebie dopasowane do stref.",
    "Text color to use for draggable items (example: 'white' or '#ffffff').": "Kolor tekstu dopasowywanych element\u00f3w (np. 'niebieski' lub '#ffffff').",
    "The Bottom Zone": "Dolna strefa",
    "The Middle Zone": "\u015arodkowa strefa",
    "The Top Zone": "G\u00f3rna strefa",
    "The answer is unavailable": "Odpowied\u017a jest niedost\u0119pna",
    "The background color of draggable items in the problem (example: 'blue' or '#0000ff').": "Kolor t\u0142a dopasowywanych element\u00f3w (np. 'niebieski' lub '#0000ff')",
    "The description of the problem or instructions shown to the learner.": "Opis \u0107wiczenia i/lub instrukcje dla student\u00f3w.",
    "The title of the drag and drop problem. The title is displayed to learners.": "Tytu\u0142 tego \u0107wiczenia, widoczny dla student\u00f3w",
    "There was an error with your form.": "Wyst\u0105pi\u0142 b\u0142\u0105d z przesy\u0142aniem odpowiedzi.",
    "This is a screen reader-friendly problem.": "To \u0107wiczenie jest dost\u0119pne dla czytnika ekranu.",
    "This setting limits the number of items that can be dropped into a single zone.": "To ustawienie pozwala ograniczy\u0107 liczb\u0119 element\u00f3w mog\u0105cych si\u0119 znale\u017a\u0107 w jednej strefie.",
    "Title": "Tytu\u0142",
    "Tr\u00f3jk\u0105t r\u00f3wnoramienny z trzema strefami o podobnej wysoko\u015bci. Najszersza strefa znajduje si\u0119 na dole, a najw\u0119\u017csza na g\u00f3rze.": "Tr\u00f3jk\u0105t r\u00f3wnoramienny z trzema strefami o podobnej wysoko\u015bci. Najszersza strefa znajduje si\u0119 na dole, a najw\u0119\u017csza na g\u00f3rze.",
    "Unknown DnDv2 mode {mode} - course is misconfigured": "Nieznany tryb DnDv2 {mode} - kurs skonfigurowany nieprawid\u0142owo",
    "Unknown Zone": "Nieznana strefa",
    "Use only TAB and SHIFT+TAB to navigate between draggable items and drop zones.": "U\u017cyj klawiszy TAB oraz SHIFT+TAB w celu przemieszczania si\u0119 pomi\u0119dzy elementami i strefami.",
    "Use this zone to associate an item with the bottom layer of the triangle.": "U\u017cyj tej strefy, aby powi\u0105za\u0107 element z doln\u0105 cz\u0119\u015bci\u0105 tr\u00f3jk\u0105ta.",
    "Use this zone to associate an item with the middle layer of the triangle.": "U\u017cyj tej strefy, aby powi\u0105za\u0107 element ze \u015brodkow\u0105 cz\u0119\u015bci\u0105 tr\u00f3jk\u0105ta.",
    "Use this zone to associate an item with the top layer of the triangle.": "U\u017cyj tej strefy, aby powi\u0105za\u0107 element z g\u00f3rn\u0105 cz\u0119\u015bci\u0105 tr\u00f3jk\u0105ta.",
    "You can complete this problem using only your keyboard by following the guidance below:": "Mo\u017cesz wykona\u0107 to \u0107wiczenie korzystaj\u0105c wy\u0142\u0105cznie z klawiatury, post\u0119puj\u0105c zgodnie z poni\u017cszymi wskaz\u00f3wkami:",
    "You cannot add any more items to this zone.": "Nie mo\u017cesz doda\u0107 wi\u0119cej element\u00f3w do tej strefy.",
    "You have used {used} of {total} attempts.": "Wykorzystano {used} spo\u015br\u00f3d {total} mo\u017cliwych pr\u00f3b.",
    "You silly, there are no zones for this one.": "\u0179le, ten element nie pasuje do \u017cadnej strefy.",
    "Your highest score is {score}": "Tw\u00f3j najlepszy wynik to {score}",
    "Zone Layout": "Layout strefy",
    "Zone Size": "Rozmiar strefy",
    "Zone borders": "Granice strefy",
    "Zone definitions": "Zdefiniowania strefy",
    "Zone height": "Wysoko\u015b\u0107 strefy",
    "Zone labels": "Etykiety strefy",
    "Zone width": "Szeroko\u015b\u0107 strefy",
    "Zone {num}": [
      "Strefa {num}",
      "Strefa {num}",
      "Strefa {num}",
      "Strefa {num}"
    ],
    "Zones": "Strefy",
    "do_attempt handler should only be called for assessment mode": "Z do_attempt powinno si\u0119 korzysta\u0107 tylko w trybie oceny",
    "droppable": ".",
    "show_answer handler should only be called for assessment mode": "Z show_answer powinno si\u0119 korzysta\u0107 tylko w trybie oceny",
    "{earned}/{possible} point (graded)": [
      "{earned}/{possible} punkt (klasyfikowany)",
      "{earned}/{possible} punkty (klasyfikowany)",
      "{earned}/{possible} punkt\u00f3w (klasyfikowany)",
      "{earned}/{possible} punkt\u00f3w (klasyfikowany)"
    ],
    "{earned}/{possible} point (ungraded)": [
      "{earned}/{possible} punkt (nieklasyfikowany)",
      "{earned}/{possible} punkt (nieklasyfikowany)",
      "{earned}/{possible} punkty (nieklasyfikowany)",
      "{earned}/{possible} punkt\u00f3w (nieklasyfikowany)"
    ],
    "{possible} point possible (graded)": [
      "{possible} mo\u017cliwy punkt (klasyfikowany)",
      "{possible} mo\u017cliwe punkty (klasyfikowany)",
      "{possible} mo\u017cliwych punkt\u00f3w (klasyfikowany)",
      "{possible} mo\u017cliwych punkt\u00f3w (klasyfikowany)"
    ],
    "{possible} point possible (ungraded)": [
      "{possible} mo\u017cliwy punkt (nieklasyfikowany)",
      "{possible} mo\u017cliwe punkty (nieklasyfikowany)",
      "{possible} mo\u017cliwych punkt\u00f3w (nieklasyfikowany)",
      "{possible} mo\u017cliwych punkt\u00f3w (nieklasyfikowany)"
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
        