"use client";

import { motion } from "framer-motion";
import { Activity, Server, Database, Globe, CheckCircle2, Clock } from "lucide-react";

const SYSTEMS = [
  { name: "Web Application", icon: Globe, status: "Operational", uptime: "99.99%" },
  { name: "API Services", icon: Server, status: "Operational", uptime: "99.95%" },
  { name: "Database", icon: Database, status: "Operational", uptime: "99.98%" },
  { name: "AI Tutor Engine", icon: Activity, status: "Operational", uptime: "99.90%" }
];

const INCIDENTS = [
  {
    date: "July 01, 2026",
    status: "Resolved",
    title: "Degraded performance in Video Streaming",
    description: "Our CDN provider experienced routing issues in North America which caused increased buffering times. The issue was identified and resolved within 45 minutes."
  },
  {
    date: "June 15, 2026",
    status: "Resolved",
    title: "AI Tutor timeout errors",
    description: "A surge in usage caused intermittent timeout errors for the AI Study Tutor. We have since scaled our inference cluster to accommodate the new traffic baseline."
  }
];

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-[#F5F1EB] font-sans">
      
      <main className="pt-32 pb-24 px-6 relative">
        <div className="max-w-[800px] mx-auto">
          
          {/* Header Status */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[rgba(30,27,46,0.04)] mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-heading text-[32px] md:text-[40px] text-[#1E1B2E] font-bold leading-tight mb-2"
              >
                System Status
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[16px] text-[rgba(30,27,46,0.6)]"
              >
                Current status of Skill Sphere services
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.4, delay: 0.2 }}
              className="flex items-center gap-3 bg-[#10B981]/10 px-6 py-4 rounded-2xl border border-[#10B981]/20"
            >
              <div className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#10B981]"></span>
              </div>
              <span className="text-[#10B981] font-semibold tracking-wide">All Systems Operational</span>
            </motion.div>
          </div>

          {/* System Components */}
          <div className="space-y-4 mb-16">
            <h3 className="font-heading text-[24px] text-[#1E1B2E] font-bold mb-6">Uptime (Last 90 Days)</h3>
            {SYSTEMS.map((sys, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                key={sys.name} 
                className="bg-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between border border-[rgba(30,27,46,0.04)] gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F5F1EB] rounded-xl flex items-center justify-center">
                    <sys.icon className="text-[#1E1B2E]" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1E1B2E] text-[16px]">{sys.name}</h4>
                    <p className="text-[13px] text-[rgba(30,27,46,0.5)]">Uptime: {sys.uptime}</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:items-end gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-[#10B981]" size={18} />
                    <span className="text-[14px] font-medium text-[#1E1B2E]">{sys.status}</span>
                  </div>
                  
                  {/* Fake uptime bar */}
                  <div className="flex gap-1 h-8 w-full md:w-[200px] overflow-hidden rounded-md opacity-80">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div key={i} className="flex-1 bg-[#10B981] hover:bg-[#059669] transition-colors rounded-sm cursor-pointer" title="Operational"></div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Incident History */}
          <div>
            <h3 className="font-heading text-[24px] text-[#1E1B2E] font-bold mb-6">Past Incidents</h3>
            <div className="space-y-6">
              {INCIDENTS.map((inc, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + (idx * 0.1) }}
                  key={idx} 
                  className="relative pl-8 border-l-2 border-[rgba(30,27,46,0.1)]"
                >
                  <div className="absolute w-4 h-4 rounded-full bg-[#C9A96E] -left-[9px] top-1"></div>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="text-[14px] font-medium text-[#8E8E93] flex items-center gap-1"><Clock size={14} /> {inc.date}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-green-100 text-green-700">{inc.status}</span>
                  </div>
                  <h4 className="font-heading text-[18px] text-[#1E1B2E] font-bold mb-2">{inc.title}</h4>
                  <p className="text-[15px] text-[rgba(30,27,46,0.7)] leading-relaxed">{inc.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
