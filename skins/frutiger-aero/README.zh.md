# Frutiger Aero

给 DSH Web GUI 的 Frutiger Aero 皮肤：冰蓝色半透明玻璃面板，垫在一张原创的蓝天草地壁纸之下，背景里有缓慢上浮的玻璃气泡。

## 亮点

- **原创程序化美术**——背景 `assets/aero-sky.webp` 完全由代码生成（天空渐变、阳光、白云、草地），不含任何第三方图片，无版权顾虑。MIT 协议发布。
- **忠实的气泡配方**——气泡外观（白色壳 + alpha 曲线、左上镜面高光、右下次级反光）是从经典 Windows 气泡屏保的贴图里实测出来的（36 个方向径向剖面、1% 步长），再用纯 CSS 渐变复刻；动画用 `transform` 合成器动画（零重绘、不用 `will-change` 之类的技巧）。
- **token 全覆盖**——全部 `--dsw-alias-*` 与 `--aion-*` token 都重映射到冰蓝冷色体系，浅色/深色两套完整。
- **可读性有预算**——文字颜色按真实合成后的玻璃底色选取，正文与次要文字满足 WCAG AA。

## 设计语言

| 角色 | 浅色 | 深色 |
| --- | --- | --- |
| 画布 | `#CDE8FA` | `#081a2e` |
| 玻璃面板 | 白色，约背景遮罩 22% | 深海军蓝，20% + 遮罩 |
| 正文 | `#0B2540` | `#DCEBFA` |
| 强调色 | `#3FB8E8` | `#5AC8F5` |

气泡：每 500px tile 6 枚，固定像素半径（44~92px），单层渐变，25px/s 上浮。动画每周期正好平移一个 tile，且元素底部比视口多延长一个 tile——因此任意时刻画面都被气泡场完整覆盖，循环无缝；圆心全部落在 tile 内，tile 边界永远不会切到圆。

## 文件

| 文件 | 作用 |
| --- | --- |
| `skin.json` | v2 清单 |
| `skin.css` | L1 token 重映射 |
| `patches.css` | L3 气泡层、玻璃面板、发光按钮 |
| `assets/aero-sky.webp` | 原创生成背景 |
| `preview/light.jpg` / `preview/dark.jpg` | 市场画廊预览图 |
| `LICENSE` | MIT |

## 磨砂玻璃与性能

磨砂通过各区域的**真实 CSS Modules 类名**施加（用 `[class*=]` 通配，哈希前缀随版本变化）：

| 区域 | 选择器 | 半径 |
| --- | --- | --- |
| 左侧工作区 | `[class*="sidebarCol"]` | 4px |
| 主聊天区 | `[class*="centerCol"]` | 2px |
| 右侧工作区 | `[class*="rightbarCol"]` | 6px |
| 顶部标题栏 | `[class*="_frame"]::before` | 4px |

在 Intel Iris Xe 核显上实测：全屏动态气泡在其背后飘过，GPU 3D 引擎占用**低于 0.3%**（空闲）。

唯一昂贵的模式是**窗口级模糊**：对巨型层 `[data-dsh-part="dialog"]` 施加
`backdrop-filter: blur(16px)` 约增加 **22%** GPU 占用。该声明被刻意移除。

### 玻璃边缘

整窗按"**一整片玻璃**"处理：

- **窗口顶边**一条高光（1px 亮线 + 约 12px 柔光渐隐）
- **最左边缘**一道受光（侧栏左侧 15%，表现玻璃厚度）
- 内部接缝只有 **6% 柔光**，暗示分区而不形成亮线
- **面板不使用实体 border，也不使用投影**：实体 border 会改变布局
  （壳层元素并非都用 `border-box`），而给每个面板加边缘光会在接缝处
  产生一条明显的白线

## 致谢

气泡的 alpha 剖面取自 [khang-nd/bubbles](https://github.com/khang-nd/bubbles)（MIT，Windows Bubbles 屏保的复刻版）的贴图实测数据。未复制任何资产，只使用了测量得到的数值。壁纸与全部皮肤代码均为原创。

## 许可证

MIT，见 `LICENSE`。
