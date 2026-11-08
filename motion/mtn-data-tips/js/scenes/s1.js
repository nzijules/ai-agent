// SCÈNE 1 — LE PROBLÈME : « Ta connexion finit trop vite ? »
function group(root, origin) { const g = el('div', 'group', root); if (origin) g.style.transformOrigin = `${origin[0]}px ${origin[1]}px`; return g; }

SCENE_DEFS.push({
  k: 1, dur: 6, label: ['TA DATA', 'finit trop vite ?'],
  build(c) {
    const R = c.root, s = c.start;
    c.person = layer(R, 1, 'person');
    c.person.el.style.transformOrigin = '540px 1150px';
    c.phone = layer(R, 1, 'phone');
    c.phone.el.style.transformOrigin = `${285 - c.phone.x}px ${770 - c.phone.y}px`;
    // vibration arcs
    const vs = svgLayer(R); c.vib = vs;
    const arc = (cx, cy, r, a0, a1) => { const p = a => [cx + r * Math.cos(a), cy + r * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`; };
    c.vibArcs = [];
    [[118, 0], [146, 1]].forEach(([r, i]) => {
      c.vibArcs.push(svgEl('path', { d: arc(282, 772, r, Math.PI * .78, Math.PI * 1.12), fill: 'none', stroke: '#111', 'stroke-width': 7, 'stroke-linecap': 'round' }, vs));
      c.vibArcs.push(svgEl('path', { d: arc(282, 772, r, -Math.PI * .2, Math.PI * .12), fill: 'none', stroke: '#111', 'stroke-width': 7, 'stroke-linecap': 'round' }, vs));
    });

    // data bubble: original bubble bitmap, interior rebuilt (arrows + red X)
    c.bub = group(R, [292, 664]);
    layer(c.bub, 1, 'bubble');
    patch(c.bub, 186, 422, 414, 626, 'radial-gradient(ellipse at 45% 40%, #ffffff 0%, #fbfbfb 55%, #f1f1f1 100%)', 34, 2);
    const bs = svgLayer(c.bub);
    c.up = svgEl('g', {}, bs); c.down = svgEl('g', {}, bs);
    svgEl('path', { d: 'M241 458 L272 503 L252 503 L252 584 L230 584 L230 503 L210 503 Z', fill: '#121212', stroke: '#121212', 'stroke-width': 7, 'stroke-linejoin': 'round' }, c.up);
    svgEl('path', { d: 'M298 584 L267 539 L287 539 L287 458 L309 458 L309 539 L329 539 Z', fill: '#121212', stroke: '#121212', 'stroke-width': 7, 'stroke-linejoin': 'round' }, c.down);
    c.xg = svgEl('g', {}, bs); c.xg.style.transformOrigin = '350px 476px'; c.xg.style.transformBox = 'view-box';
    c.xring = svgEl('circle', { cx: 350, cy: 476, r: 38, fill: 'none', stroke: '#E53935', 'stroke-width': 5 }, bs);
    svgEl('circle', { cx: 350, cy: 476, r: 39, fill: '#E53935', stroke: '#fff', 'stroke-width': 6 }, c.xg);
    svgEl('path', { d: 'M336 462 L364 490 M364 462 L336 490', stroke: '#fff', 'stroke-width': 9, 'stroke-linecap': 'round' }, c.xg);

    // thought bubble with a "?" that draws itself
    c.th = group(R, [768, 505]);
    layer(c.th, 1, 'thought');
    patch(c.th, 790, 352, 905, 462, 'radial-gradient(circle at 50% 45%, #fff 0%, #fafafa 60%, #f0f0f0 100%)', '50%', 2);
    const ts = svgLayer(c.th);
    c.q = svgEl('path', { d: 'M823 388 C 823 358, 872 356, 872 388 C 872 410, 847 408, 847 432', fill: 'none', stroke: '#111', 'stroke-width': 17, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ts);
    c.qLen = 150; c.q.style.strokeDasharray = c.qLen;
    c.qDot = svgEl('circle', { cx: 847, cy: 452, r: 10, fill: '#111' }, ts);
    c.qDot.style.transformOrigin = '847px 452px'; c.qDot.style.transformBox = 'view-box';

    // alert strokes that light up in turn
    c.st1 = alertStrokes(R, 408, 452, [-118, -80, -42], 34, 36, 15);
    c.st2 = alertStrokes(R, 330, 662, [-12, 24, 60], 22, 30, 14);

    // title + hashtag
    c.title = kineticText(R, [
      { t: 'Ta connexion finit', x0: 124, x1: 941, top: 99 },
      { t: 'trop vite ?', x0: 309, x1: 766, top: 183 },
    ]);
    c.hash = kineticText(R, [
      { t: '#DemainCest', x0: 770, x1: 1034, top: 1201 },
      { t: 'Maintenant', x0: 789, x1: 1015, top: 1239 },
    ]);
    c.hash.words[0].inner.innerHTML = '<span style="color:#fff">#</span>DemainCest';
    const hs = svgLayer(R);
    c.ul = svgEl('path', { d: 'M826 1284 Q 915 1272 1004 1277', fill: 'none', stroke: '#fff', 'stroke-width': 6, 'stroke-linecap': 'round' }, hs);
    c.ul.style.strokeDasharray = 190;

    sfx('impact', s + .45); sfx('pop', s + .85, .6); sfx('vibrate', s + 1.05); sfx('alert', s + 1.6);
    sfx('pop', s + 2.0); sfx('draw', s + 2.3, .5); sfx('pop', s + 2.8, .5); sfx('vibrate', s + 3.25, .6); sfx('whoosh', s + 5.55);
  },
  render(lt, c) {
    // person: mask reveal from the bottom, then idle breathing
    const pr = E.out3(prog(lt, .12, .95));
    const idle = Math.sin(lt * 1.7) * 3;
    T(c.person.el, `translateY(${(1 - pr) * 70 + idle}px) scale(${1 + .004 * Math.sin(lt * 1.3)})`);
    c.person.el.style.clipPath = `inset(${(1 - pr) * 100}% 0 0 0)`;
    // phone vibration (two bursts)
    const v = Math.max(bump(lt, 1.02, 1.8) > 0 ? 1 : 0, bump(lt, 3.22, 3.7) > 0 ? .7 : 0);
    show(c.phone.el, v > 0);
    T(c.phone.el, `translate(${Math.sin(lt * 97) * 3.2 * v}px, ${idle + Math.cos(lt * 123) * 2 * v}px) rotate(${Math.sin(lt * 83) * 1.3 * v}deg)`);
    const va = Math.max(bump(lt, 1.02, 1.8), .7 * bump(lt, 3.22, 3.7));
    c.vibArcs.forEach((a, i) => { a.style.opacity = va * (i < 2 ? 1 : .6); });
    T(c.vib, `translateY(${idle}px)`);

    // data bubble pops, arrows pulse up/down until the red X lands
    const bp = spring(lt - .85, 2.2, 7);
    const ex = E.in3(prog(lt, 5.25, 5.6));
    T(c.bub, `scale(${Math.max(0, bp * (1 - ex))})`, clamp((lt - .85) * 8));
    const live = lt < 1.6 ? 1 : 0;
    const ph = lt * 9;
    c.up.style.transform = `translateY(${live ? -7 * Math.max(0, Math.sin(ph)) : 0}px)`;
    c.down.style.transform = `translateY(${live ? 7 * Math.max(0, Math.sin(ph + Math.PI)) : 0}px)`;
    c.up.style.opacity = c.down.style.opacity = lt < 1.6 ? 1 : lerp(1, .55, prog(lt, 1.6, 1.9));
    const xs = spring(lt - 1.6, 2.6, 6.5);
    c.xg.style.transform = `scale(${Math.max(0, xs) * (1 + .14 * bump(lt, 2.4, 2.75))})`;
    c.xg.style.opacity = lt > 1.6 ? 1 : 0;
    const rp = prog(lt, 1.66, 2.2);
    c.xring.setAttribute('r', 38 + 36 * E.out3(rp)); c.xring.style.opacity = rp > 0 && rp < 1 ? (1 - rp) : 0;

    // thought bubble + "?" drawn progressively
    const tp = spring(lt - 2.0, 2.0, 7);
    T(c.th, `scale(${Math.max(0, tp * (1 - ex))}) rotate(${Math.sin(lt * 2.2) * 2}deg)`, clamp((lt - 2) * 8));
    c.q.style.strokeDashoffset = c.qLen * (1 - E.inOut(prog(lt, 2.3, 2.75)));
    c.qDot.style.transform = `scale(${Math.max(0, spring(lt - 2.78, 3, 7))})`;

    // alert strokes light up successively
    renderStrokes(c.st1, prog(lt, 1.62, 2.05) * (1 - ex), bump(lt, 2.2, 2.7) + bump(lt, 3.4, 3.9));
    renderStrokes(c.st2, prog(lt, 1.8, 2.25) * (1 - ex), bump(lt, 2.6, 3.1) + bump(lt, 3.7, 4.2));

    // typography
    animWords(c.title.words, lt, .42, .12, 'pop', 5.3, 'up');
    const qw = c.title.words[c.title.words.length - 1];
    qw.inner.style.transform = `rotate(${Math.sin(lt * 6) * 6 * bump(lt, 1.4, 3.4)}deg)`;
    animWords(c.hash.words, lt, 2.7, .15, 'rise', 5.3, 'down');
    c.ul.style.strokeDashoffset = 190 * (1 - E.out3(prog(lt, 3.05, 3.5)));
    c.ul.style.opacity = 1 - prog(lt, 5.3, 5.55);
  },
});
