import { ForgotPasswordForm } from '@features/auth/forgot-password/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-green-50 px-4 py-12'>
      <ForgotPasswordForm />
    </div>
  );
}
