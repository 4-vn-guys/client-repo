import { Suspense } from 'react';
import { ResetPasswordForm } from '@/src/features/auth';

export function ResetPasswordPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-green-50 px-4 py-12'>
      {/* useSearchParams requires a Suspense boundary */}
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
