"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { useReducedMotion, useIsMobile } from "@/lib/animations";
import { FadeIn } from "@/components/animations/FadeIn";
import { SlideUp } from "@/components/animations/SlideUp";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";

const FEATURED_POST = {
  slug: "future-of-ai-education",
  title: "The Future of AI in Modern Education",
  excerpt: "Artificial Intelligence is no longer just a buzzword. Discover how AI-powered tutors and adaptive learning systems are fundamentally changing how students learn.",
  category: "AI & ML",
  author: "Swayam Chaudhari",
  date: "Oct 24, 2026",
  image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1200"
};

const LATEST_POSTS = [
  {
    slug: "mastering-react-hooks",
    title: "Mastering React Hooks in 2026",
    excerpt: "A deep dive into advanced hook patterns and performance optimization strategies for React Server Components.",
    category: "Web Dev",
    author: "Mahimna Mistry",
    date: "Oct 20, 2026",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800"
  },
  {
    slug: "design-system-basics",
    title: "Building Scalable Design Systems",
    excerpt: "Learn the core principles of creating design systems that bridge the gap between design and engineering.",
    category: "Design",
    author: "Jal Patel",
    date: "Oct 18, 2026",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800"
  },
  {
    slug: "career-transition-tech",
    title: "How to Transition into Tech Without a CS Degree",
    excerpt: "Actionable advice on building a portfolio, networking, and landing your first tech role.",
    category: "Career",
    author: "Priya S.",
    date: "Oct 15, 2026",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
  }
];

const MAIN_TRENDING = {
  slug: "python-vs-rust",
  title: "Python vs Rust: Choosing the Right Backend Language",
  excerpt: "An in-depth performance and developer experience comparison for modern web services.",
  image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200"
};

const TRENDING_POSTS = [
  {
    slug: "top-10-vs-code-extensions",
    title: "Top 10 VS Code Extensions for Productivity",
    category: "Programming",
    date: "Oct 12, 2026",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400"
  },
  {
    slug: "understanding-typescript-generics",
    title: "Understanding TypeScript Generics Once and For All",
    category: "Web Dev",
    date: "Oct 10, 2026",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=400"
  },
  {
    slug: "remote-work-habits",
    title: "5 Habits of Highly Effective Remote Developers",
    category: "Career",
    date: "Oct 05, 2026",
    image: "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?auto=format&fit=crop&q=80&w=400"
  }
];

export default function BlogPageClient() {
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Programming", "AI & ML", "Web Dev", "Career", "Tips"];

  const getStaggerDelay = (desktopDelay: number) => isMobile ? desktopDelay * 0.5 : desktopDelay;

  return (
    <div className="flex flex-col bg-[#F5F1EB] min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="pt-[100px] pb-[60px] px-[32px] max-w-[800px] mx-auto text-center w-full">
        <FadeIn delay={0.1}>
          <span className="font-sans text-[12px] uppercase text-[#C9A96E] tracking-[0.08em] font-semibold block mb-4">OUR BLOG</span>
        </FadeIn>
        
        <FadeIn delay={0.2} direction="up">
          <h1 className="font-heading text-[42px] text-[#1E1B2E] leading-[1.15]">Insights & Updates</h1>
        </FadeIn>
        
        <FadeIn delay={0.3}>
          <p className="font-sans text-[16px] text-[#8E8E93] mt-[12px] mb-10 max-w-[600px] mx-auto">
            Stay informed with the latest in education, technology, and learning strategies.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex flex-row items-center bg-white rounded-full h-[56px] max-w-[600px] mx-auto shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden focus-within:shadow-inner transition-shadow">
            <Search className="text-[#8E8E93] ml-[20px] shrink-0" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none h-full px-[16px] font-sans text-[16px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none bg-transparent"
            />
            <button className="w-[44px] h-[44px] rounded-full bg-[#1E1B2E] text-white flex items-center justify-center mr-[6px] hover:bg-[#C9A96E] transition-colors shrink-0">
              <Search size={18} />
            </button>
          </div>
        </FadeIn>
      </section>

      {/* 2. FEATURED ARTICLE */}
      <section className="px-[32px] pb-[60px] max-w-[1200px] mx-auto w-full">
        <SlideUp y={30}>
          <Link href={`/blog/${FEATURED_POST.slug}`} className="block group">
            <div className="bg-white rounded-[16px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] flex flex-col md:flex-row hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
              {/* Image side */}
              <div className="w-full md:w-[55%] aspect-[16/10] relative overflow-hidden bg-[#1E1B2E]">
                <motion.div
                  className="w-full h-full relative"
                  whileHover={!isMobile && !shouldReduceMotion ? { scale: 1.03 } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <Image src={FEATURED_POST.image} alt={FEATURED_POST.title} fill className="object-cover" />
                </motion.div>
              </div>

              {/* Content side */}
              <div className="w-full md:w-[45%] p-[40px] flex flex-col justify-center">
                <div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-sans font-medium bg-[rgba(201,169,110,0.12)] text-[#C9A96E]">
                    {FEATURED_POST.category}
                  </span>
                </div>
                <h2 className="font-heading text-[28px] text-[#1E1B2E] leading-[1.2] mt-[12px] group-hover:text-[#C9A96E] transition-colors">
                  {FEATURED_POST.title}
                </h2>
                <p className="font-sans text-[15px] text-[#8E8E93] leading-[1.7] mt-[12px] line-clamp-3">
                  {FEATURED_POST.excerpt}
                </p>

                <div className="mt-[20px] flex items-center gap-[12px]">
                  <div className="w-[32px] h-[32px] rounded-full bg-[#1E1B2E] text-white flex items-center justify-center font-sans text-[14px] font-medium shrink-0">
                    {FEATURED_POST.author[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-[14px] text-[#1E1B2E] leading-tight">{FEATURED_POST.author}</span>
                    <span className="font-sans text-[13px] text-[#8E8E93]">{FEATURED_POST.date}</span>
                  </div>
                </div>

                <div className="mt-[16px]">
                  <span className="font-sans text-[14px] text-[#C9A96E] font-medium group-hover:underline">
                    Read More &rarr;
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </SlideUp>
      </section>

      {/* 3. STICKY CATEGORY FILTERS */}
      <div className="sticky top-[72px] z-10 bg-[#F5F1EB] border-b border-[rgba(30,27,46,0.06)] py-[16px] px-[32px]">
        <div className="max-w-[1200px] mx-auto overflow-x-auto scrollbar-hide">
          <StaggerContainer staggerDelay={getStaggerDelay(0.05)} className="flex flex-row gap-[12px] min-w-max pb-1">
            {categories.map((cat) => (
              <StaggerItem key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-[16px] py-[8px] rounded-full font-sans text-[13px] transition-all duration-200 border whitespace-nowrap",
                    activeCategory === cat
                      ? "bg-[#1E1B2E] text-white border-[#1E1B2E]"
                      : "bg-transparent text-[#8E8E93] border-[rgba(30,27,46,0.1)] hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.06)] hover:text-[#1E1B2E]"
                  )}
                >
                  {cat}
                </button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* 4. LATEST ARTICLES GRID */}
      <section className="px-[32px] py-[40px] max-w-[1200px] mx-auto w-full">
        <FadeIn>
          <h2 className="font-heading text-[24px] text-[#1E1B2E] mb-[24px]">Latest Articles</h2>
        </FadeIn>
        
        <StaggerContainer key={activeCategory} staggerDelay={getStaggerDelay(0.15)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
          {LATEST_POSTS.map((post) => (
            <StaggerItem key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="block h-full group">
                <div className="bg-white rounded-[16px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.05)] h-full flex flex-col hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:-translate-y-[6px] transition-all duration-300">
                  
                  {/* Image */}
                  <div className="w-full aspect-[16/10] relative overflow-hidden bg-[#1E1B2E]">
                    <motion.div
                      className="w-full h-full relative"
                      whileHover={!isMobile && !shouldReduceMotion ? { scale: 1.05 } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <Image src={post.image} alt={post.title} fill className="object-cover" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-[20px] flex flex-col flex-1">
                    <div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-sans font-medium bg-[rgba(201,169,110,0.12)] text-[#C9A96E]">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="font-heading text-[18px] text-[#1E1B2E] line-clamp-2 mt-[10px] group-hover:text-[#C9A96E] transition-colors">
                      {post.title}
                    </h3>
                    <p className="font-sans text-[14px] text-[#8E8E93] line-clamp-2 mt-[6px]">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto pt-[12px] flex items-center justify-between">
                      <span className="font-sans text-[12px] text-[#8E8E93]">{post.author}</span>
                      <span className="font-sans text-[12px] text-[#8E8E93]">{post.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 5. TRENDING SECTION */}
      <section className="px-[32px] pb-[60px] max-w-[1200px] mx-auto w-full">
        <FadeIn>
          <h2 className="font-heading text-[24px] text-[#1E1B2E] mb-[24px]">Trending Now</h2>
        </FadeIn>

        <div className="flex flex-col lg:flex-row gap-[24px]">
          {/* Left: Main Trending */}
          <div className="w-full lg:w-[60%]">
            <SlideUp y={20} className="h-full">
              <Link href={`/blog/${MAIN_TRENDING.slug}`} className="block h-full group">
                <div className="bg-white rounded-[16px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.05)] h-full flex flex-col hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition-all duration-300">
                  <div className="w-full aspect-[16/9] relative overflow-hidden bg-[#1E1B2E]">
                    <motion.div
                      className="w-full h-full relative"
                      whileHover={!isMobile && !shouldReduceMotion ? { scale: 1.05 } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <Image src={MAIN_TRENDING.image} alt={MAIN_TRENDING.title} fill className="object-cover" />
                    </motion.div>
                  </div>
                  <div className="p-[24px]">
                    <h3 className="font-heading text-[22px] text-[#1E1B2E] group-hover:text-[#C9A96E] transition-colors">
                      {MAIN_TRENDING.title}
                    </h3>
                    <p className="font-sans text-[15px] text-[#8E8E93] mt-[8px]">
                      {MAIN_TRENDING.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            </SlideUp>
          </div>

          {/* Right: Trending List */}
          <div className="w-full lg:w-[40%] flex flex-col justify-center">
            <StaggerContainer staggerDelay={getStaggerDelay(0.1)} className="flex flex-col gap-[16px]">
              {TRENDING_POSTS.map((post) => (
                <StaggerItem key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="block group">
                    <div className="bg-white rounded-xl p-[12px] flex flex-row gap-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                      <div className="w-[80px] h-[80px] shrink-0 relative rounded-lg overflow-hidden bg-[#1E1B2E]">
                        <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="font-sans text-[11px] text-[#C9A96E] uppercase font-medium">{post.category}</span>
                        <h4 className="font-sans text-[14px] text-[#1E1B2E] font-medium line-clamp-2 mt-[4px] leading-snug group-hover:text-[#C9A96E] transition-colors">
                          {post.title}
                        </h4>
                        <span className="font-sans text-[12px] text-[#8E8E93] mt-[4px]">{post.date}</span>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER SECTION */}
      <section className="px-[32px] pb-[80px] max-w-[800px] mx-auto w-full">
        <SlideUp y={30}>
          <div className="bg-[#1E1B2E] rounded-2xl p-[48px] text-center shadow-xl">
            <h2 className="font-heading text-[28px] text-white">Stay in the loop</h2>
            <p className="font-sans text-[15px] text-[rgba(255,255,255,0.7)] mt-[12px]">
              Get weekly updates on new courses, tips, and exclusive offers.
            </p>
            
            <form className="mt-[24px] flex flex-col sm:flex-row items-center justify-center gap-[12px]" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="w-full sm:w-auto flex-1 h-[52px] rounded-full px-[20px] bg-white border-none focus:outline-none font-sans text-[15px] text-[#1E1B2E]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto h-[48px] px-[28px] bg-[#C9A96E] text-[#1E1B2E] font-sans font-medium rounded-full hover:scale-[1.02] transition-transform"
              >
                Subscribe
              </button>
            </form>
          </div>
        </SlideUp>
      </section>

    </div>
  );
}
