import assert from 'node:assert/strict'
import { test } from 'node:test'

import * as routing from '../routing.mjs'

const PLANNER = Object.freeze({ provider: 'openai', model: 'gpt-6.1-sol', reasoningEffort: 'high' })
const TARGET = Object.freeze({ provider: 'example-executor', model: 'deepseek-v4.1', reasoningEffort: 'high' })

/** Build a switchable config reference shaped like the loader's volatile field. */
function makeConfig(enabled) {
  let value = enabled
  return {
    enabled: { get: () => value },
    parentRoutes: [PLANNER], targetRoute: TARGET,
    set(next) {
      value = next
    },
    get value() {
      return value
    },
  }
}

/** Minimal Cordis host context for the real apply() path. */
function makeCtx({ resolveCallConfig } = {}) {
  const handlers = new Map()
  const effects = []
  const llmCalls = []
  const ctx = {
    handlers,
    effects,
    llmCalls,
    on(event, handler) {
      const list = handlers.get(event) ?? []
      list.push(handler)
      handlers.set(event, list)
      return () => {
        const current = handlers.get(event) ?? []
        handlers.set(event, current.filter((entry) => entry !== handler))
      }
    },
    effect(factory) {
      const dispose = factory()
      if (typeof dispose === 'function') effects.push(dispose)
      return dispose
    },
    get(name) {
      if (name !== 'llm') return undefined
      return {
        async resolveCallConfig(target, signal) {
          llmCalls.push({ target, signal })
          await resolveCallConfig?.(target, signal)
          return { provider: target.provider, model: target.model }
        },
      }
    },
    subagents: {
      async startActivation(spec) {
        ctx.calls.push(spec)
        return { childId: `child-${ctx.calls.length}` }
      },
    },
    calls: [],
    logger: { warn() {}, error() {} },
  }
  return ctx
}

/** Mount routing and return its captured pieces. */
function mount(enabled, options = {}) {
  const ctx = makeCtx(options)
  const config = makeConfig(enabled)
  const dispose = routing.apply(ctx, config)
  return { ctx, config, dispose, status: () => dispose.status() }
}

/** Fire the captured system-prompt waterfall. */
async function assemble(ctx, route, mutate) {
  const handler = (ctx.handlers.get('system-prompt/assemble') ?? [])[0]
  assert.equal(typeof handler, 'function', 'assemble handler must be registered')
  const assembly = { variables: route, sections: [{ name: 'base', text: 'base' }] }
  return handler(assembly, {}, async () => {
    await mutate?.()
    return assembly
  })
}

/** A realistic delegation spec whose prompt is an array of content parts. */
function plannerSpec() {
  const parts = [
    { type: 'text', text: 'implement the thing' },
    { type: 'image', data: 'base64-image', mimeType: 'image/png' },
  ]
  return {
    signal: { aborted: false },
    request: {
      parent: { options: { ...PLANNER, maxTokens: 128000 } },
      prompt: parts,
      agentOptions: { ...PLANNER, maxTokens: 128000 },
    },
    parts,
  }
}

test('schemas default OFF and expose exactly one volatile switch', () => {
  assert.equal(routing.Config({}).enabled.get(), false)
  assert.equal(routing.Config({ enabled: true, parentRoutes: [PLANNER], targetRoute: TARGET }).enabled.get(), true)
  const json = JSON.stringify(routing.Config.toJSON())
  assert.match(json, /"volatile":true/)
  assert.match(json, /"enabled"/)
})

test('OFF passes the assembly through without policy', async () => {
  const { ctx, dispose } = mount(false)
  try {
    const out = await assemble(ctx, PLANNER)
    assert.deepEqual(out.sections.map((section) => section.name), ['base'])
  } finally {
    dispose()
  }
})

test('ON adds the planner policy and OFF removes it on the next assembly', async () => {
  const { ctx, config, dispose } = mount(true)
  try {
    const on = await assemble(ctx, PLANNER)
    assert.deepEqual(on.sections.map((section) => section.name), ['base', 'local:planner-executor-routing'])
    assert.equal(on.sections[1].text, routing.POLICY)
    assert.equal(on.sections[1].interpolate, false)

    config.set(false)
    const off = await assemble(ctx, PLANNER)
    assert.deepEqual(off.sections.map((section) => section.name), ['base'])
  } finally {
    dispose()
  }
})

test('policy injection is planner-only', async () => {
  const { ctx, dispose } = mount(true)
  try {
    const other = await assemble(ctx, { provider: 'openai', model: 'gpt-6-luna' })
    assert.deepEqual(other.sections.map((section) => section.name), ['base'])
  } finally {
    dispose()
  }
})

test('a switch flipped during assembly suppresses the policy', async () => {
  const { ctx, config, dispose } = mount(true)
  try {
    const out = await assemble(ctx, PLANNER, async () => {
      config.set(false)
    })
    assert.deepEqual(out.sections.map((section) => section.name), ['base'])
  } finally {
    dispose()
  }
})

test('OFF delegation is native: no preflight, no agentOptions, same spec', async () => {
  const { ctx, status, dispose } = mount(false)
  try {
    const spec = plannerSpec()
    const result = await ctx.subagents.startActivation(spec)
    assert.equal(result.childId, 'child-1')
    assert.equal(ctx.calls[0], spec)
    assert.equal(ctx.llmCalls.length, 0)
    assert.deepEqual(spec.request.agentOptions, { ...PLANNER, maxTokens: 128000 })
    assert.equal(spec.request.prompt, spec.parts)
    const persisted = status()
    assert.equal(persisted.pluginMounted, true)
    assert.equal(persisted.hookActive, true)
    assert.equal(persisted.strategyEnabled, false)
    assert.equal(persisted.events.at(-1).kind, 'pass-through')
    assert.equal(persisted.events.at(-1).reason, 'disabled')
  } finally {
    dispose()
  }
})

test('ON routes a planner to example-executor DS4.1 and preserves every prompt part', async () => {
  const { ctx, status, dispose } = mount(true)
  try {
    const spec = plannerSpec()
    await ctx.subagents.startActivation(spec)
    assert.equal(ctx.llmCalls.length, 1)
    assert.deepEqual(ctx.llmCalls[0].target, TARGET)

    const forwarded = ctx.calls[0]
    assert.notEqual(forwarded, spec)
    // Route fields are forced; unrelated options (here maxTokens) stay intact.
    assert.deepEqual(forwarded.request.agentOptions, { ...PLANNER, maxTokens: 128000, ...TARGET })
    assert.equal(forwarded.request.prompt.length, 3)
    assert.equal(forwarded.request.prompt[0].type, 'text')
    assert.match(forwarded.request.prompt[0].text, /^\[Execution worker role\]/)
    assert.equal(forwarded.request.prompt[1], spec.parts[0])
    assert.equal(forwarded.request.prompt[2], spec.parts[1])
    assert.equal(forwarded.request.prompt[2].data, 'base64-image')
    // The caller's object is never mutated.
    assert.equal(spec.request.prompt, spec.parts)
    assert.deepEqual(spec.request.agentOptions, { ...PLANNER, maxTokens: 128000 })

    const event = status().events.at(-1)
    assert.equal(event.kind, 'routed')
    assert.equal(event.enabled, true)
    assert.deepEqual(event.target, TARGET)
    assert.equal(ctx.calls.length, 1)
  } finally {
    dispose()
  }
})

test('non-planner parents are never preflighted or rerouted even when ON', async () => {
  const { ctx, dispose } = mount(true)
  try {
    const spec = {
      request: { parent: { options: { provider: 'openai', model: 'gpt-6-luna' } }, prompt: 'do it' },
    }
    await ctx.subagents.startActivation(spec)
    assert.equal(ctx.llmCalls.length, 0)
    assert.equal(ctx.calls[0], spec)
    assert.equal(spec.request.prompt, 'do it')
  } finally {
    dispose()
  }
})

test('a switch turned off during preflight aborts routing and passes the original spec', async () => {
  const { ctx, config, status, dispose } = mount(true, {
    resolveCallConfig: async () => {
      config.set(false)
    },
  })
  try {
    const spec = plannerSpec()
    await ctx.subagents.startActivation(spec)
    assert.equal(ctx.llmCalls.length, 1)
    assert.equal(ctx.calls[0], spec)
    assert.equal(spec.request.prompt, spec.parts)
    assert.deepEqual(spec.request.agentOptions, { ...PLANNER, maxTokens: 128000 })
    const event = status().events.at(-1)
    assert.equal(event.kind, 'pass-through')
    assert.equal(event.reason, 'disabled-after-preflight')
    assert.equal(event.enabled, false)
  } finally {
    dispose()
  }
})

test('a preflight failure after the switch was turned off never blocks native delegation', async () => {
  const { ctx, config, status, dispose } = mount(true, {
    resolveCallConfig: async () => {
      config.set(false)
      throw new Error('target no longer available')
    },
  })
  try {
    const spec = plannerSpec()
    const result = await ctx.subagents.startActivation(spec)
    assert.equal(result.childId, 'child-1')
    assert.equal(ctx.calls[0], spec)
    assert.equal(spec.request.prompt, spec.parts)
    assert.deepEqual(spec.request.agentOptions, { ...PLANNER, maxTokens: 128000 })
    const event = status().events.at(-1)
    assert.equal(event.kind, 'pass-through')
    assert.equal(event.reason, 'disabled-during-preflight-error')
    assert.equal(event.enabled, false)
  } finally {
    dispose()
  }
})

test('policy no longer promises an unchanged fork route', () => {
  assert.doesNotMatch(routing.POLICY, /fork children inherit your own route/)
  assert.match(routing.POLICY, /subagent_fork only when the work must read this conversation/)
})

test('preflight failure aborts that delegation with a diagnostic', async () => {
  const { ctx, status, dispose } = mount(true, {
    resolveCallConfig: async () => {
      throw new Error('model unavailable')
    },
  })
  try {
    await assert.rejects(() => ctx.subagents.startActivation(plannerSpec()), /目标路由验证失败/)
    assert.equal(ctx.calls.length, 0)
    const event = status().events.at(-1)
    assert.equal(event.kind, 'error')
    assert.equal(event.stage, 'preflight')
    // No prompt text or key material is persisted.
    assert.doesNotMatch(JSON.stringify(status()), /implement the thing|base64-image/)
  } finally {
    dispose()
  }
})

test('a volatile update refreshes the diagnostic state in place', async () => {
  const { ctx, config, status, dispose } = mount(false)
  try {
    assert.equal(status().strategyEnabled, false)
    config.set(true)
    for (const handler of ctx.handlers.get('loader/volatile-update') ?? []) handler()
    assert.equal(status().strategyEnabled, true)
    config.set(false)
    for (const handler of ctx.handlers.get('loader/volatile-update') ?? []) handler()
    assert.equal(status().strategyEnabled, false)
  } finally {
    dispose()
  }
})
