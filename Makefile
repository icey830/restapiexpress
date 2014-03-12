test:
	@./node_modules/.bin/mocha -u tdd --recursive

debug:
	@./node_modules/.bin/mocha -u tdd --recursive --debug

.PHONY: test