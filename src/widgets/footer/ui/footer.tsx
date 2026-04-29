import { Separator } from '@/src/shared/ui';
import { getTranslations } from 'next-intl/server';

export async function Footer() {
  const tFooter = await getTranslations('Footer');
  const tCommon = await getTranslations('Common');

  return (
    <footer className='bg-gray-800 py-12 text-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
          <div>
            <div className='text-primary mb-4 text-2xl font-bold'>
              {tCommon('brandName')}
            </div>
            <p className='text-gray-400'>
              {tFooter('description')}
            </p>
          </div>
          <div>
            <h3 className='mb-4 font-bold'>{tFooter('sportsTitle')}</h3>
            <ul className='space-y-2 text-gray-400'>
              <li>
                <a href='#' className='hover:text-white'>
                  {tCommon('football')}
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white'>
                  {tCommon('badminton')}
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white'>
                  {tCommon('pickleball')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-4 font-bold'>{tFooter('companyTitle')}</h3>
            <ul className='space-y-2 text-gray-400'>
              <li>
                <a href='#' className='hover:text-white'>
                  {tFooter('aboutUs')}
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white'>
                  {tFooter('contact')}
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white'>
                  {tFooter('support')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-4 font-bold'>{tFooter('legalTitle')}</h3>
            <ul className='space-y-2 text-gray-400'>
              <li>
                <a href='#' className='hover:text-white'>
                  {tFooter('privacyPolicy')}
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white'>
                  {tFooter('termsOfService')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <Separator className='my-8' />
        <div className='text-muted-foreground text-center'>
          <p>{tFooter('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
