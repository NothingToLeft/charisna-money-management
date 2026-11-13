import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {test} from 'node:test';
import vm from 'node:vm';

test('source sends per-profile monthly summaries only after cloud save',async()=>{
  const elements=[];const requests=[];
  const createElement=tag=>{const el={tag,children:[],append(...items){this.children.push(...items);},after(){},addEventListener(type,handler){this[type]=handler;},setAttribute(){}};elements.push(el);return el;};
  const document={createElement,getElementById(id){return id==='cloudStatusCard'?{closest:()=>({after(){}})}:elements.find(el=>el.id===id)||null;}};
  const state={settings:{},rates:{IDR:16000,USD:1},profiles:[{id:'me',name:'Saya',baseCurrency:'IDR'},{id:'shop',name:'Toko',baseCurrency:'USD'}],accounts:[{id:'cash',profileId:'me',currency:'IDR',openingBalance:100},{id:'bank',profileId:'shop',currency:'USD',openingBalance:10}],transactions:[]};
  const parts=new Intl.DateTimeFormat('en',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit'}).formatToParts(new Date());
  const key=`${parts.find(p=>p.type==='year').value}-${parts.find(p=>p.type==='month').value}`;
  state.transactions=[
    {profileId:'me',accountId:'cash',date:`${key}-01`,type:'income',amount:50},
    {profileId:'me',accountId:'cash',date:`${key}-02`,type:'expense',amount:20},
    {profileId:'me',accountId:'cash',date:`${key}-03`,type:'transfer',amount:100},
    {profileId:'shop',accountId:'bank',date:`${key}-01`,type:'income',amount:5},
    {profileId:'shop',accountId:'bank',date:`${key}-02`,type:'expense',amount:2,status:'cancelled'}
  ];
  const context={document,state,vault:{},cloudSession:{user:{id:'owner'}},navigator:{onLine:true},
    cloudPush:async()=>true,encryptState:async()=>{},accountBalance:a=>a.openingBalance,
    convertCurrency:(value,from,to)=>from===to?value:from==='USD'&&to==='IDR'?value*16000:null,
    fetch:async(_url,options)=>{requests.push(JSON.parse(options.body));return{ok:true,json:async()=>({syncKey:'K'.repeat(43)})};},
    Intl,Date,Number,String,Array,Error,AbortSignal};
  vm.runInNewContext(await readFile(new URL('../www/superapp-sync.js',import.meta.url),'utf8'),context);
  const button=elements.find(el=>el.textContent==='Hubungkan dan kirim ringkasan');
  elements.find(el=>el.id==='superAppCode').value='A'.repeat(24);
  await button.click();
  assert.equal(requests.length,1);
  assert.equal(requests[0].pairCode,'A'.repeat(24));
  assert.equal(requests[0].snapshot.month,key);
  assert.deepEqual(JSON.parse(JSON.stringify(requests[0].snapshot.profiles)),[
    {id:'me',name:'Saya',currency:'IDR',scale:0,quality:'complete',balance_minor:'100',income_minor:'50',expense_minor:'20'},
    {id:'shop',name:'Toko',currency:'USD',scale:2,quality:'complete',balance_minor:'1000',income_minor:'500',expense_minor:'0'}
  ]);
  assert.equal(state.settings.superAppSyncKey,'K'.repeat(43));
  assert.equal('accessToken' in requests[0],false);

  let finishFirst;
  context.fetch = async (_url, options) => {
    requests.push(JSON.parse(options.body));
    if (requests.length === 2) await new Promise(resolve => { finishFirst = resolve; });
    return {ok:true,json:async()=>({})};
  };
  await context.cloudPush();
  state.transactions[0].amount = 80;
  await context.cloudPush();
  assert.equal(requests.length, 2);
  finishFirst();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(requests.length, 3);
  assert.equal(requests[2].snapshot.profiles[0].income_minor, '80');
});
