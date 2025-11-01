import { cn } from '@/lib/utils';

export const Form = ({ className, ...props }: React.ComponentProps<'form'>) => {
  return <form className={cn('p-6 md:p-8', className)} {...props} />;
};
