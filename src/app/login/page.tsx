// src/app/login/page.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeXml, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Simple Google Logo SVG
const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4">
    <path fill="#4285F4" d="M22.56,12.25C22.56,11.47 22.5,10.72 22.38,10H12V14.5H18.34C18.09,15.92 17.28,17.08 16.05,17.91V20.5H19.8C21.56,18.61 22.56,15.69 22.56,12.25Z"/>
    <path fill="#34A853" d="M12,23C15.24,23 17.95,21.84 19.8,20.04L16.05,17.45C14.95,18.27 13.59,18.75 12,18.75C9.31,18.75 7.06,17.04 6.18,14.72H2.31V17.41C4.12,20.79 7.75,23 12,23Z"/>
    <path fill="#FBBC05" d="M6.18,14.22C5.93,13.44 5.81,12.6 5.81,11.75C5.81,10.9 5.93,10.06 6.18,9.28V6.59H2.31C1.5,8.11 1,9.86 1,11.75C1,13.64 1.5,15.39 2.31,16.91L6.18,14.22Z"/>
    <path fill="#EA4335" d="M12,5.25C13.75,5.25 15.17,5.88 16.33,6.97L19.89,3.42C17.95,1.66 15.24,0.5 12,0.5C7.75,0.5 4.12,2.71 2.31,6.09L6.18,8.78C7.06,6.46 9.31,5.25 12,5.25Z"/>
  </svg>
);


export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || (!loading && user)) {
    return (
      <div className="flex min-h-[calc(100vh-var(--header-height,56px))] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height,56px))] flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CodeXml className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to PromptCoder</CardTitle>
          <CardDescription>Sign in to start generating code with AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={signInWithGoogle}
            className="w-full text-base py-6"
            variant="outline"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GoogleLogo />
            )}
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
