export const dynamic = 'force-dynamic';

import React from 'react';
import { notFound } from 'next/navigation';
import CategoryClientPage from './CategoryClientPage';

async function getCategoryData(categoryId) {
  if (!categoryId) {
    console.error('CategoryID is required');
    return null;
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // First API call - Get Category
    const categoryRes = await fetch(`${baseUrl}/api/menu/GetCategories/${categoryId}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!categoryRes.ok) {
      const errorText = await categoryRes.text();
      console.error('Category API Error:', errorText);
      return null;
    }

    const category = await categoryRes.json();

    // Second API call - Get Items
    const itemsRes = await fetch(`${baseUrl}/api/menu/GetCategoryItems?categoryId=${categoryId}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!itemsRes.ok) {
      const errorText = await itemsRes.text();
      console.error('Items API Error:', errorText);
      return { category, items: [] };
    }

    const items = await itemsRes.json();

    // Validate items structure
    if (!Array.isArray(items)) {
      console.error('Invalid items response format:', items);
      return { category, items: [] };
    }

    // Debug logging
    console.log('API Response Data:', {
      category: category.name,
      itemsCount: items.length,
      itemNames: items.map(i => i.name)
    });

    return { category, items };

  } catch (error) {
    console.error('Failed to fetch category data:', error);
    return null;
  }
}

export default async function CategoryPage({ params }) {
  const { categoryId } = await params;
  const data = await getCategoryData(categoryId);

  if (!data?.category) {
    console.error('No category data found');
    notFound();
  }

  // Debug logging
  console.log('Rendering page with data:', {
    categoryId,
    hasCategory: !!data.category,
    itemsCount: data.items.length
  });

  return (
    <CategoryClientPage 
      category={data.category}
      items={data.items}
    />
  );
}