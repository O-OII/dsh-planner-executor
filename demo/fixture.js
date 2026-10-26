/* Public synthetic demo using the production client bundle. No fetch or real profile. */
(() => {
  const params = new URLSearchParams(location.search);
  let language = params.get('lang') === 'zh-CN' ? 'zh' : 'en';
  const mode = params.get('state') || 'off';
  const showSettings = params.get('view') === 'settings';
  if (language === 'zh') {
    document.documentElement.lang = 'zh-CN';
    document.querySelector('#heading').textContent = '代理活动';
    document.querySelector('#intro').textContent = '主代理与直接子代理的轻量视图。配置页与浮窗使用真实 client bundle，数据来自公开合成夹具。';
    document.querySelector('#contract').textContent = '实际 lastUsed 模型 · 当前 / 上一轮 · 可选 DS执行，仅影响后续新委派';
    document.querySelector('#disclaimer').textContent = '合成演示 — 非真实宿主或 GUI 验收。没有会话、凭据、API 网络请求或收费模型调用。';
  }
  if (showSettings) {
    document.body.classList.add('settings-demo');
    document.querySelector('#heading').textContent = language === 'zh' ? '插件 / 活动面板 / 配置' : 'Plugins / Agent Activity / Configure';
  }
  const labels = language === 'zh' ? ['审查发布范围与测试证据', '实现导出与回归测试', '审查无障碍与国际化'] : ['Review release scope and test evidence', 'Implement export and regression tests', 'Review accessibility and localization'];
  const route = { provider: 'example-executor', model: 'execution-model' };
  const configs = {
    'subagent-activity': { locale: 'auto' },
    'planner-executor-routing': { enabled: mode === 'on', parentRoutes: [{ provider: 'example-planner', model: 'planning-model' }], targetRoute: mode === 'unconfigured' ? null : route, locale: 'auto' },
  };
  const revisions = { 'subagent-activity': 1, 'planner-executor-routing': 1 };
  const listeners = new Set(), resetListeners = new Set(), localeListeners = new Set();
  let writable = mode !== 'readonly', overrides = mode === 'overridden' ? { enabled: 'home' } : {};
  let failure = null, heldWrite = null;
  const writes = [], reads = [];
  const state = {
    ids: ['demo-root', 'demo-running', 'demo-previous'],
    byId: { 'demo-root': { retainedBy: { mainView: 1 }, title: labels[0], running: true }, 'demo-running': { parentId: 'demo-root', origin: 'subagent', running: true }, 'demo-previous': { parentId: 'demo-root', origin: 'subagent', running: false } },
    projectionsBySession: {},
  };
  const values = {
    'demo-root': { subagentCatalog: [{ id: 'demo-running', label: labels[1], mode: 'continuable' }, { id: 'demo-previous', label: labels[2], mode: 'one-shot' }], modelSelection: { lastUsed: { provider: 'example-planner', model: 'planning-model' } }, localSubagentActivityTurns: { currentTurn: 3, lastTurns: [{ turn: 2, childIds: ['demo-previous'] }], unknownChildIds: [] } },
    'demo-running': { modelSelection: { lastUsed: route }, subagentTiming: { settledMs: 0, active: { since: Date.now(), through: Date.now() } } },
    'demo-previous': { modelSelection: { lastUsed: { provider: 'example-review', model: 'review-model' } }, subagentTiming: { settledMs: 12000, lastTurnCompleted: true } },
  };
  for (const [id, value] of Object.entries(values)) state.projectionsBySession[id] = { state: 'ready', values: value };
  const clone = value => JSON.parse(JSON.stringify(value));
  const descriptor = ns => ({ ns, autoGenerate: false, schema: {}, revision: revisions[ns], value: clone(configs[ns]), user: clone(configs[ns]), applies: 'live', secrets: [] });
  const emit = ns => { for (const fn of listeners) fn(ns, revisions[ns]); };
  const settings = {
    async describe() {
      reads.push(true);
      return { ok: true, value: { writable, hasDocument: true, namespaces: Object.keys(configs).filter(ns => mode !== 'unavailable' || ns !== 'planner-executor-routing').map(descriptor) } };
    },
    async update(ns, patch, expected) {
      writes.push({ ns, patch: clone(patch), revision: expected });
      if (heldWrite) await new Promise(resolve => { heldWrite.resolve = resolve; });
      if (failure) return { ok: false, error: { code: failure } };
      if (!writable) return { ok: false, error: { code: 'settings/read-only' } };
      if (ns === 'planner-executor-routing' && Object.keys(overrides).length) return { ok: false, error: { code: 'settings/rejected', message: `Configuration for "${ns}" is overridden by a home patch or command-line overlay` } };
      if (expected !== revisions[ns]) return { ok: false, error: { code: 'settings/conflict' } };
      const next = { ...configs[ns], ...clone(patch) };
      if (next.enabled && (!next.targetRoute || !next.parentRoutes?.length)) return { ok: false, error: { code: 'settings/invalid' } };
      configs[ns] = next; revisions[ns] += 1;
      emit(ns);
      return { ok: true, value: descriptor(ns) };
    },
  };
  const dictionaries = new Map();
  const locale = {
    register(ns, dicts) { dictionaries.set(ns, dicts); return () => dictionaries.delete(ns); },
    getSnapshot: () => ({ active: language, revision: 0 }),
    subscribe(fn) { localeListeners.add(fn); return () => localeListeners.delete(fn); },
    bind: ns => (key, args) => (dictionaries.get(ns)?.[language]?.[key] ?? dictionaries.get(ns)?.en[key] ?? key).replace(/\{(\w+)\}/g, (m, k) => args?.[k] ?? m),
  };
  const root = ReactDOM.createRoot(document.querySelector('#root'));
  const configMount = document.createElement('div'); configMount.id = 'settings-root'; document.querySelector('main').append(configMount);
  const configRoot = ReactDOM.createRoot(configMount);
  const ctx = {
    locale,
    inject(names, fn) { if (names[0] === 'locale') fn({ locale }); else if (names[0] === 'remote.settings') fn({ remote: { settings } }); else if (names[0] === 'remote.subagents') fn({ remote: { subagents: this.remote.subagents } }); },
    on(event, fn) { if (event === 'connection/reset') { resetListeners.add(fn); return () => resetListeners.delete(fn); } return () => {}; },
    remote: {
      $on(_event, fn) { listeners.add(fn); return () => listeners.delete(fn); },
      session: {
        async projections({ sessionId }) { return { ok: true, value: { kind: 'sequenced', asOfSeq: 5, values: values[sessionId] } }; },
        async modelCatalog() {
          if (mode === 'no-catalog') return { ok: false, error: { code: 'model/catalog-unavailable' } };
          return { ok: true, value: { groups: [
            { id: 'example-planner', name: 'Example planner', models: [{ id: 'planning-model', name: 'Planning model' }] },
            { id: 'example-executor', name: 'Example executor', models: [{ id: 'execution-model', name: 'Execution model' }] },
            { id: 'example-review', name: 'Example reviewer', models: [{ id: 'review-model', name: 'Review model' }] },
          ], failures: [] } };
        },
      },
      subagents: { async interruptByParent() { return { ok: false, error: { message: language === 'zh' ? '演示夹具不会中断真实任务' : 'The demo cannot interrupt real tasks' } }; } },
    },
    uiWorkspace: { openSession() {} },
    slots: {
      inject(_name, fn) { fn(); },
      register(options, Component) {
        const props = { ...options.inject?.(), view: 'page', useSessions: selector => selector(state), useSessionStatus: selector => selector(new Map([['demo-root', { running: true }], ['demo-running', { running: true }]])) };
        if (options.name === 'shell.overlay') root.render(React.createElement(Component, props));
        else if (showSettings && options.name === 'plugins.bundle.config') configRoot.render(React.createElement(Component, props));
      },
    },
  };
  window.activityDemo = {
    writes, reads, configs, settings,
    changeLocale(next) { language = next; for (const fn of localeListeners) fn(); },
    external(ns, patch) { configs[ns] = { ...configs[ns], ...clone(patch) }; revisions[ns] += 1; emit(ns); },
    setWritable(value) { writable = value; for (const fn of resetListeners) fn(); },
    setOverrides(value) { overrides = value; revisions['planner-executor-routing'] += 1; emit('planner-executor-routing'); },
    fail(code) { failure = code; },
    hold() { heldWrite = {}; },
    release() { const current = heldWrite; heldWrite = null; current?.resolve?.(); },
    reconnect() { for (const ns of Object.keys(revisions)) revisions[ns] = 0; for (const fn of resetListeners) fn(); },
  };
  window.activityPlugin.apply(ctx);
})();
