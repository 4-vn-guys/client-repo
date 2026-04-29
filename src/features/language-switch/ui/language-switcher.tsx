'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from '@/src/shared/ui';
import Image from 'next/image';
import { Globe2 } from 'lucide-react';
import { cn } from '@/src/shared/lib';

const languages = [
  {
    code: 'en',
    shortLabel: 'EN',
    nameKey: 'englishLanguage',
    flagImage: '/flags/america.jpeg',
  },
  {
    code: 'vi',
    shortLabel: 'VI',
    nameKey: 'vietnameseLanguage',
    flagImage: '/flags/vietnam.jpeg',
  },
];

interface LanguageSwitcherProps {
  variant?: 'compact' | 'sidebar' | 'settings';
  className?: string;
}

export function LanguageSwitcher({
  variant = 'compact',
  className,
}: LanguageSwitcherProps) {
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const currentLanguage = useMemo(
    () => languages.find(lang => lang.code === locale),
    [locale]
  );
  const currentLanguageName = currentLanguage
    ? tCommon(currentLanguage.nameKey)
    : tCommon('languageLabel');
  const isSidebar = variant === 'sidebar';
  const isSettings = variant === 'settings';

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      // Set cookie and refresh
      document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
      router.refresh();
    });
  };

  return (
    <Select
      value={locale}
      onValueChange={handleLanguageChange}
      disabled={isPending}
    >
      <SelectTrigger
        aria-label={tCommon('languageLabel')}
        className={cn(
          'border-border/60 bg-background/80 hover:bg-accent focus-visible:ring-primary/30 rounded-xl shadow-none transition-all duration-200',
          isSettings
            ? 'h-32 w-full flex-col justify-center gap-3 border-violet-200 bg-violet-50/60 p-3 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:shadow-lg hover:shadow-violet-500/10'
            : isSidebar
            ? 'h-auto w-full justify-between px-3 py-2.5'
            : 'h-10 min-w-28 rounded-full px-3',
          className
        )}
      >
        <div
          className={cn(
            'flex min-w-0 items-center gap-2',
            isSettings && 'flex-col text-center'
          )}
        >
          {(isSidebar || isSettings) && (
            <span
              className={cn(
                'bg-primary/10 text-primary flex shrink-0 items-center justify-center rounded-lg',
                isSettings ? 'size-10' : 'size-8'
              )}
            >
              <Globe2 className='size-4' />
            </span>
          )}
          <Image
            src={currentLanguage?.flagImage ?? ''}
            alt=''
            width={20}
            height={20}
            className='shrink-0 rounded-sm object-cover'
          />
          <span
            className={cn('min-w-0', isSettings ? 'text-center' : 'text-left')}
          >
            {(isSidebar || isSettings) && (
              <span className='text-muted-foreground block text-xs leading-4'>
                {tCommon('languageLabel')}
              </span>
            )}
            <span className='text-foreground block truncate text-sm font-medium'>
              {isSidebar || isSettings
                ? currentLanguageName
                : currentLanguage?.shortLabel || locale.toUpperCase()}
            </span>
          </span>
        </div>
      </SelectTrigger>
      <SelectContent
        align={isSettings ? 'center' : isSidebar ? 'start' : 'end'}
        className='min-w-44'
      >
        <SelectGroup>
          <SelectLabel>{tCommon('languageLabel')}</SelectLabel>
          {languages.map(lang => (
            <SelectItem
              key={lang.code}
              value={lang.code}
              className='gap-3 py-2'
            >
              <Image
                loading='lazy'
                src={lang?.flagImage ?? ''}
                alt=''
                width={20}
                height={20}
                className='rounded-sm object-cover'
              />
              <span className='flex flex-col'>
                <span className='font-medium'>{tCommon(lang.nameKey)}</span>
                <span className='text-muted-foreground text-xs'>
                  {lang.shortLabel}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
