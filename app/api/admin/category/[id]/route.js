import { User } from '@/app/models/userModel';
import { NextResponse } from 'next/server';
import { Category } from '@/app/models/categoryModel';
import jwt from 'jsonwebtoken';
import { connectDB } from "@/lib/ConnectDB";

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
 
  if (body.available !== undefined) updateFields.available = body.available;
  const category = await Category.findByIdAndUpdate(id, updateFields, { new: true });
  if (!category) {
    return NextResponse.json({ error: 'category not found' }, { status: 404 });
  }
  return NextResponse.json({ category });
}   

export async function DELETE(req, { params }) {
    const { id } = params;
    const authHeader = req.headers.get('Authorization');
    if (!authHeader ||!authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Check admin
    const adminUser = await User.findById(decoded.id);
    if (!adminUser || adminUser.role!== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Category deleted' });
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Category API Error:', error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}
