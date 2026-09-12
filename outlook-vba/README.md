# JOYone · 经典 Outlook 邮件归档

> 这是早期版本的独立本地工具，予以保留。当前网页没有自动连接此脚本、邮箱或归档目录；使用方式需按实际环境单独验证。

此工具只监听个人邮箱 `Inbox / JOYone 邮寄` 文件夹。邮件进入该文件夹后，经典 Outlook 会把原邮件保存为 `.msg`，并在归档根目录维护 `mail-index.csv`。JOYone 网页读取 CSV 用于 VIN 联查，原始邮件仍保存在本地目录。

## 安装

1. 仅使用 Windows 经典 Outlook；新版 Outlook 不支持 VBA。
2. 先向公司 IT / 信息安全确认是否允许签名宏，并使用公司批准的宏策略。
3. 在 Outlook 按 `Alt + F11` 打开 VBA 编辑器。
4. 导入 `JOYoneFolderWatcher.cls` 与 `JOYoneMailArchive.bas`。
5. 打开 `ThisOutlookSession`，粘贴 `ThisOutlookSession.txt` 的内容。
6. 保存并重启 Outlook。首次启动会在个人 Inbox 下创建 `JOYone 邮寄`，并让你选择本地归档目录。

## 使用

- 将需要归档的邮寄邮件移动或用 Outlook 规则移动到 `JOYone 邮寄`。
- 邮件正文建议包含：邮寄单号、完整 VIN；车型、车牌号、二手车批售价和拍卖经销商可选。
- 一封邮件有多辆车时，每辆车会在 CSV 中生成一行，但共用同一个 MSG 文件。
- 启动时会重新扫描文件夹并按唯一键去重，用来弥补 Outlook `ItemAdd` 在一次大量移动邮件时可能漏触发的问题。
- 在 JOYone 的“过户邮寄查询”中选择归档根目录，或手动导入根目录下的 `mail-index.csv`。

## 安全边界

- 不读取整个邮箱，只处理个人 Inbox 下指定文件夹中的邮件。
- 不向网络上传文件；网页只读 Sales、CSV 和用户主动获取的 MSG。
- 删除或移动源邮件不会自动删除已归档 MSG。离职、换机或不再使用时，应按公司数据保留规则处理归档目录。
- 如宏被公司策略禁止，可继续使用网页的“导入 CSV”方式，不要绕过安全策略。

## 维护

- 手工重建索引：在 VBA 编辑器运行 `RebuildJOYoneIndex`。
- 更换归档目录：运行 `SelectJOYoneArchiveFolder`，然后重启 Outlook。
- 停用：移除两个导入模块和 `ThisOutlookSession` 中的启动代码；已有归档文件不会被自动删除。
