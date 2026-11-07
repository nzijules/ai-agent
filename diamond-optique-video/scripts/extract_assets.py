"""Extrait le logo exact et les personnages depuis l'affiche de référence."""
import sys
from PIL import Image, ImageFilter
from rembg import remove, new_session

src = Image.open('public/img/affiche-reference.jpg').convert('RGB')

# 1) Logo exact (zone haute de l'affiche, fond blanc)
logo = src.crop((288, 18, 792, 212))
logo = logo.resize((logo.width * 2, logo.height * 2), Image.LANCZOS)
# fond blanc -> transparent (seuil doux)
rgba = logo.convert('RGBA')
px = rgba.load()
for y in range(rgba.height):
    for x in range(rgba.width):
        r, g, b, a = px[x, y]
        m = min(r, g, b)
        if m > 235:
            px[x, y] = (r, g, b, 0)
        elif m > 200:
            px[x, y] = (r, g, b, int(255 * (235 - m) / 35))
rgba.save('public/img/logo-diamond-optique.png')
# version mark seule (sans tagline) pour le badge haut-droite
rgba.crop((0, 0, rgba.width, int(rgba.height * 0.78))).save('public/img/logo-mark.png')

# 2) Personnages
session = new_session('u2net_human_seg')
def cut(box, name):
    crop = src.crop(box)
    crop = crop.resize((crop.width * 2, crop.height * 2), Image.LANCZOS)
    out = remove(crop, session=session, post_process_mask=True)
    out = out.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
    out.save(f'public/img/{name}.png')

cut((700, 330, 900, 870), 'homme')
cut((850, 360, 1080, 870), 'femme')
cut((660, 330, 1080, 870), 'duo')
print('ok')

# 3) Nettoyage des franges (fond rouge/jaune de l'affiche) sur les découpes
import numpy as np
for name in ['duo', 'homme', 'femme']:
    im = np.array(Image.open(f'public/img/{name}.png').convert('RGBA')).astype(np.float32)
    r, g, b, a = im[..., 0], im[..., 1], im[..., 2], im[..., 3]
    red = (r > 110) & (g < 0.30 * r) & (b < 0.5 * r)
    yellow = (r > 190) & (g > 140) & (b < 0.45 * g)
    a[red | yellow] = 0
    alpha = Image.fromarray(a.astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    im[..., 3] = np.array(alpha)
    # fondu en bas (le cadrage de l'affiche coupe les bras)
    h = im.shape[0]
    fade = np.clip((0.86 * h - np.arange(h)) / (0.10 * h), 0, 1)[:, None]
    im[..., 3] *= fade
    Image.fromarray(im.astype(np.uint8)).save(f'public/img/{name}.png')
print('clean ok')
