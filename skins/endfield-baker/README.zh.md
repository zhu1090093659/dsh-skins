# 终末地 · BAKER

[English](README.md) | 中文

把 DSH Web GUI 改造成《明日方舟：终末地》现场终端的纯资产皮肤（v2 `skin.json` + `skin.css` +
`patches.css` + `assets/`），纯资产目录保存在本仓；市场发布它，创意工坊按需安装到
`$DSH_HOME/skins/endfield-baker/`。

## 是什么

- **纯资产**：`skin.css`（L1：`--dsw-*` token 重映射 + `--ef-*` 原语）、`patches.css`
  （L3：聊天壳层与插件页面的结构补丁）、`assets/`（终端贴图、信号条、切角）、`preview/`
  （亮 / 暗截图）。无 package.json、无构建步骤，没有任何代码执行。
- **一处调色板**：所有颜色集中在 `skin.css` 的 `:root`。浅色与深色共用同一套终端配色，换配色只改这一块。
- **会话区重做**：聊天面板按 BAKER 通讯界面重画——青色标头竖条、信号黄选中行、工具调用 / 思考 /
  上下文三类折叠行的切角控制台卡片、白色胶囊输入条，工业终端背景上压一层磨砂灰聊天底板。
- **壳层与插件页**：名录式侧栏行与工作区行（等宽微标签、单像素浅灰描边）、细网格与斜纹信号条，
  并给任务看板、SSH、宠物、插件设置页做了结构补丁。未安装的插件对应补丁自然闲置，不会报错。

## 实测

在本地皮肤中心应用后逐一核对：

- 皮肤中心宿主为 `dsh-web` `0.2.0-rc.2`，皮肤 id `endfield-baker`；每次量样式前先断言
  `data-dsh-skin`，并确认 `GET /api/skin-center/v2/skins/endfield-baker/patches` 返回 200。
- **Web 端**：聊天壳层、侧栏、设置、任务看板与插件页面用无头探针读计算样式与元素 rect 核对，不靠肉眼估。
- **桌面端（Electron）**：同一份资产目录在桌面端应用并实际使用，未发现错位。桌面端构建的 CSS Modules
  哈希与 Web 端不同，因此聊天底板与侧栏拉手用 `:is(<web 哈希>, <桌面哈希>)` 双哈希并联覆盖。
- 本版修复：输入卡的磨砂背板原本会给应用的 `position:fixed` 悬浮气泡造包含块，导致任务运行期间
  消息区与输入卡整体上窜约 510px；磨砂已改挂到无子元素的 `::before` 上，不再捕获 fixed 后代。

## 来源与许可

- 底色与骨架改作自 **blue-fantasy**（`powerdog996` / DreamSkin 社区）。
- 皮肤工程（`skin.css`、`patches.css`、`assets/`）由 **Yuji6278** 完成，按
  [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 发布，全文见 [LICENSE](LICENSE)。
- 《明日方舟：终末地》名称与设定归鹰角网络（Hypergryph）所有，本皮肤为非商业同人作品。

## 已知限制

- 纯呈现层：只改浏览器样式，不触及模型请求。
- `patches.css` 锚在 CSS Modules 的哈希类名片段上，官方重建可能移动锚点；`dsh-skin validate`
  对此按既有取舍给警告。
- 未声明 `hooks.mjs`：工作区行里那个内联「＋ 新建会话」按钮被本皮肤隐藏（原设计由 hooks 补一个
  菜单项），新建会话请走侧栏顶部的 *New Baker* 入口。
