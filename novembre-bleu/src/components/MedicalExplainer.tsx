import React from 'react';
import {getLength} from '@remotion/paths';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../styles/theme';

/**
 * Schéma anatomique SIMPLIFIÉ — coupe sagittale du petit bassin masculin
 * (patient tourné vers la gauche : antérieur à gauche, postérieur à droite).
 * Rapports anatomiques respectés :
 *  - la prostate est située sous la vessie et entoure l'urètre initial (urètre prostatique) ;
 *  - le rectum est en arrière de la prostate ;
 *  - la symphyse pubienne est en avant ;
 *  - les vésicules séminales sont en arrière de la vessie, au-dessus de la prostate.
 * La zone périphérique (postérieure) de la prostate est mise en évidence de façon discrète.
 * ⚠️ À faire valider par un professionnel de santé avant diffusion.
 */
const BLADDER = 'M 238 214 C 232 150 300 128 352 140 C 410 152 432 214 418 270 C 408 312 372 340 330 352 C 300 360 262 348 248 318 C 238 296 242 250 238 214 Z';
const PROSTATE = 'M 296 352 C 322 344 362 350 376 372 C 390 396 380 428 356 440 C 330 452 300 446 286 426 C 272 404 274 362 296 352 Z';
const URETHRA = 'M 322 350 C 326 380 328 410 326 440 C 324 466 318 486 300 500 C 270 522 232 532 196 548 C 170 560 150 574 136 592';
const RECTUM = 'M 486 150 C 482 220 470 290 452 340 C 436 384 420 424 416 462 C 412 500 420 540 432 584';
const SEMINAL = 'M 368 350 C 380 334 396 318 410 304 C 418 296 412 288 402 294 C 388 304 374 320 362 338 Z';
const PUBIS = 'M 196 352 C 214 338 238 344 244 368 C 252 396 248 436 232 458 C 216 476 192 470 186 446 C 178 414 178 368 196 352 Z';
const BODY = 'M 120 60 C 140 160 150 260 150 340 C 150 420 120 520 110 640 M 560 60 C 548 180 548 300 560 420 C 572 520 560 600 540 660';

type LabelDef = {text: string; x: number; y: number; tx: number; ty: number; at: number; anchor: 'start' | 'end'; gold?: boolean};

export const MedicalExplainer: React.FC<{
  at?: number;
  size: number;
  labels?: boolean;
  /** frame d'apparition de la mise en évidence de la zone périphérique */
  highlightAt?: number;
  labelScale?: number;
}> = ({at = 0, size, labels = true, highlightAt = 60, labelScale = 1}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const draw = (start: number, dur: number) =>
    interpolate(t, [start, start + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.65, 0, 0.35, 1)});
  const pBody = draw(0, 30);
  const pBladder = draw(4, 26);
  const pRectum = draw(8, 26);
  const pPubis = draw(10, 20);
  const pUrethra = draw(16, 26);
  const pProstate = draw(22, 22);
  const pSeminal = draw(26, 18);
  const fillP = draw(30, 20);
  const hl = interpolate(t, [highlightAt, highlightAt + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pulse = 0.65 + 0.35 * Math.sin((t - highlightAt) / 7);

  const dash = (d: string, p: number) => {
    const len = getLength(d);
    return {strokeDasharray: len, strokeDashoffset: len * (1 - p)};
  };

  const L: LabelDef[] = [
    {text: 'Vessie', x: 330, y: 200, tx: 250, ty: 96, at: 34, anchor: 'end'},
    {text: 'Prostate', x: 352, y: 404, tx: 520, ty: 470, at: 40, anchor: 'start', gold: true},
    {text: 'Urètre', x: 230, y: 530, tx: 150, ty: 640, at: 46, anchor: 'end'},
    {text: 'Rectum', x: 470, y: 250, tx: 560, ty: 176, at: 52, anchor: 'start'},
  ];

  return (
    <svg viewBox="0 0 680 700" width={size} height={size * (700 / 680)} style={{overflow: 'visible'}}>
      <defs>
        <radialGradient id="me-prostate" cx="0.45" cy="0.45" r="0.7">
          <stop offset="0" stopColor="#F3D29A" />
          <stop offset="1" stopColor={colors.gold} stopOpacity={0.85} />
        </radialGradient>
        <radialGradient id="me-hl" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={colors.electric} stopOpacity={0.95} />
          <stop offset="1" stopColor={colors.electric} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="me-organ" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2C6FD0" stopOpacity={0.55} />
          <stop offset="1" stopColor={colors.blue} stopOpacity={0.35} />
        </linearGradient>
        <clipPath id="me-prostate-clip"><path d={PROSTATE} /></clipPath>
      </defs>

      {/* silhouette du bassin (contexte) */}
      <path d={BODY} fill="none" stroke={colors.white} strokeOpacity={0.14} strokeWidth={2} style={dash(BODY, pBody)} />

      {/* symphyse pubienne */}
      <path d={PUBIS} fill="#DCE3EC" fillOpacity={0.18 * fillP} stroke="#DCE3EC" strokeOpacity={0.55} strokeWidth={3} style={dash(PUBIS, pPubis)} />
      {/* rectum (tube) */}
      <path d={RECTUM} fill="none" stroke="#7FA8D8" strokeOpacity={0.22 * fillP} strokeWidth={58} strokeLinecap="round" />
      <path d={RECTUM} fill="none" stroke="#9CC1EA" strokeOpacity={0.75} strokeWidth={3} style={dash(RECTUM, pRectum)} transform="translate(-29 0)" />
      <path d={RECTUM} fill="none" stroke="#9CC1EA" strokeOpacity={0.75} strokeWidth={3} style={dash(RECTUM, pRectum)} transform="translate(29 0)" />
      {/* vessie */}
      <path d={BLADDER} fill="url(#me-organ)" fillOpacity={fillP} stroke={colors.electric} strokeWidth={4} style={dash(BLADDER, pBladder)} />
      {/* vésicules séminales */}
      <path d={SEMINAL} fill={colors.gold} fillOpacity={0.25 * fillP} stroke={colors.gold} strokeOpacity={0.7} strokeWidth={2.5} style={dash(SEMINAL, pSeminal)} />
      {/* prostate */}
      <path d={PROSTATE} fill="url(#me-prostate)" fillOpacity={fillP} stroke={colors.gold} strokeWidth={4} style={dash(PROSTATE, pProstate)} />
      {/* zone périphérique (postérieure) — mise en évidence discrète */}
      <g clipPath="url(#me-prostate-clip)" opacity={hl * pulse}>
        <ellipse cx={366} cy={412} rx={34} ry={40} fill="url(#me-hl)" />
      </g>
      {/* urètre : traverse la prostate */}
      <path d={URETHRA} fill="none" stroke={colors.white} strokeWidth={7} strokeLinecap="round" style={dash(URETHRA, pUrethra)} />
      <path d={URETHRA} fill="none" stroke={colors.navy} strokeWidth={2.5} strokeLinecap="round" style={dash(URETHRA, pUrethra)} />

      {labels &&
        L.map((l) => {
          const p = interpolate(t, [l.at, l.at + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)});
          const lineLen = Math.hypot(l.tx - l.x, l.ty - l.y);
          return (
            <g key={l.text} opacity={p}>
              <circle cx={l.x} cy={l.y} r={7} fill={l.gold ? colors.gold : colors.white} />
              <line x1={l.x} y1={l.y} x2={l.tx} y2={l.ty} stroke={l.gold ? colors.gold : colors.white} strokeWidth={2} strokeDasharray={lineLen} strokeDashoffset={lineLen * (1 - p)} />
              <text
                x={l.tx + (l.anchor === 'start' ? 12 : -12)}
                y={l.ty + 12 * labelScale}
                textAnchor={l.anchor}
                fontFamily={fonts.body}
                fontWeight={600}
                fontSize={34 * labelScale}
                fill={l.gold ? colors.gold : colors.white}
              >
                {l.text}
              </text>
            </g>
          );
        })}
    </svg>
  );
};
