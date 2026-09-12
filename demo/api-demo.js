(() => {
  const services = {
    mail: { title: '通知服务', description: '按模板组织收件人、主题与正文。', path: '/notifications', method: 'post', operationId: 'previewNotification', sample: { recipient: 'demo@example.invalid', subject: '材料补充通知', message: '请补充示例车辆交接确认材料。' } },
    vehicle: { title: '车辆查询服务', description: '按车辆编号查询状态。', path: '/vehicles/status', method: 'get', operationId: 'lookupVehicle', sample: { vehicleId: 'DEMO-001' } }
  };
  function schemaFor(service) {
    const schema = { type: 'object', properties: Object.fromEntries(Object.keys(service.sample).map(key => [key, { type: 'string' }])), required: Object.keys(service.sample) };
    return { openapi: '3.0.0', info: { title: service.title + ' · 虚构示例', version: '1.0.0', description: '仅供界面演示，不可作为公司接口文档使用。' }, servers: [{ url: 'https://example.invalid' }], paths: { [service.path]: { [service.method]: {
      operationId: service.operationId,
      ...(service.method === 'post' ? { requestBody: { required: true, content: { 'application/json': { schema, example: service.sample } } } } : { parameters: [{ name: 'vehicleId', in: 'query', required: true, schema: { type: 'string' }, example: 'DEMO-001' }] }),
      responses: { '200': { description: '示例成功响应' }, '401': { description: '未授权' }, '500': { description: '服务异常' } }
    } } } };
  }
  window.JOYoneApiDemo = Object.freeze({ mount(container, output, setReady) {
    let granted = false;
    container.innerHTML = `<section class="api-demo-section"><h5>1 · 选择服务</h5><label class="connect-field">服务目录<select id="apiService"><option value="mail">通知服务</option><option value="vehicle">车辆查询服务</option></select></label><p class="api-demo-meta" id="apiServiceDescription"></p><div class="button-row"><button type="button" class="button secondary" id="apiApply">模拟申请权限</button><span class="agent-pill" id="apiGrant">未申请</span></div></section><section class="api-demo-section"><h5>2 · 接口文档</h5><p class="api-demo-meta">OpenAPI 3.0 · 当前服务 · 虚构示例</p><details class="api-demo-docs"><summary>查看文档</summary><pre id="apiDocument" class="api-demo-document"></pre></details><button type="button" class="button secondary small" id="apiExport">导出示例 JSON</button></section><section class="api-demo-section"><h5>3 · 调用测试</h5><label class="connect-field">请求示例<input id="apiEndpoint" readonly></label><pre id="apiRequest" class="api-demo-document"></pre><label class="connect-field">返回场景<select id="apiOutcome"><option value="ok">成功返回</option><option value="timeout">请求超时</option><option value="unauthorized">授权失效</option></select></label><button type="button" class="button primary" id="runApi" disabled>模拟测试调用</button><p class="api-demo-feedback" id="apiNotice">先完成模拟申请，才能测试调用。</p></section>`;
    const get = id => container.querySelector('#' + id);
    function refresh() {
      const service = services[get('apiService').value]; granted = false; setReady(false);
      get('apiGrant').textContent = '未申请'; get('apiApply').disabled = false; get('apiApply').textContent = '模拟申请权限'; get('runApi').disabled = true;
      get('apiNotice').textContent = '先完成模拟申请，才能测试调用。';
      get('apiServiceDescription').textContent = service.description;
      get('apiEndpoint').value = service.method.toUpperCase() + ' ' + service.path + '（模拟）';
      get('apiDocument').textContent = JSON.stringify(schemaFor(service), null, 2);
      get('apiRequest').textContent = JSON.stringify(service.sample, null, 2); output('');
    }
    get('apiService').onchange = refresh;
    get('apiApply').onclick = () => { granted = true; get('apiGrant').textContent = '已模拟授权'; get('apiApply').disabled = true; get('runApi').disabled = false; get('apiNotice').textContent = '可测试示例请求；真实权限需由服务方批准。'; output('模拟申请已通过，尚未调用服务。'); };
    get('apiExport').onclick = () => {
      const service = services[get('apiService').value]; const url = URL.createObjectURL(new Blob([JSON.stringify(schemaFor(service), null, 2)], { type: 'application/json' }));
      const link = document.createElement('a'); link.href = url; link.download = 'JOYone-demo-openapi.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      get('apiNotice').textContent = '已生成虚构示例文档，不包含公司接口信息。';
    };
    get('runApi').onclick = () => {
      if (!granted) return;
      const outcome = get('apiOutcome').value, service = services[get('apiService').value];
      if (outcome === 'unauthorized') { granted = false; setReady(false); get('apiGrant').textContent = '模拟授权失效'; get('apiApply').disabled = false; get('runApi').disabled = true; get('apiNotice').textContent = '请重新模拟申请权限。'; output('模拟返回 · 401 Unauthorized\n授权失效，未执行任何操作。'); return; }
      if (outcome === 'timeout') { setReady(false); output('模拟返回：请求超时。\n未自动重试，未修改数据或发送邮件。'); return; }
      setReady(true); output(`模拟返回 · 200 OK\n服务：${service.title}\n\n${service.method === 'post' ? '已校验示例收件人、主题与正文。\n结果：通知预览可用。\n没有发送邮件。' : 'DEMO-001：已入库，等待交接确认材料。'}\n\n此次测试未向外部服务发送请求。`);
    };
    refresh();
  } });
})();
