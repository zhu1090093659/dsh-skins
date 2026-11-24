# Agent Note: 2026-11-24 皮肤收录轮

Status: implemented

## Problem

本轮 `dsh-skins` 有 2 个开放 PR（均无协作者 review）：

1. `#110`（`oh-wang`，`fix(remiel-starlit): honour reduced transparency, drop inert selectors (0.1.3)`）：承接 `#108` 合并后遗留的系统「降低透明度」无障碍开关与失效选择器清理，全部 CI 已通过。
2. `#111`（`Xtsaixuexi`，`feat(skins): add Whale Desk watercolor theme 1.1.3`）：承接因超期关闭的 `#106`，作者按此前意见重拍了 4 张干净实机图、调轻暗色遮罩并增加消息气泡/时间戳/操作栏底色，同时将 `sourceUrl` 改指 `main` 并移除了开发辅助目录；但来自首次/fork 通道的 `CI` 尚停在 `action_required`，且需对照内容贡献闸门重新核验版权与授权声明及实机/预览视觉观感。

## Decision

**合入 `#110`（squash `66c11c37`），对 `#111` 提交 `REQUEST_CHANGES` 退回修正法律声明冲突后暂留开放。**

- **`#110`（`remiel-starlit` 0.1.3）批准并合入。** 对照宿主 `@deepseek-ai/dsh-client-ui-layout` 的 `AppFrame.module.css:143-147` 核实，系统开启 `prefers-reduced-transparency: reduce` 时宿主把侧栏提到填充色的 90%，`patches.css` 恢复出的 `rgba(250, 242, 251, 0.673)`（浅色 `0.7478 * 0.90`）与 `rgba(31, 20, 39, 0.522)`（暗色 `0.58 * 0.90`）推算一致；失效的 `[data-dsh-surface]` 选择器头已删净；`skin.json` 版本升至 `0.1.3`；`README.md` / `README.zh.md` 与 `evidence/README.remiel-starlit-0.1.3.md` 对跨平台透明取舍以及 Windows/窄屏/reduce-transparency 实图未覆盖边界交代如实；单批次查验提交的亮/暗 2 张桌面证据图观感合格，CI 全绿。
- **`#111`（`whale-desk` 1.1.3）批准运行 fork CI 后通过视觉与构建检查，因版权声明冲突退回（`REQUEST_CHANGES`）。**
  - 先批复运行 `CI`（run `45000657162`），`skin catalog, typecheck, test and build` 最终通过。
  - 单批次查验全部 6 张图（`evidence/whale-desk/{home,chat}-{light,dark}.jpg` 4 张 1282x822 实机图与 `skins/whale-desk/preview/{light,dark}.jpg` 2 张预览图）：上轮指出的第三方桌宠/浮窗污染已彻底清除；暗色态遮罩调轻后书桌及角色插画清晰可见；「已完成，用时 3 秒」、时间戳与消息操作栏均补上独立底色，对比度与可读性均达标，美学与实机证据本身通过。
  - 阻塞项在于授权与版权声明文件自相矛盾：`NOTICE`、`README.md`、`README.zh.md` 与 PR 描述均声明「已取得本项目所用皮肤、配图及角色的相关使用与公开再分发授权」，但未提供原角色及女仆再设计作者（上善 / ZipZipPipe）的可核验许可依据；而同一次提交内的 `skins/whale-desk/LICENSE-ARTWORK`（第 8、15 行）仍写着 `unresolved redistribution clearance` 与「参考角色尚未核实的授权见 NOTICE」。按本仓同人素材规范，无原作者可核验许可时不得写「已取得授权」，要求作者将四处文本统一改为非官方同人二创、仅供个人非商业使用、权利归原权利人（上善 / ZipZipPipe）、与本仓库及 DeepSeek 官方无关并明确「版权与合规责任由贡献者承担，本仓库仅作分发」（或补齐可核验的原权利人书面授权依据）。
  - 顺带记录两处非阻塞建议：`preview/{light,dark}.jpg` 右下角页脚仍写 `Whale Desk 1.1.2`；`skins/whale-desk/` 约 104.5 MB（502 文件，含未启用的 `assets/diy-generated/home.svg` 与 `preview/native-chat-{light,dark}.jpg`），可按需瘦身。

## Alternatives considered

- **鉴于 `#111` 的实机图、暗色遮罩与 CI 全部过关，先合并再让作者补正 `NOTICE` 与 `LICENSE-ARTWORK` 的措辞冲突。** 否决：版权声明矛盾属于内容贡献闸门的前置合规缺陷，不能用「先上架再补声明」绕过，否则商店分发的法律责任与事实陈述直接冲突。
- **由维护者在合入时直接替作者删改 `NOTICE` / `LICENSE-ARTWORK` 冲突行。** 否决：按规则维护者不得代贡献者背书或修改版权授权声明口径，须由作者本人明确权属与分发责任后重新提交复评。

## Consequences

- `dsh-skins` `main` 纳入 `remiel-starlit` `0.1.3`（合并提交 `66c11c37`），需在本轮推送本条 Note 后在 `dsh-web` 移动 `satellites/dsh-skins` 钉版并重建 `market/dist` 使线上商店同步更新。
- `#111` 保持开放等待作者统一法律声明文本后再复评合入。
