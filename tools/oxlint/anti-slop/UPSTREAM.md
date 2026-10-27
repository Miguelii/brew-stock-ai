# Vendored anti-slop Oxlint plugins

## Source identity

- **Source:** the `install-anti-slop` agent skill bundle (`assets/anti-slop/`), installed with its `scripts/install.mjs` on 2026-10-26.
- **Upstream repository and commit:** unknown. The skill bundle was not a Git checkout and names no upstream repository, so no immutable revision can be recorded.
- **Snapshot digest:** `24f771967ed0c6595fcac4adb93086b4996ccb06a570146f059e720bbf807acf` (SHA-256 over `shasum -a 256` of every bundle file, sorted by path with `LC_ALL=C`, excluding this `UPSTREAM.md`). The digest identifies the bytes but cannot reconstruct them.
- **Recoverable pristine base:** the commit that first adds this directory. The copy was byte-identical to the bundle at install time (`diff -r` clean) and has no local modifications, so that commit is the base for future three-way updates.

The nested `vendor/eslint-stylistic/UPSTREAM.md` and `LICENSE` record the separately vendored ESLint Stylistic rule (commit `435c3ea0fd26a5fef9042c4b36b6e165fbbf8d08`) and travel with this copy.

## Installed plugins

| Plugin name | Entry point |
| --- | --- |
| `anti-slop` | `tools/oxlint/anti-slop/index.ts` |
| `anti-slop-effect` | `tools/oxlint/anti-slop/effect/index.ts` (enabled because `effect` is a direct dependency) |

## Intentional local deviations

None in the plugin source. Repository integration only:

- `vite.config.ts`: registers both plugins in `lint.jsPlugins`, enables every generic rule except `require-readable-spacing` and `no-module-mocking` (both turned `off` by the repository owner; the tests mock modules with `vi.mock` instead of injecting dependencies), the five Effect rules and `oxc/no-accumulating-spread` at `error`, and adds the agent-tooling directories and this directory to `lint.ignorePatterns` and `fmt.ignorePatterns`. An override turns `no-chained-type-assertions` and `require-safety-comment-for-type-assertion` off for `**/__tests__/**`, `e2e/**` and `src/_bff/lib/tests-utils.ts`, where test doubles stand in for clients they cannot fully implement (repository owner's decision).
- `tsconfig.json`: excludes this directory from the app typecheck. Oxlint loads the plugin directly, and the source uses `.ts` import extensions plus two narrowings that do not typecheck against `@oxlint/plugins@1.72.0` under TypeScript 7.0.2 (`rules/no-widen-then-assert.ts:285`, `shared/function-parameters.ts:45`, both `TS2339` on `never`). Runtime behaviour is unaffected.
- `knip.json`: both entry points are registered as knip entries and the directory is ignored for issue reporting (the vendored code exports types it does not consume).

## Dependencies

- `@oxlint/plugins` `1.72.0` (exact devDependency), matching the `oxlint` `1.72.0` bundled by `vite-plus` `0.2.4`. Bump both together when `vite-plus` moves its `oxlint` pin.

## Verification at install

- `pnpm typecheck`, `pnpm fmt --check` and `pnpm knip` pass.
- At install, `pnpm lint` reported 326 anti-slop findings in owned source (790 with `require-readable-spacing` enabled). They were then fixed in the source, apart from the rules turned off above; `pnpm lint` now passes with no errors or warnings.

## Pending for the next update

- Upstream repository and revision are unknown: future updates have no upstream commit to diff against, only the base commit above.
