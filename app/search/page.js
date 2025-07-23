'use client';

export const dynamic = 'force-dynamic';


import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setResults(data.items));
    }
  }, [query]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{`Results for "${query}"`}</h1>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul className="grid gap-4">
          {results.map((item) => (
            <li key={item.id} className="p-4 border rounded-md">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-gray-600">{item.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResultsPage;
