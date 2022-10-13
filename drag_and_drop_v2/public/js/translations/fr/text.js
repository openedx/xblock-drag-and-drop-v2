
            (function(global){
                var DragAndDropI18N = {
                  init: function() {
                    

(function(globals) {

  var django = globals.django || (globals.django = {});

  
  django.pluralidx = function(n) {
    var v=(n == 0 || n == 1) ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;
    if (typeof(v) == 'boolean') {
      return v ? 1 : 0;
    } else {
      return v;
    }
  };
  

  /* gettext library */

  django.catalog = django.catalog || {};
  
  var newcatalog = {
    "\n                            Please provide a description of the image for non-visual users.\n                            The description should provide sufficient information to allow anyone\n                            to solve the problem even without seeing the image.\n                        ": "\n                            Veuillez fournir une description de l'image pour les utilisateurs.\n                            La description devrait \u00eatre assez compl\u00e8te pour permettre \u00e0 quiconque\n                           de r\u00e9soudre ce probl\u00e8me m\u00eame sans avoir vu l'image.\n                        ",
    ", draggable": ", glissable",
    ", draggable, grabbed": ", glissable, saisi",
    ", dropzone": "zone de d\u00e9p\u00f4t",
    "Actions": "Actions",
    "Add a zone": "Ajouter une zone",
    "Add an item": "Ajouter un \u00e9l\u00e9ment",
    "An error occurred. Unable to load drag and drop problem.": "Une erreur est survenue. Impossible de charger l'exercice de glisser-d\u00e9poser.",
    "An isosceles triangle with three layers of similar height. It is shown upright, so the widest layer is located at the bottom, and the narrowest layer is located at the top.": "Un triangle isoc\u00e8le avec trois niveaux de m\u00eame hauteur. Il est montr\u00e9 la base en bas, et donc le plus large niveau est situ\u00e9 \u00e0 la base, alors que le niveau le plus \u00e9troit est situ\u00e9 au sommet.",
    "Assessment": "\u00c9valuation",
    "Background Image": "Image de fond",
    "Background URL": "URL du fond",
    "Background description": "Description du fond",
    "Basic Settings": "Param\u00e8tres de base",
    "Cancel": "Annuler",
    "Change background": "Changer de fond",
    "Close": "Fermer",
    "Continue": "Continuer",
    "Correct": "Correcte",
    "Correct! This one belongs to The Bottom Zone.": "Correct! Celui-ci appartient \u00e0 la zone inf\u00e9rieure.",
    "Correct! This one belongs to The Middle Zone.": "Correct! Celui-ci appartient \u00e0 la zone du milieu.",
    "Correct! This one belongs to The Top Zone.": "Correct! Celui-ci appartient \u00e0 la zone sup\u00e9rieur.",
    "Correctly placed in: {zone_title}": "Plac\u00e9 correctement dans\u00a0: {zone_title}",
    "Correctly placed {correct_count} item": [
      "{correct_count} \u00e9l\u00e9ment correctement plac\u00e9",
      "{correct_count} \u00e9l\u00e9ments correctement plac\u00e9s",
      "{correct_count} \u00e9l\u00e9ments correctement plac\u00e9s"
    ],
    "DEPRECATED. Keeps maximum score achieved by student as a weighted value.": "D\u00c9CONSEILL\u00c9. Conserve le score maximum atteint par l'\u00e9tudiant en tant que valeur pond\u00e9r\u00e9e.",
    "Defines the number of points the problem is worth.": "D\u00e9finir le nombre de points pour lequel ce probl\u00e8me compte.",
    "Defines the number of times a student can try to answer this problem. If the value is not set, infinite attempts are allowed.": "D\u00e9finit le nombre de fois qu'un \u00e9tudiant peut essayer de r\u00e9pondre au probl\u00e8me. Si aucune valeur n'est pr\u00e9cis\u00e9e, un nombre infini d'essais est autoris\u00e9.",
    "Did not place {missing_count} required item": [
      "{missing_count} \u00e9l\u00e9ment requis n'a pas \u00e9t\u00e9 positionn\u00e9",
      "{missing_count} \u00e9l\u00e9ments requis n'ont pas \u00e9t\u00e9 positionn\u00e9s",
      "{missing_count} \u00e9l\u00e9ments requis n'ont pas \u00e9t\u00e9 positionn\u00e9s"
    ],
    "Display label names on the image": "Afficher les noms de label sur l'image",
    "Display the heading \"Problem\" above the problem text?": "Afficher l'en-t\u00eate \u00ab\u00a0Probl\u00e8me\u00a0\u00bb au dessus du texte du probl\u00e8me\u00a0?",
    "Display the title to the learner?": "Afficher le titre aux \u00e9tudiants\u00a0?",
    "Display zone borders on the image": "Afficher les bordures de zone sur l'image",
    "Drag and Drop": "Glisser D\u00e9poser",
    "Drag and Drop Problem": "Probl\u00e8me de glisser-d\u00e9poser",
    "Drag and Drop problems consist of draggable items and dropzones. Users should select a draggable item with their keyboard and then navigate to an appropriate dropzone to drop it.": "Les exercices de Glisser-D\u00e9poser est compos\u00e9 d'\u00e9l\u00e9ments glissables et de zones de d\u00e9p\u00f4t. Les utilisateurs devront s\u00e9lectionner un \u00e9l\u00e9ment glissable avec leur clavier et le diriger vers une zone de d\u00e9p\u00f4t acceptable afin de le d\u00e9poser.",
    "Drag the items onto the image above.": "Glissez cet \u00e9l\u00e9ment sur l'image ci-dessus.",
    "Drop Targets": "Cibles de d\u00e9p\u00f4t",
    "Explanation": "Explication",
    "Feedback": "Commentaire",
    "Final attempt was used, highest score is {score}": "Vous avez utilis\u00e9 votre derni\u00e8re tentative, votre score le plus \u00e9lev\u00e9 est de {score}",
    "Final feedback": "Commentaire final",
    "For example, 'http://example.com/background.png' or '/static/background.png'.": "Par exemple, \u00ab http://example.com/background.png \u00bb ou \u00ab /static/background.png \u00bb.",
    "Generate image and zones": "G\u00e9n\u00e9rer l'image et les zones",
    "Generate image automatically": "G\u00e9n\u00e9rer automatiquement une image",
    "Go to Beginning": "Revenir au d\u00e9but",
    "Goes anywhere": "Va n'importe o\u00f9",
    "Goes to the bottom": "Va en bas",
    "Goes to the middle": "Va au milieu",
    "Goes to the top": "Va au sommet",
    "Good work! You have completed this drag and drop problem.": "Bon travail! Vous avez compl\u00e9t\u00e9 cet exercice de glisser-d\u00e9poser.",
    "Hints:": "Astuces:",
    "I don't belong anywhere": "Je ne vais nulle part",
    "Incorrect": "Incorrect",
    "Indicates whether a learner has completed the problem at least once": "Indique si l'\u00e9tudiant a termin\u00e9 ce probl\u00e8me au moins une fois",
    "Information about current positions of items that a learner has dropped on the target image.": "Information \u00e0 propos des emplacements actuels d'\u00e9l\u00e9ments d\u00e9pos\u00e9s par l'\u00e9tudiant sur l'image cible.",
    "Introductory feedback": "Commentaire d'instructions",
    "Item Bank": "Banque d'\u00e9l\u00e9ments",
    "Item background color": "\u00c9l\u00e9ment couleur de fond",
    "Item definitions": "D\u00e9finitions des \u00e9l\u00e9ments",
    "Item text color": "\u00c9l\u00e9ment couleur du texte",
    "Items": "\u00c9l\u00e9ments",
    "Items placed here: ": "\u00c9l\u00e9ments plac\u00e9s ici:",
    "Keeps maximum score achieved by student as a raw value between 0 and 1.": "Conserve le score maximum atteint par l'\u00e9tudiant en tant que valeur brute entre 0 et 1.",
    "Keyboard Help": "Aide clavier",
    "Loading drag and drop problem.": "Chargement de l'exercice de glisser-d\u00e9plasser.",
    "Max number of attempts reached": "Nombre maximum de tentatives atteint",
    "Maximum attempts": "Nombre d'essais maximum",
    "Maximum items per zone": "Nombre maximum d'\u00e9l\u00e9ments par zone",
    "Maximum score available of the problem as a raw value between 0 and 1.": "Note maximale disponible du probl\u00e8me sous forme de valeur brute entre 0 et 1.",
    "Misplaced {misplaced_count} item": [
      "{misplaced_count} \u00e9l\u00e9ment mal plac\u00e9",
      "{misplaced_count} \u00e9l\u00e9ments mal plac\u00e9s",
      "{misplaced_count} \u00e9l\u00e9ments mal plac\u00e9s"
    ],
    "Misplaced {misplaced_count} item (misplaced item was returned to the item bank)": [
      "{misplaced_count} \u00e9l\u00e9ment mal plac\u00e9. Cet \u00e9l\u00e9ment est de nouveau disponible.",
      "{misplaced_count} \u00e9l\u00e9ments mal plac\u00e9s. Ces \u00e9l\u00e9ments sont de nouveaux disponibles.",
      "{misplaced_count} \u00e9l\u00e9ments mal plac\u00e9s. Ces \u00e9l\u00e9ments sont de nouveaux disponibles."
    ],
    "Mode": "Mode",
    "Navigate using TAB and SHIFT+TAB to the appropriate dropzone and press CTRL+M once more to drop it here.": "Naviguez en utilisant TAB et SHIFT+TAB jusqu'\u00e0 la zone de d\u00e9p\u00f4t ad\u00e9quate et appuyez sur CTRL+M encore une fois pour la d\u00e9poser l\u00e0.",
    "No items placed here": "Aucun \u00e9l\u00e9ment plac\u00e9 ici",
    "No, this item does not belong here. Try again.": "Non, cet \u00e9l\u00e9ment n'appartient pas l\u00e0. Essayez encore.",
    "Number of attempts learner used": "Nombre de tentatives faites par l'\u00e9tudiant",
    "Number of columns": "Le nombre de colonnes",
    "Number of columns and rows.": "Le nombre de colonnes et de rang\u00e9es.",
    "Number of rows": "Le nombre de rang\u00e9es",
    "Of course it goes here! It goes anywhere!": "Bien s\u00fbr qu'il va l\u00e0\u00a0! Il peut aller n'importe o\u00f9\u00a0!",
    "Placed in: {zone_title}": "Plac\u00e9 dans\u00a0: {zone_title}",
    "Please check over your submission.": "Veuillez v\u00e9rifier vos r\u00e9ponses",
    "Please check the values you entered.": "Veuillez v\u00e9rifier les valeurs que vous avez saisies.",
    "Press CTRL+M to select a draggable item (effectively picking it up).": "Appuyez sur CTRL+M pour s\u00e9lectionnez un \u00e9l\u00e9ment glissable (le ramassant vraiment).",
    "Press ESC if you want to cancel the drop operation (for example, to select a different item).": "Appuyez sur ESC si vous voulez annuler l'op\u00e9ration de d\u00e9p\u00f4t (par exemple, pour s\u00e9lectionner un autre \u00e9l\u00e9ment).",
    "Problem": "Exercice",
    "Problem Weight": "Poids du probl\u00e8me",
    "Problem data": "Donn\u00e9es du probl\u00e8me",
    "Problem text": "Probl\u00e8me \u00e9crit",
    "Provide custom image": "Fournissez une image personnalis\u00e9e",
    "Reset": "R\u00e9initialiser",
    "Save": "Enregistrer",
    "Saving": "Enregistrement",
    "Show \"Problem\" heading": "Montrer l'en-t\u00eate du \u00ab\u00a0Probl\u00e8me\u00a0\u00bb",
    "Show Answer": "Afficher la r\u00e9ponse",
    "Show title": "Afficher le titre",
    "Size of a single zone in pixels.": "Taille d'une seule zone en pixels.",
    "Some of your answers were not correct.": "Certaines de vos r\u00e9ponses n'\u00e9taient pas correctes.",
    "Standard": "Standard",
    "Standard mode: the problem provides immediate feedback each time a learner drops an item on a target zone. Assessment mode: the problem provides feedback only after a learner drops all available items on target zones.": "Mode standard\u00a0: l'exercice fait imm\u00e9diatement un commentaire \u00e0 chaque fois que l'\u00e9tudiant d\u00e9place un \u00e9l\u00e9ment dans une zone cible. Mode d'\u00e9valuation\u00a0: l'exercice fait un commentaire une fois que l'\u00e9tudiant d\u00e9place tous les \u00e9l\u00e9ments disponibles dans les zones cibles.",
    "Submission deadline has passed.": "La date limite de soumission est pass\u00e9e.",
    "Submit": "Envoyer",
    "Submitting": "R\u00e9ponse",
    "TAB back to the list of draggable items and repeat this process until all of the draggable items have been placed on their respective dropzones.": "Appuyez \u00e0 nouveau sur TAB pour revenir \u00e0 la liste d\u2019\u00e9l\u00e9ments glissables et r\u00e9p\u00e9tez cette proc\u00e9dure jusqu\u2019\u00e0 ce que tous les \u00e9l\u00e9ments glissables aient \u00e9t\u00e9 plac\u00e9s dans leur propre zone de d\u00e9p\u00f4t.",
    "Text color to use for draggable items (example: 'white' or '#ffffff').": "La couleur de texte \u00e0 employer pour les \u00e9l\u00e9ments glissables (par exemple : 'blanc' ou '#ffffff').",
    "The Bottom Zone": "La zone du bas",
    "The Middle Zone": "La zone du milieu",
    "The Top Zone": "La zone du haut",
    "The background color of draggable items in the problem (example: 'blue' or '#0000ff').": "La couleur de fond des \u00e9l\u00e9ments glissables dans l'exercice (par exemple\u00a0: 'bleu' ou '#0000ff').",
    "The description of the problem or instructions shown to the learner.": "La description du probl\u00e8me ou les instructions affich\u00e9es \u00e0 l'\u00e9tudiant.",
    "The title of the drag and drop problem. The title is displayed to learners.": "Le titre de l'exercice de glisser-d\u00e9placer. Ce titre est affich\u00e9 aux \u00e9tudiants.",
    "There was an error with your form.": "Il y avait une erreur avec votre formulaire.",
    "This is a screen reader-friendly problem.": "Il s'agit d'un probl\u00e8me facile \u00e0 lire \u00e0 l'\u00e9cran.",
    "This setting limits the number of items that can be dropped into a single zone.": "Ce param\u00e8tre limite le nombre d'\u00e9l\u00e9ments pouvant \u00eatre d\u00e9pos\u00e9s dans une seule zone.",
    "Title": "Titre",
    "Unknown DnDv2 mode {mode} - course is misconfigured": "Mode {mode} DnDv2 inconnu - cours mal-configur\u00e9",
    "Unknown Zone": "Zone inconnue",
    "Use only TAB and SHIFT+TAB to navigate between draggable items and drop zones.": "Utilisez seulement TAB et MAJ+TAB pour naviguer entre les \u00e9l\u00e9ments glissables et les zones de d\u00e9p\u00f4t.",
    "Use this zone to associate an item with the bottom layer of the triangle.": "Utilisez cette zone pour associer un \u00e9l\u00e9ment au niveau \u00e0 la base du triangle.",
    "Use this zone to associate an item with the middle layer of the triangle.": "Utilisez cette zone pour y associer un \u00e9l\u00e9ment au niveau au milieu du triangle.",
    "Use this zone to associate an item with the top layer of the triangle.": "Utilisez cette zone pour y associer un \u00e9l\u00e9ment au niveau au sommet du triangle.",
    "You can complete this problem using only your keyboard by following the guidance below:": "Vous pouvez r\u00e9gler ce probl\u00e8me en utilisant votre propre clavier selon les instructions ci-dessous\u00a0:",
    "You cannot add any more items to this zone.": "Vous ne pouvez plus ajouter d\u2019\u00e9l\u00e9ments \u00e0 cette zone.",
    "You have used {used} of {total} attempts.": "Vous avez utilis\u00e9 {used} de vos {total} tentatives.",
    "You silly, there are no zones for this one.": "Il n'y a pas de zone pour celui-l\u00e0.",
    "Your highest score is {score}": "Votre score le plus \u00e9lev\u00e9 est de {score}",
    "Zone Layout": "Disposition des zones",
    "Zone Size": "Taille de la zone",
    "Zone borders": "Bordures de zone",
    "Zone definitions": "D\u00e9finition des zones",
    "Zone height": "Hauteur de la zone",
    "Zone labels": "Labels des zones",
    "Zone width": "Largeur de la zone",
    "Zone {num}": [
      "Zone {num}",
      "Zone {num}",
      "Zone {num}"
    ],
    "Zones": "Zones",
    "do_attempt handler should only be called for assessment mode": "responsable de tentatives faites do_attempt \u00e0 contacter uniquement en mode d'\u00e9valuation",
    "droppable": "d\u00e9posable",
    "show_answer handler should only be called for assessment mode": "responsable de r\u00e9ponses \u00e0 montrer show_answer \u00e0 contacter uniquement en mode d'\u00e9valuation",
    "{earned}/{possible} point (graded)": [
      "{earned}/{possible} point (not\u00e9)",
      "{earned}/{possible} points (not\u00e9s)",
      "{earned}/{possible} points (not\u00e9s)"
    ],
    "{earned}/{possible} point (ungraded)": [
      "{earned}/{possible} point (non not\u00e9)",
      "{earned}/{possible} points (non not\u00e9s)",
      "{earned}/{possible} points (non not\u00e9s)"
    ],
    "{possible} point possible (graded)": [
      "{possible} point \u00e9ventuel (not\u00e9)",
      "{possible} points \u00e9ventuels (not\u00e9s)",
      "{possible} points \u00e9ventuels (not\u00e9s)"
    ],
    "{possible} point possible (ungraded)": [
      "{possible} point \u00e9ventuel (non not\u00e9)",
      "{possible} points \u00e9ventuels (non not\u00e9s)",
      "{possible} points \u00e9ventuels (non not\u00e9s)"
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
    "DATETIME_FORMAT": "j F Y H:i",
    "DATETIME_INPUT_FORMATS": [
      "%d/%m/%Y %H:%M:%S",
      "%d/%m/%Y %H:%M:%S.%f",
      "%d/%m/%Y %H:%M",
      "%d/%m/%Y",
      "%d.%m.%Y %H:%M:%S",
      "%d.%m.%Y %H:%M:%S.%f",
      "%d.%m.%Y %H:%M",
      "%d.%m.%Y",
      "%Y-%m-%d %H:%M:%S",
      "%Y-%m-%d %H:%M:%S.%f",
      "%Y-%m-%d %H:%M",
      "%Y-%m-%d"
    ],
    "DATE_FORMAT": "j F Y",
    "DATE_INPUT_FORMATS": [
      "%d/%m/%Y",
      "%d/%m/%y",
      "%d.%m.%Y",
      "%d.%m.%y",
      "%Y-%m-%d"
    ],
    "DECIMAL_SEPARATOR": ",",
    "FIRST_DAY_OF_WEEK": "1",
    "MONTH_DAY_FORMAT": "j F",
    "NUMBER_GROUPING": "3",
    "SHORT_DATETIME_FORMAT": "j N Y H:i",
    "SHORT_DATE_FORMAT": "j N Y",
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
        