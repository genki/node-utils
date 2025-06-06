@s21g/utils
===========

Utility functions for Node.js projects of s21g Inc.  The package
provides a set of TypeScript helpers shared between repositories.

## Features

- **Serializer** – convert `Uint8Array` values to UTF‑16 strings and back.
- **stringify** – stable JSON stringification that keeps key order.
- **digest** – simple SHA‑256 helpers.
- **pki** – ECDSA based signing and encryption utilities.
- **future** – a small `Waitable` promise wrapper.
- **ulid** – create ULID identifiers from timestamps.
- **noise** – manage 128‑bit noise values and conversions.
- **schema** – helper functions built on top of `valibot`.
- **fn**, **iter**, **object**, **misc** – generic functional helpers.

See `src/index.ts` for the complete list of exported modules.

## Development

Install dependencies and run tests/build with `pnpm`:

```bash
pnpm install
pnpm test        # run vitest
pnpm build       # create ESM build and types
```

You can also use `make build` which runs tests before building.

## License

This project is released under the MIT License.
