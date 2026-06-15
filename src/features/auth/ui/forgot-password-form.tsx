'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Form,
  Input,
} from '@/src/shared/ui';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, MailCheck } from 'lucide-react';
import { ExtraAuthForm } from './extra-auth-form';
import { useForm } from '@tanstack/react-form';
import toast from 'react-hot-toast';
import { useAuthSchemas } from '@/src/entities/user';
import { authApi } from '../apis';

type Step = 'email' | 'sent';

const RESEND_INTERVAL = 60;

export const ForgotPasswordForm = () => {
  const tForgotPasswordPage = useTranslations('ForgotPasswordPage');

  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [sentTo, setSentTo] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);

  const { forgotPasswordEmailSchema } = useAuthSchemas();

  const requestReset = async (email: string) => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSentTo(email);
      setCurrentStep('sent');
      setRemainingTime(RESEND_INTERVAL);
      toast.success(tForgotPasswordPage('codeSent'));
    } catch {
      // Same message on failure: never reveal whether the email exists.
      setSentTo(email);
      setCurrentStep('sent');
      setRemainingTime(RESEND_INTERVAL);
      toast.success(tForgotPasswordPage('codeSent'));
    } finally {
      setIsLoading(false);
    }
  };

  const emailForm = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: forgotPasswordEmailSchema,
    },
    onSubmit: async ({ value }) => {
      await requestReset(value.email);
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

  const handleResend = async () => {
    if (remainingTime > 0 || isLoading || !sentTo) {
      return;
    }
    await requestReset(sentTo);
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
                    const shouldShowError =
                      field.state.meta.isTouched &&
                      field.state.value.length > 0 &&
                      !field.state.meta.isValid;

                    return (
                      <Field data-invalid={shouldShowError}>
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
                          aria-invalid={shouldShowError}
                          className={
                            shouldShowError ? 'border-destructive' : ''
                          }
                          autoComplete='off'
                          disabled={isLoading}
                        />
                        {shouldShowError && (
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
                      : tForgotPasswordPage('sendResetLink')}
                  </Button>
                </Field>
                <ExtraAuthForm />
              </FieldGroup>
            </Form>
          ) : (
            <div className='flex flex-col items-center gap-4 py-2 text-center'>
              <MailCheck className='size-10 text-green-600' />
              <p className='text-sm'>
                {tForgotPasswordPage('linkSentDescription', { email: sentTo })}
              </p>
              <p className='text-muted-foreground text-xs'>
                {tForgotPasswordPage('linkSentHint')}
              </p>
              <Button
                type='button'
                variant='outline'
                className='w-full'
                onClick={handleResend}
                disabled={remainingTime > 0 || isLoading}
              >
                {remainingTime > 0
                  ? tForgotPasswordPage('resendIn', { seconds: remainingTime })
                  : tForgotPasswordPage('resendLink')}
              </Button>
            </div>
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
