import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { ctxFixture, routeConfig } from './fixture.mjs'
import * as routing from '../routing.mjs'
const config = { ...routeConfig, enabled: true }
const planner = extra => ({ options: { ...routeConfig.parentRoutes[0], reasoningEffort: 'planner-only', ...extra } })

test('default executor applies to route-omitted fresh/fork activations and preserves unrelated options', async () => {
  for (const provider of ['fresh', 'fork']) {
    const ctx = ctxFixture(); const dispose = routing.apply(ctx, config)
    const spec = { provider, request: { parent: planner(), agentOptions: { maxTokens: 64 }, prompt: 'scope + acceptance' } }
    await ctx.subagents.startActivation(spec)
    assert.deepEqual(ctx.calls[0].request.agentOptions, { ...routeConfig.targetRoute, maxTokens: 64 })
    assert.equal(spec.request.agentOptions.reasoningEffort, undefined); dispose()
  }
})
test('explicit child routes, equal-parent choices, configured defaults and effort-only selections take priority', async () => {
  for (const agentOptions of [{ provider: 'test-provider', model: 'test-model' }, { ...routeConfig.parentRoutes[0] }, { provider: 'configured-tool', model: 'model', reasoningEffort: 'high' }, { reasoningEffort: 'low' }, { provider: 'partial-configured-provider' }]) {
    const ctx = ctxFixture(); let preflights = 0; ctx.llm.resolveCallConfig = () => { preflights++ }
    const dispose = routing.apply(ctx, config), spec = { request: { parent: planner(), agentOptions, prompt: [{ type: 'text', text: 'task' }] } }
    await ctx.subagents.startActivation(spec)
    assert.equal(ctx.calls[0], spec); assert.equal(preflights, 0); assert.equal(dispose.status().events.at(-1).reason, 'child-selection'); dispose()
  }
})
test('actual latest request route decides parent match, not stale agent creation options', async () => {
  const ctx = ctxFixture(), dispose = routing.apply(ctx, config)
  const parent = { options: { provider: 'stale', model: 'stale' }, session: { requestHeader: () => ({ config: routeConfig.parentRoutes[0] }) } }
  const spec = { request: { parent, prompt: 'task' } }; await ctx.subagents.startActivation(spec)
  assert.deepEqual(ctx.calls[0].request.agentOptions, routeConfig.targetRoute); dispose()
})
test('same-model workers never receive fresh planner policy or automatic descendant routing', async () => {
  for (const marker of [{ options: { subagentDepth: 1 } }, { session: { header: { parentSession: 'parent' } } }]) {
    const ctx = ctxFixture(), sameRouteConfig = { ...config, targetRoute: routeConfig.parentRoutes[0] }, dispose = routing.apply(ctx, sameRouteConfig)
    const worker = { options: { ...routeConfig.parentRoutes[0], ...marker.options }, session: marker.session }
    const assembly = { variables: routeConfig.parentRoutes[0], sections: [] }
    const out = await ctx.events.get('system-prompt/assemble')[0](assembly, { agent: worker }, async () => assembly)
    assert.equal(out, assembly)
    const spec = { request: { parent: worker, prompt: 'do not re-delegate recursively' } }; await ctx.subagents.startActivation(spec)
    assert.equal(ctx.calls[0], spec); assert.equal(dispose.status().events.at(-1).reason, 'worker-parent'); dispose()
  }
})
test('planner policy requires official assembly agent context; no text-keyword role inference', async () => {
  const ctx = ctxFixture(), dispose = routing.apply(ctx, config), assembly = { variables: routeConfig.parentRoutes[0], sections: [] }
  const assemble = ctx.events.get('system-prompt/assemble')[0]
  assert.equal(await assemble(assembly, {}, async () => assembly), assembly)
  assert.equal((await assemble(assembly, { agent: planner() }, async () => assembly)).sections[0].text, routing.POLICY)
  assert.match(routing.POLICY, /scope, constraints, deliverable and acceptance criteria/)
  assert.match(routing.POLICY, /total token or cost savings are not guaranteed/)
  assert.match(routing.POLICY, /fresh subagent workers/); dispose()
})
test('external backends without AgentOptions support retain their own execution route', async () => {
  const ctx = ctxFixture(); ctx.subagents.getProvider = () => ({ capabilities: { agentOptions: false } })
  const dispose = routing.apply(ctx, config), spec = { provider: 'external', request: { parent: planner(), prompt: 'task' } }
  await ctx.subagents.startActivation(spec); assert.equal(ctx.calls[0], spec); assert.equal(dispose.status().events.at(-1).reason, 'backend-route-owned'); dispose()
})
test('package retains stable IDs and declares rc.2-to-0.3 compatibility range rather than exact rc.2', () => {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  assert.equal(pkg.name, 'dsh-agent-activity'); assert.equal(pkg.version, '0.3.0'); assert.equal(pkg.engines.dsh, '>=0.2.1-rc.2 <0.3.0')
  assert.equal(routing.name, 'planner-executor-routing')
})
