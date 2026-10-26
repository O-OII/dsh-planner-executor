import assert from 'node:assert/strict'
import {execFileSync} from 'node:child_process'
import {mkdirSync,readFileSync,writeFileSync,existsSync} from 'node:fs'
import {resolve,join} from 'node:path'
import {fileURLToPath,pathToFileURL} from 'node:url'
import {gunzipSync} from 'node:zlib'
const root = fileURLToPath(new URL('../',import.meta.url))
const out = join(root,'.pack-smoke')
mkdirSync(out,{recursive:true})
const npm = process.env.npm_execpath
assert.ok(npm,'Run this smoke check via npm run pack:smoke')
const result=JSON.parse(execFileSync(process.execPath,[npm,'pack','--ignore-scripts','--json','--pack-destination',out],{cwd:root,encoding:'utf8'}))
assert.equal(result.length,1)
const files=result[0].files.map(item=>item.path).sort()
for(const name of files) {
  assert.ok(/^(index\.mjs|client\.js|routing\.mjs|cordis\.patch\.yml|package\.json|README(?:\.zh-CN)?\.md|LICENSE|CHANGELOG\.md|CONTRIBUTING\.md|SECURITY\.md|locale\/(?:en|zh)\.json|docs\/(?:[a-zA-Z0-9_.-]+\.md|images\/[a-zA-Z0-9_.-]+\.png))$/.test(name),`Unexpected packaged file: ${name}`)
  assert.doesNotMatch(name,/verification|status|secret|backup|\.env/i)
}
for(const name of ['index.mjs','client.js','routing.mjs','cordis.patch.yml','LICENSE','docs/ds-execution.md','docs/ds-execution.zh-CN.md'])assert.ok(files.includes(name),`Missing ${name}`)
const archive=join(out,result[0].filename)
assert.equal(resolve(archive), join(out, result[0].filename))
const tar=gunzipSync(readFileSync(archive));let at=0,extracted=0
while(at+512<=tar.length) {
  const header=tar.subarray(at,at+512)
  const name=header.subarray(0,100).toString().replace(/\0.*$/s,'')
  if(!name)break
  const size=parseInt(header.subarray(124,136).toString().replace(/\0.*$/s,'').trim()||'0',8)
  const type=header[156]
  assert.ok(name.startsWith('package/')&&!name.includes('..')&&!name.includes('\\'),`Unsafe tar member: ${name}`)
  if(type===0||type===48) {
    const target=join(out,name);assert.ok(resolve(target).startsWith(resolve(out)))
    mkdirSync(resolve(target,'..'),{recursive:true});writeFileSync(target,tar.subarray(at+512,at+512+size));extracted++
  }
  at+=512+Math.ceil(size/512)*512
}
assert.ok(extracted>=files.length)
const packed=JSON.parse(readFileSync(join(out,'package','package.json'),'utf8'))
assert.equal(packed.name,'dsh-agent-activity');assert.equal(packed.version,'0.2.1');assert.ok(!packed.private)
const host=await import(pathToFileURL(join(out,'package','index.mjs')).href)
const routing=await import(pathToFileURL(join(out,'package','routing.mjs')).href)
assert.equal(typeof host.apply,'function');assert.equal(routing.Config({}).enabled.get(),false)
assert.ok(existsSync(join(out,'package','client.js')))
assert.equal(host.Config({}).locale.get(),'zh-CN');assert.equal(routing.Config({}).locale.get(),'zh-CN')
for(const locale of ['zh','en'])assert.ok(JSON.parse(readFileSync(join(out,'package','locale',locale+'.json'),'utf8')).meta.description)
console.log(`Pack smoke OK: ${files.length} allowlisted files, ${result[0].size} compressed bytes`)
console.log(files.join('\n'))
