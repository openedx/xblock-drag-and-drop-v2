
            (function(global){
                var DragAndDropI18N = {
                  init: function() {
                    

(function(globals) {

  var django = globals.django || (globals.django = {});

  
  django.pluralidx = function(n) {
    var v=(n == 1 && n % 1 == 0) ? 0 : (n == 2 && n % 1 == 0) ? 1: (n % 10 == 0 && n % 1 == 0 && n > 10) ? 2 : 3;
    if (typeof(v) == 'boolean') {
      return v ? 1 : 0;
    } else {
      return v;
    }
  };
  

  /* gettext library */

  django.catalog = django.catalog || {};
  
  var newcatalog = {
    "\n                            Please provide a description of the image for non-visual users.\n                            The description should provide sufficient information to allow anyone\n                            to solve the problem even without seeing the image.\n                        ": "\n                            \u05e0\u05d0 \u05e1\u05e4\u05e7 \u05ea\u05d9\u05d0\u05d5\u05e8 \u05e9\u05dc \u05d4\u05ea\u05de\u05d5\u05e0\u05d4 \u05dc\u05de\u05e9\u05ea\u05de\u05e9\u05d9\u05dd \u05d7\u05e1\u05e8\u05d9 \u05d9\u05db\u05d5\u05dc\u05ea \u05d5\u05d9\u05d6\u05d5\u05d0\u05dc\u05d9\u05ea.\n                            \u05d4\u05ea\u05d9\u05d0\u05d5\u05e8 \u05d7\u05d9\u05d9\u05d1 \u05dc\u05e1\u05e4\u05e7 \u05de\u05d9\u05d3\u05e2 \u05d1\u05de\u05d9\u05d3\u05d4 \u05de\u05e1\u05e4\u05e7\u05ea \u05d5\u05dc\u05d0\u05e4\u05e9\u05e8 \u05dc\u05db\u05dc \u05d0\u05d7\u05d3\n                            \u05dc\u05e4\u05ea\u05d5\u05e8 \u05d0\u05ea \u05d4\u05d1\u05e2\u05d9\u05d4 \u05d2\u05dd \u05de\u05d1\u05dc\u05d9 \u05dc\u05e8\u05d0\u05d5\u05ea \u05d0\u05ea \u05d4\u05ea\u05de\u05d5\u05e0\u05d4.\n                        ",
    "Add a zone": "\u05d4\u05d5\u05e1\u05e3 \u05d0\u05d6\u05d5\u05e8",
    "Add an item": "\u05d4\u05d5\u05e1\u05e3 \u05e4\u05e8\u05d9\u05d8",
    "An error occurred. Unable to load drag and drop problem.": "\u05d0\u05d9\u05e8\u05e2\u05d4 \u05e9\u05d2\u05d9\u05d0\u05d4. \u05dc\u05d0 \u05e0\u05d9\u05ea\u05df \u05dc\u05d4\u05e2\u05dc\u05d5\u05ea \u05d1\u05e2\u05d9\u05d9\u05ea \u05d2\u05e8\u05d9\u05e8\u05d4 \u05d5\u05e9\u05d7\u05e8\u05d5\u05e8.",
    "An isosceles triangle with three layers of similar height. It is shown upright, so the widest layer is located at the bottom, and the narrowest layer is located at the top.": "\u05de\u05e9\u05d5\u05dc\u05e9 \u05e9\u05d5\u05d5\u05d4-\u05e9\u05d5\u05e7\u05d9\u05d9\u05dd \u05d1\u05e2\u05dc \u05e9\u05dc\u05d5\u05e9 \u05e9\u05db\u05d1\u05d5\u05ea \u05d1\u05d2\u05d5\u05d1\u05d4 \u05d3\u05d5\u05de\u05d4. \u05d4\u05d5\u05d0 \u05de\u05d5\u05e6\u05d2 \u05d0\u05e0\u05db\u05d9\u05ea, \u05db\u05da \u05e9\u05d4\u05e9\u05db\u05d1\u05d4 \u05d4\u05e8\u05d7\u05d1\u05d4 \u05d1\u05d9\u05d5\u05ea\u05e8 \u05e0\u05de\u05e6\u05d0\u05ea \u05d1\u05ea\u05d7\u05ea\u05d9\u05ea, \u05d5\u05d4\u05e9\u05db\u05d1\u05d4 \u05d4\u05e6\u05e8\u05d4 \u05d1\u05d9\u05d5\u05ea\u05e8 \u05e0\u05de\u05e6\u05d0\u05ea \u05dc\u05de\u05e2\u05dc\u05d4.",
    "Assessment": "\u05d4\u05e2\u05e8\u05db\u05d4",
    "Background URL": "\u05db\u05ea\u05d5\u05d1\u05ea URL \u05e9\u05dc \u05d4\u05e8\u05e7\u05e2",
    "Background description": "\u05ea\u05d9\u05d0\u05d5\u05e8 \u05e8\u05e7\u05e2",
    "Cancel": "\u05d1\u05d9\u05d8\u05d5\u05dc",
    "Change background": "\u05e9\u05d9\u05e0\u05d5\u05d9 \u05e8\u05e7\u05e2",
    "Close": "\u05e1\u05d2\u05d9\u05e8\u05d4",
    "Continue": "\u05d4\u05de\u05e9\u05da",
    "Correct": "\u05e0\u05db\u05d5\u05df",
    "Correctly placed in: {zone_title}": "\u05de\u05de\u05d5\u05e7\u05dd \u05db\u05d4\u05dc\u05db\u05d4 \u05d1: {zone_title}",
    "Correctly placed {correct_count} item": [
      "\u05e4\u05e8\u05d9\u05d8  {correct_count} \u05d4\u05d5\u05e0\u05d7 \u05e0\u05db\u05d5\u05df",
      " {correct_count} \u05e4\u05e8\u05d9\u05d8\u05d9\u05dd \u05d4\u05d5\u05e0\u05d7\u05d5 \u05e0\u05db\u05d5\u05df",
      " {correct_count} \u05e4\u05e8\u05d9\u05d8\u05d9\u05dd \u05d4\u05d5\u05e0\u05d7\u05d5 \u05e0\u05db\u05d5\u05df",
      " {correct_count} \u05e4\u05e8\u05d9\u05d8\u05d9\u05dd \u05d4\u05d5\u05e0\u05d7\u05d5 \u05e0\u05db\u05d5\u05df"
    ],
    "Defines the number of times a student can try to answer this problem. If the value is not set, infinite attempts are allowed.": "\u05de\u05d2\u05d3\u05d9\u05e8 \u05d0\u05ea \u05de\u05e1\u05e4\u05e8 \u05d4\u05e4\u05e2\u05de\u05d9\u05dd \u05d1\u05d4\u05df \u05e1\u05d8\u05d5\u05d3\u05e0\u05d8 \u05d9\u05db\u05d5\u05dc \u05dc\u05e0\u05e1\u05d5\u05ea \u05dc\u05e2\u05e0\u05d5\u05ea \u05e2\u05dc \u05d1\u05e2\u05d9\u05d4 \u05d6\u05d5. \u05d0\u05dd \u05d4\u05e2\u05e8\u05da \u05dc\u05d0 \u05e0\u05e7\u05d1\u05e2, \u05d9\u05ea\u05d0\u05e4\u05e9\u05e8\u05d5 \u05d0\u05d9\u05e0\u05e1\u05d5\u05e3 \u05e0\u05d9\u05e1\u05d9\u05d5\u05e0\u05d5\u05ea.",
    "Did not place {missing_count} required item": [
      "\u05dc\u05d0 \u05d4\u05e0\u05d9\u05d7 \u05e4\u05e8\u05d9\u05d8 \u05d3\u05e8\u05d5\u05e9 {missing_count}",
      "\u05dc\u05d0 \u05d4\u05e0\u05d9\u05d7 {missing_count} \u05e4\u05e8\u05d9\u05d8\u05d9\u05dd \u05d3\u05e8\u05d5\u05e9\u05d9\u05dd",
      "\u05dc\u05d0 \u05d4\u05e0\u05d9\u05d7 {missing_count} \u05e4\u05e8\u05d9\u05d8\u05d9\u05dd \u05d3\u05e8\u05d5\u05e9\u05d9\u05dd",
      "\u05dc\u05d0 \u05d4\u05e0\u05d9\u05d7 {missing_count} \u05e4\u05e8\u05d9\u05d8\u05d9\u05dd \u05d3\u05e8\u05d5\u05e9\u05d9\u05dd"
    ],
    "Display label names on the image": "\u05d9\u05e9 \u05dc\u05d4\u05e6\u05d9\u05d2 \u05d0\u05ea \u05e9\u05de\u05d5\u05ea \u05d4\u05ea\u05d5\u05d5\u05d9\u05ea \u05e2\u05dc \u05d4\u05ea\u05de\u05d5\u05e0\u05d4",
    "Display the heading \"Problem\" above the problem text?": "\u05d4\u05d0\u05dd \u05dc\u05d4\u05e6\u05d9\u05d2 \u05d0\u05ea \u05d4\u05db\u05d5\u05ea\u05e8\u05ea \"\u05d1\u05e2\u05d9\u05d4\" \u05de\u05e2\u05dc \u05dc\u05d8\u05e7\u05e1\u05d8 \u05d4\u05d1\u05e2\u05d9\u05d4?",
    "Display the title to the learner?": "\u05d4\u05d0\u05dd \u05dc\u05d4\u05e6\u05d9\u05d2 \u05d0\u05ea \u05d4\u05db\u05d5\u05ea\u05e8\u05ea \u05dc\u05dc\u05d5\u05de\u05d3?",
    "Display zone borders on the image": "\u05d4\u05e6\u05d2 \u05d0\u05ea \u05d2\u05d1\u05d5\u05dc\u05d5\u05ea \u05d4\u05d0\u05d6\u05d5\u05e8 \u05e2\u05dc \u05d4\u05ea\u05de\u05d5\u05e0\u05d4",
    "Drag and Drop": "\u05d2\u05e8\u05d9\u05e8\u05d4 \u05d5\u05e9\u05d7\u05e8\u05d5\u05e8",
    "Drag the items onto the image above.": "\u05d2\u05e8\u05d5\u05e8 \u05d0\u05ea \u05d4\u05e4\u05e8\u05d9\u05d8\u05d9\u05dd \u05d0\u05dc \u05d4\u05ea\u05de\u05d5\u05e0\u05d4 \u05dc\u05de\u05e2\u05dc\u05d4.",
    "Feedback": "\u05de\u05e9\u05d5\u05d1",
    "Final attempt was used, highest score is {score}": "\u05e0\u05e2\u05e9\u05d4 \u05e9\u05d9\u05de\u05d5\u05e9 \u05d1\u05e0\u05d9\u05e1\u05d9\u05d5\u05df \u05d4\u05d0\u05d7\u05e8\u05d5\u05df, \u05d4\u05e6\u05d9\u05d5\u05df \u05d4\u05d2\u05d1\u05d5\u05d4 \u05d1\u05d9\u05d5\u05ea\u05e8 \u05d4\u05d5\u05d0 {score}",
    "Final feedback": "\u05de\u05e9\u05d5\u05d1 \u05e1\u05d5\u05e4\u05d9",
    "For example, 'http://example.com/background.png' or '/static/background.png'.": "\u05dc\u05d3\u05d5\u05d2\u05de\u05d4, 'http://example.com/background.png' \u05d0\u05d5 '/static/background.png'.",
    "Goes anywhere": "\u05d1\u05db\u05dc \u05de\u05e7\u05d5\u05dd",
    "Goes to the bottom": "\u05de\u05ea\u05d0\u05d9\u05dd \u05dc\u05ea\u05d7\u05ea\u05d9\u05ea",
    "Goes to the middle": "\u05de\u05ea\u05d0\u05d9\u05dd \u05dc\u05de\u05e8\u05db\u05d6",
    "Goes to the top": "\u05de\u05ea\u05d0\u05d9\u05dd \u05dc\u05de\u05e2\u05dc\u05d4",
    "Good work! You have completed this drag and drop problem.": "\u05e2\u05d1\u05d5\u05d3\u05d4 \u05d8\u05d5\u05d1\u05d4! \u05d4\u05e9\u05dc\u05de\u05ea \u05d0\u05ea \u05d1\u05e2\u05d9\u05d9\u05ea \u05d4\u05d2\u05e8\u05d9\u05e8\u05d4 \u05d5\u05d4\u05e9\u05d7\u05e8\u05d5\u05e8 \u05d4\u05d6\u05d5.",
    "I don't belong anywhere": "\u05d0\u05d9\u05e0\u05e0\u05d9 \u05e9\u05d9\u05d9\u05da \u05dc\u05e9\u05d5\u05dd \u05de\u05e7\u05d5\u05dd",
    "Incorrect": "\u05dc\u05d0 \u05e0\u05db\u05d5\u05df",
    "Indicates whether a learner has completed the problem at least once": "\u05de\u05e6\u05d9\u05d9\u05df \u05d4\u05d0\u05dd \u05d4\u05e9\u05dc\u05d9\u05dd \u05d4\u05dc\u05d5\u05de\u05d3 \u05d0\u05ea \u05d4\u05d1\u05e2\u05d9\u05d4 \u05dc\u05e4\u05d7\u05d5\u05ea \u05e4\u05e2\u05dd \u05d0\u05d7\u05ea",
    "Information about current positions of items that a learner has dropped on the target image.": "\u05de\u05d9\u05d3\u05e2 \u05d0\u05d5\u05d3\u05d5\u05ea \u05de\u05d9\u05e7\u05d5\u05dd \u05e0\u05d5\u05db\u05d7\u05d9 \u05e9\u05dc \u05e4\u05e8\u05d9\u05d8\u05d9\u05dd \u05e9\u05e6\u05e8\u05d9\u05da \u05d4\u05dc\u05d5\u05de\u05d3 \u05dc\u05e9\u05d7\u05e8\u05e8 \u05e2\u05dc \u05ea\u05de\u05d5\u05e0\u05ea \u05d4\u05de\u05d8\u05e8\u05d4.",
    "Introductory feedback": "\u05de\u05e9\u05d5\u05d1 \u05e4\u05ea\u05d9\u05d7\u05d4",
    "Item Bank": "\u05d1\u05e0\u05e7 \u05e4\u05e8\u05d9\u05d8\u05d9\u05dd",
    "Item background color": "\u05e6\u05d1\u05e2 \u05d4\u05e8\u05e7\u05e2 \u05e9\u05dc \u05d4\u05e4\u05e8\u05d9\u05d8",
    "Item text color": "\u05e6\u05d1\u05e2 \u05d4\u05d8\u05e7\u05e1\u05d8 \u05e9\u05dc \u05d4\u05e4\u05e8\u05d9\u05d8",
    "Items": "\u05e4\u05e8\u05d9\u05d8\u05d9\u05dd",
    "Keyboard Help": "\u05de\u05e7\u05dc\u05d3\u05ea \u05e2\u05d6\u05e8\u05d4",
    "Loading drag and drop problem.": "\u05d4\u05e2\u05dc\u05d0\u05ea \u05d1\u05e2\u05d9\u05d9\u05ea \u05d2\u05e8\u05d9\u05e8\u05d4 \u05d5\u05e9\u05d7\u05e8\u05d5\u05e8.",
    "Max number of attempts reached": "\u05d0\u05d9\u05e8\u05e2\u05d4 \u05d7\u05e8\u05d9\u05d2\u05d4 \u05de\u05de\u05e1\u05e4\u05e8 \u05d4\u05e0\u05d9\u05e1\u05d9\u05d5\u05e0\u05d5\u05ea \u05d4\u05de\u05e8\u05d1\u05d9",
    "Maximum attempts": "\u05de\u05e1\u05e4\u05e8 \u05e0\u05e1\u05d9\u05d5\u05e0\u05d5\u05ea \u05de\u05e8\u05d1\u05d9",
    "Misplaced {misplaced_count} item": [
      "\u05e4\u05e8\u05d9\u05d8\u05d9 {misplaced_count} \u05e9\u05d0\u05d9\u05e0\u05dd \u05d1\u05de\u05e7\u05d5\u05de\u05dd",
      "\u05e4\u05e8\u05d9\u05d8\u05d9 {misplaced_count} \u05e9\u05d0\u05d9\u05e0\u05dd \u05d1\u05de\u05e7\u05d5\u05de\u05dd",
      "\u05e4\u05e8\u05d9\u05d8\u05d9 {misplaced_count} \u05e9\u05d0\u05d9\u05e0\u05dd \u05d1\u05de\u05e7\u05d5\u05de\u05dd",
      "\u05e4\u05e8\u05d9\u05d8\u05d9 {misplaced_count} \u05e9\u05d0\u05d9\u05e0\u05dd \u05d1\u05de\u05e7\u05d5\u05de\u05dd"
    ],
    "Misplaced {misplaced_count} item (misplaced item was returned to the item bank)": [
      "\u05e4\u05e8\u05d9\u05d8 {misplaced_count} \u05e9\u05d4\u05d5\u05e0\u05d7 \u05dc\u05d0 \u05e0\u05db\u05d5\u05df. \u05d4\u05e4\u05e8\u05d9\u05d8 \u05e9\u05d4\u05d5\u05e0\u05d7 \u05dc\u05d0 \u05e0\u05db\u05d5\u05df \u05d4\u05d5\u05d7\u05d6\u05e8 \u05dc\u05d1\u05e0\u05e7 \u05d4\u05e4\u05e8\u05d9\u05d8\u05d9\u05dd.",
      " {misplaced_count} \u05e4\u05e8\u05d9\u05d8\u05d9\u05dd \u05e9\u05d4\u05d5\u05e0\u05d7\u05d5 \u05dc\u05d0 \u05e0\u05db\u05d5\u05df. \u05d4\u05e4\u05e8\u05d9\u05d8\u05d9\u05dd \u05e9\u05d4\u05d5\u05e0\u05d7\u05d5 \u05dc\u05d0 \u05e0\u05db\u05d5\u05df \u05d4\u05d5\u05d7\u05d6\u05e8\u05d5 \u05dc\u05d1\u05e0\u05e7 \u05d4\u05e4\u05e8\u05d9\u05d8\u05d9\u05dd.",
      " {misplaced_count} \u05e4\u05e8\u05d9\u05d8\u05d9\u05dd \u05e9\u05d4\u05d5\u05e0\u05d7\u05d5 \u05dc\u05d0 \u05e0\u05db\u05d5\u05df. \u05d4\u05e4\u05e8\u05d9\u05d8\u05d9\u05dd \u05e9\u05d4\u05d5\u05e0\u05d7\u05d5 \u05dc\u05d0 \u05e0\u05db\u05d5\u05df \u05d4\u05d5\u05d7\u05d6\u05e8\u05d5 \u05dc\u05d1\u05e0\u05e7 \u05d4\u05e4\u05e8\u05d9\u05d8\u05d9\u05dd.",
      " {misplaced_count} \u05e4\u05e8\u05d9\u05d8\u05d9\u05dd \u05e9\u05d4\u05d5\u05e0\u05d7\u05d5 \u05dc\u05d0 \u05e0\u05db\u05d5\u05df. \u05d4\u05e4\u05e8\u05d9\u05d8\u05d9\u05dd \u05e9\u05d4\u05d5\u05e0\u05d7\u05d5 \u05dc\u05d0 \u05e0\u05db\u05d5\u05df \u05d4\u05d5\u05d7\u05d6\u05e8\u05d5 \u05dc\u05d1\u05e0\u05e7 \u05d4\u05e4\u05e8\u05d9\u05d8\u05d9\u05dd."
    ],
    "Mode": "\u05de\u05e6\u05d1",
    "No, this item does not belong here. Try again.": "\u05dc\u05d0, \u05e4\u05e8\u05d9\u05d8 \u05d6\u05d4 \u05d0\u05d9\u05e0\u05d5 \u05e9\u05d9\u05d9\u05da \u05dc\u05db\u05d0\u05df. \u05d9\u05e9 \u05dc\u05e0\u05e1\u05d5\u05ea \u05e9\u05e0\u05d9\u05ea.",
    "Number of attempts learner used": "\u05de\u05e1\u05e4\u05e8 \u05d4\u05e0\u05e1\u05d9\u05d5\u05e0\u05d5\u05ea \u05e9\u05d4\u05dc\u05d5\u05de\u05d3 \u05d4\u05e9\u05ea\u05de\u05e9 \u05d1\u05d4\u05dd",
    "Of course it goes here! It goes anywhere!": "\u05d1\u05d5\u05d5\u05d3\u05d0\u05d9 \u05e9\u05d6\u05d4 \u05dc\u05e9\u05dd! \u05d6\u05d4 \u05de\u05ea\u05d0\u05d9\u05dd \u05d1\u05db\u05dc \u05de\u05e7\u05d5\u05dd!",
    "Placed in: {zone_title}": "\u05de\u05de\u05d5\u05e7\u05dd \u05d1: {zone_title}",
    "Please check over your submission.": "\u05d1\u05d3\u05d5\u05e7 \u05e9\u05e0\u05d9\u05ea \u05d0\u05ea \u05d4\u05e9\u05dc\u05d9\u05d7\u05d4.",
    "Problem": "\u05d1\u05e2\u05d9\u05d4",
    "Problem data": "\u05e0\u05ea\u05d5\u05e0\u05d9 \u05d4\u05d1\u05e2\u05d9\u05d4",
    "Problem text": "\u05d8\u05e7\u05e1\u05d8 \u05d4\u05d1\u05e2\u05d9\u05d4",
    "Reset": "\u05d0\u05ea\u05d7\u05dc",
    "Save": "\u05e9\u05de\u05d9\u05e8\u05d4",
    "Saving": "\u05e9\u05d5\u05de\u05e8",
    "Show \"Problem\" heading": "\u05d4\u05e6\u05d2 \u05db\u05d5\u05ea\u05e8\u05ea \"\u05d1\u05e2\u05d9\u05d4\"",
    "Show Answer": "\u05d4\u05e6\u05d2 \u05ea\u05e9\u05d5\u05d1\u05d4",
    "Show title": "\u05d4\u05e6\u05d2 \u05db\u05d5\u05ea\u05e8\u05ea",
    "Some of your answers were not correct.": "\u05d7\u05dc\u05e7 \u05de\u05d4\u05ea\u05e9\u05d5\u05d1\u05d5\u05ea \u05e9\u05dc\u05da \u05d0\u05d9\u05e0\u05df \u05e0\u05db\u05d5\u05e0\u05d5\u05ea.",
    "Standard": "\u05ea\u05e7\u05df",
    "Standard mode: the problem provides immediate feedback each time a learner drops an item on a target zone. Assessment mode: the problem provides feedback only after a learner drops all available items on target zones.": "\u05de\u05e6\u05d1 \u05ea\u05e7\u05e0\u05d9: \u05d4\u05d1\u05e2\u05d9\u05d4 \u05de\u05e1\u05e4\u05e7\u05ea \u05de\u05e9\u05d5\u05d1 \u05de\u05d9\u05d9\u05d3\u05d9 \u05d1\u05db\u05dc \u05e4\u05e2\u05dd \u05e9\u05ea\u05dc\u05de\u05d9\u05d3 \u05de\u05e9\u05d7\u05e8\u05e8 \u05e4\u05e8\u05d9\u05d8 \u05d1\u05d0\u05d6\u05d5\u05e8 \u05d9\u05e2\u05d3. \u05de\u05e6\u05d1 \u05d4\u05e2\u05e8\u05db\u05d4: \u05d4\u05d1\u05e2\u05d9\u05d4 \u05de\u05e1\u05e4\u05e7\u05ea \u05de\u05e9\u05d5\u05d1 \u05e8\u05e7 \u05dc\u05d0\u05d7\u05e8 \u05e9\u05ea\u05dc\u05de\u05d9\u05d3 \u05de\u05e9\u05d7\u05e8\u05e8 \u05d0\u05ea \u05db\u05dc \u05d4\u05e4\u05e8\u05d9\u05d8\u05d9\u05dd \u05d4\u05d6\u05de\u05d9\u05e0\u05d9\u05dd \u05d1\u05d0\u05d6\u05d5\u05e8\u05d9 \u05d4\u05d9\u05e2\u05d3.",
    "Submit": "\u05e9\u05dc\u05d7",
    "Text color to use for draggable items (example: 'white' or '#ffffff').": "\u05e6\u05d1\u05e2 \u05d4\u05d8\u05e7\u05e1\u05d8 \u05dc\u05e9\u05d9\u05de\u05d5\u05e9 \u05e2\u05d1\u05d5\u05e8 \u05e4\u05e8\u05d9\u05d8\u05d9\u05dd \u05d4\u05e0\u05d9\u05ea\u05e0\u05d9\u05dd \u05dc\u05d2\u05e8\u05d9\u05e8\u05d4 (\u05d3\u05d5\u05d2\u05de\u05d4: '\u05dc\u05d1\u05df' \u05d0\u05d5 '#ffffff').",
    "The Bottom Zone": "\u05d4\u05d0\u05d6\u05d5\u05e8 \u05d4\u05ea\u05d7\u05ea\u05d5\u05df",
    "The Middle Zone": "\u05d4\u05d0\u05d6\u05d5\u05e8 \u05d4\u05d0\u05de\u05e6\u05e2\u05d9",
    "The Top Zone": "\u05d4\u05d0\u05d6\u05d5\u05e8 \u05d4\u05e2\u05dc\u05d9\u05d5\u05df",
    "The background color of draggable items in the problem (example: 'blue' or '#0000ff').": "\u05e6\u05d1\u05e2 \u05d4\u05e8\u05e7\u05e2 \u05e9\u05dc \u05d4\u05e4\u05e8\u05d9\u05d8\u05d9\u05dd \u05d4\u05e0\u05d9\u05ea\u05e0\u05d9\u05dd \u05dc\u05d2\u05e8\u05d9\u05e8\u05d4 \u05d1\u05d1\u05e2\u05d9\u05d4 (\u05dc\u05d3\u05d5\u05d2\u05de\u05d4: '\u05db\u05d7\u05d5\u05dc' \u05d0\u05d5 '#0000ff').",
    "The description of the problem or instructions shown to the learner.": "\u05ea\u05d9\u05d0\u05d5\u05e8 \u05d4\u05d1\u05e2\u05d9\u05d4 \u05d0\u05d5 \u05d4\u05d5\u05e8\u05d0\u05d5\u05ea \u05d4\u05de\u05d5\u05e6\u05d2\u05d5\u05ea \u05dc\u05dc\u05d5\u05de\u05d3.",
    "The title of the drag and drop problem. The title is displayed to learners.": "\u05d4\u05db\u05d5\u05ea\u05e8\u05ea \u05e9\u05dc \u05d1\u05e2\u05d9\u05d9\u05ea \u05d4\u05d2\u05e8\u05d9\u05e8\u05d4 \u05d5\u05d4\u05e9\u05d7\u05e8\u05d5\u05e8. \u05d4\u05db\u05d5\u05ea\u05e8\u05ea \u05de\u05d5\u05e6\u05d2\u05ea \u05dc\u05dc\u05d5\u05de\u05d3\u05d9\u05dd.",
    "There was an error with your form.": "\u05d4\u05d9\u05ea\u05d4 \u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05d8\u05d5\u05e4\u05e1 \u05e9\u05dc\u05da.",
    "Title": "\u05db\u05d5\u05ea\u05e8\u05ea",
    "Unknown DnDv2 mode {mode} - course is misconfigured": "\u05de\u05e6\u05d1 DnDv2 \u05dc\u05d0 \u05d9\u05d3\u05d5\u05e2 {mode} - \u05d4\u05e7\u05d5\u05e8\u05e1 \u05d0\u05d9\u05e0\u05d5 \u05de\u05d5\u05d2\u05d3\u05e8",
    "Use this zone to associate an item with the bottom layer of the triangle.": "\u05d4\u05e9\u05ea\u05de\u05e9 \u05d1\u05d0\u05d6\u05d5\u05e8 \u05d6\u05d4 \u05e2\u05dc \u05de\u05e0\u05ea \u05dc\u05e7\u05e9\u05e8 \u05e4\u05e8\u05d9\u05d8 \u05e2\u05dd \u05d4\u05e9\u05db\u05d1\u05d4 \u05d4\u05ea\u05d7\u05ea\u05d5\u05e0\u05d4 \u05e9\u05dc \u05d4\u05de\u05e9\u05d5\u05dc\u05e9.",
    "Use this zone to associate an item with the middle layer of the triangle.": "\u05d4\u05e9\u05ea\u05de\u05e9 \u05d1\u05d0\u05d6\u05d5\u05e8 \u05d6\u05d4 \u05e2\u05dc \u05de\u05e0\u05ea \u05dc\u05e7\u05e9\u05e8 \u05e4\u05e8\u05d9\u05d8 \u05e2\u05dd \u05d4\u05e9\u05db\u05d1\u05d4 \u05d4\u05d0\u05de\u05e6\u05e2\u05d9\u05ea \u05e9\u05dc \u05d4\u05de\u05e9\u05d5\u05dc\u05e9.",
    "Use this zone to associate an item with the top layer of the triangle.": "\u05d4\u05e9\u05ea\u05de\u05e9 \u05d1\u05d0\u05d6\u05d5\u05e8 \u05d6\u05d4 \u05e2\u05dc \u05de\u05e0\u05ea \u05dc\u05e7\u05e9\u05e8 \u05e4\u05e8\u05d9\u05d8 \u05e2\u05dd \u05d4\u05e9\u05db\u05d1\u05d4 \u05d4\u05e2\u05dc\u05d9\u05d5\u05e0\u05d4 \u05e9\u05dc \u05d4\u05de\u05e9\u05d5\u05dc\u05e9.",
    "You have used {used} of {total} attempts.": "\u05d4\u05e9\u05ea\u05de\u05e9\u05ea \u05d1-{used} \u05de\u05ea\u05d5\u05da {total} \u05e0\u05d9\u05e1\u05d9\u05d5\u05e0\u05d5\u05ea.",
    "You silly, there are no zones for this one.": "\u05d0\u05d9\u05df \u05d0\u05d6\u05d5\u05e8\u05d9\u05dd \u05e2\u05d1\u05d5\u05e8 \u05d6\u05d4.",
    "Zone borders": "\u05d2\u05d1\u05d5\u05dc\u05d5\u05ea \u05d4\u05d0\u05d6\u05d5\u05e8",
    "Zone definitions": "\u05d4\u05e4\u05e8\u05d3\u05d5\u05ea \u05d0\u05d6\u05d5\u05e8",
    "Zone labels": "\u05ea\u05d5\u05d5\u05d9\u05d5\u05ea \u05d4\u05d0\u05d6\u05d5\u05e8",
    "Zones": "\u05d0\u05d6\u05d5\u05e8\u05d9\u05dd",
    "do_attempt handler should only be called for assessment mode": "\u05d9\u05e9 \u05dc\u05e7\u05e8\u05d5\u05d0 \u05dc\u05de\u05d1\u05e6\u05e2 do_attempt \u05e8\u05e7 \u05e2\u05d1\u05d5\u05e8 \u05de\u05e6\u05d1 \u05d4\u05e2\u05e8\u05db\u05d4",
    "show_answer handler should only be called for assessment mode": "\u05de\u05d3\u05e8\u05d9\u05da \u05d4\u05e8\u05d0\u05d4_\u05ea\u05e9\u05d5\u05d1\u05d4 \u05e6\u05e8\u05d9\u05da \u05dc\u05d4\u05d9\u05d5\u05ea \u05d1\u05de\u05e6\u05d1 \u05d4\u05e2\u05e8\u05db\u05d4 \u05d1\u05dc\u05d1\u05d3"
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
    "DATETIME_FORMAT": "j \u05d1F Y H:i",
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
    "DATE_FORMAT": "j \u05d1F Y",
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
    "MONTH_DAY_FORMAT": "j \u05d1F",
    "NUMBER_GROUPING": "0",
    "SHORT_DATETIME_FORMAT": "d/m/Y H:i",
    "SHORT_DATE_FORMAT": "d/m/Y",
    "THOUSAND_SEPARATOR": ",",
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
        