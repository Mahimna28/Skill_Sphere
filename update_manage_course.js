const fs = require('fs');

let code = fs.readFileSync('src/app/dashboard/teacher/courses/[id]/ManageCourseClient.tsx', 'utf8');

const searchString = `  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">`;

const replaceIndex = code.indexOf(searchString);
if (replaceIndex === -1) {
  console.error("Could not find start string");
  process.exit(1);
}

const endOfSettings = code.indexOf(`      {activeTab === "curriculum" && (`);
if (endOfSettings === -1) {
  console.error("Could not find end string");
  process.exit(1);
}

const replacement = `  return (
    <div className="flex flex-col h-full bg-[#F5F1EB] font-sans">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-[1000px] mx-auto pb-20">
        
        {/* Page Header + Tabs */}
        <div className="pt-[24px] px-[32px] flex items-center gap-4">
          <Link href="/dashboard/teacher">
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[rgba(30,27,46,0.1)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[#1E1B2E] hover:bg-[rgba(30,27,46,0.03)] transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <h1 className="font-heading text-[24px] text-[#1E1B2E]">{course.title}</h1>
        </div>
        
        <div className="pt-[20px] px-[32px] flex gap-1 overflow-x-auto scrollbar-none border-b border-[rgba(30,27,46,0.06)]">
          {[
            { id: "settings", label: "Settings", icon: Save },
            { id: "curriculum", label: "Curriculum", icon: BookOpen },
            { id: "students", label: "Students", icon: Users },
            { id: "gradebook", label: "Gradebook", icon: FileText },
            { id: "assignments", label: "Assignments", icon: FileText },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={\`px-4 py-2.5 rounded-t-lg font-medium text-[13px] flex items-center gap-2 transition-colors \${
                activeTab === tab.id 
                  ? 'bg-[rgba(30,27,46,0.06)] text-[#1E1B2E] shadow-sm' 
                  : 'text-[#8E8E93] hover:bg-[rgba(30,27,46,0.04)]'
              }\`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "settings" && (
          <div className="flex flex-col md:flex-row gap-6 p-[32px]">
            {/* LEFT COLUMN */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="w-full md:w-2/3">
              <div className="bg-white rounded-[16px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <form onSubmit={handleUpdate}>
                  <div className="mb-6">
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Class Title</label>
                    <input required className="w-full h-12 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="mb-6">
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Subject</label>
                    <input required className="w-full h-12 bg-white border border-[rgba(30,27,46,0.12)] rounded-xl px-4 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                  </div>
                  <div className="mb-6">
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Description</label>
                    <textarea required className="w-full min-h-[120px] bg-white border border-[rgba(30,27,46,0.12)] rounded-xl p-3 text-[14px] text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-[3px] focus:ring-[rgba(201,169,110,0.15)] transition-all resize-y" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                  
                  {/* Thumbnail Upload */}
                  <div className="mb-6">
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Course Cover Photo</label>
                    {formData.thumbnail ? (
                      <div className="relative w-full max-w-[240px] rounded-xl overflow-hidden shadow-sm">
                        <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-auto object-cover" />
                        <button type="button" onClick={() => setFormData(prev => ({...prev, thumbnail: ""}))} className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center text-red-600 shadow-md hover:scale-105 transition-transform">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="w-full border-2 border-dashed border-[rgba(30,27,46,0.15)] rounded-xl py-10 flex flex-col items-center justify-center cursor-pointer hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.03)] transition-all">
                        {thumbnailUploading ? (
                          <><Loader2 size={24} className="animate-spin text-[#8E8E93] mb-2" /><span className="text-[14px] text-[#8E8E93]">Uploading...</span></>
                        ) : (
                          <><Upload size={24} className="text-[#8E8E93] mb-2" /><span className="text-[14px] text-[#8E8E93]">Upload Photo</span></>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} disabled={thumbnailUploading} />
                      </label>
                    )}
                  </div>

                  {/* Course Type */}
                  <div className="mb-6">
                    <label className="block text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93] mb-2">Course Type</label>
                    <div className="flex gap-3">
                      <div onClick={() => setFormData({ ...formData, isPublic: true })} className={\`flex-1 flex items-center p-4 rounded-xl border cursor-pointer transition-all \${formData.isPublic ? "border-[#C9A96E] bg-[rgba(201,169,110,0.06)]" : "border-[rgba(30,27,46,0.12)] bg-white hover:border-[rgba(30,27,46,0.2)]"}\`}>
                        <div className={\`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mr-3 \${formData.isPublic ? "border-[#C9A96E]" : "border-[rgba(30,27,46,0.12)]"}\`}>
                          {formData.isPublic && <div className="w-2.5 h-2.5 rounded-full bg-[#C9A96E]" />}
                        </div>
                        <div>
                          <div className="text-[14px] font-medium text-[#1E1B2E]">Public Course</div>
                          <div className="text-[12px] text-[#8E8E93]">Visible to everyone</div>
                        </div>
                      </div>
                      <div onClick={() => setFormData({ ...formData, isPublic: false })} className={\`flex-1 flex items-center p-4 rounded-xl border cursor-pointer transition-all \${!formData.isPublic ? "border-[#C9A96E] bg-[rgba(201,169,110,0.06)]" : "border-[rgba(30,27,46,0.12)] bg-white hover:border-[rgba(30,27,46,0.2)]"}\`}>
                        <div className={\`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mr-3 \${!formData.isPublic ? "border-[#C9A96E]" : "border-[rgba(30,27,46,0.12)]"}\`}>
                          {!formData.isPublic && <div className="w-2.5 h-2.5 rounded-full bg-[#C9A96E]" />}
                        </div>
                        <div>
                          <div className="text-[14px] font-medium text-[#1E1B2E]">Private Class</div>
                          <div className="text-[12px] text-[#8E8E93]">Hidden from public page</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={loading || thumbnailUploading} className="mt-2 w-full h-12 rounded-xl bg-[#1E1B2E] text-white text-[14px] font-medium flex items-center justify-center gap-2 hover:scale-[1.01] hover:shadow-[0_4px_16px_rgba(30,27,46,0.2)] transition-all disabled:opacity-50">
                    {loading ? <><Loader2 className="animate-spin" size={16} /> Saving...</> : <><Save size={16} /> Save Changes</>}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* RIGHT COLUMN */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="w-full md:w-1/3">
              <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-2 mb-2">
                  <Trash2 size={18} className="text-[#DC2626]" />
                  <h3 className="text-[14px] font-medium text-[#DC2626]">Danger Zone</h3>
                </div>
                <p className="text-[13px] text-[#8E8E93] leading-[1.6]">
                  Deleting this course is permanent and cannot be undone. All modules, lessons and enrollments will be removed.
                </p>
                <button onClick={handleDeleteCourse} disabled={loading} className="mt-4 w-full h-10 rounded-xl bg-[#DC2626] text-white text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[#B91C1C] hover:scale-[1.01] transition-all disabled:opacity-50">
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete Course
                </button>
              </div>
            </motion.div>
          </div>
        )}
\n`;

code = code.substring(0, replaceIndex) + replacement + code.substring(endOfSettings);

code = code.replace(/    <\/div>\n  \);\n}\n$/g, '      </motion.div>\n    </div>\n  );\n}\n');

// Clean up remaining tabs neo-brutalism
code = code.replace(/neo-brutalism bg-white p-6 border-4 border-black/g, 'bg-white p-6 rounded-2xl shadow-sm border border-gray-100');
code = code.replace(/neo-brutalism bg-white border-4 border-black/g, 'bg-white rounded-2xl shadow-sm border border-gray-100');
code = code.replace(/neo-brutalism bg-\[#4F7DF3\] text-white/g, 'bg-[#1E1B2E] text-white rounded-xl');
code = code.replace(/neo-brutalism bg-\[#34D399\] text-black/g, 'bg-[#C9A96E] text-white rounded-xl');
code = code.replace(/neo-brutalism bg-\[#F5C84C\] p-6 border-4 border-black/g, 'bg-white p-6 rounded-2xl shadow-sm border border-gray-100');
code = code.replace(/bg-black text-white font-black neo-brutalism uppercase/g, 'bg-[#1E1B2E] text-white rounded-xl font-medium');
code = code.replace(/border-2 border-black/g, 'border border-gray-200 rounded-xl');
code = code.replace(/border-b-4 border-black/g, 'border-b border-gray-100');
code = code.replace(/divide-y-2 divide-black/g, 'divide-y divide-gray-100');
code = code.replace(/font-black/g, 'font-medium text-[#1E1B2E]');
code = code.replace(/uppercase/g, ''); 

fs.writeFileSync('src/app/dashboard/teacher/courses/[id]/ManageCourseClient.tsx', code);
console.log("Updated successfully");
