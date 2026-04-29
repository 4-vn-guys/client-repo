'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

type Props = {
  children: React.ReactNode;
};

export function AppGoogleOAuthProvider({ children }: Props) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  if (!clientId) {
    return <>{children}</>;
  }

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}
