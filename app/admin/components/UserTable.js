'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';

const UserTable = ({ users, onDelete, loading }) => {
  if (loading) {
    return <p className="text-center py-8 text-muted-foreground">Loading users...</p>;
  }

  if (!users || !Array.isArray(users) || users.length === 0) {
    return <p className="text-center py-8 text-muted-foreground">No user data available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full text-sm">
        <TableCaption className="text-muted-foreground">All registered users with roles and reviews</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">User Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Reviews</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead className="text-right">Role</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, idx) => (
            <TableRow
              key={user._id}
              className={idx % 2 === 0 ? 'bg-muted/40 dark:bg-muted/10' : ''}
            >
              <TableCell className="font-medium"><Avatar>
                <AvatarImage src={user.avatar} />
                </Avatar></TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.address || <span className="text-muted-foreground">N/A</span>}</TableCell>
              <TableCell>{user.phone || <span className="text-muted-foreground">N/A</span>}</TableCell>
              <TableCell>{user.reviews?.length || 0}</TableCell>
              <TableCell>{user.orders?.length || 0}</TableCell>
              <TableCell className="text-right capitalize">{user.role}</TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="destructive"
                    size="icon"
                    aria-label="Delete user"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this user?')) {
                        onDelete(user._id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Link href={`/admin/user/${user._id}`} passHref legacyBehavior>
                    <Button
                      as="a"
                      variant="outline"
                      size="icon"
                      aria-label="Edit user"
                      title="Edit user"
                      className="cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
