"use strict";
/* ================================================================ CORE: data, helpers, auth, calculations */
const KEY = "duka_kiganjani_v1";
const LOGO = `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="1" y="1" width="62" height="62" rx="16" fill="#0E4D64"/><rect x="2.5" y="2.5" width="59" height="59" rx="14.5" fill="none" stroke="#F2A541" stroke-width="1.6"/><path d="M12 22h40l-3-8H15z" fill="#F2A541"/><path d="M12 22h8v3a4 4 0 0 1-8 0zM20 22h8v3a4 4 0 0 1-8 0zM28 22h8v3a4 4 0 0 1-8 0zM36 22h8v3a4 4 0 0 1-8 0zM44 22h8v3a4 4 0 0 1-8 0z" fill="#fff"/><path d="M20 22h8v3a4 4 0 0 1-8 0zM36 22h8v3a4 4 0 0 1-8 0z" fill="#F2A541" opacity=".55"/><rect x="15" y="29" width="34" height="22" rx="2" fill="#fff"/><rect x="19" y="34" width="11" height="17" rx="1.5" fill="#137A8C"/><rect x="34" y="34" width="11" height="9" rx="1.5" fill="#E3F1F3" stroke="#137A8C" stroke-width="1.4"/><path d="M36.5 38.5l2.3 2.3 4.2-4.6" fill="none" stroke="#1B6E3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function blank(){
  return {v:1,setup:{done:false,aina:"",jina:"",mmiliki:"",simu:"",mahali:"",tin:"",created:""},
    users:[],settings:{receiptFooter:"Asante kwa kununua!",expiryDays:90,cashThreshold:1000,debtDays:30,sellerDiscountPct:0,sellerExpenses:true,lockMinutes:10,sellerSeesStock:true},
    products:[],sales:[],purchases:[],expenses:[],customers:[],suppliers:[],payments:[],adjustments:[],closings:[],quotes:[],bottles:[],log:[],
    chupa:{tupu:0},seq:{sale:0,pur:0,quote:0},saved:null};
}
let D = blank(), storageOk = true;
function normalize(o){const b=blank(),x=Object.assign(b,o||{});for(const k of ["setup","settings","chupa","seq"])x[k]=Object.assign(blank()[k],(o||{})[k]||{});return x}
function load(){try{const s=localStorage.getItem(KEY);if(s)D=normalize(JSON.parse(s))}catch(e){storageOk=false}}
function save(){D.saved=new Date().toISOString();try{localStorage.setItem(KEY,JSON.stringify(D));storageOk=true}catch(e){storageOk=false;toast("Hifadhi imeshindikana! Pakua nakala sasa.")}}

/* ---------- helpers */
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const num=v=>{const n=parseFloat(String(v??"").replace(/,/g,""));return isFinite(n)?n:0};
const r2=n=>Math.round(n*100)/100;
const fm=n=>{n=num(n);const a=Math.abs(n);return (n<0?"-":"")+(Math.abs(a-Math.round(a))>0.004?a.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):Math.round(a).toLocaleString("en-US"))};
const fq=(q,p)=>{q=r2(num(q));return (Number.isInteger(q)?q:q.toFixed(2).replace(/0$/,""))+(p&&p.kipimo?" "+p.kipimo:"")};
const pad2=n=>String(n).padStart(2,"0");
function toISO(d){return d.getFullYear()+"-"+pad2(d.getMonth()+1)+"-"+pad2(d.getDate())}
function parseISO(s){const [y,m,d]=String(s).slice(0,10).split("-").map(Number);return new Date(y,m-1,d)}
function todayISO(){return toISO(new Date())}
function nowISO(){return new Date().toISOString()}
function dayOf(t){return toISO(new Date(t))}
function fd(iso){if(!iso)return "";const s=String(iso);if(s.length>10)return fd(dayOf(s));const [y,m,d]=s.split("-");return d+"/"+m+"/"+y}
function ft(t){const d=new Date(t);return fd(toISO(d))+" "+pad2(d.getHours())+":"+pad2(d.getMinutes())}
function addDays(iso,n){const d=parseISO(iso);d.setDate(d.getDate()+n);return toISO(d)}
function daysBetween(a,b){return Math.round((parseISO(b)-parseISO(a))/86400000)}
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("on");clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove("on"),2800)}
function slug(){return (D.setup.jina||"duka").replace(/[^A-Za-z0-9]+/g,"_")}
function opts(list,sel,first){return (first!=null?`<option value="">${first}</option>`:"")+list.map(x=>{const v=Array.isArray(x)?x[0]:x,t=Array.isArray(x)?x[1]:x;return `<option value="${esc(v)}" ${String(v)===String(sel)?"selected":""}>${esc(t)}</option>`}).join("")}
function formVals(root){const o={};root.querySelectorAll("[name]").forEach(el=>o[el.name]=el.type==="checkbox"?el.checked:el.value.trim());return o}
function dlg(title,body,foot){$("#dlgT").textContent=title;$("#dlgB").innerHTML=body;$("#dlgF").innerHTML=foot||`<button class="btn sec" data-a="closeDlg">Funga</button>`;const d=$("#dlg");if(!d.open)d.showModal()}
function closeDlg(){const d=$("#dlg");if(d.open)d.close();document.body.classList.remove("pm")}
function table(heads,rows,foot){
  if(!rows.length)return `<div class="tw"><div class="empty">Hakuna taarifa.</div></div>`;
  return `<div class="tw"><table><thead><tr>${heads.map(h=>`<th class="${h.n?"n":""}">${h.t||h}</th>`).join("")}</tr></thead><tbody>${rows.join("")}${foot||""}</tbody></table></div>`;
}
function kpi(l,v,cls){return `<div class="kpi ${cls||""}"><div class="l">${l}</div><div class="v">${v}</div></div>`}
function feat(f){const a=AINA[D.setup.aina];return !!(a&&a.features[f])}
function aina(){return AINA[D.setup.aina]||AINA.rejareja}

/* ---------- users & permissions */
let ME=null;
async function hashPin(pin,salt){
  const s=salt+"|"+pin;
  try{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,"0")).join("")}
  catch(e){let h=5381;for(let i=0;i<s.length;i++)h=((h*33)^s.charCodeAt(i))>>>0;return "f"+h.toString(16)}
}
const isOwner=()=>ME&&ME.role==="mwenye";
const PERM={ // what a seller (muuzaji) may do
  sell:true,viewStock:true,expense:true,closeDay:true,customerAdd:true,debtPay:true,quote:true,bottles:true,
  buy:false,editProduct:false,adjust:false,reports:false,void:false,settings:false,viewCost:false,users:false,backup:false,suppliers:false
};
function can(a){if(!ME)return false;if(ME.role==="mwenye")return true;if(a==="expense")return !!D.settings.sellerExpenses;if(a==="viewStock")return !!D.settings.sellerSeesStock;return !!PERM[a]}
function logA(action,detail){D.log.push({t:nowISO(),u:ME?ME.jina:"-",action,detail:String(detail||"")});if(D.log.length>3000)D.log.splice(0,D.log.length-3000)}
function userName(id){const u=D.users.find(x=>x.id===id);return u?u.jina:(id||"-")}

/* ---------- products & stock */
function prod(id){return D.products.find(p=>p.id===id)}
function batchSum(p){return (p.batches||[]).reduce((t,b)=>t+num(b.qty),0)}
function expiredQty(p,day){day=day||todayISO();return (p.batches||[]).filter(b=>b.exp&&b.exp<day).reduce((t,b)=>t+num(b.qty),0)}
function sellable(p){return feat("batch")?Math.max(0,num(p.stoo)-expiredQty(p)):num(p.stoo)}
function priceFor(p,mode,qtyBase){
  const useJ=feat("jumla")&&num(p.bei_jumla)>0&&(mode==="jumla"||(num(p.jumla_kuanzia)>0&&qtyBase>=num(p.jumla_kuanzia)));
  return useJ?num(p.bei_jumla):num(p.bei_rejareja);
}
function addStock(p,qty,cost,batch){ // purchase / positive adjustment, weighted average cost
  const cur=Math.max(0,num(p.stoo));
  if(cost!=null&&qty>0){p.bei_kununua=r2((cur*num(p.bei_kununua)+qty*num(cost))/(cur+qty)||num(cost))}
  p.stoo=r2(num(p.stoo)+qty);
  if(feat("batch")&&batch&&qty>0){p.batches=p.batches||[];const ex=p.batches.find(b=>b.no===batch.no&&b.exp===batch.exp);if(ex)ex.qty=r2(num(ex.qty)+qty);else p.batches.push({id:uid(),no:batch.no||"-",exp:batch.exp||"",qty})}
}
function takeStock(p,qty){ // sale / negative adjustment; FEFO over non-expired batches, returns allocations
  const alloc=[];
  if(feat("batch")&&p.batches&&p.batches.length){
    let left=qty;const today=todayISO();
    const bs=p.batches.filter(b=>num(b.qty)>0&&(!b.exp||b.exp>=today)).sort((a,b)=>(a.exp||"9999").localeCompare(b.exp||"9999"));
    for(const b of bs){if(left<=0)break;const t=Math.min(left,num(b.qty));b.qty=r2(num(b.qty)-t);left=r2(left-t);alloc.push({no:b.no,exp:b.exp,qty:t})}
    p.batches=p.batches.filter(b=>num(b.qty)>0.0001);
  }
  p.stoo=r2(num(p.stoo)-qty);return alloc;
}
function removeExpired(p){ // owner writes off expired batches
  const today=todayISO();let q=0;for(const b of p.batches||[])if(b.exp&&b.exp<today){q+=num(b.qty);b.qty=0}
  p.batches=(p.batches||[]).filter(b=>num(b.qty)>0);p.stoo=r2(num(p.stoo)-q);return q;
}

/* ---------- sales & money */
const activeSales=()=>D.sales.filter(s=>!s.voided);
function inRange(t,from,to){const d=dayOf(t);return d>=from&&d<=to}
function saleCost(s){return s.items.reduce((t,i)=>t+num(i.cost)*num(i.qty),0)}
function saleGoods(s){return s.items.reduce((t,i)=>t+num(i.total),0)-num(s.punguzo)}
function custBalance(cid){
  let b=0;for(const s of activeSales())if(s.mteja===cid)b+=num(s.deni);
  for(const p of D.payments)if(p.type==="mteja"&&p.ref===cid)b-=num(p.kiasi);return r2(b);
}
function suppBalance(sid){
  let b=0;for(const p of D.purchases)if(p.supplier===sid)b+=num(p.deni);
  for(const p of D.payments)if(p.type==="msambazaji"&&p.ref===sid)b-=num(p.kiasi);return r2(b);
}
function custOldestDebt(cid){ // date of oldest unpaid credit sale (FIFO)
  let paid=D.payments.filter(p=>p.type==="mteja"&&p.ref===cid).reduce((t,p)=>t+num(p.kiasi),0);
  for(const s of activeSales().filter(s=>s.mteja===cid&&num(s.deni)>0).sort((a,b)=>a.t.localeCompare(b.t))){if(paid>=num(s.deni)-0.01){paid-=num(s.deni);continue}return dayOf(s.t)}
  return null;
}
/* cash in the drawer: Taslimu only */
function cashFlows(day){
  const on=t=>dayOf(t)===day;let inn=0,out=0;
  for(const s of activeSales())if(on(s.t)&&s.njia==="Taslimu")inn+=num(s.kulipwa);
  for(const p of D.payments)if(on(p.t)&&p.njia==="Taslimu"){if(p.type==="mteja")inn+=num(p.kiasi);else out+=num(p.kiasi)}
  for(const e of D.expenses)if(on(e.t)&&(e.njia||"Taslimu")==="Taslimu")out+=num(e.kiasi);
  for(const p of D.purchases)if(on(p.t)&&p.njia==="Taslimu")out+=num(p.kulipwa);
  for(const b of D.bottles)if(on(b.t)&&b.type==="refund")out+=num(b.kiasi);
  return {inn:r2(inn),out:r2(out)};
}
function openingCash(day){
  const prev=D.closings.filter(c=>c.date<day).sort((a,b)=>b.date.localeCompare(a.date))[0];
  return prev?r2(num(prev.counted)-num(prev.handed)):0;
}
function expectedCash(day){const f=cashFlows(day);return r2(openingCash(day)+f.inn-f.out)}
function mobileByMethod(day){const o={};for(const s of activeSales())if(dayOf(s.t)===day&&s.njia!=="Taslimu"&&s.njia!=="Mkopo")o[s.njia]=(o[s.njia]||0)+num(s.kulipwa);
  for(const p of D.payments)if(dayOf(p.t)===day&&p.type==="mteja"&&p.njia!=="Taslimu")o[p.njia]=(o[p.njia]||0)+num(p.kiasi);return o}

/* ---------- period summary (owner reports) */
function summary(from,to){
  const ss=activeSales().filter(s=>inRange(s.t,from,to));
  const mauzo=ss.reduce((t,s)=>t+saleGoods(s),0),gharama=ss.reduce((t,s)=>t+saleCost(s),0);
  const ex=D.expenses.filter(e=>inRange(e.t,from,to)),matumizi=ex.reduce((t,e)=>t+num(e.kiasi),0);
  const adj=D.adjustments.filter(a=>inRange(a.t,from,to)&&num(a.qty)<0),upotevu=adj.reduce((t,a)=>t-num(a.qty)*num(a.cost),0);
  const ziada=D.adjustments.filter(a=>inRange(a.t,from,to)&&num(a.qty)>0).reduce((t,a)=>t+num(a.qty)*num(a.cost),0);
  const cl=D.closings.filter(c=>c.date>=from&&c.date<=to),pungufu=cl.reduce((t,c)=>t+Math.min(0,num(c.diff)),0);
  const ghafi=mauzo-gharama,halisi=ghafi-matumizi-upotevu+ziada;
  const byNjia={};for(const s of ss){byNjia[s.njia]=(byNjia[s.njia]||0)+num(s.kulipwa);if(num(s.deni)>0)byNjia["Mkopo"]=(byNjia["Mkopo"]||0)+num(s.deni)}
  const byUser={};for(const s of ss){const u=userName(s.user);byUser[u]=byUser[u]||{n:0,t:0};byUser[u].n++;byUser[u].t+=saleGoods(s)}
  const byProd={};for(const s of ss)for(const i of s.items){const k=i.pid;byProd[k]=byProd[k]||{jina:i.jina,qty:0,mauzo:0,faida:0,kipimo:i.kipimo};byProd[k].qty+=num(i.qty);byProd[k].mauzo+=num(i.total);byProd[k].faida+=num(i.total)-num(i.cost)*num(i.qty)}
  const byExp={};for(const e of ex)byExp[e.kundi]=(byExp[e.kundi]||0)+num(e.kiasi);
  const below=[];for(const s of ss)for(const i of s.items)if(num(i.qty)>0&&num(i.total)/num(i.qty)<num(i.cost)-0.001)below.push({s,i});
  const malipoMadeni=D.payments.filter(p=>p.type==="mteja"&&inRange(p.t,from,to)).reduce((t,p)=>t+num(p.kiasi),0);
  return {ss,mauzo:r2(mauzo),gharama:r2(gharama),ghafi:r2(ghafi),matumizi:r2(matumizi),upotevu:r2(upotevu),ziada:r2(ziada),halisi:r2(halisi),pungufu:r2(pungufu),
    byNjia,byUser,byProd,byExp,below,adj,cl,malipoMadeni,deniJipya:r2(ss.reduce((t,s)=>t+num(s.deni),0)),voids:D.sales.filter(s=>s.voided&&inRange(s.voided.t,from,to))};
}
function stockValue(){let c=0,r=0;for(const p of D.products){const q=Math.max(0,num(p.stoo));c+=q*num(p.bei_kununua);r+=q*num(p.bei_rejareja)}return {c:r2(c),r:r2(r)}}

/* ---------- alerts */
function alerts(){
  const A=[],today=todayISO(),S=D.settings,own=isOwner();
  const out=D.products.filter(p=>p.active!==false&&num(p.stoo)<=0);
  const low=D.products.filter(p=>p.active!==false&&num(p.stoo)>0&&num(p.kiwango_chini)>0&&num(p.stoo)<=num(p.kiwango_chini));
  if(out.length)A.push({sev:"r",k:"stoo",t:`Bidhaa ${out.length} zimeisha stoo`,d:out.slice(0,8).map(p=>p.jina).join(", ")+(out.length>8?"...":""),go:"bidhaa",f:"zimeisha"});
  if(low.length)A.push({sev:"a",k:"stoo",t:`Bidhaa ${low.length} zinakaribia kuisha`,d:low.slice(0,8).map(p=>p.jina+" ("+fq(p.stoo,p)+")").join(", "),go:"bidhaa",f:"chini"});
  if(feat("batch")){
    const exp=D.products.filter(p=>expiredQty(p)>0);
    if(exp.length)A.push({sev:"r",k:"expiry",t:`Dawa ${exp.length} zimeisha muda (expired)`,d:exp.map(p=>p.jina+": "+fq(expiredQty(p),p)).join(", ")+". Haziwezi kuuzwa; ziondoe stoo.",go:"bidhaa",f:"expiry"});
    const lim=addDays(today,num(S.expiryDays)||90),soon=[];
    for(const p of D.products)for(const b of p.batches||[])if(b.exp&&b.exp>=today&&b.exp<=lim&&num(b.qty)>0)soon.push(p.jina+" ("+fd(b.exp)+", "+fq(b.qty,p)+")");
    if(soon.length)A.push({sev:"a",k:"expiry",t:`Batch ${soon.length} zitaisha muda ndani ya siku ${num(S.expiryDays)||90}`,d:soon.slice(0,8).join(", "),go:"bidhaa",f:"expiry"});
  }
  if(own){
    const bad=D.products.filter(p=>num(p.bei_rejareja)>0&&num(p.bei_rejareja)<num(p.bei_kununua));
    if(bad.length)A.push({sev:"r",k:"bei",t:`Bidhaa ${bad.length} zina bei ya kuuza chini ya gharama`,d:bad.map(p=>p.jina+": nunua "+fm(p.bei_kununua)+", uza "+fm(p.bei_rejareja)).join("; "),go:"bidhaa"});
    const w=summary(addDays(today,-6),today);
    if(w.below.length)A.push({sev:"r",k:"hasara",t:`Mauzo ${w.below.length} yaliuzwa chini ya gharama (siku 7)`,d:w.below.slice(0,6).map(x=>x.i.jina+" kwa "+fm(num(x.i.total)/num(x.i.qty))+" (gharama "+fm(x.i.cost)+"), "+userName(x.s.user)).join("; "),go:"ripoti"});
    const t=summary(today,today);
    if(t.ss.length&&t.halisi<0)A.push({sev:"r",k:"hasara",t:`Hasara ya leo: ${fm(t.halisi)}`,d:`Faida ghafi ${fm(t.ghafi)} haitoshi kulipa matumizi ${fm(t.matumizi)}${t.upotevu?" na upotevu wa bidhaa "+fm(t.upotevu):""}.`,go:"ripoti"});
    const m=summary(addDays(today,-29),today);
    if(m.ss.length>=5&&m.halisi<0)A.push({sev:"r",k:"hasara",t:`Biashara iko kwenye hasara siku 30: ${fm(m.halisi)}`,d:`Mauzo ${fm(m.mauzo)}, faida ghafi ${fm(m.ghafi)}, matumizi ${fm(m.matumizi)}, upotevu ${fm(m.upotevu)}.`,go:"ripoti"});
    const short=D.closings.filter(c=>c.date>=addDays(today,-13)&&num(c.diff)<-num(S.cashThreshold));
    if(short.length)A.push({sev:"r",k:"pesa",t:`Upotevu wa pesa: siku ${short.length} zilipungua (siku 14)`,d:short.map(c=>fd(c.date)+": "+fm(c.diff)+" ("+userName(c.user)+")").join("; "),go:"funga"});
    const loss=D.adjustments.filter(a=>dayOf(a.t)>=addDays(today,-29)&&num(a.qty)<0&&/Potea|Wizi|Hesabu/.test(a.sababu));
    const lv=loss.reduce((t,a)=>t-num(a.qty)*num(a.cost),0);
    if(lv>0)A.push({sev:"r",k:"upotevu",t:`Upotevu wa bidhaa siku 30: ${fm(lv)}`,d:loss.slice(0,6).map(a=>(prod(a.pid)||{}).jina+": "+fq(a.qty)+" ("+a.sababu+")").join("; "),go:"marekebisho"});
    const v=D.sales.filter(s=>s.voided&&dayOf(s.voided.t)>=addDays(today,-6));
    if(v.length)A.push({sev:"a",k:"futa",t:`Mauzo ${v.length} yamefutwa (siku 7)`,d:v.map(s=>"#"+s.no+" "+fm(saleGoods(s))+" - "+(s.voided.sababu||"")).join("; "),go:"mauzoList"});
  }
  const yest=addDays(today,-1);
  if(activeSales().some(s=>dayOf(s.t)===yest)&&!D.closings.some(c=>c.date===yest))A.push({sev:"a",k:"pesa",t:"Siku ya jana haijafungwa",d:"Hesabu pesa ya jana na ufunge siku ili kugundua upungufu.",go:"funga"});
  const over=[],limit=[];
  for(const c of D.customers){const b=custBalance(c.id);if(b<=0)continue;const o=custOldestDebt(c.id);if(o&&daysBetween(o,today)>num(S.debtDays))over.push(c.jina+" "+fm(b)+" (siku "+daysBetween(o,today)+")");if(num(c.kikomo)>0&&b>num(c.kikomo))limit.push(c.jina+" "+fm(b)+" / "+fm(c.kikomo))}
  if(over.length)A.push({sev:"a",k:"madeni",t:`Madeni ${over.length} yamepitiliza siku ${S.debtDays}`,d:over.slice(0,8).join("; "),go:"wateja"});
  if(limit.length)A.push({sev:"r",k:"madeni",t:`Wateja ${limit.length} wamezidi kikomo cha mkopo`,d:limit.join("; "),go:"wateja"});
  if(own){const sd=D.suppliers.map(s=>[s,suppBalance(s.id)]).filter(x=>x[1]>0);if(sd.length)A.push({sev:"b",k:"madeni",t:`Unadaiwa na wasambazaji ${sd.length}: ${fm(sd.reduce((t,x)=>t+x[1],0))}`,d:sd.map(x=>x[0].jina+" "+fm(x[1])).join("; "),go:"wasambazaji"})}
  const L=licStatus();if(L.state==="paid"&&L.daysLeft<=3)A.push({sev:"a",k:"leseni",t:`Leseni inaisha baada ya siku ${L.daysLeft}`,d:"Lipia mapema ili usikatizwe.",go:"leseni"});
  if(L.state==="trial")A.push({sev:"b",k:"leseni",t:`Kipindi cha majaribio: siku ${L.daysLeft} zimebaki`,d:`Baada ya hapo lipia TSh ${fm(APP.pricePerMonth)} kwa mwezi.`,go:"leseni"});
  return A;
}
