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
    <div className="min-h-screen bg-[#0F0D1A] py-12 px-4 flex flex-col items-center">
      {/* Controls */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8 print-hidden">
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
            className="relative shrink-0 shadow-2xl overflow-hidden"
            style={{ 
              width: "1200px", 
              height: "675px", 
              backgroundColor: "#1E1B2E", // Explicit hex background
              color: "#FFFFFF",           // Explicit hex color to override lab() vars
              fontFamily: "var(--font-heading, 'Times New Roman', serif)"
            }}
          >
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full border-[20px] opacity-10 pointer-events-none" style={{ borderColor: "#C9A96E" }} />
            <div className="absolute top-[30px] left-[30px] w-[calc(100%-60px)] h-[calc(100%-60px)] border-[2px] pointer-events-none" style={{ borderColor: "rgba(201,169,110,0.4)" }} />
            <div className="absolute top-[40px] left-[40px] w-[calc(100%-80px)] h-[calc(100%-80px)] border pointer-events-none" style={{ borderColor: "rgba(201,169,110,0.2)" }} />
            
            {/* Subtle Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none" style={{ color: "#C9A96E" }}>
              <Medal size={600} />
            </div>

            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-16 text-center">
              
              {/* Header Icon */}
              <div 
                className="w-24 h-24 mb-6 rounded-full border-4 flex items-center justify-center shadow-[0_0_30px_rgba(201,169,110,0.2)]" 
                style={{ borderColor: "#C9A96E", backgroundColor: "#1E1B2E", color: "#C9A96E" }}
              >
                <Award size={48} />
              </div>

              <h1 className="text-[56px] font-black uppercase tracking-[0.1em] mb-2 drop-shadow-md" style={{ color: "#C9A96E" }}>
                Certificate of Completion
              </h1>
              
              <div className="w-32 h-1 rounded-full mb-10 opacity-70" style={{ backgroundColor: "#C9A96E" }} />

              <p className="text-[18px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
                This certificate is proudly presented to
              </p>

              <h2 className="text-[64px] font-bold mb-6 drop-shadow-lg" style={{ color: "#FFFFFF", fontFamily: "'Playfair Display', serif" }}>
                {certificate.user.name}
              </h2>

              <p className="text-[18px] font-bold uppercase tracking-widest max-w-3xl leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
                For successfully completing the rigorous requirements and demonstrating exceptional proficiency in
              </p>

              <h3 className="text-[40px] font-bold uppercase tracking-wide mb-12 drop-shadow-md" style={{ color: "#C9A96E" }}>
                {courseName}
              </h3>

              {/* Footer Details */}
              <div className="w-full flex justify-between items-end mt-auto mb-8 px-12 border-t pt-8" style={{ borderColor: "rgba(201,169,110,0.2)" }}>
                
                <div className="flex flex-col items-center w-[200px]">
                  <span className="text-[14px] font-black uppercase tracking-widest mb-2" style={{ color: "#FFFFFF" }}>
                    {formattedDate}
                  </span>
                  <div className="w-full h-[1px] mb-2" style={{ backgroundColor: "rgba(201,169,110,0.5)" }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Date of Issue
                  </span>
                </div>

                <div className="flex flex-col items-center" style={{ color: "#C9A96E" }}>
                  <ShieldCheck size={40} className="mb-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Credential ID: {certificate.id.slice(0, 12).toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-col items-center w-[200px]">
                  <span className="text-[16px] font-black capitalize italic mb-2" style={{ color: "#FFFFFF", fontFamily: "serif" }}>
                    {course?.teacher?.name || "Skill Sphere Admin"}
                  </span>
                  <div className="w-full h-[1px] mb-2" style={{ backgroundColor: "rgba(201,169,110,0.5)" }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
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
