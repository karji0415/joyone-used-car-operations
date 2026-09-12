"use strict";
// Reuses the project XLSX XML reader; original package is retained for lossless cell edits.
  function xml(text) { const doc=new DOMParser().parseFromString(text,"application/xml");if(doc.getElementsByTagName("parsererror").length || doc.getElementsByTagNameNS("*","parsererror").length)throw new Error("XLSX内部XML无法解析");return doc; }
  function xmlElements(node,localName){return [...node.getElementsByTagNameNS("*",localName)];}
  function firstXmlElement(node,localName){return xmlElements(node,localName)[0] || null;}
  function directXmlChildren(node,localName){return [...(node?.children||[])].filter(child=>child.localName===localName);}
  function xmlText(bytes) { return new TextDecoder("utf-8").decode(bytes); }
  function normalizePath(base,target){if(target.startsWith("/"))return target.slice(1);const parts=base.split("/");parts.pop();for(const part of target.split("/")){if(part==="..")parts.pop();else if(part!==".")parts.push(part);}return parts.join("/");}
  function colIndex(ref){let letters=(ref.match(/[A-Z]+/i)||[""])[0].toUpperCase();let n=0;for(const ch of letters)n=n*26+ch.charCodeAt(0)-64;return n-1;}
  function columnName(index){let n=index+1,s="";while(n){const r=(n-1)%26;s=String.fromCharCode(65+r)+s;n=Math.floor((n-1)/26);}return s;}
  function excelDate(serial,date1904=false){const epoch=Date.UTC(date1904?1904:1899,date1904?0:11,date1904?1:30);return new Date(epoch+Number(serial)*86400000);}
  function looksDateFormat(code=""){const clean=String(code).replace(/\[[^\]]*\]|"[^"]*"|\\./g,"").toLowerCase();return /(^|[^a-z])[ymdhis]+/.test(clean);}

  async function parseXlsxFile(file) {
    const original=await file.arrayBuffer(); const archive=await readArchive(original); const zip={read: async name => archive.file(name) ? archive.file(name).async("uint8array") : null};
    const workbookBytes=await zip.read("xl/workbook.xml");if(!workbookBytes)throw new Error("文件中找不到工作簿信息");const workbookDoc=xml(xmlText(workbookBytes));const dateSetting=firstXmlElement(workbookDoc,"workbookPr")?.getAttribute("date1904");const date1904=dateSetting==="1" || dateSetting==="true";
    const relBytes=await zip.read("xl/_rels/workbook.xml.rels");if(!relBytes)throw new Error("文件中找不到工作表关系");const relDoc=xml(xmlText(relBytes));const rels=new Map(xmlElements(relDoc,"Relationship").map(node=>[node.getAttribute("Id"),node.getAttribute("Target")]));
    let shared=[];const sharedBytes=await zip.read("xl/sharedStrings.xml");if(sharedBytes){const doc=xml(xmlText(sharedBytes));shared=xmlElements(doc,"si").map(si=>xmlElements(si,"t").map(t=>t.textContent||"").join(""));}
    const customFormats=new Map();const styleFormats=[];const stylesBytes=await zip.read("xl/styles.xml");if(stylesBytes){const doc=xml(xmlText(stylesBytes));xmlElements(doc,"numFmt").forEach(n=>customFormats.set(Number(n.getAttribute("numFmtId")),n.getAttribute("formatCode")||""));const cellXfs=firstXmlElement(doc,"cellXfs");directXmlChildren(cellXfs,"xf").forEach(n=>styleFormats.push(Number(n.getAttribute("numFmtId")||0)));}
    const builtInDates=new Set([14,15,16,17,18,19,20,21,22,27,30,36,45,46,47,50,57]);
    const sheetDefs=xmlElements(workbookDoc,"sheet").map(node=>({name:node.getAttribute("name")||"Sheet",rid:node.getAttribute("r:id")||node.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships","id")}));
    const sheets=[];
    for(const def of sheetDefs){const target=rels.get(def.rid);if(!target)continue;const path=normalizePath("xl/workbook.xml",target);const data=await zip.read(path);if(!data)continue;const doc=xml(xmlText(data));const rows=[];const sheetData=firstXmlElement(doc,"sheetData");for(const rowNode of directXmlChildren(sheetData,"row")){const rowNumber=Number(rowNode.getAttribute("r")||rows.length+1);const cells=new Map();for(const c of directXmlChildren(rowNode,"c")){const ref=c.getAttribute("r")||"A1";const index=colIndex(ref);const t=c.getAttribute("t")||"n";const styleIndex=Number(c.getAttribute("s")||0);const formulaNode=directXmlChildren(c,"f")[0]||null;const valueNode=directXmlChildren(c,"v")[0]||null;let value="";if(t==="inlineStr")value=xmlElements(c,"t").map(n=>n.textContent||"").join("");else if(t==="s")value=shared[Number(valueNode?.textContent||0)] ?? "";else if(t==="b")value=valueNode?.textContent==="1";else if(t==="e" || t==="str")value=valueNode?.textContent||"";else value=valueNode?.textContent==null?"":Number(valueNode.textContent);const numFmtId=styleFormats[styleIndex]||0;const numFmtCode=customFormats.get(numFmtId)||"";const isDate=(builtInDates.has(numFmtId)||looksDateFormat(numFmtCode)) && typeof value==="number";cells.set(index,{ref,row:rowNumber,col:index,value,rawType:t,formula:formulaNode?.textContent||"",styleIndex,numFmtId,numFmtCode,isDate,display:isDate?excelDate(value,date1904).toISOString().slice(0,10):String(value ?? "")});}rows.push({rowNumber,cells});}
      const merges=xmlElements(doc,"mergeCell").map(n=>n.getAttribute("ref")).filter(Boolean);
      for(const range of merges){const [a,b=a]=range.split(":");const c1=colIndex(a),c2=colIndex(b),r1=Number(a.match(/\d+/)[0]),r2=Number(b.match(/\d+/)[0]);for(const row of rows){if(row.rowNumber<r1||row.rowNumber>r2)continue;for(const [col,cell] of row.cells)if(col>=c1&&col<=c2)cell.merged=true;}}
      const sheet={name:def.name,path,rows,date1904};sheet.headerRow=detectHeaderRow(sheet);sheets.push(sheet);
    }
    if(!sheets.length)throw new Error("工作簿中没有可读取的Sheet");return {fileName:file.name,date1904,sheets,original};
  }

  function detectHeaderRow(sheet) {
    let best={row:1,score:-1};for(const row of sheet.rows.filter(r=>r.rowNumber<=30)){const values=[...row.cells.values()].map(c=>String(c.value||"").trim()).filter(Boolean);const keyBonus=values.some(v=>/vin|车架|经销商|dealer|邮箱|email|拍卖|auction|session|场次/i.test(v))?8:0;const score=values.length+keyBonus;if(score>best.score)best={row:row.rowNumber,score};}return best.row;
  }

const MAX_ARCHIVE_BYTES = 150 * 1024 * 1024;
function safeArchivePath(path) {
  return path && !/^[\\/]|^[a-z]:/i.test(path) && !path.includes('\\') && !path.split('/').some(p => p === '..' || /[\x00-\x1f:*?"<>|]/.test(p));
}
async function readArchive(buffer) {
  if (buffer.byteLength > 50 * 1024 * 1024) throw new Error('文件超过 50 MB，请拆分后导入。');
  const archive = await JSZip.loadAsync(buffer);
  const entries = Object.values(archive.files);
  let size = 0;
  if (entries.length > 2000) throw new Error('压缩包条目超过 2000 个，请拆分后导入。');
  for (const entry of entries) {
    if (!safeArchivePath(entry.unsafeOriginalName || entry.name)) throw new Error('压缩包含有不安全路径，已停止导入。');
    size += entry._data?.uncompressedSize || 0;
    if (size > MAX_ARCHIVE_BYTES) throw new Error('解压内容超过 150 MB，请拆分后导入。');
  }
  return archive;
}
function parseCsv(text) {
  const rows = []; let row = [], value = '', quoted = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i + 1] === '"') { value += '"'; i++; } else quoted = !quoted; }
    else if (c === ',' && !quoted) { row.push(value); value = ''; }
    else if ((c === '\n' || c === '\r') && !quoted) { if(c === '\r' && text[i+1] === '\n') i++; row.push(value); rows.push(row); row = []; value = ''; }
    else value += c;
  }
  if (quoted) throw new Error('CSV 引号不完整，请检查文件。');
  if (value || row.length) { row.push(value); rows.push(row); }
  return rows;
}
async function readWorkbook(file) {
  if (file.size > 50 * 1024 * 1024) throw new Error('表格超过 50 MB，请拆分后导入。');
  if (/\.xlsx$/i.test(file.name)) return parseXlsxFile(file);
  if (!/\.csv$/i.test(file.name)) throw new Error('支持 XLSX 和 UTF-8 CSV；旧版 XLS 请先另存为 XLSX。');
  const rows = parseCsv(await file.text()).map((values, i) => ({rowNumber:i+1,cells:new Map(values.map((value, col)=>[col,{ref:columnName(col)+(i+1),col,row:i+1,value,display:value,rawType:'str',formula:''}]))}));
  const sheet = {name:'CSV', rows, date1904:false}; sheet.headerRow = detectHeaderRow(sheet);
  return {fileName:file.name,sheets:[sheet],original:await file.arrayBuffer(),csv:true};
}
function bookHeaders(book) {
  const sheet = book.sheets[book.sheetIndex || 0];
  const row = sheet.rows.find(r => r.rowNumber === book.headerRow);
  return row ? [...row.cells].map(([index,c]) => ({index,label:c.display || columnName(index)})) : [];
}
function bookRows(book) {
  return book.sheets[book.sheetIndex || 0].rows.filter(r => r.rowNumber > book.headerRow && [...r.cells.values()].some(c => c.display !== ''));
}
function mapped(row, book, field) { return row.cells.get(Number(book.mapping?.[field] ?? -1))?.display.trim() || ''; }
function rowDescription(row, book) { return bookHeaders(book).map(h => `${h.label}：${row.cells.get(h.index)?.display || '—'}`).join(' · '); }
async function changedWorkbook(book, changes) {
  if (book.csv) {
    const rows = book.sheets[0].rows.map(r => { const out=[]; for(const [col,c] of r.cells) out[col]=changes[c.ref] ?? c.display; return out; });
    // Prevent spreadsheet formula execution when exporting untrusted CSV values.
    const text = rows.map(row => Array.from(row,v => '"'+String(v ?? '').replace(/^[=+@-]/,m=>"'"+m).replace(/"/g,'""')+'"').join(',')).join('\r\n');
    return new Blob(['\uFEFF',text],{type:'text/csv;charset=utf-8'});
  }
  const zip = await readArchive(book.original);
  const sheet = book.sheets[book.sheetIndex || 0];
  const doc = xml(await zip.file(sheet.path).async('string'));
  for (const c of xmlElements(doc,'c')) {
    const ref = c.getAttribute('r');
    if (!(ref in changes)) continue;
    if (firstXmlElement(c,'f')) throw new Error('公式单元格不可直接编辑，请在 Excel 中修改。');
    const old = sheet.rows.find(r=>r.rowNumber===Number(ref.match(/\d+/)[0]))?.cells.get(colIndex(ref));
    const value = changes[ref];
    [...c.children].forEach(n=> { if(['v','is','f'].includes(n.localName)) n.remove(); });
    if (old?.isDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0,10)!==value) throw new Error(`${ref} 请输入有效日期 YYYY-MM-DD。`);
      c.removeAttribute('t');const v=doc.createElementNS(c.namespaceURI,'v');v.textContent=String((Date.parse(value)-excelDate(0,sheet.date1904).getTime())/86400000);c.append(v);
    } else if (typeof old?.value === 'number' && /^[-+]?\d+(\.\d+)?$/.test(value)) {
      c.removeAttribute('t');const v=doc.createElementNS(c.namespaceURI,'v');v.textContent=value;c.append(v);
    } else {
      c.setAttribute('t','inlineStr');const is=doc.createElementNS(c.namespaceURI,'is');const t=doc.createElementNS(c.namespaceURI,'t');t.setAttribute('xml:space','preserve');t.textContent=value;is.append(t);c.append(is);
    }
  }
  zip.file(sheet.path,new XMLSerializer().serializeToString(doc));
  // Ask Excel to recalculate dependent formulas on open; no cached calculation is claimed here.
  const wb=xml(await zip.file('xl/workbook.xml').async('string'));
  let calc=firstXmlElement(wb,'calcPr');if(!calc){calc=wb.createElementNS(wb.documentElement.namespaceURI,'calcPr');wb.documentElement.append(calc);}
  calc.setAttribute('fullCalcOnLoad','1');calc.setAttribute('forceFullCalc','1');zip.file('xl/workbook.xml',new XMLSerializer().serializeToString(wb));
  return zip.generateAsync({type:'blob',compression:'DEFLATE',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
const database = new Promise((resolve,reject)=>{
  const request=indexedDB.open('joyone-files-v1',1);
  request.onupgradeneeded=()=>request.result.createObjectStore('files');
  request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
});
async function storeFile(key,value) { const db=await database;return new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').put(value,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);}); }
async function loadFiles() {const db=await database;return new Promise((resolve,reject)=>{const tx=db.transaction('files');const store=tx.objectStore('files');const keys=store.getAllKeys(),values=store.getAll();tx.oncomplete=()=>resolve(Object.fromEntries(keys.result.map((k,i)=>[k,values.result[i]])));tx.onerror=()=>reject(tx.error);});}
