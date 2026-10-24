/* Public synthetic demo using the unchanged production client bundle. No fetch. */
(() => {
  const params = new URLSearchParams(location.search);
  const language = params.get('lang') === 'zh-CN' ? 'zh' : 'en';
  const mode = params.get('state') || 'off';
  if (language === 'zh') {
    document.documentElement.lang = 'zh-CN';
    document.querySelector('#heading').textContent = '代理活动';
    document.querySelector('#intro').textContent = '聚焦主代理与直接子代理。右侧面板使用真实 client bundle，以公开的合成夹具提供数据。';
    document.querySelector('#contract').textContent = '实际 lastUsed 模型 · 当前 / 上一轮 · 原生打开与 Stop 权限 · 可选 DS执行，仅影响后续新委派';
    document.querySelector('#disclaimer').textContent = '合成演示 — 非真实宿主或 GUI 验收。没有会话、凭据、API 网络请求或收费模型调用。';
  }
  const labels = language === 'zh' ? ['审查发布范围与测试证据', '实现导出与回归测试', '审查无障碍与国际化'] : ['Review release scope and test evidence', 'Implement export and regression tests', 'Review accessibility and localization'];
  const route = { provider: 'deepseek', model: 'deepseek-chat' };
  const config = { enabled: mode === 'on', parentRoutes: [{ provider: 'example-planner', model: 'planning-model' }], targetRoute: mode === 'unconfigured' ? null : route };
  let revision = 1;
  const listeners = new Set();
  const state = {
    ids: ['demo-root', 'demo-running', 'demo-previous'],
    byId: {
      'demo-root': { retainedBy: { mainView: 1 }, title: labels[0], running: true },
      'demo-running': { parentId: 'demo-root', origin: 'subagent', running: true },
      'demo-previous': { parentId: 'demo-root', origin: 'subagent', running: false },
    },
    projectionsBySession: {},
  };
  const values = {
    'demo-root': { subagentCatalog: [{ id: 'demo-running', label: labels[1], mode: 'continuable' }, { id: 'demo-previous', label: labels[2], mode: 'one-shot' }], modelSelection: { lastUsed: { provider: 'example-planner', model: 'planning-model' } }, localSubagentActivityTurns: { currentTurn: 3, lastTurns: [{ turn: 2, childIds: ['demo-previous'] }], unknownChildIds: [] } },
    'demo-running': { modelSelection: { lastUsed: route }, subagentTiming: { settledMs: 0, active: { since: Date.now(), through: Date.now() } } },
    'demo-previous': { modelSelection: { lastUsed: { provider: 'example-review', model: 'review-model' } }, subagentTiming: { settledMs: 12000, lastTurnCompleted: true } },
  };
  for (const [id, value] of Object.entries(values)) state.projectionsBySession[id] = { state: 'ready', values: value };
  const descriptor = () => ({ ns: 'planner-executor-routing', revision, value: { ...config } });
  const settings = {
    async describe() { return { ok: true, value: { writable: true, namespaces: mode === 'unavailable' ? [] : [descriptor()] } }; },
    async update(ns, patch, expected) {
      if (expected !== revision) return { ok: false, error: { code: 'settings/conflict' } };
      if (patch.enabled && config.targetRoute === null) return { ok: false, error: { code: 'settings/refused' } };
      config.enabled = patch.enabled; revision += 1;
      for (const fn of listeners) fn(ns, revision);
      return { ok: true, value: descriptor() };
    },
  };
  const dictionaries = new Map();
  const locale = { register(ns, dicts) { dictionaries.set(ns, dicts); return () => dictionaries.delete(ns); }, getSnapshot: () => ({ active: language, revision: 0 }), subscribe: () => () => {}, bind: ns => (key, args) => (dictionaries.get(ns)?.[language]?.[key] ?? dictionaries.get(ns)?.en[key] ?? key).replace(/\{(\w+)\}/g, (m, k) => args?.[k] ?? m) };
  const root = ReactDOM.createRoot(document.querySelector('#root'));
  const ctx = {
    locale,
    inject(names, fn) { if (names[0] === 'locale') fn({ locale }); else if (names[0] === 'remote.settings') fn({ remote: { settings } }); else if (names[0] === 'remote.subagents') fn({ remote: { subagents: this.remote.subagents } }); },
    on: () => () => {},
    remote: {
      $on(_event, fn) { listeners.add(fn); return () => listeners.delete(fn); },
      session: { async projections({ sessionId }) { return { ok: true, value: { kind: 'sequenced', asOfSeq: 5, values: values[sessionId] } }; } },
      subagents: { async interruptByParent() { return { ok: false, error: { message: language === 'zh' ? '演示夹具不会中断真实任务' : 'The demo cannot interrupt real tasks' } }; } },
    },
    uiWorkspace: { openSession() {} },
    slots: { inject(_name, fn) { fn(); }, register(options, Component) { root.render(React.createElement(Component, { ...options.inject(), useSessions: selector => selector(state), useSessionStatus: selector => selector(new Map([['demo-root', { running: true }], ['demo-running', { running: true }]])) })); } },
  };
  window.activityPlugin.apply(ctx);
})();
