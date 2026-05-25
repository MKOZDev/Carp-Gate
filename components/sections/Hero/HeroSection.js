"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export default function HeroSection({ children }) {
  const ref = useRef(null);
  const isSmall = useMediaQuery("(max-width: 1280px)");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, isSmall ? 0 : 300]);

  return (
    <motion.section
      ref={ref}
      style={{ y }}
      className="relative h-[800px] max-7xl bg-bg-primary w-full flex items-start overflow-hidden max-sm:h-[80vh]"
    >
      {children}
    </motion.section>
  );
}
