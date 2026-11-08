// SCÈNE 7 — PARTAGE ET CONCLUSION : « Partage l’info à un ami dont la connexion finit trop vite »
SCENE_DEFS.push({
  k: 7, dur: 7, label: ['PARTAGE', 'à un ami'], next: false,
  build(c) {
    const R = c.root, s = c.start;
    c.rig = group(R, [540, 1150]);
    c.person = layer(c.rig, 7, 'person');
    const scr = c.scr = makeScreen(c.rig, 7), S = scr.div;
    // guide cards assemble
    patch(S, 0, 96, 300, 374, '#1a2228');
    c.cl = screenCrop(scr, 2, 134, 64, 342); c.cr = screenCrop(scr, 236, 126, 298, 336); c.cc = screenCrop(scr, 50, 98, 250, 372);
    c.cc.style.transformOrigin = '50% 60%';
    patch(S, 92, 374, 218, 397, '#12171b');
    c.dots = [110, 132, 154, 177, 199].map((x, i) => el('div', 'abs ring', S, { left: (x - 7.5) + 'px', top: '377px', width: '15px', height: '15px', background: i === 0 ? '#FFC800' : '#41474c' }));
    // share button press + ripple
    c.btn = screenCrop(scr, 20, 456, 284, 534);
    c.btn.style.transformOrigin = '50% 50%';
    const rp = el('div', 'abs', c.btn, { left: '0px', top: '0px', width: '264px', height: '78px', overflow: 'hidden', borderRadius: '39px' });
    c.ripple = el('div', 'abs ring', rp, { width: '40px', height: '40px', background: 'rgba(255,203,5,.55)' });
    c.occ = layer(c.rig, 7, 'occluder');

    // share tile rebuilt: the three connected points construct themselves
    c.tile = group(R, [777, 612]);
    const tile = el('div', 'abs', c.tile, {
      left: '698px', top: '533px', width: '158px', height: '158px', borderRadius: '38px', transform: 'rotate(-9deg)',
      background: 'linear-gradient(150deg, #FFE45E 0%, #FFC700 55%, #EAA500 100%)',
      boxShadow: '0 18px 30px rgba(120,70,0,.35), inset 0 -9px 14px rgba(0,0,0,.13), inset 0 7px 10px rgba(255,255,255,.55)',
    });
    const ts = svgLayer(tile, 158, 158);
    c.ln = [svgEl('path', { d: 'M50 84 L108 48', stroke: '#141414', 'stroke-width': 13, 'stroke-linecap': 'round' }, ts),
            svgEl('path', { d: 'M50 84 L106 118', stroke: '#141414', 'stroke-width': 13, 'stroke-linecap': 'round' }, ts)];
    c.ln.forEach(p => { p.style.strokeDasharray = 70; });
    c.pts = [[108, 48], [50, 84], [106, 118]].map(([x, y]) => { const d = svgEl('circle', { cx: x, cy: y, r: 18, fill: '#141414' }, ts); d.style.transformOrigin = `${x}px ${y}px`; d.style.transformBox = 'view-box'; return d; });

    // light trail along the curved arrow, light wave, particles
    const tr = svgLayer(R);
    c.trail = svgEl('path', { d: 'M648 788 Q 742 792 768 704', fill: 'none', stroke: '#fff', 'stroke-width': 9, 'stroke-linecap': 'round' }, tr);
    c.trail.style.strokeDasharray = '40 400'; c.trail.style.filter = 'drop-shadow(0 0 8px #fff)';
    c.wave = el('div', 'abs ring', R, { border: '6px solid #fff', boxShadow: '0 0 30px 8px rgba(255,255,255,.7)' });
    c.burst = [];
    for (let i = 0; i < 26; i++) {
      const a = -Math.PI / 2 + (rnd() - .5) * Math.PI * 1.7, v = 260 + rnd() * 420, sz = 8 + rnd() * 12;
      const d = el('div', 'abs', R, { width: sz + 'px', height: sz + 'px', borderRadius: i % 3 ? '50%' : '3px', background: i % 4 === 0 ? '#111' : i % 2 ? '#fff' : '#FFE14D', boxShadow: i % 2 ? '0 0 10px 3px rgba(255,255,255,.7)' : 'none' });
      c.burst.push({ d, a, v, sz, spin: (rnd() - .5) * 720 });
    }

    c.title = kineticText(R, [
      { t: 'Partage l’info à', x0: 231, x1: 854, top: 142 },
      { t: 'un ami dont la connexion', x0: 78, x1: 1013, top: 228 },
      { t: 'finit trop vite', x0: 269, x1: 819, top: 304 },
    ]);
    sfx('whoosh', s + .05, .6); sfx('impact', s + .45, .6); sfx('slide', s - .2, .5); sfx('pop', s + .1, .6);
    [.55, .63, .71, .79, .87].forEach(t => sfx('tick', s + t, .45)); sfx('pop', s + 1.55); sfx('draw', s + 1.95, .6);
    sfx('tap', s + 2.8); sfx('ripple', s + 2.85); sfx('sparkle', s + 2.9); sfx('impact', s + 4.55); sfx('chime', s + 4.65);
  },
  render(lt, c) {
    const r = spring(lt + .45, 1.5, 7);
    c.rigY = Math.sin(lt * 1.3) * 3 + (1 - r) * 60;
    T(c.rig, `translateY(${c.rigY}px) scale(${lerp(1.1, 1, r)}) rotate(${(1 - r) * 3}deg)`);
    // cards
    const sl = spring(lt + .25, 2.0, 7), cc = spring(lt - .05, 2.2, 6.5);
    T(c.cl, `translateX(${(1 - sl) * -80}px)`, clamp((lt + .25) * 6));
    T(c.cr, `translateX(${(1 - sl) * 80}px)`, clamp((lt + .25) * 6));
    T(c.cc, `scale(${lerp(.35, 1, cc)}) rotate(${(1 - clamp(cc)) * -12}deg)`, clamp((lt + .05) * 6));
    c.dots.forEach((d, i) => { d.style.transform = `scale(${Math.max(0, spring(lt - (.55 + .08 * i), 3, 7))})`; });
    // press
    const press = bump(lt, 2.75, 3.05);
    c.btn.style.transform = `scale(${1 - .07 * press})`;
    const rpp = prog(lt, 2.82, 3.45);
    T(c.ripple, `translate(${175 - 20}px, ${49 - 20}px) scale(${E.out3(rpp) * 9})`, rpp > 0 && rpp < 1 ? 1 - rpp : 0);
    // tile + share glyph construction
    const tp = spring(lt - 1.55, 2.3, 6.5);
    T(c.tile, `scale(${Math.max(0, tp) * (1 + .14 * bump(lt, 3.05, 3.45))}) translateY(${Math.sin(lt * 1.6) * 4}px)`, clamp((lt - 1.55) * 6));
    [1.8, 1.9, 2.0].forEach((t0, i) => { c.pts[i].style.transform = `scale(${Math.max(0, spring(lt - t0, 3, 7))})`; });
    c.ln.forEach((p, i) => { p.style.strokeDashoffset = 70 * (1 - E.inOut(prog(lt, 1.95 + .15 * i, 2.3 + .15 * i))); });
    // trail, wave, burst
    const tt = prog(lt, 2.9, 3.4);
    c.trail.style.strokeDashoffset = lerp(40, -320, tt); c.trail.style.opacity = tt > 0 && tt < 1 ? 1 : 0;
    const B = c.scr.map(152, 495); B[1] += c.rigY;
    const wv = prog(lt, 2.85, 3.7), WR = 40 + 760 * E.out3(wv);
    Object.assign(c.wave.style, { left: (B[0] - WR) + 'px', top: (B[1] - WR) + 'px', width: 2 * WR + 'px', height: 2 * WR + 'px', opacity: wv > 0 && wv < 1 ? (1 - wv) : 0 });
    c.burst.forEach(q => {
      const u = lt - 2.9, vis = u > 0 && u < 1.2;
      q.d.style.visibility = vis ? 'visible' : 'hidden';
      if (!vis) return;
      const x = B[0] + Math.cos(q.a) * q.v * u, y = B[1] + Math.sin(q.a) * q.v * u + 380 * u * u;
      T(q.d, `translate(${x}px, ${y}px) rotate(${q.spin * u}deg) scale(${1 - u / 1.2})`, 1 - E.in2(u / 1.2));
    });
    // final message
    animWords(c.title.words, lt, .42, .08, 'pop');
    c.title.words.forEach((w, i) => { w.inner.style.transform = `scale(${1 + .12 * bump(lt, 3.3 + i * .05, 3.6 + i * .05)})`; });
  },
});
