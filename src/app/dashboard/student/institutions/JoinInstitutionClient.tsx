"use client";

import { BookOpen, School, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";

interface PrivateClass {
  id: string;
  title: string;
  subject: string;
  thumbnail: string | null;
  isPublic: boolean;
  teacher: { name: string };
  _count: { enrollments: number };
}

interface Props {
  userInstitutionId: string | null | undefined;
  institutionName: string | null | undefined;
  privateClasses: PrivateClass[];
}

export default function JoinInstitutionClient({ userInstitutionId, institutionName, privateClasses }: Props) {
  return (
    <div className="font-sans pb-12 text-[#1E1B2E]">
      <div
      >
        {/* Section 1 - Subtitle */}
        <div className="pt-8 px-8">
          <p className="text-[14px] text-[#8E8E93]">
            Your school affiliation and private classes assigned by your teacher.
          </p>
        </div>

        {/* Institution Affiliation */}
        <div
          className="mx-8 mt-5 mb-5"
        >
          {userInstitutionId ? (
            <div className="bg-white rounded-[16px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col md:flex-row gap-6 md:items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-[56px] h-[56px] rounded-full bg-[#1E1B2E] text-white flex items-center justify-center font-heading text-[20px] shrink-0">
                  {institutionName ? institutionName.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="flex flex-col">
                  <h2 className="font-heading text-[22px] text-[#1E1B2E] leading-tight">
                    {institutionName || "Academic Institution"}
                  </h2>
                  <span className="text-[13px] text-[#8E8E93] mt-1">
                    Academic Institution
                  </span>
                </div>
              </div>
              <div className="shrink-0 flex items-center">
                <span className="bg-[rgba(201,169,110,0.12)] text-[#C9A96E] text-[13px] font-medium px-4 py-1.5 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Active
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[16px] py-[60px] px-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center text-center">
              <School className="w-12 h-12 text-[#1E1B2E] opacity-25 mb-4" />
              <h3 className="font-heading text-[20px] text-[#1E1B2E] mb-2">No Institution Assigned</h3>
              <p className="text-[14px] text-[#8E8E93] max-w-[420px] mx-auto leading-[1.6]">
                You have not been added to any institution yet. Your teacher or school administrator must add you first.
              </p>
            </div>
          )}
        </div>

        {/* Section 2 - Private Classes */}
        <div className="pt-6 px-8 pb-2">
          <h2 className="font-heading text-[20px] text-[#1E1B2E]">My Private Classes</h2>
          <p className="text-[13px] text-[#8E8E93] mt-0.5">
            Classes assigned to you by your teacher
          </p>
        </div>

        <div className="px-8 pb-8 pt-4">
          {privateClasses.length === 0 ? (
            <div
              className="bg-white rounded-[16px] py-[60px] px-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center text-center"
            >
              <BookOpen className="w-12 h-12 text-[#1E1B2E] opacity-25 mb-4" />
              <h3 className="font-heading text-[20px] text-[#1E1B2E] mb-2">No Classes Yet</h3>
              <p className="text-[14px] text-[#8E8E93] max-w-[400px] mx-auto leading-[1.6]">
                Your teacher hasn't added you to any private class yet. Check back later!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {privateClasses.map((cls, index) => (
                <div 
                  key={cls.id}
                  className="bg-white rounded-[16px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-[2px] transition-all flex flex-col"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lock className="w-3.5 h-3.5 text-[#8E8E93]" />
                    <span className="text-[11px] uppercase tracking-[0.08em] text-[#8E8E93] font-medium">
                      Private Class
                    </span>
                  </div>
                  
                  <h3 className="font-heading text-[18px] text-[#1E1B2E] mb-1">
                    {cls.title}
                  </h3>
                  <p className="text-[13px] text-[#8E8E93]">
                    Assigned by {cls.teacher.name}
                  </p>
                  
                  <div className="mt-2.5 mb-3.5">
                    <span className="inline-block bg-[rgba(201,169,110,0.1)] text-[#C9A96E] text-[12px] px-3 py-1 rounded-full font-medium">
                      {cls.subject}
                    </span>
                  </div>

                  <div className="mt-auto pt-2">
                    <Link href={`/dashboard/student/courses/${cls.id}`}>
                      <button className="h-[36px] px-4 rounded-xl border border-[#1E1B2E] text-[#1E1B2E] text-[13px] font-medium hover:bg-[#1E1B2E] hover:text-white transition-colors">
                        Enter Class
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
