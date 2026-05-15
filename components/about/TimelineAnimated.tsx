"use client";

import { motion } from 'framer-motion';

type TimelineItem = {
  year: string;
  event: string;
};

type TimelineAnimatedProps = {
  items: TimelineItem[];
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { y: 48, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function TimelineAnimated({ items }: TimelineAnimatedProps) {
  return (
    <motion.div
      className="mx-auto max-w-2xl"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          variants={cardVariants}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 flex gap-4 last:mb-16"
        >
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
              {item.year}
            </div>
            {idx < items.length - 1 && <div className="mt-2 w-0.5 flex-1 bg-green-200" />}
          </div>
          <div className="flex-1 rounded-lg border-l-4 border-green-500 bg-white p-4 shadow-sm">
            <p className="font-medium text-gray-800">{item.event}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
