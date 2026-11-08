// SCÈNE 4 — QUALITÉ VIDÉO : « Baisse la qualité des vidéos »
SCENE_DEFS.push({
  k: 4, dur: 6, label: ['ASTUCE 03', 'qualité vidéo'],
  growRect(c) {     // 480p highlight bar, in scene px (start rect of the "grow" transition)
    const pts = [[22, 446], [288, 446], [288, 516], [22, 516]].map(p => c.scr.map(...p));
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    return [Math.min(...xs), Math.min(...ys) + c.rigY, Math.max(...xs), Math.max(...ys) + c.rigY];
  },
  build(c) {
    const R = c.root, s = c.start;
    c.rig = group(R, [520, 960]);
    c.person = layer(c.rig, 4, 'person');
    const scr = c.scr = makeScreen(c.rig, 4);
    const S = scr.div;
    // video: the original frame keeps playing (slow push-in) after a rebuilt play button
    const vid = el('div', 'abs', S, { left: '3px', top: '50px', width: '286px', height: '236px', overflow: 'hidden' });
    c.vin = el('div', 'abs', vid, { left: '0px', top: '0px', width: '286px', height: '236px', transformOrigin: '60% 55%' });
    screenCrop(scr, 3, 50, 289, 286, c.vin).style.left = '0px';
    c.vin.firstChild.style.top = '0px';
    const clone = screenCrop(scr, 86, 170, 128, 214, c.vin);             // clone-stamp hides the baked play icon
    Object.assign(clone.style, { left: (130 - 3) + 'px', top: (170 - 50) + 'px', webkitMaskImage: 'radial-gradient(circle, #000 52%, transparent 72%)' });
    const vs = svgLayer(S, 300, 600);
    c.play = svgEl('path', { d: 'M138 172 L170 192 L138 212 Z', fill: '#fff', stroke: '#fff', 'stroke-width': 6, 'stroke-linejoin': 'round' }, vs);
    c.play.style.transformOrigin = '152px 192px'; c.play.style.transformBox = 'view-box';
    // progress bar
    patch(S, 6, 278, 292, 293, '#0f100c');
    el('div', 'abs', S, { left: '12px', top: '283px', width: '270px', height: '4px', borderRadius: '2px', background: '#d9d9d9' });
    c.prog = el('div', 'abs', S, { left: '12px', top: '283px', height: '4px', borderRadius: '2px', background: '#E62117' });
    c.knob = el('div', 'abs', S, { top: '279px', width: '12px', height: '12px', borderRadius: '50%', background: '#fff' });
    // quality menu, rebuilt
    patch(S, 13, 294, 289, 545, '#2f2e2c', 12);
    c.menu = el('div', 'abs', S, { left: '0px', top: '0px', width: '300px', height: '600px', transformOrigin: '150px 545px' });
    el('div', 'abs', c.menu, { left: '15px', top: '297px', width: '272px', height: '246px', borderRadius: '12px', background: '#30302d' });
    c.hl = el('div', 'abs', c.menu, { left: '22px', width: '266px', borderRadius: '12px', background: '#FFC20E' });
    const ms = svgLayer(c.menu, 300, 600);
    c.gear = svgEl('g', {}, ms);
    for (let i = 0; i < 8; i++) svgEl('rect', { x: 61, y: 320, width: 8, height: 10, rx: 2, fill: '#fff', transform: `rotate(${i * 45} 65 337)` }, c.gear);
    svgEl('circle', { cx: 65, cy: 337, r: 11, fill: '#fff' }, c.gear); svgEl('circle', { cx: 65, cy: 337, r: 4.5, fill: '#30302d' }, c.gear);
    c.gear.style.transformOrigin = '65px 337px'; c.gear.style.transformBox = 'view-box';
    const txt = (t, x, y, fs, w = 600) => { const d = el('div', 'abs ui', c.menu, { left: x + 'px', top: y + 'px', fontSize: fs + 'px', fontWeight: w }); d.textContent = t; return d; };
    txt('Qualité vidéo', 100, 326, 16.5, 700);
    el('div', 'abs', c.menu, { left: '100px', top: '356px', width: '126px', height: '2px', background: '#4a4a46' });
    c.rows = [
      [txt('HD (1080p)', 42, 371, 17)],
      [txt('SD (720p)', 42, 416, 17)],
      [txt('Économie de données', 42, 458, 16), txt('(480p)', 42, 480, 16)],
    ];
    c.radios = [[260, 381], [260, 425], [263, 478]].map(([x, y]) => el('div', 'abs ring', c.menu, { left: (x - 11) + 'px', top: (y - 11) + 'px', width: '22px', height: '22px', border: '2.5px solid #e5e5e5' }));
    c.dot = el('div', 'abs ring', c.menu, { left: '257px', top: '472px', width: '12px', height: '12px', background: '#111' });
    c.pulse = el('div', 'abs ring', c.menu, { left: '243px', top: '458px', width: '40px', height: '40px', border: '3px solid #FFC20E', boxShadow: '0 0 14px 4px rgba(255,194,14,.8)' });
    c.occ = layer(c.rig, 4, 'occluder');

    // clapper icon + alert strokes
    c.clap = layer(R, 4, 'clapper');
    c.clap.el.style.transformOrigin = '50% 60%';
    c.stA = alertStrokes(R, 702, 176, [-150, -118], 30, 56, 16);
    c.stB = alertStrokes(R, 792, 386, [152, 120], 24, 50, 15);

    c.title = kineticText(R, [
      { t: 'Baisse la qualité', x0: 168, x1: 913, top: 965 },
      { t: 'des vidéos', x0: 300, x1: 779, top: 1046 },
    ]);
    sfx('whoosh', s + .05, .6); sfx('pop', s + .75); sfx('play', s + 1.0); sfx('whoosh', s + 1.15, .35);
    [1.55, 2.15, 2.7].forEach(t => sfx('tick', s + t)); sfx('select', s + 2.9); sfx('confirm', s + 3.05); sfx('whoosh', s + 5.6, .8);
  },
  render(lt, c) {
    // hands + phone rise in with a spring
    const r = spring(lt + .45, 1.5, 7);
    c.rigY = (1 - r) * 70 + Math.sin(lt * 1.4) * 3;
    T(c.rig, `translateY(${c.rigY}px) scale(${lerp(1.08, 1, r)}) rotate(${(1 - r) * -4}deg)`);
    // video starts briefly
    const pv = prog(lt, 1.0, 5.6);
    c.vin.style.transform = `scale(${1 + .07 * E.sine(pv)}) translateX(${-6 * pv}px)`;
    const pl = prog(lt, .95, 1.2);
    c.play.style.transform = `scale(${1 - .6 * E.in2(pl) + .25 * bump(lt, .8, 1.0)})`; c.play.style.opacity = 1 - pl;
    const w = 98 + 80 * pv;
    c.prog.style.width = w + 'px'; c.knob.style.left = (12 + w - 6) + 'px';
    // quality menu opens like an interface sheet
    const mo = spring(lt - 1.12, 2.4, 8);
    c.menu.style.transform = `translateY(${(1 - clamp(mo)) * 60}px) scaleY(${lerp(.55, 1, clamp(mo, 0, 1.1))})`;
    c.menu.style.opacity = clamp((lt - 1.12) * 6);
    c.gear.style.transform = `rotate(${E.out3(prog(lt, 1.2, 2.0)) * 180}deg)`;
    // highlight steps 1080p -> 720p -> 480p
    const st = [[362, 40], [406, 40], [446, 70]];
    const a = E.inOut(prog(lt, 2.1, 2.32)), b = E.inOut(prog(lt, 2.65, 2.9));
    const top = lerp(lerp(st[0][0], st[1][0], a), st[2][0], b), h = lerp(lerp(40, 40, a), 70, b);
    const hin = E.back(prog(lt, 1.5, 1.75));
    Object.assign(c.hl.style, { top: top + 'px', height: h + 'px', transform: `scaleX(${hin})`, opacity: lt > 1.5 ? 1 : 0 });
    const centers = [381, 425, 478];
    c.rows.forEach((row, i) => { const on = lt > 1.55 && Math.abs(top + h / 2 - centers[i]) < h / 2; row.forEach(d => { d.style.color = on ? '#151515' : '#fff'; }); });
    c.radios.forEach((rd, i) => { const on = lt > 1.55 && Math.abs(top + h / 2 - centers[i]) < h / 2; rd.style.borderColor = on ? '#151515' : '#e5e5e5'; });
    c.dot.style.transform = `scale(${Math.max(0, spring(lt - 2.92, 3, 7))})`;
    const pp = prog(lt, 3.0, 3.7);
    c.pulse.style.transform = `scale(${.6 + 1.4 * E.out3(pp)})`; c.pulse.style.opacity = pp > 0 && pp < 1 ? 1 - pp : 0;
    // clapper pops, rebounds on confirmation
    const cp = spring(lt - .75, 2.2, 6.5);
    const ex = E.in3(prog(lt, 5.2, 5.55));
    T(c.clap.el, `scale(${Math.max(0, cp * (1 + .16 * bump(lt, 3.0, 3.45)) * (1 - ex))}) rotate(${(1 - clamp(cp)) * -25 + Math.sin(lt * 1.8) * 2}deg) translateY(${Math.sin(lt * 1.5) * 4}px)`);
    renderStrokes(c.stA, prog(lt, .9, 1.25) * (1 - ex), bump(lt, 3.0, 3.6));
    renderStrokes(c.stB, prog(lt, 1.0, 1.35) * (1 - ex), bump(lt, 3.05, 3.65));
    animWords(c.title.words, lt, .55, .1, 'rise', 5.3, 'down');
  },
});
