"""Sound design for the MTN motion film.

usage: python3 tools/audio.py events.json audio/
  reads the SFX cue list exported by `node tools/render.js events events.json`
  writes  audio/sfx/<type>.wav   one sample per effect (deliverable)
          audio/sfx_track.wav    all cues placed on the timeline
          audio/music.wav        120 BPM afro-pop bed
          audio/voix-off-calee.wav   the voice-over phrases re-timed onto the 7 scenes
Everything is synthesised (no third-party samples), mixed for phone speakers.
"""
import json, os, sys, subprocess, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(5)
t_ = lambda d: np.arange(int(SR * d)) / SR

def hp(x, a=.95):
    y = np.zeros_like(x); px = py = 0.0
    for i in range(len(x)):
        py = a * (py + x[i] - px); px = x[i]; y[i] = py
    return y

def lp(x, a=.2):
    y = np.zeros_like(x); py = 0.0
    for i in range(len(x)):
        py += a * (x[i] - py); y[i] = py
    return y

def env_ad(n, att, dec):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(att, 1e-4)) * np.exp(-t / dec)

def sweep(f0, f1, d, shape=1.0):
    t = t_(d); f = f0 + (f1 - f0) * (t / d) ** shape
    return np.sin(2 * np.pi * np.cumsum(f) / SR)

def bell(f, d, partials=((1, 1), (2.76, .4), (5.4, .2))):
    t = t_(d)
    return sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * (3 + 2 * m)) for m, a in partials)

# ------------------------------------------------------------------ effects
def fx_whoosh():
    d = .55; t = t_(d); n = rng.standard_normal(len(t))
    out = np.zeros(len(t)); y = 0.0
    for i in range(len(t)):                       # moving resonant low-pass = swoosh
        a = .02 + .35 * np.sin(np.pi * t[i] / d) ** 2
        y += a * (n[i] - y); out[i] = y
    return hp(out, .9) * np.sin(np.pi * t / d) ** 1.5 * 1.8

def fx_impact():
    d = .9; t = t_(d)
    boom = sweep(150, 48, d, .35) * np.exp(-t * 6)
    knock = np.sin(2 * np.pi * 220 * t) * np.exp(-t * 30) * .6
    crack = hp(rng.standard_normal(len(t)), .7) * np.exp(-t * 25) * .5
    return np.tanh(1.6 * (boom + knock + crack)) * .9

def fx_pop():
    d = .14; t = t_(d)
    return (sweep(500, 1300, d, .5) * env_ad(len(t), .002, .05) + hp(rng.standard_normal(len(t)), .6) * np.exp(-t * 300) * .3) * .7

def fx_vibrate():
    d = .62; t = t_(d)
    buzz = np.sign(np.sin(2 * np.pi * 175 * t)) * .5 + np.sin(2 * np.pi * 350 * t) * .5
    gate = ((t % .31) < .22).astype(float)
    gate = lp(gate, .02)
    return lp(buzz, .35) * gate * .55

def fx_alert():
    return np.concatenate([bell(988, .18) * .8, bell(1319, .55)]) * .45

def fx_draw():
    d = .45; t = t_(d); n = hp(rng.standard_normal(len(t)), .55)
    return n * (.4 + .6 * np.abs(np.sin(2 * np.pi * 9 * t))) * np.sin(np.pi * t / d) * .22

def fx_tap():
    d = .06; t = t_(d)
    return (np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 120) + hp(rng.standard_normal(len(t)), .5) * np.exp(-t * 400) * .5) * .6

def fx_click():
    d = .07; t = t_(d)
    return (np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 160) * .7 + np.sin(2 * np.pi * 900 * t) * np.exp(-t * 90) * .5) * .7

def fx_tick():
    d = .05; t = t_(d)
    return np.sin(2 * np.pi * 3200 * t) * np.exp(-t * 180) * .4

def fx_slide():
    d = .28; t = t_(d)
    return (sweep(400, 900, d) * .35 + hp(rng.standard_normal(len(t)), .8) * .3) * np.sin(np.pi * t / d) * .7

def fx_confirm():
    notes = [1047, 1319, 1568]
    out = np.zeros(int(SR * .9))
    for i, f in enumerate(notes):
        b = bell(f, .7) * .5; s = int(SR * .07 * i); out[s:s + len(b)] += b[:len(out) - s]
    return out * .6

def fx_stop():
    d = .55; t = t_(d)
    return sweep(950, 180, d, .6) * np.exp(-t * 4) * .5

def fx_play():
    return np.concatenate([bell(660, .12) * .6, bell(990, .4) * .7]) * .5

def fx_select():
    a = fx_tick(); out = np.zeros(int(SR * .5)); out[:len(a)] += a; out[int(SR * .07):int(SR * .07) + len(a)] += a
    b = sweep(800, 1400, .15) * env_ad(int(SR * .15), .003, .06) * .4
    out[int(SR * .12):int(SR * .12) + len(b)] += b
    return out

def fx_stream():
    d = 1.8; out = np.zeros(int(SR * d))
    for k in range(26):
        f = 1200 + rng.random() * 2400; b = bell(f, .12, ((1, 1),)) * .18
        s = int(SR * (k * d / 26 + rng.random() * .03)); out[s:s + len(b)] += b[:len(out) - s]
    return out * np.linspace(1, .7, len(out))

def fx_scan():
    d = .9; t = t_(d)
    return sweep(380, 2300, d, 1.4) * (.55 + .45 * np.sin(2 * np.pi * 22 * t)) * np.sin(np.pi * t / d) * .28

def fx_ripple():
    d = .7; t = t_(d)
    s = sweep(1400, 380, d, .4) * np.exp(-t * 5) * .4
    return s + np.concatenate([np.zeros(int(SR * .09)), s[:-int(SR * .09)] * .4])

def fx_sparkle():
    d = 1.0; out = np.zeros(int(SR * d))
    for k in range(16):
        f = 2500 + rng.random() * 3500; b = bell(f, .25, ((1, 1), (2.01, .3))) * .16
        s = int(SR * rng.random() * .6); out[s:s + len(b)] += b[:len(out) - s]
    return out

def fx_chime():
    notes = [784, 988, 1175, 1568]
    out = np.zeros(int(SR * 2.0))
    for i, f in enumerate(notes):
        b = bell(f, 1.6) * .45; s = int(SR * .09 * i); out[s:s + len(b)] += b[:len(out) - s]
    return out * .7

FX = {k[3:]: v for k, v in globals().items() if k.startswith('fx_')}

# ------------------------------------------------------------------ music bed (120 BPM afro-pop)
def music(DUR, end_hit):
    N = int(SR * DUR); L = np.zeros(N); R = np.zeros(N)
    def add(sig, at, g=1.0, pan=0.0):
        i = int(at * SR); j = min(N, i + len(sig))
        if j <= i: return
        s = sig[:j - i] * g; L[i:j] += s * (1 - max(pan, 0)); R[i:j] += s * (1 + min(pan, 0))
    NZ = rng.standard_normal(SR)
    def kick():
        t = t_(.3); body = np.sin(2 * np.pi * np.cumsum(55 + 160 * np.exp(-t * 30)) / SR) * np.exp(-t * 10)
        return np.tanh(2 * (body + rng.standard_normal(len(t)) * np.exp(-t * 400) * .5 + np.sin(2 * np.pi * 180 * t) * np.exp(-t * 35) * .5)) * .75
    def clap():
        t = t_(.22); n = hp(NZ[:len(t)].copy(), .9)
        e = sum(np.exp(-np.maximum(0, t - d) * 60) * (t >= d) for d in (0, .011, .022)) * .4 + np.exp(-t * 14) * (t >= .022)
        return n * e * .5
    def shaker(g):
        t = t_(.07); return hp(NZ[3000:3000 + len(t)].copy(), .75) * np.sin(np.pi * t / .07) ** 2 * .2 * g
    def logdrum(f):
        t = t_(.32); ph = 2 * np.pi * np.cumsum(f * (1 + .6 * np.exp(-t * 40))) / SR
        return np.tanh(1.8 * (np.sin(ph) + .7 * np.sin(2 * ph) + .45 * np.sin(3 * ph))) * np.exp(-t * 7) * .32
    def marimba(f):
        t = t_(.45); return (np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 30)) * np.exp(-t * 9) * np.minimum(1, t * 800) * .28
    def pad(fs, d):
        t = t_(d); s = sum(np.sin(2 * np.pi * f * t) + .3 * np.sin(4 * np.pi * f * t) for f in fs)
        return s * np.minimum(1, t / .2) * np.minimum(1, (d - t) / .3) * .035
    prog = [(220.0, [440, 523.3, 659.3]), (174.6, [349.2, 440, 523.3]), (261.6, [523.3, 659.3, 784]), (196.0, [392, 493.9, 587.3])]
    mel = [0, 2, 1, 2, 0, 1, 2, 1]
    t = 0.0; b = 0
    while t < DUR - .6:
        bib, bar = b % 4, (b // 4) % 4; root, ch = prog[bar]
        intro = t < 1.0
        if not intro:
            add(kick(), t, .8)
            if bib in (1, 3): add(clap(), t, .9)
        for k in range(4): add(shaker(1.0 if k % 2 else .55), t + k * .125, .8, .3)
        if t < end_hit:
            if not intro:
                if bib == 0: add(logdrum(root / 2), t)
                if bib == 2: add(logdrum(root / 2 * 1.5), t + .25, .8)
                if bib == 3: add(logdrum(root), t + .125, .7)
            add(marimba(ch[mel[(b * 2) % 8]]), t + .25, .9, -.2)
            if bib == 0: add(pad(ch, 2.0), t)
        b += 1; t += .5
    add(pad([440, 523.3, 659.3, 880], DUR - end_hit), end_hit, 1.8)
    mix = np.stack([L, R], 1)
    fl = int(SR * 1.2); mix[-fl:] *= np.linspace(1, 0, fl)[:, None]
    return mix

def write(path, x):
    if x.ndim == 1: x = x[:, None]
    if x.shape[1] == 1: x = np.repeat(x, 2, 1)
    x = np.clip(x, -1, 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())

# voice-over phrases (cut in the pauses of assets/voix-off.mp3) -> onset time in the film
VO_CUTS = [0.0, 2.91, 5.84, 8.81, 11.55, 14.77, 18.29, 21.81, None]
VO_ONSETS = [0.0, 3.151, 6.080, 9.051, 11.815, 15.033, 18.551, 22.006]   # first speech sample of each phrase
VO_TARGET = [.8, 6.5, 12.5, 18.5, 24.5, 30.5, 36.45, 39.9]                # where that speech must land

def place_vo(info, out, DUR):
    src = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets', 'voix-off.mp3')
    if not os.path.exists(src): return
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    vo = np.frombuffer(raw, np.int16).astype(float) / 32768
    N = int(SR * DUR); track = np.zeros(N)
    for i in range(8):
        a = int(VO_CUTS[i] * SR); b = len(vo) if VO_CUTS[i + 1] is None else int(VO_CUTS[i + 1] * SR)
        seg = vo[a:b].copy(); f = int(SR * .02); seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
        at = int((VO_TARGET[i] - (VO_ONSETS[i] - VO_CUTS[i])) * SR)
        j = min(N, at + len(seg)); track[at:j] += seg[:j - at]
    write(f'{out}/voix-off-calee.wav', track)

def main():
    ev_path, out = sys.argv[1], sys.argv[2]
    info = json.load(open(ev_path))
    DUR = info['TOTAL']
    os.makedirs(f'{out}/sfx', exist_ok=True)
    cache = {}
    for name, f in FX.items():
        cache[name] = f(); write(f'{out}/sfx/{name}.wav', cache[name] / max(1e-6, np.abs(cache[name]).max()) * .9)
    N = int(SR * DUR); track = np.zeros(N)
    for e in info['events']:
        s = cache[e['type']] * e.get('gain', 1); i = int(e['t'] * SR); j = min(N, i + len(s))
        if 0 <= i < N: track[i:j] += s[:j - i]
    write(f'{out}/sfx_track.wav', np.tanh(track * 1.1) * .95)
    end_hit = info['scenes'][-1]['start'] + 4.55
    m = music(DUR, end_hit); m = m / np.abs(m).max() * .9
    write(f'{out}/music.wav', m)
    place_vo(info, out, DUR)
    print('audio written', DUR, 's,', len(info['events']), 'cues')

if __name__ == '__main__':
    main()
