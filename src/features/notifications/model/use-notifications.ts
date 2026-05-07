import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '../api/notifications-api';
import type { UserNotification } from './types';

export const notificationsQueryKey = ['notifications'] as const;
export const unreadNotificationsQueryKey = [
  'notifications',
  'unread-count',
] as const;

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: notificationsQueryKey,
    queryFn: fetchNotifications,
    refetchInterval: 15000,
  });

  const unreadCountQuery = useQuery({
    queryKey: unreadNotificationsQueryKey,
    queryFn: fetchUnreadCount,
    refetchInterval: 15000,
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: updated => {
      queryClient.setQueryData<UserNotification[]>(
        notificationsQueryKey,
        current =>
          current?.map(item =>
            updated && item.id === updated.id
              ? { ...item, readAt: updated.readAt }
              : item
          ) ?? []
      );
      queryClient.invalidateQueries({ queryKey: unreadNotificationsQueryKey });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      const now = new Date().toISOString();
      queryClient.setQueryData<UserNotification[]>(
        notificationsQueryKey,
        current =>
          current?.map(item => ({ ...item, readAt: item.readAt ?? now })) ?? []
      );
      queryClient.setQueryData(unreadNotificationsQueryKey, 0);
      queryClient.invalidateQueries({ queryKey: unreadNotificationsQueryKey });
    },
  });

  return {
    notifications: notificationsQuery.data ?? [],
    unreadCount: unreadCountQuery.data ?? 0,
    isLoadingNotifications: notificationsQuery.isLoading,
    isLoadingUnreadCount: unreadCountQuery.isLoading,
    markRead: (id: string) => markReadMutation.mutateAsync(id),
    markAllRead: () => markAllReadMutation.mutateAsync(),
    isMarkingRead: markReadMutation.isPending || markAllReadMutation.isPending,
  };
};
