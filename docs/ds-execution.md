# DS execution: an explicit, optional policy

[简体中文](./ds-execution.zh-CN.md) · [Project](../README.md)

“DS execution” / “DS执行” is the panel's short, recognizable switch label. It can target **any execution provider/model supported and authorized by your DSH**, not only DeepSeek. The package ships no provider account, model target or credentials. Turning it on does not configure a provider or guarantee lower prices.

![Configured OFF](images/panel-en-off.png)
![Configured ON (Chinese)](images/panel-zh-CN-on.png)

*Screenshots use the actual client and synthetic Settings/locale adapters. They demonstrate visible states, not live profile persistence or a paid model call.*

## Before the switch can be enabled

1. The optional package-local `dsh-agent-activity/routing` entry must be mounted under the stable id `planner-executor-routing`. A disabled, failed or absent entry has no usable Settings namespace; the panel stays functional and shows **unavailable**.
2. Required Host services and `subagents.startActivation` must exist. The companion fails its own mount rather than claiming a missing hook is active.
3. Configure at least one exact `parentRoutes` provider/model and a complete `targetRoute`. Missing, blank, whitespace or malformed route identities are rejected/unconfigured. Missing configuration displays **not configured**, not OFF.
4. Official Settings must describe a real enabled boolean and non-negative integer revision, and allow the write. Loading/unknown/stale/error states cannot be clicked as if they were a confirmed OFF.
5. The Host guard rejects ON with an incomplete route **before a Settings edit persists**. Structural configuration is not a network availability check: actual provider/model support, credentials, policy and authorization are checked by `llm.resolveCallConfig` at the new-delegation boundary. An unknown but syntactically valid target fails that delegation loudly; it does not silently inherit the planner route.

## Generic configuration

Merge this example into the profile patch **after** enabling the bundle. Replace every example identity with your real public/provider ids; do not replace your whole profile. None of these values is supplied automatically by the package:

```yaml
- id: planner-executor-routing
  config:
    enabled: false
    parentRoutes:
      - provider: your-planner-provider
        model: your-planning-model
    targetRoute:
      provider: deepseek
      model: deepseek-chat
      # reasoningEffort: high  # only if this exact target supports it
    locale: auto               # auto | en | zh-CN; Host auto = English
```

The DeepSeek route above is an illustration, not a promise that your DSH has that provider/model, that it supports `high`, or that it is cheaper. Exact provider **and** model must match; a model's display name does not match a different provider. Parent reasoning effort is not part of the match. Target effort is optional; inherited route-owned effort is removed if the target does not explicitly configure one.

`parentRoutes`, `targetRoute`, `enabled` and routing error `locale` are official Schemastery volatile fields. The default bundle sets `enabled:false`, `parentRoutes:[]`, `targetRoute:null`; null/omission means no target. Changing ordinary profile composition may require reload; changing these live fields uses the official Loader reference lifecycle. Never add local paths to a routing file outside this package.

## Exactly what OFF and ON mean

**OFF:** system-prompt assembly returns the original assembly; new activation is forwarded with the original spec/request/prompt identity. No policy or worker prefix is injected, no effort/provider/model is changed, no target preflight is attempted. The panel's observation RPCs still operate.

**ON, matching parent, future new activation:**

1. Snapshot the configured execution route and original request.
2. Preflight that exact target via the official LLM service using the caller's signal. This is not a paid model request initiated by this plugin, but a Host/provider implementation may perform discovery; this preparation run did not measure any remote preflight behavior.
3. After `await`, check the live switch, route configuration, parent match and lifecycle invalidation again. OFF during preflight forwards the original spec even if preflight failed. OFF→ON during that same await does not resurrect the old routing decision. An edited target is not used without its own new preflight.
4. Forward a new spec for the new child, overriding explicit child provider/model/optional effort. Keep unrelated options. Add one worker-role text part without mutating any original string/text/image parts.
5. Matching parent prompt assemblies also receive soft planner/reviewer guidance while the policy is ON. Simple conversation need not spawn a worker.

**Nonmatching parent:** native pass-through, even while ON. Fork/continuable creation reaches the same `startActivation` seam in the intended API baseline; unsupported/external paths must not be assumed covered. The package does not add fallback adapters or authorized routes.

### Existing work is never migrated

The switch is **not** a live migration button. It does not change an existing child's route, restart a worker, move a queued model call, or rewrite follow-up messages. Existing children keep DSH's own lifecycle/selection behavior. The panel continues to show the child's recorded `lastUsed`, not what a future delegation might choose. A matching new delegate's explicit route is intentionally overridden; do not combine with another router expecting the opposite precedence.

## Persistence, multiple windows and failures

- The browser reads `ctx.remote.settings.describe()` and writes only `settings.update("planner-executor-routing", {enabled}, revision)`. The Host Settings/ConfigEditor authority persists the profile patch. There is no custom HTTP route, localStorage switch or private JSON state file.
- The confirmed descriptor/receipt is the source of truth. Saving does not optimistically flip `aria-checked`. A failed OFF must retain the last confirmed ON and show failure — failure to disable is not success.
- `settings/document-updated` notifications are namespace/revision fenced and coalesced; lower-revision describes and receipts cannot roll back a newer value from another window. `connection/reset` invalidates old generation reads/writes and accepts a restarted Host's lower revision.
- Conflicts cause an authoritative re-read, not blind replay of an old intent. Retry reads fresh Host truth; after a failed write, click again if you still want to change the now-confirmed state. A same-tick double click cannot issue overlapping writes.
- Profile write refusals, home/CLI overlays, missing namespaces and lost services show localized failure/unavailability. The last confirmed value may remain visible with an error while disabled; loading/unknown never masquerades as OFF.
- Persisted ON is not forced OFF by startup code. A future normal restart should read your saved setting; **this public package has not yet been tested with real ConfigEditor restart/persistence**. Its advertised semantics still require the acceptance checklist below.

## Cost, permissions and security

Changing models/providers can change prices, context limits, multimodal support, latency, cache reuse, reasoning fees, data residency, failure/retry cost and review effort. No cost reduction is guaranteed or measured here. Preflight does not prove the eventual API call will succeed or be affordable.

Planner/worker guidance and the switch are **not a security boundary**. They do not remove a planner's tools or isolate filesystem/network access. DSH authorization, sandboxing, provider configuration, approvals and Stop authority remain in DSH. Do not use this policy to bypass them. Multiple router wrappers may compose in surprising order; use one routing owner and revalidate after DSH upgrades.

## Real test scope and remaining gates

Node tests use the **real package routing module and client bundle** with synthetic Cordis/React/remote fixtures, including OFF identity, generic ON routes, image-part preservation, invalid config, preflight OFF/failure races, revision conflicts, stale receipts, failed disabling, reconnect, missing services and bilingual copy. The inherited 47 panel + 13 routing scenarios remain present.

Not done in this preparation run: live Host/GUI, real Settings/ConfigEditor persistence and restart, actual fork/spawn through installed tools, remote authorized-route refusal, provider discovery, paid requests or cross-provider billing. The demo is synthetic and cannot substitute for these. Before claiming production support, verify all those paths in an isolated profile, both locale modes and at least two browser windows; keep the real main app untouched unless the user separately authorizes deployment.

Public contracts reviewed: [Settings](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/settings/settings), [volatile config](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/05-config.md), [client locale](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/client/locale), [official subagent tools](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/subagent/tool-subagent). These links document the upstream contract, not a compatibility certification.
