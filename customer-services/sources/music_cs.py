"""Musique et effets sonores originaux pour « Une seule action peut tout changer » (115 s).
Tension (0-57,5 s), éclaircie (57,5-86 s), résolution positive (86-115 s)."""
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

import json, os
_M = json.load(open(os.environ['MAP'])) if os.environ.get('MAP') else None
def W(x):
    if _M is None: return x
    return float(np.interp(x, [b for _,b in _M], [a for a,_ in _M]))
SR = 44100; DUR = W(115.0); N = int(SR*DUR); t = np.arange(N)/SR
rng = np.random.default_rng(11)
OFF = 1.6
VO = [0,2.387,4.659,6.259,7.979,10.147,13.282,15.727,18.023,21.734,24.779,25.504,27.628,31.401,32.843,33.973,35.200,36.581,38.674,43.832,46.053,48.878,52.357,56.099,56.862,59.111,61.041,64.222,67.404,69.066,71.385,73.679,77.692,79.150,81.854,84.544,86.085,89.577,91.435,93.041,94.773,96.286,97.519,98.646,100.803,102.846,106.632,108.198]
c = lambda n: W(VO[n-1] + OFF)
BPM = 100; BEAT = 60/BPM; BAR = 4*BEAT

def hz(m): return 440*2**((m-69)/12)
def lp(x,f,o=2): return sosfilt(butter(o,f,'low',fs=SR,output='sos'),x)
def hp(x,f,o=2): return sosfilt(butter(o,f,'high',fs=SR,output='sos'),x)
def saw(f,tt,d=0.0): ph=f*(1+d)*tt; return 2*(ph-np.floor(ph+.5))
def add(buf,sig,start,gain=1.0):
    i=int(start*SR)
    if i>=len(buf): return
    j=min(len(buf),i+len(sig)); buf[i:j]+=sig[:j-i]*gain
def env_win(a,b,f=1.0): return np.clip((t-a)/f,0,1)*np.clip((b-t)/f,0,1)

L=np.zeros(N); R=np.zeros(N)
# ---------- progressions ----------
ACTS=[(0,W(57.5),[[45,57,60,64],[41,57,60,65],[38,57,62,65],[40,56,59,64]]),      # la m, fa, ré m, mi
      (W(57.5),W(86.0),[[48,55,60,64],[43,55,59,62],[45,57,60,64],[41,57,60,65]]),    # do, sol, la m, fa
      (W(86.0),DUR,[[41,57,60,65],[48,55,60,64],[43,55,59,62],[48,55,60,64,67]])]  # fa, do, sol, do
CH = 2*BAR
def chord_at(x):
    for a,b,prog in ACTS:
        if a<=x<b: return prog[int((x-a)//CH)%len(prog)], ACTS.index((a,b,prog))
    return ACTS[-1][2][-1], 2
# nappe par blocs d'accords
pad=np.zeros((N,2))
for a,b,prog in ACTS:
    k=0; x=a
    while x<b:
        y=min(b,x+CH); ch=prog[k%len(prog)]
        if b==DUR and y>=DUR-0.01: ch=prog[-1]
        w=env_win(x-.25,y+.25,.5)
        idx=np.nonzero(w)[0]
        tt=t[idx]
        for m in ch:
            for d,pan in ((-.005,.25),(.005,.75)):
                s=saw(hz(m),tt,d)*(.045 if m>50 else .07)*w[idx]
                pad[idx,0]+=s*(1-pan); pad[idx,1]+=s*pan
        x=y; k+=1
# filtre : sombre au début, ouvert à la fin
for ch_ in (0,1):
    dark=lp(pad[:,ch_],650); bright=lp(pad[:,ch_],2400)
    mix=np.clip((t-W(50))/40,0,1)
    pad[:,ch_]=dark*(1-mix)+bright*mix
L+=pad[:,0]; R+=pad[:,1]

# ---------- basse ----------
bass=np.zeros(N)
x=W(3.2)
while x<DUR-2.5:
    ch,act=chord_at(x); f=hz(ch[0]-12 if ch[0]>40 else ch[0])
    step = BEAT/2 if act==0 else BEAT
    if W(79.0)<x<W(85.8): x+=step; continue          # respiration pendant « aucune urgence… »
    ln=int(step*SR); tt=np.arange(ln)/SR
    e=np.exp(-tt*(8 if act==0 else 4))*(1-np.exp(-tt*300))
    add(bass,(saw(f,tt)*.5+np.sin(2*np.pi*f*tt))*e, x, 1.0 if act==0 else .8)
    x+=step
bass=lp(bass,380)*.3; L+=bass; R+=bass

# ---------- kick, hats ----------
kick=np.zeros(N); hat=np.zeros(N)
for i in range(int(DUR/BEAT)):
    x=i*BEAT
    on = (W(16.8)<=x<W(57.2)) or (W(86.0)<=x<W(111.8))
    if on and i%2==0:
        ln=int(.35*SR); tt=np.arange(ln)/SR; f=48+90*np.exp(-tt*30)
        add(kick,np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*9),x)
for i in range(int(DUR/(BEAT/4))):
    x=i*BEAT/4
    if W(16.8)<=x<W(40.0) or W(86.0)<=x<W(111.5):
        ln=int(.045*SR); tt=np.arange(ln)/SR
        add(hat,rng.standard_normal(ln)*np.exp(-tt*90)*(1 if i%4==2 else .4),x)
hat=hp(hat,7500)*.05
L+=kick*.42+hat*.8; R+=kick*.42+hat*1.2

# ---------- arpège lumineux (éclaircie et résolution) ----------
arp=np.zeros(N)
for i in range(int(DUR/(BEAT/2))):
    x=i*BEAT/2
    if not (W(58.5)<=x<W(78.8) or W(86.5)<=x<W(111.8)): continue
    ch,_=chord_at(x); notes=sorted(ch)[1:]
    m=notes[i%len(notes)]+12
    ln=int(.5*SR); tt=np.arange(ln)/SR; f=hz(m)
    tone=(np.sin(2*np.pi*f*tt)+.3*np.sin(2*np.pi*2*f*tt))*np.exp(-tt*6)*(1-np.exp(-tt*500))
    add(arp,tone,x,.055)
L+=arp*.8; R+=arp*1.2

# ---------- battement de cœur (pression) ----------
hb=np.zeros(N)
x=W(32.6)
while x<W(40.0):
    for dx,g in ((0,1),(.22,.7)):
        ln=int(.25*SR); tt=np.arange(ln)/SR
        add(hb,np.sin(2*np.pi*55*tt)*np.exp(-tt*16),x+dx,g)
    x+=.82
L+=hb*.45; R+=hb*.45

# ---------- effets ----------
fx=np.zeros((N,2))
def put(sig,at,g=1.0,pan=.5): add(fx[:,0],sig*(1-pan)*2,at,g); add(fx[:,1],sig*pan*2,at,g)
def tone(f,d,dec=6.0):
    tt=np.arange(int(d*SR))/SR; return np.sin(2*np.pi*f*tt)*np.exp(-tt*dec)*(1-np.exp(-tt*400))
def noise(d,lo,hi,shape):
    n=rng.standard_normal(int(d*SR)); n=sosfilt(butter(2,[lo,hi],'band',fs=SR,output='sos'),n); return n*shape(np.arange(len(n))/SR)
def whoosh(d=.6): return noise(d,400,6000,lambda tt: np.sin(np.pi*np.clip(tt/d,0,1))**2)*.5
def boom(d=.9,f0=120):
    tt=np.arange(int(d*SR))/SR; f=f0*np.exp(-tt*5)+38; return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*4.5)
def glitchsfx(d=.35):
    n=np.round(rng.standard_normal(int(d*SR))*2)/2; n=np.repeat(n[::14],14)[:int(d*SR)]
    tt=np.arange(len(n))/SR; return n*(np.floor(tt*40)%2)*np.exp(-tt*6)*.35
def click(): return noise(.04,1500,9000,lambda tt: np.exp(-tt*120))*.8
# notification
put(tone(1318,.35,9),.45,.30); put(tone(1760,.45,8),.60,.26)
for a in map(W,(3.2,11.4,32.9,51.3,62.7,79.1,86.0,97.9,112.0)): put(whoosh(),a-.35,.55)
for a in (c(7)+.05,W(16.8),c(13),W(40.0)): put(glitchsfx(),a-.05,1.0,.4); put(boom(.5,90),a,.35)
for a in (c(8),c(9),c(10)): put(click(),a,.6); put(tone(660,.2,14),a,.12)
for i,a in enumerate((c(14)-.3,c(14)+.35,c(14)+1.0)): put(click(),a,.5,.3+.2*i); put(tone(880+120*i,.12,25),a,.12)
for a in (c(15),c(16),c(17)): put(boom(.8,140),a,.55); put(noise(.25,2000,8000,lambda tt: np.exp(-tt*20)),a,.12)
put(boom(1.4,160),c(18),.8); put(glitchsfx(.5),c(18),.8)
for i in range(3): put(noise(.08,800,5000,lambda tt: np.exp(-tt*60)),c(19)+.85+i*.32,.9,.35+.15*i); put(tone(220,.12,30),c(19)+.85+i*.32,.25)
for k in range(2): put(tone(880,.16,4),c(19)+2.4+k*.22,.2,.7)
for a in (c(19)+3.0,c(20),c(21)): put(boom(.7,70),a,.45)
put(boom(1.2,60),c(23)+.12,.9); put(noise(.12,300,3000,lambda tt: np.exp(-tt*30)),c(23)+.12,.6)
for a in (c(23)+.6,c(23)+1.9): put(boom(.6,80),a,.35)
put(click(),c(25)+.4,.7); put(tone(523,.6,3),c(25)+.4,.15)
for i,a in enumerate((c(27),c(28),c(29))):
    put(tone(784+i*98,.6,4),a+.45,.18); put(tone(1046+i*130,.7,4),a+.55,.12)
put(tone(587,.25,6),c(31)+.45,.2); put(tone(440,.4,5),c(31)+.7,.2)
for a in (c(33),c(34),c(34)+1.25): put(boom(.6,90),a,.4)
put(boom(1.1,120),c(35),.7)
riser=noise(1.6,300,7000,lambda tt:(tt/1.6)**3)*.6; put(riser,W(84.4),.6)
for i in range(32): put(tone(1200+rng.random()*800,.08,40),c(37)+.6+i*.07,.05,rng.random())
put(tone(1568,.8,3),c(44)+.6,.14); put(tone(2093,.9,3),c(44)+.7,.1)
L+=fx[:,0]; R+=fx[:,1]

# ---------- accord final ----------
fin=np.zeros(N); T0=W(111.6); idx=t>T0
for m in (48,55,60,64,67,72):
    fin[idx]+=np.sin(2*np.pi*hz(m)*t[idx])*.05*np.clip((t[idx]-T0)/.8,0,1)
L+=fin; R+=fin

mix=np.stack([L,R],1)
fade=np.clip(t/.2,0,1)*np.clip((DUR-t)/1.0,0,1)
mix*=fade[:,None]; mix=np.tanh(mix*1.3)/np.tanh(1.3); mix/=np.max(np.abs(mix))/.89
wavfile.write(os.environ.get('OUT','musique-cs.wav'),SR,(mix*32767).astype(np.int16)); print('ok')
