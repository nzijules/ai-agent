"""
Convertit le logo AroSoft fourni (fond blanc) en PNG transparent pour fond sombre.
- Détourage du blanc (« unmultiply white »).
- Le bleu marine (« SOFT », « S », baseline) est éclairci en blanc bleuté pour rester lisible.
Usage : python3 scripts/make-dark-logo.py public/brand/arosoft-logo.jpg public/brand/arosoft-logo-dark.png
"""
import sys
import numpy as np
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32) / 255.0
alpha = 1.0 - im.min(axis=2)
alpha = np.clip((alpha - 0.04) / 0.96, 0, 1)
a = np.maximum(alpha, 1e-4)[..., None]
color = np.clip((im - (1 - a)) / a, 0, 1)

# Marine (canal bleu faible, contrairement au dégradé bleu du « A ») → blanc bleuté
navy = np.clip((0.40 - color[..., 2]) / 0.14, 0, 1)
target = np.array([0.957, 0.973, 1.0])
color = color * (1 - navy[..., None]) + target * navy[..., None]

# Le bleu vif est légèrement éclairci pour le fond graphite
blue = (color[..., 2] > color[..., 0] + 0.3)[..., None]
color = np.where(blue, np.clip(color * 1.12 + 0.03, 0, 1), color)

out = np.dstack([color, alpha]) * 255
Image.fromarray(out.astype(np.uint8), "RGBA").save(dst, optimize=True)
print("ok", dst)
