import React from 'react';
import { notFound } from 'next/navigation';
import CategoryClientPage from './CategoryClientPage';

async function getCategoryData(categoryId) {
  if (!categoryId) {
    console.error('CategoryID is required');
    return null;
  }

  try {
    // Get Category
    const categoryRes = await fetch(`http://localhost:3000/api/menu/GetCategories/${categoryId}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!categoryRes.ok) {
      console.error(`Category API Error: ${categoryRes.status}`);
      return null;
    }

    const category = await categoryRes.json();

    // Get Category Items
    const itemsRes = await fetch(`http://localhost:3000/api/menu/GetCategoryItems?categoryId=${categoryId}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!itemsRes.ok) {
      console.error(`Items API Error: ${itemsRes.status}`);
      return { category, items: [] };
    }

    const items = await itemsRes.json();
    
    // Debug logging
    console.log('Category Data:', {
      categoryId,
      categoryName: category.name,
      itemsCount: items.length
    });

    return {
      category,
      items: Array.isArray(items) ? items : []
    };

  } catch (error) {
    console.error('Failed to fetch category data:', error);
    return null;
  }
}

export default async function CategoryPage({ params }) {
  try {
    const data = await getCategoryData(params.categoryId);

    if (!data?.category) {
      console.error('No category found for ID:', params.categoryId);
      notFound();
    }

    return (
      <CategoryClientPage 
        category={data.category}
        items={data.items}
      />
    );
  } catch (error) {
    console.error('Error in CategoryPage:', error);
    notFound();
  }
}

export const dynamic = 'force-dynamic';