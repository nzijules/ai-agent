// SCÈNE 2 — MISES À JOUR AUTOMATIQUES : « Coupe les mises à jour auto »
SCENE_DEFS.push({
  k: 2, dur: 6, label: ['ASTUCE 01', 'mises à jour'],
  exitPoint: () => [728, 350],
  build(c) {
    const R = c.root, s = c.start;
    c.person = layer(R, 2, 'person');
    c.person.el.style.transformOrigin = '540px 900px';
    // tap ripple on the phone the character is using
    c.tap = el('div', 'abs ring', R, { width: '60px', height: '60px', border: '5px solid #fff', boxShadow: '0 0 18px 4px rgba(255,255,255,.8)' });

    // rebuilt update icon: yellow 3D disc, rotating refresh arrows, static download arrow
    c.icon = group(R, [772, 172]);
    el('div', 'abs ring', c.icon, {
      left: '700px', top: '100px', width: '144px', height: '144px', border: '7px solid #f4f4f4',
      background: 'radial-gradient(circle at 38% 32%, #FFE873 0%, #FFCB05 52%, #E9A700 100%)',
      boxShadow: '0 12px 22px rgba(110,70,0,.35), inset 0 -8px 12px rgba(0,0,0,.12), inset 0 6px 10px rgba(255,255,255,.45)',
    });
    const is = svgLayer(c.icon);
    c.spin = syncArrows(is, 772, 172, 44, '#141414', 8.5);
    svgEl('path', { d: 'M772 150 L772 184 M760 172 L772 185 L784 172 M757 196 L787 196', fill: 'none', stroke: '#141414', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, is);

    // settings panel: original bitmap, toggle rebuilt so it can switch ON -> OFF
    c.panel = group(R, [776, 478]);
    layer(c.panel, 2, 'panel');
    patch(c.panel, 628, 284, 866, 428, 'linear-gradient(180deg, #f7f7f7, #eeeeee)', 18, 2);
    c.tg = toggleUI(c.panel, 656, 322, 150, 58, '#2DB84B');
    c.on = el('div', 'abs ui', c.tg.pill, { left: '20px', top: '12px', fontWeight: 800, fontSize: '27px', fontStyle: 'italic' }); c.on.textContent = 'ON';
    c.off = el('div', 'abs ui', c.tg.pill, { right: '18px', top: '12px', fontWeight: 800, fontSize: '27px', fontStyle: 'italic' }); c.off.textContent = 'OFF';
    c.tg.knob.style.zIndex = 2;
    c.glow = el('div', 'abs', c.panel, { left: '646px', top: '312px', width: '170px', height: '78px', borderRadius: '39px', border: '4px solid #fff', boxShadow: '0 0 26px 8px rgba(255,255,255,.9)' });
    c.kstrokes = [-62, -28, 6].map(a => el('div', 'abs strokeK', c.panel, { width: '9px', height: '30px', borderRadius: '5px' }));

    c.title = kineticText(R, [
      { t: 'Coupe les mises', x0: 180, x1: 902, top: 963 },
      { t: 'à jour auto', x0: 301, x1: 791, top: 1047 },
    ]);
    sfx('whoosh', s + .05, .5); sfx('pop', s + .55, .6); sfx('pop', s + .85); sfx('tap', s + 1.9); sfx('slide', s + 2.0);
    sfx('confirm', s + 2.5); sfx('stop', s + 2.95, .7); sfx('whoosh', s + 5.55);
  },
  render(lt, c) {
    // character enters through a circular mask opening from the phone
    const pr = E.out3(prog(lt, -.45, .35));
    c.person.el.style.clipPath = `circle(${pr * 1300}px at 690px 550px)`;
    T(c.person.el, `translateY(${Math.sin(lt * 1.6) * 2.5}px) rotate(${Math.sin(lt * 1.1) * .25}deg)`);
    const tp = prog(lt, 1.85, 2.35);
    T(c.tap, `translate(${652 - 30}px, ${548 - 30}px) scale(${.3 + 1.2 * E.out3(tp)})`, tp > 0 && tp < 1 ? 1 - tp : 0);

    const ex = E.in3(prog(lt, 5.2, 5.55));
    // update icon: pops, spins fast, slows down and stops once updates are OFF
    const ip = spring(lt - .55, 2.2, 7);
    T(c.icon, `scale(${Math.max(0, ip * (1 - ex))})`, clamp((lt - .55) * 8));
    const v0 = 330, ta = 2.35, td = .85;
    const ang = lt < ta ? v0 * lt : lt < ta + td ? v0 * ta + v0 * (lt - ta) - v0 / (2 * td) * (lt - ta) ** 2 : v0 * ta + v0 * td / 2;
    c.spin.style.transform = `rotate(${ang}deg)`;

    // panel + toggle
    const pp = spring(lt - .85, 2.0, 7);
    T(c.panel, `scale(${Math.max(0, pp * (1 - ex))})`, clamp((lt - .85) * 8));
    const k = E.inOut(prog(lt, 2.0, 2.42));
    c.tg.set(k, mixColor('#2DB84B', '#E53935', k));
    c.on.style.opacity = 1 - clamp(k * 2); c.off.style.opacity = clamp(k * 2 - 1);
    const g = prog(lt, 2.45, 3.2);
    c.glow.style.opacity = g > 0 && g < 1 ? Math.sin(Math.PI * g) : 0;
    c.glow.style.transform = `scale(${1 + .18 * E.out3(g)})`;
    const kp = prog(lt, 2.4, 2.75);
    c.kstrokes.forEach((d, i) => {
      const a = [-62, -28, 6][i] * Math.PI / 180, r = 22 + 22 * E.out3(kp);
      d.style.left = (822 + Math.cos(a) * r - 4) + 'px'; d.style.top = (336 + Math.sin(a) * r - 15) + 'px';
      d.style.transform = `rotate(${[-62, -28, 6][i] + 90}deg) scaleY(${Math.sin(Math.PI * Math.min(1, kp * 1.2)) * (lt < 3.4 ? 1 : 0) + (lt >= 2.75 && lt < 5.2 ? 1 : 0) * 0})`;
      d.style.opacity = kp > 0 && kp < 1 ? 1 : 0;
    });
    animWords(c.title.words, lt, .5, .1, 'rise', 5.3, 'down');
  },
});
