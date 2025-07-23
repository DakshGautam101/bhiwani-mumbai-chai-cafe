// components/ui/counter.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { easeInOut } from 'framer-motion';

// interface CounterProps {
//   from: number;
//   to: number;
//   duration?: number;
//   className?: string;
// }

export const Counter = ({ 
  from, 
  to, 
  duration = 2, 
  className = '' 
}) => {
  const [count, setCount] = useState(from);
  const controls = useAnimation();

  useEffect(() => {
    const animateCounter = async () => {
      await controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: duration / 2 }
      });
      
      let start = from;
      const startTime = Date.now();
      const endTime = startTime + duration * 1000;
      
      const updateCounter = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / (duration * 1000), 1);
        
        // Ease-out quad function for smooth deceleration
        const easedProgress = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        const currentValue = Math.floor(from + (to - from) * easedProgress);
        setCount(currentValue);
        
        if (now < endTime) {
          requestAnimationFrame(updateCounter);
        } else {
          setCount(to);
        }
      };
      
      requestAnimationFrame(updateCounter);
    };

    animateCounter();
  }, [from, to, duration, controls]);

  return (
    <motion.span 
      className={className}
      animate={controls}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {count.toLocaleString()}
      {to >= 1000 && '+'}
    </motion.span>
  );
};