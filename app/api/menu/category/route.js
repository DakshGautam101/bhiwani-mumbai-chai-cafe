import { connectDB } from '@/lib/ConnectDB';
import { Category } from '@/app/models/categoryModel';
import { User } from '@/app/models/userModel';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Helper to check admin
async function isAdmin(req) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return false;
  }
  const user = await User.findById(decoded.id);
  return user && user.role === 'admin';
}

// GET: Fetch all categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({});
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST: Create a new category (admin only)
export async function POST(req) {
  try {
    await connectDB();
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const category = new Category({ name: body.name, description: body.description || '' });
    await category.save();
    return NextResponse.json({ message: 'Category created', category });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

// PUT: Update a category by id (admin only)
export async function PUT(req) {
  try {
    await connectDB();
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Category id is required' }, { status: 400 });
    }
    const updateFields = {};
    if (body.name) updateFields.name = body.name;
    if (body.description !== undefined) updateFields.description = body.description;
    const category = await Category.findByIdAndUpdate(body.id, updateFields, { new: true });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Category updated', category });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE: Delete a category by id (admin only)
export async function DELETE(req) {
  try {
    await connectDB();
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Category id is required' }, { status: 400 });
    }
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Category deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
} 