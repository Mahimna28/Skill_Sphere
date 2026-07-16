"use client";

const items = [
  "50,000+ Students",
  "AI-Powered Tutoring",
  "24/7 Support",
  "Role-Based Learning",
  "Global Community",
  "Gamified Progress",
];

export function MarqueeBanner() {
  return (
    <div className="bg-[#1E1B2E] py-6 overflow-hidden border-y border-[rgba(201,169,110,0.2)]">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="mx-8 text-lg md:text-xl font-serif text-[#C9A96E] flex items-center gap-8"
          >
            {item}
            <span className="w-2 h-2 rounded-full bg-[#C9A96E] opacity-50" />
          </span>
        ))}
      </div>
    </div>
  );
}
