"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Key, Loader2, ShieldCheck, ArrowLeft, Eye, EyeOff } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [step, setStep] = useState<"credentials" | "otp">("credentials");

  // Show error from Google OAuth callback if any
  useEffect(() => {
    const oauthError = searchParams.get("error");
    const errorMessages: Record<string, string> = {
      oauth_cancelled: "Google sign-in was cancelled. Please try again.",
      oauth_failed: "Could not connect to Google. Please try again.",
      no_email: "Google did not provide an email address. Try a different account.",
      server_error: "A server error occurred. Please try again.",
    };
    if (oauthError && errorMessages[oauthError]) {
      setError(errorMessages[oauthError]);
    }
  }, [searchParams]);

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    window.location.href = "/api/auth/google";
  };

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
      <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-24 bg-white border-r-0 lg:border-r-4 border-black relative py-12">
        <Link href="/" className="absolute top-6 left-6 text-base font-black">SKILL SPHERE</Link>
        <div className="max-w-md w-full mx-auto mt-8">
          {step === "credentials" ? (
            <>
              <h2 className="text-4xl font-black mb-2">Welcome Back</h2>
              <p className="text-muted-foreground mb-8 font-medium">Enter your credentials to receive a login code.</p>

              {error && <div className="p-3 mb-6 bg-red-100 border-2 border-red-500 rounded-lg text-red-700 font-bold">{error}</div>}

              {/* ── Google Sign In ── */}
              <Button
                type="button"
                onClick={handleGoogleLogin}
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
                Continue with Google
              </Button>

              {/* ── Divider ── */}
              <div className="relative flex items-center gap-3 mb-6">
                <div className="flex-1 h-0.5 bg-black/10" />
                <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">or</span>
                <div className="flex-1 h-0.5 bg-black/10" />
              </div>

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
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} required className="neo-brutalism-static h-11 pr-10" 
                      placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-black"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-[#4F7DF3] rounded-full animate-spin" />
          <p className="font-black text-sm uppercase">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
