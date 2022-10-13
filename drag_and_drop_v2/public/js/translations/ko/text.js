
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
    "\n                            Please provide a description of the image for non-visual users.\n                            The description should provide sufficient information to allow anyone\n                            to solve the problem even without seeing the image.\n                        ": "\n                            \uc774\ubbf8\uc9c0\ub97c \ubcfc \uc218 \uc5c6\ub294 \uc0ac\uc6a9\uc81c\ub97c \uc704\ud574 \uc774\ubbf8\uc9c0\uc758 \uc124\uba85\uc744 \uc81c\uacf5\ud558\uc138\uc694.\n                            \ub204\uad6c\ub098 \uc774\ubbf8\uc9c0\ub97c \ubcf4\uc9c0 \uc54a\uace0\ub3c4 \ubb38\uc81c\ub97c \ud480 \uc218 \uc788\ub3c4\ub85d\n                            \ucda9\ubd84\ud55c \uc815\ubcf4\ub97c \uc124\uba85\ud574\uc8fc\uc5b4\uc57c \ud569\ub2c8\ub2e4.\n                        ",
    ", draggable": ", \ub04c\uae30 \uac00\ub2a5",
    ", draggable, grabbed": ", \ub04c\uae30 \uac00\ub2a5, \uc7a1\ud600\uc788\uc74c",
    ", dropzone": ", \ub193\uae30 \uc601\uc5ed",
    "Actions": "\ud589\ub3d9",
    "Add a zone": "\uc601\uc5ed \ucd94\uac00\ud558\uae30",
    "Add an item": "\ud56d\ubaa9 \ucd94\uac00\ud558\uae30",
    "An error occurred. Unable to load drag and drop problem.": "\uc624\ub958\uac00 \uc0dd\uacbc\uc2b5\ub2c8\ub2e4. \ub04c\uc5b4\ub193\uae30 \ubb38\uc81c\ub97c \ubd88\ub7ec\uc62c \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.",
    "An isosceles triangle with three layers of similar height. It is shown upright, so the widest layer is located at the bottom, and the narrowest layer is located at the top.": "\ube44\uc2b7\ud55c \ub192\uc774\uc758 \uc138 \uac1c\uc758 \uce35\uc73c\ub85c \uad6c\uc131\ub41c \uc774\ub4f1\ubcc0 \uc0bc\uac01\ud615\uc785\ub2c8\ub2e4. \ub611\ubc14\ub85c \uc11c\uc788\ub294 \ud615\ud0dc\uc774\ubbc0\ub85c, \uac00\uc7a5 \ub113\uc740 \uce35\uc740 \ud558\ub2e8\uc5d0 \uc704\uce58\ud574\uc788\uc73c\uba70, \uac00\uc7a5 \uc881\uc740 \uce35\uc740 \uc0c1\ub2e8\uc5d0 \uc704\uce58\ud574 \uc788\uc2b5\ub2c8\ub2e4.",
    "Assessment": "\ud3c9\uac00",
    "Background Image": "\ubc30\uacbd \uc774\ubbf8\uc9c0",
    "Background URL": "\ubc30\uacbd URL",
    "Background description": "\ubc30\uacbd \uc124\uba85",
    "Basic Settings": "\uae30\ubcf8 \uc124\uc815",
    "Cancel": "\ucde8\uc18c",
    "Change background": "\ubc30\uacbd \ubcc0\uacbd",
    "Close": "\ub2eb\uae30",
    "Continue": "\uacc4\uc18d",
    "Correct": "\uc815\ub2f5",
    "Correct! This one belongs to The Bottom Zone.": "\uc815\ub2f5\uc785\ub2c8\ub2e4! \uc774\uac83\uc740 \ud558\ub2e8 \uc601\uc5ed\uc5d0 \uc18d\ud569\ub2c8\ub2e4.",
    "Correct! This one belongs to The Middle Zone.": "\uc815\ub2f5\uc785\ub2c8\ub2e4! \uc774\uac83\uc740 \uc911\ub2e8 \uc601\uc5ed\uc5d0 \uc18d\ud569\ub2c8\ub2e4.",
    "Correct! This one belongs to The Top Zone.": "\uc815\ub2f5\uc785\ub2c8\ub2e4! \uc774\uac83\uc740 \uc0c1\ub2e8 \uc601\uc5ed\uc5d0 \uc18d\ud569\ub2c8\ub2e4.",
    "Correctly placed in: {zone_title}": "{zone_title}\uc5d0 \uc54c\ub9de\uac8c \ubc30\uce58\ub418\uc5b4 \uc788\uc74c",
    "Correctly placed {correct_count} item": [
      "{correct_count} \uac1c\uc758 \ud56d\ubaa9\uc744 \uc62c\ubc14\ub974\uac8c \ubc30\uce58\ud588\uc2b5\ub2c8\ub2e4"
    ],
    "DEPRECATED. Keeps maximum score achieved by student as a weighted value.": "\ub300\uccb4\ub429\ub2c8\ub2e4. \ud559\uc0dd\uc774 \ub2ec\uc131\ud55c \ucd5c\ub300 \uc810\uc218\ub97c \uac00\uc911\uce58\ub85c \uc720\uc9c0\ud569\ub2c8\ub2e4.",
    "Defines the number of points the problem is worth.": "\ubb38\uc81c\uc758 \uc911\uc694\ub3c4\ub97c \uc22b\uc790\ub85c \uc9c0\uc815\ud569\ub2c8\ub2e4.",
    "Defines the number of times a student can try to answer this problem. If the value is not set, infinite attempts are allowed.": "\ud559\uc0dd\uc774 \uc774 \ubb38\uc81c\uc5d0 \ub300\ud574 \ub2f5\ud560 \uc218 \uc788\ub294 \ud69f\uc218\ub97c \uc9c0\uc815\ud569\ub2c8\ub2e4. \ub9cc\uc57d \uac12\uc774 \uc9c0\uc815\ub418\uc9c0 \uc54a\uc558\ub2e4\uba74, \ubb34\ud55c\uc815\uc73c\ub85c \uc2dc\ub3c4\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
    "Did not place {missing_count} required item": [
      "{missing_count}\uac1c\uc758 \ud544\uc694\ud55c \ud56d\ubaa9\ub4e4\uc744 \ubc30\uce58\ud558\uc9c0 \uc54a\uc558\uc2b5\ub2c8\ub2e4"
    ],
    "Display label names on the image": "\uc774\ubbf8\uc9c0\uc5d0 \ub808\uc774\ube14 \uc774\ub984\uc744 \ud45c\uc2dc\ud558\uae30",
    "Display the heading \"Problem\" above the problem text?": "\ubb38\uc81c \ud14d\uc2a4\ud2b8 \uc704\uc5d0 \"\ubb38\uc81c\"\uc758 \uc81c\ubaa9\uc744 \ud45c\uc2dc\ud569\ub2c8\uae4c?",
    "Display the title to the learner?": "\ud559\uc2b5\uc790\uc5d0\uac8c \uc81c\ubaa9\uc744 \ud45c\uc2dc\ud569\ub2c8\uae4c?",
    "Display zone borders on the image": "\uc774\ubbf8\uc9c0\uc5d0 \uc601\uc5ed\uc758 \uacbd\uacc4\ub97c \ud45c\uc2dc\ud558\uae30",
    "Drag and Drop": "\ub04c\uc5b4\ub193\uae30",
    "Drag and Drop Problem": "\ub04c\uc5b4\ub193\uae30 \ubb38\uc81c",
    "Drag and Drop problems consist of draggable items and dropzones. Users should select a draggable item with their keyboard and then navigate to an appropriate dropzone to drop it.": "\ub04c\uc5b4\ub193\uae30 \ubb38\uc81c\ub294 \ub04c\uae30 \uac00\ub2a5\ud55c \ud56d\ubaa9\ub4e4\uacfc \ub193\uae30 \uc601\uc5ed\uc73c\ub85c \uc774\ub8e8\uc5b4\uc838 \uc788\uc2b5\ub2c8\ub2e4. \uc0ac\uc6a9\uc790\ub294 \ub04c\uae30 \uac00\ub2a5\ud55c \uc544\uc774\ud15c\uc744 \ud0a4\ubcf4\ub4dc\ub85c \uc120\ud0dd\ud574\uc11c \uc801\uc808\ud55c \ub193\uae30 \uc601\uc5ed\uc73c\ub85c \uc774\ub3d9\uc2dc\ucf1c\uc57c \ud569\ub2c8\ub2e4.",
    "Drag the items onto the image above.": "\uc0ac\uc9c4 \uc704\ub85c \ud56d\ubaa9\uc744 \ub04c\uc5b4\ub2e4 \ub193\uc73c\uc138\uc694.",
    "Drop Targets": "\ub193\uae30 \ubaa9\ud45c",
    "Feedback": "\ud53c\ub4dc\ubc31",
    "Final attempt was used, highest score is {score}": "\ucd5c\uc885 \uc2dc\ub3c4\uac00 \uc0ac\uc6a9\ub418\uc5c8\uc73c\uba70, \ucd5c\uace0 \uc810\uc218\ub294 {score} \uc785\ub2c8\ub2e4",
    "Final feedback": "\ucd5c\uc885 \ud53c\ub4dc\ubc31",
    "For example, 'http://example.com/background.png' or '/static/background.png'.": "\uc608\ub97c \ub4e4\uc5b4, 'http://example.com/background.png' \ub610\ub294 '/static/background.png'.",
    "Generate image and zones": "\uc774\ubbf8\uc9c0\uc640 \uc601\uc5ed \uc0dd\uc131\ud558\uae30",
    "Generate image automatically": "\uc774\ubbf8\uc9c0\ub97c \uc790\ub3d9\uc73c\ub85c \uc0dd\uc131\ud558\uae30",
    "Go to Beginning": "\ucc98\uc74c\uc73c\ub85c \uac00\uae30",
    "Goes anywhere": "\uc5b4\ub514\ub4e0\uc9c0 \uac11\ub2c8\ub2e4",
    "Goes to the bottom": "\ud558\ub2e8\uc73c\ub85c \uac11\ub2c8\ub2e4",
    "Goes to the middle": "\uc911\ub2e8\uc73c\ub85c \uac11\ub2c8\ub2e4",
    "Goes to the top": "\uc0c1\ub2e8\uc73c\ub85c \uac11\ub2c8\ub2e4",
    "Good work! You have completed this drag and drop problem.": "\uc798\ud588\uc2b5\ub2c8\ub2e4! \ub2f9\uc2e0\uc740 \uc774 \ub04c\uc5b4\ub193\uae30 \ubb38\uc81c\ub97c \ud574\uacb0\ud558\uc168\uc2b5\ub2c8\ub2e4.",
    "Hints:": "\ud78c\ud2b8 :",
    "I don't belong anywhere": "\ub09c \uc5b4\ub514\uc5d0\ub3c4 \uc18d\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4",
    "Incorrect": "\uc624\ub2f5",
    "Indicates whether a learner has completed the problem at least once": "\ud559\uc2b5\uc790\uac00 \ubb38\uc81c\ub97c \ud55c \ubc88 \uc774\uc0c1 \uc644\ub8cc\ud588\ub294\uc9c0 \ud45c\uc2dc\ud569\ub2c8\ub2e4.",
    "Information about current positions of items that a learner has dropped on the target image.": "\ud559\uc2b5\uc790\uac00 \ubaa9\ud45c \uc774\ubbf8\uc9c0\uc5d0 \ub193\uc740 \ud56d\ubaa9\uc758 \ud604\uc7ac \uc704\uce58\uc5d0 \ub300\ud55c \uc815\ubcf4.",
    "Introductory feedback": "\ucd08\uae30 \ud53c\ub4dc\ubc31",
    "Item Bank": "\ud56d\ubaa9 \ucc3d\uace0",
    "Item background color": "\ud56d\ubaa9 \ubc30\uacbd \uc0c9\uc0c1",
    "Item definitions": "\ud56d\ubaa9 \uc815\uc758",
    "Item text color": "\ud56d\ubaa9 \ud14d\uc2a4\ud2b8 \uc0c9\uc0c1",
    "Items": "\ud56d\ubaa9",
    "Items placed here: ": "\ub2e4\uc74c\uc758 \ud56d\ubaa9\ub4e4\uc774 \ubc30\uce58\ub418\uc5b4 \uc788\uc74c:",
    "Keeps maximum score achieved by student as a raw value between 0 and 1.": "\ud559\uc0dd\uc774 \ub2ec\uc131\ud55c \ucd5c\ub300 \uc810\uc218\ub97c 0\uacfc 1 \uc0ac\uc774\uc758 \uc6d0\ub798 \uac12\uc73c\ub85c \uc720\uc9c0\ud569\ub2c8\ub2e4.",
    "Keyboard Help": "\ud0a4\ubcf4\ub4dc \ub3c4\uc6c0",
    "Loading drag and drop problem.": "\ub04c\uc5b4\ub193\uae30 \ubb38\uc81c\ub97c \ubd88\ub7ec\uc624\ub294 \uc911.",
    "Max number of attempts reached": "\ucd5c\ub300 \uc2dc\ub3c4 \ud69f\uc218\uc5d0 \ub3c4\ub2ec\ud568",
    "Maximum attempts": "\ucd5c\ub300 \uc2dc\ub3c4\ud69f\uc218",
    "Maximum items per zone": "\uc601\uc5ed \ub2f9 \ucd5c\ub300 \ud56d\ubaa9 \uc218",
    "Misplaced {misplaced_count} item": [
      "{misplaced_count}\uac1c\uc758 \ud56d\ubaa9\uc774 \uc798\ubabb \ubc30\uce58\ub418\uc5c8\uc2b5\ub2c8\ub2e4"
    ],
    "Misplaced {misplaced_count} item (misplaced item was returned to the item bank)": [
      "{misplaced_count} \uac1c \ud56d\ubaa9\uc744 \uc798\ubabb \ubc30\uce58\ud588\uc2b5\ub2c8\ub2e4. \uc798\ubabb \ubc30\uce58 \ub41c \ud488\ubaa9\uc740 \ud488\ubaa9 \uc740\ud589\uc5d0 \ubc18\ud658\ub418\uc5c8\uc2b5\ub2c8\ub2e4."
    ],
    "Mode": "\ubaa8\ub4dc",
    "Navigate using TAB and SHIFT+TAB to the appropriate dropzone and press CTRL+M once more to drop it here.": "TAB\uacfc SHIFT+TAB\uc744 \uc0ac\uc6a9\ud558\uc5ec \uc801\uc808\ud55c \ub193\uae30 \uc601\uc5ed\uc73c\ub85c \uac00\uc838\ub2e4 \ub193\uc740 \ub4a4 CTRL+M\uc744 \ud55c\ubc88 \ub354 \ub20c\ub7ec \ud56d\ubaa9\uc744 \ub193\uc73c\uc138\uc694.",
    "No items placed here": "\ud56d\ubaa9\uc774 \ubc30\uce58\ub418\uc5b4 \uc788\uc9c0 \uc54a\uc74c",
    "No, this item does not belong here. Try again.": "\ud2c0\ub838\uc2b5\ub2c8\ub2e4, \uc774 \ud56d\ubaa9\uc740 \uc774 \uacf3\uc5d0 \uc18d\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4. \ub2e4\uc2dc \uc2dc\ub3c4\ud558\uc138\uc694.",
    "Number of attempts learner used": "\ud559\uc2b5\uc790\uac00 \uc2dc\ub3c4\ud55c \ud69f\uc218",
    "Number of columns": "\uc5f4\uc758 \uac1c\uc218",
    "Number of columns and rows.": "\ud589\uacfc \uc5f4\uc758 \uac1c\uc218",
    "Number of rows": "\ud589\uc758 \uac1c\uc218",
    "Of course it goes here! It goes anywhere!": "\ub2f9\uc5f0\ud788 \uc5ec\uae30\uac00 \ub9de\uc8e0! \uc5b4\ub514\ub4e0 \ub9de\uc2b5\ub2c8\ub2e4!",
    "Placed in: {zone_title}": "{zone_title}\uc5d0 \ubc30\uce58\ub418\uc5b4 \uc788\uc74c",
    "Please check over your submission.": "\uc81c\ucd9c\ubb3c\uc744 \ud655\uc778\ud558\uc138\uc694.",
    "Please check the values you entered.": "\uc785\ub825\ud55c \uac12\uc744 \ud655\uc778\ud558\uc138\uc694.",
    "Press CTRL+M to select a draggable item (effectively picking it up).": "CTRL+M\uc744 \ub20c\ub7ec \ub04c\uae30 \uac00\ub2a5\ud55c \ud56d\ubaa9\uc744 \uc120\ud0dd\ud558\uc138\uc694 (\ud6a8\uc728\uc801\uc73c\ub85c \uc9d1\uae30).",
    "Press ESC if you want to cancel the drop operation (for example, to select a different item).": "\ub193\uae30 \uc870\uc791\uc744 \ucde8\uc18c\ud558\uace0 \uc2f6\ub2e4\uba74 ESC\ub97c \ub204\ub974\uc138\uc694 (\uc608\ub97c \ub4e4\uc5b4, \ub2e4\ub978 \ud56d\ubaa9\uc744  \uc120\ud0dd\ud558\uae30 \uc704\ud574).",
    "Problem": "\ubb38\uc81c",
    "Problem Weight": "\ubb38\uc81c \uc911\uc694\ub3c4",
    "Problem data": "\ubb38\uc81c \ub370\uc774\ud130",
    "Problem text": "\ubb38\uc81c \ud14d\uc2a4\ud2b8",
    "Provide custom image": "\uc0ac\uc6a9\uc790 \uc815\uc758 \uc774\ubbf8\uc9c0\ub97c \uc81c\uacf5\ud558\uae30",
    "Reset": "\ucd08\uae30\ud654",
    "Save": "\uc800\uc7a5",
    "Saving": "\uc800\uc7a5 \uc911",
    "Show \"Problem\" heading": "\"\ubb38\uc81c\"\uc758 \uc81c\ubaa9 \ubcf4\uc774\uae30",
    "Show Answer": "\uc815\ub2f5 \ubcf4\uae30",
    "Show title": "\uc81c\ubaa9 \ubcf4\uc774\uae30",
    "Size of a single zone in pixels.": "\ud53d\uc140 \ub2e8\uc704\uc758 \ub2e8\uc77c \uc601\uc5ed \ud06c\uae30",
    "Some of your answers were not correct.": "\uc77c\ubd80 \ub2f5\ubcc0\uc774 \uc62c\ubc14\ub974\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.",
    "Standard": "\ud45c\uc900",
    "Standard mode: the problem provides immediate feedback each time a learner drops an item on a target zone. Assessment mode: the problem provides feedback only after a learner drops all available items on target zones.": "\ud45c\uc900 \ubaa8\ub4dc: \ud559\uc2b5\uc790\uac00 \ubaa9\ud45c \uc601\uc5ed\uc5d0 \uac01 \ud56d\ubaa9\uc744 \ub193\uc744 \ub54c\ub9c8\ub2e4 \uc989\uac01\uc801\uc73c\ub85c \ud53c\ub4dc\ubc31\uc744 \uc81c\uacf5\ud569\ub2c8\ub2e4. \ud3c9\uac00 \ubaa8\ub4dc: \ud559\uc2b5\uc790\uac00 \ubaa8\ub4e0 \uc774\uc6a9\uac00\ub2a5\ud55c \ud56d\ubaa9\uc744 \ubaa9\ud45c \uc601\uc5ed\uc5d0 \ub193\uc558\uc744 \ub54c\ub9cc \ud53c\ub4dc\ubc31\uc744 \uc81c\uacf5\ud569\ub2c8\ub2e4.",
    "Submission deadline has passed.": "\uc81c\ucd9c \ub9c8\uac10\uc77c\uc774 \uc9c0\ub0ac\uc2b5\ub2c8\ub2e4.",
    "Submit": "\uc81c\ucd9c\ud558\uae30",
    "Submitting": "\uc81c\ucd9c \uc911",
    "TAB back to the list of draggable items and repeat this process until all of the draggable items have been placed on their respective dropzones.": "TAB\uc744 \ud558\uc5ec \ub04c\uae30 \uac00\ub2a5\ud55c \ud56d\ubaa9\uc758 \ubaa9\ub85d\uc73c\ub85c \ub3cc\uc544\uac00\uace0 \uc774 \uacfc\uc815\uc744 \ubaa8\ub4e0 \ub04c\uae30 \uac00\ub2a5\ud55c \ud56d\ubaa9\ub4e4\uc744 \uac01\uac01\uc758 \ub193\uae30 \uc601\uc5ed\uc73c\ub85c \uc62e\uae38 \ub54c\uae4c\uc9c0 \ubc18\ubcf5\ud558\uc138\uc694.",
    "Text color to use for draggable items (example: 'white' or '#ffffff').": "\ub04c\uae30 \uac00\ub2a5\ud55c \ud56d\ubaa9\uc758 \ud14d\uc2a4\ud2b8 \uc0c9\uc0c1 (\uc608\uc2dc: '\ud558\uc591' \ub610\ub294 '#ffffff').",
    "The Bottom Zone": "\ud558\ub2e8 \uc601\uc5ed",
    "The Middle Zone": "\uc911\ub2e8 \uc601\uc5ed",
    "The Top Zone": "\uc0c1\ub2e8 \uc601\uc5ed",
    "The background color of draggable items in the problem (example: 'blue' or '#0000ff').": "\ubb38\uc81c\uc758 \ub04c\uae30 \uac00\ub2a5\ud55c \ud56d\ubaa9\uc758 \ubc30\uacbd \uc0c9\uc0c1 (\uc608\uc2dc: '\ud30c\ub791' \ub610\ub294 '#0000ff').",
    "The description of the problem or instructions shown to the learner.": "\ud559\uc2b5\uc790\uc5d0\uac8c \ubcf4\uc5ec\uc9c0\ub294 \ubb38\uc81c \ub610\ub294 \uc9c0\uc2dc\uc0ac\ud56d\uc758 \ub0b4\uc6a9",
    "The title of the drag and drop problem. The title is displayed to learners.": "\ub04c\uc5b4\ub193\uae30 \ubb38\uc81c\uc758 \uc81c\ubaa9. \uc81c\ubaa9\uc740 \ud559\uc2b5\uc790\uc5d0\uac8c \uacf5\uac1c\ub429\ub2c8\ub2e4.",
    "There was an error with your form.": "\ud615\uc2dd\uc5d0 \uc624\ub958\uac00 \uc788\uc2b5\ub2c8\ub2e4.",
    "This is a screen reader-friendly problem.": "\uc774 \ubb38\uc81c\ub294 \ud654\uba74 \uc774\uc6a9\uc790\uc5d0\uac8c \uc801\ud569\ud55c \ubb38\uc81c\uc785\ub2c8\ub2e4.",
    "This setting limits the number of items that can be dropped into a single zone.": "\uc774 \uc124\uc815\uc740 \ud558\ub098\uc758 \uc601\uc5ed\uc5d0 \ub193\uc77c \uc218 \uc788\ub294 \ud56d\ubaa9\uc758 \ucd5c\ub300 \uac1c\uc218\ub97c \uc124\uc815 \ud569\ub2c8\ub2e4.",
    "Title": "\uc81c\ubaa9",
    "Unknown DnDv2 mode {mode} - course is misconfigured": "\uc54c \uc218 \uc5c6\ub294 DnDv2 \ubaa8\ub4dc {mode} - \uac15\uc758\uac00 \uc798\ubabb \uad6c\uc131\ub418\uc5b4\uc788\uc2b5\ub2c8\ub2e4.",
    "Unknown Zone": "\uc54c\uc218\uc5c6\ub294 \uc601\uc5ed",
    "Use only TAB and SHIFT+TAB to navigate between draggable items and drop zones.": "TAB \ub610\ub294 SHIFT+TAB\uc744 \uc0ac\uc6a9\ud558\uc5ec \ub04c\uae30 \uac00\ub2a5\ud55c \ud56d\ubaa9\uacfc \ub193\uae30 \uc601\uc5ed\uc744 \ub118\ub098\ub4dc\uc138\uc694.",
    "Use this zone to associate an item with the bottom layer of the triangle.": "\uc774 \uc601\uc5ed\uc744 \uc774\uc6a9\ud558\uc5ec \ud56d\ubaa9\uc744 \uc0bc\uac01\ud615\uc758 \ud558\ub2e8\uce35\uacfc \uc5f0\uacb0\ud558\uc138\uc694.",
    "Use this zone to associate an item with the middle layer of the triangle.": "\uc774 \uc601\uc5ed\uc744 \uc774\uc6a9\ud558\uc5ec \ud56d\ubaa9\uc744 \uc0bc\uac01\ud615\uc758 \uc911\ub2e8\uce35\uacfc \uc5f0\uacb0\ud558\uc138\uc694.",
    "Use this zone to associate an item with the top layer of the triangle.": "\uc774 \uc601\uc5ed\uc744 \uc774\uc6a9\ud558\uc5ec \ud56d\ubaa9\uc744 \uc0bc\uac01\ud615\uc758 \uc0c1\ub2e8\uce35\uacfc \uc5f0\uacb0\ud558\uc138\uc694.",
    "You can complete this problem using only your keyboard by following the guidance below:": "\ub2e4\uc74c \uac00\uc774\ub4dc\ub77c\uc778\uc744 \ub530\ub974\uba74 \ud0a4\ubcf4\ub4dc\ub9cc \uc0ac\uc6a9\ud574\uc11c \ubb38\uc81c\ub97c \ud574\uacb0\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4:",
    "You cannot add any more items to this zone.": "\uc774 \uc601\uc5ed\uc5d0\ub294 \ub354\uc774\uc0c1 \ud56d\ubaa9\uc744 \ucd94\uac00\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.",
    "You have used {used} of {total} attempts.": "\ub2f9\uc2e0\uc740 {total}\ubc88\uc758 \uc2dc\ub3c4 \uc911 {used}\ub9cc\ud07c \uc0ac\uc6a9\ud588\uc2b5\ub2c8\ub2e4.",
    "You silly, there are no zones for this one.": "\uc5b4\ub9ac\uc11d\ub124\uc694, \uc774\uac83\uc740 \uc5b4\ub290 \uc601\uc5ed\uc5d0\ub3c4 \uc18d\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.",
    "Your highest score is {score}": "\ucd5c\uace0 \uc810\uc218\ub294 {score} \uc785\ub2c8\ub2e4.",
    "Zone Layout": "\uc601\uc5ed \ub808\uc774\uc544\uc6c3",
    "Zone Size": "\uc601\uc5ed \ud06c\uae30",
    "Zone borders": "\uc601\uc5ed\uc758 \uacbd\uacc4",
    "Zone definitions": "\uc601\uc5ed \uc815\uc758",
    "Zone height": "\uc601\uc5ed \ub192\uc774",
    "Zone labels": "\uc601\uc5ed \ub808\uc774\ube14",
    "Zone width": "\uc601\uc5ed \ub108\ube44",
    "Zone {num}": [
      "{num}\ubc88 \uc601\uc5ed"
    ],
    "Zones": "\uc601\uc5ed",
    "do_attempt handler should only be called for assessment mode": "do_attempt \ud578\ub4e4\ub7ec\ub294 \ud3c9\uac00 \ubaa8\ub4dc\uc5d0\uc11c\ub9cc \uc0ac\uc6a9\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
    "droppable": "\ub193\uae30 \uac00\ub2a5\ud568",
    "show_answer handler should only be called for assessment mode": "show_answer \ud578\ub4e4\ub7ec\ub294 \ud3c9\uac00 \ubaa8\ub4dc\uc5d0\uc11c\ub9cc \uc0ac\uc6a9\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
    "{earned}/{possible} point (graded)": [
      "{earned}/{possible}\uc810 (\ucc44\uc810\ub428)"
    ],
    "{earned}/{possible} point (ungraded)": [
      "{earned}/{possible}\uc810 (\ubbf8\ucc44\uc810\ub428)"
    ],
    "{possible} point possible (graded)": [
      "{possible}\uc810 \uac00\ub2a5\ud568 (\ucc44\uc810\ub428)"
    ],
    "{possible} point possible (ungraded)": [
      "{possible}\uc810 \uac00\ub2a5\ud568 (\ubbf8\ucc44\uc810\ub428)"
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
    "DATETIME_FORMAT": "Y\ub144 n\uc6d4 j\uc77c g:i A",
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
      "%m/%d/%y",
      "%Y\ub144 %m\uc6d4 %d\uc77c %H\uc2dc %M\ubd84 %S\ucd08",
      "%Y\ub144 %m\uc6d4 %d\uc77c %H\uc2dc %M\ubd84"
    ],
    "DATE_FORMAT": "Y\ub144 n\uc6d4 j\uc77c",
    "DATE_INPUT_FORMATS": [
      "%Y-%m-%d",
      "%m/%d/%Y",
      "%m/%d/%y",
      "%Y\ub144 %m\uc6d4 %d\uc77c"
    ],
    "DECIMAL_SEPARATOR": ".",
    "FIRST_DAY_OF_WEEK": "0",
    "MONTH_DAY_FORMAT": "n\uc6d4 j\uc77c",
    "NUMBER_GROUPING": "3",
    "SHORT_DATETIME_FORMAT": "Y-n-j H:i",
    "SHORT_DATE_FORMAT": "Y-n-j.",
    "THOUSAND_SEPARATOR": ",",
    "TIME_FORMAT": "A g:i",
    "TIME_INPUT_FORMATS": [
      "%H:%M:%S",
      "%H:%M:%S.%f",
      "%H:%M",
      "%H\uc2dc %M\ubd84 %S\ucd08",
      "%H\uc2dc %M\ubd84"
    ],
    "YEAR_MONTH_FORMAT": "Y\ub144 n\uc6d4"
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
        