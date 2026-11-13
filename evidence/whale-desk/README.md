# Native screenshot evidence

Captured 2026-11-08 from Windows DSH 0.2.1-rc.2, Skin Center 0.4.8 at
1282 x 822 unless noted below. Account and conversation sidebar was collapsed before capture;
images are unretouched window captures. The pet is provided by the separately
installed pet plugin and is not bundled in the skin.

The initial home captures used local ID whale-desk-112-validation to avoid
same-path CSS caching. Task captures used whale-desk-112-native. They document
the earlier repairs with the CSS/fonts/art from their respective validation
stage; only manifest ID/display name differed from that stage's skin package.

Follow-up captures automation-dark.jpg, taskboard-dark.jpg and task-dialog-dark.jpg
show the task-page/dialog contrast fixes. Native search input/clear, sidebar
collapse/reopen and opening/cancelling the task dialog were exercised. No task
was created or executed. The original desktop pet position was retained; a pet
can overlap a modal button, so drag it away when needed.

After the user's explicit restart approval, the original `whale-desk` directory
was activated and normally restarted. A new empty test workspace stayed selected.
One short prompt (no tools or file access requested) reached generating, completed,
and the expected reply. Its directory remained empty. A real dark-conversation
contrast defect was then corrected, followed by another normal restart.

chat-dark-after-restart.jpg and chat-model-menu-dark.jpg show the corrected
conversation and model menu after that second restart, using the original skin ID
and final shipped CSS. The test conversation survived, sidebar collapse/reopen
worked, and the model menu opened and closed with Escape. The pet was temporarily
moved left to expose the model control, then restored. A floating desktop assistant
overlay at the right edge is external to DSH and was left unretouched.

Three follow-up captures use that same original skin and final CSS:

- generation-stopped-dark.jpg: a long numbered response was stopped explicitly;
  the UI shows the stopped state and a partial last line.
- code-scroll-dark.jpg: a new message after stopping completed successfully;
  wrapping is off and the long code line has been scrolled horizontally.
- after-stop-code-wrap-dark.jpg: wrapping is on again and the code folds within
  the card. The successful reply after stopping is visible.

Before these captures, a table and 180-line Python response completed with
13 seconds shown; generation-in-progress code growth, scrolling and Ctrl+Home
were observed. An initial stop attempt happened after that response had finished,
so it is not counted as the stop test. The later numbered response supplied the
explicit stopped state. Four prompts requested no tools or file access, and the
test directory remained empty. A new message is not a retry of the previous turn.

The old pet position intercepted the send button through its transparent hit
area. It was dragged to the right margin, where the same button sent successfully;
that working position was retained and checked with both sidebar states. The last
two captures show it there. This is a placement workaround, not a pet-engine fix.

These checks do not establish every account endpoint, longer sustained streams,
network reconnect, retrying a prior turn, all models, file delivery, background
tasks, or first install on a clean machine. The earlier workspace reset's root
cause is unestablished.

The static-light/static-dark files are separately labeled fictional browser
fixtures showing the expanded layout; they are not native DSH screenshots.

Follow-up narrow-chat-dark.jpg was captured at 954 x 822 after a system-menu
resize. It shows the automatically collapsed sidebar and reflowed code/composer.
Manual sidebar reopen and model-menu open/Escape-close were then exercised,
but those account-visible states were not saved for publication. The pet was
subsequently moved to the upper-right because it approached send with the sidebar
expanded. The session ended maximized. This does not verify narrower widths,
every DPI, or sending from the narrow layout.

light-after-user-restart.jpg records the follow-up after the user restarted DSH
to recover from light reverting to dark. The original skin ID was active. A
light -> dark -> light round trip updated the saved preference both ways; light
remained visible 88 seconds after selection and after closing settings. Account
sidebar was collapsed for this unretouched capture. The root cause is unknown;
no runtime code was changed for this recovery.
