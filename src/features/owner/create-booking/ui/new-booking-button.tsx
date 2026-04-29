'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useTranslations } from 'next-intl';

interface NewBookingButtonProps {
  onClick?: () => void;
}

export function NewBookingButton({ onClick }: NewBookingButtonProps) {
  const tTimeline = useTranslations('OwnerTimelinePage');

  return (
    <Button onClick={onClick} className='bg-primary hover:bg-primary/90 gap-2'>
      <Plus className='size-4' />
      {tTimeline('newBooking')}
    </Button>
  );
}
