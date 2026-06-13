"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Award, ShieldCheck, Medal, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import "./certificate.css";

export default function CertificateClient({ certificate }: { certificate: any }) {
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

      {/* Certificate — this div is captured for PDF */}
      <div
        id="certificate-wrapper"
        ref={certRef}
        className="relative w-full max-w-5xl bg-white border-8 border-black p-4 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]"
        style={{ aspectRatio: "1.414 / 1" }}
      >
        {/* Decorative Inner Border */}
        <div className="absolute inset-4 border-[12px] border-[#F5C84C] border-double m-4 flex flex-col items-center justify-center p-12 text-center overflow-hidden">

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Medal size={600} />
          </div>

          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="w-24 h-24 bg-primary text-white flex items-center justify-center rounded-full border-4 border-black mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Award size={48} />
            </div>

            <h1 className="text-6xl font-black uppercase tracking-tighter text-black mb-4">
              Certificate
            </h1>
            <p className="text-2xl font-bold uppercase tracking-[0.3em] text-[#4F7DF3] mb-12">
              Of Completion
            </p>

            <p className="text-lg font-bold text-muted-foreground uppercase tracking-widest mb-4">
              This is proudly presented to
            </p>

            <h2 className="text-5xl font-black mb-4 pb-2 border-b-4 border-black inline-block px-12">
              {certificate.user.name}
            </h2>

            <p className="text-lg font-bold text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-8 mb-12">
              For successfully completing the course requirements and demonstrating exceptional proficiency in:
              <span className="text-3xl font-black text-black mt-4 block">{courseName}</span>
            </p>

            {/* Footer Signatures */}
            <div className="w-full max-w-4xl flex justify-between items-end mt-8 px-12">
              <div className="flex flex-col items-center">
                <div className="w-48 border-b-4 border-black mb-2 flex justify-center pb-2">
                  <span className="font-bold text-2xl opacity-80 italic">Skill Sphere Admin</span>
                </div>
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Authorized Signature</p>
              </div>

              <div className="flex flex-col items-center">
                <ShieldCheck size={48} className="text-[#34D399] mb-4" />
                <p className="text-sm font-black uppercase tracking-widest">ID: {certificate.id.slice(0, 10).toUpperCase()}</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-48 border-b-4 border-black mb-2 flex justify-center pb-2">
                  <span className="font-black text-xl">{formattedDate}</span>
                </div>
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Date of Issue</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
