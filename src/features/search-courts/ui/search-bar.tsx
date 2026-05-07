'use client';

import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/shared/ui';
import { cn } from '@/src/shared/lib';
import { SPORTS } from '@/src/entities/sport';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const tCommon = useTranslations('Common');
  const tSearchBar = useTranslations('HomePage.SearchBar');
  const router = useRouter();

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchText, setSearchText] = useState('');

  return (
    <Card className='shadow-accent-foreground mx-auto max-w-2xl space-y-4 rounded-2xl bg-white shadow-2xl'>
      <CardContent className='space-y-2 px-4 py-0 md:px-6 md:py-2'>
        <div className='grid grid-cols-12 justify-between gap-4 space-y-2 md:flex md:flex-row md:gap-2'>
          {/* Sport */}
          <div className='relative order-1 col-span-6 h-12 flex-1 md:order-1'>
            <Label
              htmlFor='sport-picker'
              className='absolute -top-5 left-0 rounded-lg p-1 text-xs text-gray-500'
            >
              {tCommon('sportLabel')}
            </Label>
            <Select defaultValue='all'>
              <SelectTrigger
                id='sport-picker'
                className='bg-primary-foreground text-primary h-full w-full border-0 px-4 py-6 shadow-xs'
              >
                <SelectValue
                  className='text-primary font-normal'
                  placeholder={tSearchBar('sportPlaceholder')}
                />
              </SelectTrigger>
              <SelectContent align='start'>
                <SelectItem value='all'>{tCommon('allSports')}</SelectItem>
                {SPORTS.map(sport => (
                  <SelectItem key={sport.name} value={sport.name}>
                    {sport.icon}
                    {tCommon(sport.translationKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Location */}
          <div className='bg-primary-foreground relative order-3 col-span-12 h-12 grow rounded-md border-0 md:order-2'>
            <Label
              htmlFor='location-search'
              className='absolute -top-5 left-0 rounded-lg p-1 text-xs text-gray-500'
            >
              {tCommon('locationLabel')}
            </Label>
            <Input
              id='location-search'
              type='text'
              placeholder={tSearchBar('locationPlaceholder')}
              className='text-primary h-full border-0 px-4 py-6 text-sm shadow-xs'
              aria-label={tSearchBar('searchLocationAria')}
              value={searchText}
              onChange={event => setSearchText(event.target.value)}
            />
          </div>
          {/* Date & Time */}
          <div className='relative order-2 col-span-6 flex h-12 flex-1 space-x-2 md:order-3'>
            <Label
              htmlFor='date-search'
              className='absolute -top-5 left-0 rounded-lg p-1 text-xs text-gray-500'
            >
              {tCommon('dateLabel')}
            </Label>
            <div className='bg-primary-foreground flex h-full w-full items-center justify-between gap-1 rounded-sm'>
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger
                  className={cn(
                    'h-full grow rounded-sm border-0 bg-transparent px-4 text-left text-sm font-normal text-nowrap shadow-xs',
                    date ? 'text-primary' : 'text-gray-500'
                  )}
                >
                  {date
                    ? date.toLocaleDateString()
                    : tSearchBar('datePlaceholder')}
                </PopoverTrigger>
                <PopoverContent
                  className='w-auto overflow-hidden p-0'
                  align='start'
                >
                  <Calendar
                    id='date-search'
                    mode='single'
                    selected={date}
                    onSelect={date => {
                      setDate(date);
                      setShowDatePicker(false);
                    }}
                    captionLayout='dropdown'
                    aria-label={tSearchBar('selectDateAria')}
                  />
                </PopoverContent>
              </Popover>
              <Separator
                orientation='vertical'
                className='bg-primary/20 hidden md:block'
              />
              <Input
                type='time'
                id='time-picker'
                aria-label={tSearchBar('selectTimeAria')}
                className='text-primary hidden appearance-none border-0 bg-transparent px-4 py-6 md:block [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
              />
            </div>
          </div>
        </div>
        <Button
          className='text-md w-full px-8 font-semibold'
          icon={<Search />}
          iconPlacement='left'
          size='xl'
          onClick={() => {
            const params = new URLSearchParams();
            if (searchText.trim()) {
              params.set('search', searchText.trim());
            }
            if (date) {
              params.set('date', date.toISOString().slice(0, 10));
            }
            const query = params.toString();
            router.push(query ? `/find-court?${query}` : '/find-court');
          }}
        >
          {tCommon('searchLabel')}
        </Button>
      </CardContent>
    </Card>
  );
}
