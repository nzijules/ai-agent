import React from 'react';
import {colors, fonts} from '../theme';

export const glass: React.CSSProperties = {
  background: 'linear-gradient(150deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 100%)',
  border: `2px solid ${colors.glassBorder}`,
  boxShadow: '0 30px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
  backdropFilter: 'blur(18px)',
};

export const Pill: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({
  children,
  size,
  color = colors.mint,
  style,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.45,
      padding: `${size * 0.42}px ${size * 0.9}px`,
      borderRadius: 999,
      background: `${color}1F`,
      border: `2px solid ${color}88`,
      color,
      fontFamily: fonts.display,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);
