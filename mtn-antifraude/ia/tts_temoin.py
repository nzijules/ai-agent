"""Voix témoin (provisoire) : synthèse locale Piper fr_FR, phrase par phrase,
avec pauses maîtrisées. Produit ia/vo_temoin.wav + ia/vo_timing.json (début/fin de chaque segment).
À remplacer par la voix ElevenLabs définitive (même texte : ia/script_vo.txt)."""
import json, sys, numpy as np, wave
from piper import PiperVoice, SynthesisConfig
M = sys.argv[1]  # dossier du modèle
name = M.rstrip('/').split('/')[-1].replace('vits-piper-', '')
voice = PiperVoice.load(f"{M}/{name}.onnx", config_path=f"{M}/{name}.onnx.json")
SPEED = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
OUT = sys.argv[3] if len(sys.argv) > 3 else 'ia/vo_temoin'
SEGS = json.load(open(sys.argv[4] if len(sys.argv) > 4 else 'ia/script_segments.json', encoding='utf-8'))
SR = voice.config.sample_rate; out = []; timing = []; t = 0.0
for s in SEGS:
    cfg = SynthesisConfig(length_scale=1.0 / SPEED, noise_scale=0.6, noise_w_scale=0.7)
    x = np.concatenate([c.audio_float_array for c in voice.synthesize(s.get('say', s['text']), syn_config=cfg)]).astype(np.float32)
    nz = np.where(np.abs(x) > 0.01)[0]; x = x[max(0, nz[0] - 200): nz[-1] + 400] if len(nz) else x
    timing.append({'id': s['id'], 's': round(t, 3), 'e': round(t + len(x) / SR, 3), 'text': s['text']})
    out.append(x); t += len(x) / SR
    gap = s['pause']; out.append(np.zeros(int(gap * SR), dtype=np.float32)); t += gap
y = np.concatenate(out); y = y / np.abs(y).max() * 0.9
w = wave.open(OUT + '.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype('<i2').tobytes()); w.close()
json.dump(timing, open(OUT + '_timing.json', 'w'), ensure_ascii=False, indent=1)
print(f'durée {t:.2f}s')
for x in timing: print(f"{x['s']:6.2f}-{x['e']:6.2f} {x['id']}")
