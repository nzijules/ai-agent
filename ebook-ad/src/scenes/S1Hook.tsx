import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeOut, sp, SPRING_POP, SPRING_SOFT} from '../anim';
import {Cursor, Sparkle} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {SceneWrap} from '../components/SceneWrap';
import {glass} from '../components/ui';
import {adConfig} from '../config';
import {useFormat} from '../format';
import {colors, fonts} from '../theme';

const c = adConfig.scene1;

/** Fenêtre de discussion générique (aucun logo de marque). */
const ChatMock: React.FC<{frame: number; w: number}> = ({frame, w}) => {
  const u = w / 100;
  const enter = sp(frame, 16, SPRING_SOFT);
  const typed = Math.floor(interpolate(frame, [26, 54], [0, c.chatQuestion.length], clamp));
  const lines = [0.92, 0.78, 0.86, 0.6];
  const copyP = interpolate(frame, [100, 106], [0, 1], clamp);
  const cursorP = interpolate(frame, [86, 100], [0, 1], {...clamp, easing: easeOut});
  const press = frame >= 100 && frame < 106 ? 0.9 : 1;
  // Mise au point : la fenêtre recule quand la question clé apparaît
  const focus = interpolate(frame, [84, 104], [0, 1], {...clamp, easing: easeOut});
  return (
    <div
      style={{
        ...glass,
        width: w,
        borderRadius: 5 * u,
        padding: 5 * u,
        transform: `translateY(${(1 - enter) * 120}px) rotateX(${(1 - enter) * 18}deg) scale(${1 - 0.14 * focus})`,
        transformOrigin: 'top center',
        opacity: enter * (1 - 0.45 * focus),
        filter: focus > 0.01 ? `blur(${focus * 3}px)` : undefined,
        position: 'relative',
        fontFamily: fonts.body,
      }}
    >
      {/* barre de titre */}
      <div style={{display: 'flex', alignItems: 'center', gap: 2.2 * u, marginBottom: 4.5 * u}}>
        <div
          style={{
            width: 9 * u,
            height: 9 * u,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.mint}, ${colors.sky})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sparkle size={5.4 * u} color={colors.ink} />
        </div>
        <div style={{color: colors.white, fontWeight: 600, fontSize: 4.4 * u}}>Assistant IA</div>
        <div style={{marginLeft: 'auto', display: 'flex', gap: 1.5 * u}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{width: 2.2 * u, height: 2.2 * u, borderRadius: '50%', background: 'rgba(255,255,255,0.3)'}} />
          ))}
        </div>
      </div>
      {/* question de l'élève */}
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 4 * u}}>
        <div
          style={{
            maxWidth: 78 * u,
            background: colors.indigo,
            color: colors.white,
            fontSize: 4.6 * u,
            fontWeight: 500,
            lineHeight: 1.35,
            padding: `${3 * u}px ${4 * u}px`,
            borderRadius: `${4 * u}px ${4 * u}px ${u}px ${4 * u}px`,
            opacity: frame > 24 ? 1 : 0,
            minHeight: 6 * u,
          }}
        >
          {c.chatQuestion.slice(0, typed)}
          <span style={{opacity: typed < c.chatQuestion.length && Math.floor(frame / 4) % 2 === 0 ? 1 : 0}}>|</span>
        </div>
      </div>
      {/* réponse générée */}
      <div
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1.5px solid rgba(255,255,255,0.1)',
          borderRadius: `${4 * u}px ${4 * u}px ${4 * u}px ${u}px`,
          padding: `${3.5 * u}px ${4 * u}px`,
          opacity: interpolate(frame, [56, 62], [0, 1], clamp),
        }}
      >
        <div style={{color: colors.mint, fontSize: 3.6 * u, fontWeight: 600, marginBottom: 2.5 * u, letterSpacing: '0.04em', textTransform: 'uppercase'}}>
          {c.chatAnswerLabel}
        </div>
        {lines.map((l, i) => {
          const g = interpolate(frame, [60 + i * 6, 70 + i * 6], [0, 1], {...clamp, easing: easeOut});
          return (
            <div
              key={i}
              style={{
                height: 2.6 * u,
                width: `${l * 100 * g}%`,
                borderRadius: 2 * u,
                background: 'rgba(255,255,255,0.32)',
                marginBottom: 2.2 * u,
              }}
            />
          );
        })}
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 1.5 * u}}>
          <div
            style={{
              fontSize: 3.8 * u,
              fontWeight: 700,
              padding: `${1.6 * u}px ${3.6 * u}px`,
              borderRadius: 999,
              transform: `scale(${press})`,
              background: copyP > 0 ? colors.coral : 'rgba(255,255,255,0.12)',
              color: colors.white,
              opacity: interpolate(frame, [80, 86], [0, 1], clamp),
            }}
          >
            {copyP > 0 ? 'Copié !' : 'Copier'}
          </div>
        </div>
      </div>
      {/* curseur */}
      <div
        style={{
          position: 'absolute',
          right: interpolate(cursorP, [0, 1], [-10 * u, 9 * u]),
          bottom: interpolate(cursorP, [0, 1], [-14 * u, 2 * u]),
          opacity: interpolate(frame, [86, 90, 128, 134], [0, 1, 1, 0], clamp),
          transform: `scale(${press})`,
        }}
      >
        <Cursor size={9 * u} />
      </div>
    </div>
  );
};

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const fmt = useFormat();
  const push = interpolate(frame, [0, 150], [1, 1.05]);
  const q = sp(frame, 92, SPRING_POP);

  if (fmt.vertical) {
    return (
      <SceneWrap noEnter>
        <AbsoluteFill style={{transform: `scale(${push})`}}>
          <div style={{position: 'absolute', top: fmt.safeTop + 20, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'center'}}>
            <KineticText text={c.line1} size={96} delay={0} stagger={3} maxWidth={900} />
          </div>
          <div style={{position: 'absolute', top: 560, left: 140, right: 140, perspective: 1200}}>
            <ChatMock frame={frame} w={800} />
          </div>
          <div style={{position: 'absolute', top: 1125, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'center', transform: `scale(${0.9 + 0.1 * q})`}}>
            <KineticText text={c.line2} size={104} delay={84} stagger={4} highlight={[c.highlight]} marker markerDelay={104} maxWidth={900} />
          </div>
        </AbsoluteFill>
      </SceneWrap>
    );
  }

  return (
    <SceneWrap noEnter>
      <AbsoluteFill style={{transform: `scale(${push})`}}>
        <div style={{position: 'absolute', top: 70, left: 70, right: 70, display: 'flex', justifyContent: 'center'}}>
          <KineticText text={c.line1} size={64} delay={0} stagger={3} maxWidth={940} />
        </div>
        <div style={{position: 'absolute', top: 250, left: 280, right: 280, perspective: 1200}}>
          <ChatMock frame={frame} w={520} />
        </div>
        <div style={{position: 'absolute', top: 720, left: 70, right: 70, display: 'flex', justifyContent: 'center', transform: `scale(${0.9 + 0.1 * q})`}}>
          <KineticText text={c.line2} size={76} delay={84} stagger={4} highlight={[c.highlight]} marker markerDelay={104} maxWidth={940} />
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};
