import React from 'react';
import { notFound } from 'next/navigation';
import CategoryPageClient from '@/app/components/CategoryPageClient';

async function getCategoryData(categoryId) {
  if (!categoryId) {
    console.error('CategoryID is required');
    return null;
  }

  try {
    // First API call - Get Category
    const categoryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/menu/GetCategories/${categoryId}`, {
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
    const itemsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/menu/GetCategoryItems?categoryId=${categoryId}`, {
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
  const data = await getCategoryData(params.categoryId);

  if (!data?.category) {
    console.error('No category data found');
    notFound();
  }

  // Debug logging
  console.log('Rendering page with data:', {
    categoryId: params.categoryId,
    hasCategory: !!data.category,
    itemsCount: data.items.length
  });

  return (
    <CategoryPageClient 
      category={data.category}
      items={data.items}
    />
  );
}
