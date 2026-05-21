import type { ComponentType, SVGProps } from 'react';
import {
  Bell,
  BarChart3,
  Calendar,
  CalendarClock,
  MapPin,
  Package,
  QrCode,
  Settings,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

const ownerTimelinePathPattern = /^\/owner\/[^/]+\/timeline$/;
const ownerProShopPathPattern = /^\/owner\/[^/]+\/pro-shop$/;

export type OwnerNavItem = {
  labelKey: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  badgeKey?: string;
  featureKey?: string;
  isActive?: (pathname: string) => boolean;
};

export type OwnerNavSection = {
  sectionKey: string;
  items: OwnerNavItem[];
};

export const ownerNavItems: OwnerNavSection[] = [
  {
    sectionKey: 'management',
    items: [
      { labelKey: 'branches', href: '/owner/branches', icon: MapPin },
      { labelKey: 'schedule', href: '/owner/schedule', icon: Calendar },
      {
        labelKey: 'timelineView',
        href: '/owner/branches',
        icon: CalendarClock,
        isActive: (pathname: string) => ownerTimelinePathPattern.test(pathname),
      },
      {
        labelKey: 'yield',
        href: '/owner/yield',
        icon: Zap,
        badgeKey: 'badgeAi',
      },
      { labelKey: 'tournaments', href: '/owner/tournaments', icon: Trophy },
      { labelKey: 'members', href: '/owner/members', icon: Users },
      {
        labelKey: 'proShop',
        href: '/owner/pro-shop',
        icon: Package,
        featureKey: 'pro_shop',
        isActive: (pathname: string) =>
          pathname === '/owner/pro-shop' ||
          ownerProShopPathPattern.test(pathname),
      },
      { labelKey: 'checkin', href: '/owner/checkin', icon: QrCode },
      { labelKey: 'reports', href: '/owner/reports', icon: BarChart3 },
      { labelKey: 'branding', href: '/owner/branding', icon: Sparkles },
    ],
  },
];

export const ownerBottomNavItems: OwnerNavItem[] = [
  { labelKey: 'notifications', href: '/owner/notifications', icon: Bell },
  { labelKey: 'settings', href: '/owner/settings', icon: Settings },
];
