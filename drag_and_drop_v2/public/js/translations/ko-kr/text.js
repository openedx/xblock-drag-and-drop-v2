
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
    "\n                            Please provide a description of the image for non-visual users.\n                            The description should provide sufficient information to allow anyone\n                            to solve the problem even without seeing the image.\n                        ": "\n                             \uc2dc\uac01 \uc7a5\uc560\uac00 \uc788\ub294 \uc0ac\uc6a9\uc790\ub97c \uc704\ud574 \uc774\ubbf8\uc9c0 \uc124\uba85\uc744 \uc81c\uacf5\ud574 \uc8fc\uc2dc\uae30 \ubc14\ub78d\ub2c8\ub2e4.\n                             \uc124\uba85\uc5d0\ub294 \ub204\uad6c\ub098 \uc774\ubbf8\uc9c0\ub97c \ubcf4\uc9c0 \uc54a\uace0\ub3c4 \ubb38\uc81c\ub97c \ud480 \uc218 \uc788\uc744 \uc815\ub3c4\ub85c\n                             \ucda9\ubd84\ud55c \uc815\ubcf4\uac00 \ub2f4\uaca8 \uc788\uc5b4\uc57c \ud569\ub2c8\ub2e4.\n                        ", 
    "\"Maximum items per zone\" should be positive integer, got {max_items_per_zone}": "\"\uc601\uc5ed\ub2f9 \ucd5c\ub300 \uc544\uc774\ud15c \uc218\"\ub294 \uc591\uc758 \uc815\uc218\uc5ec\uc57c \ud568, {max_items_per_zone} \ubc1b\uc74c", 
    ", draggable": ", \ub4dc\ub798\uadf8\ud560 \uc218 \uc788\uc74c", 
    ", draggable, grabbed": ", \ub4dc\ub798\uadf8\ud560 \uc218 \uc788\uc74c, \uc7a1\uc74c", 
    ", dropzone": ", \ub4dc\ub86d \uc601\uc5ed", 
    "Actions": "\uc791\uc5c5", 
    "Add a zone": "\uc601\uc5ed \ucd94\uac00", 
    "Add an item": "\uc544\uc774\ud15c \ucd94\uac00", 
    "Align dropped items to the left, center, or right.": "\ub4dc\ub86d\ud55c \uc544\uc774\ud15c\uc744 \uc67c\ucabd, \uc911\uc559 \ub610\ub294 \uc624\ub978\ucabd\uc73c\ub85c \uc815\ub82c\ud569\ub2c8\ub2e4.", 
    "Alignment": "\uc815\ub82c", 
    "An error occurred. Unable to load drag and drop problem.": "\uc624\ub958\uac00 \ubc1c\uc0dd\ud588\uc2b5\ub2c8\ub2e4. \ub4dc\ub798\uadf8 \uc564 \ub4dc\ub86d \ubb38\uc81c\ub97c \ub85c\ub4dc\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.", 
    "An isosceles triangle with three layers of similar height. It is shown upright, so the widest layer is located at the bottom, and the narrowest layer is located at the top.": "\ub192\uc774\uac00 \ube44\uc2b7\ud55c 3\uac1c\uc758 \ub808\uc774\uc5b4\ub85c \uad6c\uc131\ub41c \uc774\ub4f1\ubcc0 \uc0bc\uac01\ud615\uc785\ub2c8\ub2e4. \uc218\uc9c1\uc73c\ub85c \uc138\uc6cc\uc838 \uc788\uc73c\ubbc0\ub85c \uac00\uc7a5 \ub113\uc740 \ub808\uc774\uc5b4\uac00 \ud558\ub2e8\uc5d0 \uc704\uce58\ud558\uace0 \uac00\uc7a5 \uc881\uc740 \ub808\uc774\uc5b4\uac00 \uc0c1\ub2e8\uc5d0 \uc704\uce58\ud569\ub2c8\ub2e4.", 
    "Assessment": "\ud3c9\uac00", 
    "Background URL": "\ubc30\uacbd URL", 
    "Background description": "\ubc30\uacbd \uc124\uba85", 
    "Cancel": "\ucde8\uc18c", 
    "Change background": "\ubc30\uacbd \ubcc0\uacbd", 
    "Close": "\ub2eb\uae30", 
    "Continue": "\uacc4\uc18d", 
    "Correct! This one belongs to {zone}.": "\ub9de\uc2b5\ub2c8\ub2e4! \uc774 \uc544\uc774\ud15c\uc740 {zone}\uc5d0 \uc18d\ud569\ub2c8\ub2e4.", 
    "Correctly placed in: {zone_title}": "\uc62c\ubc14\ub974\uac8c \ubc30\uce58\ub41c \uc704\uce58: {zone_title}", 
    "Correctly placed {correct_count} item.": [
      "{correct_count}\uac1c\uc758 \uc544\uc774\ud15c\uc744 \uc62c\ubc14\ub974\uac8c \ubc30\uce58\ud588\uc2b5\ub2c8\ub2e4.", 
      "{correct_count}\uac1c\uc758 \uc544\uc774\ud15c\uc744 \uc62c\ubc14\ub974\uac8c \ubc30\uce58\ud588\uc2b5\ub2c8\ub2e4."
    ], 
    "Defines the number of points the problem is worth.": "\ubb38\uc81c\uc5d0 \ubd80\uc5ec\ub418\ub294 \uc810\uc218\ub97c \uc815\uc758\ud569\ub2c8\ub2e4.", 
    "Defines the number of times a student can try to answer this problem. If the value is not set, infinite attempts are allowed.": "\ud559\uc0dd\uc774 \uc774 \ubb38\uc81c\uc5d0 \ub2f5\ud560 \uc218 \uc788\ub294 \ud69f\uc218\ub97c \uc815\uc758\ud569\ub2c8\ub2e4. \uac12\uc774 \uc124\uc815\ub418\uc9c0 \uc54a\uc73c\uba74 \ub2f5 \uc81c\ucd9c\uc744 \ubb34\uc81c\ud55c\uc73c\ub85c \uc2dc\ub3c4\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.", 
    "Describe this zone to non-visual users.": "\uc774 \uc601\uc5ed\uc744 \uc2dc\uac01 \uc7a5\uc560\uac00 \uc788\ub294 \uc0ac\uc6a9\uc790\uc5d0\uac8c \uc124\uba85\ud569\ub2c8\ub2e4.", 
    "Description": "\uc124\uba85", 
    "Did not place {missing_count} required item.": [
      "\ud544\uc218 \uc544\uc774\ud15c {missing_count}\uac1c\ub97c \ubc30\uce58\ud558\uc9c0 \uc54a\uc558\uc2b5\ub2c8\ub2e4.", 
      "\ud544\uc218 \uc544\uc774\ud15c {missing_count}\uac1c\ub97c \ubc30\uce58\ud558\uc9c0 \uc54a\uc558\uc2b5\ub2c8\ub2e4."
    ], 
    "Display label names on the image": "\uc774\ubbf8\uc9c0\uc5d0 \ub77c\ubca8 \uc774\ub984 \ud45c\uc2dc", 
    "Display the heading \"Problem\" above the problem text?": "\ubb38\uc81c \ud14d\uc2a4\ud2b8 \uc704\uc5d0 \u201c\ubb38\uc81c\u201d \ud45c\uc81c\uc5b4\ub97c \ud45c\uc2dc\ud560\uae4c\uc694?", 
    "Display the title to the learner?": "\uc81c\ubaa9\uc744 \uc218\uac15\uc790\uc5d0\uac8c \ud45c\uc2dc\ud560\uae4c\uc694?", 
    "Display zone borders on the image": "\uc774\ubbf8\uc9c0\uc5d0 \uc601\uc5ed \ud14c\ub450\ub9ac \ud45c\uc2dc", 
    "Drag and Drop": "\ub4dc\ub798\uadf8 \uc564 \ub4dc\ub86d", 
    "Drag and Drop Problem": "\ub4dc\ub798\uadf8 \uc564 \ub4dc\ub86d \ubb38\uc81c", 
    "Drag and Drop problems consist of draggable items and dropzones. Users should select a draggable item with their keyboard and then navigate to an appropriate dropzone to drop it.": "\ub4dc\ub798\uadf8 \uc564 \ub4dc\ub86d \ubb38\uc81c\ub294 \ub4dc\ub798\uadf8\ud560 \uc218 \uc788\ub294 \uc544\uc774\ud15c\uacfc \ub4dc\ub86d \uc601\uc5ed\uc73c\ub85c \uad6c\uc131\ub429\ub2c8\ub2e4. \uc0ac\uc6a9\uc790\ub294 \ub4dc\ub798\uadf8\ud560 \uc218 \uc788\ub294 \uc544\uc774\ud15c\uc744 \ud0a4\ubcf4\ub4dc\ub85c \uc120\ud0dd\ud55c \ub2e4\uc74c \uc801\ud569\ud55c \ub4dc\ub86d \uc601\uc5ed\uc73c\ub85c \uc774\ub3d9\ud558\uc5ec \ub4dc\ub86d\ud574\uc57c \ud569\ub2c8\ub2e4.", 
    "Drag the items onto the image above.": "\uc544\uc774\ud15c\uc744 \uc704 \uc774\ubbf8\uc9c0\ub85c \ub4dc\ub798\uadf8\ud558\uc2ed\uc2dc\uc624.", 
    "Drop Targets": "\ub4dc\ub86d \ub300\uc0c1", 
    "Error feedback": "\uc624\ub958 \ud53c\ub4dc\ubc31", 
    "Failed to parse \"Maximum items per zone\"": "\u201c\uc601\uc5ed\ub2f9 \ucd5c\ub300 \uc544\uc774\ud15c \uc218\u201d\ub97c \uad6c\ubb38 \ubd84\uc11d\ud558\ub294 \ub370 \uc2e4\ud328\ud568", 
    "Feedback": "\ud53c\ub4dc\ubc31", 
    "Final attempt was used, highest score is {score}": "\ucd5c\uc885 \uc2dc\ub3c4\ub97c \uc0ac\uc6a9\ud588\uc73c\uba70 \ucd5c\uace0 \uc810\uc218\ub294 {score}\uc785\ub2c8\ub2e4.", 
    "Final feedback": "\ucd5c\uc885 \ud53c\ub4dc\ubc31", 
    "For example, 'http://example.com/background.png' or '/static/background.png'.": "\uc608\ub97c \ub4e4\uc5b4, 'http://example.com/background.png' \ub610\ub294 '/static/background.png'\uc785\ub2c8\ub2e4.", 
    "For example, 'http://example.com/image.png' or '/static/image.png'.": "\uc608\ub97c \ub4e4\uc5b4, 'http://example.com/image.png' \ub610\ub294 '/static/image.png'\uc785\ub2c8\ub2e4.", 
    "Go to Beginning": "\uc2dc\uc791\uc73c\ub85c \uc774\ub3d9", 
    "Goes anywhere": "\uc5b4\ub290 \uacf3\uc5d0\ub4e0 \uc704\uce58", 
    "Goes to the bottom": "\ud558\ub2e8\uc73c\ub85c \uc774\ub3d9", 
    "Goes to the middle": "\uc911\uac04\uc73c\ub85c \uc774\ub3d9", 
    "Goes to the top": "\uc0c1\ub2e8\uc73c\ub85c \uc774\ub3d9", 
    "Good work! You have completed this drag and drop problem.": "\uc798 \ud558\uc168\uc2b5\ub2c8\ub2e4! \uc774 \ub4dc\ub798\uadf8 \uc564 \ub4dc\ub86d \ubb38\uc81c\ub97c \ub9c8\uce58\uc168\uc2b5\ub2c8\ub2e4.", 
    "Hide Answer": "\uc815\ub2f5 \uc228\uae40", 
    "Hints:": "\ud78c\ud2b8:", 
    "I don't belong anywhere": "\uc5b4\ub514\uc5d0\ub3c4 \uc18d\ud558\uc9c0 \uc54a\uc74c", 
    "Image URL (alternative to the text)": "\uc774\ubbf8\uc9c0 URL(\ud14d\uc2a4\ud2b8 \ub300\uccb4)", 
    "Image description (should provide sufficient information to place the item even if the image did not load)": "\uc774\ubbf8\uc9c0 \uc124\uba85(\uc774\ubbf8\uc9c0\uac00 \ub85c\ub529\ub418\uc9c0 \uc54a\uc740 \uacbd\uc6b0\uc5d0\ub3c4 \uc544\uc774\ud15c\uc744 \ubc30\uce58\ud558\uae30\uc5d0 \ucda9\ubd84\ud55c \uc815\ubcf4\uac00 \ub2f4\uaca8 \uc788\uc5b4\uc57c \ud568)", 
    "Indicates whether a learner has completed the problem at least once": "\uc218\uac15\uc790\uac00 \ud55c \ubc88 \uc774\uc0c1 \uc644\ub8cc\ud55c \ubb38\uc81c\uc778\uc9c0 \uc5ec\ubd80\ub97c \ub098\ud0c0\ub0c4", 
    "Information about current positions of items that a learner has dropped on the target image.": "\uc218\uac15\uc790\uac00 \ub300\uc0c1 \uc774\ubbf8\uc9c0\uc5d0 \ub4dc\ub86d\ud55c \uc544\uc774\ud15c\uc758 \ud604\uc7ac \uc704\uce58\uc5d0 \ub300\ud55c \uc815\ubcf4\uc785\ub2c8\ub2e4.", 
    "Information about zones, items, feedback, and background image for this problem. This information is derived from the input that a course author provides via the interactive editor when configuring the problem.": "\uc774 \ubb38\uc81c\uc758 \uc601\uc5ed, \uc544\uc774\ud15c, \ud53c\ub4dc\ubc31 \ubc0f \ubc30\uacbd \uc774\ubbf8\uc9c0\uc5d0 \ub300\ud55c \uc815\ubcf4\uc785\ub2c8\ub2e4. \uc774 \uc815\ubcf4\ub294 \uac15\uc758 \uc81c\uc791\uc790\uac00 \ubb38\uc81c\ub97c \uad6c\uc131\ud560 \ub54c \ub300\ud654\ud615 \ud3b8\uc9d1\uae30\ub97c \ud1b5\ud574 \uc81c\uacf5\ud558\ub294 \uc0ac\ud56d\uc744 \ud1a0\ub300\ub85c \ud55c \uac83\uc785\ub2c8\ub2e4.", 
    "Introductory feedback": "\uc785\ubb38 \ud53c\ub4dc\ubc31", 
    "Item Bank": "\uc544\uc774\ud15c \uc740\ud589", 
    "Item background color": "\uc544\uc774\ud15c \ubc30\uacbd\uc0c9", 
    "Item text color": "\uc544\uc774\ud15c \ud14d\uc2a4\ud2b8 \uc0c9", 
    "Items": "\uc544\uc774\ud15c", 
    "Keeps maximum score achieved by student": "\ud559\uc0dd\uc774 \ucde8\ub4dd\ud55c \ucd5c\ub300 \uc810\uc218 \uc720\uc9c0", 
    "Keyboard Help": "\ud0a4\ubcf4\ub4dc \ub3c4\uc6c0\ub9d0", 
    "Loading drag and drop problem.": "\ub4dc\ub798\uadf8 \uc564 \ub4dc\ub86d \ubb38\uc81c\ub97c \ub85c\ub4dc\ud558\ub294 \uc911\uc785\ub2c8\ub2e4.", 
    "Max number of attempts reached": "\ucd5c\ub300 \uc2dc\ub3c4 \ud69f\uc218 \ub3c4\ub2ec", 
    "Maximum attempts": "\ucd5c\ub300 \uc2dc\ub3c4 \uc218", 
    "Misplaced {misplaced_count} item.": [
      "{misplaced_count}\uac1c\uc758 \uc544\uc774\ud15c\uc744 \uc798\ubabb \ubc30\uce58\ud588\uc2b5\ub2c8\ub2e4.", 
      "{misplaced_count}\uac1c\uc758 \uc544\uc774\ud15c\uc744 \uc798\ubabb \ubc30\uce58\ud588\uc2b5\ub2c8\ub2e4."
    ], 
    "Misplaced {misplaced_count} item. Misplaced item was returned to item bank.": [
      "{misplaced_count}\uac1c\uc758 \uc544\uc774\ud15c\uc744 \uc798\ubabb \ubc30\uce58\ud588\uc2b5\ub2c8\ub2e4. \uc798\ubabb \ubc30\uce58\ub41c \uc544\uc774\ud15c\uc740 \uc544\uc774\ud15c \uc740\ud589\uc73c\ub85c \ubcf5\uadc0\ub418\uc5c8\uc2b5\ub2c8\ub2e4.", 
      "{misplaced_count}\uac1c\uc758 \uc544\uc774\ud15c\uc744 \uc798\ubabb \ubc30\uce58\ud588\uc2b5\ub2c8\ub2e4. \uc798\ubabb \ubc30\uce58\ub41c \uc544\uc774\ud15c\uc740 \uc544\uc774\ud15c \uc740\ud589\uc73c\ub85c \ubcf5\uadc0\ub418\uc5c8\uc2b5\ub2c8\ub2e4."
    ], 
    "Mode": "\ubaa8\ub4dc", 
    "Navigate using TAB and SHIFT+TAB to the appropriate dropzone and press CTRL+M once more to drop it here.": "TAB \ubc0f SHIFT+TAB\uc744 \uc0ac\uc6a9\ud558\uc5ec \uc801\uc808\ud55c \ub4dc\ub86d \uc601\uc5ed\uc73c\ub85c \uc774\ub3d9\ud55c \ub2e4\uc74c CTRL+M\uc744 \ud55c \ubc88 \ub354 \ub20c\ub7ec \ub4dc\ub86d\ud558\uc2ed\uc2dc\uc624.", 
    "No, this item does not belong here. Try again.": "\uc544\ub2c8\uc694, \uc774 \uc544\uc774\ud15c\uc740 \uc5ec\uae30\uc5d0 \uc18d\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4. \ub2e4\uc2dc \uc2dc\ub3c4\ud558\uc2ed\uc2dc\uc624.", 
    "None": "\uc5c6\uc74c", 
    "Note: do not edit the problem if students have already completed it. Delete the problem and create a new one.": "\ucc38\uace0: \ud559\uc0dd\uc774 \uc774\ubbf8 \ubb38\uc81c\ub97c \uc644\ub8cc\ud55c \uacbd\uc6b0 \ud574\ub2f9 \ubb38\uc81c\ub97c \ud3b8\uc9d1\ud558\uc9c0 \ub9c8\uc2ed\uc2dc\uc624. \ubb38\uc81c\ub97c \uc0ad\uc81c\ud558\uace0 \uc0c8\ub85c\uc6b4 \ubb38\uc81c\ub97c \ub9cc\ub4dc\uc2ed\uc2dc\uc624.", 
    "Number of attempts learner used": "\ud559\uc2b5\uc790\uac00 \uc0ac\uc6a9\ud55c \uc2dc\ub3c4 \ud69f\uc218", 
    "Of course it goes here! It goes anywhere!": "\uc774\uacf3\uc744 \ube44\ub86f\ud55c \uc5b4\ub290 \uacf3\uc5d0\ub4e0 \uc704\uce58\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.", 
    "Placed in: {zone_title}": "\ubc30\uce58 \uc704\uce58: {zone_title}", 
    "Please check over your submission.": "\uc81c\ucd9c \ub2f5\ubcc0\uc744 \ub2e4\uc2dc \ud655\uc778\ud558\uc2dc\uae30 \ubc14\ub78d\ub2c8\ub2e4.", 
    "Preferred width": "\uae30\ubcf8 \ub108\ube44", 
    "Press CTRL+M to select a draggable item (effectively picking it up).": "CTRL+M\uc744 \ub20c\ub7ec \ub4dc\ub798\uadf8\ud560 \uc218 \uc788\ub294 \uc544\uc774\ud15c\uc744 \uc120\ud0dd\ud558\uc2ed\uc2dc\uc624(\uc2e4\uc9c8\uc801\uc73c\ub85c\ub294 \uc9d1\uc5b4\uc62c\ub9bc).", 
    "Press ESC if you want to cancel the drop operation (for example, to select a different item).": "\ub4dc\ub86d \uc791\uc5c5\uc744 \ucde8\uc18c\ud558\uace0 \uc2f6\uc740 \uacbd\uc6b0(\uc608\ub97c \ub4e4\uc5b4, \ub2e4\ub978 \uc544\uc774\ud15c\uc744 \uc120\ud0dd\ud558\ub824\ub294 \uacbd\uc6b0) ESC\ub97c \ub204\ub974\uc2ed\uc2dc\uc624.", 
    "Problem": "\ubb38\uc81c", 
    "Problem Weight": "\ubb38\uc81c \ubc30\uc810", 
    "Problem data": "\ubb38\uc81c \ub370\uc774\ud130", 
    "Problem text": "\ubb38\uc81c \ud14d\uc2a4\ud2b8", 
    "Remove item": "\uc544\uc774\ud15c \uc81c\uac70", 
    "Remove zone": "\uc601\uc5ed \uc81c\uac70", 
    "Reset": "\uc7ac\uc124\uc815", 
    "Save": "\uc800\uc7a5", 
    "Show \"Problem\" heading": "\u201c\ubb38\uc81c\u201d \ud45c\uc81c\uc5b4 \ud45c\uc2dc", 
    "Show Answer": "\uc815\ub2f5 \ud45c\uc2dc", 
    "Show advanced settings": "\uace0\uae09 \uc124\uc815 \ud45c\uc2dc", 
    "Show title": "\uc81c\ubaa9 \ud45c\uc2dc", 
    "Some of your answers were not correct.": "\ub2f5\ubcc0 \uc911 \uc77c\ubd80\uac00 \uc815\ub2f5\uc774 \uc544\ub2d9\ub2c8\ub2e4.", 
    "Specify preferred width as percentage of the background image width. Leave blank for automatic width.": "\ubc30\uacbd \uc774\ubbf8\uc9c0 \ub108\ube44 \ub300\ube44 \ubc31\ubd84\uc728\ub85c \uae30\ubcf8 \ub108\ube44\ub97c \uc9c0\uc815\ud558\uc2ed\uc2dc\uc624. \uc790\ub3d9 \ub108\ube44\ub294 \uacf5\ubc31\uc73c\ub85c \ub0a8\uaca8 \ub450\uc2ed\uc2dc\uc624.", 
    "Standard": "\ud45c\uc900", 
    "Standard mode: the problem provides immediate feedback each time a learner drops an item on a target zone. Assessment mode: the problem provides feedback only after a learner drops all available items on target zones.": "\ud45c\uc900 \ubaa8\ub4dc: \uc218\uac15\uc790\uac00 \uc544\uc774\ud15c\uc744 \ub300\uc0c1 \uc601\uc5ed\uc5d0 \ub4dc\ub86d\ud560 \ub54c\ub9c8\ub2e4 \ubb38\uc81c\uc5d0\uc11c \uc989\uc2dc \ud328\ub4dc\ubc31\uc744 \uc81c\uacf5\ud569\ub2c8\ub2e4. \ud3c9\uac00 \ubaa8\ub4dc: \uc218\uac15\uc790\uac00 \uc81c\uacf5\ub418\ub294 \ubaa8\ub4e0 \uc544\uc774\ud15c\uc744 \ub300\uc0c1 \uc601\uc5ed\uc5d0 \ub4dc\ub86d\ud55c \ud6c4\uc5d0\ub9cc \ubb38\uc81c\uc5d0\uc11c \ud53c\ub4dc\ubc31\uc744 \uc81c\uacf5\ud569\ub2c8\ub2e4.", 
    "Submit": "\uc81c\ucd9c", 
    "Submitting": "\uc81c\ucd9c \uc911", 
    "Success feedback": "\uc131\uacf5 \ud53c\ub4dc\ubc31", 
    "TAB back to the list of draggable items and repeat this process until all of the draggable items have been placed on their respective dropzones.": "TAB\uc744 \ub20c\ub7ec \ub4dc\ub798\uadf8\ud560 \uc218 \uc788\ub294 \uc544\uc774\ud15c \ubaa9\ub85d\uc73c\ub85c \ub3cc\uc544\uac00 \ub4dc\ub798\uadf8\ud560 \uc218 \uc788\ub294 \ubaa8\ub4e0 \uc544\uc774\ud15c\uc774 \uac01\uac01\uc758 \ub4dc\ub86d \uc601\uc5ed\uc5d0 \ubc30\uce58\ub420 \ub54c\uae4c\uc9c0 \uc774 \uacfc\uc815\uc744 \ubc18\ubcf5\ud558\uc2ed\uc2dc\uc624.", 
    "Text": "\ud14d\uc2a4\ud2b8", 
    "Text color to use for draggable items (example: 'white' or '#ffffff').": "\ub4dc\ub798\uadf8\ud560 \uc218 \uc788\ub294 \uc544\uc774\ud15c\uc5d0 \uc0ac\uc6a9\ub418\ub294 \ud14d\uc2a4\ud2b8 \uc0c9\uc0c1(\uc608: '\ud770\uc0c9' \ub610\ub294 '#ffffff')\uc785\ub2c8\ub2e4.", 
    "The Bottom Zone": "\ud558\ub2e8 \uc601\uc5ed", 
    "The Middle Zone": "\uc911\uac04 \uc601\uc5ed", 
    "The Top Zone": "\uc0c1\ub2e8 \uc601\uc5ed", 
    "The background color of draggable items in the problem (example: 'blue' or '#0000ff').": "\ubb38\uc81c\uc5d0\uc11c \ub4dc\ub798\uadf8\ud560 \uc218 \uc788\ub294 \uc544\uc774\ud15c\uc758 \ubc30\uacbd \uc0c9\uc0c1(\uc608: '\ud30c\ub780\uc0c9' \ub610\ub294 '#0000ff\u2019)\uc785\ub2c8\ub2e4.", 
    "The description of the problem or instructions shown to the learner.": "\uc218\uac15\uc790\uc5d0\uac8c \ud45c\uc2dc\ub418\ub294 \ubb38\uc81c\uc5d0 \ub300\ud55c \uc124\uba85 \ub610\ub294 \uc9c0\uce68\uc785\ub2c8\ub2e4.", 
    "The title of the drag and drop problem. The title is displayed to learners.": "\ub4dc\ub798\uadf8 \uc564 \ub4dc\ub86d \ubb38\uc81c\uc758 \uc81c\ubaa9. \uc81c\ubaa9\uc740 \uc218\uac15\uc790\uc5d0\uac8c \ud45c\uc2dc\ub429\ub2c8\ub2e4.", 
    "There are attempts remaining": "\uc2dc\ub3c4 \ud69f\uc218 \ub0a8\uc74c", 
    "There was an error with your form.": "\ud615\uc2dd\uc5d0 \uc624\ub958\uac00 \uc788\uc2b5\ub2c8\ub2e4.", 
    "This is a screen reader-friendly problem": "\ud654\uba74 \ud310\ub3c5\uae30\uac00 \uc9c0\uc6d0\ub418\ub294 \ubb38\uc81c\uc784", 
    "This setting limits the number of items that can be dropped into a single zone.": "\uc774 \uc124\uc815\uc740 \ud558\ub098\uc758 \uc601\uc5ed\uc5d0 \ub4dc\ub86d\ud560 \uc218 \uc788\ub294 \uc544\uc774\ud15c\uc758 \uc218\ub97c \uc81c\ud55c\ud569\ub2c8\ub2e4.", 
    "Title": "\uc81c\ubaa9", 
    "Unknown DnDv2 mode {mode} - course is misconfigured": "\uc54c\ub824\uc9c0\uc9c0 \uc54a\uc740 DnDv2 \ubaa8\ub4dc {mode} - \uac15\uc758\uac00 \uc798\ubabb \uad6c\uc131\ub428", 
    "Use only TAB and SHIFT+TAB to navigate between draggable items and drop zones.": "TAB \ubc0f SHIFT+TAB\ub9cc \uc0ac\uc6a9\ud558\uc5ec \ub4dc\ub798\uadf8\ud560 \uc218 \uc788\ub294 \uc544\uc774\ud15c\uacfc \ub4dc\ub86d \uc601\uc5ed \uc0ac\uc774\ub97c \uc774\ub3d9\ud558\uc2ed\uc2dc\uc624.", 
    "Use text that is clear and descriptive of the item to be placed.": "\ubc30\uce58\ud560 \uc544\uc774\ud15c\uc744 \ubd84\uba85\ud558\uace0 \uad6c\uccb4\uc801\uc73c\ub85c \uc124\uba85\ud558\ub294 \ud14d\uc2a4\ud2b8\ub97c \uc0ac\uc6a9\ud558\uc2ed\uc2dc\uc624.", 
    "Use this zone to associate an item with the bottom layer of the triangle.": "\uc774 \uc601\uc5ed\uc744 \uc0ac\uc6a9\ud558\uc5ec \uc544\uc774\ud15c\uc744 \uc0bc\uac01\ud615\uc758 \ud558\ub2e8 \ub808\uc774\uc5b4\uc640 \uc5f0\uacb0\ud569\ub2c8\ub2e4.", 
    "Use this zone to associate an item with the middle layer of the triangle.": "\uc774 \uc601\uc5ed\uc744 \uc0ac\uc6a9\ud558\uc5ec \uc544\uc774\ud15c\uc744 \uc0bc\uac01\ud615\uc758 \uc911\uac04 \ub808\uc774\uc5b4\uc640 \uc5f0\uacb0\ud569\ub2c8\ub2e4.", 
    "Use this zone to associate an item with the top layer of the triangle.": "\uc774 \uc601\uc5ed\uc744 \uc0ac\uc6a9\ud558\uc5ec \uc544\uc774\ud15c\uc744 \uc0bc\uac01\ud615\uc758 \uc0c1\ub2e8 \ub808\uc774\uc5b4\uc640 \uc5f0\uacb0\ud569\ub2c8\ub2e4.", 
    "You can complete this problem using only your keyboard by following the guidance below:": "\uc774 \ubb38\uc81c\ub294 \uc544\ub798 \uc9c0\uce68\uc5d0 \ub530\ub77c \ud0a4\ubcf4\ub4dc\ub9cc \uc0ac\uc6a9\ud558\uc5ec \uc644\ub8cc\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.", 
    "You have used {used} of {total} attempts.": "\ucd1d {total}\ubc88\uc758 \uc2dc\ub3c4 \ud69f\uc218 \uc911 {used}\ubc88\uc744 \uc0ac\uc6a9\ud558\uc168\uc2b5\ub2c8\ub2e4.", 
    "You silly, there are no zones for this one.": "\uc774 \uc544\uc774\ud15c\uc744 \uc704\ud55c \uc601\uc5ed\uc740 \uc5c6\uc2b5\ub2c8\ub2e4.", 
    "Your highest score is {score}": "\uadc0\ud558\uc758 \ucd5c\uace0 \uc810\uc218\ub294 {score}\uc810\uc785\ub2c8\ub2e4.", 
    "Zone": "\uc601\uc5ed", 
    "Zone borders": "\uc601\uc5ed \ud14c\ub450\ub9ac", 
    "Zone definitions": "\uc601\uc5ed \uc815\uc758", 
    "Zone labels": "\uc601\uc5ed \ub77c\ubca8", 
    "Zones": "\uc601\uc5ed", 
    "center": "\uc911\uc559", 
    "do_attempt handler should only be called for assessment mode": "do_attempt \ud578\ub4e4\ub7ec\ub294 \ud3c9\uac00 \ubaa8\ub4dc\uc5d0\uc11c\ub9cc \ud638\ucd9c\ub418\uc5b4\uc57c \ud568", 
    "height": "\ub192\uc774", 
    "left": "\uc67c\ucabd", 
    "none": "\uc5c6\uc74c", 
    "ok": "\ud655\uc778", 
    "right": "\uc624\ub978\ucabd", 
    "show_answer handler should only be called for assessment mode": "show_answer \ud578\ub4e4\ub7ec\ub294 \ud3c9\uac00 \ubaa8\ub4dc\uc5d0\uc11c\ub9cc \ud638\ucd9c\ub418\uc5b4\uc57c \ud568", 
    "width": "\ub108\ube44", 
    "{earned}/{possible} point (graded)": [
      "{possible}\uc810 \uc911 {earned}\uc810 \ud68d\ub4dd(\ucc44\uc810 \uc644\ub8cc)", 
      "{{possible}\uc810 \uc911 {earned}\uc810 \ud68d\ub4dd(\ucc44\uc810 \uc644\ub8cc)"
    ], 
    "{earned}/{possible} point (ungraded)": [
      "{possible}\uc810 \uc911 {earned}\uc810 \ud68d\ub4dd(\ucc44\uc810 \ubbf8\uc644\ub8cc)", 
      "{possible}\uc810 \uc911 {earned}\uc810 \ud68d\ub4dd(\ucc44\uc810 \ubbf8\uc644\ub8cc)"
    ], 
    "{possible} point possible (graded)": [
      "{possible}\uc810 \ub9cc\uc810(\ucc44\uc810 \uc644\ub8cc)", 
      "{possible}\uc810 \ub9cc\uc810(\ucc44\uc810 \uc644\ub8cc)"
    ], 
    "{possible} point possible (ungraded)": [
      "{possible}\uc810 \ub9cc\uc810(\ucc44\uc810 \ubbf8\uc644\ub8cc)", 
      "{possible}\uc810 \ub9cc\uc810(\ucc44\uc810 \ubbf8\uc644\ub8cc)"
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
        