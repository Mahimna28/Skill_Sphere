"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Type, Tag, Clock, AlignLeft, Layout } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CreateBlogClient({ backHref }: { backHref: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "",
    tags: "",
    readTime: "5",
    featured: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(t => t);
      
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
          readTime: parseInt(formData.readTime)
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to create blog post");
      }
      
      setSuccess(true);
      setTimeout(() => {
        router.push(backHref);
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href={backHref}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1E1B2E] hover:bg-[#F5F1EB] transition-colors border border-[rgba(30,27,46,0.08)] shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#1E1B2E]">Create Blog Post</h1>
            <p className="text-[#8E8E93] text-sm mt-1">Write and publish a new article for the platform.</p>
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.title || !formData.content || !formData.category}
          className="flex items-center gap-2 bg-[#C9A96E] text-[#1E1B2E] px-6 py-2.5 rounded-full font-medium hover:bg-[#b8995d] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSubmitting ? "Publishing..." : "Publish Post"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl border border-green-100 text-sm">
          Blog post published successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-[rgba(30,27,46,0.06)] overflow-hidden">
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#1E1B2E] mb-2">
                <Type size={16} className="text-[#C9A96E]" />
                Post Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="The Future of AI in Education..."
                className="w-full bg-[#F5F1EB] border-none rounded-xl px-4 py-3 text-[#1E1B2E] placeholder:text-[#8E8E93] focus:ring-2 focus:ring-[#C9A96E]/50 transition-all font-heading text-xl"
                required
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#1E1B2E] mb-2">
                <AlignLeft size={16} className="text-[#C9A96E]" />
                Short Excerpt
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="A brief summary of the article..."
                className="w-full bg-[#F5F1EB] border-none rounded-xl px-4 py-3 text-[#1E1B2E] placeholder:text-[#8E8E93] focus:ring-2 focus:ring-[#C9A96E]/50 transition-all resize-none min-h-[80px]"
              />
            </div>

            {/* Main Content */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#1E1B2E] mb-2">
                <Layout size={16} className="text-[#C9A96E]" />
                Article Content * (Markdown supported)
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="# Introduction\n\nWrite your amazing content here..."
                className="w-full bg-[#F5F1EB] border-none rounded-xl px-4 py-4 text-[#1E1B2E] placeholder:text-[#8E8E93] focus:ring-2 focus:ring-[#C9A96E]/50 transition-all min-h-[400px] font-mono text-sm leading-relaxed"
                required
              />
            </div>
            
          </div>
        </div>

        {/* Sidebar / Meta Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-[rgba(30,27,46,0.06)] p-6 md:p-8">
          <h2 className="font-heading text-xl font-bold text-[#1E1B2E] mb-6">Post Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Category */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#1E1B2E] mb-2">
                <Tag size={16} className="text-[#C9A96E]" />
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#F5F1EB] border-none rounded-xl px-4 py-3 text-[#1E1B2E] focus:ring-2 focus:ring-[#C9A96E]/50 transition-all"
                required
              >
                <option value="" disabled>Select a category</option>
                <option value="Technology">Technology</option>
                <option value="Education">Education</option>
                <option value="Career">Career</option>
                <option value="Design">Design</option>
                <option value="Updates">Platform Updates</option>
              </select>
            </div>

            {/* Read Time */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#1E1B2E] mb-2">
                <Clock size={16} className="text-[#C9A96E]" />
                Read Time (minutes)
              </label>
              <input
                type="number"
                name="readTime"
                min="1"
                value={formData.readTime}
                onChange={handleChange}
                className="w-full bg-[#F5F1EB] border-none rounded-xl px-4 py-3 text-[#1E1B2E] focus:ring-2 focus:ring-[#C9A96E]/50 transition-all"
              />
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#1E1B2E] mb-2">
                <Tag size={16} className="text-[#C9A96E]" />
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="react, tutorial, web development"
                className="w-full bg-[#F5F1EB] border-none rounded-xl px-4 py-3 text-[#1E1B2E] placeholder:text-[#8E8E93] focus:ring-2 focus:ring-[#C9A96E]/50 transition-all"
              />
            </div>

            {/* Cover Image */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#1E1B2E] mb-2">
                <ImageIcon size={16} className="text-[#C9A96E]" />
                Cover Image URL
              </label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-[#F5F1EB] border-none rounded-xl px-4 py-3 text-[#1E1B2E] placeholder:text-[#8E8E93] focus:ring-2 focus:ring-[#C9A96E]/50 transition-all"
              />
              {formData.coverImage && (
                <div className="mt-4 relative w-full h-48 rounded-xl overflow-hidden border border-[rgba(30,27,46,0.06)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Featured */}
            <div className="md:col-span-2 flex items-center gap-3 bg-[#F5F1EB] p-4 rounded-xl">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-[#C9A96E] text-[#C9A96E] focus:ring-[#C9A96E]/50"
              />
              <label htmlFor="featured" className="text-sm font-medium text-[#1E1B2E] cursor-pointer">
                Feature this post on the blog homepage
              </label>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}
