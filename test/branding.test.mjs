import assert from 'node:assert/strict'
import { test } from 'node:test'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { bundle } from './fixture.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const text = path => readFileSync(resolve(root, path), 'utf8')
const json = path => JSON.parse(text(path))
const currentDocs = ['README.md', 'README.zh-CN.md', 'CONTRIBUTING.md', 'SECURITY.md', ...readdirSync(resolve(root, 'docs')).filter(name => name.endsWith('.md')).map(name => `docs/${name}`)]
const oldPositioning = /DSH Agent Activity|DS[ -]execution|DS\s*执行|DS执行/iu
const images = ['en', 'zh-CN'].flatMap(locale => ['overview', 'model-setup', 'routing'].map(view => `planner-${view}-${locale}.png`)).sort()

test('0.3.2 repository metadata uses the new slug while package and lock IDs stay compatible', () => {
  const pkg = json('package.json'), lock = json('package-lock.json')
  assert.equal(pkg.version, '0.3.2')
  assert.equal(pkg.name, 'dsh-agent-activity')
  assert.equal(lock.version, pkg.version); assert.equal(lock.packages[''].version, pkg.version)
  assert.equal(lock.name, pkg.name); assert.equal(lock.packages[''].name, pkg.name)
  assert.equal(pkg.repository.url, 'git+https://github.com/O-OII/dsh-planner-executor.git')
  assert.equal(pkg.bugs.url, 'https://github.com/O-OII/dsh-planner-executor/issues')
  assert.equal(pkg.homepage, 'https://github.com/O-OII/dsh-planner-executor#readme')
  assert.match(pkg.description, /主从协作/)
  for (const name of ['README.md', 'README.zh-CN.md']) {
    assert.match(text(name), /git clone https:\/\/github\.com\/O-OII\/dsh-planner-executor\.git\ncd dsh-planner-executor/)
    assert.match(text(name), /docs\/advanced\.md#stable-technical-ids/)
  }
})

test('current docs use Planner–Executor routes and resolve local links without obsolete positioning', () => {
  for (const path of currentDocs) {
    const body = text(path)
    assert.doesNotMatch(body, oldPositioning, path)
    assert.doesNotMatch(body, /github\.com\/O-OII\/dsh-agent-activity|ds-execution\.(?:zh-CN\.)?md/, path)
    for (const match of body.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1]
      if (/^[a-z]+:/i.test(target)) continue
      const [relative, anchor] = target.split('#')
      const destination = resolve(dirname(resolve(root, path)), relative)
      assert.ok(existsSync(destination), `${path}: missing link ${target}`)
      if (anchor === 'stable-technical-ids') assert.match(readFileSync(destination, 'utf8'), /id="stable-technical-ids"/)
    }
  }
  for (const language of ['', '.zh-CN']) {
    assert.ok(existsSync(resolve(root, `docs/planner-executor${language}.md`)))
    assert.equal(existsSync(resolve(root, `docs/ds-execution${language}.md`)), false)
  }
  const latest = text('CHANGELOG.md').split('## 0.3.1')[0]
  assert.match(latest, /## 0\.3\.2/); assert.doesNotMatch(latest, oldPositioning)
})

test('only six current bilingual synthetic Planner–Executor screenshots remain', () => {
  assert.deepEqual(readdirSync(resolve(root, 'docs/images')).sort(), images)
  for (const image of images) {
    assert.equal(readFileSync(resolve(root, 'docs/images', image)).subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
  }
  assert.match(text('docs/testing.md'), /public synthetic data/)
})

test('locale resources, client hints and unsupported-locale fallback keep the current brand', () => {
  const en = json('locale/en.json').meta, zh = json('locale/zh.json').meta
  assert.equal(en.title, 'DSH Planner–Executor'); assert.equal(zh.title, 'DSH 主从协作')
  for (const value of [en, zh]) assert.doesNotMatch(JSON.stringify(value), oldPositioning)
  const { api } = bundle({ locale: null })
  assert.deepEqual(Object.keys(api.DICTIONARIES.en).sort(), Object.keys(api.DICTIONARIES.zh).sort())
  for (const locale of ['en', 'zh']) {
    const dict = api.DICTIONARIES[locale]
    assert.doesNotMatch(JSON.stringify(dict), oldPositioning)
    assert.doesNotMatch(dict['settings.modelSetupHint'], /never receives or stores keys|不接收或保存密钥/)
    assert.match(dict['settings.modelSetupHint'], locale === 'en' ? /temporarily holds draft keys/ : /暂存草稿密钥/)
    assert.match(dict['settings.modelsUnavailable'], locale === 'en' ? /independently/ : /独立检查/)
    assert.match(dict['settings.manual'], locale === 'en' ? /here/ : /此处/)
  }
  assert.equal(api.t('panelTitle'), '主从协作')
  api.setLocale('fr'); assert.equal(api.t('settings.title'), 'DSH 主从协作设置')
})

test('public demo positions planning and execution together and localizes switch page title', () => {
  const demo = text('demo/index.html'), fixture = text('demo/fixture.js'), states = text('demo/states.html')
  for (const source of [demo, fixture, states, text('index.mjs'), text('routing.mjs'), text('client.js')]) assert.doesNotMatch(source, oldPositioning)
  assert.match(demo, /Plan, design, decide and accept/)
  assert.match(fixture, /主模型负责规划、设计、决策与验收/)
  assert.match(states, /document\.title='Planner–Executor switch states'/)
})
