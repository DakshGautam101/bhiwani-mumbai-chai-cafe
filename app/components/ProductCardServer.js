// No 'use client' directive here
import ProductCard from './ProductCard';
import { notFound } from 'next/navigation';

async function getCategoryById(id) {
  try {
    const base_url = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:3000/api';
    const res = await fetch(`${base_url}/menu/GetCategories/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function fetchCategoryItems(categoryId) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/GetCategoryItems?categoryId=${categoryId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ProductCardServer({ params }) {
  const category = await getCategoryById(params.categoryId);
  if (!category) return notFound();

  const items = await fetchCategoryItems(params.categoryId);

  return <ProductCard category={category} items={items} />;
}