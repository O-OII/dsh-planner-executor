# DS执行：明确、可选的委派策略

[English](./ds-execution.md) · [项目说明](../README.zh-CN.md)

“DS执行” / “DS execution”是容易理解的界面名称，目标可配置为 DSH 支持且获授权的**任意执行 provider/model**，不限定 DeepSeek。包内不附带 provider 账号、默认目标或凭据。开启不会自动配置模型，也不保证省钱。

![配置后关闭](images/panel-en-off.png)
![配置后开启](images/panel-zh-CN-on.png)

*图为真实客户端与合成 Settings/语言适配器，展示状态含义，不代表现用 profile 持久化或收费模型调用验收。*

## 开启条件

1. 包内可选 `dsh-agent-activity/routing` 必须以 `planner-executor-routing` id 挂载。入口未安装、停用、挂载失败时无可用 Settings namespace；面板仍工作，开关显示**不可用**。
2. Host 必需服务与 `subagents.startActivation` 存在。缺少真实 hook 时只让路由自身失败，不假称已生效。
3. 至少一条精确 `parentRoutes` 与完整 `targetRoute`。缺失、空白、含空格或结构错误的身份会被拒绝/视为未配置。无配置显示**未配置**，不是伪显示“关”。
4. 官方 Settings 返回真实 enabled 布尔值、非负整数 revision，且允许写入。加载中、未知、过期或错误状态不能当成已确认 OFF 点击。
5. Host `internal/config` guard 在 Settings 持久化前拒绝未配置 ON。结构有效不等于供应商可用：实际 provider/model、凭据、授权等由新委派边界的 `llm.resolveCallConfig` preflight 核实。语法有效但不存在的目标会明确阻止该委派，不静默继承规划模型。

## 在界面中配置

打开 **插件 → DSH Agent Activity（代理活动面板）**，编辑 **DS 执行**卡片。添加精确主模型条件、填写执行目标与受支持的可选推理强度、选择错误语言，再保存整张卡片。尚未保存的启用勾选不是当前生效状态；页面与浮窗通过官方 Settings 事件同步。草稿、语言／路由独立保存、目录回退、冲突与拒写处理见[配置说明](configuration.zh-CN.md)。

## 通用配置示例（高级）

普通设置使用界面即可。需要配置文件组合时，启用 bundle 后，把以下内容**合并**进 profile patch，不要替换整个配置。所有例子标识都应换成你自己 DSH 中的真实 provider/model，包内不会自动提供：

```yaml
- id: planner-executor-routing
  config:
    enabled: false
    parentRoutes:
      - provider: your-planner-provider
        model: your-planning-model
    targetRoute:
      provider: deepseek
      model: deepseek-chat
      # reasoningEffort: high  # 仅当该精确目标声明支持时设置
    locale: auto               # auto | en | zh-CN；Host auto 使用中文
```

DeepSeek 仅为公开示例，不保证你已配置该路由、目标支持 high，或费用更低。匹配同时要求 provider **与** model 完全一致；不同 provider 下的同名模型不会误命中。父 reasoningEffort 不参与匹配。目标 effort 可省略；此时不把父路由拥有的 effort 带入另一执行模型。

`parentRoutes`、`targetRoute`、`enabled`、路由错误 `locale` 均为官方 Schemastery volatile 字段。默认 bundle 设置 `enabled:false/parentRoutes:[]/targetRoute:null`；null 或缺省代表无目标。普通组合变更可能需要重载；live 字段沿官方 Loader 引用生命周期。不要引用本包外的私人路由文件。

## OFF / ON 的确切语义

**OFF：** system-prompt assembly 原对象透传；新 activation 原 spec/request/prompt 透传，不注入策略或 worker 文本，不改 provider/model/effort，不做目标 preflight。面板观察 RPC 照常工作。

**ON、父路由匹配、后续新 activation：**

1. 为这次委派快照目标与原请求。
2. 使用官方 LLM 服务、调用方 signal preflight 精确目标。插件本身不发起收费模型请求，但 Host/provider 实现可能有发现动作；本次没有实测远程 preflight 行为。
3. await 后再次检查开关、目标、父条件与生命周期失效。等待中关掉，即使 preflight 报错也原样放行；同一次等待里 OFF→ON 不复活旧决策。改过的目标不会被当成已验证目标使用。
4. 给这次新 child 转发新 spec，覆盖显式子 provider/model/可选 effort，保留无关选项。worker 角色仅作为新增文本 part；原字符串、text/image parts 均不修改。
5. ON 时匹配父模型的后续 prompt assembly 还会加入软性的规划/审查分工指导；简单对话无需无谓创建 worker。

**非匹配父路由：** ON 也保持原生透传。目标 API 基线中 fork/continuable 新建经过相同 `startActivation` 接缝；未支持/外部执行路径不能假定全部覆盖。不添加回退 adapter 或获授权路由。

### 不迁移在途任务

开关不是实时迁移按钮。不会换已有 child 模型、重启 worker、移动排队调用或改写后续消息。已有任务保持 DSH 自身生命周期/选模行为。面板继续显示记录的 lastUsed，不显示“未来可能走的模型”。匹配的新委派会覆盖显式子选模，这是设计取舍；不要同时安装期望相反优先级的 router。

## 持久化、多窗口、失败

- 浏览器使用 `ctx.remote.settings.describe()`；浮窗写入 `settings.update("planner-executor-routing",{enabled},revision)`，配置页则按自身读取的 revision 一次写入完整 `{enabled,parentRoutes,targetRoute,locale}`。持久化属于 Host Settings/ConfigEditor，不新建裸 HTTP、localStorage 开关或私人 JSON 状态文件。
- 只认 descriptor/receipt。保存中不乐观翻转 aria-checked。**关闭失败仍保留最后确认的 ON 并显示错误**，失败不能当成成功关闭。
- `settings/document-updated` 按 namespace/revision 去重合并；低 revision describe/receipt 不回退另一窗口的新值。`connection/reset` 作废旧 generation 的在途结果，接受重启后的较低 revision。
- 冲突只重读，不盲目重放旧意图。Retry 重新获取权威真值；失败后若仍希望切换，再点击一次。相同 tick 双击不会重叠写入。
- profile 拒写、home/CLI overlay、namespace/服务缺失等明确本地化显示。短暂失败可保留最后确认值并禁用；加载/未知不冒充 OFF。
- 启动不会强制把持久 ON 写回 OFF。可选集成测试中，销毁隔离官方 boot/Settings/ConfigEditor 并重新启动后，已恢复持久 ON 与精确目标；这验证了配置持久化契约，**不等于已安装 DSH 的 GUI／传输全链路**。

## 模型费用、权限与非安全边界

跨模型/provider 会改变价格、上下文、多模态能力、延迟、缓存、推理成本、数据位置、失败重试与复核成本。没有保证或测量节省。preflight 不证明最终请求一定成功或可负担。

规划/执行软提示和开关**不是安全边界**：不移除主代理工具，也不隔离文件/网络权限。授权、沙箱、审批、provider 配置和 Stop 权限仍由 DSH 管理。不要绕过它们。多个 router wrapper 的先后顺序可能产生交互，建议单一 owner，升级后重新验收。

## 真实测试范围与剩余验收

Node 测试加载**本包真实 routing 模块与 client bundle**，使用合成 Cordis/React/remote 夹具，覆盖 OFF 身份透传、ON 任意路线、多模态 parts、无效配置、preflight 中关闭/失败、revision 冲突、旧回执、关闭失败、重连、缺服务与双语。原 47 面板 + 13 路由场景保留。

已在隔离临时 profile 验证官方 0.2.1-rc.2 Settings/ConfigEditor 的真实保存与 fresh boot 恢复（8 项测试）。尚未完成：已安装 Host/GUI 与传输全链路、工具真实 fork/spawn、远程 authorized-route 拒绝、provider 发现、收费调用与跨模型账单。合成 demo 不能代替这些。发布生产支持声明前，请在隔离 profile、双语言、至少两窗口完成；除非用户另外授权部署，否则不改现用主应用。

已读公开契约：[Settings](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/settings/settings)、[volatile config](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/05-config.md)、[locale](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/client/locale)、[官方子代理工具](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/subagent/tool-subagent)。这些链接不是兼容认证。
