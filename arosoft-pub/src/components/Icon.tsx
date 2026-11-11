import React from "react";

export type IconName = "play" | "chat" | "sparkle" | "check" | "star" | "download" | "terminal" | "wand" | "film" | "bulb" | "send" | "heart";

/** Jeu d'icônes vectorielles (traits arrondis, style pro). */
export const Icon: React.FC<{ name: IconName; size?: number; color?: string; stroke?: number }> = ({ name, size = 48, color = "#fff", stroke = 2.2 }) => {
  const p = { fill: "none", stroke: color, strokeWidth: stroke, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<IconName, React.ReactNode> = {
    play: <path d="M8 5.5v13l11-6.5z" {...p} fill={color} />,
    chat: <path d="M4 5h16v10H9l-5 4z" {...p} />,
    sparkle: <path d="M12 3l2 6.5L20.5 12 14 14l-2 7-2-7-6.5-2L10 9.5z" {...p} fill={color} />,
    check: <path d="M5 12.5l4.5 4.5L19 7.5" {...p} />,
    star: <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z" {...p} />,
    download: <><path d="M12 4v11M7 10.5l5 5 5-5" {...p} /><path d="M5 19.5h14" {...p} /></>,
    terminal: <><rect x="3" y="4.5" width="18" height="15" rx="2.5" {...p} /><path d="M7 10l3 2.5L7 15M12.5 15.5H17" {...p} /></>,
    wand: <><path d="M4 20L15 9" {...p} /><path d="M17 3v3M15.5 4.5h3M20 8v2M19 9h2M12 4v2M11 5h2" {...p} /></>,
    film: <><rect x="3" y="5" width="18" height="14" rx="2.5" {...p} /><path d="M3 9.5h18M7.5 5l2 4.5M12.5 5l2 4.5M17.5 5l2 4.5" {...p} /><path d="M10 12.5v4l3.5-2z" {...p} fill={color} /></>,
    bulb: <><path d="M9 17.5h6M10 20.5h4" {...p} /><path d="M12 3.5a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-.6c0-.8.4-1.5 1-2A6 6 0 0 0 12 3.5z" {...p} /></>,
    send: <path d="M4 12l16-7-6 15-2.5-6.5z" {...p} />,
    heart: <path d="M12 19.5s-7-4.3-7-9.3A4 4 0 0 1 12 8a4 4 0 0 1 7 2.2c0 5-7 9.3-7 9.3z" {...p} />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
};
