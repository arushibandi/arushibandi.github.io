#!/usr/bin/env python3
"""Generate the page's background grain as transparent PNG tiles.

Run from anywhere:  python3 wedding/tools/make-grain.py
Writes wedding/images/grain.png (1x screens) and grain@2x.png (retina).

Each speck is exactly one *screen* pixel, so the grain stays crisp no matter
how small it is (an SVG noise filter scaled down just blurs away).
The specks sit on top of the cream background-color set in css/style.css.

Tweak the settings below and re-run. No dependencies beyond the standard library.
"""
import os
import random
import struct
import zlib

# ---- settings -------------------------------------------------------------
TILE = 256            # tile size in CSS px (must match background-size in style.css)
# colours + opacity from svg/background.svg (Figma noise effect)
SPECKS = [
    # (r, g, b, opacity, fraction of pixels)
    (56, 125, 66, 0.12, 0.05),   # green
    (240, 110, 31, 0.12, 0.05),  # orange
]
SEED = 43
# ---------------------------------------------------------------------------


def write_png(path, width, height, rows):
    def chunk(kind, data):
        c = struct.pack(">I", len(data)) + kind + data
        return c + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)

    raw = b"".join(b"\x00" + bytes(row) for row in rows)
    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(raw, 9))
    png += chunk(b"IEND", b"")
    with open(path, "wb") as f:
        f.write(png)


def make(scale, path):
    rng = random.Random(SEED + scale)
    size = TILE * scale
    rows = []
    for _ in range(size):
        row = []
        for _ in range(size):
            pixel = (0, 0, 0, 0)
            roll = rng.random()
            for r, g, b, opacity, fraction in SPECKS:
                if roll < fraction:
                    pixel = (r, g, b, round(opacity * 255))
                    break
                roll -= fraction
            row.extend(pixel)
        rows.append(row)
    write_png(path, size, size, rows)
    print("wrote", path)


if __name__ == "__main__":
    images = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "images")
    make(1, os.path.join(images, "grain.png"))
    make(2, os.path.join(images, "grain@2x.png"))
