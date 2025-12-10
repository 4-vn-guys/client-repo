import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

interface SidebarUserProps {
  name: string;
  venueName: string;
  avatar?: string;
}

export function SidebarUser({ name, venueName, avatar }: SidebarUserProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className='flex items-center gap-3 px-3 py-2'>
      <Avatar className='bg-primary/20 size-10'>
        <AvatarImage src={avatar || '/placeholder.svg'} alt={name} />
        <AvatarFallback className='bg-primary/20 text-primary text-sm font-medium'>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>{name}</p>
        <p className='text-muted-foreground truncate text-xs'>{venueName}</p>
      </div>
    </div>
  );
}
