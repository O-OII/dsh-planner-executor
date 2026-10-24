# Security policy / 安全说明

Version 0.1.x is an initial preview candidate, not a security-audited product. No private reporting address has been established. Do not post credentials, prompts, sessions or private provider names in public issues. For a suspected vulnerability, use GitHub private vulnerability reporting if the repository enables it; otherwise open a minimal issue requesting a private channel without exploit details or sensitive data.

0.1.x 是初始预览候选版，未经过安全审计。没有预设私人邮箱。若仓库启用 GitHub 私密漏洞报告请优先使用；否则仅以不含攻击细节或敏感信息的 issue 请求私密沟通方式。

The activity panel is an observer plus native navigation/interrupt actions. Optional DS execution routing is not sandboxing, a permission boundary or a guarantee against planner execution. Provider credentials and authorization remain owned by DSH. ON overrides explicit child route fields for matching new delegations; inspect your target provider, model, authorization and data handling before enabling.

本插件不提供权限隔离；开启开关不是安全策略。新委派可能发往不同 provider，数据处理与费用规则随之变化。不要通过改插件来绕过 DSH 授权。多路由插件组合、升级、失败恢复均需重新验证。

No telemetry or raw HTTP endpoints are added. Runtime diagnostics are bounded and in memory only. The npm allowlist excludes tests, demo, local dependencies, logs and verification data. Synthetic demos must stay clearly labeled and must never be presented as live Host validation.
