'use client';

import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/UserContext';
import UniversalLoader from '../components/UniversalLoader';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import PreviewSection from './components/preview';

const AdminPage = () => {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [menuItemsCount, setMenuItemsCount] = useState(0);

  const fetchUserCount = async () => {
    try {
      const response = await fetch('/admin/api/UserCount');
      const data = await response.json();
      if (data.error) toast.error(data.error);
      setUserCount(data.userCount || 0);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch user count');
    }
  };

  const fetchMenuItemsCount = async () => {
    try {
      const response = await fetch('/admin/api/ItemsCount');
      const data = await response.json();
      if (data.error) toast.error(data.error);
      setMenuItemsCount(data.itemsCount || 0);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch menu items count');
    }
  };

  useEffect(() => {
    fetchUserCount();
    fetchMenuItemsCount();
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem('token');
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/auth');
    } catch {
      toast.error('Failed to logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-100 mb-2">Access Denied</h1>
          <p className="text-gray-500 dark:text-gray-300 mb-6">Please log in with an admin email to access the dashboard.</p>
          <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => router.push('/auth')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-500 dark:text-gray-300 mb-6">You don’t have admin privileges.</p>
          <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => router.push('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoggingOut && <UniversalLoader />}
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
        <div className="max-w-screen mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your café and monitor key metrics.</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-2 py-1 text-sm rounded bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">Admin</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Welcome, {user.name}</span>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Button>
              </div>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Cards */}
              <div className="bg-orange-100 dark:bg-orange-900 p-6 rounded-lg shadow hover:shadow-md transition">
                <h3 className="text-md font-semibold text-orange-800 dark:text-orange-200 mb-1">Total Users</h3>
                <p className="text-4xl font-bold text-orange-600 dark:text-orange-300">{userCount}</p>
              </div>

              <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg shadow hover:shadow-md transition">
                <h3 className="text-md font-semibold text-green-800 dark:text-green-200 mb-1">Total Orders</h3>
                <p className="text-4xl font-bold text-green-600 dark:text-green-300">0</p>
              </div>

              <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg shadow hover:shadow-md transition">
                <h3 className="text-md font-semibold text-blue-800 dark:text-blue-200 mb-1">Menu Items</h3>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-300">{menuItemsCount}</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => router.push('/menu')}>
                  Manage Menu
                </Button>
                <Button variant="outline" onClick={() => router.push('/')}>
                  View Website
                </Button>
                <Button className='bg-orange-500 hover:bg-orange-600'
                  onClick={() => router.push('/admin/customize')}
                >
                    Customize the Website
                </Button>
              </div>
            
              <PreviewSection url="https://bhiwani-mumbai-chai-cafe.vercel.app/" />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminPage;
