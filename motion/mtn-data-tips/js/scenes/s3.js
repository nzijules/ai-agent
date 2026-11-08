// SCÈNE 3 — APPLICATIONS EN ARRIÈRE-PLAN : « Empêche les applis de tourner en arrière-plan »
SCENE_DEFS.push({
  k: 3, dur: 6, label: ['ASTUCE 02', 'arrière-plan'],
  exitPoint: () => [662, 690],
  build(c) {
    const R = c.root, s = c.start;
    // floating settings phone (behind the character so the pointing finger stays in front)
    c.panel = group(R, [720, 752]);
    layer(c.panel, 3, 'panel');
    patch(c.panel, 742, 527, 808, 652, '#f7f8fa', 8, 1.5);
    c.dim = [0, 1, 2].map(i => el('div', 'abs', c.panel, { left: '646px', top: (526 + 43 * i) + 'px', width: '58px', height: '42px', borderRadius: '10px', background: 'rgba(245,246,248,.78)' }));
    c.tgs = [0, 1, 2].map(i => toggleUI(c.panel, 750, 534 + 43 * i, 52, 27, '#34C34F'));
    patch(c.panel, 638, 667, 688, 713, '#E3302E', '50%', 1.5);
    const ps = svgLayer(c.panel);
    c.sync = syncArrows(ps, 663, 690, 13, '#fff', 4.5);

    c.person = layer(R, 3, 'person');
    c.person.el.style.transformOrigin = '540px 1200px';

    // rebuilt data-usage indicator that drops as apps are switched off
    c.chip = group(R, [870, 480]);
    const card = el('div', 'abs', c.chip, { left: '862px', top: '430px', width: '196px', height: '104px', borderRadius: '22px', background: '#fff', boxShadow: '0 14px 26px rgba(120,80,0,.28)' });
    const cs = svgLayer(card, 186, 104);
    svgEl('path', { d: 'M28 62 L28 30 M18 40 L28 28 L38 40 M50 30 L50 62 M40 52 L50 64 L60 52', fill: 'none', stroke: '#111', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cs);
    el('div', 'abs ui', card, { left: '76px', top: '18px', color: '#111', fontWeight: 800, fontSize: '22px' }).textContent = 'Conso data';
    c.pct = el('div', 'abs ui', card, { left: '76px', top: '44px', color: '#111', fontWeight: 600, fontSize: '17px' });
    el('div', 'abs', card, { left: '20px', top: '78px', width: '156px', height: '12px', borderRadius: '6px', background: '#ececec' });
    c.bar = el('div', 'abs', card, { left: '20px', top: '78px', height: '12px', borderRadius: '6px', background: 'linear-gradient(90deg,#FFB800,#FFD84A)' });

    c.title = kineticText(R, [
      { t: 'Empêche les applis', x0: 109, x1: 971, top: 71 },
      { t: 'de tourner en', x0: 222, x1: 831, top: 166 },
      { t: 'arrière-plan', x0: 245, x1: 799, top: 238 },
    ]);
    sfx('impact', s + .35, .7); sfx('whoosh', s + .75, .6); sfx('pop', s + 1.3, .5);
    [1.8, 2.15, 2.5].forEach(t => sfx('click', s + t)); sfx('stop', s + 3.0); sfx('whoosh', s + 5.55);
  },
  render(lt, c) {
    const ex = E.in3(prog(lt, 5.2, 5.55));
    // character: mask wipe from the left
    const pr = spring(lt + .45, 1.5, 7);
    T(c.person.el, `translateY(${(1 - pr) * 30 + Math.sin(lt * 1.5) * 2.5}px) scale(${lerp(1.07, 1, pr)})`);
    // settings phone revealed by a mask from the bottom
    const pp = E.out3(prog(lt, .75, 1.3));
    c.panel.style.clipPath = `inset(${(1 - pp) * 100}% 0 0 0)`;
    T(c.panel, `translateY(${(1 - pp) * 40}px) scale(${lerp(.92, 1, pp) * (1 - .1 * ex)})`, 1 - ex);
    // app toggles switch off one after the other, icons lose their brightness
    let offs = 0;
    c.tgs.forEach((tg, i) => {
      const k = E.inOut(prog(lt, 1.8 + .35 * i, 2.02 + .35 * i));
      offs += k;
      tg.set(k, mixColor('#34C34F', '#C3C7CE', k));
      c.dim[i].style.opacity = k;
      tg.pill.style.transform = `scale(${1 + .12 * bump(lt, 1.8 + .35 * i, 2.1 + .35 * i)})`;
    });
    // sync symbol spins, then stops
    const v0 = 420, ta = 2.9, td = .55;
    const ang = lt < ta ? v0 * lt : lt < ta + td ? v0 * ta + v0 * (lt - ta) - v0 / (2 * td) * (lt - ta) ** 2 : v0 * ta + v0 * td / 2;
    c.sync.style.transform = `rotate(${ang}deg)`;
    const stopped = prog(lt, 2.9, 3.45);
    // data indicator decreases
    const cp = spring(lt - 1.3, 2.2, 7);
    T(c.chip, `scale(${Math.max(0, cp * (1 - ex))})`, clamp((lt - 1.3) * 8));
    const lvl = .88 - .17 * offs - .2 * stopped;
    c.bar.style.width = (156 * lvl) + 'px';
    c.pct.textContent = `${Math.round(lvl * 140)} Mo/h en fond`;

    animWords(c.title.words, lt, .32, .09, 'slam', 5.3, 'up');
  },
});
