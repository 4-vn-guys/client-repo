import { LoginForm } from '@/src/features/auth';

export function LoginPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 via-purple-50/70 to-green-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8'>
      <div className='w-full max-w-md md:max-w-5xl'>
        <LoginForm />
      </div>
    </div>
  );
}
