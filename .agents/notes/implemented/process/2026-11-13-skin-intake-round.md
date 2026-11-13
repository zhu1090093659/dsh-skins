# Agent Note: 2026-11-13 皮肤收录轮

Status: implemented

## Problem

本轮皮肤收录维护处理 `dsh-skins` 中唯一待首次评审的 PR `#108`（`fix(remiel-starlit): pin panel opacity so macOS and Windows match (0.1.2)`，head `b85d0fb`），其余 5 个处于 `CHANGES_REQUESTED` 且无新提交的 PR（`#106`、`#99`、`#97`、`#93`、`#85`）保持等待作者修改状态。需要逐项核验 `#108` 的代码修复、三项皮肤内容贡献闸门（本地可见证据、版权/NOTICE、单批次 6 图美学鉴赏）以及跨平台与响应式选择器兼容性。

## Decision

- **`#108` 退回（`REQUEST_CHANGES`），暂不合入也不触发 `dsh-web` 钉版更新。**
- **版权与静态观感达标。** `skin.json` 升版至 `0.1.2` 且通过 manifest 校验，中英 `README` 同步更新，官方《绝区零》蕾米埃尔非商业声明与保留 `Z·Z·Z` 水印条款完整；6 张图（新旧亮暗证据图与 `preview/{light,dark}.jpg`）经单批次视觉核验，macOS 桌面稳态下的配色、清晰度与对比度均符合上线水准。
- **两项阻塞级 CSS 选择器缺陷（基于 `AppFrame.module.css`、`transformSkinCss` 产物与 `dsh-web-all` 源码核验得出，未在 Windows 真机运行）。** 其一，第 392-400 行 `[data-windows-titlebar]::before` 在经过 `transformSkinCss` 注入作用域前缀后无法命中根节点 `<html>`，且官方外壳实际铺设顶栏底色的是 `.frame::before`（`AppFrame.module.css:40-47`），建议改为 `[data-dsh-frame]::before` 与 `body[data-ds-dark-theme] [data-dsh-frame]::before`；其二，第 368-380 行侧栏锁值规则未排除 `[data-sidebar-drawer]` 与 `[data-sidebar-collapsed]`，导致窄屏抽屉失去模糊并透字，且移动端暗色收起态下 `0-3-2 !important` 压过 `dsh-web-all` 的 `0-3-0` 透明规则，产生 52px 宽的左侧遮挡条，建议前置限定 `[data-dsh-frame]:not([data-sidebar-drawer]):not([data-sidebar-collapsed])`。
- **顺带清理项一并指出。** 第 229-255 行 `[data-gitgraph-chip]` 依赖已下线的 `dsh-git-graph`（源码检索 0 命中）；残留 `:global(.aionui-*)` 导致同组 `button, a` 的过渡、禁用态与 reduced-motion 规则在标准浏览器下被整条丢弃；`skin.json:10` 的 `noticeUrl` 仍指向旧 `dsh-web` 路径。

## Alternatives considered

- **鉴于 macOS 桌面截图与版权核验已通过，先合入 `0.1.2` 再另开 PR 修补 Windows 顶栏与窄屏侧栏选择器。** 否决：`#108` 的核心诉求正是对齐 macOS 与 Windows 面板不透明度，而 `[data-windows-titlebar]::before` 在 `transformSkinCss` 作用域化后在 Windows 上并不生效，同时窄屏暗色收起态会新引入 52px 左侧遮挡条；应在 `#108` 内一次性修齐选择器，避免把移动端遮挡缺陷带入 `0.1.2`。
- **仅退回两项阻塞级选择器问题，略过 `:global(.aionui-*)`、`[data-gitgraph-chip]` 与 `noticeUrl`。** 否决：标准浏览器遇到未编译的 `:global(...)` 会按选择器列表容错规则整条丢弃同组的 `button, a` 过渡、禁用态及 reduced-motion 样式，存在实际交互退化；同轮一并反馈可让作者在一次提交中清零遗留项。

## Consequences

- `dsh-skins` 的 `main` 分支本轮无代码或皮肤版本变动，`dsh-web` 无需移动 `satellites/dsh-skins` 钉版。
- `#108` 与其余 5 个无新提交的 PR（`#106`、`#99`、`#97`、`#93`、`#85`）均停留在等待作者修改状态；待作者修正 `patches.css` 与 `skin.json` 后复审。
