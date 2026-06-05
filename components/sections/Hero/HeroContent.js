"use client";
import { motion } from "framer-motion";
import PrimaryBtn from "@/components/ui/PrimaryBtn";

export default function HeroContent({ title, subtitle, cta, href }) {
  return (
    <div className="flex flex-col items-start gap-8 relative max-w-xl">
      <motion.h1
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        className="text-7xl font-bold uppercase text-text-primary max-sm:text-5xl"
      >
        {title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
        className="text-xl font-medium text-text-secondary"
      >
        {subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
      >
        <PrimaryBtn href={href}>
          {cta}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M5 12h14"></path>
            <path d="m13 5 7 7-7 7"></path>
          </svg>
        </PrimaryBtn>
      </motion.div>
    </div>
  );
}
