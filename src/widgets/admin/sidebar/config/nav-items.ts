import { BarChart3, LayoutDashboard, Users, UsersRound } from 'lucide-react';

export const adminNavItems = [
  {
    sectionKey: 'admin',
    items: [
      { labelKey: 'dashboard', href: '/admin', icon: LayoutDashboard },
      { labelKey: 'users', href: '/admin/users', icon: Users },
      { labelKey: 'ownerGroups', href: '/admin/groups', icon: UsersRound },
      { labelKey: 'revenue', href: '/admin/revenue', icon: BarChart3 },
    ],
  },
];
