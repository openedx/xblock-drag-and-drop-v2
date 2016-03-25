Version 2.0.5 (2016-03-30)
--------------------------

* Marked strings for translations (PR #66)
* Added the ability to specify automatic alignment of dropped items. (PR #57)

Version 2.0.4 (2016-03-10)
--------------------------

* Add a placeholder text to the input field to set the item image. (PR #65)

Version 2.0.3 (2016-03-07)
--------------------------

* Bugfix: When omitting the background image description in Studio, the red halo
  indicating the field with the error did not show in Safari. (PR #62)
* Bugfix: Make short URLs of the form /static/... to uploaded images work
  correctly for item background images. (PR #63)

Version 2.0.2 (2016-02-18)
--------------------------

* Bugfix: "Background description" was required, but if you filled it out and pressed "Continue", "Save", it would accept the new description but would not actually save it. (PR #55)
* Bugfix: When configuring the draggable items, the "Image Description" was always required, even if the "Image URL" was blank. (PR #55)
* Bugfix: When clicking certain action links in the dndv2 editor (e.g. "Add a Zone"), the browser would scroll to the top of the page (since the href="#" event was not prevented). (PR #55)
* Bugfix: When changing tabs in the dndv2 editor, the next tab would often be scrolled down halfway. (PR #55)
* Bugfix: In Studio, Newly added drag and drop components did not load properly, due to [a Studio bug](https://github.com/edx/edx-platform/pull/11433) that affects Cypress and Dogwood. (Fixed in Studio post-Dogwood.) (PR #55)
* Fixed some flaky tests

Version 2.0.1 (2016-02-15)
--------------------------
* Bugfix: If zone labels are numbers, like "1", "2", etc., then the draggables would not match with that zone (you cannot drop the draggables onto that zone) (PR #54)
* Bugfix: If two zones had the same name/label, the block would not work properly. (PR #54)
* Bugfix: If the platform's locale is set to a language like "de" or "eo" that formats numbers like "3,14", then the "Maximum Score" field appears blank when editing a dndv2 exercise in Studio. Attempting to save the exercise with that field blank causes a 500. (PR #54)

Version 2.0.0 (2016-01-29)
------------------------

A brand new release of the Drag and Drop XBlock, featuring major UX improvements, new features, and accessibility enhancements.
