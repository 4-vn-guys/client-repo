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
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <Card className='shadow-accent-foreground mx-auto max-w-2xl space-y-4 rounded-2xl bg-white px-4 py-6 shadow-2xl'>
      <CardContent className='space-y-2'>
        <div className='grid grid-cols-12 justify-between gap-4 space-y-2 md:flex md:flex-row md:gap-2 md:space-y-0 md:space-x-2'>
          <div className='relative order-1 col-span-5 flex-1 md:order-1'>
            <Label
              htmlFor='sport-picker'
              className='absolute -top-5 left-0 rounded-lg p-1 text-xs text-gray-500'
            >
              Sport
            </Label>
            <Select defaultValue='all'>
              <SelectTrigger
                id='sport-picker'
                className='bg-primary-foreground text-primary w-full border-0 px-4 py-6'
              >
                <SelectValue
                  className='text-primary font-normal'
                  placeholder='Select Sport'
                />
              </SelectTrigger>
              <SelectContent align='start'>
                <SelectItem value='all'>All Sports</SelectItem>
                {sports.map(sport => (
                  <SelectItem key={sport.name} value={sport.name}>
                    {sport.icon}
                    {sport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='bg-primary-foreground relative order-3 col-span-12 grow rounded-md border-0 md:order-2'>
            <Label
              htmlFor='location-search'
              className='absolute -top-5 left-0 rounded-lg p-1 text-xs text-gray-500'
            >
              Location
            </Label>
            <Input
              id='location-search'
              type='text'
              placeholder='Enter your location...'
              className='text-primary border-0 px-4 py-6'
              aria-label='Search location'
            />
          </div>
          <div className='relative order-2 col-span-7 flex h-fit flex-1 space-x-2 md:order-3'>
            <Label
              htmlFor='date-search'
              className='absolute -top-5 left-0 rounded-lg p-1 text-xs text-gray-500'
            >
              Date
            </Label>
            <div className='bg-primary-foreground flex w-full items-center justify-between gap-1 rounded-sm'>
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger
                  className={cn(
                    'grow border-0 bg-transparent px-4 text-left text-sm font-normal text-nowrap',
                    date ? 'text-primary' : 'text-gray-500'
                  )}
                >
                  {date ? date.toLocaleDateString() : 'Select date'}
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
              <Separator orientation='vertical' className='bg-primary/20 he' />
              <Input
                type='time'
                id='time-picker'
                aria-label='Select time'
                className='text-primary appearance-none border-0 bg-transparent px-4 py-6 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
              />
            </div>
          </div>
        </div>
        <Button
          className='text-md w-full px-8 font-semibold'
          iconLeft={<Search />}
          size='xl'
        >
          Search
        </Button>
      </CardContent>
    </Card>
  );
}
