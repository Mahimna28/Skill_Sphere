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
        backgroundColor: "#ffffff",
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
    <div className="min-h-screen bg-muted/30 py-12 px-4 flex flex-col items-center">
      {/* Controls */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8 print-hidden">
        <Link href="/dashboard/student">
          <Button
            variant="outline"
            className="border-4 border-black font-black uppercase text-xs h-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
          >
            <ArrowLeft size={14} className="mr-2" /> Back to Dashboard
          </Button>
        </Link>
        <Button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="neo-brutalism bg-[#4F7DF3] text-white font-black h-12 px-6"
        >
          {downloading ? (
            <><Loader2 className="mr-2 animate-spin" size={18} /> Generating PDF...</>
          ) : (
            <><Download className="mr-2" size={18} /> Download PDF</>
          )}
        </Button>
      </div>

      {/* Certificate Container */}
      <div className="w-full flex justify-center overflow-x-auto pb-12 custom-scrollbar">
        <div
          id="certificate-wrapper"
          ref={certRef}
          className="relative shrink-0 shadow-2xl"
          style={{ 
            width: "1200px", 
            height: "675px", 
            backgroundImage: "url('/images/certificate-template.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            fontFamily: "'Times New Roman', serif"
          }}
        >
          {/* Student Name (covers the placeholder) */}
          <div className="absolute top-[31%] left-0 w-full flex justify-center">
            <h2 
              className="text-[52px] font-bold text-[#142646] uppercase tracking-wide bg-white px-10 py-2 rounded"
              style={{ minWidth: '400px', textAlign: 'center' }}
            >
              {certificate.user.name}
            </h2>
          </div>

          {/* Course Name (covers the placeholder) */}
          <div className="absolute top-[49%] left-0 w-full flex justify-center">
            <h3 
              className="text-[42px] font-bold text-[#142646] uppercase tracking-wider bg-white px-8 py-1 rounded"
              style={{ minWidth: '500px', textAlign: 'center' }}
            >
              {courseName}
            </h3>
          </div>

          {/* Bottom Row Overlays */}
          <div className="absolute top-[71%] left-[10.5%] w-[79%] h-[60px] flex items-center">
            
            {/* Duration */}
            <div className="w-1/5 h-full flex flex-col justify-center items-center bg-white">
              <span className="text-[10px] font-bold text-[#142646] uppercase mb-0.5">Course Duration</span>
              <span className="text-[14px] font-bold text-[#4F7DF3] uppercase">
                {course?.duration || "40 HOURS"}
              </span>
            </div>

            {/* Level */}
            <div className="w-1/5 h-full flex flex-col justify-center items-center bg-white border-l border-gray-200">
              <span className="text-[10px] font-bold text-[#142646] uppercase mb-0.5">Level</span>
              <span className="text-[14px] font-bold text-[#4F7DF3] uppercase">
                {course?.level || "INTERMEDIATE"}
              </span>
            </div>

            {/* Completion Date */}
            <div className="w-1/5 h-full flex flex-col justify-center items-center bg-white border-l border-gray-200">
              <span className="text-[10px] font-bold text-[#142646] uppercase mb-0.5">Completion Date</span>
              <span className="text-[14px] font-bold text-[#34D399] uppercase">
                {formattedDate}
              </span>
            </div>

            {/* Certificate ID */}
            <div className="w-1/5 h-full flex flex-col justify-center items-center bg-white border-l border-gray-200">
              <span className="text-[10px] font-bold text-[#142646] uppercase mb-0.5">Certificate ID</span>
              <span className="text-[14px] font-bold text-[#4F7DF3] uppercase">
                {certificate.id.slice(0, 10)}
              </span>
            </div>

            {/* Instructor */}
            <div className="w-1/5 h-full flex flex-col justify-center items-center bg-white border-l border-gray-200">
              <span className="text-[10px] font-bold text-[#142646] uppercase mb-0.5">Instructor</span>
              <span className="text-[14px] font-bold text-[#4F7DF3] uppercase truncate w-[120px] text-center">
                {course?.teacher?.name || "Skill Sphere"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
