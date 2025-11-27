'use client';

import { FieldDescription } from './field';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function TermConditionText() {
  const tTermConditionText = useTranslations('Components.TermConditionText');
  return (
    <FieldDescription className='px-6 text-center'>
      {tTermConditionText('beforeTermsAndConditions')}&nbsp;
      <Link href='#'>{tTermConditionText('termsOfService')}</Link>
      &nbsp;{tTermConditionText('termsAndConditions')}&nbsp;
      <Link href='#'>{tTermConditionText('privacyPolicy')}</Link>.
    </FieldDescription>
  );
}
