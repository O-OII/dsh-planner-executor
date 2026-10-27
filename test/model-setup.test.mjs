import assert from 'node:assert/strict'
import { test } from 'node:test'
import { bundle, flush, strings } from './fixture.mjs'
const clone = value => JSON.parse(JSON.stringify(value))
const NS = 'llm-pi-ai'
const draft = () => ({ provider: 'demo-api', displayName: 'Demo', api: 'openai-completions', baseURL: 'https://gateway.example/v1', models: [{ id: 'demo/model', name: 'Demo model', reasoningEfforts: { off: 'off', low: 'small', high: 'large' } }] })
const metadata = () => ({ revision: 3, writable: true, protocols: ['openai-completions', 'anthropic-messages'], reasoningLevels: ['off', 'low', 'medium', 'high'], taken: ['catalog-provider'], profiles: {}, discovery: true })
const deferred = () => { let resolve; const promise = new Promise(yes => { resolve = yes }); return { promise, resolve } }
function setup(options = {}) {
  const b = bundle(), calls = [], created = [], meta = metadata(); let reset
  const actions = {
    onStrategyReset(fn) { reset = fn; return () => { reset = undefined } },
    readModelSetup: async () => { calls.push(['read']); return options.read ? options.read(meta) : clone(meta) },
    describeCustomCredential: async ref => { calls.push(['describe-key', ref]); return options.describe ? options.describe(ref) : { ok: true, value: { [ref]: { configured: false, writable: true } } } },
    createCustomProvider: async (id, profile, revision) => {
      calls.push(['mutate', id, clone(profile), revision]);
      if (options.write) return options.write(id, profile, revision)
      meta.profiles[id] = clone(profile); meta.taken.push(id); meta.revision++
      return { ok: true, value: { ns: NS, revision: meta.revision, value: { providers: clone(meta.profiles) } } }
    },
    storeCustomCredential: async (ref, key) => { calls.push(['key', ref, key]); return options.key ? options.key(ref, key) : { ok: true } },
    discoverCustomModels: async request => { calls.push(['discover', clone(request)]); return options.discover ? options.discover(request) : { ok: true, value: [{ id: 'found/model', name: 'Found' }] } },
  }
  const c = new b.api.ModelSetupController(actions, route => created.push(clone(route)))
  c.start()
  return { b, c, meta, actions, calls, created, reset() { reset?.() } }
}
function nodes(tree) { if (!tree || typeof tree !== 'object') return []; if (Array.isArray(tree)) return tree.flatMap(nodes); return [tree, ...nodes(tree.children)] }

test('new custom provider uses one profile mutation then write-only credentials, never routing writes', async () => {
  const f = setup(); await flush(); f.c.edit(draft()); f.c.setKey('synthetic-key-123')
  assert.equal(f.calls.some(call => call[0] !== 'read'), false)
  await f.c.create()
  assert.equal(f.c.saved, true); assert.equal(f.c.keyDraft, '')
  assert.deepEqual(f.calls.map(call => call[0]), ['read', 'read', 'describe-key', 'mutate', 'key'])
  const mutation = f.calls.find(call => call[0] === 'mutate')
  assert.equal(mutation[1], 'demo-api'); assert.equal(mutation[3], 3)
  assert.equal(mutation[2].apiKeyEnv, 'DEMO_API_API_KEY'); assert.equal(mutation[2].models[0].reasoningEfforts.high, 'large')
  assert.doesNotMatch(JSON.stringify(mutation), /synthetic-key/)
  assert.deepEqual(f.created, [{ provider: 'demo-api', model: 'demo/model' }])
  f.c.stop()
})
test('native-auth creation does not invent a key reference or call credentials', async () => {
  const f = setup(); await flush(); f.c.edit(draft()); await f.c.create()
  assert.equal(f.c.saved, true); assert.equal(f.calls.some(call => /key/.test(call[0])), false)
  assert.equal(Object.hasOwn(f.calls.find(call => call[0] === 'mutate')[2], 'apiKeyEnv'), false); f.c.stop()
})
test('invalid URL/protocol/model/key/reasoning and duplicate providers never write', async () => {
  const { api } = bundle(); const meta = metadata()
  for (const patch of [{ provider: '1bad' }, { provider: 'catalog-provider' }, { baseURL: 'file:///tmp' }, { baseURL: 'https://user:secret@example.com' }, { baseURL: 'https://example.com?key=secret' }, { api: 'invented' }, { models: [{ id: '' }] }, { models: [{ id: 'same' }, { id: 'same' }] }, { models: [{ id: 'm', reasoningEfforts: { off: 'off' } }] }, { models: [{ id: 'm', reasoningEfforts: { invented: 'x' } }] }]) assert.ok(api.customDraftFailure({ ...draft(), ...patch }, meta))
  for (const key of ['  ', 'NAME=secret', '"secret"', 'secret\nmore', '密钥']) assert.equal(api.validKeyDraft(key), false)
  assert.equal(api.safeEndpoint('http://[::1]:8080/v1'), true)
  const f = setup(); await flush(); f.c.edit({ ...draft(), provider: 'catalog-provider' }); await f.c.create()
  assert.equal(f.c.error, 'setupDuplicate'); assert.equal(f.calls.some(call => call[0] === 'mutate'), false); f.c.stop()
})
test('metadata absence and readonly profile visibly disable custom creation', async () => {
  for (const read of [() => undefined, () => ({ ...metadata(), protocols: [] }), () => ({ ...metadata(), writable: false })]) {
    const f = setup({ read }); await flush(); f.c.edit(draft()); await f.c.create()
    assert.ok(['setupReadonly', 'setupUnavailable'].includes(f.c.error)); assert.equal(f.calls.some(call => call[0] === 'mutate'), false); f.c.stop()
  }
})
test('latest duplicate and changed revision block creation without replay', async () => {
  const f = setup(); await flush(); f.c.edit(draft()); f.meta.revision++; await f.c.create()
  assert.equal(f.c.error, 'setupConflict'); assert.equal(f.calls.some(call => call[0] === 'mutate'), false)
  await f.c.load(); f.meta.taken.push('demo-api'); await f.c.create()
  assert.equal(f.c.error, 'setupDuplicate'); f.c.stop()
})
test('credential collision, unknown credential status or readonly storage refuse BEFORE profile mutation', async () => {
  for (const describe of [ref => ({ ok: true, value: { [ref]: { configured: true, writable: true } } }), ref => ({ ok: true, value: { [ref]: { configured: false, writable: false } } }), () => ({ ok: false }), () => ({ ok: true, value: {} })]) {
    const f = setup({ describe }); await flush(); f.c.edit(draft()); f.c.setKey('synthetic-key'); await f.c.create()
    assert.equal(f.c.error, 'setupCredential'); assert.equal(f.calls.some(call => call[0] === 'mutate'), false); f.c.stop()
  }
})
test('mutation refusal/conflict never leaks Host error contents or attempts credential storage', async () => {
  for (const code of ['settings/conflict', 'settings/write-failed']) {
    const f = setup({ write: () => ({ ok: false, error: { code, message: 'echoed-secret' } }) }); await flush(); f.c.edit(draft()); f.c.setKey('synthetic-key'); await f.c.create()
    assert.equal(f.c.error, code === 'settings/conflict' ? 'setupConflict' : 'setupRefused'); assert.doesNotMatch(f.c.error, /echoed-secret/)
    assert.equal(f.calls.some(call => call[0] === 'key'), false); f.c.stop()
  }
})
test('partial credential failure clears key and retries credential stage only', async () => {
  let fail = true; const f = setup({ key: () => fail ? { ok: false, error: { message: 'echoed-key' } } : { ok: true } }); await flush()
  f.c.edit(draft()); f.c.setKey('synthetic-key'); await f.c.create()
  assert.equal(f.c.committed, true); assert.equal(f.c.saved, false); assert.equal(f.c.keyDraft, ''); assert.equal(f.c.error, 'setupPartial')
  const before = clone(f.c.draft); f.c.edit({ provider: 'must-not-edit' }); assert.deepEqual(clone(f.c.draft), before)
  fail = false; f.c.setKey('synthetic-key-again'); await f.c.create()
  assert.equal(f.c.saved, true); assert.equal(f.calls.filter(call => call[0] === 'mutate').length, 1); assert.equal(f.calls.filter(call => call[0] === 'key').length, 2); f.c.stop()
})
test('partial retry refuses credentials after profile endpoint is changed externally', async () => {
  const f = setup({ key: () => ({ ok: false }) }); await flush(); f.c.edit(draft()); f.c.setKey('synthetic-key'); await f.c.create()
  f.meta.profiles['demo-api'].baseURL = 'https://changed.example'; f.c.setKey('another-key'); await f.c.create()
  assert.equal(f.c.error, 'setupReset'); assert.equal(f.c.keyDraft, ''); assert.equal(f.calls.filter(call => call[0] === 'key').length, 1); f.c.stop()
})
test('reset and unmount clear key and fence in-flight mutation before credential stage', async () => {
  for (const mode of ['reset', 'stop']) {
    const pending = deferred(); const f = setup({ write: () => pending.promise }); await flush(); f.c.edit(draft()); f.c.setKey('synthetic-key')
    const create = f.c.create(); await flush(); mode === 'reset' ? f.reset() : f.c.stop()
    pending.resolve({ ok: true, value: { ns: NS, revision: 4, value: { providers: {} } } }); await create
    assert.equal(f.c.keyDraft, ''); assert.equal(f.c.saved, false); assert.equal(f.calls.some(call => call[0] === 'key'), false); f.c.stop()
  }
})
test('malformed success receipt is uncertain, clears secret and never claims save', async () => {
  const f = setup({ write: () => ({ ok: true, value: { ns: NS, revision: 4, value: { providers: {} } } }) }); await flush(); f.c.edit(draft()); f.c.setKey('synthetic-key'); await f.c.create()
  assert.equal(f.c.saved, false); assert.equal(f.c.status, 'error'); assert.equal(f.c.error, 'setupReset'); assert.equal(f.c.keyDraft, ''); assert.equal(f.calls.some(call => call[0] === 'key'), false); f.c.stop()
})
test('same-tick repeated creation serializes; discovery is explicit, optional and never writes', async () => {
  const pending = deferred(); const f = setup({ discover: () => pending.promise }); await flush(); f.c.edit(draft()); f.c.setKey('synthetic-key')
  assert.equal(f.calls.some(call => call[0] === 'discover'), false)
  const fetch = f.c.discover(); f.c.discover(); assert.equal(f.calls.filter(call => call[0] === 'discover').length, 1)
  pending.resolve({ ok: true, value: [{ id: 'found/model', name: 'Found' }] }); await fetch
  f.c.addCandidate(0); assert.equal(f.c.draft.models.length, 2); assert.equal(f.calls.some(call => call[0] === 'mutate'), false)
  const first = f.c.create(), repeat = f.c.create(); await Promise.all([first, repeat])
  assert.equal(f.calls.filter(call => call[0] === 'mutate').length, 1); f.c.stop()
})
test('setup form renders a masked, never-prefilled credential field and clear unavailable state', async () => {
  const f = setup(); f.c.stop()
  const render = () => f.b.render(() => f.b.api.ModelSetupForm({ actions: f.actions, tr: (key, params) => f.b.api.t(`settings.${key}`, params), onCreated() {} }))
  render(); await flush(); const tree = render(); const key = nodes(tree).find(node => node.props?.name === 'custom.apiKey')
  assert.equal(key.props.type, 'password'); assert.equal(key.props.autoComplete, 'new-password'); assert.equal(key.props.value, '')
  assert.match(strings(tree).join(' '), /Add custom model API/); f.b.dispose()
})
test('bound production actions use schema choices, official path mutation and credential namespaces', async () => {
  const b = bundle({ effects: false }), registrations = [], calls = []
  const profile = { api: 'schema-protocol', baseURL: 'https://example.com', models: [{ id: 'x' }] }
  b.plugin.apply({
    settingsSchema: { rehydrate: value => value, nodeAtPath(_root, path) { return path.at(-1) === 'api' ? { type: 'union', list: [{ value: 'schema-protocol' }] } : { list: [{ type: 'dict', sKey: { list: [{ value: 'schema-effort' }] } }] } } },
    remote: { settings: { describe: () => ({ ok: true, value: { writable: true, namespaces: [{ ns: NS, revision: 9, schema: {}, value: { providers: { existing: {} } } }] } }), mutate(...args) { calls.push(['mutate', ...clone(args)]); return { ok: true } } }, llm: { listProviders: () => ({ ok: true, value: [{ id: 'registered' }] }), listConfigurableProviders: () => ({ ok: true, value: [{ provider: 'builtin' }] }), discoverModels(...args) { calls.push(['discover', ...clone(args)]); return { ok: true, value: [] } } }, credentials: { describe: refs => ({ ok: true, value: Object.fromEntries(refs.map(ref => [ref, { configured: false, writable: true }])) }), set(ref, value) { calls.push(['credential', ref, value]); return { ok: true } } } },
    slots: { inject(_name, fn) { fn() }, register(options) { registrations.push(options) } }, uiWorkspace: {},
  })
  const { actions } = registrations[0].inject(); const info = await actions.readModelSetup()
  assert.deepEqual(clone(info.protocols), ['schema-protocol']); assert.deepEqual(clone(info.reasoningLevels), ['schema-effort']); assert.deepEqual(new Set(info.taken), new Set(['existing', 'registered', 'builtin']))
  actions.createCustomProvider('new-api', profile, 9); actions.storeCustomCredential('NEW_API_API_KEY', 'synthetic-key')
  assert.deepEqual(calls[0], ['mutate', NS, [{ op: 'set', path: ['providers', 'new-api'], value: profile }], 9]); assert.deepEqual(calls[1], ['credential', 'NEW_API_API_KEY', 'synthetic-key'])
})
