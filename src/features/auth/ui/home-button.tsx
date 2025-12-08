'use client';

import { Home } from 'lucide-react';
import { Button } from '@/src/shared/ui';
import { useRouter } from 'next/navigation';

interface HomeButtonProps {
  onClick?: () => void;
}

export const HomeButton = ({ onClick }: HomeButtonProps) => {
  const router = useRouter();

  const handleToHome = () => {
    onClick?.();
    router.push('/');
  };

  return (
    <Button
      type='button'
      size='icon'
      variant='subtle'
      icon={<Home />}
      iconPlacement='left'
      onClick={handleToHome}
    />
  );
};
