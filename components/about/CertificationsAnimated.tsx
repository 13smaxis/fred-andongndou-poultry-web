"use client";

import { motion } from 'framer-motion';
import { Shield, Award, Leaf, Heart } from 'lucide-react';

const certifications = [
  { icon: Shield, title: 'USDA Certified', desc: 'Meets all federal poultry standards' },
  { icon: Award, title: 'Good Agricultural Practices', desc: 'GAP certified farm operations' },
  { icon: Leaf, title: 'Sustainable Farming', desc: 'Eco-friendly farming methods' },
  { icon: Heart, title: 'Animal Welfare Approved', desc: 'Humane treatment of all birds' },
];

export default function CertificationsAnimated() {
  return (
    <motion.div
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {certifications.map((cert, idx) => (
        <motion.div
          key={cert.title}
          initial={{ x: idx % 2 === 0 ? -120 : 120, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: idx * 0.12, ease: 'easeOut' }}
          className="rounded-xl bg-amber-100/70 p-6 text-center"
        >
          <cert.icon className="mx-auto mb-3 h-10 w-10 text-amber-700" />
          <h3 className="mb-1 font-semibold text-gray-900">{cert.title}</h3>
          <p className="text-sm text-gray-600">{cert.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
