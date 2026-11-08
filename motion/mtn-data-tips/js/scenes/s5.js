// SCÈNE 5 — SAUVEGARDES AUTOMATIQUES : « Surveille les sauvegardes auto »
// Message: keep backups, but control them (Wi-Fi only) — never "turn everything off".
SCENE_DEFS.push({
  k: 5, dur: 6, label: ['ASTUCE 04', 'sauvegardes'],
  build(c) {
    const R = c.root, s = c.start;
    // 3D cloud assembled from its pieces
    c.cloud = layer(R, 5, 'cloud'); c.folder = layer(R, 5, 'folder'); c.shield = layer(R, 5, 'shield');
    c.shield.el.style.transformOrigin = '50% 50%';
    const ARC = [782, 425], AR = 66, cl = c.cloud;
    c.spin = el('div', 'abs', R, {
      left: (ARC[0] - AR) + 'px', top: (ARC[1] - AR) + 'px', width: 2 * AR + 'px', height: 2 * AR + 'px', borderRadius: '50%',
      backgroundImage: `url(assets/scenes/s5/cloud.png)`, backgroundSize: `${cl.w}px ${cl.h}px`,
      backgroundPosition: `${-(ARC[0] - AR - cl.x)}px ${-(ARC[1] - AR - cl.y)}px`, backgroundRepeat: 'no-repeat',
      webkitMaskImage: 'radial-gradient(circle, #000 62%, transparent 72%)',
    });
    // Wi-Fi control badge
    c.badge = group(R, [664, 350]);
    const bd = el('div', 'abs ring', c.badge, { left: '626px', top: '312px', width: '76px', height: '76px', background: '#111', border: '5px solid #fff', boxShadow: '0 10px 18px rgba(0,0,0,.3)' });
    const bs = svgLayer(bd, 66, 66);
    [[22, 1], [15, .95], [8, .9]].forEach(([r]) => svgEl('path', { d: `M${33 - r} ${40 - r * .55} A${r * 1.25} ${r * 1.25} 0 0 1 ${33 + r} ${40 - r * .55}`, fill: 'none', stroke: '#FFCB05', 'stroke-width': 5, 'stroke-linecap': 'round' }, bs));
    svgEl('circle', { cx: 33, cy: 45, r: 4.5, fill: '#FFCB05' }, bs);

    // data particles (pictograms) flying from the phone up to the cloud
    c.parts = [];
    const kinds = ['photo', 'video', 'doc', 'dot', 'photo', 'dot', 'video', 'doc', 'dot', 'photo', 'video', 'dot', 'doc'];
    const launches = [];
    for (let i = 0; i < 13; i++) launches.push([1.0 + i * .14, .85]);       // busy stream
    [3.15, 3.85, 4.55].forEach(t => launches.push([t, 1.6]));               // calm, Wi-Fi only
    launches.forEach(([t0, d], i) => {
      const kind = kinds[i % kinds.length];
      const p = el('div', 'abs', R);
      if (kind === 'dot') Object.assign(p.style, { width: '12px', height: '12px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 10px 3px rgba(255,255,255,.8)' });
      else {
        Object.assign(p.style, { width: '30px', height: '30px', borderRadius: '8px', background: { photo: '#2F80ED', video: '#E53935', doc: '#1E88E5' }[kind], border: '3px solid #fff', boxShadow: '0 4px 8px rgba(0,0,0,.25)' });
        const g = svgLayer(p, 24, 24);
        if (kind === 'video') svgEl('path', { d: 'M9 6 L18 12 L9 18 Z', fill: '#fff' }, g);
        if (kind === 'photo') { svgEl('path', { d: 'M3 19 L9 11 L13 16 L16 13 L21 19 Z', fill: '#fff' }, g); svgEl('circle', { cx: 16, cy: 7, r: 2.5, fill: '#FFD84A' }, g); }
        if (kind === 'doc') svgEl('path', { d: 'M7 7 H17 M7 12 H17 M7 17 H13', stroke: '#fff', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
      }
      c.parts.push({ p, t0, d, ox: (i * 37 % 60) - 30, size: kind === 'dot' ? 6 : 15 });
    });

    // hands + phone with a live screen
    c.rig = group(R, [520, 1100]);
    c.person = layer(c.rig, 5, 'person');
    const scr = c.scr = makeScreen(c.rig, 5), S = scr.div;
    patch(S, 110, 96, 174, 160, '#262f3e', '50%');
    const ss = svgLayer(S, 300, 600);
    c.scrSync = syncArrows(ss, 142, 128, 20, '#fff', 5.5);
    // checks pop in one by one
    c.checks = [[237, 364], [240, 414], [243, 464], [245, 516]].map(([x, y]) => {
      patch(S, x - 17, y - 17, x + 17, y + 17, '#e3e3e9', '50%');
      const d = el('div', 'abs ring', S, { left: (x - 13) + 'px', top: (y - 13) + 'px', width: '26px', height: '26px', background: '#2E9D3A' });
      const g = svgLayer(d, 26, 26); svgEl('path', { d: 'M7 13.5 L11.5 18 L19 9', fill: 'none', stroke: '#fff', 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      return d;
    });
    // toggle label: "Activée" -> "Wi-Fi uniquement" (backups stay on, but controlled)
    patch(S, 36, 264, 186, 310, 'linear-gradient(180deg,#2c9c0c,#1f9002)', 12);
    const lab = el('div', 'abs', S, { left: '36px', top: '262px', width: '170px', height: '50px', overflow: 'hidden' });
    c.labA = el('div', 'abs ui', lab, { left: '14px', top: '8px', fontWeight: 800, fontSize: '27px' }); c.labA.textContent = 'Activée';
    c.labB = el('div', 'abs ui', lab, { left: '8px', top: '14px', fontWeight: 800, fontSize: '17.5px' }); c.labB.textContent = 'Wi-Fi uniquement';
    c.tapRing = el('div', 'abs ring', S, { left: '207px', top: '261px', width: '52px', height: '52px', border: '4px solid #fff' });
    c.occ = layer(c.rig, 5, 'occluder');

    c.stL = alertStrokes(R, 300, 492, [-160, -128], 22, 46, 15);
    c.stR = alertStrokes(R, 598, 398, [-60, -28], 22, 46, 15);

    c.title = kineticText(R, [
      { t: 'Surveille les', x0: 242, x1: 792, top: 95 },
      { t: 'sauvegardes auto', x0: 127, x1: 951, top: 186 },
    ]);
    c.ul = el('div', 'abs', R, { left: '300px', top: '288px', width: '500px', height: '10px', borderRadius: '5px', background: '#0B0B0B', transformOrigin: '0 50%' });
    sfx('whoosh', s + .05, .5); sfx('pop', s + .35, .5); sfx('whoosh', s + .65, .5); sfx('pop', s + .85, .5); sfx('pop', s + 1.15);
    [1.0, 1.15, 1.3, 1.45].forEach(t => sfx('tick', s + t, .6)); sfx('stream', s + 1.0); sfx('tap', s + 2.55); sfx('confirm', s + 2.85); sfx('pop', s + 3.0, .7);
    sfx('whoosh', s + 5.55);
  },
  entryPoint(c) { return [0, 0]; },
  render(lt, c) {
    const ex = E.in3(prog(lt, 5.2, 5.55));
    // cloud assembly
    const a = spring(lt - .62, 1.8, 7), b = spring(lt - .8, 1.8, 7), sh = spring(lt - 1.15, 2.6, 6.5);
    const fl = Math.sin(lt * 1.6) * 5;
    T(c.cloud.el, `translateY(${(1 - a) * -150 + fl}px) scale(${1 - ex})`, clamp((lt - .62) * 6) * (1 - ex));
    T(c.folder.el, `translateY(${(1 - b) * 150 + fl}px) rotate(${Math.sin(lt * 2.1) * 1.5}deg) scale(${1 - ex})`, clamp((lt - .8) * 6) * (1 - ex));
    T(c.shield.el, `translateY(${fl}px) scale(${Math.max(0, sh) * (1 + .12 * bump(lt, 2.95, 3.35)) * (1 - ex)})`);
    const fast = 330, slow = 110, sw = 2.85, sd = .6;
    const ang = lt < sw ? fast * lt : lt < sw + sd ? fast * sw + fast * (lt - sw) - (fast - slow) / (2 * sd) * (lt - sw) ** 2 : fast * sw + (fast + slow) / 2 * sd + slow * (lt - sw - sd);
    T(c.spin, `translateY(${(1 - a) * -150 + fl}px) rotate(${ang}deg) scale(${1 - ex})`, clamp((lt - .62) * 6) * (1 - ex));
    c.scrSync.style.transform = `rotate(${ang}deg)`;
    T(c.badge, `translateY(${fl}px) scale(${Math.max(0, spring(lt - 3.0, 2.4, 6.5)) * (1 - ex)})`);

    // rig
    const r = spring(lt - .02, 1.5, 6.5);
    T(c.rig, `translateY(${(1 - r) * 560 + Math.sin(lt * 1.3) * 3}px)`);
    c.checks.forEach((d, i) => { d.style.transform = `scale(${Math.max(0, spring(lt - (1.0 + .15 * i), 2.8, 7))})`; });
    const lb = E.inOut(prog(lt, 2.7, 3.0));
    c.labA.style.transform = `translateY(${-50 * lb}px)`; c.labB.style.transform = `translateY(${50 * (1 - lb)}px)`;
    const tp = prog(lt, 2.55, 3.0);
    c.tapRing.style.transform = `scale(${.8 + .9 * E.out3(tp)})`; c.tapRing.style.opacity = tp > 0 && tp < 1 ? 1 - tp : 0;

    // particles along a quadratic arc phone -> cloud
    c.parts.forEach(q => {
      const u = prog(lt, q.t0, q.t0 + q.d);
      const vis = u > 0 && u < 1 && lt < 5.3;
      q.p.style.visibility = vis ? 'visible' : 'hidden';
      if (!vis) return;
      const e = E.inOut(u);
      const P0 = [560 + q.ox * .3, 420], P1 = [650 + q.ox, 230], P2 = [770, 440 + fl];
      const x = (1 - e) ** 2 * P0[0] + 2 * (1 - e) * e * P1[0] + e * e * P2[0];
      const y = (1 - e) ** 2 * P0[1] + 2 * (1 - e) * e * P1[1] + e * e * P2[1];
      T(q.p, `translate(${x - q.size}px, ${y - q.size}px) scale(${lerp(.6, 1.1, Math.sin(Math.PI * u))}) rotate(${u * 40 - 20}deg)`, Math.min(1, u * 6, (1 - u) * 5));
    });
    renderStrokes(c.stL, prog(lt, .85, 1.2) * (1 - ex), bump(lt, 2.9, 3.4));
    renderStrokes(c.stR, prog(lt, .95, 1.3) * (1 - ex), bump(lt, 2.95, 3.45));

    animWords(c.title.words, lt, .35, .1, 'pop', 5.3, 'up');
    c.ul.style.transform = `scaleX(${E.out3(prog(lt, 1.15, 1.6)) * (1 - E.in3(prog(lt, 5.15, 5.4)))})`;
  },
});
