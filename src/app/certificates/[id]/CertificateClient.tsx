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
            {/* The Background Template Image */}
            <img 
              src="/images/certificate-template.jpg" 
              alt="Certificate Template" 
              className="absolute inset-0 w-full h-full object-cover z-0" 
              crossOrigin="anonymous"
            />

            {/* Content Container - Absolutely positioned over the template's blank spaces */}
            <div className="relative z-10 w-full h-full">
              
              {/* Student Name */}
              <div className="absolute top-[340px] left-0 w-full flex justify-center">
                <h2 
                  className="text-[72px] font-bold drop-shadow-lg leading-none" 
                  style={{ color: "#FFFFFF", fontFamily: "'Great Vibes', cursive" }}
                >
                  {certificate.user.name}
                </h2>
              </div>

              {/* Course Name */}
              <div className="absolute top-[510px] left-0 w-full flex justify-center">
                <h3 
                  className="text-[36px] font-bold uppercase tracking-[0.15em] drop-shadow-md leading-tight text-center px-12" 
                  style={{ color: "#C9A96E", fontFamily: "'Cinzel', serif" }}
                >
                  {courseName}
                </h3>
              </div>
              
              {/* Date */}
              <div className="absolute bottom-[65px] left-[175px] w-[200px] flex justify-center">
                <span 
                  className="text-[16px] font-bold uppercase tracking-widest" 
                  style={{ color: "#FFFFFF", fontFamily: "'Cinzel', serif" }}
                >
                  {formattedDate}
                </span>
              </div>

              {/* Instructor Signature (Text representation) */}
              <div className="absolute bottom-[60px] right-[160px] w-[200px] flex justify-center">
                <span 
                  className="text-[32px] capitalize" 
                  style={{ color: "#FFFFFF", fontFamily: "'Great Vibes', cursive" }}
                >
                  {course?.teacher?.name || "Skill Sphere"}
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
