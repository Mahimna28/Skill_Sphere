"use client";

import { motion } from "framer-motion";

export function SlideUp({ children, delay = 0, y = 20, className = "" }: { children: React.ReactNode, delay?: number, y?: number, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
