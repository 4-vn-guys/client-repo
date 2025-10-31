'use client';

import { FaFacebook, FaGoogle, FaPhone } from 'react-icons/fa6';
import { Button } from './button';
import { Field, FieldSeparator } from './field';
import { useTranslations } from 'next-intl';

export const ExtraAuthForm = () => {
  const tExtraAuthForm = useTranslations('Components.ExtraAuthForm');

  return (
    <>
      <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
        {tExtraAuthForm('orContinueWith')}
      </FieldSeparator>
      <Field className='grid grid-cols-3 gap-4'>
        <Button variant='outline' type='button'>
          <FaPhone />
          <span className='sr-only'>{tExtraAuthForm('continueWithPhone')}</span>
        </Button>
        <Button variant='outline' type='button'>
          <FaFacebook />
          <span className='sr-only'>
            {tExtraAuthForm('continueWithFacebook')}
          </span>
        </Button>
        <Button variant='outline' type='button'>
          <FaGoogle />
          <span className='sr-only'>
            {tExtraAuthForm('continueWithGoogle')}
          </span>
        </Button>
      </Field>
    </>
  );
};
