"""Détoure la maquette du guide (supprime le décor de la photo) -> PNG transparent."""
import sys
from PIL import Image, ImageDraw, ImageFilter
im = Image.open(sys.argv[1]).convert("RGBA")
S = 4  # sur-échantillonnage pour des bords lisses
poly = [(98, 92), (112, 79), (330, 56), (906, 16), (960, 28), (1002, 57),
        (1003, 1330), (992, 1340), (586, 1366), (175, 1398), (110, 1396), (98, 1380)]
mask = Image.new("L", (im.width * S, im.height * S), 0)
ImageDraw.Draw(mask).polygon([(x * S, y * S) for x, y in poly], fill=255)
mask = mask.resize(im.size, Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.6))
im.putalpha(mask)
im = im.crop(im.getbbox())
im.save(sys.argv[2])
