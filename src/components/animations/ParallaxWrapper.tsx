"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ParallaxWrapper({
  children,
  className = "",
  offset = 50,
  speed,
}: {
  children: React.ReactNode;
  className?: string;
  offset?: number;
  speed?: number;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Allow `speed` as an alias (speed=0.3 → offset=30)
  const effectiveOffset = speed !== undefined ? speed * 100 : offset;
  const y = useTransform(scrollYProgress, [0, 1], [-effectiveOffset, effectiveOffset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
