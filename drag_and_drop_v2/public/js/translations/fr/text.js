
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
    "\n                            Please provide a description of the image for non-visual users.\n                            The description should provide sufficient information to allow anyone\n                            to solve the problem even without seeing the image.\n                        ": "\n                            Fournir une description de l'image pour les utilisateurs sans image.\n                            La description doit fournir des informations suffisantes pour permettre \u00e0 tout\n                            le monde de r\u00e9soudre le probl\u00e8me m\u00eame sans voir l'image.\n                           ", 
    "\"Maximum items per zone\" should be positive integer, got {max_items_per_zone}": "Le \u00ab\u00a0Nombre maximum d'\u00e9l\u00e9ments par zone\u00a0\u00bb doit \u00eatre un nombre entier positif, r\u00e9sultat {max_items_per_zone}", 
    ", draggable": ", d\u00e9pla\u00e7able", 
    ", draggable, grabbed": ", d\u00e9pla\u00e7able, saisi", 
    ", dropzone": ", zone de d\u00e9p\u00f4t", 
    "Actions": "Actions", 
    "Add a zone": "Ajouter une zone", 
    "Add an item": "Ajouter un \u00e9l\u00e9ment", 
    "Align dropped items to the left, center, or right.": "Aligner les \u00e9l\u00e9ments d\u00e9pos\u00e9s \u00e0 gauche, au centre, \u00e0 droite.", 
    "Alignment": "Alignement", 
    "An error occurred. Unable to load drag and drop problem.": "Une erreur est survenue. Impossible de t\u00e9l\u00e9charger le probl\u00e8me Faire glisser et d\u00e9poser", 
    "An isosceles triangle with three layers of similar height. It is shown upright, so the widest layer is located at the bottom, and the narrowest layer is located at the top.": "Un triangle isoc\u00e8le avec trois couches de auteur similaire. Il est pr\u00e9sent\u00e9 debout, afin que la couche la plus large soit situ\u00e9e en bas, et la couche la plus \u00e9troite soit situ\u00e9e en haut.", 
    "Assessment": "\u00c9valuation", 
    "Background URL": "URL de l'arri\u00e8re-plan", 
    "Background description": "Description d'arri\u00e8re-plan", 
    "Cancel": "Annuler", 
    "Change background": "Modifier l'arri\u00e8re-plan", 
    "Close": "Fermer", 
    "Continue": "Continuer", 
    "Correct! This one belongs to {zone}.": "Correct\u00a0! Celui-ci appartient \u00e0 {zone}", 
    "Correctly placed in: {zone_title}": "Correctement plac\u00e9 dans\u00a0: {zone_title}", 
    "Correctly placed {correct_count} item.": [
      "{correct_count} \u00e9l\u00e9ment correctement plac\u00e9.", 
      "{correct_count} \u00e9l\u00e9ments correctement plac\u00e9s."
    ], 
    "Defines the number of points the problem is worth.": "D\u00e9finit le nombre de points attribu\u00e9s au probl\u00e8me.", 
    "Defines the number of times a student can try to answer this problem. If the value is not set, infinite attempts are allowed.": "D\u00e9finit le nombre de fois qu'un \u00e9tudiant peut essayer de r\u00e9pondre \u00e0 ce probl\u00e8me. Si la valeur n'est pas d\u00e9finie, le nombre de tentatives autoris\u00e9es est infini.", 
    "Describe this zone to non-visual users.": "D\u00e9crire cette zone pour les utilisateurs sans image.", 
    "Description": "Description", 
    "Did not place {missing_count} required item.": [
      "N\u2019a pas plac\u00e9 {missing_count} \u00e9l\u00e9ment requis.", 
      "N\u2019a pas plac\u00e9 {missing_count} \u00e9l\u00e9ments requis."
    ], 
    "Display label names on the image": "Afficher les noms des \u00e9tiquettes sur l'image", 
    "Display the heading \"Problem\" above the problem text?": "Afficher l'en-t\u00eate du \u00ab\u00a0Probl\u00e8me\u00a0\u00bb au-dessus du texte du probl\u00e8me\u00a0?", 
    "Display the title to the learner?": "Afficher le titre \u00e0 l'apprenant\u00a0?", 
    "Display zone borders on the image": "Afficher les limites de zone sur l'image", 
    "Drag and Drop": "Faire glisser et d\u00e9poser", 
    "Drag and Drop Problem": "Probl\u00e8me Faire glisser et d\u00e9poser", 
    "Drag and Drop problems consist of draggable items and dropzones. Users should select a draggable item with their keyboard and then navigate to an appropriate dropzone to drop it.": "Les probl\u00e8mes Faire glisser et d\u00e9poser sont compos\u00e9s d'\u00e9l\u00e9ments d\u00e9pla\u00e7ables et de zones de d\u00e9p\u00f4t. Les utilisateurs doivent s\u00e9lectionner un \u00e9l\u00e9ment d\u00e9pla\u00e7able avec leur clavier et ensuite naviguer vers la zone de d\u00e9p\u00f4t appropri\u00e9e pour le d\u00e9poser.", 
    "Drag the items onto the image above.": "Faites glisser les \u00e9l\u00e9ments sur l'image ci-dessus.", 
    "Drop Targets": "Cibles de d\u00e9p\u00f4t", 
    "Error feedback": "Commentaire d'erreur", 
    "Failed to parse \"Maximum items per zone\"": "Impossible d'analyser \u00ab\u00a0Nombre maximum d'\u00e9l\u00e9ments par zone\u00a0\u00bb", 
    "Feedback": "Commentaire", 
    "Final attempt was used, highest score is {score}": "C'\u00e9tait votre derni\u00e8re tentative, le score le plus \u00e9lev\u00e9 est {score}", 
    "Final feedback": "Commentaire final", 
    "For example, 'http://example.com/background.png' or '/static/background.png'.": "Par exemple, 'http://example.com/background.png' ou '/static/background.png'.", 
    "For example, 'http://example.com/image.png' or '/static/image.png'.": "Par exemple, 'http://example.com/image.png' ou '/static/image.png'.", 
    "Go to Beginning": "Aller au d\u00e9but", 
    "Goes anywhere": "Il va partout", 
    "Goes to the bottom": "Va en bas", 
    "Goes to the middle": "Va au milieu", 
    "Goes to the top": "Va en haut", 
    "Good work! You have completed this drag and drop problem.": "Bien jou\u00e9\u00a0! Vous avez termin\u00e9 ce probl\u00e8me Faire glisser et d\u00e9poser.", 
    "Hide Answer": "Masquer la r\u00e9ponse", 
    "Hints:": "Astuces\u00a0:", 
    "I don't belong anywhere": "Il ne va nulle part", 
    "Image URL (alternative to the text)": "URL de l'image (alternative au texte)", 
    "Image description (should provide sufficient information to place the item even if the image did not load)": "Description de l'image (doit fournir des informations suffisantes pour placer l'\u00e9l\u00e9ment m\u00eame si l'image n'a pas \u00e9t\u00e9 t\u00e9l\u00e9charg\u00e9e)", 
    "Indicates whether a learner has completed the problem at least once": "Indique si un apprenant a termin\u00e9 le probl\u00e8me au moins une fois", 
    "Information about current positions of items that a learner has dropped on the target image.": "Informations concernant les positions actuelles des \u00e9l\u00e9ments qu'un apprenant a d\u00e9pos\u00e9 sur l'image cible.", 
    "Information about zones, items, feedback, and background image for this problem. This information is derived from the input that a course author provides via the interactive editor when configuring the problem.": "Informations concernant les zones, les \u00e9l\u00e9ments, les commentaires, et l'image d'arri\u00e8re-plan pour ce probl\u00e8me. Ces informations sont d\u00e9riv\u00e9es de l'entr\u00e9e que l'auteur d'un cours fournit via un \u00e9diteur interactif au moment de la configuration du probl\u00e8me.", 
    "Introductory feedback": "Commentaire d'introduction", 
    "Item Bank": "Banque d'\u00e9l\u00e9ments", 
    "Item background color": "Couleur d'arri\u00e8re-plan de l\u2019\u00e9l\u00e9ment", 
    "Item text color": "Couleur de texte de l'\u00e9l\u00e9ment", 
    "Items": "\u00c9l\u00e9ments", 
    "Keeps maximum score achieved by student": "Conserve le score maximum obtenu par un \u00e9tudiant", 
    "Keyboard Help": "Aide du clavier", 
    "Loading drag and drop problem.": "T\u00e9l\u00e9chargement du probl\u00e8me Faire glisser et d\u00e9poser", 
    "Max number of attempts reached": "Nombre maximum de tentatives atteint", 
    "Maximum attempts": "Nombre maximum de tentatives", 
    "Misplaced {misplaced_count} item.": [
      "{misplaced_count} \u00e9l\u00e9ment mal plac\u00e9.", 
      "{misplaced_count} \u00e9l\u00e9ments mal plac\u00e9s."
    ], 
    "Misplaced {misplaced_count} item. Misplaced item was returned to item bank.": [
      "{misplaced_count} \u00e9l\u00e9ment mal plac\u00e9. L'\u00e9l\u00e9ment mal plac\u00e9 a \u00e9t\u00e9 renvoy\u00e9 dans la banque d'\u00e9l\u00e9ments.", 
      "{misplaced_count} \u00e9l\u00e9ments mal plac\u00e9s. Les \u00e9l\u00e9ments mal plac\u00e9s ont \u00e9t\u00e9 renvoy\u00e9s dans la banque d'\u00e9l\u00e9ments."
    ], 
    "Mode": "Mode", 
    "Navigate using TAB and SHIFT+TAB to the appropriate dropzone and press CTRL+M once more to drop it here.": "Naviguez \u00e0 l'aide des touches TAB et SHIFT + TAB vers la zone de d\u00e9p\u00f4t appropri\u00e9e et appuyez sur CTRL + M une fois de plus pour l\u2019y d\u00e9poser.", 
    "No, this item does not belong here. Try again.": "Non, cet \u00e9l\u00e9ment n'appartient pas \u00e0 cette zone. R\u00e9essayez.", 
    "None": "Aucun", 
    "Note: do not edit the problem if students have already completed it. Delete the problem and create a new one.": "Remarque\u00a0: ne modifiez pas le probl\u00e8me si les \u00e9tudiants l\u2019ont d\u00e9j\u00e0 termin\u00e9. Supprimez le probl\u00e8me et cr\u00e9ez-en un nouveau.", 
    "Number of attempts learner used": "Nombre de tentatives utilis\u00e9es par l'apprenant", 
    "Of course it goes here! It goes anywhere!": "Bien s\u00fbr qu'il va ici\u00a0! Il va partout\u00a0!", 
    "Placed in: {zone_title}": "Plac\u00e9 dans\u00a0: {zone_title}", 
    "Please check over your submission.": "V\u00e9rifiez \u00e0 nouveau votre envoi.", 
    "Preferred width": "Largeur pr\u00e9f\u00e9r\u00e9e", 
    "Press CTRL+M to select a draggable item (effectively picking it up).": "Appuyez sur CTRL + M pour s\u00e9lectionner un \u00e9l\u00e9ment d\u00e9pla\u00e7able (pour le saisir activement).", 
    "Press ESC if you want to cancel the drop operation (for example, to select a different item).": "Appuyez sur ESC si vous voulez annuler l'op\u00e9ration de d\u00e9p\u00f4t (par exemple, pour s\u00e9lectionner un \u00e9l\u00e9ment diff\u00e9rent).", 
    "Problem": "Probl\u00e8me", 
    "Problem Weight": "Pond\u00e9ration du probl\u00e8me", 
    "Problem data": "Texte du probl\u00e8me", 
    "Problem text": "Texte du probl\u00e8me", 
    "Remove item": "Supprimer l'\u00e9l\u00e9ment", 
    "Remove zone": "Supprimer la zone", 
    "Reset": "R\u00e9initialiser", 
    "Save": "Enregistrer", 
    "Show \"Problem\" heading": "Affiche l'en-t\u00eate du \u00ab\u00a0Probl\u00e8me\u00a0\u00bb", 
    "Show Answer": "Afficher la r\u00e9ponse", 
    "Show advanced settings": "Afficher les param\u00e8tres avanc\u00e9s", 
    "Show title": "Afficher le titre", 
    "Some of your answers were not correct.": "Certaines de vos r\u00e9ponses ne sont pas correctes.", 
    "Specify preferred width as percentage of the background image width. Leave blank for automatic width.": "Sp\u00e9cifiez la largeur pr\u00e9f\u00e9r\u00e9e en pourcentage de la largeur de l'image d'arri\u00e8re-plan. N\u2019\u00e9crivez rien pour la largeur automatique.", 
    "Standard": "Standard", 
    "Standard mode: the problem provides immediate feedback each time a learner drops an item on a target zone. Assessment mode: the problem provides feedback only after a learner drops all available items on target zones.": "Mode standard\u00a0: le probl\u00e8me fournit imm\u00e9diatement un commentaire \u00e0 chaque fois qu'un apprenant d\u00e9pose un \u00e9l\u00e9ment dans une zone cible. Mode d'\u00e9valuation\u00a0: le probl\u00e8me fournit un commentaire uniquement apr\u00e8s qu'un apprenant a d\u00e9pos\u00e9 tous les \u00e9l\u00e9ments disponibles dans les zones cibles.", 
    "Submit": "Envoyer", 
    "Submitting": "Envoi en cours", 
    "Success feedback": "Commentaire de r\u00e9ussite", 
    "TAB back to the list of draggable items and repeat this process until all of the draggable items have been placed on their respective dropzones.": "Appuyez sur TAB pour revenir \u00e0 la liste des \u00e9l\u00e9ments d\u00e9pla\u00e7ables et r\u00e9p\u00e9tez cette proc\u00e9dure jusqu'\u00e0 ce que tous les \u00e9l\u00e9ments d\u00e9pla\u00e7ables aient \u00e9t\u00e9 plac\u00e9s sur leur zone de d\u00e9p\u00f4t respective.", 
    "Text": "Texte", 
    "Text color to use for draggable items (example: 'white' or '#ffffff').": "Couleur de texte \u00e0 utiliser pour les \u00e9l\u00e9ments d\u00e9pla\u00e7ables (exemple\u00a0: 'blanc' ou '#ffffff').", 
    "The Bottom Zone": "La zone inf\u00e9rieure", 
    "The Middle Zone": "La zone m\u00e9diane", 
    "The Top Zone": "La zone sup\u00e9rieure", 
    "The background color of draggable items in the problem (example: 'blue' or '#0000ff').": "La couleur de l'arri\u00e8re-plan des \u00e9l\u00e9ments d\u00e9pla\u00e7ables dans le probl\u00e8me (exemple\u00a0: 'bleu' ou '#0000ff').", 
    "The description of the problem or instructions shown to the learner.": "La description du probl\u00e8me ou les instructions pr\u00e9sent\u00e9es \u00e0 l'apprenant.", 
    "The title of the drag and drop problem. The title is displayed to learners.": "Le titre de ce probl\u00e8me Faire glisser et d\u00e9poser. Le titre est affich\u00e9 aux apprenants.", 
    "There are attempts remaining": "Il reste des tentatives", 
    "There was an error with your form.": "Votre formulaire contenait une erreur.", 
    "This is a screen reader-friendly problem": "Ceci est un probl\u00e8me compatible avec un lecteur d\u2019\u00e9cran", 
    "This setting limits the number of items that can be dropped into a single zone.": "Ce param\u00e8tre limite le nombre d'\u00e9l\u00e9ments qui peuvent-\u00eatre d\u00e9pos\u00e9s dans une seule zone.", 
    "Title": "Titre", 
    "Unknown DnDv2 mode {mode} - course is misconfigured": "DnDv2 mode {mode} inconnu - cours mal configur\u00e9", 
    "Use only TAB and SHIFT+TAB to navigate between draggable items and drop zones.": "Utilisez uniquement TAB et SHIFT + TAB pour naviguer entre les \u00e9l\u00e9ments d\u00e9pla\u00e7ables et les zones de d\u00e9p\u00f4t.", 
    "Use text that is clear and descriptive of the item to be placed.": "Utilisez un texte clair et descriptif de l'\u00e9l\u00e9ment \u00e0 placer.", 
    "Use this zone to associate an item with the bottom layer of the triangle.": "Utilisez cette zone pour associer un \u00e9l\u00e9ment \u00e0 la couche inf\u00e9rieure du triangle.", 
    "Use this zone to associate an item with the middle layer of the triangle.": "Utilisez cette zone pour associer un \u00e9l\u00e9ment \u00e0 la couche m\u00e9diane du triangle.", 
    "Use this zone to associate an item with the top layer of the triangle.": "Utilisez cette zone pour associer un \u00e9l\u00e9ment avec la couche sup\u00e9rieure du triangle.", 
    "You can complete this problem using only your keyboard by following the guidance below:": "Vous pouvez r\u00e9soudre ce probl\u00e8me en utilisant uniquement votre clavier en suivant les recommandations ci-dessous\u00a0:", 
    "You have used {used} of {total} attempts.": "Vous avez utilis\u00e9 {used} sur {total} tentatives.", 
    "You silly, there are no zones for this one.": "C'est idiot, il n'y a pas de zones pour celui-l\u00e0.", 
    "Your highest score is {score}": "Votre score le plus \u00e9lev\u00e9 est {score}", 
    "Zone": "Zone", 
    "Zone borders": "Limites de zone", 
    "Zone definitions": "D\u00e9finitions de zones", 
    "Zone labels": "\u00c9tiquettes de zones", 
    "Zones": "Zones", 
    "center": "Centre", 
    "do_attempt handler should only be called for assessment mode": "Le gestionnaire do_attempt ne doit \u00eatre appel\u00e9 que pour le mode d'\u00e9valuation", 
    "height": "Hauteur", 
    "left": "Gauche", 
    "none": "Aucun", 
    "ok": "ok", 
    "right": "Droite", 
    "show_answer handler should only be called for assessment mode": "Le gestionnaire show_answer ne doit \u00eatre appel\u00e9 que pour le mode d'\u00e9valuation", 
    "width": "Largeur", 
    "{earned}/{possible} point (graded)": [
      "{earned}/{possible} point (not\u00e9)", 
      "{earned}/{possible} points (not\u00e9)"
    ], 
    "{earned}/{possible} point (ungraded)": [
      "{earned}/{possible} point (non not\u00e9)", 
      "{earned}/{possible} points (non not\u00e9)"
    ], 
    "{possible} point possible (graded)": [
      "{possible} point possible (not\u00e9)", 
      "{possible} points possibles (not\u00e9)"
    ], 
    "{possible} point possible (ungraded)": [
      "{possible} point possible (non not\u00e9)", 
      "{possible} points possibles (non not\u00e9)"
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
        