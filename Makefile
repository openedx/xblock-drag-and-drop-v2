.PHONY: clean compile_translations dummy_translations \
	extract_translations fake_translations help

.DEFAULT_GOAL := help

JS_TARGET := public/js/translations
SETTINGS_FILE := drag_and_drop_v2.locale.settings
WORKING_DIR := drag_and_drop_v2
EXTRACT_DIR := $(WORKING_DIR)/translations/en/LC_MESSAGES
EXTRACTED_DJANGO := $(EXTRACT_DIR)/django-partial.po
EXTRACTED_DJANGOJS := $(EXTRACT_DIR)/djangojs-partial.po
EXTRACTED_TEXT := $(EXTRACT_DIR)/text.po

help: ## display this help message
	@echo "Please use \`make <target>' where <target> is one of"
	@perl -nle'print $& if m{^[a-zA-Z_-]+:.*?## .*$$}' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-25s\033[0m %s\n", $$1, $$2}'

clean: ## remove generated byte code, coverage reports, and build artifacts
	find . -name '__pycache__' -exec rm -rf {} +
	find . -name '*.pyc' -exec rm -f {} +
	find . -name '*.pyo' -exec rm -f {} +
	find . -name '*~' -exec rm -f {} +
	rm -fr build/
	rm -fr dist/
	rm -fr *.egg-info

## Localization targets

extract_translations: ## extract strings to be translated, outputting .po files
	cd $(WORKING_DIR) && DJANGO_SETTINGS_MODULE="$(SETTINGS_FILE)" i18n_tool extract
	cat $(EXTRACTED_DJANGO) $(EXTRACTED_DJANGOJS) > $(EXTRACTED_TEXT)
	rm $(EXTRACTED_DJANGO) $(EXTRACTED_DJANGOJS)

compile_translations: ## compile translation files, outputting .mo files for each supported language
	cd $(WORKING_DIR) && DJANGO_SETTINGS_MODULE="$(SETTINGS_FILE)" i18n_tool generate
	cd $(WORKING_DIR) && DJANGO_SETTINGS_MODULE="$(SETTINGS_FILE)" django-admin compilejsi18n --namespace DragAndDropI18N --output $(JS_TARGET)

detect_changed_source_translations:
	cd $(WORKING_DIR) && i18n_tool changed

dummy_translations: ## generate dummy translation (.po) files
	cd $(WORKING_DIR) && i18n_tool dummy

build_dummy_translations: dummy_translations compile_translations ## generate and compile dummy translation files

validate_translations: build_dummy_translations detect_changed_source_translations ## validate translations

pull_translations: ## pull translations from transifex
	tx pull -f --mode=reviewed -l en,ar,es_419,fr,he,hi,ko_KR,pt_BR,ru,zh_CN

push_translations: ## push translations to transifex
	tx push -t -l en,ar,es_419,fr,he,hi,ko_KR,pt_BR,ru,zh_CN