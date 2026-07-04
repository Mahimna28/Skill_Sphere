"use client";

import { motion } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "none";

function getInitial(direction: Direction) {
  if (direction === "up") return { opacity: 0, y: 24 };
  if (direction === "down") return { opacity: 0, y: -24 };
  if (direction === "left") return { opacity: 0, x: 24 };
  if (direction === "right") return { opacity: 0, x: -24 };
  return { opacity: 0 };
}

function getAnimate(direction: Direction) {
  if (direction === "up" || direction === "down") return { opacity: 1, y: 0 };
  if (direction === "left" || direction === "right") return { opacity: 1, x: 0 };
  return { opacity: 1 };
}

export function FadeIn({
  children,
  delay = 0,
  className = "",
  duration = 0.5,
  ease = "easeOut",
  direction = "none",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
  ease?: string | number[];
  direction?: Direction;
}) {
  return (
    <motion.div
      initial={getInitial(direction)}
      whileInView={getAnimate(direction)}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
