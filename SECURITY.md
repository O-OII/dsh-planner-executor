# Security policy / 安全说明

This is a preview plugin, not a security-audited product. Do not publish keys, prompts, sessions or private provider names in issues. Use GitHub private vulnerability reporting if enabled; otherwise request a private channel without sensitive details. / 本插件未经过安全审计；请勿在公开 issue 粘贴密钥、会话或私人提供商信息。优先使用仓库私密漏洞报告，或不附敏感细节地请求私密沟通渠道。

## Credentials / 凭据

The creation-only form temporarily holds a user-entered key in a masked browser field. It never reads saved secrets. Profiles contain only a credential reference; the value goes through official `credentials.set`. No key is written to routing settings, localStorage, telemetry or plugin logs. Discovery is an explicit request to the user-entered HTTP(S) endpoint through official `llm.discoverModels`; it can send the draft key there. Verify that endpoint before clicking Fetch. Do not enter a key into an untrusted Host/browser/plugin environment.

接入表单只在浏览器内存暂存用户输入，遮罩显示，不读取已存密钥。profile 只保存引用，密钥经官方 `credentials.set` 写入；不进入路由、localStorage、遥测或插件日志。模型发现只在明确点击时经官方接口请求所填端点，可能发送草稿密钥，点击前务必确认端点可信。

Settings and credential writes are not atomic. A partial save leaves the new profile in place, clears the key and allows explicit credential-only retry after profile verification. A reset/unmount clears local key state and fences completions, but cannot guarantee cancellation/rollback of an already accepted Host write. Inspect official Models settings after an uncertain receipt. The form refuses existing providers and pre-existing derived credential references; it is not a general credential editor.

设置／凭据不是原子事务。部分失败会保留新 profile、清空输入，验证 profile 后才允许明确重试凭据。重连／卸载不能撤销已接受的 Host 写入，未知回执应先检查官方模型页。已有提供商／已存在派生凭据引用不通过创建表单覆盖。

## Routing and permissions / 路由与权限

Planner–Executor is guidance and default routing, **not a sandbox or permission boundary**. Explicit child route/effort and configured tool defaults retain priority. Changing models can change cost, capabilities and data handling. DSH authorization, sandboxing, approvals and native Stop authority remain authoritative. Never use this plugin to bypass them. Revalidate wrapper compatibility after DSH upgrades; avoid multiple routing owners.

主从协作不提供权限隔离，不移除主代理工具，不保证省钱。显式子选模／推理与工具默认配置优先；跨模型会改变能力、费用和数据处理。升级、多 router 组合和恢复流程均需重新验证。

No telemetry or raw HTTP endpoints are added. Diagnostic routing events are bounded in memory and exclude prompts/credentials. Package allowlists exclude tests, demo adapters, dependencies and local evidence. Synthetic screenshots/tests must stay labeled and must not be presented as live provider or paid-inference acceptance.
