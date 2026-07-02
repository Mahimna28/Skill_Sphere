"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, ShieldCheck, GraduationCap, School, Users, Baby, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const appleEase = [0.4, 0, 0.2, 1];

const roles = [
  { id: "student", name: "Student", desc: "Learn at your own pace", icon: GraduationCap },
  { id: "teacher", name: "Teacher", desc: "Create and manage courses", icon: School },
  { id: "parent", name: "Parent", desc: "Monitor your child's progress", icon: Users },
];

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student", childEmail: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [step, setStep] = useState<"account" | "role" | "details" | "otp">("account");

  const handleGoogleSignup = () => {
    setGoogleLoading(true);
    window.location.href = "/api/auth/google";
  };

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pass)) return "Password needs an uppercase letter.";
    if (!/[a-z]/.test(pass)) return "Password needs a lowercase letter.";
    if (!/[0-9]/.test(pass)) return "Password needs a number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return "Password needs a special character.";
    return null;
  };

  const goToRole = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    const passError = validatePassword(formData.password);
    if (passError) {
      setError(passError);
      return;
    }
    setError("");
    setStep("role");
  };

  const goToDetails = () => {
    setError("");
    setStep("details");
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Special validation for Parent
    if (formData.role === "parent" && !formData.childEmail) {
      setError("Child's Gmail is required for the Parent role.");
      setLoading(false);
      return;
    }

    try {
      // Verify child exists if role is parent
      if (formData.role === "parent") {
         const checkRes = await fetch(`/api/auth/register/check-child?email=${formData.childEmail}`);
         const checkData = await checkRes.json();
         if (!checkRes.ok) {
           setError(checkData.message);
           setLoading(false);
           return;
         }
      }

      // Send OTP
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, type: "register" }),
      });

      const data = await res.json();
      if (res.ok) {
        setStep("otp");
        setMessage("Verification code sent to your Gmail!");
      } else {
        setError(data.message || "Failed to send verification code.");
      }
    } catch (err) {
      setError("An error occurred. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, otpCode }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(data.redirect);
      } else {
        setError(data.message || "Verification failed. Check the code.");
      }
    } catch (err) {
      setError("An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const Stepper = () => {
    if (step === "otp") return null;
    const steps = ["account", "role", "details"];
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
          {step === "account" && (
            <div 
              key="account"
              className="flex flex-col"
            >
              <div className="text-center mb-6">
                <h2 className="font-heading text-[24px] text-[#1E1B2E] mb-1">Join Skill Sphere</h2>
                <p className="font-sans text-[14px] text-[#8E8E93]">Create an account to begin your journey.</p>
              </div>

              {error && <div className="p-2 mb-4 bg-red-50 text-red-600 border border-red-200 rounded-lg font-sans text-[13px] text-center">{error}</div>}

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="font-sans text-[12px] uppercase tracking-[0.1em] text-[#8E8E93]">Full Name</Label>
                  <Input 
                    required className="h-[48px] bg-white border border-[rgba(30,27,46,0.08)] rounded-xl font-sans text-[15px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus-visible:ring-0 focus-visible:border-[#C9A96E] focus-visible:shadow-[0_0_0_3px_rgba(201,169,110,0.15)] transition-all px-4" 
                    placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label className="font-sans text-[12px] uppercase tracking-[0.1em] text-[#8E8E93]">Email Address</Label>
                  <Input 
                    type="email" required className="h-[48px] bg-white border border-[rgba(30,27,46,0.08)] rounded-xl font-sans text-[15px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus-visible:ring-0 focus-visible:border-[#C9A96E] focus-visible:shadow-[0_0_0_3px_rgba(201,169,110,0.15)] transition-all px-4" 
                    placeholder="you@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="font-sans text-[12px] uppercase tracking-[0.1em] text-[#8E8E93]">Password</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} required 
                      className="h-[48px] bg-white border border-[rgba(30,27,46,0.08)] rounded-xl font-sans text-[15px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus-visible:ring-0 focus-visible:border-[#C9A96E] focus-visible:shadow-[0_0_0_3px_rgba(201,169,110,0.15)] transition-all px-4 pr-10" 
                      placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-[#1E1B2E] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="button" onClick={goToRole}
                  className="w-full h-[48px] bg-[#C9A96E] text-[#1E1B2E] rounded-xl font-sans text-[16px] font-medium mt-4 flex items-center justify-center"
                >
                  Continue
                </button>
              </div>

              {/* SOCIAL LOGINS */}
              <div className="relative flex items-center gap-3 my-5">
                <div className="flex-1 h-[1px] bg-[rgba(30,27,46,0.08)]" />
                <span className="font-sans text-[12px] text-[#8E8E93]">or continue with</span>
                <div className="flex-1 h-[1px] bg-[rgba(30,27,46,0.08)]" />
              </div>

              <button
                type="button" onClick={handleGoogleSignup} disabled={googleLoading}
                className="w-full h-[44px] bg-white border border-[rgba(30,27,46,0.08)] hover:border-[rgba(30,27,46,0.2)] rounded-xl font-sans text-[14px] text-[#1E1B2E] flex items-center justify-center gap-2 transition-colors"
              >
                {googleLoading ? <Loader2 size={16} className="animate-spin text-[#8E8E93]" /> : (
                  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                Google
              </button>
            </div>
          )}

          {step === "role" && (
            <div 
              key="role"
              className="flex flex-col"
            >
              <div className="text-center mb-6">
                <h2 className="font-heading text-[24px] text-[#1E1B2E] mb-1">Choose your path</h2>
                <p className="font-sans text-[14px] text-[#8E8E93]">How will you use Skill Sphere?</p>
              </div>

              <div className="space-y-3 mb-6">
                {roles.map(role => {
                  const isSelected = formData.role === role.id;
                  return (
                    <button
                      key={role.id} type="button"
                      onClick={() => setFormData({ ...formData, role: role.id })}
                      className={`w-full p-4 rounded-xl flex items-center gap-4 text-left transition-all ${
                        isSelected 
                          ? "border-2 border-[#C9A96E] bg-white shadow-[0_4px_14px_rgba(201,169,110,0.15)]" 
                          : "border border-[rgba(30,27,46,0.08)] bg-white hover:border-[rgba(30,27,46,0.2)]"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "bg-[#C9A96E] text-white" : "bg-[#F5F1EB] text-[#1E1B2E]"
                      }`}>
                        <role.icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-heading text-[18px] text-[#1E1B2E] mb-0.5">{role.name}</h3>
                        <p className="font-sans text-[13px] text-[#8E8E93]">{role.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep("account")} className="text-[#8E8E93] hover:text-[#1E1B2E]">Back</Button>
                <button 
                  type="button" onClick={goToDetails}
                  disabled={!formData.role}
                  whileHover={formData.role ? { scale: 1.01 } : {}}
                  whileTap={formData.role ? { scale: 0.98 } : {}}
                  className={`flex-1 h-[48px] rounded-xl font-sans text-[16px] font-medium transition-colors ${
                    formData.role ? "bg-[#C9A96E] text-[#1E1B2E]" : "bg-[#F5F1EB] text-[#8E8E93] cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </div>
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

              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                {formData.role === "parent" ? (
                  <div className="space-y-1">
                    <Label className="font-sans text-[12px] uppercase tracking-[0.1em] text-[#8E8E93] flex items-center gap-1.5">
                      <Baby size={14} /> Link to Child's Account
                    </Label>
                    <Input 
                      type="email" required 
                      placeholder="Enter your child's Gmail"
                      className="h-[48px] bg-white border border-[rgba(30,27,46,0.08)] rounded-xl font-sans text-[15px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus-visible:ring-0 focus-visible:border-[#C9A96E] focus-visible:shadow-[0_0_0_3px_rgba(201,169,110,0.15)] transition-all px-4"
                      value={formData.childEmail}
                      onChange={e => setFormData({ ...formData, childEmail: e.target.value })}
                    />
                    <p className="text-[11px] text-[#8E8E93] mt-1">Your child must already have a student account on Skill Sphere.</p>
                  </div>
                ) : (
                  <div className="py-6 text-center text-[#8E8E93] font-sans text-[14px]">
                    You are ready to join as a <span className="capitalize font-bold text-[#1E1B2E]">{formData.role}</span>.<br/>Click submit to verify your email.
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="ghost" type="button" onClick={() => setStep("role")} className="text-[#8E8E93] hover:text-[#1E1B2E]">Back</Button>
                  <button 
                    type="submit" disabled={loading}
                    className="flex-1 h-[48px] bg-[#C9A96E] text-[#1E1B2E] rounded-xl font-sans text-[16px] font-medium flex items-center justify-center"
                  >
                    {loading ? <Loader2 className="mr-2 animate-spin" size={16} /> : null}
                    Sign Up & Verify Gmail
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === "otp" && (
            <div 
              key="otp"
              className="flex flex-col"
            >
              <button onClick={() => setStep("details")} className="inline-flex items-center gap-2 font-sans text-[13px] text-[#8E8E93] hover:text-[#C9A96E] transition-colors mb-6 self-start">
                <ArrowLeft size={16} /> Edit Details
              </button>
              <h2 className="font-heading text-[28px] text-[#1E1B2E] leading-[0.95] mb-2 text-center">Verify Your Email</h2>
              <p className="font-sans text-[14px] text-[#8E8E93] mb-6 text-center">Enter the code sent to <b>{formData.email}</b></p>

              {error && <div className="p-3 mb-5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-sans text-sm text-center">{error}</div>}
              {message && <div className="p-3 mb-5 bg-[#F5F1EB] text-[#C9A96E] border border-[#C9A96E]/30 rounded-xl font-sans text-sm text-center">{message}</div>}

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-sans text-[12px] uppercase tracking-[0.05em] text-[#1E1B2E] text-center block">6-Digit Code</Label>
                  <Input 
                    type="text" maxLength={6} required autoFocus
                    className="h-[56px] bg-white border border-[rgba(30,27,46,0.08)] rounded-xl text-center font-heading text-[28px] tracking-[0.2em] text-[#1E1B2E] focus-visible:ring-0 focus-visible:border-[#C9A96E] focus-visible:shadow-[0_0_0_3px_rgba(201,169,110,0.15)] transition-all duration-200" 
                    placeholder="000000" value={otpCode} onChange={e => setOtpCode(e.target.value)}
                  />
                </div>
                
                <button 
                  type="submit" disabled={loading}
                  className="w-full h-[48px] bg-[#1E1B2E] text-white rounded-xl font-sans text-[15px] font-medium flex items-center justify-center shadow-[0_4px_14px_rgba(30,27,46,0.08)]"
                >
                  {loading ? <Loader2 className="mr-2 animate-spin" size={18} /> : <ShieldCheck className="mr-2" size={18} />}
                  Complete Registration
                </button>
              </form>
            </div>
          )}
        </AnimatePresence>

        {step !== "otp" && (
          <p className="mt-8 text-center font-sans text-[14px] text-[#8E8E93]">
            Already have an account? <Link href="/login" className="text-[#C9A96E] hover:underline transition-colors">Sign In</Link>
          </p>
        )}
      </div>

    </div>
  );
}
