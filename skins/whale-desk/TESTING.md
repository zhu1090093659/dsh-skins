# Validation / 验证范围

Version 1.1.2; checked 2026-11-08 on Windows. This is a limited compatibility
record, not a claim that every DSH workflow or host version has passed.

- 11 offline configuration/install tests passed.
- 42 isolated browser cases passed using source CSS, the installed Skin Center
  0.4.8 transform, and the market 0.4.16 transform. These are the same 42 cases
  in three pipelines, not 126 different features. Machine reports are in
  [validation](validation/browser-tests.json),
  [0.4.8](validation/browser-tests-0.4.8.json) and
  [0.4.16](validation/browser-tests-0.4.16.json).
- Coverage: sidebar collapse controls, legacy brand markup, theme changes,
  native conversation/header, task-page and task-dialog contrast, readable dark cards/menus, 11 reordered settings sections, unknown sections,
  responsive decoration hiding, system font reset, reduced motion/forced colors,
  wallpaper replacement, corrupt imports and asynchronous editor races.
- Native DSH 0.2.1-rc.2 / Skin Center 0.4.8: try-on and exit, apply/default,
  light/dark switching, settings identity, background slider, account menu,
  pet click feedback and drag were exercised. Fresh-path 1.1.2 CSS restored the
  collapsed sidebar control. A subsequent native pass corrected dark automation
  headings/search/empty states, board columns and the new-task dialog; search
  input/clear and opening/cancelling the dialog passed without creating tasks. Those
  task captures used a validation copy with only manifest ID/display name changed;
  its CSS/art/fonts matched that stage of the source.
- Later theme regression: light selection reverted to dark in the running host.
  The user restarted DSH and reported recovery. A follow-up light -> dark -> light
  round trip updated both the visible palette and the saved preference; closing
  settings retained light. No skin CSS or host code was changed for this recovery.
  The root cause and recurrence risk remain unknown. The pet reappeared near the
  model control after restart and was moved away; cross-restart placement is not
  guaranteed.
- Same-path replacement in an already open desktop window can retain old CSS.
  Following explicit restart approval, the original `whale-desk` directory was
  activated and cold-started successfully. Sidebar collapse/reopen passed there.
  A real short-message round trip in a new empty workspace reached generating,
  completed and the expected reply. The workspace did not reset. A further normal
  restart preserved that conversation and loaded the corrected dark conversation
  background/header; model-menu open/Escape-close also passed. Current chat
  captures use the original skin ID and the shipped CSS, not a renamed copy.
- Native reasoning-level selector: High -> Low -> High updated the button label
  and the reopened menu checkmark; the original High setting was restored. No
  new prompt was sent. A later system-menu resize reached 954 x 822. Automatic
  sidebar collapse, manual reopen and model-menu open/Escape-close worked; code
  and the composer reflowed. The compact model label truncated, with its full
  name readable in the menu. The pet again approached send after sidebar reopen;
  moving it to the upper-right exposed the controls. The window was maximized
  afterward. Narrow-window sending, smaller widths and every DPI remain untested.
- The earlier workspace reset did not recur after restart; its root cause is
  not established. The account detail-page error was not separately rechecked.
  A follow-up 180-line Python response with a table completed (13 seconds shown);
  generation-in-progress rendering, scrolling and Ctrl+Home were observed. Another
  response was explicitly stopped, then a new message completed successfully.
  A very long single code line switched between wrapping and horizontal scrolling.
  All four prompts prohibited tools/file access; the isolated folder stayed empty.
  The pet's transparent hit area intercepted the send button at its old position;
  moving it to the right margin restored click delivery. That position was retained.
  Longer streams, network reconnect, retrying a prior turn, every model, file
  delivery, background tasks and clean first install remain unverified.
  Pet hover panel, click feedback and drag were observed, but full actions/Live2D,
  keyboard-only operation, mobile and macOS/Linux remain unverified.
  The skin does not implement those host features.
- Upstream full suite: 821/822 passed. The Windows addon directory-rename
  expectation failed; a focused rerun also had two worker startup/timing
  failures. A subsequent unmodified upstream focused baseline (24 tests) passed
  23 and reproduced the same Windows rename assertion with no Whale Desk assets
  present. See [baseline report](validation/upstream-worker-baseline.json). This
  failure predates the skin; its OS/dependency root cause is not established.
  The full upstream baseline suite was not rerun. No upstream assertions changed.

中文：用户授权重启后，正式 `whale-desk` 路径冷启动、侧栏折叠展开、空工作区
的一次真实消息往返和模型菜单开关通过。对话背景/顶部的暗色纹理问题已修复并
再次冷启动核验；测试会话和工作区保留。后续 180 行代码、表格、滚动、明确停止、
停止后新消息、代码换行开关与横向滚动通过。桌宠透明区域拦截发送的问题通过
移动到右侧空白区解决。热替换即时刷新、网络重连、重试上一轮、手机、全部桌宠
动作及干净机器首次安装未完整验收。

Character redistribution permission remains independently unverified. See
[NOTICE](NOTICE). Market inclusion requires maintainer/copyright review.
