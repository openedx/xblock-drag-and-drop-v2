
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
    "\n                            Please provide a description of the image for non-visual users.\n                            The description should provide sufficient information to allow anyone\n                            to solve the problem even without seeing the image.\n                        ": "\n                            Por favor, disponibilize uma descri\u00e7\u00e3o da imagem para utilizadores com dificuldades visuais.\n                            A descri\u00e7\u00e3o deve dar informa\u00e7\u00f5es suficientes para permitir que qualquer pessoa\n                            resolva o problema mesmo sem ver a imagem.\n                    ",
    ", draggable": ", arrast\u00e1vel",
    ", draggable, grabbed": ", arrast\u00e1vel, agarrando",
    ", dropzone": ", zona para largar os itens",
    "Actions": "A\u00e7\u00f5es",
    "Add a zone": "Adicionar uma zona",
    "Add an item": "Adicionar um item",
    "An error occurred. Unable to load drag and drop problem.": "Ocorreu um erro. N\u00e3o \u00e9 poss\u00edvel carregar este problema.",
    "An isosceles triangle with three layers of similar height. It is shown upright, so the widest layer is located at the bottom, and the narrowest layer is located at the top.": "Um tri\u00e2ngulo is\u00f3sceles com tr\u00eas camadas de altura semelhante. \u00c9 mostrado na posi\u00e7\u00e3o vertical, de modo que a camada maior esteja localizada na parte inferior e a camada mais pequena localizada na parte superior.",
    "Assessment": "Avalia\u00e7\u00e3o",
    "Background Image": "Imagem de fundo",
    "Background URL": "URL do plano de fundo",
    "Background description": "Descri\u00e7\u00e3o do plano de fundo",
    "Basic Settings": "Configura\u00e7\u00f5es b\u00e1sicas",
    "Cancel": "Cancelar",
    "Change background": "Mudar o plano de fundo",
    "Close": "Fechar",
    "Continue": "Continuar",
    "Correct": "Correto",
    "Correct! This one belongs to The Bottom Zone.": "Correto! Este pertence \u00e0 zona inferior.",
    "Correct! This one belongs to The Middle Zone.": "Correto! Este pertence \u00e0 zona interm\u00e9dia.",
    "Correct! This one belongs to The Top Zone.": "Correto! Este pertence \u00e0 zona superior.",
    "Correctly placed in: {zone_title}": "Corretamente colocado em: {zone_title}",
    "Correctly placed {correct_count} item": [
      "{correct_count} item colocado corretamente",
      "{correct_count} itens corretamente colocados",
      "{correct_count} itens corretamente colocados"
    ],
    "DEPRECATED. Keeps maximum score achieved by student as a weighted value.": "DESCONTINUADO. Mant\u00e9m a pontua\u00e7\u00e3o m\u00e1xima alcan\u00e7ada pelo aluno como valor ponderado.",
    "Defines the number of points the problem is worth.": "Define o n\u00famero de pontos que o problema vale.",
    "Defines the number of times a student can try to answer this problem. If the value is not set, infinite attempts are allowed.": "Define o n\u00famero de vezes que um estudante pode tentar responder a este problema. Se o valor n\u00e3o estiver definido, \u00e9 permitido um n\u00famero infinito de tentativas.",
    "Did not place {missing_count} required item": [
      "N\u00e3o foi colocado {missing_count} item obrigat\u00f3rio",
      "N\u00e3o foram colocados {missing_count} itens obrigat\u00f3rios",
      "N\u00e3o foram colocados {missing_count} itens obrigat\u00f3rios"
    ],
    "Display label names on the image": "Mostrar nomes de etiquetas na imagem",
    "Display the heading \"Problem\" above the problem text?": "Mostrar o t\u00edtulo \"problema\" acima do texto do problema?",
    "Display the title to the learner?": "Mostrar o t\u00edtulo ao estudante?",
    "Display zone borders on the image": "Mostrar limites da zona na imagem",
    "Drag and Drop": "Arraste e Solte",
    "Drag and Drop Problem": "Problema de Arrastar e Largar",
    "Drag and Drop problems consist of draggable items and dropzones. Users should select a draggable item with their keyboard and then navigate to an appropriate dropzone to drop it.": "Os problemas de arrastar e largar consistem em itens arrast\u00e1veis e zonas para largar esses mesmos itens. Os utilizadores devem selecionar um item arrast\u00e1vel com o seu teclado e, em seguida, navegar at\u00e9 \u00e0 zona apropriada para o largar.",
    "Drag the items onto the image above.": "Arraste os itens para a imagem acima.",
    "Drop Targets": "Alvos onde Largar",
    "Feedback": "Coment\u00e1rio",
    "Final attempt was used, highest score is {score}": "A \u00faltima tentativa foi utilizada, a pontua\u00e7\u00e3o mais alta \u00e9 {score}",
    "Final feedback": "Feedback final",
    "For example, 'http://example.com/background.png' or '/static/background.png'.": "Por exemplo, 'http://example.com/background.png' ou '/static/background.png'.",
    "Generate image and zones": "Gerar imagem e zonas",
    "Generate image automatically": "Gerar imagem automaticamente",
    "Go to Beginning": "Ir para in\u00edcio",
    "Goes anywhere": "Vai a qualquer lugar",
    "Goes to the bottom": "Vai para o fundo",
    "Goes to the middle": "Vai para o meio",
    "Goes to the top": "Vai para o topo",
    "Good work! You have completed this drag and drop problem.": "Bom trabalho! Concluiu este problema de arrastar e soltar.",
    "Hints:": "Sugest\u00f5es:",
    "I don't belong anywhere": "Eu n\u00e3o perten\u00e7o a nenhum lugar",
    "Incorrect": "Incorreto",
    "Indicates whether a learner has completed the problem at least once": "Indica se um estudante concluiu o problema pelo menos uma vez",
    "Information about current positions of items that a learner has dropped on the target image.": "Informa\u00e7\u00f5es sobre as posi\u00e7\u00f5es atuais dos itens que um estudante descartou na imagem de destino.",
    "Introductory feedback": "Coment\u00e1rio inicial",
    "Item Bank": "Banco de Itens",
    "Item background color": "Cor do fundo do item",
    "Item definitions": "Defini\u00e7\u00f5es do item",
    "Item text color": "Cor do texto do item",
    "Items": "Itens",
    "Items placed here: ": "Itens colocados aqui:",
    "Keeps maximum score achieved by student as a raw value between 0 and 1.": "Mant\u00e9m a pontua\u00e7\u00e3o m\u00e1xima alcan\u00e7ada pelo aluno como um valor bruto entre 0 e 1.",
    "Keyboard Help": "Ajuda de Teclado",
    "Loading drag and drop problem.": "A carregar o problema de arrastar e largar.",
    "Max number of attempts reached": "N\u00famero m\u00e1ximo de tentativas atingido",
    "Maximum attempts": "M\u00e1ximo de tentativas",
    "Maximum items per zone": "M\u00e1ximo de itens por zona",
    "Maximum score available of the problem as a raw value between 0 and 1.": "Pontua\u00e7\u00e3o m\u00e1xima dispon\u00edvel do problema com um valor bruto entre 0 e 1.",
    "Misplaced {misplaced_count} item": [
      "{misplaced_count} item mal colocado",
      "{misplaced_count} itens mal colocados",
      "{misplaced_count} itens mal colocados"
    ],
    "Misplaced {misplaced_count} item (misplaced item was returned to the item bank)": [
      "{misplaced_count} item mal colocado. Este item foi devolvido ao banco de itens. ",
      "{misplaced_count} itens mal colocados. Estes itens foram devolvidos ao banco de itens. ",
      "{misplaced_count} itens mal colocados. Estes itens foram devolvidos ao banco de itens. "
    ],
    "Mode": "Modo",
    "Navigate using TAB and SHIFT+TAB to the appropriate dropzone and press CTRL+M once more to drop it here.": "Navegue usando TAB e SHIFT + TAB para a zona apropriada e pressione CTRL + M mais uma vez para largar o item aqui.",
    "No items placed here": "Nenhum item colocado aqui",
    "No, this item does not belong here. Try again.": "N\u00e3o, este item n\u00e3o pertence aqui. Tente novamente.",
    "Number of attempts learner used": "N\u00famero de tentativas utilizadas pelo estudante",
    "Number of columns": "N\u00famero de colunas",
    "Number of columns and rows.": "N\u00famero de colunas e linhas.",
    "Number of rows": "N\u00famero de linhas",
    "Of course it goes here! It goes anywhere!": "Claro que vai! Vai a qualquer lugar!",
    "Placed in: {zone_title}": "Colocado em: {zone_title}",
    "Please check over your submission.": "Por favor, verifique o envio.",
    "Please check the values you entered.": "Por favor, verifique os valores que introduziu.",
    "Press CTRL+M to select a draggable item (effectively picking it up).": "Pressione CTRL + M para selecionar um item arrast\u00e1vel (pegar efetivamente no item).",
    "Press ESC if you want to cancel the drop operation (for example, to select a different item).": "Prima ESC se pretender cancelar a opera\u00e7\u00e3o de largar (por exemplo, para selecionar um item diferente).",
    "Problem": "Problema",
    "Problem Weight": "Import\u00e2ncia do problema",
    "Problem data": "Dados do problema",
    "Problem text": "Texto do problema",
    "Provide custom image": "Forne\u00e7a uma imagem personalizada",
    "Reset": "Reiniciar",
    "Save": "Guardar",
    "Saving": "A Guardar",
    "Show \"Problem\" heading": "Mostrar o t\u00edtulo \"problema\"",
    "Show Answer": "Mostrar Resposta",
    "Show title": "Mostrar t\u00edtulo",
    "Size of a single zone in pixels.": "Tamanho em pix\u00e9is de uma zona \u00fanica .",
    "Some of your answers were not correct.": "Algumas das suas respostas n\u00e3o estavam corretas.",
    "Standard": "Padr\u00e3o",
    "Standard mode: the problem provides immediate feedback each time a learner drops an item on a target zone. Assessment mode: the problem provides feedback only after a learner drops all available items on target zones.": "Modo padr\u00e3o: o problema d\u00e1 feedback imediato cada vez que um aluno solta um item numa zona de destino. Modo de avalia\u00e7\u00e3o: o problema d\u00e1 feedback apenas depois do estudante arrastar todos os itens dispon\u00edveis para as zonas de destino.",
    "Submission deadline has passed.": "O prazo para submiss\u00e3o j\u00e1 passou.",
    "Submit": "Submeter",
    "Submitting": "A submeter",
    "TAB back to the list of draggable items and repeat this process until all of the draggable items have been placed on their respective dropzones.": "TAB de volta \u00e0 lista de itens arrast\u00e1veis e repita este processo at\u00e9 que todos os itens arrast\u00e1veis tenham sido colocados nas suas respectivas zonas.",
    "Text color to use for draggable items (example: 'white' or '#ffffff').": "Cor do texto dos itens arrast\u00e1veis (exemplo: 'white' ou '#ffffff').",
    "The Bottom Zone": "A zona inferior",
    "The Middle Zone": "A zona m\u00e9dia",
    "The Top Zone": "A zona superior",
    "The background color of draggable items in the problem (example: 'blue' or '#0000ff').": "A cor de fundo dos itens arrast\u00e1veis no problema (exemplo: 'blue' ou '#0000ff').",
    "The description of the problem or instructions shown to the learner.": "A descri\u00e7\u00e3o do problema ou instru\u00e7\u00f5es que o estudante v\u00ea.",
    "The title of the drag and drop problem. The title is displayed to learners.": "O t\u00edtulo do problema de arrastar e soltar. O t\u00edtulo \u00e9 vis\u00edvel para os estudantes.",
    "There was an error with your form.": "Houve um erro com o seu formul\u00e1rio.",
    "This is a screen reader-friendly problem.": "Este \u00e9 um problema amig\u00e1vel para os leitores de ecr\u00e3.",
    "This setting limits the number of items that can be dropped into a single zone.": "Esta configura\u00e7\u00e3o limita o n\u00famero de itens que podem ser colocados numa \u00fanica zona.",
    "Title": "T\u00edtulo",
    "Unknown DnDv2 mode {mode} - course is misconfigured": "Modo DnDv2 desconhecido {mode} - o curso est\u00e1 mal configurado",
    "Unknown Zone": "Zona desconhecida",
    "Use only TAB and SHIFT+TAB to navigate between draggable items and drop zones.": "Use somente TAB e SHIFT+TAB para navegar entre itens arrast\u00e1veis e zonas para largar.",
    "Use this zone to associate an item with the bottom layer of the triangle.": "Use esta zona para associar um item com a camada inferior do tri\u00e2ngulo.",
    "Use this zone to associate an item with the middle layer of the triangle.": "Use esta zona para associar um item \u00e0 camada intermedi\u00e1ria do tri\u00e2ngulo.",
    "Use this zone to associate an item with the top layer of the triangle.": "Use esta zona para associar um item \u00e0 camada superior do tri\u00e2ngulo.",
    "You can complete this problem using only your keyboard by following the guidance below:": "Pode concluir este problema usando apenas o teclado e seguindo as orienta\u00e7\u00f5es abaixo:",
    "You cannot add any more items to this zone.": "N\u00e3o pode adicionar mais itens nesta zona.",
    "You have used {used} of {total} attempts.": "Usou {used} de {total} tentativas.",
    "You silly, there are no zones for this one.": "N\u00e3o h\u00e1 zonas criadas para este item.",
    "Your highest score is {score}": "A sua pontua\u00e7\u00e3o mais alta \u00e9 {score}",
    "Zone Layout": "Layout da zona",
    "Zone Size": "Dimens\u00f5es da Zona",
    "Zone borders": "Limites da zona",
    "Zone definitions": "Defini\u00e7\u00f5es de zona",
    "Zone height": "Altura da Zona",
    "Zone labels": "Etiquetas de zona",
    "Zone width": "Largura da Zona",
    "Zone {num}": [
      "Zona {num}",
      "Zona {num}",
      "Zona {num}"
    ],
    "Zones": "Zonas",
    "do_attempt handler should only be called for assessment mode": "O manipulador do_attempt s\u00f3 deve ser utilizado no modo de avalia\u00e7\u00e3o",
    "droppable": "arrast\u00e1vel",
    "show_answer handler should only be called for assessment mode": "O manipulador show_answer s\u00f3 deve ser utilizado no modo de avalia\u00e7\u00e3o",
    "{earned}/{possible} point (graded)": [
      "{earned}/{possible} ponto (classificado)",
      "{earned}/{possible} pontos (classificado)",
      "{earned}/{possible} pontos (classificado)"
    ],
    "{earned}/{possible} point (ungraded)": [
      "{earned}/{possible} ponto (n\u00e3o classificado)",
      "{earned}/{possible} pontos (n\u00e3o classificado)",
      "{earned}/{possible} pontos (n\u00e3o classificado)"
    ],
    "{possible} point possible (graded)": [
      "{possible} ponto poss\u00edvel (classificado)",
      "{possible} pontos poss\u00edveis (classificado)",
      "{possible} pontos poss\u00edveis (classificado)"
    ],
    "{possible} point possible (ungraded)": [
      "{possible} ponto poss\u00edvel (n\u00e3o classificado)",
      "{possible} pontos poss\u00edveis (n\u00e3o classificado)",
      "{possible} pontos poss\u00edveis (n\u00e3o classificado)"
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
    "DATETIME_FORMAT": "j \\d\\e F \\d\\e Y \u00e0\\s H:i",
    "DATETIME_INPUT_FORMATS": [
      "%Y-%m-%d %H:%M:%S",
      "%Y-%m-%d %H:%M:%S.%f",
      "%Y-%m-%d %H:%M",
      "%Y-%m-%d",
      "%d/%m/%Y %H:%M:%S",
      "%d/%m/%Y %H:%M:%S.%f",
      "%d/%m/%Y %H:%M",
      "%d/%m/%Y",
      "%d/%m/%y %H:%M:%S",
      "%d/%m/%y %H:%M:%S.%f",
      "%d/%m/%y %H:%M",
      "%d/%m/%y"
    ],
    "DATE_FORMAT": "j \\d\\e F \\d\\e Y",
    "DATE_INPUT_FORMATS": [
      "%Y-%m-%d",
      "%d/%m/%Y",
      "%d/%m/%y"
    ],
    "DECIMAL_SEPARATOR": ",",
    "FIRST_DAY_OF_WEEK": "0",
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
        