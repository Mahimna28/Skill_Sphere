"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  School,
  Users,
  Baby,
  Loader2,
  CheckCircle2,
  XCircle,
  AtSign,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const roles = [
  { id: "student", name: "Student", icon: GraduationCap, color: "bg-[#34D399]", desc: "I want to learn" },
  { id: "teacher", name: "Teacher", icon: School, color: "bg-[#4F7DF3]", desc: "I want to teach" },
  { id: "parent", name: "Parent", icon: Users, color: "bg-[#F9A8D4]", desc: "I monitor my child" },
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

  // Username availability state
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");

  // Load current user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/google/setup");
        const data = await res.json();
        if (!res.ok) {
          // Not logged in or setup already done
          router.push("/login");
          return;
        }
        if (data.user?.role !== "pending") {
          // Already completed setup — redirect to their dashboard
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

  // Debounced username availability check
  const checkUsername = useCallback(async (value: string) => {
    if (!value) { setUsernameStatus("idle"); return; }
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(value)) { setUsernameStatus("invalid"); return; }
    setUsernameStatus("checking");
    try {
      const res = await fetch("/api/auth/google/setup");
      // We check by attempting a search — for now just validate format
      // The real uniqueness check happens on submit
      // Use the existing username check endpoint
      const checkRes = await fetch(`/api/users/check-username?username=${value}`);
      if (checkRes.ok) {
        const data = await checkRes.json();
        setUsernameStatus(data.available ? "available" : "taken");
      } else {
        setUsernameStatus("available"); // fallback: let server validate
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

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-black border-t-[#4F7DF3] rounded-full animate-spin" />
          <p className="font-black text-lg uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4 py-16">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[url('https://patterns.dev/img/grid.svg')] opacity-[0.04] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
        {/* Header card */}
        <div className="bg-[#4F7DF3] border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 text-white text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles size={32} />
            <h1 className="text-4xl font-black uppercase tracking-tighter">Almost There!</h1>
          </div>
          {user?.image && (
            <div className="w-20 h-20 rounded-full border-4 border-white mx-auto mb-4 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] relative">
              <Image src={user.image} alt="Profile" fill className="object-cover" />
            </div>
          )}
          <p className="text-blue-100 font-bold text-lg">
            Welcome, <span className="text-white">{user?.name?.split(" ")[0]}!</span> <br />
            Google sign-in verified ✓ — Just complete your profile.
          </p>
        </div>

        {/* Setup form */}
        <form onSubmit={handleSubmit} className="bg-white border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">

          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-500 rounded-xl text-red-700 font-bold flex items-center gap-2">
              <XCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Step 1 — Role */}
          <div>
            <Label className="font-black text-sm uppercase tracking-wider block mb-3">
              ① Choose Your Role
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-4 rounded-2xl border-2 border-black flex flex-col items-center gap-2 transition-all duration-150 ${
                      isSelected
                        ? `${r.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1`
                        : "bg-white hover:bg-gray-50 hover:-translate-y-0.5"
                    }`}
                  >
                    <Icon size={28} />
                    <span className="font-black text-sm">{r.name}</span>
                    <span className="text-[10px] font-bold opacity-70">{r.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2 — Username */}
          <div>
            <Label className="font-black text-sm uppercase tracking-wider block mb-3">
              ② Pick a Username
              <span className="normal-case font-medium text-muted-foreground ml-2 text-xs">(used in chat & messages)</span>
            </Label>
            <div className="relative">
              <AtSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="e.g. john_doe99"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                className="pl-9 pr-10 h-12 border-2 border-black font-bold text-base focus-visible:ring-[#4F7DF3]"
                maxLength={20}
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {usernameStatus === "checking" && <Loader2 size={18} className="animate-spin text-muted-foreground" />}
                {usernameStatus === "available" && <CheckCircle2 size={18} className="text-[#34D399]" />}
                {usernameStatus === "taken" && <XCircle size={18} className="text-red-500" />}
                {usernameStatus === "invalid" && <XCircle size={18} className="text-orange-400" />}
              </div>
            </div>
            <div className="mt-2 flex gap-4">
              <p className={`text-[11px] font-bold ${username.length >= 3 ? "text-[#34D399]" : "text-muted-foreground opacity-50"}`}>• 3-20 characters</p>
              <p className={`text-[11px] font-bold ${/^[a-z0-9_]*$/.test(username) && username ? "text-[#34D399]" : "text-muted-foreground opacity-50"}`}>• Lowercase, numbers, _</p>
              {usernameStatus === "taken" && <p className="text-[11px] font-bold text-red-500">• Username taken!</p>}
            </div>
          </div>

          {/* Step 3 — Child email (parent only) */}
          {role === "parent" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 p-5 bg-[#F9A8D4]/10 border-2 border-black border-dashed rounded-2xl space-y-3">
              <Label className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                <Baby size={16} /> ③ Link Your Child's Account
              </Label>
              <Input
                type="email"
                placeholder="Enter your child's Gmail"
                value={childEmail}
                onChange={(e) => setChildEmail(e.target.value)}
                className="h-12 border-2 border-black font-bold bg-white"
                required
              />
              <p className="text-[11px] font-bold text-muted-foreground">
                Your child must already have a student account on Skill Sphere.
              </p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading || usernameStatus === "taken" || usernameStatus === "invalid"}
            className="w-full h-14 text-xl font-black bg-[#4F7DF3] text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase"
          >
            {loading ? (
              <><Loader2 className="mr-2 animate-spin" /> Setting up...</>
            ) : (
              <>Complete Setup <ArrowRight className="ml-2" /></>
            )}
          </Button>

          <p className="text-center text-xs font-bold text-muted-foreground">
            You can change these details anytime from your profile settings.
          </p>
        </form>
      </div>
    </div>
  );
}
