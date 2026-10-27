import {readFileSync} from 'node:fs'
import vm from 'node:vm'
export const flush = () => new Promise(resolve => setImmediate(resolve))
export const routeConfig = {parentRoutes:[{provider:'planner',model:'plan-model'}],targetRoute:{provider:'executor',model:'work-model'}}
export const describe = (enabled=false,revision=0,extra={}) => ({ok:true,value:{writable:true,namespaces:[{ns:'planner-executor-routing',revision,value:{enabled,...routeConfig,...extra}}]}})
export const receipt = (enabled,revision) => ({ok:true,value:describe(enabled,revision).value.namespaces[0]})
/** Deterministic React hook surface; not a browser or React conformance test. */
export function bundle({effects=true,locale="en"}={}) {
  let definition,index=0,pending=[]
  const values=[],dependencies=[]
  const cleanups=[]
  let rerenders=0
  const React={
    createElement(type,props,...children){return {type,props:props??{},children}},
    Component:class {constructor(props){this.props=props;this.state={}}},
    useState(initial){const slot=index++;if(!(slot in values))values[slot]=typeof initial==='function'?initial():initial;return [values[slot],next=>{values[slot]=typeof next==='function'?next(values[slot]):next;rerenders++}]},
    useRef(initial){const slot=index++;return values[slot]??= {current:initial}},
    useMemo(fn,deps){const slot=index++;if(!dependencies[slot]||deps.some((v,i)=>!Object.is(v,dependencies[slot][i]))){values[slot]=fn();dependencies[slot]=deps}return values[slot]},
    useEffect(fn,deps){const slot=index++;if(!effects)return;if(!dependencies[slot]||!deps||deps.some((v,i)=>!Object.is(v,dependencies[slot][i]))){dependencies[slot]=deps;pending.push(()=>{cleanups[slot]?.();cleanups[slot]=fn()})}},
  }
  vm.runInNewContext(readFileSync(new URL('../client.js',import.meta.url),'utf8'),{window:{__ModuleLoader__:{load(v){definition=v}}},console,URL,AbortController,setTimeout,clearTimeout,setInterval,clearInterval})
  const plugin=definition.factory(id=>{if(id==='react')return React;throw Error(id)})
  if(locale!==null){plugin.__test.adoptPanelLocale({ok:true,value:{namespaces:[{ns:'subagent-activity',revision:0,value:{locale:'auto'}}]}});plugin.__test.setLocale(locale)}
  return {plugin,api:plugin.__test,render(fn){index=0;const out=fn();const work=pending;pending=[];work.forEach(fn=>fn());return out},dispose(){cleanups.forEach(fn=>fn?.())},get rerenders(){return rerenders}}
}
export function ctxFixture() {
  const effects=[];const events=new Map();const calls=[]
  const ctx={calls,effects,events,subagents:{async startActivation(spec){calls.push(spec);return {childId:'synthetic-child'}}},
    get(name){return name==='llm'?ctx.llm:undefined},llm:{async resolveCallConfig(){}},
    on(name,fn){const list=events.get(name)??[];list.push(fn);events.set(name,list);return ()=>events.set(name,(events.get(name)??[]).filter(v=>v!==fn))},
    effect(fn){const cleanup=fn();effects.push(cleanup);return cleanup},
  }
  ctx.emit=(name,...args)=>{for(const fn of [...events.get(name)??[]])fn(...args)}
  return ctx
}
export function strings(tree) {
  if(tree==null)return []
  if(typeof tree==='string')return [tree]
  if(Array.isArray(tree))return tree.flatMap(strings)
  return [...Object.entries(tree.props??{}).filter(([key])=>['title','aria-label'].includes(key)).map(([,v])=>v),...strings(tree.children)]
}
