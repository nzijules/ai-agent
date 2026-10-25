import {coverRatio} from '../coverRatio';
import React from 'react';
import {Img, staticFile} from 'remotion';
import {adConfig} from '../config';
import {colors, fonts} from '../theme';

/**
 * Couverture de l'ebook.
 * - Si `adConfig.book.coverImage` est renseigné → image officielle.
 * - Sinon → couverture provisoire vectorielle (ratio 2:3).
 */
export const Cover: React.FC<{width: number}> = ({width}) => {
  const h = width * coverRatio();
  const u = width / 100; // unité relative
  const b = adConfig.book;

  if (b.coverImage) {
    return <Img src={staticFile(b.coverImage)} style={{width, height: h, objectFit: 'cover', display: 'block'}} />;
  }

  return (
    <div
      style={{
        width,
        height: h,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #1840A8 0%, #0E2466 45%, #081436 100%)',
        fontFamily: fonts.display,
      }}
    >
      {/* Décor : cercles et halo */}
      <div
        style={{
          position: 'absolute',
          width: 120 * u,
          height: 120 * u,
          right: -45 * u,
          top: -30 * u,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.sky}55 0%, transparent 60%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 95 * u,
          height: 95 * u,
          left: -40 * u,
          bottom: -20 * u,
          borderRadius: '50%',
          border: `${0.5 * u}px solid ${colors.mint}44`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 70 * u,
          height: 70 * u,
          left: -27 * u,
          bottom: -7 * u,
          borderRadius: '50%',
          border: `${0.5 * u}px solid ${colors.amber}33`,
        }}
      />

      {/* Illustration : livre ouvert + ampoule + bulle de dialogue */}
      <svg viewBox="0 0 200 140" style={{position: 'absolute', left: 18 * u, top: 88 * u, width: 64 * u}}>
        <defs>
          <linearGradient id="cvBulb" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={colors.amber} />
            <stop offset="1" stopColor="#FF8A3D" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="46" r="40" fill={colors.amber} opacity="0.12" />
        {/* rayons */}
        {[-60, -30, 0, 30, 60].map((a) => (
          <line
            key={a}
            x1={100 + Math.sin((a * Math.PI) / 180) * 34}
            y1={46 - Math.cos((a * Math.PI) / 180) * 34}
            x2={100 + Math.sin((a * Math.PI) / 180) * 44}
            y2={46 - Math.cos((a * Math.PI) / 180) * 44}
            stroke={colors.amber}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        ))}
        <path d="M100 18 a22 22 0 0 1 13 40 v8 h-26 v-8 a22 22 0 0 1 13 -40z" fill="url(#cvBulb)" />
        <rect x="88" y="69" width="24" height="6" rx="3" fill="#FFE2B0" />
        <rect x="91" y="77" width="18" height="5" rx="2.5" fill="#FFE2B0" />
        {/* livre ouvert */}
        <path d="M30 100 Q65 86 100 102 Q135 86 170 100 L170 128 Q135 114 100 130 Q65 114 30 128 Z" fill="#F5F7FF" />
        <path d="M100 102 L100 130" stroke="#C9D3F5" strokeWidth="2" />
        <path d="M44 104 Q68 96 90 106 M44 112 Q68 104 90 114 M110 106 Q132 96 156 104 M110 114 Q132 104 156 112" stroke="#B9C6F0" strokeWidth="2" fill="none" />
        {/* bulle de dialogue */}
        <rect x="140" y="20" width="46" height="30" rx="10" fill={colors.mint} />
        <path d="M150 50 l-4 10 l12 -10z" fill={colors.mint} />
        <circle cx="153" cy="35" r="3.2" fill={colors.ink} />
        <circle cx="163" cy="35" r="3.2" fill={colors.ink} />
        <circle cx="173" cy="35" r="3.2" fill={colors.ink} />
      </svg>

      {/* Bandeau supérieur */}
      <div style={{position: 'absolute', left: 9 * u, right: 9 * u, top: 9 * u}}>
        <div
          style={{
            display: 'inline-block',
            padding: `${1.6 * u}px ${3.2 * u}px`,
            borderRadius: 2 * u,
            background: `${colors.amber}22`,
            border: `${0.35 * u}px solid ${colors.amber}88`,
            color: colors.amber,
            fontSize: 3.6 * u,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {b.coverKicker}
        </div>
        <div style={{marginTop: 6 * u, color: colors.white, fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.03em'}}>
          <div style={{fontSize: 12.5 * u}}>{b.coverTitleTop}</div>
          <div style={{fontSize: 12.5 * u}}>{b.coverTitleMiddle}</div>
          <div style={{fontSize: 10 * u, color: colors.amber, marginTop: 1.8 * u}}>{b.coverTitleAccent}</div>
        </div>
        <div
          style={{
            marginTop: 4 * u,
            width: 16 * u,
            height: 0.9 * u,
            borderRadius: u,
            background: colors.mint,
          }}
        />
        <div style={{marginTop: 3.5 * u, color: 'rgba(235,240,255,0.85)', fontFamily: fonts.body, fontSize: 4.3 * u, fontWeight: 500, lineHeight: 1.3, maxWidth: 70 * u}}>
          {b.coverSubtitle}
        </div>
      </div>

      {b.coverAuthor ? (
        <div
          style={{
            position: 'absolute',
            left: 9 * u,
            right: 9 * u,
            bottom: 7 * u,
            color: 'rgba(235,240,255,0.8)',
            fontFamily: fonts.body,
            fontSize: 3.8 * u,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textAlign: 'center',
          }}
        >
          {b.coverAuthor}
        </div>
      ) : null}
      {/* Liseré intérieur */}
      <div style={{position: 'absolute', inset: 3 * u, border: `${0.25 * u}px solid rgba(255,255,255,0.12)`, borderRadius: u}} />
    </div>
  );
};
