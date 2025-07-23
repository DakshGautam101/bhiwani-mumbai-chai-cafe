'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import UserTable from '../../components/UserTable';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/admin/api/FetchUsers');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        toast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const response = await fetch('/admin/api/DeleteUsers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Error deleting user');

      setUsers(prev => prev.filter(user => user._id !== userId));
      toast.success(result.message || 'User deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Deletion failed');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          User Management
        </h1>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none dark:bg-gray-700 dark:text-white"
          />
          <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto">
            + Add User
          </Button>
        </div>

        <UserTable users={filteredUsers} onDelete={handleDelete} loading={loading} />
      </div>
    </div>
  );
};

export default UserManagementPage;
