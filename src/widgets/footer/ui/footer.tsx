import { Separator } from '@/src/shared/ui';

export function Footer() {
  return (
    <footer className='bg-gray-800 py-12 text-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
          <div>
            <div className='text-primary mb-4 text-2xl font-bold'>
              CourtConnect
            </div>
            <p className='text-gray-400'>
              Your trusted partner for booking sports courts across the city.
            </p>
          </div>
          <div>
            <h3 className='mb-4 font-bold'>Sports</h3>
            <ul className='space-y-2 text-gray-400'>
              <li>
                <a href='#' className='hover:text-white'>
                  Football
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white'>
                  Badminton
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white'>
                  Pickleball
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-4 font-bold'>Company</h3>
            <ul className='space-y-2 text-gray-400'>
              <li>
                <a href='#' className='hover:text-white'>
                  About Us
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white'>
                  Contact
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white'>
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-4 font-bold'>Legal</h3>
            <ul className='space-y-2 text-gray-400'>
              <li>
                <a href='#' className='hover:text-white'>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white'>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <Separator className='my-8' />
        <div className='text-muted-foreground text-center'>
          <p>&copy; 2024 CourtConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
