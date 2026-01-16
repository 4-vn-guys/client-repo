/* eslint-disable react/no-children-prop */
'use client';

import { cn } from '@/src/shared/lib';
import {
  Button,
  Card,
  CardContent,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  TypographyH1,
  TypographyP,
} from '@/src/shared/ui';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ExtraAuthForm } from './extra-auth-form';
import { TermConditionText } from './term-condition-text';
import { HomeButton } from './home-button';
import { useForm } from '@tanstack/react-form';
import { useAuthSchemas } from '@/src/entities/user';
import { useAuth } from '../hooks/use-auth';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const tLoginPage = useTranslations('LoginPage');
  const [showPassword, setShowPassword] = useState(false);
  const { loginSchema } = useAuthSchemas();
  const { login, isLoading } = useAuth();

  // Memoize form options to improve performance and prevent re-renders
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        // We await the login. Even if it fails, our hook handles the toast.
        // The try/catch ensures no unhandled rejection reloads the page.
        await login(value.email, value.password);
      } catch (err) {
        console.error('Submission suppressed:', err);
      }
    },
  });

  const toggleShowPassword = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any accidental form triggers
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form
            className='p-6 md:p-8'
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Critical to stop event bubbling
              form.handleSubmit();
            }}
          >
            <FieldGroup className="gap-2"> {/* Reduce default gap to control spacing manually */}
              <div className='flex flex-col items-center gap-2 text-center mb-4'>
                <div className='relative w-full flex items-center justify-center mb-2'>
                  <div className='w-full grid-cols-5 md:grid'>
                    <HomeButton />
                    <TypographyH1 className='w-full text-xl font-bold md:text-2xl grid-cols-3 md:col-span-3'>
                      {tLoginPage('title')}
                    </TypographyH1>
                  </div>
                </div>
                <TypographyP className='text-muted-foreground text-balance [&:not(:first-child)]:mt-0'>
                  {tLoginPage('subtitle', { platform: 'BC' })}
                </TypographyP>
              </div>

              {/* Email Field */}
              <form.Field name='email'>
                {(field) => {
                  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>{tLoginPage('emailLabel')}</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={cn(hasError && 'border-destructive')}
                        placeholder='m@example.com'
                        autoComplete='email'
                      />
                      <div className="min-h-5 mt-1">
                        {hasError && <FieldError errors={field.state.meta.errors} />}
                      </div>
                    </Field>
                  );
                }}
              </form.Field>

              {/* Password Field */}
              <form.Field name='password'>
                {(field) => {
                  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                  return (
                    <Field>
                      <div className='flex items-center mb-1'>
                        <FieldLabel htmlFor='password'>{tLoginPage('passwordLabel')}</FieldLabel>
                        <Link
                          href='/forgot-password'
                          className='ml-auto text-xs underline-offset-2 hover:underline text-muted-foreground'
                        >
                          {tLoginPage('forgotPassword')}
                        </Link>
                      </div>
                      <div className='relative'>
                        <Input
                          id='password'
                          type={showPassword ? 'text' : 'password'}
                          placeholder='●●●●●●●●'
                          className={cn('pr-10', hasError && 'border-destructive')}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          autoComplete='current-password'
                        />
                        <button
                          className='absolute top-1/2 right-0 -translate-y-1/2 p-3 text-muted-foreground hover:text-foreground transition-colors'
                          type='button'
                          onClick={toggleShowPassword}
                          tabIndex={-1} // Prevent tabbing into the eye icon for faster flow
                        >
                          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                      </div>
                      {/* FIX: Reserved space prevents the form from jumping */}
                      <div className="min-h-[20px] mt-1">
                        {hasError && <FieldError errors={field.state.meta.errors} />}
                      </div>
                    </Field>
                  );
                }}
              </form.Field>

              <Button type='submit' className="w-full mt-2" disabled={isLoading}>
                {isLoading ? 'Logging in...' : tLoginPage('login')}
              </Button>

              <ExtraAuthForm />

              <FieldDescription className='text-center mt-2'>
                {tLoginPage('noAccount')}&nbsp;
                <Link href='/register' className='hover:text-primary underline underline-offset-4'>
                  {tLoginPage('signUp')}
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className='bg-muted relative hidden md:block'>
            <Image
              src='/images/background-login-register.jpeg'
              alt='Login background'
              className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
              width={500}
              height={500}
              priority // High priority for the login hero image
            />
          </div>
        </CardContent>
      </Card>
      <TermConditionText />
    </div>
  );
}