"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Award, ShieldCheck, Medal, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import "./certificate.css";

export default function CertificateClient({ certificate, course }: { certificate: any; course?: any }) {
  const certRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 1250) {
        setScale((windowWidth - 40) / 1200);
      } else {
        setScale(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formattedDate = new Date(certificate.issueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#1E1B2E",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      const fileName = `certificate-${certificate.user.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const courseName = certificate.title.replace("Certificate of Completion: ", "");

  return (
    <div className="min-h-screen bg-[#0F0D1A] pt-32 pb-12 px-4 flex flex-col items-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>

      {/* Controls */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8 print-hidden relative z-50">
        <Link href="/dashboard/student">
          <Button
            variant="outline"
            className="border-2 border-[#C9A96E]/30 text-[#C9A96E] hover:bg-[#C9A96E]/10 hover:text-[#C9A96E] bg-transparent font-bold uppercase tracking-wider text-xs h-11 px-6 rounded-xl transition-all"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </Button>
        </Link>
        <Button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-extrabold uppercase tracking-wider text-xs h-11 px-8 rounded-xl shadow-[0_4px_20px_rgba(201,169,110,0.3)] transition-all"
        >
          {downloading ? (
            <><Loader2 className="mr-2 animate-spin" size={16} /> Generating PDF...</>
          ) : (
            <><Download className="mr-2" size={16} /> Download PDF</>
          )}
        </Button>
      </div>

      {/* Certificate Container */}
      <div className="w-full flex justify-center pb-12" style={{ height: `${675 * scale + 50}px` }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top center", transition: "transform 0.2s ease" }}>
          <div
            id="certificate-wrapper"
            ref={certRef}
            className="relative shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
            style={{ 
              width: "1200px", 
              height: "675px", 
              backgroundColor: "#1E1B2E", 
              color: "#FFFFFF",
              fontFamily: "'Playfair Display', serif"
            }}
          >
            {/* Ornate Borders */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: "#1E1B2E" }}>
              <div className="absolute inset-[15px] border-[12px] border-double" style={{ borderColor: "#C9A96E" }}></div>
              <div className="absolute inset-[32px] border-[2px]" style={{ borderColor: "#C9A96E", opacity: 0.8 }}></div>
              <div className="absolute inset-[40px] border border-dashed" style={{ borderColor: "#C9A96E", opacity: 0.5 }}></div>
            </div>

            {/* Corner Ornaments */}
            <div className="absolute top-[32px] left-[32px] w-16 h-16 border-t-[4px] border-l-[4px]" style={{ borderColor: "#C9A96E" }}></div>
            <div className="absolute top-[32px] right-[32px] w-16 h-16 border-t-[4px] border-r-[4px]" style={{ borderColor: "#C9A96E" }}></div>
            <div className="absolute bottom-[32px] left-[32px] w-16 h-16 border-b-[4px] border-l-[4px]" style={{ borderColor: "#C9A96E" }}></div>
            <div className="absolute bottom-[32px] right-[32px] w-16 h-16 border-b-[4px] border-r-[4px]" style={{ borderColor: "#C9A96E" }}></div>

            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <Medal size={700} style={{ color: "#C9A96E" }} />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full h-full flex flex-col items-center pt-16 px-20 text-center">
              
              {/* Header */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  <Award size={48} style={{ color: "#C9A96E" }} />
                </div>
                <h2 className="text-[14px] uppercase tracking-[0.4em] mb-2 font-bold" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "sans-serif" }}>
                  Skill Sphere Education
                </h2>
                <h1 className="text-[64px] font-black uppercase tracking-widest drop-shadow-md leading-none" style={{ color: "#C9A96E", fontFamily: "'Cinzel', serif" }}>
                  Certificate
                </h1>
                <h1 className="text-[28px] font-bold uppercase tracking-[0.3em] drop-shadow-md" style={{ color: "#C9A96E", fontFamily: "'Cinzel', serif" }}>
                  Of Completion
                </h1>
              </div>
              
              {/* Divider */}
              <div className="w-48 h-[2px] rounded-full mb-8 opacity-70" style={{ backgroundColor: "#C9A96E" }} />

              <p className="text-[18px] italic tracking-wider mb-6" style={{ color: "rgba(255,255,255,0.8)" }}>
                This is to certify that
              </p>

              {/* Student Name */}
              <h2 className="text-[72px] font-bold drop-shadow-lg leading-none mb-6" style={{ color: "#FFFFFF", fontFamily: "'Great Vibes', cursive" }}>
                {certificate.user.name}
              </h2>

              <p className="text-[16px] uppercase tracking-[0.2em] max-w-3xl leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "sans-serif" }}>
                has successfully completed the comprehensive curriculum and demonstrated exceptional mastery in
              </p>

              {/* Course Name */}
              <h3 className="text-[36px] font-bold uppercase tracking-[0.15em] drop-shadow-md max-w-4xl leading-tight mb-auto" style={{ color: "#C9A96E", fontFamily: "'Cinzel', serif" }}>
                {courseName}
              </h3>

              {/* Footer Section */}
              <div className="w-full flex justify-between items-end pb-12 mt-12 px-8">
                
                {/* Date */}
                <div className="flex flex-col items-center w-[220px]">
                  <span className="text-[18px] font-bold uppercase tracking-widest mb-2" style={{ color: "#FFFFFF", fontFamily: "'Cinzel', serif" }}>
                    {formattedDate}
                  </span>
                  <div className="w-full h-[1px] mb-2" style={{ backgroundColor: "#C9A96E" }} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>
                    Date of Completion
                  </span>
                </div>

                {/* Seal */}
                <div className="flex flex-col items-center transform translate-y-4">
                  <div className="w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center relative shadow-[0_0_30px_rgba(201,169,110,0.3)] bg-[#1E1B2E]" style={{ borderColor: "#C9A96E" }}>
                    <div className="w-[114px] h-[114px] rounded-full border border-dashed flex flex-col items-center justify-center" style={{ borderColor: "#C9A96E" }}>
                      <ShieldCheck size={32} style={{ color: "#C9A96E", marginBottom: "4px" }} />
                      <span className="text-[8px] uppercase font-bold tracking-widest" style={{ color: "#C9A96E", fontFamily: "sans-serif" }}>Official</span>
                      <span className="text-[10px] uppercase font-black tracking-widest" style={{ color: "#C9A96E", fontFamily: "'Cinzel', serif" }}>Seal</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest mt-4" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}>
                    ID: {certificate.id.slice(0, 10).toUpperCase()}
                  </span>
                </div>

                {/* Signature */}
                <div className="flex flex-col items-center w-[220px]">
                  <span className="text-[32px] capitalize mb-1 -translate-y-2" style={{ color: "#FFFFFF", fontFamily: "'Great Vibes', cursive" }}>
                    {course?.teacher?.name || "Skill Sphere"}
                  </span>
                  <div className="w-full h-[1px] mb-2" style={{ backgroundColor: "#C9A96E" }} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>
                    Lead Instructor
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
