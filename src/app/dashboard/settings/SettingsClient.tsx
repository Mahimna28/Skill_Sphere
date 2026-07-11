"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Check,
  Trash2,
  Bell,
  Mail,
  BookOpen,
  MessageCircle,
  Award,
  Users,
  Megaphone,
  Save,
  Loader2,
  Shield,
  Key,
  Globe,
  AlertCircle,
  EyeOff,
  Lock,
  Info
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NotificationPrefs {
  inApp: boolean;
  email: boolean;
  courseUpdates: boolean;
  mentions: boolean;
  streaks: boolean;
  institutions: boolean;
  announcements: boolean;
}

interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  image: string | null;
  role: string;
  hasPassword: boolean;
  googleConnected: boolean;
  githubConnected: boolean;
  notificationPrefs: NotificationPrefs;
  bio?: string;
  skills?: string;
  learningGoal?: string;
  degree?: string;
  specialization?: string;
  expertise?: string;
  experienceYears?: number;
  qualification?: string;
  parentNotes?: string;
  isProfilePublic?: boolean;
  hideFromLeaderboard?: boolean;
}

interface SettingsClientProps {
  initialUser: UserData;
}

export default function SettingsClient({ initialUser }: SettingsClientProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserData>(initialUser);
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "connected">("profile");

  // Section 1 - Profile Form
  const [name, setName] = useState(initialUser.name);
  const [username, setUsername] = useState(initialUser.username);
  const [bio, setBio] = useState(initialUser.bio || "");
  const [skills, setSkills] = useState(initialUser.skills || "");
  const [learningGoal, setLearningGoal] = useState(initialUser.learningGoal || "");
  const [degree, setDegree] = useState(initialUser.degree || "B.Tech");
  const [specialization, setSpecialization] = useState(initialUser.specialization || "");
  const [expertise, setExpertise] = useState(initialUser.expertise || "");
  const [experienceYears, setExperienceYears] = useState(initialUser.experienceYears || 0);
  const [qualification, setQualification] = useState(initialUser.qualification || "");
  const [parentNotes, setParentNotes] = useState(initialUser.parentNotes || "");
  const [childEmail, setChildEmail] = useState("");
  const [isProfilePublic, setIsProfilePublic] = useState(initialUser.isProfilePublic ?? true);
  const [hideFromLeaderboard, setHideFromLeaderboard] = useState(initialUser.hideFromLeaderboard ?? false);

  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Section 2 - Account Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Section 3 - Notifications
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(
    initialUser.notificationPrefs
  );

  // Section 4 - Connected Accounts
  const [googleConnected, setGoogleConnected] = useState(initialUser.googleConnected);

  // Overall Save State
  const [saving, setSaving] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Debounced auto-save for notification toggle
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const handleToggleNotification = (key: keyof NotificationPrefs) => {
    const updated = { ...notificationPrefs, [key]: !notificationPrefs[key] };
    setNotificationPrefs(updated);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        await fetch("/api/user/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationPrefs: updated }),
        });
        showToast("Notification preferences updated", "success");
      } catch (err) {
        console.error("Failed to save notification prefs", err);
      }
    }, 800);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setAvatarLoading(true);
    try {
      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUser((prev) => ({ ...prev, image: data.url }));
        showToast("Profile photo updated!", "success");
      } else {
        showToast(data.message || "Failed to update profile photo", "error");
      }
    } catch (err) {
      showToast("Error uploading profile photo", "error");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      showToast("Please enter a new password", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Password updated successfully!", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setUser((prev) => ({ ...prev, hasPassword: true }));
      } else {
        showToast(data.message || "Failed to update password", "error");
      }
    } catch (err) {
      showToast("An error occurred while updating password", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/user/account", { method: "DELETE" });
      if (res.ok) {
        showToast("Account deleted successfully", "success");
        router.push("/");
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to delete account", "error");
        setDeleteLoading(false);
      }
    } catch (err) {
      showToast("An error occurred while deleting account", "error");
      setDeleteLoading(false);
    }
  };

  const handleToggleConnectedAccount = async (provider: "google", connect: boolean) => {
    try {
      const payload: any = {};
      if (provider === "google") {
        if (connect) payload.connectGoogle = true;
        else payload.disconnectGoogle = true;
      }

      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        if (provider === "google") setGoogleConnected(connect);
        showToast(`Google account ${connect ? "connected" : "disconnected"}!`, "success");
      } else {
        showToast(data.message || "Failed to update account connection", "error");
      }
    } catch (err) {
      showToast("Error updating connected account", "error");
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          notificationPrefs,
          bio,
          skills,
          learningGoal,
          degree,
          specialization,
          expertise,
          experienceYears,
          qualification,
          parentNotes,
          isProfilePublic,
          hideFromLeaderboard,
          childEmail
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setChildEmail("");
        showToast("Settings saved successfully!", "success");
      } else {
        showToast(data.message || "Failed to save settings", "error");
      }
    } catch (err) {
      showToast("An error occurred while saving settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isSuperAdmin = user.role === "superadmin" || user.role === "admin";

  const notificationItems = [
    { key: "inApp" as const, label: "In-App Notifications", desc: "Receive notifications within the platform", icon: Bell },
    { key: "email" as const, label: "Email Notifications", desc: "Receive email updates about your activity", icon: Mail },
    { key: "courseUpdates" as const, label: "Course Updates", desc: "New lessons, assignments, and announcements", icon: BookOpen },
    { key: "mentions" as const, label: "Community Mentions", desc: "When someone mentions you in Q&A or chat", icon: MessageCircle },
    ...(user.role === "student" ? [{ key: "streaks" as const, label: "Streak Reminders", desc: "Daily reminders to maintain your learning streak", icon: Award }] : []),
    { key: "institutions" as const, label: "Institution Updates", desc: "Updates from your institution or teacher", icon: Users },
    { key: "announcements" as const, label: "Platform Announcements", desc: "Important updates from Skill Sphere", icon: Megaphone },
  ];

  return (
    <div className="bg-[#F5F1EB] min-h-screen -m-4 md:-m-8 pb-20 font-sans relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed bottom-8 right-8 z-50 px-5 py-3.5 rounded-xl border flex items-center gap-3 text-sm font-medium shadow-lg ${
              toast.type === "success"
                ? "bg-white text-[#1E1B2E] border-[rgba(34,197,94,0.3)]"
                : "bg-white text-[#DC2626] border-[rgba(220,38,38,0.3)]"
            }`}
          >
            {toast.type === "success" ? (
              <div className="w-6 h-6 rounded-full bg-[rgba(34,197,94,0.12)] flex items-center justify-center text-[#22C55E] shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-[rgba(220,38,38,0.12)] flex items-center justify-center text-[#DC2626] shrink-0">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pt-8 px-4 sm:px-8 md:px-12 max-w-5xl mx-auto"
      >
        <h1 className="font-heading text-[28px] font-bold text-[#1E1B2E] tracking-tight">Settings</h1>
        <p className="font-sans text-sm text-[#8E8E93] mt-1">
          Manage your account preferences and personal information.
        </p>
      </motion.div>

      {/* Section Navigation Tabs */}
      <div className="pt-6 px-4 sm:px-8 md:px-12 max-w-5xl mx-auto border-b border-[rgba(30,27,46,0.08)] flex gap-4 overflow-x-auto no-scrollbar">
        {[
          { id: "profile" as const, label: "Profile" },
          { id: "security" as const, label: "Account Security" },
          { id: "notifications" as const, label: "Notifications" },
          { id: "connected" as const, label: "Connected Accounts" },
        ].map((tab, idx) => (
          <motion.button
            key={tab.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2.5 px-3 text-sm font-sans whitespace-nowrap transition-colors cursor-pointer border-b-2 font-medium ${
              activeTab === tab.id
                ? "border-[#C9A96E] text-[#1E1B2E] font-semibold"
                : "border-transparent text-[#8E8E93] hover:text-[#1E1B2E]"
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 md:px-12 mt-6">
        <AnimatePresence mode="wait">
          {/* SECTION 1 — PROFILE */}
          {activeTab === "profile" && (
            <motion.section
              key="profile"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-[rgba(30,27,46,0.06)] space-y-8"
            >
              {/* Avatar Section */}
              <div>
                <span className="block text-xs font-sans text-[#8E8E93] mb-3 font-medium">
                  Profile Photo
                </span>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border border-[rgba(30,27,46,0.08)] bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-[#C9A96E] font-heading text-[28px] font-semibold relative">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      initials
                    )}
                    {avatarLoading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={avatarLoading}
                      className="border border-[#1E1B2E] text-[#1E1B2E] hover:bg-[#1E1B2E] hover:text-white h-10 rounded-xl px-5 text-[13px] font-medium font-sans transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Change Profile Photo</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-[rgba(30,27,46,0.06)]" />

              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-sans text-[#8E8E93] mb-2 font-medium">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-[rgba(30,27,46,0.15)] rounded-xl h-11 px-4 text-sm font-sans text-[#1E1B2E] placeholder-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[rgba(201,169,110,0.15)] transition-all"
                    placeholder="Enter your display name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-[#8E8E93] mb-2 font-medium">
                    Unique Username (@)
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase())}
                    className="w-full bg-white border border-[rgba(30,27,46,0.15)] rounded-xl h-11 px-4 text-sm font-sans text-[#1E1B2E] placeholder-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[rgba(201,169,110,0.15)] transition-all"
                    placeholder="e.g. alex_dev"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-sans text-[#8E8E93] mb-2 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-[rgba(245,241,235,0.6)] border border-[rgba(30,27,46,0.08)] rounded-xl h-11 px-4 text-sm font-sans text-[#8E8E93] cursor-not-allowed"
                  />
                </div>

                {user.role !== "parent" && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-sans text-[#8E8E93] mb-2 font-medium">
                        Bio / Intro
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full bg-white border border-[rgba(30,27,46,0.15)] rounded-xl p-3.5 text-sm font-sans text-[#1E1B2E] placeholder-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[rgba(201,169,110,0.15)] transition-all min-h-[90px] resize-none"
                        placeholder="Tell the community about yourself..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-sans text-[#8E8E93] mb-2 font-medium">
                        Skills (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="w-full bg-white border border-[rgba(30,27,46,0.15)] rounded-xl h-11 px-4 text-sm font-sans text-[#1E1B2E] placeholder-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[rgba(201,169,110,0.15)] transition-all"
                        placeholder="Python, React, Machine Learning"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Role Specific Fields */}
              {user.role === "student" && (
                <>
                  <div className="h-px bg-[rgba(30,27,46,0.06)]" />
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-[#1E1B2E]">Academic Roadmap</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-sans text-[#8E8E93] mb-2 font-medium">
                          6-Month Learning Goal
                        </label>
                        <input
                          type="text"
                          value={learningGoal}
                          onChange={(e) => setLearningGoal(e.target.value)}
                          className="w-full bg-white border border-[rgba(30,27,46,0.15)] rounded-xl h-11 px-4 text-sm font-sans text-[#1E1B2E] placeholder-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[rgba(201,169,110,0.15)] transition-all"
                          placeholder="e.g. Become AI Engineer & Master Deep Learning"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans text-[#8E8E93] mb-2 font-medium">
                          Current Degree
                        </label>
                        <select
                          value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                          className="w-full bg-white border border-[rgba(30,27,46,0.15)] rounded-xl h-11 px-3.5 text-sm font-sans text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[rgba(201,169,110,0.15)] transition-all"
                        >
                          <option value="">Select Degree</option>
                          <option>High School</option>
                          <option>Diploma</option>
                          <option>B.Tech</option>
                          <option>B.Sc</option>
                          <option>B.A</option>
                          <option>B.Com</option>
                          <option>BCA</option>
                          <option>B.Ed</option>
                          <option>M.Tech</option>
                          <option>M.Sc</option>
                          <option>M.A</option>
                          <option>MBA</option>
                          <option>MCA</option>
                          <option>PhD</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-sans text-[#8E8E93] mb-2 font-medium">
                          Specialization / Branch
                        </label>
                        <select
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          className="w-full bg-white border border-[rgba(30,27,46,0.15)] rounded-xl h-11 px-3.5 text-sm font-sans text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[rgba(201,169,110,0.15)] transition-all"
                        >
                          <option value="">Select Specialization</option>
                          {["B.Tech", "M.Tech", "Diploma"].includes(degree) && (
                            <>
                              <option>Computer Science (CSE)</option>
                              <option>Mechanical (ME)</option>
                              <option>Civil (CE)</option>
                              <option>Electrical (EE)</option>
                              <option>Electronics (ECE)</option>
                              <option>Chemical</option>
                              <option>Information Technology (IT)</option>
                            </>
                          )}
                          {["B.Sc", "M.Sc", "PhD"].includes(degree) && (
                            <>
                              <option>Physics</option>
                              <option>Chemistry</option>
                              <option>Mathematics</option>
                              <option>Biology</option>
                              <option>Computer Science</option>
                              <option>Biotechnology</option>
                            </>
                          )}
                          {["B.Com", "MBA", "M.A", "B.A"].includes(degree) && (
                            <>
                              <option>Finance</option>
                              <option>Marketing</option>
                              <option>Economics</option>
                              <option>Business Analytics</option>
                              <option>Human Resources</option>
                              <option>Accounting</option>
                            </>
                          )}
                          {["BCA", "MCA"].includes(degree) && (
                            <>
                              <option>Software Development</option>
                              <option>Data Science</option>
                              <option>Cyber Security</option>
                              <option>Cloud Computing</option>
                              <option>AI & ML</option>
                            </>
                          )}
                          <option>General / Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {user.role === "teacher" && (
                <>
                  <div className="h-px bg-[rgba(30,27,46,0.06)]" />
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-[#1E1B2E]">Teaching Credentials</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-sans text-[#8E8E93] mb-2 font-medium">
                          Primary Expertise
                        </label>
                        <input
                          type="text"
                          value={expertise}
                          onChange={(e) => setExpertise(e.target.value)}
                          className="w-full bg-white border border-[rgba(30,27,46,0.15)] rounded-xl h-11 px-4 text-sm font-sans text-[#1E1B2E] placeholder-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[rgba(201,169,110,0.15)] transition-all"
                          placeholder="Web Dev, AI, Data Science"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans text-[#8E8E93] mb-2 font-medium">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                          className="w-full bg-white border border-[rgba(30,27,46,0.15)] rounded-xl h-11 px-4 text-sm font-sans text-[#1E1B2E] focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[rgba(201,169,110,0.15)] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans text-[#8E8E93] mb-2 font-medium">
                          Top Qualification
                        </label>
                        <input
                          type="text"
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          className="w-full bg-white border border-[rgba(30,27,46,0.15)] rounded-xl h-11 px-4 text-sm font-sans text-[#1E1B2E] placeholder-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[rgba(201,169,110,0.15)] transition-all"
                          placeholder="PhD in CS, M.Tech, etc."
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {user.role === "parent" && (
                <>
                  <div className="h-px bg-[rgba(30,27,46,0.06)]" />
                  <div>
                    <label className="block text-xs font-sans text-[#8E8E93] mb-2 font-medium">
                      Parenting Notes & Focus
                    </label>
                    <textarea
                      value={parentNotes}
                      onChange={(e) => setParentNotes(e.target.value)}
                      className="w-full bg-white border border-[rgba(30,27,46,0.15)] rounded-xl p-3.5 text-sm font-sans text-[#1E1B2E] placeholder-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[rgba(201,169,110,0.15)] transition-all min-h-[90px] resize-none"
                      placeholder="Notes on child learning progress and focus areas..."
                    />
                  </div>
                  <div className="h-px bg-[rgba(30,27,46,0.06)]" />
                  <div>
                    <label className="block text-xs font-sans text-[#8E8E93] mb-2 font-medium">
                      Link New Child (Email)
                    </label>
                    <input
                      type="text"
                      value={childEmail}
                      onChange={(e) => setChildEmail(e.target.value)}
                      className="w-full bg-white border border-[rgba(30,27,46,0.15)] rounded-xl h-11 px-4 text-sm font-sans text-[#1E1B2E] placeholder-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[rgba(201,169,110,0.15)] transition-all"
                      placeholder="Enter child's Gmail to link them (comma-separated for multiple)"
                    />
                    <p className="text-[11px] text-[#8E8E93] mt-1">
                      Enter the Gmail of an existing Skill Sphere student to add them to your dashboard. Save settings to apply.
                    </p>
                  </div>
                </>
              )}

              <div className="h-px bg-[rgba(30,27,46,0.06)]" />

              {/* Profile Privacy Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-[#1E1B2E] mb-1">Profile Privacy</h4>
                {["student", "parent"].includes(user.role) ? (
                  <div className="flex items-center justify-between p-4 border border-[rgba(30,27,46,0.1)] rounded-xl bg-[rgba(245,241,235,0.3)]">
                    <div className="flex items-center gap-3">
                      {isProfilePublic ? <Globe className="w-5 h-5 text-[#22C55E]" /> : <EyeOff className="w-5 h-5 text-[#F97316]" />}
                      <div>
                        <p className="text-sm font-medium text-[#1E1B2E]">{isProfilePublic ? "Public Profile" : "Private Profile"}</p>
                        <p className="text-xs text-[#8E8E93] mt-0.5">
                          {isProfilePublic
                            ? "Anyone can send you direct messages without approval."
                            : "Users must send a chat request that you approve before messaging you."}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsProfilePublic(!isProfilePublic)}
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer focus:outline-none ${
                        isProfilePublic ? "bg-[#22C55E]" : "bg-[#8E8E93]"
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                        isProfilePublic ? "left-6.5" : "left-0.5"
                      }`} />
                    </button>
                  </div>
                ) : (
                  <div className="p-4 border border-[rgba(249,115,22,0.3)] rounded-xl bg-[rgba(249,115,22,0.08)] flex items-center gap-3">
                    <Lock className="w-5 h-5 text-[#F97316] shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#1E1B2E]">Always Private</p>
                      <p className="text-xs text-[#1E1B2E]/70 mt-0.5">
                        As a {user.role}, your profile is permanently private. Users must send a chat request before messaging you.
                      </p>
                    </div>
                  </div>
                )}

                {/* Hide from Leaderboard / Userboard Toggle */}
                {user.role === "student" && (
                  <div className="flex items-center justify-between p-4 border border-[rgba(30,27,46,0.1)] rounded-xl bg-[rgba(245,241,235,0.3)]">
                    <div className="flex items-center gap-3">
                      {hideFromLeaderboard ? <EyeOff className="w-5 h-5 text-[#F97316]" /> : <Award className="w-5 h-5 text-[#22C55E]" />}
                      <div>
                        <p className="text-sm font-medium text-[#1E1B2E]">{hideFromLeaderboard ? "Hidden from Leaderboard / Userboard" : "Visible on Leaderboard / Userboard"}</p>
                        <p className="text-xs text-[#8E8E93] mt-0.5">
                          {hideFromLeaderboard
                            ? "Your profile, points, and ranking are hidden from public leaderboards and userboards."
                            : "Your profile, points, and ranking are visible on public leaderboards and userboards."}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHideFromLeaderboard(!hideFromLeaderboard)}
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer focus:outline-none ${
                        hideFromLeaderboard ? "bg-[#F97316]" : "bg-[#8E8E93]"
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                        hideFromLeaderboard ? "left-6.5" : "left-0.5"
                      }`} />
                    </button>
                  </div>
                )}
              </div>

              {/* Save Button for Profile Section */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={saving}
                  className="bg-[#C9A96E] hover:bg-[#b89758] text-[#1E1B2E] h-11 rounded-xl px-8 text-sm font-medium font-sans transition-all hover:scale-[1.01] flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#1E1B2E]" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </motion.section>
          )}

          {/* SECTION 2 — ACCOUNT SECURITY */}
          {activeTab === "security" && (
            <motion.section
              key="security"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-[rgba(30,27,46,0.06)] space-y-8"
            >
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <span className="block text-xs font-sans text-[#8E8E93] font-medium">
                  Change Password
                </span>

                <div className="space-y-4 max-w-md">
                  {user.hasPassword && (
                    <div>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-white border border-[rgba(30,27,46,0.15)] rounded-xl h-11 px-4 text-sm font-sans text-[#1E1B2E] placeholder-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[rgba(201,169,110,0.15)] transition-all"
                      />
                    </div>
                  )}
                  <div>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white border border-[rgba(30,27,46,0.15)] rounded-xl h-11 px-4 text-sm font-sans text-[#1E1B2E] placeholder-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[rgba(201,169,110,0.15)] transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white border border-[rgba(30,27,46,0.15)] rounded-xl h-11 px-4 text-sm font-sans text-[#1E1B2E] placeholder-[#8E8E93] focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[rgba(201,169,110,0.15)] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="bg-[#1E1B2E] text-white h-11 rounded-xl px-7 text-[13px] font-medium font-sans hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 shadow-sm"
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <span>Update Password</span>
                    )}
                  </button>
                </div>
              </form>

              <div className="h-px bg-[rgba(30,27,46,0.06)]" />

              {/* Delete/Deactivate Account Section */}
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-[#DC2626] font-sans">
                  <Trash2 className="w-[18px] h-[18px] text-[#DC2626]" />
                  <span>Delete Account</span>
                </div>
                <p className="text-[13px] text-[#8E8E93] leading-[1.6] mt-2 font-sans max-w-xl">
                  This action is permanent and cannot be undone. All your data, courses, and progress will be permanently removed.
                </p>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white h-11 rounded-xl px-6 text-[13px] font-medium font-sans hover:scale-[1.01] transition-all flex items-center gap-2 mt-4 cursor-pointer shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Account</span>
                </button>
              </div>

              {/* Super Admin Only Settings */}
              {isSuperAdmin && (
                <>
                  <div className="h-px bg-[rgba(30,27,46,0.06)]" />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-[#C9A96E]" />
                      <span className="text-xs font-sans text-[#1E1B2E] font-bold">
                        Super Admin Controls
                      </span>
                    </div>
                    <p className="text-[13px] text-[#8E8E93] font-sans mb-4">
                      Additional system-wide administration and governance controls.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/dashboard/admin/system"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[rgba(30,27,46,0.12)] bg-[#F5F1EB]/40 text-[#1E1B2E] text-xs font-medium hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.08)] transition-all"
                      >
                        <Users className="w-3.5 h-3.5 text-[#C9A96E]" />
                        <span>User Management</span>
                      </Link>
                      <Link
                        href="/dashboard/admin/system"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[rgba(30,27,46,0.12)] bg-[#F5F1EB]/40 text-[#1E1B2E] text-xs font-medium hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.08)] transition-all"
                      >
                        <Shield className="w-3.5 h-3.5 text-[#C9A96E]" />
                        <span>System Settings</span>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </motion.section>
          )}

          {/* SECTION 3 — NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <motion.section
              key="notifications"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-[rgba(30,27,46,0.06)]"
            >
              <div className="mb-4">
                <h3 className="font-heading text-xl font-bold text-[#1E1B2E]">Notifications</h3>
                <p className="font-sans text-[13px] text-[#8E8E93] mt-1">
                  Choose what notifications you want to receive.
                </p>
              </div>
              <div className="h-px bg-[rgba(30,27,46,0.06)] my-4" />

              <div className="divide-y divide-[rgba(30,27,46,0.04)]">
                {notificationItems.map((item) => {
                  const Icon = item.icon;
                  const isOn = notificationPrefs[item.key];
                  return (
                    <div key={item.key} className="flex items-center justify-between py-3.5">
                      <div className="flex items-start gap-3 pr-4">
                        <Icon className="w-[18px] h-[18px] text-[#8E8E93] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-[#1E1B2E] font-sans">{item.label}</p>
                          <p className="text-xs text-[#8E8E93] mt-0.5 font-sans">{item.desc}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleNotification(item.key)}
                        className={`w-[44px] h-[26px] rounded-[13px] p-0.5 relative transition-colors duration-250 ease-in-out cursor-pointer shrink-0 focus:outline-none ${
                          isOn ? "bg-[#C9A96E]" : "bg-[#8E8E93]"
                        }`}
                        aria-pressed={isOn}
                        aria-label={item.label}
                      >
                        <div
                          className={`w-[20px] h-[20px] bg-white rounded-full shadow-sm transition-transform duration-250 ease-in-out ${
                            isOn ? "translate-x-[18px]" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* SECTION 4 — CONNECTED ACCOUNTS */}
          {activeTab === "connected" && (
            <motion.section
              key="connected"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-[rgba(30,27,46,0.06)]"
            >
              <div className="mb-4">
                <h3 className="font-heading text-xl font-bold text-[#1E1B2E]">Connected Accounts</h3>
                <p className="font-sans text-[13px] text-[#8E8E93] mt-1">
                  Manage third-party accounts linked to your Skill Sphere profile.
                </p>
              </div>
              <div className="h-px bg-[rgba(30,27,46,0.06)] my-4" />

              <div className="divide-y divide-[rgba(30,27,46,0.04)]">
                {/* Google */}
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-[#EA4335]/10 flex items-center justify-center text-[#EA4335] shrink-0 font-bold text-xs">
                      G
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1E1B2E] font-sans">Google</p>
                      <p className="text-xs text-[#8E8E93] font-sans">
                        {googleConnected ? user.email : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {googleConnected ? (
                      <>
                        <span className="inline-flex items-center gap-1.5 bg-[rgba(34,197,94,0.08)] text-[#22C55E] text-[11px] font-medium px-3 py-1 rounded-full font-sans border border-[rgba(34,197,94,0.15)]">
                          <Check className="w-3 h-3" />
                          <span>Connected</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleConnectedAccount("google", false)}
                          className="border border-[#1E1B2E] text-[#1E1B2E] hover:bg-[#1E1B2E] hover:text-white h-8 rounded-lg px-3.5 text-xs font-medium font-sans transition-all ml-2 cursor-pointer"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleConnectedAccount("google", true)}
                        className="bg-[#1E1B2E] hover:bg-[#1E1B2E]/90 text-white h-8 rounded-lg px-3.5 text-xs font-medium font-sans transition-all hover:scale-[1.02] cursor-pointer"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>

                {/* Email/Password */}
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3.5">
                    <Key className="w-6 h-6 text-[#C9A96E] shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#1E1B2E] font-sans">Email / Password</p>
                      <p className="text-xs text-[#8E8E93] font-sans">{user.email}</p>
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 bg-[rgba(34,197,94,0.08)] text-[#22C55E] text-[11px] font-medium px-3 py-1 rounded-full font-sans border border-[rgba(34,197,94,0.15)]">
                      <Check className="w-3 h-3" />
                      <span>Connected</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal for Delete Account */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[rgba(30,27,46,0.5)] backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-[20px] max-w-[440px] w-full p-6 shadow-2xl border border-[rgba(30,27,46,0.08)]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-heading text-[22px] font-bold text-[#1E1B2E] mb-2">Are you sure?</h3>
              <p className="text-sm text-[#8E8E93] font-sans mb-6 leading-relaxed">
                This action is permanent. All your data will be deleted and cannot be recovered.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                  className="border border-[#1E1B2E] text-[#1E1B2E] hover:bg-[#1E1B2E] hover:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Account</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
