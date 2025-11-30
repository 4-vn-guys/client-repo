'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { IoTennisball } from 'react-icons/io5';
import { SiRacket } from 'react-icons/si';
import { FaBasketballBall, FaTableTennis } from 'react-icons/fa';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FaFutbol } from 'react-icons/fa6';
import { Search } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Sport {
  name: string;
  emoji: string;
  icon: React.ReactNode;
}

const sports: Sport[] = [
  {
    name: 'Football',
    emoji: '⚽',
    icon: <FaFutbol />,
  },
  {
    name: 'Badminton',
    emoji: '🏸',
    icon: <SiRacket />,
  },
  {
    name: 'Pickleball',
    emoji: '🥍',
    icon: <SiRacket />,
  },
  {
    name: 'Table Tennis',
    emoji: '🏓',
    icon: <FaTableTennis />,
  },
  {
    name: 'Tennis',
    emoji: '🎾',
    icon: <IoTennisball />,
  },
  {
    name: 'Basketball',
    emoji: '🏀',
    icon: <FaBasketballBall />,
  },
];

export function SearchBar() {
  const tCommon = useTranslations('Common');
  const tSearchBar = useTranslations('HomePage.SearchBar');

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
                  placeholder='Select Sport'
                />
              </SelectTrigger>
              <SelectContent align='start'>
                <SelectItem value='all'>{tCommon('allSports')}</SelectItem>
                {sports.map(sport => (
                  <SelectItem key={sport.name} value={sport.name}>
                    {sport.icon}
                    {sport.name}
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
              aria-label='Search location'
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
                    aria-label='Select date'
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
                aria-label='Select time'
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
        >
          {tCommon('searchLabel')}
        </Button>
      </CardContent>
    </Card>
  );
}
