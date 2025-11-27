/* eslint-disable react/no-children-prop */
/* eslint-disable react/jsx-no-undef */
'use client';

import { cn } from '@/utils/utils';
import { Button } from '@shared/ui/button';
import { Card, CardContent } from '@shared/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@shared/ui/field';
import { Input } from '@shared/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { TypographyH1, TypographyP } from '@shared/ui/typography';
import { useState } from 'react';
import { Eye, EyeOff, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';
import { ExtraAuthForm } from '@shared/ui/extra-auth-form';
import { TermConditionText } from '@shared/ui/term-condition-text';
import { useForm } from '@tanstack/react-form';
import { useAuthSchemas } from '@/utils/validation-hooks/auth';
import toast from 'react-hot-toast';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const tLoginPage = useTranslations('LoginPage');

  const [showPassword, setShowPassword] = useState(false);

  const { loginSchema } = useAuthSchemas();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onBlur: loginSchema,
    },
    onSubmit: ({ value }) => {
      toast.success(`Login with ${value.email} - ${value.password}`);
    },
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToHome = () => {
    redirect('/');
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
              <Button
                type='button'
                size='icon'
                variant='secondary'
                iconLeft={<Home />}
                onClick={handleToHome}
              />
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
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        {tLoginPage('emailLabel')}
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder='m@example.com'
                        autoComplete='off'
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name='password'
                children={field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
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
                          className='pr-8'
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete='off'
                        />
                        <button
                          className='absolute top-1/2 right-0 -translate-y-1/2 p-2'
                          type='button'
                          onClick={toggleShowPassword}
                        >
                          {showPassword ? (
                            <Eye className='size-5' />
                          ) : (
                            <EyeOff className='size-5' />
                          )}
                        </button>
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <Field>
                <Button type='submit'>{tLoginPage('login')}</Button>
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
