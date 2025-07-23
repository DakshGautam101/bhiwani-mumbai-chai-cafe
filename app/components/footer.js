"use client";
import React, { useContext, useState } from "react";
import { Mail, Phone, User, Facebook, Instagram, Twitter, Star, Laptop2, Github } from "lucide-react";
import ReviewDialog from "./reviewDialog";
import UserDialog from "./UserDialog";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/UserContext";

const Footer = () => {
  const [open, setOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);

  return (
    <footer className="bg-gradient-to-r from-black via-gray-900 to-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-bold text-orange-400 mb-3">Contact</h2>
          <p className="flex items-center text-gray-300">
            <Mail className="w-4 h-4 mr-2 text-blue-400" />
            <a
              href="mailto:contact@cafe.com"
              className="hover:underline"
            >
              contact@cafe.com
            </a>
          </p>
          <p className="flex items-center mt-1 text-gray-300">
            <Phone className="w-4 h-4 mr-2 text-green-400" />
            (123) 456-7890
          </p>

          <div className="flex items-center gap-3 mt-4">
            <img
              src="/owner.jpg"
              alt="Owner"
              className="w-14 h-14 rounded-full border-2 border-orange-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-200 flex items-center">
                <User className="w-4 h-4 mr-1" /> Owned by: Sumit Sharma
              </p>
              <p className="text-xs text-gray-400">
                Shri Annapurna Foods & Bhiwani Mumbai Chai Cafe
              </p>
            </div>
          </div>
        </div>

        {/* Social */}
        <div>
          <h2 className="text-xl font-bold text-orange-400 mb-3">Follow Us</h2>
          <div className="space-y-2 text-gray-300">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-blue-500"
            >
              <Facebook className="w-4 h-4 mr-2" /> Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-pink-500"
            >
              <Instagram className="w-4 h-4 mr-2" /> Instagram
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-sky-400"
            >
              <Twitter className="w-4 h-4 mr-2" /> Twitter
            </a>
          </div>
        </div>

        {/* Review Section */}
        <div>
          <h2 className="text-xl font-bold text-orange-400 mb-3">Reviews</h2>
          <p className="text-gray-300 flex items-center">
            <Star className="w-4 h-4 mr-2 text-yellow-400" />
            We value your feedback!
          </p>
          <Button
            className="mt-3 bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => {
              if (user) {
                setOpen(true);
              } else {
                setUserDialogOpen(true);
              }
            }}
          >
            Leave a Review
          </Button>
          <ReviewDialog open={open} onOpenChange={setOpen} />
          <UserDialog open={userDialogOpen} onOpenChange={setUserDialogOpen} setUser={setUser} />

        </div>

        {/* Developer Insights */}
        <div className="bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-700">
          <div className="flex items-center mb-3 text-green-400 font-bold text-lg">
            <Laptop2 className="w-5 h-5 mr-2" />
            Developer Insights
          </div>
          <p className="text-sm text-gray-300 mb-2">
            Designed & Developed by <span className="font-semibold text-white">Daksh Gautam</span>
          </p>
          <p className="text-sm text-gray-400 mb-3">
            Built using Next.js, Tailwind CSS, Zustand, and Framer Motion.
          </p>
          <a
            href="https://github.com/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-400 hover:underline text-sm"
          >
            <Github className="w-4 h-4 mr-1" /> View GitHub →
          </a>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Chai Cafe. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
