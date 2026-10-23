# 物料三 · 深蓝 (md3-blue)

**#4d6bfe**（DeepSeek 站点主色）当种子，按 Material Design 3 的色调体系展开的第二套皮肤。
骨架与紫调原版 `md3` 完全一致（同一份令牌表、同一套圆角与状态层），只换调色板与底板配色。

## 种子 → 角色

`#4d6bfe` 在 CIELAB 里是 L*51 / C*84.7 / h-64°。各角色的色调（L*）按 MD3 规范取，彩度在色域边界内保到最大，
亮色主色取「对白字达到 4.5:1 的最高色调」，暗色主色把色相往蓝偏 10°，避免落成薰衣草紫。

| 角色 | 亮色 | 暗色 | 对比 |
| --- | --- | --- | --- |
| primary | `#4164f5` | `#799dff` | 对白字 4.81:1 / 对画布 7.14:1 |
| on-primary | `#ffffff` | `#001550` | — |
| primary-container | `#e6eafe` | `#003cad` | 容器文字 11.90 / 6.28 |
| secondary / container | `#6f6f9c` / `#e9e8f1` | `#b3b0dc` / `#303055` | 11.21 / 6.61 |
| tertiary / container | `#b4496b` / `#f2e5ec` | `#ff97b8` / `#7f244b` | 11.23 / 6.48 |
| surface | `#fcfcff` | `#14121a` | 正文 16.72 / 14.35 |
| surface-container（低→高） | `#f4f2fc` → `#e3e1eb` | `#1b1b22` → `#35343b` | — |
| outline / variant | `#777491` / `#c7c3e3` | `#908dab` / `#46445e` | — |

成功/警告沿用 MD3 扩展角色（`#146c2e` / `#8a5100` 与暗色 `#6dd58c` / `#ffb951`），错误用官方 `#b3261e` / `#f2b8b5`。
所有前景/背景配对都跑过对比度断言，正文与按钮文字均 ≥ 4.5:1。

## 底板

同款 20 秒无缝循环的线框几何动画，配色换成蓝色系：线稿 `#777491` / `#c7c5cf`，
三枚色团用本皮肤的蓝色系（`#dbe5ff` / `#cfe0ff` / `#e8efff`，暗色 `#0a2f6b` / `#10294f` / `#0b1d33`），线稿偏蓝灰，细环用 primary。
做法与重拍命令见紫调原版 `md3/README.zh.md` 的「底板」一节（同一套 `tools/float-*.html` + ffmpeg 流水线）。

## 安装

```sh
cp -r md3-blue ~/.dsh/skins/md3-blue
# 打包版桌面客户端：<PACK_HOME>/skins/md3-blue
```

在 **设置 → 皮肤中心** 试穿 / 应用。与 `md3`（紫调）可以随时互切。

## 目录

```
md3-blue/
├── skin.json       v2 清单（accent #4164F5）
├── skin.css        MD3 角色 → dsh 令牌（129 个令牌，与 md3 同名同序）
├── patches.css     状态层 8% / 12%、3px 焦点环、行内代码前景
├── assets/         float-blue-light.mp4 / float-blue-dark.mp4 + 静态首帧 + src/
└── preview/        亮 / 暗预览
```

## 备注

- 1.0.1：底板与几何体改为纯蓝色系（primary / 天蓝 / 墨蓝），不再混入 MD3 tertiary 的玫瑰紫，底色也换成中性偏蓝的近黑。
- 1.0.0：首版。种子 `#4d6bfe`，全部色值由色调体系算出，没有手调。
- 令牌名与 `md3` 一一对应（脚本核对过 129/129），所以两个皮肤的体验差异只有颜色。
- 想换种子重出整套：改 `tools/palette-blue.json` 的生成脚本里的 `SEED` 并重跑，令牌映射不用动。
