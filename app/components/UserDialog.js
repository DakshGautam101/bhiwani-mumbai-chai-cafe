"use client";
import { UserContext } from "@/context/UserContext";
import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const UserDialog = ({open , setOpen}) => {
  const { user } = useContext(UserContext);


  return (
    <Dialog open = {open} onOpenChange={setOpen}>
      <DialogContent className="text-center space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Authentication Required
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            To continue using this feature, please sign in to your account.
            Logging in allows us to personalize your experience and ensure secure access to your profile, orders, and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-4 mt-4">
          <Link href="/auth/login" passHref>
            <Button variant="default" className="bg-orange-400 hover:bg-orange-500">
              Login
            </Button>
          </Link>
          <Link href="/auth/signup" passHref>
            <Button variant="outline" className="border-orange-400 text-orange-400 hover:bg-orange-50">
              Create Account
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
