/**
 * Global error handler utility
 * Extracts error messages from backend responses and supports i18n
 */

export interface BackendError {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode: number;
  };
}

/**
 * Error code mapping for i18n
 * Maps backend error codes to translation keys
 */
export const ERROR_CODE_MAP: Record<string, string> = {
  // Authentication errors
  INVALID_CREDENTIALS: 'Errors.invalidCredentials',
  USER_NOT_FOUND: 'Errors.userNotFound',
  USER_ALREADY_EXISTS: 'Errors.userAlreadyExists',
  UNAUTHORIZED: 'Errors.unauthorized',
  TOKEN_EXPIRED: 'Errors.tokenExpired',
  INVALID_TOKEN: 'Errors.invalidToken',
  
  // Validation errors
  VALIDATION_ERROR: 'Errors.validationError',
  INVALID_INPUT: 'Errors.invalidInput',
  MISSING_REQUIRED_FIELD: 'Errors.missingRequiredField',
  
  // Request errors
  BAD_REQUEST: 'Errors.badRequest',
  NOT_FOUND: 'Errors.notFound',
  FORBIDDEN: 'Errors.forbidden',
  
  // Server errors
  INTERNAL_ERROR: 'Errors.internalError',
  SERVICE_UNAVAILABLE: 'Errors.serviceUnavailable',
  
  // Business logic errors
  INSUFFICIENT_PERMISSIONS: 'Errors.insufficientPermissions',
  RESOURCE_NOT_FOUND: 'Errors.resourceNotFound',
  OPERATION_FAILED: 'Errors.operationFailed',
};

/**
 * Extracts error message from backend error response
 * @param error - Axios error object
 * @returns Error message string
 */
export const extractErrorMessage = (error: any): string => {
  // Try to extract from nested error structure
  const errorData = error?.response?.data as BackendError | undefined;
  
  if (errorData?.error?.message) {
    return errorData.error.message;
  }
  
  // Fallback to direct message
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Fallback to error message
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Gets error code from backend error response
 * @param error - Axios error object
 * @returns Error code string
 */
export const extractErrorCode = (error: any): string | null => {
  const errorData = error?.response?.data as BackendError | undefined;
  return errorData?.error?.code || null;
};

/**
 * Gets translation key for error code
 * @param errorCode - Backend error code
 * @returns Translation key or null if not found
 */
export const getErrorTranslationKey = (errorCode: string): string | null => {
  return ERROR_CODE_MAP[errorCode] || null;
};

/**
 * Formats error for display with optional i18n support
 * @param error - Axios error object
 * @param t - Optional translation function from useTranslations
 * @returns Formatted error message
 */
export const formatError = (
  error: any,
  t?: (key: string) => string
): string => {
  const errorCode = extractErrorCode(error);
  const errorMessage = extractErrorMessage(error);
  
  // If translation function provided and error code has translation
  if (t && errorCode) {
    const translationKey = getErrorTranslationKey(errorCode);
    if (translationKey) {
      try {
        return t(translationKey);
      } catch {
        // If translation fails, fall back to original message
        return errorMessage;
      }
    }
  }
  
  // Return original message
  return errorMessage;
};

/**
 * Simple error extractor without i18n (for use in interceptors)
 * @param error - Axios error object
 * @returns Error object with message and code
 */
export const parseBackendError = (error: any) => {
  return {
    message: extractErrorMessage(error),
    code: extractErrorCode(error),
    statusCode: error?.response?.status || 500,
  };
};
