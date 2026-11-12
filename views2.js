"use strict";
/* ================================================================ VIEWS (2): stoo, fedha, ripoti, mipangilio, leseni */
let pur = {supplier:"",lines:[],njia:"Taslimu",kulipwa:"",ankara:""};
const PERIODS=[["leo","Leo"],["jana","Jana"],["wiki","Siku 7"],["mwezi","Mwezi huu"],["siku30","Siku 30"],["chagua","Chagua"]];
function period(k,a,b){
  const t=todayISO(),d=parseISO(t);
  if(k==="jana"){const y=addDays(t,-1);return [y,y,"Jana "+fd(y)]}
  if(k==="wiki")return [addDays(t,-6),t,"Siku 7 ("+fd(addDays(t,-6))+" - "+fd(t)+")"];
  if(k==="mwezi"){const f=toISO(new Date(d.getFullYear(),d.getMonth(),1));return [f,t,"Mwezi huu ("+fd(f)+" - "+fd(t)+")"]}
  if(k==="siku30")return [addDays(t,-29),t,"Siku 30 ("+fd(addDays(t,-29))+" - "+fd(t)+")"];
  if(k==="chagua"&&a&&b)return [a,b,fd(a)+" - "+fd(b)];
  return [t,t,"Leo "+fd(t)];
}
function periodBar(act){const k=state.p||"leo";return `<div class="tabs">${PERIODS.map(([v,t])=>`<button class="${k===v?"on":""}" data-a="${act}" data-p="${v}">${t}</button>`).join("")}</div>
  ${k==="chagua"?`<div class="row" style="margin-bottom:10px"><input type="date" id="pA" value="${esc(state.a||addDays(todayISO(),-7))}" style="max-width:160px"> hadi <input type="date" id="pB" value="${esc(state.b||todayISO())}" style="max-width:160px"><button class="btn sm" data-a="${act}" data-p="chagua" data-apply="1">Onyesha</button></div>`:""}`}
const back=(v,t)=>`<button class="btn ghost" data-a="go" data-v="${v}" style="margin-bottom:6px">&larr; ${t||"Rudi"}</button>`;

/* ---------------------------------------------------------------- PRODUCT FORM */
R.bidhaaForm=()=>{
  const p=state.id?prod(state.id):null,a=aina(),x=p||{kipimo:a.vipimo[0],kundi:"",pakiti:{jina:a.pakitiJina,idadi:""}};
  const pk=x.pakiti||{jina:a.pakitiJina,idadi:""};
  return `${back("bidhaa","Bidhaa")}<div class="card"><h2>${p?"Badilisha bidhaa":"Bidhaa mpya"}</h2><div class="form" id="pF">
  <label class="full">Jina la bidhaa *<input name="jina" value="${esc(x.jina)}" autocomplete="off"></label>
  <label>Kundi<input name="kundi" list="kundiL" value="${esc(x.kundi)}"><datalist id="kundiL">${[...new Set(a.makundi.concat(D.products.map(p=>p.kundi).filter(Boolean)))].map(k=>`<option value="${esc(k)}">`).join("")}</datalist></label>
  <label>Kipimo (unit)<input name="kipimo" list="kipL" value="${esc(x.kipimo)}"><datalist id="kipL">${a.vipimo.map(k=>`<option value="${esc(k)}">`).join("")}</datalist></label>
  <label>Bei ya kununua (gharama) kwa ${esc(x.kipimo||"kipimo")}<input name="bei_kununua" type="number" inputmode="decimal" min="0" value="${esc(x.bei_kununua??"")}"></label>
  <label>Bei ya rejareja *<input name="bei_rejareja" type="number" inputmode="decimal" min="0" value="${esc(x.bei_rejareja??"")}"></label>
  ${feat("jumla")?`<label>Bei ya jumla<input name="bei_jumla" type="number" inputmode="decimal" min="0" value="${esc(x.bei_jumla??"")}"></label>
  <label>Jumla inaanza idadi ngapi? (hiari)<input name="jumla_kuanzia" type="number" min="0" value="${esc(x.jumla_kuanzia??"")}"></label>`:""}
  ${feat("pakiti")?`<label>Jina la pakiti<input name="pk_jina" value="${esc(pk.jina)}"></label>
  <label>Idadi ndani ya ${esc(pk.jina||a.pakitiJina)} moja<input name="pk_idadi" type="number" min="0" value="${esc(pk.idadi??"")}"></label>
  <label>Bei ya ${esc(pk.jina||a.pakitiJina)} nzima (hiari)<input name="bei_pakiti" type="number" min="0" value="${esc(x.bei_pakiti??"")}"></label>`:""}
  <label>Tahadhari stoo ikifika (kiwango cha chini)<input name="kiwango_chini" type="number" min="0" step="any" value="${esc(x.kiwango_chini??"")}"></label>
  <label>Barcode (hiari)<input name="barcode" value="${esc(x.barcode||"")}"></label>
  ${feat("desimali")?`<label class="chk"><input type="checkbox" name="desimali" ${x.desimali?"checked":""}> Inauzwa kwa desimali (mf. 2.5 m)</label>`:""}
  ${feat("chupa")?`<label>Amana ya chupa (deposit) kwa chupa<input name="amana" type="number" min="0" value="${esc(x.amana??"")}"></label>`:""}
  ${feat("batch")?`<label class="chk"><input type="checkbox" name="cheti" ${x.cheti?"checked":""}> Dawa ya cheti (prescription)</label>`:""}
  ${p?`<label class="chk"><input type="checkbox" name="active" ${p.active!==false?"checked":""}> Inauzwa (ondoa alama kusitisha)</label>`:""}
  </div>
  ${!p?`<h3 style="margin-top:12px">Stoo ya kuanzia</h3><div class="form" id="pS"><label>Idadi iliyopo sasa (${esc(x.kipimo)})<input name="stoo" type="number" min="0" step="any" value=""></label>
  ${feat("batch")?`<label>Namba ya batch<input name="batch"></label><label>Tarehe ya kuisha muda (expiry)<input name="exp" type="date"></label>`:""}</div>`
  :`<p class="muted">Stoo ya sasa: <b>${fq(p.stoo,p)}</b>. Kuongeza stoo tumia "Ingiza mzigo"; kurekebisha tumia "Hesabu ya stoo".</p>`}
  <div class="row" style="margin-top:12px"><button class="btn" data-a="saveProduct" data-id="${p?p.id:""}">Hifadhi</button>
  ${p?`<button class="btn sec" data-a="go" data-v="marekebisho" data-pid="${p.id}">Rekebisha stoo</button><button class="btn ghost right" style="color:var(--red)" data-a="delProduct" data-id="${p.id}">Futa</button>`:""}</div></div>`;
};

/* ---------------------------------------------------------------- MANUNUZI (ingiza mzigo) */
R.manunuzi=()=>{
  const tot=r2(pur.lines.reduce((t,l)=>t+num(l.qty)*num(l.cost),0));
  const recent=D.purchases.slice(-15).reverse();
  return `<h2>Ingiza Mzigo (Manunuzi)</h2><div class="card"><div class="form" id="puH">
    <label>Msambazaji<select name="supplier">${opts(D.suppliers.map(s=>[s.id,s.jina]),pur.supplier,"-- Bila msambazaji --")}</select></label>
    <label>Namba ya ankara / risiti (hiari)<input name="ankara" value="${esc(pur.ankara)}"></label></div>
    <button class="btn ghost sm" data-a="addSupplier">+ Msambazaji mpya</button>
    <h3 style="margin-top:10px">Ongeza bidhaa</h3><div class="form" id="puL">
    <label class="full">Bidhaa<select name="pid">${opts(D.products.filter(p=>p.active!==false).sort((a,b)=>a.jina.localeCompare(b.jina)).map(p=>[p.id,p.jina+" (stoo "+fq(p.stoo,p)+")"]),"","-- Chagua --")}</select></label>
    ${feat("pakiti")?`<label>Unaingiza kwa<select name="unit"><option value="base">Kipimo kidogo (pc, chupa...)</option><option value="pack">Pakiti/Katoni/Boksi/Kreti</option></select></label>`:""}
    <label>Idadi<input name="qty" type="number" inputmode="decimal" min="0" step="any"></label>
    <label>Bei ya kununua kwa kipimo ulichochagua<input name="cost" type="number" inputmode="decimal" min="0" step="any"></label>
    ${feat("batch")?`<label>Batch<input name="batch"></label><label>Expiry<input name="exp" type="date"></label>`:""}
    </div><button class="btn sec" data-a="purAdd" style="margin-top:8px">+ Weka kwenye orodha</button>
    ${pur.lines.length?table(["Bidhaa",{t:"Idadi",n:1},{t:"Bei",n:1},{t:"Jumla",n:1},""],pur.lines.map((l,i)=>{const p=prod(l.pid);return `<tr><td>${esc(p?p.jina:"?")}${l.batch?`<div class="muted">${esc(l.batch)} ${fd(l.exp)}</div>`:""}</td><td class="n">${fq(l.qty,p)}</td><td class="n">${fm(l.cost)}</td><td class="n">${fm(num(l.qty)*num(l.cost))}</td><td><button class="btn ghost sm" data-a="purRm" data-i="${i}">&times;</button></td></tr>`}),`<tr><th colspan="3">JUMLA</th><th class="n">${fm(tot)}</th><th></th></tr>`)
    +`<div class="form" id="puP" style="margin-top:10px"><label>Njia ya malipo<select name="njia">${opts(NJIA_MALIPO.filter(n=>n!=="Mkopo"),pur.njia)}</select></label>
    <label>Kiasi ulicholipa sasa (kilichobaki ni deni)<input name="kulipwa" type="number" min="0" value="${esc(pur.kulipwa===""?tot:pur.kulipwa)}"></label></div>
    <button class="btn big acc" style="margin-top:10px" data-a="purSave">&#10003; Hifadhi manunuzi (${fm(tot)})</button>`:""}
  </div>
  <h3>Manunuzi ya karibuni</h3>${table(["Tarehe","Msambazaji",{t:"Jumla",n:1},{t:"Deni",n:1}],recent.map(p=>`<tr><td>${ft(p.t)}<div class="muted">${p.items.length} bidhaa${p.ankara?" &middot; "+esc(p.ankara):""}</div></td><td>${esc((D.suppliers.find(s=>s.id===p.supplier)||{}).jina||"-")}</td><td class="n">${fm(p.jumla)}</td><td class="n">${num(p.deni)?fm(p.deni):"-"}</td></tr>`))}`;
};

/* ---------------------------------------------------------------- MATUMIZI */
R.matumizi=()=>{
  const [a,b,lbl]=period(state.p,state.a,state.b),ex=D.expenses.filter(e=>inRange(e.t,a,b)&&(isOwner()||e.user===ME.id)).slice().reverse();
  return `<h2>Matumizi</h2><div class="card"><div class="form" id="exF">
    <label>Aina<select name="kundi">${opts(KUNDI_MATUMIZI)}</select></label><label>Kiasi (TSh)<input name="kiasi" type="number" inputmode="decimal" min="0"></label>
    <label>Njia ya malipo<select name="njia">${opts(NJIA_MALIPO.filter(n=>n!=="Mkopo"))}</select></label><label>Maelezo<input name="maelezo" placeholder="mf. LUKU, nauli ya mzigo"></label></div>
    <button class="btn" style="margin-top:10px" data-a="saveExpense">Hifadhi matumizi</button></div>
  ${periodBar("pExp")}<p class="muted">${lbl}: jumla <b>${fm(ex.reduce((t,e)=>t+num(e.kiasi),0))}</b></p>
  ${table(["Tarehe","Aina",{t:"Kiasi",n:1},""],ex.map(e=>`<tr><td>${ft(e.t)}<div class="muted">${esc(userName(e.user))}</div></td><td>${esc(e.kundi)}<div class="muted">${esc(e.maelezo||"")} &middot; ${esc(e.njia||"Taslimu")}</div></td><td class="n">${fm(e.kiasi)}</td><td>${isOwner()?`<button class="btn ghost sm" data-a="delExpense" data-id="${e.id}">&times;</button>`:""}</td></tr>`))}`;
};

/* ---------------------------------------------------------------- WATEJA */
R.wateja=()=>{
  const cs=D.customers.map(c=>({c,b:custBalance(c.id)})).sort((x,y)=>y.b-x.b),tot=cs.reduce((t,x)=>t+Math.max(0,x.b),0);
  return `<div class="row"><h2 style="margin:0">Wateja na Madeni</h2><button class="btn right" data-a="addCustomer">+ Mteja</button></div>
  <div class="grid kpis" style="margin:10px 0">${kpi("Jumla ya madeni unayodai",fm(tot),tot?"warn":"")}${kpi("Wateja",cs.length)}</div>
  <div class="list">${cs.map(({c,b})=>{const o=b>0?custOldestDebt(c.id):null,age=o?daysBetween(o,todayISO()):0;return `<div class="it" data-a="go" data-v="mteja" data-id="${c.id}"><div><div class="nm">${esc(c.jina)}</div><div class="sb">${esc(c.simu||"")}${num(c.kikomo)?" &middot; kikomo "+fm(c.kikomo):""}${o?` &middot; <span style="color:${age>num(D.settings.debtDays)?"var(--red)":"inherit"}">siku ${age}</span>`:""}</div></div>
  <div class="pr" style="color:${b>0?"var(--red)":"inherit"}">${fm(b)}<small>${b>0?"deni":b<0?"ana salio":"hana deni"}</small></div></div>`}).join("")||`<div class="empty">Bado hakuna wateja.</div>`}</div>`;
};
R.mteja=()=>{
  const c=D.customers.find(x=>x.id===state.id);if(!c)return back("wateja");
  const b=custBalance(c.id),rows=[];
  for(const s of activeSales().filter(s=>s.mteja===c.id))rows.push({t:s.t,d:"Mauzo #"+s.no+" ("+s.items.length+" bidhaa)",deni:num(s.deni),lipa:0,s});
  for(const p of D.payments.filter(p=>p.type==="mteja"&&p.ref===c.id))rows.push({t:p.t,d:"Malipo ("+p.njia+")"+(p.maelezo?" "+p.maelezo:""),deni:0,lipa:num(p.kiasi)});
  rows.sort((x,y)=>x.t.localeCompare(y.t));let run=0;
  return `${back("wateja","Wateja")}<div class="card"><h2>${esc(c.jina)}</h2><p class="muted">${esc(c.simu||"")} ${esc(c.maelezo||"")}</p>
  <div class="grid kpis">${kpi("Deni la sasa",fm(b),b>0?"bad":"")}${kpi("Kikomo",num(c.kikomo)?fm(c.kikomo):"-")}</div>
  ${can("debtPay")&&b>0?`<div class="form" id="dpF" style="margin-top:10px"><label>Kiasi analipa<input name="kiasi" type="number" inputmode="decimal" min="0" value="${b}"></label><label>Njia<select name="njia">${opts(NJIA_MALIPO.filter(n=>n!=="Mkopo"))}</select></label></div>
  <button class="btn acc" style="margin-top:8px" data-a="payDebt" data-id="${c.id}">Pokea malipo</button>`:""}
  <div class="row" style="margin-top:10px">${c.simu&&b>0?`<a class="btn sec sm" target="_blank" rel="noopener" href="https://wa.me/${waNum(c.simu)}?text=${encodeURIComponent(`Habari ${c.jina}, salamu kutoka ${D.setup.jina}. Deni lako ni TSh ${fm(b)}. Tafadhali lipa${D.setup.simu?" (simu "+D.setup.simu+")":""}. Asante.`)}">WhatsApp kumkumbusha</a>`:""}
  ${isOwner()?`<button class="btn sec sm" data-a="editCustomer" data-id="${c.id}">Badilisha</button><button class="btn sec sm" data-a="printStatement" data-id="${c.id}">PDF ya taarifa</button>`:""}</div></div>
  <div id="stmtC">${table(["Tarehe","Maelezo",{t:"Deni",n:1},{t:"Malipo",n:1},{t:"Salio",n:1}],rows.map(r=>{run+=r.deni-r.lipa;return `<tr><td>${ft(r.t)}</td><td>${esc(r.d)}</td><td class="n">${r.deni?fm(r.deni):""}</td><td class="n">${r.lipa?fm(r.lipa):""}</td><td class="n">${fm(run)}</td></tr>`}))}</div>`;
};
function waNum(s){let d=String(s||"").replace(/\D/g,"");if(d.startsWith("0"))d="255"+d.slice(1);else if(d.length===9)d="255"+d;return d}

/* ---------------------------------------------------------------- WASAMBAZAJI */
R.wasambazaji=()=>{
  return `<div class="row"><h2 style="margin:0">Wasambazaji</h2><button class="btn right" data-a="addSupplier">+ Msambazaji</button></div>
  <div class="list" style="margin-top:10px">${D.suppliers.map(s=>{const b=suppBalance(s.id);return `<div class="it" data-a="supplierDlg" data-id="${s.id}"><div><div class="nm">${esc(s.jina)}</div><div class="sb">${esc(s.simu||"")} &middot; manunuzi ${D.purchases.filter(p=>p.supplier===s.id).length}</div></div>
  <div class="pr" style="color:${b>0?"var(--red)":"inherit"}">${fm(b)}<small>${b>0?"unadaiwa":"hakuna deni"}</small></div></div>`}).join("")||`<div class="empty">Bado hakuna wasambazaji.</div>`}</div>`;
};

/* ---------------------------------------------------------------- HESABU YA STOO */
R.hesabu=()=>{
  const q=(state.q||"").toLowerCase(),ps=D.products.filter(p=>p.active!==false&&(!q||p.jina.toLowerCase().includes(q))).sort((a,b)=>a.jina.localeCompare(b.jina));
  return `<h2>Hesabu ya Stoo</h2><p class="muted">Hesabu bidhaa zilizopo kweli, andika idadi. Acha tupu kama hujahesabu. Tofauti itarekodiwa kama upotevu au ziada.</p>
  <div class="search"><input id="qh" placeholder="&#128269; Tafuta" value="${esc(state.q||"")}"></div>
  ${table(["Bidhaa",{t:"Mfumo",n:1},{t:"Ulizohesabu",n:1}],ps.map(p=>`<tr><td>${esc(p.jina)}</td><td class="n">${fq(p.stoo,p)}</td><td class="n"><input type="number" inputmode="decimal" step="any" min="0" data-cnt="${p.id}" value="${esc((state.cnt||{})[p.id]??"")}" style="max-width:110px;text-align:right"></td></tr>`))}
  <button class="btn big" style="margin-top:12px" data-a="saveCount">Hifadhi hesabu</button>`;
};

/* ---------------------------------------------------------------- MAREKEBISHO / UPOTEVU */
R.marekebisho=()=>{
  const [a,b,lbl]=period(state.p,state.a,state.b),adj=D.adjustments.filter(x=>inRange(x.t,a,b)).slice().reverse();
  const loss=adj.filter(x=>num(x.qty)<0).reduce((t,x)=>t-num(x.qty)*num(x.cost),0),gain=adj.filter(x=>num(x.qty)>0).reduce((t,x)=>t+num(x.qty)*num(x.cost),0);
  return `<h2>Upotevu na Marekebisho</h2><div class="card"><div class="form" id="adF">
    <label class="full">Bidhaa<select name="pid">${opts(D.products.slice().sort((a,b)=>a.jina.localeCompare(b.jina)).map(p=>[p.id,p.jina+" (stoo "+fq(p.stoo,p)+")"]),state.pid||"","-- Chagua --")}</select></label>
    <label>Aina<select name="dir"><option value="-1">Punguza (imepotea / imeharibika)</option><option value="1">Ongeza (ziada imeonekana)</option></select></label>
    <label>Idadi<input name="qty" type="number" inputmode="decimal" min="0" step="any"></label>
    <label>Sababu<select name="sababu">${opts(SABABU_MAREKEBISHO.slice(1))}</select></label><label>Maelezo<input name="maelezo"></label></div>
    <button class="btn" style="margin-top:10px" data-a="saveAdj">Hifadhi</button>
    ${feat("batch")&&D.products.some(p=>expiredQty(p)>0)?`<button class="btn sec" style="margin-top:10px" data-a="writeOffExpired">Ondoa dawa zote zilizoisha muda</button>`:""}</div>
  ${periodBar("pAdj")}<div class="grid kpis">${kpi("Upotevu ("+lbl+")",fm(loss),loss?"bad":"")}${kpi("Ziada",fm(gain))}</div>
  ${table(["Tarehe","Bidhaa",{t:"Idadi",n:1},{t:"Thamani",n:1}],adj.map(x=>{const p=prod(x.pid);return `<tr><td>${ft(x.t)}<div class="muted">${esc(x.u||"")}</div></td><td>${esc(p?p.jina:x.jina||"?")}<div class="muted">${esc(x.sababu)} ${esc(x.maelezo||"")}</div></td><td class="n" style="color:${num(x.qty)<0?"var(--red)":"inherit"}">${fq(x.qty)}</td><td class="n">${fm(num(x.qty)*num(x.cost))}</td></tr>`}))}`;
};

/* ---------------------------------------------------------------- FUNGA SIKU */
R.funga=()=>{
  const day=state.day||todayISO(),f=cashFlows(day),op=openingCash(day),exp=expectedCash(day),mob=mobileByMethod(day),own=isOwner();
  const done=D.closings.find(c=>c.date===day),ss=activeSales().filter(s=>dayOf(s.t)===day);
  const hist=D.closings.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,30);
  return `<h2>Funga Siku</h2><div class="row" style="margin-bottom:10px"><input type="date" id="fDay" value="${day}" max="${todayISO()}" style="max-width:170px"><span class="muted">${ss.length} mauzo</span></div>
  ${own?`<div class="card"><table class="stmt"><tr><td>Pesa ya kuanzia (iliyobaki jana)</td><td>${fm(op)}</td></tr><tr><td>+ Taslimu iliyoingia</td><td>${fm(f.inn)}</td></tr><tr><td>&minus; Taslimu iliyotoka (matumizi, manunuzi, malipo)</td><td>${fm(f.out)}</td></tr>
    <tr class="big"><td>Inatakiwa kuwepo droo</td><td>${fm(exp)}</td></tr></table>
    ${Object.keys(mob).length?`<h3 style="margin-top:10px">Pesa za simu/benki (hazipo droo)</h3><table class="stmt">${Object.entries(mob).map(([k,v])=>`<tr><td>${esc(k)}</td><td>${fm(v)}</td></tr>`).join("")}</table>`:""}</div>`
  :`<div class="info">Hesabu pesa taslimu yote iliyopo kwenye droo, kisha andika hapa. Mfumo utailinganisha na mauzo.</div>`}
  ${done?`<div class="card alert ${num(done.diff)<-num(D.settings.cashThreshold)?"bad":num(done.diff)<0?"warn":"ok"}">Siku hii imefungwa na ${esc(userName(done.user))} ${ft(done.t)}.
    ${own?`<br>Iliyohesabiwa: <b>${fm(done.counted)}</b> &middot; Tofauti: <b>${fm(done.diff)}</b> ${num(done.diff)<0?"(UPUNGUFU)":num(done.diff)>0?"(ziada)":"(sawa)"} &middot; Imekabidhiwa: ${fm(done.handed)}`:""}</div>`:""}
  ${!done||own?`<div class="card"><div class="form" id="clF"><label>Pesa taslimu uliyohesabu droo<input name="counted" type="number" inputmode="decimal" min="0" value="${done?esc(done.counted):""}"></label>
    <label>Kiasi kilichokabidhiwa/kupelekwa benki (kinatoka droo)<input name="handed" type="number" inputmode="decimal" min="0" value="${done?esc(done.handed):""}"></label>
    <label class="full">Maelezo (hiari)<input name="maelezo" value="${done?esc(done.maelezo||""):""}"></label></div>
    <button class="btn big acc" style="margin-top:10px" data-a="closeDay" data-day="${day}">${done?"Sahihisha":"Funga siku"}</button></div>`:""}
  ${own?`<h3>Historia</h3>${table(["Tarehe","Muuzaji",{t:"Inatakiwa",n:1},{t:"Iliyohesabiwa",n:1},{t:"Tofauti",n:1}],hist.map(c=>`<tr><td>${fd(c.date)}</td><td>${esc(userName(c.user))}</td><td class="n">${fm(c.expected)}</td><td class="n">${fm(c.counted)}</td><td class="n" style="color:${num(c.diff)<0?"var(--red)":"inherit"};font-weight:700">${fm(c.diff)}</td></tr>`))}`:""}`;
};

/* ---------------------------------------------------------------- MAUZO YALIYOPITA */
R.mauzoList=()=>{
  const [a,b,lbl]=period(state.p,state.a,state.b);
  const ss=D.sales.filter(s=>inRange(s.t,a,b)&&(isOwner()||s.user===ME.id)).slice().reverse(),act=ss.filter(s=>!s.voided);
  return `<h2>Mauzo yaliyopita</h2>${periodBar("pSales")}
  <p class="muted">${lbl}: mauzo ${act.length}, jumla <b>${fm(act.reduce((t,s)=>t+saleGoods(s),0))}</b></p>
  <div class="list">${ss.map(s=>`<div class="it" data-a="showReceipt" data-id="${s.id}"><div><div class="nm">#${s.no} ${s.voided?`<span class="chip bad">imefutwa</span>`:""} ${num(s.deni)>0?`<span class="chip warn">mkopo</span>`:""}</div>
    <div class="sb">${ft(s.t)} &middot; ${esc(userName(s.user))} &middot; ${esc(s.njia)}${s.mteja?" &middot; "+esc((D.customers.find(c=>c.id===s.mteja)||{}).jina||""):""}</div><div class="sb">${s.items.map(i=>esc(i.jina)).join(", ").slice(0,90)}</div></div>
    <div class="pr" style="${s.voided?"text-decoration:line-through;color:var(--mut)":""}">${fm(s.jumla)}</div></div>`).join("")||`<div class="empty">Hakuna mauzo.</div>`}</div>`;
};
function receiptHTML(s,isQuote){
  const c=D.customers.find(x=>x.id===s.mteja);
  return `<div class="receipt" id="rcpt"><div style="text-align:center"><b style="font-size:16px">${esc(D.setup.jina)}</b><br>${esc(D.setup.mahali||"")}${D.setup.simu?"<br>Simu: "+esc(D.setup.simu):""}${D.setup.tin?"<br>TIN: "+esc(D.setup.tin):""}</div>
  <div style="text-align:center;margin:6px 0;font-weight:700">${isQuote?"PROFORMA INVOICE #"+s.no:"RISITI #"+s.no}</div>
  <div>${ft(s.t)} &middot; ${esc(userName(s.user))}${c?"<br>Mteja: "+esc(c.jina):s.mtejaJina?"<br>Mteja: "+esc(s.mtejaJina):""}</div><hr>
  <table>${s.items.map(i=>`<tr><td>${esc(i.jina)}<br><span class="muted">${fq(i.n)} ${esc(i.unitName||i.kipimo)} x ${fm(i.price)}</span></td><td class="n">${fm(i.total)}</td></tr>`).join("")}</table><hr>
  <table>${num(s.punguzo)?`<tr><td>Punguzo</td><td class="n">-${fm(s.punguzo)}</td></tr>`:""}${num(s.amana)?`<tr><td>Amana ya chupa</td><td class="n">${fm(s.amana)}</td></tr>`:""}
  <tr><td><b>JUMLA</b></td><td class="n"><b>${fm(s.jumla)}</b></td></tr>
  ${isQuote?"":`<tr><td>Amelipa (${esc(s.njia)})</td><td class="n">${fm(num(s.kulipwa)+num(s.chenji))}</td></tr>${num(s.chenji)?`<tr><td>Chenji</td><td class="n">${fm(s.chenji)}</td></tr>`:""}${num(s.deni)?`<tr><td><b>Deni</b></td><td class="n"><b>${fm(s.deni)}</b></td></tr>`:""}`}</table>
  ${s.cheti?`<div class="muted">Cheti: ${esc(s.cheti)}</div>`:""}${isQuote?`<div class="muted">Bei hizi ni halali kwa siku 14.</div>`:""}
  <hr><div style="text-align:center">${esc(D.settings.receiptFooter||"")}</div>${s.voided?`<div style="text-align:center;color:var(--red);font-weight:800">IMEFUTWA: ${esc(s.voided.sababu||"")}</div>`:""}</div>`;
}
function receiptText(s,isQuote){
  return `*${D.setup.jina}*\n${isQuote?"PROFORMA #":"Risiti #"}${s.no} - ${ft(s.t)}\n`+s.items.map(i=>`${i.jina}: ${fq(i.n)} x ${fm(i.price)} = ${fm(i.total)}`).join("\n")+
    (num(s.punguzo)?`\nPunguzo: -${fm(s.punguzo)}`:"")+(num(s.amana)?`\nAmana ya chupa: ${fm(s.amana)}`:"")+`\n*JUMLA: TSh ${fm(s.jumla)}*`+(isQuote?"":(num(s.deni)?`\nDeni: ${fm(s.deni)}`:""))+`\n${D.settings.receiptFooter||""}`;
}

/* ---------------------------------------------------------------- PROFORMA */
R.proforma=()=>`<h2>Proforma / Nukuu za bei</h2><p class="muted">Tengeneza proforma kwenye kikapu: ongeza bidhaa, kisha bonyeza "Tengeneza Proforma".</p>
  <div class="list">${D.quotes.slice().reverse().map(q=>`<div class="it" data-a="showQuote" data-id="${q.id}"><div><div class="nm">#${q.no} ${esc(q.mtejaJina||"")} ${q.status==="imeuzwa"?`<span class="chip ok">imeuzwa</span>`:""}</div><div class="sb">${ft(q.t)} &middot; ${q.items.length} bidhaa</div></div><div class="pr">${fm(q.jumla)}</div></div>`).join("")||`<div class="empty">Bado hakuna proforma.</div>`}</div>`;

/* ---------------------------------------------------------------- CHUPA */
R.chupa=()=>{
  const dep=D.bottles.filter(b=>b.type==="deposit").reduce((t,b)=>t+num(b.kiasi),0),ref=D.bottles.filter(b=>b.type==="refund").reduce((t,b)=>t+num(b.kiasi),0);
  const withAm=D.products.filter(p=>num(p.amana)>0);
  return `<h2>Chupa Tupu</h2><div class="grid kpis">${kpi("Chupa tupu zilizopo dukani",fm(D.chupa.tupu))}${kpi("Amana iliyo mikononi mwako (deni kwa wateja)",fm(dep-ref),dep-ref>0?"warn":"")}</div>
  <div class="card" style="margin-top:10px"><div class="form" id="chF">
    <label>Shughuli<select name="type"><option value="refund">Mteja amerudisha chupa, mrudishie amana</option><option value="in">Chupa tupu zimeingia (bila kurudisha pesa)</option><option value="return">Zimerudishwa kwa msambazaji / kiwandani</option></select></label>
    <label>Bidhaa (amana)<select name="pid">${opts(withAm.map(p=>[p.id,p.jina+" ("+fm(p.amana)+")"]))}</select></label>
    <label>Idadi ya chupa<input name="qty" type="number" min="0" step="1"></label><label>Maelezo<input name="maelezo"></label></div>
    <button class="btn" style="margin-top:10px" data-a="saveBottle">Hifadhi</button>
    ${withAm.length?"":`<p class="muted">Weka "Amana ya chupa" kwenye bidhaa (mf. bia, soda) ili mfumo uhesabu.</p>`}</div>
  ${table(["Tarehe","Shughuli",{t:"Chupa",n:1},{t:"Pesa",n:1}],D.bottles.slice(-40).reverse().map(b=>`<tr><td>${ft(b.t)}</td><td>${{deposit:"Amana imelipwa (mauzo)",refund:"Amana imerudishwa",in:"Zimeingia",return:"Zimerudishwa kiwandani",sale_in:"Zimeletwa wakati wa kununua"}[b.type]||b.type}<div class="muted">${esc(b.maelezo||"")}</div></td><td class="n">${fm(b.qty)}</td><td class="n">${b.kiasi?fm(b.kiasi):""}</td></tr>`))}`;
};

/* ---------------------------------------------------------------- RIPOTI */
R.ripoti=()=>{
  const [a,b,lbl]=period(state.p,state.a,state.b),S=summary(a,b),tab=state.t||"muhtasari",V=stockValue();
  const tabs=[["muhtasari","Faida na Hasara"],["mauzo","Mauzo"],["bidhaa","Bidhaa"],["stoo","Stoo"],["madeni","Madeni"],["pesa","Pesa / Droo"],["watumiaji","Wauzaji"]];
  let body="";
  if(tab==="muhtasari")body=`<div class="grid kpis">${kpi("Mauzo",fm(S.mauzo))}${kpi("Faida ghafi",fm(S.ghafi),S.ghafi<0?"bad":"")}${kpi("Matumizi",fm(S.matumizi))}${kpi("Faida halisi",fm(S.halisi),S.halisi<0?"bad":"good")}</div>
    <table class="stmt" style="margin-top:10px"><tr class="sec"><td colspan="2">TAARIFA YA FAIDA NA HASARA</td></tr><tr><td>Mauzo (baada ya punguzo)</td><td>${fm(S.mauzo)}</td></tr><tr><td>&minus; Gharama ya bidhaa zilizouzwa</td><td>${fm(S.gharama)}</td></tr>
    <tr class="big"><td>Faida ghafi</td><td>${fm(S.ghafi)}</td></tr>${Object.entries(S.byExp).map(([k,v])=>`<tr><td>&minus; ${esc(k)}</td><td>${fm(v)}</td></tr>`).join("")}
    <tr><td>&minus; Upotevu wa bidhaa</td><td>${fm(S.upotevu)}</td></tr>${S.ziada?`<tr><td>+ Ziada ya stoo</td><td>${fm(S.ziada)}</td></tr>`:""}<tr class="big"><td>${S.halisi<0?"HASARA":"FAIDA HALISI"}</td><td>${fm(S.halisi)}</td></tr>
    <tr><td>Upungufu wa pesa droo (haujajumuishwa juu)</td><td style="color:${S.pungufu<0?"var(--red)":"inherit"}">${fm(S.pungufu)}</td></tr></table>
    ${S.mauzo?`<p class="muted">Kiwango cha faida ghafi: ${(S.ghafi/S.mauzo*100).toFixed(1)}% ya mauzo.</p>`:""}
    ${S.below.length?`<div class="alert bad">Bidhaa ${S.below.length} ziliuzwa chini ya gharama: ${S.below.slice(0,10).map(x=>esc(x.i.jina)+" ("+fm(num(x.i.total)/num(x.i.qty))+" &lt; "+fm(x.i.cost)+", "+esc(userName(x.s.user))+")").join("; ")}</div>`:""}`;
  if(tab==="mauzo")body=`<div class="grid kpis">${kpi("Idadi ya mauzo",S.ss.length)}${kpi("Mauzo",fm(S.mauzo))}${kpi("Mikopo mipya",fm(S.deniJipya))}${kpi("Madeni yaliyolipwa",fm(S.malipoMadeni))}</div>
    <h3>Kwa njia ya malipo</h3>${table(["Njia",{t:"Kiasi",n:1}],Object.entries(S.byNjia).map(([k,v])=>`<tr><td>${esc(k)}</td><td class="n">${fm(v)}</td></tr>`))}
    <h3>Kwa siku</h3>${table(["Tarehe",{t:"Mauzo",n:1},{t:"Faida ghafi",n:1}],Object.entries(S.ss.reduce((o,s)=>{const d=dayOf(s.t);o[d]=o[d]||[0,0];o[d][0]+=saleGoods(s);o[d][1]+=saleGoods(s)-saleCost(s);return o},{})).sort().reverse().map(([d,v])=>`<tr><td>${fd(d)}</td><td class="n">${fm(v[0])}</td><td class="n">${fm(v[1])}</td></tr>`))}
    ${S.voids.length?`<h3>Mauzo yaliyofutwa</h3>${table(["#","Aliyefuta","Sababu",{t:"Kiasi",n:1}],S.voids.map(s=>`<tr><td>${s.no}</td><td>${esc(s.voided.u)}</td><td>${esc(s.voided.sababu)}</td><td class="n">${fm(s.jumla)}</td></tr>`))}`:""}`;
  if(tab==="bidhaa"){const arr=Object.values(S.byProd).sort((x,y)=>y.mauzo-x.mauzo);body=`<h3>Bidhaa zilizouzwa</h3>${table(["Bidhaa",{t:"Idadi",n:1},{t:"Mauzo",n:1},{t:"Faida",n:1}],arr.map(x=>`<tr><td>${esc(x.jina)}</td><td class="n">${fq(x.qty)} ${esc(x.kipimo||"")}</td><td class="n">${fm(x.mauzo)}</td><td class="n" style="color:${x.faida<0?"var(--red)":"inherit"}">${fm(x.faida)}</td></tr>`))}
    ${(()=>{const sold=new Set(Object.keys(S.byProd)),dead=D.products.filter(p=>p.active!==false&&num(p.stoo)>0&&!sold.has(p.id));return dead.length?`<h3>Hazikuuzwa kipindi hiki (zimekaa stoo)</h3>${table(["Bidhaa",{t:"Stoo",n:1},{t:"Thamani",n:1}],dead.map(p=>`<tr><td>${esc(p.jina)}</td><td class="n">${fq(p.stoo,p)}</td><td class="n">${fm(num(p.stoo)*num(p.bei_kununua))}</td></tr>`))}`:""})()}`}
  if(tab==="stoo")body=`<div class="grid kpis">${kpi("Thamani (gharama)",fm(V.c))}${kpi("Thamani (bei ya kuuza)",fm(V.r))}${kpi("Faida inayotarajiwa",fm(V.r-V.c))}</div>
    ${table(["Bidhaa",{t:"Stoo",n:1},{t:"Gharama",n:1},{t:"Thamani",n:1}],D.products.slice().sort((x,y)=>num(y.stoo)*num(y.bei_kununua)-num(x.stoo)*num(x.bei_kununua)).map(p=>`<tr><td>${esc(p.jina)}</td><td class="n">${fq(p.stoo,p)}</td><td class="n">${fm(p.bei_kununua)}</td><td class="n">${fm(Math.max(0,num(p.stoo))*num(p.bei_kununua))}</td></tr>`))}
    <h3>Upotevu na marekebisho (${esc(lbl)})</h3>${table(["Tarehe","Bidhaa","Sababu",{t:"Thamani",n:1}],S.adj.map(x=>`<tr><td>${fd(x.t)}</td><td>${esc((prod(x.pid)||{}).jina||"")}</td><td>${esc(x.sababu)}</td><td class="n">${fm(num(x.qty)*num(x.cost))}</td></tr>`))}`;
  if(tab==="madeni"){const cs=D.customers.map(c=>[c,custBalance(c.id)]).filter(x=>x[1]>0),ss=D.suppliers.map(s=>[s,suppBalance(s.id)]).filter(x=>x[1]>0);
    body=`<div class="grid kpis">${kpi("Unadai wateja",fm(cs.reduce((t,x)=>t+x[1],0)))}${kpi("Unadaiwa",fm(ss.reduce((t,x)=>t+x[1],0)))}</div>
    <h3>Wateja wanaodaiwa</h3>${table(["Mteja","Simu",{t:"Siku",n:1},{t:"Deni",n:1}],cs.map(([c,b])=>{const o=custOldestDebt(c.id);return `<tr><td>${esc(c.jina)}</td><td>${esc(c.simu||"")}</td><td class="n">${o?daysBetween(o,todayISO()):""}</td><td class="n">${fm(b)}</td></tr>`}))}
    <h3>Wasambazaji unaowadai</h3>${table(["Msambazaji",{t:"Deni",n:1}],ss.map(([s,b])=>`<tr><td>${esc(s.jina)}</td><td class="n">${fm(b)}</td></tr>`))}`}
  if(tab==="pesa")body=`<div class="grid kpis">${kpi("Upungufu wa droo",fm(S.pungufu),S.pungufu<0?"bad":"")}${kpi("Siku zilizofungwa",S.cl.length)}</div>
    ${table(["Tarehe","Muuzaji",{t:"Inatakiwa",n:1},{t:"Hesabu",n:1},{t:"Tofauti",n:1},{t:"Kabidhi",n:1}],S.cl.slice().sort((x,y)=>y.date.localeCompare(x.date)).map(c=>`<tr><td>${fd(c.date)}</td><td>${esc(userName(c.user))}</td><td class="n">${fm(c.expected)}</td><td class="n">${fm(c.counted)}</td><td class="n" style="color:${num(c.diff)<0?"var(--red)":"inherit"}">${fm(c.diff)}</td><td class="n">${fm(c.handed)}</td></tr>`))}`;
  if(tab==="watumiaji")body=table(["Muuzaji",{t:"Mauzo",n:1},{t:"Kiasi",n:1}],Object.entries(S.byUser).map(([u,v])=>`<tr><td>${esc(u)}</td><td class="n">${v.n}</td><td class="n">${fm(v.t)}</td></tr>`))+
    `<h3>Tofauti za droo kwa muuzaji</h3>`+table(["Muuzaji",{t:"Tofauti",n:1}],Object.entries(S.cl.reduce((o,c)=>{const u=userName(c.user);o[u]=(o[u]||0)+num(c.diff);return o},{})).map(([u,v])=>`<tr><td>${esc(u)}</td><td class="n" style="color:${v<0?"var(--red)":"inherit"}">${fm(v)}</td></tr>`));
  return `<div class="row"><h2 style="margin:0">Ripoti</h2><button class="btn sec sm right" data-a="pdfReport">&#128196; Hifadhi PDF</button><button class="btn sec sm" data-a="xlsReport">Excel</button></div>
  ${periodBar("pRep")}<div class="tabs">${tabs.map(([k,t])=>`<button class="${tab===k?"on":""}" data-a="repTab" data-t="${k}">${t}</button>`).join("")}</div>
  <div id="repBody"><p class="muted">${esc(lbl)}</p>${body}</div>`;
};

/* ---------------------------------------------------------------- WATUMIAJI */
R.watumiaji=()=>`<div class="row"><h2 style="margin:0">Watumiaji</h2><button class="btn right" data-a="userForm">+ Muuzaji</button></div>
  <p class="muted">Muuzaji anaweza kuuza, kupokea madeni, kurekodi matumizi${D.settings.sellerExpenses?"":" (imezimwa)"} na kufunga siku. Haoni faida wala bei ya kununua, hawezi kufuta mauzo wala kubadilisha bei za bidhaa.</p>
  <div class="list">${D.users.map(u=>`<div class="it" data-a="userForm" data-id="${u.id}"><div><div class="nm">${u.role==="mwenye"?"&#128081;":"&#128100;"} ${esc(u.jina)} ${u.active===false?`<span class="chip">amezimwa</span>`:""}</div><div class="sb">${u.role==="mwenye"?"Mwenye duka":"Muuzaji"}${u.simu?" &middot; "+esc(u.simu):""}</div></div><div class="pr">${activeSales().filter(s=>s.user===u.id).length}<small>mauzo</small></div></div>`).join("")}</div>`;

/* ---------------------------------------------------------------- MIPANGILIO */
R.mipangilio=()=>{const s=D.setup,S=D.settings;return `<h2>Mipangilio</h2><div class="card"><h3>Taarifa za duka</h3><div class="form" id="stF">
  <label class="full">Jina la duka<input name="jina" value="${esc(s.jina)}"></label><label>Mwenye duka<input name="mmiliki" value="${esc(s.mmiliki)}"></label>
  <label>Simu<input name="simu" value="${esc(s.simu)}"></label><label>Mahali<input name="mahali" value="${esc(s.mahali)}"></label><label>TIN (hiari)<input name="tin" value="${esc(s.tin)}"></label>
  <label class="full">Ujumbe chini ya risiti<input name="receiptFooter" value="${esc(S.receiptFooter)}"></label></div>
  <h3 style="margin-top:12px">Tahadhari na usalama</h3><div class="form" id="stS">
  <label>Tahadhari ya upungufu wa pesa droo zaidi ya (TSh)<input name="cashThreshold" type="number" min="0" value="${esc(S.cashThreshold)}"></label>
  <label>Deni likizidi siku<input name="debtDays" type="number" min="1" value="${esc(S.debtDays)}"></label>
  ${feat("batch")?`<label>Tahadhari ya expiry kabla ya siku<input name="expiryDays" type="number" min="1" value="${esc(S.expiryDays)}"></label>`:""}
  <label>Funga app baada ya dakika bila kutumika (0 = usifunge)<input name="lockMinutes" type="number" min="0" value="${esc(S.lockMinutes)}"></label>
  <label>Punguzo la juu muuzaji anaruhusiwa (%)<input name="sellerDiscountPct" type="number" min="0" max="100" value="${esc(S.sellerDiscountPct)}"></label>
  <label class="chk"><input type="checkbox" name="sellerExpenses" ${S.sellerExpenses?"checked":""}> Muuzaji anaweza kurekodi matumizi</label>
  <label class="chk"><input type="checkbox" name="sellerSeesStock" ${S.sellerSeesStock?"checked":""}> Muuzaji anaona idadi ya stoo</label></div>
  <button class="btn" style="margin-top:12px" data-a="saveSettings">Hifadhi mipangilio</button></div>
  <div class="card"><h3>Aina ya biashara</h3><p>Sasa: <b>${aina().ikoni} ${esc(aina().jina)}</b></p><div class="form"><label>Badilisha kuwa<select id="newAina">${opts(Object.entries(AINA).map(([k,a])=>[k,a.jina]),s.aina)}</select></label></div>
  <button class="btn sec" style="margin-top:8px" data-a="changeType">Badilisha aina</button><p class="muted">Bidhaa na mauzo hayafutwi; vipengele (expiry, chupa, proforma n.k.) vitabadilika.</p></div>
  <div class="card"><h3 style="color:var(--red)">Hatari</h3><button class="btn sec" style="color:var(--red)" data-a="wipeAll">Futa taarifa zote za duka</button></div>`};

/* ---------------------------------------------------------------- KUMBUKUMBU */
R.kumbukumbu=()=>`<h2>Kumbukumbu (Audit log)</h2><p class="muted">Kila kitendo muhimu kinarekodiwa: nani, lini, nini.</p>
  ${table(["Wakati","Mtumiaji","Kitendo"],D.log.slice(-300).reverse().map(l=>`<tr><td>${ft(l.t)}</td><td>${esc(l.u)}</td><td><b>${esc(l.action)}</b><div class="muted">${esc(l.detail)}</div></td></tr>`))}`;

/* ---------------------------------------------------------------- NAKALA NA EXCEL */
R.nakala=()=>`<h2>Nakala (Backup) na Excel</h2>
  <div class="card"><h3>Nakala ya taarifa zote</h3><p class="muted">Taarifa zako zinakaa kwenye simu hii tu. Pakua nakala angalau kila wiki na uitume WhatsApp/Email kwako mwenyewe. Simu ikiharibika, utarejesha hapa.</p>
  ${D.saved?`<p class="muted">Imehifadhiwa mara ya mwisho: ${ft(D.saved)}</p>`:""}
  <div class="row"><button class="btn" data-a="backup">&#11015; Pakua nakala (.json)</button><button class="btn sec" data-a="restore">&#11014; Rejesha nakala</button></div></div>
  ${can("editProduct")?`<div class="card"><h3>Bidhaa kwa Excel</h3><p class="muted">Pakua template, jaza bidhaa zako kwenye Excel, kisha pakia. Bidhaa yenye jina lililopo itasasishwa.</p>
  <div class="row"><button class="btn sec" data-a="xlsTemplate">Pakua template</button><button class="btn" data-a="xlsImport">Pakia Excel / CSV</button><button class="btn sec" data-a="xlsProducts">Pakua bidhaa zote</button></div></div>
  <div class="card"><h3>Mauzo kwa Excel</h3><button class="btn sec" data-a="xlsSales">Pakua mauzo yote (.xlsx)</button></div>`:""}`;

/* ---------------------------------------------------------------- LESENI */
R.leseni=()=>{
  const L=licStatus(),st={trial:["Majaribio","warn",`Siku ${L.daysLeft} zimebaki (hadi ${fd(L.trialEnd)})`],paid:["Imelipiwa","ok",`Hadi ${fd(L.expiry)} (siku ${L.daysLeft})`],expired:["Imeisha","bad","Lipia ili kuendelea kuuza. Taarifa zako ziko salama."]}[L.state];
  return `<h2>Leseni na Malipo</h2><div class="card alert ${st[1]}"><b>${st[0]}</b><br>${st[2]}</div>
  <div class="card" style="text-align:center"><div class="muted">Namba ya kifaa hiki</div><div class="big-id" id="devId">${devPretty(LIC.dev)}</div>
  <button class="btn ghost sm" data-a="copyDev">Nakili namba</button></div>
  <div class="card"><h3>Jinsi ya kulipia (TSh ${fm(APP.pricePerMonth)} kwa mwezi)</h3><ol style="padding-left:20px;margin:0">
  <li>Tuma <b>TSh ${fm(APP.pricePerMonth)}</b> (au ${fm(APP.pricePerMonth*3)} kwa miezi 3) kwenda <b>${esc(APP.pay.network)} ${esc(APP.pay.number)}</b>, jina <b>${esc(APP.pay.name)}</b>.</li>
  <li>Bonyeza kitufe cha WhatsApp hapa chini. Ujumbe wenye namba ya kifaa chako utajazwa; ongeza <b>Transaction ID</b> ya muamala, kisha tuma.</li>
  <li>Utatumiwa <b>msimbo wa leseni</b> unaoanza na <b>DK1-</b>. Ubandike hapa chini na ubonyeze "Washa".</li></ol>
  <a class="btn big acc" style="margin-top:12px;text-align:center;text-decoration:none;display:block" target="_blank" rel="noopener" href="https://wa.me/${APP.whatsapp}?text=${encodeURIComponent(waMessage())}">&#128172; Tuma WhatsApp</a></div>
  <div class="card"><h3>Weka msimbo</h3><textarea id="licCode" rows="3" placeholder="DK1-..." style="width:100%;font-family:monospace"></textarea>
  <button class="btn big" style="margin-top:8px" data-a="applyCode">&#128273; Washa leseni</button></div>
  ${L.state==="expired"?`<div class="row"><button class="btn sec" data-a="go" data-v="nakala">Pakua nakala ya taarifa</button><button class="btn sec" data-a="lock">Toka</button></div>`:""}
  ${LIC.codes.length?`<p class="muted">Misimbo iliyowekwa: ${LIC.codes.length}</p>`:""}`;
};
