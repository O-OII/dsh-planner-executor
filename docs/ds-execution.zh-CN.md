# 主从协作：可选、明确的分工

[English](ds-execution.md) · [项目说明](../README.zh-CN.md) · [接入配置](configuration.zh-CN.md)

界面名称为 **DSH 主从协作**／**DSH Planner–Executor**，支持 DSH 已接入且获授权的任意 API 模型，不限 DeepSeek。旧文档文件名、包／设置 ID 保持稳定。包内不附账号、默认执行目标或密钥；新配置默认关闭且未配置。

## 分工与选模优先级

强**主代理**负责需求、规划、设计、决策与验收；实质实现、文件编辑、命令执行、研究和测试交给 worker；简单问题／微小任务直接完成。给每个 worker 简洁、自包含的范围、限制、交付物和验收标准，要求真实证据、失败和风险；主代理检查结果再验收，不把子代理的“完成”当作证明。优先新建 `subagent`，只有必须读取当前对话时才用 `subagent_fork`。

本插件配置一个**默认执行器**。不提供自动研究／测试角色：activation 接口没有可靠的工具角色标记，不按任务关键词猜测。DSH 启用并授权时，仍可原生显式指定子模型。

已复核的官方工具从显式参数／工具配置生成 `request.agentOptions`；父路由继承在**之后**的本地 child 选项解析器中完成。因此：

| 新 activation | 开启时行为 |
| --- | --- |
| 匹配的主会话，未指定子路由／推理 | 预检后使用默认执行器 |
| 匹配主会话，只指定 `maxTokens` 等无关选项 | 使用默认执行器，保留无关选项 |
| 提供任意子 `provider`、`model` 或 `reasoningEffort` | 原 spec 透传；包括显式选中与父相同的模型、工具配置默认路由 |
| 父路由不匹配 | 原 spec 透传 |
| worker／后代，包括与主模型同路由的 worker | 原 spec 透传，不新加规划者专属规则 |
| backend 声明不支持 AgentOptions | 保留其自有执行路由 |

worker 判断使用官方 `options.subagentDepth` 与持久 `session.header.parentSession`，不猜模型名或提示词。系统提示组装须提供官方 `context.agent`，缺失时不加规划者策略。fork 可能继承旧对话指导；路由 worker 的前缀明确说明继承的规划者专属规则只约束父代理。

## 关闭、预检与已有任务

**关闭**时原 assembly／spec／request／prompt 对象透传，不加策略／角色前缀，不修改路由，不做目标预检；面板观察独立工作。

**开启**须有有效精确 `parentRoutes` 与 `targetRoute`、以 `planner-executor-routing` 挂载的路由插件，以及官方 Settings、LLM、`subagents.startActivation` 服务。Host 在持久化前拒绝不完整的开启配置。对符合条件的主会话委派：

1. 快照目标，以调用方取消信号调用 `llm.resolveCallConfig` 预检。插件不主动进行推理调用；适配器可能做元数据发现。
2. await 后再次检查开关、路由、主会话与生命周期。关掉、改路由、卸载均作废旧决策；等待中关闭又开启也不复活它。已失效决策按实时关闭／原生语义传递原 spec。
3. 转发新 spec，设置目标 provider/model 和可选目标推理档位；目标未指定时不携带不兼容父档位。保留无关选项与全部原文本／图片 part，仅增加一个 worker 角色文本前缀。

决策仍有效时，目标预检失败会**明确阻止该委派**，不静默退回昂贵主模型，不自动重试。软策略也要求主代理报告失败／请求修正，而非暗中自己完成实质执行；它不是工具权限撤销。

已有子代理、排队／在途请求和后续消息**不迁移、不重启**。模型展示取真实 `lastUsed`，不把未来选择当实际执行。`startActivation` wrapper 对升级敏感，应保持单一路由 owner 并在 DSH 升级后复验；不要假定覆盖所有外部执行路径。

## 稳定配置

界面通过官方 revision 校验一次保存 `{enabled,parentRoutes,targetRoute,locale}`。高级组合可合并以下**示例**，替换全部 ID，不要替换整个 profile：

```yaml
- id: planner-executor-routing
  config:
    enabled: false
    parentRoutes:
      - provider: your-planner-provider
        model: your-planning-model
    targetRoute:
      provider: your-executor-provider
      model: your-execution-model
      # reasoningEffort: low  # 仅精确目标支持时填写
    locale: zh-CN             # auto | en | zh-CN；Host auto 使用中文
```

provider **与** model 同时精确匹配，父推理强度不参与条件。这些字段沿用官方 volatile 生命周期；面板语言独立。关闭失败保留已确认的开启，冲突／重连不重放过期意图、不用旧回执冒充新状态，详见[接入与持久化](configuration.zh-CN.md)。

## 边界与证据

跨路由会改变上下文、多模态、延迟、缓存、推理费用、数据位置、复核／重试成本。**不保证总 token 或费用降低**。预检不绕过授权，也不保证后续 API 成功。DSH 的授权、沙箱、审批、停止权限仍为权威，本插件不扩大或移除权限。

通用测试加载真实 client／routing 与合成服务，覆盖显式／默认优先级、同模型 worker 排除、关闭透传、预检竞态／失败、部分凭据失败、重连／卸载隔离。可选隔离官方 Settings／ConfigEditor 测试验证持久化，不代表现用 GUI 或收费委派已验收。参见[复现与当前范围](testing.md)。上游契约：[Settings](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/settings/settings)、[子代理工具](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/subagent/tool-subagent)。
