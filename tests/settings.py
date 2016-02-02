SECRET_KEY="notagoodsecretkey"

# grabbed from tests/settings.py removed from
# https://github.com/open-craft/xblock-drag-and-drop-v2/commit/d1e4d124f068be84d6d513d9699bb54114e39fe5
DEBUG = True

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'workbench',
    'sample_xblocks.basic',
    'django_nose',
)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'drag_and_drop_v2.db'
    }
}

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'
    }
}

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.eggs.Loader',
)

#JV FIXME ROOT_URLCONF = 'urls'
ROOT_URLCONF = 'tests.urls'

TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'

STATIC_ROOT = ''
STATIC_URL = '/static/'
 
WORKBENCH = {'reset_state_on_restart': False}
