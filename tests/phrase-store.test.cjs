const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

function store({translation='Bonjour', missing=false}={}) {
 const writes=[];
 const context=vm.createContext({db:{},doc:(_db,...parts)=>parts.join('/'),collection:(_db,...parts)=>parts.join('/'),serverTimestamp:()=> 'SERVER_TIME',setDoc:async(...args)=>writes.push(['save',...args]),deleteDoc:async(...args)=>writes.push(['remove',...args]),getDoc:async()=>({exists:()=>!missing,data:()=>({text:translation})}),getDocs:async reference=>({docs:reference.startsWith('users/')?[{id:'greetings_phrase_001',data:()=>({categoryId:'greetings',phraseId:'phrase_001'})}]:[{id:'phrase_001',data:()=>({english:'Hello'})}]})});
 const source=fs.readFileSync(path.join(__dirname,'../src/phraseStore.js'),'utf8').replace(/^import .*;\r?\n/gm,'').replace(/\bexport /g,'');
 vm.runInContext(source+'\nglobalThis.api={savedKey,setPhraseSaved,readCategory,readSaved};',context);
 return {...context.api,writes};
}
test('identical phrase IDs from different categories stay distinct',()=>{
 const api=store();assert.notEqual(api.savedKey('greetings','phrase_001'),api.savedKey('emergency','phrase_001'));
});
test('saving uses the signed-in UID and preserves the shared category record',async()=>{
 const api=store();await api.setPhraseSaved({uid:'account-a'},{categoryId:'greetings',phraseId:'phrase_001'},true);
 assert.equal(api.writes[0][1],'users/account-a/savedPhrases/greetings_phrase_001');
 assert.equal(api.writes[0][2].createdAt,'SERVER_TIME');
});
test('removal only targets this user’s bookmark',async()=>{
 const api=store();await api.setPhraseSaved({uid:'account-b'},{categoryId:'greetings',phraseId:'phrase_001'},false);
 assert.deepEqual(api.writes[0],['remove','users/account-b/savedPhrases/greetings_phrase_001']);
});
test('unauthenticated saves and invalid phrase references never write',async()=>{
 const api=store();await assert.rejects(api.setPhraseSaved(null,{categoryId:'greetings',phraseId:'phrase_001'},true));
 assert.throws(()=>api.savedKey('bad','phrase_001'));assert.throws(()=>api.savedKey('greetings','../account'));
 assert.equal(api.writes.length,0);
});
test('English default uses the original phrase directly',async()=>{
 const result=await store().readCategory('greetings','en');assert.equal(result[0].translation,'Hello');assert.equal(result[0].available,true);
});
test('the chosen language displays its stored translation',async()=>{
 const result=await store().readCategory('greetings','fr');assert.equal(result[0].translation,'Bonjour');
});
test('missing translations are explicit and cannot be shown as a translated phrase',async()=>{
 const result=await store({missing:true}).readCategory('greetings','ur');assert.equal(result[0].available,false);assert.match(result[0].translation,/unavailable/);
});
