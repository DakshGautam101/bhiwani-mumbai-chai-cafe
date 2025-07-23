"use client";
import { Lock, Mail, Phone, User } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { UserContext } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import axiosInstance from "@/lib/axios";
import Navbar from '../components/navbar';
import UniversalLoader from '../components/UniversalLoader';

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/auth/signup', form);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      toast.success('Signup successful! Please verify your email.');
      router.push('/auth/verify-email');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <UniversalLoader />}
      <Navbar/>
      <div className="flex items-center justify-center min-h-[80vh] w-full px-4">
        <div className="w-full max-w-md bg-background border border-orange-400 dark:bg-gray-900 shadow-xl rounded-2xl p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center text-orange-400">Sign Up</h1>

          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="flex items-center border rounded-md px-3 py-2 w-full focus-within:ring-2 focus-within:ring-orange-400">
              <User className="mr-2 text-orange-400" />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-transparent outline-none text-sm"
                required
                disabled={loading}
                />
            </div>

            <div className="flex items-center border rounded-md px-3 py-2 w-full focus-within:ring-2 focus-within:ring-orange-400">
              <Mail className="mr-2 text-orange-400" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-transparent outline-none text-sm"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center border rounded-md px-3 py-2 w-full focus-within:ring-2 focus-within:ring-orange-400">
              <Lock className="mr-2 text-orange-400" />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-transparent outline-none text-sm"
                required
                disabled={loading}
                />
            </div>

            <div className="flex items-center border rounded-md px-3 py-2 w-full focus-within:ring-2 focus-within:ring-orange-400">
              <Phone className="mr-2 text-orange-400" />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full bg-transparent outline-none text-sm"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md bg-orange-400 hover:bg-orange-500 text-white font-semibold transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-orange-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
