import type { CSSProperties, ReactNode, SVGProps } from 'react';

type IconProps = {
  d?: string;
  size?: number;
  stroke?: number;
  fill?: string;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
} & Omit<SVGProps<SVGSVGElement>, 'children' | 'style' | 'stroke' | 'fill'>;

function Icon({
  d,
  size = 18,
  stroke = 1.6,
  fill = 'none',
  children,
  style,
  className,
  ...rest
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill={fill}
      stroke='currentColor'
      strokeWidth={stroke}
      strokeLinecap='round'
      strokeLinejoin='round'
      style={style}
      className={className}
      {...rest}
    >
      {d ? <path d={d} /> : children}
    </svg>
  );
}

type Props = Omit<IconProps, 'd' | 'children'>;

export const CCIcons = {
  pin: (p: Props) => (
    <Icon {...p}>
      <path d='M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z' />
      <circle cx='12' cy='9' r='2.5' />
    </Icon>
  ),
  cal: (p: Props) => (
    <Icon {...p}>
      <rect x='3.5' y='5' width='17' height='15' rx='2.5' />
      <path d='M3.5 9.5h17M8 3v4M16 3v4' />
    </Icon>
  ),
  box: (p: Props) => (
    <Icon {...p}>
      <path d='M3.5 7.5l8.5-4 8.5 4v9l-8.5 4-8.5-4v-9z' />
      <path d='M3.5 7.5L12 11.5l8.5-4M12 11.5V21' />
    </Icon>
  ),
  users: (p: Props) => (
    <Icon {...p}>
      <circle cx='9' cy='8' r='3.5' />
      <path d='M2.5 19.5c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6' />
      <circle cx='17' cy='9' r='2.5' />
      <path d='M17 13.5c2.5 0 4.5 2 4.5 4.5' />
    </Icon>
  ),
  chart: (p: Props) => (
    <Icon {...p}>
      <path d='M4 19V9M10 19V5M16 19v-7M22 19H2' />
    </Icon>
  ),
  bell: (p: Props) => (
    <Icon {...p}>
      <path d='M6 16V11a6 6 0 1 1 12 0v5l1.5 2.5h-15L6 16z' />
      <path d='M10 20a2 2 0 0 0 4 0' />
    </Icon>
  ),
  cog: (p: Props) => (
    <Icon {...p}>
      <circle cx='12' cy='12' r='3' />
      <path d='M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z' />
    </Icon>
  ),
  search: (p: Props) => (
    <Icon {...p}>
      <circle cx='11' cy='11' r='7' />
      <path d='M20 20l-3.5-3.5' />
    </Icon>
  ),
  plus: (p: Props) => (
    <Icon {...p}>
      <path d='M12 5v14M5 12h14' />
    </Icon>
  ),
  clock: (p: Props) => (
    <Icon {...p}>
      <circle cx='12' cy='12' r='9' />
      <path d='M12 7v5l3 2' />
    </Icon>
  ),
  phone: (p: Props) => (
    <Icon {...p}>
      <path d='M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A14 14 0 0 1 4 7a3 3 0 0 1 1-3z' />
    </Icon>
  ),
  cart: (p: Props) => (
    <Icon {...p}>
      <path d='M3 4h2l2.5 12.5a2 2 0 0 0 2 1.5h8a2 2 0 0 0 2-1.5L21 8H6' />
      <circle cx='9' cy='21' r='1.2' />
      <circle cx='18' cy='21' r='1.2' />
    </Icon>
  ),
  qr: (p: Props) => (
    <Icon {...p}>
      <rect x='3' y='3' width='7' height='7' rx='1' />
      <rect x='14' y='3' width='7' height='7' rx='1' />
      <rect x='3' y='14' width='7' height='7' rx='1' />
      <path d='M14 14h3v3M21 14v0M14 21h3M21 17v4' />
    </Icon>
  ),
  bolt: (p: Props) => (
    <Icon {...p}>
      <path d='M13 2L4 13h7l-1 9 9-11h-7l1-9z' />
    </Icon>
  ),
  shield: (p: Props) => (
    <Icon {...p}>
      <path d='M12 3l8 3v6c0 5-3.5 8.5-8 9.5-4.5-1-8-4.5-8-9.5V6l8-3z' />
    </Icon>
  ),
  trophy: (p: Props) => (
    <Icon {...p}>
      <path d='M7 4h10v4a5 5 0 0 1-10 0V4zM7 6H4a3 3 0 0 0 3 3M17 6h3a3 3 0 0 1-3 3M9 21h6M12 13v8' />
    </Icon>
  ),
  msg: (p: Props) => (
    <Icon {...p}>
      <path d='M4 5h16v11H8l-4 4V5z' />
    </Icon>
  ),
  map: (p: Props) => (
    <Icon {...p}>
      <path d='M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z' />
      <path d='M9 3v15M15 6v15' />
    </Icon>
  ),
  filter: (p: Props) => (
    <Icon {...p}>
      <path d='M3 5h18l-7 8v6l-4-2v-4L3 5z' />
    </Icon>
  ),
  star: (p: Props) => (
    <Icon {...p}>
      <path d='M12 3l2.6 5.6 6.4.8-4.8 4.4 1.3 6.2L12 17l-5.5 3 1.3-6.2L3 9.4l6.4-.8L12 3z' />
    </Icon>
  ),
  check: (p: Props) => (
    <Icon {...p}>
      <path d='M5 12.5l4.5 4.5L20 6.5' />
    </Icon>
  ),
  x: (p: Props) => (
    <Icon {...p}>
      <path d='M5 5l14 14M19 5L5 19' />
    </Icon>
  ),
  arrow: (p: Props) => (
    <Icon {...p}>
      <path d='M5 12h14M13 6l6 6-6 6' />
    </Icon>
  ),
  lock: (p: Props) => (
    <Icon {...p}>
      <rect x='4.5' y='11' width='15' height='9' rx='2' />
      <path d='M8 11V7a4 4 0 0 1 8 0v4' />
    </Icon>
  ),
  edit: (p: Props) => (
    <Icon {...p}>
      <path d='M5 19h4l10-10-4-4L5 15v4z' />
    </Icon>
  ),
  trash: (p: Props) => (
    <Icon {...p}>
      <path d='M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6' />
    </Icon>
  ),
  drag: (p: Props) => (
    <Icon {...p}>
      <circle cx='9' cy='6' r='1.2' />
      <circle cx='15' cy='6' r='1.2' />
      <circle cx='9' cy='12' r='1.2' />
      <circle cx='15' cy='12' r='1.2' />
      <circle cx='9' cy='18' r='1.2' />
      <circle cx='15' cy='18' r='1.2' />
    </Icon>
  ),
  send: (p: Props) => (
    <Icon {...p}>
      <path d='M3 11l18-8-7 18-3-7-8-3z' />
    </Icon>
  ),
  card: (p: Props) => (
    <Icon {...p}>
      <rect x='3' y='6' width='18' height='13' rx='2' />
      <path d='M3 10h18M7 16h3' />
    </Icon>
  ),
  globe: (p: Props) => (
    <Icon {...p}>
      <circle cx='12' cy='12' r='9' />
      <path d='M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18' />
    </Icon>
  ),
  mail: (p: Props) => (
    <Icon {...p}>
      <rect x='3' y='5' width='18' height='14' rx='2' />
      <path d='M3 7l9 7 9-7' />
    </Icon>
  ),
  badge: (p: Props) => (
    <Icon {...p}>
      <circle cx='12' cy='9' r='5' />
      <path d='M9 13l-2 8 5-3 5 3-2-8' />
    </Icon>
  ),
  spark: (p: Props) => (
    <Icon {...p}>
      <path d='M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4' />
    </Icon>
  ),
} as const;

export type CCIconKey = keyof typeof CCIcons;
