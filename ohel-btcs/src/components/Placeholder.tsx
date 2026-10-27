import {AbsoluteFill} from 'remotion';
import {brand} from '../config/brand';
import {FONT} from '../lib/fonts';
import {useFormat} from '../lib/format';

/**
 * Espace réservé explicite pour un média manquant.
 * Jamais remplacé automatiquement par un visuel généré.
 */
export const Placeholder: React.FC<{expected: string; label: string; authentique?: boolean; compact?: boolean}> = ({
  expected,
  label,
  authentique,
  compact,
}) => {
  const {u, safe, vertical} = useFormat();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#3B3B3B',
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 28px)',
        border: `${6 * u}px solid #5A5A5A`,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        padding: compact ? 12 * u : `${safe.top}px ${safe.right}px ${safe.bottom}px ${safe.left}px`,
      }}
    >
      <div style={{textAlign: 'center', maxWidth: vertical ? 820 * u : 1200 * u}}>
        <div style={{color: brand.colors.red, fontWeight: 800, fontSize: 40 * u, letterSpacing: 2 * u}}>
          À FOURNIR{authentique ? ' — MÉDIA AUTHENTIQUE OHEL' : ''}
        </div>
        <div style={{color: '#FFFFFF', fontWeight: 600, fontSize: 34 * u, marginTop: 18 * u, wordBreak: 'break-all'}}>{expected}</div>
        <div style={{color: '#BDBDBD', fontWeight: 600, fontSize: 28 * u, marginTop: 14 * u, lineHeight: 1.3}}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};
