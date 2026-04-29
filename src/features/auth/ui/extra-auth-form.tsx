'use client';

import { GoogleLogin } from '@react-oauth/google';
import { FaPhone } from 'react-icons/fa6';
import { Button, Field, FieldSeparator } from '@/src/shared/ui';
import { useTranslations } from 'next-intl';

type Props = {
  onGoogleCredential?: (idToken: string) => Promise<void> | void;
  isLoading?: boolean;
};

export const ExtraAuthForm = ({ onGoogleCredential, isLoading = false }: Props) => {
  const tExtraAuthForm = useTranslations('Components.ExtraAuthForm');
  const hasGoogleClientId = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  return (
    <>
      <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
        {tExtraAuthForm('orContinueWith')}
      </FieldSeparator>
      <Field className='grid grid-cols-2 gap-4'>
        <Button variant='outline' type='button'>
          <FaPhone />
          <span className='sr-only'>{tExtraAuthForm('continueWithPhone')}</span>
        </Button>
        {hasGoogleClientId ? (
          <GoogleLogin
            onSuccess={credentialResponse => {
              if (credentialResponse.credential && onGoogleCredential && !isLoading) {
                onGoogleCredential(credentialResponse.credential);
              }
            }}
            onError={() => {
              // keep UI silent here; hook will notify on API-level failures
            }}
            text='continue_with'
            shape='pill'
          />
        ) : (
          <Button variant='outline' type='button' disabled>
            <span className='sr-only'>
              {tExtraAuthForm('continueWithGoogle')}
            </span>
            Google
          </Button>
        )}
      </Field>
    </>
  );
};
