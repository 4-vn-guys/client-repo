import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import z from 'zod';

export type LoginFormSchema = z.infer<
  ReturnType<typeof useAuthSchemas>['loginSchema']
>;

export type RegisterFormSchema = z.infer<
  ReturnType<typeof useAuthSchemas>['registerSchema']
>;

export type ForgotPasswordEmailSchema = z.infer<
  ReturnType<typeof useAuthSchemas>['forgotPasswordEmailSchema']
>;

export type ForgotPasswordResetSchema = z.infer<
  ReturnType<typeof useAuthSchemas>['forgotPasswordResetSchema']
>;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

function useAuthSchemas() {
  const tLoginSchema = useTranslations('Validation.loginSchema');
  const tRegisterSchema = useTranslations('Validation.registerSchema');
  const tForgotPasswordSchema = useTranslations(
    'Validation.forgotPasswordEmailSchema'
  );

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z
          .email({ message: tLoginSchema('emailInvalid') })
          .nonempty({ message: tLoginSchema('emailRequired') }),
        password: z
          .string()
          .min(8, { message: tLoginSchema('passwordMinLength') })
          .max(32, { message: tLoginSchema('passwordMaxLength') })
          .regex(passwordRegex, {
            message: tLoginSchema('passwordInvalid'),
          })
          .nonempty({ message: tLoginSchema('passwordRequired') }),
      }),
    [tLoginSchema]
  );

  const registerSchema = useMemo(() => {
    return z
      .object({
        fullName: z
          .string()
          .max(200, { message: tRegisterSchema('fullNameMaxLength') })
          .nonempty({ message: tRegisterSchema('fullNameRequired') }),
        email: loginSchema.shape.email,
        password: loginSchema.shape.password,
        confirmPassword: z
          .string()
          .nonempty({ message: tRegisterSchema('confirmPasswordRequired') }),
      })
      .refine(data => data.password === data.confirmPassword, {
        message: tRegisterSchema('confirmPasswordMismatch'),
        path: ['confirmPassword'],
      });
  }, [tRegisterSchema, loginSchema]);

  const forgotPasswordEmailSchema = useMemo(
    () =>
      z.object({
        email: loginSchema.shape.email,
      }),
    [loginSchema]
  );

  const forgotPasswordResetSchema = useMemo(
    () =>
      z
        .object({
          resetCode: z
            .string()
            .nonempty({ message: tForgotPasswordSchema('codeRequired') })
            .regex(/^[0-9]{6}$/, {
              message: tForgotPasswordSchema('invalidCode'),
            }),
          newPassword: loginSchema.shape.password,
          confirmPassword: registerSchema.shape.confirmPassword,
        })
        .refine(data => data.newPassword === data.confirmPassword, {
          message: tForgotPasswordSchema('passwordMismatch'),
          path: ['confirmPassword'],
        }),
    [loginSchema, tForgotPasswordSchema, registerSchema]
  );

  return {
    loginSchema,
    registerSchema,
    forgotPasswordEmailSchema,
    forgotPasswordResetSchema,
  };
}
export { useAuthSchemas };
