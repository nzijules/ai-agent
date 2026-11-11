"""Prépare les ressources graphiques à partir des 3 images fournies.
Usage : python3 scripts/prepare_assets.py <einstein.jpg> <logo.png> <visuel_guide.png>
Sortie : public/img/*.png
"""
import sys, os
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

ein_p, logo_p, ad_p = sys.argv[1:4]
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "img")
os.makedirs(OUT, exist_ok=True)

def coeffs(src, dst):
    # coefficients PIL pour transformer dst(rect) -> src(quad)
    m = []
    for (x, y), (u, v) in zip(dst, src):
        m.append([x, y, 1, 0, 0, 0, -u * x, -u * y])
        m.append([0, 0, 0, x, y, 1, -v * x, -v * y])
    A = np.array(m, dtype=float)
    B = np.array(src, dtype=float).reshape(8)
    return np.linalg.solve(A, B).tolist()

def warp(im, quad, size):
    w, h = size
    dst = [(0, 0), (w, 0), (w, h), (0, h)]
    return im.transform(size, Image.PERSPECTIVE, coeffs(quad, dst), Image.BICUBIC)

# ---------- 1. Couverture du livre (redressée) ----------
ad = Image.open(ad_p).convert("RGB")
ox, oy = 1120, 60  # origine de la zone livre
q = lambda pts: [(x + ox, y + oy) for x, y in pts]
front = warp(ad, q([(74, 86), (474, 57), (474, 688), (74, 710)]), (400, 628))
front = front.resize((800, 1256), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2, 80, 2))
front.save(os.path.join(OUT, "cover_front.png"))
spine = warp(ad, q([(28, 78), (72, 86), (72, 710), (30, 700)]), (44, 628))
spine = spine.resize((88, 1256), Image.LANCZOS)
spine.save(os.path.join(OUT, "cover_spine.png"))

# ---------- 2. Symbole AS (sans texte ni slogan) ----------
lg = Image.open(logo_p).convert("RGB")
a = np.asarray(lg).astype(float)
bg = np.array([19, 28, 58], float)
d = np.sqrt(((a - bg) ** 2).sum(-1))
alpha = np.clip((d - 14) / 40, 0, 1)
rgba = np.dstack([a, alpha * 255]).astype(np.uint8)
sym = Image.fromarray(rgba, "RGBA")
# ne garder que la zone du symbole (au-dessus du mot AROSOFT)
sym = sym.crop((0, 0, lg.width, 292))
bbox = sym.getchannel("A").point(lambda v: 255 if v > 40 else 0).getbbox()
sym = sym.crop(bbox)
sym.save(os.path.join(OUT, "as_symbol.png"))
print("symbol bbox", bbox, sym.size)

# ---------- 3. Einstein : couche fond + couche sujet (parallaxe) ----------
ein = Image.open(ein_p).convert("RGB")
ein.save(os.path.join(OUT, "einstein.jpg"), quality=95)
# masque du sujet (cheveux, visage, épaules) tracé à la main, bords très adoucis
from PIL import ImageDraw
mimg = Image.new("L", ein.size, 0)
poly = [(28, 175), (55, 95), (150, 42), (262, 36), (385, 58), (462, 128), (492, 232), (478, 335),
        (452, 430), (420, 468), (505, 540), (520, 600), (520, 780), (0, 780), (0, 420), (35, 395), (16, 300)]
ImageDraw.Draw(mimg).polygon(poly, fill=255)
m = mimg.filter(ImageFilter.GaussianBlur(14))
fg = ein.copy(); fg.putalpha(m)
fg.save(os.path.join(OUT, "einstein_fg.png"))
print("done")
