'use client';

import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

const NotImplementedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 dark:bg-zinc-900 px-4 text-center">
      {/* Icon or placeholder illustration */}
      <div className="mb-6">
        <div className="text-6xl text-orange-500 dark:text-orange-400">⚠️</div>
      </div>

      {/* Message */}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        This functionality is not yet implemented.
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        &rsquo;re working on bringing this feature to you soon!
      </p>

      {/* Redirect Link */}
      <Link
        href="/auth/profile"
        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition"
      >
        <FaArrowLeft />
        Back to Profile page
      </Link>
    </div>
  );
};

export default NotImplementedPage;
