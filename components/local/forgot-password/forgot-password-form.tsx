'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft, RotateCcw } from 'lucide-react';
import { ExtraAuthForm } from '@/components/ui/extra-auth-form';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Step = 'email' | 'reset';

const RESEND_CODE_INTERVAL = 60;

export const ForgotPasswordForm = () => {
  const tForgotPasswordPage = useTranslations('ForgotPasswordPage');

  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('reset');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);

  // countdown remaining time
  useEffect(() => {
    const handler =
      remainingTime > 0
        ? setInterval(() => {
            setRemainingTime(remainingTime - 1);
          }, 1000)
        : undefined;

    return () => clearInterval(handler);
  }, [remainingTime]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleResendResetCode = async () => {
    // handle API
    setRemainingTime(RESEND_CODE_INTERVAL);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className='mx-auto w-full max-w-md'>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl'>
            {tForgotPasswordPage('title')}
          </CardTitle>
          <CardDescription>{tForgotPasswordPage('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 'email' ? (
            <Form onSubmit={handleEmailSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor='email'>
                    {tForgotPasswordPage('emailLabel')}
                  </FieldLabel>
                  <Input
                    id='email'
                    type='email'
                    placeholder={tForgotPasswordPage('emailPlaceholder')}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </Field>
                <Field>
                  <Button type='submit' className='w-full' disabled={isLoading}>
                    {isLoading
                      ? tForgotPasswordPage('sending')
                      : tForgotPasswordPage('sendResetCode')}
                  </Button>
                </Field>
                <ExtraAuthForm />
              </FieldGroup>
            </Form>
          ) : (
            <Form onSubmit={handlePasswordReset}>
              <FieldGroup>
                <Field>
                  <div className='flex items-center justify-between'>
                    <FieldLabel htmlFor='resetCode'>
                      {tForgotPasswordPage('resetCodeLabel')}
                    </FieldLabel>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          onClick={handleResendResetCode}
                          disabled={remainingTime > 0}
                        >
                          {remainingTime > 0 ? (
                            <span className='text-sm'>{remainingTime}s</span>
                          ) : (
                            <RotateCcw />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side='bottom'>
                        {tForgotPasswordPage('resendResetCode')}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id='resetCode'
                    type='text'
                    placeholder={tForgotPasswordPage('resetCodePlaceholder')}
                    value={resetCode}
                    onChange={e => setResetCode(e.target.value)}
                    maxLength={6}
                    required
                    disabled={isLoading}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor='newPassword'>
                    {tForgotPasswordPage('newPasswordLabel')}
                  </FieldLabel>
                  <div className='relative'>
                    <Input
                      id='newPassword'
                      type={showPassword ? 'text' : 'password'}
                      placeholder={tForgotPasswordPage(
                        'newPasswordPlaceholder'
                      )}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className='pr-8'
                      required
                      disabled={isLoading}
                    />
                    <button
                      className='absolute top-1/2 right-0 -translate-y-1/2 p-2'
                      type='button'
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? (
                        <Eye className='size-4' />
                      ) : (
                        <EyeOff className='size-4' />
                      )}
                    </button>
                  </div>
                </Field>
                <Field>
                  <FieldLabel htmlFor='confirmPassword'>
                    {tForgotPasswordPage('confirmPasswordLabel')}
                  </FieldLabel>
                  <div className='relative'>
                    <Input
                      id='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={tForgotPasswordPage(
                        'confirmPasswordPlaceholder'
                      )}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className='pr-8'
                      required
                      disabled={isLoading}
                    />
                    <button
                      className='absolute top-1/2 right-0 -translate-y-1/2 p-2'
                      type='button'
                      onClick={toggleShowConfirmPassword}
                    >
                      {showConfirmPassword ? (
                        <Eye className='size-4' />
                      ) : (
                        <EyeOff className='size-4' />
                      )}
                    </button>
                  </div>
                </Field>
                <Field>
                  <Button type='submit' className='w-full' disabled={isLoading}>
                    {isLoading
                      ? tForgotPasswordPage('resetting')
                      : tForgotPasswordPage('resetPassword')}
                  </Button>
                </Field>
              </FieldGroup>
            </Form>
          )}

          <FieldDescription className='mt-4 text-center'>
            <Link
              href='/login'
              className='flex items-center justify-center gap-2 text-sm underline-offset-2 hover:underline'
            >
              <ArrowLeft className='size-4' />
              {tForgotPasswordPage('backToLogin')}
            </Link>
          </FieldDescription>
        </CardContent>
      </Card>
    </div>
  );
};
