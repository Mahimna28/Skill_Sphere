"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, TrendingUp, Search, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Easing } from "framer-motion";
import { SlideUp } from "@/components/animations/SlideUp";

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

import { SharedHeroSection } from "@/components/landing/SharedHeroSection";

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
  
  const categoryImages: Record<string, string[]> = {
    "AI & Machine Learning tutorials": [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000"
    ],
    "Web Development guides": [
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=1000"
    ],
    "Career and internship tips": [
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1000"
    ],
    "Interview preparation articles": [
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1000"
    ],
    "Programming roadmaps": [
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=1000"
    ],
    "College admission and scholarship guides": [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1546410531-ef4cb3cb9951?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=1000"
    ],
    "Industry news and technology updates": [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000"
    ],
    "Default": [
      "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000"
    ]
  };

  const getCoverImage = (article: any) => {
    if (article.coverImage && article.coverImage.startsWith('http') && !article.coverImage.includes("placeholder")) {
      return article.coverImage;
    }
    
    const str = article.title || article.slug || "default";
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash);
    
    const cat = (article.category || "").toLowerCase();
    
    const pickImage = (key: string) => {
      const arr = categoryImages[key] || categoryImages["Default"];
      return arr[idx % arr.length];
    };

    if (cat.includes("ai") || cat.includes("learning")) return pickImage("AI & Machine Learning tutorials");
    if (cat.includes("web") || cat.includes("dev")) return pickImage("Web Development guides");
    if (cat.includes("career")) return pickImage("Career and internship tips");
    if (cat.includes("interview")) return pickImage("Interview preparation articles");
    if (cat.includes("program")) return pickImage("Programming roadmaps");
    if (cat.includes("college") || cat.includes("admission")) return pickImage("College admission and scholarship guides");
    if (cat.includes("industry") || cat.includes("news")) return pickImage("Industry news and technology updates");
    
    return pickImage(article.category) || pickImage("Default");
  };
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const gridArticles = articles.length > 1 ? articles.slice(1) : [];

  const filteredArticles = selectedCategory === "All" 
    ? gridArticles 
    : gridArticles.filter(a => a.category === selectedCategory);

  return (
    <div className="flex flex-col bg-[#F5F1EB] min-h-screen">
      
      <SharedHeroSection
        title="Insights & Updates"
        subtitle="Latest Insights"
        description="Read our latest articles on education, technology, and platform updates."
        backgroundImage="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=2000"
      />

      {/* 1.5 LATEST UPDATES TICKER */}
      {articles.length > 0 && (
        <div className="bg-[#1E1B2E] border-y border-[#C9A96E]/20 overflow-hidden py-3">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center">
            <div className="shrink-0 bg-[#C9A96E] text-[#1E1B2E] text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-sm mr-4 z-10 shadow-sm">
              Latest
            </div>
            <div className="flex-1 overflow-hidden relative" style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}>
              <motion.div 
                className="flex gap-10 whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              >
                {/* Duplicate the array twice to ensure seamless looping without visual jumps */}
                {[...articles, ...articles, ...articles, ...articles].map((article, i) => (
                  <Link key={`${article.id}-${i}`} href={`/blog/${article.slug}`} className="text-white/70 hover:text-[#C9A96E] text-sm font-sans transition-colors flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-[#C9A96E]/50"></span>
                    {article.title}
                  </Link>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FEATURED ARTICLE — HERO POST */}
      {featuredArticle && (
      <section id="featured" className="pb-[40px] bg-[#F5F1EB] pt-[40px]">
        <SlideUp delay={0.2} y={50}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 group cursor-pointer">
            
            {/* Left Image */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: appleEase }}
              className="w-full lg:w-[55%] relative rounded-[16px] overflow-hidden shadow-[0_8px_32px_rgba(30,27,46,0.08)] aspect-[16/9] lg:aspect-auto lg:h-[500px]"
            >
              <img 
                src={getCoverImage(featuredArticle)} 
                alt={featuredArticle.title} 
                className="w-full h-full absolute inset-0 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
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
        </SlideUp>
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
                  src={categoryImages[cat] ? categoryImages[cat][0] : categoryImages["Default"][0]} 
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

      {/* 3. MAIN CONTENT & SIDEBAR SPLIT */}
      <section id="articles-grid" className="py-[60px] flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* LEFT COLUMN: Main Article Feed (70%) */}
            <div className="w-full lg:w-[70%]">
              <div className="flex items-center justify-between mb-8 border-b border-[rgba(30,27,46,0.06)] pb-4">
                <h3 className="font-heading text-[24px] text-[#1E1B2E] font-bold">
                  {selectedCategory === "All" ? "Recent Articles" : selectedCategory}
                </h3>
              </div>

              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {filteredArticles.map((article, idx) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.7, delay: (idx % 2) * 0.1, ease: appleEase }}
                    >
                      <Link href={`/blog/${article.slug}`} className="block h-full group">
                        <motion.div 
                          whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(30,27,46,0.12)" }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="bg-white rounded-[16px] overflow-hidden h-full flex flex-col shadow-[0_4px_20px_rgba(30,27,46,0.04)] border border-[rgba(30,27,46,0.04)]"
                        >
                          {/* Image Top */}
                          <div className="w-full aspect-[16/9] relative overflow-hidden bg-[#1E1B2E]">
                            <img 
                              src={getCoverImage(article)} 
                              alt={article.title} 
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute top-4 right-4 bg-[#C9A96E] text-[#1E1B2E] px-3 py-1 rounded-full font-sans font-bold text-[10px] uppercase tracking-[0.1em] shadow-md">
                              {article.category}
                            </div>
                          </div>

                          {/* Content Bottom */}
                          <div className="p-6 flex flex-col flex-1">
                            <h3 className="font-heading text-[18px] text-[#1E1B2E] mb-3 leading-[1.3] group-hover:text-[#C9A96E] transition-colors line-clamp-2">
                              {article.title}
                            </h3>
                            
                            <p className="font-sans text-[14px] text-[#8E8E93] leading-[1.6] mb-6 line-clamp-2 flex-1">
                              {article.excerpt}
                            </p>

                            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[rgba(30,27,46,0.04)]">
                              <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-[#1E1B2E] text-[#C9A96E] font-bold text-[10px]">
                                {article.author?.image ? (
                                  <img src={article.author.image} alt={article.author.name} className="w-full h-full object-cover" />
                                ) : (
                                  article.author?.name?.charAt(0) || "A"
                                )}
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="font-sans text-[12px] text-[#1E1B2E] font-medium leading-none">{article.author?.name || "Author"}</span>
                                <div className="flex items-center gap-1 font-sans text-[11px] text-[#8E8E93] leading-none">
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
                <div className="py-20 flex flex-col items-center text-center bg-white rounded-[16px] border border-[rgba(30,27,46,0.06)]">
                  <Search className="w-12 h-12 text-[#8E8E93]/30 mb-4" />
                  <h3 className="font-heading text-[20px] text-[#1E1B2E] mb-2">No articles found</h3>
                  <p className="font-sans text-[14px] text-[#8E8E93] mb-6">
                    We haven't published anything in this category yet.
                  </p>
                  <button 
                    onClick={() => setSelectedCategory("All")}
                    className="text-white bg-[#1E1B2E] hover:bg-[#C9A96E] hover:text-[#1E1B2E] px-6 py-2.5 rounded-full font-sans text-[14px] font-medium transition-colors shadow-sm"
                  >
                    View All Articles
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Sidebar (30%) */}
            <div className="w-full lg:w-[30%] flex flex-col gap-10">
              
              {/* Widget: Categories */}
              <div className="bg-white rounded-[16px] p-6 border border-[rgba(30,27,46,0.06)] shadow-[0_4px_20px_rgba(30,27,46,0.02)]">
                <h4 className="font-heading text-[18px] text-[#1E1B2E] font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#C9A96E] rounded-full"></span>
                  Topics
                </h4>
                <ul className="flex flex-col gap-2">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "w-full text-left flex items-center justify-between py-2 px-3 rounded-lg font-sans text-[14px] transition-colors group",
                          selectedCategory === cat 
                          ? "bg-[#1E1B2E] text-white" 
                          : "text-[#8E8E93] hover:bg-[#F5F1EB] hover:text-[#1E1B2E]"
                        )}
                      >
                        <span className="truncate pr-4">{cat}</span>
                        <ChevronRight className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0", selectedCategory === cat && "opacity-100 text-[#C9A96E]")} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Widget: Trending / Popular */}
              {articles.length > 2 && (
                <div className="bg-white rounded-[16px] p-6 border border-[rgba(30,27,46,0.06)] shadow-[0_4px_20px_rgba(30,27,46,0.02)]">
                  <h4 className="font-heading text-[18px] text-[#1E1B2E] font-bold mb-5 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#C9A96E]" />
                    Trending Now
                  </h4>
                  <div className="flex flex-col gap-5">
                    {articles.slice(0, 4).map((article, i) => (
                      <Link key={`trending-${article.id}`} href={`/blog/${article.slug}`} className="group flex gap-4 items-start">
                        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-[#1E1B2E] relative">
                          <img 
                            src={getCoverImage(article)} 
                            alt={article.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-0 left-0 bg-[#1E1B2E]/80 text-[#C9A96E] w-6 h-6 flex items-center justify-center font-bold text-xs rounded-br-lg backdrop-blur-sm">
                            {i + 1}
                          </div>
                        </div>
                        <div className="flex flex-col flex-1 py-0.5">
                          <h5 className="font-heading text-[14px] text-[#1E1B2E] leading-[1.3] group-hover:text-[#C9A96E] transition-colors line-clamp-3 mb-2">
                            {article.title}
                          </h5>
                          <span className="font-sans text-[11px] text-[#8E8E93] uppercase tracking-wider">
                            {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
