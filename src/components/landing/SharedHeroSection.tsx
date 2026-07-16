"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type SharedHeroSectionProps = {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  ctaText?: string;
  ctaLink?: string;
};

export function SharedHeroSection({
  title,
  subtitle,
  description,
  backgroundImage,
  ctaText,
  ctaLink
}: SharedHeroSectionProps) {
  const appleEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];
  
  return (
    <section className="relative h-[80vh] min-h-[500px] max-h-[800px] flex items-center justify-center bg-[#1E1B2E] overflow-hidden">
      {/* Animated background with normal blur */}
      <motion.div
        initial={{ scale: 1.0 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 z-0 origin-center"
      >
        <img
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-cover opacity-50 blur-[3px]"
          onError={(e) => { e.currentTarget.src = "/images/hero-bg.jpg"; }}
        />
      </motion.div>

      {/* Centered content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: appleEase }}
          className="mb-8"
        >
          <span className="font-sans text-[12px] uppercase tracking-[0.15em] text-[#C9A96E]">
            {subtitle}
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: appleEase }}
          className="font-heading font-bold text-[42px] md:text-[72px] lg:text-[96px] text-white leading-[0.95] mb-8 max-w-[1000px]"
        >
          {title}
        </motion.h1>

        {/* Subtitle / Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: appleEase }}
          className="font-sans text-[17px] md:text-[20px] leading-[1.5] text-[#F5F1EB] mb-12 max-w-[560px]"
        >
          {description}
        </motion.p>

        {/* CTA button */}
        {ctaText && ctaLink && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0, ease: appleEase }}
          >
            <Link href={ctaLink}>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 6px 24px rgba(201,169,110,0.55)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-[#C9A96E] text-[#1E1B2E] font-sans font-medium text-[17px] rounded-full px-10 py-4 shadow-[0_4px_14px_rgba(201,169,110,0.4)] block"
              >
                {ctaText}
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Scroll indicator line */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-white/40 text-xs font-mono tracking-widest uppercase">Scroll to explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
