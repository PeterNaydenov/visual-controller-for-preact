# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).



## 2.0.0 (2026-08-03)
- [x] **Breaking change.** Region-based API. The v1 `id`-based API (`publish(component, data, id)` etc.) is removed. Regions are defined with the inlined dim subset (see `src/dim.js`) via the new `set` method, which mirrors `dim.set` exactly.
- [x] New API: `set`, `publish(alias, component, data?, extraParams?)`, `destroy`, `has`, `getApp`, `isEmpty`, `list`, `reset`.
- [x] Multiple placeholders can coexist inside a single parent without DOM `id` collisions — selection is by alias returned from the `set` callback.
- [x] Destroying an app empties the region but keeps the markers, so the same alias can host a different app later.
- [x] Mount container is a bare `<span style="display:contents">` — invisible to layout, no DOM wrapper authored by the user.
- [x] SSR hydration preserved: when the range already contains content at publish time, the controller picks it as the mount target (single element → direct mount, multiple siblings → wrapped in a mount span) and uses `hydrate`. Preact hydrates the existing DOM in place.
- [x] `isEmpty(alias)` delegates to the inlined dim's `range.isEmpty()` — returns `true` for collapsed or orphaned ranges, `undefined` for unknown aliases.
- [x] `destroy()` is polymorphic — accepts no argument (destroys every published app, returns count), an alias string, or an array of alias strings. Markers stay in the DOM in every form.
- [x] No `@peter.naydenov/dim` dependency. The slim subset of dim the controller uses is inlined in `src/dim.js`. The file header documents the upstream reference for syncing if the official package changes.
- [x] `extraParams` slot accepted but ignored — reserved for future use.



## 1.0.2 (2026-07-24)
- [x] Dependency update. Ask-for-promise v.3.2.0;
- [x] Typescript 7.x.x;



## 1.0.1 (2026-05-25)
- [x] Dependency update. Ask-for-promise v.3.1.1;



## 1.0.0 (2026-04-19)
- [x] Initial release of Visual Controller for Preact;
- [x] Methods: `publish`, `getApp`, `destroy`, `has`;
- [x] Support for dependencies injection;
- [x] Support for setupUpdates for external component manipulation;
- [x] Support for SSR/hydration;
- [x] JSDoc documentation;
- [x] Test suite with vitest;