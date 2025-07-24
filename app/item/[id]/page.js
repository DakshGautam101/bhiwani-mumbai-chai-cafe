export const dynamic = 'force-dynamic';
import React from 'react'
import ItemPage from '../page/ItemPage'
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';

async function getProduct(id) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/item/${id}`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

const Page = async ({ params }) => {
  const { id } = await params;
  
  try {
    const product = await getProduct(id);

    return (
      <>
        <Navbar/>
        <div className="container mx-auto py-8">
          <ItemPage {...product} id={product._id} />
        </div>
        <Footer/>
      </>
    );
  } catch (error) {
    return (
      <>
        <Navbar/>
        <div className="container mx-auto py-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you &apos;re looking for doesn&apos;t exist.</p>
        </div>
        <Footer/>
      </>
    );
  }
}

export default Page