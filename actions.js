"use strict";
/* ================================================================ ACTIONS & INIT */
const ask=(title,msg,act,attrs,yes)=>dlg(title,`<p>${msg}</p>`,`<button class="btn sec" data-a="closeDlg">Hapana</button><button class="btn" data-a="${act}" ${attrs||""}>${yes||"Ndiyo"}</button>`);
const pdfHead=t=>`<div class="pdfhead">${LOGO}<div><b>${esc(D.setup.jina)}</b><br><span class="muted">${esc(t)} &middot; ${ft(nowISO())}</span></div></div>`;
function printDlg(title){
  const old=document.title;document.title=title.replace(/[\\/:*?"<>|]+/g,"_");document.body.classList.add("pm");
  const done=()=>{document.body.classList.remove("pm");document.title=old;window.removeEventListener("afterprint",done)};
  window.addEventListener("afterprint",done);setTimeout(()=>{try{window.print()}catch(e){toast("Kifaa hiki hakiruhusu kuchapisha.")}},60);
}
A.closeDlg=()=>closeDlg();
A.noop=()=>{};
A.go=d=>{closeDlg();go(d.v,{f:d.f,id:d.id,pid:d.pid})};

/* ---------------------------------------------------------------- SETUP */
A.pickType=d=>{state.aina=d.k;render()};
A.setupNext=()=>{if(state.aina){state.step=2;render()}};
A.setupBack=()=>{state.step=1;render()};
A.setupDone=async()=>{
  const v=formVals($("#suF"));
  if(!v.jina)return toast("Andika jina la duka.");if(!v.mmiliki)return toast("Andika jina la mwenye duka.");
  if(!/^\d{4,6}$/.test(v.pin))return toast("PIN iwe tarakimu 4 hadi 6.");if(v.pin!==v.pin2)return toast("PIN hazilingani.");
  const salt=uid(),u={id:uid(),jina:v.mmiliki,simu:v.simu,role:"mwenye",salt,pin:await hashPin(v.pin,salt),active:true};
  D=blank();D.setup={done:true,aina:state.aina,jina:v.jina,mmiliki:v.mmiliki,simu:v.simu,mahali:v.mahali,tin:"",created:nowISO()};D.users=[u];
  ME=u;if(v.mfano)addSamples();logA("Duka limeanzishwa",aina().jina);save();state={};view="mauzo";render();
  dlg("Karibu!",`<p>Duka <b>${esc(v.jina)}</b> liko tayari. Una siku <b>${APP.trialDays}</b> za majaribio bure.</p><p>Hatua zinazofuata:</p><ol style="padding-left:20px"><li>Ongeza bidhaa zako (Bidhaa &rarr; + Bidhaa) au pakia kwa Excel (Zaidi &rarr; Nakala na Excel).</li><li>Ongeza muuzaji kama unaye (Zaidi &rarr; Watumiaji).</li><li>Anza kuuza kwenye Mauzo. Funga siku kila jioni.</li></ol>`);
};
function addSamples(){
  const t=todayISO(),k=D.setup.aina,S={
    rejareja:[["Sukari 1kg","Vyakula","pc",2700,3000,2850,10,"Bunda",20,40,10],["Mafuta ya kupikia 1L","Vyakula","pc",5200,6000,5600,6,"Katoni",12,24,6],["Unga wa sembe 1kg","Vyakula","pc",1500,1800,1650,10,"Bunda",10,30,8],
      ["Sabuni ya unga 500g","Sabuni na Usafi","pc",2100,2500,2300,12,"Katoni",24,48,10],["Soda 350ml","Vinywaji","pc",500,700,600,24,"Kreti",24,48,12],["Daftari 96","Shule na Ofisi","pc",600,800,700,12,"Dazeni",12,5,10]],
    famasi:[["Paracetamol 500mg","Vidonge","strip",300,500,400,10,"Boksi",10,100,20,"PC2401",addDays(t,40)],["Amoxicillin 250mg","Vidonge","strip",900,1500,1200,10,"Boksi",10,60,10,"AM2312",addDays(t,300),1],
      ["ORS","Virutubisho","pc",250,500,400,20,"Boksi",50,80,20,"OR2405",addDays(t,500)],["Cough syrup 100ml","Syrup","chupa",2500,3500,3000,6,"Boksi",12,15,5,"CS2402",addDays(t,200)]],
    hardware:[["Saruji 50kg","Saruji na Mchanga","mfuko",16500,18000,17500,10,"",0,60,15],["Nondo 12mm","Nondo na Chuma","pc",21000,24000,23000,10,"",0,40,10],["Waya wa umeme 2.5mm","Umeme","m",900,1200,1100,100,"Roli",100,300,100,"","",0,1],
      ["Misumari inchi 3","Misumari na Bolti","kg",3800,4500,4200,10,"Boksi",25,50,10,"","",0,1],["Rangi ya maji 4L","Rangi","pc",22000,27000,25000,5,"",0,12,4],["Bati geji 30","Mabati","pc",18000,21000,20000,10,"",0,30,10]],
    vinywaji:[["Bia ya chupa","Bia","chupa",1900,2500,2200,25,"Kreti",25,100,25,"","",0,0,500],["Soda 300ml","Soda","chupa",450,700,550,24,"Kreti",24,96,24,"","",0,0,300],["Maji 500ml","Maji","pc",300,500,400,12,"Pakiti",12,60,12],
      ["Juisi 1L","Juisi","pc",2200,3000,2600,12,"Katoni",12,24,6],["Karanga","Vitafunwa","pc",300,500,400,0,"",0,40,10]]}[k]||[];
  for(const r of S){const [jina,kundi,kipimo,c,rr,j,jk,pj,pi,st,kmin,bno,exp,cheti,des,amana]=r;
    const p={id:uid(),jina,kundi,kipimo,bei_kununua:c,bei_rejareja:rr,bei_jumla:j,jumla_kuanzia:jk||"",pakiti:pi?{jina:pj,idadi:pi}:{jina:aina().pakitiJina,idadi:""},kiwango_chini:kmin,barcode:"",stoo:0,batches:[],active:true,desimali:!!des,amana:amana||"",cheti:!!cheti};
    D.products.push(p);addStock(p,st,c,{no:bno||"-",exp:exp||""});}
}

/* ---------------------------------------------------------------- LOGIN */
let fails=0,lockUntil=0;
A.pickUser=d=>{loginUser=d.id;pinBuf="";render()};
A.pin=async d=>{
  if(Date.now()<lockUntil)return toast("Subiri sekunde "+Math.ceil((lockUntil-Date.now())/1000));
  if(d.k==="c")pinBuf=pinBuf.slice(0,-1);else if(d.k!=="ok"&&pinBuf.length<6)pinBuf+=d.k;
  const u=D.users.find(x=>x.id===loginUser);if(!u)return render();
  if(pinBuf.length>=4&&await hashPin(pinBuf,u.salt)===u.pin){ME=u;pinBuf="";fails=0;lastAct=Date.now();logA("Ameingia","");save();view="mauzo";state={};render();return}
  if(d.k==="ok"||pinBuf.length===6){fails++;pinBuf="";if(fails>=5){lockUntil=Date.now()+30000;fails=0;toast("PIN imekosewa mara 5. Subiri sekunde 30.")}else toast("PIN si sahihi.")}
  render();
};
A.lock=()=>{closeDlg();ME=null;pinBuf="";render()};

/* ---------------------------------------------------------------- POS */
A.kundi=d=>{state.kundi=d.k;render()};
function addToCart(p){
  if(!p)return;
  if(p.active===false)return toast("Bidhaa hii imesitishwa.");
  const inCart=cart.lines.filter(l=>l.pid===p.id).reduce((t,l)=>{const c=lineCalc(l);return t+(c?c.qtyBase:0)},0);
  if(sellable(p)-inCart<1-1e-9&&!(p.desimali&&sellable(p)-inCart>0)){
    return toast(feat("batch")&&expiredQty(p)>0&&num(p.stoo)>0?p.jina+": zilizopo zimeisha muda, haziwezi kuuzwa.":p.jina+" imeisha stoo. Ingiza mzigo kwanza.")}
  const ex=cart.lines.find(l=>l.pid===p.id&&l.unit!=="pack");
  if(ex)ex.n=r2(num(ex.n)+1);else cart.lines.push({pid:p.id,n:1,unit:"base"});
  if(p.cheti)toast(p.jina+": dawa ya cheti. Andika maelezo ya cheti.");else toast(p.jina+" imeongezwa ("+cart.lines.length+")");
}
A.addItem=d=>{addToCart(prod(d.id));render()};
function byBarcode(code){code=String(code).trim();return code?D.products.find(p=>p.barcode&&String(p.barcode).trim()===code):null}
A.cartMode=d=>{cart.mode=d.m;render()};
A.lineUnit=d=>{const l=cart.lines[d.i];l.unit=d.u;l.bei=null;render()};
A.qty=d=>{const l=cart.lines[d.i],p=prod(l.pid);l.n=r2(Math.max(0,num(l.n)+num(d.d)));if(l.n<=0)cart.lines.splice(d.i,1);render()};
A.rmLine=d=>{cart.lines.splice(d.i,1);render()};
A.clearCart=()=>{cart=newCart();go("mauzo")};
A.payMethod=d=>{cart.njia=d.n;if(d.n==="Mkopo")cart.kulipwa="";render()};
A.linePrice=d=>{const l=cart.lines[d.i],c=lineCalc(l);
  const min=isOwner()?0:r2(c.price*(1-num(D.settings.sellerDiscountPct)/100));
  dlg("Bei ya "+c.p.jina,`<div class="form" id="lpF"><label>Bei mpya kwa ${esc(c.unitName)}<input name="bei" type="number" min="${min}" value="${c.price}"></label></div>${!isOwner()?`<p class="muted">Bei ya chini unayoruhusiwa: ${fm(min)}</p>`:`<p class="muted">Gharama: ${fm(c.cost*c.per)}</p>`}`,
    `<button class="btn sec" data-a="closeDlg">Ghairi</button><button class="btn" data-a="setLinePrice" data-i="${d.i}" data-min="${min}">Weka</button>`)};
A.setLinePrice=d=>{const v=num(formVals($("#lpF")).bei);if(v<num(d.min))return toast("Bei iko chini ya kiwango unachoruhusiwa ("+fm(d.min)+").");cart.lines[d.i].bei=v;closeDlg();render()};
function payPreview(){
  const el=$("#chenji");if(!el)return;const T=cartTotals();$("#cTot")&&($("#cTot").textContent=fm(T.jumla));
  if(cart.njia==="Mkopo"){const k=num(cart.kulipwa);el.innerHTML=`Deni litakuwa <b>${fm(T.jumla-k)}</b>`;return}
  const paid=cart.kulipwa===""?T.jumla:num(cart.kulipwa);
  el.innerHTML=paid>=T.jumla?`Chenji: <b style="font-size:18px">${fm(paid-T.jumla)}</b>`:`<span style="color:var(--red)">Pungufu ${fm(T.jumla-paid)}: litakuwa deni la mteja (chagua mteja).</span>`;
}
A.after_kikapu=payPreview;
A.checkout=async()=>{
  const T=cartTotals(),own=isOwner();if(!T.n)return;
  // stock check
  const need={};for(const l of cart.lines){const c=lineCalc(l);if(!c)continue;if(c.qtyBase<=0)return toast("Idadi ya "+c.p.jina+" si sahihi.");need[c.p.id]=(need[c.p.id]||0)+c.qtyBase}
  for(const [pid,q] of Object.entries(need)){const p=prod(pid);if(q>sellable(p)+1e-9)return toast(`Stoo haitoshi: ${p.jina} zimebaki ${fq(sellable(p),p)}${feat("batch")&&expiredQty(p)?" (zilizoisha muda hazihesabiwi)":""}.`)}
  if(!own&&num(cart.punguzo)>T.goods*num(D.settings.sellerDiscountPct)/100+0.01)return toast("Punguzo limezidi kiwango unachoruhusiwa.");
  if(num(cart.punguzo)>T.goods)return toast("Punguzo ni kubwa kuliko bei.");
  const cheti=cart.lines.some(l=>(prod(l.pid)||{}).cheti);if(cheti&&!cart.cheti.trim())return toast("Andika maelezo ya cheti cha daktari.");
  let kulipwa,deni=0,chenji=0,kianzio=0;
  if(cart.njia==="Mkopo"){kianzio=Math.min(num(cart.kulipwa),T.jumla);kulipwa=0;deni=T.jumla}
  else{const paid=cart.kulipwa===""?T.jumla:num(cart.kulipwa);if(paid>=T.jumla){kulipwa=T.jumla;chenji=r2(paid-T.jumla)}else{kulipwa=paid;deni=r2(T.jumla-paid)}}
  const cust=D.customers.find(c=>c.id===cart.mteja);
  if(deni>0&&!cust)return toast("Chagua mteja kwa mauzo ya mkopo / deni.");
  if(cust&&num(cust.kikomo)>0&&custBalance(cust.id)+deni-kianzio>num(cust.kikomo)){if(!own)return toast(cust.jina+" atazidi kikomo cha mkopo ("+fm(cust.kikomo)+"). Mwombe mwenye duka.");toast("Tahadhari: "+cust.jina+" amezidi kikomo cha mkopo.")}
  D.seq.sale++;
  const s={id:uid(),no:D.seq.sale,t:nowISO(),user:ME.id,mode:cart.mode,items:[],punguzo:num(cart.punguzo),amana:T.amana,jumla:T.jumla,njia:cart.njia,kulipwa,deni,chenji,mteja:cart.mteja||"",cheti:cart.cheti||"",rud:0};
  for(const l of cart.lines){const c=lineCalc(l);if(!c)continue;const alloc=takeStock(c.p,c.qtyBase);
    s.items.push({pid:c.p.id,jina:c.p.jina,kipimo:c.p.kipimo,unitName:c.unitName,unit:l.unit,n:num(l.n),qty:c.qtyBase,price:c.price,total:c.total,cost:c.cost,batches:alloc});
    if(feat("chupa")&&num(c.p.amana)>0){const r=Math.min(c.qtyBase,Math.max(0,num(l.rud??c.qtyBase)));s.rud+=r;D.chupa.tupu=r2(num(D.chupa.tupu)+r);if(r)D.bottles.push({id:uid(),t:s.t,type:"sale_in",qty:r,kiasi:0,sale:s.id,maelezo:"Mauzo #"+s.no})}}
  if(T.amana)D.bottles.push({id:uid(),t:s.t,type:"deposit",qty:s.items.reduce((t,i)=>t+(num((prod(i.pid)||{}).amana)>0?num(i.qty):0),0)-s.rud,kiasi:T.amana,sale:s.id,maelezo:"Mauzo #"+s.no});
  D.sales.push(s);
  if(kianzio>0)D.payments.push({id:uid(),t:s.t,user:ME.id,type:"mteja",ref:cust.id,kiasi:kianzio,njia:"Taslimu",maelezo:"Kianzio mauzo #"+s.no,sale:s.id});
  if(cart.quoteId){const q=D.quotes.find(q=>q.id===cart.quoteId);if(q){q.status="imeuzwa";q.sale=s.id}}
  logA("Mauzo #"+s.no,fm(s.jumla)+" "+s.njia+(deni?" deni "+fm(deni):""));save();
  cart=newCart();view="mauzo";state={};render();showReceipt(s);
};
function showReceipt(s){
  const c=D.customers.find(x=>x.id===s.mteja);
  dlg("Risiti #"+s.no,pdfHead("Risiti #"+s.no)+receiptHTML(s),
    `<a class="btn sec" target="_blank" rel="noopener" href="https://wa.me/${c&&c.simu?waNum(c.simu):""}?text=${encodeURIComponent(receiptText(s))}">WhatsApp</a>
     <button class="btn sec" data-a="printReceipt" data-n="${s.no}">PDF / Chapisha</button>
     ${can("void")&&!s.voided?`<button class="btn sec" style="color:var(--red)" data-a="voidSale" data-id="${s.id}">Futa mauzo</button>`:""}
     <button class="btn" data-a="closeDlg">Sawa</button>`);
}
A.showReceipt=d=>{const s=D.sales.find(x=>x.id===d.id);if(s)showReceipt(s)};
A.printReceipt=d=>printDlg("Risiti_"+d.n+"_"+slug());
A.voidSale=d=>dlg("Futa mauzo",`<p>Bidhaa zitarudi stoo na mauzo yataonekana kama yamefutwa kwenye ripoti.</p><div class="form" id="vF"><label>Sababu *<input name="sababu" placeholder="mf. mteja amerudisha bidhaa"></label></div>`,
  `<button class="btn sec" data-a="closeDlg">Ghairi</button><button class="btn" style="background:var(--red)" data-a="doVoid" data-id="${d.id}">Futa</button>`);
A.doVoid=d=>{
  const sab=formVals($("#vF")).sababu;if(!sab)return toast("Andika sababu.");
  const s=D.sales.find(x=>x.id===d.id);if(!s||s.voided)return closeDlg();
  for(const i of s.items){const p=prod(i.pid);if(!p)continue;
    if(feat("batch")&&i.batches&&i.batches.length){p.stoo=r2(num(p.stoo));for(const b of i.batches)addStock(p,num(b.qty),null,{no:b.no,exp:b.exp});const rest=r2(num(i.qty)-i.batches.reduce((t,b)=>t+num(b.qty),0));if(rest>0)addStock(p,rest,null)}
    else addStock(p,num(i.qty),null)}
  if(num(s.rud)){D.chupa.tupu=r2(num(D.chupa.tupu)-num(s.rud))}
  D.bottles=D.bottles.filter(b=>b.sale!==s.id);D.payments=D.payments.filter(p=>p.sale!==s.id);
  s.voided={t:nowISO(),u:ME.jina,sababu:sab};logA("Mauzo #"+s.no+" yamefutwa",fm(s.jumla)+" - "+sab);save();closeDlg();render();toast("Mauzo #"+s.no+" yamefutwa.");
};
A.makeQuote=()=>{if(!cart.lines.length)return;const c=D.customers.find(x=>x.id===cart.mteja);
  dlg("Proforma",`<div class="form" id="qF"><label>Jina la mteja<input name="jina" value="${esc(c?c.jina:"")}"></label></div>`,`<button class="btn sec" data-a="closeDlg">Ghairi</button><button class="btn" data-a="saveQuote">Tengeneza</button>`)};
A.saveQuote=()=>{const v=formVals($("#qF")),T=cartTotals();D.seq.quote++;
  const q={id:uid(),no:D.seq.quote,t:nowISO(),user:ME.id,mteja:cart.mteja||"",mtejaJina:v.jina,punguzo:num(cart.punguzo),amana:0,jumla:r2(T.goods-num(cart.punguzo)),status:"wazi",
    items:cart.lines.map(l=>{const c=lineCalc(l);return c&&{pid:c.p.id,jina:c.p.jina,kipimo:c.p.kipimo,unitName:c.unitName,unit:l.unit,n:num(l.n),qty:c.qtyBase,price:c.price,total:c.total}}).filter(Boolean)};
  D.quotes.push(q);logA("Proforma #"+q.no,fm(q.jumla)+" "+v.jina);save();cart=newCart();closeDlg();go("proforma");showQuote(q)};
function showQuote(q){dlg("Proforma #"+q.no,pdfHead("Proforma #"+q.no)+receiptHTML(q,true),
  `<a class="btn sec" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(receiptText(q,true))}">WhatsApp</a><button class="btn sec" data-a="printReceipt" data-n="Proforma_${q.no}">PDF</button>
   ${q.status!=="imeuzwa"?`<button class="btn" data-a="quoteToSale" data-id="${q.id}">Uza sasa</button>`:""}<button class="btn sec" data-a="closeDlg">Funga</button>`)}
A.showQuote=d=>{const q=D.quotes.find(x=>x.id===d.id);if(q)showQuote(q)};
A.quoteToSale=d=>{const q=D.quotes.find(x=>x.id===d.id);cart=newCart();cart.lines=q.items.filter(i=>prod(i.pid)).map(i=>({pid:i.pid,n:i.n,unit:i.unit,bei:i.price}));cart.punguzo=q.punguzo||0;cart.mteja=q.mteja||"";cart.quoteId=q.id;closeDlg();go("kikapu")};

/* barcode scanning with camera (where supported) */
let scanStream=null;
A.scan=async()=>{
  try{const det=new BarcodeDetector();scanStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});
    dlg("Scan barcode",`<video id="scV" playsinline muted style="width:100%;border-radius:10px;background:#000"></video><p class="muted">Elekeza kamera kwenye barcode.</p>`,`<button class="btn sec" data-a="stopScan">Funga</button>`);
    const v=$("#scV");v.srcObject=scanStream;await v.play();
    const loop=async()=>{if(!scanStream)return;try{const r=await det.detect(v);if(r.length){const code=r[0].rawValue;A.stopScan();const p=byBarcode(code);if(p){addToCart(p);render()}else{state.q=code;render();toast("Barcode "+code+" haijasajiliwa.")}return}}catch(e){}requestAnimationFrame(loop)};loop();
  }catch(e){toast("Kamera haipatikani: "+e.message)}
};
A.stopScan=()=>{if(scanStream){scanStream.getTracks().forEach(t=>t.stop());scanStream=null}closeDlg()};

/* ---------------------------------------------------------------- CUSTOMERS */
function customerForm(c){return `<div class="form" id="cuF"><label>Jina *<input name="jina" value="${esc(c.jina||"")}"></label><label>Simu<input name="simu" inputmode="tel" value="${esc(c.simu||"")}"></label>
  ${isOwner()?`<label>Kikomo cha mkopo (TSh, 0 = bila kikomo)<input name="kikomo" type="number" min="0" value="${esc(c.kikomo||"")}"></label>`:""}<label>Maelezo<input name="maelezo" value="${esc(c.maelezo||"")}"></label></div>`}
A.addCustomer=()=>dlg("Mteja mpya",customerForm({}),`<button class="btn sec" data-a="closeDlg">Ghairi</button><button class="btn" data-a="saveCustomer">Hifadhi</button>`);
A.editCustomer=d=>{const c=D.customers.find(x=>x.id===d.id);dlg("Badilisha mteja",customerForm(c),`<button class="btn sec" data-a="closeDlg">Ghairi</button><button class="btn" data-a="saveCustomer" data-id="${c.id}">Hifadhi</button>`)};
A.saveCustomer=d=>{const v=formVals($("#cuF"));if(!v.jina)return toast("Andika jina.");
  let c=d.id&&D.customers.find(x=>x.id===d.id);
  if(!c){if(D.customers.some(x=>x.jina.toLowerCase()===v.jina.toLowerCase()))return toast("Mteja mwenye jina hili yupo.");c={id:uid()};D.customers.push(c)}
  Object.assign(c,{jina:v.jina,simu:v.simu,maelezo:v.maelezo});if("kikomo" in v)c.kikomo=num(v.kikomo);
  logA("Mteja",c.jina);save();closeDlg();if(view==="kikapu")cart.mteja=c.id;render()};
A.payDebt=d=>{const v=formVals($("#dpF")),k=num(v.kiasi),c=D.customers.find(x=>x.id===d.id);if(k<=0)return toast("Andika kiasi.");
  D.payments.push({id:uid(),t:nowISO(),user:ME.id,type:"mteja",ref:c.id,kiasi:k,njia:v.njia,maelezo:""});logA("Malipo ya deni",c.jina+" "+fm(k)+" "+v.njia);save();render();toast("Malipo ya "+fm(k)+" yamepokelewa. Deni sasa "+fm(custBalance(c.id)))};
A.printStatement=d=>{const c=D.customers.find(x=>x.id===d.id);dlg("Taarifa ya "+c.jina,pdfHead("Taarifa ya deni: "+c.jina)+`<p>Deni la sasa: <b>${fm(custBalance(c.id))}</b></p>`+$("#stmtC").innerHTML,
  `<button class="btn sec" data-a="closeDlg">Funga</button><button class="btn" data-a="printReceipt" data-n="Taarifa_${esc(c.jina)}">Hifadhi PDF</button>`)};

/* ---------------------------------------------------------------- SUPPLIERS & PURCHASES */
A.addSupplier=()=>{const keep=view==="manunuzi"&&$("#puH")?formVals($("#puH")):null;if(keep){pur.ankara=keep.ankara}
  dlg("Msambazaji mpya",`<div class="form" id="suppF"><label>Jina *<input name="jina"></label><label>Simu<input name="simu"></label><label class="full">Maelezo<input name="maelezo"></label></div>`,`<button class="btn sec" data-a="closeDlg">Ghairi</button><button class="btn" data-a="saveSupplier">Hifadhi</button>`)};
A.saveSupplier=()=>{const v=formVals($("#suppF"));if(!v.jina)return toast("Andika jina.");const s={id:uid(),jina:v.jina,simu:v.simu,maelezo:v.maelezo};D.suppliers.push(s);if(view==="manunuzi")pur.supplier=s.id;logA("Msambazaji",s.jina);save();closeDlg();render()};
A.supplierDlg=d=>{const s=D.suppliers.find(x=>x.id===d.id),b=suppBalance(s.id);
  dlg(s.jina,`<p>${esc(s.simu||"")} ${esc(s.maelezo||"")}</p><div class="grid kpis">${kpi("Unadaiwa",fm(b),b>0?"bad":"")}</div>
  ${b>0?`<div class="form" id="spF" style="margin-top:10px"><label>Kiasi unacholipa<input name="kiasi" type="number" min="0" value="${b}"></label><label>Njia<select name="njia">${opts(NJIA_MALIPO.filter(n=>n!=="Mkopo"))}</select></label></div>`:""}
  <h3>Manunuzi</h3>${table(["Tarehe",{t:"Jumla",n:1},{t:"Deni",n:1}],D.purchases.filter(p=>p.supplier===s.id).slice(-20).reverse().map(p=>`<tr><td>${ft(p.t)}</td><td class="n">${fm(p.jumla)}</td><td class="n">${fm(p.deni)}</td></tr>`))}`,
  `<button class="btn sec" data-a="closeDlg">Funga</button>${b>0?`<button class="btn acc" data-a="paySupplier" data-id="${s.id}">Lipa</button>`:""}`)};
A.paySupplier=d=>{const v=formVals($("#spF")),k=num(v.kiasi);if(k<=0)return toast("Andika kiasi.");const s=D.suppliers.find(x=>x.id===d.id);
  D.payments.push({id:uid(),t:nowISO(),user:ME.id,type:"msambazaji",ref:s.id,kiasi:k,njia:v.njia,maelezo:""});logA("Malipo kwa msambazaji",s.jina+" "+fm(k));save();closeDlg();render();toast("Umelipa "+fm(k))};
function keepPurHeader(){const h=$("#puH");if(h){const v=formVals(h);pur.supplier=v.supplier;pur.ankara=v.ankara}const p=$("#puP");if(p){const v=formVals(p);pur.njia=v.njia;pur.kulipwa=v.kulipwa}}
A.purAdd=()=>{keepPurHeader();const v=formVals($("#puL")),p=prod(v.pid);if(!p)return toast("Chagua bidhaa.");
  let qty=num(v.qty),cost=num(v.cost);if(qty<=0)return toast("Andika idadi.");if(cost<=0)return toast("Andika bei ya kununua.");
  if(v.unit==="pack"){const n=num((p.pakiti||{}).idadi);if(n<=1)return toast(p.jina+" haina idadi ya pakiti. Iweke kwenye bidhaa.");qty=qty*n;cost=r2(cost/n)}
  if(feat("batch")&&!v.exp)return toast("Weka tarehe ya expiry.");
  if(feat("batch")&&v.exp<=todayISO())return toast("Tarehe ya expiry imeshapita.");
  pur.lines.push({pid:p.id,qty:r2(qty),cost,batch:v.batch||"",exp:v.exp||""});pur.kulipwa="";render()};
A.purRm=d=>{keepPurHeader();pur.lines.splice(d.i,1);pur.kulipwa="";render()};
A.purSave=()=>{keepPurHeader();if(!pur.lines.length)return;
  const tot=r2(pur.lines.reduce((t,l)=>t+num(l.qty)*num(l.cost),0)),paid=Math.min(tot,pur.kulipwa===""?tot:num(pur.kulipwa)),deni=r2(tot-paid);
  if(deni>0&&!pur.supplier)return toast("Kuna deni: chagua msambazaji.");
  const warn=[];
  for(const l of pur.lines){const p=prod(l.pid);if(num(p.bei_rejareja)>0&&num(l.cost)>num(p.bei_rejareja))warn.push(p.jina);addStock(p,num(l.qty),num(l.cost),{no:l.batch||"-",exp:l.exp})}
  D.seq.pur++;D.purchases.push({id:uid(),no:D.seq.pur,t:nowISO(),user:ME.id,supplier:pur.supplier,ankara:pur.ankara,items:pur.lines.map(l=>({...l,jina:(prod(l.pid)||{}).jina})),jumla:tot,kulipwa:paid,deni,njia:pur.njia});
  logA("Manunuzi",fm(tot)+(deni?" deni "+fm(deni):""));save();pur={supplier:"",lines:[],njia:"Taslimu",kulipwa:"",ankara:""};render();
  if(warn.length)dlg("Tahadhari ya bei",`<div class="alert bad">Bei ya kununua sasa ni kubwa kuliko bei ya kuuza kwa: <b>${warn.map(esc).join(", ")}</b>. Ongeza bei ya kuuza ili usipate hasara.</div>`);else toast("Manunuzi yamehifadhiwa. Stoo imeongezeka.")};

/* ---------------------------------------------------------------- PRODUCTS */
A.productForm=d=>go("bidhaaForm",{id:d.id});
A.bf=d=>{state.f=d.f;render()};
A.saveProduct=d=>{
  const v=formVals($("#pF"));if(!v.jina)return toast("Andika jina la bidhaa.");if(num(v.bei_rejareja)<=0)return toast("Andika bei ya rejareja.");
  if(D.products.some(p=>p.id!==d.id&&p.jina.trim().toLowerCase()===v.jina.toLowerCase()))return toast("Bidhaa yenye jina hili ipo tayari.");
  if(v.barcode&&D.products.some(p=>p.id!==d.id&&p.barcode===v.barcode))return toast("Barcode hii imeshatumika.");
  let p=d.id&&prod(d.id),isNew=!p;if(isNew){p={id:uid(),stoo:0,batches:[],active:true};}
  const before=JSON.stringify({c:p.bei_kununua,r:p.bei_rejareja,j:p.bei_jumla});
  Object.assign(p,{jina:v.jina,kundi:v.kundi,kipimo:v.kipimo||"pc",bei_kununua:num(v.bei_kununua),bei_rejareja:num(v.bei_rejareja),bei_jumla:num(v.bei_jumla),jumla_kuanzia:num(v.jumla_kuanzia)||"",
    kiwango_chini:num(v.kiwango_chini),barcode:v.barcode,desimali:!!v.desimali,amana:num(v.amana)||"",cheti:!!v.cheti});
  if("pk_jina" in v)p.pakiti={jina:v.pk_jina||aina().pakitiJina,idadi:num(v.pk_idadi)||""},p.bei_pakiti=num(v.bei_pakiti)||"";
  if("active" in v)p.active=!!v.active;
  if(isNew){const s=formVals($("#pS"));const q=num(s.stoo);if(q>0){if(feat("batch")&&!s.exp)return toast("Weka tarehe ya expiry ya stoo ya kuanzia.");addStock(p,q,num(v.bei_kununua),{no:s.batch||"-",exp:s.exp||""})}D.products.push(p)}
  logA(isNew?"Bidhaa mpya":"Bidhaa imebadilishwa",p.jina+(isNew?"":" "+before+" -> "+JSON.stringify({c:p.bei_kununua,r:p.bei_rejareja,j:p.bei_jumla})));save();
  if(num(p.bei_rejareja)<num(p.bei_kununua))toast("Tahadhari: bei ya kuuza iko chini ya gharama!");else toast("Imehifadhiwa.");
  go(isNew?"bidhaaForm":"bidhaa",isNew?{}:{});
};
A.delProduct=d=>{const p=prod(d.id),used=D.sales.some(s=>s.items.some(i=>i.pid===p.id))||D.purchases.some(x=>x.items.some(i=>i.pid===p.id));
  ask("Futa "+p.jina,used?"Bidhaa hii ina historia ya mauzo/manunuzi, kwa hiyo itasitishwa (haitaonekana kwenye mauzo) badala ya kufutwa kabisa.":"Bidhaa itafutwa kabisa.","doDelProduct",`data-id="${p.id}"`)};
A.doDelProduct=d=>{const p=prod(d.id),used=D.sales.some(s=>s.items.some(i=>i.pid===p.id))||D.purchases.some(x=>x.items.some(i=>i.pid===p.id));
  if(used)p.active=false;else D.products=D.products.filter(x=>x.id!==p.id);logA(used?"Bidhaa imesitishwa":"Bidhaa imefutwa",p.jina);save();closeDlg();go("bidhaa")};

/* ---------------------------------------------------------------- EXPENSES, STOCK, BOTTLES */
A.saveExpense=()=>{const v=formVals($("#exF")),k=num(v.kiasi);if(k<=0)return toast("Andika kiasi.");
  D.expenses.push({id:uid(),t:nowISO(),user:ME.id,kundi:v.kundi,kiasi:k,njia:v.njia,maelezo:v.maelezo});logA("Matumizi",v.kundi+" "+fm(k)+" "+v.maelezo);save();render();toast("Matumizi yamehifadhiwa.")};
A.delExpense=d=>ask("Futa matumizi","Una uhakika?","doDelExpense",`data-id="${d.id}"`);
A.doDelExpense=d=>{const e=D.expenses.find(x=>x.id===d.id);D.expenses=D.expenses.filter(x=>x.id!==d.id);logA("Matumizi yamefutwa",e.kundi+" "+fm(e.kiasi));save();closeDlg();render()};
function adjust(p,qty,sababu,maelezo,noStock){
  if(!noStock){if(qty<0)takeStock(p,-qty);else addStock(p,qty,null)}
  D.adjustments.push({id:uid(),t:nowISO(),user:ME.id,u:ME.jina,pid:p.id,jina:p.jina,qty:r2(qty),cost:num(p.bei_kununua),sababu,maelezo:maelezo||""});
}
A.saveAdj=()=>{const v=formVals($("#adF")),p=prod(v.pid),q=num(v.qty);if(!p)return toast("Chagua bidhaa.");if(q<=0)return toast("Andika idadi.");
  const qty=q*num(v.dir);if(qty<0&&-qty>num(p.stoo)+1e-9)return toast("Idadi ni kubwa kuliko stoo ("+fq(p.stoo,p)+").");
  adjust(p,qty,v.sababu,v.maelezo);logA("Marekebisho ya stoo",p.jina+" "+fq(qty)+" ("+v.sababu+")");save();state.pid="";render();toast("Imehifadhiwa. Thamani: "+fm(qty*num(p.bei_kununua)))};
A.writeOffExpired=()=>{let tot=0;for(const p of D.products){const q=expiredQty(p);if(q>0){removeExpired(p);adjust(p,-q,"Imeisha muda","Zimeondolewa",true);tot+=q*num(p.bei_kununua)}}
  logA("Dawa zilizoisha muda zimeondolewa",fm(tot));save();render();toast("Zimeondolewa. Hasara: "+fm(tot))};
A.saveCount=()=>{let n=0,loss=0,gain=0;const cnt=state.cnt||{};
  for(const [pid,val] of Object.entries(cnt)){if(val===""||val==null)continue;const p=prod(pid);if(!p)continue;const diff=r2(num(val)-num(p.stoo));if(Math.abs(diff)<0.0001)continue;
    adjust(p,diff,"Hesabu ya stoo","Mfumo "+fq(p.stoo)+", imehesabiwa "+fq(num(val)));n++;if(diff<0)loss+=-diff*num(p.bei_kununua);else gain+=diff*num(p.bei_kununua)}
  logA("Hesabu ya stoo",n+" bidhaa, upotevu "+fm(loss)+", ziada "+fm(gain));save();state.cnt={};render();
  dlg("Hesabu imehifadhiwa",`<p>Bidhaa ${n} zilikuwa na tofauti.</p><div class="grid kpis">${kpi("Upotevu",fm(loss),loss?"bad":"")}${kpi("Ziada",fm(gain))}</div>`)};
A.saveBottle=()=>{const v=formVals($("#chF")),q=Math.round(num(v.qty)),p=prod(v.pid);if(q<=0)return toast("Andika idadi.");
  if(v.type==="refund"){if(!p)return toast("Chagua bidhaa.");const k=q*num(p.amana);D.chupa.tupu+=q;D.bottles.push({id:uid(),t:nowISO(),type:"refund",qty:q,kiasi:k,pid:p.id,maelezo:v.maelezo});toast("Mrudishie mteja "+fm(k))}
  else if(v.type==="in"){D.chupa.tupu+=q;D.bottles.push({id:uid(),t:nowISO(),type:"in",qty:q,kiasi:0,maelezo:v.maelezo})}
  else{if(q>num(D.chupa.tupu))return toast("Una chupa tupu "+D.chupa.tupu+" tu.");D.chupa.tupu-=q;D.bottles.push({id:uid(),t:nowISO(),type:"return",qty:q,kiasi:0,maelezo:v.maelezo})}
  logA("Chupa",v.type+" "+q);save();render()};

/* ---------------------------------------------------------------- CLOSE DAY */
A.closeDay=d=>{const v=formVals($("#clF"));if(v.counted==="")return toast("Andika pesa uliyohesabu.");
  const day=d.day,ex=D.closings.find(c=>c.date===day);if(ex&&!isOwner())return toast("Siku hii imeshafungwa.");
  const expd=expectedCash(day),counted=num(v.counted),handed=Math.min(num(v.handed),counted);
  const c=ex||{id:uid(),date:day};Object.assign(c,{t:nowISO(),user:ex?ex.user:ME.id,expected:expd,counted,diff:r2(counted-expd),handed,maelezo:v.maelezo,mobile:mobileByMethod(day)});if(!ex)D.closings.push(c);
  logA(ex?"Siku imesahihishwa":"Siku imefungwa",fd(day)+": inatakiwa "+fm(expd)+", imehesabiwa "+fm(counted)+", tofauti "+fm(c.diff));save();render();
  toast(isOwner()?(c.diff<0?"Upungufu wa "+fm(-c.diff):c.diff>0?"Ziada ya "+fm(c.diff):"Pesa iko sawa."):"Siku imefungwa. Asante.")};

/* ---------------------------------------------------------------- PERIODS & REPORTS */
const setP=d=>{if(d.apply){state.a=$("#pA").value;state.b=$("#pB").value;if(!state.a||!state.b||state.a>state.b)return toast("Chagua tarehe sahihi.")}state.p=d.p;render()};
A.pExp=A.pSales=A.pRep=A.pAdj=setP;
A.repTab=d=>{state.t=d.t;render()};
A.pdfReport=()=>{const t=$(".tabs button.on[data-a='repTab']"),title="Ripoti "+(t?t.textContent:"")+" "+period(state.p,state.a,state.b)[2];
  dlg(title,pdfHead(title)+$("#repBody").innerHTML,`<button class="btn sec" data-a="closeDlg">Funga</button><button class="btn" data-a="printReceipt" data-n="${esc(title.replace(/\s+/g,"_"))}">Hifadhi PDF</button>`)};
A.xlsReport=()=>{const [a,b,lbl]=period(state.p,state.a,state.b),S=summary(a,b);
  const rows=[["Ripoti ya "+D.setup.jina+": "+lbl],[],["Mauzo",S.mauzo],["Gharama ya bidhaa",S.gharama],["Faida ghafi",S.ghafi],["Matumizi",S.matumizi],["Upotevu wa bidhaa",S.upotevu],["Ziada ya stoo",S.ziada],["Faida halisi",S.halisi],["Upungufu wa droo",S.pungufu]];
  const sales=[["Na.","Tarehe","Muuzaji","Njia","Mteja","Bidhaa","Idadi","Bei","Jumla","Gharama","Faida"]];
  for(const s of S.ss)for(const i of s.items)sales.push([s.no,{date:dayOf(s.t)},userName(s.user),s.njia,(D.customers.find(c=>c.id===s.mteja)||{}).jina||"",i.jina,num(i.qty),num(i.price),num(i.total),r2(num(i.cost)*num(i.qty)),r2(num(i.total)-num(i.cost)*num(i.qty))]);
  const ex=[["Tarehe","Aina","Maelezo","Kiasi"]].concat(D.expenses.filter(e=>inRange(e.t,a,b)).map(e=>[{date:dayOf(e.t)},e.kundi,e.maelezo||"",num(e.kiasi)]));
  dlBlob(new Blob([XL.write([{name:"Muhtasari",rows,title:true,widths:[28,16]},{name:"Mauzo",rows:sales,header:true,widths:[6,12,14,12,16,26,8,10,12,12,12]},{name:"Matumizi",rows:ex,header:true,widths:[12,18,30,12]}])]),`Ripoti_${slug()}_${a}_${b}.xlsx`)};

/* ---------------------------------------------------------------- USERS */
A.userForm=d=>{const u=d.id?D.users.find(x=>x.id===d.id):null;
  dlg(u?"Badilisha "+u.jina:"Muuzaji mpya",`<div class="form" id="uF"><label>Jina *<input name="jina" value="${esc(u?u.jina:"")}"></label><label>Simu<input name="simu" value="${esc(u?u.simu||"":"")}"></label>
    ${!u||u.id!==ME.id?`<label>Nafasi<select name="role">${opts([["muuzaji","Muuzaji"],["mwenye","Mwenye duka / Meneja"]],u?u.role:"muuzaji")}</select></label>`:""}
    <label>${u?"PIN mpya (acha tupu kama haibadiliki)":"PIN (tarakimu 4-6) *"}<input name="pin" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password"></label>
    ${u&&u.id!==ME.id?`<label class="chk"><input type="checkbox" name="active" ${u.active!==false?"checked":""}> Anaruhusiwa kuingia</label>`:""}</div>`,
    `<button class="btn sec" data-a="closeDlg">Ghairi</button><button class="btn" data-a="saveUser" data-id="${u?u.id:""}">Hifadhi</button>`)};
A.saveUser=async d=>{const v=formVals($("#uF"));if(!v.jina)return toast("Andika jina.");
  if((!d.id||v.pin)&&!/^\d{4,6}$/.test(v.pin))return toast("PIN iwe tarakimu 4 hadi 6.");
  let u=d.id&&D.users.find(x=>x.id===d.id);const isNew=!u;if(isNew){u={id:uid(),active:true};}
  for(const o of D.users)if(o.id!==u.id&&v.pin&&await hashPin(v.pin,o.salt)===o.pin)return toast("PIN hii inatumiwa na mtu mwingine. Chagua nyingine.");
  u.jina=v.jina;u.simu=v.simu;if(v.role)u.role=v.role;else if(isNew)u.role="muuzaji";if("active" in v)u.active=!!v.active;
  if(v.pin){u.salt=uid();u.pin=await hashPin(v.pin,u.salt)}
  if(isNew)D.users.push(u);
  if(!D.users.some(x=>x.role==="mwenye"&&x.active!==false))return toast("Lazima abaki mwenye duka mmoja angalau.");
  logA(isNew?"Mtumiaji mpya":"Mtumiaji amebadilishwa",u.jina+" ("+u.role+")"+(v.pin?" PIN imewekwa":""));save();closeDlg();render()};

/* ---------------------------------------------------------------- SETTINGS */
A.saveSettings=()=>{const a=formVals($("#stF")),b=formVals($("#stS"));if(!a.jina)return toast("Jina la duka linahitajika.");
  Object.assign(D.setup,{jina:a.jina,mmiliki:a.mmiliki,simu:a.simu,mahali:a.mahali,tin:a.tin});D.settings.receiptFooter=a.receiptFooter;
  for(const k of ["cashThreshold","debtDays","expiryDays","lockMinutes","sellerDiscountPct"])if(k in b)D.settings[k]=num(b[k]);
  D.settings.sellerExpenses=!!b.sellerExpenses;D.settings.sellerSeesStock=!!b.sellerSeesStock;logA("Mipangilio imebadilishwa","");save();render();toast("Imehifadhiwa.")};
A.changeType=()=>{const k=$("#newAina").value;if(k===D.setup.aina)return;ask("Badilisha aina ya biashara",`Badilisha kuwa <b>${AINA[k].jina}</b>?`,"doChangeType",`data-k="${k}"`)};
A.doChangeType=d=>{const old=aina().jina;D.setup.aina=d.k;logA("Aina ya biashara",old+" -> "+aina().jina);save();closeDlg();render()};
A.wipeAll=()=>dlg("Futa taarifa zote",`<div class="alert bad">Bidhaa, mauzo, madeni na watumiaji wote watafutwa. Pakua nakala kwanza!</div><div class="form" id="wF"><label>Andika FUTA kuthibitisha<input name="w" autocomplete="off"></label></div>`,
  `<button class="btn sec" data-a="closeDlg">Ghairi</button><button class="btn sec" data-a="backup">Pakua nakala</button><button class="btn" style="background:var(--red)" data-a="doWipe">Futa</button>`);
A.doWipe=()=>{if(formVals($("#wF")).w.toUpperCase()!=="FUTA")return toast("Andika FUTA.");D=blank();save();ME=null;state={};closeDlg();render()};

/* ---------------------------------------------------------------- BACKUP & EXCEL */
A.backup=()=>{dlBlob(new Blob([JSON.stringify(D)],{type:"application/json"}),`Nakala_${slug()}_${todayISO()}.json`);if(ME)logA("Nakala imepakuliwa","");save();toast("Nakala imepakuliwa. Ihifadhi mahali salama.")};
A.restore=()=>{const f=$("#fileIn");f.value="";f.click()};
let pendingRestore=null;
$("#fileIn").addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;
  try{const o=JSON.parse(await file.text());if(!o||!o.setup||!Array.isArray(o.products))throw new Error("si nakala ya "+APP.name);
    pendingRestore=o;dlg("Rejesha nakala",`<p>Nakala ya <b>${esc(o.setup.jina)}</b> (bidhaa ${o.products.length}, mauzo ${(o.sales||[]).length}, ${o.saved?"iliyohifadhiwa "+ft(o.saved):""}).</p><div class="alert bad">Taarifa zilizopo sasa kwenye kifaa hiki zitafutwa na kubadilishwa na nakala hii.</div>`,
      `<button class="btn sec" data-a="closeDlg">Ghairi</button><button class="btn" data-a="doRestore">Rejesha</button>`)}
  catch(err){toast("Faili hili haliwezi kurejeshwa: "+err.message)}});
A.doRestore=()=>{if(!pendingRestore)return;D=normalize(pendingRestore);pendingRestore=null;save();ME=null;state={};closeDlg();render();toast("Nakala imerejeshwa. Ingia kwa PIN.")};
const XCOLS=()=>[["jina","Jina la bidhaa"],["kundi","Kundi"],["kipimo","Kipimo"],["bei_kununua","Bei ya kununua"],["bei_rejareja","Bei ya rejareja"],["bei_jumla","Bei ya jumla"],["jumla_kuanzia","Jumla kuanzia idadi"],
  ["pk_jina","Jina la pakiti"],["pk_idadi","Idadi kwa pakiti"],["kiwango_chini","Kiwango cha chini"],["barcode","Barcode"],["stoo","Stoo"]]
  .concat(feat("batch")?[["batch","Batch"],["exp","Expiry"]]:[]).concat(feat("chupa")?[["amana","Amana ya chupa"]]:[]);
A.xlsTemplate=()=>{const c=XCOLS(),a=aina();dlBlob(new Blob([XL.write([{name:"Bidhaa",header:true,rows:[c.map(x=>x[1]),c.map(x=>({jina:"Mfano: "+(a.makundi[0]),kundi:a.makundi[0],kipimo:a.vipimo[0],bei_kununua:1000,bei_rejareja:1300,bei_jumla:1200,jumla_kuanzia:10,pk_jina:a.pakitiJina,pk_idadi:12,kiwango_chini:5,barcode:"",stoo:24,batch:"B001",exp:{date:addDays(todayISO(),365)},amana:""})[x[0]]??"")],
  widths:c.map(x=>x[0]==="jina"?30:14),textCols:[10],lists:{1:a.makundi,2:a.vipimo}}])]),`Template_Bidhaa_${slug()}.xlsx`)};
A.xlsProducts=()=>{const c=XCOLS();dlBlob(new Blob([XL.write([{name:"Bidhaa",header:true,rows:[c.map(x=>x[1])].concat(D.products.map(p=>c.map(([k])=>{
  if(k==="pk_jina")return (p.pakiti||{}).jina||"";if(k==="pk_idadi")return num((p.pakiti||{}).idadi)||"";if(k==="batch")return (p.batches||[]).map(b=>b.no).join(", ");if(k==="exp")return (p.batches||[]).map(b=>fd(b.exp)).join(", ");
  const v=p[k];return typeof v==="number"?v:(v??"")}))),widths:c.map(x=>x[0]==="jina"?30:14),textCols:[10]}])]),`Bidhaa_${slug()}_${todayISO()}.xlsx`)};
A.xlsSales=()=>{const rows=[["Na.","Tarehe","Saa","Muuzaji","Njia","Mteja","Bidhaa","Idadi","Kipimo","Bei","Jumla","Hali"]];
  for(const s of D.sales)for(const i of s.items)rows.push([s.no,{date:dayOf(s.t)},ft(s.t).slice(11),userName(s.user),s.njia,(D.customers.find(c=>c.id===s.mteja)||{}).jina||"",i.jina,num(i.n),i.unitName||i.kipimo,num(i.price),num(i.total),s.voided?"Imefutwa":""]);
  dlBlob(new Blob([XL.write([{name:"Mauzo",header:true,rows,widths:[6,12,7,14,12,16,28,8,9,10,12,10]}])]),`Mauzo_${slug()}_${todayISO()}.xlsx`)};
A.xlsImport=()=>{const f=$("#xlsIn");f.value="";f.click()};
$("#xlsIn").addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;
  try{const sheets=/\.csv$/i.test(file.name)?XL.csv(await file.text()):await XL.read(await file.arrayBuffer());
    const rows=sheets[0].rows,h=XL.headerRow(rows);if(h<0)throw new Error("hakuna safu ya vichwa");
    const map={},C=XCOLS(),alias={jina:["jina","jinalabidhaa","bidhaa","name","product"],kundi:["kundi","category"],kipimo:["kipimo","unit"],bei_kununua:["beiyakununua","gharama","cost","buyingprice"],bei_rejareja:["beiyarejareja","bei","beiyakuuza","price","retail","sellingprice"],
      bei_jumla:["beiyajumla","jumla","wholesale"],jumla_kuanzia:["jumlakuanziaidadi","jumlakuanzia"],pk_jina:["jinalapakiti","pakiti"],pk_idadi:["idadikwapakiti","idadi"],kiwango_chini:["kiwangochachini","reorder","kiwango"],barcode:["barcode"],stoo:["stoo","stock","qty"],batch:["batch"],exp:["expiry","exp","tareheyakuisha"],amana:["amanayachupa","amana","deposit"]};
    (rows[h]||[]).forEach((v,i)=>{const n=XL.norm(v);for(const [k,al] of Object.entries(alias))if(al.includes(n)&&!(k in map))map[k]=i});
    if(!("jina" in map)||!("bei_rejareja" in map))throw new Error("safu za 'Jina la bidhaa' na 'Bei ya rejareja' zinahitajika");
    let add=0,upd=0,skip=0;const g=(r,k)=>k in map?r[map[k]]:"";
    for(const r of rows.slice(h+1)){if(!r)continue;const jina=String(g(r,"jina")??"").trim();if(!jina||/^mfano:/i.test(jina)){continue}
      if(num(g(r,"bei_rejareja"))<=0){skip++;continue}
      let p=D.products.find(x=>x.jina.trim().toLowerCase()===jina.toLowerCase());const isNew=!p;if(isNew){p={id:uid(),jina,stoo:0,batches:[],active:true};D.products.push(p)}
      const s=(k,f)=>{const v=g(r,k);if(v!==""&&v!=null)f(v)};
      s("kundi",v=>p.kundi=String(v));s("kipimo",v=>p.kipimo=String(v));p.kipimo=p.kipimo||aina().vipimo[0];
      s("bei_rejareja",v=>p.bei_rejareja=num(v));s("bei_jumla",v=>p.bei_jumla=num(v));s("jumla_kuanzia",v=>p.jumla_kuanzia=num(v));s("kiwango_chini",v=>p.kiwango_chini=num(v));s("barcode",v=>p.barcode=String(v).trim());s("amana",v=>p.amana=num(v));
      if(g(r,"pk_idadi")!==""||g(r,"pk_jina")!=="")p.pakiti={jina:String(g(r,"pk_jina")||aina().pakitiJina),idadi:num(g(r,"pk_idadi"))||""};
      if(isNew){p.bei_kununua=num(g(r,"bei_kununua"));const q=num(g(r,"stoo"));if(q>0)addStock(p,q,p.bei_kununua,{no:String(g(r,"batch")||"-"),exp:XL.date(g(r,"exp"))});add++}
      else{s("bei_kununua",v=>p.bei_kununua=num(v));upd++}}
    logA("Bidhaa kutoka Excel",add+" mpya, "+upd+" zimesasishwa");save();render();
    dlg("Excel imepakiwa",`<p>Bidhaa mpya: <b>${add}</b><br>Zimesasishwa: <b>${upd}</b>${skip?`<br>Zimerukwa (hazina bei): ${skip}`:""}</p><p class="muted">Kwa bidhaa zilizokuwepo, stoo haibadilishwi kutoka Excel. Tumia "Ingiza mzigo" au "Hesabu ya stoo".</p>`)}
  catch(err){toast("Imeshindikana: "+err.message)}});

/* ---------------------------------------------------------------- LICENSE */
A.copyDev=()=>{const t=devPretty(LIC.dev);(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast("Imenakiliwa: "+t),()=>toast(t))};
A.applyCode=async()=>{const r=await applyCode($("#licCode").value);if(!r.ok)return dlg("Msimbo haukukubaliwa",`<div class="alert bad">${esc(r.err)}</div>`);
  if(ME)logA("Leseni imewashwa","hadi "+fd(r.exp));save();view="mauzo";render();dlg("Asante!",`<div class="alert ok">Leseni imewashwa hadi <b>${fd(r.exp)}</b>.</div>`)};

/* ================================================================ EVENTS */
document.addEventListener("click",e=>{const el=e.target.closest("[data-a]");if(!el)return;if(el.tagName==="A")return;
  if(el.disabled)return;const f=A[el.dataset.a];if(f){e.preventDefault();f(Object.assign({},el.dataset),el)}});
document.addEventListener("input",e=>{const t=e.target;
  if(t.id==="q"||t.id==="qb"||t.id==="qh"){state.q=t.value;const pos=t.selectionStart;render();const n=$("#"+t.id);if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(_){}}return}
  if(t.dataset.cnt){state.cnt=state.cnt||{};state.cnt[t.dataset.cnt]=t.value;return}
  if(t.closest&&t.closest("#payF")){if(t.name==="punguzo")cart.punguzo=t.value;if(t.name==="kulipwa")cart.kulipwa=t.value;if(t.name==="cheti")cart.cheti=t.value;payPreview();return}
});
document.addEventListener("change",e=>{const t=e.target;
  if(t.dataset.qi!=null){const l=cart.lines[t.dataset.qi];l.n=Math.max(0,num(t.value));const p=prod(l.pid);if(!(p&&p.desimali&&l.unit!=="pack"))l.n=Math.round(l.n);if(l.n<=0)cart.lines.splice(t.dataset.qi,1);render();return}
  if(t.dataset.rud!=null){cart.lines[t.dataset.rud].rud=Math.max(0,Math.round(num(t.value)));render();return}
  if(t.closest&&t.closest("#payF")&&t.name==="mteja"){cart.mteja=t.value;render();return}
  if(t.id==="fDay"){state.day=t.value;render()}
});
/* keyboard barcode scanners: fast keystrokes ending with Enter */
let kb="",kbT=0;
document.addEventListener("keydown",e=>{lastAct=Date.now();
  if(!ME||!["mauzo","kikapu"].includes(view)||$("#dlg").open)return;
  const t=e.target;
  if(e.key==="Enter"){
    if(t.id==="q"){const p=byBarcode(t.value)||(()=>{const m=D.products.filter(p=>p.active!==false&&p.jina.toLowerCase().includes(t.value.toLowerCase()));return m.length===1?m[0]:null})();if(p){addToCart(p);state.q="";render();const n=$("#q");n&&n.focus()}e.preventDefault();return}
    if(kb.length>=4&&!/INPUT|TEXTAREA|SELECT/.test(t.tagName)){const p=byBarcode(kb);if(p){addToCart(p);render()}else toast("Barcode "+kb+" haijasajiliwa.")}kb="";return}
  if(e.key.length===1&&!/INPUT|TEXTAREA|SELECT/.test(t.tagName)){const now=Date.now();if(now-kbT>80)kb="";kb+=e.key;kbT=now}
});
["pointerdown","touchstart"].forEach(ev=>document.addEventListener(ev,()=>{lastAct=Date.now()},{passive:true}));
setInterval(()=>{if(ME&&num(D.settings.lockMinutes)>0&&Date.now()-lastAct>num(D.settings.lockMinutes)*60000){A.lock();toast("Imefungwa kwa usalama. Ingiza PIN.")}},20000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden){licLoad();if(ME)render()}});
$("#dlg").addEventListener("close",()=>{if(scanStream)A.stopScan()});

let installEvt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installEvt=e;if(view==="zaidi"&&ME)render()});
A.installApp=async()=>{if(!installEvt)return toast("Fungua menyu ya kivinjari (⋮) > Add to Home screen / Install app.");installEvt.prompt();await installEvt.userChoice;installEvt=null;render()};
/* ================================================================ INIT */
(async()=>{load();licLoad();await licVerifyStored();render();
  if(!storageOk)toast("Kifaa hiki hakiruhusu kuhifadhi taarifa. Usitumie hali ya 'Incognito'.")})();
