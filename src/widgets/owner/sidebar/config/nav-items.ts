import { Calendar, MapPin, Users, BarChart3, Settings } from 'lucide-react';

const ownerTimelinePathPattern = /^\/owner\/[^/]+\/timeline$/;

export const ownerNavItems = [
  {
    sectionKey: 'management',
    items: [
      { labelKey: 'branches', href: '/owner/branches', icon: MapPin },
      {
        labelKey: 'timelineView',
        href: '/owner/branches',
        icon: Calendar,
        isActive: (pathname: string) => ownerTimelinePathPattern.test(pathname),
      },
      { labelKey: 'members', href: '/owner/members', icon: Users },
      { labelKey: 'reports', href: '/owner/reports', icon: BarChart3 },
    ],
  },
];

export const ownerBottomNavItems = [
  { labelKey: 'settings', href: '/owner/settings', icon: Settings },
];
