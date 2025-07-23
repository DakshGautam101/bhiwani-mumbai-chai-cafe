'use client';

import React from 'react';

const PreviewSection = ({ url = '/' }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md h-[600px]">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Website Preview</h2>
      </div>
      <iframe
        src={url}
        title="Website Preview"
        className="w-full h-full"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
};

export default PreviewSection;
