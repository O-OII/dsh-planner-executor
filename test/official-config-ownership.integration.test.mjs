/** Real Cordis event ownership, isolated in memory. Supply DSH_TEST_ROOT with
 * an official readable runtime; never imports a live Host or user's profile.
 */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import z from '@deepseek-ai/schemastery'
import * as routing from '../routing.mjs'
const suppliedRoot = process.env.DSH_TEST_ROOT

test('real Cordis config waterfall isolates routing from sibling/nested/same-name plugin configs', {
  skip: suppliedRoot ? false : 'Set DSH_TEST_ROOT to a readable official runtime; no real Cordis ownership test was run',
}, async t => {
  const cordisPath = join(resolve(suppliedRoot), 'node_modules', '@deepseek-ai', 'cordis', 'lib', 'index.js')
  const { Context } = await import(pathToFileURL(cordisPath).href)
  const root = new Context()
  t.after(() => root.fiber.dispose())
  root.provide('subagents', { async startActivation() { throw new Error('No real delegation allowed') } })
  root.provide('systemPrompt', {})
  root.provide('llm', { async resolveCallConfig() { throw new Error('No model/provider call allowed') } })
  const first = root.plugin(routing, { enabled: false }); await first
  const firstFiber = first.ctx.fiber
  assert.equal(firstFiber.state, 2)
  const captures = []
  // Deliberately same display name and routing-shaped fields. Identity, never
  // plugin name, ancestry, or config shape, is the ownership authority.
  const unrelated = {
    name: routing.name,
    Config: z.object({ enabled: z.boolean().default(false), parentRoutes: z.array(z.any()).default([]), targetRoute: z.union([z.any(), z.const(null)]).default(null) }),
    apply(ctx, config) { captures.push({ ctx, config }) },
  }
  const sibling = root.plugin(unrelated, { enabled: true, parentRoutes: [], targetRoute: null }); await sibling
  const nested = first.ctx.plugin(unrelated, { enabled: true, parentRoutes: [], targetRoute: null }); await nested
  assert.equal(sibling.ctx.fiber.state, 2); assert.equal(nested.ctx.fiber.state, 2)
  assert.equal(captures.length, 2); assert.equal(captures[0].config.enabled, true); assert.equal(captures[1].config.enabled, true)

  await t.test('sibling and nested edits retain exact next result and run chain once', () => {
    for (const target of [sibling.ctx.fiber, nested.ctx.fiber]) {
      const candidate = { enabled: true, parentRoutes: [], targetRoute: null }, receipt = { untouched: true }
      let nextCalls = 0
      const result = target.ctx.waterfall(target, 'internal/config', candidate, () => { nextCalls++; return receipt })
      assert.equal(result, receipt); assert.equal(nextCalls, 1)
    }
  })
  await t.test('own invalid ON is rejected before innermost persistence callback', () => {
    let writes = 0
    assert.throws(() => firstFiber.ctx.waterfall(firstFiber, 'internal/config', { enabled: true }, () => { writes++; return {} }), error => error.code === 'dsh-agent-activity/unconfigured')
    assert.equal(writes, 0)
  })
  await t.test('own valid ON and OFF preserve waterfall identity and execute next once', () => {
    for (const candidate of [{ enabled: false }, { enabled: true, parentRoutes: [{ provider: 'p', model: 'm' }], targetRoute: { provider: 'e', model: 'm' } }]) {
      let nextCalls = 0
      assert.equal(firstFiber.ctx.waterfall(firstFiber, 'internal/config', candidate, () => { nextCalls++; return candidate }), candidate)
      assert.equal(nextCalls, 1)
    }
  })
  await t.test('a second routing instance validates its own identity, not only first owner', async () => {
    const second = root.plugin(routing, { enabled: false }); await second
    const secondFiber = second.ctx.fiber
    assert.notEqual(firstFiber, secondFiber); assert.equal(secondFiber.state, 2)
    assert.throws(() => secondFiber.ctx.waterfall(secondFiber, 'internal/config', { enabled: true }, () => ({})), /开启前请配置/)
    const candidate = { enabled: true }
    assert.equal(sibling.ctx.waterfall(sibling.ctx.fiber, 'internal/config', candidate, () => candidate), candidate)
  })
})
