"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Award, ShieldCheck, Medal, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import "./certificate.css";

export default function CertificateClient({ certificate, course }: { certificate: any; course?: any }) {
  const certRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

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
      <div className="w-full flex justify-center overflow-x-auto pb-12 custom-scrollbar">
        <div
          id="certificate-wrapper"
          ref={certRef}
          className="relative shrink-0 shadow-2xl bg-[#1E1B2E] overflow-hidden"
          style={{ 
            width: "1200px", 
            height: "675px", 
            fontFamily: "var(--font-heading, 'Times New Roman', serif)"
          }}
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full border-[20px] border-[#C9A96E] opacity-10 pointer-events-none" />
          <div className="absolute top-[30px] left-[30px] w-[calc(100%-60px)] h-[calc(100%-60px)] border-[2px] border-[#C9A96E]/40 pointer-events-none" />
          <div className="absolute top-[40px] left-[40px] w-[calc(100%-80px)] h-[calc(100%-80px)] border border-[#C9A96E]/20 pointer-events-none" />
          
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Medal size={600} className="text-[#C9A96E]" />
          </div>

          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-16 text-center">
            
            {/* Header Icon */}
            <div className="w-24 h-24 mb-6 rounded-full border-4 border-[#C9A96E] flex items-center justify-center bg-[#1E1B2E] text-[#C9A96E] shadow-[0_0_30px_rgba(201,169,110,0.2)]">
              <Award size={48} />
            </div>

            <h1 className="text-[56px] font-black uppercase tracking-[0.1em] text-[#C9A96E] mb-2 drop-shadow-md">
              Certificate of Completion
            </h1>
            
            <div className="w-32 h-1 bg-[#C9A96E] rounded-full mb-10 opacity-70" />

            <p className="text-[18px] font-bold text-[#FFFFFF]/60 uppercase tracking-[0.3em] mb-4">
              This certificate is proudly presented to
            </p>

            <h2 className="text-[64px] font-bold text-white mb-6 drop-shadow-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              {certificate.user.name}
            </h2>

            <p className="text-[18px] font-bold text-[#FFFFFF]/60 uppercase tracking-widest max-w-3xl leading-relaxed mb-6">
              For successfully completing the rigorous requirements and demonstrating exceptional proficiency in
            </p>

            <h3 className="text-[40px] font-bold text-[#C9A96E] uppercase tracking-wide mb-12 drop-shadow-md">
              {courseName}
            </h3>

            {/* Footer Details */}
            <div className="w-full flex justify-between items-end mt-auto mb-8 px-12 border-t border-[#C9A96E]/20 pt-8">
              
              <div className="flex flex-col items-center w-[200px]">
                <span className="text-[14px] font-black text-white uppercase tracking-widest mb-2">
                  {formattedDate}
                </span>
                <div className="w-full h-[1px] bg-[#C9A96E]/50 mb-2" />
                <span className="text-[10px] font-bold text-[#FFFFFF]/50 uppercase tracking-widest">
                  Date of Issue
                </span>
              </div>

              <div className="flex flex-col items-center">
                <ShieldCheck size={40} className="text-[#C9A96E] mb-3" />
                <span className="text-[10px] font-bold text-[#FFFFFF]/50 uppercase tracking-widest">
                  Credential ID: {certificate.id.slice(0, 12).toUpperCase()}
                </span>
              </div>

              <div className="flex flex-col items-center w-[200px]">
                <span className="text-[16px] font-black text-white capitalize italic mb-2" style={{ fontFamily: "serif" }}>
                  {course?.teacher?.name || "Skill Sphere Admin"}
                </span>
                <div className="w-full h-[1px] bg-[#C9A96E]/50 mb-2" />
                <span className="text-[10px] font-bold text-[#FFFFFF]/50 uppercase tracking-widest">
                  Lead Instructor
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
