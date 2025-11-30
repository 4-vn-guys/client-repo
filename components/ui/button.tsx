import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Spinner } from './spinner';

export type ColorPattern =
  | 'primary'
  | 'red'
  | 'green'
  | 'blue'
  | 'teal'
  | 'yellow'
  | 'orange'
  | 'pink'
  | 'cyan'
  | 'gray';

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        solid: 'text-white hover:opacity-90',
        subtle: 'bg-current/5 text-current hover:bg-current/10',
        surface: 'border border-current/20 bg-current/5 hover:bg-current/20',
        outline: 'border border-current/20 hover:bg-current/10',
        ghost: 'bg-white hover:bg-current/10',
        plain: '',
        link: 'hover:underline underline-offset-4',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-sm gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-sm px-6 has-[>svg]:px-4',
        xl: 'h-12 rounded-sm px-8 has-[>svg]:px-6',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
        'icon-xl': 'size-12',
      },
      colorPattern: {
        primary: 'text-primary',
        red: 'text-red-700',
        green: 'text-green-600',
        blue: 'text-blue-600',
        teal: 'text-teal-600',
        yellow: 'text-yellow-500',
        orange: 'text-orange-500',
        pink: 'text-pink-500',
        cyan: 'text-cyan-600',
        gray: 'text-gray-900',
      },
    },
    compoundVariants: [
      {
        variant: 'solid',
        colorPattern: 'primary',
        class: 'bg-primary text-white',
      },
      { variant: 'solid', colorPattern: 'red', class: 'bg-red-700 text-white' },
      {
        variant: 'solid',
        colorPattern: 'green',
        class: 'bg-green-600 text-white',
      },
      {
        variant: 'solid',
        colorPattern: 'blue',
        class: 'bg-blue-600 text-white',
      },
      {
        variant: 'solid',
        colorPattern: 'teal',
        class: 'bg-teal-600 text-white',
      },
      {
        variant: 'solid',
        colorPattern: 'yellow',
        class: 'bg-yellow-500 text-white',
      },
      {
        variant: 'solid',
        colorPattern: 'orange',
        class: 'bg-orange-500 text-white',
      },
      {
        variant: 'solid',
        colorPattern: 'pink',
        class: 'bg-pink-500 text-white',
      },
      {
        variant: 'solid',
        colorPattern: 'cyan',
        class: 'bg-cyan-600 text-white',
      },
      {
        variant: 'solid',
        colorPattern: 'gray',
        class: 'bg-gray-900 text-white',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      size: 'default',
      colorPattern: 'primary',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  icon,
  iconPlacement = 'left',
  isLoading = false,
  colorPattern,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    icon?: React.ReactNode;
    iconPlacement?: 'left' | 'right';
    isLoading?: boolean;
    colorPattern?: ColorPattern;
  }) {
  const Comp = asChild ? Slot : 'button';
  const renderIcon = (position: 'left' | 'right') => {
    if (iconPlacement !== position || !icon) return null;
    return isLoading ? <Spinner /> : <span className='size-4'>{icon}</span>;
  };
  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className, colorPattern }))}
      {...props}
    >
      {renderIcon('left')}
      {props.children}
      {renderIcon('right')}
    </Comp>
  );
}

export { Button, buttonVariants };
