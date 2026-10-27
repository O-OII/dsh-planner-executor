# Advanced setup and compatibility / 高级设置与兼容性

[中文首页](../README.zh-CN.md) · [English home](../README.md)

## Panel-only setup / 只使用面板

The panel does not require configured execution models. Disable the optional routing row in the plugin component list, or use a profile override:

面板本身不要求配置执行模型。可在插件组件列表停用可选路由，或合并以下 profile override：

```yaml
- id: planner-executor-routing
  disabled: true
```

The overlay stays available; the Planner–Executor switch reports unavailable rather than inventing OFF. Advanced compositions may load only the root package entry:

浮窗照常工作，主从协作开关显示不可用而非虚构关闭。高级组合也可以仅加载根入口：

```yaml
- insert:
    - id: subagent-activity
      name: dsh-agent-activity
```

## Migrating a local prototype / 迁移旧本地版

Never run old activity/routing owners alongside this bundle: entry ids, settings namespace and projection key are intentionally stable. Back up the current profile and preserve your explicit routes, switch and language preferences. Disable/remove the old declarations before selecting the bundle; installing a disabled bundle first avoids duplicate declarations.

不要并行启用旧本地面板／路由与本组合包：它们共享稳定 entry id、Settings 命名空间和投影 key。迁移前备份当前 profile，并保留明确的路由、开关与语言偏好。先安装但不启用、再移除旧声明并切换，可避免重复入口。

A live Loader may reuse a running fiber by id even after its declared module name changes. A same-id migration must retire the two old entries and recreate them through the official lifecycle; editing `name` alone is not proof that new code runs. Use supported management operations and verify effective schemas/client modules. If a restart is required, finish active work before a normal restart; do not kill unrelated workers or replace the running GUI server.

Loader 可能按 id 复用旧运行实例；同 id 更换模块时，应按官方生命周期卸载旧两个实例并重新创建，不能只改 `name` 就认定已生效。通过有效 schema 和客户端模块核验；若安装明确要求重启，先结束在途工作后正常重启，不强杀其他任务或另起 GUI 服务。

## Display and authority / 展示与权限

- Model labels use durable `modelSelection.lastUsed`, never intended `next` selections. Provider/model/effort identities remain literal.
- Current rows include the main agent and running direct children. A bounded Host projection attributes previous-turn children; timestamps are not used to guess ownership.
- Completed requires durable completion evidence. Missing projections and unknown routes stay explicitly unknown.
- Child Open uses the official address. Two-click Stop is offered only for a running local continuable direct child and calls `interruptByParent(childId,parentId,"continuable")`.
- The default overlay is 300px wide. Projection concurrency is bounded at two, with three-second polling restricted to active rows and bounded settlement retries.

模型只取实际 `lastUsed`；当前区聚焦主代理与运行中的直接子代理，上一轮由有界 Host 投影记录，不猜时间归属。缺证据不显示完成。打开／停止沿用官方地址和权限；不为主代理、外部执行或不可继续子代理杜撰 Stop 权限。轮询仅用于活跃条目并限制并发。

## Compatibility and verification / 兼容与验证

The package targets DSH 0.2.1-rc.2 contracts, reviewed against rc.3: session projections, `shell.overlay`, official Settings/credentials/LLM/subagent RPC, schema service, plugin configuration slots and `startActivation`. The declared range `>=0.2.1-rc.2 <0.3.0` avoids accidentally excluding rc.3; it is not a certification for every build. Node 22/24 on Windows/Linux are CI targets.

目标契约为 DSH 0.2.1-rc.2 的会话投影、浮窗、Settings／子代理 RPC、插件配置扩展点与 activation。版本声明不是所有环境的兼容认证。公开演示加载真实生产组件但使用合成适配器；隔离的官方 Settings／ConfigEditor 测试验证配置持久化，不替代所有安装版本的真实全链路测试。

See [reproducible tests](testing.md), [configuration](configuration.md) and the [Planner–Executor contract](ds-execution.md) for evidence and remaining gates. The creation-only API form temporarily holds draft keys and writes only through official credentials APIs; it never reads saved secrets. No telemetry is added; routing diagnostics are bounded in memory and exclude prompts/credentials.
