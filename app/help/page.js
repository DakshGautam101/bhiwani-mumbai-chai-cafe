'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaChevronDown } from 'react-icons/fa';
import Footer from '../components/footer';
import Navbar from '../components/navbar';

const faqs = [
  {
    question: 'How can I place an order?',
    answer:
      'You can place an order by visiting our menu page and clicking "Order Now" on your desired item.',
  },
  {
    question: 'What are your delivery hours?',
    answer: 'We deliver from 8:00 AM to 10:00 PM every day, including weekends.',
  },
  {
    question: 'Can I modify or cancel my order?',
    answer:
      'Yes, you can modify or cancel your order within 10 minutes of placing it by calling our support number.',
  },
  {
    question: 'Do you offer bulk or corporate orders?',
    answer:
      'Yes, we do. Please contact us directly via phone or email for bulk order inquiries.',
  },
];

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className="border-b py-4 cursor-pointer group"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white group-hover:text-orange-500 transition">
          {question}
        </h3>
        <FaChevronDown
          className={`transform transition-transform ${
            open ? 'rotate-180 text-orange-500' : 'rotate-0 text-gray-400'
          }`}
        />
      </div>
      {open && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-gray-600 dark:text-gray-300"
        >
          {answer}
        </motion.p>
      )}
    </div>
  );
};

export default function HelpPage() {
  return (
    <>
    <Navbar/>
    <div className="bg-white dark:bg-zinc-900 text-gray-800 dark:text-white min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-10"
        >
          Help & Support
        </motion.h1>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 text-orange-500">Frequently Asked Questions</h2>
          <div className="divide-y divide-gray-200 dark:divide-zinc-700">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </motion.section>

        {/* Contact Options */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 text-orange-500">Contact Us</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-orange-50 dark:bg-zinc-800 p-6 rounded-xl shadow">
              <FaPhoneAlt className="text-orange-500 text-xl mb-2" />
              <h3 className="font-semibold text-lg">Phone Support</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Call us at:</p>
              <a href="tel:+911234567890" className="text-orange-600 font-medium">
                +91 123-456-7890
              </a>
            </div>

            <div className="bg-orange-50 dark:bg-zinc-800 p-6 rounded-xl shadow">
              <FaEnvelope className="text-orange-500 text-xl mb-2" />
              <h3 className="font-semibold text-lg">Email Support</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Email us at:</p>
              <a href="mailto:support@cafe.com" className="text-orange-600 font-medium">
                support@cafe.com
              </a>
            </div>
          </div>
        </motion.section>

        {/* Still Need Help */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center bg-orange-100 dark:bg-zinc-800 p-10 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-bold text-orange-600 mb-4">Still Need Help?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            If your issue isn’t listed above, we’re just a message away!
          </p>
          <a
            href="mailto:support@cafe.com"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Contact Support
          </a>
        </motion.section>
      </div>
    </div>
    <Footer/>
    </>
  );
}
