"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import "./certificate.css";

export default function CertificateClient({ certificate, course }: { certificate: any; course?: any }) {
  const certRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 1450) {
        setScale((windowWidth - 48) / 1400);
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
        backgroundColor: "#0F0D1A",
        logging: false,
        width: 1400,
        height: 787,
        onclone: (_clonedDoc, clonedElement) => {
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
  const instructorName = course?.teacher?.name || "Skill Sphere";

  return (
    <div
      className="min-h-screen pb-16 px-6 flex flex-col items-center"
      style={{ background: "#0F0D1A", paddingTop: "6rem" }}
    >
      {/* Controls */}
      <div className="w-full max-w-[1400px] flex justify-between items-center mb-8 print-hidden relative z-50">
        <Link href="/dashboard/student">
          <Button
            variant="outline"
            className="border-2 border-[#C9A96E]/30 text-[#C9A96E] hover:bg-[#C9A96E]/10 hover:text-[#C9A96E] bg-[#1E1B2E] font-bold uppercase tracking-wider text-xs h-11 px-6 rounded-xl transition-all"
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

      {/* Certificate with Scaling */}
      <div
        className="w-full flex justify-center"
        style={{ height: `${787 * scale}px` }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            transition: "transform 0.2s ease",
          }}
        >
          <div className="certificate-container" id="certificate-wrapper" ref={certRef}>
            <div className="certificate-inner">

              {/* Watermark */}
              <div className="watermark">SKILL SPHERE</div>

              {/* Header */}
              <div className="cert-header">
                <div className="medal-wrapper">
                  <div className="medal-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="6"/>
                      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                    </svg>
                  </div>
                </div>
                <span className="label-small">Skill Sphere Academy</span>
                <h1 className="main-title">Certificate of<br />Completion</h1>
                <p className="subtitle">This certificate is proudly presented to</p>
              </div>

              {/* Body */}
              <div className="cert-body">
                <div className="student-name-container">
                  <h2 className="student-name">{certificate.user.name}</h2>
                </div>
                <p className="reason-text">for successfully completing and mastering the curriculum of</p>
                <h3 className="course-name-title">{courseName}</h3>
              </div>

              {/* Footer */}
              <div className="cert-footer">

                {/* Date */}
                <div className="signature-section">
                  <div className="signature-line">
                    <span className="date-display">{formattedDate}</span>
                  </div>
                  <p className="detail-label">Date of Issue</p>
                </div>

                {/* Verified Badge */}
                <div className="verified-badge">
                  <div className="verified-outer">
                    <div className="verified-inner">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                        <path d="m9 12 2 2 4-4"/>
                      </svg>
                      <span className="verified-text-badge">Verified</span>
                    </div>
                  </div>
                  <span className="detail-label" style={{ marginTop: "0.75rem" }}>ID: {certificate.id.substring(0, 8)}</span>
                </div>

                {/* Instructor Signature */}
                <div className="signature-section">
                  <div className="signature-line">
                    <span className="signature-font">{instructorName}</span>
                  </div>
                  <p className="detail-label">Instructor Signature</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}