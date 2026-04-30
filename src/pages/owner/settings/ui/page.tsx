'use client';

import { useMemo, useState } from 'react';
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Languages,
  LockKeyhole,
  Moon,
  MonitorCog,
  Palette,
  ShieldCheck,
  Smartphone,
  Sun,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import {
  useUserSettings,
  type SettingsLanguageCode,
  type SettingsLayoutDensity,
  type SettingsTheme,
  type UpdateUserSettingsDto,
  type UserSettings,
} from '@/features/user-settings';

type ToggleRowProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
};

function ToggleRow({ title, description, checked, onChange }: ToggleRowProps) {
  return (
    <button
      type='button'
      onClick={onChange}
      className='group flex w-full items-center justify-between gap-4 rounded-xl border border-transparent p-3 text-left transition-all duration-200 hover:border-violet-200 hover:bg-violet-50/60 focus-visible:ring-3 focus-visible:ring-violet-500/30 focus-visible:outline-none'
      aria-pressed={checked}
    >
      <span className='space-y-1'>
        <span className='block text-sm font-semibold'>{title}</span>
        <span className='text-muted-foreground block text-sm'>
          {description}
        </span>
      </span>
      <span
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200',
          checked ? 'bg-violet-600' : 'bg-slate-200'
        )}
      >
        <span
          className={cn(
            'absolute top-1 size-5 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </span>
    </button>
  );
}

const languages: Array<{
  code: SettingsLanguageCode;
  flag: string;
  shortLabel: string;
  labelKey: 'englishLanguage' | 'vietnameseLanguage';
}> = [
  {
    code: 'en',
    flag: '/flags/america.jpeg',
    shortLabel: 'EN',
    labelKey: 'englishLanguage',
  },
  {
    code: 'vi',
    flag: '/flags/vietnam.jpeg',
    shortLabel: 'VI',
    labelKey: 'vietnameseLanguage',
  },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const themeOptions: Array<{
  value: SettingsTheme;
  icon: typeof MonitorCog;
  labelKey: 'themeSystem' | 'themeLight' | 'themeDark';
  descriptionKey:
    | 'themeSystemDescription'
    | 'themeLightDescription'
    | 'themeDarkDescription';
}> = [
  {
    value: 'system',
    icon: MonitorCog,
    labelKey: 'themeSystem',
    descriptionKey: 'themeSystemDescription',
  },
  {
    value: 'light',
    icon: Sun,
    labelKey: 'themeLight',
    descriptionKey: 'themeLightDescription',
  },
  {
    value: 'dark',
    icon: Moon,
    labelKey: 'themeDark',
    descriptionKey: 'themeDarkDescription',
  },
];

const toEditableSettings = (
  settings?: UserSettings
): UpdateUserSettingsDto => ({
  theme: settings?.theme ?? 'system',
  layoutDensity: settings?.layoutDensity ?? 'comfortable',
  compactMode: settings?.compactMode ?? false,
  languageCode: settings?.languageCode ?? 'vi',
  notifEmail: settings?.notifEmail ?? true,
  notifPush: settings?.notifPush ?? true,
  recoveryEmail: settings?.recoveryEmail ?? null,
  twoFactorEnabled: settings?.twoFactorEnabled ?? false,
});

export default function SettingsPage() {
  const tCommon = useTranslations('Common');
  const tOwnerPages = useTranslations('OwnerPages');
  const tSettings = useTranslations('OwnerSettingsPage');
  const { setTheme } = useTheme();
  const {
    settings,
    isLoading,
    isSaving,
    updateSettings,
  } = useUserSettings();
  const [draftSettings, setDraftSettings] = useState<UpdateUserSettingsDto>({});
  const [saved, setSaved] = useState(false);
  const [recoveryEmailError, setRecoveryEmailError] = useState('');
  const [isTwoFactorDialogOpen, setIsTwoFactorDialogOpen] = useState(false);
  const savedSettings = toEditableSettings(settings);
  const effectiveSettings = {
    ...savedSettings,
    ...draftSettings,
  };
  const isThemePreviewing =
    draftSettings.theme !== undefined &&
    draftSettings.theme !== savedSettings.theme;

  const categories = useMemo(
    () => [
      {
        href: '#appearance',
        icon: Palette,
        title: tSettings('appearanceTitle'),
        description: tSettings('appearanceSummary'),
      },
      {
        href: '#language',
        icon: Languages,
        title: tSettings('languageTitle'),
        description: tSettings('languageSummary'),
      },
      {
        href: '#notifications',
        icon: Bell,
        title: tSettings('notificationsTitle'),
        description: tSettings('notificationsSummary'),
      },
      {
        href: '#security',
        icon: LockKeyhole,
        title: tSettings('securityTitle'),
        description: tSettings('securitySummary'),
      },
    ],
    [tSettings]
  );

  const handleSavedCue = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  const handleDraftChange = (patch: UpdateUserSettingsDto) => {
    setDraftSettings(current => ({ ...current, ...patch }));
    setSaved(false);
  };

  const handleThemePreview = (theme: SettingsTheme) => {
    setTheme(theme);
    handleDraftChange({ theme });
  };

  const handleDiscardChanges = () => {
    setDraftSettings({});
    setRecoveryEmailError('');
    setSaved(false);
    setTheme(savedSettings.theme ?? 'system');
  };

  const handleSaveSettings = async () => {
    const trimmedEmail = (effectiveSettings.recoveryEmail ?? '').trim();
    if (trimmedEmail && !emailPattern.test(trimmedEmail)) {
      setRecoveryEmailError(tSettings('recoveryEmailInvalid'));
      return;
    }

    setRecoveryEmailError('');
    await updateSettings({
      ...effectiveSettings,
      recoveryEmail: trimmedEmail || null,
    });
    setDraftSettings({});
    handleSavedCue();
  };

  const currentLanguage = languages.find(
    language => language.code === effectiveSettings.languageCode
  ) ?? languages[1];

  const hasUnsavedChanges = settings
    ? JSON.stringify({
        ...savedSettings,
        recoveryEmail: settings.recoveryEmail ?? null,
      }) !==
      JSON.stringify({
        ...effectiveSettings,
        recoveryEmail: (effectiveSettings.recoveryEmail ?? '').trim() || null,
      })
    : false;

  return (
    <div className='container mx-auto max-w-6xl space-y-6 pt-6 pb-20'>
      <div className='overflow-hidden rounded-3xl border border-violet-200/70 bg-linear-to-br from-violet-600 via-purple-600 to-emerald-500 p-6 text-white shadow-xl shadow-violet-500/10 md:p-8'>
        <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
          <div className='space-y-3'>
            <div className='flex items-center gap-2 text-sm text-white/80'>
              <span>{tSettings('workspaceLabel')}</span>
              <ChevronRight className='size-4' />
              <span>{tOwnerPages('settings')}</span>
            </div>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>
                {tOwnerPages('settings')}
              </h1>
              <p className='max-w-2xl text-sm text-white/85 md:text-base'>
                {tOwnerPages('settingsDescription')}
              </p>
            </div>
          </div>
          <Badge className='border-white/20 bg-white/15 px-3 py-1 text-white backdrop-blur'>
            <CheckCircle2 className='size-3.5' />
            {isSaving
              ? tSettings('savingBadge')
              : saved
                ? tSettings('savedBadge')
                : hasUnsavedChanges
                  ? tSettings('unsavedBadge')
                  : tSettings('readyBadge')}
          </Badge>
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <a
              key={category.href}
              href={category.href}
              className='group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/10 focus-visible:ring-3 focus-visible:ring-violet-500/30 focus-visible:outline-none'
            >
              <div className='mb-4 flex size-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-colors group-hover:bg-violet-600 group-hover:text-white'>
                <Icon className='size-5' />
              </div>
              <h2 className='font-semibold'>{category.title}</h2>
              <p className='text-muted-foreground mt-1 text-sm'>
                {category.description}
              </p>
            </a>
          );
        })}
      </div>

      <div className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
        <div className='space-y-6'>
          <Card
            id='appearance'
            className='rounded-3xl border-slate-200 shadow-sm transition-shadow duration-200 hover:shadow-md'
          >
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='flex size-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600'>
                  <MonitorCog className='size-5' />
                </div>
                <div>
                  <CardTitle>{tSettings('appearanceTitle')}</CardTitle>
                  <CardDescription>
                    {tSettings('appearanceDescription')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <div className='flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between'>
                  <div>
                    <span className='text-sm font-medium'>
                      {tSettings('themeLabel')}
                    </span>
                    <p className='text-muted-foreground text-sm'>
                      {tSettings('themePreviewDescription')}
                    </p>
                  </div>
                  {isThemePreviewing && (
                    <Badge
                      variant='secondary'
                      className='w-fit rounded-full bg-violet-50 text-violet-700'
                    >
                      {tSettings('localPreviewBadge')}
                    </Badge>
                  )}
                </div>
                <div className='grid gap-3 sm:grid-cols-3'>
                  {themeOptions.map(option => {
                    const Icon = option.icon;
                    const isSelected =
                      (effectiveSettings.theme ?? 'system') === option.value;

                    return (
                      <button
                        key={option.value}
                        type='button'
                        onClick={() => handleThemePreview(option.value)}
                        disabled={isLoading}
                        aria-pressed={isSelected}
                        className={cn(
                          'group rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:ring-3 focus-visible:ring-violet-500/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60',
                          isSelected
                            ? 'border-violet-300 bg-violet-50 shadow-sm shadow-violet-500/10'
                            : 'border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/50'
                        )}
                      >
                        <span
                          className={cn(
                            'mb-3 flex size-10 items-center justify-center rounded-xl transition-colors',
                            isSelected
                              ? 'bg-violet-600 text-white'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-violet-100 group-hover:text-violet-600'
                          )}
                        >
                          <Icon className='size-5' />
                        </span>
                        <span className='block text-sm font-semibold'>
                          {tSettings(option.labelKey)}
                        </span>
                        <span className='text-muted-foreground mt-1 block text-xs'>
                          {tSettings(option.descriptionKey)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <label className='space-y-2'>
                  <span className='text-sm font-medium'>
                    {tSettings('densityLabel')}
                  </span>
                  <Select
                    value={effectiveSettings.layoutDensity ?? 'comfortable'}
                    onValueChange={value =>
                      handleDraftChange({
                        layoutDensity: value as SettingsLayoutDensity,
                      })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger className='h-11 w-full rounded-xl transition-all duration-200 hover:border-violet-300 focus-visible:ring-violet-500/30'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='comfortable'>
                        {tSettings('densityComfortable')}
                      </SelectItem>
                      <SelectItem value='compact'>
                        {tSettings('densityCompact')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              </div>
              <ToggleRow
                title={tSettings('compactModeTitle')}
                description={tSettings('compactModeDescription')}
                checked={effectiveSettings.compactMode ?? false}
                onChange={() =>
                  handleDraftChange({
                    compactMode: !(effectiveSettings.compactMode ?? false),
                  })
                }
              />
            </CardContent>
          </Card>

          <Card
            id='notifications'
            className='rounded-3xl border-slate-200 shadow-sm transition-shadow duration-200 hover:shadow-md'
          >
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600'>
                  <Bell className='size-5' />
                </div>
                <div>
                  <CardTitle>{tSettings('notificationsTitle')}</CardTitle>
                  <CardDescription>
                    {tSettings('notificationsDescription')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-2'>
              <ToggleRow
                title={tSettings('emailNotificationsTitle')}
                description={tSettings('emailNotificationsDescription')}
                checked={effectiveSettings.notifEmail ?? true}
                onChange={() =>
                  handleDraftChange({
                    notifEmail: !(effectiveSettings.notifEmail ?? true),
                  })
                }
              />
              <ToggleRow
                title={tSettings('pushNotificationsTitle')}
                description={tSettings('pushNotificationsDescription')}
                checked={effectiveSettings.notifPush ?? true}
                onChange={() =>
                  handleDraftChange({
                    notifPush: !(effectiveSettings.notifPush ?? true),
                  })
                }
              />
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card
            id='language'
            className='rounded-3xl border-slate-200 shadow-sm transition-shadow duration-200 hover:shadow-md'
          >
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600'>
                  <Languages className='size-5' />
                </div>
                <div>
                  <CardTitle>{tSettings('languageTitle')}</CardTitle>
                  <CardDescription>
                    {tSettings('languageDescription')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <label className='grid gap-2'>
                <span className='text-sm font-semibold'>
                  {tSettings('systemLanguageLabel')}
                </span>
                <Select
                  value={effectiveSettings.languageCode ?? 'vi'}
                  onValueChange={value =>
                    handleDraftChange({
                      languageCode: value as SettingsLanguageCode,
                    })
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className='h-11 w-full rounded-xl px-3 transition-all duration-200 hover:border-violet-300 focus-visible:ring-violet-500/30'>
                    <span className='flex min-w-0 items-center gap-3'>
                      <Image
                        src={currentLanguage.flag}
                        alt=''
                        width={22}
                        height={22}
                        className='rounded-sm object-cover'
                      />
                      <span className='truncate'>
                        {tCommon(currentLanguage.labelKey)}
                      </span>
                    </span>
                  </SelectTrigger>
                  <SelectContent align='start' className='min-w-52'>
                    {languages.map(language => (
                      <SelectItem
                        key={language.code}
                        value={language.code}
                        className='gap-3 py-2.5'
                      >
                        <Image
                          src={language.flag}
                          alt=''
                          width={20}
                          height={20}
                          className='rounded-sm object-cover'
                        />
                        <span className='flex items-center gap-2'>
                          <span className='font-medium'>
                            {tCommon(language.labelKey)}
                          </span>
                          <span className='text-muted-foreground text-xs'>
                            {language.shortLabel}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </CardContent>
          </Card>

          <Card
            id='security'
            className='rounded-3xl border-slate-200 shadow-sm transition-shadow duration-200 hover:shadow-md'
          >
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='flex size-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600'>
                  <ShieldCheck className='size-5' />
                </div>
                <div>
                  <CardTitle>{tSettings('securityTitle')}</CardTitle>
                  <CardDescription>
                    {tSettings('securityDescription')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <label className='space-y-2'>
                <span className='text-sm font-medium'>
                  {tSettings('recoveryEmailLabel')}
                </span>
                <Input
                  type='email'
                  placeholder='owner@example.com'
                  value={effectiveSettings.recoveryEmail ?? ''}
                  onChange={event => {
                    handleDraftChange({ recoveryEmail: event.target.value });
                    setRecoveryEmailError('');
                  }}
                  aria-invalid={!!recoveryEmailError}
                  className='h-11 rounded-xl transition-all duration-200 hover:border-violet-300 focus-visible:ring-violet-500/30'
                />
                {recoveryEmailError && (
                  <p className='text-destructive text-sm'>
                    {recoveryEmailError}
                  </p>
                )}
              </label>
              <ToggleRow
                title={tSettings('twoFactorTitle')}
                description={tSettings('twoFactorDescription')}
                checked={effectiveSettings.twoFactorEnabled ?? false}
                onChange={() => {
                  if (effectiveSettings.twoFactorEnabled) {
                    handleDraftChange({ twoFactorEnabled: false });
                    return;
                  }
                  setIsTwoFactorDialogOpen(true);
                }}
              />
            </CardContent>
          </Card>

          <Card className='rounded-3xl border-slate-200 bg-slate-950 text-white shadow-lg'>
            <CardContent className='flex items-start gap-4 p-5'>
              <div className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-300'>
                <Smartphone className='size-5' />
              </div>
              <div className='space-y-3'>
                <div>
                  <h3 className='font-semibold'>{tSettings('mobileTitle')}</h3>
                  <p className='mt-1 text-sm text-white/70'>
                    {tSettings('mobileDescription')}
                  </p>
                </div>
                <Button
                  type='button'
                  variant='surface'
                  className='border-white/20 bg-white/10 text-white hover:bg-white/20'
                  onClick={handleSaveSettings}
                  isLoading={isSaving}
                  disabled={!hasUnsavedChanges || isSaving}
                >
                  {saved ? tSettings('savedButton') : tSettings('saveButton')}
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  className='text-white/80 hover:bg-white/10 hover:text-white'
                  onClick={handleDiscardChanges}
                  disabled={!hasUnsavedChanges || isSaving}
                >
                  {tSettings('discardButton')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={isTwoFactorDialogOpen}
        onOpenChange={setIsTwoFactorDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tSettings('twoFactorDialogTitle')}</DialogTitle>
            <DialogDescription>
              {tSettings('twoFactorDialogDescription')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsTwoFactorDialogOpen(false)}
            >
              {tCommon('cancel')}
            </Button>
            <Button
              type='button'
              onClick={() => {
                handleDraftChange({ twoFactorEnabled: true });
                setIsTwoFactorDialogOpen(false);
              }}
            >
              {tSettings('enableTwoFactor')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
