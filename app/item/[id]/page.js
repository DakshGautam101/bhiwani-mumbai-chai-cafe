export const dynamic = 'force-dynamic';
import React from 'react';
import ItemPage from '../page/ItemPage';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import { notFound } from 'next/navigation';

async function getProduct(id) {
  const baseUrl ='http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/item/${id}`, { 
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      console.error('API Error:', errorData);
      throw new Error(`Failed to fetch product: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Debug logging
    console.log('Product data:', {
      id: data._id,
      name: data.name,
      categoryName: data.category?.name
    });

    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

const Page = async ({ params }) => {
  const { id } = params;
  
  try {
    const product = await getProduct(id);

    if (!product) {
      return notFound();
    }

    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <ItemPage {...product} id={product._id} />
        </div>
        <Footer />
      </>
    );
  } catch (error) {
    console.error('Page Error:', error);
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Product Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <a
              href="/menu"
              className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Back to Menu
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }
};

export default Page;