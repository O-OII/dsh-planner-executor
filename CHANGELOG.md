# Changelog

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
