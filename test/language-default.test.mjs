import assert from 'node:assert/strict'
import {test} from 'node:test'
import {bundle} from './fixture.mjs'
import {Config as PanelConfig} from '../index.mjs'
import * as routing from '../routing.mjs'

const ctx = () => ({slots:{inject(_name,fn){fn()},register(){}},remote:{}})
test('fresh Host namespaces default to Simplified Chinese without changing explicit preferences',()=>{
  assert.equal(PanelConfig({}).locale.get(),'zh-CN')
  assert.equal(routing.Config({}).locale.get(),'zh-CN')
  for(const locale of ['en','auto','zh-CN']){
    assert.equal(PanelConfig({locale}).locale.get(),locale)
    assert.equal(routing.Config({locale}).locale.get(),locale)
  }
})
test('unconfigured production browser defaults to Chinese, even with an English DSH locale',()=>{
  const {api}=bundle({locale:null})
  assert.equal(api.t('panelTitle'),'代理活动')
  api.setLocale('en-US');assert.equal(api.t('panelTitle'),'代理活动')
  assert.equal(api.t('settings.title'),'代理活动设置')
})
test('client English override remains English across Chinese host locale changes',()=>{
  const b=bundle({locale:null});b.plugin.apply(ctx(),{locale:'en'})
  assert.equal(b.api.t('panelTitle'),'Activity')
  b.api.setLocale('zh-CN');assert.equal(b.api.t('panelTitle'),'Activity')
})
test('explicit auto follows supported DSH locales and falls back to Chinese',()=>{
  const b=bundle({locale:null});b.plugin.apply(ctx(),{locale:'auto'})
  assert.equal(b.api.t('panelTitle'),'代理活动')
  b.api.setLocale('en-GB');assert.equal(b.api.t('panelTitle'),'Activity')
  b.api.setLocale('zh-TW');assert.equal(b.api.t('panelTitle'),'代理活动')
  b.api.setLocale('fr-FR');assert.equal(b.api.t('panelTitle'),'代理活动')
  b.api.setLocale(undefined);assert.equal(b.api.t('panelTitle'),'代理活动')
})
test('unsupported DSH locale cannot substitute the locale service English fallback for Chinese',()=>{
  const b=bundle({locale:null});b.plugin.apply(ctx(),{locale:'auto'});let active='fr-FR',listener,dispose
  b.api.connectLocale({inject(_names,fn){dispose=fn({locale:{register(){return()=>{}},getSnapshot(){return{active}},subscribe(fn){listener=fn;return()=>{}},bind(){return()=> 'Activity'}}})}})
  assert.equal(b.api.t('panelTitle'),'代理活动')
  active='en';listener();assert.equal(b.api.t('panelTitle'),'Activity')
  dispose();assert.equal(b.api.t('panelTitle'),'代理活动')
})
test('explicit saved Host language remains authoritative after Chinese bootstrap',()=>{
  const {api}=bundle({locale:null})
  api.adoptPanelLocale({ok:true,value:{namespaces:[{ns:'subagent-activity',revision:3,value:{locale:'en'}}]}})
  assert.equal(api.t('panelTitle'),'Activity')
  api.adoptPanelLocale({ok:true,value:{namespaces:[{ns:'subagent-activity',revision:2,value:{locale:'zh-CN'}}]}})
  assert.equal(api.t('panelTitle'),'Activity')
})
test('routing diagnostics default/fallback to Chinese but retain explicit English',()=>{
  for(const locale of [undefined,'auto','fr','zh-CN'])assert.throws(()=>routing.validateConfig({enabled:true,locale}),error=>error.code==='dsh-agent-activity/unconfigured' && /开启前请配置/.test(error.message))
  assert.throws(()=>routing.validateConfig({enabled:true,locale:'en'}),/configure valid/)
})
