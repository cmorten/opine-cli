.PHONY: ci compile deps doc fmt fmt-check install lint test typedoc

FILES_TO_FORMAT = ./src ./test deps.ts opine-cli.ts version.ts

ci:
	@make fmt-check
	@make lint
	@make install
	@make test

compile-macos:
	@deno compile --unstable ./opine-cli.ts --output ./bin/macos/opine-cli

compile-ubuntu:
	@deno compile --unstable ./opine-cli.ts --output ./bin/ubuntu/opine-cli

compile-windows:
	@deno compile --unstable ./opine-cli.ts --output ./bin/windows/opine-cli

deps:
	@npm install -g typescript typedoc@0.19.2

doc:
	@deno doc ./opine-cli.ts

fmt:
	@deno fmt $(FILES_TO_FORMAT)

fmt-check:
	@deno fmt --check $(FILES_TO_FORMAT)

install:
	@deno install -f -q --allow-read --allow-write --unstable ./opine-cli.ts

lint:
	@deno lint --unstable $(FILES_TO_FORMAT)

test:
	@deno test --allow-run --allow-read --allow-write ./test/

typedoc:
	@rm -rf docs
	@typedoc --ignoreCompilerErrors --out ./docs --mode modules --includeDeclarations --excludeExternals --name "Opine CLI" ./opine-cli.ts
	@make fmt
	@make fmt
	@echo 'future: true\nencoding: "UTF-8"\ninclude:\n  - "_*_.html"\n  - "_*_.*.html"' > ./docs/_config.yaml
