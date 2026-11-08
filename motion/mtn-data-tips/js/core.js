// ============================================================================
// MTN Vibe Motion — core helpers (time-driven, deterministic: render(t) only)
// ============================================================================
const STAGE_W = 1080, STAGE_H = 1920, Y0 = 270;   // compositions keep their original pixel grid, offset by Y0

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const E = {
  out2: t => 1 - (1 - t) * (1 - t),
  out3: t => 1 - Math.pow(1 - t, 3),
  out5: t => 1 - Math.pow(1 - t, 5),
  in2: t => t * t,
  in3: t => t * t * t,
  inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  sine: t => .5 - .5 * Math.cos(Math.PI * t),
  back: (t, s = 1.70158) => t <= 0 ? 0 : t >= 1 ? 1 : 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
};
// damped spring, t in seconds since trigger -> 0..1 (overshoots)
function spring(t, freq = 2.2, damp = 7) {
  if (t <= 0) return 0;
  const w = 2 * Math.PI * freq;
  return 1 - Math.exp(-damp * t) * (Math.cos(w * t) + (damp / w) * Math.sin(w * t));
}
// one-shot bump 0 -> 1 -> 0 over [a, b]
const bump = (t, a, b) => { const p = prog(t, a, b); return p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0; };

let _seed = 11;
const rnd = () => (_seed = (_seed * 16807) % 2147483647) / 2147483647;

function el(tag, cls, parent, style) {
  const d = document.createElement(tag);
  if (cls) d.className = cls;
  if (style) Object.assign(d.style, style);
  if (parent) parent.appendChild(d);
  return d;
}
function svgEl(tag, attrs, parent) {
  const d = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attrs) d.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(d);
  return d;
}
// absolutely positioned svg covering a scene (scene pixel coords)
function svgLayer(parent, w = 1080, h = 1400, cls = '') {
  const s = svgEl('svg', { width: w, height: h, viewBox: `0 0 ${w} ${h}`, class: 'abs ' + cls }, parent);
  s.style.left = '0px'; s.style.top = '0px'; s.style.overflow = 'visible';
  return s;
}
function T(node, tf, op) { node.style.transform = tf; if (op !== undefined) node.style.opacity = op; }
function show(node, on) { node.style.visibility = on ? 'visible' : 'hidden'; }

// --- bitmap layer from manifest -------------------------------------------------
function layer(root, k, name, origin) {
  const b = window.MANIFEST[k].layers[name];
  const img = el('img', 'abs layer', root);
  img.src = `assets/scenes/s${k}/${name}.png`;
  Object.assign(img.style, { left: b[0] + 'px', top: b[1] + 'px', width: (b[2] - b[0]) + 'px', height: (b[3] - b[1]) + 'px' });
  const L = { el: img, x: b[0], y: b[1], w: b[2] - b[0], h: b[3] - b[1] };
  L.cx = L.x + L.w / 2; L.cy = L.y + L.h / 2;
  if (origin) img.style.transformOrigin = `${origin[0] - L.x}px ${origin[1] - L.y}px`;
  return L;
}

// --- kinetic typography -----------------------------------------------------------
const _mc = document.createElement('canvas').getContext('2d');
// lines: [{t, x0, x1, top}] in scene px. Text is fitted to the ink width measured on the poster.
function kineticText(root, lines, opts = {}) {
  const weight = opts.weight || 800, color = opts.color || '#0B0B0B';
  const out = { lines: [], words: [] };
  lines.forEach((L, li) => {
    _mc.font = `italic ${weight} 100px Mont`;
    const m = _mc.measureText(L.t);
    const inkW = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
    const s = (L.x1 - L.x0) / inkW;             // scale factor vs 100px
    const fs = 100 * s;
    const A = m.fontBoundingBoxAscent * s, D = m.fontBoundingBoxDescent * s;
    const asc = m.actualBoundingBoxAscent * s;
    const div = el('div', 'abs ktext', root, {
      left: (L.x0 + m.actualBoundingBoxLeft * s) + 'px', top: (L.top + asc - A) + 'px',
      fontSize: fs + 'px', lineHeight: (A + D) + 'px', color, fontWeight: weight,
    });
    const parts = L.t.split(' ');
    const lw = [];
    parts.forEach((w, wi) => {
      const wrap = el('span', 'kw', div);
      const inner = el('span', 'kwi', wrap);
      inner.textContent = w;
      if (L.color && L.color[wi]) inner.style.color = L.color[wi];
      const word = { wrap, inner, line: li, idx: out.words.length };
      out.words.push(word); lw.push(word);
      if (wi < parts.length - 1) div.appendChild(document.createTextNode(' '));
    });
    out.lines.push({ div, words: lw, fs, box: L });
  });
  return out;
}
// word animation presets. start = first word start (lt), st = stagger
function animWords(words, lt, start, st, type = 'pop', exitAt = 1e9, exitType = 'up') {
  words.forEach((w, i) => {
    const t0 = start + i * st;
    const a = lt - t0;
    let tf = '', op = 1, itf = '';
    if (type === 'pop') {
      const s = spring(a, 2.4, 8);
      tf = `translateY(${(1 - clamp(s)) * 40}px) scale(${lerp(.3, 1, s)})`; op = clamp(a * 6);
    } else if (type === 'rise') {          // mask reveal: inner slides up inside clipped wrapper
      const p = E.out3(prog(a, 0, .45));
      itf = `translateY(${(1 - p) * 115}%)`; op = 1;
      w.wrap.style.overflow = 'hidden';
    } else if (type === 'slam') {
      const s = spring(a, 2.0, 9);
      tf = `scale(${lerp(2.2, 1, clamp(s * 1.0, 0, 1.2))}) rotate(${(1 - clamp(s)) * -8}deg)`; op = clamp(a * 5);
    } else if (type === 'drop') {
      const s = spring(a, 2.2, 7.5);
      tf = `translateY(${(1 - s) * -70}px) rotate(${(1 - clamp(s)) * 10}deg)`; op = clamp(a * 6);
    }
    // exit
    const e = lt - (exitAt + i * st * .5);
    if (e > 0) {
      const q = E.in3(prog(e, 0, .35));
      if (exitType === 'up') tf += ` translateY(${-80 * q}px)`;
      else if (exitType === 'down') tf += ` translateY(${80 * q}px)`;
      else if (exitType === 'shrink') tf += ` scale(${1 - q})`;
      op *= 1 - q;
    }
    w.wrap.style.transform = tf;
    w.wrap.style.opacity = a < 0 ? 0 : op;
    if (itf) w.inner.style.transform = itf;
  });
}

// --- homography (screen space -> scene px) ------------------------------------------
function solve(A, b) {           // gaussian elimination, A: n x n
  const n = b.length;
  for (let i = 0; i < n; i++) {
    let p = i; for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
    [A[i], A[p]] = [A[p], A[i]]; [b[i], b[p]] = [b[p], b[i]];
    for (let r = i + 1; r < n; r++) { const f = A[r][i] / A[i][i]; for (let c = i; c < n; c++) A[r][c] -= f * A[i][c]; b[r] -= f * b[i]; }
  }
  const x = new Array(n);
  for (let i = n - 1; i >= 0; i--) { let s = b[i]; for (let c = i + 1; c < n; c++) s -= A[i][c] * x[c]; x[i] = s / A[i][i]; }
  return x;
}
function homography(src, dst) {
  const A = [], b = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i], [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
  }
  const h = solve(A, b); h.push(1); return h;
}
const SCR_W = 300, SCR_H = 600;
function makeScreen(root, k) {
  const quad = window.MANIFEST[k].screen;
  const H = homography([[0, 0], [SCR_W, 0], [SCR_W, SCR_H], [0, SCR_H]], quad);
  const div = el('div', 'abs screen', root, { backgroundImage: `url(assets/scenes/s${k}/screen.jpg)` });
  div.style.transform = `matrix3d(${H[0]},${H[3]},0,${H[6]},${H[1]},${H[4]},0,${H[7]},0,0,1,0,${H[2]},${H[5]},0,${H[8]})`;
  const map = (x, y) => { const w = H[6] * x + H[7] * y + H[8]; return [(H[0] * x + H[1] * y + H[2]) / w, (H[3] * x + H[4] * y + H[5]) / w]; };
  return { div, H, map, k };
}
// a piece of the rectified screen bitmap (for animating parts of the original UI)
function screenCrop(scr, x0, y0, x1, y1, parent) {
  const d = el('div', 'abs scrop', parent || scr.div, {
    left: x0 + 'px', top: y0 + 'px', width: (x1 - x0) + 'px', height: (y1 - y0) + 'px',
    backgroundImage: `url(assets/scenes/s${scr.k}/screen.jpg)`, backgroundSize: `${SCR_W}px ${SCR_H}px`,
    backgroundPosition: `${-x0}px ${-y0}px`,
  });
  return d;
}
function patch(parent, x0, y0, x1, y1, color, r = 0, feather = 0) {
  return el('div', 'abs', parent, {
    left: x0 + 'px', top: y0 + 'px', width: (x1 - x0) + 'px', height: (y1 - y0) + 'px', background: color,
    borderRadius: (typeof r === 'number' ? r + 'px' : r), filter: feather ? `blur(${feather}px)` : '',
  });
}

// --- small vector widgets -----------------------------------------------------------
function syncArrows(parent, cx, cy, r, color, sw) {      // two curved arrows (refresh glyph)
  const g = svgEl('g', {}, parent);
  const arc = (a0, a1) => {
    const p = a => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`;
  };
  const head = a => {
    const tip = [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const tx = -Math.sin(a), ty = Math.cos(a);                 // tangent (clockwise)
    const nx = Math.cos(a), ny = Math.sin(a);
    const L = sw * 1.5;
    return `M${tip[0] - tx * L + nx * L} ${tip[1] - ty * L + ny * L} L${tip[0] + tx * L * .6} ${tip[1] + ty * L * .6} L${tip[0] - tx * L - nx * L} ${tip[1] - ty * L - ny * L} Z`;
  };
  for (const a of [-2.7, 0.45]) {
    svgEl('path', { d: arc(a, a + 2.1), fill: 'none', stroke: color, 'stroke-width': sw, 'stroke-linecap': 'round' }, g);
    svgEl('path', { d: head(a + 2.15), fill: color, stroke: color, 'stroke-width': sw * .4, 'stroke-linejoin': 'round' }, g);
  }
  g.style.transformOrigin = `${cx}px ${cy}px`;
  g.style.transformBox = 'view-box';
  return g;
}
function toggleUI(parent, x, y, w, h, onColor, offColor) {   // pill + knob, returns setter(p, color)
  const pill = el('div', 'abs', parent, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', borderRadius: h / 2 + 'px', background: onColor, boxShadow: 'inset 0 2px 4px rgba(0,0,0,.18)' });
  const knob = el('div', 'abs', pill, { top: (h * .1) + 'px', width: (h * .8) + 'px', height: (h * .8) + 'px', borderRadius: '50%', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,.3)' });
  const set = (p, col) => { knob.style.left = lerp(w - h * .9, h * .1, p) + 'px'; pill.style.background = col; };
  set(0, onColor);
  return { pill, knob, set };
}
function mixColor(a, b, t) {
  const pa = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], t))).join(',')})`;
}
// yellow "alert strokes" like the posters (rounded bars with dark outline)
function alertStrokes(parent, cx, cy, angles, r0, len, sw = 14) {
  return angles.map(a => {
    const rad = a * Math.PI / 180;
    const d = el('div', 'abs stroke3d', parent, { width: sw + 'px', height: len + 'px', borderRadius: sw / 2 + 'px' });
    d._pos = { cx, cy, rad, r0, len, sw, a };
    return d;
  });
}
function renderStrokes(list, p, glow = 0) {
  list.forEach((d, i) => {
    const { cx, cy, rad, r0, len, sw, a } = d._pos;
    const pi = clamp(p * 1.4 - i * .2);
    const s = E.back(pi, 2);
    const x = cx + Math.cos(rad) * (r0 + len / 2) - sw / 2, y = cy + Math.sin(rad) * (r0 + len / 2) - len / 2;
    d.style.left = x + 'px'; d.style.top = y + 'px';
    d.style.transform = `rotate(${a + 90}deg) scaleY(${s})`;
    d.style.opacity = pi > 0 ? 1 : 0;
    d.style.boxShadow = glow > 0 ? `0 0 ${18 * glow}px ${6 * glow}px rgba(255,255,255,${.9 * glow})` : '';
  });
}

// --- SFX registry (read by tools/audio.py) --------------------------------------------
window.SFX_EVENTS = [];
function sfx(type, t, gain = 1) { window.SFX_EVENTS.push({ type, t: +t.toFixed(3), gain }); }
