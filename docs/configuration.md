# Model setup and role assignment

[简体中文](configuration.zh-CN.md) · [Project](../README.md) · [Routing contract](ds-execution.md)

Open **Settings → Plugins → DSH Planner–Executor**. The page uses the public `plugins.bundle.config` slot; it does not copy the official Models component or access the Settings owner’s private store. If that slot is missing, the overlay can still operate without this page.

## 1. Add a custom API model

![Actual custom API setup component, synthetic public data](images/planner-model-setup-en.png)

*Actual production component with public synthetic data; not a private profile or paid provider test.*

The creation-only form uses the **same official persistence seams** as DSH’s Models editor. It never edits an existing provider. For catalog providers or advanced edits, use **Settings → Models → Add model provider**. Current DSH has no public section deep link; the on-page instructions identify the real navigation rather than simulating a click.

1. Enter a new **Provider ID**, starting with a lowercase letter and using lowercase letters, digits and single hyphens. IDs already registered, configured or owned by the dormant catalog are refused.
2. Choose a schema-supported **API protocol**. OpenAI Chat Completions/Responses normally use a `/v1` Base URL; Anthropic Messages normally uses the server root because the SDK appends `/v1/messages`. Enter the endpoint appropriate to your service. Only HTTP(S), without URL credentials/query/fragment, is accepted.
3. Enter an optional **API key** in the masked, write-only field. Blank keeps native/provider authentication; it does not prove authentication is configured. Saved secrets are never read back.
4. Add exact **model IDs** manually, or explicitly click **Fetch available models** and choose returned rows. Discovery is an endpoint request through `llm.discoverModels`, may send the draft key to that endpoint and is not an inference/connectivity guarantee. It never writes automatically. A failed/missing discovery service does not prevent manual IDs.
5. For each model, optionally declare its **reasoning levels** and API parameter values. Allowed levels come from the Host schema, not a plugin capability guess. Declare only actual upstream capabilities. These are capabilities, not the default executor’s runtime effort.
6. Click **Create provider and save key** and wait for Host confirmation. Model choices refresh on success. Then choose roles and save separately.

### Safe persistence and partial failures

- Requires mounted `llm-pi-ai`, official schema and LLM directory services. Credentials are required only for a nonempty key. Read-only profiles disable creation.
- Re-reads directories and revision before creation; one `settings.mutate("llm-pi-ai", [{op:"set",path:["providers",id],value:profile}], revision)` writes only the **new** profile. No whole-provider-list replacement, current-provider edits or route enabling occurs.
- Nonempty keys use a derived `PROVIDER_ID_API_KEY` reference. `credentials.describe([ref])` checks configured/writable status without reading a value. A pre-existing reference is refused rather than silently overwritten.
- Settings then `credentials.set(ref,key)` are **two operations, not an atomic transaction**. The profile stores `apiKeyEnv`, never the key. If key storage fails, the saved profile remains, the input clears, and only explicit **Retry API key only** is offered. The retry verifies the profile still matches, then writes credentials only. Re-enter the key; do not create a duplicate.
- Conflicts/refusals never auto-retry. Home/CLI overlays are enforced by Host ConfigEditor at write time; the descriptor cannot pre-diagnose every overlay. Reload metadata, review the real Models editor, then explicitly retry.
- Reset/unmount clears the secret and invalidates old completions. If a receipt is uncertain, a write may already have landed: inspect **Settings → Models** before another attempt. No automatic rollback can safely promise to undo an external write.
- Provider/credential errors are shown as local generic failure states, not raw error bodies that might echo secrets. The form adds no logging or localStorage. Discovery is explicit, never a background request from opening the form.

## 2. Assign roles

**Planner models** are exact provider/model conditions for main sessions. The selector uses catalog IDs, never display names. **Default executor** is one configured API model; optional runtime reasoning must be supported by that exact model. Manual route IDs remain possible if the catalog is partial/unavailable.

Explicit child provider/model or reasoning selections and tool-configured routes retain precedence. Research/testing can use native explicit child selection when enabled and authorized by DSH; this plugin provides **no keyword-derived research/test routing**. Worker lineage/depth excludes descendants from planner-only policy and automatic rerouting, even when they use the same model.

Save routing as one `{enabled,parentRoutes,targetRoute,locale}` update. Empty preparation is valid while OFF; ON requires at least one planner condition and a default executor. Syntactic validity or a successful save does not prove credentials, support, price or eventual API success. New eligible delegations still preflight via `llm.resolveCallConfig`.

## 3. Language, saves and synchronization

- Simplified Chinese is the fresh default; English and Follow DSH are supported. Saved choices are preserved. Host routing `auto` uses Chinese; browser Follow DSH uses its locale service.
- Panel language and routing have independent drafts and explicit saves. Provider creation is independent too. There is no cross-namespace transaction. Save/discard drafts before navigating away: unmount drops them.
- Host-confirmed receipts determine displayed ON/OFF. A failed disable retains confirmed ON and reports failure. Unknown/loading/unavailable never masquerades as OFF.
- Revision conflicts retain role drafts for explicit review/discard; no stale intent is replayed. Reconnect fences old reads/receipts and requires review against new Host truth.

See [tests and verification boundaries](testing.md). Synthetic fixtures and isolated official Settings tests are not proof of installed-Host transport, provider connectivity, paid inference or billing savings.
