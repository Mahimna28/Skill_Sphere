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
        windowWidth: 1200,
        windowHeight: 900,
        onclone: (clonedDoc, clonedElement) => {
          if (clonedElement && clonedElement.parentElement) {
            clonedElement.parentElement.style.transform = "none";
          }
        },
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
      <div className="w-full max-w-5xl flex justify-between items-center mb-8 print-hidden relative z-10">
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
      <div className="w-full flex justify-center pb-12" style={{ height: `${900 * scale}px` }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top center", transition: "transform 0.2s ease" }}>
          <div
            id="certificate-wrapper"
            ref={certRef}
            className="relative shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden bg-[#1E1B2E] flex flex-col items-center justify-center p-[40px]"
            style={{ 
              width: "1200px", 
              height: "900px", 
              color: "#FFFFFF",
              fontFamily: "'Playfair Display', serif"
            }}
          >
            {/* Outer Border */}
            <div className="absolute inset-4 border-[3px] rounded-xl z-0 pointer-events-none" style={{ borderColor: "rgba(201, 169, 110, 0.4)" }}></div>
            {/* Inner Border */}
            <div className="absolute inset-8 border rounded-lg z-0 pointer-events-none" style={{ borderColor: "rgba(201, 169, 110, 0.2)" }}></div>

            {/* Corner Ornaments */}
            <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-[#C9A96E] z-0" style={{ opacity: 0.7 }}></div>
            <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-[#C9A96E] z-0" style={{ opacity: 0.7 }}></div>
            <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-[#C9A96E] z-0" style={{ opacity: 0.7 }}></div>
            <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-[#C9A96E] z-0" style={{ opacity: 0.7 }}></div>

            {/* Content */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-8 text-center">
              
              {/* Header */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 rounded-full border flex items-center justify-center mb-2" style={{ borderColor: "rgba(201, 169, 110, 0.3)", backgroundColor: "rgba(201, 169, 110, 0.05)" }}>
                  <Award className="w-10 h-10" style={{ color: "#C9A96E" }} />
                </div>
                <h4 className="uppercase tracking-[0.3em] text-[#C9A96E] text-sm font-bold">Skill Sphere Academy</h4>
                <h1 
                  className="text-[64px] font-black uppercase tracking-[0.1em] text-white mt-4"
                  style={{ fontFamily: "'Cinzel', serif", textShadow: "0 4px 20px rgba(201,169,110,0.2)" }}
                >
                  Certificate of Completion
                </h1>
              </div>

              {/* Body */}
              <div className="flex flex-col items-center space-y-8 flex-1 justify-center">
                <p className="text-xl italic tracking-wide" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  This certificate is proudly presented to
                </p>
                
                <h2 
                  className="text-[96px] leading-none text-[#C9A96E]" 
                  style={{ fontFamily: "'Great Vibes', cursive", textShadow: "0 4px 15px rgba(201,169,110,0.3)" }}
                >
                  {certificate.user.name}
                </h2>

                <div className="w-64 h-[1px] my-4" style={{ background: "linear-gradient(to right, transparent, rgba(201, 169, 110, 0.5), transparent)" }}></div>

                <p className="text-lg tracking-wide max-w-3xl" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  for successfully completing and mastering the curriculum of
                </p>

                <h3 
                  className="text-[32px] font-bold uppercase tracking-[0.1em] text-white" 
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {courseName}
                </h3>
              </div>

              {/* Footer */}
              <div className="w-full max-w-4xl flex justify-between items-end mt-12 pt-8">
                {/* Date */}
                <div className="flex flex-col items-center">
                  <span 
                    className="text-xl font-bold uppercase tracking-widest text-white mb-2" 
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {formattedDate}
                  </span>
                  <div className="w-48 h-[1px] mb-2" style={{ backgroundColor: "rgba(201, 169, 110, 0.4)" }}></div>
                  <span className="text-sm uppercase tracking-widest" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Date of Issue</span>
                </div>

                {/* Badge */}
                <div className="flex flex-col items-center" style={{ opacity: 0.8 }}>
                  <div className="w-24 h-24 rounded-full border-[2px] border-[#C9A96E] flex items-center justify-center p-2">
                    <div className="w-full h-full rounded-full border border-[#C9A96E] flex items-center justify-center relative">
                      <ShieldCheck className="w-10 h-10 text-[#C9A96E]" />
                      <div className="absolute -bottom-1 bg-[#1E1B2E] px-2 text-[10px] tracking-widest text-[#C9A96E] uppercase">Verified</div>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest mt-4" style={{ color: "rgba(255, 255, 255, 0.3)" }}>ID: {certificate.id.substring(0, 8)}</span>
                </div>

                {/* Signature */}
                <div className="flex flex-col items-center">
                  <span 
                    className="text-[40px] text-white mb-0 capitalize" 
                    style={{ fontFamily: "'Great Vibes', cursive" }}
                  >
                    {course?.teacher?.name || "Skill Sphere"}
                  </span>
                  <div className="w-48 h-[1px] mb-2 mt-1" style={{ backgroundColor: "rgba(201, 169, 110, 0.4)" }}></div>
                  <span className="text-sm uppercase tracking-widest" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Instructor Signature</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
