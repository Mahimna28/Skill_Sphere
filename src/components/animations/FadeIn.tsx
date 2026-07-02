"use client";

import { motion } from "framer-motion";

export function FadeIn({ children, delay = 0, className = "", duration = 0.5, ease = "easeOut" }: { children: React.ReactNode, delay?: number, className?: string, duration?: number, ease?: string | number[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
