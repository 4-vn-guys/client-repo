import { Calendar, MapPin, Users, BarChart3, Settings } from 'lucide-react';

export const ownerNavItems = [
  {
    section: 'MANAGEMENT',
    items: [
      { label: 'Timeline View', href: '/owner/timeline', icon: Calendar },
      { label: 'Court Status', href: '/owner/court-status', icon: MapPin },
      { label: 'Members', href: '/owner/members', icon: Users },
      { label: 'Reports', href: '/owner/reports', icon: BarChart3 },
    ],
  },
];

export const ownerBottomNavItems = [
  { label: 'Settings', href: '/owner/settings', icon: Settings },
];
