'use client';

import { useMemo, useState } from 'react';
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Languages,
  LockKeyhole,
  MonitorCog,
  Palette,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
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

export default function SettingsPage() {
  const tCommon = useTranslations('Common');
  const tOwnerPages = useTranslations('OwnerPages');
  const tSettings = useTranslations('OwnerSettingsPage');
  const {
    settings,
    isLoading,
    isSaving,
    updateSettings,
  } = useUserSettings();
  const [saved, setSaved] = useState(false);
  const [recoveryEmailDraft, setRecoveryEmailDraft] = useState<string | null>(
    null
  );
  const [recoveryEmailError, setRecoveryEmailError] = useState('');
  const [isTwoFactorDialogOpen, setIsTwoFactorDialogOpen] = useState(false);

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

  const handleUpdate = (patch: UpdateUserSettingsDto) => {
    updateSettings(patch);
    handleSavedCue();
  };

  const handleRecoveryEmailSave = () => {
    const trimmedEmail = (
      recoveryEmailDraft ??
      settings?.recoveryEmail ??
      ''
    ).trim();
    if (trimmedEmail && !emailPattern.test(trimmedEmail)) {
      setRecoveryEmailError(tSettings('recoveryEmailInvalid'));
      return;
    }

    setRecoveryEmailError('');
    setRecoveryEmailDraft(null);
    handleUpdate({ recoveryEmail: trimmedEmail || null });
  };

  const currentLanguage = languages.find(
    language => language.code === settings?.languageCode
  ) ?? languages[1];

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
              <div className='grid gap-4 sm:grid-cols-2'>
                <label className='space-y-2'>
                  <span className='text-sm font-medium'>
                    {tSettings('themeLabel')}
                  </span>
                  <Select
                    value={settings?.theme ?? 'system'}
                    onValueChange={value =>
                      handleUpdate({ theme: value as SettingsTheme })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger className='h-11 w-full rounded-xl transition-all duration-200 hover:border-violet-300 focus-visible:ring-violet-500/30'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='system'>
                        {tSettings('themeSystem')}
                      </SelectItem>
                      <SelectItem value='light'>
                        {tSettings('themeLight')}
                      </SelectItem>
                      <SelectItem value='dark'>
                        {tSettings('themeDark')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </label>
                <label className='space-y-2'>
                  <span className='text-sm font-medium'>
                    {tSettings('densityLabel')}
                  </span>
                  <Select
                    value={settings?.layoutDensity ?? 'comfortable'}
                    onValueChange={value =>
                      handleUpdate({
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
                checked={settings?.compactMode ?? false}
                onChange={() =>
                  handleUpdate({
                    compactMode: !(settings?.compactMode ?? false),
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
                checked={settings?.notifEmail ?? true}
                onChange={() =>
                  handleUpdate({ notifEmail: !(settings?.notifEmail ?? true) })
                }
              />
              <ToggleRow
                title={tSettings('pushNotificationsTitle')}
                description={tSettings('pushNotificationsDescription')}
                checked={settings?.notifPush ?? true}
                onChange={() =>
                  handleUpdate({ notifPush: !(settings?.notifPush ?? true) })
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
            <CardContent className='space-y-3'>
              <label className='space-y-2'>
                <span className='text-sm font-medium'>
                  {tSettings('systemLanguageLabel')}
                </span>
                <Select
                  value={settings?.languageCode ?? 'vi'}
                  onValueChange={value =>
                    handleUpdate({
                      languageCode: value as SettingsLanguageCode,
                    })
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className='h-12 w-full rounded-xl px-3 transition-all duration-200 hover:border-violet-300 focus-visible:ring-violet-500/30'>
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
                    <SelectValue className='sr-only' />
                  </SelectTrigger>
                  <SelectContent align='start' className='min-w-56'>
                    {languages.map(language => (
                      <SelectItem
                        key={language.code}
                        value={language.code}
                        className='gap-3 py-2'
                      >
                        <Image
                          src={language.flag}
                          alt=''
                          width={20}
                          height={20}
                          className='rounded-sm object-cover'
                        />
                        <span className='flex flex-col'>
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
              <p className='text-muted-foreground mt-3 text-xs'>
                {tSettings('keyboardHint')}
              </p>
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
                  value={recoveryEmailDraft ?? settings?.recoveryEmail ?? ''}
                  onChange={event => {
                    setRecoveryEmailDraft(event.target.value);
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
              <Button
                type='button'
                variant='outline'
                onClick={handleRecoveryEmailSave}
                isLoading={isSaving}
              >
                {tSettings('saveRecoveryEmail')}
              </Button>
              <ToggleRow
                title={tSettings('twoFactorTitle')}
                description={tSettings('twoFactorDescription')}
                checked={settings?.twoFactorEnabled ?? false}
                onChange={() => {
                  if (settings?.twoFactorEnabled) {
                    handleUpdate({ twoFactorEnabled: false });
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
                  onClick={handleSavedCue}
                >
                  {saved ? tSettings('savedButton') : tSettings('saveButton')}
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
                handleUpdate({ twoFactorEnabled: true });
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
