import sys,glob
from PIL import Image, ImageDraw
fs=sorted(glob.glob(sys.argv[1]+'/t*.jpg'))
ims=[Image.open(f) for f in fs]; w,h=ims[0].size; cols=2; rows=(len(ims)+1)//2
sh=Image.new('RGB',(w*cols,h*rows),'white')
for i,(f,im) in enumerate(zip(fs,ims)):
    sh.paste(im,((i%cols)*w,(i//cols)*h)); ImageDraw.Draw(sh).text(((i%cols)*w+8,(i//cols)*h+8),f.split('/')[-1],fill='magenta')
sh.save(sys.argv[2],quality=80)
