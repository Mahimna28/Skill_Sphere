"use client";

import Link from "next/link";
import { Code, MessageCircle, Briefcase, Camera, Mail, ArrowUp } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
      // Real app: submit to API
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#1E1B2E] pt-[80px] pb-[40px]">
      <div className="max-w-[1200px] mx-auto px-[32px]">

        {/* ROW 1: NEWSLETTER + BRAND */}
        <div className="flex flex-col md:flex-row justify-between pb-[48px] border-b border-[rgba(255,255,255,0.08)] gap-10 md:gap-0">
          {/* Brand */}
          <div className="w-full md:w-[40%] flex flex-col justify-center">
            <span className="font-heading font-black text-[24px] text-white tracking-tight">
              Skill Sphere.
            </span>
            <p className="font-sans text-[14px] text-[rgba(255,255,255,0.5)] mt-[8px] max-w-[280px] leading-[1.5]">
              Education, crafted for how you think.
            </p>
          </div>

          {/* Newsletter */}
          <div className="w-full md:w-[60%]">
            <h3 className="font-heading text-[20px] text-white">Stay in the loop.</h3>
            <p className="font-sans text-[14px] text-[rgba(255,255,255,0.6)] mt-[6px]">
              Get updates on new courses, features, and learning tips — no spam, ever.
            </p>
            <form onSubmit={handleSubscribe} className="mt-[16px] flex flex-row gap-[12px]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 h-[48px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] rounded-xl px-[16px] text-white placeholder-[rgba(255,255,255,0.6)] font-sans text-[14px] focus:outline-none focus:border-[#C9A96E] focus:shadow-[0_0_0_3px_rgba(201,169,110,0.15)] transition-all"
                required
              />
              <button
                type="submit"
                className="h-[48px] px-[24px] bg-[#C9A96E] text-[#1E1B2E] font-sans font-semibold text-[14px] rounded-xl hover:bg-[#B8956A] hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="text-[#C9A96E] font-sans text-[13px] mt-2">Thanks for subscribing!</p>
            )}
          </div>
        </div>

        {/* ROW 2: LINK COLUMNS */}
        <div className="py-[48px] border-b border-[rgba(255,255,255,0.08)] grid grid-cols-2 md:grid-cols-4 gap-[24px]">
          {[
            {
              title: "Platform",
              links: [
                { name: "All Courses", url: "/courses" },
                { name: "Features", url: "/features" },
                { name: "Institutions", url: "/#institutions" }
              ]
            },
            {
              title: "Company",
              links: [
                { name: "About Us", url: "/about" },
                { name: "Our Team", url: "/about#team" },
                { name: "Careers", url: "#" },
                { name: "Blog", url: "/blog" }
              ]
            },
            {
              title: "Support",
              links: [
                { name: "Help Center / FAQs", url: "/faq" },
                { name: "Contact Us", url: "/contact" },
                { name: "Feedback", url: "/feedback" },
                { name: "System Status", url: "/status" }
              ]
            },
            {
              title: "Legal",
              links: [
                { name: "Privacy Policy", url: "/privacy" },
                { name: "Terms of Service", url: "/terms" },
                { name: "Cookie Policy", url: "/cookies" },
                { name: "Accessibility", url: "#" }
              ]
            }
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-sans font-semibold text-[14px] text-white mb-[16px]">{col.title}</h4>
              <ul className="flex flex-col">
                {col.links.map(link => (
                  <li key={link.name}>
                    <Link href={link.url} className="inline-block font-sans text-[14px] text-[rgba(255,255,255,0.6)] hover:text-[#C9A96E] hover:translate-x-1 transition-all duration-200 leading-[2.2]">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ROW 3: SOCIAL + GITHUB */}
        <div className="py-[32px] border-b border-[rgba(255,255,255,0.08)] flex flex-col md:flex-row justify-between items-center gap-[24px]">
          <div className="flex items-center">
            <span className="font-sans text-[12px] uppercase text-[rgba(255,255,255,0.6)] tracking-[0.08em] mr-[16px]">
              Follow us
            </span>
            <div className="flex gap-[16px]">
              {[
                { icon: Code, url: "https://github.com/Mahimna28/Skill_Sphere" },
                { icon: Briefcase, url: "#" },
                { icon: MessageCircle, url: "#" },
                { icon: Camera, url: "#" },
                { icon: Mail, url: "#" }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-[40px] h-[40px] rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[rgba(255,255,255,0.6)] hover:text-[#C9A96E] hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.1)] transition-all duration-200"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <a 
              href="https://github.com/Mahimna28/Skill_Sphere" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[6px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full px-[14px] py-[6px] hover:bg-[rgba(255,255,255,0.08)] transition-colors group"
            >
              <Code size={14} className="text-[rgba(255,255,255,0.6)] group-hover:text-[#C9A96E] transition-colors" />
              <span className="font-sans text-[13px] text-[rgba(255,255,255,0.6)] group-hover:text-white transition-colors">
                Open Source on GitHub
              </span>
            </a>
          </div>
        </div>

        {/* ROW 4: BOTTOM BAR */}
        <div className="pt-[24px] flex flex-col md:flex-row justify-between items-center gap-[16px] md:gap-0">
          <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-0 md:gap-[16px]">
            <span className="font-sans text-[13px] text-[rgba(255,255,255,0.4)]">
              © 2026 Skill Sphere. All rights reserved.
            </span>
            <span className="hidden md:inline font-sans text-[13px] text-[rgba(255,255,255,0.6)] border-l border-[rgba(255,255,255,0.1)] pl-[16px]">
              Made with care for students everywhere.
            </span>
            <span className="md:hidden font-sans text-[13px] text-[rgba(255,255,255,0.6)] mt-[8px]">
              Made with care for students everywhere.
            </span>
          </div>

          <button 
            onClick={scrollToTop}
            className="font-sans text-[13px] text-[rgba(255,255,255,0.6)] hover:text-[#C9A96E] transition-colors flex items-center gap-1 cursor-pointer"
          >
            Back to top <ArrowUp size={14} />
          </button>
        </div>

      </div>
    </footer>
  );
}
