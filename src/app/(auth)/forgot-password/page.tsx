"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Key, Loader2, ShieldCheck, ArrowLeft, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStep("otp");
        setMessage("Verification code sent to your Gmail!");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Success! Check your email for the new password.");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.message || "Invalid or expired code");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <div className="max-w-md w-full bg-white border-4 border-black p-8 md:p-12 rounded-[2.5rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-in fade-in zoom-in-95 duration-300">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold mb-8 hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Reset Password</h1>
        <p className="text-muted-foreground font-medium mb-8">
          {step === "email" ? "Enter your email to receive a password reset code." : `We sent a code to ${email}`}
        </p>

        {error && <div className="p-3 mb-6 bg-red-100 border-2 border-red-500 rounded-lg text-red-700 font-bold text-xs uppercase">{error}</div>}
        {message && <div className="p-3 mb-6 bg-[#C9A96E]/10 border-2 border-[#C9A96E] rounded-lg text-[#C9A96E] font-bold text-xs uppercase">{message}</div>}

        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="font-black text-xs uppercase tracking-widest">Gmail Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="email" required className="neo-brutalism-static pl-12 h-12" 
                  placeholder="your-email@gmail.com" value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-14 text-lg font-black neo-brutalism" disabled={loading}>
              {loading ? <Loader2 className="mr-2 animate-spin" /> : <Send className="mr-2" />}
              Send Reset Code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="font-black text-xs uppercase tracking-widest text-center block">6-Digit Code</Label>
              <Input 
                type="text" maxLength={6} required autoFocus
                className="neo-brutalism-static text-center text-3xl font-black tracking-[0.5em] h-16" 
                placeholder="000000" value={otpCode} onChange={e => setOtpCode(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full h-14 text-lg font-black neo-brutalism bg-secondary text-black" disabled={loading}>
              {loading ? <Loader2 className="mr-2 animate-spin" /> : <><ShieldCheck className="mr-2" /> Verify & Send Password</>}
            </Button>
            <p className="text-center text-[10px] font-bold opacity-60">
              Verify your identity to receive a new system-generated password.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
