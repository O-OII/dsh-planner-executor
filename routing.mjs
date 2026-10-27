import z from '@deepseek-ai/schemastery'

/** Optional routing companion. No private defaults, network transport or disk diagnostics. */
export const name = 'planner-executor-routing'
export const inject = ['subagents', 'systemPrompt', 'llm']

const routeSchema = z.object({
  provider: z.string().pattern(/^\S+$/).required(),
  model: z.string().pattern(/^\S+$/).required(),
  reasoningEffort: z.string().pattern(/^\S+$/),
}).i18n({
  en: { provider: 'Exact execution provider id', model: 'Exact model id', reasoningEffort: 'Optional supported reasoning effort' },
  zh: { provider: '精确执行 provider 标识', model: '精确 model 标识', reasoningEffort: '可选且受支持的推理强度' },
})

export const Config = z.object({
  enabled: z.boolean().default(false).volatile(),
  parentRoutes: z.array(routeSchema).default([]).volatile(),
  targetRoute: z.union([routeSchema, z.const(null)]).default(null).volatile(),
  locale: z.union(['auto', 'en', 'zh-CN']).default('zh-CN').volatile(),
}).i18n({
  en: { $description: 'Optional Planner–Executor routing', enabled: 'Planner–Executor: route future matching delegations (default OFF)', parentRoutes: 'Exact parent provider/model conditions; empty means unconfigured', targetRoute: 'User-configured execution route; required before enabling', locale: 'Error language (default Simplified Chinese); auto uses Chinese on the Host' },
  zh: { $description: '可选 主从协作 路由', enabled: '主从协作：路由后续匹配的新委派（默认关）', parentRoutes: '精确父 provider/model 条件；空列表表示未配置', targetRoute: '用户配置的执行路由；开启前必须设置', locale: '错误语言（默认简体中文）；Host 的 auto 使用中文' },
})

export function readValue(value) {
  return value && typeof value === 'object' && typeof value.get === 'function' ? value.get() : value
}
export function readEnabled(config) {
  try { return readValue(config?.enabled) === true } catch { return false }
}
const validRoute = value => value && typeof value === 'object' && typeof value.provider === 'string' && /^\S+$/.test(value.provider) && typeof value.model === 'string' && /^\S+$/.test(value.model) && (value.reasoningEffort === undefined || typeof value.reasoningEffort === 'string' && /^\S+$/.test(value.reasoningEffort))
export function configured(config) {
  try {
    const parents = readValue(config?.parentRoutes)
    return validRoute(readValue(config?.targetRoute)) && Array.isArray(parents) && parents.length > 0 && parents.every(validRoute)
  } catch { return false }
}
export function isPlanner(route, config) {
  const parents = readValue(config?.parentRoutes)
  return Array.isArray(parents) && parents.some(parent => parent.provider === route?.provider && parent.model === route?.model)
}
export function parentRoute(parent) {
  return parent?.session?.requestHeader?.()?.config ?? parent?.options
}
/** At startActivation, agentOptions contains overrides/configured tool defaults,
 * not the inherited parent route. Parent inheritance happens later in the local
 * child option resolver. Preserve even an explicit selection equal to the parent,
 * and effort-only overrides: the seam has no provenance to safely reinterpret them.
 */
export function hasChildSelection(request) {
  return ['provider', 'model', 'reasoningEffort'].some(key => request?.agentOptions?.[key] !== undefined)
}
/** Official assembly context carries agent; child creation stamps both depth and
 * durable parentSession lineage. Never treat a same-model worker as a planner.
 */
export function isWorker(agent) {
  return (agent?.options?.subagentDepth ?? 0) > 0 || typeof agent?.session?.header?.parentSession === 'string'
}
function routeError(config, code) {
  const zh = !/^en(?:-|$)/i.test(String(readValue(config?.locale)))
  const messages = {
    unconfigured: zh ? '主从协作：开启前请配置有效的 parentRoutes 与 targetRoute。' : 'Planner–Executor: configure valid parentRoutes and targetRoute before enabling.',
    unsupported: zh ? '主从协作：宿主缺少 subagents.startActivation，路由不可用。' : 'Planner–Executor: Host subagents.startActivation is unavailable.',
    llm: zh ? '主从协作：缺少 llm 服务，无法验证执行路由。' : 'Planner–Executor: llm service is unavailable; cannot verify the execution route.',
    preflight: zh ? '主从协作：目标路由验证失败；未创建该委派，请检查 provider/model 与权限。' : 'Planner–Executor: target preflight failed; this delegation was not created. Check provider/model and authorization.',
  }
  return Object.assign(new Error(messages[code]), { code: `dsh-agent-activity/${code}` })
}
/** Official internal/config waterfall guard runs before Settings persistence. */
export function validateConfig(config) {
  if (readEnabled(config) && !configured(config)) throw routeError(config, 'unconfigured')
  return config
}

export const POLICY = `Planner–Executor collaboration (matching planner routes only):
Own requirements, planning, design, decisions and final acceptance. Delegate substantial implementation, file creation/editing, command execution, research and testing to workers; use read-only inspection to plan and verify. Answer simple questions and trivial tasks directly without unnecessary delegation.
For each worker, give a concise self-contained scope, constraints, deliverable and acceptance criteria; request actual test/output evidence and remaining risks, not a transcript. Prefer fresh subagent workers to avoid copying the whole parent history. Use subagent_fork only when the work must read this conversation. Avoid concurrent writers to the same files.
Omit child model selection to use the configured default executor. Explicit supported child provider/model or reasoning selections and tool-configured routes remain authoritative; never invent a route. Research/test may use an explicitly selected authorized model; there is no task-keyword routing. Review evidence, inspect the result and decide acceptance before reporting success.
If execution fails, report the failure or ask for a corrected route; never silently fall back to substantial work on the expensive planner model. Do not retry unboundedly or claim unperformed work/tests. Short tasks may cost more with delegation; total token or cost savings are not guaranteed. Inherited planner-only rules bind the parent, not the worker. This is guidance, not a security boundary.`
const WORKER_NOTE = '[Execution worker role]\nYou are the implementation/execution worker for a planner. Perform the concrete task with available tools. Inherited planner-only delegation rules apply to the parent, not to you. Do not re-delegate this same task merely to obey those rules. Report actual changes, verification evidence, failures and remaining risks. Never claim work or tests you did not do.\n\n'
export function routePrompt(prompt) {
  if (Array.isArray(prompt)) return [{ type: 'text', text: WORKER_NOTE }, ...prompt]
  if (typeof prompt === 'string') return WORKER_NOTE + prompt
  return prompt
}
export function routeRequest(request, target) {
  const agentOptions = { ...request.agentOptions, ...target }
  // Effort is route-owned. Never carry a parent's unsupported effort to another route.
  if (target.reasoningEffort === undefined) delete agentOptions.reasoningEffort
  return { ...request, agentOptions, prompt: routePrompt(request.prompt) }
}

/** Snapshot new activations only. Existing children / follow-up messages are untouched. */
export function apply(ctx, config = {}) {
  validateConfig(config)
  const runtime = ctx.subagents?.[Symbol.for('cordis.original')] ?? ctx.subagents
  if (typeof runtime?.startActivation !== 'function') throw routeError(config, 'unsupported')
  let live = true
  const state = { pluginMounted: true, hookActive: false, strategyEnabled: readEnabled(config), events: [] }
  const record = event => { state.events.push(event); state.events = state.events.slice(-20) }
  const llm = () => ctx.get?.('llm') ?? ctx.llm
  ctx.on('internal/config', (candidate, next) => { validateConfig(candidate); return typeof next === 'function' ? next() : candidate })
  ctx.on('loader/volatile-update', () => { state.strategyEnabled = readEnabled(config) })
  ctx.on('system-prompt/assemble', async (_assembly, _context, next) => {
    const enabledAtEntry = readEnabled(config)
    const assembly = await next()
    const route = { provider: assembly.variables?.provider, model: assembly.variables?.model }
    if (!enabledAtEntry || !readEnabled(config) || !configured(config) || !isPlanner(route, config) || !_context?.agent || isWorker(_context.agent)) return assembly
    return { ...assembly, sections: [...assembly.sections, { name: 'local:planner-executor-routing', text: POLICY, interpolate: false }] }
  }, { prepend: true })

  const prior = Object.getOwnPropertyDescriptor(runtime, 'startActivation')
  const original = runtime.startActivation
  const wrapped = async function (spec) {
    if (!live) return original.call(this, spec)
    const request = spec?.request
    const route = parentRoute(request?.parent)
    const enabledAtEntry = readEnabled(config)
    const pass = async reason => {
      const result = await original.call(this, spec)
      record({ kind: 'pass-through', reason, enabled: readEnabled(config) })
      return result
    }
    if (!enabledAtEntry) return pass('disabled')
    validateConfig(config)
    if (!request || !isPlanner(route, config)) return pass('non-planner')
    if (isWorker(request.parent)) return pass('worker-parent')
    if (hasChildSelection(request)) return pass('child-selection')
    // External backends without Agent option support must retain their own route.
    const backend = typeof runtime.getProvider === 'function' ? runtime.getProvider(spec.provider) : undefined
    if (backend?.capabilities?.agentOptions === false) return pass('backend-route-owned')
    const target = { ...readValue(config.targetRoute) }
    const parentsAtEntry = readValue(config.parentRoutes)
    // An OFF→ON or route edit during await must not resurrect an older decision.
    let invalidated = false
    const off = ctx.on('loader/volatile-update', paths => {
      if (!Array.isArray(paths) || paths.some(path => ['enabled', 'parentRoutes', 'targetRoute'].includes(path?.[0]))) invalidated = true
    })
    const stillCurrent = () => live && !invalidated && readEnabled(config) && configured(config) && isPlanner(parentRoute(request.parent), config) && JSON.stringify(target) === JSON.stringify(readValue(config.targetRoute)) && JSON.stringify(parentsAtEntry) === JSON.stringify(readValue(config.parentRoutes))
    try {
      const service = llm()
      if (typeof service?.resolveCallConfig !== 'function') throw routeError(config, 'llm')
      try { await service.resolveCallConfig(target, spec.signal ?? request.signal) } catch (error) {
        if (!stillCurrent()) return pass('disabled-during-preflight-error')
        record({ kind: 'error', stage: 'preflight' })
        if (error?.code === 'dsh-agent-activity/llm') throw error
        throw Object.assign(routeError(config, 'preflight'), { cause: error })
      }
      if (!stillCurrent()) return pass('disabled-after-preflight')
      const result = await original.call(this, { ...spec, request: routeRequest(request, target) })
      record({ kind: 'routed', enabled: true, target })
      return result
    } finally { if (typeof off === 'function') off() }
  }
  let cleanup
  ctx.effect(() => {
    Object.defineProperty(runtime, 'startActivation', { value: wrapped, writable: true, configurable: true })
    state.hookActive = true
    cleanup = () => {
      live = false
      if (runtime.startActivation === wrapped) {
        if (prior) Object.defineProperty(runtime, 'startActivation', prior)
        else delete runtime.startActivation
      }
      state.hookActive = false
      state.pluginMounted = false
    }
    return cleanup
  })
  const dispose = () => cleanup?.()
  // In-memory test/diagnostic view: no prompts, session ids, files or credentials.
  dispose.status = () => ({ ...state, strategyEnabled: readEnabled(config), events: state.events.map(event => ({ ...event })) })
  return dispose
}
