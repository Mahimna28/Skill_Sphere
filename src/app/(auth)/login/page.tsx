"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./login.module.css";

const appleEase = [0.4, 0, 0.2, 1];

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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
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

  return (
    <div className={styles.loginPage}>
      
      {/* Background Image with Dark Overlay */}
      <div
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-[rgba(30,27,46,0.75)] z-10 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-[url('/images/hero-workspace.jpg')] bg-cover bg-center blur-[2px] scale-105" />
      </div>

      {/* DECORATIVE FLOATING BLOBS (CENTER AREA) */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      {/* TOP LEFT BACK BUTTON */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="inline-flex items-center gap-2 font-sans text-[13px] text-white hover:text-[#C9A96E] transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      {/* LEFT SIDE - BRAND CONTENT */}
      <div
        className="relative z-20 w-full lg:w-1/2 max-w-[500px] flex flex-col justify-center mt-12 lg:mt-0 mb-6 lg:mb-0"
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
        className={styles.formCard}
      >
        <AnimatePresence mode="wait">
          {step === "credentials" && (
            <div 
              key="credentials"
              className="flex flex-col"
            >
              <h2 className="font-heading text-[24px] text-[#1E1B2E] text-center mb-1">Welcome back</h2>
              <p className="font-sans text-[14px] text-[#8E8E93] text-center mb-8">Enter your credentials to sign in.</p>

              <form 
                onSubmit={handleCredentialsSubmit} 
                animate={error ? { x: [-4, 4, -4, 4, 0] } : {}}
              >
                <div style={{ marginBottom: 16 }}>
                  <label className={styles.formLabel}>Email address</label>
                  <input 
                    type="email" required 
                    className={`${styles.inputField} ${error ? styles.inputFieldError : ''}`} 
                    placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                  />
                  {error && <p className={styles.errorText}>{error}</p>}
                </div>
                
                <div style={{ marginBottom: 24 }}>
                  <div className="flex justify-between items-center mb-1">
                    <label className={styles.formLabel} style={{ marginBottom: 0 }}>Password</label>
                    <Link href="/forgot-password" className="font-sans text-[13px] text-[#8E8E93] hover:text-[#C9A96E] hover:underline transition-colors">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} required 
                      className={`${styles.inputField} ${error ? styles.inputFieldError : ''}`} 
                      style={{ paddingRight: 40 }}
                      placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-[#1E1B2E] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {error && <p className={styles.errorText}>{error}</p>}
                </div>

                <button 
                  type="submit" disabled={loading}
                  className={styles.signInButton}
                >
                  {loading ? <Loader2 className="mr-2 animate-spin" size={16} /> : null}
                  Sign In
                </button>
              </form>

              <div className={styles.divider}>or continue with</div>

              <button
                type="button" onClick={handleGoogleLogin} disabled={googleLoading}
                className={styles.googleButton}
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

              <p className="mt-8 text-center font-sans text-[14px] text-[#8E8E93]">
                Don't have an account? <Link href="/register" className="text-[#C9A96E] hover:text-[#B8956A] hover:underline transition-colors font-medium">Join Free</Link>
              </p>
            </div>
          )}

          {step === "otp" && (
            <div 
              key="otp"
              className="flex flex-col"
            >
              <button onClick={() => setStep("credentials")} className="inline-flex items-center gap-2 font-sans text-[13px] text-[#8E8E93] hover:text-[#C9A96E] transition-colors mb-6 self-start">
                <ArrowLeft size={16} /> Back to Sign In
              </button>
              <h2 className="font-heading text-[28px] text-[#1E1B2E] leading-[0.95] mb-2 text-center">Check Your Email</h2>
              <p className="font-sans text-[14px] text-[#8E8E93] mb-6 text-center">We sent a 6-digit code to <b>{email}</b></p>

              {error && <div className="p-3 mb-5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-sans text-sm text-center">{error}</div>}
              {message && <div className="p-3 mb-5 bg-[#F5F1EB] text-[#C9A96E] border border-[#C9A96E]/30 rounded-xl font-sans text-sm text-center">{message}</div>}

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="font-sans text-[12px] uppercase tracking-[0.05em] text-[#1E1B2E] text-center block mb-2">6-Digit Code</label>
                  <input 
                    type="text" maxLength={6} required autoFocus
                    className={`${styles.inputField} ${styles.otpInput} ${error ? styles.inputFieldError : ''}`}
                    placeholder="000000" value={otpCode} onChange={e => setOtpCode(e.target.value)}
                  />
                </div>
                
                <button 
                  type="submit" disabled={loading}
                  className={`${styles.signInButton} ${styles.completeButton}`}
                >
                  {loading ? <Loader2 className="mr-2 animate-spin" size={18} /> : <ShieldCheck className="mr-2" size={18} />}
                  Complete Login
                </button>
              </form>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1EB]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[rgba(30,27,46,0.1)] border-t-[#C9A96E] rounded-full animate-spin" />
          <p className="font-sans font-medium text-[13px] uppercase tracking-[0.1em] text-[#1E1B2E]">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
