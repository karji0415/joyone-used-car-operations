# JOYone 网页演示

通过仓库根目录 `index.html` 或本目录 `index.html` 打开。

“询问 JOYone”包含 Agent 对话与本地工作查询；“接入中心”提供四种模拟接入。示例对话和 API 文档不会连接真实服务。静态版不加载托管版的服务发现入口，避免向 GitHub Pages 请求不存在的后台接口。

文件处理使用当前浏览器的 IndexedDB 与本地存储。GitHub Pages 与其他托管站点的工作区互不共享，切换站点不会迁移已有数据。

`assistant-demo.html` 为旧链接兼容入口，自动进入“询问 JOYone”；`sample-chat.html` 用于独立聊天和内嵌演示。JSZip 随仓库提供，许可证见 `vendor/JSZip-LICENSE.md`。
