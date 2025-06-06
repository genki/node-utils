# Testing Notes

- `pnpm install` fails because the project depends on `../clone/valibot/library`, which is missing.
- Trying to clone `genki/valibot` (branch `set_typed_non_optional`) to provide this dependency results in HTTP 403, so the repository cannot be fetched.
- Without the `valibot` library, `pnpm install` cannot resolve dependencies like `vitest`.
- Consequently, running `pnpm test` fails with `vitest: not found`.

