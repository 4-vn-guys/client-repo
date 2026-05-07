/**
 * User Profile Types
 * Types for user profile menu items and actions
 */

export type UserProfileAction =
  | 'view-profile'
  | 'edit-profile'
  | 'settings'
  | 'logout';

export interface UserProfileMenuItem {
  id: UserProfileAction;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export interface UserProfileProps {
  name: string;
  email?: string;
  role: string;
  avatar?: string;
}
