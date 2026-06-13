"use client";

import { useState } from "react";
import { Search, BookOpen, Clock, Star, Users, Filter, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  thumbnail: string | null;
  teacher: { name: string };
  _count: { enrollments: number };
}

interface Props {
  courses: Course[];
  userRole: string | null;
  initialEnrolledIds: string[];
}

const courseColors = [
  "bg-[#4F7DF3]", "bg-[#34D399]", "bg-[#F5C84C]"
];

export default function CoursesPageClient({ courses, userRole, initialEnrolledIds }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set(initialEnrolledIds));

  const categories = ["All", ...Array.from(new Set(courses.map(c => c.subject)))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.teacher.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.subject === selectedCategory;
    return matchesSearch && matchesCategory;
  });


  return (
    <div className="py-24 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
        <div className="text-left">
          <div className="inline-block bg-[#34D399] px-4 py-1.5 border-4 border-black font-black text-sm uppercase mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Expand Your Horizon
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
            Our <span className="text-[#4F7DF3]">Courses</span>
          </h1>
          <p className="text-xl font-bold text-muted-foreground mt-6 max-w-xl">
            Choose from industry-expert courses and start building your future today.
          </p>
        </div>

        <div className="w-full md:w-96 relative">
          <input 
            type="text" 
            placeholder="Search courses or instructors..." 
            className="w-full h-16 bg-white border-4 border-black rounded-2xl px-6 pl-14 font-bold text-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black w-6 h-6" />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-3 border-4 border-black font-black uppercase tracking-widest text-xs transition-all ${
              selectedCategory === cat 
              ? 'bg-[#F5C84C] translate-x-1 translate-y-1 shadow-none' 
              : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, idx) => {
            const isEnrolled = enrolledIds.has(course.id);
            const color = courseColors[idx % courseColors.length];

            return (
              <div key={course.id} className="bg-white border-4 border-black p-8 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform group flex flex-col">
                <div className={`w-full h-48 ${color} border-4 border-black rounded-2xl mb-8 flex items-center justify-center overflow-hidden relative`}>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen size={80} className="text-white opacity-40 group-hover:scale-110 transition-transform" />
                  )}
                  <div className="absolute top-4 right-4 bg-white border-2 border-black px-2 py-1 font-black text-[10px] uppercase">
                    {course.subject}
                  </div>
                </div>
                
                <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-tight flex-1">{course.title}</h3>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full border-2 border-black bg-gray-200 flex items-center justify-center text-xs">👨‍🏫</div>
                  <p className="font-bold text-sm text-muted-foreground">by <span className="text-black">{course.teacher.name}</span></p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-2 font-bold text-xs">
                     <Users className="w-4 h-4 text-[#4F7DF3]" />
                     {course._count.enrollments} Students
                  </div>
                  <div className="flex items-center gap-2 font-bold text-xs">
                     <Clock className="w-4 h-4 text-[#34D399]" />
                     Flexible
                  </div>
                </div>

                {isEnrolled ? (
                  <Button className="w-full neo-brutalism bg-[#34D399] text-black h-14 font-black text-lg" onClick={() => router.push(`/dashboard/student/courses/${course.id}`)}>
                    <CheckCircle className="mr-2 h-5 w-5" /> CONTINUE LEARNING
                  </Button>
                ) : (
                  <Button 
                    className="w-full neo-brutalism bg-[#4F7DF3] h-14 font-black text-lg group text-white"
                    onClick={() => router.push(`/courses/${course.id}`)}
                  >
                    VIEW DETAILS
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-32 text-center border-4 border-dashed border-black rounded-3xl">
            <h3 className="text-3xl font-black uppercase mb-4">No courses found</h3>
            <p className="font-bold text-muted-foreground">Try adjusting your search or category filters.</p>
            <Button 
              variant="outline" 
              className="mt-8 font-black border-4 border-black"
              onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}
            >
              CLEAR ALL FILTERS
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
