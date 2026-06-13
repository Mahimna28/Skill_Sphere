"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, ShieldCheck, GraduationCap, School, Users, Baby, Eye, EyeOff } from "lucide-react";

const roles = [
  { id: "student", name: "Student", icon: GraduationCap, color: "bg-[#34D399]" },
  { id: "teacher", name: "Teacher", icon: School, color: "bg-[#4F7DF3]" },
  { id: "parent", name: "Parent", icon: Users, color: "bg-[#F9A8D4]" },
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
  const [step, setStep] = useState<"details" | "otp">("details");

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

    const passError = validatePassword(formData.password);
    if (passError) {
      setError(passError);
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

      // 1. Send OTP to verify email before creation
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

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-24 bg-white border-r-0 lg:border-r-4 border-black relative py-12">
        <Link href="/" className="absolute top-6 left-6 text-base font-black">SKILL SPHERE</Link>
        <div className="max-w-md w-full mx-auto mt-8">
          {step === "details" ? (
            <>
              <h2 className="text-4xl font-black mb-2">Join Skill Sphere</h2>
              <p className="text-muted-foreground mb-8 font-medium">Create your account and start your journey.</p>

              {error && <div className="p-3 mb-6 bg-red-100 border-2 border-red-500 rounded-lg text-red-700 font-bold animate-pulse">{error}</div>}

              {/* ── Google Sign Up ── */}
              <Button
                type="button"
                onClick={handleGoogleSignup}
                disabled={googleLoading}
                className="w-full h-12 mb-6 bg-white text-black border-4 border-black font-black text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                {googleLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                Sign up with Google
              </Button>

              {/* ── Divider ── */}
              <div className="relative flex items-center gap-3 mb-6">
                <div className="flex-1 h-0.5 bg-black/10" />
                <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">or</span>
                <div className="flex-1 h-0.5 bg-black/10" />
              </div>

              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-bold">Full Name</Label>
                  <Input 
                    required className="neo-brutalism-static h-11" placeholder="John Doe"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Gmail Address</Label>
                  <Input 
                    type="email" required className="neo-brutalism-static h-11" placeholder="john@gmail.com"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Password</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} required className="neo-brutalism-static h-11 pr-10" placeholder="••••••••"
                      value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-black"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 px-1">
                    <p className={`text-[10px] font-bold ${formData.password.length >= 8 ? "text-green-600" : "text-muted-foreground opacity-50"}`}>• 8+ characters</p>
                    <p className={`text-[10px] font-bold ${/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? "text-green-600" : "text-muted-foreground opacity-50"}`}>• Upper & Lowercase</p>
                    <p className={`text-[10px] font-bold ${/[0-9]/.test(formData.password) ? "text-green-600" : "text-muted-foreground opacity-50"}`}>• One number</p>
                    <p className={`text-[10px] font-bold ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? "text-green-600" : "text-muted-foreground opacity-50"}`}>• Special character</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="font-bold">Join as a:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map(role => (
                      <button
                        key={role.id} type="button"
                        onClick={() => setFormData({ ...formData, role: role.id })}
                        className={`p-3 rounded-xl border-2 border-black flex items-center gap-3 transition-all ${
                          formData.role === role.id ? `${role.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1` : "bg-white hover:bg-muted"
                        }`}
                      >
                        <role.icon size={18} />
                        <span className="font-bold text-sm">{role.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {formData.role === "parent" && (
                  <div className="space-y-2 p-4 bg-accent/10 border-2 border-black border-dashed rounded-xl animate-in fade-in slide-in-from-top-2">
                    <Label className="font-black text-xs uppercase flex items-center gap-2">
                       <Baby size={14} /> Link to Child's Account
                    </Label>
                    <Input 
                      type="email" required 
                      placeholder="Enter your child's Gmail"
                      className="neo-brutalism-static h-11 bg-white"
                      value={formData.childEmail}
                      onChange={e => setFormData({ ...formData, childEmail: e.target.value })}
                    />
                    <p className="text-[10px] font-bold text-muted-foreground">Your child must already have a student account on Skill Sphere.</p>
                  </div>
                )}

                <Button type="submit" className="w-full h-12 text-lg font-bold neo-brutalism mt-4" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 animate-spin" /> Verifying...</> : "Sign Up & Verify Gmail"}
                </Button>
              </form>
            </>
          ) : (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <button onClick={() => setStep("details")} className="flex items-center gap-2 text-sm font-bold mb-6 hover:text-primary transition-colors">
                <ArrowLeft size={16} /> Edit Details
              </button>
              <h2 className="text-4xl font-black mb-2">Verify Your Email</h2>
              <p className="text-muted-foreground mb-8 font-medium">Enter the code sent to <b>{formData.email}</b> to complete your registration.</p>

              {error && <div className="p-3 mb-6 bg-red-100 border-2 border-red-500 rounded-lg text-red-700 font-bold">{error}</div>}
              {message && <div className="p-3 mb-6 bg-green-100 border-2 border-green-500 rounded-lg text-green-700 font-bold">{message}</div>}

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-bold text-center block">6-Digit Code</Label>
                  <Input 
                    type="text" maxLength={6} required autoFocus
                    className="neo-brutalism-static text-center text-3xl font-black tracking-[0.5em] h-14" 
                    placeholder="000000" value={otpCode} onChange={e => setOtpCode(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-lg font-bold neo-brutalism bg-[#34D399] text-black" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 animate-spin" /> Creating Account...</> : <><ShieldCheck className="mr-2" /> Complete Registration</>}
                </Button>
              </form>
            </div>
          )}

          <p className="mt-8 text-center text-sm font-medium">
            Already have an account? <Link href="/login" className="text-primary hover:underline font-bold">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-col justify-center items-center bg-secondary p-12">
        <div className="max-w-lg text-center">
          <div className="w-full aspect-square bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12 flex items-center justify-center relative">
             <div className="absolute inset-0 bg-[url('https://patterns.dev/img/grid.svg')] opacity-20"></div>
             <div className="bg-primary text-white font-black text-4xl p-6 border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[5deg]">Join the Sphere</div>
          </div>
          <h3 className="text-3xl font-black mb-4">A New Way to Learn</h3>
          <p className="text-lg font-medium text-black/70">Create your account and get instant access to courses, real-time chat, and your own AI study assistant.</p>
        </div>
      </div>
    </div>
  );
}
