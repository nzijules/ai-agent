// ============================================================================
// MTN Vibe Motion — timeline, background, header, element-driven transitions
// ============================================================================
window.__boot = function () {
  const FPS = 30, TW = 0.45;                         // transition half-width (s)
  const DEFS = window.SCENE_DEFS;
  const stage = document.getElementById('stage');
  const scenesRoot = document.getElementById('scenes');
  const params = new URLSearchParams(location.search);
  const SOLO = params.get('scene') ? +params.get('scene') : 0;

  // ---- timeline ---------------------------------------------------------------
  let acc = 0;
  DEFS.forEach(d => { d.start = acc; d.end = acc + d.dur; acc += d.dur; });
  const TOTAL = acc;                                  // 43 s
  // transition i joins scene i and i+1 at DEFS[i].end
  const TRANS = [
    { type: 'line' },                                  // light line sweeps and reveals scene 2
    { type: 'iris', at: 'out' },                       // OFF toggle opens onto scene 3
    { type: 'iris', at: 'out' },                       // stopped sync icon opens onto scene 4
    { type: 'grow' },                                  // 480p highlight bar grows into the next frame
    { type: 'iris', at: 'in' },                        // data swarm collapses into the donut of scene 6
    { type: 'ring', at: 'out' },                       // donut ring expands and reveals scene 7
  ];

  // ---- background ---------------------------------------------------------------
  const bg = document.getElementById('bg');
  const bgSvg = svgLayer(bg, 1080, 1920);
  const curves = [
    'M -80 520 C 240 430, 520 470, 1160 250',
    'M -60 1180 C 300 1080, 700 1220, 1150 980',
    'M -100 1640 C 260 1560, 640 1700, 1180 1480',
    'M 820 -40 C 900 300, 760 620, 1180 900',
    'M -40 860 C 200 800, 360 900, 620 820',
  ];
  const lines = curves.map((d, i) => {
    const glow = svgEl('path', { d, fill: 'none', stroke: 'rgba(255,255,255,.35)', 'stroke-width': 9, 'stroke-linecap': 'round' }, bgSvg);
    const core = svgEl('path', { d, fill: 'none', stroke: 'rgba(255,255,255,.9)', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, bgSvg);
    const len = core.getTotalLength();
    [glow, core].forEach(p => { p.style.strokeDasharray = len; });
    const pts = []; for (let s = 0; s <= 100; s++) { const q = core.getPointAtLength(len * s / 100); pts.push([q.x, q.y]); }
    const spark = el('div', 'abs spark', bg);
    return { glow, core, len, pts, spark, sp: .06 + .03 * (i % 3), off: i * .23 };
  });
  const bars = [];
  [[40, 1500], [935, 1470]].forEach(([x0, y0], side) => {
    for (let i = 0; i < 6; i++) {
      const h = 60 + ((i * 37 + side * 50) % 140);
      bars.push(el('div', 'abs bgbar', bg, { left: (x0 + i * 18) + 'px', top: (y0 + 260 - h) + 'px', height: h + 'px' }));
    }
  });
  const glowSweep = el('div', 'abs glowsweep', bg);

  // ---- header / footer ------------------------------------------------------------
  const logo = document.getElementById('logo');
  const chip = document.getElementById('chip'), chipText = document.getElementById('chipText'), chipSub = document.getElementById('chipSub');
  const tracker = document.getElementById('tracker'), fill = document.getElementById('trackFill');
  const steps = [];
  for (let i = 0; i < 5; i++) { const s = el('div', 'abs step', tracker); s.style.left = (i * 180) + 'px'; s.textContent = i + 1; steps.push(s); }
  const tag = document.getElementById('tag');

  // ---- scenes -----------------------------------------------------------------------
  DEFS.forEach((d, i) => {
    const root = el('div', 'abs scene', scenesRoot, { left: '0px', top: Y0 + 'px', width: '1080px', height: window.MANIFEST[d.k].size[1] + 'px' });
    d.ctx = { root, start: d.start, def: d };
    d.build(d.ctx);
  });

  // transition overlays
  const ringEl = el('div', 'abs transring', stage);
  const lightBar = el('div', 'abs lightbar', stage);
  const growEl = el('div', 'abs growrect', stage);
  stage.appendChild(document.getElementById('top'));   // header above everything

  function sceneToStage(p) { return [p[0], p[1] + Y0]; }

  function applyTransition(i, t) {
    const a = DEFS[i], b = DEFS[i + 1], c = a.end, tr = TRANS[i];
    const p = prog(t, c - TW, c + TW);
    if (p <= 0 || p >= 1) return;
    const ra = a.ctx.root, rb = b.ctx.root;
    if (tr.type === 'line') {
      const q = E.inOut(p);
      const X = lerp(-500, 1580, q), tan = Math.tan(18 * Math.PI / 180), cy = 700;
      const H = 1500, xt = X + (-200 - cy) * tan, xb = X + (H + 200 - cy) * tan;
      rb.style.clipPath = `polygon(-3000px -200px, ${xt}px -200px, ${xb}px ${H + 200}px, -3000px ${H + 200}px)`;
      ra.style.clipPath = `polygon(${xt}px -200px, 4000px -200px, 4000px ${H + 200}px, ${xb}px ${H + 200}px)`;
      show(lightBar, true);
      lightBar.style.transform = `translate(${X - 60 + (Y0 + cy - 960) * 0}px, 0px) rotate(18deg)`;
      lightBar.style.left = '0px';
      lightBar.style.opacity = Math.sin(Math.PI * p);
    } else if (tr.type === 'iris' || tr.type === 'ring') {
      const P = tr.at === 'out' ? a.exitPoint(a.ctx) : b.entryPoint(b.ctx);
      const q = tr.type === 'ring' ? E.in2(p) : E.inOut(p);
      const R = lerp(0, 2300, q);
      rb.style.clipPath = `circle(${R}px at ${P[0]}px ${P[1]}px)`;
      const m = `radial-gradient(circle at ${P[0]}px ${P[1]}px, transparent ${R}px, #000 ${R + 1.5}px)`;
      ra.style.webkitMaskImage = m; ra.style.maskImage = m;
      const S = sceneToStage(P);
      const bw = tr.type === 'ring' ? lerp(60, 8, q) : 10;
      show(ringEl, true);
      Object.assign(ringEl.style, {
        left: (S[0] - R - bw) + 'px', top: (S[1] - R - bw) + 'px', width: (2 * R) + 'px', height: (2 * R) + 'px',
        borderWidth: bw + 'px', borderColor: tr.type === 'ring' ? '#0B0B0B' : '#FFFFFF',
        boxShadow: tr.type === 'ring' ? 'none' : '0 0 40px 12px rgba(255,255,255,.8)',
        opacity: tr.type === 'ring' ? 1 : Math.sin(Math.PI * Math.min(1, p * 1.2)),
      });
    } else if (tr.type === 'grow') {
      const r0 = a.growRect(a.ctx);                   // [x0,y0,x1,y1] scene px
      const g = E.inOut(prog(t, c - TW, c));
      const f = prog(t, c, c + TW);
      show(growEl, true);
      const x0 = lerp(r0[0], -40, g), y0 = lerp(r0[1] + Y0, -40, g), x1 = lerp(r0[2], 1120, g), y1 = lerp(r0[3] + Y0, 1960, g);
      Object.assign(growEl.style, { left: x0 + 'px', top: y0 + 'px', width: (x1 - x0) + 'px', height: (y1 - y0) + 'px', borderRadius: lerp(14, 0, g) + 'px', opacity: 1 - E.in2(f) });
      if (t >= c) ra.style.display = 'none'; else rb.style.display = 'none';
    }
  }

  // ---- render --------------------------------------------------------------------------
  const DUR = SOLO ? DEFS[SOLO - 1].dur + 2 * TW : TOTAL;
  const T0 = SOLO ? DEFS[SOLO - 1].start - TW : 0;

  window.render = function (tt) {
    const t = clamp(tt + T0, 0, TOTAL - 1e-3);
    const beat = (t % .5) / .5, kick = Math.pow(1 - beat, 4);

    // background
    lines.forEach((L, i) => {
      const dp = E.out3(prog(t, .05 + i * .12, 1.2 + i * .12));
      L.core.style.strokeDashoffset = L.len * (1 - dp); L.glow.style.strokeDashoffset = L.len * (1 - dp);
      const u = ((t * L.sp + L.off) % 1), idx = Math.floor(u * 100);
      const pt = L.pts[idx];
      L.spark.style.transform = `translate(${pt[0] - 7}px, ${pt[1] - 7}px) scale(${.6 + .5 * Math.sin(t * 5 + i)})`;
      L.spark.style.opacity = dp >= 1 ? .9 : 0;
    });
    bars.forEach((b, i) => { b.style.transform = `scaleY(${.75 + .25 * Math.sin(t * 1.3 + i * .9)})`; });
    const gs = prog(t, TOTAL - 2.6, TOTAL - .9);
    glowSweep.style.transform = `translateX(${lerp(-900, 1400, E.inOut(gs))}px) rotate(20deg)`;
    glowSweep.style.opacity = gs > 0 && gs < 1 ? 1 : 0;

    // logo (stable, top right) — gentle settle in, tiny beat pulse, end bounce
    const lp = prog(t, .1, .9);
    const endB = bump(t, TOTAL - 2.2, TOTAL - 1.5);
    logo.style.transform = `translateY(${lerp(-220, 0, E.back(lp, 1.8))}px) scale(${1 + .015 * kick * (t > 1 ? 1 : 0) + .12 * endB})`;
    logo.style.opacity = clamp(lp * 3);

    // scenes
    let active = 0;
    DEFS.forEach((d, i) => {
      const on = (!SOLO || SOLO === i + 1 || false) && t >= d.start - TW && t <= d.end + TW;
      const r = d.ctx.root;
      r.style.clipPath = ''; r.style.webkitMaskImage = ''; r.style.maskImage = '';
      r.style.display = on ? '' : 'none';
      if (on) d.render(t - d.start, d.ctx);
      if (t >= d.start - .25) active = i;
    });
    show(ringEl, false); show(lightBar, false); show(growEl, false);
    for (let i = 0; i < DEFS.length - 1; i++) if (!SOLO || SOLO === i + 1 || SOLO === i + 2) applyTransition(i, t);

    // header chip
    const d = DEFS[active];
    chipText.textContent = d.label[0]; chipSub.textContent = d.label[1];
    const ci = prog(t, d.start - .2, d.start + .25), co = d.next === false ? 0 : prog(t, d.end - .45, d.end - .2);
    const chipIn = E.back(prog(t, .7, 1.15));
    chip.style.transform = `scale(${chipIn})`; chip.style.opacity = t < .7 ? 0 : 1;
    chipText.style.transform = `translateY(${lerp(70, 0, E.back(ci)) - 70 * E.in3(active < DEFS.length - 1 ? co : 0)}px)`;
    chipSub.style.opacity = ci * (1 - (active < DEFS.length - 1 ? co : 0));
    chipSub.style.transform = `translateX(${lerp(-24, 0, E.out3(ci))}px)`;

    // tracker (tips = scenes 2..6)
    const trOn = prog(t, DEFS[1].start - .3, DEFS[1].start + .3), trOff = prog(t, DEFS[6].start + 3.6, DEFS[6].start + 4.1);
    tracker.style.transform = `translateY(${lerp(260, 0, E.back(trOn)) + 300 * E.in3(trOff)}px)`;
    steps.forEach((s, j) => {
      const sd = DEFS[j + 1];
      const on = prog(t, sd.start + .05, sd.start + .4);
      const act = t >= sd.start && t < sd.end;
      s.classList.toggle('on', on > .5);
      s.textContent = on > .5 && !act ? '✓' : j + 1;
      s.style.transform = `scale(${(1 + .35 * bump(t, sd.start + .05, sd.start + .45)) * (act ? 1 + .06 * kick : 1)})`;
    });
    fill.style.width = (720 * E.inOut(prog(t, DEFS[1].start, DEFS[5].start + .4))) + 'px';

    // end tag
    const tg = prog(t, DEFS[6].start + 4.1, DEFS[6].start + 4.7);
    tag.style.transform = `translateY(${lerp(140, 0, E.back(tg))}px) scale(${1 + .03 * kick * (tg >= 1 ? 1 : 0)})`;
    tag.style.opacity = clamp(tg * 2);
  };

  window.DURATION = DUR; window.FPS = FPS; window.TOTAL = TOTAL;
  window.SCENE_TIMES = DEFS.map(d => ({ k: d.k, start: d.start, end: d.end }));

  const fit = () => { const s = Math.min(innerWidth / 1080, innerHeight / 1920); stage.style.transform = `scale(${s})`; };
  if (!window.__CAPTURE__) {
    fit(); addEventListener('resize', fit);
    const t0 = performance.now();
    const loop = () => { window.render(((performance.now() - t0) / 1000) % DUR); requestAnimationFrame(loop); };
    loop();
  } else window.render(0);
  window.__ready = true;
};
