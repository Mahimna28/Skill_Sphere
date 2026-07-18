"use client";
import { motion } from "framer-motion";

const data = [
  {
    word: "Learn.",
    desc: "Structured courses across AI, programming, and computer science — designed by experts, paced for you.",
    pill: "500+ Lessons",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    word: "Create.",
    desc: "Build real projects, write code in-browser, and earn certificates that actually mean something.",
    pill: "Real Projects",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    word: "Connect.",
    desc: "Join live study groups, chat with peers, and get feedback from mentors who've been there.",
    pill: "Global Community",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    word: "Grow.",
    desc: "Track every milestone, climb the leaderboard, and turn curiosity into career-ready skills.",
    pill: "Gamified Progress",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

export function StickyWords() {
  return (
    <section className="relative py-24 md:py-32 bg-[#1E1B2E] overflow-hidden">
      {/* Background subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#C9A96E] opacity-[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#C9A96E] text-xs uppercase tracking-[0.25em] mb-4 font-medium font-sans">
            The Skill Sphere Way
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-white leading-tight">
            Everything you need to{" "}
            <span className="text-[#C9A96E]">succeed.</span>
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 flex flex-col gap-6 cursor-default overflow-hidden hover:border-[#C9A96E]/30 hover:bg-white/[0.05] transition-colors duration-300"
            >
              {/* Hover corner glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C9A96E] opacity-0 group-hover:opacity-[0.06] blur-2xl rounded-full -mr-6 -mt-6 transition-opacity duration-500 pointer-events-none" />

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E] shrink-0">
                {item.icon}
              </div>

              {/* Word */}
              <h3 className="font-heading text-5xl md:text-6xl text-white leading-none">
                {item.word}
              </h3>

              {/* Description */}
              <p className="font-sans text-sm text-white/60 leading-relaxed flex-grow">
                {item.desc}
              </p>

              {/* Pill */}
              <div className="mt-auto">
                <span className="inline-block bg-[#C9A96E]/10 text-[#C9A96E] border border-[#C9A96E]/20 rounded-full px-4 py-1.5 text-xs uppercase tracking-wider font-sans font-medium">
                  {item.pill}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F5F1EB] to-transparent pointer-events-none" />
    </section>
  );
}
