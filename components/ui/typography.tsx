import { cn } from '@/lib/utils';

interface TypographyProps {
  className?: string;
  children: React.ReactNode;
}

export function TypographyH1({ className, children }: TypographyProps) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance md:text-6xl',
        className
      )}
    >
      {children}
    </h1>
  );
}

export function TypographyH2({ className, children }: TypographyProps) {
  return (
    <h2
      className={cn(
        'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        className
      )}
    >
      {children}
      The People of the Kingdom
    </h2>
  );
}
export function TypographyH3({ className, children }: TypographyProps) {
  return (
    <h3
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight',
        className
      )}
    >
      {children}
      The Joke Tax
    </h3>
  );
}
export function TypographyH4({ className, children }: TypographyProps) {
  return (
    <h4
      className={cn(
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className
      )}
    >
      {children}
      People stopped telling jokes
    </h4>
  );
}
export function TypographyP({ className, children }: TypographyProps) {
  return (
    <p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}>
      {children}
    </p>
  );
}
export function TypographyBlockquote({ className, children }: TypographyProps) {
  return (
    <blockquote className={cn('mt-6 border-l-2 pl-6 italic', className)}>
      {children}
    </blockquote>
  );
}
export function TypographyLead({ className, children }: TypographyProps) {
  return (
    <p className={cn('text-muted-foreground text-xl', className)}>{children}</p>
  );
}
export function TypographyLarge({ className, children }: TypographyProps) {
  return (
    <div className={cn('text-lg font-semibold', className)}>{children}</div>
  );
}
export function TypographySmall({ className, children }: TypographyProps) {
  return (
    <small className={cn('text-sm leading-none font-medium', className)}>
      {children}
    </small>
  );
}
export function TypographyMuted({ className, children }: TypographyProps) {
  return (
    <p className={cn('text-muted-foreground text-sm', className)}>{children}</p>
  );
}
