'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { TypographyH1, TypographyP } from '@/components/ui/typography';
import { FaFacebook, FaGoogle, FaPhone } from 'react-icons/fa6';
import { useState } from 'react';
import { Eye, EyeOff, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const tLoginPage = useTranslations('LoginPage');
  const tCommon = useTranslations('Common');

  const [showPassword, setShowPassword] = useState(false);

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
          <form className='p-6 md:p-8'>
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
              <Field>
                <FieldLabel htmlFor='email'>
                  {tLoginPage('emailLabel')}
                </FieldLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                />
              </Field>
              <Field>
                <div className='flex items-center'>
                  <FieldLabel htmlFor='password'>
                    {tLoginPage('passwordLabel')}
                  </FieldLabel>
                  <Link
                    href='#'
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
                    required
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
              </Field>
              <Field>
                <Button type='submit'>{tLoginPage('login')}</Button>
              </Field>
              <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
                {tLoginPage('orContinueWith')}
              </FieldSeparator>
              <Field className='grid grid-cols-3 gap-4'>
                <Button variant='outline' type='button'>
                  <FaPhone />
                  <span className='sr-only'>
                    {tLoginPage('continueWithPhone')}
                  </span>
                </Button>
                <Button variant='outline' type='button'>
                  <FaFacebook />
                  <span className='sr-only'>
                    {tLoginPage('continueWithFacebook')}
                  </span>
                </Button>
                <Button variant='outline' type='button'>
                  <FaGoogle />
                  <span className='sr-only'>
                    {tLoginPage('continueWithGoogle')}
                  </span>
                </Button>
              </Field>
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
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className='px-6 text-center'>
        {tCommon('beforeTermsAndConditions')}&nbsp;
        <Link href='#'>{tCommon('termsOfService')}</Link>
        &nbsp;{tCommon('termsAndConditions')}&nbsp;
        <Link href='#'>{tCommon('privacyPolicy')}</Link>.
      </FieldDescription>
    </div>
  );
}
