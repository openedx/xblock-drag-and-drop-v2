
            (function(global){
                var DragAndDropI18N = {
                  init: function() {
                    

(function(globals) {

  var django = globals.django || (globals.django = {});

  
  django.pluralidx = function(n) {
    var v=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);
    if (typeof(v) == 'boolean') {
      return v ? 1 : 0;
    } else {
      return v;
    }
  };
  

  /* gettext library */

  django.catalog = django.catalog || {};
  
  var newcatalog = {
    "\n                            Please provide a description of the image for non-visual users.\n                            The description should provide sufficient information to allow anyone\n                            to solve the problem even without seeing the image.\n                        ": "\n\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u043e\u043f\u0438\u0448\u0438\u0442\u0435 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435 \u0434\u043b\u044f \u043d\u0435\u0432\u0438\u0434\u044f\u0449\u0438\u0445 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0435\u0439.\n\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0434\u043e\u043b\u0436\u043d\u043e \u0441\u043e\u0434\u0435\u0440\u0436\u0430\u0442\u044c \u0434\u043e\u0441\u0442\u0430\u0442\u043e\u0447\u043d\u043e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0438, \u0447\u0442\u043e\u0431\u044b \u043b\u044e\u0431\u043e\u0439\n\u043c\u043e\u0433 \u0440\u0435\u0448\u0438\u0442\u044c \u0437\u0430\u0434\u0430\u0447\u0443, \u0434\u0430\u0436\u0435 \u043d\u0435 \u0432\u0438\u0434\u044f \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435.", 
    "Add a zone": "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0437\u043e\u043d\u0443", 
    "Add an item": "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u044d\u043b\u0435\u043c\u0435\u043d\u0442", 
    "Alignment": "\u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435", 
    "An error occurred. Unable to load drag and drop problem.": "\u041f\u0440\u043e\u0438\u0437\u043e\u0448\u043b\u0430 \u043e\u0448\u0438\u0431\u043a\u0430.  \u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0437\u0430\u0434\u0430\u0447\u0443 \u043d\u0430 \u043f\u0435\u0440\u0435\u0442\u0430\u0441\u043a\u0438\u0432\u0430\u043d\u0438\u0435.", 
    "An isosceles triangle with three layers of similar height. It is shown upright, so the widest layer is located at the bottom, and the narrowest layer is located at the top.": "\u0420\u0430\u0432\u043d\u043e\u0431\u0435\u0434\u0440\u0435\u043d\u043d\u044b\u0439 \u0442\u0440\u0435\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a \u0441 \u0442\u0440\u0435\u043c\u044f \u0441\u043b\u043e\u044f\u043c\u0438 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u043e\u0439 \u0432\u044b\u0441\u043e\u0442\u044b. \u0420\u0430\u0441\u043f\u043e\u043b\u043e\u0436\u0435\u043d \u0432\u0435\u0440\u0448\u0438\u043d\u043e\u0439 \u0432\u0432\u0435\u0440\u0445, \u043f\u043e\u044d\u0442\u043e\u043c\u0443 \u0441\u0430\u043c\u044b\u0439 \u0448\u0438\u0440\u043e\u043a\u0438\u0439 \u0441\u043b\u043e\u0439 \u043d\u0430\u0445\u043e\u0434\u0438\u0442\u0441\u044f \u0432 \u043d\u0438\u0436\u043d\u0435\u0439 \u0447\u0430\u0441\u0442\u0438, \u0430 \u0441\u0430\u043c\u044b\u0439 \u0443\u0437\u043a\u0438\u0439 \u0441\u043b\u043e\u0439 \u2014 \u0432 \u0432\u0435\u0440\u0445\u043d\u0435\u0439 \u0447\u0430\u0441\u0442\u0438.", 
    "Background description": "\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0444\u043e\u043d\u0430", 
    "Cancel": "\u041e\u0442\u043c\u0435\u043d\u0430", 
    "Change background": "\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u0444\u043e\u043d", 
    "Continue": "\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c", 
    "Description": "\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435", 
    "Display the title to the learner?": "\u041e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0442\u044c \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0434\u043b\u044f \u0441\u043b\u0443\u0448\u0430\u0442\u0435\u043b\u0435\u0439?", 
    "Display zone borders on the image": "\u041e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0442\u044c \u0433\u0440\u0430\u043d\u0438\u0446\u044b \u0437\u043e\u043d \u043d\u0430 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0438", 
    "Drag the items onto the image above.": "\u041f\u0435\u0440\u0435\u0442\u0430\u0449\u0438\u0442\u0435 \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u044b \u043d\u0430 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435, \u0440\u0430\u0441\u043f\u043e\u043b\u043e\u0436\u0435\u043d\u043d\u043e\u0435 \u0432\u044b\u0448\u0435.", 
    "Good work! You have completed this drag and drop problem.": "\u0425\u043e\u0440\u043e\u0448\u043e! \u0412\u044b \u0441\u043f\u0440\u0430\u0432\u0438\u043b\u0438\u0441\u044c \u0441 \u044d\u0442\u0438\u043c \u0437\u0430\u0434\u0430\u043d\u0438\u0435\u043c.", 
    "Hide Answer": "\u0421\u043a\u0440\u044b\u0442\u044c \u041e\u0442\u0432\u0435\u0442", 
    "Image description (should provide sufficient information to place the item even if the image did not load)": "\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f (\u043e\u043d\u043e \u0434\u043e\u043b\u0436\u043d\u043e \u0441\u043e\u0434\u0435\u0440\u0436\u0430\u0442\u044c \u0434\u043e\u0441\u0442\u0430\u0442\u043e\u0447\u043d\u043e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0438 \u0434\u043b\u044f \u0440\u0430\u0441\u043f\u043e\u043b\u043e\u0436\u0435\u043d\u0438\u044f \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u043e\u0432, \u0434\u0430\u0436\u0435 \u0435\u0441\u043b\u0438 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435 \u043d\u0435 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u043b\u043e\u0441\u044c)", 
    "Indicates whether a learner has completed the problem at least once": "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u0442, \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043b\u0438 \u0441\u043b\u0443\u0448\u0430\u0442\u0435\u043b\u044e \u0445\u043e\u0442\u044f \u0431\u044b \u043e\u0434\u0438\u043d \u0440\u0430\u0437 \u0432\u044b\u043f\u043e\u043b\u043d\u0438\u0442\u044c \u0437\u0430\u0434\u0430\u043d\u0438\u0435", 
    "Information about current positions of items that a learner has dropped on the target image.": "\u0418\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u043e \u0442\u0435\u043a\u0443\u0449\u0435\u043c \u043c\u0435\u0441\u0442\u043e\u043d\u0430\u0445\u043e\u0436\u0434\u0435\u043d\u0438\u0438 \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u043e\u0432, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0441\u043b\u0443\u0448\u0430\u0442\u0435\u043b\u044c \u0440\u0430\u0441\u043f\u043e\u043b\u043e\u0436\u0438\u043b \u043d\u0430 \u0437\u0430\u0434\u0430\u043d\u043d\u044b\u0445 \u0443\u0447\u0430\u0441\u0442\u043a\u0430\u0445 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f.", 
    "Information about zones, items, feedback, and background image for this problem. This information is derived from the input that a course author provides via the interactive editor when configuring the problem.": "\u0418\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u043e \u0437\u043e\u043d\u0430\u0445, \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u0430\u0445, \u043e\u0431\u0440\u0430\u0442\u043d\u043e\u0439 \u0441\u0432\u044f\u0437\u0438 \u0438 \u0444\u043e\u043d\u043e\u0432\u043e\u043c \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0438, \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c\u044b\u0445 \u0432 \u0437\u0430\u0434\u0430\u0447\u0435.  \u0412\u0432\u043e\u0434\u0438\u0442\u0441\u044f \u0430\u0432\u0442\u043e\u0440\u043e\u043c \u043a\u0443\u0440\u0441\u0430 \u043f\u0440\u0438 \u043f\u043e\u043c\u043e\u0449\u0438 \u0438\u043d\u0442\u0435\u0440\u0430\u043a\u0442\u0438\u0432\u043d\u043e\u0439 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b \u0440\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f \u0432\u043e \u0432\u0440\u0435\u043c\u044f \u0441\u043e\u0437\u0434\u0430\u043d\u0438\u044f \u0437\u0430\u0434\u0430\u0447\u0438.", 
    "Item background color": "\u0424\u043e\u043d \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u0430", 
    "Items": "\u042d\u043b\u0435\u043c\u0435\u043d\u0442\u044b", 
    "Loading drag and drop problem.": "\u0418\u0434\u0451\u0442 \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0437\u0430\u0434\u0430\u043d\u0438\u044f \u043d\u0430 \u043f\u0435\u0440\u0435\u0442\u0430\u0441\u043a\u0438\u0432\u0430\u043d\u0438\u0435.", 
    "No, this item does not belong here. Try again.": "\u041d\u0435\u0442, \u044d\u0442\u043e\u0442 \u044d\u043b\u0435\u043c\u0435\u043d\u0442 \u043d\u0435 \u043f\u043e\u0434\u0445\u043e\u0434\u0438\u0442 \u0441\u044e\u0434\u0430. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.", 
    "Note: do not edit the problem if students have already completed it. Delete the problem and create a new one.": "\u041f\u0440\u0438\u043c\u0435\u0447\u0430\u043d\u0438\u0435: \u043d\u0435 \u0440\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u0443\u0439\u0442\u0435 \u0437\u0430\u0434\u0430\u0447\u0443, \u0435\u0441\u043b\u0438 \u0441\u0442\u0443\u0434\u0435\u043d\u0442\u044b \u0443\u0436\u0435 \u0432\u044b\u043f\u043e\u043b\u043d\u044f\u043b\u0438 \u0435\u0451.  \u0423\u0434\u0430\u043b\u0438\u0442\u0435 \u0437\u0430\u0434\u0430\u0447\u0443 \u0438 \u0441\u043e\u0437\u0434\u0430\u0439\u0442\u0435 \u043d\u043e\u0432\u0443\u044e.", 
    "Please check over your submission.": "\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u043f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0441\u0432\u043e\u0439 \u043e\u0442\u0432\u0435\u0442.", 
    "Problem Weight": "\u0412\u0435\u0441 \u0437\u0430\u0434\u0430\u043d\u0438\u044f", 
    "Problem text": "\u0422\u0435\u043a\u0441\u0442 \u0437\u0430\u0434\u0430\u0447\u0438", 
    "Reset": "\u0421\u0431\u0440\u043e\u0441\u0438\u0442\u044c", 
    "Save": "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c", 
    "Show Answer": "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043e\u0442\u0432\u0435\u0442", 
    "Show advanced settings": "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043d\u043d\u044b\u0435 \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438", 
    "Text": "\u0422\u0435\u043a\u0441\u0442", 
    "The Bottom Zone": "\u041d\u0438\u0436\u043d\u044f\u044f \u0417\u043e\u043d\u0430", 
    "The Middle Zone": "\u0421\u0440\u0435\u0434\u043d\u044f\u044f \u0417\u043e\u043d\u0430", 
    "The Top Zone": "\u0412\u0435\u0440\u0445\u043d\u044f\u044f \u0417\u043e\u043d\u0430", 
    "The title of the drag and drop problem. The title is displayed to learners.": "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u043d\u0430 \u043f\u0435\u0440\u0435\u0442\u0430\u0441\u043a\u0438\u0432\u0430\u043d\u0438\u0435 \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u043e\u0432, \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0435\u043c\u043e\u0435 \u0434\u043b\u044f \u0441\u043b\u0443\u0448\u0430\u0442\u0435\u043b\u0435\u0439.", 
    "Title": "\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a", 
    "Use this zone to associate an item with the bottom layer of the triangle.": "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435 \u044d\u0442\u0443 \u0437\u043e\u043d\u0443, \u0447\u0442\u043e\u0431\u044b \u0441\u0432\u044f\u0437\u0430\u0442\u044c \u044d\u043b\u0435\u043c\u0435\u043d\u0442 \u0441 \u043d\u0438\u0436\u043d\u0438\u043c \u0441\u043b\u043e\u0435\u043c \u0442\u0440\u0435\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a\u0430.", 
    "Use this zone to associate an item with the middle layer of the triangle.": "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435 \u044d\u0442\u0443 \u0437\u043e\u043d\u0443, \u0447\u0442\u043e\u0431\u044b \u0441\u0432\u044f\u0437\u0430\u0442\u044c \u044d\u043b\u0435\u043c\u0435\u043d\u0442 \u0441\u043e \u0441\u0440\u0435\u0434\u043d\u0438\u043c \u0441\u043b\u043e\u0435\u043c \u0442\u0440\u0435\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a\u0430.", 
    "Use this zone to associate an item with the top layer of the triangle.": "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435 \u044d\u0442\u0443 \u0437\u043e\u043d\u0443, \u0447\u0442\u043e\u0431\u044b \u0441\u0432\u044f\u0437\u0430\u0442\u044c \u044d\u043b\u0435\u043c\u0435\u043d\u0442 \u0441 \u0432\u0435\u0440\u0445\u043d\u0438\u043c \u0441\u043b\u043e\u0435\u043c \u0442\u0440\u0435\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a\u0430.", 
    "Zone": "\u0417\u043e\u043d\u0430", 
    "Zone borders": "\u0413\u0440\u0430\u043d\u0438\u0446\u044b \u0437\u043e\u043d", 
    "Zone labels": "\u041f\u043e\u0434\u043f\u0438\u0441\u0438 \u0437\u043e\u043d", 
    "Zones": "\u0417\u043e\u043d\u044b", 
    "center": "\u043f\u043e \u0446\u0435\u043d\u0442\u0440\u0443", 
    "height": "\u0412\u044b\u0441\u043e\u0442\u0430", 
    "left": "\u043f\u043e \u043b\u0435\u0432\u043e\u043c\u0443 \u043a\u0440\u0430\u044e", 
    "none": "\u043e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442", 
    "ok": "\u043e\u043a", 
    "right": "\u043f\u043e \u043f\u0440\u0430\u0432\u043e\u043c\u0443 \u043a\u0440\u0430\u044e", 
    "width": "\u0428\u0438\u0440\u0438\u043d\u0430"
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
    "DATETIME_FORMAT": "j E Y \u0433. G:i", 
    "DATETIME_INPUT_FORMATS": [
      "%d.%m.%Y %H:%M:%S", 
      "%d.%m.%Y %H:%M:%S.%f", 
      "%d.%m.%Y %H:%M", 
      "%d.%m.%Y", 
      "%d.%m.%y %H:%M:%S", 
      "%d.%m.%y %H:%M:%S.%f", 
      "%d.%m.%y %H:%M", 
      "%d.%m.%y", 
      "%Y-%m-%d %H:%M:%S", 
      "%Y-%m-%d %H:%M:%S.%f", 
      "%Y-%m-%d %H:%M", 
      "%Y-%m-%d"
    ], 
    "DATE_FORMAT": "j E Y \u0433.", 
    "DATE_INPUT_FORMATS": [
      "%d.%m.%Y", 
      "%d.%m.%y", 
      "%Y-%m-%d"
    ], 
    "DECIMAL_SEPARATOR": ",", 
    "FIRST_DAY_OF_WEEK": "1", 
    "MONTH_DAY_FORMAT": "j F", 
    "NUMBER_GROUPING": "3", 
    "SHORT_DATETIME_FORMAT": "d.m.Y H:i", 
    "SHORT_DATE_FORMAT": "d.m.Y", 
    "THOUSAND_SEPARATOR": "\u00a0", 
    "TIME_FORMAT": "G:i", 
    "TIME_INPUT_FORMATS": [
      "%H:%M:%S", 
      "%H:%M:%S.%f", 
      "%H:%M"
    ], 
    "YEAR_MONTH_FORMAT": "F Y \u0433."
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
        