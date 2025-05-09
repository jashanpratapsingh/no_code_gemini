// src/contexts/AuthContext.tsx
"use client";
import type { User } from 'firebase/auth';
import { auth as firebaseAuthService, googleProvider as firebaseGoogleProvider } from '@/lib/firebase/config';
import { onAuthStateChanged, signOut as firebaseSignOut, signInWithPopup } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (firebaseAuthService) {
      try {
        unsubscribe = onAuthStateChanged(firebaseAuthService, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error subscribing to onAuthStateChanged:", error);
        setLoading(false);
      }
    } else {
      console.error("Firebase auth service is not available. Firebase might not have initialized correctly. Auth features will be disabled.");
      setLoading(false); 
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!firebaseAuthService || !firebaseGoogleProvider) {
      console.error("Firebase auth service or Google provider not available for sign-in.");
      setLoading(false); // Ensure loading state is updated if we bail early
      return;
    }
    setLoading(true);
    try {
      await signInWithPopup(firebaseAuthService, firebaseGoogleProvider);
      // onAuthStateChanged will handle user state update and setLoading(false)
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      setLoading(false); // Explicitly set loading to false on error
    }
  };

  const signOut = async () => {
    if (!firebaseAuthService) {
      console.error("Firebase auth service not available for sign-out.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      await firebaseSignOut(firebaseAuthService);
      router.push('/login');
      // onAuthStateChanged will set user to null and setLoading(false)
    } catch (error) {
      console.error("Error signing out: ", error);
      setLoading(false); // Explicitly set loading to false on error
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error("useAuth error: AuthContext is undefined. This typically means AuthProvider is not an ancestor, or it crashed before rendering its Provider component.");
    throw new Error('useAuth must be used within an AuthProvider. Check for errors during Firebase initialization or AuthProvider rendering.');
  }
  return context;
};
