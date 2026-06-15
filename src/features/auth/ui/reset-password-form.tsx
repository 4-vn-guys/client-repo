'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Form,
  Input,
} from '@/src/shared/ui';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useForm } from '@tanstack/react-form';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useAuthSchemas } from '@/src/entities/user';
import { authApi } from '../apis';

export const ResetPasswordForm = () => {
  const tResetPasswordPage = useTranslations('ResetPasswordPage');
  const tCommon = useTranslations('Common');

  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { resetPasswordSchema } = useAuthSchemas();

  const resetForm = useForm({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validators: {
      onChange: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      if (!token) {
        return;
      }

      setIsLoading(true);
      try {
        await authApi.resetPassword(token, value.newPassword);
        toast.success(tResetPasswordPage('resetSuccess'));
        setIsSuccess(true);
      } catch (error) {
        const responseData =
          error instanceof AxiosError ? error.response?.data : undefined;
        const message =
          responseData?.error?.message ||
          responseData?.message ||
          tResetPasswordPage('resetFailed');
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (!token) {
    return (
      <div className='mx-auto w-full max-w-md'>
        <Card>
          <CardHeader className='text-center'>
            <AlertCircle className='text-destructive mx-auto mb-2 size-10' />
            <CardTitle className='text-2xl'>
              {tResetPasswordPage('invalidLinkTitle')}
            </CardTitle>
            <CardDescription>
              {tResetPasswordPage('invalidLinkSubtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className='w-full'>
              <Link href='/forgot-password'>
                {tResetPasswordPage('requestNewLink')}
              </Link>
            </Button>
            <FieldDescription className='mt-4 text-center'>
              <Link
                href='/login'
                className='flex items-center justify-center gap-2 text-sm underline-offset-2 hover:underline'
              >
                <ArrowLeft className='size-4' />
                {tResetPasswordPage('backToLogin')}
              </Link>
            </FieldDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className='mx-auto w-full max-w-md'>
        <Card>
          <CardHeader className='text-center'>
            <CheckCircle2 className='mx-auto mb-2 size-10 text-green-600' />
            <CardTitle className='text-2xl'>
              {tResetPasswordPage('successTitle')}
            </CardTitle>
            <CardDescription>
              {tResetPasswordPage('successSubtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className='w-full'>
              <Link href='/login'>{tResetPasswordPage('goToLogin')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='mx-auto w-full max-w-md'>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl'>
            {tResetPasswordPage('title')}
          </CardTitle>
          <CardDescription>{tResetPasswordPage('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            onSubmit={e => {
              e.preventDefault();
              resetForm.handleSubmit();
            }}
          >
            <FieldGroup>
              <resetForm.Field name='newPassword'>
                {field => {
                  const shouldShowError =
                    field.state.meta.isTouched &&
                    field.state.value.length > 0 &&
                    !field.state.meta.isValid;

                  return (
                    <Field data-invalid={shouldShowError}>
                      <FieldLabel htmlFor={field.name}>
                        {tResetPasswordPage('newPasswordLabel')}
                      </FieldLabel>
                      <div className='relative'>
                        <Input
                          id={field.name}
                          name={field.name}
                          type={showPassword ? 'text' : 'password'}
                          placeholder={tResetPasswordPage(
                            'newPasswordPlaceholder'
                          )}
                          className={
                            shouldShowError ? 'border-destructive pr-8' : 'pr-8'
                          }
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={shouldShowError}
                          autoComplete='new-password'
                          disabled={isLoading}
                        />
                        <button
                          className='absolute top-1/2 right-0 -translate-y-1/2 p-2'
                          type='button'
                          onClick={toggleShowPassword}
                          aria-label={
                            showPassword
                              ? tCommon('hidePassword')
                              : tCommon('showPassword')
                          }
                        >
                          {showPassword ? (
                            <Eye className='size-4' />
                          ) : (
                            <EyeOff className='size-4' />
                          )}
                        </button>
                      </div>
                      {shouldShowError && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </resetForm.Field>
              <resetForm.Field name='confirmPassword'>
                {field => {
                  const shouldShowError =
                    field.state.meta.isTouched &&
                    field.state.value.length > 0 &&
                    !field.state.meta.isValid;

                  return (
                    <Field data-invalid={shouldShowError}>
                      <FieldLabel htmlFor={field.name}>
                        {tResetPasswordPage('confirmPasswordLabel')}
                      </FieldLabel>
                      <div className='relative'>
                        <Input
                          id={field.name}
                          name={field.name}
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder={tResetPasswordPage(
                            'confirmPasswordPlaceholder'
                          )}
                          className={
                            shouldShowError ? 'border-destructive pr-8' : 'pr-8'
                          }
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={shouldShowError}
                          autoComplete='new-password'
                          disabled={isLoading}
                        />
                        <button
                          className='absolute top-1/2 right-0 -translate-y-1/2 p-2'
                          type='button'
                          onClick={toggleShowConfirmPassword}
                          aria-label={
                            showConfirmPassword
                              ? tCommon('hideConfirmPassword')
                              : tCommon('showConfirmPassword')
                          }
                        >
                          {showConfirmPassword ? (
                            <Eye className='size-4' />
                          ) : (
                            <EyeOff className='size-4' />
                          )}
                        </button>
                      </div>
                      {shouldShowError && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </resetForm.Field>
              <Field>
                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading
                    ? tResetPasswordPage('resetting')
                    : tResetPasswordPage('resetPassword')}
                </Button>
              </Field>
            </FieldGroup>
          </Form>

          <FieldDescription className='mt-4 text-center'>
            <Link
              href='/login'
              className='flex items-center justify-center gap-2 text-sm underline-offset-2 hover:underline'
            >
              <ArrowLeft className='size-4' />
              {tResetPasswordPage('backToLogin')}
            </Link>
          </FieldDescription>
        </CardContent>
      </Card>
    </div>
  );
};
