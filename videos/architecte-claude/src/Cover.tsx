import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Architect, Awa} from './ui';
import {body, C, display} from './theme';

/**
 * Image de couverture TikTok (1080×1920).
 * Le contenu important reste dans la zone centrale 3:4 (y 240 → 1680),
 * celle que TikTok garde dans la grille du profil.
 */
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, ${C.navy2} 0%, ${C.navy} 70%)`, fontFamily: body, color: C.white, overflow: 'hidden'}}>
    <AbsoluteFill
      style={{
        backgroundImage: 'linear-gradient(rgba(127,178,255,0.08) 2px, transparent 2px), linear-gradient(90deg, rgba(127,178,255,0.08) 2px, transparent 2px)',
        backgroundSize: '90px 90px',
      }}
    />
    {/* halo derrière l'illustration */}
    <div style={{position: 'absolute', left: 140, top: 820, width: 800, height: 800, borderRadius: 400, background: 'radial-gradient(circle, rgba(10,91,255,0.45) 0%, rgba(10,91,255,0) 70%)'}} />

    {/* logo */}
    <div style={{position: 'absolute', top: 270, left: 80, right: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <div style={{fontSize: 30, fontWeight: 700, letterSpacing: 6, opacity: 0.8}}>
        CLAUDE CODE <span style={{color: C.yellow}}>·</span> SANS JARGON
      </div>
      <Img src={staticFile('logo-mark-light.png')} style={{width: 110}} />
    </div>

    {/* titre */}
    <div style={{position: 'absolute', top: 400, left: 80, right: 80, fontFamily: display, fontWeight: 800, letterSpacing: -3, lineHeight: 1.02}}>
      <div style={{fontSize: 112}}>L'IA, c'est pour</div>
      <div style={{fontSize: 112}}>les</div>
      <div style={{fontSize: 112, color: C.yellow, position: 'relative', display: 'inline-block'}}>
        informaticiens ?
        <div style={{position: 'absolute', left: -8, right: -8, top: '54%', height: 16, borderRadius: 8, background: C.red, rotate: '-3deg'}} />
      </div>
    </div>

    {/* tampon NON ! */}
    <div
      style={{
        position: 'absolute',
        right: 70,
        top: 755,
        fontFamily: display,
        fontWeight: 800,
        fontSize: 130,
        letterSpacing: -3,
        color: C.white,
        background: C.red,
        padding: '4px 40px 16px',
        borderRadius: 28,
        rotate: '-7deg',
        boxShadow: '0 20px 50px rgba(225,38,45,0.5)',
      }}
    >
      NON !
    </div>

    {/* illustration : Awa, sa maison, l'architecte */}
    <svg viewBox="0 0 960 560" style={{position: 'absolute', left: 60, top: 900, width: 960, height: 560}}>
      <rect x={60} y={520} width={840} height={14} rx={7} fill="#3A4C82" />
      <path d="M300 250 L480 120 L660 250 Z" fill={C.yellow} />
      <rect x={325} y={250} width={310} height={270} fill={C.sky} />
      <rect x={455} y={390} width={56} height={130} rx={6} fill={C.yellow} />
      <rect x={355} y={290} width={70} height={60} rx={6} fill={C.white} />
      <rect x={535} y={290} width={70} height={60} rx={6} fill={C.white} />
      <g transform="translate(170 330) scale(0.78)">
        <Awa />
      </g>
      <g transform="translate(800 340) scale(0.78)">
        <Architect />
      </g>
      <g fill={C.yellow}>
        <circle cx={480} cy={60} r={10} />
        <circle cx={410} cy={78} r={6} />
        <circle cx={552} cy={78} r={6} />
      </g>
    </svg>

    {/* promesse */}
    <div style={{position: 'absolute', left: 60, right: 60, top: 1470, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
      <div
        style={{
          background: C.yellow,
          color: C.navy,
          fontFamily: display,
          fontWeight: 800,
          fontSize: 62,
          padding: '20px 40px',
          borderRadius: 24,
          boxShadow: '0 14px 34px rgba(255,194,26,0.3)',
          textAlign: 'center',
        }}
      >
        Claude Code expliqué
      </div>
      <div style={{fontFamily: display, fontWeight: 700, fontSize: 48}}>
        avec une simple <span style={{color: C.yellow}}>maison</span>
      </div>
    </div>
  </AbsoluteFill>
);
