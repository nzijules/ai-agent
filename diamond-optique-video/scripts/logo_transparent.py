"""Logo sans fond : suppression du blanc par « color-to-alpha » (bords anti-crénelés propres)."""
import numpy as np
from PIL import Image

src = Image.open('public/img/affiche-reference.jpg').convert('RGB')
logo = src.crop((288, 18, 792, 212))
logo = logo.resize((logo.width * 3, logo.height * 3), Image.LANCZOS)
c = np.asarray(logo).astype(np.float32) / 255.0
# bruit JPEG du fond : tout ce qui est quasi blanc devient blanc pur
c = np.where(c.min(axis=2, keepdims=True) > 0.93, 1.0, c)
a = np.clip((1.0 - c).max(axis=2), 0, 1)
a = np.clip((a - 0.04) / 0.96, 0, 1)
safe = np.maximum(a, 1e-4)[..., None]
rgb = np.clip((c - (1.0 - safe)) / safe, 0, 1)
out = np.dstack([rgb, a]) * 255
img = Image.fromarray(out.astype(np.uint8), 'RGBA')
img = img.crop(img.getbbox())
img.save('public/img/logo-diamond-optique.png')
print(img.size)
