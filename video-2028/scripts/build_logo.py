#!/usr/bin/env python3
"""Détoure le logo AROSOFT (fond blanc → transparent), retire la légende
« APPRENDRE • CRÉER • RÉUSSIR » et passe les parties bleu marine en blanc
pour qu'elles restent lisibles sur le fond noir de la vidéo.

Entrée : brand/logo-arosoft-source.jpg
Sortie : public/brand/logo-arosoft.png
"""
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
im = np.asarray(Image.open(ROOT / "brand/logo-arosoft-source.jpg").convert("RGB")).astype(np.float32)
h, w, _ = im.shape

# 1) On ne garde que le monogramme + « AROSOFT » (la légende commence vers 77 % de la hauteur)
im = im[: int(h * 0.765)]

# 2) Alpha par « dé-mélange » avec le blanc : alpha = (255 - min(R,G,B)) / 255
mn = im.min(axis=2)
alpha = np.clip((255 - mn) / 255 * 1.08, 0, 1)
alpha[alpha < 0.04] = 0
a = np.maximum(alpha, 1e-4)[..., None]
rgb = np.clip((im - 255 * (1 - a)) / a, 0, 255)

# 3) Bleu marine (peu saturé en bleu) → blanc ; les bleus vifs restent tels quels
r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
k = np.clip((75 - (b - r)) / 12, 0, 1)
# Zone où le dégradé du « A » se fond dans le bas du « S » : coupe nette, parallèle
# à la diagonale du A (pente 0.41), pour séparer proprement les deux formes.
yy, xx = np.mgrid[0:rgb.shape[0], 0:rgb.shape[1]]
zone = (yy > 600) & (yy < 750) & (xx > 600) & (xx < 870)
cut = np.clip((xx - (725 + (740 - yy) * 0.41)) / 2.0 + 0.5, 0, 1)
k = np.where(zone, cut, k)[..., None]
rgb = rgb * (1 - k) + 255 * k

out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
img = Image.fromarray(out, "RGBA")
img = img.crop(img.getbbox())
img.save(ROOT / "public/brand/logo-arosoft.png", optimize=True)
print("✓ public/brand/logo-arosoft.png", img.size)
