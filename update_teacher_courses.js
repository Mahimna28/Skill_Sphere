const fs = require('fs');

let code = fs.readFileSync('src/app/dashboard/teacher/courses/TeacherCoursesClient.tsx', 'utf8');

// Add framer-motion import if not present
if (!code.includes('framer-motion')) {
  code = code.replace(
    'import { useState } from "react";',
    'import { useState } from "react";\nimport { motion, AnimatePresence } from "framer-motion";'
  );
}

// Ensure Users icon is imported
if (!code.includes('Users')) {
  code = code.replace(
    /import \{[^}]+\} from "lucide-react";/,
    'import { BookOpen, Plus, Loader2, X, Globe, Lock, Users, Save } from "lucide-react";'
  );
}

const startString = `  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">`;

const replaceIndex = code.indexOf('  return (\n    <div className="space-y-8 max-w-6xl mx-auto');
if (replaceIndex === -1) {
  console.error("Could not find start of return statement");
  process.exit(1);
}

const replacement = `  return (
    <div className="flex flex-col h-full bg-[#F5F1EB] font-sans">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className={\`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl font-medium shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-3 \${toast.type === "success" ? "bg-[#1E1B2E] text-white" : "bg-[#DC2626] text-white"}\`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-[1200px] mx-auto pb-20">
        
        {/* PAGE HEADER */}
        <div className="pt-[8px] px-[32px]">
          <p className="font-sans text-[14px] text-[#8E8E93]">Create and manage your course catalogue.</p>
        </div>

        {/* ACTION BAR */}
        <div className="flex justify-between items-center py-[20px] px-[32px]">
          <div></div> {/* Empty left for future tabs */}
          <button 
            onClick={() => setShowForm(true)}
            className="h-10 px-5 rounded-xl bg-[#C9A96E] text-[#1E1B2E] text-[14px] font-medium flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(201,169,110,0.3)] transition-all"
          >
            <Plus size={16} /> Create New Course
          </button>
        </div>

        {/* COURSES GRID / EMPTY STATE */}
        <div className="px-[32px] pb-[32px]">
          {courses.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="w-full bg-white rounded-[16px] p-[60px] flex flex-col items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-center">
              <BookOpen size={48} className="text-[#1E1B2E] opacity-25" />
              <h3 className="font-heading text-[20px] text-[#1E1B2E] mt-[16px]">No Courses Yet</h3>
              <p className="font-sans text-[14px] text-[#8E8E93] mt-2">Create your first course to start building your catalogue.</p>
              <button 
                onClick={() => setShowForm(true)}
                className="mt-[20px] h-[44px] px-6 rounded-xl bg-[#C9A96E] text-[#1E1B2E] text-[14px] font-medium hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(201,169,110,0.3)] transition-all"
              >
                Create New Course
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
              {courses.map((course, i) => (
                <motion.div 
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="bg-white rounded-[16px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-video w-full bg-[rgba(245,241,235,0.6)] flex items-center justify-center">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen size={40} className="text-[#8E8E93] opacity-40" />
                    )}
                    <div className="absolute top-[12px] left-[12px] bg-[rgba(201,169,110,0.12)] text-[#C9A96E] font-sans text-[11px] font-semibold px-[10px] py-[4px] rounded-full uppercase tracking-wide">
                      {course.subject}
                    </div>
                  </div>
                  
                  <div className="p-[20px] flex-1 flex flex-col">
                    <h3 className="font-heading text-[18px] text-[#1E1B2E] line-clamp-1">{course.title}</h3>
                    <div className="flex items-center gap-1.5 mt-[6px] text-[#8E8E93] text-[13px] font-sans">
                      <Users size={14} />
                      <span>{course._count?.enrollments ?? 0} students enrolled</span>
                    </div>
                    <p className="font-sans text-[13px] text-[#8E8E93] line-clamp-2 mt-[8px] leading-[1.5] flex-1">
                      {course.description}
                    </p>
                  </div>

                  <div className="px-[20px] pb-[20px] flex items-center gap-[10px]">
                    <Link href={\`/dashboard/teacher/courses/\${course.id}\`} className="flex-1">
                      <button className="w-full h-[36px] bg-[#C9A96E] text-[#1E1B2E] rounded-xl text-[13px] font-medium hover:scale-[1.01] transition-transform">
                        Edit
                      </button>
                    </Link>
                    <Link href={\`/dashboard/teacher/courses/\${course.id}\`} className="flex-1">
                      <button className="w-full h-[36px] bg-transparent border border-[#1E1B2E] text-[#1E1B2E] rounded-xl text-[13px] font-medium hover:bg-[#1E1B2E] hover:text-white transition-colors">
                        View Students
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* CREATE COURSE MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(30,27,46,0.4)] backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden"
            >
              <div className="flex items-center justify-between p-[24px] border-b border-[rgba(30,27,46,0.08)]">
                <h2 className="font-heading text-[24px] text-[#1E1B2E]">Create New Course</h2>
                <button 
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[rgba(30,27,46,0.04)] text-[#8E8E93] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-[32px]">
                <form onSubmit={handleCreate} className="space-y-[24px]">
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Course Title *</label>
                    <input
                      required
                      placeholder="e.g. Introduction to Python"
                      className="w-full h-12 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Subject *</label>
                    <select
                      className="w-full h-12 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all appearance-none"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    >
                      {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Description *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe what students will learn in this course..."
                      className="w-full bg-white border border-[rgba(30,27,46,0.12)] rounded-xl p-3 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all resize-y"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Cover Photo</label>
                    <div className="flex gap-4 items-center">
                      {form.thumbnail ? (
                        <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm">
                           <img src={form.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                           <button type="button" onClick={() => setForm({...form, thumbnail: ""})} className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-red-600 shadow-md">
                             <X size={12} />
                           </button>
                        </div>
                      ) : (
                        <div className="relative flex-1">
                          <input 
                            type="file" 
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                            onChange={async (e) => {
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
                                  setForm({ ...form, thumbnail: data.url });
                                  showToast("Image uploaded successfully!", "success");
                                } else {
                                  showToast(data.message || "Upload failed", "error");
                                }
                              } catch (err) {
                                showToast("Upload failed", "error");
                              } finally {
                                setLoading(false);
                              }
                            }} 
                            disabled={loading}
                          />
                          <div className="h-12 border-2 border-dashed border-[rgba(30,27,46,0.15)] rounded-xl flex items-center justify-center gap-2 hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.03)] transition-all text-[#8E8E93] text-[14px]">
                            {loading ? <><Loader2 size={16} className="animate-spin" /> Uploading...</> : <><Upload size={16} /> Select Image</>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Course Type *</label>
                    <div className="flex gap-3">
                      <div onClick={() => setForm({ ...form, isPublic: true })} className={\`flex-1 flex items-center p-3 rounded-xl border cursor-pointer transition-all \${form.isPublic ? "border-[#C9A96E] bg-[rgba(201,169,110,0.06)]" : "border-[rgba(30,27,46,0.12)] bg-white hover:border-[rgba(30,27,46,0.2)]"}\`}>
                        <div className={\`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mr-3 \${form.isPublic ? "border-[#C9A96E]" : "border-[rgba(30,27,46,0.12)]"}\`}>
                          {form.isPublic && <div className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-[#1E1B2E]">Public</div>
                        </div>
                      </div>
                      <div onClick={() => setForm({ ...form, isPublic: false })} className={\`flex-1 flex items-center p-3 rounded-xl border cursor-pointer transition-all \${!form.isPublic ? "border-[#C9A96E] bg-[rgba(201,169,110,0.06)]" : "border-[rgba(30,27,46,0.12)] bg-white hover:border-[rgba(30,27,46,0.2)]"}\`}>
                        <div className={\`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mr-3 \${!form.isPublic ? "border-[#C9A96E]" : "border-[rgba(30,27,46,0.12)]"}\`}>
                          {!form.isPublic && <div className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-[#1E1B2E]">Private</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-12 rounded-xl border border-[rgba(30,27,46,0.12)] text-[#1E1B2E] text-[14px] font-medium hover:bg-[rgba(30,27,46,0.04)] transition-all">
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className="flex-1 h-12 rounded-xl bg-[#1E1B2E] text-white text-[14px] font-medium flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(30,27,46,0.2)] transition-all disabled:opacity-50">
                      {loading ? <><Loader2 className="animate-spin" size={16} /> Publishing...</> : "Publish Course"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;

code = code.substring(0, replaceIndex) + replacement;

fs.writeFileSync('src/app/dashboard/teacher/courses/TeacherCoursesClient.tsx', code);
console.log("TeacherCoursesClient updated");
