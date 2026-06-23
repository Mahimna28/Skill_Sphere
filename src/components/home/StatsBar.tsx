"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useInView, useSpring } from "framer-motion";

function StatItem({ stat }: { stat: { label: string, value: number, prefix: string, suffix: string } }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // Spring animation for smooth count up
  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 1,
    restDelta: 0.5,
  });

  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView) {
      springValue.set(stat.value);
    }
  }, [isInView, springValue, stat.value]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      const rounded = Math.round(latest);
      setDisplayValue(rounded >= 1000 ? rounded.toLocaleString() : rounded.toString());
    });
  }, [springValue]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className="text-center flex flex-col items-center relative"
    >
      <div className="font-heading font-light text-[64px] text-[#1E1B2E] mb-2 leading-none">
        {stat.prefix}{displayValue}{stat.suffix}
      </div>
      <div className="font-sans text-[13px] font-medium text-[#8E8E93] uppercase tracking-[0.1em]">
        {stat.label}
      </div>
    </motion.div>
  );
}

export function StatsBar({ statsData }: { statsData: { userCount: number, courseCount: number, institutionCount: number, completionCount: number } }) {
  
  const dynamicStats = useMemo(() => [
    { label: "Active Learners", value: statsData.userCount, prefix: "", suffix: "" },
    { label: "Expert-Led Courses", value: statsData.courseCount, prefix: "", suffix: "" },
    { label: "Lessons Completed", value: statsData.completionCount, prefix: "", suffix: "" },
    { label: "Partner Institutions", value: statsData.institutionCount, prefix: "", suffix: "" },
  ], [statsData]);

  return (
    <section className="bg-[#F5F1EB] py-[120px] relative">
      {/* Top border divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl h-[1px] bg-[rgba(30,27,46,0.08)]" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-0">
          {dynamicStats.map((stat, i) => (
            <div key={i} className="flex-1 flex justify-center w-full relative">
              <StatItem stat={stat} />
              {/* Divider line between stats (desktop only) */}
              {i < dynamicStats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[60px] bg-[rgba(30,27,46,0.08)]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
