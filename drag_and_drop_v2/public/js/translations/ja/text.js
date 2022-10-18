
            (function(global){
                var DragAndDropI18N = {
                  init: function() {
                    

(function(globals) {

  var django = globals.django || (globals.django = {});

  
  django.pluralidx = function(n) {
    var v=0;
    if (typeof(v) == 'boolean') {
      return v ? 1 : 0;
    } else {
      return v;
    }
  };
  

  /* gettext library */

  django.catalog = django.catalog || {};
  
  var newcatalog = {
    "\n                            Please provide a description of the image for non-visual users.\n                            The description should provide sufficient information to allow anyone\n                            to solve the problem even without seeing the image.\n                        ": "\n                            \u753b\u50cf\u304c\u898b\u3048\u306a\u3044\u30e6\u30fc\u30b6\u30fc\u306e\u305f\u3081\u306b\u753b\u50cf\u306e\u8aac\u660e\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002\n                            \u8aac\u660e\u306b\u306f\u3001\u8ab0\u3082\u304c\u753b\u50cf\u3092\u898b\u306a\u304f\u3066\u3082\u554f\u984c\u3092\u89e3\u6c7a\u3067\u304d\u308b\u3088\u3046\u306b\n                            \u5341\u5206\u306a\u60c5\u5831\u304c\u63d0\u4f9b\u3055\u308c\u3066\u3044\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002\n                        ",
    ", draggable": ", draggable",
    ", draggable, grabbed": ", draggable, grabbed",
    ", dropzone": ", dropzone",
    "Actions": "\u64cd\u4f5c",
    "Add a zone": "\u30be\u30fc\u30f3\u3092\u8ffd\u52a0\u3059\u308b",
    "Add an item": "\u30a2\u30a4\u30c6\u30e0\u3092\u8ffd\u52a0\u3059\u308b",
    "An error occurred. Unable to load drag and drop problem.": "\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f\u3002\u30c9\u30e9\u30c3\u30b0\u30a2\u30f3\u30c9\u30c9\u30ed\u30c3\u30d7\u306e\u554f\u984c\u304c\u8aad\u307f\u8fbc\u3081\u307e\u305b\u3093\u3002",
    "An isosceles triangle with three layers of similar height. It is shown upright, so the widest layer is located at the bottom, and the narrowest layer is located at the top.": "\u307b\u307c\u540c\u3058\u9ad8\u3055\u306e3\u5c64\u306e\u30ec\u30a4\u30e4\u30fc\u3092\u542b\u3080\u4e8c\u7b49\u8fba\u4e09\u89d2\u5f62\u3002\u6700\u3082\u5e45\u306e\u5e83\u3044\u30ec\u30a4\u30e4\u30fc\u3092\u5e95\u306b\u3001\u6700\u3082\u72ed\u3044\u30ec\u30a4\u30e4\u30fc\u304c\u4e0a\u306b\u304f\u308b\u3088\u3046\u306b\u76f4\u7acb\u3057\u3066\u914d\u7f6e\u3055\u308c\u307e\u3059\u3002",
    "Assessment": "\u30c6\u30b9\u30c8",
    "Background URL": "\u80cc\u666fURL",
    "Background description": "\u80cc\u666f\u306e\u8aac\u660e",
    "Cancel": "\u30ad\u30e3\u30f3\u30bb\u30eb",
    "Change background": "\u80cc\u666f\u3092\u5909\u66f4",
    "Close": "\u9589\u3058\u308b",
    "Continue": "\u7d9a\u3051\u308b",
    "Correct": "\u6b63\u89e3",
    "Correctly placed in: {zone_title}": "\u6b21\u3092\u6b63\u3057\u304f\u914d\u7f6e\u3057\u307e\u3057\u305f\uff1a\u00a0{zone_title}",
    "Correctly placed {correct_count} item": [
      "{correct_count}\u3064\u306e\u30a2\u30a4\u30c6\u30e0\u3092\u6b63\u3057\u304f\u914d\u7f6e\u3057\u307e\u3057\u305f"
    ],
    "Defines the number of points the problem is worth.": "\u5404\u554f\u984c\u306e\u914d\u70b9\u3092\u5b9a\u7fa9\u3057\u307e\u3059\u3002",
    "Defines the number of times a student can try to answer this problem. If the value is not set, infinite attempts are allowed.": "\u53d7\u8b1b\u8005\u304c\u3053\u306e\u554f\u984c\u306b\u89e3\u7b54\u3067\u304d\u308b\u56de\u6570\u3092\u6307\u5b9a\u3057\u3066\u304f\u3060\u3055\u3044\u3002\u5024\u3092\u6307\u5b9a\u3057\u306a\u3044\u5834\u5408\u306f\u4f55\u56de\u3067\u3082\u89e3\u7b54\u3067\u304d\u308b\u3053\u3068\u306b\u306a\u308a\u307e\u3059\u3002",
    "Did not place {missing_count} required item": [
      "{missing_count} \u500b\u306e\u5fc5\u9808\u30a2\u30a4\u30c6\u30e0\u3092\u914d\u7f6e\u3057\u307e\u305b\u3093\u3067\u3057\u305f"
    ],
    "Display label names on the image": "\u753b\u50cf\u306b\u30e9\u30d9\u30eb\u540d\u3092\u8868\u793a",
    "Display the heading \"Problem\" above the problem text?": "\u554f\u984c\u30c6\u30ad\u30b9\u30c8\u306e\u4e0a\u306b\u300c\u554f\u984c\u300d\u3068\u3044\u3046\u898b\u51fa\u3057\u3092\u8868\u793a\u3057\u307e\u3059\u304b\uff1f",
    "Display the title to the learner?": "\u53d7\u8b1b\u8005\u306b\u30bf\u30a4\u30c8\u30eb\u3092\u8868\u793a\u3057\u307e\u3059\u304b\uff1f",
    "Display zone borders on the image": "\u753b\u50cf\u306b\u30be\u30fc\u30f3\u306e\u5883\u754c\u7dda\u3092\u8868\u793a\u3059\u308b",
    "Drag and Drop": "\u30c9\u30e9\u30c3\u30b0\u30a2\u30f3\u30c9\u30c9\u30ed\u30c3\u30d7",
    "Drag and Drop Problem": "\u30c9\u30e9\u30c3\u30b0\u30a2\u30f3\u30c9\u30c9\u30ed\u30c3\u30d7\u306e\u554f\u984c",
    "Drag and Drop problems consist of draggable items and dropzones. Users should select a draggable item with their keyboard and then navigate to an appropriate dropzone to drop it.": "\u30c9\u30e9\u30c3\u30b0\u30a2\u30f3\u30c9\u30c9\u30ed\u30c3\u30d7\u306e\u554f\u984c\u306f\u3001\u30c9\u30e9\u30c3\u30b0\u53ef\u80fd\u306a\u30a2\u30a4\u30c6\u30e0\u3068\u30c9\u30ed\u30c3\u30d7\u30be\u30fc\u30f3\u304b\u3089\u69cb\u6210\u3057\u307e\u3059\u3002\u30e6\u30fc\u30b6\u30fc\u306f\u30ad\u30fc\u30dc\u30fc\u30c9\u3092\u4f7f\u7528\u3057\u3066\u30c9\u30e9\u30c3\u30b0\u53ef\u80fd\u306a\u30a2\u30a4\u30c6\u30e0\u3092\u9078\u629e\u3057\u3001\u9069\u5207\u306a\u30c9\u30ed\u30c3\u30d7\u30be\u30fc\u30f3\u306b\u79fb\u52d5\u3057\u3066\u30c9\u30ed\u30c3\u30d7\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002",
    "Drag the items onto the image above.": "\u4e0a\u306e\u753b\u50cf\u306b\u30a2\u30a4\u30c6\u30e0\u3092\u30c9\u30e9\u30c3\u30b0\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    "Drop Targets": "\u30c9\u30ed\u30c3\u30d7\u30bf\u30fc\u30b2\u30c3\u30c8",
    "Feedback": "\u30b3\u30e1\u30f3\u30c8",
    "Final attempt was used, highest score is {score}": "\u6700\u7d42\u8a66\u884c\u304c\u4f7f\u7528\u3055\u308c\u307e\u3057\u305f\u3002\u6700\u9ad8\u5f97\u70b9\u306f {score} \u70b9\u3067\u3059\u3002",
    "Final feedback": "\u6700\u7d42\u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af",
    "For example, 'http://example.com/background.png' or '/static/background.png'.": "\u4f8b\uff1a'http://example.com/background.png' \u307e\u305f\u306f '/static/background.png' \u3068\u306a\u308a\u307e\u3059\u3002",
    "Go to Beginning": "\u6700\u521d\u306b\u79fb\u52d5",
    "Goes anywhere": "\u3069\u3053\u306b\u3067\u3082\u79fb\u52d5\u53ef\u80fd",
    "Goes to the bottom": "\u6700\u4e0b\u4f4d\u306b\u79fb\u52d5",
    "Goes to the middle": "\u4e2d\u9593\u306b\u79fb\u52d5",
    "Goes to the top": "\u6700\u4e0a\u4f4d\u306b\u79fb\u52d5",
    "Good work! You have completed this drag and drop problem.": "\u3088\u304f\u3067\u304d\u307e\u3057\u305f\uff01\u3053\u308c\u3067\u30c9\u30e9\u30c3\u30b0\u30a2\u30f3\u30c9\u30c9\u30ed\u30c3\u30d7\u306e\u554f\u984c\u304c\u89e3\u6c7a\u3057\u307e\u3057\u305f\u3002",
    "Hints:": "\u30d2\u30f3\u30c8\uff1a",
    "I don't belong anywhere": "\u6240\u5c5e\u5148\u306a\u3057",
    "Incorrect": "\u4e0d\u6b63\u89e3",
    "Indicates whether a learner has completed the problem at least once": "\u53d7\u8b1b\u8005\u304c\u554f\u984c\u3092\u6700\u4f4e\u4e00\u56de\u5b8c\u4e86\u3057\u305f\u304b\u3069\u3046\u304b\u3092\u793a\u3057\u307e\u3059\u3002",
    "Information about current positions of items that a learner has dropped on the target image.": "\u53d7\u8b1b\u8005\u304c\u30bf\u30fc\u30b2\u30c3\u30c8\u753b\u50cf\u306b\u30c9\u30ed\u30c3\u30d7\u3057\u305f\u30a2\u30a4\u30c6\u30e0\u306e\u73fe\u5728\u4f4d\u7f6e\u306b\u95a2\u3059\u308b\u60c5\u5831\u3002",
    "Introductory feedback": "\u5c0e\u5165\u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af",
    "Item Bank": "\u30a2\u30a4\u30c6\u30e0\u30d0\u30f3\u30af",
    "Item background color": "\u30a2\u30a4\u30c6\u30e0\u306e\u80cc\u666f\u8272",
    "Item text color": "\u30a2\u30a4\u30c6\u30e0\u30c6\u30ad\u30b9\u30c8\u306e\u8272",
    "Items": "\u30a2\u30a4\u30c6\u30e0",
    "Keyboard Help": "\u30ad\u30fc\u30dc\u30fc\u30c9\u30d8\u30eb\u30d7",
    "Loading drag and drop problem.": "\u30c9\u30e9\u30c3\u30b0\u30a2\u30f3\u30c9\u30c9\u30ed\u30c3\u30d7\u554f\u984c\u3092\u8aad\u307f\u8fbc\u3093\u3067\u3044\u307e\u3059\u3002",
    "Max number of attempts reached": "\u6700\u5927\u8a66\u884c\u56de\u6570\u306b\u5230\u9054\u3057\u307e\u3057\u305f\u3002",
    "Maximum attempts": "\u6700\u5927\u8a66\u884c\u56de\u6570",
    "Misplaced {misplaced_count} item": [
      "{misplaced_count} \u500b\u306e\u30a2\u30a4\u30c6\u30e0\u306e\u914d\u7f6e\u304c\u9055\u3044\u307e\u3057\u305f"
    ],
    "Misplaced {misplaced_count} item (misplaced item was returned to the item bank)": [
      "{misplaced_count}\u3064\u306e\u30a2\u30a4\u30c6\u30e0\u3092\u7f6e\u304d\u5fd8\u308c\u307e\u3057\u305f\u3002 \u7f6e\u304d\u5fd8\u308c\u305f\u5546\u54c1\u306f\u5546\u54c1\u30d0\u30f3\u30af\u306b\u8fd4\u5374\u3055\u308c\u307e\u3057\u305f\u3002"
    ],
    "Mode": "\u30e2\u30fc\u30c9",
    "Navigate using TAB and SHIFT+TAB to the appropriate dropzone and press CTRL+M once more to drop it here.": "TAB\u30ad\u30fc\u3068SHIFT + TAB\u30ad\u30fc\u3092\u62bc\u3057\u3066\u9069\u5207\u306a\u30c9\u30ed\u30c3\u30d7\u30be\u30fc\u30f3\u306b\u79fb\u52d5\u3057\u3001CTRL + M\u30ad\u30fc\u3092\u62bc\u3057\u3066\u3053\u3053\u306b\u30c9\u30ed\u30c3\u30d7\u3057\u307e\u3059\u3002",
    "No, this item does not belong here. Try again.": "\u9055\u3044\u307e\u3059\u3002\u3053\u306e\u30a2\u30a4\u30c6\u30e0\u306f\u3053\u3053\u306b\u306f\u79fb\u52d5\u3067\u304d\u307e\u305b\u3093\u3002\u3082\u3046\u4e00\u5ea6\u3084\u308a\u76f4\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    "Number of attempts learner used": "\u53d7\u8b1b\u8005\u304c\u8a66\u884c\u3057\u305f\u56de\u6570",
    "Of course it goes here! It goes anywhere!": "\u3082\u3061\u308d\u3093\u3001\u3053\u308c\u306f\u3053\u3053\u306b\u914d\u7f6e\u3057\u307e\u3059\u3002\u3069\u3053\u306b\u3067\u3082\u79fb\u52d5\u3067\u304d\u307e\u3059\u3002",
    "Placed in: {zone_title}": "\u6b21\u306e\u5834\u6240\u306b\u914d\u7f6e\u3057\u307e\u3057\u305f\uff1a\u00a0 {zone_title}",
    "Please check over your submission.": "\u63d0\u51fa\u5185\u5bb9\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    "Press CTRL+M to select a draggable item (effectively picking it up).": "\u30c9\u30e9\u30c3\u30b0\u53ef\u80fd\u306a\u30a2\u30a4\u30c6\u30e0\u3092\u9078\u629e\u3059\u308b\u306b\u306f\u3001CTRL + M\u30ad\u30fc\u3092\u62bc\u3057\u307e\u3059 (\u30d4\u30c3\u30af\u30a2\u30c3\u30d7)\u3002",
    "Press ESC if you want to cancel the drop operation (for example, to select a different item).": "\u30c9\u30ed\u30c3\u30d7\u64cd\u4f5c\u3092\u30ad\u30e3\u30f3\u30bb\u30eb\u3059\u308b\u306b\u306f (\u4f8b: \u5225\u306e\u30a2\u30a4\u30c6\u30e0\u3092\u9078\u629e\u3059\u308b\u3068\u304d\u306a\u3069)\u3001ESC\u30ad\u30fc\u3092\u62bc\u3057\u307e\u3059\u3002",
    "Problem": "\u554f\u984c",
    "Problem Weight": "\u554f\u984c\u306e\u91cd\u307f\u4ed8\u3051",
    "Problem data": "\u554f\u984c\u30c7\u30fc\u30bf",
    "Problem text": "\u554f\u984c\u30c6\u30ad\u30b9\u30c8",
    "Reset": "\u30ea\u30bb\u30c3\u30c8",
    "Save": "\u4fdd\u5b58",
    "Saving": "\u4fdd\u5b58\u4e2d",
    "Show \"Problem\" heading": "\u300c\u554f\u984c\u300d\u306e\u898b\u51fa\u3057\u3092\u8868\u793a",
    "Show Answer": "\u56de\u7b54\u3092\u898b\u308b",
    "Show title": "\u30bf\u30a4\u30c8\u30eb\u306e\u8868\u793a",
    "Some of your answers were not correct.": "\u3042\u306a\u305f\u306e\u7b54\u3048\u306e\u3044\u304f\u3064\u304b\u306f\u6b63\u3057\u304f\u3042\u308a\u307e\u305b\u3093\u3067\u3057\u305f\u3002",
    "Standard": "\u6a19\u6e96",
    "Standard mode: the problem provides immediate feedback each time a learner drops an item on a target zone. Assessment mode: the problem provides feedback only after a learner drops all available items on target zones.": "\u6a19\u6e96\u30e2\u30fc\u30c9\uff1a\u53d7\u8b1b\u8005\u304c\u30bf\u30fc\u30b2\u30c3\u30c8\u30be\u30fc\u30f3\u306b\u554f\u984c\u306e\u30a2\u30a4\u30c6\u30e0\u3092\u30c9\u30ed\u30c3\u30d7\u3059\u308b\u305f\u3073\u306b\u3001\u5373\u5ea7\u306b\u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af\u3092\u8fd4\u3057\u307e\u3059\u3002\u30c6\u30b9\u30c8\u30e2\u30fc\u30c9\uff1a\u53d7\u8b1b\u8005\u304c\u30bf\u30fc\u30b2\u30c3\u30c8\u30be\u30fc\u30f3\u306b\u3042\u308b\u554f\u984c\u306e\u3059\u3079\u3066\u306e\u30a2\u30a4\u30c6\u30e0\u3092\u30c9\u30ed\u30c3\u30d7\u3057\u305f\u5f8c\u3067\u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af\u3092\u8fd4\u3057\u307e\u3059\u3002",
    "Submit": "\u63d0\u51fa",
    "Submitting": "\u63d0\u51fa\u4e2d",
    "TAB back to the list of draggable items and repeat this process until all of the draggable items have been placed on their respective dropzones.": "TAB\u30ad\u30fc\u3092\u62bc\u3057\u3066\u30c9\u30e9\u30c3\u30b0\u53ef\u80fd\u306a\u30a2\u30a4\u30c6\u30e0\u306e\u30ea\u30b9\u30c8\u306b\u623b\u308a\u307e\u3059\u3002\u5404\u30a2\u30a4\u30c6\u30e0\u3092\u305d\u308c\u305e\u308c\u306e\u30c9\u30ed\u30c3\u30d7\u30be\u30fc\u30f3\u306b\u914d\u7f6e\u3059\u308b\u307e\u3067\u3001\u3053\u306e\u30d7\u30ed\u30bb\u30b9\u3092\u7e70\u308a\u8fd4\u3057\u307e\u3059\u3002",
    "Text color to use for draggable items (example: 'white' or '#ffffff').": "\u30c9\u30e9\u30c3\u30b0\u53ef\u80fd\u306a\u30a2\u30a4\u30c6\u30e0\u306b\u4f7f\u7528\u3059\u308b\u30c6\u30ad\u30b9\u30c8\u306e\u8272 (\u4f8b\uff1a'white'\u307e\u305f\u306f'#ffffff')\u3002",
    "The Bottom Zone": "\u6700\u4e0b\u4f4d\u30be\u30fc\u30f3",
    "The Middle Zone": "\u4e2d\u9593\u30be\u30fc\u30f3",
    "The Top Zone": "\u6700\u4e0a\u4f4d\u30be\u30fc\u30f3",
    "The background color of draggable items in the problem (example: 'blue' or '#0000ff').": "\u554f\u984c\u306e\u30c9\u30e9\u30c3\u30b0\u53ef\u80fd\u306a\u30a2\u30a4\u30c6\u30e0\u306e\u80cc\u666f\u8272 (\u4f8b\uff1a'blue'\u307e\u305f\u306f'#0000ff')\u3002",
    "The description of the problem or instructions shown to the learner.": "\u53d7\u8b1b\u8005\u306b\u8868\u793a\u3059\u308b\u554f\u984c\u307e\u305f\u306f\u6307\u793a\u306e\u8aac\u660e\u3002",
    "The title of the drag and drop problem. The title is displayed to learners.": "\u30c9\u30e9\u30c3\u30b0\u30a2\u30f3\u30c9\u30c9\u30ed\u30c3\u30d7\u306e\u554f\u984c\u306e\u30bf\u30a4\u30c8\u30eb\u3002\u30bf\u30a4\u30c8\u30eb\u306f\u53d7\u8b1b\u8005\u306b\u8868\u793a\u3055\u308c\u307e\u3059\u3002",
    "There was an error with your form.": "\u30d5\u30a9\u30fc\u30e0\u3067\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f\u3002",
    "Title": "\u4ef6\u540d",
    "Unknown DnDv2 mode {mode} - course is misconfigured": "\u4e0d\u660e\u306aDnDv2\u30e2\u30fc\u30c9 {mode} - \u8b1b\u5ea7\u306e\u8a2d\u5b9a\u304c\u6b63\u3057\u304f\u3042\u308a\u307e\u305b\u3093\u3002",
    "Use only TAB and SHIFT+TAB to navigate between draggable items and drop zones.": "\u30c9\u30e9\u30c3\u30b0\u53ef\u80fd\u306a\u30a2\u30a4\u30c6\u30e0\u3068\u30c9\u30ed\u30c3\u30d7\u30be\u30fc\u30f3\u306e\u9593\u3092\u79fb\u52d5\u3059\u308b\u306b\u306f\u3001TAB\u30ad\u30fc\u3068SHIFT + TAB\u30ad\u30fc\u306e\u307f\u3092\u62bc\u3057\u307e\u3059\u3002",
    "Use this zone to associate an item with the bottom layer of the triangle.": "\u3053\u306e\u30be\u30fc\u30f3\u3092\u4f7f\u7528\u3057\u3066\u3001\u30a2\u30a4\u30c6\u30e0\u3092\u4e09\u89d2\u5f62\u306e\u6700\u4e0b\u5c64\u306b\u95a2\u9023\u4ed8\u3051\u307e\u3059\u3002",
    "Use this zone to associate an item with the middle layer of the triangle.": "\u3053\u306e\u30be\u30fc\u30f3\u3092\u4f7f\u7528\u3057\u3066\u3001\u30a2\u30a4\u30c6\u30e0\u3092\u4e09\u89d2\u5f62\u306e\u4e2d\u9593\u30ec\u30a4\u30e4\u30fc\u306b\u95a2\u9023\u4ed8\u3051\u307e\u3059\u3002",
    "Use this zone to associate an item with the top layer of the triangle.": "\u3053\u306e\u30be\u30fc\u30f3\u3092\u4f7f\u7528\u3057\u3066\u3001\u30a2\u30a4\u30c6\u30e0\u3092\u4e09\u89d2\u5f62\u306e\u6700\u4e0a\u4f4d\u30ec\u30a4\u30e4\u30fc\u306b\u95a2\u9023\u4ed8\u3051\u307e\u3059\u3002",
    "You can complete this problem using only your keyboard by following the guidance below:": "\u6b21\u306e\u30ac\u30a4\u30c0\u30f3\u30b9\u306b\u5f93\u3063\u3066\u3001\u30ad\u30fc\u30dc\u30fc\u30c9\u306e\u307f\u3092\u4f7f\u7528\u3057\u3066\u3053\u306e\u554f\u984c\u3092\u5b8c\u4e86\u3067\u304d\u307e\u3059\u3002",
    "You have used {used} of {total} attempts.": "\u5408\u8a08\u8a66\u884c\u56de\u6570 {total} \u56de\u306e\u3046\u3061 {used} \u56de\u884c\u3044\u307e\u3057\u305f\u3002",
    "You silly, there are no zones for this one.": "\u9055\u3044\u307e\u3059\u3002\u3053\u306e\u30a2\u30a4\u30c6\u30e0\u306b\u306f\u30be\u30fc\u30f3\u304c\u3042\u308a\u307e\u305b\u3093\u3002",
    "Your highest score is {score}": "\u3042\u306a\u305f\u306e\u6700\u9ad8\u30b9\u30b3\u30a2\u306f{score}\u3067\u3059",
    "Zone borders": "\u30be\u30fc\u30f3\u5883\u754c",
    "Zone definitions": "\u30be\u30fc\u30f3\u5b9a\u7fa9",
    "Zone labels": "\u30be\u30fc\u30f3\u30e9\u30d9\u30eb",
    "Zones": "\u30be\u30fc\u30f3",
    "do_attempt handler should only be called for assessment mode": "do_attempt\u30cf\u30f3\u30c9\u30e9\u30fc\u306f\u30c6\u30b9\u30c8\u30e2\u30fc\u30c9\u3060\u3051\u3067\u547c\u3073\u51fa\u3057\u307e\u3059\u3002",
    "show_answer handler should only be called for assessment mode": "show_answer\u30cf\u30f3\u30c9\u30e9\u30fc\u306f\u30c6\u30b9\u30c8\u30e2\u30fc\u30c9\u3060\u3051\u3067\u547c\u3073\u51fa\u3057\u307e\u3059\u3002",
    "{earned}/{possible} point (graded)": [
      "{earned}/{possible} \u70b9 (\u6210\u7e3e\u8a55\u4fa1\u5bfe\u8c61)"
    ],
    "{earned}/{possible} point (ungraded)": [
      "{earned}/{possible} \u70b9 (\u6210\u7e3e\u8a55\u4fa1\u5bfe\u8c61\u5916)"
    ],
    "{possible} point possible (graded)": [
      "{possible} \u70b9\u6e80\u70b9 (\u6210\u7e3e\u8a55\u4fa1\u5bfe\u8c61)"
    ],
    "{possible} point possible (ungraded)": [
      "{possible} \u70b9\u6e80\u70b9 (\u6210\u7e3e\u8a55\u4fa1\u5bfe\u8c61\u5916)"
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
        