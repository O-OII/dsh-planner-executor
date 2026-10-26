import assert from 'node:assert/strict'
import { test } from 'node:test'
import { bundle, flush, strings } from './fixture.mjs'

const PANEL = 'subagent-activity'
const ROUTING = 'planner-executor-routing'
const clone = value => JSON.parse(JSON.stringify(value))
const panelValue = locale => ({ locale })
const routeValue = (extra = {}) => ({ enabled: false, parentRoutes: [{ provider: 'planner-id', model: 'planner/model' }], targetRoute: { provider: 'executor-id', model: 'executor/model' }, locale: 'auto', ...extra })
const namespace = (ns, value, revision = 0) => ({ ns, value, revision, applies: 'live', autoGenerate: false, secrets: [] })
const describe = (panel = panelValue('auto'), routing = routeValue(), revision = 0, writable = true) => ({ ok: true, value: { writable, hasDocument: true, namespaces: [namespace(PANEL, panel, revision), namespace(ROUTING, routing, revision)] } })
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no }); return { promise, resolve, reject } }
function nodes(tree) { if (!tree || typeof tree !== 'object') return []; if (Array.isArray(tree)) return tree.flatMap(nodes); return [tree, ...nodes(tree.children)] }
function setup(options = {}) {
  const b = bundle()
  let host = options.host ?? describe()
  let changed, reset
  const calls = []
  const actions = {
    readStrategy() { calls.push(['read']); return options.read ? options.read() : clone(host) },
    writeSettings(ns, patch, revision) { calls.push(['write', ns, clone(patch), revision]); return options.write ? options.write(ns, patch, revision) : { ok: true, value: namespace(ns, clone(patch), revision + 1) } },
    onStrategyChanged(fn) { changed = fn; return () => { changed = null } },
    onStrategyReset(fn) { reset = fn; return () => { reset = null } },
    readModelCatalog: options.catalog,
  }
  const controller = new b.api.SettingsPageController(actions)
  controller.start()
  return { b, controller, actions, calls, setHost(value) { host = value }, changed(ns, revision) { changed?.(ns, revision) }, reset() { reset?.() } }
}

test('bundle-wide configuration registration is optional and leaves overlay independent', () => {
  const b = bundle({ effects: false }); const registered = [], waiting = []
  b.plugin.apply({ remote: {}, uiWorkspace: {}, slots: { inject(name, fn) { if (name === 'shell.overlay') fn(); else waiting.push([name, fn]) }, register(options, Component) { registered.push([options, Component]) } } })
  assert.equal(registered.length, 1)
  assert.equal(registered[0][0].name, 'shell.overlay')
  assert.equal(waiting[0][0], 'plugins.bundle.config')
  waiting[0][1]()
  assert.equal(registered[1][0].key, 'dsh-agent-activity')
  assert.equal(registered[1][1], b.api.SettingsPage)
  assert.equal(typeof registered[1][0].inject().actions.writeSettings, 'function')
})

test('Host value is resolved while base/user remain provenance, not readonly flags', () => {
  const { api } = bundle(); const view = describe(); Object.assign(view.value.namespaces[0], { base: { locale: 'auto' }, user: { locale: 'en' }, value: { locale: 'en' } })
  const parsed = api.settingsNamespaceFromDescribe(view, PANEL)
  assert.equal(parsed.value.locale, 'en'); assert.equal(parsed.writable, true)
  assert.equal(parsed.base.locale, 'auto'); assert.equal(parsed.user.locale, 'en')
})

test('draft edits never auto-save and each card saves only its complete namespace', async () => {
  const f = setup(); await flush()
  f.controller.edit(PANEL, panelValue('zh-CN'))
  f.controller.edit(ROUTING, routeValue({ enabled: true, locale: 'en', targetRoute: { provider: 'custom-id', model: 'actual/model', reasoningEffort: 'custom-effort' } }))
  assert.equal(f.calls.filter(call => call[0] === 'write').length, 0)
  await f.controller.save(PANEL)
  assert.deepEqual(f.calls.find(call => call[0] === 'write'), ['write', PANEL, { locale: 'zh-CN' }, 0])
  assert.equal(f.controller.cards[ROUTING].dirty, true)
  await f.controller.save(ROUTING)
  assert.deepEqual(f.calls.filter(call => call[0] === 'write')[1], ['write', ROUTING, routeValue({ enabled: true, locale: 'en', targetRoute: { provider: 'custom-id', model: 'actual/model', reasoningEffort: 'custom-effort' } }), 0])
  f.controller.stop()
})

test('authoritative receipt rather than clicked intent determines saved values', async () => {
  const f = setup({ write: () => ({ ok: true, value: namespace(PANEL, panelValue('en'), 7) }) }); await flush()
  f.controller.edit(PANEL, panelValue('zh-CN')); await f.controller.save(PANEL)
  const card = f.controller.cards[PANEL]
  assert.equal(card.value.locale, 'en'); assert.equal(card.draft.locale, 'en'); assert.equal(card.revision, 7); assert.equal(card.saved, true)
  f.controller.stop()
})

test('same-tick repeated saves serialize and independent cards can save in parallel', async () => {
  const a = deferred(), c = deferred()
  const f = setup({ write: ns => ns === PANEL ? a.promise : c.promise }); await flush()
  f.controller.edit(PANEL, panelValue('zh-CN')); f.controller.edit(ROUTING, routeValue({ locale: 'en' }))
  const first = f.controller.save(PANEL); const repeat = f.controller.save(PANEL); const other = f.controller.save(ROUTING)
  assert.equal(f.calls.filter(call => call[0] === 'write').length, 2)
  a.resolve({ ok: true, value: namespace(PANEL, panelValue('zh-CN'), 1) }); c.resolve({ ok: true, value: namespace(ROUTING, routeValue({ locale: 'en' }), 1) })
  await Promise.all([first, repeat, other]); f.controller.stop()
})

test('exact identifiers and optional reasoning are validated without invented capability enums', () => {
  const { api } = bundle()
  assert.equal(api.validateSettingsDraft(ROUTING, routeValue({ targetRoute: { provider: 'user-custom', model: 'organization/model:v2', reasoningEffort: 'provider-defined' } })), null)
  for (const targetRoute of [{ provider: '', model: 'm' }, { provider: 'id with spaces', model: 'm' }, { provider: 'p', model: 'm', reasoningEffort: ' ' }]) assert.ok(api.validateSettingsDraft(ROUTING, routeValue({ targetRoute })))
  assert.ok(api.validateSettingsDraft(ROUTING, routeValue({ enabled: true, parentRoutes: [], targetRoute: null })))
  assert.equal(api.validateSettingsDraft(ROUTING, routeValue({ enabled: false, parentRoutes: [], targetRoute: null })), null)
})

test('invalid drafts remain local and cannot reach settings.update', async () => {
  const f = setup(); await flush()
  f.controller.edit(ROUTING, routeValue({ targetRoute: { provider: ' ', model: 'bad model' } })); await f.controller.save(ROUTING)
  assert.equal(f.calls.filter(call => call[0] === 'write').length, 0)
  assert.equal(f.controller.cards[ROUTING].draft.targetRoute.provider, ' ')
  assert.equal(f.controller.cards[ROUTING].error.key, 'settings.invalidRoute')
  f.controller.stop()
})

test('readonly Host disables edits and saves without inferring namespace overrides', async () => {
  const f = setup({ host: describe(undefined, undefined, 0, false) }); await flush()
  f.controller.edit(PANEL, panelValue('en')); await f.controller.save(PANEL)
  assert.equal(f.controller.cards[PANEL].writable, false); assert.equal(f.controller.cards[PANEL].draft.locale, 'auto')
  assert.equal(f.calls.filter(call => call[0] === 'write').length, 0)
  f.controller.stop()
})

test('home/CLI overlay rejection blocks that card, preserves draft and never retries', async () => {
  const f = setup({ write: () => ({ ok: false, error: { code: 'settings/write-failed', message: 'Configuration for "subagent-activity" is overridden by a home patch or command-line overlay' } }) }); await flush()
  f.controller.edit(PANEL, panelValue('zh-CN')); await f.controller.save(PANEL); await f.controller.save(PANEL)
  assert.equal(f.controller.cards[PANEL].overridden, true); assert.equal(f.controller.cards[PANEL].draft.locale, 'zh-CN')
  assert.equal(f.controller.cards[PANEL].error.key, 'settings.overridden')
  assert.equal(f.calls.filter(call => call[0] === 'write').length, 1)
  await f.controller.readAgain()
  assert.equal(f.controller.cards[PANEL].overridden, false)
  assert.equal(f.calls.filter(call => call[0] === 'write').length, 1)
  f.controller.stop()
})

test('cross-window events preserve dirty drafts and require explicit review before saving', async () => {
  const f = setup(); await flush(); f.controller.edit(PANEL, panelValue('zh-CN'))
  f.setHost(describe(panelValue('en'), routeValue(), 2)); f.changed(PANEL, 2); await flush()
  let card = f.controller.cards[PANEL]
  assert.equal(card.value.locale, 'en'); assert.equal(card.draft.locale, 'zh-CN'); assert.equal(card.conflict, true); assert.equal(card.baseRevision, 0)
  await f.controller.save(PANEL); assert.equal(f.calls.filter(call => call[0] === 'write').length, 0)
  f.controller.review(PANEL); await f.controller.save(PANEL)
  assert.equal(f.calls.filter(call => call[0] === 'write')[0][3], 2)
  f.controller.stop()
})

test('settings/conflict re-reads Host without rebasing or replaying rejected intent', async () => {
  const f = setup({ write: () => ({ ok: false, error: { code: 'settings/conflict' } }) }); await flush()
  f.controller.edit(ROUTING, routeValue({ enabled: true }))
  f.setHost(describe(panelValue('auto'), routeValue({ locale: 'en' }), 4)); await f.controller.save(ROUTING)
  assert.equal(f.controller.cards[ROUTING].conflict, true); assert.equal(f.controller.cards[ROUTING].draft.enabled, true)
  assert.equal(f.controller.cards[ROUTING].value.enabled, false); assert.equal(f.controller.cards[ROUTING].revision, 4)
  await f.controller.save(ROUTING); assert.equal(f.calls.filter(call => call[0] === 'write').length, 1)
  f.controller.discard(ROUTING); assert.equal(f.controller.cards[ROUTING].draft.locale, 'en'); assert.equal(f.controller.cards[ROUTING].dirty, false)
  f.controller.stop()
})

test('newer Host snapshot wins over stale successful write receipt and keeps draft', async () => {
  const write = deferred(); const f = setup({ write: () => write.promise }); await flush()
  f.controller.edit(PANEL, panelValue('zh-CN')); const saved = f.controller.save(PANEL)
  f.setHost(describe(panelValue('en'), routeValue(), 8)); f.changed(PANEL, 8); await flush()
  write.resolve({ ok: true, value: namespace(PANEL, panelValue('zh-CN'), 1) }); await saved
  assert.equal(f.controller.cards[PANEL].value.locale, 'en'); assert.equal(f.controller.cards[PANEL].revision, 8)
  assert.equal(f.controller.cards[PANEL].draft.locale, 'zh-CN'); assert.equal(f.controller.cards[PANEL].conflict, true)
  f.controller.stop()
})

test('older describe cannot roll a newer write receipt backward', async () => {
  const read = deferred(); let reads = 0
  const f = setup({ read: () => ++reads === 1 ? describe() : read.promise }); await flush()
  f.changed(PANEL, 1); await flush(); f.controller.edit(PANEL, panelValue('zh-CN')); await f.controller.save(PANEL)
  read.resolve(describe(panelValue('en'), routeValue(), 0)); await flush()
  assert.equal(f.controller.cards[PANEL].value.locale, 'zh-CN'); assert.equal(f.controller.cards[PANEL].revision, 1)
  f.controller.stop()
})

test('reset fences old writes, accepts revision zero and retains dirty drafts for review', async () => {
  const write = deferred(); const f = setup({ host: describe(undefined, undefined, 12), write: () => write.promise }); await flush()
  f.controller.edit(PANEL, panelValue('zh-CN')); const saved = f.controller.save(PANEL)
  f.setHost(describe(panelValue('en'), routeValue(), 0)); f.reset(); await flush()
  write.resolve({ ok: true, value: namespace(PANEL, panelValue('zh-CN'), 13) }); await saved
  const card = f.controller.cards[PANEL]
  assert.equal(card.value.locale, 'en'); assert.equal(card.revision, 0); assert.equal(card.draft.locale, 'zh-CN'); assert.equal(card.saving, false); assert.equal(card.conflict, true)
  assert.equal(f.calls.filter(call => call[0] === 'write').length, 1)
  f.controller.stop()
})

test('reset fences old reads and unmount fences pending receipts and catalog', async () => {
  const oldRead = deferred(), catalog = deferred(); let reads = 0
  const f = setup({ read: () => ++reads === 1 ? oldRead.promise : describe(panelValue('en')), catalog: () => catalog.promise }); await flush()
  f.reset(); await flush(); oldRead.resolve(describe(panelValue('zh-CN'), routeValue(), 99)); await flush()
  assert.equal(f.controller.cards[PANEL].value.locale, 'en')
  f.controller.stop(); catalog.resolve({ ok: true, value: { groups: [{ id: 'stale', models: [] }], failures: [] } }); await flush()
  assert.equal(f.controller.catalog.groups.length, 0)
})

test('failed initial reads and missing namespace never masquerade as confirmed OFF', async () => {
  for (const host of [{ ok: false, error: { code: 'network' } }, { ok: true, value: { writable: true, namespaces: [] } }, describe(undefined, { enabled: false, parentRoutes: [], targetRoute: null }, 0)]) {
    const f = setup({ host }); await flush()
    assert.equal(f.controller.cards[ROUTING].status, 'error'); assert.equal(f.controller.cards[ROUTING].value, null)
    assert.equal(f.controller.cards[ROUTING].revision, -1); assert.equal(f.controller.cards[ROUTING].writable, false)
    f.controller.stop()
  }
})

test('failed disable preserves Host-confirmed ON and the unsaved OFF draft', async () => {
  const f = setup({ host: describe(undefined, routeValue({ enabled: true })), write: () => ({ ok: false, error: { code: 'denied' } }) }); await flush()
  f.controller.edit(ROUTING, routeValue({ enabled: false })); await f.controller.save(ROUTING)
  assert.equal(f.controller.cards[ROUTING].value.enabled, true); assert.equal(f.controller.cards[ROUTING].draft.enabled, false); assert.equal(f.controller.cards[ROUTING].dirty, true)
  assert.equal(f.calls.filter(call => call[0] === 'write').length, 1)
  f.controller.stop()
})

test('malformed receipts fail closed and preserve draft instead of claiming success', async () => {
  const f = setup({ write: () => ({ ok: true, value: namespace(PANEL, panelValue('zh-CN'), -1) }) }); await flush()
  f.controller.edit(PANEL, panelValue('zh-CN')); await f.controller.save(PANEL)
  assert.equal(f.controller.cards[PANEL].status, 'error'); assert.equal(f.controller.cards[PANEL].draft.locale, 'zh-CN'); assert.equal(f.controller.cards[PANEL].saved, false)
  f.controller.stop()
})

test('optional catalog accepts exact ids and partial failure without gating manual edits', async () => {
  const f = setup({ catalog: () => ({ ok: true, value: { groups: [{ id: 'actual-provider', name: 'Friendly name', models: [{ id: 'actual/model', name: 'Pretty model', reasoning: { efforts: [{ id: 'custom', name: 'Custom' }] } }] }], failures: [{ provider: 'other' }] } }) }); await flush()
  assert.equal(f.controller.catalog.groups[0].id, 'actual-provider'); assert.equal(f.controller.catalog.failures.length, 1)
  f.controller.edit(ROUTING, routeValue({ targetRoute: { provider: 'manual-id', model: 'manual/model' } })); await f.controller.save(ROUTING)
  assert.equal(f.calls.filter(call => call[0] === 'write')[0][2].targetRoute.provider, 'manual-id')
  f.controller.stop()
})

test('catalog absence never blocks a valid settings save', async () => {
  const f = setup(); await flush()
  assert.equal(f.controller.catalog.status, 'unavailable')
  f.controller.edit(PANEL, panelValue('en')); await f.controller.save(PANEL)
  assert.equal(f.controller.cards[PANEL].saved, true); f.controller.stop()
})

test('explicit read refreshes optional catalog and ignores older overlapping catalog requests', async () => {
  const oldCatalog = deferred(); let catalogs = 0
  const f = setup({ catalog: () => ++catalogs === 1 ? oldCatalog.promise : { ok: true, value: { groups: [{ id: 'fresh-provider', models: [{ id: 'fresh/model' }] }], failures: [] } } }); await flush()
  f.controller.edit(PANEL, panelValue('zh-CN')); await f.controller.readAgain(); await flush()
  assert.equal(catalogs, 2); assert.equal(f.controller.catalog.groups[0].id, 'fresh-provider')
  oldCatalog.resolve({ ok: true, value: { groups: [{ id: 'stale-provider', models: [] }], failures: [] } }); await flush()
  assert.equal(f.controller.catalog.groups[0].id, 'fresh-provider')
  assert.equal(f.controller.cards[PANEL].draft.locale, 'zh-CN'); assert.equal(f.calls.filter(call => call[0] === 'write').length, 0)
  f.controller.stop()
})

test('page language preview and live locale changes preserve drafts and never write', async () => {
  const f = setup(); f.controller.stop()
  // Render the actual component with its own page-local controller.
  let tree = f.b.render(() => f.b.api.SettingsPage({ actions: f.actions, view: 'page' })); await flush()
  tree = f.b.render(() => f.b.api.SettingsPage({ actions: f.actions, view: 'page' }))
  let panel = nodes(tree).find(node => node.props?.['data-settings-card'] === PANEL)
  nodes(panel).find(node => node.type === 'select' && node.props.name === 'locale').props.onChange({ target: { value: 'zh-CN' } })
  tree = f.b.render(() => f.b.api.SettingsPage({ actions: f.actions, view: 'page' }))
  nodes(tree).find(node => node.type === 'select' && node.props.name === 'pageLanguage').props.onChange({ target: { value: 'zh-CN' } })
  tree = f.b.render(() => f.b.api.SettingsPage({ actions: f.actions, view: 'page' }))
  assert.match(strings(tree).join(' '), /保存浮窗设置/)
  panel = nodes(tree).find(node => node.props?.['data-settings-card'] === PANEL)
  assert.equal(nodes(panel).find(node => node.type === 'select' && node.props.name === 'locale').props.value, 'zh-CN')
  f.b.api.setLocale('en'); tree = f.b.render(() => f.b.api.SettingsPage({ actions: f.actions, view: 'page' }))
  assert.equal(f.calls.filter(call => call[0] === 'write').length, 0)
  assert.equal(nodes(tree).filter(node => node.props?.['data-settings-card']).length, 2)
  f.b.dispose()
})

test('saved Host locale supersedes client bootstrap, and stale-generation reads cannot change it', async () => {
  const b = bundle({ effects: false }); const registrations = [], events = new Map(); const pending = deferred(); let reads = 0
  b.plugin.apply({ remote: { settings: { describe: () => ++reads === 1 ? pending.promise : describe(panelValue('en')), update: () => ({ ok: true, value: namespace(PANEL, panelValue('zh-CN'), 1) }) }, $on() { return () => {} } }, on(event, fn) { events.set(event, fn); return () => {} }, uiWorkspace: {}, slots: { inject(_name, fn) { fn() }, register(options) { registrations.push(options) } } }, { locale: 'zh-CN' })
  const actions = registrations[0].inject().actions
  assert.equal(b.api.t('panelTitle'), '代理活动')
  const old = actions.readStrategy(); actions.onStrategyReset(() => {}); events.get('connection/reset')()
  await actions.readStrategy(); assert.equal(b.api.t('panelTitle'), 'Activity')
  pending.resolve(describe(panelValue('zh-CN'), routeValue(), 99)); await old
  assert.equal(b.api.t('panelTitle'), 'Activity')
  await actions.writeSettings(PANEL, { locale: 'zh-CN' }, 0); assert.equal(b.api.t('panelTitle'), '代理活动')
})

test('page labels and actions have complete English/Chinese dictionaries and stable selectors', async () => {
  const f = setup(); f.controller.stop()
  let tree = f.b.render(() => f.b.api.SettingsPage({ actions: f.actions, view: 'page' })); await flush(); tree = f.b.render(() => f.b.api.SettingsPage({ actions: f.actions, view: 'page' }))
  assert.doesNotMatch(strings(tree).join(' '), /settings\./)
  const fields = nodes(tree).filter(node => ['input', 'select'].includes(node.type))
  for (const node of fields.filter(node => node.props.type !== 'checkbox')) assert.ok(nodes(tree).some(label => label.type === 'label' && label.props.htmlFor === node.props.id))
  assert.equal(nodes(tree).filter(node => node.props?.['data-settings-action'] === 'save').length, 2)
  assert.equal(nodes(tree).filter(node => node.props?.['data-settings-action'] === 'discard').length, 2)
  f.b.dispose()
})
