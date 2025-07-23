'use client';

import React, { useContext } from 'react';
import SignupPage from '../Pages/SignupPage';
import { UserContext } from '@/context/UserContext';
import LoginPage from '../Pages/LoginPage';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import ProfilePage from '../Pages/ProfilePage';
import UniversalLoader from '../components/UniversalLoader';

const AuthPage = () => {
  const { user, setUser, isLoading } = useContext(UserContext);
  const router = useRouter();

  if (isLoading) {
    return (
      <>
        <UniversalLoader />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        {user ? <ProfilePage /> : <SignupPage />}
        <Toaster />
      </div>
    </>
  );
};

export default AuthPage;
