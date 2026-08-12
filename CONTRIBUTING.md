# Contributing to CPGen Studio

Thanks for taking the time to contribute. This is a small, personally
maintained project, so please keep expectations casual, but the checks
below are the same ones CI runs, so passing them locally first will save
both of us a round trip.

## Development setup

```bash
npm install
npm run tauri dev
```

This starts the Tauri app in dev mode with hot reload for the frontend.

## Before opening a pull request

These are the exact checks CI runs on every PR. Run them locally first:

**Frontend**

```bash
npm run lint          # ESLint
npm run format:check  # Prettier
npm run test:run      # Vitest unit tests
```

**Backend** (from `src-tauri/`)

```bash
cargo fmt --check
cargo test
```

If `lint`/`format:check` fail, `npm run lint:fix` and `npm run format`
will auto-fix most issues.

A few conventions worth knowing:

- Frontend tests live under `tests/unit/`, mirroring the `src/` structure
  they cover.
- Keep PRs scoped to one change (easier to review, easier to revert if
  something's wrong).
- If you're adding a new setting, workflow, or backend command, a quick
  look at how similar existing ones are wired (e.g. an existing Tauri
  command, an existing settings field) will usually show the pattern to
  follow.

## Opening an issue

Bug reports and feature requests are both welcome. For bugs, the more
reproducible the better: what you ran, what you expected, what actually
happened. For features, a quick description of the use case helps more
than a fully-specified design.

## License and contribution terms

CPGen Studio is licensed under [PolyForm Noncommercial 1.0.0](LICENSE).

**Definitions**

- **Contribution** means any original work of authorship (including
  code, documentation, tests, comments, or other content) that you
  intentionally submit to this project for inclusion, whether via pull
  request, patch, issue attachment, or any other form of submission.
- **Maintainer** means the person or entity that owns and has
  administrative control over the official CPGen Studio repository,
  currently located at [CPGen Studio](https://github.com/ThisIsNotNam/cpgen-studio). As of this writing, that is
  [ThisIsNotNam](https://github.com/ThisIsNotNam).

By submitting a pull request to this repository, you agree that:

1. You have the right to submit the Contribution (it's your own work,
   or you otherwise have the right to contribute it under these terms).
2. Your Contribution is licensed to the project under the same
   PolyForm Noncommercial 1.0.0 license as the rest of the codebase.
3. You grant the Maintainer a perpetual, irrevocable, worldwide,
   royalty-free license to use, modify, and relicense your Contribution,
   including under commercial terms separate from PolyForm Noncommercial,
   in addition to its use under the project's stated license.

Point 3 exists because this project may in the future be offered under a
separate commercial license alongside the free noncommercial one. Without
it, a single contribution without this grant could make that impossible
without going back and asking permission (or removing the contribution)
later. If you'd rather not agree to point 3 specifically, please open an
issue first to discuss before submitting a PR: happy to talk it through.

Pull requests are expected to keep the agreement checkbox in the PR
template intact and checked; PRs without it won't be merged.
