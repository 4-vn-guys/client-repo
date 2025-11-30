import { Home } from 'lucide-react';
import { Button } from '../ui/button';
import { redirect } from 'next/navigation';

interface HomeButtonProps {
  onClick?: () => void;
}

export const HomeButton = ({ onClick }: HomeButtonProps) => {
  const handleToHome = () => {
    onClick?.();
    redirect('/');
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
