# Drag and Drop XBlock v2

This XBlock implements a friendly drag-and-drop style question, where the student has to drag items on zones on a target image.

The editor is fully guided. Features include:

* custom target image
* free target zone positioning and sizing
* custom size items
* image items
* decoy items that don't have a zone
* feedback popups for both correct and incorrect attempts
* introductory and final feedback

It supports progressive grading and keeps progress across refreshes.

All checking and record keeping is done at server side.

## Installing

Just run

```
$ pip install -e .
```

from the XBlock folder and add `drag-and-drop-v2` to your Advanced Module List.

## Testing

1. In a virtualenv, run

```bash
$ (cd .../xblock-sdk/; pip install -r requirements.txt)
$ (cd .../xblock-drag-and-drop-v2/; pip install -r tests/requirements.txt)
```

2. In the xblock-sdk repository, create the following configuration file in `workbench/settings_drag_and_drop_v2.py`

```python
from settings import *

INSTALLED_APPS += ('drag_and_drop_v2',)
DATABASES['default']['NAME'] = 'workbench.db'
```

3. Run this to sync the database before starting the workbench (answering no to the superuser question is ok):

```bash
$ .../xblock-sdk/manage.py syncdb --settings=workbench.settings_drag_and_drop_v2
```

4. To run the tests, from the xblock-drag-and-drop-v2 repository root:

```bash
$ DJANGO_SETTINGS_MODULE="workbench.settings_drag_and_drop_v2" nosetests --rednose --verbose --with-cover --cover-package=drag_and_drop_v2
```
