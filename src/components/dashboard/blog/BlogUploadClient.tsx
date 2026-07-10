"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, PenTool, Image as ImageIcon, X, Trash2, Edit3, BookOpen, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  "AI & Machine Learning tutorials",
  "Web Development guides",
  "Career and internship tips",
  "Interview preparation articles",
  "Programming roadmaps",
  "College admission and scholarship guides",
  "Industry news and technology updates"
];

export default function BlogUploadClient({ initialBlogs = [], userRole }: { initialBlogs?: any[], userRole?: string }) {
  const router = useRouter();
  const [blogs, setBlogs] = useState(initialBlogs);
  const [showForm, setShowForm] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: CATEGORIES[0],
    coverImage: "",
    tags: "",
    readTime: 5
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm(prev => ({ ...prev, title, slug: editingBlogId ? prev.slug : generateSlug(title) }));
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setForm(prev => ({ ...prev, coverImage: data.url }));
        showToast("Image uploaded successfully!", "success");
      } else {
        showToast(data.message || "Upload failed", "error");
      }
    } catch (err) {
      showToast("Upload failed. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = editingBlogId ? `/api/blog/${editingBlogId}` : "/api/blog/create";
      const method = editingBlogId ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        showToast(editingBlogId ? "Blog post updated successfully!" : "Blog post published successfully!", "success");
        setShowForm(false);
        setEditingBlogId(null);
        setForm({
          title: "", slug: "", excerpt: "", content: "", category: CATEGORIES[0], coverImage: "", tags: "", readTime: 5
        });
        router.refresh();
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showToast(data.message || "Failed to save post", "error");
      }
    } catch (err) {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (blog: any) => {
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      category: blog.category || CATEGORIES[0],
      coverImage: blog.coverImage || "",
      tags: blog.tags || "",
      readTime: blog.readTime || 5
    });
    setEditingBlogId(blog.id);
    setShowForm(true);
  };

  const handleDelete = async (blogId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/blog/${blogId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Blog deleted successfully", "success");
        setBlogs(blogs.filter((b: any) => b.id !== blogId));
        router.refresh();
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to delete blog", "error");
      }
    } catch {
      showToast("Error deleting blog", "error");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } }
  };

  return (
    <div className="flex flex-col bg-[#F5F1EB] min-h-screen w-full font-sans pb-20 overflow-x-hidden min-w-0">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-top-2 text-white font-medium text-[14px] ${toast.type === "success" ? "bg-[#C9A96E]" : "bg-red-500"}`}>
          {toast.message}
        </div>
      )}

      {/* HEADER & ACTION BUTTONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-[32px] pt-[8px] pb-[24px] gap-[16px]">
        <p className="font-sans text-[14px] text-[#8E8E93]">Manage and publish articles to the Skill Sphere community.</p>
        
        <button 
          onClick={() => {
            setEditingBlogId(null);
            setForm({ title: "", slug: "", excerpt: "", content: "", category: CATEGORIES[0], coverImage: "", tags: "", readTime: 5 });
            setShowForm(true);
          }}
          className="flex items-center h-[40px] px-[18px] rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-sans text-[13px] font-medium hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(201,169,110,0.3)] transition-all"
        >
          <Plus size={14} className="mr-[6px]" /> Write New Blog
        </button>
      </div>

      {/* BLOGS LIST SECTION */}
      <div>
        <h2 className="font-heading text-[20px] text-[#1E1B2E] px-[32px] pt-[24px] pb-[16px] flex items-center gap-[8px]">
          <BookOpen size={18} className="text-[#1E1B2E]" /> {userRole === "superadmin" || userRole === "admin" ? "All Platform Blogs" : "Your Published Blogs"}
        </h2>
        
        {blogs.length === 0 ? (
          <div className="bg-white rounded-[16px] mx-[32px] mb-[32px] p-[80px_24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col items-center text-center">
            <PenTool size={48} className="text-[#1E1B2E] opacity-25 mb-[20px]" />
            <h3 className="font-heading text-[20px] text-[#1E1B2E]">No blogs published yet</h3>
            <p className="font-sans text-[14px] text-[#8E8E93] max-w-[400px] mt-[8px] leading-[1.6]">
              Share your insights, tutorials, and tips with the community by publishing your first blog post.
            </p>
            <button 
              onClick={() => setShowForm(true)}
              className="mt-[24px] h-[44px] px-[24px] rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-sans text-[14px] font-medium hover:scale-[1.02] transition-transform"
            >
              Write First Blog
            </button>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[24px] px-[32px] pb-[32px]"
          >
            {blogs.map((blog: any) => (
              <motion.div 
                key={blog.id}
                variants={itemVariants}
                className="bg-white rounded-[16px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col transition-transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
              >
                <div className="w-full aspect-video bg-[#F5F1EB] relative overflow-hidden">
                  {blog.coverImage ? (
                    <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#8E8E93]/50">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  <div className="absolute top-[12px] right-[12px] bg-white/90 backdrop-blur-sm text-[#1E1B2E] px-[10px] py-[4px] rounded-full font-sans font-bold text-[10px] uppercase tracking-wider">
                    {blog.category}
                  </div>
                </div>
                
                <div className="p-[20px] flex flex-col flex-1">
                  <h3 className="font-heading text-[18px] text-[#1E1B2E] leading-tight mb-[8px] line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="font-sans text-[13px] text-[#8E8E93] line-clamp-2 mb-[16px] flex-1">
                    {blog.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-[12px] text-[12px] font-medium text-[#8E8E93] mb-[16px]">
                    <div className="flex items-center gap-[4px]">
                      <Clock size={12} /> {blog.readTime} min read
                    </div>
                    <div>&bull;</div>
                    <div>{new Date(blog.createdAt).toLocaleDateString()}</div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-[16px] border-t border-[rgba(30,27,46,0.06)] mt-auto gap-[8px]">
                    <button 
                      onClick={() => handleEditClick(blog)}
                      className="flex-1 h-[36px] rounded-xl bg-[#F5F1EB] text-[#1E1B2E] font-sans text-[13px] font-medium transition-colors hover:bg-[rgba(201,169,110,0.2)] hover:text-[#C9A96E] flex items-center justify-center gap-[6px]"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(blog.id, blog.title)}
                      className="w-[36px] h-[36px] rounded-xl border border-[rgba(220,38,38,0.2)] text-[#DC2626] flex items-center justify-center transition-colors hover:bg-[rgba(220,38,38,0.08)]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Blog Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-[rgba(30,27,46,0.6)] backdrop-blur-sm z-[100] flex items-center justify-center p-4 py-8">
          <div className="w-full max-w-4xl max-h-full bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-[24px] py-[20px] border-b border-[rgba(30,27,46,0.08)] flex items-center justify-between shrink-0">
              <h2 className="font-heading text-[22px] text-[#1E1B2E]">
                {editingBlogId ? "Edit Blog Post" : "Publish New Blog Post"}
              </h2>
              <button 
                onClick={() => setShowForm(false)} 
                className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[#8E8E93] hover:bg-[rgba(30,27,46,0.04)] hover:text-[#1E1B2E] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-[24px] overflow-y-auto scrollbar-thin flex-1">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#1E1B2E]">Post Title</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. 10 Tips for Mastering Next.js" 
                      value={form.title}
                      onChange={handleTitleChange}
                      className="h-[48px] px-4 rounded-xl border border-[rgba(30,27,46,0.12)] bg-[#F5F1EB]/50 focus:bg-white focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/20 transition-all outline-none text-[#1E1B2E]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#1E1B2E]">Category / Topic</label>
                    <select 
                      value={form.category}
                      onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                      className="h-[48px] px-4 rounded-xl border border-[rgba(30,27,46,0.12)] bg-[#F5F1EB]/50 focus:bg-white focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/20 transition-all outline-none text-[#1E1B2E]"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#1E1B2E]">URL Slug</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="10-tips-for-mastering-nextjs" 
                      value={form.slug}
                      onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                      disabled={!!editingBlogId}
                      className="h-[48px] px-4 rounded-xl border border-[rgba(30,27,46,0.12)] bg-[#F5F1EB]/50 focus:bg-white focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/20 transition-all outline-none text-[#1E1B2E] disabled:opacity-60"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#1E1B2E]">Read Time (minutes)</label>
                    <input 
                      required 
                      type="number" 
                      min="1"
                      max="60"
                      value={form.readTime}
                      onChange={(e) => setForm(prev => ({ ...prev, readTime: parseInt(e.target.value) || 1 }))}
                      className="h-[48px] px-4 rounded-xl border border-[rgba(30,27,46,0.12)] bg-[#F5F1EB]/50 focus:bg-white focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/20 transition-all outline-none text-[#1E1B2E]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1E1B2E]">Tags (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="React, Nextjs, WebDev" 
                    value={form.tags}
                    onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
                    className="h-[48px] px-4 rounded-xl border border-[rgba(30,27,46,0.12)] bg-[#F5F1EB]/50 focus:bg-white focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/20 transition-all outline-none text-[#1E1B2E]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1E1B2E]">Excerpt (Short summary)</label>
                  <textarea 
                    required 
                    rows={2}
                    placeholder="A brief summary of what the article is about..." 
                    value={form.excerpt}
                    onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="px-4 py-3 rounded-xl border border-[rgba(30,27,46,0.12)] bg-[#F5F1EB]/50 focus:bg-white focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/20 transition-all outline-none text-[#1E1B2E] resize-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1E1B2E]">Cover Image</label>
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleUploadImage}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <button type="button" className="h-[48px] px-6 rounded-xl border border-[rgba(30,27,46,0.12)] bg-white text-[#1E1B2E] font-medium hover:bg-[#F5F1EB] transition-colors flex items-center gap-2">
                        <ImageIcon size={18} className="text-[#8E8E93]" /> Upload Cover Photo
                      </button>
                    </div>
                    <div className="flex-1 w-full">
                      <input 
                        type="text" 
                        placeholder="Or paste an image URL here..." 
                        value={form.coverImage}
                        onChange={(e) => setForm(prev => ({ ...prev, coverImage: e.target.value }))}
                        className="w-full h-[48px] px-4 rounded-xl border border-[rgba(30,27,46,0.12)] bg-[#F5F1EB]/50 focus:bg-white focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/20 transition-all outline-none text-[#1E1B2E]"
                      />
                    </div>
                  </div>
                  {form.coverImage && (
                    <div className="mt-3 w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-[rgba(30,27,46,0.12)] shadow-sm bg-gray-100">
                      <img src={form.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1E1B2E]">Main Content (Markdown supported)</label>
                  <textarea 
                    required 
                    rows={12}
                    placeholder="Write your amazing post here..." 
                    value={form.content}
                    onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                    className="px-4 py-4 rounded-xl border border-[rgba(30,27,46,0.12)] bg-[#F5F1EB]/50 focus:bg-white focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/20 transition-all outline-none text-[#1E1B2E] font-mono text-sm leading-relaxed"
                  />
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-[24px] py-[20px] border-t border-[rgba(30,27,46,0.08)] bg-[#F5F1EB]/30 flex justify-end gap-[12px] shrink-0">
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="h-[44px] px-[24px] rounded-xl border border-[rgba(30,27,46,0.12)] bg-white text-[#1E1B2E] font-sans text-[14px] font-medium transition-colors hover:bg-[rgba(30,27,46,0.04)]"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSubmit}
                disabled={loading}
                className="h-[44px] px-[32px] rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-bold text-sm hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(201,169,110,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                ) : (
                  editingBlogId ? "Update Post" : "Publish Post"
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
