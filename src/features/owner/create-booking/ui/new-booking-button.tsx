'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface NewBookingButtonProps {
  onClick?: () => void;
}

export function NewBookingButton({ onClick }: NewBookingButtonProps) {
  return (
    <Button onClick={onClick} className='bg-primary hover:bg-primary/90 gap-2'>
      <Plus className='size-4' />
      New Booking
    </Button>
  );
}
