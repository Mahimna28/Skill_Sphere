"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Code, Link2, Mail, ExternalLink } from "lucide-react";
import { TEAM_MEMBERS_DETAIL } from "@/lib/team";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function TeamMemberClient({ slug }: { slug: string }) {
  const member = TEAM_MEMBERS_DETAIL.find((m) => m.slug === slug);

  if (!member) {
    return (
      <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-[#1E1B2E] mb-4">Team member not found</h1>
          <Link href="/about" className="text-[#C9A96E] hover:underline font-sans">Back to About</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB] font-sans">
      {/* Back nav */}
      <div className="max-w-6xl mx-auto px-8 pt-8">
        <Link href="/about" className="inline-flex items-center gap-2 text-[#8E8E93] hover:text-[#1E1B2E] font-sans text-[14px] transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to About
        </Link>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 pt-12 pb-20">
        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* Photo column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full lg:w-[380px] shrink-0"
          >
            <div className="relative w-full aspect-[3/4] rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(30,27,46,0.15)] bg-[#1E1B2E]">
              <Image
                src={member.img}
                alt={member.name}
                fill
                sizes="(max-width: 1024px) 100vw, 380px"
                className="object-cover"
              />
            </div>

            {/* Social links card */}
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(30,27,46,0.06)]">
              <p className="font-sans text-[11px] uppercase text-[#8E8E93] tracking-widest mb-4">Connect</p>
              <div className="flex flex-col gap-3">
                {member.socials.email && (
                  <a href={`mailto:${member.socials.email}`} className="flex items-center gap-3 text-[#8E8E93] hover:text-[#C9A96E] transition-colors font-sans text-[14px] group">
                    <div className="w-8 h-8 rounded-lg bg-[#F5F1EB] flex items-center justify-center group-hover:bg-[#C9A96E]/10 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="truncate">{member.socials.email}</span>
                  </a>
                )}
                {member.socials.github && member.socials.github !== "#" && (
                  <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#8E8E93] hover:text-[#C9A96E] transition-colors font-sans text-[14px] group">
                    <div className="w-8 h-8 rounded-lg bg-[#F5F1EB] flex items-center justify-center group-hover:bg-[#C9A96E]/10 transition-colors">
                      <GithubIcon className="w-4 h-4" />
                    </div>
                    <span>GitHub Profile</span>
                    <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                  </a>
                )}
                {member.socials.linkedin && member.socials.linkedin !== "#" && (
                  <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#8E8E93] hover:text-[#C9A96E] transition-colors font-sans text-[14px] group">
                    <div className="w-8 h-8 rounded-lg bg-[#F5F1EB] flex items-center justify-center group-hover:bg-[#C9A96E]/10 transition-colors">
                      <LinkedinIcon className="w-4 h-4" />
                    </div>
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Content column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
            className="flex-1 pt-2"
          >
            <span className="font-sans text-[12px] uppercase text-[#C9A96E] tracking-[0.12em] font-semibold">{member.role}</span>
            <h1 className="font-heading text-[48px] md:text-[56px] text-[#1E1B2E] leading-[1.05] mt-3 mb-6">{member.name}</h1>
            <div className="w-16 h-[3px] bg-[#C9A96E] rounded-full mb-8" />

            <div className="space-y-5 font-sans text-[16px] text-[#8E8E93] leading-[1.85]">
              {member.fullBio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Skills / Expertise */}
            {member.skills && member.skills.length > 0 && (
              <div className="mt-10">
                <p className="font-sans text-[11px] uppercase text-[#8E8E93] tracking-widest mb-4">Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-white border border-[rgba(30,27,46,0.08)] rounded-xl text-[13px] font-sans text-[#1E1B2E] shadow-sm hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Fun fact */}
            {member.funFact && (
              <div className="mt-10 bg-white rounded-2xl p-7 shadow-[0_4px_20px_rgba(30,27,46,0.04)] border-l-[3px] border-[#C9A96E]">
                <p className="font-sans text-[11px] uppercase text-[#C9A96E] tracking-widest mb-2">Fun Fact</p>
                <p className="font-heading text-[18px] text-[#1E1B2E] leading-[1.5]">{member.funFact}</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Other team members */}
      <section className="bg-white/50 py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <p className="font-sans text-[11px] uppercase text-[#8E8E93] tracking-widest mb-8 text-center">Also on the team</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEAM_MEMBERS_DETAIL.filter((m) => m.slug !== slug).map((other, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={`/about/team/${other.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(30,27,46,0.05)] hover:shadow-[0_12px_40px_rgba(30,27,46,0.12)] transition-all duration-300 hover:-translate-y-1">
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#1E1B2E]">
                    <Image src={other.img} alt={other.name} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div className="p-5">
                    <p className="font-heading text-[18px] text-[#1E1B2E]">{other.name}</p>
                    <p className="font-sans text-[12px] text-[#C9A96E] uppercase tracking-wider mt-1">{other.role}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
