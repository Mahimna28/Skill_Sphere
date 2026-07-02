"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, School, Users, Baby, Loader2, CheckCircle2, XCircle, AtSign, ArrowLeft } from "lucide-react";

const appleEase = [0.4, 0, 0.2, 1];

const roles = [
  { id: "student", name: "Student", desc: "Learn at your own pace", icon: GraduationCap },
  { id: "teacher", name: "Teacher", desc: "Create and manage courses", icon: School },
  { id: "parent", name: "Parent", desc: "Monitor your child's progress", icon: Users },
];

export default function GoogleSetupPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; image?: string } | null>(null);
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [childEmail, setChildEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [step, setStep] = useState<"role" | "details">("role");

  // Username availability state
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/google/setup");
        const data = await res.json();
        if (!res.ok) {
          router.push("/login");
          return;
        }
        if (data.user?.role !== "pending") {
          const roleToPath: Record<string, string> = {
            student: "/dashboard/student",
            teacher: "/dashboard/teacher",
            parent: "/dashboard/parent",
            superadmin: "/dashboard/admin",
            institute_admin: "/dashboard/teacher",
          };
          router.push(roleToPath[data.user.role] ?? "/dashboard/student");
          return;
        }
        setUser(data.user);
      } catch {
        router.push("/login");
      } finally {
        setPageLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const checkUsername = useCallback(async (value: string) => {
    if (!value) { setUsernameStatus("idle"); return; }
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(value)) { setUsernameStatus("invalid"); return; }
    setUsernameStatus("checking");
    try {
      const res = await fetch(`/api/users/check-username?username=${value}`);
      if (res.ok) {
        const data = await res.json();
        setUsernameStatus(data.available ? "available" : "taken");
      } else {
        setUsernameStatus("available");
      }
    } catch {
      setUsernameStatus("available");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => checkUsername(username), 500);
    return () => clearTimeout(timer);
  }, [username, checkUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (role === "parent" && !childEmail) {
      setError("Child's Gmail is required for the Parent role.");
      setLoading(false);
      return;
    }

    if (usernameStatus !== "available") {
      setError("Please choose a valid and available username.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/google/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, username, childEmail: role === "parent" ? childEmail : undefined }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(data.redirect);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const Stepper = () => {
    const steps = ["role", "details"];
    const currentIndex = steps.indexOf(step);

    return (
      <div className="flex items-center justify-center mb-8 gap-2 sm:gap-3">
        {steps.map((s, i) => {
          const isActive = i === currentIndex;
          const isCompleted = i < currentIndex;
          const dotColor = isActive || isCompleted ? "bg-[#C9A96E]" : "bg-[#8E8E93] opacity-30";
          const textColor = isActive || isCompleted ? "text-[#C9A96E]" : "text-[#8E8E93] opacity-50";
          
          return (
            <div key={s} className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${dotColor}`} />
                <span className={`font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.1em] font-medium ${textColor}`}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-4 sm:w-8 h-[1px] ${isCompleted ? "bg-[#C9A96E]" : "bg-[rgba(30,27,46,0.08)]"}`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (pageLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#1E1B2E]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-[#C9A96E] animate-spin" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] flex flex-col lg:flex-row items-center justify-between p-6 lg:p-16 overflow-hidden">
      
      {/* Background Image with Dark Overlay */}
      <div
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-[rgba(30,27,46,0.78)] z-10 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-[url('/images/about-origin.jpg')] bg-cover bg-center blur-[2px] scale-105" />
      </div>

      {/* TOP LEFT BACK BUTTON */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="inline-flex items-center gap-2 font-sans text-[13px] text-white hover:text-[#C9A96E] transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      {/* LEFT SIDE - BRAND CONTENT */}
      <div
        className="relative z-20 w-full lg:w-[45%] flex flex-col justify-center mt-12 lg:mt-0 mb-6 lg:mb-0"
      >
        <Link href="/" className="mb-4 lg:mb-8 w-max">
          <span className="font-heading font-black text-[28px] tracking-tight text-white">
            Skill Sphere.
          </span>
        </Link>
        <h1
          className="font-heading text-[22px] lg:text-[32px] text-white leading-[1.1] mb-4 max-w-[400px]"
        >
          Education, crafted for how you think.
        </h1>
        <p
          className="font-sans text-[15px] text-[#F5F1EB] mb-8 lg:mb-12"
        >
          Join our community of learners shaping their future.
        </p>
      </div>

      {/* RIGHT SIDE - FLOATING CARD */}
      <div
        className="relative z-20 w-full lg:w-[55%] max-w-[480px] bg-white rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.18)] p-[28px] flex flex-col mx-auto lg:mr-0 max-h-[85vh] overflow-y-auto"
      >
        <Stepper />

        <AnimatePresence mode="wait">
          {step === "role" && (
            <div 
              key="role"
              className="flex flex-col"
            >
              <div className="text-center mb-6">
                {user?.image && (
                  <div className="w-16 h-16 rounded-full border-2 border-white mx-auto mb-3 overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.1)] relative">
                    <Image src={user.image} alt="Profile" fill className="object-cover" />
                  </div>
                )}
                <h2 className="font-heading text-[24px] text-[#1E1B2E] mb-1">Welcome, {user?.name?.split(" ")[0]}!</h2>
                <p className="font-sans text-[14px] text-[#8E8E93]">Google verified ✓ Choose your path.</p>
              </div>

              <div className="space-y-3 mb-6">
                {roles.map(r => {
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id} type="button"
                      onClick={() => setRole(r.id)}
                      className={`w-full p-4 rounded-xl flex items-center gap-4 text-left transition-all ${
                        isSelected 
                          ? "border-2 border-[#C9A96E] bg-white shadow-[0_4px_14px_rgba(201,169,110,0.15)]" 
                          : "border border-[rgba(30,27,46,0.08)] bg-white hover:border-[rgba(30,27,46,0.2)]"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "bg-[#C9A96E] text-white" : "bg-[#F5F1EB] text-[#1E1B2E]"
                      }`}>
                        <r.icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-heading text-[18px] text-[#1E1B2E] mb-0.5">{r.name}</h3>
                        <p className="font-sans text-[13px] text-[#8E8E93]">{r.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button 
                type="button" onClick={() => setStep("details")}
                disabled={!role}
                whileHover={role ? { scale: 1.01 } : {}}
                whileTap={role ? { scale: 0.98 } : {}}
                className={`w-full h-[48px] rounded-xl font-sans text-[16px] font-medium transition-colors ${
                  role ? "bg-[#C9A96E] text-[#1E1B2E]" : "bg-[#F5F1EB] text-[#8E8E93] cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          )}

          {step === "details" && (
            <div 
              key="details"
              className="flex flex-col"
            >
              <div className="text-center mb-6">
                <h2 className="font-heading text-[24px] text-[#1E1B2E] mb-1">Final details</h2>
                <p className="font-sans text-[14px] text-[#8E8E93]">Let's complete your profile.</p>
              </div>

              {error && <div className="p-2 mb-4 bg-red-50 text-red-600 border border-red-200 rounded-lg font-sans text-[13px] text-center">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <Label className="font-sans text-[12px] uppercase tracking-[0.1em] text-[#8E8E93] flex items-center gap-1.5">
                    Pick a Username <span className="normal-case tracking-normal text-[#C9A96E] ml-1">(used in chat)</span>
                  </Label>
                  <div className="relative">
                    <AtSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
                    <Input
                      type="text"
                      placeholder="e.g. john_doe99"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      className="pl-9 pr-10 h-[48px] bg-white border border-[rgba(30,27,46,0.08)] rounded-xl font-sans text-[15px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus-visible:ring-0 focus-visible:border-[#C9A96E] focus-visible:shadow-[0_0_0_3px_rgba(201,169,110,0.15)] transition-all"
                      maxLength={20}
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameStatus === "checking" && <Loader2 size={16} className="animate-spin text-[#8E8E93]" />}
                      {usernameStatus === "available" && <CheckCircle2 size={16} className="text-[#C9A96E]" />}
                      {usernameStatus === "taken" && <XCircle size={16} className="text-red-500" />}
                      {usernameStatus === "invalid" && <XCircle size={16} className="text-orange-400" />}
                    </div>
                  </div>
                  <div className="flex gap-4 pt-1">
                    <p className={`text-[10px] uppercase tracking-[0.05em] font-bold ${username.length >= 3 ? "text-[#C9A96E]" : "text-[#8E8E93] opacity-50"}`}>• 3-20 chars</p>
                    <p className={`text-[10px] uppercase tracking-[0.05em] font-bold ${/^[a-z0-9_]*$/.test(username) && username ? "text-[#C9A96E]" : "text-[#8E8E93] opacity-50"}`}>• a-z, 0-9, _</p>
                    {usernameStatus === "taken" && <p className="text-[10px] uppercase tracking-[0.05em] font-bold text-red-500">• Taken!</p>}
                  </div>
                </div>

                {role === "parent" && (
                  <div className="space-y-1 pt-2">
                    <Label className="font-sans text-[12px] uppercase tracking-[0.1em] text-[#8E8E93] flex items-center gap-1.5">
                      <Baby size={14} /> Link Your Child's Account
                    </Label>
                    <Input
                      type="email"
                      placeholder="Enter your child's Gmail"
                      value={childEmail}
                      onChange={(e) => setChildEmail(e.target.value)}
                      className="h-[48px] bg-white border border-[rgba(30,27,46,0.08)] rounded-xl font-sans text-[15px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus-visible:ring-0 focus-visible:border-[#C9A96E] focus-visible:shadow-[0_0_0_3px_rgba(201,169,110,0.15)] transition-all px-4"
                      required
                    />
                    <p className="text-[11px] text-[#8E8E93] mt-1">Your child must already have a student account on Skill Sphere.</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="ghost" type="button" onClick={() => setStep("role")} className="text-[#8E8E93] hover:text-[#1E1B2E]">Back</Button>
                  <button 
                    type="submit" disabled={loading || usernameStatus === "taken" || usernameStatus === "invalid"}
                    className="flex-1 h-[48px] bg-[#C9A96E] text-[#1E1B2E] rounded-xl font-sans text-[16px] font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="mr-2 animate-spin" size={16} /> : null}
                    Complete Setup
                  </button>
                </div>
              </form>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
