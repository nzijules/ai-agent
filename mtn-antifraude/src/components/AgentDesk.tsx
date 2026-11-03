import React from 'react';
import {Person, PersonProps, SKINS} from './Person';
import {ConsoleScreen} from './UI';

export const HERO: Partial<PersonProps> = {skin: SKINS[1], hair: 'bun', outfit: '#FFCB05', accent: '#111', headset: true, earrings: true, seed: 2};

export const MONITOR = {x: 1000, y: 250, w: 820, h: 461};
export const MONITOR_CENTER = {x: MONITOR.x + MONITOR.w / 2, y: MONITOR.y + MONITOR.h / 2};

/** Agent Customer Services à son poste, écran en perspective. */
export const AgentDesk: React.FC<{
  t: number;
  person?: Partial<PersonProps>;
  console: React.ComponentProps<typeof ConsoleScreen>;
  screenOverlay?: React.ReactNode;
  dark?: boolean;
}> = ({t, person, console: cp, screenOverlay, dark}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <div style={{position: 'absolute', left: 230, top: 70}}>
      <Person t={t} width={820} {...HERO} {...person} />
    </div>
    {/* bureau */}
    <div style={{position: 'absolute', left: 0, top: 905, width: 1920, height: 175, background: dark ? 'linear-gradient(#24262c,#111214)' : 'linear-gradient(#8a6a4a,#5f4630)', boxShadow: '0 -10px 40px rgba(0,0,0,.35)'}} />
    <div style={{position: 'absolute', left: 520, top: 930, width: 520, height: 46, borderRadius: 10, background: '#222428', transform: 'perspective(600px) rotateX(55deg)'}} />
    {/* pied d'écran */}
    <div style={{position: 'absolute', left: 1380, top: 700, width: 70, height: 210, background: 'linear-gradient(90deg,#2b2d32,#17181b)'}} />
    <div style={{position: 'absolute', left: 1290, top: 890, width: 260, height: 26, borderRadius: 13, background: '#1b1c20'}} />
    {/* écran */}
    <div style={{position: 'absolute', left: MONITOR.x, top: MONITOR.y, width: MONITOR.w, height: MONITOR.h, perspective: 1800}}>
      <div style={{width: '100%', height: '100%', transform: 'rotateY(-14deg)', transformOrigin: '0% 50%', background: '#0d0d10', borderRadius: 16, padding: 14, boxShadow: '30px 40px 80px rgba(0,0,0,.45)'}}>
        <div style={{width: MONITOR.w - 28, height: MONITOR.h - 28, overflow: 'hidden', borderRadius: 6, position: 'relative'}}>
          <div style={{transform: `scale(${(MONITOR.w - 28) / 1920})`, transformOrigin: '0 0'}}>
            <ConsoleScreen {...cp} />
          </div>
          {screenOverlay}
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(255,255,255,.12), rgba(255,255,255,0) 40%)'}} />
        </div>
      </div>
    </div>
  </div>
);
