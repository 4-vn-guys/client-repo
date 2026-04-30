import { axiosInstance } from '@/shared/lib';
import type { UserNotification } from '../model/types';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export const fetchNotifications = async (): Promise<UserNotification[]> => {
  const response =
    await axiosInstance.get<ApiResponse<UserNotification[]>>('/notifications/');
  return response.data.data;
};

export const fetchUnreadCount = async (): Promise<number> => {
  const response = await axiosInstance.get<ApiResponse<{ count: number }>>(
    '/notifications/unread-count'
  );
  return response.data.data.count;
};

export const markNotificationRead = async (
  id: string
): Promise<UserNotification | null> => {
  const response = await axiosInstance.patch<ApiResponse<UserNotification | null>>(
    `/notifications/${id}/read`
  );
  return response.data.data;
};

export const markAllNotificationsRead = async (): Promise<number> => {
  const response = await axiosInstance.patch<ApiResponse<{ updated: number }>>(
    '/notifications/read-all'
  );
  return response.data.data.updated;
};

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

export const registerWebPushSubscription = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return false;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return false;
  }

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidPublicKey) {
    return false;
  }

  const registration = await navigator.serviceWorker.register('/service-worker.js');
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });

  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    return false;
  }

  await axiosInstance.post('/notifications/subscriptions', {
    endpoint: json.endpoint,
    keys: {
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
    },
    userAgent: navigator.userAgent,
  });

  return true;
};
