# 测试与验收

本轮同步验证的是当前静态网页与业务规则。历史版本的断言数量不作为本版本覆盖率。

## 业务规则

需要 Node.js 22 或更新版本，在仓库根目录执行：

```sh
node tests/workspace-data.mjs
```

覆盖多工作表搜索、来源行、邮件字段缺项与冲突、通讯录权威来源、重复 VIN、CSV 引号、归档路径、差异默认暂缓、公式及格式建议、未完成核查项的处理。

## 界面流程

使用 Playwright 和 Chromium：

```sh
npm install --no-save playwright
npx playwright install chromium
node tests/agent-platform.mjs
```

测试自动创建临时静态服务器，并模拟 GitHub Pages 的仓库子路径。覆盖：

- 根入口跳转、旧演示链接和静态资源加载；
- Agent 对话位于“询问 JOYone”内，左侧无重复入口；
- 原有工作查询、示例对话、确认与退回；
- 链接打开、内嵌聊天及禁止内嵌；
- API 模拟申请、OpenAPI 文档预览与下载；
- 成功、超时、授权失效、重新申请和切换服务；
- Tool / MCP 连接、工具调用和断开；
- 390px 手机与 1440px 桌面布局，以及文本转义。

已有浏览器环境可通过 `JOYONE_CHROME_PATH` 指定 Chromium 可执行文件；`JOYONE_NODE_MODULES` 可指定已有 Playwright 模块目录。默认不覆盖项目图片；维护者设置 `JOYONE_CAPTURE=1` 时，可重新生成 README 的三张示例截图。

## 验证边界

所有测试使用虚构数据和本地模拟，不验证公司接口、邮箱发送、真实 MCP 服务或多人协作。Excel 复杂格式与大文件仍需按实际样本进一步验证；浏览器存储不能替代正式数据库与归档。
