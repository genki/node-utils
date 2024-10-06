default: build

test:
	pnpm test

build:
	pnpm run test --run
	pnpm build
