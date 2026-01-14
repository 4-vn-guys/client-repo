import { Calendar, MapPin, Users, BarChart3, Settings } from 'lucide-react';

export const ownerNavItems = [
  {
    section: 'MANAGEMENT',
    items: [
      { label: 'Venues', href: '/owner/venues', icon: MapPin },
      { label: 'Timeline View', href: '/owner/timeline', icon: Calendar },
      { label: 'Members', href: '/owner/members', icon: Users },
      { label: 'Reports', href: '/owner/reports', icon: BarChart3 },
    ],
  },
];

export const ownerBottomNavItems = [
  { label: 'Settings', href: '/owner/settings', icon: Settings },
];
