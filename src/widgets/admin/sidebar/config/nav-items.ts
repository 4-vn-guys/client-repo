import {
  BarChart3,
  Boxes,
  CreditCard,
  FileText,
  LayoutDashboard,
  Shield,
  Users,
  UsersRound,
  Zap,
} from 'lucide-react';

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
  {
    sectionKey: 'platform',
    items: [
      { labelKey: 'overview', href: '/admin/overview', icon: BarChart3 },
      { labelKey: 'modules', href: '/admin/modules', icon: Boxes },
      { labelKey: 'RBAC matrix', href: '/admin/rbac', icon: Shield },
      { labelKey: 'audit logs', href: '/admin/audit', icon: FileText },
      { labelKey: 'billing', href: '/admin/billing', icon: CreditCard },
      { labelKey: 'concurrency', href: '/admin/concurrency', icon: Zap },
    ],
  },
];
