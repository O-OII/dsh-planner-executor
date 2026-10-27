# Reproducible verification / 可复现验证

## Portable checks / 通用检查

From this package directory / 在项目目录运行：

```sh
npm ci --ignore-scripts
npm run check
npm test
npm run pack:smoke
```

Current 0.3.2 implementation run: **150 Node tests, 148 passed, 0 failed, 2 explicitly skipped** (optional official Settings and Cordis integrations). `check` passed. This is not a coverage percentage or an installed-Host acceptance claim. Tests use actual package client/routing code with synthetic React/Cordis/Remote authorities and no provider/model network requests.

Coverage includes panel grouping/actual `lastUsed`, localization, revision conflicts and independent saves; default versus explicit/configured child selection; latest parent request route; root-only planner policy and same-model worker exclusion; OFF identity and preflight races; schema choices and creation-only profile mutation; credential collision/read-only/refusal; partial key-only retry; reset/unmount/uncertain receipts; explicit discovery and masked input. The five 0.3.2 branding regressions additionally verify repository/package compatibility, active documentation links, the six current screenshots, bilingual help/fallbacks and demo positioning. No real credentials are used. / 覆盖真实代码与合成服务，不读取现用凭据，不进行推理调用；新增五项品牌／文档／图片回归，跳过的宿主测试不计为已通过。

`pack:smoke` makes a real tarball in ignored `.pack-smoke`, allowlists members, validates safe archive paths and imports the packed Host/routing entry points. The install tarball excludes tests, demo adapters, dependencies, local logs and official DSH source. Production React is supplied by DSH. Stable package IDs and the declared DSH range `>=0.2.1-rc.2 <0.3.0` are regression checked; the range itself is not proof of every Host build.

## Optional official Settings integration / 可选官方配置服务测试

Supply a legitimate readable/extracted official DSH root containing its dependencies:

```powershell
$env:DSH_TEST_ROOT = 'C:\path\to\readable\dsh'
npm run test:host
Remove-Item Env:DSH_TEST_ROOT
```

The test boots only a newly created temporary home/profile, loads actual repository schemas/guard and real official Settings/ConfigEditor, saves/reboots that isolated Host, and checks revision/overlay refusal. It never boots or restarts a user’s normal profile; its LLM/subagent stubs prevent inference. Cleanup validates the exact temporary directory before deletion.

The 0.3.1 fix was separately run with an extracted official **0.2.1-rc.2** runtime: **13/13 tests passed, 0 skipped**. Eight cover Settings/ConfigEditor defaults, invalid ON refusal before persistence, exact routes/effort/language, stale revisions, independent locales, fresh-boot persistence and overlay refusal. Five cover actual **Cordis 4.0.5** Fiber ownership: unrelated sibling/nested/same-name configurations, exact waterfall result/one next call, own invalid ON rejection, own valid ON/OFF and a second routing instance. The tested Cordis implementation was SHA256-identical to the inspected rc.3 copy. The integrations are isolated; they do not certify installed rc.3 GUI/transport or provider connectivity. / 0.3.1 另行运行隔离官方集成，13 项全部通过，含真实 Cordis 跨插件所有权回归；不是现用 rc.3 GUI／API 提供商全链路验收。

## Real-component synthetic browser suite / 真实组件的合成浏览器验证

After installing dev dependencies, open the local demo or an already authorized static preview:

- `demo/index.html?view=settings&lang=en`
- `demo/index.html?view=settings&lang=zh-CN&state=on`
- States: `unconfigured`, `readonly`, `unavailable`, `no-catalog`
- `demo/states.html?lang=en` / `?lang=zh-CN` renders independent switch-state frames.

The demo uses the **actual production React components**, with public synthetic Settings/schema/LLM-directory/credential adapters. The credential fixture discards values and records only references. Discovery returns fixed public data; no endpoint is contacted. Do not replace/restart the existing DSH server for the demo.

Paste and invoke the async expression in [browser-settings-spec.js](../test/browser-settings-spec.js) on the English settings demo in a fresh tab. **Recorded Chromium result: 55/55 assertions passed**, including create custom provider → separate write-only key save → refreshed role options → exact model selection → separate role save, along with conflicts, failed disabling, locale draft retention, reconnect and readonly controls. This was synthetic authority, **not real DSH transport/navigation, a credential persistence proof or an inference run**.

合成浏览器记录 **55 项全部通过**，新增流程是真实生产表单调用可控的官方接口形状，并非在现用 profile 添加提供商。不可把它说成真实 API 连通、收费调用或已安装宿主全链路通过。

## Screenshots / 截图

The six current README/configuration images named `planner-overview-*`, `planner-model-setup-*` and `planner-routing-*` show actual production components with **public synthetic data**. They were visually checked in English/Chinese and are labeled in the docs. Obsolete 0.1/0.2 screenshots have been removed from the source tree and package; the pack smoke check accepts only these six current images.

![Current custom model setup, public synthetic data](images/planner-model-setup-en.png)

中文／英文六张现用图片均来自真实组件、合成公开数据；过时截图已从源码和安装包移除，不冒充本版效果。

## Remaining real gates / 尚需真实验收

- Installed-DSH plugin discovery, effective engine compatibility, slot lifecycle, projection registration and real RPC receipts.
- Actual custom API setup/credential persistence, namespace or schema absence, permission revocation, native auth and endpoint discovery with separately approved test credentials.
- Real fresh/fork/continuable tool calls, explicit selection precedence, target authorization refusal and same-model worker exclusion.
- Actual two-window synchronization and profile overlays over real transport; native Open/Stop permissions and completion evidence.
- Paid inference, multimodal support, billing, latency and total-token savings remain **unmeasured** and require separate authorization.

This implementation does not install, commit, push, rewrite live configuration, restart a live Host or perform paid calls. / 本次实现不部署、不提交推送、不改现用配置、不重启宿主、不发起收费调用。
