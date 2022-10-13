
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
    "\n                            Please provide a description of the image for non-visual users.\n                            The description should provide sufficient information to allow anyone\n                            to solve the problem even without seeing the image.\n                        ": "\nForne\u00e7a uma descri\u00e7\u00e3o da imagem para usu\u00e1rios n\u00e3o-visuais.\nA descri\u00e7\u00e3o deve ter informa\u00e7\u00e3o suficiente para permitir que qualquer pessoa\nresolva o problema mesmo sem visualizar a imagem.",
    ", draggable": ", arrast\u00e1vel",
    ", draggable, grabbed": ", arrast\u00e1vel, agarrado",
    ", dropzone": ", ponto de largada",
    "Actions": "A\u00e7\u00f5es",
    "Add a zone": "Adicionar uma zona",
    "Add an item": "Adicionar um item",
    "An error occurred. Unable to load drag and drop problem.": "Ocorreu um erro. N\u00e3o foi poss\u00edvel carregar o problema de arraste e solte.",
    "An isosceles triangle with three layers of similar height. It is shown upright, so the widest layer is located at the bottom, and the narrowest layer is located at the top.": "Um tri\u00e2ngulo is\u00f3sceles com tr\u00eas camadas de alturas semelhantes est\u00e1 sendo exibido verticalmente, assim a camada mais larga est\u00e1 localizada na parte inferior e a camada mais estreita no topo.",
    "Assessment": "Avalia\u00e7\u00e3o",
    "Background Image": "Imagem de fundo",
    "Background URL": "URL do plano de fundo",
    "Background description": "Descri\u00e7\u00e3o do plano de fundo",
    "Basic Settings": "Configura\u00e7\u00f5es b\u00e1sicas",
    "Cancel": "Cancelar",
    "Change background": "Alterar plano de fundo",
    "Close": "Fechar",
    "Continue": "Continuar",
    "Correct": "Correto",
    "Correct! This one belongs to The Bottom Zone.": "Correto! Este pertence a \u00e1rea de baixo.",
    "Correct! This one belongs to The Middle Zone.": "Correto! Este pertence a \u00e1rea do meio.",
    "Correct! This one belongs to The Top Zone.": "Correto! Este pertence a \u00e1rea do topo.",
    "Correctly placed in: {zone_title}": "Corretamente posicionado em: {zone_title}",
    "Correctly placed {correct_count} item": [
      "{correct_count}  item colocado corretamente",
      "{correct_count} itens colocados corretamente",
      "{correct_count} itens colocados corretamente"
    ],
    "DEPRECATED. Keeps maximum score achieved by student as a weighted value.": "DEPRECIADO.Mant\u00e9m a pontua\u00e7\u00e3o m\u00e1xima alcan\u00e7ada pelo aluno como um valor pesado.",
    "Defines the number of points the problem is worth.": "Define o n\u00famero de pontos v\u00e1lidos para este problema.",
    "Defines the number of times a student can try to answer this problem. If the value is not set, infinite attempts are allowed.": "Define o n\u00famero de tentativas que os estudantes podem fazer para resolver este problema. Se o valor n\u00e3o for definido, infinitas tentativas ser\u00e3o permitidas.",
    "Did not place {missing_count} required item": [
      "{missing_count} item obrigat\u00f3rio n\u00e3o foi posicionado",
      "{missing_count} itens obrigat\u00f3rios n\u00e3o foram posicionados",
      "{missing_count} itens obrigat\u00f3rios n\u00e3o foram posicionados"
    ],
    "Display label names on the image": "Exibir nomes da etiqueta na imagem",
    "Display the heading \"Problem\" above the problem text?": "Exibir o cabe\u00e7alho de \"Problema\" acima da descri\u00e7\u00e3o?",
    "Display the title to the learner?": "Exibir t\u00edtulo ao aluno?",
    "Display zone borders on the image": "Exibir as bordas da zona na imagem",
    "Drag and Drop": "Arraste e Solte",
    "Drag and Drop Problem": "Programa de Arrastar e Soltar",
    "Drag and Drop problems consist of draggable items and dropzones. Users should select a draggable item with their keyboard and then navigate to an appropriate dropzone to drop it.": "Os problemas de arrastar e soltar consistem em itens arrast\u00e1veis e \u00e1rea de soltura. Usu\u00e1rios podem selecionar um item arrast\u00e1vel com seu teclado e navegar at\u00e9 um ponto apropriado para solta-lo. ",
    "Drag the items onto the image above.": "Arraste os itens para a imagem acima.",
    "Drop Targets": "Destinos de Soltar",
    "Feedback": "Coment\u00e1rio",
    "Final attempt was used, highest score is {score}": "Tentativa final. Sua pontua\u00e7\u00e3o mais alta \u00e9 {score}",
    "Final feedback": "Coment\u00e1rio final",
    "For example, 'http://example.com/background.png' or '/static/background.png'.": "Por exemplo, 'http://example.com/background.png' ou '/static/background.png'.",
    "Generate image and zones": "Gerar imagem e \u00e1reas",
    "Generate image automatically": "Gerar imagem automaticamente",
    "Go to Beginning": "V\u00e1 para o In\u00edcio",
    "Goes anywhere": "Cabe em qualquer lugar",
    "Goes to the bottom": "Vai para a zona inferior",
    "Goes to the middle": "Vai para a zona central",
    "Goes to the top": "Vai para a zona superior",
    "Good work! You have completed this drag and drop problem.": "Bom trabalho! Voc\u00ea completou este problema.",
    "Hints:": "Dicas:",
    "I don't belong anywhere": "Eu n\u00e3o caibo em nenhum lugar",
    "Incorrect": "Incorreto",
    "Indicates whether a learner has completed the problem at least once": "Indica se um aluno completou o problema pelo menos uma vez",
    "Information about current positions of items that a learner has dropped on the target image.": "Informa\u00e7\u00f5es sobre as posi\u00e7\u00f5es atuais de itens que um aluno soltou na imagem-alvo.",
    "Introductory feedback": "Feedback introdut\u00f3rio",
    "Item Bank": "Banco de itens",
    "Item background color": "Cor do plano de fundo",
    "Item definitions": "Defini\u00e7\u00f5es do item",
    "Item text color": "Cor do texto",
    "Items": "Itens",
    "Items placed here: ": "Itens colocados aqui:",
    "Keeps maximum score achieved by student as a raw value between 0 and 1.": "Mant\u00e9m a pontua\u00e7\u00e3o m\u00e1xima alcan\u00e7ada pelo estudante como um valor cru entre 0 e 1.",
    "Keyboard Help": "Ajuda do Teclado",
    "Loading drag and drop problem.": "Carregando o problema",
    "Max number of attempts reached": "N\u00famero m\u00e1ximo de tentativas alcan\u00e7ado",
    "Maximum attempts": "M\u00e1ximo de tentativas",
    "Maximum items per zone": "Itens m\u00e1ximos por zona",
    "Misplaced {misplaced_count} item": [
      "Item mal posicionado: {misplaced_count}",
      "Itens mal posicionados: {misplaced_count}",
      "Itens mal posicionados: {misplaced_count}"
    ],
    "Misplaced {misplaced_count} item (misplaced item was returned to the item bank)": [
      "{misplaced_count} item perdido. Os itens perdidos foram devolvidos ao banco de itens.",
      "{misplaced_count} itens perdidos. Os itens perdidos foram devolvidos ao banco de itens.",
      "{misplaced_count} itens perdidos. Os itens perdidos foram devolvidos ao banco de itens."
    ],
    "Mode": "Modo",
    "Navigate using TAB and SHIFT+TAB to the appropriate dropzone and press CTRL+M once more to drop it here.": "Navegue utilizando TAB e SHIFT+TAB para a \u00e1rea de soltura apropriada pressionando CTRL+M uma vez mais para soltar aqui.",
    "No items placed here": "Nenhum item colocado aqui",
    "No, this item does not belong here. Try again.": "N\u00e3o, este n\u00e3o \u00e9 o item correto. Tente novamente.",
    "Number of attempts learner used": "Numero de tentativas usadas pelo aluno",
    "Number of columns": "N\u00famero de colunas",
    "Number of columns and rows.": "N\u00famero de colunas e linhas.",
    "Number of rows": "N\u00famero de linhas",
    "Of course it goes here! It goes anywhere!": "Claro que cabe aqui! Cabe em qualquer lugar!",
    "Placed in: {zone_title}": "Posicionado em: {zone_title}",
    "Please check over your submission.": "Por favor, verifique seu envio.",
    "Please check the values you entered.": "Por favor verifique os valores que voc\u00ea inseriu.",
    "Press CTRL+M to select a draggable item (effectively picking it up).": "Aperte CTRL+M para selecionar um item arrast\u00e1vel (efetivamente pegando)",
    "Press ESC if you want to cancel the drop operation (for example, to select a different item).": "Pressione ESC se voc\u00ea deseja cancelar a opera\u00e7\u00e3o de soltar (por exemplo, para selecionar um item diferente).",
    "Problem": "Problema",
    "Problem Weight": "Valor do problema",
    "Problem data": "Dados do problema",
    "Problem text": "Descri\u00e7\u00e3o do problema",
    "Provide custom image": "Fornecer imagem personalizada",
    "Reset": "Redefinir",
    "Save": "Salvar",
    "Saving": "Salvando",
    "Show \"Problem\" heading": "Exibir o cabe\u00e7alho do \"Problema\"",
    "Show Answer": "Exibir resposta",
    "Show title": "Exibir t\u00edtulo",
    "Size of a single zone in pixels.": "Tamanho de uma \u00fanica zona em pixels.",
    "Some of your answers were not correct.": "Algumas de suas respostas n\u00e3o estavam corretas.",
    "Standard": "Padr\u00e3o",
    "Standard mode: the problem provides immediate feedback each time a learner drops an item on a target zone. Assessment mode: the problem provides feedback only after a learner drops all available items on target zones.": "Modo padr\u00e3o: o problema fornece coment\u00e1rio imediatamente cada vez que um aluno solta um item numa zona-alvo. Modo avalia\u00e7\u00e3o: o problema fornece coment\u00e1rio somente depois que um aluno solta todos os itens nas \u00e1reas-alvo.",
    "Submission deadline has passed.": "O prazo de envio expirou.",
    "Submit": "Enviar",
    "Submitting": "Enviando",
    "TAB back to the list of draggable items and repeat this process until all of the draggable items have been placed on their respective dropzones.": "TAB voltar para a lista de itens arrast\u00e1veis e repetir esse processo at\u00e9 todos os itens arrast\u00e1veis estarem em suas respectivas \u00e1reas para soltar.",
    "Text color to use for draggable items (example: 'white' or '#ffffff').": "Cor do texto para itens que podem ser arrastados (por exemplo: 'branco' ou '#ffffff').",
    "The Bottom Zone": "A zona inferior",
    "The Middle Zone": "A zona central",
    "The Top Zone": "A zona superior",
    "The background color of draggable items in the problem (example: 'blue' or '#0000ff').": "A cor do plano de fundo de itens que podem ser arrastados no problema (por exemplo: 'azul' ou '#0000ff').",
    "The description of the problem or instructions shown to the learner.": "A descri\u00e7\u00e3o do problema ou instru\u00e7\u00f5es exibidas ao aluno.",
    "The title of the drag and drop problem. The title is displayed to learners.": "O t\u00edtulo do problema de arraste e solte. O t\u00edtulo \u00e9 exibido aos alunos.",
    "There was an error with your form.": "Ocorreu um erro com seu formul\u00e1rio.",
    "This is a screen reader-friendly problem.": "Esta \u00e9 uma tela de leitura f\u00e1cil de problemas.",
    "This setting limits the number of items that can be dropped into a single zone.": "Esta configura\u00e7\u00e3o limita o n\u00famero de itens que podem ser largados de uma \u00fanica zona.",
    "Title": "T\u00edtulo",
    "Unknown DnDv2 mode {mode} - course is misconfigured": "Modo {mode} DnDv2 desconhecido - o curso n\u00e3o est\u00e1 configurado corretamente",
    "Unknown Zone": "Zona desconhecida",
    "Use only TAB and SHIFT+TAB to navigate between draggable items and drop zones.": "Utilize somente TAB e SHIFT+TAB para navegar entre os intens arrastaveis e \u00e1reas para soltar.",
    "Use this zone to associate an item with the bottom layer of the triangle.": "Use esta zona para associar um item \u00e0 camada inferior do tri\u00e2ngulo.",
    "Use this zone to associate an item with the middle layer of the triangle.": "Use esta zona para associar um item \u00e0 camada central do tri\u00e2ngulo.",
    "Use this zone to associate an item with the top layer of the triangle.": "Use esta zona para associar um item \u00e0 camada superior do tri\u00e2ngulo.",
    "You can complete this problem using only your keyboard by following the guidance below:": "Voc\u00ea pode completar esse problema usando seu teclado para seguir o guia abaixo:",
    "You cannot add any more items to this zone.": "Voc\u00ea n\u00e3o pode adicionar mais itens nesta \u00e1rea.",
    "You have used {used} of {total} attempts.": "Voc\u00ea fez {used} das {total} tentativas.",
    "You silly, there are no zones for this one.": "N\u00e3o h\u00e1 zonas para este item.",
    "Your highest score is {score}": "Sua maior pontua\u00e7\u00e3o \u00e9 {score}",
    "Zone Layout": "Estilo da zona",
    "Zone Size": "Tamanho da zona",
    "Zone borders": "Bordas da zona",
    "Zone definitions": "Defini\u00e7\u00f5es da zona",
    "Zone height": "Altura da zona",
    "Zone labels": "Etiquetas da zona",
    "Zone width": "Largura da zona",
    "Zone {num}": [
      "Zona {num}",
      "Zona {num}",
      "Zona {num}"
    ],
    "Zones": "Zonas",
    "do_attempt handler should only be called for assessment mode": "A ferramenta do_attempt deve ser executada somente no modo de avalia\u00e7\u00e3o",
    "droppable": "Remov\u00edvel",
    "show_answer handler should only be called for assessment mode": "A ferramenta show_answer deve somente ser executada no modo de avalia\u00e7\u00e3o",
    "{earned}/{possible} point (graded)": [
      "{earned}/{possible} ponto (corrigido)",
      "{earned}/{possible} pontos (corrigidos)",
      "{earned}/{possible} pontos (corrigidos)"
    ],
    "{earned}/{possible} point (ungraded)": [
      "{earned}/{possible} ponto (n\u00e3o corrigido)",
      "{earned}/{possible} pontos (n\u00e3o corrigidos)",
      "{earned}/{possible} pontos (n\u00e3o corrigidos)"
    ],
    "{possible} point possible (graded)": [
      "{possible} ponto poss\u00edvel (corrigido)",
      "{possible} pontos poss\u00edveis (corrigidos)",
      "{possible} pontos poss\u00edveis (corrigidos)"
    ],
    "{possible} point possible (ungraded)": [
      "{possible} ponto poss\u00edvel (n\u00e3o corrigido)",
      "{possible} pontos poss\u00edveis (n\u00e3o corrigidos)",
      "{possible} pontos poss\u00edveis (n\u00e3o corrigidos)"
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
      "%Y-%m-%d"
    ],
    "DATE_FORMAT": "j \\d\\e F \\d\\e Y",
    "DATE_INPUT_FORMATS": [
      "%d/%m/%Y",
      "%d/%m/%y",
      "%Y-%m-%d"
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
        