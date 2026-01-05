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
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/use-auth';

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const tRegisterPage = useTranslations('RegisterPage');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { registerSchema } = useAuthSchemas();
  const { register, isLoading } = useAuth();

  const form = useForm({
    defaultValues: {
      userName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({ value }) => {
      const registerData: {
        userName: string;
        email?: string;
        phoneNumber?: string;
        password: string;
      } = {
        userName: value.userName,
        password: value.password,
      };

      if (value.email && value.email.trim() !== '') {
        registerData.email = value.email;
      }

      if (value.phoneNumber && value.phoneNumber.trim() !== '') {
        registerData.phoneNumber = value.phoneNumber;
      }

      const result = await register(registerData);

      if (!result.success) {
        // Error is already shown by the hook
        return;
      }
    },
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
                  {tRegisterPage('title', { platform: 'BC' })}
                </TypographyH1>
                <TypographyP className='text-muted-foreground text-balance not-first:mt-0'>
                  {tRegisterPage('subtitle')}
                </TypographyP>
              </div>
              <form.Field
                name='userName'
                children={field => {
                  const shouldShowError =
                    field.state.meta.isTouched && 
                    field.state.value.length > 0 && 
                    !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        {tRegisterPage('userName')} <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id='username'
                        type='text'
                        placeholder={tRegisterPage('userNamePlaceholder')}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value)}
                        aria-invalid={shouldShowError}
                        className={shouldShowError ? 'border-destructive' : ''}
                      />
                      {shouldShowError && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name='email'
                children={field => {
                  const shouldShowError =
                    field.state.meta.isTouched && 
                    field.state.value.length > 0 && 
                    !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        {tRegisterPage('emailLabel')}
                      </FieldLabel>
                      <Input
                        id='email'
                        type='email'
                        placeholder={tRegisterPage('emailPlaceholder')}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value)}
                        aria-invalid={shouldShowError}
                        className={shouldShowError ? 'border-destructive' : ''}
                      />
                      {shouldShowError && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name='phoneNumber'
                children={field => {
                  const shouldShowError =
                    field.state.meta.isTouched && 
                    field.state.value.length > 0 && 
                    !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        {tRegisterPage('phoneLabel')}
                      </FieldLabel>
                      <Input
                        id='phoneNumber'
                        type='tel'
                        placeholder={tRegisterPage('phonePlaceholder')}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value)}
                        aria-invalid={shouldShowError}
                        className={shouldShowError ? 'border-destructive' : ''}
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
                      <FieldLabel htmlFor={field.name}>
                        {tRegisterPage('passwordLabel')} <span className="text-destructive">*</span>
                      </FieldLabel>
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

              <form.Field
                name='confirmPassword'
                children={field => {
                  const shouldShowError =
                    field.state.meta.isTouched && 
                    field.state.value.length > 0 && 
                    !field.state.meta.isValid;
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
                          className={shouldShowError ? 'pr-8 border-destructive' : 'pr-8'}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={shouldShowError}
                        />
                        <button
                          className='absolute top-1/2 right-0 -translate-y-1/2 p-2'
                          type='button'
                          onClick={toggleShowConfirmPassword}
                          aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                          {showConfirmPassword ? (
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
                  {isLoading ? tRegisterPage('creating') : tRegisterPage('register')}
                </Button>
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
