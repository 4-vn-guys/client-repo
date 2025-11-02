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
  FieldError,
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
import { useForm } from '@tanstack/react-form';
import toast from 'react-hot-toast';
import { useAuthSchemas } from '@/utils/validation-hooks/auth';

type Step = 'email' | 'reset';

const RESEND_CODE_INTERVAL = 60;

export const ForgotPasswordForm = () => {
  const tForgotPasswordPage = useTranslations('ForgotPasswordPage');

  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const { forgotPasswordEmailSchema, forgotPasswordResetSchema } =
    useAuthSchemas();

  const emailForm = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onBlur: forgotPasswordEmailSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        // TODO: Integrate forgot password email API
        void value;
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success(tForgotPasswordPage('codeSent'));
        setCurrentStep('reset');
        setRemainingTime(RESEND_CODE_INTERVAL);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const resetForm = useForm({
    defaultValues: {
      resetCode: '',
      newPassword: '',
      confirmPassword: '',
    },
    validators: {
      onBlur: forgotPasswordResetSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        // TODO: Integrate password reset API
        void value;
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success(tForgotPasswordPage('resetSuccess'));
        emailForm.reset();
        resetForm.reset();
        setCurrentStep('email');
        setRemainingTime(0);
        setShowPassword(false);
        setShowConfirmPassword(false);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // countdown remaining time
  useEffect(() => {
    if (remainingTime <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingTime(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [remainingTime]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleResendResetCode = () => {
    if (remainingTime > 0) {
      return;
    }

    // TODO: Integrate resend reset code API
    toast.success(tForgotPasswordPage('codeSent'));
    setRemainingTime(RESEND_CODE_INTERVAL);
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
            <Form
              onSubmit={e => {
                e.preventDefault();
                emailForm.handleSubmit();
              }}
            >
              <FieldGroup>
                <emailForm.Field name='email'>
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          {tForgotPasswordPage('emailLabel')}
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type='email'
                          placeholder={tForgotPasswordPage('emailPlaceholder')}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete='off'
                          required
                          disabled={isLoading}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </emailForm.Field>
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
            <Form
              onSubmit={e => {
                e.preventDefault();
                resetForm.handleSubmit();
              }}
            >
              <FieldGroup>
                <resetForm.Field name='resetCode'>
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <div className='flex items-center justify-between'>
                          <FieldLabel htmlFor={field.name}>
                            {tForgotPasswordPage('resetCodeLabel')}
                          </FieldLabel>
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                onClick={handleResendResetCode}
                                disabled={remainingTime > 0 || isLoading}
                              >
                                {remainingTime > 0 ? (
                                  <span className='text-sm'>
                                    {remainingTime}s
                                  </span>
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
                          id={field.name}
                          name={field.name}
                          type='text'
                          placeholder={tForgotPasswordPage(
                            'resetCodePlaceholder'
                          )}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          maxLength={6}
                          required
                          disabled={isLoading}
                          autoComplete='one-time-code'
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </resetForm.Field>
                <resetForm.Field name='newPassword'>
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          {tForgotPasswordPage('newPasswordLabel')}
                        </FieldLabel>
                        <div className='relative'>
                          <Input
                            id={field.name}
                            name={field.name}
                            type={showPassword ? 'text' : 'password'}
                            placeholder={tForgotPasswordPage(
                              'newPasswordPlaceholder'
                            )}
                            className='pr-8'
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={e => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            autoComplete='new-password'
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
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </resetForm.Field>
                <resetForm.Field name='confirmPassword'>
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          {tForgotPasswordPage('confirmPasswordLabel')}
                        </FieldLabel>
                        <div className='relative'>
                          <Input
                            id={field.name}
                            name={field.name}
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder={tForgotPasswordPage(
                              'confirmPasswordPlaceholder'
                            )}
                            className='pr-8'
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={e => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            autoComplete='new-password'
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
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </resetForm.Field>
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
