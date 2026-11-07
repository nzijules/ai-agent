"""Extrait le monogramme + logotype AroSoft du fichier fourni, supprime le fond blanc
et retire le slogan. Produit deux variantes PNG transparentes :
 - arosoft-logo-transparent.png : couleurs d'origine (pour fonds clairs)
 - arosoft-logo-reverse.png     : parties navy passées en blanc (pour fonds sombres)
Usage : python3 -I scripts/process-logo.py <source.jpg> <dossier_sortie>
"""
import sys
import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(np.float32) / 255.0
# Recadrage : monogramme + "AROSOFT", sans la ligne de slogan (y > ~950)
a = a[190:940, 100:1160]

mn = a.min(axis=2)
# alpha : distance au blanc (le fond JPEG n'est pas parfaitement blanc)
alpha = np.clip((0.955 - mn) / (0.955 - 0.55), 0, 1)
alpha = np.maximum(alpha, np.clip((1 - mn) * 0 , 0, 1))
# dé-mélange de la couleur sur fond blanc : c = (p - (1-a)) / a
safe = np.where(alpha > 1e-3, alpha, 1)[..., None]
rgb = np.clip((a - (1 - alpha[..., None])) / safe, 0, 1)

def save(rgb_arr, name):
    rgba = np.dstack([rgb_arr, alpha])
    img = Image.fromarray((rgba * 255).round().astype(np.uint8), "RGBA")
    bbox = img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    img = img.crop(bbox)
    img.save(f"{out}/{name}", optimize=True)
    print(name, img.size)

save(rgb, "arosoft-logo-transparent.png")

# Variante inversée : pixels peu saturés et sombres (navy #16213E) -> blanc
r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
# navy #16213E : b-r ~ 0.16 ; bleus du monogramme : b-r > 0.35
navy_w = np.clip((0.30 - (b - r)) / 0.08, 0, 1)
# lissage du masque pour effacer les blocs JPEG à la jonction S / A
from PIL import ImageFilter
m = Image.fromarray((navy_w * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(2.5))
navy_w = np.asarray(m).astype(np.float32) / 255.0
white = np.array([0.96, 0.97, 0.98])
rev = rgb * (1 - navy_w[..., None]) + white * navy_w[..., None]
save(rev, "arosoft-logo-reverse.png")
