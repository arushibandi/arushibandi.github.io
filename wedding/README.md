# Wedding save-the-date — arushibandi.com/wedding

A self-contained static page. Plain HTML + CSS, no build step. GitHub Pages serves this folder as `/wedding/`.
Everything the page needs lives in this folder and is linked with relative paths. Nothing here depends on the rest of the site.

```
wedding/
├── index.html              page markup + copy (edit text here)
├── css/style.css           all styles
├── js/fit-header.js        mobile: scales the Save the Date header to the full width
├── images/                 pic.png (original), pic-edited.png (beer removed), pic-1200.jpg / pic-2000.jpg (web copies of pic-edited.png), grain PNGs
├── tools/make-grain.py     regenerates the grain PNGs
└── svg/                    Figma exports
    ├── background.svg          original background (reference only)
    ├── background-tile.svg     (unused) tileable SVG version of the grain
    ├── topleftborder.svg       details frame: top + left edges
    ├── bottomrightborder.svg   details frame: bottom-right bracket
    └── save-the-date-S.svg     the big "S" (Prida02Calt glyph, SIL OFL), outlined so the font isn't needed
```

## Preview locally

```sh
cd wedding && python3 -m http.server 8000   # then open http://localhost:8000
```

Opening `index.html` directly in a browser also works.

## Common edits

- **Text:** edit `index.html`. The save-the-date details are inside `.frame__content`.
- **Photo:** the page loads the resized JPEGs, not the 9 MB `pic.png`. To swap the photo, regenerate them from the new original:
  ```sh
  cd wedding/images
  sips -s format jpeg -s formatOptions 82 -Z 1281 pic-edited.png --out pic-1200.jpg
  sips -s format jpeg -s formatOptions 82 -Z 2141 pic-edited.png --out pic-2000.jpg
  ```
  (`-Z` is the longest side; for a non-portrait photo use 1200 / 2000.) Then update `width`/`height` on the `<img>` to the original's pixel size. To change which part stays in view when the photo is cropped, edit `object-position` on `.photo img`.
- **Spacing / ornament size:** most spacing is written as Figma units × `--u` (`css/style.css`), so values can be read straight off the Figma frame.
- **Grain:** edit the settings at the top of `tools/make-grain.py` (colours, opacity, density), then run `python3 wedding/tools/make-grain.py`. Each speck is one screen pixel.

## How the border works

The border SVGs have curly ornaments at their ends, joined by straight lines. Stretching a whole SVG to fit the text box would distort the ornaments. Instead:

- each ornament is cropped out of the original SVG with `background-size` / `background-position`;
- the straight runs between ornaments are plain CSS bars.

This lets the frame grow to fit any amount of text at any screen width. If you re-export the border SVGs from Figma at a different size, update the coordinates in the "Border pieces" section of `style.css`.
