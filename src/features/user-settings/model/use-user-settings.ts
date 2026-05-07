import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';
import { useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { fetchUserSettings, updateUserSettings } from '../api/settings-api';
import type {
  SettingsLanguageCode,
  UpdateUserSettingsDto,
  UserSettings,
} from './types';
import { applyLayoutSettings } from './settings-sync';

export const userSettingsQueryKey = ['user-settings'] as const;

export const useUserSettings = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setTheme } = useTheme();
  const locale = useLocale();
  const tSettings = useTranslations('OwnerSettingsPage');
  const lastLanguageRef = useRef<SettingsLanguageCode | null>(null);

  const settingsQuery = useQuery({
    queryKey: userSettingsQueryKey,
    queryFn: fetchUserSettings,
  });

  useEffect(() => {
    if (!settingsQuery.data) return;

    setTheme(settingsQuery.data.theme);
    applyLayoutSettings(settingsQuery.data);

    if (lastLanguageRef.current === null) {
      lastLanguageRef.current = settingsQuery.data.languageCode;
      document.cookie = `locale=${settingsQuery.data.languageCode}; path=/; max-age=31536000`;
      if (locale !== settingsQuery.data.languageCode) {
        router.refresh();
      }
      return;
    }

    if (lastLanguageRef.current !== settingsQuery.data.languageCode) {
      lastLanguageRef.current = settingsQuery.data.languageCode;
      document.cookie = `locale=${settingsQuery.data.languageCode}; path=/; max-age=31536000`;
      router.refresh();
    }
  }, [locale, router, setTheme, settingsQuery.data]);

  const updateSettingsMutation = useMutation({
    mutationFn: updateUserSettings,
    onMutate: async patch => {
      await queryClient.cancelQueries({ queryKey: userSettingsQueryKey });

      const previousSettings =
        queryClient.getQueryData<UserSettings>(userSettingsQueryKey);

      if (previousSettings) {
        const optimisticSettings = { ...previousSettings, ...patch };
        queryClient.setQueryData<UserSettings>(
          userSettingsQueryKey,
          optimisticSettings
        );
      }

      return { previousSettings };
    },
    onError: (_error, _patch, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData<UserSettings>(
          userSettingsQueryKey,
          context.previousSettings
        );
      }
      toast.error(tSettings('saveError'));
    },
    onSuccess: settings => {
      queryClient.setQueryData<UserSettings>(userSettingsQueryKey, settings);
      toast.success(tSettings('saveSuccess'));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userSettingsQueryKey });
    },
  });

  const updateSettings = (patch: UpdateUserSettingsDto) =>
    updateSettingsMutation.mutateAsync(patch);

  return {
    settings: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    isFetching: settingsQuery.isFetching,
    isSaving: updateSettingsMutation.isPending,
    updateSettings,
  };
};
