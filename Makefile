
JS_FILES = $(shell find ./lib | grep index.js && find lib | awk '!/index.js/ && /.js/' )
DOC_COMMAND=java -jar ./support/jsdoc/jsrun.jar ./support/jsdoc/app/run.js -t=./support/jsdoc/templates/jsdoc -d=./docs


docs: docclean
	$(DOC_COMMAND) $(JS_FILES)

docclean :
	rm -rf docs

.PHONY: docs docclean



