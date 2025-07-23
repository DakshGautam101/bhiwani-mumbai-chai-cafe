'use client';

import { Lock, Mail } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import UniversalLoader from '../components/UniversalLoader';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [toastShown, setToastShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setToastShown(false);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setToastShown(true);
        toast.success('Login successful!');
        setTimeout(() => {
          router.push('/auth/profile');
        }, 1000);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error && !toastShown) {
      toast.error(error);
      setToastShown(true);
    }
  }, [error, toastShown]);

  return (
    <>
      {isLoading && <UniversalLoader />}
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md bg-background border border-orange-400 dark:bg-gray-900 shadow-xl rounded-2xl p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center text-orange-400">Login</h1>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="flex items-center border rounded-md px-3 py-2 w-full focus-within:ring-2 focus-within:ring-orange-400">
              <Mail className="mr-2 text-orange-400" />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none text-sm"
                type="email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center border rounded-md px-3 py-2 w-full focus-within:ring-2 focus-within:ring-orange-400">
              <Lock className="mr-2 text-orange-400" />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none text-sm"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 rounded-md bg-orange-400 hover:bg-orange-500 text-white font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
