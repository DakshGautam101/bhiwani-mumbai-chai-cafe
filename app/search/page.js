import React, { Suspense } from 'react';
import SearchResultsPage from './SearchResultsPage'; // <- your client component

const Page = () => {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading search results...</div>}>
      <SearchResultsPage />
    </Suspense>
  );
};

export default Page;
