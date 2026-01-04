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
import { useState } from 'react';
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

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      // Call the login API using useAuth hook
      await login(value.email, value.password);
    },
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form
            className='p-6 md:p-8'
            onSubmit={e => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <HomeButton />
              <div className='flex flex-col items-center gap-2 text-center'>
                <TypographyH1 className='text-xl font-bold md:text-2xl'>
                  {tLoginPage('title')}
                </TypographyH1>
                <TypographyP className='text-muted-foreground text-balance [&:not(:first-child)]:mt-0'>
                  {tLoginPage('subtitle', { platform: 'BC' })}
                </TypographyP>
              </div>

              <form.Field
                name='email'
                children={field => {
                  const shouldShowError =
                    field.state.meta.isTouched && 
                    field.state.value.length > 0 && 
                    !field.state.meta.isValid;
                  return (
                    <Field data-invalid={shouldShowError}>
                      <FieldLabel htmlFor={field.name}>
                        {tLoginPage('emailLabel')}
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value)}
                        aria-invalid={shouldShowError}
                        className={shouldShowError ? 'border-destructive' : ''}
                        placeholder='m@example.com'
                        autoComplete='off'
                      />
                      {shouldShowError && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name='password'
                children={field => {
                  const shouldShowError =
                    field.state.meta.isTouched && 
                    field.state.value.length > 0 && 
                    !field.state.meta.isValid;
                  return (
                    <Field>
                      <div className='flex items-center'>
                        <FieldLabel htmlFor='password'>
                          {tLoginPage('passwordLabel')}
                        </FieldLabel>
                        <Link
                          href='/forgot-password'
                          className='ml-auto text-sm underline-offset-2 hover:underline'
                        >
                          {tLoginPage('forgotPassword')}
                        </Link>
                      </div>
                      <div className='relative'>
                        <Input
                          id='password'
                          type={showPassword ? 'text' : 'password'}
                          placeholder='●●●●●●●●'
                          className={shouldShowError ? 'pr-8 border-destructive' : 'pr-8'}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={shouldShowError}
                          autoComplete='off'
                        />
                        <button
                          className='absolute top-1/2 right-0 -translate-y-1/2 p-2'
                          type='button'
                          onClick={toggleShowPassword}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <Eye className='size-5' />
                          ) : (
                            <EyeOff className='size-5' />
                          )}
                        </button>
                      </div>
                      {shouldShowError && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <Field>
                <Button type='submit' disabled={isLoading}>
                  {isLoading ? 'Logging in...' : tLoginPage('login')}
                </Button>
              </Field>
              <ExtraAuthForm />
              <FieldDescription className='text-center'>
                {tLoginPage('noAccount')}&nbsp;
                <Link
                  href='/register'
                  className='hover:text-primary underline underline-offset-4'
                >
                  {tLoginPage('signUp')}
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className='bg-muted relative hidden md:block'>
            <Image
              src='/images/background-login-register.jpeg'
              alt='Image'
              className='absolute inset-0 h-full w-full rotate-y-180 object-cover dark:brightness-[0.2] dark:grayscale'
              width={500}
              height={500}
              loading='eager'
            />
          </div>
        </CardContent>
      </Card>
      <TermConditionText />
    </div>
  );
}
