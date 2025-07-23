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
  const user = await User.findById(id).select('-password');
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ user });
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
  if (body.phone) updateFields.phone = body.phone;
  if (body.address) updateFields.address = body.address;
  if (body.role) updateFields.role = body.role;
  if (body.avatar) updateFields.avatar = body.avatar;
  const user = await User.findByIdAndUpdate(id, updateFields, { new: true }).select('-password');
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ user });
} 