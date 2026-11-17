"use strict";
/* ===== Lugha / Language: Kiswahili (chaguo-msingi) na English ===== */
let LANG="sw";try{LANG=localStorage.getItem("dk_lang")==="en"?"en":"sw"}catch(e){}
const EN={
"Mauzo yaliyopita":"Past sales","Mauzo yaliyofutwa":"Deleted sales","Mauzo":"Sales","Bidhaa":"Products","Tahadhari":"Alerts","Ripoti":"Reports","Zaidi":"More",
"Ingiza Mzigo (Manunuzi)":"Receive Stock (Purchases)","Ingiza Mzigo":"Receive Stock","Ingiza mzigo":"Receive stock","Manunuzi":"Purchases","Matumizi":"Expenses","Wateja na Madeni":"Customers & Debts","Wasambazaji":"Suppliers","Msambazaji":"Supplier",
"Hesabu ya Stoo":"Stock Count","Hesabu ya stoo":"Stock count","Upotevu na Marekebisho":"Losses & Adjustments","Funga Siku":"Close Day","Chupa Tupu":"Empty Bottles","Watumiaji (PIN)":"Users (PIN)","Watumiaji":"Users",
"Nakala na Excel":"Backup & Excel","Nakala (Backup) na Excel":"Backup & Excel","Mipangilio":"Settings","Kumbukumbu (Audit log)":"Audit log","Kumbukumbu":"Records","Leseni na Malipo":"License & Payment",
"Tafuta bidhaa au scan barcode":"Search product or scan barcode","Zote":"All","Stoo":"Stock","jumla":"wholesale","Zimeisha":"Out of stock","Zinakaribia kuisha":"Running low",
"Lugha / Language":"Language","Funga app (Toka)":"Close app (Exit)",
"Majaribio: siku":"Trial: days","zimebaki":"left","Lipia":"Pay","Lipa":"Pay","Kikapu":"Cart","Kikapu kiko tupu.":"Cart is empty.","Futa kikapu":"Clear cart",
"Mwenye duka":"Shop owner","Muuzaji":"Seller","Karibu":"Welcome","Karibu!":"Welcome!","Ingiza PIN":"Enter PIN","Rudia PIN":"Repeat PIN","Endelea":"Continue","Anza kutumia":"Start using",
"Chagua aina ya biashara yako":"Choose your business type","Aina ya biashara":"Business type","Rejareja na Jumla":"Retail & Wholesale","Famasi / Duka la Dawa":"Pharmacy","Hardware / Vifaa vya Ujenzi":"Hardware / Building Materials","Vinywaji / Bar / Grocery":"Drinks / Bar / Grocery",
"Jina la duka":"Shop name","Jina la mwenye duka":"Owner name","Namba ya simu":"Phone number","Simu":"Phone","Mahali":"Location",
"Ongeza bidhaa":"Add product","+ Ongeza bidhaa":"+ Add product","Bado hakuna bidhaa.":"No products yet.","Hakuna bidhaa.":"No products.","Jina la bidhaa":"Product name","Jina":"Name","Kundi":"Category","Kipimo (unit)":"Unit","Kipimo":"Unit",
"Bei ya kununua":"Buy price","Bei ya rejareja":"Retail price","Bei ya jumla":"Wholesale price","Bei ya Rejareja":"Retail Price","Bei ya Jumla":"Wholesale Price","Bei":"Price","Barcode (hiari)":"Barcode (optional)",
"Stoo ya kuanzia":"Opening stock","Stoo ya sasa":"Current stock","Idadi":"Quantity","Tahadhari stoo ikifika (kiwango cha chini)":"Alert when stock reaches (minimum)","Inauzwa (ondoa alama kusitisha)":"On sale (untick to suspend)",
"Hifadhi":"Save","Ghairi":"Cancel","Funga":"Close","Futa":"Delete","Badilisha":"Edit","Rekebisha":"Edit","Sawa":"OK","Ndiyo":"Yes","Hapana":"No","Tuma":"Send","Rudi":"Back","Onyesha":"Show","Ondoa":"Remove","Weka":"Set","Tengeneza":"Create",
"Uza sasa":"Sell now","Chenji":"Change","Punguzo":"Discount","Jumla":"Total","JUMLA":"TOTAL","Njia ya malipo":"Payment method","Taslimu":"Cash","Mkopo":"Credit","Benki":"Bank","Deni":"Debt","Umelipa":"Paid","Kiasi":"Amount","Kiasi alicholipa":"Amount paid","Maelezo":"Notes","Risiti":"Receipt",
"Mteja":"Customer","Wateja":"Customers","Mteja mpya":"New customer","+ Mteja mpya":"+ New customer","Chagua mteja kwa mauzo ya mkopo / deni.":"Select a customer for credit sales / debt.","Jina la mteja":"Customer name",
"Pokea malipo":"Receive payment","Wateja wanaodaiwa":"Customers who owe","Wasambazaji unaowadai":"Suppliers you owe","Bado hakuna wateja.":"No customers yet.","Bado hakuna wasambazaji.":"No suppliers yet.",
"Faida ghafi":"Gross profit","Taarifa ya faida na hasara":"Profit and loss statement","TAARIFA YA FAIDA NA HASARA":"PROFIT AND LOSS STATEMENT","Bidhaa zilizouzwa":"Products sold","Kwa siku":"By day","Kwa njia ya malipo":"By payment method",
"Matumizi yamehifadhiwa.":"Expense saved.","Hifadhi matumizi":"Save expense","Manunuzi yamehifadhiwa. Stoo imeongezeka.":"Purchase saved. Stock increased.","Imehifadhiwa.":"Saved.","Imenakiliwa:":"Copied:",
"Hakuna tahadhari. Kila kitu kiko sawa.":"No alerts. Everything is fine.","Hakuna mauzo.":"No sales.","Hakuna taarifa.":"No data.","Bado hakuna proforma.":"No proformas yet.",
"Pakua nakala":"Download backup","Pakua nakala ya taarifa":"Download data backup","Rejesha nakala":"Restore backup","Rejesha":"Restore","Nakala imepakuliwa. Ihifadhi mahali salama.":"Backup downloaded. Keep it safe.","Nakala imerejeshwa. Ingia kwa PIN.":"Backup restored. Log in with PIN.",
"Pakua mauzo yote (.xlsx)":"Download all sales (.xlsx)","Pakua bidhaa zote":"Download all products","Pakia Excel / CSV":"Upload Excel / CSV","Pakua template":"Download template","Mauzo kwa Excel":"Sales to Excel","Bidhaa kwa Excel":"Products to Excel",
"Mipangilio ya":"Settings for","Hifadhi mipangilio":"Save settings","Funga app baada ya dakika bila kutumika (0 = usifunge)":"Lock app after minutes of inactivity (0 = never)","Ujumbe chini ya risiti":"Receipt footer message",
"Punguzo la juu muuzaji anaruhusiwa (%)":"Maximum discount seller may give (%)","Muuzaji anaona idadi ya stoo":"Seller can see stock quantity","Muuzaji anaweza kurekodi matumizi":"Seller can record expenses",
"Tahadhari na usalama":"Alerts & security","Tahadhari ya expiry kabla ya siku":"Expiry alert days before","Tarehe ya kuisha muda (expiry)":"Expiry date","Dawa ya cheti (prescription)":"Prescription medicine",
"Namba ya kifaa hiki":"This device number","Nakili namba":"Copy number","Weka msimbo":"Enter code","msimbo wa leseni":"license code","Msimbo haukukubaliwa":"Code was not accepted","Leseni imewashwa hadi":"License active until",
"Imefungwa kwa usalama. Ingiza PIN.":"Locked for security. Enter PIN.","PIN si sahihi.":"Incorrect PIN.","PIN hazilingani.":"PINs do not match.","PIN iwe tarakimu 4 hadi 6.":"PIN must be 4 to 6 digits.",
"Kamera haipatikani:":"Camera not available:","Elekeza kamera kwenye barcode.":"Point the camera at the barcode.","Scan barcode":"Scan barcode","Barcode hii imeshatumika.":"This barcode is already used.","haijasajiliwa":"is not registered","imeongezwa":"added",
"Endelea ku-scan au bonyeza Funga.":"Keep scanning or press Close.","Hifadhi imeshindikana! Pakua nakala sasa.":"Save failed! Download a backup now.",
"Andika jina la bidhaa.":"Enter the product name.","Andika bei ya kununua.":"Enter the buy price.","Andika bei ya rejareja.":"Enter the retail price.","Andika idadi.":"Enter the quantity.","Andika kiasi.":"Enter the amount.","Andika sababu.":"Enter the reason.",
"Idadi ni kubwa kuliko stoo":"Quantity is more than stock","Chagua bidhaa.":"Select a product.","Bidhaa hii imesitishwa.":"This product is suspended.","Bidhaa yenye jina hili ipo tayari.":"A product with this name already exists.",
"Sababu":"Reason","Njia":"Method","Aina":"Type","Tarehe":"Date","Hatari":"Danger","Historia":"History","Shughuli":"Activity","Nafasi":"Role","Tofauti":"Difference",
"Futa taarifa zote":"Delete all data","Futa taarifa zote za duka":"Delete all shop data","Andika FUTA kuthibitisha":"Type FUTA to confirm","Weka bidhaa za mfano (unaweza kuzifuta baadaye)":"Add sample products (you can delete them later)",
"Hesabu imehifadhiwa":"Count saved","Hifadhi hesabu":"Save count","Rekebisha stoo":"Adjust stock","Punguza (imepotea / imeharibika)":"Reduce (lost / damaged)","Imeharibika":"Damaged","Imeisha muda":"Expired","Imepotea / Wizi":"Lost / Theft","Matumizi binafsi":"Personal use",
"Hesabu ya stoo ":"Stock count ","Pesa taslimu uliyohesabu droo":"Cash counted in drawer","Pesa ya kuanzia (iliyobaki jana)":"Opening cash (left from yesterday)","+ Taslimu iliyoingia":"+ Cash received","Siku hii imeshafungwa.":"This day is already closed.",
"Chapisha":"Print","Hifadhi PDF":"Save PDF","PDF / Chapisha":"PDF / Print","Toka":"Exit","Zimesasishwa:":"Updated:","Bidhaa mpya:":"New products:",
"Kodi ya Pango":"Rent","Umeme na Maji":"Electricity & Water","Mshahara":"Salary","Usafiri":"Transport","Chakula":"Food","Ushuru na Leseni":"Taxes & Licenses","Mawasiliano":"Communication","Matengenezo":"Repairs","Mengineyo":"Other",
"Vyakula":"Food","Vinywaji":"Drinks","Sabuni na Usafi":"Soap & Cleaning","Vipodozi":"Cosmetics","Vifaa vya Nyumbani":"Household","Shule na Ofisi":"School & Office",
"Toleo":"Version","toleo":"version"
};
const _ks=Object.keys(EN).sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\]\\\/]/g,"\\$&"));
const _re=new RegExp("(?<![A-Za-z])("+_ks.join("|")+")(?![A-Za-z])","g");
function trText(s){return s.replace(_re,m=>EN[m]!==undefined?EN[m]:m)}
let _busy=false;
function trNode(n){
  if(n.nodeType===3){const t=n.nodeValue;if(t&&t.trim()){const r=trText(t);if(r!==t)n.nodeValue=r}return}
  if(n.nodeType!==1)return;
  if(/^(SCRIPT|STYLE|TEXTAREA)$/.test(n.tagName))return;
  for(const a of["placeholder","aria-label","title"]){if(n.hasAttribute&&n.hasAttribute(a)){const t=n.getAttribute(a),r=trText(t);if(r!==t)n.setAttribute(a,r)}}
  for(let c=n.firstChild;c;c=c.nextSibling)trNode(c);
}
function trRun(root){if(LANG!=="en"||_busy)return;_busy=true;try{trNode(root)}finally{_busy=false}}
if(LANG==="en"){
  document.documentElement.lang="en";
  const mo=new MutationObserver(ms=>{if(_busy)return;_busy=true;try{for(const m of ms){if(m.type==="characterData")trNode(m.target);else if(m.type==="attributes")trNode(m.target);else m.addedNodes.forEach(trNode)}}finally{_busy=false}});
  const start=()=>{trRun(document.body);mo.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:["placeholder","aria-label","title"]})};
  if(document.body)start();else document.addEventListener("DOMContentLoaded",start);
}
function langCard(){
  return `<div class="card"><h3>Lugha / Language</h3><div class="seg"><button data-a="setLang" data-l="sw" class="${LANG==="sw"?"on":""}">Kiswahili</button><button data-a="setLang" data-l="en" class="${LANG==="en"?"on":""}">English</button></div>
  <button class="btn big del" style="margin-top:12px" data-a="exitApp">&#9211; Funga app (Toka)</button></div>`;
}
