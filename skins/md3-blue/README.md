# Material 3 · Abyss Blue (md3-blue)

A second skin built from the **#4d6bfe** seed (the DeepSeek site accent colour), expanded through the Material Design 3 tonal system.
The skeleton is identical to the violet original `md3` (same token table, same radii, same state layers); only the palette and the plate colours change.

## Seed → roles

`#4d6bfe` sits at L*51 / C*84.7 / h-64° in CIELAB. Each role takes its MD3 tone (L*), keeps as much chroma as the gamut allows;
the light primary uses the highest tone still hitting 4.5:1 against white, and the dark primary shifts hue 10° toward blue so it does not land on lavender.

| Role | Light | Dark | Contrast |
| --- | --- | --- | --- |
| primary | `#4164f5` | `#799dff` | 4.81:1 on white / 7.14:1 on canvas |
| on-primary | `#ffffff` | `#001550` | — |
| primary-container | `#e6eafe` | `#003cad` | container text 11.90 / 6.28 |
| secondary / container | `#6f6f9c` / `#e9e8f1` | `#b3b0dc` / `#303055` | 11.21 / 6.61 |
| tertiary / container | `#b4496b` / `#f2e5ec` | `#ff97b8` / `#7f244b` | 11.23 / 6.48 |
| surface | `#fcfcff` | `#14121a` | body text 16.72 / 14.35 |
| surface-container (low→high) | `#f4f2fc` → `#e3e1eb` | `#1b1b22` → `#35343b` | — |
| outline / variant | `#777491` / `#c7c3e3` | `#908dab` / `#46445e` | — |

Success and warning reuse the MD3 extended roles (`#146c2e` / `#8a5100`, dark `#6dd58c` / `#ffb951`); error uses the official `#b3261e` / `#f2b8b5`.
Every foreground/background pair is asserted in code — body and button text are ≥ 4.5:1.

## Plate

The same 20-second seamless wireframe loop, recoloured blue: linework `#777491` / `#c7c5cf`, the three fields use this skin's blue family (`#dbe5ff` / `#cfe0ff` / `#e8efff`; dark `#0a2f6b` / `#10294f` / `#0b1d33`), the linework leans blue-grey and the ring uses primary. The build and re-shoot commands live in `md3/README.md` ("Artwork").

## Install

```sh
cp -r md3-blue ~/.dsh/skins/md3-blue
# packaged desktop client: <PACK_HOME>/skins/md3-blue
```

Try or apply it in **Settings → Skin Center**; switch freely between it and `md3` (violet).

## Layout

```
md3-blue/
├── skin.json       v2 manifest (accent #4164F5)
├── skin.css        MD3 roles → dsh tokens (129 tokens, same names and order as md3)
├── patches.css     state layers 8% / 12%, 3px focus ring, inline-code foreground
├── assets/         float-blue-light.mp4 / float-blue-dark.mp4 + static first frames + src/
└── preview/        light / dark previews
```

## Notes

- 1.0.1: plate and wireframes are now blue-only (primary / sky / ink), dropping the MD3 tertiary rose that read as purple; the base black is now neutral-blue.
- 1.0.0: first release. Seed `#4d6bfe`; every colour is computed from the tonal system, none hand-picked.
- Token names map 1:1 onto `md3` (a script checked 129/129), so the only difference between the two skins is colour.
- To re-seed the whole scheme, change `SEED` in the palette generator and re-run; the token mapping stays untouched.
