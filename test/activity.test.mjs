import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'

import * as host from '../index.mjs'

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const bundleSource = readFileSync(new URL('../client.js', import.meta.url), 'utf8')

/**
 * Evaluate the production browser bundle in a tiny loader shim so its pure
 * helpers and slot registration can be checked without a real browser.
 * @returns {Record<string, any>} bundle exports.
 */
function loadBundle() {
  let definition
  class Component {
    constructor(props) {
      this.props = props
      this.state = {}
    }

    setState(next) {
      this.state = { ...this.state, ...(typeof next === 'function' ? next(this.state) : next) }
    }
  }
  const React = {
    createElement(type, props, ...children) {
      return { type, props: props ?? {}, children }
    },
    useState(initial) {
      return [typeof initial === 'function' ? initial() : initial, () => {}]
    },
    useEffect() {},
    useMemo(factory) {
      return factory()
    },
    useRef(value) {
      return { current: value }
    },
    Component,
  }
  const context = vm.createContext({
    console,
    URLSearchParams,
    AbortController,
    Date,
    Math,
    Number,
    String,
    Object,
    Array,
    window: {
      __ModuleLoader__: {
        load(value) {
          definition = value
        },
      },
    },
  })
  new vm.Script(bundleSource, { filename: 'client.js' }).runInContext(context)
  assert.ok(definition, 'bundle must register with window.__ModuleLoader__')
  const result = definition.factory((id) => {
    if (id === 'react') return React
    throw new Error(`unexpected external module: ${id}`)
  })
  result.__test.setLocale('zh-CN')
  return result
}

const usage = (uncachedInputTokens, outputTokens, cacheReadTokens, cacheWriteTokens) => ({
  uncachedInputTokens,
  outputTokens,
  cacheReadTokens,
  cacheWriteTokens,
})

const event = (type, seq, time, data) => ({ type, seq, time, data })

/**
 * Fold host turn events with the exported projection definition and validate
 * both state and wire through the schemas the real registry uses.
 * @param {Array<Record<string, any>>} events - committed events.
 * @param {number} inheritedEventCount - fork-inherited prefix length.
 * @returns {{ state: Record<string, any>, view: Record<string, any> }} folded result.
 */
function foldTurns(events, inheritedEventCount = 0) {
  const definition = host.localSubagentActivityTurnsDefinition
  let state = definition.init({}, inheritedEventCount)
  for (const item of events) state = definition.apply(state, item)
  state = definition.stateSchema.parse(state)
  return { state, view: definition.wire.viewSchema.parse(definition.wire.view(state)) }
}

test('host half imports without side effects', () => {
  assert.equal(host.name, 'subagent-activity')
  assert.deepEqual(host.inject, ['clientModules', 'sessionProjections'])
  assert.equal(typeof host.apply, 'function')
})

test('host projection groups local children by finished parent turn', () => {
  const { state, view } = foldTurns([
    event('turn/start', 1, 100, { turn: 1 }),
    event('subagent/catalog', 2, 110, { version: 0, childId: 'c1', childCreatedAt: 110, mode: 'continuable', label: 'a' }),
    event('turn/end', 3, 150, { turn: 1, reason: { kind: 'completed' } }),
    event('turn/start', 4, 200, { turn: 2 }),
    event('subagent/catalog', 5, 210, { version: 0, childId: 'c2', childCreatedAt: 210, mode: 'continuable', label: 'b' }),
    event('turn/end', 6, 250, { turn: 2, reason: { kind: 'interrupted' } }),
    event('turn/start', 7, 300, { turn: 3 }),
    event('turn/end', 8, 350, { turn: 3, reason: { kind: 'completed' } }),
  ])
  assert.equal(state.currentTurn, null)
  assert.deepEqual(view.currentTurn, null)
  assert.deepEqual(view.lastTurns, [
    { turn: 2, childIds: ['c2'] },
    { turn: 1, childIds: ['c1'] },
  ])
  assert.deepEqual(view.unknownChildIds, [])
})

test('host projection keeps the latest two non-empty groups and ignores old ends', () => {
  const { state, view } = foldTurns([
    event('turn/start', 1, 100, { turn: 1 }),
    event('subagent/catalog', 2, 110, { version: 0, childId: 'c1', childCreatedAt: 110, mode: 'one-shot' }),
    event('turn/end', 3, 150, { turn: 1 }),
    event('turn/start', 4, 200, { turn: 2 }),
    event('subagent/catalog', 5, 210, { version: 0, childId: 'c2', childCreatedAt: 210, mode: 'continuable' }),
    event('turn/end', 6, 250, { turn: 2 }),
    event('turn/start', 7, 300, { turn: 3 }),
    event('subagent/catalog', 8, 310, { version: 0, childId: 'c3', childCreatedAt: 310, mode: 'continuable' }),
    event('turn/end', 9, 350, { turn: 3 }),
    event('turn/start', 10, 400, { turn: 4 }),
    // A replayed old end must not clear the newer current turn.
    event('turn/end', 11, 410, { turn: 1 }),
  ])
  assert.equal(state.currentTurn, 4)
  assert.deepEqual(view.lastTurns, [
    { turn: 3, childIds: ['c3'] },
    { turn: 2, childIds: ['c2'] },
  ])
})

test('host projection keeps migration, late and duplicate catalog members unknown', () => {
  const { state, view } = foldTurns([
    event('turn/start', 1, 100, { turn: 1 }),
    event('subagent/catalog', 2, 110, { version: 0, childId: 'c1', childCreatedAt: 110, mode: 'continuable' }),
    event('turn/end', 3, 150, { turn: 1 }),
    event('turn/start', 4, 400, { turn: 4 }),
    event('subagent/catalog', 5, 405, { version: 1, childId: 'legacy', childCreatedAt: 410, mode: 'continuable' }),
    event('subagent/catalog', 6, 406, { version: 0, childId: 'late', childCreatedAt: 390, mode: 'continuable' }),
    event('subagent/catalog', 7, 407, { version: 2, childId: 'external', childCreatedAt: 410, mode: 'external', label: 'external' }),
    event('subagent/catalog', 8, 408, { version: 0, childId: 'c1', childCreatedAt: 410, mode: 'continuable' }),
    event('subagent/catalog', 9, 409, { version: 0, childId: 'c4', childCreatedAt: 420, mode: 'continuable' }),
    event('turn/end', 10, 450, { turn: 4 }),
  ])
  assert.equal(state.currentTurn, null)
  assert.deepEqual(view.lastTurns[0], { turn: 4, childIds: ['c4'] })
  assert.deepEqual(view.unknownChildIds, ['legacy', 'late'])
  assert.equal(view.lastTurns[0].childIds.includes('c1'), false)
})

test('host projection ignores the fork-inherited prefix', () => {
  const { view } = foldTurns(
    [
      event('turn/start', 1, 100, { turn: 1 }),
      event('subagent/catalog', 2, 110, { version: 0, childId: 'ancestor', childCreatedAt: 110, mode: 'continuable' }),
      event('turn/end', 3, 150, { turn: 1 }),
      event('turn/start', 5, 200, { turn: 2 }),
      event('subagent/catalog', 6, 210, { version: 0, childId: 'own', childCreatedAt: 210, mode: 'continuable' }),
      event('turn/end', 7, 250, { turn: 2 }),
    ],
    5,
  )
  assert.deepEqual(view.lastTurns, [{ turn: 2, childIds: ['own'] }])
  assert.deepEqual(view.unknownChildIds, [])
})

test('host projection replay is deterministic and idempotent', () => {
  const events = [
    event('turn/start', 1, 100, { turn: 1 }),
    event('subagent/catalog', 2, 110, { version: 0, childId: 'c1', childCreatedAt: 110, mode: 'continuable' }),
    event('turn/end', 3, 150, { turn: 1 }),
    event('turn/start', 4, 200, { turn: 2 }),
    event('subagent/catalog', 5, 210, { version: 0, childId: 'c2', childCreatedAt: 210, mode: 'one-shot' }),
    event('turn/end', 6, 250, { turn: 2 }),
  ]
  const first = foldTurns(events)
  const second = foldTurns(events)
  assert.deepEqual(second.view, first.view)
  // Replaying a duplicate catalog member into the replay fold must not add it
  // twice to the current/previous group.
  const state = first.state
  const duplicate = host.localSubagentActivityTurnsDefinition.apply(
    state,
    event('subagent/catalog', 7, 260, { version: 0, childId: 'c2', childCreatedAt: 210, mode: 'one-shot' }),
  )
  assert.deepEqual(duplicate.lastTurns, first.view.lastTurns)
})

test('host projection registers the real registry contract and validates schemas', () => {
  let captured
  const disposer = () => {}
  const returned = host.registerLocalSubagentActivityTurns({
    register(definition) {
      captured = definition
      return disposer
    },
  })
  assert.equal(returned, disposer)
  assert.equal(captured.key, 'localSubagentActivityTurns')
  assert.equal(captured.stateVersion, 2)
  assert.equal(typeof captured.init, 'function')
  assert.equal(typeof captured.apply, 'function')
  assert.equal(typeof captured.stateSchema.parse, 'function')
  assert.equal(typeof captured.wire.viewSchema.parse, 'function')
  assert.throws(() => captured.stateSchema.parse({ currentTurn: null }), /exactly/)
  assert.throws(
    () => captured.wire.viewSchema.parse({ currentTurn: null, lastTurns: [], unknownChildIds: [], extra: true }),
    /exactly/,
  )
  assert.throws(
    () => captured.wire.viewSchema.parse({ currentTurn: null, lastTurns: [{ turn: 1, childIds: ['a', 'a'] }], unknownChildIds: [] }),
    /duplicate/,
  )
  const state = captured.init({}, 0)
  const first = captured.wire.view(state)
  assert.equal(captured.wire.view(state), first, 'unchanged state reuses its wire view object')
  assert.equal(captured.apply(state, event('tool/call', 1, 1, {})), state, 'unrelated events keep the state reference')
})

test('package and bundle identities line up for the DSH client scanner', () => {
  assert.equal(packageJson.name, 'dsh-agent-activity')
  assert.equal(packageJson.type, 'module')
  assert.equal(packageJson.main, './index.mjs')
  assert.equal(packageJson.dsh.client.platform, 'web')
  assert.ok(packageJson.dsh.client.inject.includes('@deepseek-ai/dsh-client-ui-layout'))
  assert.ok(packageJson.dsh.client.inject.includes('@deepseek-ai/dsh-api-remotes'))
  assert.equal(packageJson.exports['.'], './index.mjs')
  assert.equal(packageJson.exports['./client'], './client.js')
  assert.match(bundleSource, /id:\s*"dsh-agent-activity"/)
})

test('apply registers one additive shell.overlay entry and wires navigation', async () => {
  const plugin = loadBundle()
  // Official Cordis contract: namespace services are dependencies, not root
  // bridge properties. All are unconditionally mounted by dsh-api-remotes.
  assert.deepEqual(
    [...plugin.inject],
    ['sessions', 'slots', 'uiWorkspace', 'remote', 'remote.session'],
  )

  const calls = []
  const signal = new AbortController().signal
  const ctx = {
    sessions: {},
    uiWorkspace: {
      openSession(target) {
        calls.push(['open', target])
      },
    },
    remote: {
      $on(event, listener) {
        calls.push(['on', event, typeof listener])
        return () => {}
      },
      session: {
        projections(request, requestSignal) {
          calls.push(['projections', request.sessionId, requestSignal === signal])
          return Promise.resolve({ ok: true, value: { kind: 'sequenced', asOfSeq: 7, values: {} } })
        },
      },
      subagents: {
        interruptByParent(childId, parentId, mode) {
          calls.push(['stop', childId, parentId, mode])
          return Promise.resolve({ ok: true, value: { accepted: true } })
        },
      },
      settings: {
        describe() {
          calls.push(['describe'])
          return Promise.resolve({
            ok: true,
            value: {
              writable: true,
              hasDocument: true,
              namespaces: [{ ns: 'planner-executor-routing', revision: 4, value: { enabled: false } }],
            },
          })
        },
        update(ns, patch, revision) {
          calls.push(['update', ns, patch.enabled, revision])
          return Promise.resolve({ ok: true, value: { ns, revision: revision + 1, value: { enabled: patch.enabled } } })
        },
      },
    },
    on(event, listener) {
      calls.push(['host-on', event, typeof listener])
      return () => {}
    },
    slots: {
      inject(name, callback) {
        calls.push(['inject', name])
        return callback()
      },
      register(options, component) {
        calls.push(['register', options, component])
        return () => {}
      },
    },
  }

  plugin.apply(ctx)
  assert.deepEqual(calls[0], ['inject', 'shell.overlay'])
  const registration = calls.find((call) => call[0] === 'register')
  assert.equal(registration[1].name, 'shell.overlay')
  assert.equal(registration[1].id, 'subagent-activity')
  assert.equal(registration[1].order, 120)
  assert.equal(registration[1].label, '代理活动')
  assert.equal(typeof registration[2], 'function')

  const { actions } = registration[1].inject()
  const fetched = await actions.fetchProjections('child', signal)
  assert.equal(fetched.ok, true)
  const described = await actions.readStrategy()
  assert.equal(described.ok, true)
  assert.equal(described.value.namespaces[0].ns, 'planner-executor-routing')
  const written = await actions.writeStrategy(true, 4)
  assert.equal(written.ok, true)
  assert.equal(written.value.revision, 5)
  actions.openMain('main')
  actions.openChild({ parentSessionId: 'main', childSessionId: 'child', mode: 'continuable' })
  actions.continueChild({ parentSessionId: 'main', childSessionId: 'child', mode: 'continuable' })
  await actions.stop('child', 'main')
  const dispose = actions.onStrategyChanged(() => {})
  assert.equal(typeof dispose, 'function')
  dispose()

  assert.deepEqual(calls.find((call) => call[0] === 'projections'), ['projections', 'child', true])
  assert.deepEqual(calls.find((call) => call[0] === 'update'), ['update', 'planner-executor-routing', true, 4])
  assert.deepEqual(calls.find((call) => call[0] === 'on'), ['on', 'settings/document-updated', 'function'])
  const opened = calls.filter((call) => call[0] === 'open')
  assert.equal(opened.length, 3)
  assert.equal(opened[0][1], 'main')
  assert.deepEqual({ ...opened[1][1] }, { parentSessionId: 'main', childSessionId: 'child', mode: 'continuable' })
  assert.deepEqual({ ...opened[2][1] }, { parentSessionId: 'main', childSessionId: 'child', mode: 'continuable' })
  assert.deepEqual(calls.find((call) => call[0] === 'stop'), ['stop', 'child', 'main', 'continuable'])
})

test('settings read reports unavailable when the injected service is absent', async () => {
  const plugin = loadBundle()
  let registration
  const ctx = {
    remote: { $on: () => () => {} },
    on: () => () => {},
    slots: {
      inject: (name, callback) => callback(),
      register: (options) => {
        registration = options
        return () => {}
      },
    },
    uiWorkspace: { openSession() {} },
  }
  plugin.apply(ctx)
  const { actions } = registration.inject()
  const result = await actions.readStrategy()
  assert.equal(result.ok, false)
  assert.match(result.error.message, /remote\.settings 不可用/)
})

test('stop reports unavailable remote instead of throwing', async () => {
  const plugin = loadBundle()
  const ctx = {
    sessions: { refreshProjections: () => Promise.resolve() },
    uiWorkspace: { openSession() {} },
    slots: {
      inject: (name, callback) => callback(),
      register: () => () => {},
    },
  }
  plugin.apply(ctx)
  // Reach the injected action through the registration recorded by this ctx.
  const registrations = []
  ctx.slots.register = (options, component) => {
    registrations.push([options, component])
    return () => {}
  }
  plugin.apply(ctx)
  const { actions } = registrations[0][0].inject()
  const result = await actions.stop('child', 'main')
  assert.equal(result.ok, false)
  assert.match(result.error.message, /subagents/)
})

test('token and duration helpers never render undefined', () => {
  const { __test } = loadBundle()
  assert.equal(__test.formatTokens(0), '0')
  assert.equal(__test.formatTokens(999), '999')
  assert.equal(__test.formatTokens(1500), '1.5K')
  assert.equal(__test.formatTokens(1_250_000), '1.3M')
  assert.equal(__test.formatTokens(undefined), '—')
  assert.equal(__test.tokenTotal(usage(1000, 500, 200, 50)), 1750)
  assert.equal(__test.tokenTotal(undefined), undefined)
  assert.equal(__test.tokenTotal({}), undefined)
  assert.equal(__test.formatDuration(0), '0s')
  assert.equal(__test.formatDuration(65_000), '1m05s')
  assert.equal(__test.formatDuration(3_665_000), '1h01m')
  assert.equal(__test.formatDuration(undefined), '—')
  assert.equal(__test.activityDuration(undefined, true, 1000), undefined)
  assert.equal(__test.activityDuration({ settledMs: 5000 }, false, 1000), 5000)
  assert.equal(
    __test.activityDuration({ settledMs: 5000, active: { since: 900_000, through: 950_000 } }, false, 1_000_000),
    55_000,
  )
  assert.equal(
    __test.activityDuration({ settledMs: 5000, active: { since: 900_000, through: 950_000 } }, true, 1_000_000),
    105_000,
  )
})

test('status classification distinguishes running, completed and inactive', () => {
  const { __test } = loadBundle()
  assert.equal(__test.statusOf({ running: true }), 'running')
  assert.equal(__test.statusOf({ running: false, timing: { lastTurnCompleted: true } }), 'completed')
  assert.equal(__test.statusOf({ running: false, timing: { lastTurnCompleted: false } }), 'inactive')
  assert.equal(__test.statusOf({ running: false, timing: { lastTurnCompleted: true }, external: true }), 'inactive')
  assert.equal(__test.statusOf({}), 'inactive')
})

test('direct children come from the catalog, then from the session list fallback', () => {
  const { __test } = loadBundle()
  const catalog = [{ id: 'c1', label: 'executor', mode: 'continuable', createdAt: 1 }]
  assert.deepEqual(
    __test.collectChildEntries('main', { main: { values: { subagentCatalog: catalog } } }, {}),
    catalog,
  )
  const projections = { main: { values: {} } }
  const byId = {
    main: { id: 'main' },
    c1: { id: 'c1', parentId: 'main', origin: 'subagent', title: 'executor', updatedAt: 2 },
    c2: { id: 'c2', parentId: 'main', origin: 'subagent', displayTitle: 'review', updatedAt: 1 },
    grandchild: { id: 'grandchild', parentId: 'c1', origin: 'subagent' },
  }
  const fallback = __test.collectChildEntries('main', projections, byId)
  assert.deepEqual(
    fallback.map((entry) => entry.id),
    ['c2', 'c1'],
  )
  assert.equal(fallback[0].mode, 'unknown')
  assert.equal(fallback[1].label, 'executor')
})

test('buildRows exposes routes, tokens, duration and actions for main and direct children', () => {
  const { __test } = loadBundle()
  const now = 1_000_000
  const byId = {
    main: { id: 'main', displayTitle: '主会话', title: '主会话标题', retainedBy: { mainView: 1 }, running: false },
    c1: { id: 'c1', parentId: 'main', origin: 'subagent', title: '执行任务', running: true },
    c2: { id: 'c2', parentId: 'main', origin: 'subagent', running: false },
    ext: { id: 'ext', parentId: 'main', origin: 'subagent', running: false },
  }
  const projections = {
    main: {
      state: 'ready',
      values: {
        subagentCatalog: [
          { id: 'c1', label: 'executor', mode: 'continuable', createdAt: 1 },
          { id: 'c2', label: 'review', mode: 'one-shot', createdAt: 2 },
          { id: 'ext', label: 'external', mode: 'external', createdAt: 3 },
        ],
        modelSelection: { lastUsed: { provider: 'openai', model: 'gpt-6.1-sol', reasoningEffort: 'high' }, next: null },
        tokenUsage: usage(1000, 500, 200, 50),
        // No registered main-turn timing projection exists in 0.2.1-rc.2. A
        // stray turnTiming/subagentTiming field must not become elapsed time.
        turnTiming: { settledMs: 5000 },
        turnOutline: [{ turn: 1, seq: 1, prompt: '检查登录流程并修复错误', response: '已修复并补充测试' }],
      },
    },
    c1: {
      state: 'ready',
      values: {
        subagent: { mode: 'continuable', label: 'executor' },
        modelSelection: { lastUsed: { provider: 'example-executor', model: 'deepseek-v4.1', reasoningEffort: 'high' } },
        tokenUsage: usage(2000, 1000, 400, 100),
        subagentTiming: { settledMs: 65_000, active: { since: 900_000, through: 950_000 } },
        turnOutline: [{ turn: 2, seq: 9, prompt: '实现导出接口', response: '' }],
      },
    },
    c2: {
      state: 'ready',
      values: {
        subagent: { mode: 'one-shot' },
        subagentTiming: { settledMs: 12_000, lastTurnCompleted: true },
      },
    },
    ext: { state: 'ready', values: {} },
  }
  const statuses = new Map([['c1', { running: true }]])
  const { rows, projectionState, catalogState } = __test.buildRows({ mainId: 'main', byId, projections, statuses, now })

  assert.equal(projectionState, 'ready')
  assert.equal(catalogState, 'ready')
  assert.equal(rows.length, 4)

  const [main, c1, c2, ext] = rows
  assert.equal(main.kind, 'main')
  assert.equal(main.label, '主会话')
  assert.equal(main.title, '主会话标题')
  assert.equal(main.provider, 'openai')
  assert.equal(main.model, 'gpt-6.1-sol')
  assert.equal(main.reasoning, 'high')
  assert.equal(main.modelRecorded, true)
  assert.equal(main.status, 'inactive')
  assert.equal(main.tokens, 1750)
  assert.equal(main.durationMs, undefined)
  assert.deepEqual(
    { kind: main.recentTask.kind, text: main.recentTask.text, turn: main.recentTask.turn },
    { kind: 'prompt', text: '检查登录流程并修复错误', turn: 1 },
  )

  assert.equal(c1.kind, 'subagent')
  assert.equal(c1.label, 'executor')
  assert.equal(c1.title, '执行任务')
  assert.equal(c1.provider, 'example-executor')
  assert.equal(c1.model, 'deepseek-v4.1')
  assert.equal(c1.reasoning, 'high')
  assert.equal(c1.modelRecorded, true)
  assert.equal(c1.status, 'running')
  assert.equal(c1.tokens, 3500)
  assert.equal(c1.durationMs, 165_000)
  assert.deepEqual(
    { kind: c1.recentTask.kind, text: c1.recentTask.text, turn: c1.recentTask.turn },
    { kind: 'prompt', text: '实现导出接口', turn: 2 },
  )
  assert.equal(c1.canOpen, true)
  assert.equal(c1.canContinue, true)
  assert.equal(c1.canStop, true)
  assert.deepEqual(
    { parentSessionId: c1.address.parentSessionId, childSessionId: c1.address.childSessionId, mode: c1.address.mode },
    { parentSessionId: 'main', childSessionId: 'c1', mode: 'continuable' },
  )

  assert.equal(c2.status, 'completed')
  assert.equal(c2.durationMs, 12_000)
  assert.equal(c2.canOpen, true)
  assert.equal(c2.canContinue, false)
  assert.equal(c2.canStop, false)
  assert.equal(c2.recentTask, undefined)

  assert.equal(ext.external, true)
  assert.equal(ext.status, 'inactive')
  assert.equal(ext.tokens, undefined)
  assert.equal(ext.durationMs, undefined)
  assert.equal(ext.canOpen, false)
  assert.equal(ext.canContinue, false)
  assert.equal(ext.canStop, false)
})

test('an unresolved selected child is labelled current session, not main agent', () => {
  const { __test } = loadBundle()
  const byId = { child: { id: 'child', retainedBy: { mainView: 1 }, origin: 'subagent' } }
  const { rows } = __test.buildRows({ mainId: 'child', byId, projections: {}, mainIsRoot: false })
  assert.equal(rows[0].kind, 'current')
  assert.equal(rows[0].canStop, false)
})

test('missing projections degrade to unknown/em dash without throwing', () => {
  const { __test } = loadBundle()
  const byId = { main: { id: 'main', retainedBy: { mainView: 1 } } }
  const { rows, projectionState, catalogState } = __test.buildRows({
    mainId: 'main',
    byId,
    projections: {},
    statuses: undefined,
    now: 1,
  })
  assert.equal(projectionState, 'loading')
  assert.equal(catalogState, 'loading')
  assert.equal(rows.length, 1)
  assert.equal(rows[0].label, 'main')
  assert.equal(rows[0].provider, undefined)
  assert.equal(rows[0].model, undefined)
  assert.equal(rows[0].reasoning, undefined)
  assert.equal(rows[0].modelRecorded, false)
  assert.equal(rows[0].tokens, undefined)
  assert.equal(rows[0].durationMs, undefined)
  assert.equal(rows[0].recentTask, undefined)
  assert.equal(rows[0].status, 'inactive')
  assert.equal(__test.formatTokens(rows[0].tokens), '—')
  assert.equal(__test.formatDuration(rows[0].durationMs), '—')
})

test('automatic projection refresh skips external tasks and keeps local ids', () => {
  const { __test } = loadBundle()
  assert.deepEqual(
    [...__test.refreshableChildIds([
      { id: 'c1', mode: 'continuable' },
      { id: 'c2', mode: 'one-shot' },
      { id: 'ext', mode: 'external' },
      { id: '', mode: 'continuable' },
      { mode: 'unknown' },
    ])],
    ['c1', 'c2'],
  )
})

test('root resolution walks parentId and catalog links with a cycle bound', () => {
  const { __test } = loadBundle()
  const byId = {
    root: { id: 'root' },
    parent: { id: 'parent', parentId: 'root', origin: 'subagent' },
    child: { id: 'child', parentId: 'parent', origin: 'subagent' },
  }
  assert.equal(__test.resolveRootSessionId('child', byId, {}), 'root')
  assert.equal(__test.resolveRootSessionId('root', byId, {}), 'root')

  // The session-list row may not project parentId yet; the parent catalog is
  // the second bounded source.
  const catalogOnly = {
    root: { id: 'root' },
    child: { id: 'child', origin: 'subagent' },
  }
  const projections = {
    root: { values: { subagentCatalog: [{ id: 'child', mode: 'continuable' }] } },
  }
  assert.equal(__test.resolveRootSessionId('child', catalogOnly, projections), 'root')

  // A malformed cycle must terminate instead of hanging the render.
  const cycle = {
    a: { id: 'a', parentId: 'b' },
    b: { id: 'b', parentId: 'a' },
  }
  assert.ok(['a', 'b'].includes(__test.resolveRootSessionId('a', cycle, {}, 8)))

  const deep = {}
  for (let index = 0; index < 64; index += 1) {
    deep[`s${index}`] = { id: `s${index}`, parentId: index === 0 ? undefined : `s${index - 1}` }
  }
  assert.equal(__test.resolveRootSessionId('s63', deep, {}, 8), 's55')
})

test('latest static task comes only from turnOutline prompt/response', () => {
  const { __test } = loadBundle()
  assert.equal(__test.latestTask(undefined), undefined)
  assert.equal(__test.latestTask({ turnOutline: [] }), undefined)
  assert.equal(__test.latestTask({ turnOutline: [{ turn: 1, prompt: '', response: '' }] }), undefined)
  assert.deepEqual(
    { ...__test.latestTask({ turnOutline: [{ turn: 3, prompt: '修复导出', response: '' }] }) },
    { kind: 'prompt', text: '修复导出', turn: 3 },
  )
  assert.deepEqual(
    { ...__test.latestTask({ turnOutline: [{ turn: 3, prompt: '', response: '已补充测试' }] }) },
    { kind: 'response', text: '已补充测试', turn: 3 },
  )
  // `draft` is not part of the wire view and must never be treated as a task.
  assert.equal(__test.latestTask({ turnOutline: [{ turn: 4, prompt: '', response: '' }], draft: '思考中' }), undefined)
})

/**
 * Deterministic timer surface for ProjectionFeed tests.
 * @returns {Record<string, any>} fake timer API.
 */
function createFakeTimers() {
  let now = 0
  let nextId = 1
  const timeouts = new Map()
  const intervals = new Map()
  return {
    now: () => now,
    setTimeout(callback, delay) {
      const id = nextId++
      timeouts.set(id, { at: now + Math.max(0, Number(delay) || 0), callback })
      return id
    },
    clearTimeout(id) {
      timeouts.delete(id)
    },
    setInterval(callback, delay) {
      const id = nextId++
      const period = Math.max(1, Number(delay) || 1)
      intervals.set(id, { at: now + period, period, callback })
      return id
    },
    clearInterval(id) {
      intervals.delete(id)
    },
    tick(delta) {
      const target = now + delta
      let guard = 0
      while (now < target) {
        guard += 1
        if (guard > 10_000) throw new Error('fake timer loop')
        let step = target
        for (const timer of timeouts.values()) step = Math.min(step, timer.at)
        for (const timer of intervals.values()) step = Math.min(step, timer.at)
        now = Math.max(now, step)
        for (const [id, timer] of [...timeouts]) {
          if (timer.at <= now) {
            timeouts.delete(id)
            timer.callback()
          }
        }
        for (const timer of intervals.values()) {
          while (timer.at <= now) {
            timer.at += timer.period
            timer.callback()
          }
        }
      }
    },
    pendingTimeouts: () => timeouts.size,
    pendingIntervals: () => intervals.size,
  }
}

const flush = () => new Promise((resolve) => setImmediate(resolve))

const sequenced = (asOfSeq, values = {}) => ({ ok: true, value: { kind: 'sequenced', asOfSeq, values } })

test('projection merge keeps official live values and lets RPC refresh a non-live child', () => {
  const { __test } = loadBundle()
  assert.deepEqual(
    { ...__test.mergeProjectionValues({ model: 'official-new' }, { model: 'local-old' }, true) },
    { model: 'official-new' },
  )
  assert.deepEqual(
    { ...__test.mergeProjectionValues({ model: 'official-cached' }, { model: 'local-fresh' }, false) },
    { model: 'local-fresh' },
  )
  assert.equal(__test.isOfficialLive('child', { child: { retainedBy: {} } }), false)
  assert.equal(__test.isOfficialLive('child', { child: { retainedBy: { mainView: 1 } } }), true)

  const migrationView = __test.projectionView(
    'child',
    { child: { state: 'ready', values: { title: 'official', model: 'official-model' } } },
    { child: { kind: 'migration-required', values: { title: 'migration', extra: 'hint' } } },
    new Set(),
  )
  assert.equal(migrationView.values.title, 'official')
  assert.equal(migrationView.values.model, 'official-model')
  assert.equal(migrationView.values.extra, 'hint')

  const byId = {
    main: { id: 'main', retainedBy: { mainView: 1 } },
    child: { id: 'child', parentId: 'main', origin: 'subagent' },
  }
  const projections = {
    main: {
      state: 'ready',
      values: {
        subagentCatalog: [{ id: 'child', label: 'executor', mode: 'continuable' }],
        modelSelection: { lastUsed: { provider: 'openai', model: 'gpt-6.1-sol', reasoningEffort: 'high' } },
      },
    },
    child: {
      state: 'ready',
      values: {
        modelSelection: { lastUsed: { provider: 'openai', model: 'stale-cache', reasoningEffort: 'low' } },
        tokenUsage: usage(1, 1, 1, 1),
      },
    },
  }
  const snapshots = {
    main: { kind: 'sequenced', asOfSeq: 1, values: { modelSelection: { lastUsed: { provider: 'local', model: 'should-not-win' } } } },
    child: { kind: 'sequenced', asOfSeq: 9, values: { modelSelection: { lastUsed: { provider: 'example-executor', model: 'deepseek-v4.1' } }, tokenUsage: usage(9, 9, 9, 9) } },
  }
  const { rows } = __test.buildRows({
    mainId: 'main',
    byId,
    projections,
    snapshots,
    officialLiveIds: new Set(['main']),
  })
  assert.equal(rows[0].model, 'gpt-6.1-sol')
  assert.equal(rows[1].model, 'deepseek-v4.1')
  assert.equal(rows[1].tokens, 36)
})

test('catalog state never turns loading/error/migration into "no children"', () => {
  const { __test } = loadBundle()
  assert.equal(__test.catalogStateOf({ state: 'loading', values: {} }), 'loading')
  assert.equal(__test.catalogStateOf({ state: 'error', values: {} }), 'error')
  assert.equal(__test.catalogStateOf({ state: 'migration-required', values: {} }), 'migration-required')
  assert.equal(__test.catalogStateOf({ state: 'ready', values: {} }), 'missing')
  assert.equal(__test.catalogStateOf({ state: 'ready', values: { subagentCatalog: [] } }), 'ready')
  assert.match(__test.projectionNoteFor({ catalogState: 'loading' }), /正在通过/)
  assert.match(__test.projectionNoteFor({ catalogState: 'error' }), /无法读取/)
  assert.match(__test.projectionNoteFor({ catalogState: 'migration-required' }), /需要迁移/)
  assert.match(__test.projectionNoteFor({ catalogState: 'missing' }), /不能据此判断/)
  assert.match(__test.projectionNoteFor({ projectionErrors: ['boom'] }), /boom/)
  assert.equal(__test.projectionNoteFor({ catalogState: 'ready' }), null)
  assert.equal(__test.statusLabel({ status: 'running', kind: 'main' }), '运行中')
  assert.equal(__test.statusLabel({ status: 'inactive', kind: 'main' }), '空闲')
  assert.equal(__test.statusLabel({ status: 'inactive', kind: 'current' }), '空闲')
  assert.equal(__test.statusLabel({ status: 'completed', kind: 'subagent' }), '已完成')
  assert.equal(__test.statusLabel({ status: 'inactive', kind: 'subagent' }), '未运行')
  assert.deepEqual({ ...__test.openTarget({ kind: 'current', id: 'child' }) }, { kind: 'main', id: 'child' })
  const childTarget = __test.openTarget({ kind: 'subagent', id: 'child', address: { parentSessionId: 'main', childSessionId: 'child', mode: 'continuable' } })
  assert.equal(childTarget.kind, 'child')
  assert.equal(childTarget.address.parentSessionId, 'main')
  assert.equal(childTarget.address.childSessionId, 'child')
  assert.equal(childTarget.address.mode, 'continuable')
  assert.equal(__test.openTarget({ kind: 'subagent', id: 'external' }), undefined)
})

test('ProjectionFeed performs initial and manual RPC reads', async () => {
  const { __test } = loadBundle()
  const calls = []
  const timers = createFakeTimers()
  const feed = new __test.ProjectionFeed({
    fetchProjections: async (id) => {
      calls.push(id)
      return sequenced(calls.length, {})
    },
    timers,
    now: timers.now,
  })
  feed.configure({ rootId: 'main', childIds: ['c1'], isRunning: () => false, active: true })
  await flush()
  assert.deepEqual(calls, ['main', 'c1'])
  const firstSeq = feed.snapshots.main.asOfSeq
  feed.refreshAll()
  await flush()
  assert.equal(calls.filter((id) => id === 'main').length, 2)
  assert.equal(calls.filter((id) => id === 'c1').length, 2)
  assert.ok(feed.snapshots.main.asOfSeq > firstSeq, 'manual read must replace the cached-ready snapshot')
  feed.refreshSession('unknown-id')
  await flush()
  assert.equal(calls.includes('unknown-id'), false, 'unknown ids are not accepted')
  assert.equal(feed.snapshots.main.kind, 'sequenced')
  feed.dispose()
})

test('ProjectionFeed caps concurrency and never overlaps the same id', async () => {
  const { __test } = loadBundle()
  const timers = createFakeTimers()
  let inFlight = 0
  let maxInFlight = 0
  const pending = []
  const feed = new __test.ProjectionFeed({
    fetchProjections: (id) => {
      inFlight += 1
      maxInFlight = Math.max(maxInFlight, inFlight)
      const deferred = {}
      deferred.promise = new Promise((resolve) => {
        deferred.resolve = resolve
      })
      pending.push({ id, deferred })
      return deferred.promise.finally(() => {
        inFlight -= 1
      })
    },
    timers,
    now: timers.now,
  })
  feed.configure({ rootId: 'main', childIds: ['c1', 'c2', 'c3'], isRunning: () => false, active: true })
  await flush()
  assert.equal(pending.length, 2)
  assert.ok(maxInFlight <= 2)
  pending.shift().deferred.resolve(sequenced(1, {}))
  await flush()
  assert.equal(pending.length, 2)
  pending.shift().deferred.resolve(sequenced(2, {}))
  pending.shift().deferred.resolve(sequenced(3, {}))
  await flush()
  assert.ok(maxInFlight <= 2)
  feed.dispose()

  let sameIdCalls = 0
  let sameIdResolve
  const sameId = new __test.ProjectionFeed({
    fetchProjections: () => {
      sameIdCalls += 1
      return new Promise((resolve) => {
        sameIdResolve = resolve
      })
    },
    timers,
    now: timers.now,
  })
  sameId.configure({ rootId: 'main', childIds: [], isRunning: () => false, active: true })
  await flush()
  sameId.refreshAll()
  await flush()
  assert.equal(sameIdCalls, 1, 'manual read must wait for the in-flight read')
  sameIdResolve(sequenced(1, {}))
  await flush()
  assert.equal(sameIdCalls, 2, 'manual read runs after the in-flight read settles')
  sameId.dispose()
})

test('ProjectionFeed polls running children and stops on collapse/close', async () => {
  const { __test } = loadBundle()
  const calls = []
  const timers = createFakeTimers()
  const feed = new __test.ProjectionFeed({
    fetchProjections: async (id) => {
      calls.push(id)
      return sequenced(calls.length, {})
    },
    timers,
    now: timers.now,
  })
  feed.configure({ rootId: 'main', childIds: ['c1'], isRunning: (id) => id === 'c1', active: true })
  await flush()
  assert.equal(calls.filter((id) => id === 'c1').length, 1)
  timers.tick(3_000)
  await flush()
  assert.equal(calls.filter((id) => id === 'c1').length, 2)
  feed.configure({ rootId: 'main', childIds: ['c1'], isRunning: (id) => id === 'c1', active: false })
  assert.equal(timers.pendingIntervals(), 0)
  const before = calls.length
  timers.tick(9_000)
  await flush()
  assert.equal(calls.length, before)
  feed.dispose()
})

test('ProjectionFeed final refresh after running=false retries until settled', async () => {
  const { __test } = loadBundle()
  const timers = createFakeTimers()
  let childCalls = 0
  let settled = false
  const feed = new __test.ProjectionFeed({
    fetchProjections: async (id) => {
      if (id !== 'c1') return sequenced(1, {})
      childCalls += 1
      return sequenced(childCalls, {
        subagentTiming: settled ? { settledMs: 50 } : { settledMs: 10, active: { since: 1, through: 2 } },
      })
    },
    timers,
    now: timers.now,
  })
  feed.configure({ rootId: 'main', childIds: ['c1'], isRunning: (id) => id === 'c1', active: true })
  await flush()
  assert.equal(childCalls, 1)
  feed.configure({ rootId: 'main', childIds: ['c1'], isRunning: () => false, active: true })
  await flush()
  assert.equal(childCalls, 2, 'running→false triggers an immediate final read')
  assert.equal(timers.pendingTimeouts(), 1, 'active interval schedules a bounded retry')
  timers.tick(1)
  await flush()
  assert.equal(childCalls, 3)
  assert.equal(timers.pendingTimeouts(), 1)
  settled = true
  timers.tick(750)
  await flush()
  assert.equal(childCalls, 4)
  assert.equal(timers.pendingTimeouts(), 0)
  assert.equal(__test.finalSettled(feed.snapshots.c1), true)
  timers.tick(5_000)
  await flush()
  assert.equal(childCalls, 4)
  feed.dispose()
})

test('collapse clears final retry timers and prevents late writes', async () => {
  const { __test } = loadBundle()
  const timers = createFakeTimers()
  let childCalls = 0
  const feed = new __test.ProjectionFeed({
    fetchProjections: async (id) => {
      if (id !== 'c1') return sequenced(1, {})
      childCalls += 1
      return sequenced(childCalls, { subagentTiming: { settledMs: 1, active: { since: 1, through: 2 } } })
    },
    timers,
    now: timers.now,
  })
  feed.configure({ rootId: 'main', childIds: ['c1'], isRunning: (id) => id === 'c1', active: true })
  await flush()
  feed.configure({ rootId: 'main', childIds: ['c1'], isRunning: () => false, active: true })
  await flush()
  assert.equal(timers.pendingTimeouts(), 1)
  feed.configure({ rootId: 'main', childIds: ['c1'], isRunning: () => false, active: false })
  assert.equal(timers.pendingTimeouts(), 0)
  const before = childCalls
  timers.tick(10_000)
  await flush()
  assert.equal(childCalls, before)
  feed.dispose()
})

test('ProjectionFeed ignores root-switch and lower-asOfSeq stale results', async () => {
  const { __test } = loadBundle()
  const timers = createFakeTimers()
  const pending = new Map()
  const feed = new __test.ProjectionFeed({
    fetchProjections: (id) => {
      const deferred = {}
      deferred.promise = new Promise((resolve) => {
        deferred.resolve = resolve
      })
      pending.set(id, deferred)
      return deferred.promise
    },
    timers,
    now: timers.now,
  })
  feed.configure({ rootId: 'old', childIds: ['c1'], isRunning: () => false, active: true })
  await flush()
  feed.configure({ rootId: 'new', childIds: [], isRunning: () => false, active: true })
  pending.get('c1').resolve(sequenced(9, { title: 'stale-root' }))
  await flush()
  assert.equal(feed.snapshots.c1, undefined)
  feed.dispose()

  let sequence = 10
  const asOfFeed = new __test.ProjectionFeed({
    fetchProjections: async () => sequenced(sequence, { title: sequence === 10 ? 'newer' : 'older' }),
    timers,
    now: timers.now,
  })
  asOfFeed.configure({ rootId: 'main', childIds: [], isRunning: () => false, active: true })
  await flush()
  sequence = 5
  asOfFeed.refreshAll()
  await flush()
  assert.equal(asOfFeed.snapshots.main.asOfSeq, 10)
  assert.equal(asOfFeed.snapshots.main.values.title, 'newer')
  asOfFeed.dispose()
})

test('ProjectionFeed never lets migration/null replace a sequenced snapshot', async () => {
  const { __test } = loadBundle()
  const timers = createFakeTimers()
  const responses = [
    sequenced(10, { title: 'sequenced' }),
    { ok: true, value: { kind: 'migration-required', values: { title: 'cached-only' } } },
    { ok: true, value: null },
  ]
  const feed = new __test.ProjectionFeed({
    fetchProjections: async () => responses.shift(),
    timers,
    now: timers.now,
  })
  feed.configure({ rootId: 'main', childIds: [], isRunning: () => false, active: true })
  await flush()
  assert.equal(feed.snapshots.main.kind, 'sequenced')
  feed.refreshAll()
  await flush()
  assert.equal(feed.snapshots.main.kind, 'sequenced')
  assert.equal(feed.snapshots.main.values.title, 'sequenced')
  feed.refreshAll()
  await flush()
  assert.equal(feed.snapshots.main.kind, 'sequenced')
  feed.dispose()
})

test('ProjectionFeed keeps final reason/attempt when a poll read is in flight', async () => {
  const { __test } = loadBundle()
  const timers = createFakeTimers()
  const calls = []
  let phase = 'first'
  let releasePoll
  let seq = 0
  let staleNext = false
  const feed = new __test.ProjectionFeed({
    fetchProjections: (id) => {
      calls.push(id)
      if (phase === 'first') {
        phase = 'poll'
        seq += 1
        return Promise.resolve(sequenced(seq, { subagentTiming: { active: { since: 0, through: 1 } } }))
      }
      if (phase === 'poll') {
        phase = 'final'
        return new Promise((resolve) => {
          releasePoll = resolve
        })
      }
      if (staleNext) {
        // A lower-seq final result must not replace the retained cut, but it
        // must keep the bounded final retry alive.
        return Promise.resolve(sequenced(1, { subagentTiming: { active: { since: 0, through: 2 } } }))
      }
      seq += 1
      return Promise.resolve(sequenced(seq, { subagentTiming: { active: { since: 0, through: 2 } } }))
    },
    timers,
    now: timers.now,
  })
  feed.configure({ childIds: ['c1'], isRunning: (id) => id === 'c1', active: true })
  await flush()
  assert.deepEqual(calls, ['c1'])

  timers.tick(3_000)
  await flush()
  assert.deepEqual(calls, ['c1', 'c1'], 'poll read is in flight')

  // running→false while the poll is unresolved must remember a FINAL follow-up.
  feed.configure({ childIds: ['c1'], isRunning: () => false, active: true })
  // A later manual refresh must not downgrade that final follow-up to manual.
  feed.refreshSession('c1')
  releasePoll(sequenced(2, { subagentTiming: { active: { since: 0, through: 2 } } }))
  await flush()

  assert.equal(calls.length, 3, 'the deferred final read still runs after the poll')
  assert.equal(timers.pendingTimeouts(), 1, 'final retry semantics survived the in-flight dedupe')
  timers.tick(1)
  await flush()
  assert.equal(calls.length, 4, 'the bounded final retry actually issues another read')
  assert.equal(timers.pendingTimeouts(), 1, 'a later final retry is still scheduled')
  staleNext = true
  timers.tick(750)
  await flush()
  assert.equal(calls.length, 5)
  assert.equal(feed.snapshots.c1.asOfSeq, 3, 'a lower-seq final result cannot roll the snapshot back')
  assert.equal(timers.pendingTimeouts(), 1, 'a rejected final read keeps retrying within the bound')
  feed.dispose()
})

test('ProjectionFeed keeps sequenced identity through an error and rejects rollbacks', async () => {
  const { __test } = loadBundle()
  const timers = createFakeTimers()
  const responses = [
    sequenced(10, { title: 'ten' }),
    { ok: false, error: { message: 'rpc down' } },
    { ok: true, value: null },
    { ok: true, value: { kind: 'migration-required', values: { title: 'cached-only' } } },
    sequenced(9, { title: 'nine' }),
    sequenced(11, { title: 'eleven' }),
  ]
  const feed = new __test.ProjectionFeed({
    fetchProjections: async () => responses.shift(),
    timers,
    now: timers.now,
  })
  feed.configure({ rootId: 'main', childIds: [], isRunning: () => false, active: true })
  await flush()
  assert.equal(feed.snapshots.main.asOfSeq, 10)

  feed.refreshAll()
  await flush()
  assert.equal(feed.snapshots.main.kind, 'sequenced', 'an RPC error must not erase sequenced identity')
  assert.equal(feed.snapshots.main.asOfSeq, 10)
  assert.equal(feed.snapshots.main.values.title, 'ten')
  assert.match(feed.snapshots.main.error.message, /rpc down/)
  const erroredView = __test.projectionView('main', undefined, feed.snapshots, new Set())
  assert.equal(erroredView.state, 'ready')
  assert.equal(erroredView.values.title, 'ten')
  assert.match(erroredView.error.message, /rpc down/)
  assert.equal(__test.finalSettled({ kind: 'error', error: { message: 'x' } }), false)

  for (const label of ['null', 'migration-required', 'seq 9']) {
    feed.refreshAll()
    await flush()
    assert.equal(feed.snapshots.main.asOfSeq, 10, `${label} must not replace the last sequenced cut`)
    assert.equal(feed.snapshots.main.values.title, 'ten')
  }
  assert.equal(feed.snapshots.main.error.message, 'rpc down', 'rejected results leave the prior display intact')

  feed.refreshAll()
  await flush()
  assert.equal(feed.snapshots.main.kind, 'sequenced')
  assert.equal(feed.snapshots.main.asOfSeq, 11)
  assert.equal(feed.snapshots.main.values.title, 'eleven')
  assert.equal(feed.snapshots.main.error, undefined)
  feed.dispose()
})

test('ProjectionFeed polls a running unretained root and reads it once when it stops', async () => {
  const { __test } = loadBundle()
  const timers = createFakeTimers()
  const calls = []
  let seq = 0
  const feed = new __test.ProjectionFeed({
    fetchProjections: async (id) => {
      calls.push(id)
      seq += 1
      return sequenced(seq, {})
    },
    timers,
    now: timers.now,
  })
  feed.configure({ rootId: 'main', childIds: ['c1'], isRunning: (id) => id === 'main', rootNeedsRpc: true, active: true })
  await flush()
  assert.deepEqual(calls, ['main', 'c1'])
  timers.tick(3_000)
  await flush()
  assert.equal(calls.filter((id) => id === 'main').length, 2, 'a running unretained root joins the 3s poll')
  assert.equal(calls.filter((id) => id === 'c1').length, 1, 'an idle child is not polled')

  feed.configure({ rootId: 'main', childIds: ['c1'], isRunning: () => false, rootNeedsRpc: true, active: true })
  await flush()
  assert.equal(calls.filter((id) => id === 'main').length, 3, 'running→false triggers one root read')
  timers.tick(9_000)
  await flush()
  assert.equal(calls.filter((id) => id === 'main').length, 3, 'an idle root is not polled again')
  feed.dispose()
})

test('ProjectionFeed rereads cached root and children after expansion', async () => {
  const { __test } = loadBundle()
  const timers = createFakeTimers()
  const calls = []
  let completed = false
  let mainSeq = 1
  let childSeq = 1
  let inFlight = 0
  let maxInFlight = 0
  const feed = new __test.ProjectionFeed({
    fetchProjections: async (id) => {
      calls.push(id)
      inFlight += 1
      maxInFlight = Math.max(maxInFlight, inFlight)
      await Promise.resolve()
      inFlight -= 1
      if (id === 'main') {
        mainSeq += 1
        return sequenced(mainSeq, { title: 'main' })
      }
      childSeq += 1
      return sequenced(
        childSeq,
        completed
          ? { subagentTiming: { settledMs: 5_000, lastTurnCompleted: true } }
          : { subagentTiming: { settledMs: 0, active: { since: 0, through: 1 } } },
      )
    },
    timers,
    now: timers.now,
  })
  feed.configure({ rootId: 'main', childIds: ['c1'], isRunning: (id) => id === 'c1', active: true })
  await flush()
  assert.deepEqual(calls, ['main', 'c1'])
  assert.equal(feed.snapshots.c1.values.subagentTiming.active.since, 0)

  // The turn finishes while the panel is collapsed: timers are stopped, so the
  // cached snapshot stays frozen until expansion explicitly rereads it.
  feed.configure({ rootId: 'main', childIds: ['c1'], isRunning: () => false, active: false })
  completed = true
  timers.tick(10_000)
  await flush()
  assert.equal(calls.length, 2, 'collapsed panel performs no reads')
  assert.equal(feed.snapshots.c1.values.subagentTiming.active.since, 0)

  feed.configure({ rootId: 'main', childIds: ['c1'], isRunning: () => false, active: true })
  await flush()
  assert.equal(calls.filter((id) => id === 'main').length, 2, 'cached root is reread on expansion')
  assert.equal(calls.filter((id) => id === 'c1').length, 2, 'cached child is reread on expansion')
  assert.equal(feed.snapshots.c1.values.subagentTiming.settledMs, 5_000)
  assert.equal(feed.snapshots.c1.values.subagentTiming.active, undefined)
  assert.ok(maxInFlight <= 2, 'expansion rereads respect the concurrency cap')
  assert.equal(timers.pendingTimeouts(), 0)
  feed.dispose()
})

test('ProjectionFeed leaves idle sessions alone between 3s polls', async () => {
  const { __test } = loadBundle()
  const timers = createFakeTimers()
  const calls = []
  const feed = new __test.ProjectionFeed({
    fetchProjections: async (id) => {
      calls.push(id)
      return sequenced(calls.length, {})
    },
    timers,
    now: timers.now,
  })
  feed.configure({ rootId: 'main', childIds: ['c1'], isRunning: () => false, rootNeedsRpc: true, active: true })
  await flush()
  assert.deepEqual(calls, ['main', 'c1'])
  timers.tick(30_000)
  await flush()
  assert.deepEqual(calls, ['main', 'c1'], 'idle sessions are not polled')
  assert.equal(timers.pendingIntervals(), 1)
  feed.dispose()

  const retainedCalls = []
  const retainedTimers = createFakeTimers()
  const retained = new __test.ProjectionFeed({
    fetchProjections: async (id) => {
      retainedCalls.push(id)
      return sequenced(retainedCalls.length, {})
    },
    timers: retainedTimers,
    now: retainedTimers.now,
  })
  retained.configure({ rootId: 'main', childIds: [], isRunning: (id) => id === 'main', rootNeedsRpc: false, active: true })
  await flush()
  retainedTimers.tick(9_000)
  await flush()
  assert.deepEqual(retainedCalls, ['main'], 'a retained root relies on official live updates, not RPC polling')
  retained.dispose()
})

test('compact panel subscribes only to running direct children', async () => {
  const { __test } = loadBundle()
  const entries = [
    { id: 'c1', mode: 'continuable' },
    { id: 'c2', mode: 'one-shot' },
    { id: 'ext', mode: 'external' },
  ]
  const statuses = new Map([
    ['c1', { running: true }],
    ['c2', { running: false }],
    ['ext', { running: true }],
  ])
  assert.deepEqual(__test.runningChildIds(entries, statuses, {}), ['c1'])
  assert.deepEqual(
    __test.runningChildIds([{ id: 'c2', mode: 'one-shot' }], undefined, { c2: { running: true } }),
    ['c2'],
    'session-list running is the fallback when the status map is absent',
  )

  const calls = []
  const timers = createFakeTimers()
  const feed = new __test.ProjectionFeed({
    fetchProjections: async (id) => {
      calls.push(id)
      return sequenced(calls.length, {})
    },
    timers,
    now: timers.now,
  })
  feed.configure({
    rootId: 'main',
    childIds: __test.runningChildIds(entries, statuses, {}),
    isRunning: (id) => statuses.get(id)?.running === true,
    active: true,
  })
  await flush()
  assert.deepEqual(calls, ['main', 'c1'], 'an idle historical child must not get an initial RPC')
  feed.dispose()
})

test('client picks the newest turn group that has an ended local child', () => {
  const { __test } = loadBundle()
  assert.equal(__test.SUBAGENT_TURNS_KEY, host.SUBAGENT_TURNS_KEY)
  const rows = [
    { id: 'main', kind: 'main', status: 'inactive', external: false },
    { id: 't3done', kind: 'subagent', status: 'completed', external: false },
    { id: 't3run', kind: 'subagent', status: 'running', external: false },
    { id: 't2done', kind: 'subagent', status: 'inactive', external: false },
    { id: 'ext', kind: 'subagent', status: 'completed', external: true },
  ]
  const values = {
    [__test.SUBAGENT_TURNS_KEY]: {
      currentTurn: 4,
      lastTurns: [
        { turn: 3, childIds: ['t3done', 't3run', 'ext'] },
        { turn: 2, childIds: ['t2done'] },
      ],
      unknownChildIds: [],
    },
  }
  const groups = __test.previousTurnsOf(values)
  assert.deepEqual([...groups.map((group) => group.turn)], [3, 2])
  const currentRunning = new Set(['t3run'])
  const selected = __test.selectPreviousTurn(rows, groups, currentRunning)
  assert.equal(selected.turn, 3)
  assert.deepEqual([...selected.rows.map((row) => row.id)], ['t3done'])

  // If the newest group is entirely running, fall back to the bounded older
  // group rather than rendering an empty "last turn".
  const fallback = __test.selectPreviousTurn(
    rows,
    [{ turn: 4, childIds: ['t3run'] }, { turn: 3, childIds: ['t3done'] }],
    currentRunning,
  )
  assert.equal(fallback.turn, 3)
  assert.deepEqual([...fallback.rows.map((row) => row.id)], ['t3done'])
  assert.match(bundleSource, /data-subagent-section": "current"/)
  assert.match(bundleSource, /data-subagent-section": "previous"/)
  assert.match(bundleSource, /role: "separator"/)
  assert.match(bundleSource, /尚无可用轮次记录/)
})

test('ProjectionFeed initializes visible previous rows but never polls them', async () => {
  const { __test } = loadBundle()
  const timers = createFakeTimers()
  const calls = []
  const feed = new __test.ProjectionFeed({
    fetchProjections: async (id) => {
      calls.push(id)
      return sequenced(calls.length, {})
    },
    timers,
    now: timers.now,
  })
  feed.configure({
    rootId: 'main',
    childIds: ['c1'],
    previousChildIds: ['p1', 'p2'],
    isRunning: (id) => id === 'c1',
    active: true,
  })
  await flush()
  assert.deepEqual(calls, ['main', 'c1', 'p1', 'p2'])
  timers.tick(3_000)
  await flush()
  assert.equal(calls.filter((id) => id === 'c1').length, 2, 'running child still polls')
  assert.equal(calls.filter((id) => id === 'p1').length, 1, 'previous row is not polled')
  assert.equal(calls.filter((id) => id === 'p2').length, 1)

  feed.refreshAll()
  await flush()
  assert.equal(calls.filter((id) => id === 'p1').length, 2, 'manual refresh pulls visible previous rows')
  assert.equal(calls.filter((id) => id === 'p2').length, 2)

  feed.configure({
    rootId: 'main',
    childIds: ['c1'],
    previousChildIds: ['p1', 'p2', 'p3'],
    isRunning: (id) => id === 'c1',
    active: true,
  })
  await flush()
  assert.equal(calls.filter((id) => id === 'p3').length, 1, 'a newly visible previous row gets one initial read')
  timers.tick(3_000)
  await flush()
  assert.equal(calls.filter((id) => id === 'p3').length, 1, 'the new previous row is still not polled')
  feed.dispose()
})

test('compact rows show main plus running children only and no ID markers', () => {
  const { __test } = loadBundle()
  const rows = [
    { id: 'main', kind: 'main', status: 'inactive' },
    { id: 'c1', kind: 'subagent', status: 'running' },
    { id: 'old-child', kind: 'subagent', status: 'inactive' },
    { id: 'done-child', kind: 'subagent', status: 'completed' },
    { id: 'current', kind: 'current', status: 'inactive' },
  ]
  assert.deepEqual(__test.visibleRows(rows).map((row) => row.id), ['main', 'c1', 'current'])
  for (const marker of [
    'data-session-id',
    'data-mode',
    'data-snapshot-kind',
    'data-snapshot-seq',
    'data-subagent-activity-main',
    'data-subagent-activity-selected',
  ]) {
    assert.equal(bundleSource.includes(marker), false, `historical marker must be gone: ${marker}`)
  }
  assert.doesNotMatch(bundleSource, /title:\s*row\.id/)
  assert.match(bundleSource, /无运行中的子代理/)
  assert.match(bundleSource, /模型未知/)
})

test('ProjectionFeed makes one final read when a running child leaves the set', async () => {
  const { __test } = loadBundle()
  const timers = createFakeTimers()
  const calls = []
  let childCalls = 0
  const feed = new __test.ProjectionFeed({
    fetchProjections: async (id) => {
      calls.push(id)
      if (id === 'main') return sequenced(1, {})
      childCalls += 1
      return sequenced(childCalls, { subagentTiming: { settledMs: 4_000 } })
    },
    timers,
    now: timers.now,
  })
  feed.configure({ rootId: 'main', childIds: ['c1'], isRunning: (id) => id === 'c1', active: true })
  await flush()
  assert.deepEqual(calls, ['main', 'c1'])

  // The child ends: it leaves the visible/subscribed set, gets one final read,
  // and a later manual refresh must not touch that historical id again.
  feed.configure({ rootId: 'main', childIds: [], isRunning: () => false, active: true })
  await flush()
  assert.deepEqual(calls, ['main', 'c1', 'c1'])
  assert.equal(feed.snapshots.c1.values.subagentTiming.settledMs, 4_000)
  assert.equal(timers.pendingTimeouts(), 0)
  feed.refreshAll()
  await flush()
  assert.equal(calls.filter((id) => id === 'c1').length, 2)
  timers.tick(9_000)
  await flush()
  assert.equal(calls.filter((id) => id === 'c1').length, 2)
  feed.dispose()
})

test('panel default width is 300px with a compact height cap', () => {
  const { __test } = loadBundle()
  assert.equal(__test.panelPositionStyle.top, 'calc(var(--dsh-frame-overlay-top, 72px) + 40px)')
  assert.equal(__test.panelPositionStyle.width, 'min(300px, calc(100vw - 24px))')
  assert.equal(__test.panelPositionStyle.maxHeight, 'min(30vh, 300px)')
  assert.match(bundleSource, /top:\s*"calc\(var\(--dsh-frame-overlay-top, 72px\) \+ 40px\)"/)
  assert.match(bundleSource, /width:\s*"min\(300px, calc\(100vw - 24px\)\)"/)
  assert.match(bundleSource, /maxHeight:\s*"min\(30vh, 300px\)"/)
  assert.match(bundleSource, /textOverflow:\s*"ellipsis",\s*\n\s*whiteSpace:\s*"nowrap"/)
})

test('route display uses modelSelection.lastUsed and never next', () => {
  const { __test } = loadBundle()
  const lastUsed = __test.resolveModel({
    modelSelection: {
      lastUsed: { provider: 'openai', model: 'gpt-6.1-sol', reasoningEffort: 'high' },
      next: { provider: 'example-executor', model: 'deepseek-v4.1', reasoningEffort: 'low' },
    },
  })
  assert.equal(lastUsed.provider, 'openai')
  assert.equal(lastUsed.model, 'gpt-6.1-sol')
  assert.equal(lastUsed.reasoning, 'high')
  assert.equal(lastUsed.recorded, true)

  const pendingOnly = __test.resolveModel({
    modelSelection: {
      lastUsed: null,
      next: { provider: 'example-executor', model: 'deepseek-v4.1', reasoningEffort: 'high' },
    },
  })
  assert.equal(pendingOnly.provider, undefined)
  assert.equal(pendingOnly.model, undefined)
  assert.equal(pendingOnly.reasoning, undefined)
  assert.equal(pendingOnly.recorded, false)

  assert.equal(__test.modeLabel('continuable'), '可继续')
  assert.equal(__test.modeLabel('one-shot'), '一次性')
  assert.equal(__test.modeLabel('external'), '外部任务')
  assert.equal(__test.modeLabel('nope'), '模式未知')
})

test('switch reads only the planner-executor-routing namespace from the Host describe', () => {
  const { __test } = loadBundle()
  const describe = (namespaces) => ({
    ok: true,
    value: { writable: true, hasDocument: true, namespaces },
  })
  const view = __test.strategyFromDescribe(
    describe([
      { ns: 'llm-pi-ai', revision: 9, value: { providers: {} } },
      { ns: 'planner-executor-routing', revision: 3, value: { enabled: true } },
    ]),
  )
  assert.deepEqual({ ...view }, { enabled: true, revision: 3, writable: true, configured: false, targetRoute: undefined, error: null })

  const off = __test.strategyFromDescribe(
    describe([{ ns: 'planner-executor-routing', revision: 4, value: { enabled: false } }]),
  )
  assert.equal(off.enabled, false)

  const missing = __test.strategyFromDescribe(describe([]))
  assert.match(__test.errorMessage(missing.error), /未找到 planner-executor-routing/)
  assert.equal(missing.writable, true)

  const refused = __test.strategyFromDescribe({ ok: false, error: { message: 'gateway/unavailable' } })
  assert.equal(__test.errorMessage(refused.error), 'gateway/unavailable')
})

test('switch accepts only update receipts, never the clicked intent', () => {
  const { __test } = loadBundle()
  const receipt = __test.strategyFromUpdate({
    ok: true,
    value: { ns: 'planner-executor-routing', revision: 5, value: { enabled: true } },
  })
  assert.deepEqual({ ...receipt }, { enabled: true, revision: 5, configured: false, targetRoute: undefined, error: null })

  const foreign = __test.strategyFromUpdate({ ok: true, value: { ns: 'other', revision: 5, value: {} } })
  assert.match(__test.errorMessage(foreign.error), /回执不完整/)

  const conflict = __test.strategyFromUpdate({
    ok: false,
    error: { code: 'settings/conflict', message: 'settings namespace changed since it was read' },
  })
  assert.equal(conflict.conflict, true)
  assert.equal(conflict.enabled, undefined)

  const failed = __test.strategyFromUpdate({ ok: false, error: { message: 'disk full' } })
  assert.equal(failed.conflict, false)
  assert.equal(__test.errorMessage(failed.error), '设置保存被拒绝')
})

test('switch revision fencing rejects stale describe answers and equal event revisions', () => {
  const { __test } = loadBundle()
  assert.equal(__test.acceptStrategyRevision(-1, 0), true)
  assert.equal(__test.acceptStrategyRevision(2, 2), true)
  assert.equal(__test.acceptStrategyRevision(3, 2), false)
  assert.equal(__test.acceptStrategyRevision(3, Number.NaN), false)
  assert.equal(__test.newerStrategyRevision(-1, 0), true)
  assert.equal(__test.newerStrategyRevision(3, 3), false)
  assert.equal(__test.newerStrategyRevision(3, 2), false)
  assert.equal(__test.newerStrategyRevision(2, 3), true)
})

test('a stale write receipt only clears saving, never rolls back an accepted revision', () => {
  const { __test } = loadBundle()
  // Another window committed rev 3 (accepted) while a rev 2 write was in flight.
  assert.equal(__test.staleStrategyReceipt(3, { enabled: false, revision: 2, error: null }), true)
  // Equal and newer receipts are authoritative, not stale.
  assert.equal(__test.staleStrategyReceipt(3, { enabled: true, revision: 3, error: null }), false)
  assert.equal(__test.staleStrategyReceipt(3, { enabled: false, revision: 4, error: null }), false)
  // A rejected write is an error path, not a stale success.
  assert.equal(__test.staleStrategyReceipt(3, { error: 'disk full', conflict: false }), false)
})

test('a connection reset clears an in-flight save so the switch cannot stay disabled', () => {
  const { __test } = loadBundle()
  const reset = __test.resetStrategyState({
    status: 'ready',
    enabled: true,
    revision: 2,
    writable: true,
    error: 'old host error',
    saving: true,
    pending: false,
  })
  assert.equal(reset.status, 'loading')
  assert.equal(reset.saving, false)
  assert.equal(reset.pending, null)
  assert.equal(reset.error, null)
  assert.equal(reset.writable, false)
  // The last confirmed value may remain as display memory until the read lands.
  assert.equal(reset.enabled, true)
})

test('switch renders role=switch with Host truth and honest loading/failure states', () => {
  const { __test } = loadBundle()
  const base = {
    status: 'ready',
    enabled: false,
    revision: 2,
    writable: true,
    error: null,
    saving: false,
    pending: null,
  }
  const off = __test.StrategySwitch({ view: base, onToggle() {} })
  assert.equal(off.type, 'button')
  assert.equal(off.props.role, 'switch')
  assert.equal(off.props['aria-checked'], 'false')
  assert.equal(off.props.disabled, false)
  assert.equal(off.children[0], 'DS执行：关')

  const on = __test.StrategySwitch({ view: { ...base, enabled: true }, onToggle() {} })
  assert.equal(on.props['aria-checked'], 'true')
  assert.equal(on.children[0], 'DS执行：开')

  // Unknown initial state must not pretend OFF, and must be disabled.
  const loading = __test.StrategySwitch({ view: { ...base, status: 'loading', writable: false }, onToggle() {} })
  assert.equal(loading.props.disabled, true)
  assert.equal(loading.children[0], 'DS执行：…')
  assert.equal(loading.props['aria-checked'], 'false')

  // Saving keeps the last confirmed aria state but disables the control.
  const saving = __test.StrategySwitch({ view: { ...base, saving: true, pending: true }, onToggle() {} })
  assert.equal(saving.props.disabled, true)
  assert.equal(saving.props['aria-checked'], 'false')
  assert.equal(saving.children[0], 'DS执行：…')

  // A read failure before any Host confirmation must not claim "关".
  const unknown = __test.StrategySwitch({
    view: { ...base, status: 'error', error: 'remote.settings 不可用', revision: -1 },
    onToggle() {},
  })
  assert.equal(unknown.props.disabled, true)
  assert.equal(unknown.props['aria-checked'], 'false')
  assert.equal(unknown.children[0], 'DS执行：不可用')
  assert.match(unknown.props.title, /不可用/)

  // A later disconnect keeps the last Host-confirmed value visible, disabled.
  const lost = __test.StrategySwitch({
    view: { ...base, status: 'error', error: 'offline', enabled: true, revision: 2 },
    onToggle() {},
  })
  assert.equal(lost.props.disabled, true)
  assert.equal(lost.props['aria-checked'], 'true')
  assert.equal(lost.children[0], 'DS执行：开')

  assert.equal(__test.strategyLabel('error', false, false), 'DS执行：不可用')
  assert.equal(__test.strategyLabel('ready', false, true), 'DS执行：关')
  assert.equal(__test.strategyLabel('error', true, true), 'DS执行：开')

  const failure = __test.StrategyError({ view: { ...base, error: 'settings 不可用' }, onRetry() {} })
  assert.equal(failure.props.role, 'alert')
  assert.match(failure.children[0].children[0], /settings 不可用/)
  assert.equal(failure.children[1].children[0], '重试')
})
