window.__ModuleLoader__.load({
  id: "dsh-agent-activity",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");

    const h = React.createElement;
    const DICTIONARIES = {
  "en": {
    "panelTitle": "Activity",
    "未知错误": "Unknown error",
    "settings 读取没有返回结果": "Settings read returned no result",
    "settings 状态格式无效": "Invalid settings state",
    "投影读取未成功": "Projection read did not succeed",
    "未知投影结果格式": "Unknown projection result format",
    "settings 读取被拒绝": "Settings read was refused",
    "当前 profile 不允许写入设置": "The current profile does not allow settings writes",
    "settings 未提供 revision": "Settings did not provide a revision",
    "设置保存没有返回结果": "Settings save returned no result",
    "设置保存被拒绝": "Settings save was refused",
    "设置保存回执不完整": "Incomplete settings receipt",
    "设置保存回执缺少 revision": "Settings receipt has no revision",
    "DS执行：…": "DS: …",
    "DS执行：不可用": "DS: unavailable",
    "DS执行：未配置": "DS: not set",
    "DS执行：开": "DS: ON",
    "DS执行：关": "DS: OFF",
    "子代理目录需要迁移，当前只能显示缓存提示；不会据此判定没有子代理。": "The child catalog needs migration. Cached hints do not prove there are no children.",
    "无法读取子代理目录，可点击刷新重试。": "Cannot read the child catalog. Refresh to retry.",
    "正在通过 session.projections RPC 读取子代理目录…": "Reading the child catalog through session.projections RPC…",
    "子代理目录投影尚未返回；不能据此判断没有子代理。": "The child catalog projection is missing; this does not prove there are no children.",
    "运行中": "Running",
    "已完成": "Completed",
    "空闲": "Idle",
    "未运行": "Inactive",
    "主代理": "Main agent",
    "可继续": "Continuable",
    "一次性": "One-shot",
    "外部任务": "External task",
    "模式未知": "Unknown mode",
    "代理活动面板异常": "Agent activity could not render",
    "重试": "Retry",
    "设置已被其他窗口更新，已显示最新值": "Another window changed the settings. Showing the latest value.",
    "DS执行策略": "DS execution policy",
    "重试保存": "Retry save",
    "重新读取": "Read again",
    "停止请求被拒绝": "Stop request was refused",
    "打开代理活动面板": "Open agent activity",
    "未命名子代理": "Unnamed child agent",
    "尚无实际使用记录": "No actual request recorded yet",
    "模型未知": "Unknown model",
    "打开": "Open",
    "停止中…": "Stopping…",
    "确认停止": "Confirm stop",
    "Stop": "Stop",
    "中断该子代理当前回合": "Interrupt this child’s current turn",
    "代理活动面板": "Agent activity panel",
    "代理活动": "Agent activity",
    "刷新": "Refresh",
    "展开": "Expand",
    "折叠": "Collapse",
    "展开代理活动面板": "Expand agent activity",
    "折叠代理活动面板": "Collapse agent activity",
    "隐藏代理活动面板": "Hide agent activity",
    "未找到当前主会话。": "No current main session found.",
    "当前运行中": "Running now",
    "无运行中的子代理": "No running child agents",
    "上一轮": "Previous turn",
    "上一轮暂无可显示的已结束子代理": "No ended child agents to show for the previous turn",
    "尚无可用轮次记录": "No turn records available yet",
    "remote.session.projections 不可用": "remote.session.projections is unavailable",
    "remote.settings 不可用": "remote.settings is unavailable",
    "远程 subagents 服务不可用": "Remote subagents service is unavailable",
    "未找到 {ns} 设置（Host 插件未加载）": "No {ns} settings found (Host routing companion is not mounted)",
    "投影读取失败：{detail}": "Projection read failed: {detail}",
    "读取失败：{detail}": "Read failed: {detail}",
    "保存失败：{detail}": "Save failed: {detail}",
    "打开失败：{detail}": "Open failed: {detail}",
    "停止失败：{detail}": "Stop failed: {detail}",
    "DS执行开关：{detail}": "DS execution: {detail}",
    "DS执行：Host 设置不可用，尚未取得确认状态": "DS execution: Host settings unavailable; no confirmed state",
    "DS执行：当前 profile 不允许写入设置": "DS execution: current profile does not allow settings writes",
    "DS执行：开 — 仅后续匹配的新委派使用 {target}": "DS execution: ON — only future matching delegations use {target}",
    "DS执行：关 — 子代理遵循 DSH 原生继承/显式选择，不强制 provider": "DS execution: OFF — native DSH inheritance/explicit selection; no forced provider",
    "DS执行：未配置 — 请配置 parentRoutes 与 targetRoute 后再开启": "DS execution: not configured — set parentRoutes and targetRoute before enabling",
    "设置冲突，请重读后重试": "Settings conflict. Read again before retrying.",
    "设置操作失败": "Settings operation failed",
    "provider {id}": "provider {id}",
    "reasoning {id}": "reasoning {id}"
  },
  "zh": {
    "panelTitle": "代理活动",
    "未知错误": "未知错误",
    "settings 读取没有返回结果": "settings 读取没有返回结果",
    "settings 状态格式无效": "settings 状态格式无效",
    "投影读取未成功": "投影读取未成功",
    "未知投影结果格式": "未知投影结果格式",
    "settings 读取被拒绝": "settings 读取被拒绝",
    "当前 profile 不允许写入设置": "当前 profile 不允许写入设置",
    "settings 未提供 revision": "settings 未提供 revision",
    "设置保存没有返回结果": "设置保存没有返回结果",
    "设置保存被拒绝": "设置保存被拒绝",
    "设置保存回执不完整": "设置保存回执不完整",
    "设置保存回执缺少 revision": "设置保存回执缺少 revision",
    "DS执行：…": "DS执行：…",
    "DS执行：不可用": "DS执行：不可用",
    "DS执行：未配置": "DS执行：未配置",
    "DS执行：开": "DS执行：开",
    "DS执行：关": "DS执行：关",
    "子代理目录需要迁移，当前只能显示缓存提示；不会据此判定没有子代理。": "子代理目录需要迁移，当前只能显示缓存提示；不会据此判定没有子代理。",
    "无法读取子代理目录，可点击刷新重试。": "无法读取子代理目录，可点击刷新重试。",
    "正在通过 session.projections RPC 读取子代理目录…": "正在通过 session.projections RPC 读取子代理目录…",
    "子代理目录投影尚未返回；不能据此判断没有子代理。": "子代理目录投影尚未返回；不能据此判断没有子代理。",
    "运行中": "运行中",
    "已完成": "已完成",
    "空闲": "空闲",
    "未运行": "未运行",
    "主代理": "主代理",
    "可继续": "可继续",
    "一次性": "一次性",
    "外部任务": "外部任务",
    "模式未知": "模式未知",
    "代理活动面板异常": "代理活动面板异常",
    "重试": "重试",
    "设置已被其他窗口更新，已显示最新值": "设置已被其他窗口更新，已显示最新值",
    "DS执行策略": "DS执行策略",
    "重试保存": "重试保存",
    "重新读取": "重新读取",
    "停止请求被拒绝": "停止请求被拒绝",
    "打开代理活动面板": "打开代理活动面板",
    "未命名子代理": "未命名子代理",
    "尚无实际使用记录": "尚无实际使用记录",
    "模型未知": "模型未知",
    "打开": "打开",
    "停止中…": "停止中…",
    "确认停止": "确认停止",
    "Stop": "停止",
    "中断该子代理当前回合": "中断该子代理当前回合",
    "代理活动面板": "代理活动面板",
    "代理活动": "代理活动",
    "刷新": "刷新",
    "展开": "展开",
    "折叠": "折叠",
    "展开代理活动面板": "展开代理活动面板",
    "折叠代理活动面板": "折叠代理活动面板",
    "隐藏代理活动面板": "隐藏代理活动面板",
    "未找到当前主会话。": "未找到当前主会话。",
    "当前运行中": "当前运行中",
    "无运行中的子代理": "无运行中的子代理",
    "上一轮": "上一轮",
    "上一轮暂无可显示的已结束子代理": "上一轮暂无可显示的已结束子代理",
    "尚无可用轮次记录": "尚无可用轮次记录",
    "remote.session.projections 不可用": "remote.session.projections 不可用",
    "remote.settings 不可用": "remote.settings 不可用",
    "远程 subagents 服务不可用": "远程 subagents 服务不可用",
    "未找到 {ns} 设置（Host 插件未加载）": "未找到 {ns} 设置（Host 插件未加载）",
    "投影读取失败：{detail}": "投影读取失败：{detail}",
    "读取失败：{detail}": "读取失败：{detail}",
    "保存失败：{detail}": "保存失败：{detail}",
    "打开失败：{detail}": "打开失败：{detail}",
    "停止失败：{detail}": "停止失败：{detail}",
    "DS执行开关：{detail}": "DS执行开关：{detail}",
    "DS执行：Host 设置不可用，尚未取得确认状态": "DS执行：Host 设置不可用，尚未取得确认状态",
    "DS执行：当前 profile 不允许写入设置": "DS执行：当前 profile 不允许写入设置",
    "DS执行：开 — 仅后续匹配的新委派使用 {target}": "DS执行：开 — 仅后续匹配的新委派使用 {target}",
    "DS执行：关 — 子代理遵循 DSH 原生继承/显式选择，不强制 provider": "DS执行：关 — 子代理遵循 DSH 原生继承/显式选择，不强制 provider",
    "DS执行：未配置 — 请配置 parentRoutes 与 targetRoute 后再开启": "DS执行：未配置 — 请配置 parentRoutes 与 targetRoute 后再开启",
    "设置冲突，请重读后重试": "设置冲突，请重读后重试",
    "设置操作失败": "设置操作失败",
    "provider {id}": "provider {id}",
    "reasoning {id}": "reasoning {id}"
  }
};
    // Both languages include every configuration label, hint and local error.
    const SETTINGS_MESSAGES = {
      title: ["Agent activity settings", "代理活动设置"],
      intro: ["Two independent settings sections. Edits stay in this page until you save that card.", "两个设置区独立保存。编辑仅保留在本页，点击对应卡片保存后才会写入。"],
      pageLanguage: ["Page language (preview only)", "本页语言（仅预览）"],
      auto: ["Follow DSH", "跟随 DSH"],
      hostAuto: ["Automatic (English on Host)", "自动（Host 使用英文）"],
      english: ["English", "English"], chinese: ["Simplified Chinese", "简体中文"],
      panel: ["Activity panel", "活动浮窗"], routing: ["DS execution routing", "DS 执行路由"],
      panelHint: ["Only the panel language is saved here; the routing language is independent.", "这里只保存浮窗语言；路由错误语言独立设置。"],
      panelLocale: ["Panel language", "浮窗语言"], routingLocale: ["Routing error language", "路由错误语言"],
      routingHint: ["Only future new delegations whose parent provider/model exactly matches a condition are routed. Existing children and follow-ups are unchanged. OFF uses native DSH inheritance or explicit selection.", "仅路由后续新建且父 provider/model 精确匹配条件的委派。已有子代理及后续消息不变。关闭时遵循 DSH 原生继承或显式选择。"],
      enabled: ["Enable routing for future matching delegations", "为后续匹配的新委派开启路由"],
      parents: ["Parent route conditions", "父路由匹配条件"],
      parentHint: ["Conditions match provider and model only; reasoning effort does not affect matching.", "条件仅匹配 provider 和 model；推理强度不参与匹配。"],
      parent: ["Parent condition {index}", "父匹配条件 {index}"],
      target: ["Execution target", "执行目标"],
      provider: ["Exact provider id", "精确 provider 标识"], model: ["Exact model id", "精确 model 标识"],
      reasoning: ["Reasoning effort (optional)", "推理强度（可选）"],
      manual: ["Enter exact configured provider/model ids, not display names. No model or reasoning capabilities are assumed; enter reasoning only when supported by your provider. No API keys are requested or stored here.", "请输入已配置的精确 provider/model 标识，而非显示名称。不推测模型或推理能力；仅在 provider 支持时填写推理强度。此处不索取或保存 API key。"],
      add: ["Add condition", "添加条件"], remove: ["Remove condition {index}", "移除条件 {index}"],
      clearTarget: ["Clear execution target", "清空执行目标"], setTarget: ["Set execution target", "设置执行目标"],
      noParents: ["No parent conditions configured.", "尚未配置父匹配条件。"], noTarget: ["No execution target configured.", "尚未配置执行目标。"],
      savePanel: ["Save panel settings", "保存浮窗设置"], saveRouting: ["Save routing settings", "保存路由设置"],
      saving: ["Saving…", "正在保存…"], discard: ["Discard draft", "丢弃草稿"], read: ["Read Host again", "重新读取 Host"],
      review: ["Keep draft against latest revision", "以最新版本重新审阅并保留草稿"],
      reviewHint: ["Review the latest Host value below before keeping your draft. Saving is always a separate explicit action.", "保留草稿前请对照下方最新 Host 值审阅。保存始终需要再次明确点击。"],
      conflict: ["Host settings changed. Your draft was preserved; nothing was retried. Compare the latest value, then discard or explicitly keep and review your draft before saving.", "Host 设置已变化。已保留草稿，未重试任何旧意图。请对照最新值后丢弃草稿，或明确保留并重新审阅再保存。"],
      disconnected: ["The Host connection changed. Draft preserved; old requests cannot confirm this connection. Read and review the new Host state before saving.", "Host 连接已变化。草稿已保留；旧请求不能确认新连接的状态。保存前请读取并审阅新 Host 状态。"],
      readonly: ["This profile is read-only. Editing and saving are disabled.", "当前 profile 为只读。已禁用编辑与保存。"],
      overridden: ["A home patch or command-line overlay overrides this section. Host refused the write; editing and saving are disabled. Change that higher-priority configuration outside this page, then reopen this page.", "home patch 或命令行覆盖层控制此设置区。Host 已拒绝写入，编辑与保存已禁用。请在本页之外修改高优先级配置后重新打开本页。"],
      unavailable: ["Host settings unavailable. No confirmed OFF or saved value is inferred.", "Host 设置不可用；不会推断为关闭或已保存。"],
      loading: ["Reading Host settings…", "正在读取 Host 设置…"], dirty: ["Unsaved draft", "有未保存草稿"], clean: ["No unsaved changes", "无未保存修改"],
      saved: ["Host confirmed the saved value.", "Host 已确认保存后的值。"],
      confirmed: ["Host-confirmed value · revision {revision}", "Host 确认值 · revision {revision}"],
      current: ["Latest Host value (not your draft)", "最新 Host 值（非草稿）"],
      inherited: ["Composition base", "组合继承值"], user: ["Profile user overrides", "profile 用户覆盖值"],
      on: ["ON", "开"], off: ["OFF", "关"], unconfigured: ["Not configured", "未配置"],
      invalidLocale: ["Choose auto, en or zh-CN.", "请选择 auto、en 或 zh-CN。"],
      invalidRoute: ["Each route needs exact, non-empty provider/model ids without whitespace. Optional reasoning effort must also contain no whitespace.", "每条路由必须填写非空且不含空白的精确 provider/model 标识。可选推理强度也不得包含空白。"],
      needsRoutes: ["Configure at least one valid parent condition and an execution target before enabling routing.", "开启路由前必须配置至少一条有效父匹配条件及执行目标。"],
      missing: ["Host namespace {ns} is not mounted. This card cannot be saved.", "Host 命名空间 {ns} 未挂载，无法保存此卡片。"],
      invalidState: ["Host returned invalid settings or revision. No state was assumed.", "Host 返回的设置或 revision 无效，未推断任何状态。"],
      rejected: ["Host refused the save. Draft preserved; no automatic retry.", "Host 拒绝保存。已保留草稿，不会自动重试。"],
      failed: ["Settings operation failed. Draft preserved; no automatic retry.", "设置操作失败。已保留草稿，不会自动重试。"],
      catalogReady: ["Host catalog suggestions are available; option values are the exact ids. You can still enter ids manually.", "可使用 Host 目录建议；选项值为精确标识。仍可手动输入标识。"],
      catalogPartial: ["The Host catalog is partial. Missing entries do not prove a model is unsupported; exact manual ids remain available.", "Host 目录仅部分可用。缺失条目不代表模型不受支持；仍可手动输入精确标识。"],
      catalogUnavailable: ["The optional Host catalog is unavailable or still loading. Exact manual ids remain available.", "可选 Host 目录不可用或正在读取。仍可手动输入精确标识。"],
      detail: ["Host detail: {detail}", "Host 详情：{detail}"],
    };
    for (const [key, [en, zh]] of Object.entries(SETTINGS_MESSAGES)) {
      DICTIONARIES.en[`settings.${key}`] = en;
      DICTIONARIES.zh[`settings.${key}`] = zh;
    }
    const I18N_NS = "o-oii.agent-activity";
    let activeLocale = "en";
    let localeOverride = "auto";
    let explicitLocaleOverride = "auto";
    let panelLocaleRevision = -1;
    function adoptPanelLocale(result) {
      const descriptor = result?.ok === true ? result.value?.namespaces?.find(item => item.ns === PANEL_ID) : undefined;
      if (!descriptor || !Number.isSafeInteger(descriptor.revision) || descriptor.revision < 0 || descriptor.revision < panelLocaleRevision) return;
      const value = descriptor.value?.locale;
      if (!["auto", "en", "zh-CN"].includes(value)) return;
      panelLocaleRevision = descriptor.revision;
      // Client config is bootstrap-only. A valid Host view/receipt is authoritative.
      const next = value;
      if (next !== localeOverride) { localeOverride = next; notifyLocale(); }
    }
    let localeService;
    const localeListeners = new Set();
    let localeVersion = 0;
    function notifyLocale() { localeVersion += 1; for (const fn of localeListeners) fn(); }
    function normalizeLocale(value) { return /^zh(?:-|$)/i.test(String(value)) ? "zh" : "en"; }
    function setLocale(value) { activeLocale = normalizeLocale(value); notifyLocale(); }
    function t(key, params) {
      const locale = localeOverride === "auto" ? activeLocale : normalizeLocale(localeOverride);
      let template = DICTIONARIES[locale]?.[key] ?? DICTIONARIES.en[key] ?? key;
      if (localeOverride === "auto" && localeService) {
        try { const translated = localeService.bind(I18N_NS)(key, params); if (translated !== key) template = translated; } catch {}
      }
      return template.replace(/\{(\w+)\}/g, (match, name) => params && name in params ? String(params[name]) : match);
    }
    function notice(key, params) { return { key, params }; }
    function useLocaleUpdates() {
      if (typeof React.useSyncExternalStore === "function") {
        React.useSyncExternalStore(fn => { localeListeners.add(fn); return () => localeListeners.delete(fn); }, () => localeVersion, () => 0);
        return;
      }
      const [, update] = React.useState(0);
      React.useEffect(() => { const fn = () => update(value => value + 1); localeListeners.add(fn); return () => localeListeners.delete(fn); }, []);
    }
    function connectLocale(ctx) {
      if (typeof ctx.inject !== "function") return;
      ctx.inject(["locale"], child => {
        const service = child.locale;
        localeService = service;
        const disposeDict = service.register(I18N_NS, DICTIONARIES);
        const sync = () => setLocale(service.getSnapshot().active);
        const unsubscribe = service.subscribe(sync);
        sync();
        return () => { unsubscribe(); disposeDict(); if(localeService === service) localeService = undefined; setLocale("en"); };
      });
    }

    const PANEL_ID = "subagent-activity";
    const SUBAGENT_TURNS_KEY = "localSubagentActivityTurns";
    // Profile entry id of the Host routing plugin; also its official settings
    // namespace. The panel reads and writes that one namespace and nothing else.
    const STRATEGY_NS = "planner-executor-routing";
    const EMPTY_IDS = [];
    const EMPTY_BY_ID = {};
    const EMPTY_PROJECTIONS = {};
    const EMPTY = "—";
    const PROJECTION_POLL_MS = 3_000;
    const PROJECTION_CONCURRENCY = 2;
    const FINAL_RETRY_DELAYS = [0, 750, 2_000];
    const DEFAULT_TIMERS = {
      setTimeout: (callback, delay) => globalThis.setTimeout(callback, delay),
      clearTimeout: (id) => globalThis.clearTimeout(id),
      setInterval: (callback, delay) => globalThis.setInterval(callback, delay),
      clearInterval: (id) => globalThis.clearInterval(id),
    };

    /**
     * Keep display text non-empty; every caller turns `undefined` into its own
     * explicit fallback instead of rendering "undefined".
     * @param {unknown} value - candidate text.
     * @returns {string | undefined} usable text.
     */
    function text(value) {
      return typeof value === "string" && value.trim() !== "" ? value : undefined;
    }

    /**
     * Human-readable message for an unknown thrown value.
     * @param {unknown} error - thrown value.
     * @returns {string} short message.
     */
    function errorMessage(error) {
      if (error && typeof error === "object") {
        const localCodes = {
          "dsh-agent-activity/settings-unavailable": "remote.settings 不可用",
          "dsh-agent-activity/projections-unavailable": "remote.session.projections 不可用",
          "dsh-agent-activity/projections-failed": "投影读取未成功",
          "dsh-agent-activity/projections-result": "未知投影结果格式",
          "dsh-agent-activity/subagents-unavailable": "远程 subagents 服务不可用",
          "settings/conflict": "设置冲突，请重读后重试",
        };
        if (localCodes[error.code]) return t(localCodes[error.code]);
        if (error.key) return t(error.key, Object.fromEntries(Object.entries(error.params ?? {}).map(([key, value]) => [key, value && typeof value === "object" ? errorMessage(value) : value])));
        const message = text(error.message);
        if (message !== undefined) return message;
        const code = text(error.code);
        if (code !== undefined) return code;
      }
      const printable = typeof error === "string" ? error : "";
      return printable !== "" ? printable : t("未知错误");
    }

    /**
     * Compact token count in the same shape the built-in subagent catalog uses.
     * @param {number | undefined} value - token total.
     * @returns {string} compact count, or an em dash when unknown.
     */
    function formatTokens(value) {
      if (typeof value !== "number" || !Number.isFinite(value)) return EMPTY;
      const scaled = (next) => (next >= 100 ? String(Math.round(next)) : String(Math.round(next * 10) / 10));
      if (value < 1e3) return String(Math.round(value));
      if (value < 1e6) return `${scaled(value / 1e3)}K`;
      return `${scaled(value / 1e6)}M`;
    }

    /**
     * Sum the four disjoint durable provider-usage buckets.
     * @param {Record<string, unknown> | undefined} usage - tokenUsage projection view.
     * @returns {number | undefined} total tokens, or undefined when the projection is absent.
     */
    function tokenTotal(usage) {
      if (usage === null || typeof usage !== "object") return undefined;
      const fields = [
        usage.uncachedInputTokens,
        usage.outputTokens,
        usage.cacheReadTokens,
        usage.cacheWriteTokens,
      ];
      if (fields.every((value) => typeof value !== "number" || !Number.isFinite(value))) return undefined;
      return fields.reduce((sum, value) => sum + (typeof value === "number" && Number.isFinite(value) ? value : 0), 0);
    }

    /**
     * Format an active duration with decreasing precision at larger scales.
     * @param {number | undefined} ms - duration in milliseconds.
     * @returns {string} compact duration, or an em dash when unknown.
     */
    function formatDuration(ms) {
      if (typeof ms !== "number" || !Number.isFinite(ms)) return EMPTY;
      const totalSeconds = Math.floor(Math.max(0, ms) / 1e3);
      const seconds = totalSeconds % 60;
      const totalMinutes = Math.floor(totalSeconds / 60);
      const minutes = totalMinutes % 60;
      const totalHours = Math.floor(totalMinutes / 60);
      if (totalHours > 0) return `${totalHours}h${String(minutes).padStart(2, "0")}m`;
      if (totalMinutes > 0) return `${totalMinutes}m${String(seconds).padStart(2, "0")}s`;
      return `${seconds}s`;
    }

    /**
     * Local wall-clock label for the last RPC snapshot. This is presentation
     * only; ordering always uses the projection `asOfSeq`, never this clock.
     * @param {number | undefined} value - epoch milliseconds.
     * @returns {string} HH:mm:ss, or an em dash.
     */
    function formatClock(value) {
      if (typeof value !== "number" || !Number.isFinite(value)) return EMPTY;
      const date = new Date(value);
      return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    }

    /**
     * Total active turn duration from the durable subagentTiming projection.
     * @param {{ settledMs?: number, active?: { since?: number, through?: number }, lastTurnCompleted?: boolean } | undefined} timing - projection view.
     * @param {boolean} running - whether the session is currently running.
     * @param {number} now - render clock in milliseconds.
     * @returns {number | undefined} active milliseconds, or undefined when the projection is absent.
     */
    function activityDuration(timing, running, now) {
      if (timing === null || typeof timing !== "object" || typeof timing.settledMs !== "number" || !Number.isFinite(timing.settledMs)) return undefined;
      let total = Math.max(0, timing.settledMs);
      const active = timing.active;
      if (active !== null && typeof active === "object" && typeof active.since === "number" && Number.isFinite(active.since)) {
        const through = typeof active.through === "number" && Number.isFinite(active.through) ? active.through : active.since;
        const end = running ? now : through;
        total += Math.max(0, end - active.since);
      }
      return total;
    }

    /**
     * Read the status map entry defensively; the slot standard prop is a Map but
     * a future store shape must not blank the panel.
     * @param {unknown} statuses - useSessionStatus value.
     * @param {string} sessionId - session identity.
     * @returns {{ running?: boolean } | undefined} status entry.
     */
    function statusEntry(statuses, sessionId) {
      if (statuses === null || statuses === undefined) return undefined;
      if (typeof statuses.get === "function") return statuses.get(sessionId);
      if (typeof statuses === "object") return statuses[sessionId];
      return undefined;
    }

    /**
     * Resolve the current running bit from the live status map, falling back to
     * the session-list summary.
     * @param {unknown} statuses - useSessionStatus value.
     * @param {string} sessionId - session identity.
     * @param {{ running?: boolean } | undefined} summary - session-list row.
     * @returns {boolean} running state.
     */
    function isRunning(statuses, sessionId, summary) {
      const entry = statusEntry(statuses, sessionId);
      if (entry !== undefined && typeof entry.running === "boolean") return entry.running;
      return summary?.running === true;
    }

    /**
     * Normalize one `ctx.remote.settings.describe()` result into the single
     * namespace this panel owns. The Host stays the fact source: no value is
     * taken from local storage, and a missing namespace is reported, not guessed.
     * @param {unknown} result - RemoteResult envelope from the gateway.
     * @returns {{ enabled?: boolean, revision?: number, writable: boolean, error: string | null }} normalized view.
     */
    function routingConfigured(value) {
      const valid = route => route && typeof route.provider === "string" && /^\S+$/.test(route.provider) && typeof route.model === "string" && /^\S+$/.test(route.model) && (route.reasoningEffort === undefined || typeof route.reasoningEffort === "string" && /^\S+$/.test(route.reasoningEffort));
      return Boolean(valid(value?.targetRoute) && Array.isArray(value?.parentRoutes) && value.parentRoutes.length > 0 && value.parentRoutes.every(valid));
    }
    function strategyFromDescribe(result) {
      if (result === null || typeof result !== "object") return { writable: false, error: notice("settings 读取没有返回结果") };
      if (result.ok !== true) {
        const message = result.error && typeof result.error === "object" ? result.error : notice("settings 读取被拒绝");
        return { writable: false, error: message };
      }
      const view = result.value;
      const namespaces = Array.isArray(view?.namespaces) ? view.namespaces : [];
      const found = namespaces.find((entry) => entry !== null && typeof entry === "object" && entry.ns === STRATEGY_NS);
      if (found === undefined) {
        return {
          writable: view?.writable === true,
          error: view?.writable === false ? t("当前 profile 不允许写入设置") : notice("未找到 {ns} 设置（Host 插件未加载）", { ns: STRATEGY_NS }),
        };
      }
      if (typeof found.value?.enabled !== "boolean") return { writable: false, error: notice("settings 状态格式无效") };
      const revision = Number.isSafeInteger(found.revision) && found.revision >= 0 ? found.revision : undefined;
      if (revision === undefined) return { writable: false, error: notice("settings 未提供 revision") };
      return {
        enabled: found.value?.enabled === true,
        configured: routingConfigured(found.value),
        targetRoute: found.value?.targetRoute,
        revision,
        writable: view?.writable === true,
        error: null,
      };
    }

    /**
     * Normalize one `settings.update()` receipt. The receipt — never the clicked
     * intent — decides the displayed state.
     * @param {unknown} result - RemoteResult envelope whose value is a namespace view.
     * @returns {{ enabled?: boolean, revision?: number, error: string | null, conflict?: boolean }} normalized view.
     */
    function strategyFromUpdate(result) {
      if (result === null || typeof result !== "object") return { error: notice("设置保存没有返回结果") };
      if (result.ok !== true) {
        const error = result.error !== null && typeof result.error === "object" ? result.error : {};
        const message = notice(error.code === "settings/conflict" ? "设置冲突，请重读后重试" : "设置保存被拒绝");
        // The settings controller maps a stale revision to exactly this code.
        const conflict = error.code === "settings/conflict";
        return { error: message, conflict };
      }
      const view = result.value;
      if (view === null || typeof view !== "object" || view.ns !== STRATEGY_NS) return { error: notice("设置保存回执不完整") };
      if (typeof view.value?.enabled !== "boolean") return { error: notice("settings 状态格式无效") };
      const revision = Number.isSafeInteger(view.revision) && view.revision >= 0 ? view.revision : undefined;
      if (revision === undefined) return { error: notice("设置保存回执缺少 revision") };
      return {
        enabled: view.value?.enabled === true,
        configured: routingConfigured(view.value),
        targetRoute: view.value?.targetRoute,
        revision,
        error: null,
      };
    }

    /**
     * Visible switch label. Loading is explicit rather than pretending "off",
     * and an error with no Host-confirmed value must not render a made-up OFF.
     * @param {string} status - switch status.
     * @param {boolean} enabled - confirmed Host value.
     * @param {boolean} confirmed - whether any Host read/receipt ever succeeded.
     * @returns {string} compact label.
     */
    function strategyLabel(status, enabled, confirmed, configured = true) {
      if (status !== "loading" && confirmed && configured === false) return t("DS执行：未配置");
      if (status === "loading") return t("DS执行：…");
      if (status === "error" && confirmed !== true) return t("DS执行：不可用");
      return enabled === true ? t("DS执行：开") : t("DS执行：关");
    }

    /**
     * Whether a describe answer may replace the accepted state. Equal revisions
     * are the same raw config; lower revisions are stale and ignored.
     * @param {number} accepted - highest accepted revision, -1 when none.
     * @param {number} incoming - revision from a describe or write receipt.
     * @returns {boolean} accept decision.
     */
    function acceptStrategyRevision(accepted, incoming) {
      if (typeof incoming !== "number" || !Number.isFinite(incoming)) return false;
      return accepted < 0 || incoming >= accepted;
    }

    /**
     * Whether a forwarded settings revision is worth one describe read. Equal or
     * lower revisions cannot carry new state, which is what stops the
     * describe -> event -> describe feedback loop.
     * @param {number} accepted - highest accepted revision, -1 when none.
     * @param {number} incoming - revision carried by the Host event.
     * @returns {boolean} read decision.
     */
    function newerStrategyRevision(accepted, incoming) {
      if (typeof incoming !== "number" || !Number.isFinite(incoming)) return false;
      return accepted < 0 || incoming > accepted;
    }

    /**
     * Whether a write receipt is stale relative to a revision another window
     * already committed while this write was in flight. A stale receipt may end
     * the saving state, but it must never roll the visible value back.
     * @param {number} accepted - highest accepted revision.
     * @param {Record<string, any>} parsed - normalized write receipt or error.
     * @returns {boolean} true when only the saving state may be cleared.
     */
    function staleStrategyReceipt(accepted, parsed) {
      if (parsed === null || typeof parsed !== "object" || parsed.error !== null) return false;
      return !acceptStrategyRevision(accepted, parsed.revision);
    }

    /**
     * State after a connection reset. An in-flight save belongs to the old Host
     * generation, so its receipt will be discarded; without this reset the
     * saving flag could stay true forever and permanently disable the switch.
     * The last confirmed value is kept only as display memory while the new
     * Host read is pending.
     * @param {Record<string, any>} current - current switch view.
     * @returns {Record<string, any>} loading view.
     */
    function resetStrategyState(current) {
      return { ...current, status: "loading", saving: false, pending: null, error: null, writable: false };
    }

    /**
     * Durable selection projection: only `lastUsed`, i.e. a route the Host has
     * actually recorded for a request. `next` is deliberately ignored so the
     * panel never presents an intended route as an actual one.
     * @param {Record<string, any> | undefined} values - session projection values.
     * @returns {{ provider?: string, model?: string, reasoning?: string, recorded: boolean }} route facts.
     */
    function resolveModel(values) {
      const chosen = values?.modelSelection?.lastUsed ?? null;
      const provider = text(chosen?.provider);
      const model = text(chosen?.model);
      return {
        provider,
        model,
        reasoning: text(chosen?.reasoningEffort),
        recorded: provider !== undefined && model !== undefined,
      };
    }

    /**
     * Classify a row into the three states the panel exposes.
     * @param {{ running?: boolean, timing?: { lastTurnCompleted?: boolean }, external?: boolean }} input - row facts.
     * @returns {"running" | "completed" | "inactive"} status key.
     */
    function statusOf(input) {
      if (input.running === true) return "running";
      // `inactive` alone is not completion: only the durable lastTurnCompleted
      // flag (a turn/end whose reason is `completed`) may say "completed".
      if (input.external !== true && input.timing?.lastTurnCompleted === true) return "completed";
      return "inactive";
    }

    /**
     * Direct children in catalog order, with a session-list fallback while the
     * catalog projection has not arrived yet.
     * @param {string | null | undefined} mainId - current main session.
     * @param {Record<string, any>} projections - projectionsBySession.
     * @param {Record<string, any>} byId - session summaries.
     * @param {Record<string, any>} [snapshots] - panel-owned RPC snapshots.
     * @param {Set<string>} [officialLiveIds] - officially live session ids.
     * @returns {Array<Record<string, any>>} direct child descriptors.
     */
    function collectChildEntries(mainId, projections, byId, snapshots, officialLiveIds) {
      if (mainId === null || mainId === undefined) return [];
      const rootView = projectionView(mainId, projections, snapshots, officialLiveIds);
      const catalog = rootView.values.subagentCatalog;
      if (Array.isArray(catalog)) return catalog;
      return Object.values(byId ?? {})
        .filter((summary) => summary !== null && typeof summary === "object" && summary.parentId === mainId && summary.origin === "subagent")
        .sort((left, right) => (left.updatedAt ?? 0) - (right.updatedAt ?? 0))
        .map((summary) => ({
          id: summary.id,
          label: summary.title ?? summary.displayTitle,
          mode: "unknown",
          createdAt: 0,
        }));
    }

    /**
     * Latest static turn summary from the `turnOutline` projection. The wire view
     * exposes completed-turn prompts and final assistant responses only; the
     * in-progress draft is deliberately absent from it and is never shown here.
     * @param {Record<string, any> | undefined} values - session projection values.
     * @returns {{ kind: "prompt" | "response", text: string, turn: number | undefined } | undefined} latest task summary.
     */
    function latestTask(values) {
      const outline = values?.turnOutline;
      if (!Array.isArray(outline) || outline.length === 0) return undefined;
      const last = outline[outline.length - 1];
      const prompt = text(last?.prompt);
      const response = text(last?.response);
      if (prompt !== undefined) return { kind: "prompt", text: prompt, turn: typeof last?.turn === "number" ? last.turn : undefined };
      if (response !== undefined) return { kind: "response", text: response, turn: typeof last?.turn === "number" ? last.turn : undefined };
      return undefined;
    }

    /**
     * Catalog entries whose projections can be read: external tasks have no
     * local Session, so refreshing their id would only produce a failed read.
     * @param {Array<Record<string, any>>} entries - catalog or fallback entries.
     * @returns {string[]} local child session ids.
     */
    function refreshableChildIds(entries) {
      return entries
        .filter((entry) => entry?.mode !== "external" && typeof entry?.id === "string" && entry.id !== "")
        .map((entry) => entry.id);
    }

    /**
     * Direct local children that are running right now. Historical/idle
     * children are never subscribed: they would each cost one initial RPC for
     * a row the compact panel hides.
     * @param {Array<Record<string, any>>} entries - catalog or fallback entries.
     * @param {unknown} statuses - useSessionStatus value.
     * @param {Record<string, any>} byId - session summaries.
     * @returns {string[]} running direct-child ids.
     */
    function runningChildIds(entries, statuses, byId) {
      return refreshableChildIds(
        (entries ?? []).filter((entry) => isRunning(statuses, entry?.id, byId?.[entry?.id])),
      );
    }

    /**
     * Rows the compact panel shows: the main/current session plus running direct
     * children only. Ended children stay in the internal model but not the UI.
     * @param {Array<Record<string, any>>} rows - buildRows result.
     * @returns {Array<Record<string, any>>} visible rows.
     */
    function visibleRows(rows) {
      return (rows ?? []).filter((row) => row?.kind !== "subagent" || row?.status === "running");
    }

    /**
     * Read the host projection's bounded recent finished turns (newest first).
     * The client never infers a turn from timestamps; absence stays absence.
     * @param {Record<string, any> | undefined} values - parent projection values.
     * @returns {Array<{ turn: number | undefined, childIds: string[] }>} groups.
     */
    function previousTurnsOf(values) {
      const block = values?.[SUBAGENT_TURNS_KEY];
      const raw = Array.isArray(block?.lastTurns) ? block.lastTurns : block?.lastTurn !== undefined ? [block.lastTurn] : [];
      const groups = [];
      for (const group of raw) {
        if (group === null || typeof group !== "object" || !Array.isArray(group.childIds)) continue;
        const childIds = group.childIds.filter((id) => typeof id === "string" && id !== "");
        if (childIds.length === 0) continue;
        groups.push({ turn: typeof group.turn === "number" ? group.turn : undefined, childIds });
      }
      return groups;
    }

    /**
     * Ended local children belonging to the host-recorded last finished turn.
     * Running children and external executions never enter this group.
     * @param {Array<Record<string, any>>} rows - buildRows result.
     * @param {{ childIds: string[] } | undefined} previousTurn - host group.
     * @param {Set<string>} currentRunningIds - ids already shown as running.
     * @returns {Array<Record<string, any>>} previous rows.
     */
    function selectPreviousRows(rows, previousTurn, currentRunningIds) {
      if (previousTurn === undefined || previousTurn.childIds.length === 0) return [];
      const ids = new Set(previousTurn.childIds);
      return (rows ?? []).filter(
        (row) =>
          row?.kind === "subagent" &&
          row.external !== true &&
          ids.has(row.id) &&
          row.status !== "running" &&
          currentRunningIds?.has?.(row.id) !== true,
      );
    }

    /**
     * Choose the newest host group that actually has an ended local child.
     * When the newest group is still entirely running, fall back to the bounded
     * previous group instead of showing an empty "last turn".
     * @param {Array<Record<string, any>>} rows - buildRows result.
     * @param {Array<{ turn?: number, childIds: string[] }>} groups - newest-first groups.
     * @param {Set<string>} currentRunningIds - ids shown as running now.
     * @returns {{ turn?: number, rows: Array<Record<string, any>> } | undefined} selected group.
     */
    function selectPreviousTurn(rows, groups, currentRunningIds) {
      for (const group of groups) {
        const previousRows = selectPreviousRows(rows, group, currentRunningIds);
        if (previousRows.length > 0) return { turn: group.turn, rows: previousRows };
      }
      return undefined;
    }

    /**
     * Durable direct parent, first from the session-list row and then from the
     * parent catalog (in case the list summary has not projected it yet).
     * @param {string} sessionId - candidate child session.
     * @param {Record<string, any>} byId - session summaries.
     * @param {Record<string, any>} projections - projectionsBySession.
     * @returns {string | undefined} direct parent id.
     */
    function parentOf(sessionId, byId, projections) {
      const direct = text(byId?.[sessionId]?.parentId);
      if (direct !== undefined) return direct;
      for (const [parentId, snapshot] of Object.entries(projections ?? {})) {
        const catalog = snapshot?.values?.subagentCatalog;
        if (Array.isArray(catalog) && catalog.some((entry) => entry?.id === sessionId)) return parentId;
      }
      return undefined;
    }

    /**
     * Walk a selected session to its root, bounded and cycle-safe. The main view
     * may currently display a child; the panel must still show the real main
     * agent and that child's siblings rather than mislabel the child as main.
     * @param {string | undefined} selectedId - session retained by the main view.
     * @param {Record<string, any>} byId - session summaries.
     * @param {Record<string, any>} projections - projectionsBySession.
     * @param {number} [maxDepth] - hard bound for pathological graphs.
     * @returns {string | undefined} root session id.
     */
    function resolveRootSessionId(selectedId, byId, projections, maxDepth = 32) {
      if (selectedId === undefined || selectedId === null) return undefined;
      let current = selectedId;
      const seen = new Set();
      for (let depth = 0; depth < maxDepth; depth += 1) {
        if (seen.has(current)) return current;
        seen.add(current);
        const parent = parentOf(current, byId ?? EMPTY_BY_ID, projections ?? EMPTY_PROJECTIONS);
        if (parent === undefined || parent === current) return current;
        current = parent;
      }
      return current;
    }

    /**
     * Merge one session's projection sources without replacing a whole object
     * blindly. For a session that is officially live (retained or carrying a
     * live status entry), the official store wins per key and the local RPC only
     * fills keys the official store does not have. For a non-live child, the
     * official store is only a cached list hint, so the fresh RPC wins and the
     * official values fill missing keys. No cross-source whole-object overwrite.
     * @param {Record<string, any> | undefined} officialValues - official projection values.
     * @param {Record<string, any> | undefined} localValues - panel RPC values.
     * @param {boolean} officialLive - whether the official store is live for this id.
     * @returns {Record<string, any>} per-key merged values.
     */
    function mergeProjectionValues(officialValues, localValues, officialLive) {
      const official = officialValues ?? {};
      const local = localValues ?? {};
      return officialLive ? { ...local, ...official } : { ...official, ...local };
    }

    /**
     * Whether the official projection store receives live frames for this id.
     * Only retention proves live control frames: the status map contains an
     * entry for every session-list row, so it is deliberately NOT used here.
     * Retention covers the main view and an opened sidebar chat.
     * @param {string} sessionId - session identity.
     * @param {Record<string, any>} byId - session summaries.
     * @returns {boolean} official liveness.
     */
    function isOfficialLive(sessionId, byId) {
      const summary = byId?.[sessionId];
      const retained = summary?.retainedBy;
      if (retained === null || typeof retained !== "object") return false;
      for (const count of Object.values(retained)) {
        if (typeof count === "number" && count > 0) return true;
      }
      return false;
    }

    /**
     * Build one effective projection view from official live/cached values and
     * the panel's local RPC snapshot. `local.kind` never overwrites a newer
     * official live value because the merge above gives official keys priority.
     * @param {string} sessionId - session identity.
     * @param {Record<string, any>} projections - official projectionsBySession.
     * @param {Record<string, any>} snapshots - panel local snapshots.
     * @param {Set<string>} officialLiveIds - ids carrying official live frames.
     * @returns {{ values: Record<string, any>, state: string, local: any, official: any, error: any }} view.
     */
    function projectionView(sessionId, projections, snapshots, officialLiveIds) {
      const official = projections?.[sessionId];
      const local = snapshots?.[sessionId];
      const officialLive = officialLiveIds?.has?.(sessionId) === true;
      // migration-required has no asOfSeq: it may only fill keys that the
      // official store does not already have. It never overwrites an existing
      // official value, sequenced or cached.
      const values =
        local?.kind === "migration-required"
          ? { ...(local.values ?? {}), ...(official?.values ?? {}) }
          : mergeProjectionValues(official?.values, local?.values, officialLive);
      let state = official?.state ?? "loading";
      if (local !== undefined) {
        if (local.kind === "sequenced") state = "ready";
        else if (local.kind === "migration-required") {
          state = officialLive && official?.state === "ready" ? "ready" : "migration-required";
        } else if (local.kind === "missing") {
          state = officialLive && official?.state === "ready" ? "ready" : "missing";
        } else if (local.kind === "error") {
          state = officialLive && official?.state === "ready" ? "ready" : "error";
        }
      }
      if (officialLive && official?.state === "ready") state = "ready";
      return {
        values,
        state,
        local,
        official,
        error: local?.error ?? official?.error,
      };
    }

    /**
     * Catalog readiness must never be inferred as "no children" while the source
     * is still loading, errored, absent, or migration-deferred.
     * @param {{ values: Record<string, any>, state: string }} view - projection view.
     * @returns {"ready" | "loading" | "error" | "migration-required" | "missing"} catalog state.
     */
    function catalogStateOf(view) {
      if (Array.isArray(view?.values?.subagentCatalog)) return "ready";
      if (view?.state === "migration-required") return "migration-required";
      if (view?.state === "error") return "error";
      if (view?.state === "loading") return "loading";
      return "missing";
    }

    /**
     * Human note for projection/catalog readiness. Returns null only when the
     * catalog is genuinely ready; loading/error/migration/missing always surface.
     * @param {{ projectionErrors?: string[], projectionState?: string, catalogState?: string }} model - buildRows result.
     * @returns {string | null} note.
     */
    function projectionNoteFor(model) {
      if (Array.isArray(model?.projectionErrors) && model.projectionErrors.length > 0) {
        return errorMessage(notice("投影读取失败：{detail}", { detail: model.projectionErrors[0] }));
      }
      if (model?.projectionState === "migration-required" || model?.catalogState === "migration-required") {
        return t("子代理目录需要迁移，当前只能显示缓存提示；不会据此判定没有子代理。");
      }
      if (model?.catalogState === "error") return t("无法读取子代理目录，可点击刷新重试。");
      if (model?.catalogState === "loading") return t("正在通过 session.projections RPC 读取子代理目录…");
      if (model?.catalogState === "missing") return t("子代理目录投影尚未返回；不能据此判断没有子代理。");
      return null;
    }

    /**
     * Compact status text: only the two states the simplified panel shows.
     * @param {{ status?: string }} row - built row.
     * @returns {t("运行中") | t("已完成") | t("空闲") | t("未运行")} label.
     */
    function statusLabel(row) {
      if (row?.status === "running") return t("运行中");
      if (row?.status === "completed") return t("已完成");
      if (row?.kind === "main" || row?.kind === "current") return t("空闲");
      return t("未运行");
    }

    /**
     * Resolve an open action. Main and unresolved-current rows open their own
     * Session; a local child opens the official subagent address.
     * @param {{ kind: string, id: string, address?: Record<string, any> }} row - built row.
     * @returns {{ kind: "main", id: string } | { kind: "child", address: Record<string, any> } | undefined} target.
     */
    function openTarget(row) {
      if (row.kind === "main" || row.kind === "current") return { kind: "main", id: row.id };
      if (row.address !== undefined) return { kind: "child", address: row.address };
      return undefined;
    }

    /**
     * Whether a final running→false read has landed far enough: a sequenced
     * snapshot whose subagentTiming no longer has an open active interval. An
     * error snapshot is never settlement evidence, because the retained values
     * may still carry an open interval that only a successful read can close.
     * @param {Record<string, any> | undefined} snapshot - local snapshot.
     * @returns {boolean} settled.
     */
    function finalSettled(snapshot) {
      if (snapshot?.kind === "error") return false;
      if (snapshot?.kind !== "sequenced") return true;
      const timing = snapshot.values?.subagentTiming;
      if (timing === null || typeof timing !== "object") return false;
      return timing.active === undefined;
    }

    /**
     * Panel-owned projection feed.
     *
     * The official `refreshProjections()` short-circuits when its load state is
     * `ready` (manager.js:267-272), so it is not a freshness API. This feed calls
     * `remote.session.projections({ sessionId }, signal)` directly and keeps
     * local snapshots for direct children. It never writes the official store.
     *
     * Ordering is local to the RPC source: every result is a complete cut at
     * `asOfSeq`, so a lower-seq result is dropped; `migration-required` (no seq)
     * and `null` never replace a sequenced local snapshot. Cross-source display
     * priority is handled by {@link projectionView}/{@link mergeProjectionValues}:
     * official live keys win, local fills only what a non-live child lacks.
     */
    class ProjectionFeed {
      constructor(options = {}) {
        this.fetchProjections = options.fetchProjections;
        this.onChange = options.onChange ?? (() => {});
        this.onReset = options.onReset ?? (() => {});
        this.onBusyChange = options.onBusyChange ?? (() => {});
        this.timers = options.timers ?? DEFAULT_TIMERS;
        this.now = options.now ?? (() => Date.now());
        this.maxConcurrency = options.maxConcurrency ?? PROJECTION_CONCURRENCY;
        this.pollMs = options.pollMs ?? PROJECTION_POLL_MS;
        this.finalRetryDelays = options.finalRetryDelays ?? FINAL_RETRY_DELAYS;
        this.rootId = undefined;
        this.childIds = [];
        this.previousChildIds = [];
        this.previousSubscribed = new Set();
        this.isRunning = () => false;
        this.active = false;
        this.snapshots = {};
        this.attempted = new Set();
        this.previousRunning = new Map();
        this.generation = 0;
        this.requestGeneration = new Map();
        this.queue = [];
        this.queued = new Set();
        this.inflight = new Map();
        this.pending = new Map();
        this.rootNeedsRpc = false;
        this.running = 0;
        this.pollTimer = undefined;
        this.finalTimers = new Set();
        this.disposed = false;
      }

      /**
       * Apply the current root, child ids, running predicate and panel visibility.
       * Called whenever the panel re-renders its target set; repeated calls are
       * idempotent and only new/transitioned ids trigger work.
       * @param {{ rootId?: string, childIds?: string[], previousChildIds?: string[], isRunning?: (id: string) => boolean, rootNeedsRpc?: boolean, active?: boolean }} config - target state.
       */
      configure(config = {}) {
        if (this.disposed) return;
        const nextRoot = text(config.rootId);
        const rootChanged = nextRoot !== this.rootId;
        const previousActiveChildIds = this.childIds;
        const previousRunning = this.previousRunning;
        if (rootChanged) {
          this.generation += 1;
          this.rootId = nextRoot;
          this.snapshots = {};
          this.attempted.clear();
          this.previousRunning.clear();
          this.previousSubscribed.clear();
          this.pending.clear();
          this.abortAll();
          this.stopPolling();
          this.clearFinalTimers();
          this.onReset();
        }
        const nextChildIds = [...new Set((config.childIds ?? []).filter((id) => typeof id === "string" && id !== ""))];
        const nextPreviousChildIds = [
          ...new Set((config.previousChildIds ?? []).filter((id) => typeof id === "string" && id !== "" && !nextChildIds.includes(id))),
        ];
        this.childIds = nextChildIds;
        this.previousChildIds = nextPreviousChildIds;
        this.isRunning = typeof config.isRunning === "function" ? config.isRunning : () => false;
        this.rootNeedsRpc = config.rootNeedsRpc === true;
        const wasActive = this.active;
        this.active = config.active === true;
        if (!this.active) {
          if (wasActive) {
            this.generation += 1;
            this.abortAll();
            this.stopPolling();
            this.clearFinalTimers();
            for (const id of [this.rootId, ...this.childIds, ...this.previousChildIds]) {
              if (id !== undefined && this.snapshots[id] === undefined) this.attempted.delete(id);
            }
          }
          this.emitBusy();
          return;
        }
        const newPrevious = nextPreviousChildIds.filter((id) => !this.previousSubscribed.has(id));
        for (const id of newPrevious) this.previousSubscribed.add(id);
        for (const id of [...this.previousSubscribed]) {
          if (!nextPreviousChildIds.includes(id)) this.previousSubscribed.delete(id);
        }
        if (wasActive) {
          // A newly visible previous-turn row is read once even when its
          // snapshot survived from the running phase; it is never polled.
          for (const id of newPrevious) {
            this.attempted.add(id);
            this.enqueue(id, { reason: "previous", force: true });
          }
        }
        this.ensureInitial();
        if (!wasActive) {
          // Collapsing stops every timer and aborts in-flight reads, so a turn
          // that completed while hidden would otherwise stay frozen. On
          // expansion reread the root, current running children and visible
          // previous-turn rows; a stopped child with an open active interval
          // keeps its bounded retry.
          for (const id of [this.rootId, ...this.childIds, ...this.previousChildIds]) {
            if (id === undefined) continue;
            const snapshot = this.snapshots[id];
            if (snapshot === undefined) continue;
            this.attempted.add(id);
            const unsettledChild =
              id !== this.rootId &&
              snapshot.kind === "sequenced" &&
              snapshot.values?.subagentTiming?.active !== undefined &&
              this.isRunning(id) !== true;
            this.enqueue(id, unsettledChild ? { reason: "final", attempt: 0, force: true } : { reason: "resume", force: true });
          }
        } else if (!rootChanged) {
          // A child disappears from childIds when its status leaves running.
          // Keep exactly one bounded final read for it, then never poll or
          // refresh that hidden historical id again.
          for (const id of previousActiveChildIds) {
            if (nextChildIds.includes(id) || previousRunning.get(id) !== true) continue;
            this.attempted.add(id);
            this.enqueue(id, { reason: "final", attempt: 0, force: true });
          }
        }
        this.updateRunning(!rootChanged && wasActive);
        this.startPolling();
        this.emitBusy();
      }

      /** Read the current root plus every currently running/previous child once. */
      ensureInitial() {
        if (!this.active || this.rootId === undefined) return;
        for (const id of [this.rootId, ...this.childIds, ...this.previousChildIds]) {
          if (this.snapshots[id] !== undefined || this.attempted.has(id)) continue;
          this.attempted.add(id);
          this.enqueue(id, { reason: "initial", force: false });
        }
      }

      /** Manual refresh: current root + running and visible previous children. */
      refreshAll() {
        if (this.disposed || !this.active || this.rootId === undefined) return;
        for (const id of [this.rootId, ...this.childIds, ...this.previousChildIds]) {
          this.attempted.add(id);
          this.enqueue(id, { reason: "manual", force: true });
        }
      }

      /**
       * Manual refresh of one known local session. Unknown/external ids are
       * rejected: the RPC is never exposed as an arbitrary-id input.
       * @param {string} sessionId - known root or direct-child id.
       */
      refreshSession(sessionId) {
        if (this.disposed || !this.active) return;
        if (sessionId !== this.rootId && !this.childIds.includes(sessionId)) return;
        this.attempted.add(sessionId);
        this.enqueue(sessionId, { reason: "manual", force: true });
      }

      /**
       * Ids whose running state needs RPC polling. The root joins only when it
       * is not retained (for example while a child view keeps it off-screen);
       * a retained root already receives official live updates.
       * @returns {string[]} root (conditionally) plus local children.
       */
      pollIds() {
        const ids = [];
        if (this.rootId !== undefined && this.rootNeedsRpc) ids.push(this.rootId);
        ids.push(...this.childIds);
        return ids;
      }

      /** Poll only currently-running local children (and an unretained root). */
      pollRunning() {
        if (!this.active || this.disposed) return;
        for (const id of this.pollIds()) {
          if (this.isRunning(id) !== true) continue;
          this.attempted.add(id);
          this.enqueue(id, { reason: "poll", force: false });
        }
      }

      /** Track running→false transitions and schedule a bounded final read. */
      updateRunning(allowFinal) {
        const next = new Map();
        for (const id of this.pollIds()) {
          const running = this.isRunning(id) === true;
          next.set(id, running);
          if (allowFinal && this.previousRunning.get(id) === true && running === false) {
            this.attempted.add(id);
            this.enqueue(id, id === this.rootId ? { reason: "resume", force: true } : { reason: "final", attempt: 0, force: true });
          }
        }
        this.previousRunning = next;
      }

      startPolling() {
        if (this.pollTimer !== undefined) return;
        this.pollTimer = this.timers.setInterval(() => this.pollRunning(), this.pollMs);
        this.pollRunning();
      }

      stopPolling() {
        if (this.pollTimer === undefined) return;
        this.timers.clearInterval(this.pollTimer);
        this.pollTimer = undefined;
      }

      clearFinalTimers() {
        for (const timer of this.finalTimers) this.timers.clearTimeout(timer);
        this.finalTimers.clear();
      }

      abortAll() {
        for (const task of this.queue) this.attempted.delete(task.id);
        this.queue = [];
        this.queued.clear();
        this.pending.clear();
        for (const { controller } of this.inflight.values()) controller.abort();
        this.emitBusy();
      }

      /**
       * Queue one read, enforcing no overlap per id and at most
       * `maxConcurrency` concurrent reads. `force` remembers a follow-up read
       * when the id is already queued/in-flight (manual refresh, final retry).
       * @param {string} id - session id.
       * @param {{ reason: string, attempt?: number, force?: boolean }} task - task facts.
       */
      enqueue(id, task) {
        if (this.disposed || !this.active) return;
        if (this.inflight.has(id) || this.queued.has(id)) {
          if (task.force === true) this.defer(id, task);
          return;
        }
        this.queued.add(id);
        this.queue.push({ id, reason: task.reason, attempt: task.attempt ?? 0 });
        this.emitBusy();
        this.pump();
      }

      /**
       * Keep at most one follow-up per id while a read is queued/in-flight.
       * A final task outranks a manual/expansion read, and the larger final
       * attempt survives an older pending retry, so running→false retry
       * semantics are not downgraded to an ordinary manual refresh.
       * @param {string} id - session id.
       * @param {{ reason: string, attempt?: number, force?: boolean }} task - deferred task.
       */
      defer(id, task) {
        const existing = this.pending.get(id);
        if (existing === undefined) {
          this.pending.set(id, { ...task, force: true });
          return;
        }
        if (existing.reason === "final" && task.reason !== "final") return;
        if (task.reason === "final") {
          const attempt = Math.max(existing.reason === "final" ? existing.attempt ?? 0 : 0, task.attempt ?? 0);
          this.pending.set(id, { reason: "final", attempt, force: true });
          return;
        }
        if (task.reason === "manual") this.pending.set(id, { reason: "manual", force: true });
      }

      pump() {
        while (this.active && !this.disposed && this.running < this.maxConcurrency && this.queue.length > 0) {
          const task = this.queue.shift();
          this.queued.delete(task.id);
          this.run(task);
        }
        this.emitBusy();
      }

      run(task) {
        const id = task.id;
        const generation = this.generation;
        const request = (this.requestGeneration.get(id) ?? 0) + 1;
        this.requestGeneration.set(id, request);
        const controller = new AbortController();
        this.inflight.set(id, { controller, request });
        this.running += 1;
        this.emitBusy();
        Promise.resolve()
          .then(() => (typeof this.fetchProjections === "function" ? this.fetchProjections(id, controller.signal) : undefined))
          .then((result) => this.accept(id, result, task, generation, request, controller.signal))
          .catch((error) => this.fail(id, error, task, generation, request, controller.signal))
          .finally(() => {
            this.running = Math.max(0, this.running - 1);
            if (this.inflight.get(id)?.request === request) this.inflight.delete(id);
            const deferred = this.pending.get(id);
            this.pending.delete(id);
            if (deferred !== undefined) this.enqueue(id, deferred);
            this.emitBusy();
            this.pump();
          });
      }

      isCurrent(id, generation, request) {
        return this.active && !this.disposed && generation === this.generation && this.requestGeneration.get(id) === request;
      }

      accept(id, result, task, generation, request, signal) {
        if (!this.isCurrent(id, generation, request) || signal.aborted) return;
        this.attempted.add(id);
        if (result === null || typeof result !== "object" || result.ok !== true) {
          this.fail(id, result?.error ?? { code: "dsh-agent-activity/projections-failed" }, task, generation, request, signal);
          return;
        }
        const value = result.value;
        let snapshot;
        if (value === null) {
          snapshot = { kind: "missing", values: undefined, fetchedAt: this.now(), error: undefined };
        } else if (value?.kind === "sequenced" && typeof value.asOfSeq === "number" && Number.isFinite(value.asOfSeq)) {
          snapshot = { kind: "sequenced", asOfSeq: value.asOfSeq, values: value.values ?? {}, fetchedAt: this.now(), error: undefined };
        } else if (value?.kind === "migration-required") {
          snapshot = { kind: "migration-required", values: value.values ?? {}, fetchedAt: this.now(), error: undefined };
        } else {
          this.fail(id, { code: "dsh-agent-activity/projections-result" }, task, generation, request, signal);
          return;
        }
        const previous = this.snapshots[id];
        const stale =
          (snapshot.kind === "sequenced" && previous?.kind === "sequenced" && snapshot.asOfSeq < previous.asOfSeq) ||
          (snapshot.kind !== "sequenced" && previous?.kind === "sequenced");
        if (stale) {
          // Low-seq/null/migration never replace a sequenced record. A final
          // read still owns its bounded retry while the retained values have not
          // settled yet; success-only settling must not stop that loop early.
          if (task.reason === "final" && !finalSettled(previous)) this.retryFinal(id, task.attempt ?? 0, generation);
          return;
        }
        this.snapshots[id] = snapshot;
        this.onChange(id, snapshot);
        if (task.reason === "final" && !finalSettled(snapshot)) this.retryFinal(id, task.attempt ?? 0, generation);
      }

      fail(id, error, task, generation, request, signal) {
        if (!this.isCurrent(id, generation, request) || signal.aborted) return;
        if (error?.code === "gateway/cancelled") return;
        const previous = this.snapshots[id];
        const snapshot =
          previous?.kind === "sequenced"
            ? { ...previous, fetchedAt: this.now(), error: { message: errorMessage(error), code: text(error?.code) } }
            : {
                kind: "error",
                values: previous?.values,
                asOfSeq: previous?.asOfSeq,
                fetchedAt: this.now(),
                error: { message: errorMessage(error), code: text(error?.code) },
              };
        this.snapshots[id] = snapshot;
        this.onChange(id, snapshot);
        if (task.reason === "final") this.retryFinal(id, task.attempt ?? 0, generation);
      }

      retryFinal(id, attempt, generation) {
        if (attempt >= this.finalRetryDelays.length) return;
        const delay = this.finalRetryDelays[attempt];
        const timer = this.timers.setTimeout(() => {
          this.finalTimers.delete(timer);
          if (!this.active || this.disposed || generation !== this.generation) return;
          this.attempted.add(id);
          this.enqueue(id, { reason: "final", attempt: attempt + 1, force: true });
        }, delay);
        this.finalTimers.add(timer);
      }

      emitBusy() {
        if (this.disposed) return;
        try {
          this.onBusyChange(this.running + this.queue.length);
        } catch {
          // Diagnostics only.
        }
      }

      /** Stop timers and in-flight work but keep the instance reusable. */
      stop() {
        if (this.disposed) return;
        this.active = false;
        this.generation += 1;
        this.abortAll();
        this.stopPolling();
        this.clearFinalTimers();
        for (const id of [this.rootId, ...this.childIds, ...this.previousChildIds]) {
          if (id !== undefined && this.snapshots[id] === undefined) this.attempted.delete(id);
        }
      }

      dispose() {
        if (this.disposed) return;
        this.disposed = true;
        this.active = false;
        this.generation += 1;
        this.abortAll();
        this.stopPolling();
        this.clearFinalTimers();
        this.queue = [];
        this.queued.clear();
      }
    }

    /**
     * React binding for one ProjectionFeed. The component owns `configure`,
     * because the child set can include ids discovered from a local root RPC
     * snapshot on the previous render.
     * @param {{ actions: Record<string, Function> }} input - injected actions.
     * @returns {{ snapshots: Record<string, any>, feed: ProjectionFeed, busy: number }} state.
     */
    function useProjectionFeed(input) {
      const [snapshots, setSnapshots] = React.useState({});
      const [busy, setBusy] = React.useState(0);
      const feedRef = React.useRef(null);
      if (feedRef.current === null) {
        feedRef.current = new ProjectionFeed({
          fetchProjections: (sessionId, signal) => input.actions.fetchProjections(sessionId, signal),
          onChange: (sessionId, snapshot) => setSnapshots((current) => ({ ...current, [sessionId]: snapshot })),
          onReset: () => setSnapshots({}),
          onBusyChange: (count) => setBusy(count),
        });
      }
      const feed = feedRef.current;
      // `stop` is reusable, so React StrictMode's setup/cleanup/setup cycle does
      // not leave a permanently disposed feed.
      React.useEffect(() => () => feed.stop(), [feed]);
      return { snapshots, feed, busy };
    }

    /**
     * Build every row from live stores. This function never throws for missing
     * fields: absent values become undefined and render as unknown/em dash.
     * @param {{
     *   mainId?: string | null,
     *   byId?: Record<string, any>,
     *   projections?: Record<string, any>,
     *   snapshots?: Record<string, any>,
     *   officialLiveIds?: Set<string>,
     *   statuses?: unknown,
     *   now?: number,
     *   mainIsRoot?: boolean,
     * }} input - live store slices and panel-owned RPC snapshots.
     * @returns {{ rows: Array<Record<string, any>>, mainId: string | null, projectionState: string, catalogState: string, projectionError?: string, projectionErrors: string[] }} render model.
     */
    function buildRows(input) {
      const mainId = input.mainId ?? null;
      const byId = input.byId ?? EMPTY_BY_ID;
      const projections = input.projections ?? EMPTY_PROJECTIONS;
      const snapshots = input.snapshots ?? {};
      const officialLiveIds = input.officialLiveIds;
      const statuses = input.statuses;
      const now = typeof input.now === "number" && Number.isFinite(input.now) ? input.now : Date.now();
      const rows = [];
      if (mainId === null) {
        return { rows, mainId: null, projectionState: "missing", catalogState: "missing", projectionErrors: [] };
      }

      const mainSummary = byId[mainId];
      const mainView = projectionView(mainId, projections, snapshots, officialLiveIds);
      const mainValues = mainView.values;
      const mainRunning = isRunning(statuses, mainId, mainSummary);
      const mainModel = resolveModel(mainValues);
      const mainStatus = statusOf({ running: mainRunning, timing: undefined, external: false });
      const views = [mainView];
      rows.push({
        id: mainId,
        // While a selected child's parent cannot be resolved yet, label it
        // "当前会话" instead of falsely calling it the main agent.
        kind: input.mainIsRoot === false ? "current" : "main",
        parentId: undefined,
        label: text(mainSummary?.displayTitle) ?? text(mainSummary?.title) ?? mainId,
        title: text(mainSummary?.title),
        provider: mainModel.provider,
        model: mainModel.model,
        reasoning: mainModel.reasoning,
        modelRecorded: mainModel.recorded,
        mode: "main",
        external: false,
        status: mainStatus,
        running: mainRunning,
        tokens: tokenTotal(mainValues.tokenUsage),
        // 0.2.1-rc.2 registers no main-agent turn timing projection. Do not
        // borrow subagentTiming/turnTiming and do not invent elapsed time.
        durationMs: undefined,
        recentTask: latestTask(mainValues),
        snapshotAt: mainView.local?.fetchedAt,
        snapshotSeq: mainView.local?.asOfSeq,
        snapshotKind: mainView.local?.kind,
        officialLive: officialLiveIds?.has?.(mainId) === true,
        canOpen: true,
        canContinue: false,
        canStop: false,
        address: undefined,
      });

      for (const entry of collectChildEntries(mainId, projections, byId, snapshots, officialLiveIds)) {
        const id = text(entry?.id);
        if (id === undefined) continue;
        const summary = byId[id];
        const view = projectionView(id, projections, snapshots, officialLiveIds);
        const values = view.values;
        const identity = values.subagent;
        const catalogMode = text(entry?.mode);
        const projectedMode = text(identity?.mode);
        const mode = catalogMode ?? projectedMode ?? "unknown";
        const external = mode === "external";
        const address = external ? undefined : { parentSessionId: mainId, childSessionId: id, mode };
        const childTiming = values.subagentTiming;
        const running = external ? false : isRunning(statuses, id, summary);
        const status = statusOf({ running, timing: childTiming, external });
        const model = resolveModel(values);
        views.push(view);
        rows.push({
          id,
          kind: "subagent",
          parentId: mainId,
          label: text(entry?.label) ?? text(identity?.label) ?? text(summary?.title) ?? text(summary?.displayTitle) ?? id,
          title: text(summary?.title) ?? text(values.title),
          provider: model.provider,
          model: model.model,
          reasoning: model.reasoning,
          modelRecorded: model.recorded,
          mode,
          external,
          status,
          running,
          tokens: tokenTotal(values.tokenUsage),
          durationMs: external ? undefined : activityDuration(childTiming, running, now),
          recentTask: external ? undefined : latestTask(values),
          snapshotAt: view.local?.fetchedAt,
          snapshotSeq: view.local?.asOfSeq,
          snapshotKind: view.local?.kind,
          officialLive: officialLiveIds?.has?.(id) === true,
          canOpen: !external && address !== undefined,
          canContinue: !external && mode === "continuable" && address !== undefined,
          canStop: !external && mode === "continuable" && running,
          address,
        });
      }

      const projectionErrors = views
        .map((view) => (view.error === undefined || view.error === null ? undefined : errorMessage(view.error)))
        .filter((message) => message !== undefined);
      return {
        rows,
        mainId,
        projectionState: mainView.state,
        catalogState: catalogStateOf(mainView),
        projectionError: projectionErrors[0],
        projectionErrors,
      };
    }

    /**
     * Human label for a subagent mode.
     * @param {string} mode - catalog mode.
     * @returns {string} display label.
     */
    function modeLabel(mode) {
      if (mode === "main") return t("主代理");
      if (mode === "continuable") return t("可继续");
      if (mode === "one-shot") return t("一次性");
      if (mode === "external") return t("外部任务");
      return t("模式未知");
    }

    /**
     * Status color token with a readable fallback outside the DSH theme.
     * @param {string} status - status key.
     * @returns {string} CSS color.
     */
    function statusColor(status) {
      if (status === "running") return "var(--dsw-alias-state-business-primary, #2563eb)";
      if (status === "completed") return "var(--dsw-alias-state-success-primary, #16a34a)";
      return "var(--dsw-alias-label-tertiary, #9ca3af)";
    }

    const colors = {
      bg: "var(--dsw-alias-bg-layer-1, #ffffff)",
      text: "var(--dsw-alias-label-primary, #1f2328)",
      secondary: "var(--dsw-alias-label-secondary, #57606a)",
      tertiary: "var(--dsw-alias-label-tertiary, #6b7280)",
      border: "var(--dsw-alias-border-l3, rgba(127, 127, 127, 0.28))",
      soft: "var(--dsw-alias-bg-layer-2, rgba(127, 127, 127, 0.07))",
      danger: "#b91c1c",
      dangerSoft: "rgba(220, 38, 38, 0.10)",
      dangerBorder: "rgba(220, 38, 38, 0.38)",
    };

    const fontFamily = "var(--ds-font-family-ui, ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", sans-serif)";
    const monoFamily = "var(--ds-font-family-code, ui-monospace, SFMono-Regular, Consolas, \"Liberation Mono\", monospace)";

    const panelPositionStyle = {
      position: "fixed",
      top: "calc(var(--dsh-frame-overlay-top, 72px) + 40px)",
      right: "16px",
      zIndex: 40,
      width: "min(300px, calc(100vw - 24px))",
      maxHeight: "min(30vh, 300px)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      pointerEvents: "auto",
      WebkitAppRegion: "no-drag",
      background: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      borderRadius: "12px",
      boxShadow: "0 18px 48px rgba(15, 23, 42, 0.20), 0 2px 6px rgba(15, 23, 42, 0.10)",
      fontFamily,
      fontSize: "12px",
      lineHeight: 1.45,
    };

    const panelStyle = { ...panelPositionStyle };

    const headerStyle = {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "9px 10px 9px 12px",
      flex: "none",
    };

    const headerTextStyle = {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      flex: 1,
    };

    const titleStyle = {
      fontSize: "13px",
      lineHeight: "18px",
      fontWeight: 650,
      letterSpacing: "0.01em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    };

    const summaryStyle = {
      fontSize: "11px",
      lineHeight: "16px",
      color: colors.tertiary,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    };

    const iconButtonStyle = {
      flex: "none",
      minWidth: "24px",
      height: "24px",
      padding: "0 5px",
      border: 0,
      borderRadius: "6px",
      background: "transparent",
      color: colors.tertiary,
      fontFamily,
      fontSize: "14px",
      lineHeight: "24px",
      textAlign: "center",
      cursor: "pointer",
    };

    // One small pill in the header. It never grows into a settings panel.
    const strategySwitchStyle = {
      flex: "none",
      display: "inline-flex",
      alignItems: "center",
      height: "22px",
      padding: "0 7px",
      border: `1px solid ${colors.border}`,
      borderRadius: "999px",
      background: colors.soft,
      color: colors.tertiary,
      fontFamily,
      fontSize: "10px",
      lineHeight: "16px",
      whiteSpace: "nowrap",
      cursor: "pointer",
    };

    const strategySwitchOnStyle = {
      color: "var(--dsw-alias-state-business-primary, #2563eb)",
      borderColor: "var(--dsw-alias-state-business-primary, #2563eb)",
      fontWeight: 650,
    };

    const bodyStyle = {
      display: "flex",
      flexDirection: "column",
      flex: "1 1 auto",
      minHeight: 0,
      overflowY: "auto",
      overscrollBehavior: "contain",
      borderTop: `1px solid ${colors.border}`,
      padding: "2px 0",
    };

    const sectionLabelStyle = {
      padding: "6px 12px 2px",
      color: colors.tertiary,
      fontSize: "10px",
      lineHeight: "14px",
      fontWeight: 650,
      letterSpacing: "0.02em",
    };

    const dividerStyle = {
      borderTop: `1px solid ${colors.border}`,
      marginTop: "5px",
    };

    const rowStyle = {
      display: "flex",
      flexDirection: "column",
      gap: "1px",
      padding: "6px 12px 7px",
    };

    const rowTopStyle = {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      minWidth: 0,
    };

    const dotStyle = {
      width: "7px",
      height: "7px",
      borderRadius: "50%",
      flex: "none",
    };

    const rowLabelStyle = {
      minWidth: 0,
      flex: 1,
      fontSize: "12.5px",
      lineHeight: "18px",
      fontWeight: 600,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    };

    const badgeStyle = {
      flex: "none",
      padding: "0 5px",
      border: `1px solid ${colors.border}`,
      borderRadius: "999px",
      color: colors.secondary,
      fontSize: "10px",
      lineHeight: "15px",
      whiteSpace: "nowrap",
    };

    const statusStyle = {
      flex: "none",
      fontSize: "10px",
      lineHeight: "15px",
      fontWeight: 650,
      letterSpacing: "0.01em",
    };

    const secondaryLineStyle = {
      fontSize: "11px",
      lineHeight: "16px",
      color: colors.secondary,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    };

    const idStyle = {
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontFamily: monoFamily,
      fontSize: "10.5px",
      lineHeight: "15px",
      color: colors.tertiary,
    };

    const modelLineStyle = {
      display: "flex",
      alignItems: "baseline",
      gap: "4px",
      marginTop: "2px",
      fontSize: "11px",
      lineHeight: "16px",
      color: colors.secondary,
      whiteSpace: "nowrap",
      overflow: "hidden",
    };

    const modelStrongStyle = {
      minWidth: 0,
      color: colors.text,
      fontWeight: 550,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    };

    const metricsLineStyle = {
      marginTop: "1px",
      fontSize: "11px",
      lineHeight: "16px",
      color: colors.secondary,
      overflowWrap: "anywhere",
    };

    const taskLineStyle = {
      display: "flex",
      alignItems: "baseline",
      gap: "4px",
      minWidth: 0,
      marginTop: "2px",
      fontSize: "11px",
      lineHeight: "16px",
      color: colors.secondary,
    };

    const taskTextStyle = {
      minWidth: 0,
      flex: 1,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      color: colors.text,
    };

    const taskSourceStyle = {
      flex: "none",
      padding: "0 3px",
      border: `1px solid ${colors.border}`,
      borderRadius: "4px",
      color: colors.tertiary,
      fontSize: "9.5px",
      lineHeight: "13px",
    };

    const actionsStyle = {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "6px",
      marginTop: "5px",
    };

    const buttonStyle = {
      minHeight: "23px",
      padding: "2px 8px",
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      background: colors.soft,
      color: colors.text,
      fontFamily,
      fontSize: "11px",
      lineHeight: "17px",
      cursor: "pointer",
    };

    const stopButtonStyle = {
      ...buttonStyle,
      color: colors.danger,
      background: colors.dangerSoft,
      borderColor: colors.dangerBorder,
      fontWeight: 600,
    };

    const disabledStyle = {
      opacity: 0.55,
      cursor: "default",
    };

    const hintStyle = {
      fontSize: "10.5px",
      color: colors.tertiary,
    };

    const errorStyle = {
      marginTop: "4px",
      fontSize: "10.5px",
      lineHeight: "15px",
      color: colors.danger,
      wordBreak: "break-word",
    };

    const strategyErrorStyle = {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "0 12px 4px",
      color: colors.danger,
      fontSize: "10px",
      lineHeight: "14px",
    };

    const strategyRetryStyle = {
      flex: "none",
      minHeight: "17px",
      padding: "0 6px",
      border: `1px solid ${colors.dangerBorder}`,
      borderRadius: "5px",
      background: colors.dangerSoft,
      color: colors.danger,
      fontFamily,
      fontSize: "10px",
      lineHeight: "15px",
      cursor: "pointer",
    };

    const noteStyle = {
      padding: "6px 12px 8px",
      color: colors.tertiary,
      fontSize: "10.5px",
      lineHeight: "15px",
    };

    const emptyStyle = {
      padding: "9px 12px 10px",
      color: colors.secondary,
      fontSize: "11px",
      lineHeight: "16px",
    };

    const pillStyle = {
      ...panelPositionStyle,
      width: "auto",
      maxHeight: "none",
      borderRadius: "999px",
      padding: "5px 11px",
      flexDirection: "row",
      alignItems: "center",
      gap: "6px",
      color: colors.secondary,
      fontSize: "11px",
      lineHeight: "16px",
      cursor: "pointer",
      boxShadow: "0 8px 22px rgba(15, 23, 42, 0.16), 0 1px 3px rgba(15, 23, 42, 0.10)",
    };

    const boundaryStyle = {
      ...panelPositionStyle,
      padding: "12px",
      gap: "8px",
    };

    /**
     * Render one action button with consistent sizing.
     * @param {string} label - visible text.
     * @param {() => void} onClick - click handler.
     * @param {{ danger?: boolean, disabled?: boolean, title?: string }} [options] - presentation.
     * @returns {import("react").ReactElement} button.
     */
    function actionButton(label, onClick, options = {}) {
      return h(
        "button",
        {
          type: "button",
          style: {
            ...(options.danger === true ? stopButtonStyle : buttonStyle),
            ...(options.disabled === true ? disabledStyle : {}),
          },
          onClick,
          disabled: options.disabled === true,
          title: options.title,
          "aria-label": options.title ?? label,
        },
        label,
      );
    }

    /**
     * Error boundary: a malformed projection must degrade to a small recoverable
     * notice, never take the whole application tree down with it.
     */
    class ActivityErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { error: null };
        this.retry = () => this.setState({ error: null });
      }

      static getDerivedStateFromError(error) {
        return { error };
      }

      componentDidCatch(error, info) {
        try {
          console.error("[subagent-activity] render failed", error, info);
        } catch {
          // A console failure must not re-enter the boundary.
        }
      }

      render() {
        if (this.state.error !== null) {
          return h(
            "div",
            { style: boundaryStyle, role: "alert", "data-subagent-activity-error": "true" },
            h("div", { style: titleStyle }, t("代理活动面板异常")),
            h("div", { style: summaryStyle }, errorMessage(this.state.error)),
            h("div", { style: actionsStyle }, actionButton(t("重试"), this.retry)),
          );
        }
        return this.props.children;
      }
    }

    /**
     * Own the DS-execution switch state. The Host settings document is the only
     * fact source: reads are merged while in flight, forwarded revisions are
     * deduplicated, and a describe answer older than an accepted write receipt
     * can never roll the switch back. There is deliberately no polling loop.
     * @param {Record<string, any>} actions - panel actions provided by `apply`.
     * @returns {{ view: Record<string, any>, toggle: () => void, retry: () => void }} switch model.
     */
    const SETTINGS_NAMESPACES = [PANEL_ID, STRATEGY_NS];
    const SETTINGS_LOCALES = ["auto", "en", "zh-CN"];
    const copySettings = value => JSON.parse(JSON.stringify(value));
    const sameSettings = (left, right) => JSON.stringify(left) === JSON.stringify(right);
    const settingsNotice = (key, params) => notice(`settings.${key}`, params);

    /** Validate only the public routing schema, never guess provider capabilities. */
    function validateSettingsDraft(ns, draft) {
      if (!draft || !SETTINGS_LOCALES.includes(draft.locale)) return settingsNotice("invalidLocale");
      if (ns === PANEL_ID) return null;
      if (ns !== STRATEGY_NS || typeof draft.enabled !== "boolean" || !Array.isArray(draft.parentRoutes)) return settingsNotice("invalidState");
      const validRoute = route => route && typeof route === "object" && typeof route.provider === "string" && /^\S+$/.test(route.provider) && typeof route.model === "string" && /^\S+$/.test(route.model) && (route.reasoningEffort === undefined || typeof route.reasoningEffort === "string" && /^\S+$/.test(route.reasoningEffort));
      if (!draft.parentRoutes.every(validRoute) || draft.targetRoute !== null && !validRoute(draft.targetRoute)) return settingsNotice("invalidRoute");
      if (draft.enabled && !routingConfigured(draft)) return settingsNotice("needsRoutes");
      return null;
    }

    /** NamespaceView.value is the redacted resolved value; base/user are provenance. */
    function settingsNamespaceView(view, ns) {
      if (!view || view.ns !== ns || !Number.isSafeInteger(view.revision) || view.revision < 0 || !view.value || typeof view.value !== "object") return { error: settingsNotice("invalidState") };
      const value = view.value;
      // Host defaults are schema-owned. Missing/invalid fields are not invented.
      if (!SETTINGS_LOCALES.includes(value.locale)) return { error: settingsNotice("invalidState") };
      if (ns === STRATEGY_NS && (typeof value.enabled !== "boolean" || !Array.isArray(value.parentRoutes) || !(value.targetRoute === null || value.targetRoute && typeof value.targetRoute === "object"))) return { error: settingsNotice("invalidState") };
      const draft = ns === PANEL_ID ? { locale: value.locale } : { enabled: value.enabled, parentRoutes: copySettings(value.parentRoutes), targetRoute: copySettings(value.targetRoute), locale: value.locale };
      if (validateSettingsDraft(ns, draft)) return { error: settingsNotice("invalidState") };
      return { revision: view.revision, value: draft, base: view.base, user: view.user, error: null };
    }
    function settingsNamespaceFromDescribe(result, ns) {
      if (result?.ok !== true) return { error: result?.error ?? settingsNotice("unavailable"), writable: false };
      const descriptor = Array.isArray(result.value?.namespaces) ? result.value.namespaces.find(item => item?.ns === ns) : undefined;
      if (!descriptor) return { error: settingsNotice("missing", { ns }), writable: false };
      return { ...settingsNamespaceView(descriptor, ns), writable: result.value?.writable === true };
    }
    function settingsWriteError(result) {
      const error = result?.error;
      const detail = text(error?.message);
      if (detail && /overridden by a home patch or command-line overlay/i.test(detail)) return { error: settingsNotice("overridden"), detail, overridden: true };
      if (error?.code === "settings/conflict") return { error: settingsNotice("conflict"), detail, conflict: true };
      return { error: settingsNotice("rejected"), detail };
    }
    function blankSettingsCard() {
      return { status: "loading", revision: -1, baseRevision: -1, writable: false, value: null, draft: null, dirty: false, conflict: false, saving: false, overridden: false, error: null, detail: null, saved: false };
    }

    /**
     * A page-local editor, independent of the overlay. Only save() writes. A dirty
     * draft owns its base revision until the user explicitly discards or reviews
     * it; newer Host snapshots never silently rebase an old intent. Generations
     * fence reads, write receipts and catalog requests across resets/unmounts.
     */
    class SettingsPageController {
      constructor(actions) {
        this.actions = actions;
        this.cards = Object.fromEntries(SETTINGS_NAMESPACES.map(ns => [ns, blankSettingsCard()]));
        this.catalog = { status: "loading", groups: [], failures: [] };
        this.catalogRequest = 0;
        this.listeners = new Set();
        this.generation = 0;
        this.reading = null;
        this.queued = false;
        this.disposers = [];
        this.active = false;
      }
      subscribe(listener) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
      emit() { for (const listener of this.listeners) listener(); }
      setCard(ns, change) { this.cards = { ...this.cards, [ns]: { ...this.cards[ns], ...change } }; this.emit(); }
      start() {
        if (this.active) return;
        this.active = true;
        try { const off = this.actions.onStrategyChanged((ns, revision) => {
          if (!SETTINGS_NAMESPACES.includes(ns) || !newerStrategyRevision(this.cards[ns].revision, revision)) return;
          this.queued = true;
          this.load();
        }); if (typeof off === "function") this.disposers.push(off); } catch {}
        try { const off = this.actions.onStrategyReset(() => this.reset()); if (typeof off === "function") this.disposers.push(off); } catch {}
        this.load();
        this.loadCatalog();
      }
      stop() {
        this.active = false;
        this.generation += 1;
        this.reading = null;
        for (const off of this.disposers.splice(0)) { try { off(); } catch {} }
      }
      reset() {
        this.generation += 1;
        this.reading = null;
        this.queued = false;
        for (const ns of SETTINGS_NAMESPACES) {
          const card = this.cards[ns];
          this.setCard(ns, { status: "loading", revision: -1, baseRevision: -1, saving: false, writable: false, conflict: card.dirty, error: card.dirty ? settingsNotice("disconnected") : null, saved: false });
        }
        this.catalog = { status: "loading", groups: [], failures: [] };
        this.emit();
        this.load();
        this.loadCatalog();
      }
      accept(ns, next, ownReceipt = false) {
        const card = this.cards[ns];
        if (!acceptStrategyRevision(card.revision, next.revision)) return false;
        const conflict = !ownReceipt && card.dirty && (card.conflict || next.revision !== card.baseRevision);
        this.setCard(ns, {
          status: "ready", revision: next.revision, value: next.value, base: next.base, user: next.user,
          ...(next.writable === undefined ? {} : { writable: next.writable }),
          ...(card.dirty && !ownReceipt ? {} : { draft: copySettings(next.value), baseRevision: next.revision, dirty: false }),
          conflict, error: conflict ? settingsNotice("conflict") : card.overridden ? settingsNotice("overridden") : null,
          detail: card.overridden ? card.detail : null, saved: ownReceipt,
        });
        return true;
      }
      load() {
        if (!this.active) return Promise.resolve();
        if (this.reading) return this.reading;
        const gen = this.generation;
        this.queued = false;
        const operation = Promise.resolve().then(() => this.actions.readStrategy()).then(result => {
          if (!this.active || gen !== this.generation) return;
          for (const ns of SETTINGS_NAMESPACES) {
            const next = settingsNamespaceFromDescribe(result, ns);
            if (next.error) this.setCard(ns, { status: "error", writable: false, error: next.error, saved: false });
            else this.accept(ns, next);
          }
        }).catch(error => {
          if (!this.active || gen !== this.generation) return;
          for (const ns of SETTINGS_NAMESPACES) this.setCard(ns, { status: "error", writable: false, error: settingsNotice("failed"), detail: errorMessage(error), saved: false });
        }).finally(() => {
          if (gen !== this.generation) return;
          this.reading = null;
          if (this.queued && this.active) this.load();
        });
        this.reading = operation;
        return operation;
      }
      readAgain() {
        // This is a fresh read, never a retry of an old write. A home/CLI overlay
        // has no preflight flag in NamespaceView; only a new explicit save can
        // validate permission again after the external overlay was corrected.
        for (const ns of SETTINGS_NAMESPACES) this.setCard(ns, { status: "loading", writable: false, overridden: false, detail: null, saved: false });
        this.loadCatalog();
        if (this.reading) { this.queued = true; return this.reading; }
        return this.load();
      }
      edit(ns, draft) {
        const card = this.cards[ns];
        if (!card || card.status !== "ready" || !card.writable || card.saving || card.overridden) return;
        this.setCard(ns, { draft: copySettings(draft), dirty: !sameSettings(draft, card.value), saved: false, ...(card.conflict ? {} : { error: null, detail: null }) });
      }
      discard(ns) {
        const card = this.cards[ns];
        if (!card.value || card.saving) return;
        this.setCard(ns, { draft: copySettings(card.value), baseRevision: card.revision, dirty: false, conflict: false, error: card.overridden ? settingsNotice("overridden") : null, saved: false });
      }
      review(ns) {
        const card = this.cards[ns];
        if (card.status !== "ready" || card.saving || !card.value || !card.writable || card.overridden) return;
        this.setCard(ns, { baseRevision: card.revision, conflict: false, error: null, detail: null, dirty: !sameSettings(card.draft, card.value), saved: false });
      }
      async save(ns) {
        const card = this.cards[ns];
        if (!this.active || !card || card.status !== "ready" || !card.writable || card.saving || !card.dirty || card.conflict || card.overridden || card.baseRevision < 0 || card.baseRevision !== card.revision) return;
        const invalid = validateSettingsDraft(ns, card.draft);
        if (invalid) { this.setCard(ns, { error: invalid, saved: false }); return; }
        const gen = this.generation;
        const draft = copySettings(card.draft);
        const revision = card.baseRevision;
        this.setCard(ns, { saving: true, error: null, detail: null, saved: false });
        try {
          const result = await this.actions.writeSettings(ns, draft, revision);
          if (!this.active || gen !== this.generation) return;
          if (result?.ok !== true) {
            const failure = settingsWriteError(result);
            this.setCard(ns, { ...failure, saving: false, conflict: failure.conflict === true || this.cards[ns].conflict, overridden: failure.overridden === true });
            if (failure.conflict) await this.load();
            return;
          }
          const next = settingsNamespaceView(result.value, ns);
          if (next.error) { this.setCard(ns, { saving: false, status: "error", writable: false, error: next.error }); return; }
          if (!this.accept(ns, next, true)) this.setCard(ns, { saving: false, conflict: true, error: settingsNotice("conflict") });
          else this.setCard(ns, { saving: false });
        } catch (error) {
          if (!this.active || gen !== this.generation) return;
          const failure = settingsWriteError({ error });
          this.setCard(ns, { ...failure, saving: false, error: failure.overridden || failure.conflict ? failure.error : settingsNotice("failed"), conflict: failure.conflict === true || this.cards[ns].conflict, overridden: failure.overridden === true });
          if (failure.conflict) await this.load();
        }
      }
      async loadCatalog() {
        const gen = this.generation;
        const request = ++this.catalogRequest;
        try {
          const result = await this.actions.readModelCatalog?.();
          if (!this.active || gen !== this.generation || request !== this.catalogRequest) return;
          if (result?.ok !== true || !Array.isArray(result.value?.groups)) throw new Error("catalog unavailable");
          const groups = result.value.groups.filter(group => typeof group?.id === "string" && /^\S+$/.test(group.id) && Array.isArray(group.models)).map(group => ({ ...group, models: group.models.filter(model => typeof model?.id === "string" && /^\S+$/.test(model.id)) }));
          this.catalog = { status: "ready", groups, failures: Array.isArray(result.value.failures) ? result.value.failures : [] };
        } catch {
          if (!this.active || gen !== this.generation || request !== this.catalogRequest) return;
          this.catalog = { status: "unavailable", groups: [], failures: [] };
        }
        this.emit();
      }
    }

    let settingsPageSequence = 0;
    const settingsInputStyle = { width: "100%", minWidth: 0, boxSizing: "border-box", border: "1px solid var(--border-color, #a5a5a5)", borderRadius: 6, padding: "8px 10px", background: "var(--bg-color, transparent)", color: "inherit", font: "inherit" };
    const settingsButtonStyle = { border: "1px solid var(--border-color, #a5a5a5)", borderRadius: 6, padding: "8px 12px", background: "var(--bg-color, transparent)", color: "inherit", font: "inherit", cursor: "pointer" };
    const settingsHintStyle = { fontSize: 13, lineHeight: 1.55, margin: "6px 0", opacity: .85, overflowWrap: "anywhere" };
    const settingsActionsStyle = { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 };

    /** Host bundle-wide slot has no single form: each namespace owns its save. */
    function SettingsPage(props) {
      useLocaleUpdates();
      const [previewLocale, setPreviewLocale] = React.useState("auto");
      const [controller] = React.useState(() => new SettingsPageController(props.actions));
      const [, redraw] = React.useState(0);
      const [pageId] = React.useState(() => `dsh-activity-settings-${++settingsPageSequence}`);
      React.useEffect(() => {
        const off = controller.subscribe(() => redraw(value => value + 1));
        controller.start();
        return () => { off(); controller.stop(); };
      }, [controller]);
      const tr = (key, params) => {
        if (previewLocale === "auto") return t(`settings.${key}`, params);
        const template = DICTIONARIES[normalizeLocale(previewLocale)][`settings.${key}`];
        return template.replace(/\{(\w+)\}/g, (match, name) => params && name in params ? String(params[name]) : match);
      };
      const localError = error => error?.key?.startsWith("settings.") ? tr(error.key.slice(9), error.params) : errorMessage(error);
      const button = (label, onClick, disabled, extra = {}) => h("button", { type: "button", onClick, disabled, style: settingsButtonStyle, ...extra }, label);
      const languageSelect = (value, onChange, id, host = false, name = "locale") => h("select", { id, name, value, onChange: event => onChange(event.target.value), style: settingsInputStyle },
        h("option", { value: "auto" }, tr(host ? "hostAuto" : "auto")), h("option", { value: "en" }, tr("english")), h("option", { value: "zh-CN" }, tr("chinese")));
      const field = (id, label, input, hint) => h("div", { key: id, style: { minWidth: 0, marginBottom: 10 } }, h("label", { htmlFor: id, style: { display: "block", fontSize: 13, marginBottom: 5 } }, label), input, hint ? h("p", { style: settingsHintStyle }, hint) : null);
      function routeFields(ns, route, path, onChange, label) {
        const providerList = `${pageId}-${path}-providers`;
        const modelList = `${pageId}-${path}-models`;
        const reasoningList = `${pageId}-${path}-reasoning`;
        const group = controller.catalog.groups.find(item => item.id === route.provider);
        const model = group?.models.find(item => item.id === route.model);
        const efforts = Array.isArray(model?.reasoning?.efforts) ? model.reasoning.efforts.filter(item => typeof item?.id === "string" && /^\S+$/.test(item.id)) : [];
        const input = (key, list, optional = false) => {
          const id = `${pageId}-${path}-${key}`;
          return field(id, tr(key === "reasoningEffort" ? "reasoning" : key), h("input", {
            id, name: `${path}.${key}`, type: "text", value: route[key] ?? "", list,
            autoComplete: "off", spellCheck: false, required: !optional, style: settingsInputStyle,
            onChange: event => { const next = { ...route, [key]: event.target.value }; if (optional && event.target.value === "") delete next[key]; onChange(next); },
          }));
        };
        return h("fieldset", { style: { minWidth: 0, margin: "10px 0", padding: 12, border: "1px solid var(--border-color, #a5a5a5)", borderRadius: 7 } },
          h("legend", { style: { padding: "0 4px", fontSize: 13 } }, label),
          h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))", gap: "0 12px" } }, input("provider", providerList), input("model", modelList)),
          input("reasoningEffort", reasoningList, true),
          h("datalist", { id: providerList }, controller.catalog.groups.map(item => h("option", { key: item.id, value: item.id }, text(item.name) ?? item.id))),
          h("datalist", { id: modelList }, (group?.models ?? []).map(item => h("option", { key: item.id, value: item.id }, text(item.name) ?? item.id))),
          h("datalist", { id: reasoningList }, efforts.map(item => h("option", { key: item.id, value: item.id }, text(item.name) ?? item.id))));
      }
      function renderCard(ns) {
        const card = controller.cards[ns];
        const panel = ns === PANEL_ID;
        const draft = card.draft;
        const disabled = card.status !== "ready" || !card.writable || card.saving || card.overridden;
        const invalid = draft ? validateSettingsDraft(ns, draft) : null;
        const patch = change => controller.edit(ns, { ...draft, ...change });
        const localeId = `${pageId}-${ns}-locale`;
        const messageId = `${pageId}-${ns}-status`;
        const confirmed = card.revision >= 0 && card.value !== null;
        const stateLabel = panel ? null : !confirmed ? tr("unavailable") : card.value.enabled ? tr("on") : routingConfigured(card.value) ? tr("off") : tr("unconfigured");
        return h("form", {
          key: ns, "data-settings-card": ns, "aria-labelledby": `${pageId}-${ns}-title`, "aria-describedby": messageId,
          onSubmit: event => { event.preventDefault(); controller.save(ns); },
          style: { minWidth: 0, border: "1px solid var(--border-color, #a5a5a5)", borderRadius: 12, padding: 20, boxSizing: "border-box", alignSelf: "start" },
        },
          h("h3", { id: `${pageId}-${ns}-title`, style: { fontSize: 17, margin: "0 0 8px" } }, tr(panel ? "panel" : "routing")),
          h("p", { style: settingsHintStyle }, tr(panel ? "panelHint" : "routingHint")),
          h("div", { id: messageId, role: "status", "aria-live": "polite", "data-settings-status": card.status, style: settingsHintStyle },
            card.status === "loading" ? tr("loading") : card.status === "error" ? tr("unavailable") : tr("confirmed", { revision: card.revision }),
            stateLabel ? h("div", { "data-settings-confirmed-routing": !confirmed ? "unavailable" : card.value.enabled ? "on" : "off" }, stateLabel) : null,
            draft ? h("div", null, tr(card.dirty ? "dirty" : "clean")) : null,
            card.saved ? h("div", null, tr("saved")) : null),
          card.status === "ready" && !card.writable ? h("p", { role: "note", style: settingsHintStyle }, tr("readonly")) : null,
          card.error ? h("p", { role: "alert", style: { ...settingsHintStyle, color: "var(--error-color, #b42318)" }, "data-settings-error": "true" }, localError(card.error)) : null,
          card.detail ? h("p", { style: settingsHintStyle }, tr("detail", { detail: card.detail })) : null,
          draft ? h("fieldset", { disabled, style: { minWidth: 0, border: 0, padding: 0, margin: "14px 0 0" } },
            h("legend", { style: { position: "absolute", width: 1, height: 1, padding: 0, overflow: "hidden", clip: "rect(0,0,0,0)" } }, tr(panel ? "panel" : "routing")),
            field(localeId, tr(panel ? "panelLocale" : "routingLocale"), languageSelect(draft.locale, locale => patch({ locale }), localeId, !panel)),
            panel ? null : h(React.Fragment ?? "div", null,
              h("label", { style: { display: "flex", gap: 8, alignItems: "start", margin: "14px 0" } }, h("input", { name: "enabled", type: "checkbox", checked: draft.enabled, disabled: !draft.enabled && !routingConfigured(draft), onChange: event => patch({ enabled: event.target.checked }) }), tr("enabled")),
              h("p", { style: settingsHintStyle }, tr("manual")),
              h("p", { style: settingsHintStyle, "data-settings-catalog": controller.catalog.status }, tr(controller.catalog.status !== "ready" ? "catalogUnavailable" : controller.catalog.failures.length > 0 ? "catalogPartial" : "catalogReady")),
              h("h4", { style: { fontSize: 14, marginBottom: 5 } }, tr("parents")),
              h("p", { style: settingsHintStyle }, tr("parentHint")),
              draft.parentRoutes.length === 0 ? h("p", { style: settingsHintStyle }, tr("noParents")) : null,
              draft.parentRoutes.map((route, index) => h("div", { key: index },
                routeFields(ns, route, `parentRoutes.${index}`, next => patch({ parentRoutes: draft.parentRoutes.map((item, i) => i === index ? next : item) }), tr("parent", { index: index + 1 })),
                button(tr("remove", { index: index + 1 }), () => patch({ parentRoutes: draft.parentRoutes.filter((_, i) => i !== index) }), disabled, { "data-settings-action": "remove-parent" }))),
              h("div", { style: settingsActionsStyle }, button(tr("add"), () => patch({ parentRoutes: [...draft.parentRoutes, { provider: "", model: "" }] }), disabled, { "data-settings-action": "add-parent" })),
              h("h4", { style: { fontSize: 14 } }, tr("target")),
              draft.targetRoute === null ? h("p", { style: settingsHintStyle }, tr("noTarget")) : routeFields(ns, draft.targetRoute, "targetRoute", targetRoute => patch({ targetRoute }), tr("target")),
              button(tr(draft.targetRoute === null ? "setTarget" : "clearTarget"), () => patch({ targetRoute: draft.targetRoute === null ? { provider: "", model: "" } : null }), disabled, { "data-settings-action": draft.targetRoute === null ? "set-target" : "clear-target" }))) : null,
          draft && invalid ? h("p", { role: "status", style: settingsHintStyle, "data-settings-validation": "true" }, localError(invalid)) : null,
          card.conflict ? h("div", { style: settingsHintStyle }, h("p", null, tr("reviewHint")), button(tr("review"), () => controller.review(ns), disabled, { "data-settings-review": ns, "data-settings-action": "rebase" })) : null,
          h("div", { style: settingsActionsStyle },
            h("button", { type: "submit", disabled: disabled || !card.dirty || card.conflict || Boolean(invalid), style: { ...settingsButtonStyle, fontWeight: 600 }, "data-settings-save": ns, "data-settings-action": "save" }, tr(card.saving ? "saving" : panel ? "savePanel" : "saveRouting")),
            button(tr("discard"), () => controller.discard(ns), !draft || card.saving || !card.dirty && !card.conflict, { "data-settings-discard": ns, "data-settings-action": "discard" })),
          confirmed ? h("details", { style: { marginTop: 14 } }, h("summary", { style: { cursor: "pointer", fontSize: 13 } }, tr("current")),
            h("pre", { style: { whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontSize: 12 }, "data-settings-host-value": ns }, JSON.stringify(card.value, null, 2)),
            card.base !== undefined ? h("div", null, h("strong", { style: { fontSize: 12 } }, tr("inherited")), h("pre", { style: { whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontSize: 12 } }, JSON.stringify(card.base, null, 2))) : null,
            card.user !== undefined ? h("div", null, h("strong", { style: { fontSize: 12 } }, tr("user")), h("pre", { style: { whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontSize: 12 } }, JSON.stringify(card.user, null, 2))) : null) : null);
      }
      if (props.view === "summary") return h("span", null, tr("title"));
      return h("section", { "data-agent-activity-settings": "true", style: { color: "inherit", font: "inherit", maxWidth: 1100, margin: "0 auto", padding: "8px 0", width: "100%", minWidth: 0 } },
        h("h2", { style: { fontSize: 20, margin: "0 0 6px" } }, tr("title")),
        h("p", { style: settingsHintStyle }, tr("intro")),
        h("div", { style: { ...settingsActionsStyle, alignItems: "end", justifyContent: "space-between", marginBottom: 18 } },
          h("div", { style: { width: 240, maxWidth: "100%" } }, field(`${pageId}-language`, tr("pageLanguage"), languageSelect(previewLocale, setPreviewLocale, `${pageId}-language`, false, "pageLanguage"))),
          button(tr("read"), () => controller.readAgain(), Object.values(controller.cards).some(card => card.saving), { "data-settings-read": "true", "data-settings-action": "reload" })),
        h("div", { style: { display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 18, alignItems: "start" } }, SETTINGS_NAMESPACES.map(renderCard)));
    }

    function useStrategySwitch(actions) {
      const [view, setView] = React.useState({
        status: "loading",
        enabled: false,
        revision: -1,
        writable: false,
        error: null,
        saving: false,
        pending: null,
      });
      const accepted = React.useRef(-1);
      const generation = React.useRef(0);
      const inflight = React.useRef(false);
      const queued = React.useRef(false);
      const hint = React.useRef(-1);
      const alive = React.useRef(true);
      const writing = React.useRef(false);

      function load() {
        if (!alive.current) return;
        if (inflight.current) {
          queued.current = true;
          return;
        }
        inflight.current = true;
        hint.current = -1;
        const gen = generation.current;
        Promise.resolve()
          .then(() => actions.readStrategy())
          .then((result) => {
            if (gen !== generation.current || !alive.current) return;
            const next = strategyFromDescribe(result);
            if (next.error !== null) {
              setView((current) => ({ ...current, status: "error", error: next.error, writable: next.writable === true, saving: current.saving }));
              return;
            }
            // An older describe may race a confirmed write: ignore it wholesale.
            if (!acceptStrategyRevision(accepted.current, next.revision)) return;
            accepted.current = next.revision;
            setView((current) => ({
              ...current,
              status: "ready",
              configured: next.configured,
              targetRoute: next.targetRoute,
              enabled: next.enabled === true,
              revision: next.revision,
              writable: next.writable,
              // Keep the failure text while an unconfirmed retry is pending.
              error: current.pending === null ? null : current.error,
            }));
          })
          .catch((error) => {
            if (gen === generation.current && alive.current) {
              setView((current) => ({ ...current, status: "error", error: notice("读取失败：{detail}", { detail: error }) }));
            }
          })
          .finally(() => {
            // A reset invalidated this generation; the replacement load owns
            // the inflight flag and must not be cleared by the stale answer.
            if (gen !== generation.current) return;
            inflight.current = false;
            if (queued.current && alive.current) {
              queued.current = false;
              // A hint already covered by the accepted revision needs no
              // second describe; only a genuinely newer Host revision does.
              if (hint.current > accepted.current) load();
            }
          });
      }

      function write(next) {
        if (!alive.current || writing.current) return;
        writing.current = true;
        const gen = generation.current;
        const revision = accepted.current >= 0 ? accepted.current : undefined;
        setView((current) => ({ ...current, saving: true, error: null, pending: next }));
        Promise.resolve()
          .then(() => actions.writeStrategy(next, revision))
          .then((result) => {
            if (gen !== generation.current || !alive.current) return;
            const parsed = strategyFromUpdate(result);
            if (parsed.error !== null) {
              setView((current) => ({ ...current, saving: false, error: parsed.error, pending: next }));
              load();
              return;
            }
            // Another window may have committed a newer revision while this
            // write was in flight. That newer value stays visible; this receipt
            // only clears the saving state.
            if (staleStrategyReceipt(accepted.current, parsed)) {
              setView((current) => ({
                ...current,
                saving: false,
                status: "ready",
                pending: null,
                error: notice("设置已被其他窗口更新，已显示最新值"),
              }));
              return;
            }
            // Host receipt wins; the clicked intent never does.
            accepted.current = parsed.revision;
            setView((current) => ({
              ...current,
              status: "ready",
              saving: false,
              configured: parsed.configured,
              targetRoute: parsed.targetRoute,
              enabled: parsed.enabled === true,
              revision: parsed.revision,
              error: null,
              pending: null,
            }));
          })
          .catch((error) => {
            if (gen === generation.current && alive.current) {
              setView((current) => ({ ...current, saving: false, status: "error", error: notice("保存失败：{detail}", { detail: error }), pending: next }));
              load();
            }
          }).finally(() => { if (gen === generation.current) writing.current = false; });
      }

      React.useEffect(() => {
        alive.current = true;
        load();
        let disposeEvent = () => {};
        let disposeReset = () => {};
        try {
          const result = actions.onStrategyChanged((ns, revision) => {
            if (ns !== STRATEGY_NS) return;
            if (!newerStrategyRevision(accepted.current, revision)) return;
            if (revision > hint.current) hint.current = revision;
            if (inflight.current) {
              queued.current = true;
              return;
            }
            load();
          });
          if (typeof result === "function") disposeEvent = result;
        } catch {
          // Without the forwarded event the switch still works; it only loses
          // cross-window live refresh until the next local read.
        }
        try {
          const result = actions.onStrategyReset(() => {
            // A reconnected Host may restart its revision counter; discard both
            // the accepted revision and any in-flight answer from the old host.
            generation.current += 1;
            accepted.current = -1;
            writing.current = false;
            inflight.current = false;
            queued.current = false;
            setView((current) => resetStrategyState(current));
            load();
          });
          if (typeof result === "function") disposeReset = result;
        } catch {
          // Reset subscription is optional.
        }
        return () => {
          alive.current = false;
          generation.current += 1;
          try {
            disposeEvent();
          } catch {
            // Disposal must not fault the panel.
          }
          try {
            disposeReset();
          } catch {
            // Disposal must not fault the panel.
          }
        };
      }, []);

      const toggle = () => {
        if (view.saving === true || view.status !== "ready" || view.writable === false || view.configured === false) return;
        write(view.enabled !== true);
      };
      const retry = () => {
        if (view.saving === true) return;
        load();
      };
      return { view, toggle, retry };
    }

    /**
     * The one compact header switch.
     * @param {{ view: Record<string, any>, onToggle: () => void }} props - switch model.
     * @returns {import("react").ReactElement} switch button.
     */
    function StrategySwitch(props) {
      const { view, onToggle } = props;
      const saving = view.saving === true;
      const loading = view.status === "loading";
      const errored = view.status === "error" && view.error !== null;
      const blocked = view.writable === false;
      const unconfigured = view.configured === false;
      // A failed read may leave `enabled` at its initial false. Without a Host
      // revision that value is not a fact, so the control is unavailable rather
      // than a misleading OFF.
      const confirmed = typeof view.revision === "number" && view.revision >= 0;
      const disabled = saving || loading || blocked || errored || unconfigured;
      const enabled = confirmed && view.enabled === true;
      const title = unconfigured ? t("DS执行：未配置 — 请配置 parentRoutes 与 targetRoute 后再开启") : !confirmed && errored
        ? t("DS执行：Host 设置不可用，尚未取得确认状态")
        : blocked
          ? t("DS执行：当前 profile 不允许写入设置")
          : enabled
            ? t("DS执行：开 — 仅后续匹配的新委派使用 {target}", { target: [view.targetRoute?.provider, view.targetRoute?.model, view.targetRoute?.reasoningEffort].filter(Boolean).join("/") })
            : t("DS执行：关 — 子代理遵循 DSH 原生继承/显式选择，不强制 provider");
      return h(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": enabled ? "true" : "false",
          "aria-label": t("DS执行策略"),
          title,
          disabled,
          onClick: onToggle,
          style: {
            ...strategySwitchStyle,
            ...(enabled ? strategySwitchOnStyle : {}),
            ...(disabled ? disabledStyle : {}),
          },
          "data-planner-routing-switch": loading ? "loading" : !confirmed ? "unavailable" : unconfigured ? "unconfigured" : enabled ? "on" : "off",
          "data-state": saving ? "saving" : loading ? "loading" : view.status,
        },
        saving ? t("DS执行：…") : strategyLabel(view.status, enabled, confirmed, !unconfigured),
      );
    }

    /**
     * Small inline failure with an explicit retry; it only appears on failure.
     * @param {{ view: Record<string, any>, onRetry: () => void }} props - switch model.
     * @returns {import("react").ReactElement} error row.
     */
    function StrategyError(props) {
      const { view, onRetry } = props;
      return h(
        "div",
        { style: strategyErrorStyle, role: "alert", "data-planner-routing-error": "true" },
        h("span", { style: { minWidth: 0, flex: 1 } }, errorMessage(notice("DS执行开关：{detail}", { detail: view.error }))),
        h(
          "button",
          {
            type: "button",
            style: strategyRetryStyle,
            onClick: onRetry,
            disabled: view.saving === true,
            title: view.pending !== null ? t("重试保存") : t("重新读取"),
          },
          t("重试"),
        ),
      );
    }

    /**
     * The frame-wide floating panel. It reads only public slot standard props:
     * `useSessions`, `useSessionStatus`, and the injected navigation actions.
     * @param {{
     *   useSessions: Function,
     *   useSessionStatus: Function,
     *   actions: Record<string, Function>,
     * }} props - composed slot props.
     * @returns {import("react").ReactElement} panel.
     */
    function ActivityPanel(props) {
      const { useSessions, useSessionStatus, actions } = props;
      const [closed, setClosed] = React.useState(false);
      const [collapsed, setCollapsed] = React.useState(false);
      const [confirmId, setConfirmId] = React.useState(null);
      const [busyId, setBusyId] = React.useState(null);
      const [rowErrors, setRowErrors] = React.useState({});
      const strategy = useStrategySwitch(actions);

      const ids = useSessions((state) => state?.ids ?? EMPTY_IDS);
      const byId = useSessions((state) => state?.byId ?? EMPTY_BY_ID);
      const projections = useSessions((state) => state?.projectionsBySession ?? EMPTY_PROJECTIONS);
      const statuses = useSessionStatus((value) => value);

      const selectedId = React.useMemo(() => {
        let fallback;
        for (const id of ids) {
          const summary = byId[id];
          if (summary === null || summary === undefined) continue;
          if ((summary.retainedBy?.mainView ?? 0) <= 0) continue;
          if (summary.origin !== "subagent") return id;
          if (fallback === undefined) fallback = id;
        }
        return fallback;
      }, [ids, byId]);

      // The main view may be showing a child; always present the real root and
      // its direct children, never label the selected child as the main agent.
      const mainId = React.useMemo(
        () => resolveRootSessionId(selectedId, byId, projections),
        [selectedId, byId, projections],
      );

      const { snapshots, feed, busy } = useProjectionFeed({ actions });

      const rootOfficialLive = mainId !== undefined && mainId !== null ? isOfficialLive(mainId, byId) : false;
      const rootLiveIds = React.useMemo(
        () => new Set(rootOfficialLive && mainId !== undefined ? [mainId] : []),
        [rootOfficialLive, mainId],
      );
      const isChildRunning = (id) => isRunning(statuses, id, byId[id]);
      const childEntries = React.useMemo(
        () => collectChildEntries(mainId, projections, byId, snapshots, rootLiveIds),
        [mainId, projections, byId, snapshots, rootLiveIds],
      );
      // Subscribe to root + running direct children only: an idle historical
      // child must not cost an initial RPC just to be hidden again.
      const childIds = React.useMemo(
        () => runningChildIds(childEntries, statuses, byId),
        [childEntries, statuses, byId],
      );
      const childKey = childIds.join("|");
      const selectedSummary = selectedId === undefined ? undefined : byId[selectedId];
      const rootPending = selectedSummary?.origin === "subagent" && mainId === selectedId;
      const rootRunning = mainId !== undefined && isChildRunning(mainId);
      const runningKey = rootRunning ? mainId : "";
      const officialLiveIds = React.useMemo(() => {
        const live = new Set();
        if (rootOfficialLive && mainId !== undefined) live.add(mainId);
        for (const id of childIds) if (isOfficialLive(id, byId)) live.add(id);
        return live;
      }, [rootOfficialLive, mainId, childIds, byId, statuses]);
      const model = buildRows({
        mainId,
        byId,
        projections,
        snapshots,
        officialLiveIds,
        statuses,
        now: Date.now(),
        mainIsRoot: !rootPending,
      });
      const mainValues =
        mainId === undefined || mainId === null ? undefined : projectionView(mainId, projections, snapshots, officialLiveIds).values;
      const rows = visibleRows(model.rows);
      const currentRunningIds = new Set(rows.filter((row) => row.kind === "subagent").map((row) => row.id));
      const previousTurns = previousTurnsOf(mainValues);
      const previous = selectPreviousTurn(model.rows, previousTurns, currentRunningIds);
      const previousRows = previous?.rows ?? [];
      const mainRow = rows.find((row) => row.kind === "main" || row.kind === "current");
      const runningRows = rows.filter((row) => row.kind === "subagent");
      const previousChildIds = previousRows.map((row) => row.id);
      const previousKey = previousChildIds.join("|");
      const runningChildCount = rows.filter((row) => row.kind === "subagent" && row.status === "running").length;

      React.useEffect(() => {
        feed.configure({
          rootId: mainId,
          childIds,
          previousChildIds,
          isRunning: isChildRunning,
          rootNeedsRpc: !rootOfficialLive,
          active: mainId !== undefined && closed === false && collapsed === false,
        });
      }, [feed, mainId, childKey, previousKey, runningKey, rootOfficialLive, closed, collapsed]);

      React.useEffect(() => {
        if (confirmId === null) return undefined;
        const timer = setTimeout(() => setConfirmId(null), 4_000);
        return () => clearTimeout(timer);
      }, [confirmId]);

      const setRowError = (id, message) => {
        setRowErrors((current) => ({ ...current, [id]: message }));
      };

      const clearRowError = (id) => {
        setRowErrors((current) => {
          if (current[id] === undefined) return current;
          const next = { ...current };
          delete next[id];
          return next;
        });
      };

      const requestRefresh = () => {
        feed.refreshAll();
      };

      const openRow = (row) => {
        clearRowError(row.id);
        try {
          const target = openTarget(row);
          if (target?.kind === "main") actions.openMain(target.id);
          else if (target?.kind === "child") actions.openChild(target.address);
        } catch (error) {
          setRowError(row.id, notice("打开失败：{detail}", { detail: error }));
        }
      };

      const stopRow = (row) => {
        if (row.canStop !== true) return;
        if (confirmId !== row.id) {
          setConfirmId(row.id);
          clearRowError(row.id);
          return;
        }
        setConfirmId(null);
        setBusyId(row.id);
        clearRowError(row.id);
        Promise.resolve()
          .then(() => actions.stop(row.id, row.parentId))
          .then((result) => {
            if (result !== null && typeof result === "object" && result.ok === false) {
              throw result.error ?? notice("停止请求被拒绝");
            }
            feed.refreshSession(row.id);
          })
          .catch((error) => setRowError(row.id, notice("停止失败：{detail}", { detail: error })))
          .finally(() => setBusyId(null));
      };

      if (closed) {
        return h(
          "button",
          {
            type: "button",
            style: pillStyle,
            onClick: () => setClosed(false),
            title: t("打开代理活动面板"),
            "aria-label": t("打开代理活动面板"),
            "data-subagent-activity": "pill",
          },
          h("span", { style: { ...dotStyle, background: statusColor(runningChildCount > 0 ? "running" : "inactive") } }),
          `${t("代理活动")}${runningChildCount > 0 ? ` · ${runningChildCount}` : ""}`,
        );
      }

      const renderRow = (row, index) => {
        const main = row.kind === "main" || row.kind === "current";
        const rawName = main
          ? row.recentTask?.kind === "prompt"
            ? row.recentTask.text
            : row.title ?? row.label
          : row.label;
        const name = rawName !== undefined && rawName !== row.id ? rawName : main ? t("主代理") : t("未命名子代理");
        const model = row.modelRecorded === true ? row.model : undefined;
        const modelTitle =
          model === undefined
            ? t("尚无实际使用记录")
            : [model, row.provider !== undefined ? t("provider {id}", {id: row.provider}) : undefined, row.reasoning !== undefined ? t("reasoning {id}", {id: row.reasoning}) : undefined]
                .filter((part) => part !== undefined)
                .join(" · ");
        return h(
          "div",
          {
            key: row.id,
            style: { ...rowStyle, ...(index === 0 ? {} : { borderTop: `1px solid ${colors.border}` }) },
            "data-subagent-activity-row": row.kind,
            "data-status": row.status,
          },
          h(
            "div",
            { style: rowTopStyle },
            h("span", { style: { ...dotStyle, background: statusColor(row.status) } }),
            h("span", { style: rowLabelStyle, title: name }, name),
            h("span", { style: { ...statusStyle, color: statusColor(row.status) } }, statusLabel(row)),
          ),
          h(
            "div",
            { style: modelLineStyle, title: modelTitle },
            h(
              "span",
              { style: model === undefined ? { ...modelStrongStyle, color: colors.tertiary } : modelStrongStyle },
              model ?? t("模型未知"),
            ),
          ),
          main
            ? null
            : h(
                "div",
                { style: actionsStyle },
                row.canOpen ? actionButton(t("打开"), () => openRow(row)) : null,
                row.canStop
                  ? actionButton(
                      busyId === row.id ? t("停止中…") : confirmId === row.id ? t("确认停止") : t("Stop"),
                      () => stopRow(row),
                      { danger: true, disabled: busyId === row.id, title: t("中断该子代理当前回合") },
                    )
                  : null,
              ),
          rowErrors[row.id] !== undefined ? h("div", { style: errorStyle, role: "alert" }, errorMessage(rowErrors[row.id])) : null,
        );
      };

      const projectionError = Array.isArray(model.projectionErrors) ? model.projectionErrors[0] : undefined;

      return h(
        "section",
        {
          style: panelStyle,
          role: "region",
          "aria-label": t("代理活动面板"),
          "aria-busy": busy > 0 || model.projectionState === "loading" ? "true" : undefined,
          "data-subagent-activity": "panel",
          onKeyDown: (event) => {
            if (event.key === "Escape" && collapsed === false) setCollapsed(true);
          },
        },
        h(
          "div",
          { style: headerStyle },
          h(
            "div",
            { style: headerTextStyle },
            h("div", { style: titleStyle, title: t("代理活动") }, runningChildCount > 0 ? `${t("panelTitle")} · ${runningChildCount}` : t("panelTitle")),
          ),
          h(StrategySwitch, { view: strategy.view, onToggle: strategy.toggle }),
          actionButton("⟳", requestRefresh, { title: t("刷新") }),
          h(
            "button",
            {
              type: "button",
              style: iconButtonStyle,
              onClick: () => setCollapsed((value) => !value),
              title: collapsed ? t("展开") : t("折叠"),
              "aria-label": collapsed ? t("展开代理活动面板") : t("折叠代理活动面板"),
              "aria-expanded": collapsed ? "false" : "true",
            },
            collapsed ? "▸" : "▾",
          ),
          h(
            "button",
            {
              type: "button",
              style: iconButtonStyle,
              onClick: () => setClosed(true),
              title: t("隐藏代理活动面板"),
              "aria-label": t("隐藏代理活动面板"),
            },
            "×",
          ),
        ),
        strategy.view.error !== null ? h(StrategyError, { view: strategy.view, onRetry: strategy.retry }) : null,
        collapsed
          ? null
          : h(
              "div",
              { style: bodyStyle },
              mainId === undefined || mainId === null
                ? h("div", { style: emptyStyle }, t("未找到当前主会话。"))
                : h(
                    "div",
                    null,
                    mainRow !== undefined ? renderRow(mainRow, 0) : null,
                    h("div", { style: sectionLabelStyle, "data-subagent-section": "current" }, t("当前运行中")),
                    runningRows.length > 0
                      ? runningRows.map((row, index) => renderRow(row, index))
                      : h("div", { style: emptyStyle, role: "status" }, t("无运行中的子代理")),
                    h("div", { style: dividerStyle, role: "separator" }),
                    h("div", { style: sectionLabelStyle, "data-subagent-section": "previous" }, t("上一轮")),
                    previousRows.length > 0
                      ? previousRows.map((row, index) => renderRow(row, index))
                      : h(
                          "div",
                          { style: emptyStyle, role: "status" },
                          previousTurns.length > 0 ? t("上一轮暂无可显示的已结束子代理") : t("尚无可用轮次记录"),
                        ),
                  ),
              projectionError !== undefined
                ? h("div", { style: noteStyle, role: "alert" }, errorMessage(notice("投影读取失败：{detail}", { detail: projectionError })))
                : null,
            ),
      );
    }

    /**
     * Compose the boundary around the panel so a render fault is recoverable.
     * @param {Record<string, unknown>} props - composed slot props.
     * @returns {import("react").ReactElement} guarded panel.
     */
    function ActivityRoot(props) {
      useLocaleUpdates();
      return h(ActivityErrorBoundary, null, h(ActivityPanel, props));
    }

    /**
     * Activate the browser contribution.
     * @param {import("@deepseek-ai/cordis").Context} ctx - client context.
     */
    function apply(ctx, config = {}) {
      explicitLocaleOverride = config.locale ?? "auto";
      localeOverride = explicitLocaleOverride;
      connectLocale(ctx);
      const resetListeners = new Set();
      let settingsGeneration = 0;
      const notifyReset = () => { settingsGeneration += 1; panelLocaleRevision = -1; for (const listener of resetListeners) listener(); };
      let settingsRemote;
      let subagentsRemote;
      if (typeof ctx.inject === "function") {
        ctx.inject(["remote.settings"], child => {
          settingsRemote = child.remote.settings;
          panelLocaleRevision = -1;
          notifyReset();
          return () => { settingsRemote = undefined; notifyReset(); };
        });
        ctx.inject(["remote.subagents"], child => {
          subagentsRemote = child.remote.subagents;
          return () => { subagentsRemote = undefined; };
        });
      } else {
        // Plain-object fixtures have no Cordis dependency checks.
        settingsRemote = ctx.remote?.settings;
        subagentsRemote = ctx.remote?.subagents;
      }
      const actions = {
        fetchProjections(sessionId, signal) {
          const session = ctx.remote?.session;
          if (session === undefined || session === null || typeof session.projections !== "function") {
            return { ok: false, error: { code: "dsh-agent-activity/projections-unavailable", message: t("remote.session.projections 不可用") } };
          }
          return session.projections({ sessionId }, signal);
        },
        readStrategy() {
          const settings = settingsRemote;
          if (settings === undefined || settings === null || typeof settings.describe !== "function") {
            return { ok: false, error: { code: "dsh-agent-activity/settings-unavailable", message: t("remote.settings 不可用") } };
          }
          const gen = settingsGeneration;
          return Promise.resolve(settings.describe()).then(result => {
            if (gen === settingsGeneration && settings === settingsRemote) adoptPanelLocale(result);
            return result;
          });
        },
        writeStrategy(enabled, revision) {
          const settings = settingsRemote;
          if (settings === undefined || settings === null || typeof settings.update !== "function") {
            return { ok: false, error: { code: "dsh-agent-activity/settings-unavailable", message: t("remote.settings 不可用") } };
          }
          // Always send the revision this panel read, so a concurrent write from
          // another window is refused instead of silently overwritten.
          return settings.update(STRATEGY_NS, { enabled: enabled === true }, revision);
        },
        writeSettings(ns, patch, revision) {
          // Only the two owned namespaces and explicit revisions are writable.
          if (!SETTINGS_NAMESPACES.includes(ns) || !Number.isSafeInteger(revision) || revision < 0 || validateSettingsDraft(ns, patch)) {
            return { ok: false, error: { code: "dsh-agent-activity/invalid-settings", message: t("settings.invalidState") } };
          }
          const settings = settingsRemote;
          if (typeof settings?.update !== "function") return { ok: false, error: { code: "dsh-agent-activity/settings-unavailable", message: t("remote.settings 不可用") } };
          const gen = settingsGeneration;
          return Promise.resolve(settings.update(ns, patch, revision)).then(result => {
            if (gen === settingsGeneration && settings === settingsRemote && ns === PANEL_ID && result?.ok === true && settingsNamespaceView(result.value, ns).error === null) {
              adoptPanelLocale({ ok: true, value: { namespaces: [result.value] } });
            }
            return result;
          });
        },
        readModelCatalog() {
          const session = ctx.remote?.session;
          if (typeof session?.modelCatalog !== "function") return { ok: false, error: { code: "dsh-agent-activity/catalog-unavailable" } };
          // Official process-level catalog; labels never become persisted ids.
          return session.modelCatalog();
        },
        onStrategyChanged(listener) {
          const disposers = [];
          try {
            const remote = ctx.remote;
            if (remote !== undefined && remote !== null && typeof remote.$on === "function") {
              const dispose = remote.$on("settings/document-updated", (ns, revision) => {
                if (ns === PANEL_ID && newerStrategyRevision(panelLocaleRevision, revision)) Promise.resolve(actions.readStrategy()).catch(() => {});
                listener(ns, revision);
              });
              if (typeof dispose === "function") disposers.push(dispose);
            }
          } catch {
            // Missing forwarded events leave the switch functional but not live.
          }
          return () => {
            for (const dispose of disposers) {
              try {
                dispose();
              } catch {
                // Idempotent disposal.
              }
            }
          };
        },
        onStrategyReset(listener) {
          resetListeners.add(listener);
          let dispose = () => {};
          try {
            if (typeof ctx.on === "function") {
              const result = ctx.on("connection/reset", () => { settingsGeneration += 1; panelLocaleRevision = -1; listener(); });
              if (typeof result === "function") dispose = result;
            }
          } catch {
            // Optional reset transport; service lifecycle is also observed above.
          }
          return () => { resetListeners.delete(listener); dispose(); };
        },
        openMain(sessionId) {
          ctx.uiWorkspace.openSession(sessionId);
        },
        openChild(address) {
          ctx.uiWorkspace.openSession(address);
        },
        continueChild(address) {
          // Continuation is the official child Conversation: opening it puts the
          // normal composer (and its queue/steer behaviour) in front of the user.
          ctx.uiWorkspace.openSession(address);
        },
        async stop(childId, parentId) {
          const subagents = subagentsRemote;
          if (subagents === undefined || subagents === null || typeof subagents.interruptByParent !== "function") {
            return { ok: false, error: { code: "dsh-agent-activity/subagents-unavailable", message: t("远程 subagents 服务不可用") } };
          }
          return subagents.interruptByParent(childId, parentId, "continuable");
        },
      };

      ctx.slots.inject("shell.overlay", () =>
        ctx.slots.register(
          {
            name: "shell.overlay",
            id: PANEL_ID,
            order: 120,
            label: t("代理活动"),
            inject: () => ({ actions }),
          },
          ActivityRoot,
        ),
      );
      // This optional child waits for the Plugins page owner; its absence never
      // delays the independently registered activity overlay.
      ctx.slots.inject("plugins.bundle.config", () =>
        ctx.slots.register({ name: "plugins.bundle.config", key: "dsh-agent-activity", inject: () => ({ actions }) }, SettingsPage),
      );
    }

    exports.apply = apply;
    exports.inject = ["sessions", "slots", "uiWorkspace", "remote", "remote.session"];
    exports.__test = {
      DICTIONARIES, t, notice, setLocale, normalizeLocale, connectLocale, adoptPanelLocale, routingConfigured, ActivityPanel, ActivityRoot, useStrategySwitch,
      SettingsPage, SettingsPageController, settingsNamespaceFromDescribe, settingsNamespaceView, settingsWriteError, validateSettingsDraft, SETTINGS_NAMESPACES,
      tokenTotal,
      formatTokens,
      formatDuration,
      formatClock,
      activityDuration,
      statusOf,
      statusLabel,
      collectChildEntries,
      buildRows,
      resolveModel,
      latestTask,
      resolveRootSessionId,
      refreshableChildIds,
      runningChildIds,
      visibleRows,
      previousTurnsOf,
      selectPreviousRows,
      selectPreviousTurn,
      SUBAGENT_TURNS_KEY,
      mergeProjectionValues,
      isOfficialLive,
      projectionView,
      catalogStateOf,
      projectionNoteFor,
      openTarget,
      finalSettled,
      ProjectionFeed,
      modeLabel,
      errorMessage,
      panelPositionStyle,
      PANEL_ID,
      STRATEGY_NS,
      strategyFromDescribe,
      strategyFromUpdate,
      strategyLabel,
      acceptStrategyRevision,
      newerStrategyRevision,
      staleStrategyReceipt,
      resetStrategyState,
      StrategySwitch,
      StrategyError,
    };
    return module.exports;
  },
});
