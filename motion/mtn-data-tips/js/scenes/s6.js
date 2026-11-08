// SCÈNE 6 — CONTRÔLE DE CONSOMMATION : « Surveille quelles applis épuisent ta connexion »
SCENE_DEFS.push({
  k: 6, dur: 6, label: ['ASTUCE 05', 'conso par appli'],
  entryPoint(c) { const p = c.scr.map(149, 207); return [p[0], p[1]]; },
  exitPoint(c) { const p = c.scr.map(149, 207); return [p[0], p[1] + c.rigY]; },
  build(c) {
    const R = c.root, s = c.start;
    c.db = layer(R, 6, 'database');
    c.db.el.style.transformOrigin = '50% 60%';
    c.rig = group(R, [520, 900]);
    c.person = layer(c.rig, 6, 'person');
    const scr = c.scr = makeScreen(c.rig, 6), S = scr.div;
    // donut gauge rebuilt: 12,8 Go / 20 Go
    patch(S, 46, 104, 252, 310, '#1b222d', '50%', 1.5);
    const ds = svgLayer(S, 300, 600);
    svgEl('circle', { cx: 149, cy: 207, r: 83, fill: 'none', stroke: '#5b606c', 'stroke-width': 19 }, ds);
    c.C = 2 * Math.PI * 83;
    c.arc = svgEl('circle', { cx: 149, cy: 207, r: 83, fill: 'none', stroke: '#FFD400', 'stroke-width': 19, 'stroke-linecap': 'round', transform: 'rotate(-90 149 207)' }, ds);
    c.arc.style.strokeDasharray = c.C;
    c.val = el('div', 'abs ui', S, { left: '50px', width: '200px', top: '168px', textAlign: 'center', fontWeight: 800, fontSize: '31px' });
    c.sub1 = el('div', 'abs ui', S, { left: '50px', width: '200px', top: '204px', textAlign: 'center', fontWeight: 500, fontSize: '14px', color: '#d5d8de' }); c.sub1.textContent = 'utilisés sur';
    c.sub2 = el('div', 'abs ui', S, { left: '50px', width: '200px', top: '222px', textAlign: 'center', fontWeight: 800, fontSize: '27px' }); c.sub2.textContent = '20 Go';
    // per-app bars grow
    c.rows = [[350, 80, 207, 222], [410, 82, 145, 202], [472, 84, 120, 204], [535, 88, 153, 210]].map(([y, x0, x1, end]) => {
      patch(S, x0 - 5, y - 9, end + 6, y + 9, '#222b36');
      el('div', 'abs', S, { left: x0 + 'px', top: (y - 5) + 'px', width: (end - x0) + 'px', height: '10px', borderRadius: '5px', background: '#3b424d' });
      const f = el('div', 'abs', S, { left: x0 + 'px', top: (y - 5) + 'px', height: '10px', borderRadius: '5px', background: '#FFD400' });
      return { f, len: x1 - x0 };
    });
    c.hl = el('div', 'abs', S, { left: '10px', top: '306px', width: '282px', height: '58px', borderRadius: '14px', border: '3px solid #FFD400', boxShadow: '0 0 16px 3px rgba(255,212,0,.7)', boxSizing: 'border-box' });
    c.occ = layer(c.rig, 6, 'occluder');

    // digital magnifier that inspects the hungriest apps
    c.lens = el('div', 'abs', R, { left: '0px', top: '0px', width: '1px', height: '1px' });
    const ls = svgLayer(c.lens, 1, 1);
    svgEl('rect', { x: 30, y: 26, width: 22, height: 62, rx: 11, fill: '#FFC400', stroke: '#C98F00', 'stroke-width': 3, transform: 'rotate(-45 30 26)' }, ls);
    svgEl('circle', { cx: 0, cy: 0, r: 46, fill: 'rgba(255,255,255,.16)', stroke: '#fff', 'stroke-width': 10 }, ls);
    svgEl('circle', { cx: 0, cy: 0, r: 52, fill: 'none', stroke: '#FFC400', 'stroke-width': 4 }, ls);
    svgEl('path', { d: 'M-26 -14 A30 30 0 0 1 -8 -30', fill: 'none', stroke: 'rgba(255,255,255,.9)', 'stroke-width': 6, 'stroke-linecap': 'round' }, ls);

    c.stL = alertStrokes(R, 316, 346, [-160, -128], 22, 46, 15);
    c.stR = alertStrokes(R, 588, 228, [-62, -30], 22, 46, 15);

    c.title = kineticText(R, [
      { t: 'Surveille', x0: 339, x1: 737, top: 922 },
      { t: 'quelles applis', x0: 220, x1: 845, top: 1001 },
      { t: 'épuisent ta connexion', x0: 87, x1: 992, top: 1084 },
    ]);
    sfx('whoosh', s + .05, .6); sfx('pop', s + .7); sfx('scan', s + .9);
    [2.0, 2.18, 2.36, 2.54].forEach(t => sfx('tick', s + t, .7)); sfx('scan', s + 2.6, .6); sfx('confirm', s + 3.6); sfx('whoosh', s + 5.5, .7);
  },
  render(lt, c) {
    const ex = E.in3(prog(lt, 5.2, 5.55));
    const r = spring(lt + .45, 1.5, 7);
    c.rigY = Math.sin(lt * 1.3) * 3;
    T(c.rig, `translate(${(1 - r) * 40}px, ${c.rigY}px) scale(${lerp(1.08, 1, r)}) rotate(${(1 - r) * 3}deg)`);
    const pd = E.out3(prog(lt, .9, 2.2));
    c.arc.style.strokeDashoffset = c.C * (1 - .64 * pd);
    c.val.textContent = (12.8 * pd).toFixed(1).replace('.', ',') + ' Go';
    c.val.style.opacity = clamp((lt - .85) * 5);
    c.sub1.style.opacity = c.sub2.style.opacity = prog(lt, 1.6, 2.0);
    c.rows.forEach((row, i) => { row.f.style.width = (row.len * E.out3(prog(lt, 2.0 + .18 * i, 2.7 + .18 * i))) + 'px'; });
    const h = prog(lt, 3.55, 3.85);
    c.hl.style.opacity = h * (.65 + .35 * Math.sin(lt * 9)) * (1 - prog(lt, 5.0, 5.3));
    // database icon
    const dp = spring(lt - .7, 2.2, 6.5);
    T(c.db.el, `scale(${Math.max(0, dp * (1 + .12 * bump(lt, 3.6, 4.0)) * (1 - ex))}) translateY(${Math.sin(lt * 1.6) * 5}px)`);
    // magnifier path: from the icon, over the list, settles on « Vidéos »
    const keys = [[2.5, [760, 420]], [2.95, c.scr.map(165, 470)], [3.3, c.scr.map(150, 410)], [3.75, c.scr.map(118, 338)], [4.9, c.scr.map(118, 338)], [5.35, [900, 260]]];
    let pos = keys[0][1];
    for (let i = 0; i < keys.length - 1; i++) {
      const [ta, pa] = keys[i], [tb, pb] = keys[i + 1];
      if (lt >= ta && lt <= tb) { const e = E.inOut(prog(lt, ta, tb)); pos = [lerp(pa[0], pb[0], e), lerp(pa[1], pb[1], e)]; }
      if (lt > tb) pos = pb;
    }
    const lv = prog(lt, 2.45, 2.7) * (1 - prog(lt, 5.15, 5.4));
    T(c.lens, `translate(${pos[0]}px, ${pos[1] + c.rigY}px) scale(${lerp(.4, 1, E.back(prog(lt, 2.45, 2.75))) * (1 + .08 * bump(lt, 3.75, 4.1))})`, lv);
    renderStrokes(c.stL, prog(lt, .8, 1.15) * (1 - ex), bump(lt, 3.6, 4.1));
    renderStrokes(c.stR, prog(lt, .9, 1.25) * (1 - ex), bump(lt, 3.65, 4.15));
    // title by groups of words
    const L = c.title.lines;
    animWords(L[0].words, lt, .5, .08, 'rise', 5.3, 'down');
    animWords(L[1].words, lt, .8, .08, 'rise', 5.33, 'down');
    animWords(L[2].words, lt, 1.1, .08, 'rise', 5.36, 'down');
  },
});
