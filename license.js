"use strict";
/* ================================================================ LESENI: trial, malipo, msimbo wa uanzishaji */
const LKEY = "duka_kiganjani_lic";
const B32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford
const EPOCH = Date.UTC(2024, 0, 1);
let LIC = { dev: "", install: "", lastSeen: 0, codes: [] }, LIC_EXP = "", CLOCK_BACK = false;

function b32enc(bytes){let bits=0,val=0,out="";for(const b of bytes){val=(val<<8)|b;bits+=8;while(bits>=5){out+=B32[(val>>>(bits-5))&31];bits-=5}}if(bits>0)out+=B32[(val<<(5-bits))&31];return out}
function b32dec(str){str=str.toUpperCase().replace(/[^0-9A-Z]/g,"").replace(/O/g,"0").replace(/[IL]/g,"1");let bits=0,val=0;const out=[];for(const ch of str){const i=B32.indexOf(ch);if(i<0)continue;val=(val<<5)|i;bits+=5;if(bits>=8){out.push((val>>>(bits-8))&255);bits-=8}}return new Uint8Array(out)}
function b64uDec(s){s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";const bin=atob(s);return Uint8Array.from(bin,c=>c.charCodeAt(0))}
const devPretty=d=>d.slice(0,4)+"-"+d.slice(4);

function licLoad(){
  try{const s=localStorage.getItem(LKEY);if(s)LIC=Object.assign(LIC,JSON.parse(s))}catch(e){}
  if(!LIC.dev){LIC.dev=b32enc(crypto.getRandomValues(new Uint8Array(5)));LIC.install=todayISO();LIC.lastSeen=Date.now();licSave()}
  const now=Date.now();
  if(now<LIC.lastSeen-36*3600*1000)CLOCK_BACK=true; else if(now>LIC.lastSeen){LIC.lastSeen=now;licSave()}
}
function licSave(){try{localStorage.setItem(LKEY,JSON.stringify(LIC))}catch(e){}}
function licToday(){return toISO(new Date(Math.max(Date.now(),LIC.lastSeen||0)))}

async function parseCode(code){
  const raw=String(code||"").trim().replace(/\s+/g,"");
  const m=raw.match(/DK1[-_]?([A-Za-z0-9_\-]{98})/)||raw.match(/DK1[-_]?([A-Za-z0-9_\-]+)/);if(!m)return {ok:false,err:"Msimbo si sahihi. Hakikisha umenakili wote, unaanza na DK1-."};
  let bytes;try{bytes=b64uDec(m[1])}catch(e){return {ok:false,err:"Msimbo umeharibika wakati wa kunakili."}}
  if(bytes.length!==73||bytes[0]!==1)return {ok:false,err:"Msimbo haujakamilika. Nakili ujumbe wote kutoka WhatsApp."};
  const payload=bytes.slice(0,9),sig=bytes.slice(9);
  const dev=b32enc(payload.slice(1,6)),days=(payload[6]<<8)|payload[7],months=payload[8];
  const exp=new Date(EPOCH+days*86400000).toISOString().slice(0,10);
  let ok=false;
  try{const key=await crypto.subtle.importKey("jwk",Object.assign({},APP.publicKey,{ext:true}),{name:"ECDSA",namedCurve:"P-256"},false,["verify"]);
    ok=await crypto.subtle.verify({name:"ECDSA",hash:"SHA-256"},key,sig,payload)}catch(e){return {ok:false,err:"Kifaa hiki hakiwezi kuthibitisha msimbo ("+e.message+")."}}
  if(!ok)return {ok:false,err:"Msimbo huu si halali."};
  if(dev!==LIC.dev)return {ok:false,err:"Msimbo huu ni wa kifaa kingine ("+devPretty(dev)+"). Namba ya kifaa hiki ni "+devPretty(LIC.dev)+"."};
  return {ok:true,exp,months,raw:"DK1-"+m[1]};
}
async function licVerifyStored(){
  let best="";for(const c of LIC.codes||[]){const r=await parseCode(c);if(r.ok&&r.exp>best)best=r.exp}
  LIC_EXP=best;
}
async function applyCode(code){
  const r=await parseCode(code);if(!r.ok)return r;
  if(r.exp<licToday())return {ok:false,err:"Msimbo huu umeshaisha muda ("+fd(r.exp)+")."};
  if(!LIC.codes.includes(r.raw))LIC.codes.push(r.raw);licSave();await licVerifyStored();
  return {ok:true,exp:LIC_EXP,months:r.months};
}
function licStatus(){
  const today=licToday(),trialEnd=addDays(LIC.install||today,APP.trialDays);
  if(LIC_EXP&&LIC_EXP>=today)return {state:"paid",expiry:LIC_EXP,daysLeft:daysBetween(today,LIC_EXP)+1,trialEnd};
  if(today<trialEnd)return {state:"trial",daysLeft:daysBetween(today,trialEnd),trialEnd,expiry:LIC_EXP};
  return {state:"expired",daysLeft:0,trialEnd,expiry:LIC_EXP};
}
const licActive=()=>licStatus().state!=="expired";
function waMessage(){
  const L=licStatus();
  return `Habari, naomba msimbo wa ${APP.name}.\nNamba ya kifaa: ${devPretty(LIC.dev)}\nDuka: ${D.setup.jina||"-"} (${aina().jina})\nSimu: ${D.setup.simu||"-"}\nLeseni ya sasa: ${L.state==="paid"?"hadi "+fd(L.expiry):L.state==="trial"?"majaribio":"imeisha"}\nNimelipa TSh ${fm(APP.pricePerMonth)} kwa ${APP.pay.network} ${APP.pay.number}.\nTransaction ID: `;
}
