"""Détoure le logo Arosoft (supprime le fond blanc) et passe le bleu marine en blanc
pour qu'il reste lisible sur le fond sombre de la vidéo."""
import sys
import numpy as np
from PIL import Image, ImageFilter
src = Image.open(sys.argv[1]).convert("RGB")
im = np.asarray(src).astype(float)
bl = np.asarray(src.filter(ImageFilter.GaussianBlur(1.2))).astype(float)
bg = np.median(im[:20, :20].reshape(-1, 3), 0)
a0 = np.max((bg - im) / np.maximum(bg, 1), axis=2).clip(0, 1)
c = ((im - bg * (1 - a0[..., None])) / np.maximum(a0[..., None], 1e-3)).clip(0, 255)
a = np.where(a0 < 0.06, 0, (a0 - 0.06) / 0.94)
v = bg - bl
x = v[..., 2] / np.maximum(v[..., 0], 1)  # bleu marine ≈0.83, bleu vif ≤0.73
t = np.clip((x - 0.755) / 0.05, 0, 1) * (np.max(v, 2) > 15)
m = Image.fromarray((t * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(0.8))
t = np.asarray(m).astype(float) / 255
# jonction S / triangle : fondu horizontal propre
H, W = t.shape
yy, xx = np.mgrid[0:H, 0:W]
reg = (yy >= 672) & (yy <= 760) & (xx >= 700) & (xx <= 900)
s = np.clip((xx - 740) / 100, 0, 1); s = s * s * (3 - 2 * s)
t = np.where(reg, s, t)
c = c * (1 - t[..., None]) + np.array([244, 247, 255.0]) * t[..., None]
img = Image.fromarray(np.dstack([c, a * 255]).astype(np.uint8), "RGBA")
img = img.crop(img.getbbox())
img.save(sys.argv[2])
