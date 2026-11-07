import {C} from '../theme';

/** Smartphone 3D (CSS perspective) — l'écran reçoit les enfants */
export const Phone: React.FC<{
  width?: number;
  rotY?: number;
  rotX?: number;
  children: React.ReactNode;
  glow?: number;
}> = ({width = 460, rotY = 0, rotX = 0, children, glow = 0}) => {
  const h = width * 2.05;
  return (
    <div style={{perspective: 1600, width, height: h}}>
      <div
        style={{
          width,
          height: h,
          borderRadius: width * 0.14,
          background: 'linear-gradient(145deg,#2b2f3a,#0c0e14 60%,#3a3f4c)',
          padding: width * 0.035,
          transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`,
          transformStyle: 'preserve-3d',
          boxShadow: `0 60px 120px rgba(0,0,0,0.55), 0 0 0 3px rgba(255,255,255,0.08) inset, 0 0 ${120 * glow}px ${40 * glow}px rgba(255,201,40,${0.45 * glow})`,
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: width * 0.11,
            overflow: 'hidden',
            background: C.white,
            position: 'relative',
          }}
        >
          {children}
          {/* encoche */}
          <div
            style={{
              position: 'absolute',
              top: width * 0.025,
              left: '50%',
              width: width * 0.28,
              height: width * 0.07,
              transform: 'translateX(-50%)',
              background: '#0c0e14',
              borderRadius: 40,
              zIndex: 5,
            }}
          />
          {/* reflet */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 35%)',
              pointerEvents: 'none',
              zIndex: 6,
            }}
          />
        </div>
      </div>
    </div>
  );
};
