"""Remove the bottom MTN logo from each slide (it moves to the top-right in the video)
and extract a transparent logo PNG from slide 1."""
from PIL import Image, ImageFilter
import numpy as np, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, 'assets')
BOXES = {1: (46, 1175, 222, 1281)}
for i in range(2, 8):
    BOXES[i] = None  # auto-detect (centered logo)

def detect(g, H):
    y0 = H - 160
    reg = g[y0:H - 8, 430:650] < 110
    ys, xs = np.nonzero(reg)
    return (xs.min() + 430, ys.min() + y0, xs.max() + 430, ys.max() + y0)

def inpaint(img, box, pad=16):
    a = np.asarray(img).astype(float)
    x0, y0, x1, y1 = box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad
    out = a.copy()
    L = a[y0:y1, x0 - 8:x0 - 2].mean(axis=1)
    R = a[y0:y1, x1 + 2:x1 + 8].mean(axis=1)
    T = a[y0 - 8:y0 - 2, x0:x1].mean(axis=0)
    B = a[y1 + 2:y1 + 8, x0:x1].mean(axis=0) if y1 + 8 < a.shape[0] else T
    w = x1 - x0; h = y1 - y0
    u = np.linspace(0, 1, w)[None, :, None]
    v = np.linspace(0, 1, h)[:, None, None]
    horiz = L[:, None, :] * (1 - u) + R[:, None, :] * u
    vert = T[None, :, :] * (1 - v) + B[None, :, :] * v
    fill = (horiz + vert) / 2
    out[y0:y1, x0:x1] = fill
    res = Image.fromarray(out.clip(0, 255).astype(np.uint8))
    # feathered blend so the patch edges disappear
    m = Image.new('L', img.size, 0)
    mm = np.zeros((img.size[1], img.size[0]), np.uint8); mm[y0 + 3:y1 - 3, x0 + 3:x1 - 3] = 255
    m = Image.fromarray(mm).filter(ImageFilter.GaussianBlur(5))
    res = res.filter(ImageFilter.GaussianBlur(1.2))
    return Image.composite(res, img, m)

for i in range(1, 8):
    img = Image.open(f'{A}/slide{i}.jpg').convert('RGB')
    g = np.asarray(img.convert('L')).astype(int)
    box = BOXES[i] or detect(g, img.size[1])
    if i == 1:
        crop = img.crop((box[0] - 6, box[1] - 6, box[2] + 6, box[3] + 6))
        cg = np.asarray(crop.convert('L')).astype(float)
        alpha = ((182 - cg) / (182 - 40)).clip(0, 1) * 255
        rgba = np.zeros((*cg.shape, 4), np.uint8); rgba[..., 3] = alpha.astype(np.uint8)
        logo = Image.fromarray(rgba, 'RGBA')
        logo = logo.resize((logo.width * 2, logo.height * 2), Image.LANCZOS)
        logo.save(f'{A}/mtn-logo.png')
    inpaint(img, box).save(f'{A}/slide{i}.jpg', quality=94)
    print(i, box)
