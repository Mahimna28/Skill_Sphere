"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Easing } from "framer-motion";

const appleEase: Easing = [0.4, 0, 0.2, 1];

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  thumbnail: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
}

// We will fetch articles from /api/blog instead of using MOCK_ARTICLES

export default function BlogPageClient() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [articles, setArticles] = useState<any[]>([]);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 800], [0, 100]);

  useEffect(() => {
    fetch("/api/blog")
      .then(res => res.json())
      .then(data => {
        if (data.posts) setArticles(data.posts);
      })
      .catch(console.error);
  }, []);

  const categories = [
    "All",
    "AI & Machine Learning tutorials",
    "Web Development guides",
    "Career and internship tips",
    "Interview preparation articles",
    "Programming roadmaps",
    "College admission and scholarship guides",
    "Industry news and technology updates"
  ];
  
  const categoryImages: Record<string, string> = {
    "AI & Machine Learning tutorials": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
    "Web Development guides": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000",
    "Career and internship tips": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1000",
    "Interview preparation articles": "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1000",
    "Programming roadmaps": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1000",
    "College admission and scholarship guides": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000",
    "Industry news and technology updates": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000",
    "Default": "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?auto=format&fit=crop&q=80&w=1000"
  };

  const getCoverImage = (article: any) => {
    if (article.coverImage && article.coverImage !== "" && !article.coverImage.includes("placeholder")) {
      return article.coverImage;
    }
    return categoryImages[article.category] || categoryImages["Default"];
  };
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const gridArticles = articles.length > 1 ? articles.slice(1) : [];

  const filteredArticles = selectedCategory === "All" 
    ? gridArticles 
    : gridArticles.filter(a => a.category === selectedCategory);

  return (
    <div className="flex flex-col bg-[#F5F1EB] min-h-screen">
      
      {/* 1. PAGE HEADER ΓÇö EDITORIAL MASTHEAD */}
      <section className="pt-[140px] pb-[60px] bg-[#F5F1EB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="mb-6"
          >
            <span className="font-sans text-[12px] uppercase tracking-[0.2em] text-[#C9A96E]">
              Insights
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: appleEase }}
            className="font-heading font-bold text-[32px] md:text-[56px] text-[#1E1B2E] leading-[0.95] max-w-[700px] mb-4"
          >
            Thoughts on learning, teaching, and growth.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: appleEase }}
            className="font-sans text-[18px] text-[#8E8E93] leading-[1.5] max-w-[560px]"
          >
            Deep dives into pedagogical science, platform updates, and stories from our community.
          </motion.p>
        </div>
      </section>

      {/* 2. FEATURED ARTICLE ΓÇö HERO POST */}
      {featuredArticle && (
      <section className="pb-[40px] bg-[#F5F1EB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 group cursor-pointer">
            
            {/* Left Image */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: appleEase }}
              className="w-full lg:w-[55%] relative rounded-[16px] overflow-hidden shadow-[0_8px_32px_rgba(30,27,46,0.08)] aspect-[16/9] lg:aspect-auto lg:h-[500px]"
            >
                <motion.div style={{ y: yParallax }} className="absolute inset-0 -top-[100px] -bottom-[100px]">
                  <img 
                    src={getCoverImage(featuredArticle)} 
                    alt={featuredArticle.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
              </motion.div>
            </motion.div>

            {/* Right Content */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
              className="w-full lg:w-[45%] flex flex-col justify-center lg:pl-12 py-6"
            >
              <span className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#C9A96E] mb-4 block">
                Featured Essay
              </span>
              <h2 className="font-heading text-[28px] md:text-[32px] text-[#1E1B2E] leading-[1.1] mb-4 group-hover:text-[#C9A96E] transition-colors duration-300">
                {featuredArticle.title}
              </h2>
              <p className="font-sans text-[16px] text-[#8E8E93] leading-[1.6] mb-8 line-clamp-3">
                {featuredArticle.excerpt}
              </p>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-[#1E1B2E] text-[#C9A96E] font-bold text-sm">
                  {featuredArticle.author?.image ? (
                    <img src={featuredArticle.author.image} alt={featuredArticle.author.name} className="w-full h-full object-cover" />
                  ) : (
                    featuredArticle.author?.name?.charAt(0) || "A"
                  )}
                </div>
                <div className="flex items-center flex-wrap gap-2 font-sans text-[14px]">
                  <span className="text-[#1E1B2E] font-medium">{featuredArticle.author?.name || "Author"}</span>
                  <span className="text-[#8E8E93]">&middot;</span>
                  <span className="text-[#8E8E93]">{new Date(featuredArticle.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span className="text-[#8E8E93]">&middot;</span>
                  <span className="text-[#8E8E93]">{featuredArticle.readTime} min read</span>
                </div>
              </div>

              <Link href={`/blog/${featuredArticle.slug}`} className="inline-flex items-center font-sans text-[14px] text-[#C9A96E] font-medium transition-colors group-hover:text-[#1E1B2E]">
                Read Article <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>
      )}

      {/* EXPLORE TOPICS SECTION */}
      <section className="py-16 bg-white border-y border-[rgba(30,27,46,0.06)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center text-center mb-10">
            <h2 className="font-heading text-[32px] text-[#1E1B2E] font-bold">Explore Core Topics</h2>
            <p className="font-sans text-[16px] text-[#8E8E93] mt-2 max-w-2xl">Dive deep into our curated categories tailored for modern learners, developers, and tech enthusiasts.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.filter(c => c !== "All").map((cat, idx) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  setSelectedCategory(cat);
                  const articlesSection = document.getElementById('articles-grid');
                  if (articlesSection) {
                    const y = articlesSection.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="cursor-pointer group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img 
                  src={categoryImages[cat] || categoryImages["Default"]} 
                  alt={cat} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B2E]/90 via-[#1E1B2E]/40 to-transparent"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="font-heading text-white text-lg font-bold leading-tight group-hover:text-[#C9A96E] transition-colors">{cat}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CATEGORY FILTERS */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: appleEase }}
        className="sticky top-[72px] z-40 bg-[#F5F1EB]/90 backdrop-blur-md border-b border-[rgba(30,27,46,0.08)] py-4"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex overflow-x-auto scrollbar-none gap-3 items-center pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "whitespace-nowrap px-5 py-2 rounded-full font-sans text-[14px] transition-all duration-300",
                  selectedCategory === cat 
                  ? "bg-[#1E1B2E] text-white shadow-md" 
                  : "bg-white text-[#1E1B2E] border border-[rgba(30,27,46,0.08)] hover:shadow-[0_2px_8px_rgba(30,27,46,0.05)] hover:-translate-y-0.5"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 4. ARTICLE GRID */}
      <section id="articles-grid" className="py-[60px] flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, idx) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: idx * 0.1, ease: appleEase }}
                >
                  <Link href={`/blog/${article.slug}`} className="block h-full group">
                    <motion.div 
                      whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(30,27,46,0.12)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="bg-white rounded-[16px] overflow-hidden h-full flex flex-col shadow-[0_4px_20px_rgba(30,27,46,0.04)]"
                    >
                      {/* Image Top */}
                      <div className="w-full aspect-[16/9] relative overflow-hidden bg-[#1E1B2E]">
                        <img 
                          src={getCoverImage(article)} 
                          alt={article.title} 
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute top-4 right-4 bg-[#C9A96E] text-[#1E1B2E] px-3 py-1 rounded-full font-sans font-bold text-[11px] uppercase tracking-[0.1em] shadow-md">
                          {article.category}
                        </div>
                      </div>

                      {/* Content Bottom */}
                      <div className="p-7 flex flex-col flex-1">
                        <h3 className="font-heading text-[20px] text-[#1E1B2E] mb-3 leading-[1.2] group-hover:text-[#C9A96E] transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        
                        <p className="font-sans text-[14px] text-[#8E8E93] leading-[1.6] mb-6 line-clamp-2 flex-1">
                          {article.excerpt}
                        </p>

                        <div className="flex items-center gap-3 mt-auto pt-5 border-t border-[rgba(30,27,46,0.06)]">
                          <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-[#1E1B2E] text-[#C9A96E] font-bold text-[10px]">
                            {article.author?.image ? (
                              <img src={article.author.image} alt={article.author.name} className="w-full h-full object-cover" />
                            ) : (
                              article.author?.name?.charAt(0) || "A"
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-sans text-[13px] text-[#1E1B2E] font-medium leading-none">{article.author?.name || "Author"}</span>
                            <div className="flex items-center gap-1 font-sans text-[12px] text-[#8E8E93] leading-none">
                              <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              <span>&middot;</span>
                              <span>{article.readTime} min read</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center text-center">
              <h3 className="font-heading text-[24px] text-[#1E1B2E] mb-3">No articles found</h3>
              <p className="font-sans text-[16px] text-[#8E8E93] mb-8">
                We haven't published anything in this category yet.
              </p>
              <button 
                onClick={() => setSelectedCategory("All")}
                className="text-[#C9A96E] font-sans text-[15px] font-medium hover:text-[#1E1B2E] transition-colors duration-300 border-b border-transparent hover:border-[#1E1B2E]"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. NEWSLETTER CTA */}
      <section className="py-[120px] bg-[#1E1B2E] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            <h2 className="font-heading font-black text-[36px] text-white mb-4">
              Stay curious.
            </h2>
            <p className="font-sans text-[16px] text-[#F5F1EB] mb-10 font-light opacity-90">
              Join 40,000+ educators and learners receiving our weekly insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full h-[56px] bg-transparent border-0 border-b border-white/20 px-4 font-sans text-[16px] text-white placeholder-white/50 focus:border-[#C9A96E] focus:ring-0 focus:outline-none transition-colors"
              />
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-full sm:w-auto shrink-0 bg-[#C9A96E] text-[#1E1B2E] font-sans font-medium text-[16px] rounded-full px-8 h-[56px]"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
