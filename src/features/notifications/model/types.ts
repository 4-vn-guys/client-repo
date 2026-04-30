export type NotificationSeverity = 'info' | 'warning' | 'critical';
export type NotificationChannel = 'in_app' | 'email' | 'web_push';

export interface UserNotification {
  id: string;
  userId: string;
  type: string;
  severity: NotificationSeverity;
  channel: NotificationChannel;
  title: string;
  message: string;
  deepLink?: string | null;
  payload?: Record<string, unknown> | null;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
