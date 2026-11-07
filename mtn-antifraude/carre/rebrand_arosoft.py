"""Rebranding Arosoft d'une vidéo bicolore jaune/noir (MTN) à partir des pixels rendus.
Chaque pixel est décomposé en mélange noir / jaune / blanc, puis recomposé :
  jaune -> dégradé bleu Arosoft (diagonal, comme le logo), noir -> blanc, blanc -> bleu marine Arosoft.
Le logo MTN (zone fixe en haut à droite) est effacé et remplacé par le logo Arosoft (version blanche).
Usage : ffmpeg ... -f rawvideo -pix_fmt rgb24 - | python3 rebrand_arosoft.py W H logo.png [bleu|blanc] | ffmpeg -f rawvideo ...
Mode « blanc » : jaune -> blanc, noir -> dégradé bleu Arosoft (bleu roi -> bleu profond), blanc -> bleu très clair.
"""
import sys
import numpy as np
from PIL import Image

W, H = int(sys.argv[1]), int(sys.argv[2])
LOGO = sys.argv[3]
MODE = sys.argv[4] if len(sys.argv) > 4 else 'bleu'
K = np.array([18, 17, 22], np.float32)     # noir mesuré
Y = np.array([254, 201, 3], np.float32)    # jaune mesuré
Wt = np.array([255, 255, 255], np.float32)
M = np.stack([Y - K, Wt - K], 1)            # 3x2
P = np.linalg.pinv(M).astype(np.float32)    # 2x3

# couleurs Arosoft (relevées sur le logo fourni)
B1, B2, B3 = (np.array(c, np.float32) for c in ([4, 135, 243], [1, 65, 197], [0, 40, 136]))
NAVY = np.array([21, 32, 62], np.float32)
WHITE = np.array([255, 255, 255], np.float32)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
g = ((xx / W) * 0.35 + (yy / H) * 0.65)[..., None]           # diagonale haut-gauche -> bas-droite
BLUE = np.where(g < 0.5, B1 + (B2 - B1) * (g / 0.5), B2 + (B3 - B2) * ((g - 0.5) / 0.5))
INK = B2 + (B3 - B2) * g                                      # bleu lisible pour textes (mode blanc)
PALE = np.array([234, 242, 255], np.float32)

# zone du logo MTN à effacer, et logo Arosoft
LX0, LX1, LY0, LY1 = 884, 1036, 32, 112
logo = Image.open(LOGO).convert('RGBA')
lh = 76; lw = round(logo.width * lh / logo.height)
logo = np.asarray(logo.resize((lw, lh), Image.LANCZOS)).astype(np.float32) / 255
lx = 1024 - lw; ly = 72 - lh // 2

n = W * H * 3
inp, out = sys.stdin.buffer, sys.stdout.buffer
while True:
    buf = inp.read(n)
    if len(buf) < n:
        break
    f = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32)
    f[LY0:LY1, LX0:LX1] = Y                                     # efface le logo MTN
    aw = (f - K) @ P.T                                           # coefficients jaune / blanc
    a = np.clip(aw[..., 0], 0, 1)[..., None]
    w = np.clip(aw[..., 1], 0, 1)[..., None]
    s = np.maximum(a + w, 1.0); a, w = a / s, w / s
    k = 1 - a - w
    o = (WHITE * a + PALE * w + INK * k) if MODE == 'blanc' else (BLUE * a + NAVY * w + WHITE * k)
    reg = o[ly:ly + lh, lx:lx + lw]
    o[ly:ly + lh, lx:lx + lw] = reg * (1 - logo[..., 3:]) + logo[..., :3] * 255 * logo[..., 3:]
    out.write(np.clip(o + 0.5, 0, 255).astype(np.uint8).tobytes())
