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
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';

const languages = [
  { code: 'en', name: 'English', flagImage: '/flags/america.jpeg' },
  { code: 'vi', name: 'Tiếng Việt', flagImage: '/flags/vietnam.jpeg' },
];

export function LanguageSwitcher() {
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const currentLanguage = useMemo(
    () => languages.find(lang => lang.code === locale),
    [locale]
  );

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
      <SelectTrigger className='border-0 shadow-none'>
        <SelectValue>
          <Image
            src={currentLanguage?.flagImage ?? ''}
            alt={currentLanguage?.name ?? ''}
            width={24}
            height={24}
          />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{tCommon('languageLabel')}</SelectLabel>
          {languages.map(lang => (
            <SelectItem
              key={lang.code}
              value={lang.code}
              className='flex items-center gap-2'
            >
              <Image
                loading='lazy'
                src={lang?.flagImage ?? ''}
                alt={lang?.name ?? ''}
                width={24}
                height={24}
              />
              <span>{lang.name}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
