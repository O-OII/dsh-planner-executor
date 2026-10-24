# Contributing

English / 简体中文

Use Node 22 or 24 and run `npm ci --ignore-scripts`, `npm run check`, `npm test`, and `npm run pack:smoke` before proposing changes. The hand-authored client bundle has no build step. Tests and demo dependencies are development-only. Do not edit generated npm pack output.

请先运行上述四项命令。客户端是手写 bundle，无复杂构建。新增界面文案时同时补齐 en/zh 字典、title 和 aria 文案，并保留占位符和引用身份。不得添加本机绝对路径、凭据、用户会话、诊断快照或打包 verification 文件。

Preserve these contracts: `lastUsed` is not `next`; no success without durable completion evidence; no inferred turn membership; Stop must keep official parent authority; OFF must preserve spec/prompt identity and skip preflight; ON only snapshots new delegations. Never add an optimistic switch that shows a clicked intent as Host truth.

A useful bug report names the DSH version, Node version, OS, installed package version, reproducible synthetic input, and which verification was actually performed. Redact prompts, credentials, session ids and personal provider aliases. Avoid running against your live profile when an isolated fixture is sufficient.

Report real Host/GUI observations separately from Node mocks. Third-party integrations and future DSH versions need evidence; a broad engine range is not evidence. PRs should respect other plugins instead of claiming first/only/best without a verifiable basis.
