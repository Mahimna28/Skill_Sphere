"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    category: "General",
    questions: [
      {
        q: "What is Skill Sphere?",
        a: "Skill Sphere is a premium, AI-powered learning platform designed to bridge the gap between students and expert educators. We offer interactive courses, real-time AI tutoring, and a thriving community."
      },
      {
        q: "Is Skill Sphere free to use?",
        a: "We offer both free and premium courses. Core platform features like community access and basic AI tutoring are available to all registered users."
      },
      {
        q: "How do I create an account?",
        a: "Simply click the 'Get Started' button in the top right corner. You can sign up using your email address or securely authenticate with your Google account."
      }
    ]
  },
  {
    category: "For Students",
    questions: [
      {
        q: "How does the AI Study Tutor work?",
        a: "Our AI Study Tutor acts as a 24/7 personal teaching assistant. It analyzes your course materials and can answer questions, summarize concepts, and quiz you on what you've learned."
      },
      {
        q: "Can I earn certificates for completing courses?",
        a: "Yes! Upon successfully completing all modules and assignments in a certified course, you will automatically receive a verifiable digital certificate."
      }
    ]
  },
  {
    category: "For Teachers & Institutions",
    questions: [
      {
        q: "How do I become a teacher on Skill Sphere?",
        a: "You can apply to be a teacher from your dashboard. Once approved by an administrator, you'll gain access to our powerful course builder and student management tools."
      },
      {
        q: "Can my school or university use Skill Sphere?",
        a: "Absolutely. We offer dedicated Institution Accounts that allow administrators to manage multiple teachers, thousands of students, and track department-wide analytics."
      }
    ]
  }
];

function AccordionItem({ q, a, isOpen, onClick }: { q: string, a: string, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="border-b border-[rgba(30,27,46,0.08)] last:border-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 text-left focus:outline-none group"
      >
        <span className={`font-heading text-[18px] transition-colors duration-200 ${isOpen ? "text-[#C9A96E]" : "text-[#1E1B2E] group-hover:text-[#C9A96E]"}`}>
          {q}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-[#8E8E93] transition-transform duration-300 ${isOpen ? "rotate-180 text-[#C9A96E]" : "group-hover:text-[#C9A96E]"}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 font-sans text-[15px] text-[rgba(30,27,46,0.7)] leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("General-0");

  return (
    <div className="min-h-screen bg-[#F5F1EB] font-sans">
      
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-[800px] mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(201,169,110,0.1)] text-[#C9A96E] text-[13px] font-semibold tracking-wide uppercase mb-6"
            >
              <MessageCircle size={16} />
              Help Center
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-heading text-[48px] md:text-[56px] text-[#1E1B2E] font-bold leading-tight mb-6"
            >
              Frequently Asked <span className="text-[#C9A96E] italic">Questions</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[18px] text-[rgba(30,27,46,0.6)] max-w-[600px] mx-auto"
            >
              Everything you need to know about the product and billing. Can't find the answer you're looking for? Feel free to contact our support team.
            </motion.p>
          </div>

          {/* Accordion Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-12"
          >
            {FAQS.map((category, catIndex) => (
              <div key={category.category} className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[rgba(30,27,46,0.04)]">
                <h3 className="font-heading text-[24px] text-[#1E1B2E] font-bold mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-[#C9A96E] rounded-full"></div>
                  {category.category}
                </h3>
                <div className="flex flex-col">
                  {category.questions.map((faq, qIndex) => {
                    const id = `${category.category}-${qIndex}`;
                    return (
                      <AccordionItem 
                        key={id}
                        q={faq.q}
                        a={faq.a}
                        isOpen={openIndex === id}
                        onClick={() => setOpenIndex(openIndex === id ? null : id)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Still have questions? */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <p className="text-[16px] text-[#1E1B2E] font-medium mb-4">Still have questions?</p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#1E1B2E] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#2A2640] hover:scale-105 transition-all duration-300"
            >
              Contact Support <ArrowRight size={18} />
            </Link>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
