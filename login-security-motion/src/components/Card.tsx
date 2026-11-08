import { C, shadow } from "../theme";

export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: C.card,
      borderRadius: 36,
      boxShadow: shadow,
      border: `2px solid ${C.line}`,
      padding: 48,
      ...style,
    }}
  >
    {children}
  </div>
);
