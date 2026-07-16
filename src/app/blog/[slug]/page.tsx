"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, Bookmark, TrendingUp, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";

// Enhanced Markdown parser
const MarkdownText = ({ content }: { content: string }) => {
  const blocks = content.split('\n\n');

  return (
    <div className="space-y-8 text-[#1E1B2E] text-lg leading-[1.8] font-sans">
      {blocks.map((block, i) => {
        // Headers
        if (block.startsWith('### ')) {
          return <h3 key={i} className="font-heading text-2xl md:text-3xl text-[#1E1B2E] mt-12 mb-6 font-bold">{block.replace('### ', '')}</h3>;
        }
        if (block.startsWith('## ')) {
          return <h2 key={i} className="font-heading text-3xl md:text-4xl text-[#1E1B2E] mt-16 mb-8 font-black tracking-tight">{block.replace('## ', '')}</h2>;
        }
        if (block.startsWith('# ')) {
          return <h1 key={i} className="font-heading text-4xl md:text-5xl text-[#1E1B2E] mt-16 mb-10 font-black">{block.replace('# ', '')}</h1>;
        }

        // Blockquotes
        if (block.startsWith('> ')) {
          return (
            <blockquote key={i} className="border-l-4 border-[#C9A96E] pl-6 py-2 my-10 bg-gradient-to-r from-[#C9A96E]/10 to-transparent rounded-r-2xl italic text-xl text-[#3A3847]">
              {block.replace('> ', '')}
            </blockquote>
          );
        }

        // Lists
        if (block.startsWith('- ') || block.startsWith('* ')) {
          const items = block.split('\n').map(line => line.replace(/^[-*] /, ''));
          return (
            <ul key={i} className="list-disc list-outside ml-6 space-y-3 my-8 text-[#3A3847]">
              {items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          );
        }
        
        // Numbered Lists
        if (/^\d+\. /.test(block)) {
          const items = block.split('\n').map(line => line.replace(/^\d+\. /, ''));
          return (
            <ol key={i} className="list-decimal list-outside ml-6 space-y-3 my-8 text-[#3A3847]">
              {items.map((item, j) => <li key={j}>{item}</li>)}
            </ol>
          );
        }
        
        // Normal paragraph with basic bold/italic parse
        let parsed = block;
        
        // Simple bold (**text**)
        const boldParts = parsed.split(/(\*\*[^*]+\*\*)/g);
        
        return (
          <p key={i} className="text-[#3A3847] text-lg md:text-xl font-light">
            {boldParts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="font-bold text-[#1E1B2E]">{part.slice(2, -2)}</strong>;
              }
              // Check for italics (*text*)
              const italicParts = part.split(/(\*[^*]+\*)/g);
              return italicParts.map((ip, k) => {
                if (ip.startsWith('*') && ip.endsWith('*')) {
                  return <em key={k} className="italic text-[#1E1B2E]">{ip.slice(1, -1)}</em>;
                }
                return <span key={k}>{ip}</span>;
              });
            })}
          </p>
        );
      })}
    </div>
  );
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const yParallax = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityParallax = useTransform(scrollY, [0, 500], [1, 0.3]);

  const categories = [
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
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000"
    ],
    "Web Development guides": [
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=2000"
    ],
    "Career and internship tips": [
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=2000"
    ],
    "Interview preparation articles": [
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=2000"
    ],
    "Programming roadmaps": [
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=2000"
    ],
    "College admission and scholarship guides": [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1546410531-ef4cb3cb9951?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=2000"
    ],
    "Industry news and technology updates": [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000"
    ],
    "Default": [
      "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000"
    ]
  };

  useEffect(() => {
    if (!slug) return;
    
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
        }
        const articlesRes = await fetch("/api/blog");
        if (articlesRes.ok) {
          const articlesData = await articlesRes.json();
          if (articlesData.posts) setArticles(articlesData.posts);
        }
      } catch (err) {
        console.error("Failed to fetch post", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1EB] flex flex-col">
        <main className="flex-1 pt-32 pb-24">
          <div className="max-w-4xl mx-auto px-6 animate-pulse">
            <div className="h-10 w-3/4 bg-gray-200 rounded mb-6" />
            <div className="h-6 w-1/2 bg-gray-200 rounded mb-12" />
            <div className="aspect-[21/9] w-full bg-gray-200 rounded-3xl mb-12" />
            <div className="space-y-6">
              <div className="h-5 bg-gray-200 rounded w-full" />
              <div className="h-5 bg-gray-200 rounded w-full" />
              <div className="h-5 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F5F1EB] flex flex-col items-center justify-center">
        <h1 className="font-heading text-5xl text-[#1E1B2E] mb-6 font-black tracking-tight">Article not found</h1>
        <p className="text-[#8E8E93] mb-8 font-medium">The article you're looking for doesn't exist or has been removed.</p>
        <Link href="/blog">
          <button className="px-8 py-4 rounded-full bg-[#1E1B2E] text-white font-bold hover:bg-[#C9A96E] hover:text-[#1E1B2E] transition-all duration-300 shadow-lg">
            Return to Insights
          </button>
        </Link>
      </div>
    );
  }

  const resolvedCoverImage = getCoverImage(post);

  return (
    <div className="bg-[#F5F1EB] min-h-screen flex flex-col relative selection:bg-[#C9A96E]/30">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#C9A96E] origin-left z-50 shadow-[0_0_10px_rgba(201,169,110,0.5)]"
        style={{ scaleX }}
      />

      <main className="flex-1 pb-24 pt-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* LEFT COLUMN: Main Article (70%) */}
            <div className="w-full lg:w-[70%]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm font-sans text-[#8E8E93] mb-6 font-medium">
                  <Link href="/" className="hover:text-[#C9A96E] transition-colors">Home</Link>
                  <ChevronRight className="w-4 h-4" />
                  <Link href="/blog" className="hover:text-[#C9A96E] transition-colors">Insights</Link>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-[#1E1B2E] truncate max-w-[200px]">{post.category}</span>
                </div>

                <h1 className="font-heading text-4xl md:text-5xl text-[#1E1B2E] leading-[1.1] mb-6 font-black tracking-tight">
                  {post.title}
                </h1>

                {/* Meta Row: Author, Date, Share */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-5 border-y border-[rgba(30,27,46,0.06)]">
                  <div className="flex items-center gap-4">
                    {post.author?.image ? (
                      <img src={post.author.image} alt={post.author.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#1E1B2E] text-[#C9A96E] flex items-center justify-center text-xl font-bold shadow-sm">
                        {post.author?.name?.charAt(0) || "A"}
                      </div>
                    )}
                    <div>
                      <p className="text-[#1E1B2E] font-bold text-lg">{post.author?.name || "Author"}</p>
                      <p className="text-[#8E8E93] text-sm">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        {" · "}
                        {post.readTime} min read
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Cover Image inside column */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full aspect-[21/9] md:aspect-[16/9] relative rounded-2xl overflow-hidden mb-10 shadow-lg bg-[#1E1B2E]"
              >
                <img 
                  src={resolvedCoverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {post.excerpt && (
                  <p className="text-xl md:text-2xl text-[#1E1B2E] font-medium leading-relaxed mb-10 font-heading">
                    {post.excerpt}
                  </p>
                )}

                <MarkdownText content={post.content} />
                
                {/* Tags Section */}
                {post.tags && (() => {
                  let parsedTags = [];
                  try {
                    parsedTags = typeof post.tags === "string" ? JSON.parse(post.tags) : post.tags;
                  } catch {
                    parsedTags = [];
                  }
                  return parsedTags.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-[rgba(30,27,46,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <p className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest mb-4">Article Tags</p>
                        <div className="flex flex-wrap gap-2">
                          {parsedTags.map((tag: string, i: number) => (
                            <span key={i} className="px-4 py-2 bg-white border border-[rgba(30,27,46,0.06)] text-[#1E1B2E] rounded-xl text-xs font-bold tracking-wide hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors cursor-pointer shadow-sm">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <button className="px-6 py-3 rounded-full bg-[#1E1B2E] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#C9A96E] hover:text-[#1E1B2E] transition-all shadow-md self-start md:self-end">
                        <Bookmark className="w-4 h-4" /> Save Article
                      </button>
                    </div>
                  );
                })()}
              </motion.div>
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
                      <Link href="/blog" className="w-full text-left flex items-center justify-between py-2 px-3 rounded-lg font-sans text-[14px] transition-colors group text-[#8E8E93] hover:bg-[#F5F1EB] hover:text-[#1E1B2E]">
                        <span className="truncate pr-4">{cat}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-[#C9A96E]" />
                      </Link>
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
      </main>
    </div>
  );
}
