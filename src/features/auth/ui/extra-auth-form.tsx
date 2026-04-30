'use client';

import { GoogleLogin } from '@react-oauth/google';
import { Loader2 } from 'lucide-react';
import { FaPhone } from 'react-icons/fa6';
import { Button, Field, FieldSeparator } from '@/src/shared/ui';
import { useTranslations } from 'next-intl';
import { cn } from '@/src/shared/lib';
import { useEffect, useRef, useState } from 'react';

type Props = {
  onGoogleCredential?: (idToken: string) => Promise<void> | void;
  isLoading?: boolean;
};

export const ExtraAuthForm = ({
  onGoogleCredential,
  isLoading = false,
}: Props) => {
  const tExtraAuthForm = useTranslations('Components.ExtraAuthForm');
  const hasGoogleClientId = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  const [isGoogleConnecting, setIsGoogleConnecting] = useState(false);
  const googleFeedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const isGoogleBusy = isLoading || isGoogleConnecting;

  useEffect(() => {
    return () => {
      if (googleFeedbackTimer.current) {
        clearTimeout(googleFeedbackTimer.current);
      }
    };
  }, []);

  const clearGoogleFeedbackTimer = () => {
    if (googleFeedbackTimer.current) {
      clearTimeout(googleFeedbackTimer.current);
      googleFeedbackTimer.current = null;
    }
  };

  const showGoogleConnectingFeedback = () => {
    if (!hasGoogleClientId || isGoogleBusy) {
      return;
    }

    setIsGoogleConnecting(true);
    clearGoogleFeedbackTimer();
    googleFeedbackTimer.current = setTimeout(() => {
      setIsGoogleConnecting(false);
      googleFeedbackTimer.current = null;
    }, 3000);
  };

  return (
    <>
      <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card *:data-[slot=field-separator-content]:px-3'>
        {tExtraAuthForm('orContinueWith')}
      </FieldSeparator>
      <Field className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <Button
          variant='outline'
          type='button'
          disabled={isLoading}
          className='border-border/80 bg-background/70 hover:border-primary/40 hover:bg-primary/5 min-h-11 rounded-xl transition-all'
          aria-label={tExtraAuthForm('continueWithPhone')}
        >
          <FaPhone />
          <span className='sr-only'>{tExtraAuthForm('continueWithPhone')}</span>
        </Button>
        <div
          onPointerDownCapture={showGoogleConnectingFeedback}
          className={cn(
            'focus-within:ring-primary/30 group relative min-h-11 overflow-hidden rounded-xl focus-within:ring-2',
            isLoading && 'pointer-events-none'
          )}
        >
          <div
            aria-hidden='true'
            className={cn(
              'flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-[#dadce0] bg-white px-4 text-sm font-semibold text-[#3c4043] shadow-sm transition-all duration-200',
              'group-hover:bg-[#f8fafd] group-hover:shadow-md group-active:scale-[0.98]',
              isGoogleBusy && 'bg-gray-50 text-gray-500 opacity-80'
            )}
          >
            {isGoogleBusy ? (
              <Loader2 className='text-primary size-5 animate-spin' />
            ) : (
              <svg
                viewBox='0 0 24 24'
                className='size-5 shrink-0'
                aria-hidden='true'
              >
                <path
                  fill='#4285F4'
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                />
                <path
                  fill='#34A853'
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                />
                <path
                  fill='#FBBC05'
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                />
                <path
                  fill='#EA4335'
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z'
                />
              </svg>
            )}
            <span className='min-w-0 text-center leading-5 whitespace-normal'>
              {isGoogleBusy
                ? tExtraAuthForm('connectingWithGoogle')
                : tExtraAuthForm('continueWithGoogle')}
            </span>
          </div>
          {!hasGoogleClientId && (
            <Button
              variant='plain'
              type='button'
              disabled
              className='absolute inset-0 min-h-11 w-full rounded-xl opacity-0'
              aria-label={tExtraAuthForm('googleAriaLabel')}
            >
              {tExtraAuthForm('continueWithGoogle')}
            </Button>
          )}
          <div
            className={cn(
              'absolute inset-0 z-10 flex items-stretch justify-center opacity-0 [&_iframe]:w-full! [&>div]:w-full!',
              isLoading && 'pointer-events-none'
            )}
          >
            {hasGoogleClientId && (
              <GoogleLogin
                onSuccess={async credentialResponse => {
                  if (
                    credentialResponse.credential &&
                    onGoogleCredential &&
                    !isLoading
                  ) {
                    clearGoogleFeedbackTimer();
                    setIsGoogleConnecting(true);

                    try {
                      await onGoogleCredential(credentialResponse.credential);
                    } finally {
                      setIsGoogleConnecting(false);
                    }
                  }
                }}
                onError={() => {
                  clearGoogleFeedbackTimer();
                  setIsGoogleConnecting(false);
                  // keep UI silent here; hook will notify on API-level failures
                }}
                text='continue_with'
                shape='pill'
                width='320'
              />
            )}
          </div>
          {isLoading && (
            <button
              type='button'
              disabled
              className='absolute inset-0 z-20 cursor-not-allowed rounded-xl'
              aria-label={tExtraAuthForm('connectingWithGoogle')}
            />
          )}
          <span className='sr-only'>{tExtraAuthForm('googleAriaLabel')}</span>
          {hasGoogleClientId && (
            <span className='sr-only'>
              {tExtraAuthForm('continueWithGoogle')}
            </span>
          )}
        </div>
      </Field>
    </>
  );
};
