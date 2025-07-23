import { Item } from '@/app/models/itemsModel';
import { User } from '@/app/models/userModel';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req, { params }) {
  const { id } = params;
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Check admin
  const adminUser = await User.findById(decoded.id);
  if (!adminUser || adminUser.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const item = await Item.findById(id);
  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
  return NextResponse.json({ item });
}

export async function PUT(req, { params }) {
  const { id } = params;
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Check admin
  const adminUser = await User.findById(decoded.id);
  if (!adminUser || adminUser.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await req.json();
  const updateFields = {};
  if (body.name) updateFields.name = body.name;
  if (body.description) updateFields.description = body.description;
  if (body.price) updateFields.price = body.price;
  if (body.category) updateFields.category = body.category;
  if (body.image) updateFields.image = body.image;
  if (body.available !== undefined) updateFields.available = body.available;
  const item = await Item.findByIdAndUpdate(id, updateFields, { new: true });
  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
  return NextResponse.json({ item });
}

// Single DELETE handler for both review and item deletion
export async function DELETE(req, { params }) {
  const { id } = params;
  const url = new URL(req.url);
  const reviewIdx = url.searchParams.get('reviewIdx');
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  const adminUser = await User.findById(decoded.id);
  if (!adminUser || adminUser.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // If reviewIdx is present, delete a review
  if (reviewIdx !== null && reviewIdx !== undefined) {
    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    if (
      !item.reviews ||
      !Array.isArray(item.reviews) ||
      reviewIdx < 0 ||
      reviewIdx >= item.reviews.length
    ) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    item.reviews.splice(reviewIdx, 1);
    await item.save();
    return NextResponse.json({ item });
  }

  // Otherwise, delete the item
  const item = await Item.findByIdAndDelete(id);
  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Item deleted successfully' });
}