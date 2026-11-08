"""Split each original poster into independent, animatable layers.

Inputs : assets/originals/sceneN.jpg  (reference posters)
         assets/cutouts/sceneN.png    (foreground matte from tools/segment.mjs)
Outputs: assets/scenes/sN/*.png       (layers)  +  assets/scenes/manifest.json

Text, logos and flat UI widgets are removed from the person layer because they
are rebuilt as live HTML/SVG in the scenes. Phone screens are rectified to a
300x600 "screen space" so their UI can be re-animated and projected back with a
homography; fingers that touch a screen are exported as an occluder layer.
"""
import json, os
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, 'assets')
OUT = os.path.join(A, 'scenes')
SW, SH, SS = 300, 600, 3          # screen space size and supersampling of exported screen bitmaps

# ---------------------------------------------------------------- per-scene description (original px coords)
# separate mattes for 3D icons (tools/segment_icons.mjs): scene -> (file, x offset, y offset)
ICON_MATTES = {4: ('scene4_clapper_650_130.png', 650, 130), 5: ('scene5_icon_592_292.png', 592, 292),
               6: ('scene6_database_595_140.png', 595, 140)}

SCENES = {
 1: dict(fade=(1040, 1150), torso=(705, 1150),
         remove=[('all', (100, 90, 960, 282)), ('all', (740, 1180, 1060, 1295)), ('all', (30, 1160, 245, 1305)),
                 ('all', (150, 395, 440, 662)), ('light', (385, 345, 480, 447)), ('light', (308, 622, 398, 708)),
                 ('all', (762, 325, 945, 468)), ('light', (752, 452, 826, 512))],
         pieces={'bubble': ('light', (150, 395, 440, 664)), 'thought': ('light', (750, 325, 945, 512))},
         person_pieces={'phone': (188, 652, 388, 900)}),
 2: dict(fade=(800, 905), torso=(450, 905),
         remove=[('all', (160, 950, 920, 1150)), ('all', (450, 1180, 630, 1305)),
                 ('all', (695, 95, 852, 252)), ('panel2', (585, 200, 886, 482))],
         pieces={'panel': ('panel2', (585, 200, 886, 482))}),
 3: dict(fade=(1095, 1188), torso=(655, 1188),
         remove=[('all', (90, 60, 1000, 338)), ('all', (450, 1190, 630, 1312)), ('nonskin', (598, 405, 846, 753))],
         pieces={'panel': ('nonskin', (598, 405, 846, 753))}),
 4: dict(fade=(860, 965), holes=False,
         remove=[('all', (150, 950, 930, 1140)), ('all', (450, 1170, 630, 1300)), ('all', (672, 155, 945, 402)),
                 ('all', (634, 68, 712, 162)), ('all', (712, 388, 792, 478))],
         pieces={'clapper': ('alpha', (672, 155, 945, 402))},
         screen=[(345, 112), (612, 88), (685, 635), (405, 660)]),
 5: dict(fade=(1060, 1165), holes=False,
         remove=[('all', (110, 85, 970, 288)), ('all', (450, 1190, 630, 1312)), ('nonskin', (612, 312, 936, 702)),
                 ('all', (203, 408, 290, 482)), ('all', (594, 302, 682, 392))],
         pieces={'cloud': ('alpha', (612, 312, 936, 492)), 'folder': ('folder', (636, 478, 916, 702)),
                 'shield': ('alpha', (772, 568, 896, 698))},
         screen=[(317, 347), (600, 330), (640, 870), (387, 895)]),
 6: dict(fade=(820, 905), holes=False,
         remove=[('all', (70, 910, 1010, 1180)), ('all', (450, 1180, 630, 1305)), ('nonskin', (615, 160, 882, 492)),
                 ('all', (233, 253, 300, 330)), ('all', (600, 143, 667, 217))],
         pieces={'database': ('alpha', (615, 160, 882, 492))},
         screen=[(335, 200), (580, 180), (635, 650), (400, 680)]),
 7: dict(fade=(1100, 1205), holes=False,
         remove=[('all', (60, 130, 1030, 402)), ('all', (450, 1180, 630, 1305)), ('nonskin', (692, 512, 862, 712)),
                 ('all', (273, 462, 362, 592))],
         pieces={},
         screen=[(372, 492), (640, 477), (700, 950), (442, 967)]),
}

def skin_mask(rgb):
    r, g, b = [rgb[..., i].astype(float) for i in range(3)]
    rr = np.maximum(r, 1)
    return (r > 60) & (r - b > 30) & (g / rr > .42) & (g / rr < .86) & (b / rr > .25)

def light_mask(rgb):
    lum = rgb[..., :3].astype(float) @ [.299, .587, .114]
    return lum > 165

def region_mask(mode, rgb, box, shape):
    m = np.zeros(shape, bool)
    x0, y0, x1, y1 = box
    sub = rgb[y0:y1, x0:x1]
    if mode == 'all' or mode == 'alpha':
        m[y0:y1, x0:x1] = True
    elif mode == 'light':
        m[y0:y1, x0:x1] = light_mask(sub)
    elif mode == 'nonskin':
        m[y0:y1, x0:x1] = ~clean(skin_mask(sub))
    elif mode == 'panel2':   # scene 2 panel: everything except the phone that pokes into the box bottom-left
        mm = np.ones(sub.shape[:2], bool)
        lum = sub[..., :3].astype(float) @ [.299, .587, .114]
        yy = np.arange(y0, y1)[:, None]; xx = np.arange(x0, x1)[None, :]
        phone = (yy > 436) & (xx < 760) & (lum < 120)
        m[y0:y1, x0:x1] = mm & ~phone
    elif mode == 'folder':   # folder piece = box minus shield box
        m[y0:y1, x0:x1] = True
        m[568:698, 772:896] = False
    return m

def clean(m, grow=2):
    im = Image.fromarray((m * 255).astype(np.uint8))
    im = im.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    if grow:
        im = im.filter(ImageFilter.MaxFilter(2 * grow + 1))
    return np.asarray(im) > 127

def fill_holes(alpha, close_row=None, rgb=None):
    """Make semi-transparent interiors (yellow shirt on yellow, white tee) opaque.
    The silhouette is closed along close_row (where the body fades out), then every enclosed
    hole whose matte is partly confident (mean alpha > 18) is filled; true background gaps
    (alpha ~ 0, e.g. between a raised arm and the head) stay transparent."""
    b = (alpha > 110).astype(np.uint8) * 255
    if close_row:
        xs = np.nonzero(b[close_row])[0]
        if len(xs): b[close_row - 2:close_row + 3, xs.min():xs.max() + 1] = 255
    im = Image.fromarray(b).filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MinFilter(7))
    lab = Image.fromarray(255 - np.asarray(im)).copy()   # 255 = not-person (writable copy)
    H, W = alpha.shape
    for x in range(0, W, 6):
        for y in (0, H - 1):
            if lab.getpixel((x, y)) == 255: ImageDraw.floodfill(lab, (x, y), 100)
    for y in range(0, H, 6):
        for x in (0, W - 1):
            if lab.getpixel((x, y)) == 255: ImageDraw.floodfill(lab, (x, y), 100)
    fill = np.zeros(alpha.shape, bool)
    arr = np.asarray(lab)
    ys, xs = np.nonzero(arr == 255)
    for y, x in zip(ys[::40], xs[::40]):
        if lab.getpixel((int(x), int(y))) != 255: continue
        ImageDraw.floodfill(lab, (int(x), int(y)), 50)
        arr = np.asarray(lab)
        reg = arr == 50
        whiteish = rgb is not None and rgb[reg][:, 2].astype(float).mean() > 110   # white tee: high blue; yellow bg: low blue
        if alpha[reg].mean() > 18 or whiteish: fill |= reg
        lab = Image.fromarray(np.where(reg, 0, arr).astype(np.uint8)).copy()
    solid = np.asarray(im) > 0
    solid = (solid | fill)
    if close_row: solid[close_row + 3:] = solid[close_row + 3:] & (alpha[close_row + 3:] > 110)
    sm = Image.fromarray((solid * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(2.5))
    return np.maximum(alpha, np.asarray(sm).astype(float))

def torso_fill(alpha, rows, blur_rows=9):
    """Opaque torso: for each row in rows=(y0, y1), fill between the leftmost and rightmost
    confident matte pixels (extents median-smoothed over rows). The matte reads the white tee and
    the yellow shirt (yellow on yellow) as background; this restores them as solid body."""
    y0, y1 = rows
    conf = alpha > 110
    H, W = alpha.shape
    L = np.full(H, -1); R = np.full(H, -1)
    for y in range(y0, y1):
        xs = np.nonzero(conf[y])[0]
        if len(xs) > 10: L[y], R[y] = xs.min(), xs.max()
    valid = L >= 0
    Ls, Rs = L.astype(float).copy(), R.astype(float).copy()
    for y in range(y0, y1):
        lo, hi = max(y0, y - blur_rows), min(y1, y + blur_rows + 1)
        v = valid[lo:hi]
        if v.sum(): Ls[y] = np.median(L[lo:hi][v]); Rs[y] = np.median(R[lo:hi][v])
    m = np.zeros(alpha.shape, float)
    xx = np.arange(W)
    for y in range(y0, y1):
        if not valid[max(y0, y - blur_rows):y + blur_rows + 1].any(): continue
        ramp = min(1.0, (y - y0) / 40.0)             # soft start so no hard horizontal edge
        m[y] = ((xx >= Ls[y] + 3) & (xx <= Rs[y] - 3)) * ramp
    m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))).astype(float)
    return np.maximum(alpha, m)

def save_rgba(rgb, alpha, box, path):
    x0, y0, x1, y1 = box
    out = np.dstack([rgb[y0:y1, x0:x1, :3], alpha[y0:y1, x0:x1].clip(0, 255).astype(np.uint8)])
    Image.fromarray(out, 'RGBA').save(path, optimize=True)

def bbox(alpha, pad=4):
    ys, xs = np.nonzero(alpha > 8)
    H, W = alpha.shape
    return tuple(int(v) for v in (max(0, xs.min() - pad), max(0, ys.min() - pad), min(W, xs.max() + pad + 1), min(H, ys.max() + pad + 1)))

def homography(src, dst):
    """3x3 H with dst ~ H @ src (points as (x, y))."""
    M = []
    for (x, y), (u, v) in zip(src, dst):
        M.append([x, y, 1, 0, 0, 0, -u * x, -u * y, -u])
        M.append([0, 0, 0, x, y, 1, -v * x, -v * y, -v])
    _, _, Vt = np.linalg.svd(np.array(M, float))
    H = Vt[-1].reshape(3, 3)
    return H / H[2, 2]

def rectify(img, quad):
    rect = [(0, 0), (SW * SS, 0), (SW * SS, SH * SS), (0, SH * SS)]
    H = homography(rect, quad)                       # output(rect) -> input(quad)
    coeffs = (H.flatten() / H[2, 2])[:8]
    return img.transform((SW * SS, SH * SS), Image.PERSPECTIVE, tuple(coeffs), Image.BICUBIC)

manifest = {}
os.makedirs(OUT, exist_ok=True)
for k, cfg in SCENES.items():
    d = os.path.join(OUT, f's{k}'); os.makedirs(d, exist_ok=True)
    orig = Image.open(f'{A}/originals/scene{k}.jpg').convert('RGB')
    rgb = np.asarray(orig)
    H, W = rgb.shape[:2]
    alpha = np.asarray(Image.open(f'{A}/cutouts/scene{k}.png').convert('RGBA'))[..., 3].astype(float)
    if cfg.get('torso'):
        alpha = torso_fill(alpha, cfg['torso'])
    entry = {'size': [W, H], 'layers': {}}
    icon_alpha = alpha
    if k in ICON_MATTES:
        f, ox, oy = ICON_MATTES[k]
        ia = np.asarray(Image.open(f'{A}/cutouts/{f}').convert('RGBA'))[..., 3].astype(float)
        icon_alpha = np.zeros_like(alpha)
        icon_alpha[oy:oy + ia.shape[0], ox:ox + ia.shape[1]] = ia
        if k == 5:   # drop the yellow-on-yellow ghost left of / under the folder
            icon_alpha[540:, :650] = 0
            icon_alpha[692:, :772] = 0

    # pieces (icons / UI bitmaps) are cut from the matte before removal
    for name, (mode, box) in cfg.get('pieces', {}).items():
        m = region_mask(mode, rgb, box, alpha.shape)
        pa = np.where(m, icon_alpha if mode in ('alpha', 'folder') else alpha, 0)
        bb = bbox(pa)
        save_rgba(rgb, pa, bb, f'{d}/{name}.png')
        entry['layers'][name] = list(bb)

    person = alpha.copy()
    for mode, box in cfg['remove']:
        person[region_mask(mode, rgb, box, alpha.shape)] = 0
    fa, fb = cfg['fade']
    ramp = np.clip((fb - np.arange(H)) / (fb - fa), 0, 1)[:, None]
    person *= ramp
    person = np.asarray(Image.fromarray(person.astype(np.uint8)).filter(ImageFilter.GaussianBlur(.6))).astype(float)

    if 'screen' in cfg:
        quad = cfg['screen']
        scr = rectify(orig, quad)
        scr.save(f'{d}/screen.jpg', quality=92)
        entry['screen'] = quad
        # occluder: skin pixels of the matte that sit over the screen quad (fingers)
        poly = Image.new('L', (W, H), 0)
        cx = np.mean([p[0] for p in quad]); cy = np.mean([p[1] for p in quad])
        grown = [(x + (x - cx) * .06, y + (y - cy) * .03) for x, y in quad]
        ImageDraw.Draw(poly).polygon(grown, fill=255)
        inside = np.asarray(poly) > 0
        sk = clean(skin_mask(rgb), grow=1) & inside & (alpha > 120)
        occ = np.asarray(Image.fromarray((sk * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))).astype(float)
        if occ.max() > 0:
            bb = bbox(occ)
            save_rgba(rgb, occ, bb, f'{d}/occluder.png')
            entry['layers']['occluder'] = list(bb)

    bb = bbox(person)
    save_rgba(rgb, person, bb, f'{d}/person.png')
    entry['layers']['person'] = list(bb)

    for name, box in cfg.get('person_pieces', {}).items():
        m = region_mask('all', rgb, box, alpha.shape)
        pa = np.where(m, person, 0)
        b2 = bbox(pa)
        save_rgba(rgb, pa, b2, f'{d}/{name}.png')
        entry['layers'][name] = list(b2)

    manifest[k] = entry
    print(k, {n: v for n, v in entry['layers'].items()})

json.dump(manifest, open(f'{OUT}/manifest.json', 'w'), indent=1)
open(f'{OUT}/manifest.js', 'w').write('window.MANIFEST = ' + json.dumps(manifest) + ';\n')
