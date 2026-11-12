"use strict";
/* ================================================================ VIEWS */
const R = {}, A = {};
let view = "mauzo", state = {}, cart = newCart(), lastAct = Date.now();
function newCart(){return {mode:"rejareja",lines:[],punguzo:0,mteja:"",njia:"Taslimu",kulipwa:"",cheti:""}}

function shell(inner){
  const L=licStatus(),al=ME?alerts():[],red=al.filter(a=>a.sev==="r").length;
  const nav=isOwner()?[["mauzo","&#128722;","Mauzo"],["bidhaa","&#128230;","Bidhaa"],["tahadhari","&#128276;","Tahadhari"],["ripoti","&#128200;","Ripoti"],["zaidi","&#9776;","Zaidi"]]
    :[["mauzo","&#128722;","Mauzo"],["bidhaa","&#128230;","Bidhaa"],["tahadhari","&#128276;","Tahadhari"],["funga","&#128181;","Funga Siku"],["zaidi","&#9776;","Zaidi"]];
  const lic=L.state==="trial"?`<div class="lic noprint">Majaribio: siku ${L.daysLeft} zimebaki. <button class="btn sm acc" data-a="go" data-v="leseni">Lipia</button></div>`
    :L.state==="paid"&&L.daysLeft<=5?`<div class="lic noprint">Leseni inaisha ${fd(L.expiry)} (siku ${L.daysLeft}). <button class="btn sm acc" data-a="go" data-v="leseni">Lipia</button></div>`:"";
  return `<header class="top">${LOGO}<div class="tt"><div class="bn">${esc(APP.name)}</div><h1>${esc(D.setup.jina)}</h1><div class="u">${esc(ME.jina)} &middot; ${ME.role==="mwenye"?"Mwenye duka":"Muuzaji"}</div></div>
    <button class="bell" data-a="go" data-v="tahadhari" aria-label="Tahadhari">&#128276;${al.length?`<span class="c ${red?"r":""}">${al.length}</span>`:""}</button>
    <button class="bell" data-a="lock" aria-label="Funga">&#128274;</button></header>${lic}
    ${CLOCK_BACK?`<div class="lic bad">Tarehe ya simu imerudishwa nyuma. Rekebisha tarehe na saa za simu.</div>`:""}
    <main>${inner}</main>
    <nav class="bot">${nav.map(([k,i,t])=>`<button data-a="go" data-v="${k}" class="${(view===k||(k==="zaidi"&&!nav.some(n=>n[0]===view)))?"on":""}"><span class="i">${i}</span>${t}</button>`).join("")}</nav>`;
}
function render(){
  const root=$("#root");
  if(!D.setup.done){root.innerHTML=R.setup();A.after_setup&&A.after_setup();return}
  if(!ME){root.innerHTML=R.login();A.after_login&&A.after_login();return}
  if(!licActive()&&!["leseni","nakala"].includes(view)){view="leseni"}
  if(!can(GUARD[view]||"sell")){view="mauzo"}
  root.innerHTML=shell((R[view]||R.mauzo)());
  const f=A["after_"+view];if(f)f();
}
const GUARD={mauzo:"sell",kikapu:"sell",bidhaa:"viewStock",bidhaaForm:"editProduct",manunuzi:"buy",manunuziList:"buy",matumizi:"expense",wateja:"customerAdd",mteja:"customerAdd",
  wasambazaji:"suppliers",marekebisho:"adjust",hesabu:"adjust",funga:"closeDay",ripoti:"reports",mauzoList:"sell",proforma:"quote",chupa:"bottles",watumiaji:"users",
  mipangilio:"settings",leseni:"sell",nakala:"backup",kumbukumbu:"settings",zaidi:"sell",tahadhari:"sell"};
function go(v,st){closeDlg();view=v;state=st||{};render();window.scrollTo(0,0)}

/* ---------------------------------------------------------------- SETUP */
R.setup=()=>{
  const st=state.step||1,sel=state.aina||"";
  if(st===1)return `<main><div class="login"><div class="logo">${LOGO}</div><h2 style="margin-top:8px">Karibu ${esc(APP.name)}</h2>
    <p class="muted">Mfumo wa kusimamia duka lako, unaofanya kazi bila intaneti. Chagua aina ya biashara yako:</p></div>
    <div class="types">${Object.entries(AINA).map(([k,a])=>`<button class="type ${sel===k?"on":""}" data-a="pickType" data-k="${k}"><span class="i">${a.ikoni}</span><span><b>${a.jina}</b><br><span class="muted">${a.maelezo}</span></span></button>`).join("")}</div>
    <div style="margin-top:14px"><button class="btn big" data-a="setupNext" ${sel?"":"disabled"}>Endelea &rarr;</button></div>
    <p class="muted" style="text-align:center;margin-top:14px">Siku ${APP.trialDays} za majaribio bure. Kisha TSh ${fm(APP.pricePerMonth)} kwa mwezi.</p>
    <div style="text-align:center"><button class="btn ghost sm" data-a="restore">Una nakala (backup)? Rejesha hapa</button></div></main>`;
  return `<main><div class="card"><h2>${AINA[sel].ikoni} ${AINA[sel].jina}</h2><div class="form" id="suF">
    <label class="full">Jina la duka<input name="jina" placeholder="mf. Mama Neema Shop" autocomplete="off"></label>
    <label>Jina la mwenye duka<input name="mmiliki" autocomplete="off"></label><label>Namba ya simu<input name="simu" inputmode="tel"></label>
    <label class="full">Mahali (mtaa, mji)<input name="mahali"></label>
    <label>PIN ya mwenye duka (tarakimu 4-6)<input name="pin" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password"></label>
    <label>Rudia PIN<input name="pin2" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password"></label>
    <label class="chk full"><input type="checkbox" name="mfano"> Weka bidhaa za mfano (unaweza kuzifuta baadaye)</label></div>
    <p class="muted">PIN ya mwenye inaona faida, ripoti na mipangilio. Muuzaji ataongezwa baadaye kwa PIN yake, ataweza kuuza tu.</p>
    <div class="row"><button class="btn sec" data-a="setupBack">&larr; Rudi</button><button class="btn right" data-a="setupDone">Anza kutumia</button></div></div></main>`;
};

/* ---------------------------------------------------------------- LOGIN */
let pinBuf="",loginUser="";
R.login=()=>{
  const us=D.users.filter(u=>u.active!==false);if(!loginUser&&us.length===1)loginUser=us[0].id;
  return `<main><div class="login"><div class="logo">${LOGO}</div><div class="muted" style="letter-spacing:2px;font-weight:700;color:var(--accd)">${esc(APP.name)}</div><h2>${esc(D.setup.jina)}</h2>
    <div class="users">${us.map(u=>`<button class="${loginUser===u.id?"on":""}" data-a="pickUser" data-id="${u.id}"><span style="font-size:24px">${u.role==="mwenye"?"&#128081;":"&#128100;"}</span>${esc(u.jina)}<span class="muted right">${u.role==="mwenye"?"Mwenye":"Muuzaji"}</span></button>`).join("")}</div>
    ${loginUser?`<div class="muted">Ingiza PIN</div><div class="dots">${[0,1,2,3,4,5].slice(0,Math.max(4,pinBuf.length)).map(i=>`<i class="${i<pinBuf.length?"f":""}"></i>`).join("")}</div>
    <div class="pinpad">${[1,2,3,4,5,6,7,8,9].map(n=>`<button data-a="pin" data-k="${n}">${n}</button>`).join("")}<button data-a="pin" data-k="c">&#9003;</button><button data-a="pin" data-k="0">0</button><button data-a="pin" data-k="ok" style="background:var(--p);color:#fff">&#10003;</button></div>`:""}
  </div></main>`;
};

/* ---------------------------------------------------------------- MAUZO (POS) */
function lineCalc(l){
  const p=prod(l.pid);if(!p)return null;const pk=feat("pakiti")&&p.pakiti&&num(p.pakiti.idadi)>1?p.pakiti:null;
  const per=l.unit==="pack"&&pk?num(pk.idadi):1,qtyBase=r2(num(l.n)*per);
  let price=l.unit==="pack"&&pk?(num(p.bei_pakiti)>0?num(p.bei_pakiti):priceFor(p,"jumla",qtyBase)*per):priceFor(p,cart.mode,qtyBase);
  if(l.bei!=null&&l.bei!=="")price=num(l.bei);
  const total=r2(num(l.n)*price);
  const amana=feat("chupa")&&num(p.amana)>0?r2(Math.max(0,qtyBase-num(l.rud??qtyBase))*num(p.amana)):0;
  return {p,pk,per,qtyBase,price,total,amana,unitName:l.unit==="pack"&&pk?pk.jina:p.kipimo,cost:num(p.bei_kununua),belowCost:qtyBase>0&&total/qtyBase<num(p.bei_kununua)-0.001};
}
function cartTotals(){let goods=0,amana=0,n=0;for(const l of cart.lines){const c=lineCalc(l);if(!c)continue;goods+=c.total;amana+=c.amana;n++}
  const jumla=r2(goods-num(cart.punguzo)+amana);return {goods:r2(goods),amana:r2(amana),jumla,n}}
R.mauzo=()=>{
  const q=(state.q||"").toLowerCase(),kundi=state.kundi||"";
  const ps=D.products.filter(p=>p.active!==false&&(!kundi||p.kundi===kundi)&&(!q||(p.jina+" "+(p.barcode||"")+" "+(p.kundi||"")).toLowerCase().includes(q))).sort((a,b)=>a.jina.localeCompare(b.jina));
  const T=cartTotals(),cats=[...new Set(D.products.map(p=>p.kundi).filter(Boolean))];
  return `<div class="search"><input id="q" placeholder="&#128269; Tafuta bidhaa au scan barcode" value="${esc(state.q||"")}" autocomplete="off">${"BarcodeDetector" in window?`<button class="btn sec" data-a="scan" aria-label="Scan">&#128247;</button>`:""}</div>
  ${cats.length>1?`<div class="tabs"><button class="${!kundi?"on":""}" data-a="kundi" data-k="">Zote</button>${cats.map(c=>`<button class="${kundi===c?"on":""}" data-a="kundi" data-k="${esc(c)}">${esc(c)}</button>`).join("")}</div>`:""}
  ${D.products.length?`<div class="list">${ps.slice(0,200).map(p=>{const s=sellable(p),inC=cart.lines.filter(l=>l.pid===p.id).length;return `<div class="it" data-a="addItem" data-id="${p.id}">
    <div style="min-width:0"><div class="nm">${esc(p.jina)} ${inC?`<span class="chip ok">&#10003;</span>`:""}</div><div class="sb">${can("viewStock")?`Stoo: <b style="color:${s<=0?"var(--red)":num(p.kiwango_chini)&&s<=num(p.kiwango_chini)?"var(--accd)":"inherit"}">${fq(s,p)}</b>`:""}${feat("batch")&&expiredQty(p)>0?` &middot; <span style="color:var(--red)">${fq(expiredQty(p))} zimeisha muda</span>`:""}</div></div>
    <div class="pr">${fm(p.bei_rejareja)}<small>/${esc(p.kipimo)}${feat("jumla")&&num(p.bei_jumla)>0?" &middot; jumla "+fm(p.bei_jumla):""}</small></div></div>`}).join("")||`<div class="empty">Hakuna bidhaa inayolingana na "${esc(state.q)}".</div>`}</div>`
  :`<div class="card empty">Bado hakuna bidhaa.<br><br>${can("editProduct")?`<button class="btn" data-a="productForm">+ Ongeza bidhaa</button> <button class="btn sec" data-a="go" data-v="nakala">Pakia kutoka Excel</button>`:"Mwombe mwenye duka aongeze bidhaa."}</div>`}
  ${T.n?`<div class="pad"></div><div class="cartbar" data-a="go" data-v="kikapu"><span class="n">${T.n}</span> Kikapu &middot; Lipa <span class="t">${fm(T.jumla)}</span></div>`:""}`;
};
R.kikapu=()=>{
  if(!cart.lines.length)return `<div class="card empty">Kikapu kiko tupu.<br><br><button class="btn" data-a="go" data-v="mauzo">&larr; Chagua bidhaa</button></div>`;
  const T=cartTotals(),cust=D.customers.find(c=>c.id===cart.mteja),own=isOwner();
  const maxDisc=own?Infinity:T.goods*num(D.settings.sellerDiscountPct)/100;
  return `<div class="row" style="margin-bottom:10px"><button class="btn ghost" data-a="go" data-v="mauzo">&larr; Ongeza bidhaa</button><button class="btn ghost right" data-a="clearCart" style="color:var(--red)">Futa kikapu</button></div>
  ${feat("jumla")?`<div class="seg" style="margin-bottom:10px"><button class="${cart.mode==="rejareja"?"on":""}" data-a="cartMode" data-m="rejareja">Bei ya Rejareja</button><button class="${cart.mode==="jumla"?"on":""}" data-a="cartMode" data-m="jumla">Bei ya Jumla</button></div>`:""}
  <div class="list" id="cartList">${cart.lines.map((l,i)=>{const c=lineCalc(l);if(!c)return "";const step=c.p.desimali&&l.unit!=="pack"?"0.01":"1";return `<div class="it" style="flex-wrap:wrap;cursor:default">
    <div style="flex:1;min-width:150px"><div class="nm">${esc(c.p.jina)}</div><div class="sb">${fm(c.price)} / ${esc(c.unitName)}${c.belowCost&&own?` <span class="chip bad">chini ya gharama ${fm(c.cost)}</span>`:""}</div>
      ${c.pk?`<div class="seg" style="margin-top:6px;max-width:240px"><button class="${l.unit!=="pack"?"on":""}" data-a="lineUnit" data-i="${i}" data-u="base">${esc(c.p.kipimo)}</button><button class="${l.unit==="pack"?"on":""}" data-a="lineUnit" data-i="${i}" data-u="pack">${esc(c.pk.jina)} (${c.pk.idadi})</button></div>`:""}
      ${feat("chupa")&&num(c.p.amana)>0?`<label style="margin-top:6px;max-width:240px">Chupa tupu alizoleta (amana ${fm(c.p.amana)}/chupa)<input type="number" min="0" step="1" data-rud="${i}" value="${esc(l.rud??c.qtyBase)}"></label>`:""}
      ${own||num(D.settings.sellerDiscountPct)>0?`<button class="btn ghost sm" data-a="linePrice" data-i="${i}">Badilisha bei</button>`:""}</div>
    <div style="text-align:right"><div class="qty"><button data-a="qty" data-i="${i}" data-d="-1">&minus;</button><input type="number" inputmode="decimal" min="0" step="${step}" data-qi="${i}" value="${esc(l.n)}"><button data-a="qty" data-i="${i}" data-d="1">+</button></div>
      <div style="font-weight:800;margin-top:6px">${fm(c.total)}${c.amana?`<div class="muted">+ amana ${fm(c.amana)}</div>`:""}</div>
      <button class="btn ghost sm" data-a="rmLine" data-i="${i}" style="color:var(--red)">Ondoa</button></div></div>`}).join("")}</div>
  <div class="card" style="margin-top:12px" id="payF">
    <table class="stmt"><tr><td>Bidhaa</td><td>${fm(T.goods)}</td></tr>
      <tr><td>Punguzo${own?"":` (hadi ${fm(maxDisc)})`}</td><td><input type="number" min="0" name="punguzo" value="${esc(cart.punguzo||"")}" style="max-width:130px;text-align:right" ${!own&&!maxDisc?"disabled":""}></td></tr>
      ${T.amana?`<tr><td>Amana ya chupa</td><td>${fm(T.amana)}</td></tr>`:""}
      <tr class="big"><td>JUMLA</td><td id="cTot">${fm(T.jumla)}</td></tr></table>
    <h3 style="margin-top:12px">Njia ya malipo</h3>
    <div class="pays">${NJIA_MALIPO.filter(n=>n!=="Mkopo"||feat("mkopo")).map(n=>`<button class="${cart.njia===n?"on":""}" data-a="payMethod" data-n="${n}">${n}</button>`).join("")}</div>
    <div class="form" style="margin-top:10px">
      <label>Mteja ${cart.njia==="Mkopo"?"(lazima kwa mkopo)":"(hiari)"}<select name="mteja">${opts(D.customers.map(c=>[c.id,c.jina+(custBalance(c.id)>0?" (deni "+fm(custBalance(c.id))+")":"")]),cart.mteja,"-- Mteja wa kawaida --")}</select></label>
      ${cart.njia!=="Mkopo"?`<label>Kiasi alicholipa<input type="number" inputmode="decimal" min="0" name="kulipwa" value="${esc(cart.kulipwa)}" placeholder="${fm(T.jumla)}"></label>`:`<label>Kiasi alicholipa sasa (kianzio)<input type="number" min="0" name="kulipwa" value="${esc(cart.kulipwa)}" placeholder="0"></label>`}
      ${feat("batch")?`<label class="full">Cheti / maelezo ya daktari (kwa dawa za cheti)<input name="cheti" value="${esc(cart.cheti)}"></label>`:""}
    </div>
    <div class="info" id="chenji" style="margin-top:10px"></div>
    ${cust&&num(cust.kikomo)>0?`<p class="muted">Kikomo cha mkopo cha ${esc(cust.jina)}: ${fm(cust.kikomo)}, deni la sasa ${fm(custBalance(cust.id))}.</p>`:""}
    <button class="btn big acc" style="margin-top:12px" data-a="checkout">&#10003; Kamilisha Mauzo</button>
    ${feat("proforma")?`<button class="btn big sec" style="margin-top:8px" data-a="makeQuote">Tengeneza Proforma (bila kuuza)</button>`:""}
    <button class="btn sec" style="margin-top:8px;width:100%" data-a="addCustomer">+ Mteja mpya</button>
  </div>`;
};

/* ---------------------------------------------------------------- BIDHAA */
R.bidhaa=()=>{
  const f=state.f||"zote",q=(state.q||"").toLowerCase(),own=can("viewCost"),today=todayISO(),lim=addDays(today,num(D.settings.expiryDays)||90);
  let ps=D.products.filter(p=>!q||(p.jina+" "+(p.barcode||"")+" "+(p.kundi||"")).toLowerCase().includes(q));
  if(f==="chini")ps=ps.filter(p=>num(p.stoo)>0&&num(p.kiwango_chini)>0&&num(p.stoo)<=num(p.kiwango_chini));
  if(f==="zimeisha")ps=ps.filter(p=>num(p.stoo)<=0);
  if(f==="expiry")ps=ps.filter(p=>(p.batches||[]).some(b=>b.exp&&b.exp<=lim&&num(b.qty)>0));
  ps.sort((a,b)=>a.jina.localeCompare(b.jina));
  const V=stockValue();
  return `<div class="row" style="margin-bottom:10px"><h2 style="margin:0">Bidhaa (${D.products.length})</h2>${can("editProduct")?`<button class="btn right" data-a="productForm">+ Bidhaa</button>`:""}</div>
  ${own?`<div class="grid kpis" style="margin-bottom:10px">${kpi("Thamani ya stoo (gharama)",fm(V.c))}${kpi("Thamani kwa bei ya kuuza",fm(V.r))}</div>`:""}
  <div class="search"><input id="qb" placeholder="&#128269; Tafuta" value="${esc(state.q||"")}"></div>
  <div class="tabs">${[["zote","Zote"],["chini","Zinakaribia kuisha"],["zimeisha","Zimeisha"]].concat(feat("batch")?[["expiry","Expiry"]]:[]).map(([k,t])=>`<button class="${f===k?"on":""}" data-a="bf" data-f="${k}">${t}</button>`).join("")}</div>
  ${can("buy")?`<div class="row" style="margin-bottom:10px"><button class="btn sec sm" data-a="go" data-v="manunuzi">+ Ingiza mzigo (manunuzi)</button><button class="btn sec sm" data-a="go" data-v="hesabu">Hesabu ya stoo</button></div>`:""}
  <div class="list">${ps.map(p=>{const s=num(p.stoo),lowS=num(p.kiwango_chini)&&s<=num(p.kiwango_chini);return `<div class="it" data-a="${can("editProduct")?"productForm":"noop"}" data-id="${p.id}">
    <div style="min-width:0"><div class="nm">${esc(p.jina)} ${p.active===false?`<span class="chip">imesitishwa</span>`:""}</div>
    <div class="sb">${esc(p.kundi||"")}${own?" &middot; gharama "+fm(p.bei_kununua):""} &middot; uza ${fm(p.bei_rejareja)}${feat("jumla")&&num(p.bei_jumla)?" / jumla "+fm(p.bei_jumla):""}</div>
    ${feat("batch")&&(p.batches||[]).length?`<div class="sb">${p.batches.map(b=>`${esc(b.no)}: ${fq(b.qty)} &middot; ${b.exp?(b.exp<today?`<b style="color:var(--red)">ilikwisha ${fd(b.exp)}</b>`:b.exp<=lim?`<b style="color:var(--accd)">${fd(b.exp)}</b>`:fd(b.exp)):"bila tarehe"}`).join(" | ")}</div>`:""}</div>
    <div class="pr" style="color:${s<=0?"var(--red)":lowS?"var(--accd)":"inherit"}">${fq(s,p)}<small>${s<=0?"imeisha":lowS?"chini ya "+fq(p.kiwango_chini):"stoo"}</small></div></div>`}).join("")||`<div class="empty">Hakuna bidhaa.</div>`}</div>`;
};

/* ---------------------------------------------------------------- TAHADHARI */
R.tahadhari=()=>{
  const al=alerts();
  return `<h2>Tahadhari (${al.length})</h2>${al.length?al.map(a=>`<div class="card row" style="align-items:flex-start;flex-wrap:nowrap;cursor:pointer" data-a="go" data-v="${a.go}" ${a.f?`data-f="${a.f}"`:""}><span class="sev ${a.sev}"></span>
    <div><b>${esc(a.t)}</b><div class="muted">${esc(a.d)}</div></div><span class="right muted">&rsaquo;</span></div>`).join(""):`<div class="card alert ok">Hakuna tahadhari. Kila kitu kiko sawa.</div>`}
  <p class="muted">Nyekundu = hatua ya haraka (hasara, upotevu, bidhaa zimeisha). Njano = fuatilia. Bluu = taarifa.</p>`;
};

/* ---------------------------------------------------------------- ZAIDI */
R.zaidi=()=>{
  const al=alerts();const items=[
    ["mauzoList","&#129534;","Mauzo yaliyopita","sell"],["manunuzi","&#128666;","Ingiza Mzigo","buy"],["matumizi","&#128184;","Matumizi","expense"],
    ["wateja","&#128101;","Wateja na Madeni","customerAdd"],["wasambazaji","&#127981;","Wasambazaji","suppliers"],["hesabu","&#128203;","Hesabu ya Stoo","adjust"],
    ["marekebisho","&#9888;&#65039;","Upotevu na Marekebisho","adjust"],["funga","&#128181;","Funga Siku","closeDay"],
    ...(feat("proforma")?[["proforma","&#128196;","Proforma","quote"]]:[]),...(feat("chupa")?[["chupa","&#127870;","Chupa Tupu","bottles"]]:[]),
    ["watumiaji","&#128101;","Watumiaji (PIN)","users"],["nakala","&#128190;","Nakala na Excel","backup"],["mipangilio","&#9881;&#65039;","Mipangilio","settings"],
    ["kumbukumbu","&#128221;","Kumbukumbu","settings"],["leseni","&#128273;","Leseni na Malipo","sell"]];
  return `<h2>Zaidi</h2>${installEvt?`<button class="btn big acc" style="margin-bottom:12px" data-a="installApp">&#128241; Weka app kwenye simu (Install)</button>`:""}<div class="menu">${items.filter(x=>can(x[3])).map(([v,i,t])=>`<button data-a="go" data-v="${v}"><span class="i">${i}</span>${t}</button>`).join("")}</div>
  <p class="muted" style="margin-top:16px;text-align:center">${esc(APP.name)} toleo ${esc(APP.version)} &middot; ${esc(aina().jina)}</p>
  <div class="card devcard"><h3>Msanidi wa app</h3><div class="muted">${esc(APP.dev.name)}</div><div class="row" style="margin-top:10px"><a class="btn sm" href="tel:${esc(APP.dev.phone)}">&#128222; ${esc(APP.dev.phone)}</a><a class="btn sm sec" target="_blank" rel="noopener" href="https://wa.me/${esc(APP.whatsapp)}">WhatsApp</a><a class="btn sm sec" href="mailto:${esc(APP.dev.email)}">&#9993; Barua pepe</a></div></div>`;
};
