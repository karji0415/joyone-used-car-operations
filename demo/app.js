"use strict";

const icons = {
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.8 10.8 12 4l8.2 6.8"/><path d="M5.8 9.8v9.3c0 .5.4.9.9.9h10.6c.5 0 .9-.4.9-.9V9.8M9.5 20v-6.2h5V20"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.7"/><path d="m15.8 15.8 4.4 4.4"/></svg>',
  car: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 9.2 7 5.8c.3-.6.9-1 1.6-1h6.8c.7 0 1.3.4 1.6 1l1.8 3.4 1.4 2.1c.3.5.5 1 .5 1.6v4.5c0 .7-.6 1.3-1.3 1.3H4.6c-.7 0-1.3-.6-1.3-1.3v-4.5c0-.6.2-1.1.5-1.6l1.4-2.1Z"/><path d="M5.2 9.2h13.6M6.8 14.1h.01M17.2 14.1h.01M6.2 18.7v1.1M17.8 18.7v1.1"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2c.5 2.7 2.1 4.3 4.8 4.8-2.7.5-4.3 2.1-4.8 4.8-.5-2.7-2.1-4.3-4.8-4.8 2.7-.5 4.3-2.1 4.8-4.8Z"/><path d="M18.2 13.4c.3 1.9 1.5 3.1 3.4 3.4-1.9.3-3.1 1.5-3.4 3.4-.3-1.9-1.5-3.1-3.4-3.4 1.9-.3 3.1-1.5 3.4-3.4Z"/></svg>',
  sheet: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="3.2"/><path d="M3.5 9.2h17M9.2 3.5v17M14.8 9.2v11.3M9.2 14.8h11.3"/></svg>',
  "check-square": '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="m7.7 12.2 2.8 2.8 5.9-6.4"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.3" y="5.2" width="17.4" height="13.6" rx="3"/><path d="m4.5 7 6.5 5.2c.6.5 1.4.5 2 0L19.5 7"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.3v5l3.3 1.9"/></svg>',
  grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.8"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1.8"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1.8"/><rect x="14" y="14" width="6.5" height="6.5" rx="1.8"/></svg>',
  shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 4.5 6v5.8c0 4.5 2.9 7.6 7.5 9 4.6-1.4 7.5-4.5 7.5-9V6L12 3.2Z"/><path d="m8.6 12.1 2.2 2.2 4.7-5"/></svg>',
  send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.2 10.8 17.6-7.3-6.7 17-3.2-6.5-7.7-3.2Z"/><path d="m10.9 14 4.3-4.3"/></svg>',
  file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.2 2.8h7.4l4.2 4.3v14.1H6.2V2.8Z"/><path d="M13.6 2.8v4.5h4.2M9.2 12.1h5.6M9.2 16h5.6"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12h14.8M14.5 7.2l4.8 4.8-4.8 4.8"/></svg>',
  user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.8"/><path d="M4.5 20.5c.6-4.1 3.4-6.5 7.5-6.5s6.9 2.4 7.5 6.5"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.8 7v4.8H15M4.2 17v-4.8H9"/><path d="M18.4 9A7 7 0 0 0 6.2 6.6L4.2 9M5.6 15A7 7 0 0 0 17.8 17.4l2-2.4"/></svg>'
};

const jobs = [{id:'inventory',name:'库存盘点',cycle:'常驻'},{id:'sales',name:'销售台账',cycle:'每日'},{id:'auction',name:'拍卖报告',cycle:'常驻'},{id:'hil',name:'车辆台账',cycle:'常驻'},{id:'weekly',name:'业务周报',cycle:'每周'}];
const defaultTemplates = [
  {id:'contract',name:'合同/材料邮寄',subject:'车辆材料邮寄 · {{经销商}}',body:'{{经销商}}，你好：\n\n请协助处理以下车辆的合同及材料。\nVIN：{{VIN}}\n联系电话：{{电话}}\n邮寄地址：{{地址}}\n\n谢谢。'},
  {id:'ctc',name:'付款通知',subject:'付款通知 · {{经销商}}',body:'{{经销商}}，你好：\n\n车辆 VIN：{{VIN}}\n金额：{{金额}}\n日期：{{日期}}\n\n请核对付款信息，谢谢。'},
  {id:'hil',name:'拍卖结果通知',subject:'拍卖结果通知 · {{经销商}}',body:'{{经销商}}，你好：\n\n车辆 VIN：{{VIN}}\n拍卖金额：{{金额}}\n拍卖日期：{{日期}}\n\n请查收，谢谢。'}
];
const seed = {templates:defaultTemplates,mailRecords:[],audit:[],transfers:[
  {vin:'WBA•••••79247',dealer:'经销商 03',steps:[true,true,false,false,false],sample:true},
  {vin:'WBY•••••21470',dealer:'经销商 12',steps:[true,true,true,false,false],sample:true},
  {vin:'WBA•••••18562',dealer:'经销商 21',steps:[true,false,false,false,false],sample:true}
],maskVin:true,expanded:[],mail:{templateId:'contract',dealer:'',email:'',phone:'',address:'',vin:'',amount:'',date:'',subject:'',body:''}};
let state;try{state=Object.assign(structuredClone(seed),JSON.parse(localStorage.getItem('joyone-workspace-v3')||'null'));}catch{state=structuredClone(seed);}
function genericTemplateLabel(text){return String(text||'').replace(/^[A-Z]{2,4} (?=付款通知|拍卖结果)/,'');}
for(const t of state.templates){if(defaultTemplates.some(d=>d.id===t.id)){t.name=genericTemplateLabel(t.name);t.subject=genericTemplateLabel(t.subject);}}
state.mail.subject=genericTemplateLabel(state.mail.subject);
for(const record of state.mailRecords)record.subject=genericTemplateLabel(record.subject);
let route='today',selectedJob='inventory',books={},materials={},importKey='inventory',importDraft=null,editSession=null,zipDraft=null,mailCheck=null,loading=true;
let searchQuery='',searchPage=0,editorPage=0;const PAGE_SIZE=40;
const main=document.getElementById('main');
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function icon(name){return icons[name]||icons.file;}
function saveState(){try{localStorage.setItem('joyone-workspace-v3',JSON.stringify(state));}catch{toast('浏览器存储已满；请导出重要记录，本次更改暂存在当前页面。');}}
function log(action,detail){state.audit.unshift({time:new Date().toLocaleString('zh-CN'),action,detail});saveState();}
function toast(text){const n=document.createElement('div');n.className='toast';n.textContent=text;document.getElementById('toastRegion').append(n);setTimeout(()=>n.remove(),4500);}
function detail(title,body){document.getElementById('detailTitle').textContent=title;document.getElementById('detailBody').innerHTML=body;const d=document.getElementById('detailDialog');if(!d.open)d.showModal();}
function closeDetail(){document.getElementById('detailDialog').close();}
function pageHeader(title,subtitle=''){return `<header class="page-header"><div><h1>${esc(title)}</h1>${subtitle?`<p class="page-subtitle">${esc(subtitle)}</p>`:''}</div>${route!=='today'?'<button class="button secondary" data-route="today">← 返回今日</button>':''}</header>`;}
function empty(text){return `<div class="empty-state">${icon('file')}<p>${esc(text)}</p></div>`;}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
function render(){
  main.innerHTML=({today:renderToday,sheets:renderSheets,transfer:renderTransfer,mail:renderMail,search:renderSearch,log:renderLog}[route]||renderToday)();
  document.querySelectorAll('[data-icon]').forEach(n=>n.innerHTML=icon(n.dataset.icon));
  document.querySelectorAll('.side-nav [data-route]').forEach(n=>{n.classList.toggle('active',n.dataset.route===route);if(n.dataset.route===route)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');});
  document.getElementById('currentPageLabel').textContent=({today:'今日',sheets:'表格核查',transfer:'车辆任务',mail:'邮件草稿',search:'搜索',log:'核查与记录'})[route];
  document.getElementById('todayNavCount').textContent=pendingCount(); updateMailStatus();
}
function navigate(next){if(next==='process')next='transfer';if(!['today','sheets','transfer','mail','search','log'].includes(next))return;route=next;if(window.matchMedia?.('(max-width:600px)')?.matches)document.body.classList.remove('sidebar-collapsed');render();window.scrollTo(0,0);}
function overview(label,value,unit,target,key){return `<button class="overview-item" data-route="${target}" ${key?`data-key="${key}"`:''}><span>${label}${icon(target==='mail'?'mail':target==='transfer'?'car':'sheet')}</span><strong>${value}<small>${unit}</small></strong><p>打开查看 ${icon('arrow')}</p></button>`;}
function renderToday(){return `<div class="page"><div class="page-date">${new Date().toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'})}</div>${pageHeader('今日工作')}${taskOverview()}${followupSummary()}${renderTaskQueue()}<section class="card routine-card"><div class="card-head"><h2>日常工作</h2><span class="subtle">常驻与周期工作</span></div><div class="card-body">${jobs.map(j=>`<div class="work-row"><div><strong>${j.name}</strong><p>${books[j.id]?esc(books[j.id].fileName):'尚未导入表格'}</p></div><div class="button-row"><span class="status dark">${j.cycle}</span><button class="button secondary small" data-route="sheets" data-key="${j.id}">打开</button></div></div>`).join('')}<div class="work-row"><strong>付款通知</strong><button class="button secondary small" data-route="mail" data-template="ctc">打开邮件</button></div></div></section></div>`;}
function importButton(key,label='表格导入'){return `<button class="button secondary" data-action="import-book" data-key="${key}" ${loading?'disabled':''}>${icon('sheet')}${label}</button>`;}
function fileGrid(key){const b=books[key],files=materials[key]||[];return `<div class="file-grid"><div class="file-card"><div><strong>表格导入</strong><small>${b?esc(b.fileName):'尚未导入 · XLSX / CSV'}</small></div><div class="button-row">${importButton(key,b?'重新导入':'选择表格')}${b?`<button class="button ghost small" data-action="open-book" data-key="${key}">打开表格</button>`:''}</div></div><div class="file-card"><div><strong>新增材料</strong><small>${files.length?`${files.length} 个文件`:'ZIP、邮件、照片、PDF 或表格'}</small></div><div class="button-row"><button class="button secondary" data-action="import-materials" data-key="${key}" ${loading?'disabled':''}>选择材料</button>${files.length?`<button class="button ghost small" data-action="view-materials" data-key="${key}">打开材料</button>`:''}</div></div></div>`;}
function renderSheets(){const job=jobs.find(j=>j.id===selectedJob)||jobs[0];return `<div class="page">${pageHeader('表格核查')}<section class="sheets-layout"><aside class="job-rail" aria-label="表格任务">${jobs.map(j=>`<button class="job-card ${j.id===job.id?'active':''}" data-job="${j.id}"><strong>${j.name}</strong><small>${j.cycle} · ${books[j.id]?'已导入':'待导入'}</small></button>`).join('')}</aside><div class="sheet-workspace"><section class="card workflow-card"><div class="workflow-head"><h2>${job.name}</h2><span class="status blue">${job.cycle}</span></div><div class="workflow-body">${fileGrid(job.id)}${versionPanel(job.id)}${job.id==='inventory'?renderInventory():''}${job.id==='sales'?'<button class="button primary" data-route="mail">打开邮件核查</button>':''}</div></section></div></section></div>`;}
function inventoryGroups(){const book=books.inventory;if(!book)return null;const rows=bookRows(book),files=materials.inventory||[];const dealerMap=new Map();const matched=[],missing=[],review=[],confirmed=[];
  for(const row of rows){const dealer=mapped(row,book,'dealer'),vin=mapped(row,book,'vin');const label=dealer||'未填写经销商';if(!dealerMap.has(label))dealerMap.set(label,{title:label,rows:0,matched:0});const d=dealerMap.get(label);d.rows++;
    const full=/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);const candidates=vin?files.filter(f=>f.name.toUpperCase().includes((full?vin:vin.slice(-7)).toUpperCase())):[];
    const record={title:vin||`第 ${row.rowNumber} 行`,detail:`${label} · ${candidates.length?candidates.map(f=>f.name).join('、'):'未找到文件名匹配材料'}`,row:row.rowNumber};
    const approval=state.inventoryReviews?.[row.rowNumber];if(approval&&approval.version===(book.version||1)&&approval.materialRevision===(state.materialRevision||0)){confirmed.push({...record,detail:`人工已确认 · ${approval.time} · ${approval.files.join('、')}`});continue;}
    if(full&&candidates.length){matched.push(record);d.matched++;}else if(!full||files.some(f=>vin&&f.name.toUpperCase().includes(vin.slice(-7).toUpperCase()))){review.push({...record,detail:`${record.detail} · VIN 不完整或仅后七位匹配，待人工确认`});}else missing.push(record);
  }
  return {dealers:[...dealerMap.values()].map(d=>({title:d.title,detail:`表格 ${d.rows} 辆 · 文件名完整 VIN 匹配 ${d.matched} 辆；邮件反馈需人工确认`})),matched,missing,review,confirmed};
}
function renderInventory(){const g=inventoryGroups();return `<div class="result-grid">${[['dealers','盘点经销商'],['matched','车辆候选匹配'],['missing','材料待补充'],['review','人工核查'],['confirmed','人工已确认']].map(([id,label])=>`<button class="result-card" data-action="inventory-detail" data-group="${id}"><span>${label}</span><strong>${g?g[id].length:'—'}</strong><small>查看明细</small></button>`).join('')}</div>`;}
function vinLabel(vin){return state.maskVin?`${vin.slice(0,3)}•••••${vin.slice(-5)}`:vin;}
const transferLabels=['材料准备','材料邮寄','过户办理','扫描归档','退保'];
function renderTransfer(){return `<div class="page">${pageHeader('车辆任务')}${followupSummary()}<div class="toolbar"><button class="button secondary" data-action="mask-vin">${state.maskVin?'显示车辆号码':'隐藏车辆号码'}</button><button class="button secondary" data-action="expand-all">全部展开</button><button class="button secondary" data-action="collapse-all">全部收起</button><button class="button primary" data-action="new-transfer">新增过户</button></div><section class="transfer-list">${state.transfers.map((t,i)=>`<details class="transfer-card" data-transfer="${i}" ${state.expanded.includes(i)?'open':''}><summary><div><strong>${esc(vinLabel(t.vin))}</strong><p>${esc(t.dealer)}${t.sample?' · 示例记录':''}</p></div><span class="status blue">${t.steps.filter(Boolean).length} / 5 完成</span><span class="expand-label">展开 / 收起</span></summary><div class="transfer-content"><div class="check-steps">${transferLabels.map((l,j)=>`<button class="check-step ${t.steps[j]?'done':''}" data-step="${j}" data-transfer-id="${i}" aria-pressed="${t.steps[j]}"><i>${t.steps[j]?'✓':j+1}</i><span>${l}</span><small>${t.stepTimes?.[j]?esc(t.stepTimes[j]):''}</small></button>`).join('')}</div><div class="toolbar transfer-tools"><button class="button secondary small" data-transfer-note="${i}">备注与材料</button><button class="button ghost small" data-vehicle-search="${i}">相关表格与邮件</button><span class="subtle">${esc(t.note||'')}</span></div></div></details>`).join('')}</section></div>`;}
function template(){return state.templates.find(t=>t.id===state.mail.templateId)||state.templates[0];}
function interpolate(text){const m=state.mail,values={'经销商':m.dealer,'邮箱':m.email,'电话':m.phone,'地址':m.address,'VIN':m.vin,'金额':m.amount,'日期':m.date};return text.replace(/\{\{([^}]+)\}\}/g,(all,key)=>values[key]||all);}
function applyTemplate(){const t=template();state.mail.subject=interpolate(t.subject);state.mail.body=interpolate(t.body);invalidateMail();saveState();}
function mailField(key,label,type='text'){return `<div class="field"><label for="mail-${key}">${label}</label><input class="input" id="mail-${key}" data-mail-field="${key}" type="${type}" value="${esc(state.mail[key])}"></div>`;}
function renderMail(){if(!state.mail.subject&&!state.mail.body)applyTemplate();return `<div class="page">${pageHeader('邮件草稿')}${linkedMailBanner()}<div class="mail-toolbar"><section class="mail-tabs">${state.templates.map(t=>`<button class="mail-tab ${t.id===state.mail.templateId?'active':''}" data-template="${esc(t.id)}">${esc(t.name)}</button>`).join('')}</section><button class="button secondary" data-action="new-template">＋ 添加模板</button></div><section class="card directory-panel"><div class="toolbar">${importButton('dealers','导入经销商通讯录')}${importButton('sales','导入销售台账')}<span class="subtle">${books.dealers?esc(books.dealers.fileName):'未导入通讯录'}${books.sales?' · 销售台账已导入':''}</span></div><label class="dealer-search-label" for="dealerSearch">搜索经销商名称</label><input class="search-input" id="dealerSearch" placeholder="输入名称，选择匹配结果自动填写"><div id="dealerResults" class="dealer-results"></div></section><section class="mail-workspace"><div class="workflow-head"><h2>${esc(template().name)}</h2><div class="button-row"><span id="mailStatus" class="status amber" role="status"></span><button class="button secondary" data-action="check-mail">核查邮件</button></div></div><div class="workflow-body"><div class="compose">${mailField('dealer','经销商')}${mailField('email','收件邮箱')}${mailField('phone','电话')}${mailField('address','地址')}<div class="mail-data-row">${mailField('vin','车辆 VIN')}${mailField('amount','金额')}${mailField('date','日期')}</div><div class="button-row inline-actions"><button class="button secondary small" data-action="lookup-sales">按 VIN 读取销售台账</button><button class="button secondary small" data-action="apply-template">用当前信息填充模板</button></div>${mailField('subject','主题')}<div class="field"><label for="mail-body">正文</label><textarea class="textarea" id="mail-body" data-mail-field="body">${esc(state.mail.body)}</textarea></div><div id="mailCheckResult">${mailCheck?renderMailCheck():''}</div><div class="button-row mail-actions"><button class="button primary" data-action="copy-mail">复制邮件</button><button class="button secondary" data-action="outlook">打开邮件草稿</button><button class="button secondary" data-action="save-mail">保存邮件记录</button></div></div></div></section></div>`;}
function dealerCandidates(query){const b=books.dealers;if(!b||!query.trim())return [];return bookRows(b).filter(r=>mapped(r,b,'dealer').toLowerCase().includes(query.trim().toLowerCase()));}
function dealerResults(query){const all=dealerCandidates(query),target=document.getElementById('dealerResults');target.innerHTML=!books.dealers?'<p class="subtle">请先导入通讯录，并映射经销商、邮箱、电话、地址列。</p>':!all.length?'<p class="subtle">未找到匹配经销商。</p>':all.slice(0,30).map(r=>`<button class="dealer-result" data-dealer-row="${r.rowNumber}"><strong>${esc(mapped(r,books.dealers,'dealer'))}</strong><span>${esc(mapped(r,books.dealers,'email')||'未填写邮箱')} · ${esc(mapped(r,books.dealers,'address'))}</span></button>`).join('')+(all.length>30?'<p>结果较多，请继续输入名称缩小范围。</p>':'');}
function mailRecord(action){followupMailEvent(action);const record={...state.mail,id:crypto.randomUUID(),time:new Date().toLocaleString('zh-CN'),action};state.mailRecords.unshift(record);log(action,`${record.dealer} · ${record.subject}`);}
function checkMail(){const b=books.sales,m=state.mail,checks=[];const add=(field,status,text)=>checks.push({field,status,text});
  if(!b){add('销售台账','missing','未导入销售台账，无法核查。');return checks;}
  if(!/^[A-HJ-NPR-Z0-9]{17}$/i.test(m.vin)){add('VIN','missing','请输入完整 17 位 VIN。');return checks;}
  const rows=bookRows(b).filter(r=>mapped(r,b,'vin').toUpperCase()===m.vin.trim().toUpperCase());
  if(rows.length!==1){add('VIN','missing',rows.length?'销售台账 中有多条同 VIN 记录，请先确认唯一依据。':'销售台账 中未找到此 VIN。');return checks;}
  const row=rows[0];add('VIN','ok',`${b.fileName} · ${b.sheets[b.sheetIndex||0].name} · 第 ${row.rowNumber} 行`);
  const labels=state.mail.followupId?{dealer:'经销商'}:{dealer:'经销商',amount:'金额',date:'日期'};
  const norm=(value,key)=>key==='amount'?String(value).replace(/[,，￥¥\s]/g,''):String(value).trim().toLowerCase().replace(/\s/g,'');
  for(const [field,label] of Object.entries(labels)){const expected=mapped(row,b,field);if(!expected)add(label,'missing','销售台账 未映射此列或该值为空，未核查。');else add(label,norm(expected,field)===norm(m[field],field)?'ok':'diff',`销售台账：${expected}；邮件：${m[field]||'未填写'}`);}
  const directory=books.dealers,contacts=directory?bookRows(directory).filter(r=>mapped(r,directory,'dealer').trim()===m.dealer.trim()):[];
  for(const [field,label] of Object.entries({email:'收件邮箱',phone:'电话',address:'地址'})){
    if(contacts.length!==1){add(label,'missing',!directory?'未导入经销商通讯录。':contacts.length?'通讯录中存在同名经销商，请先整理唯一联系人。':'通讯录未找到此经销商。');continue;}
    const expected=mapped(contacts[0],directory,field);
    add(label,!expected?'missing':norm(expected,field)===norm(m[field],field)?'ok':'diff',`${directory.fileName} · 第 ${contacts[0].rowNumber} 行：${expected||'未填写'}；邮件：${m[field]||'未填写'}`);
  }
  const text=m.subject+'\n'+m.body;const vins=text.match(/\b[A-HJ-NPR-Z0-9]{17}\b/gi)||[];
  add('正文 VIN',vins.length&&vins.every(v=>v.toUpperCase()===m.vin.toUpperCase())?'ok':'diff',vins.length?`检测到：${vins.join('、')}`:'主题与正文中未找到完整 VIN。');
  const unresolved=text.match(/\{\{[^}]+\}\}/g);if(unresolved)add('模板变量','diff',`尚未填写：${unresolved.join('、')}`);
  for(const [key,label] of Object.entries({dealer:'经销商',phone:'电话',address:'地址',amount:'金额',date:'日期'})) {if(template().body.includes('{{'+label+'}}')&&m[key])add(`正文${label}`,m.body.includes(m[key])?'ok':'diff',m.body.includes(m[key])?'正文包含当前字段值。':'正文与当前字段不同，请检查或重新填充模板。');}
  return checks;
}
function renderMailCheck(){return `<div class="check-results"><h3>字段核查结果</h3><div class="toolbar"><button class="button ghost small" data-action="mail-source" data-key="sales">查看 销售台账 依据</button><button class="button ghost small" data-action="mail-source" data-key="dealers">查看通讯录依据</button></div>${mailCheck.map(c=>`<div class="check-result"><span class="status ${c.status==='ok'?'green':c.status==='diff'?'red':'amber'}">${c.status==='ok'?'一致':c.status==='diff'?'需修正':'未核查'}</span><strong>${esc(c.field)}</strong><p>${esc(c.text)}</p></div>`).join('')}</div>`;}
function allRecords(){const records=followupList().map(t=>({title:t.title,detail:`${t.vin} · ${t.dealer} · ${t.owner} · ${t.due} · ${t.status}`,tag:'跟进任务',followupId:t.id}));for(const h of reviewHistory)records.push({title:h.sourceName,detail:`${h.createdAt} · ${h.status||'已归档'} · ${h.items.length} 处差异`,tag:'核查历史',reviewId:h.id});
  for(const [key,b] of Object.entries(books)){b.sheets.forEach((sheet,si)=>{const view={...b,sheetIndex:si,headerRow:si===(b.sheetIndex||0)?b.headerRow:sheet.headerRow};for(const row of bookRows(view))records.push({title:`${b.fileName} · ${sheet.name} · 第 ${row.rowNumber} 行`,detail:rowDescription(row,view),tag:'表格',key,sheet:si,row:row.rowNumber});});}
  state.transfers.forEach((t,i)=>records.push({title:`${vinLabel(t.vin)} · ${t.dealer}`,detail:`${t.sample?'示例 · ':''}${transferLabels.map((l,j)=>`${l}：${t.steps[j]?'已完成':'待处理'}`).join(' · ')}`,query:t.vin,tag:'过户',transfer:i}));
  state.mailRecords.forEach(m=>records.push({title:m.subject,detail:`${m.time} · ${m.action} · ${m.dealer} · ${m.email} · ${m.body}`,tag:'邮件',mail:m.id}));
  state.audit.forEach(a=>records.push({title:a.action,detail:`${a.time} · ${a.detail}`,tag:'操作记录'}));return records;
}
function searchRecords(query){const q=query.trim().toLowerCase();return allRecords().filter(r=>!q||`${r.title} ${r.detail} ${r.query||''} ${r.tag}`.toLowerCase().includes(q));}
function renderSearch(){const results=searchRecords(searchQuery),page=results.slice(searchPage*PAGE_SIZE,(searchPage+1)*PAGE_SIZE);return `<div class="page">${pageHeader('搜索')}<section class="card search-panel"><form class="search-box" id="searchForm">${icon('search')}<input id="searchInput" aria-label="搜索内容" value="${esc(searchQuery)}" placeholder="经销商名称、VIN、邮箱或任意表格内容"><button class="button primary">搜索</button></form><div class="toolbar">${importButton('search','导入检索表格')}<span class="subtle">共 ${results.length} 条结果</span></div><div class="record-list">${page.map(r=>`<div class="record-row"><div><strong>${esc(r.title)}</strong><p>${esc(r.detail)}</p></div>${r.followupId?`<button class="button secondary small" data-open-followup="${r.followupId}">查看跟进</button>`:r.reviewId?`<button class="button secondary small" data-review-history="${esc(r.reviewId)}">查看核查</button>`:r.key?`<button class="button secondary small" data-action="open-book" data-key="${r.key}" data-sheet="${r.sheet}" data-row="${r.row}">打开表格</button>`:r.transfer!==undefined?`<button class="button secondary small" data-open-transfer="${r.transfer}">打开过户</button>`:r.mail?`<button class="button secondary small" data-open-mail="${r.mail}">查看邮件</button>`:`<span class="status dark">${r.tag}</span>`}</div>`).join('')||empty('没有找到匹配记录。')}</div>${pagination(searchPage,results.length,'search-page')}</section></div>`;}
function pagination(page,total,action){return `<div class="pagination"><button class="button secondary small" data-action="${action}" data-page="${page-1}" ${page===0?'disabled':''}>上一页</button><span>${page+1} / ${Math.max(1,Math.ceil(total/PAGE_SIZE))}</span><button class="button secondary small" data-action="${action}" data-page="${page+1}" ${(page+1)*PAGE_SIZE>=total?'disabled':''}>下一页</button></div>`;}
function renderLog(){return `<div class="page">${pageHeader('核查与记录')}${renderReviewHistory()}<section class="audit-surface">${state.audit.map(a=>`<div class="log-row"><time>${esc(a.time)}</time><div><strong>${esc(a.action)}</strong><p>${esc(a.detail)}</p></div></div>`).join('')||empty('导入、修改、过户和邮件操作会记录在这里。')}</section></div>`;}
const fieldLabels={dealer:'经销商名称',email:'邮箱',phone:'电话',address:'地址',vin:'VIN',amount:'金额',date:'日期'};
const aliases={dealer:/经销商|dealer|客户名称|买方/i,email:/邮箱|邮件地址|e.?mail/i,phone:/电话|手机|phone|tel/i,address:/地址|address/i,vin:/vin|车架/i,amount:/金额|价格|price|amount/i,date:/日期|date/i};
function guessMapping(book){const headers=bookHeaders(book);book.mapping={};for(const [key,re]of Object.entries(aliases))book.mapping[key]=headers.find(h=>re.test(h.label))?.index??-1;}
function importPreview(){const b=importDraft.book,headers=bookHeaders(b),sheet=b.sheets[b.sheetIndex||0];detail('确认表格导入',`<div class="panel-pad"><p>${esc(b.fileName)}</p><div class="toolbar"><label>工作表 <select id="importSheet">${b.sheets.map((s,i)=>`<option value="${i}" ${i===(b.sheetIndex||0)?'selected':''}>${esc(s.name)}</option>`).join('')}</select></label><label>表头行 <input id="importHeader" type="number" min="1" max="${sheet.rows.at(-1)?.rowNumber||1}" value="${b.headerRow}"></label></div><div class="mapping-grid">${Object.entries(fieldLabels).map(([key,label])=>`<label>${label}<select data-mapping="${key}"><option value="-1">不使用 / 未找到</option>${headers.map(h=>`<option value="${h.index}" ${b.mapping[key]===h.index?'selected':''}>${esc(h.label)} (${columnName(h.index)})</option>`).join('')}</select></label>`).join('')}</div>${readOnlyTable(headers,bookRows(b).slice(0,5))}<p class="subtle">预览前 5 行 · 共 ${bookRows(b).length} 行</p><button class="button primary" data-action="confirm-import">确认导入</button></div>`);}
function readOnlyTable(headers,rows){return `<div class="table-scroll"><table><thead><tr><th>行号</th>${headers.map(h=>`<th>${esc(h.label)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><td>${r.rowNumber}</td>${headers.map(h=>`<td>${esc(r.cells.get(h.index)?.display||'')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
function openBook(key,row,si){const b=books[key];if(!b)return toast('请先导入表格。');editSession={key,changes:{},sheetIndex:si===undefined?b.sheetIndex||0:Number(si)};const index=bookRows(editorBook()).findIndex(r=>r.rowNumber===Number(row));editorPage=index<0?0:Math.floor(index/PAGE_SIZE);renderEditor();}
function editorBook(){const b=books[editSession.key],si=editSession.sheetIndex;return {...b,sheetIndex:si,headerRow:si===(b.sheetIndex||0)?b.headerRow:b.sheets[si].headerRow};}
function renderEditor(){const b=editorBook(),headers=bookHeaders(b),rows=bookRows(b),shown=rows.slice(editorPage*PAGE_SIZE,(editorPage+1)*PAGE_SIZE);detail('查看与修改表格',`<div class="panel-pad"><div class="toolbar"><strong>${esc(b.fileName)}</strong><label>工作表 <select id="editorSheet">${b.sheets.map((s,i)=>`<option value="${i}" ${i===b.sheetIndex?'selected':''}>${esc(s.name)}</option>`).join('')}</select></label><span class="subtle">${rows.length} 行</span></div><div class="table-scroll editor-table"><table><thead><tr><th>行号</th>${headers.map(h=>`<th>${esc(h.label)}</th>`).join('')}</tr></thead><tbody>${shown.map(r=>`<tr><td>${r.rowNumber}</td>${headers.map(h=>{const c=r.cells.get(h.index);return `<td>${c?`<input aria-label="${esc(h.label)} ${c.ref}" data-cell="${c.ref}" value="${esc(editSession.changes[c.ref]??c.display)}" ${c.formula||c.merged?'readonly':''} title="${esc(c.formula?'公式：'+c.formula:c.ref)}">`:''}</td>`;}).join('')}</tr>`).join('')}</tbody></table></div>${pagination(editorPage,rows.length,'editor-page')}<div class="toolbar"><button class="button primary" data-action="review-edits">查看修改并确认</button><span id="editCount" class="subtle">${Object.keys(editSession.changes).length} 处修改</span></div></div>`);}
async function reviewEdits(){if(!Object.keys(editSession.changes).length)return toast('尚未修改单元格。');const b=editorBook(),sheet=b.sheets[b.sheetIndex];const changes=Object.entries(editSession.changes);detail('确认表格修改',`<div class="panel-pad"><p>${esc(b.fileName)} · ${esc(sheet.name)} · ${changes.length} 处修改</p><div class="table-scroll"><table><thead><tr><th>单元格</th><th>原内容</th><th>修改后</th></tr></thead><tbody>${changes.map(([ref,value])=>{const c=sheet.rows.find(r=>r.rowNumber===Number(ref.match(/\d+/)[0]))?.cells.get(colIndex(ref));return `<tr><td>${ref}</td><td>${esc(c?.display)}</td><td>${esc(value)}</td></tr>`;}).join('')}</tbody></table></div><p class="subtle">导出工作副本，保留原文件。</p><div class="button-row"><button class="button secondary" data-action="back-editor">返回修改</button><button class="button primary" data-action="confirm-edits">确认修改并导出</button></div></div>`);}
async function confirmEdits(){const b=editorBook(),key=editSession.key,blob=await changedWorkbook(b,editSession.changes),name=b.fileName.replace(/\.(xlsx|csv)$/i,'-已修改.$1');const updated=await readWorkbook(new File([blob],name));const originalBook=books[key];updated.sheetIndex=originalBook.sheetIndex||0;updated.headerRow=originalBook.headerRow;updated.mapping=originalBook.mapping;updated.version=(originalBook.version||1)+1;updated.importedAt=originalBook.importedAt;updated.modifiedAt=new Date().toISOString();await storeFile('book:'+key,updated);books[key]=updated;invalidateMail();log('表格修改已确认',`${name} · ${b.sheets[b.sheetIndex].name} · ${Object.keys(editSession.changes).length} 处`);download(blob,name);editSession=null;closeDetail();render();toast('修改已保存到工作副本，已发起下载。');}
async function importMaterials(files,key){let entries=[];for(const file of files){if(file.size>50*1024*1024)throw new Error('单个材料不能超过 50 MB。');if(/\.zip$/i.test(file.name)){const zip=await readArchive(await file.arrayBuffer());for(const e of Object.values(zip.files).filter(e=>!e.dir)){const blob=await e.async('blob');entries.push({name:e.name,blob});}}else entries.push({name:file.name,blob:file});}
  const size=entries.reduce((n,e)=>n+e.blob.size,0);if(size>MAX_ARCHIVE_BYTES)throw new Error('材料总大小超过 150 MB。');if(new Set(entries.map(e=>e.name)).size!==entries.length)throw new Error('材料中有重复文件路径，请分批导入或重命名。');zipDraft={key,entries};detail('确认新增材料',`<div class="panel-pad"><p>${entries.length} 个文件 · ${(size/1024/1024).toFixed(1)} MB</p>${materialList(entries,false)}<p class="subtle">同名材料将替换当前版本。</p><div class="button-row"><button class="button secondary" data-action="confirm-materials">确认加入工作区</button><button class="button primary" data-action="save-materials-folder">确认并选择保存文件夹</button><button class="button secondary" data-action="download-materials">下载材料包</button></div><p id="folderStatus" class="subtle"></p></div>`);
}
function materialList(entries,interactive=true){return `<div class="materials-list">${entries.map((e,i)=>`<div class="record-row"><span>${esc(e.name)}</span><div class="button-row"><small>${(e.blob.size/1024).toFixed(1)} KB</small>${interactive?`<button class="button secondary small" data-preview-material="${i}">打开</button>`:''}</div></div>`).join('')}</div>`;}
async function commitMaterials(){const merged=[...new Map([...(materials[zipDraft.key]||[]),...zipDraft.entries].map(e=>[e.name,e])).values()];await storeFile('materials:'+zipDraft.key,merged);materials[zipDraft.key]=merged;if(zipDraft.key==='inventory'){state.materialRevision=(state.materialRevision||0)+1;}log('材料已导入',`${zipDraft.key} · ${zipDraft.entries.length} 个文件`);closeDetail();render();}
async function saveMaterialsFolder(){if(!window.showDirectoryPicker){document.getElementById('folderStatus').textContent='此浏览器不支持选择本地目录，请使用“下载材料包”，或在 Chrome / Edge 中打开。';return;}
  let folder;try{folder=await window.showDirectoryPicker({mode:'readwrite'});}catch(e){if(e.name==='AbortError')return;throw new Error('无法访问目录；请改用 Chrome / Edge 或下载材料包。');}
  const subname='JOYone-'+new Date().toISOString().replace(/[:.]/g,'-')+'-'+crypto.randomUUID().slice(0,6);
  const root=await folder.getDirectoryHandle(subname,{create:true});let written=0;
  try{for(const entry of zipDraft.entries){if(!safeArchivePath(entry.name))throw new Error('文件路径无效');const parts=entry.name.split('/').filter(Boolean);let dir=root;for(const p of parts.slice(0,-1))dir=await dir.getDirectoryHandle(p,{create:true});const f=await dir.getFileHandle(parts.at(-1),{create:true});const writer=await f.createWritable();await writer.write(entry.blob);await writer.close();written++;}}
  catch(e){throw new Error(`保存中断，${folder.name}/${subname} 已写入 ${written} 个文件。工作区尚未更新：${e.message}`);}
  await commitMaterials();toast(`已保存到 ${folder.name}/${subname}`);
}
async function previewMaterial(index){const entry=materials[selectedJob]?.[index];if(!entry)return;const ext=entry.name.split('.').pop().toLowerCase();if(['xlsx','csv'].includes(ext)){const book=await readWorkbook(new File([entry.blob],entry.name));book.sheetIndex=0;book.headerRow=book.sheets[0].headerRow;guessMapping(book);const key='material-preview';books[key]=book;openBook(key);return;}
  if(['txt','eml'].includes(ext)){const text=await entry.blob.text();detail(entry.name,`<div class="panel-pad"><pre class="material-text">${esc(text)}</pre></div>`);return;}
  const type=({png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',pdf:'application/pdf'})[ext];
  if(!type){download(entry.blob,entry.name.split('/').at(-1));toast('已下载材料，请用对应应用打开。');return;}
  const blob=new Blob([entry.blob],{type}),url=URL.createObjectURL(blob);detail(entry.name,ext==='pdf'?`<iframe class="material-frame" title="PDF 材料" src="${url}"></iframe>`:`<img class="material-image" alt="${esc(entry.name)}" src="${url}">`);document.getElementById('detailDialog').addEventListener('close',()=>URL.revokeObjectURL(url),{once:true});
}
function openTemplateForm(){detail('添加邮件模板',`<form class="panel-pad" id="templateForm"><label class="form-field">模板名称<input name="name" required maxlength="60"></label><label class="form-field">主题<input name="subject" required maxlength="200"></label><label class="form-field">正文<textarea name="body" required rows="9"></textarea></label><p class="subtle">可用变量：{{经销商}}、{{邮箱}}、{{电话}}、{{地址}}、{{VIN}}、{{金额}}、{{日期}}</p><button class="button primary" type="submit">保存模板</button></form>`);}
function newTransfer(){detail('新增车辆过户',`<form id="transferForm" class="panel-pad"><label class="form-field">完整 VIN<input name="vin" required pattern="[A-HJ-NPR-Za-hj-npr-z0-9]{17}" maxlength="17"></label><label class="form-field">经销商名称<input name="dealer" required></label><button class="button primary">添加过户记录</button></form>`);}
function mailDetail(record){detail('邮件记录',`<div class="panel-pad"><p>${esc(record.time)} · ${esc(record.action)}</p><h3>${esc(record.subject)}</h3><p>收件人：${esc(record.email)}</p><pre class="material-text">${esc(record.body)}</pre></div>`);}
document.addEventListener('click',async event=>{
  const button=event.target.closest('button');if(!button)return;
  try{
    if(button.dataset.route){if(button.dataset.key)selectedJob=button.dataset.key;if(button.dataset.template){delete state.mail.followupId;state.mail.templateId=button.dataset.template;applyTemplate();}navigate(button.dataset.route);return;}
    if(button.dataset.job){selectedJob=button.dataset.job;render();return;}
    if(button.dataset.template){delete state.mail.followupId;state.mail.templateId=button.dataset.template;applyTemplate();render();return;}
    if(button.dataset.dealerRow){const b=books.dealers,row=bookRows(b).find(r=>r.rowNumber===Number(button.dataset.dealerRow));for(const key of ['dealer','email','phone','address'])state.mail[key]=mapped(row,b,key);applyTemplate();render();return;}
    if(button.dataset.step!==undefined){const i=Number(button.dataset.transferId),j=Number(button.dataset.step);state.transfers[i].steps[j]=!state.transfers[i].steps[j];state.transfers[i].stepTimes??={};state.transfers[i].stepTimes[j]=state.transfers[i].steps[j]?new Date().toLocaleString('zh-CN'):'';log('过户节点更新',`${state.transfers[i].vin} · ${state.transfers[i].dealer} · ${transferLabels[j]} · ${state.transfers[i].steps[j]?'完成':'待处理'}`);render();return;}
    if(button.dataset.openTransfer!==undefined){state.expanded=[Number(button.dataset.openTransfer)];navigate('transfer');return;}
    if(button.dataset.openMail){mailDetail(state.mailRecords.find(m=>m.id===button.dataset.openMail));return;}
    if(button.dataset.previewMaterial!==undefined){await previewMaterial(Number(button.dataset.previewMaterial));return;}
    if(button.dataset.prompt){document.getElementById('askInput').value=button.dataset.prompt;submitAsk();return;}
    const action=button.dataset.action,key=button.dataset.key;
    if(action==='close-detail'){closeDetail();return;}
    if(action==='import-book'){importKey=key;document.getElementById('workbookInput').click();return;}
    if(action==='confirm-import'){
      const b=importDraft.book;for(const s of document.querySelectorAll('[data-mapping]'))b.mapping[s.dataset.mapping]=Number(s.value);
      if(!bookRows(b).length)throw new Error('此工作表或表头行下没有数据，请重新选择。');
      if(importDraft.key==='dealers'&&b.mapping.dealer<0)throw new Error('请映射经销商名称列。');
      if(importDraft.key==='sales'&&b.mapping.vin<0)throw new Error('请映射 销售台账 的 VIN 列。');
      if(importDraft.key.startsWith('compare:')){await createComparison(importDraft.key.slice(8),b);return;}
      b.version=(books[importDraft.key]?.version||0)+1;b.importedAt=new Date().toISOString();
      await storeFile('book:'+importDraft.key,b);books[importDraft.key]=b;invalidateMail();log('表格已导入',`${b.fileName} · ${b.sheets[b.sheetIndex||0].name} · ${bookRows(b).length} 行`);closeDetail();render();toast('表格已导入，可打开与搜索。');return;
    }
    if(action==='open-book'){openBook(key,button.dataset.row,button.dataset.sheet);return;}
    if(action==='editor-page'){editorPage=Number(button.dataset.page);renderEditor();return;}
    if(action==='search-page'){searchPage=Number(button.dataset.page);render();return;}
    if(action==='review-edits'){await reviewEdits();return;}
    if(action==='back-editor'){renderEditor();return;}
    if(action==='confirm-edits'){button.disabled=true;await confirmEdits();return;}
    if(action==='import-materials'){importKey=key;document.getElementById('materialsInput').click();return;}
    if(action==='confirm-materials'){button.disabled=true;await commitMaterials();toast('材料已加入工作区。');return;}
    if(action==='save-materials-folder'){button.disabled=true;await saveMaterialsFolder();button.disabled=false;return;}
    if(action==='download-materials'){const zip=new JSZip();for(const e of zipDraft.entries)zip.file(e.name,await e.blob.arrayBuffer());download(await zip.generateAsync({type:'blob'}),'JOYone-材料.zip');return;}
    if(action==='view-materials'){selectedJob=key;detail('已导入材料',`<div class="panel-pad">${materialList(materials[key]||[])}</div>`);return;}
    if(action==='inventory-detail'){const g=inventoryGroups();const group=button.dataset.group;const titles={dealers:'盘点经销商',confirmed:'人工已确认',matched:'车辆候选匹配',missing:'材料待补充',review:'人工核查'};detail(titles[group],`<div class="panel-pad">${!g?empty('导入盘点表与材料后显示明细。'):g[group].map(r=>`<div class="record-row"><div><strong>${esc(r.title)}</strong><p>${esc(r.detail)}</p></div>${r.row?`<button class="button secondary small" data-action="open-book" data-key="inventory" data-row="${r.row}">查看原行</button><button class="button secondary small" data-inventory-review="${r.row}">材料核对</button>${group==='missing'?`<button class="button primary small" data-inventory-followup="${r.row}">创建跟进</button>`:''}`:''}</div>`).join('')||empty('当前没有此类记录。')}</div>`);return;}
    if(action==='mask-vin'){state.maskVin=!state.maskVin;saveState();render();return;}
    if(action==='expand-all'||action==='collapse-all'){state.expanded=action==='expand-all'?state.transfers.map((_,i)=>i):[];saveState();render();return;}
    if(action==='new-transfer'){newTransfer();return;}
    if(action==='new-template'){openTemplateForm();return;}
    if(action==='apply-template'){applyTemplate();render();return;}
    if(action==='lookup-sales'){
      const b=books.sales;if(!b)throw new Error('请先导入销售台账。');const rows=bookRows(b).filter(r=>mapped(r,b,'vin').toUpperCase()===state.mail.vin.trim().toUpperCase());
      if(!state.mail.vin||rows.length!==1)throw new Error(rows.length>1?'销售台账 中有重复 VIN，请先确认正确记录。':'未找到唯一记录，请输入完整 VIN。');
      for(const f of ['vin','dealer','amount','date']){const v=mapped(rows[0],b,f);if(v)state.mail[f]=v;}applyTemplate();render();toast('已按 VIN 读取销售台账 字段。');return;
    }
    if(action==='check-mail'){mailCheck=checkMail();state.mailChecked=true;state.mailStale=false;saveState();updateMailStatus();document.getElementById('mailCheckResult').innerHTML=renderMailCheck();log('邮件信息核查',`${state.mail.vin||'未填写 VIN'} · ${mailCheck.filter(c=>c.status==='diff').length} 处差异 · ${mailCheck.filter(c=>c.status==='missing').length} 项未核查`);return;}
    if(action==='copy-mail'){
      const m=state.mail,text=`收件人：${m.email}\n主题：${m.subject}\n\n${m.body}`;
      try{await navigator.clipboard.writeText(text);}catch{const t=document.createElement('textarea');t.value=text;document.body.append(t);t.select();const ok=document.execCommand('copy');t.remove();if(!ok){detail('复制邮件',`<div class="panel-pad"><p>浏览器未允许剪贴板，请全选复制以下内容。</p><textarea class="copy-area">${esc(text)}</textarea></div>`);return;}}
      mailRecord('邮件已复制');toast('邮件已复制，未发送。');return;
    }
    if(action==='outlook'){
      const m=state.mail;if(/[\r\n]/.test(m.email)||!m.email.trim())throw new Error('请填写有效收件邮箱。');
      const url='https://outlook.office.com/mail/deeplink/compose?'+new URLSearchParams({to:m.email,subject:m.subject,body:m.body});
      const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.click();mailRecord('已请求在 Outlook 打开');toast('邮件草稿已打开。');return;
    }
    if(action==='save-mail'){mailRecord('邮件草稿已保存');toast('已保存，可在搜索中查看。');return;}
    if(action==='open-ask'){openAssistant();return;}
    if(action==='submit-ask'){submitAsk();return;}
  }catch(error){button.disabled=false;toast(error.message||'操作未完成，请重试。');}
});
document.addEventListener('input',event=>{
  const el=event.target;
  if(el.dataset.mailField){state.mail[el.dataset.mailField]=el.value;invalidateMail();saveState();}
  if(el.id==='dealerSearch')dealerResults(el.value);
  if(el.dataset.cell&&editSession){const b=editorBook(),ref=el.dataset.cell,c=b.sheets[b.sheetIndex].rows.find(r=>r.rowNumber===Number(ref.match(/\d+/)[0]))?.cells.get(colIndex(ref));if(el.value===c?.display)delete editSession.changes[ref];else editSession.changes[ref]=el.value;document.getElementById('editCount').textContent=`${Object.keys(editSession.changes).length} 处修改`;}
});
document.addEventListener('change',async event=>{
  const el=event.target;try{
    if(el.id==='workbookInput'&&el.files[0]){const key=importKey;toast('正在读取表格…');const book=await readWorkbook(el.files[0]);book.sheetIndex=0;book.headerRow=book.sheets[0].headerRow;guessMapping(book);importDraft={key,book};importPreview();el.value='';}
    if(el.id==='materialsInput'&&el.files.length){toast('正在读取材料…');await importMaterials([...el.files],importKey);el.value='';}
    if(el.id==='importSheet'){importDraft.book.sheetIndex=Number(el.value);importDraft.book.headerRow=importDraft.book.sheets[Number(el.value)].headerRow;guessMapping(importDraft.book);importPreview();}
    if(el.id==='importHeader'){importDraft.book.headerRow=Number(el.value);guessMapping(importDraft.book);importPreview();}
    if(el.id==='editorSheet'){if(Object.keys(editSession.changes).length){el.value=String(editSession.sheetIndex);throw new Error('请先确认当前工作表的修改，再切换工作表。');}editSession.sheetIndex=Number(el.value);editorPage=0;renderEditor();}
  }catch(e){el.value='';toast(e.message||'文件读取失败。');}
});
document.addEventListener('toggle',event=>{const el=event.target;if(!el.matches('details[data-transfer]')||!el.isConnected)return;const i=Number(el.dataset.transfer);if(el.open&&!state.expanded.includes(i))state.expanded.push(i);if(!el.open)state.expanded=state.expanded.filter(v=>v!==i);saveState();},true);
document.addEventListener('submit',event=>{
  const form=event.target;if(form.id==='searchForm'){event.preventDefault();searchQuery=document.getElementById('searchInput').value;searchPage=0;render();}
  if(form.id==='templateForm'){event.preventDefault();const data=new FormData(form),t={id:crypto.randomUUID(),name:data.get('name').trim(),subject:data.get('subject').trim(),body:data.get('body').trim()};if(!t.name||!t.subject||!t.body)return toast('请填写模板名称、主题和正文。');state.templates.push(t);state.mail.templateId=t.id;applyTemplate();log('邮件模板已添加',t.name);closeDetail();render();}
  if(form.id==='transferForm'){event.preventDefault();const data=new FormData(form),vin=data.get('vin').trim().toUpperCase(),dealer=data.get('dealer').trim();if(state.transfers.some(t=>t.vin===vin))return toast('该 VIN 已存在过户记录。');state.transfers.push({vin,dealer,steps:[false,false,false,false,false]});log('过户记录已添加',`${vin} · ${dealer}`);closeDetail();render();}
});
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openAssistant();}if(e.key==='Enter'&&e.target.id==='askInput'){e.preventDefault();submitAsk();}});
window.JOYoneDemo={navigate,getState:()=>structuredClone(state),searchRecords,checkMail};
render();
loadFiles().then(saved=>{for(const [key,value]of Object.entries(saved)){if(key.startsWith('book:'))books[key.slice(5)]=value;if(key.startsWith('materials:'))materials[key.slice(10)]=value;if(key.startsWith('comparison:')&&value)comparisons[key.slice(11)]=value;if(key.startsWith('followup-files:'))followupFiles[key.slice(15)]=value;if(key==='review-history'&&Array.isArray(value))reviewHistory.push(...value);}if(state.mailChecked)state.mailStale=true;loading=false;render();}).catch(()=>{loading=false;render();toast('文件存储不可用，请换用独立浏览器。');});
