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

ROOT_URLCONF = 'urls'

TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'

STATIC_ROOT = ''
STATIC_URL = '/static/'

WORKBENCH = {'reset_state_on_restart': False}
