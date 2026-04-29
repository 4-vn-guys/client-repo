export type SettingsTheme = 'system' | 'light' | 'dark';
export type SettingsLayoutDensity = 'comfortable' | 'compact';
export type SettingsLanguageCode = 'en' | 'vi';

export interface UserSettings {
  id: string;
  userId: string;
  theme: SettingsTheme;
  layoutDensity: SettingsLayoutDensity;
  compactMode: boolean;
  languageCode: SettingsLanguageCode;
  notifEmail: boolean;
  notifPush: boolean;
  recoveryEmail: string | null;
  twoFactorEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateUserSettingsDto = Partial<
  Pick<
    UserSettings,
    | 'theme'
    | 'layoutDensity'
    | 'compactMode'
    | 'languageCode'
    | 'notifEmail'
    | 'notifPush'
    | 'recoveryEmail'
    | 'twoFactorEnabled'
  >
>;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number;
  timestamp?: string;
}
