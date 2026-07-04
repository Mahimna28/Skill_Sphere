"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { useParams } from "next/navigation";

// Basic markdown parser
const MarkdownText = ({ content }: { content: string }) => {
  const blocks = content.split('\n\n');

  return (
    <div className="space-y-6 text-[#1E1B2E] text-lg leading-relaxed font-sans">
      {blocks.map((block, i) => {
        // Headers
        if (block.startsWith('### ')) {
          return <h3 key={i} className="font-heading text-2xl text-[#1E1B2E] mt-8 mb-4">{block.replace('### ', '')}</h3>;
        }
        if (block.startsWith('## ')) {
          return <h2 key={i} className="font-heading text-3xl text-[#1E1B2E] mt-10 mb-6">{block.replace('## ', '')}</h2>;
        }
        
        // Italics: basic *italic* or _italic_ parse
        let parsed = block;
        
        const parts = parsed.split(/(\*[^*]+\*)/g);
        
        return (
          <p key={i} className="text-[#3A3847]">
            {parts.map((part, j) => {
              if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={j} className="italic text-[#1E1B2E]">{part.slice(1, -1)}</em>;
              }
              return <span key={j}>{part}</span>;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
        }
      } catch (err) {
        console.error("Failed to fetch post", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1EB] flex flex-col">
        <Header />
        <main className="flex-1 pt-32 pb-24">
          <div className="max-w-3xl mx-auto px-6 animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded mb-8" />
            <div className="h-12 w-3/4 bg-gray-200 rounded mb-6" />
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="aspect-[16/9] w-full bg-gray-200 rounded-2xl mb-12" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F5F1EB] flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          <h1 className="font-heading text-4xl text-[#1E1B2E] mb-4">Post not found</h1>
          <Link href="/blog">
            <button className="px-6 py-3 rounded-full bg-[#C9A96E] text-[#1E1B2E] font-medium">
              Back to Blog
            </button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB] flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-24">
        <article className="max-w-3xl mx-auto px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#8E8E93] hover:text-[#C9A96E] transition-colors mb-8 font-medium text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to all posts
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-[rgba(201,169,110,0.15)] text-[#C9A96E] rounded-full text-xs font-bold uppercase tracking-wider">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-[#8E8E93] text-sm">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </span>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl text-[#1E1B2E] leading-tight mb-8">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-[rgba(30,27,46,0.06)]">
              {post.author?.image ? (
                <img src={post.author.image} alt={post.author.name} className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#1E1B2E] text-[#C9A96E] flex items-center justify-center text-xl font-bold">
                  {post.author?.name?.charAt(0) || "A"}
                </div>
              )}
              <div>
                <p className="text-[#1E1B2E] font-medium text-lg">{post.author?.name || "Author"}</p>
                <p className="text-[#8E8E93] text-sm">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {post.coverImage && (
              <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-12 shadow-sm border border-[rgba(30,27,46,0.04)] bg-white">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
            )}

            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[rgba(30,27,46,0.04)] mb-16">
              <MarkdownText content={post.content} />
              
              {post.tags && (() => {
                let parsedTags = [];
                try {
                  parsedTags = typeof post.tags === "string" ? JSON.parse(post.tags) : post.tags;
                } catch {
                  parsedTags = [];
                }
                return parsedTags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-[rgba(30,27,46,0.06)]">
                    <p className="text-sm text-[#8E8E93] mb-4 uppercase tracking-wider font-medium">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {parsedTags.map((tag: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-[#F5F1EB] text-[#1E1B2E] rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
