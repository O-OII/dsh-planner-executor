# Configure without editing YAML

[简体中文](configuration.zh-CN.md) · [Project](../README.md) · [DS execution contract](ds-execution.md)

## Open the page

Enable this bundle, then open **Plugins → DSH Agent Activity**. Its configuration is embedded in the bundle detail page, between the description and component rows. It is **not** a new global Settings section, and no separate configuration plugin is required. The browser contribution registers the official `plugins.bundle.config` slot under `dsh-agent-activity`.

If your DSH does not provide that slot, the configuration page is unavailable but the activity overlay can still operate. A disabled bundle has no browser contribution. This release does not automatically replace a previously maintained local plugin; never enable both copies at once.

![English configuration page](images/settings-en.png)

*The actual production configuration and overlay, rendered against explicit synthetic public adapters. This is not a screenshot of a personal profile or a live DSH installation.*

## Activity panel card

Fresh installs default to **Simplified Chinese**. Choose **Follow DSH**, **English**, or **Simplified Chinese**, then save the panel card. Previously saved language preferences are retained; upgrading does not rewrite them. The language is stored in the official `subagent-activity` Settings namespace. Editing a selection does not immediately change the panel; the confirmed save does. With Follow DSH, live DSH locale changes translate the page and overlay without clearing staged edits.

Advanced client-only `config.locale` is a bootstrap fallback; after a valid Host namespace has been read, Host Settings is authoritative. Routing error language is independent. Host `auto` currently means Chinese, not the browser's DSH language.

## DS execution card

1. Add at least one **parent provider/model** condition. These are exact identifiers; both must match the main agent's route. Add or remove rows as needed. Parent reasoning effort is not part of the match.
2. Set the **execution provider/model**. Prefer identifiers offered by the official model catalog. If the catalog is absent, unavailable, partial or does not list your route, use manual identifiers. The page never treats a display label as the saved id.
3. Leave **reasoning effort** blank unless you know this exact execution target supports the value. Catalog suggestions are not a provider authorization or capability test; manually entered values are not guaranteed supported.
4. Select the routing error language. Leave the strategy OFF while preparing configuration, or enable it once a valid parent list and target are present.
5. Save the DS card. `enabled`, `parentRoutes`, `targetRoute`, and `locale` are submitted together in one official Settings update. This avoids an intermediate ON state with a missing target.

You can save the initial empty configuration while OFF; incomplete nonempty route rows, blank required identifiers, whitespace in identifiers and incomplete target pairs fail validation. No API key field is provided: configure credentials through DSH's normal provider management.

**DS is a friendly UI abbreviation, not a restriction to DeepSeek.** The strategy affects only future matching delegations; existing children, in-flight calls and follow-up messages are not migrated. Syntactic validation and a successful save do not prove the provider exists, is authorized, is affordable or accepts the chosen effort. The routing companion's new-delegation preflight remains the authority for target resolution.

## Saving, cancellation and synchronization

- Opening and editing the page never writes. Each card owns a draft and explicit save/discard controls. Leaving the page drops staged edits.
- The cards save independently to two namespaces. There is **no cross-namespace transaction**; saving panel language does not implicitly save routing edits.
- The current status is Host-confirmed, not inferred from an unsaved enabled checkbox. A failed disable leaves the confirmed ON state visible and reports the failure.
- A successful receipt refreshes the corresponding card and overlay. Notifications are revision-fenced; older reads/receipts cannot roll newer state backward.
- An external edit or revision conflict retains the draft and stops stale saves. Review the current Host state, then explicitly discard/reload or rebase the draft before saving again; the plugin does not automatically replay an old intent.
- Reconnect invalidates in-flight requests. A late old receipt cannot announce success. Drafts remain staged for review against the reconnected Host.
- If Settings reports a nonwritable profile, saving is disabled and the reason is visible. The other card and overlay do not pretend that missing services are a valid OFF state.

### Home/command-line overlays

The official namespace descriptor does **not** expose a per-field overlay/writable flag. Consequently the page cannot promise to detect a home patch or CLI overlay before saving. Official ConfigEditor rejects such a write **before persistence**; the page displays the refusal, preserves the draft and does not claim success. Resolve the higher-priority override outside this form, explicitly read again, then review before saving. The page never deletes or bypasses that override.

## Verification boundaries

See [reproducible verification](testing.md). Synthetic browser tests exercise the real form and overlay against a controlled authority; the separate isolated official Settings/ConfigEditor check tests persistence/refusals without touching a real profile. Neither is a live installed-DSH transport/navigation acceptance test. No model calls or costs are required to configure or run these fixtures.
