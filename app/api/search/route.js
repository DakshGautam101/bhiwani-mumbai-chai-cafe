import { connectDB } from '@/lib/ConnectDB';
import { NextResponse } from 'next/server';
import { Item } from '@/app/models/itemsModel'

export async function GET(request) {

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase() || '';
    const items = await Item.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }



}