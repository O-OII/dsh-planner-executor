# Changelog

## 0.3.1 — 2026-10-27

- Fix a cross-plugin Host bug: `internal/config` is a shared Cordis waterfall, not automatically local to its registering plugin. The routing guard now validates only its exact owning Fiber (including official identity proxies), never a sibling/nested entry or a similarly shaped/name-matched config.
- Preserve unconfigured-ON rejection for routing itself before persistence, while unrelated plugin enable/config changes pass through their own waterfall unchanged. No config-shape heuristic or guard bypass is used.
- Add portable identity/proxy regression tests and an optional real-Cordis isolation suite covering sibling, nested, same-name, and second routing instances. `test:host` runs both official ownership and Settings persistence suites when a runtime is supplied.

## 0.3.0 — 2026-10-27

- Rename the UI to **DSH 主从协作 / DSH Planner–Executor**; keep package, projection and Settings IDs stable. Replace ambiguous DS switch labels.
- Add real creation-only custom API model setup through official schema, LLM directory/discovery, path-based Settings mutation and write-only credential APIs. Support protocol, Base URL, provider/model names and IDs, multiple models and per-model reasoning. Never edit existing providers or enable routing on creation.
- Add fresh revision/duplicate/collision checks, visible service availability, credential-only partial-save retry, generic secret-safe failures and secret clearing/reset fencing. Existing/catalog provider editing stays in official Settings → Models; no private slot extraction or fake deep link.
- Make the executor a **default**, not a forced override: explicit child route/effort and tool-configured defaults retain priority. Exclude worker lineage/depth from planner policy and recursive rerouting, including same-model workers. No keyword research/test routing.
- Strengthen concise scope/acceptance-evidence policy, fresh-worker preference, direct simple tasks and no silent expensive-model fallback; do not promise total token/cost savings.
- Declare DSH `>=0.2.1-rc.2 <0.3.0` instead of exact rc.2 so rc.3 is not excluded. Reviewed APIs remain upgrade-sensitive.
- Expand portable tests, bilingual docs and real-component synthetic browser coverage for create → credential save → role refresh/select → explicit route save. No live configuration/install/restart or paid call is part of this implementation.

## 0.2.1 — 2026-10-26

- Default panel, configuration UI and routing diagnostics to Simplified Chinese, including missing/unsupported locale fallback.
- Keep explicit English and `auto` preferences; never overwrite saved user choices. Host `auto` now uses Chinese because no browser locale service exists there.
- Add bilingual package metadata and default-language regression tests. Existing live profile values are not migrated or rewritten.

## 0.2.0 — 2026-10-26

- Add an English/Simplified Chinese configuration page on **Plugins → DSH Agent Activity**, without requiring a global Settings page or changing the activity overlay's dependencies.
- Stage panel language and full DS execution configuration independently. Only explicit saves write, each with the Host revision; route changes use a single complete namespace patch.
- Preserve unsaved drafts on language changes, external edits, failed saves and reconnect. Require explicit conflict resolution; never replay an old save automatically or show a failed disable as OFF.
- Use the official model catalog when available, with exact provider/model identifiers and a validated manual fallback. No credentials form or invented model capabilities.
- Report profile write refusal and home/CLI overlays honestly; these overlays are refused by ConfigEditor at save time, not exposed as a preflight flag in namespace descriptions.
- Add configuration-page tests, reproducible synthetic browser fixtures and bilingual setup instructions. This release does not migrate existing local maintenance copies or restart DSH.

## 0.1.0 — 2026-10-24

Initial standalone open-source candidate; not a claim of npm/GitHub publication.

- Compact main/direct-child activity with actual `lastUsed` models, bounded current/previous-turn grouping and low-noise projection reads.
- Official Open and parent-authorized two-click Stop for running continuable direct children.
- English and Simplified Chinese dictionaries, public DSH locale service updates, explicit client override, and English fallback.
- Package-local optional DS execution companion, default OFF with no default target. Generic exact parent/target provider-model routes, official volatile settings, pre-persistence guard, preflight and post-await invalidation.
- No status/verification files, private provider defaults, local credentials, user sessions, ASAR code or runtime HTTP endpoint.
- Preserved 47 panel and 13 routing regression scenarios; additional release tests, Node CI, package smoke and synthetic screenshot fixture.
