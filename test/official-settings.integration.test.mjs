/** Optional integration test against an independently supplied official DSH runtime.
 * No official code is bundled here. Set DSH_TEST_ROOT to a readable dsh directory
 * containing node_modules. Without it the test is explicitly skipped.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, mkdtemp, writeFile, readFile, rm, realpath } from 'node:fs/promises'
import { resolve, join, dirname, basename } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath, pathToFileURL } from 'node:url'

const suppliedRoot = process.env.DSH_TEST_ROOT
const pluginRoot = fileURLToPath(new URL('..', import.meta.url))

test('official Settings + ConfigEditor persistence and reload', {
  skip: suppliedRoot ? false : 'Set DSH_TEST_ROOT to a readable official DSH root; no host test was run',
}, async t => {
  const runtimeRoot = resolve(suppliedRoot)
  const moduleUrl = name => pathToFileURL(join(runtimeRoot, 'node_modules', '@deepseek-ai', name, 'lib', 'index.js')).href
  const [{ boot, readProfilePatches }, { default: Settings }, { default: ConfigEditor }] = await Promise.all([
    import(moduleUrl('dsh-app-boot')),
    import(moduleUrl('dsh-settings')),
    import(moduleUrl('dsh-config-editor')),
  ])
  const manifest = JSON.parse(await readFile(join(runtimeRoot, 'node_modules', '@deepseek-ai', 'dsh-settings', 'package.json'), 'utf8'))
  t.diagnostic(`Official Settings version: ${manifest.version}; no model/provider requests are performed`)

  const tempParent = await realpath(tmpdir())
  const dir = await mkdtemp(join(tempParent, 'dsh-activity-settings-'))
  let ctx
  t.after(async () => {
    try { if (ctx) await ctx.fiber.dispose() } finally {
      // Check the exact resolved target before deleting; never remove a caller path.
      const target = await realpath(dir)
      assert.equal(dirname(target).toLowerCase(), tempParent.toLowerCase())
      assert.ok(basename(target).startsWith('dsh-activity-settings-'))
      await rm(target, { recursive: true, force: true })
    }
  })
  const home = join(dir, 'home'); await mkdir(home)
  const profile = join(dir, 'profile'); await mkdir(profile)
  const bundle = join(profile, 'node_modules', 'offline-settings-fixture'); await mkdir(bundle, { recursive: true })
  await writeFile(join(bundle, 'package.json'), JSON.stringify({ name: 'offline-settings-fixture', version: '1.0.0', dsh: { manifestVersion: 1, bundle: { patch: './cordis.patch.yml' } } }))
  await writeFile(join(bundle, 'cordis.patch.yml'), JSON.stringify([
    { insert: [{ id: 'subagent-activity', name: join(pluginRoot, 'index.mjs') }, { id: 'planner-executor-routing', name: join(pluginRoot, 'routing.mjs') }] },
    { id: 'planner-executor-routing', config: { enabled: false, parentRoutes: [], targetRoute: null } },
  ]))
  await writeFile(join(profile, 'package.json'), JSON.stringify({ private: true, dsh: { profile: { bundles: ['offline-settings-fixture'] } } }))
  const patchPath = join(profile, 'cordis.patch.yml'); await writeFile(patchPath, '[]\n')
  const configPath = join(dir, 'root.yml'); await writeFile(configPath, '[]\n')
  const profileContext = { name: 'isolated-offline-test', dir: profile, home, installAnchor: join(runtimeRoot, 'node_modules', '@deepseek-ai', 'dsh', 'package.json'), patchPath, overlays: [] }
  const start = () => boot('offline-test', configPath, readProfilePatches('offline-test', profileContext), async host => {
    host.provide('profileContext', profileContext)
    host.provide('clientModules', {})
    host.provide('sessionProjections', { register: () => () => {} })
    host.provide('subagents', { startActivation: async () => { throw new Error('No real delegation allowed in this test') } })
    host.provide('systemPrompt', {})
    host.provide('llm', { resolveModelInfo: async () => { throw new Error('No real model/provider request allowed in this test') } })
    await host.plugin(ConfigEditor)
    await host.plugin(Settings)
  })
  ctx = await start()
  const view = (ns = 'planner-executor-routing') => ctx.settings.describe().find(row => row.ns === ns)

  await t.test('actual schemas expose two namespaces and inherited OFF/unconfigured defaults', () => {
    assert.deepEqual(ctx.settings.describe().map(row => row.ns).sort(), ['planner-executor-routing', 'subagent-activity'])
    assert.equal(view().value.enabled, false)
    assert.deepEqual(view().value.parentRoutes, [])
    assert.equal(view().value.targetRoute, null)
    assert.equal(view().applies, 'live')
    assert.equal(ctx.settings.writable, true)
  })
  await t.test('unconfigured enable rejects before writing', async () => {
    const before = await readFile(patchPath, 'utf8')
    await assert.rejects(ctx.settings.update('planner-executor-routing', { enabled: true }, view().revision), /configure valid parentRoutes and targetRoute/)
    assert.equal(await readFile(patchPath, 'utf8'), before)
    assert.equal(view().value.enabled, false)
  })
  await t.test('exact routes, effort, locale and enabled save together', async () => {
    await ctx.settings.update('planner-executor-routing', {
      parentRoutes: [{ provider: 'planner-provider', model: 'planner-model' }],
      targetRoute: { provider: 'executor-provider', model: 'executor-model', reasoningEffort: 'low' },
      locale: 'zh-CN', enabled: true,
    }, view().revision)
    assert.equal(view().value.enabled, true)
    assert.equal(view().value.targetRoute.reasoningEffort, 'low')
    assert.equal(view().user.enabled, true)
    assert.match(await readFile(patchPath, 'utf8'), /executor-model/)
  })
  await t.test('stale revision refuses a competing write without disk changes', async () => {
    const old = view().revision
    await ctx.settings.update('planner-executor-routing', { locale: 'en' }, old)
    const before = await readFile(patchPath, 'utf8')
    await assert.rejects(ctx.settings.update('planner-executor-routing', { locale: 'auto' }, old), error => error.code === 'SETTINGS_CONFLICT')
    assert.equal(await readFile(patchPath, 'utf8'), before)
  })
  await t.test('panel locale remains independent of routing locale', async () => {
    await ctx.settings.update('subagent-activity', { locale: 'zh-CN' }, view('subagent-activity').revision)
    assert.equal(view('subagent-activity').value.locale, 'zh-CN')
    assert.equal(view().value.locale, 'en')
  })
  await t.test('fresh official boot restores durable configuration', async () => {
    await ctx.fiber.dispose(); ctx = undefined
    ctx = await start()
    assert.equal(view().value.enabled, true)
    assert.equal(view().value.locale, 'en')
    assert.equal(view('subagent-activity').value.locale, 'zh-CN')
    assert.deepEqual(view().value.targetRoute, { provider: 'executor-provider', model: 'executor-model', reasoningEffort: 'low' })
  })
  await t.test('higher-priority home overlay rejects a lower-layer write', async () => {
    await writeFile(join(home, 'cordis.patch.yml'), JSON.stringify([{ id: 'subagent-activity', config: { locale: 'en' } }]))
    const before = await readFile(patchPath, 'utf8')
    // Deliberately unconditional: isolate overlay rejection rather than a stale revision.
    await assert.rejects(ctx.settings.update('subagent-activity', { locale: 'auto' }), /overridden by a home patch or command-line overlay/)
    assert.equal(await readFile(patchPath, 'utf8'), before)
  })
})
