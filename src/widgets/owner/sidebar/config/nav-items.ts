import type { ComponentType, SVGProps } from 'react';
import {
  Bell,
  BarChart3,
  Calendar,
  MapPin,
  Package,
  Puzzle,
  QrCode,
  Settings,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

export const ownerTimelinePathPattern = /^\/owner\/[^/]+\/timeline$/;
const ownerProShopPathPattern = /^\/owner\/[^/]+\/pro-shop$/;

export type OwnerNavItem = {
  labelKey: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  badgeKey?: string;
  featureKey?: string;
  isActive?: (pathname: string) => boolean;
  /** Hidden from branch staff viewers (account role 'user'). */
  ownerOnly?: boolean;
  /** Staff only see this item when their membership grants the permission. */
  staffPermission?: string;
};

export type OwnerNavSection = {
  sectionKey: string;
  items: OwnerNavItem[];
};

export const ownerNavItems: OwnerNavSection[] = [
  {
    sectionKey: 'management',
    items: [
      {
        labelKey: 'branches',
        href: '/owner/branches',
        icon: MapPin,
        staffPermission: 'bookings:read',
      },
      {
        labelKey: 'schedule',
        href: '/owner/branches?picker=schedule',
        icon: Calendar,
        isActive: (pathname: string) => ownerTimelinePathPattern.test(pathname),
        staffPermission: 'bookings:read',
      },
      {
        labelKey: 'yield',
        href: '/owner/yield',
        icon: Zap,
        badgeKey: 'badgeAi',
        featureKey: 'yield',
        ownerOnly: true,
      },
      {
        labelKey: 'tournaments',
        href: '/owner/tournaments',
        icon: Trophy,
        featureKey: 'tournament',
        ownerOnly: true,
      },
      {
        // "Team & coaches" — branch staff manager. Backed by
        // `/branches/:id/staff` which is open to all owners; no module gate.
        labelKey: 'members',
        href: '/owner/members',
        icon: Users,
        ownerOnly: true,
      },
      {
        labelKey: 'proShop',
        href: '/owner/pro-shop',
        icon: Package,
        featureKey: 'pro_shop',
        ownerOnly: true,
        isActive: (pathname: string) =>
          pathname === '/owner/pro-shop' ||
          ownerProShopPathPattern.test(pathname),
      },
      {
        labelKey: 'checkin',
        href: '/owner/checkin',
        icon: QrCode,
        staffPermission: 'checkins:read',
      },
      { labelKey: 'reports', href: '/owner/reports', icon: BarChart3, ownerOnly: true },
      { labelKey: 'branding', href: '/owner/branding', icon: Sparkles, ownerOnly: true },
      // Module marketplace — always visible so owners can unlock gated modules.
      { labelKey: 'modules', href: '/owner/modules', icon: Puzzle, ownerOnly: true },
    ],
  },
];

export const ownerBottomNavItems: OwnerNavItem[] = [
  { labelKey: 'notifications', href: '/owner/notifications', icon: Bell },
  { labelKey: 'settings', href: '/owner/settings', icon: Settings },
];
