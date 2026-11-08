type P = { size?: number; color?: string; stroke?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
});

export const LockIcon: React.FC<P & { open?: boolean }> = ({
  size = 48,
  color = "currentColor",
  stroke = 2,
  open,
}) => (
  <svg
    {...base(size)}
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="11" width="16" height="10" rx="2.5" />
    <path d={open ? "M8 11V7a4 4 0 0 1 7.5-2" : "M8 11V7a4 4 0 0 1 8 0v4"} />
    <circle cx="12" cy="16" r="1.3" fill={color} />
  </svg>
);

export const ShieldIcon: React.FC<P> = ({
  size = 48,
  color = "currentColor",
  stroke = 2,
}) => (
  <svg
    {...base(size)}
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6l8-3z" />
    <path d="M8.5 12l2.5 2.5 4.5-5" />
  </svg>
);

export const AlertIcon: React.FC<P> = ({
  size = 48,
  color = "currentColor",
  stroke = 2,
}) => (
  <svg
    {...base(size)}
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3.5L2.5 20h19L12 3.5z" />
    <path d="M12 10v4.5" />
    <circle cx="12" cy="17.3" r="0.6" fill={color} />
  </svg>
);

export const CheckIcon: React.FC<P> = ({
  size = 48,
  color = "currentColor",
  stroke = 2.4,
}) => (
  <svg
    {...base(size)}
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const XIcon: React.FC<P> = ({
  size = 48,
  color = "currentColor",
  stroke = 2.4,
}) => (
  <svg
    {...base(size)}
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const BotIcon: React.FC<P> = ({
  size = 48,
  color = "currentColor",
  stroke = 2,
}) => (
  <svg
    {...base(size)}
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="8" width="16" height="11" rx="3" />
    <path d="M12 4v4" />
    <circle cx="12" cy="3.5" r="1" fill={color} />
    <circle cx="9" cy="13.5" r="1.3" fill={color} />
    <circle cx="15" cy="13.5" r="1.3" fill={color} />
    <path d="M2 13v2M22 13v2" />
  </svg>
);

export const ServerIcon: React.FC<P> = ({
  size = 48,
  color = "currentColor",
  stroke = 2,
}) => (
  <svg
    {...base(size)}
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3.5" y="4" width="17" height="7" rx="2" />
    <rect x="3.5" y="13" width="17" height="7" rx="2" />
    <circle cx="7.5" cy="7.5" r="0.8" fill={color} />
    <circle cx="7.5" cy="16.5" r="0.8" fill={color} />
  </svg>
);

export const BrowserIcon: React.FC<P> = ({
  size = 48,
  color = "currentColor",
  stroke = 2,
}) => (
  <svg
    {...base(size)}
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
    <path d="M3 9h18" />
    <circle cx="6" cy="6.8" r="0.5" fill={color} />
    <circle cx="8" cy="6.8" r="0.5" fill={color} />
  </svg>
);

export const MailIcon: React.FC<P> = ({
  size = 48,
  color = "currentColor",
  stroke = 2,
}) => (
  <svg
    {...base(size)}
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </svg>
);

export const ChatIcon: React.FC<P> = ({
  size = 48,
  color = "currentColor",
  stroke = 2,
}) => (
  <svg
    {...base(size)}
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 5.5h16v10H9l-5 4v-14z" />
    <path d="M8 10h8M8 13h5" />
  </svg>
);

export const CardIcon: React.FC<P> = ({
  size = 48,
  color = "currentColor",
  stroke = 2,
}) => (
  <svg
    {...base(size)}
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="M3 10h18M7 15h4" />
  </svg>
);

export const PhoneIcon: React.FC<P> = ({
  size = 48,
  color = "currentColor",
  stroke = 2,
}) => (
  <svg
    {...base(size)}
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <path d="M10.5 18.5h3" />
  </svg>
);
