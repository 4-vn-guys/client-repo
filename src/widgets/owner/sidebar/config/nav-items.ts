import { Calendar, MapPin, Users, BarChart3, Settings } from 'lucide-react';

export const ownerNavItems = [
  {
    section: 'MANAGEMENT',
    items: [
      { label: 'Branches', href: '/owner/branches', icon: MapPin },
      { label: 'Timeline View', href: '/owner/branches', icon: Calendar },
      { label: 'Members', href: '/owner/members', icon: Users },
      { label: 'Reports', href: '/owner/reports', icon: BarChart3 },
    ],
  },
];

export const ownerBottomNavItems = [
  { label: 'Settings', href: '/owner/settings', icon: Settings },
];
