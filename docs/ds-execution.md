# Planner–Executor: optional, explicit collaboration

[简体中文](ds-execution.zh-CN.md) · [Project](../README.md) · [Setup](configuration.md)

The UI is **DSH Planner–Executor** / **DSH 主从协作**. The package supports any configured, authorized DSH API model, not only DeepSeek. Legacy filenames and package/settings IDs remain stable. No provider account, default target or credential is shipped; fresh configuration is OFF and unconfigured.

## Responsibilities and precedence

The capable **main agent** owns requirements, planning, design, decisions and acceptance. Substantial implementation, file edits, command execution, research and tests belong in workers. Simple questions/trivial tasks stay direct. Each worker receives a concise, self-contained scope, constraints, deliverable and acceptance criteria, and reports actual evidence plus failures/risks. Prefer fresh `subagent` over a full-history fork; use `subagent_fork` only when the conversation is required. The planner inspects and accepts the result instead of trusting a success claim.

One **default executor** is configured. There are no automatic research/test roles: the activation seam has no reliable tool-role identity, and this plugin never infers roles from task keywords. Native explicit child selection remains available when DSH enables and authorizes it.

The reviewed official tool constructs `request.agentOptions` from explicit tool arguments/configured child defaults. Parent inheritance happens **later**, in the local child-option resolver. Therefore:

| New activation | Behavior while ON |
| --- | --- |
| Main planner, no child route/effort selection | Default executor after preflight |
| Main planner, only unrelated options such as `maxTokens` | Default executor; unrelated options retained |
| Any supplied child `provider`, `model` or `reasoningEffort` | Original spec untouched, including equal-parent choices and configured tool defaults |
| Nonmatching parent | Original spec untouched |
| Worker/descendant, including a same-model worker | Original spec untouched; no new planner-only policy |
| Backend declaring no AgentOptions support | Its own execution route is retained |

The guard uses official `options.subagentDepth` and durable `session.header.parentSession`, not model names or prompt text. System-prompt assembly must carry the official `context.agent`; contextless assembly gets no planner policy. A fork may inherit old conversation guidance, so the routed worker prefix explicitly limits inherited planner-only rules to its parent.

## OFF, preflight and existing work

**OFF** is identity pass-through: original assembly/spec/request/prompt, no policy/prefix, no route modification and no target preflight. Observation continues independently.

**ON** requires valid exact `parentRoutes` and `targetRoute`, a mounted companion under `planner-executor-routing`, and official Settings, LLM and `subagents.startActivation` services. Host configuration validation rejects incomplete ON before persistence. For an eligible main-agent delegation:

1. Snapshot the target and preflight via `llm.resolveCallConfig`, carrying the caller’s cancellation signal. This is not an inference request initiated by the plugin; an adapter may perform metadata discovery.
2. Recheck enabled/configuration/parent/lifecycle after the await. Turning OFF, editing routes or disposing the owner invalidates the old decision; even OFF→ON cannot resurrect it. Invalidated decisions retain the original spec, consistent with live OFF/native semantics.
3. Forward a new spec with the target provider/model and optional target-owned effort. Omitted target effort does not carry an incompatible parent effort. Preserve unrelated options and every original text/image part; add only one worker-role text prefix.

A target preflight failure while the decision is current **blocks that delegation with an error**. There is no silent expensive-planner fallback or automatic retry. Policy likewise asks the planner to report failure/request correction rather than secretly perform substantial delegated work itself. The policy is guidance, not tool revocation.

Existing children, queued/in-flight requests and follow-up messages are **not migrated or restarted**. Actual model display uses durable `lastUsed`, not an intended future selection. The `startActivation` wrapper is an upgrade-sensitive seam; use one routing owner and revalidate after DSH changes. External execution coverage must not be assumed.

## Stable configuration

The UI saves `{enabled,parentRoutes,targetRoute,locale}` through official revision-checked Settings. Advanced composition may merge this **example**, replacing every ID, without replacing the profile:

```yaml
- id: planner-executor-routing
  config:
    enabled: false
    parentRoutes:
      - provider: your-planner-provider
        model: your-planning-model
    targetRoute:
      provider: your-executor-provider
      model: your-execution-model
      # reasoningEffort: low  # only if supported by this exact model
    locale: zh-CN             # auto | en | zh-CN; Host auto = Chinese
```

Exact provider **and** model must match. Parent effort is not a matching condition. These fields use official volatile config lifecycle. Panel language is independent. A failed disable remains confirmed ON; conflicts/reset never replay stale intent or announce an old receipt as current. See [setup/persistence](configuration.md).

## Limits and evidence

Different routes change context, multimodal support, latency, caching, reasoning charges, data residency and review/retry cost. Delegation **does not guarantee lower total tokens or cost**. Preflight is not an authorization bypass or a promise the later API call succeeds. DSH authorization, sandboxing, approvals and Stop authority remain authoritative; no permissions are removed or enlarged.

Portable tests cover the real client/routing with synthetic services, including explicit/default precedence, same-model worker exclusion, OFF identity, preflight races, failure, partial credentials and reset/unmount fencing. The optional isolated official Settings/ConfigEditor test verifies persistence, not a live installed GUI or real paid delegation. See [reproduction and current test scope](testing.md). Upstream contracts: [Settings](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/settings/settings), [subagent tools](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/subagent/tool-subagent).
