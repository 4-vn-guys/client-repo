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

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
const phoneRegex = /^(0|\+84)[0-9]{9}$/;
const userNameRegex = /^(?!\s*$).+/;

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
          .max(16, { message: tLoginSchema('passwordMaxLength') })
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
        userName: z
          .string()
          .min(5, { message: tRegisterSchema('userNameMinLength') })
          .max(50, { message: tRegisterSchema('userNameMaxLength') })
          .regex(userNameRegex, {
            message: tRegisterSchema('userNameInvalid'),
          })
          .nonempty({ message: tRegisterSchema('userNameRequired') }),
        email: z.string(),
        phoneNumber: z.string(),
        password: z
          .string()
          .min(8, { message: tRegisterSchema('passwordMinLength') })
          .max(16, { message: tRegisterSchema('passwordMaxLength') })
          .regex(passwordRegex, {
            message: tRegisterSchema('passwordInvalid'),
          })
          .nonempty({ message: tRegisterSchema('passwordRequired') }),
        confirmPassword: z
          .string()
          .nonempty({ message: tRegisterSchema('confirmPasswordRequired') }),
      })
      .refine(
        data => {
          // At least one of email or phoneNumber must be provided
          return (
            (data.email && data.email.trim() !== '') ||
            (data.phoneNumber && data.phoneNumber.trim() !== '')
          );
        },
        {
          message: tRegisterSchema('emailOrPhoneRequired'),
          path: ['email'],
        }
      )
      .refine(
        data => {
          // If email is provided, it must be valid
          if (data.email && data.email.trim() !== '') {
            return z.string().email().safeParse(data.email).success;
          }
          return true;
        },
        {
          message: tRegisterSchema('emailInvalid'),
          path: ['email'],
        }
      )
      .refine(
        data => {
          // If phoneNumber is provided, it must be valid
          if (data.phoneNumber && data.phoneNumber.trim() !== '') {
            return phoneRegex.test(data.phoneNumber);
          }
          return true;
        },
        {
          message: tRegisterSchema('phoneNumberInvalid'),
          path: ['phoneNumber'],
        }
      )
      .refine(data => data.password === data.confirmPassword, {
        message: tRegisterSchema('confirmPasswordMismatch'),
        path: ['confirmPassword'],
      });
  }, [tRegisterSchema]);

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
