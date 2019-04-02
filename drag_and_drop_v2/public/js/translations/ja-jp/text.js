
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
    "\n                            Please provide a description of the image for non-visual users.\n                            The description should provide sufficient information to allow anyone\n                            to solve the problem even without seeing the image.\n                        ": "\n                            \u975e\u8996\u899a\u7684\u30e6\u30fc\u30b6\u30fc\u5411\u3051\u306b\u753b\u50cf\u306e\u8aac\u660e\u3092\u3057\u3066\u304f\u3060\u3055\u3044\u3002\n                            \u8aac\u660e\u6587\u306b\u306f\u3001\u753b\u50cf\u3092\u898b\u306a\u304f\u3066\u3082\u554f\u984c\u304c\u89e3\u3051\u308b\u3088\u3046\u3001\u5341\u5206\u306a\u60c5\u5831\u3092\u542b\u3081\u3066\u304f\u3060\u3055\u3044\u3002   ", 
    "\"Maximum items per zone\" should be positive integer, got {max_items_per_zone}": "\u300c\u30be\u30fc\u30f3\u3054\u3068\u306e\u6700\u5927\u9805\u76ee\u6570\u300d\u306f\u3001\u6b63\u306e\u6574\u6570\u3067{max_items_per_zone}\u3067\u3042\u308b\u3053\u3068", 
    ", draggable": "\u3001\u30c9\u30e9\u30c3\u30b0\u53ef\u80fd", 
    ", draggable, grabbed": "\u3001\u30c9\u30e9\u30c3\u30b0\u53ef\u80fd\u3001\u7372\u5f97\u6e08\u307f", 
    ", dropzone": "\u3001\u30c9\u30ed\u30c3\u30d7\u30be\u30fc\u30f3", 
    "Actions": "\u30a2\u30af\u30b7\u30e7\u30f3", 
    "Add a zone": "\u30be\u30fc\u30f3\u3092\u8ffd\u52a0\u3059\u308b", 
    "Add an item": "\u9805\u76ee\u3092\u8ffd\u52a0\u3059\u308b", 
    "Align dropped items to the left, center, or right.": "\u30c9\u30ed\u30c3\u30d7\u4e0b\u9805\u76ee\u3092\u5de6\u3001\u4e2d\u592e\u3001\u53f3\u306b\u63c3\u3048\u307e\u3059\u3002", 
    "Alignment": "\u30a2\u30e9\u30a4\u30f3\u30e1\u30f3\u30c8", 
    "An error occurred. Unable to load drag and drop problem.": "\u554f\u984c\u304c\u767a\u751f\u3057\u307e\u3057\u305f\u3002\u30c9\u30e9\u30c3\u30b0&\u30c9\u30ed\u30c3\u30d7\u554f\u984c\u304c\u8aad\u307f\u8fbc\u3081\u307e\u305b\u3093\u3002", 
    "An isosceles triangle with three layers of similar height. It is shown upright, so the widest layer is located at the bottom, and the narrowest layer is located at the top.": "\u540c\u3058\u3088\u3046\u306a\u9ad8\u3055\u306e\u5c64\u304c3\u3064\u306e\u4e8c\u7b49\u8fba\u4e09\u89d2\u5f62\u3002\u6700\u3082\u5e45\u5e83\u3044\u5c64\u304c\u4e0b\u306b\u306a\u308a\u3001\u6700\u3082\u72ed\u3044\u5c64\u304c\u4e0a\u306b\u306a\u308b\u3088\u3046\u3001\u76f4\u7acb\u306b\u8868\u793a\u3055\u308c\u307e\u3059\u3002", 
    "Assessment": "\u8a55\u4fa1", 
    "Background URL": "\u80cc\u666fURL", 
    "Background description": "\u80cc\u666f\u306e\u8aac\u660e", 
    "Cancel": "\u30ad\u30e3\u30f3\u30bb\u30eb", 
    "Change background": "\u80cc\u666f\u3092\u5909\u66f4\u3059\u308b", 
    "Close": "\u9589\u3058\u308b", 
    "Continue": "\u7d9a\u3051\u308b", 
    "Correct! This one belongs to {zone}.": "\u6b63\u89e3\u3067\u3059\u3002\u3053\u308c\u306f{zone}\u306b\u5c5e\u3057\u307e\u3059\u3002", 
    "Correctly placed in: {zone_title}": "\u6b63\u3057\u3044\u5206\u985e: {zone_title}", 
    "Correctly placed {correct_count} item.": [
      "\u6b63\u89e3\u306f{correct_count}\u9805\u76ee\u3067\u3059\u3002", 
      "\u6b63\u89e3\u306f{correct_count}\u9805\u76ee\u3067\u3059\u3002"
    ], 
    "Defines the number of points the problem is worth.": "\u554f\u984c\u306e\u30dd\u30a4\u30f3\u30c8\u6570\u3092\u5b9a\u7fa9\u3057\u307e\u3059\u3002", 
    "Defines the number of times a student can try to answer this problem. If the value is not set, infinite attempts are allowed.": "\u751f\u5f92\u304c\u3053\u306e\u554f\u984c\u306b\u56de\u7b54\u3067\u304d\u308b\u56de\u6570\u3092\u5b9a\u7fa9\u3057\u307e\u3059\u3002\u5024\u304c\u8a2d\u5b9a\u3055\u308c\u3066\u3044\u306a\u3044\u5834\u5408\u306f\u3001\u7121\u5236\u9650\u306b\u56de\u7b54\u53ef\u80fd\u3067\u3059\u3002", 
    "Describe this zone to non-visual users.": "\u3053\u306e\u30be\u30fc\u30f3\u306b\u3064\u3044\u3066\u3001\u975e\u8996\u899a\u7684\u30e6\u30fc\u30b6\u30fc\u306b\u8aac\u660e\u3057\u307e\u3059\u3002", 
    "Description": "\u5185\u5bb9", 
    "Did not place {missing_count} required item.": [
      "\u5fc5\u9808\u306e{missing_count}\u9805\u76ee\u304c\u5206\u985e\u3055\u308c\u3066\u3044\u307e\u305b\u3093\u3002", 
      "\u5fc5\u9808\u306e{missing_count}\u9805\u76ee\u304c\u5206\u985e\u3055\u308c\u3066\u3044\u307e\u305b\u3093\u3002"
    ], 
    "Display label names on the image": "\u753b\u50cf\u306b\u30e9\u30d9\u30eb\u540d\u3092\u8868\u793a\u3059\u308b", 
    "Display the heading \"Problem\" above the problem text?": "\u554f\u984c\u30c6\u30ad\u30b9\u30c8\u306e\u4e0a\u306b\u300c\u554f\u984c\u300d\u898b\u51fa\u3057\u3092\u8868\u793a\u3057\u307e\u3059\u304b?", 
    "Display the title to the learner?": "\u4ef6\u540d\u3092\u5b66\u7fd2\u8005\u306b\u8868\u793a\u3057\u307e\u3059\u304b?", 
    "Display zone borders on the image": "\u753b\u50cf\u306b\u30be\u30fc\u30f3\u306e\u5883\u754c\u3092\u8868\u793a\u3059\u308b", 
    "Drag and Drop": "\u30c9\u30e9\u30c3\u30b0&\u30c9\u30ed\u30c3\u30d7", 
    "Drag and Drop Problem": "\u30c9\u30e9\u30c3\u30b0&\u30c9\u30ed\u30c3\u30d7\u554f\u984c", 
    "Drag and Drop problems consist of draggable items and dropzones. Users should select a draggable item with their keyboard and then navigate to an appropriate dropzone to drop it.": "\u30c9\u30e9\u30c3\u30b0&\u30c9\u30ed\u30c3\u30d7\u554f\u984c\u306f\u3001\u30c9\u30e9\u30c3\u30b0\u53ef\u80fd\u306e\u9805\u76ee\u3068\u30c9\u30ed\u30c3\u30d7\u30be\u30fc\u30f3\u3067\u69cb\u6210\u3055\u308c\u3066\u3044\u307e\u3059\u3002\u30e6\u30fc\u30b6\u30fc\u306f\u3001\u30ad\u30fc\u30dc\u30fc\u30c9\u3067\u30c9\u30e9\u30c3\u30b0\u53ef\u80fd\u306e\u9805\u76ee\u3092\u9078\u629e\u3057\u3001\u8a72\u5f53\u3059\u308b\u30c9\u30ed\u30c3\u30d7\u30be\u30fc\u30f3\u306b\u30c9\u30ed\u30c3\u30d7\u3057\u307e\u3059\u3002", 
    "Drag the items onto the image above.": "\u9805\u76ee\u3092\u4e0a\u8a18\u306e\u753b\u50cf\u306b\u30c9\u30e9\u30c3\u30af\u3057\u307e\u3059\u3002", 
    "Drop Targets": "\u30c9\u30ed\u30c3\u30d7\u5bfe\u8c61", 
    "Error feedback": "\u30a8\u30e9\u30fc\u306e\u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af", 
    "Failed to parse \"Maximum items per zone\"": "\u300c\u30be\u30fc\u30f3\u3054\u3068\u306e\u6700\u5927\u9805\u76ee\u6570\u300d\u306e\u89e3\u6790\u306b\u5931\u6557\u3057\u307e\u3057\u305f", 
    "Feedback": "\u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af", 
    "Final attempt was used, highest score is {score}": "\u6700\u5927\u6311\u6226\u56de\u6570\u306b\u9054\u3057\u307e\u3057\u305f\u3002\u6700\u9ad8\u70b9\u306f{score}\u3067\u3059", 
    "Final feedback": "\u6700\u5f8c\u306e\u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af", 
    "For example, 'http://example.com/background.png' or '/static/background.png'.": "\u4f8b\u3048\u3070\u3001\u300chttp://example.com/background.png\u300d\u307e\u305f\u306f\u300c/static/background.png\u300d\u3002", 
    "For example, 'http://example.com/image.png' or '/static/image.png'.": "\u4f8b\u3048\u3070\u3001\u300chttp://example.com/image.png\u300d\u307e\u305f\u306f\u300c/static/image.png\u300d\u3002", 
    "Go to Beginning": "\u59cb\u3081\u306b\u623b\u308b", 
    "Goes anywhere": "\u3069\u3053\u306b\u3067\u3082\u884c\u304d\u307e\u3059", 
    "Goes to the bottom": "\u30dc\u30c8\u30e0\u306b\u884c\u304d\u307e\u3059", 
    "Goes to the middle": "\u30df\u30c9\u30eb\u306b\u884c\u304d\u307e\u3059", 
    "Goes to the top": "\u30c8\u30c3\u30d7\u306b\u884c\u304d\u307e\u3059", 
    "Good work! You have completed this drag and drop problem.": "\u3088\u304f\u3067\u304d\u307e\u3057\u305f\u3002\u30c9\u30e9\u30c3\u30b0&\u30c9\u30ed\u30c3\u30d7\u306e\u554f\u984c\u304c\u5b8c\u4e86\u3057\u307e\u3057\u305f\u3002", 
    "Hide Answer": "\u56de\u7b54\u3092\u975e\u8868\u793a\u306b\u3059\u308b", 
    "Hints:": "\u30d2\u30f3\u30c8:", 
    "I don't belong anywhere": "\u3069\u3053\u306b\u3082\u5c5e\u3057\u307e\u305b\u3093", 
    "Image URL (alternative to the text)": "\u753b\u50cfURL (\u30c6\u30ad\u30b9\u30c8\u306e\u4ee3\u66ff)", 
    "Image description (should provide sufficient information to place the item even if the image did not load)": "\u753b\u50cf\u306e\u8aac\u660e (\u753b\u50cf\u304c\u8aad\u307f\u8fbc\u3081\u306a\u304b\u3063\u305f\u5834\u5408\u3067\u3082\u5206\u304b\u308b\u3088\u3046\u3001\u5341\u5206\u306a\u60c5\u5831\u3092\u542b\u3081\u308b\u3053\u3068)", 
    "Indicates whether a learner has completed the problem at least once": "\u5b66\u7fd2\u8005\u304c\u5c11\u306a\u304f\u3068\u30821\u5ea6\u3001\u554f\u984c\u3092\u5b8c\u4e86\u3057\u305f\u304b\u5426\u304b\u304c\u793a\u3055\u308c\u307e\u3059\u3002", 
    "Information about current positions of items that a learner has dropped on the target image.": "\u5b66\u7fd2\u8005\u304c\u5bfe\u8c61\u753b\u50cf\u306b\u30c9\u30ed\u30c3\u30d7\u3057\u305f\u9805\u76ee\u306e\u73fe\u5728\u306e\u4f4d\u7f6e\u306b\u95a2\u3059\u308b\u60c5\u5831\u3002", 
    "Information about zones, items, feedback, and background image for this problem. This information is derived from the input that a course author provides via the interactive editor when configuring the problem.": "\u3053\u306e\u554f\u984c\u306e\u30be\u30fc\u30f3\u3001\u9805\u76ee\u3001\u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af\u3001\u80cc\u666f\u753b\u50cf\u306b\u95a2\u3059\u308b\u60c5\u5831\u3002\u3053\u306e\u60c5\u5831\u306f\u3001\u554f\u984c\u3092\u69cb\u6210\u3059\u308b\u969b\u3001\u30b3\u30fc\u30b9\u8457\u8005\u304c\u30a4\u30f3\u30bf\u30e9\u30af\u30c6\u30a3\u30d6\u30a8\u30c7\u30a3\u30bf\u3092\u901a\u3057\u3066\u5165\u529b\u3059\u308b\u60c5\u5831\u304b\u3089\u6d3e\u751f\u3057\u307e\u3059\u3002", 
    "Introductory feedback": "\u6700\u521d\u306e\u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af", 
    "Item Bank": "\u9805\u76ee\u30d0\u30f3\u30af", 
    "Item background color": "\u9805\u76ee\u306e\u80cc\u666f\u8272", 
    "Item text color": "\u9805\u76ee\u306e\u30c6\u30ad\u30b9\u30c8\u8272", 
    "Items": "\u9805\u76ee", 
    "Keeps maximum score achieved by student": "\u751f\u5f92\u304c\u9054\u6210\u3057\u305f\u6700\u5927\u30b9\u30b3\u30a2\u3092\u7dad\u6301\u3057\u307e\u3059", 
    "Keyboard Help": "\u30ad\u30fc\u30dc\u30fc\u30c9\u30d8\u30eb\u30d7", 
    "Loading drag and drop problem.": "\u30c9\u30e9\u30c3\u30b0&\u30c9\u30ed\u30c3\u30d7\u554f\u984c\u3092\u8aad\u307f\u8fbc\u307f\u4e2d\u3002", 
    "Max number of attempts reached": "\u6700\u5927\u6311\u6226\u56de\u6570\u306b\u9054\u3057\u307e\u3057\u305f", 
    "Maximum attempts": "\u6700\u5927\u6311\u6226\u6570", 
    "Misplaced {misplaced_count} item.": [
      "\u4e0d\u6b63\u89e3\u306f{misplaced_count}\u9805\u76ee\u3067\u3059\u3002", 
      "\u4e0d\u6b63\u89e3\u306f{misplaced_count}\u9805\u76ee\u3067\u3059\u3002"
    ], 
    "Misplaced {misplaced_count} item. Misplaced item was returned to item bank.": [
      "\u4e0d\u6b63\u89e3\u306f{misplaced_count}\u9805\u76ee\u3067\u3059\u3002\u4e0d\u6b63\u89e3\u306e\u9805\u76ee\u306f\u3001\u9805\u76ee\u30d0\u30f3\u30af\u306b\u623b\u3055\u308c\u307e\u3057\u305f\u3002", 
      "\u4e0d\u6b63\u89e3\u306f{misplaced_count}\u9805\u76ee\u3067\u3059\u3002\u4e0d\u6b63\u89e3\u306e\u9805\u76ee\u306f\u3001\u9805\u76ee\u30d0\u30f3\u30af\u306b\u623b\u3055\u308c\u307e\u3057\u305f\u3002"
    ], 
    "Mode": "\u30e2\u30fc\u30c9", 
    "Navigate using TAB and SHIFT+TAB to the appropriate dropzone and press CTRL+M once more to drop it here.": "\u8a72\u5f53\u3059\u308b\u30c9\u30ed\u30c3\u30d7\u30be\u30fc\u30f3\u307e\u3067\u306e\u79fb\u52d5\u306b\u306fTAB\u3068SHIFT+TAB\u3092\u4f7f\u7528\u3057\u3001CTRL+M\u3092\u3082\u3046\u4e00\u5ea6\u62bc\u3057\u3066\u30c9\u30ed\u30c3\u30d7\u3057\u307e\u3059\u3002", 
    "No, this item does not belong here. Try again.": "\u3044\u3044\u3048\u3001\u3053\u308c\u306f\u3053\u3053\u306b\u306f\u5c5e\u3057\u307e\u305b\u3093\u3002\u3082\u3046\u4e00\u5ea6\u304a\u8a66\u3057\u304f\u3060\u3055\u3044\u3002", 
    "None": "\u306a\u3057", 
    "Note: do not edit the problem if students have already completed it. Delete the problem and create a new one.": "\u6ce8: \u751f\u5f92\u304c\u65e2\u306b\u5b8c\u4e86\u3057\u3066\u3044\u308b\u5834\u5408\u306f\u3001\u554f\u984c\u3092\u7de8\u96c6\u3057\u306a\u3044\u3067\u304f\u3060\u3055\u3044\u3002\u554f\u984c\u3092\u524a\u9664\u3057\u3001\u65b0\u898f\u306e\u554f\u984c\u3092\u4f5c\u6210\u3057\u3066\u304f\u3060\u3055\u3044\u3002", 
    "Number of attempts learner used": "\u5b66\u7fd2\u8005\u304c\u4f7f\u7528\u3057\u305f\u6311\u6226\u56de\u6570", 
    "Of course it goes here! It goes anywhere!": "\u3082\u3061\u308d\u3093\u3001\u3053\u3053\u306b\u6765\u307e\u3059\u3002\u3069\u3053\u306b\u3067\u3082\u884c\u304d\u307e\u3059\u3002", 
    "Placed in: {zone_title}": "\u5206\u985e: {zone_title}", 
    "Please check over your submission.": "\u63d0\u51fa\u306b\u9593\u9055\u3044\u304c\u306a\u3044\u304b\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002", 
    "Preferred width": "\u5e0c\u671b\u306e\u5e45", 
    "Press CTRL+M to select a draggable item (effectively picking it up).": "\u30c9\u30e9\u30c3\u30b0\u53ef\u80fd\u306e\u9805\u76ee\u3092\u9078\u629e\u3059\u308b\u306b\u306f\u3001CTRL+M\u3092\u62bc\u3057\u307e\u3059 (\u3059\u308b\u3068\u3001\u9805\u76ee\u304c\u62fe\u308f\u308c\u307e\u3059)\u3002", 
    "Press ESC if you want to cancel the drop operation (for example, to select a different item).": "\u30c9\u30ed\u30c3\u30d7\u64cd\u4f5c\u3092\u30ad\u30e3\u30f3\u30bb\u30eb\u3059\u308b\u5834\u5408\u306f\u3001ESC\u3092\u62bc\u3057\u307e\u3059 (\u4f8b\u3048\u3070\u3001\u5225\u306e\u9805\u76ee\u3092\u9078\u629e\u3059\u308b\u5834\u5408)\u3002", 
    "Problem": "\u554f\u984c", 
    "Problem Weight": "\u554f\u984c\u306e\u91cd\u307f", 
    "Problem data": "\u554f\u984c\u30c7\u30fc\u30bf", 
    "Problem text": "\u554f\u984c\u30c6\u30ad\u30b9\u30c8", 
    "Remove item": "\u9805\u76ee\u3092\u524a\u9664\u3059\u308b", 
    "Remove zone": "\u30be\u30fc\u30f3\u3092\u524a\u9664\u3059\u308b", 
    "Reset": "\u30ea\u30bb\u30c3\u30c8", 
    "Save": "\u4fdd\u5b58\u3059\u308b", 
    "Show \"Problem\" heading": "\u300c\u554f\u984c\u300d\u898b\u51fa\u3057\u3092\u8868\u793a\u3059\u308b", 
    "Show Answer": "\u56de\u7b54\u3092\u8868\u793a\u3059\u308b", 
    "Show advanced settings": "\u4e0a\u7d1a\u306e\u8a2d\u5b9a\u3092\u8868\u793a\u3059\u308b", 
    "Show title": "\u4ef6\u540d\u3092\u8868\u793a\u3059\u308b", 
    "Some of your answers were not correct.": "\u56de\u7b54\u306e\u4e00\u90e8\u304c\u4e0d\u6b63\u89e3\u3067\u3059\u3002", 
    "Specify preferred width as percentage of the background image width. Leave blank for automatic width.": "\u80cc\u666f\u753b\u50cf\u5e45\u306e\u30d1\u30fc\u30bb\u30f3\u30c6\u30fc\u30b8\u3067\u5e0c\u671b\u306e\u5e45\u3092\u6307\u5b9a\u3057\u307e\u3059\u3002\u81ea\u52d5\u5e45\u306e\u5834\u5408\u306f\u7a7a\u6b04\u306e\u307e\u307e\u306b\u3057\u307e\u3059\u3002", 
    "Standard": "\u6a19\u6e96", 
    "Standard mode: the problem provides immediate feedback each time a learner drops an item on a target zone. Assessment mode: the problem provides feedback only after a learner drops all available items on target zones.": "\u6a19\u6e96\u30e2\u30fc\u30c9: \u5b66\u7fd2\u8005\u304c\u9805\u76ee\u3092\u5bfe\u8c61\u30be\u30fc\u30f3\u306b\u30c9\u30ed\u30c3\u30d7\u3059\u308b\u305f\u3073\u306b\u3001\u76f4\u3061\u306b\u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af\u304c\u8868\u793a\u3055\u308c\u307e\u3059\u3002\u8a55\u4fa1\u30e2\u30fc\u30c9: \u5b66\u7fd2\u8005\u304c\u9078\u629e\u53ef\u80fd\u306a\u3059\u3079\u3066\u306e\u9805\u76ee\u3092\u5bfe\u8c61\u30be\u30fc\u30f3\u306b\u30c9\u30ed\u30c3\u30d7\u3057\u3066\u521d\u3081\u3066\u3001\u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af\u304c\u8868\u793a\u3055\u308c\u307e\u3059\u3002", 
    "Submit": "\u63d0\u51fa", 
    "Submitting": "\u63d0\u51fa\u4e2d", 
    "Success feedback": "\u6210\u529f\u306e\u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af", 
    "TAB back to the list of draggable items and repeat this process until all of the draggable items have been placed on their respective dropzones.": "\u30c9\u30e9\u30c3\u30b0\u53ef\u80fd\u306e\u9805\u76ee\u30ea\u30b9\u30c8\u307e\u3067TAB\u3067\u623b\u308a\u3001\u3059\u3079\u3066\u306e\u30c9\u30e9\u30c3\u30b0\u53ef\u80fd\u306e\u9805\u76ee\u304c\u305d\u308c\u305e\u308c\u8a72\u5f53\u3059\u308b\u30c9\u30ed\u30c3\u30d7\u30be\u30fc\u30f3\u306b\u914d\u7f6e\u3055\u308c\u308b\u307e\u3067\u3001\u3053\u308c\u3092\u7e70\u308a\u8fd4\u3057\u307e\u3059\u3002", 
    "Text": "\u30c6\u30ad\u30b9\u30c8", 
    "Text color to use for draggable items (example: 'white' or '#ffffff').": "\u30c9\u30e9\u30c3\u30b0\u53ef\u80fd\u306a\u9805\u76ee\u306b\u4f7f\u7528\u3059\u308b\u30c6\u30ad\u30b9\u30c8\u8272 (\u4f8b: \u300c\u767d\u300d\u307e\u305f\u306f\u300c#ffffff\u300d)\u3002", 
    "The Bottom Zone": "\u30dc\u30c8\u30e0\u30be\u30fc\u30f3", 
    "The Middle Zone": "\u30df\u30c9\u30eb\u30be\u30fc\u30f3", 
    "The Top Zone": "\u30c8\u30c3\u30d7\u30be\u30fc\u30f3", 
    "The background color of draggable items in the problem (example: 'blue' or '#0000ff').": "\u554f\u984c\u4e2d\u306e\u30c9\u30e9\u30c3\u30b0\u53ef\u80fd\u306a\u9805\u76ee\u306e\u80cc\u666f\u8272 (\u4f8b: \u300c\u9752\u300d\u307e\u305f\u306f\u300c#0000ff\u300d)\u3002", 
    "The description of the problem or instructions shown to the learner.": "\u5b66\u7fd2\u8005\u306b\u8868\u793a\u3055\u308c\u308b\u3001\u554f\u984c\u306e\u8aac\u660e\u307e\u305f\u306f\u6307\u793a\u3002", 
    "The title of the drag and drop problem. The title is displayed to learners.": "\u30c9\u30e9\u30c3\u30b0&\u30c9\u30ed\u30c3\u30d7\u554f\u984c\u306e\u4ef6\u540d\u3002\u4ef6\u540d\u306f\u3001\u5b66\u7fd2\u8005\u306b\u8868\u793a\u3055\u308c\u307e\u3059\u3002", 
    "There are attempts remaining": "\u307e\u3060\u6311\u6226\u56de\u6570\u304c\u6b8b\u3063\u3066\u3044\u307e\u3059", 
    "There was an error with your form.": "\u30d5\u30a9\u30fc\u30e0\u306b\u30a8\u30e9\u30fc\u304c\u3042\u308a\u307e\u3057\u305f\u3002", 
    "This is a screen reader-friendly problem": "\u30b9\u30af\u30ea\u30fc\u30f3\u30ea\u30fc\u30c0\u30fc\u5bfe\u5fdc\u306e\u554f\u984c\u3067\u3059", 
    "This setting limits the number of items that can be dropped into a single zone.": "1\u3064\u306e\u30be\u30fc\u30f3\u306b\u30c9\u30ed\u30c3\u30d7\u3067\u304d\u308b\u9805\u76ee\u306e\u6570\u3092\u5236\u9650\u3059\u308b\u8a2d\u5b9a\u3067\u3059\u3002", 
    "Title": "\u4ef6\u540d", 
    "Unknown DnDv2 mode {mode} - course is misconfigured": "\u4e0d\u660e\u306eDnDv2\u30e2\u30fc\u30c9{mode} - \u30b3\u30fc\u30b9\u304c\u6b63\u3057\u304f\u8a2d\u5b9a\u3055\u308c\u3066\u3044\u307e\u305b\u3093", 
    "Use only TAB and SHIFT+TAB to navigate between draggable items and drop zones.": "\u30c9\u30e9\u30c3\u30b0\u53ef\u80fd\u306e\u9805\u76ee\u3068\u30c9\u30ed\u30c3\u30d7\u30be\u30fc\u30f3\u9593\u306e\u79fb\u52d5\u306f\u3001TAB\u3068SHIFT+TAB\u306e\u307f\u3092\u4f7f\u7528\u3057\u307e\u3059\u3002", 
    "Use text that is clear and descriptive of the item to be placed.": "\u5bfe\u8c61\u9805\u76ee\u306b\u3064\u3044\u3066\u660e\u78ba\u306b\u8aac\u660e\u3057\u3066\u3044\u308b\u30c6\u30ad\u30b9\u30c8\u3092\u4f7f\u7528\u3057\u307e\u3059\u3002", 
    "Use this zone to associate an item with the bottom layer of the triangle.": "\u4e09\u89d2\u5f62\u306e\u6700\u4e0b\u5c64\u3068\u95a2\u9023\u4ed8\u3051\u308b\u306b\u306f\u3001\u3053\u306e\u30be\u30fc\u30f3\u3092\u4f7f\u3044\u307e\u3059\u3002", 
    "Use this zone to associate an item with the middle layer of the triangle.": "\u4e09\u89d2\u5f62\u306e\u4e2d\u5c64\u3068\u95a2\u9023\u4ed8\u3051\u308b\u306b\u306f\u3001\u3053\u306e\u30be\u30fc\u30f3\u3092\u4f7f\u3044\u307e\u3059\u3002", 
    "Use this zone to associate an item with the top layer of the triangle.": "\u4e09\u89d2\u5f62\u306e\u6700\u4e0a\u5c64\u3068\u95a2\u9023\u4ed8\u3051\u308b\u306b\u306f\u3001\u3053\u306e\u30be\u30fc\u30f3\u3092\u4f7f\u3044\u307e\u3059\u3002", 
    "You can complete this problem using only your keyboard by following the guidance below:": "\u3053\u306e\u554f\u984c\u306f\u3001\u4ee5\u4e0b\u306e\u30ac\u30a4\u30c0\u30f3\u30b9\u306b\u5f93\u3044\u3001\u30ad\u30fc\u30dc\u30fc\u30c9\u306e\u307f\u3092\u4f7f\u3063\u3066\u56de\u7b54\u3067\u304d\u307e\u3059:", 
    "You have used {used} of {total} attempts.": "\u6311\u6226\u56de\u6570{total}\u56de\u4e2d{used}\u56de\u3092\u4f7f\u7528\u3057\u307e\u3057\u305f\u3002", 
    "You silly, there are no zones for this one.": "\u3044\u3048\u3044\u3048\u3001\u3053\u308c\u304c\u8a72\u5f53\u3059\u308b\u30be\u30fc\u30f3\u306f\u3042\u308a\u307e\u305b\u3093\u3002", 
    "Your highest score is {score}": "\u3042\u306a\u305f\u306e\u6700\u9ad8\u70b9\u306f{score}\u3067\u3059", 
    "Zone": "\u30be\u30fc\u30f3", 
    "Zone borders": "\u30be\u30fc\u30f3\u306e\u5883\u754c", 
    "Zone definitions": "\u30be\u30fc\u30f3\u306e\u5b9a\u7fa9", 
    "Zone labels": "\u30be\u30fc\u30f3\u306e\u30e9\u30d9\u30eb", 
    "Zones": "\u30be\u30fc\u30f3", 
    "center": "\u4e2d\u592e", 
    "do_attempt handler should only be called for assessment mode": "do_attempt\u30cf\u30f3\u30c9\u30e9\u30fc\u306b\u3064\u3044\u3066\u306f\u3001\u8a55\u4fa1\u30e2\u30fc\u30c9\u306e\u5834\u5408\u306b\u306e\u307f\u5229\u7528\u3059\u308b\u3053\u3068", 
    "height": "\u9ad8\u3055", 
    "left": "\u5de6", 
    "none": "\u306a\u3057", 
    "ok": "OK", 
    "right": "\u53f3", 
    "show_answer handler should only be called for assessment mode": "show_answer\u30cf\u30f3\u30c9\u30e9\u30fc\u306b\u3064\u3044\u3066\u306f\u3001\u8a55\u4fa1\u30e2\u30fc\u30c9\u306e\u5834\u5408\u306b\u306e\u307f\u5229\u7528\u3059\u308b\u3053\u3068", 
    "width": "\u5e45", 
    "{earned}/{possible} point (graded)": [
      "{earned}/{possible}\u70b9 (\u63a1\u70b9\u6e08\u307f)", 
      "{earned}/{possible}\u70b9 (\u63a1\u70b9\u6e08\u307f)"
    ], 
    "{earned}/{possible} point (ungraded)": [
      "{earned}/{possible}\u70b9 (\u672a\u63a1\u70b9)", 
      "{earned}/{possible}\u70b9 (\u672a\u63a1\u70b9)"
    ], 
    "{possible} point possible (graded)": [
      "{possible}\u70b9\u53ef\u80fd (\u63a1\u70b9\u6e08\u307f)", 
      "{possible}\u70b9\u53ef\u80fd (\u63a1\u70b9\u6e08\u307f)"
    ], 
    "{possible} point possible (ungraded)": [
      "{possible}\u70b9\u53ef\u80fd (\u672a\u63a1\u70b9)", 
      "{possible}\u70b9\u53ef\u80fd (\u672a\u63a1\u70b9)"
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
    "DATETIME_FORMAT": "Y\u5e74n\u6708j\u65e5G:i", 
    "DATETIME_INPUT_FORMATS": [
      "%Y-%m-%d %H:%M:%S", 
      "%Y-%m-%d %H:%M:%S.%f", 
      "%Y-%m-%d %H:%M", 
      "%Y-%m-%d", 
      "%m/%d/%Y %H:%M:%S", 
      "%m/%d/%Y %H:%M:%S.%f", 
      "%m/%d/%Y %H:%M", 
      "%m/%d/%Y", 
      "%m/%d/%y %H:%M:%S", 
      "%m/%d/%y %H:%M:%S.%f", 
      "%m/%d/%y %H:%M", 
      "%m/%d/%y"
    ], 
    "DATE_FORMAT": "Y\u5e74n\u6708j\u65e5", 
    "DATE_INPUT_FORMATS": [
      "%Y-%m-%d", 
      "%m/%d/%Y", 
      "%m/%d/%y", 
      "%b %d %Y", 
      "%b %d, %Y", 
      "%d %b %Y", 
      "%d %b, %Y", 
      "%B %d %Y", 
      "%B %d, %Y", 
      "%d %B %Y", 
      "%d %B, %Y"
    ], 
    "DECIMAL_SEPARATOR": ".", 
    "FIRST_DAY_OF_WEEK": "0", 
    "MONTH_DAY_FORMAT": "n\u6708j\u65e5", 
    "NUMBER_GROUPING": "0", 
    "SHORT_DATETIME_FORMAT": "Y/m/d G:i", 
    "SHORT_DATE_FORMAT": "Y/m/d", 
    "THOUSAND_SEPARATOR": ",", 
    "TIME_FORMAT": "G:i", 
    "TIME_INPUT_FORMATS": [
      "%H:%M:%S", 
      "%H:%M:%S.%f", 
      "%H:%M"
    ], 
    "YEAR_MONTH_FORMAT": "Y\u5e74n\u6708"
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
        