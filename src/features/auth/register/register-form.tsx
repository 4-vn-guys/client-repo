/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const tRegisterPage = useTranslations('RegisterPage');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { registerSchema } = useAuthSchemas();

  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onBlur: registerSchema,
    },
    onSubmit: ({ value }) => {
      toast.success(
        `Register with ${value.fullName} - ${value.email} - ${value.password}`
      );
    },
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
                  {tRegisterPage('title', { platform: 'BC' })}
                </TypographyH1>
                <TypographyP className='text-muted-foreground text-balance [&:not(:first-child)]:mt-0'>
                  {tRegisterPage('subtitle')}
                </TypographyP>
              </div>
              <form.Field
                name='fullName'
                children={field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        {tRegisterPage('fullName')}
                      </FieldLabel>
                      <Input
                        id='fullname'
                        type='text'
                        placeholder='John Doe'
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name='email'
                children={field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        {tRegisterPage('emailLabel')}
                      </FieldLabel>
                      <Input
                        id='email'
                        type='email'
                        placeholder='m@example.com'
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
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
                      <FieldLabel htmlFor={field.name}>
                        {tRegisterPage('passwordLabel')}
                      </FieldLabel>
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

              <form.Field
                name='confirmPassword'
                children={field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        {tRegisterPage('confirmPasswordLabel')}
                      </FieldLabel>
                      <div className='relative'>
                        <Input
                          id='confirmPassword'
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder='●●●●●●●●'
                          className='pr-8'
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                        <button
                          className='absolute top-1/2 right-0 -translate-y-1/2 p-2'
                          type='button'
                          onClick={toggleShowConfirmPassword}
                        >
                          {showConfirmPassword ? (
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
                <Button type='submit'>{tRegisterPage('register')}</Button>
              </Field>
              <ExtraAuthForm />
              <FieldDescription className='text-center'>
                {tRegisterPage('alreadyHaveAccount')}&nbsp;
                <Link
                  href='/login'
                  className='hover:text-primary underline underline-offset-4'
                >
                  {tRegisterPage('signIn')}
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
