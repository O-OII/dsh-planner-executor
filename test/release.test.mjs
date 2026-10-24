import assert from 'node:assert/strict'
import {test} from 'node:test'
import {bundle,flush,describe,receipt,routeConfig,ctxFixture,strings} from './fixture.mjs'
import * as routing from '../routing.mjs'

test('dictionaries balance keys and named placeholders with complete English fallback',()=>{
  const {api}=bundle()
  assert.deepEqual(Object.keys(api.DICTIONARIES.en),Object.keys(api.DICTIONARIES.zh))
  for(const [key,en] of Object.entries(api.DICTIONARIES.en)) {
    assert.ok(en.length>0); assert.doesNotMatch(en,/\p{Script=Han}/u)
    assert.deepEqual(en.match(/\{\w+\}/g),api.DICTIONARIES.zh[key].match(/\{\w+\}/g))
  }
  assert.equal(api.t('运行中'),'Running')
  api.setLocale('zh-CN');assert.equal(api.t('运行中'),'运行中')
  api.setLocale('fr');assert.equal(api.t('运行中'),'Running')
})
test('official locale register/getSnapshot/subscribe lifecycle refreshes mounted root',()=>{
  const b=bundle();let active='en',subscriber,registered,disposeChild
  const service={register(ns,dicts){registered={ns,dicts};return ()=>{}},getSnapshot:()=>({active,revision:0}),subscribe(fn){subscriber=fn;return ()=>{subscriber=null}},bind:()=>key=>key}
  b.api.connectLocale({inject(names,fn){assert.deepEqual([...names],['locale']);disposeChild=fn({locale:service})}})
  b.render(()=>b.api.ActivityRoot({}));const before=b.rerenders
  active='zh';subscriber();assert.ok(b.rerenders>before);assert.equal(b.api.t('代理活动'),'代理活动')
  assert.equal(registered.ns,'o-oii.agent-activity');assert.ok(registered.dicts.en)
  disposeChild();assert.equal(b.api.t('代理活动'),'Agent activity');b.dispose()
})
test('explicit client locale override wins without writing DSH locale settings',()=>{
  const b=bundle();b.plugin.apply({slots:{inject(_n,fn){fn()},register(){}},remote:{}},{locale:'zh-CN'})
  b.api.setLocale('en');assert.equal(b.api.t('代理活动'),'代理活动')
})
test('visible panel copy/title/aria are English by default and Chinese live; identities stay literal',()=>{
  const b=bundle({effects:false})
  const state={ids:['root'],byId:{root:{retainedBy:{mainView:1},title:'用户任务 / Task identity'}},projectionsBySession:{root:{state:'ready',values:{subagentCatalog:[],modelSelection:{lastUsed:{provider:'literal-provider',model:'literal-model'}}}}}}
  const props={actions:{},useSessions:fn=>fn(state),useSessionStatus:fn=>fn(new Map())}
  let all=strings(b.render(()=>b.api.ActivityPanel(props)))
  assert.ok(all.includes('Agent activity panel'));assert.ok(all.includes('Previous turn'));assert.ok(all.includes('literal-model'));assert.ok(all.includes('用户任务 / Task identity'))
  b.api.setLocale('zh-CN');all=strings(b.render(()=>b.api.ActivityPanel(props)))
  assert.ok(all.includes('上一轮'));assert.ok(all.includes('literal-model'));assert.ok(all.includes('用户任务 / Task identity'));b.dispose()
})
test('stored local failure notices retranslate after a locale change',()=>{
  const {api}=bundle();const notice=api.notice('保存失败：{detail}',{detail:api.notice('设置保存被拒绝')})
  assert.equal(api.errorMessage(notice),'Save failed: Settings save was refused')
  api.setLocale('zh');assert.equal(api.errorMessage(notice),'保存失败：设置保存被拒绝')
})
test('locally authored unavailable/projection errors retranslate by stable code',()=>{
  const {api}=bundle();const error={code:'dsh-agent-activity/settings-unavailable',message:'旧文案'}
  assert.equal(api.errorMessage(error),'remote.settings is unavailable');api.setLocale('zh');assert.equal(api.errorMessage(error),'remote.settings 不可用')
  assert.equal(api.errorMessage({code:'dsh-agent-activity/projections-result'}),'未知投影结果格式')
})
test('unconfigured routing is not a fabricated OFF and cannot be toggled',()=>{
  const {api}=bundle();const parsed=api.strategyFromDescribe(describe(false,0,{targetRoute:null}))
  assert.equal(parsed.configured,false)
  const view={...parsed,status:'ready',saving:false}
  const node=api.StrategySwitch({view,onToggle(){}})
  assert.equal(node.props.disabled,true);assert.equal(node.props['data-planner-routing-switch'],'unconfigured');assert.equal(node.children[0],'DS: not set')
})
test('malformed and whitespace target identities cannot become configured',()=>{
  const {api}=bundle()
  for(const targetRoute of [null,{}, {provider:'',model:'x'},{provider:'bad provider',model:'x'},{provider:'x',model:''}])assert.equal(api.routingConfigured({...routeConfig,targetRoute}),false)
})
test('switch serializes same-tick clicks and failed disable preserves confirmed ON',async()=>{
  const b=bundle();let finish;const writes=[]
  const actions={readStrategy:async()=>describe(true,4),writeStrategy:(v,r)=>{writes.push([v,r]);return new Promise(resolve=>finish=resolve)},onStrategyChanged(){},onStrategyReset(){}}
  const render=()=>b.render(()=>b.api.useStrategySwitch(actions))
  render();await flush();let out=render();assert.equal(out.view.enabled,true)
  out.toggle();out.toggle();await flush();assert.deepEqual(writes,[[false,4]])
  finish({ok:false,error:{code:'settings/refused',message:'synthetic denial'}});await flush();out=render()
  assert.equal(out.view.enabled,true);assert.equal(out.view.saving,false);assert.ok(out.view.error);b.dispose()
})
test('conflict triggers an authoritative re-read, not an automatic stale-intent retry',async()=>{
  const b=bundle();let revision=2,enabled=false,reads=0,writes=0
  const actions={readStrategy:async()=>{reads++;return describe(enabled,revision)},writeStrategy:async()=>{writes++;revision=4;enabled=true;return {ok:false,error:{code:'settings/conflict'}}},onStrategyChanged(){},onStrategyReset(){}}
  const render=()=>b.render(()=>b.api.useStrategySwitch(actions));render();await flush();render().toggle();await flush()
  const out=render();assert.equal(out.view.revision,4);assert.equal(out.view.enabled,true);assert.equal(writes,1);assert.equal(reads,2);b.dispose()
})
test('newer multi-window revision wins over an old write receipt',async()=>{
  const b=bundle();let onEvent,finish,version=1,enabled=false
  const actions={readStrategy:async()=>describe(enabled,version),writeStrategy:()=>new Promise(resolve=>finish=resolve),onStrategyChanged(fn){onEvent=fn},onStrategyReset(){}}
  const render=()=>b.render(()=>b.api.useStrategySwitch(actions));render();await flush();render().toggle();await flush()
  version=3;enabled=true;onEvent('planner-executor-routing',3);await flush();assert.equal(render().view.revision,3)
  finish(receipt(false,2));await flush();const out=render();assert.equal(out.view.enabled,true);assert.equal(out.view.revision,3);assert.equal(out.view.saving,false);b.dispose()
})
test('reconnect invalidates old in-flight writes and accepts reset revision zero',async()=>{
  const b=bundle();let reset,finish,version=9,enabled=true
  const actions={readStrategy:async()=>describe(enabled,version),writeStrategy:()=>new Promise(resolve=>finish=resolve),onStrategyChanged(){},onStrategyReset(fn){reset=fn}}
  const render=()=>b.render(()=>b.api.useStrategySwitch(actions));render();await flush();render().toggle();await flush()
  version=0;enabled=false;reset();await flush();finish(receipt(true,10));await flush()
  const out=render();assert.equal(out.view.enabled,false);assert.equal(out.view.revision,0);assert.equal(out.view.saving,false);b.dispose()
})
test('optional settings and stop service children do not block panel registration',async()=>{
  const b=bundle();const children=new Map();let registration,disposeSettings
  b.plugin.apply({inject(names,fn){children.set(names[0],fn)},remote:{$on(){}},slots:{inject(_n,fn){fn()},register(opts){registration=opts}},uiWorkspace:{openSession(){}}})
  assert.ok(registration);const {actions}=registration.inject();assert.equal((await actions.readStrategy()).ok,false)
  let resets=0;actions.onStrategyReset(()=>resets++)
  disposeSettings=children.get('remote.settings')({remote:{settings:{describe:async()=>describe()}}})
  assert.equal((await actions.readStrategy()).ok,true);assert.equal(resets,1)
  disposeSettings();assert.equal((await actions.readStrategy()).ok,false);assert.equal(resets,2)
})
test('route schema permits fresh OFF without target, but guard rejects ON before persistence',()=>{
  const parsed=routing.Config({});assert.equal(parsed.enabled.get(),false);assert.ok(parsed.targetRoute.get() == null)
  assert.throws(()=>routing.validateConfig({...parsed,enabled:true}),/configure valid/)
  assert.throws(()=>routing.Config({targetRoute:{provider:'bad provider',model:'x'}}))
  const ctx=ctxFixture();routing.apply(ctx,parsed)
  assert.throws(()=>ctx.events.get('internal/config')[0]({enabled:true},()=>{}),/configure valid/)
  ctx.effects.forEach(fn=>fn())
})
test('schema metadata is bilingual for routing fields and exact identities are not translated',()=>{
  for(const key of ['enabled','parentRoutes','targetRoute','locale']) {
    const desc=routing.Config.dict[key].meta.description;assert.ok(desc.en);assert.ok(desc.zh)
  }
  assert.deepEqual(routing.Config(routeConfig).targetRoute.get(),routeConfig.targetRoute)
})
test('ON routes arbitrary exact parent and execution providers, dropping inherited route-owned effort',async()=>{
  const ctx=ctxFixture();const config={...routeConfig,enabled:true};const dispose=routing.apply(ctx,config)
  const image={type:'image',data:'synthetic'};const spec={request:{parent:{options:routeConfig.parentRoutes[0]},prompt:[{type:'text',text:'task'},image],agentOptions:{provider:'other',model:'ignored',reasoningEffort:'unsupported',maxTokens:42}}}
  await ctx.subagents.startActivation(spec)
  assert.equal(ctx.calls[0].request.agentOptions.provider,'executor');assert.equal(ctx.calls[0].request.agentOptions.reasoningEffort,undefined);assert.equal(ctx.calls[0].request.agentOptions.maxTokens,42);assert.equal(ctx.calls[0].request.prompt[2],image);dispose()
})
test('OFF is identity passthrough with missing llm, multimodal parts, and no policy',async()=>{
  const ctx=ctxFixture();ctx.llm=undefined;const dispose=routing.apply(ctx,{enabled:false})
  const spec={request:{prompt:[{type:'image',data:'synthetic'}]}};await ctx.subagents.startActivation(spec);assert.equal(ctx.calls[0],spec)
  const assembly={variables:routeConfig.parentRoutes[0],sections:[]};assert.equal(await ctx.events.get('system-prompt/assemble')[0](assembly,{},async()=>assembly),assembly);dispose()
})
test('missing activation seam fails the optional route mount, never pretends to route',()=>{
  assert.throws(()=>routing.apply({...ctxFixture(),subagents:{}},{enabled:false}),/startActivation is unavailable/)
})
test('missing llm on an enabled matched delegation fails loudly without native fallback',async()=>{
  const ctx=ctxFixture();ctx.llm=undefined;const dispose=routing.apply(ctx,{...routeConfig,enabled:true})
  await assert.rejects(ctx.subagents.startActivation({request:{parent:{options:routeConfig.parentRoutes[0]}}}),/llm service is unavailable/);assert.equal(ctx.calls.length,0);dispose()
})
test('OFF→ON while preflight awaits invalidates the original decision, even if final state is ON',async()=>{
  const ctx=ctxFixture();let finish;ctx.llm.resolveCallConfig=()=>new Promise(resolve=>finish=resolve)
  const config={...routeConfig,enabled:true};const dispose=routing.apply(ctx,config);const spec={request:{parent:{options:routeConfig.parentRoutes[0]},prompt:'task'}}
  const pending=ctx.subagents.startActivation(spec);config.enabled=false;ctx.emit('loader/volatile-update');config.enabled=true;ctx.emit('loader/volatile-update');finish();await pending
  assert.equal(ctx.calls[0],spec);dispose()
})
test('route edits during preflight do not apply an unverified new target or the old target',async()=>{
  const ctx=ctxFixture();let finish;ctx.llm.resolveCallConfig=()=>new Promise(resolve=>finish=resolve)
  const config={...routeConfig,enabled:true};const dispose=routing.apply(ctx,config);const spec={request:{parent:{options:routeConfig.parentRoutes[0]},prompt:'task'}}
  const pending=ctx.subagents.startActivation(spec);config.targetRoute={provider:'new',model:'new'};finish();await pending;assert.equal(ctx.calls[0],spec);dispose()
})
test('Host panel locale override has independent revision fencing and can return to auto',()=>{
  const {api}=bundle();api.setLocale('zh')
  const snapshot=(locale,revision)=>({ok:true,value:{namespaces:[{ns:'subagent-activity',revision,value:{locale}}]}})
  api.adoptPanelLocale(snapshot('en',5));assert.equal(api.t('代理活动'),'Agent activity')
  api.adoptPanelLocale(snapshot('zh-CN',4));assert.equal(api.t('代理活动'),'Agent activity')
  api.adoptPanelLocale(snapshot('auto',6));assert.equal(api.t('代理活动'),'代理活动')
})
test('malformed enabled value or revision is never displayed as a confirmed OFF',()=>{
  const {api}=bundle()
  for(const value of [undefined,'false',0,null])assert.ok(api.strategyFromDescribe(describe(false,2,{enabled:value})).error)
  for(const revision of [-1,0.5,NaN,Infinity])assert.ok(api.strategyFromDescribe(describe(false,revision)).error)
  assert.ok(api.strategyFromUpdate({ok:true,value:{ns:'planner-executor-routing',revision:1,value:{}}}).error)
})
test('route guard errors support explicit Simplified Chinese and English fallback',()=>{
  assert.throws(()=>routing.validateConfig({enabled:true,locale:'zh-CN'}),/开启前请配置/)
  assert.throws(()=>routing.validateConfig({enabled:true,locale:'auto'}),/configure valid/)
})
test('changing only routing error locale during preflight does not invalidate execution routing',async()=>{
  const ctx=ctxFixture();let finish;ctx.llm.resolveCallConfig=()=>new Promise(resolve=>finish=resolve)
  const config={...routeConfig,enabled:true};const dispose=routing.apply(ctx,config);const spec={request:{parent:{options:routeConfig.parentRoutes[0]},prompt:'task'}}
  const pending=ctx.subagents.startActivation(spec);config.locale='zh-CN';ctx.emit('loader/volatile-update',[['locale']]);finish();await pending;assert.notEqual(ctx.calls[0],spec);dispose()
})
test('a retained wrapper becomes pure passthrough after its owner is disposed',async()=>{
  const ctx=ctxFixture();const dispose=routing.apply(ctx,{...routeConfig,enabled:true});const retained=ctx.subagents.startActivation
  dispose();const spec={request:{parent:{options:routeConfig.parentRoutes[0]},prompt:'task'}};await retained.call(ctx.subagents,spec);assert.equal(ctx.calls[0],spec)
})
test('disposing routing during preflight prevents a late routed activation',async()=>{
  const ctx=ctxFixture();let finish;ctx.llm.resolveCallConfig=()=>new Promise(resolve=>finish=resolve)
  const dispose=routing.apply(ctx,{...routeConfig,enabled:true});const spec={request:{parent:{options:routeConfig.parentRoutes[0]},prompt:'task'}}
  const pending=ctx.subagents.startActivation(spec);dispose();finish();await pending;assert.equal(ctx.calls[0],spec)
})
test('exact parent matching includes provider and never matches a same-name model elsewhere',()=>{
  assert.equal(routing.isPlanner({provider:'different',model:'plan-model'},routeConfig),false)
  assert.equal(routing.isPlanner({provider:'planner',model:'plan-model'},routeConfig),true)
})
test('existing children/follow-up surfaces are untouched when switch changes',()=>{
  const ctx=ctxFixture();const send=()=>{};ctx.subagents.sendMessage=send;const config={...routeConfig,enabled:false};const dispose=routing.apply(ctx,config)
  config.enabled=true;ctx.emit('loader/volatile-update');assert.equal(ctx.subagents.sendMessage,send);dispose()
})
