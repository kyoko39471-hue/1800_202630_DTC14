const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

function session(profile, error) {
 let authCallback;
 const loads=[],redirects=[],messages=[];
 const retry={hidden:true,addEventListener:()=>{}};
 const context=vm.createContext({document:{getElementById:()=>retry},location:{replace:url=>redirects.push(url)},onAuthReady:callback=>{authCallback=callback},getUserProfile:async()=>{if(error)throw error;return profile},setStatus:(...args)=>messages.push(args)});
 const source=fs.readFileSync(path.join(__dirname,'../src/session.js'),'utf8').replace(/^import .*;\r?\n/gm,'').replace(/\bexport /g,'');
 vm.runInContext(source+'\nglobalThis.start=startSignedIn;',context);
 context.start(async(user,data)=>loads.push({user,data}));
 return {loads,redirects,messages,retry,run:async user=>{authCallback(user);await new Promise(resolve=>setImmediate(resolve))}};
}
test('reading a missing profile displays English without racing signup with another database write',async()=>{
 const harness=session(null);await harness.run({uid:'new-account',displayName:'Sample'});
 assert.equal(harness.loads[0].data.preferredLanguage,'en');
 assert.equal(harness.loads[0].data.name,'Sample');
});
test('signed-out visitors are redirected before loading account data',async()=>{
 const harness=session(null);await harness.run(null);assert.deepEqual(harness.redirects,['login.html']);assert.equal(harness.loads.length,0);
});
test('a denied profile read shows an error and Retry rather than fabricated account data',async()=>{
 const harness=session(null,{code:'permission-denied'});await harness.run({uid:'account'});assert.equal(harness.loads.length,0);assert.equal(harness.retry.hidden,false);assert.equal(harness.messages.at(-1)[1],true);
});
