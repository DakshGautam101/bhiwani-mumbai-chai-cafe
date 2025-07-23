import React from 'react'
import ItemPage from '../page/ItemPage'
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';

async function getProduct(id) {
  // Add origin to make it a full URL
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/item/${id}`, { 
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

const Page = async ({ params }) => {
  const { id } = params;
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
}

export default Page