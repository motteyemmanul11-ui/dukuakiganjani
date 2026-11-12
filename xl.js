/* ================================================================ EXCEL (offline: no internet, no library) */
const XL={};
XL.u8=s=>new TextEncoder().encode(s);
XL.crcT=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
XL.crc=b=>{let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=XL.crcT[(c^b[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0};
XL.zip=files=>{ // store-only zip writer
  const parts=[],cd=[];let off=0;
  for(const [name,data] of files){const nb=XL.u8(name),crc=XL.crc(data);
    const lh=new DataView(new ArrayBuffer(30));lh.setUint32(0,0x04034b50,true);lh.setUint16(4,20,true);lh.setUint16(8,0,true);
    lh.setUint32(14,crc,true);lh.setUint32(18,data.length,true);lh.setUint32(22,data.length,true);lh.setUint16(26,nb.length,true);
    parts.push(new Uint8Array(lh.buffer),nb,data);
    const ch=new DataView(new ArrayBuffer(46));ch.setUint32(0,0x02014b50,true);ch.setUint16(4,20,true);ch.setUint16(6,20,true);
    ch.setUint32(16,crc,true);ch.setUint32(20,data.length,true);ch.setUint32(24,data.length,true);ch.setUint16(28,nb.length,true);ch.setUint32(42,off,true);
    cd.push(new Uint8Array(ch.buffer),nb);off+=30+nb.length+data.length}
  const cdSize=cd.reduce((a,b)=>a+b.length,0),end=new DataView(new ArrayBuffer(22));
  end.setUint32(0,0x06054b50,true);end.setUint16(8,files.length,true);end.setUint16(10,files.length,true);end.setUint32(12,cdSize,true);end.setUint32(16,off,true);
  return new Blob([...parts,...cd,new Uint8Array(end.buffer)],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
};
XL.x=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"");
XL.col=i=>{let s="";i++;while(i>0){const m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=Math.floor((i-1)/26)}return s};
/* sheets: [{name, rows:[[...]], widths:[..], header:true, lists:{colIndex:[options]}, note:false}] */
XL.write=sheets=>{
  const files=[];
  files.push(["[Content_Types].xml",XL.u8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets.map((s,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}</Types>`)]);
  files.push(["_rels/.rels",XL.u8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`)]);
  files.push(["xl/workbook.xml",XL.u8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map((s,i)=>`<sheet name="${XL.x(s.name)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join("")}</sheets></workbook>`)]);
  files.push(["xl/_rels/workbook.xml.rels",XL.u8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((s,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join("")}<Relationship Id="rId${sheets.length+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`)]);
  files.push(["xl/styles.xml",XL.u8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="dd/mm/yyyy"/></numFmts><fonts count="3"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font><font><b/><sz val="13"/><color rgb="FF1F5C4A"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1F5C4A"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="6"><xf/><xf fontId="1" fillId="2" applyFont="1" applyFill="1"/><xf numFmtId="3" applyNumberFormat="1"/><xf numFmtId="164" applyNumberFormat="1"/><xf fontId="2" applyFont="1"/><xf numFmtId="49" applyNumberFormat="1"/></cellXfs></styleSheet>`)]);
  sheets.forEach((s,i)=>{
    const rows=s.rows.map((r,ri)=>`<row r="${ri+1}">${r.map((v,ci)=>{
      const ref=XL.col(ci)+(ri+1);if(v===""||v==null)return "";
      if(s.header&&ri===0)return `<c r="${ref}" t="inlineStr" s="1"><is><t>${XL.x(v)}</t></is></c>`;
      if(s.title&&ri===0)return `<c r="${ref}" t="inlineStr" s="4"><is><t>${XL.x(v)}</t></is></c>`;
      if(typeof v==="number"&&isFinite(v))return `<c r="${ref}" s="2"><v>${v}</v></c>`;
      if(v&&v.date){const d=parseISO(v.date),serial=Math.round((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(1899,11,30))/86400000);return `<c r="${ref}" s="3"><v>${serial}</v></c>`}
      return `<c r="${ref}" t="inlineStr"${s.textCols&&s.textCols.includes(ci)?' s="5"':""}><is><t xml:space="preserve">${XL.x(v)}</t></is></c>`}).join("")}</row>`).join("");
    const cols=s.widths?`<cols>${s.widths.map((w,ci)=>`<col min="${ci+1}" max="${ci+1}" width="${w}" customWidth="1"${s.textCols&&s.textCols.includes(ci)?' style="5"':""}/>`).join("")}</cols>`:"";
    const pane=s.header?`<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`:"";
    const lists=s.lists?Object.entries(s.lists).map(([ci,opt])=>`<dataValidation type="list" allowBlank="1" showErrorMessage="1" sqref="${XL.col(+ci)}2:${XL.col(+ci)}5000"><formula1>"${XL.x(opt.join(","))}"</formula1></dataValidation>`):[];
    const dv=lists.length?`<dataValidations count="${lists.length}">${lists.join("")}</dataValidations>`:"";
    files.push([`xl/worksheets/sheet${i+1}.xml`,XL.u8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${pane}${cols}<sheetData>${rows}</sheetData>${dv}</worksheet>`)]);
  });
  return XL.zip(files);
};
/* ---------- reader */
XL.inflate=async data=>{const ds=new DecompressionStream("deflate-raw");return new Uint8Array(await new Response(new Blob([data]).stream().pipeThrough(ds)).arrayBuffer())};
XL.unzip=async buf=>{
  const dv=new DataView(buf),u=new Uint8Array(buf),out={};let e=-1;
  for(let i=buf.byteLength-22;i>=Math.max(0,buf.byteLength-70000);i--)if(dv.getUint32(i,true)===0x06054b50){e=i;break}
  if(e<0)throw new Error("Faili hili si la Excel (.xlsx).");
  let p=dv.getUint32(e+16,true);const n=dv.getUint16(e+10,true),td=new TextDecoder();
  for(let k=0;k<n;k++){
    if(dv.getUint32(p,true)!==0x02014b50)break;
    const method=dv.getUint16(p+10,true),cs=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),el=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lo=dv.getUint32(p+42,true);
    const name=td.decode(u.subarray(p+46,p+46+nl));
    const ds=lo+30+dv.getUint16(lo+26,true)+dv.getUint16(lo+28,true);
    out[name]={method,data:u.subarray(ds,ds+cs)};p+=46+nl+el+cl;
  }
  return {get:async name=>{const f=out[name];if(!f)return null;const b=f.method===0?f.data:await XL.inflate(f.data);return new TextDecoder().decode(b)},names:Object.keys(out)};
};
XL.els=(node,tag)=>Array.from(node.getElementsByTagNameNS("*",tag));
XL.text=node=>XL.els(node,"t").map(t=>t.textContent).join("");
XL.read=async buf=>{
  const z=await XL.unzip(buf),P=s=>new DOMParser().parseFromString(s,"application/xml");
  const wbx=await z.get("xl/workbook.xml");if(!wbx)throw new Error("Faili hili si la Excel (.xlsx).");
  const ss=await z.get("xl/sharedStrings.xml"),shared=ss?XL.els(P(ss),"si").map(XL.text):[];
  const relx=await z.get("xl/_rels/workbook.xml.rels"),rels={};
  if(relx)for(const r of XL.els(P(relx),"Relationship")){let t=r.getAttribute("Target");t=t.startsWith("/")?t.slice(1):"xl/"+t;rels[r.getAttribute("Id")]=t}
  const sheets=[];
  for(const sh of XL.els(P(wbx),"sheet")){
    const rid=sh.getAttribute("r:id")||sh.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships","id");
    const path=rels[rid]||"xl/worksheets/sheet"+(sheets.length+1)+".xml";const x=await z.get(path);if(!x)continue;
    const rows=[];
    for(const row of XL.els(P(x),"row")){
      const ri=(+row.getAttribute("r")||rows.length+1)-1,arr=[];
      for(const c of XL.els(row,"c")){
        const ref=c.getAttribute("r")||"";const m=ref.match(/^[A-Z]+/);let ci=arr.length;
        if(m){ci=0;for(const ch of m[0])ci=ci*26+(ch.charCodeAt(0)-64);ci--}
        const t=c.getAttribute("t"),vEl=XL.els(c,"v")[0],v=vEl?vEl.textContent:"";let val;
        if(t==="s")val=shared[+v]??"";else if(t==="inlineStr")val=XL.text(c);else if(t==="b")val=v==="1";else if(t==="str"||t==="e")val=v;
        else val=v===""?"":Number(v);
        arr[ci]=val;
      }
      rows[ri]=arr;
    }
    sheets.push({name:sh.getAttribute("name"),rows:Array.from(rows,r=>r||[])});
  }
  return sheets;
};
XL.csv=text=>{const rows=[];let row=[],f="",q=false;text=text.replace(/^﻿/,"");
  const delim=(text.split("\n")[0].split(";").length>text.split("\n")[0].split(",").length)?";":",";
  for(let i=0;i<text.length;i++){const ch=text[i];
    if(q){if(ch==='"'){if(text[i+1]==='"'){f+='"';i++}else q=false}else f+=ch}
    else if(ch==='"')q=true;else if(ch===delim){row.push(f);f=""}else if(ch==="\n"){row.push(f);rows.push(row);row=[];f=""}else if(ch!=="\r")f+=ch}
  if(f!==""||row.length){row.push(f);rows.push(row)}return [{name:"CSV",rows}]};

function dlBlob(blob,name){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800)}
XL.norm=h=>String(h??"").toLowerCase().replace(/[^a-z0-9%]/g,"");
XL.headerRow=rows=>{for(let i=0;i<Math.min(rows.length,10);i++){const r=rows[i]||[];if(r.filter(v=>String(v??"").trim()!=="").length>=2)return i}return -1};
XL.date=v=>{if(v===""||v==null)return "";if(typeof v==="number"&&v>20000&&v<80000){const d=new Date(Date.UTC(1899,11,30)+Math.round(v)*86400000);return d.toISOString().slice(0,10)}
  const s=String(v).trim();let m=s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);if(m)return m[1]+"-"+m[2].padStart(2,"0")+"-"+m[3].padStart(2,"0");
  m=s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/);if(m){const y=m[3].length===2?"20"+m[3]:m[3];return y+"-"+m[2].padStart(2,"0")+"-"+m[1].padStart(2,"0")}return null};
