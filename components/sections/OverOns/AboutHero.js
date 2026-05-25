"use client";
import { motion } from "framer-motion";

export default function AboutHero({ title, subtitle }) {
  return (
    <div className="relative z-10 text-center px-4 max-w-4xl">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-7xl font-bold uppercase text-text-primary max-sm:text-5xl mb-6"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="text-xl font-medium text-text-secondary"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
