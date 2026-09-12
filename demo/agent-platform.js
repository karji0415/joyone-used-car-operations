(() => {
  const dialog = document.getElementById('askDialog');
  const current = document.getElementById('askDialogForm');
  current.querySelector('header').remove();
  current.className = 'agent-current agent-panel';
  current.dataset.panel = 'current';
  const top = document.createElement('header'); top.className = 'agent-top';
  top.innerHTML = '<div><span class="assistant-badge">J</span><div><h2>询问 JOYone</h2><small>Agent 对话与工作查询</small></div></div><button class="icon-button" type="button" aria-label="关闭询问 JOYone" id="agentClose">×</button>';
  const body = document.createElement('div'); body.className = 'agent-body';
  body.innerHTML = '<nav class="agent-rail" aria-label="Agent 工作区"><button data-agent-tab="current" role="tab">工作查询</button><button data-agent-tab="demo" role="tab">Agent 对话</button><button data-agent-tab="connect" role="tab">接入中心</button><p>模拟接入状态</p><ul id="agentConnections"></ul></nav><div class="agent-content"></div>';
  dialog.replaceChildren(top, body); dialog.classList.add('agent-platform');
  dialog.setAttribute('aria-label', '询问 JOYone');
  const content = body.querySelector('.agent-content'); content.append(current);
  const demo = document.createElement('section'); demo.className = 'agent-panel'; demo.dataset.panel = 'demo'; demo.hidden = true;
  demo.innerHTML = `<div class="agent-section-head"><div><h3>业务助手 Agent</h3><p>选择已有 Agent，直接开始对话。</p></div><span class="agent-pill">对话演示</span></div><div id="agentChatEntry" class="agent-chat-entry"><span>当前：业务助手 · 示例 Agent</span><a class="button secondary small" href="sample-chat.html" target="_blank" rel="noopener noreferrer">打开示例 Agent ↗</a></div><div class="agent-presets"><button type="button" data-demo-task="sheet">表格核查</button><button type="button" data-demo-task="vehicle">车辆进度</button><button type="button" data-demo-task="mail">通知草稿</button><button type="button" id="demoReset">重置对话</button></div><div class="agent-chat-log" id="agentChatLog" role="log" aria-live="polite"></div><form class="agent-compose" id="agentCompose"><input id="agentPrompt" aria-label="输入模拟任务" placeholder="试试：核查表格或生成通知" maxlength="300" autocomplete="off"><button class="button primary" type="submit">发送</button></form><p class="agent-note">预设回复演示，不读取工作台资料。请勿输入敏感信息。</p>`;
  content.append(demo);
  const connect = document.createElement('section'); connect.className = 'agent-panel'; connect.dataset.panel = 'connect'; connect.hidden = true;
  connect.innerHTML = '<div class="agent-section-head"><div><h3>接入中心</h3><p>选择接入方式，体验 Agent 如何连接业务能力。</p></div><span class="agent-pill">全程模拟</span></div><div class="connect-tabs" role="tablist" aria-label="接入方式"></div><div id="connectDetail"></div><p class="agent-note">仅使用虚构配置，不连接公司系统、不提交业务数据。</p>';
  content.append(connect);
  const types = {
    link: { name: '链接入口', title: '打开已有 Agent', desc: '从工作台打开独立聊天页。', flow: ['JOYone', '聊天入口', '独立对话页'] },
    embed: { name: '网页内嵌', title: '在工作台中对话', desc: '聊天页保留在当前窗口中。', flow: ['JOYone', '内嵌窗口', 'Agent 对话'] },
    api: { name: 'API 接入', title: '连接服务目录中的 API', desc: '先申请服务权限，再查看文档并测试调用。', flow: ['选择服务', '模拟申请', '接口文档', '调用测试'] },
    tool: { name: 'Tool / MCP', title: '连接并调用工具', desc: '选择协议与工具，再发起模拟调用。', flow: ['能力连接', '工具列表', '按名称调用'] }
  };
  const ready = Object.fromEntries(Object.keys(types).map(key => [key, false]));
  let selected = 'link';
  let runId = 0;
  let toolProtocol = 'Tool';
  function status(key, value) {
    ready[key] = value;
    document.getElementById('agentConnections').replaceChildren(...Object.entries(types).map(([id, item]) => {
      const li = document.createElement('li'); li.dataset.ready = String(ready[id]);
      li.append(document.createTextNode(item.name)); const text = document.createElement('span'); text.textContent = ready[id] ? '模拟就绪' : '未演示'; li.append(text); return li;
    }));
    document.getElementById('connectionCount').textContent = `${Object.values(ready).filter(Boolean).length} / 4`;
    const badge = document.getElementById('connectStatus');
    if (badge) badge.textContent = ready[selected] ? '模拟就绪' : '待体验';
  }
  function open(tab = 'current') {
    if (!['current', 'demo', 'connect'].includes(tab)) tab = 'current';
    content.querySelectorAll('[data-panel]').forEach(panel => panel.hidden = panel.dataset.panel !== tab);
    body.querySelectorAll('[data-agent-tab]').forEach(button => button.setAttribute('aria-selected', String(button.dataset.agentTab === tab)));
    content.scrollTop = 0;
    if (!dialog.open) dialog.showModal();
    if (innerWidth <= 600) document.body.classList.remove('sidebar-collapsed');
    if (tab === 'current') document.getElementById('askInput').focus();
    else body.querySelector(`[data-agent-tab="${tab}"]`).focus();
  }
  window.JOYoneAgent = Object.freeze({ open });
  document.getElementById('agentClose').onclick = () => dialog.close();
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-agent-open],[data-agent-tab]');
    if (button) open(button.dataset.agentOpen || button.dataset.agentTab);
  });
  const chat = document.getElementById('agentChatLog');
  function message(text, user = false) {
    const node = document.createElement('div'); node.className = 'agent-message' + (user ? ' user' : ''); node.textContent = text; chat.append(node); chat.scrollTop = chat.scrollHeight; return node;
  }
  const prompts = { sheet: '核查销售台账示例。', vehicle: '查询车辆 DEMO-001 的进度。', mail: '生成材料补充通知。' };
  const replies = {
    sheet: '表格核查 Agent · 示例结果\n\n依据：示例原表与补充表，共 12 条记录。\n• DEMO-001：金额由 128,000 变为 126,000。\n• DEMO-002：交接日期缺失。\n• 尾号匹配有两条候选，需要人工选择。\n\n建议：先确认金额变化，其余两项继续核查。',
    vehicle: '车辆任务 Agent · 示例结果\n\nDEMO-001：已入库，基础信息已核对。\n待补材料：交接确认单。\n依据：示例车辆任务记录。\n\n下一步：创建材料跟进，收到反馈后人工复核。',
    mail: '通知 Agent · 示例草稿\n\n主题：请补充车辆交接确认材料\n\n您好，车辆 DEMO-001 的交接确认材料尚未齐全，请核对并补充。收到后我们将进行复核并更新进度。感谢配合。\n\n发送前请核对收件人、车辆信息与附件。'
  };
  function runTask(task, text) {
    message(text || prompts[task], true);
    if (!task) { message('这里提供预设演示。请选择表格核查、车辆进度或通知草稿；查询工作台记录请切换到“工作查询”。'); return; }
    const node = message(replies[task]); const actions = document.createElement('div'); actions.className = 'button-row';
    ['模拟确认', '退回修改'].forEach((label, index) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'button secondary small'; button.textContent = label;
      button.onclick = () => { actions.querySelectorAll('button').forEach(item => item.disabled = true); message(index ? '已模拟退回，等待补充信息后重新核查。' : task === 'sheet' ? '已模拟确认金额变化。日期缺项和匹配不确定项继续待审；未修改文件。' : task === 'vehicle' ? '已模拟创建材料跟进；未通知任何人员。' : '已模拟确认草稿；未发送邮件。'); };
      actions.append(button);
    }); node.append(actions); chat.scrollTop = chat.scrollHeight;
  }
  demo.querySelectorAll('[data-demo-task]').forEach(button => button.onclick = () => runTask(button.dataset.demoTask));
  function resetChat() { chat.replaceChildren(); document.getElementById('agentPrompt').value = ''; message('你好，我是 JOYone 业务助手。\n选择一项任务，体验 Agent 从分析到人工确认的过程。'); }
  document.getElementById('demoReset').onclick = resetChat;
  document.getElementById('agentCompose').onsubmit = event => { event.preventDefault(); const input = document.getElementById('agentPrompt'); const text = input.value.trim(); if (!text) return; input.value = ''; runTask(/通知|邮件|草稿/.test(text) ? 'mail' : /核查|表格|差异/.test(text) ? 'sheet' : /车辆|进度|材料/.test(text) ? 'vehicle' : null, text); };
  function renderConnection(key) {
    selected = key; runId++;
    connect.querySelectorAll('[data-connect-kind]').forEach(button => button.setAttribute('aria-selected', String(button.dataset.connectKind === key)));
    const item = types[key];
    document.getElementById('connectDetail').innerHTML = `<section class="connect-detail"><div class="connect-detail-head"><div><h4>${item.title}</h4><p>${item.desc}</p></div><span class="agent-pill" id="connectStatus">${ready[key] ? '模拟就绪' : '待体验'}</span></div><div class="connect-detail-body"><div class="connect-flow">${item.flow.map(text => `<span>${text}</span>`).join(' → ')}</div><div id="connectControls"></div><div class="connect-output" id="connectOutput" role="status" aria-live="polite"></div><div id="embedHost"></div></div></section>`;
    const controls = document.getElementById('connectControls');
    const output = text => document.getElementById('connectOutput').textContent = text;
    if (key === 'link') {
      controls.innerHTML = '<label class="connect-field">目标 Agent<select aria-label="目标 Agent"><option>业务助手 · 示例聊天页</option></select></label><div class="button-row"><button class="button secondary" id="checkLink">模拟检查入口</button><a class="button primary" href="sample-chat.html" target="_blank" rel="noopener noreferrer" id="openExample">打开示例聊天 ↗</a></div>';
      document.getElementById('checkLink').onclick = () => { status(key, true); output('模拟检查通过：目标聊天页可打开。\n正式接入时，目标服务使用自己的登录与网络权限。'); };
      document.getElementById('openExample').onclick = () => { status(key, true); output('已请求在新页面打开示例聊天。若未打开，请检查浏览器弹窗设置。\n工作台数据不会随链接传递。'); };
    } else if (key === 'embed') {
      controls.innerHTML = '<div class="button-row"><button class="button primary" id="loadEmbed">加载内嵌演示</button><button class="button secondary" id="blockEmbed">模拟禁止内嵌</button></div>';
      document.getElementById('loadEmbed').onclick = () => { const frame = document.createElement('iframe'); frame.src = 'sample-chat.html?embed=1'; frame.title = '内嵌 Agent 聊天演示'; frame.className = 'embed-frame'; frame.sandbox = 'allow-scripts allow-same-origin allow-forms'; document.getElementById('embedHost').replaceChildren(frame); status(key, true); output('演示窗口已加载，可在下方聊天。正式服务需要允许内嵌并支持相应登录方式。'); };
      document.getElementById('blockEmbed').onclick = () => { document.getElementById('embedHost').replaceChildren(); status(key, false); output('模拟状态：目标服务禁止内嵌。\n可以切换“链接入口”，在新页面打开聊天。'); };
    } else if (key === 'api') {
      window.JOYoneApiDemo.mount(controls, output, value => status(key, value));
    } else {
      controls.innerHTML = '<label class="connect-field">连接方式<select id="toolProtocol"><option>Tool</option><option>MCP</option></select></label><label class="connect-field">可用工具<select id="toolName"><option value="vehicle.lookup">车辆查询 · vehicle.lookup</option><option value="sheet.check">表格核查 · sheet.check</option></select></label><div class="button-row"><button class="button secondary" id="connectTool">模拟连接</button><button class="button primary" id="callTool" disabled>模拟调用工具</button><button class="button ghost" id="disconnectTool">断开</button></div>';
      const call = document.getElementById('callTool');
      document.getElementById('toolProtocol').value = toolProtocol;
      call.disabled = !ready.tool;
      document.getElementById('connectTool').onclick = () => { status(key, true); call.disabled = false; output(document.getElementById('toolProtocol').value === 'MCP' ? 'MCP 模拟流程\n1. 初始化会话\n2. 获取工具列表\n3. 选择已授权的只读工具\n\n已准备 2 项示例工具。' : 'Tool 模拟流程\n1. 连接已注册的工具服务\n2. 校验工具名称与参数\n\n已准备 2 项示例工具。'); };
      const disconnect = () => { status(key, false); call.disabled = true; output('模拟连接已断开。'); };
      document.getElementById('disconnectTool').onclick = disconnect; document.getElementById('toolProtocol').onchange = () => { toolProtocol = document.getElementById('toolProtocol').value; disconnect(); };
      call.onclick = () => { if (call.disabled) return; const name = document.getElementById('toolName').value; output(`模拟调用：${name}\n\n${name === 'vehicle.lookup' ? '输入：DEMO-001\n结果：已入库，待交接确认材料。' : '输入：销售台账示例\n结果：发现 3 项待人工审核的问题。'}\n\n本次使用预设结果，未连接真实工具。`); };
    }
  }
  Object.entries(types).forEach(([key, item]) => { const button = document.createElement('button'); button.type = 'button'; button.dataset.connectKind = key; button.setAttribute('role', 'tab'); button.textContent = item.name; button.onclick = () => renderConnection(key); connect.querySelector('.connect-tabs').append(button); });
  resetChat(); renderConnection('link'); status('link', false);
  const initial = new URLSearchParams(location.search).get('agent');
  if (initial) open(initial);
})();
