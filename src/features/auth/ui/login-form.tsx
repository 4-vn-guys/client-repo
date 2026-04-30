'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ExtraAuthForm } from './extra-auth-form';
import { TermConditionText } from './term-condition-text';
import { HomeButton } from './home-button';
import { useForm, useWatch } from 'react-hook-form';
import { type LoginFormSchema, useAuthSchemas } from '@/src/entities/user';
import { useAuth } from '../hooks/use-auth';

const passwordChecks = [
  {
    id: 'minLength',
    test: (value: string) => value.length >= 8,
  },
  {
    id: 'maxLength',
    test: (value: string) => value.length >= 8 && value.length <= 16,
  },
  {
    id: 'lowercase',
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    id: 'uppercase',
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: 'number',
    test: (value: string) => /\d/.test(value),
  },
  {
    id: 'special',
    test: (value: string) => /[@$!%*?&]/.test(value),
  },
] as const;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const tLoginPage = useTranslations('LoginPage');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState<string | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const { loginSchema } = useAuthSchemas();
  const { login, verifyTwoFactorLogin, loginWithGoogle, isLoading } = useAuth();

  const {
    control,
    formState: { errors, isSubmitting, submitCount },
    handleSubmit,
    register,
    trigger,
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const emailValue = useWatch({ control, name: 'email' });
  const passwordValue = useWatch({ control, name: 'password' });
  const isBusy = isLoading || isSubmitting;
  const shouldShowEmailFeedback = Boolean(emailValue) || submitCount > 0;
  const isEmailValid =
    shouldShowEmailFeedback && Boolean(emailValue) && !errors.email;
  const emailErrorId = errors.email ? 'login-email-error' : undefined;
  const passwordErrorId = errors.password
    ? 'login-password-error'
    : 'login-password-requirements';

  const passwordStrength = useMemo(() => {
    const passedChecks = passwordChecks.filter(check =>
      check.test(passwordValue ?? '')
    ).length;

    return Math.round((passedChecks / passwordChecks.length) * 100);
  }, [passwordValue]);

  useEffect(() => {
    if (!emailValue) {
      return;
    }

    const validationTimer = window.setTimeout(() => {
      void trigger('email');
    }, 350);

    return () => window.clearTimeout(validationTimer);
  }, [emailValue, trigger]);

  useEffect(() => {
    if (!passwordValue) {
      return;
    }

    void trigger('password');
  }, [passwordValue, trigger]);

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const onSubmit = async (value: LoginFormSchema) => {
    setSubmitMessage(null);

    try {
      const result = await login(value.email, value.password);

      if (result?.requiresTwoFactor && result.challengeToken) {
        setTwoFactorToken(result.challengeToken);
        setSubmitMessage({
          type: 'success',
          text: tLoginPage('twoFactorRequired'),
        });
        return;
      }

      setSubmitMessage(
        result?.success
          ? { type: 'success', text: tLoginPage('loginSuccess') }
          : {
              type: 'error',
              text: result?.error || tLoginPage('loginFailed'),
            }
      );
    } catch (err) {
      console.error('Submission suppressed:', err);
      setSubmitMessage({ type: 'error', text: tLoginPage('loginFailed') });
    }
  };

  const submitTwoFactor = async () => {
    if (!twoFactorToken || !twoFactorCode.trim()) {
      return;
    }
    const result = await verifyTwoFactorLogin(twoFactorToken, twoFactorCode.trim());
    setSubmitMessage(
      result?.success
        ? { type: 'success', text: tLoginPage('loginSuccess') }
        : { type: 'error', text: result?.error || tLoginPage('loginFailed') }
    );
  };

  return (
    <div className={cn('flex flex-col gap-5 sm:gap-6', className)} {...props}>
      <Card className='border-primary/10 bg-card/95 shadow-primary/10 overflow-hidden rounded-3xl border p-0 shadow-2xl backdrop-blur'>
        <CardContent className='grid p-0 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'>
          <form
            className='px-5 py-7 sm:px-8 sm:py-9 lg:px-10'
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <fieldset disabled={isBusy} className='contents'>
              <FieldGroup className='gap-6'>
                <div className='flex flex-col items-center gap-3 text-center'>
                  <div className='relative flex w-full items-center justify-center'>
                    <div className='w-full grid-cols-5 items-center md:grid'>
                      <HomeButton />
                      <TypographyH1 className='text-foreground w-full grid-cols-3 text-2xl font-bold tracking-tight md:col-span-3 md:text-3xl'>
                        {tLoginPage('title')}
                      </TypographyH1>
                    </div>
                  </div>
                  <TypographyP className='text-muted-foreground max-w-sm text-sm leading-6 text-balance not-first:mt-0'>
                    {tLoginPage('subtitle', { platform: 'BC' })}
                  </TypographyP>
                </div>

                <Field>
                  <FieldLabel htmlFor='email' className='text-sm font-semibold'>
                    {tLoginPage('emailLabel')}
                  </FieldLabel>
                  <div className='relative'>
                    <Mail
                      aria-hidden='true'
                      className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2'
                    />
                    <Input
                      id='email'
                      type='email'
                      placeholder='m@example.com'
                      autoComplete='email'
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={emailErrorId}
                      className={cn(
                        'border-border/80 bg-background/80 placeholder:text-muted-foreground/70 hover:border-primary/40 focus-visible:border-primary focus-visible:ring-primary/25 h-12 rounded-xl pr-10 pl-10 shadow-sm transition-all duration-200',
                        errors.email &&
                          'border-destructive focus-visible:ring-destructive/20',
                        isEmailValid &&
                          'border-green-600 focus-visible:ring-green-600/20'
                      )}
                      {...register('email', {
                        onChange: () => setSubmitMessage(null),
                      })}
                    />
                    {shouldShowEmailFeedback &&
                      (isEmailValid ? (
                        <CheckCircle2
                          aria-label={tLoginPage('emailValid')}
                          className='absolute top-1/2 right-3 size-5 -translate-y-1/2 text-green-600'
                        />
                      ) : errors.email ? (
                        <AlertCircle
                          aria-hidden='true'
                          className='text-destructive absolute top-1/2 right-3 size-5 -translate-y-1/2'
                        />
                      ) : null)}
                  </div>
                  <div className='min-h-5' aria-live='polite'>
                    {errors.email && (
                      <FieldError id='login-email-error'>
                        {errors.email.message}
                      </FieldError>
                    )}
                    {isEmailValid && (
                      <p className='flex items-center gap-1.5 text-sm text-green-700'>
                        <CheckCircle2 aria-hidden='true' className='size-4' />
                        {tLoginPage('emailValid')}
                      </p>
                    )}
                  </div>
                </Field>

                {twoFactorToken && (
                  <Field>
                    <FieldLabel
                      htmlFor='two-factor-code'
                      className='text-sm font-semibold'
                    >
                      {tLoginPage('twoFactorCodeLabel')}
                    </FieldLabel>
                    <Input
                      id='two-factor-code'
                      type='text'
                      inputMode='numeric'
                      placeholder={tLoginPage('twoFactorCodePlaceholder')}
                      value={twoFactorCode}
                      onChange={event => setTwoFactorCode(event.target.value)}
                      className='h-12 rounded-xl'
                    />
                    <Button
                      type='button'
                      size='xl'
                      className='mt-2 min-h-12 w-full rounded-xl'
                      onClick={submitTwoFactor}
                      disabled={!twoFactorCode.trim() || isBusy}
                    >
                      {tLoginPage('verifyTwoFactor')}
                    </Button>
                  </Field>
                )}

                <Field>
                  <div className='flex items-center gap-3'>
                    <FieldLabel
                      htmlFor='password'
                      className='text-sm font-semibold'
                    >
                      {tLoginPage('passwordLabel')}
                    </FieldLabel>
                    <Link
                      href='/forgot-password'
                      className='text-muted-foreground hover:text-primary focus-visible:ring-primary/30 ml-auto rounded-sm text-xs font-medium underline-offset-4 transition-colors hover:underline focus-visible:ring-2 focus-visible:outline-none'
                    >
                      {tLoginPage('forgotPassword')}
                    </Link>
                  </div>
                  <div className='relative'>
                    <LockKeyhole
                      aria-hidden='true'
                      className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2'
                    />
                    <Input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='●●●●●●●●'
                      autoComplete='current-password'
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={passwordErrorId}
                      className={cn(
                        'border-border/80 bg-background/80 placeholder:text-muted-foreground/70 hover:border-primary/40 focus-visible:border-primary focus-visible:ring-primary/25 h-12 rounded-xl pr-12 pl-10 shadow-sm transition-all duration-200',
                        errors.password &&
                          'border-destructive focus-visible:ring-destructive/20'
                      )}
                      {...register('password', {
                        onChange: () => setSubmitMessage(null),
                      })}
                    />
                    <button
                      className='text-muted-foreground hover:text-foreground focus-visible:ring-primary/30 absolute top-1/2 right-1 inline-flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none'
                      type='button'
                      onClick={toggleShowPassword}
                      aria-label={
                        showPassword
                          ? tLoginPage('hidePassword')
                          : tLoginPage('showPassword')
                      }
                      disabled={isBusy}
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                  <div className='space-y-3' aria-live='polite'>
                    {errors.password && (
                      <FieldError id='login-password-error'>
                        {errors.password.message}
                      </FieldError>
                    )}
                    <div
                      id='login-password-requirements'
                      className='border-border/70 bg-muted/35 rounded-2xl border p-3'
                    >
                      <div className='mb-3 flex items-center justify-between gap-3'>
                        <p className='text-foreground text-xs font-semibold'>
                          {tLoginPage('passwordRequirementsTitle')}
                        </p>
                        <span className='text-muted-foreground text-xs'>
                          {passwordStrength}%
                        </span>
                      </div>
                      <div className='bg-background mb-3 h-1.5 overflow-hidden rounded-full'>
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-300',
                            passwordStrength === 100
                              ? 'bg-green-600'
                              : 'bg-primary'
                          )}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                      <ul className='grid gap-2 text-xs sm:grid-cols-2'>
                        {passwordChecks.map(check => {
                          const isMet = check.test(passwordValue ?? '');

                          return (
                            <li
                              key={check.id}
                              className={cn(
                                'flex items-center gap-2 transition-colors',
                                isMet
                                  ? 'text-green-700'
                                  : 'text-muted-foreground'
                              )}
                            >
                              <CheckCircle2
                                aria-hidden='true'
                                className={cn(
                                  'size-3.5',
                                  isMet ? 'opacity-100' : 'opacity-35'
                                )}
                              />
                              {tLoginPage(`passwordRequirement.${check.id}`)}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </Field>

                <Button
                  type='submit'
                  size='xl'
                  className='bg-primary shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/30 mt-1 min-h-12 w-full rounded-xl font-semibold shadow-lg'
                  disabled={isBusy}
                  aria-busy={isBusy}
                >
                  {isBusy && (
                    <Loader2
                      aria-hidden='true'
                      className='size-4 animate-spin'
                    />
                  )}
                  {isBusy ? tLoginPage('loggingIn') : tLoginPage('login')}
                </Button>

                {submitMessage && (
                  <div
                    role='status'
                    aria-live='polite'
                    className={cn(
                      'rounded-xl border px-3 py-2 text-sm',
                      submitMessage.type === 'success'
                        ? 'border-green-600/30 bg-green-50 text-green-800'
                        : 'border-destructive/30 bg-destructive/10 text-destructive'
                    )}
                  >
                    {submitMessage.text}
                  </div>
                )}

                <ExtraAuthForm
                  isLoading={isBusy}
                  onGoogleCredential={async idToken => {
                    setSubmitMessage(null);
                    const result = await loginWithGoogle(idToken);
                    if (result?.requiresTwoFactor && result.challengeToken) {
                      setTwoFactorToken(result.challengeToken);
                      setSubmitMessage({
                        type: 'success',
                        text: tLoginPage('twoFactorRequired'),
                      });
                    }
                  }}
                />

                <FieldDescription className='text-center text-sm'>
                  {tLoginPage('noAccount')}&nbsp;
                  <Link
                    href='/register'
                    className='text-primary hover:text-primary/80 focus-visible:ring-primary/30 font-semibold underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none'
                  >
                    {tLoginPage('signUp')}
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </fieldset>
          </form>

          <div className='bg-muted relative hidden min-h-[620px] overflow-hidden md:block'>
            <Image
              src='/images/background-login-register.jpeg'
              alt={tLoginPage('imageAlt')}
              className='absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105 dark:brightness-[0.2] dark:grayscale'
              width={500}
              height={500}
              priority
            />
          </div>
        </CardContent>
      </Card>
      <TermConditionText />
    </div>
  );
}
