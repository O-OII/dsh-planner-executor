import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ctxFixture } from './fixture.mjs'
import * as routing from '../routing.mjs'

test('config guard validates only the exact owning fiber, not enabled field shape or plugin name', () => {
  const ctx = ctxFixture(); const dispose = routing.apply(ctx, { enabled: false })
  const guard = ctx.events.get('internal/config')[0]
  const invalid = { enabled: true }
  let nextCalls = 0
  assert.throws(() => guard.call(ctx.fiber, invalid, () => { nextCalls++; return invalid }), /开启前请配置/)
  assert.equal(nextCalls, 0)
  for (const target of [{}, { parent: ctx }, { name: 'planner-executor-routing' }, null, undefined]) {
    const sentinel = { enabled: true, parentRoutes: [], targetRoute: null, sentinel: target }
    assert.equal(guard.call(target, invalid, () => { nextCalls++; return sentinel }), sentinel)
  }
  assert.equal(nextCalls, 5)
  dispose()
})
test('config guard unwraps Cordis identity proxies but never accepts another fiber', () => {
  const ctx = ctxFixture(), owner = ctx.fiber, original = Symbol.for('cordis.original')
  ctx.fiber = { [original]: owner }; const dispose = routing.apply(ctx, { enabled: false })
  const guard = ctx.events.get('internal/config')[0], candidate = { enabled: true }
  assert.throws(() => guard.call({ [original]: owner }, candidate, () => candidate), /开启前请配置/)
  assert.equal(guard.call({ [original]: {} }, candidate, () => candidate), candidate)
  dispose()
})
