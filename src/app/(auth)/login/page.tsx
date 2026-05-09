"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Key, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"credentials" | "otp">("credentials");

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // 1. Verify Credentials
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 2. Send OTP
        const otpRes = await fetch("/api/auth/otp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, type: "login" }),
        });

        if (otpRes.ok) {
          setStep("otp");
          setMessage("Login code sent to your Gmail!");
        } else {
          setError("Credentials correct, but failed to send OTP email.");
        }
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(data.redirect);
      } else {
        setError(data.message || "Invalid or expired code");
      }
    } catch (err) {
      setError("An error occurred during verification.");
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = (role: string) => {
    setEmail(`${role}@demo.com`);
    setPassword("password123");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white border-r-4 border-black relative">
        <Link href="/" className="absolute top-8 left-8 text-xl font-black">SKILL SPHERE</Link>
        <div className="max-w-md w-full mx-auto">
          {step === "credentials" ? (
            <>
              <h2 className="text-4xl font-black mb-2">Welcome Back</h2>
              <p className="text-muted-foreground mb-8 font-medium">Enter your credentials to receive a login code.</p>

              {error && <div className="p-3 mb-6 bg-red-100 border-2 border-red-500 rounded-lg text-red-700 font-bold">{error}</div>}

              <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-bold">Email</Label>
                  <Input 
                    type="email" required className="neo-brutalism-static h-11" 
                    placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Password</Label>
                  <Input 
                    type="password" required className="neo-brutalism-static h-11" 
                    placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Link href="/forgot-password" className="text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors">
                      Forgot Password?
                    </Link>
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 text-lg font-bold neo-brutalism" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 animate-spin" /> Verifying...</> : "Sign In & Send OTP"}
                </Button>
              </form>

              {/* Demo access removed for production readiness */}
            </>
          ) : (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <button onClick={() => setStep("credentials")} className="flex items-center gap-2 text-sm font-bold mb-6 hover:text-primary transition-colors">
                <ArrowLeft size={16} /> Back to Login
              </button>
              <h2 className="text-4xl font-black mb-2">Check Your Email</h2>
              <p className="text-muted-foreground mb-8 font-medium">We sent a 6-digit code to <b>{email}</b></p>

              {error && <div className="p-3 mb-6 bg-red-100 border-2 border-red-500 rounded-lg text-red-700 font-bold">{error}</div>}
              {message && <div className="p-3 mb-6 bg-green-100 border-2 border-green-500 rounded-lg text-green-700 font-bold">{message}</div>}

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-bold text-center block">Verification Code</Label>
                  <Input 
                    type="text" maxLength={6} required autoFocus
                    className="neo-brutalism-static text-center text-3xl font-black tracking-[0.5em] h-14" 
                    placeholder="000000" value={otpCode} onChange={e => setOtpCode(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-lg font-bold neo-brutalism bg-secondary text-black" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 animate-spin" /> Verifying...</> : <><ShieldCheck className="mr-2" /> Complete Login</>}
                </Button>
              </form>
            </div>
          )}

          <p className="mt-8 text-center text-sm font-medium">
            Don't have an account? <Link href="/register" className="text-primary hover:underline font-bold">Sign up</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-col justify-center items-center bg-primary p-12">
        <div className="max-w-lg text-center text-white">
          <div className="w-full aspect-square bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12 flex items-center justify-center relative">
             <div className="absolute inset-0 bg-[url('https://patterns.dev/img/grid.svg')] opacity-20"></div>
             <div className="bg-accent text-black font-black text-4xl p-6 border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-5deg] animate-pulse">2-Step Secure Login</div>
          </div>
          <h3 className="text-3xl font-black mb-4">Highly Secure Platform</h3>
          <p className="text-lg font-medium text-blue-100">Your security is our priority. Every login is verified with a one-time code sent to your Gmail.</p>
        </div>
      </div>
    </div>
  );
}
