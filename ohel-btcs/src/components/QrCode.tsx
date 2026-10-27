import QRCode from 'qrcode';
import {useMemo} from 'react';

/** QR code vectoriel net (pas d'image, pas d'appel réseau). */
export const QrCode: React.FC<{value: string; size: number; color?: string}> = ({value, size, color = '#111111'}) => {
  const qr = useMemo(() => QRCode.create(value, {errorCorrectionLevel: 'M'}), [value]);
  const n = qr.modules.size;
  const quiet = 2;
  const rects: React.ReactNode[] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (qr.modules.get(x, y)) rects.push(<rect key={`${x}-${y}`} x={x + quiet} y={y + quiet} width={1.02} height={1.02} />);
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${n + quiet * 2} ${n + quiet * 2}`} shapeRendering="crispEdges">
      <rect width="100%" height="100%" fill="#FFFFFF" />
      <g fill={color}>{rects}</g>
    </svg>
  );
};
