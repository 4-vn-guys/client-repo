import { LoginForm } from '@/components/local/login/login-form';

export default function LoginPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-green-50 py-12'>
      <div className='w-full max-w-sm md:max-w-4xl'>
        <LoginForm />
      </div>
    </div>
  );
}
