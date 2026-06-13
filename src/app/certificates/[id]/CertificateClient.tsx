"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download, Award, ShieldCheck, Medal } from "lucide-react";
import Link from "next/link";

export default function CertificateClient({ certificate }: { certificate: any }) {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(certificate.issueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 flex flex-col items-center">
      {/* Controls - Hidden when printing */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8 print:hidden">
        <Link href="/dashboard/student">
          <Button variant="outline" className="border-4 border-black font-black uppercase text-xs h-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex gap-4">
          <Button onClick={handlePrint} className="neo-brutalism bg-[#4F7DF3] text-white font-black h-12 px-6">
            <Printer className="mr-2" /> Save as PDF
          </Button>
        </div>
      </div>

      {/* Certificate Container */}
      <div className="relative w-full max-w-5xl aspect-[1.414/1] bg-white border-8 border-black p-4 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] print:shadow-none print:border-8 print:border-black print:m-0 print:w-[100vw] print:h-[100vh] print:max-w-none print:aspect-auto">
        
        {/* Decorative Inner Border */}
        <div className="absolute inset-4 border-[12px] border-[#F5C84C] border-double m-4 flex flex-col items-center justify-center p-12 text-center overflow-hidden">
          
          {/* Background watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Medal size={600} />
          </div>

          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="w-24 h-24 bg-primary text-white flex items-center justify-center rounded-full border-4 border-black mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Award size={48} />
            </div>

            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-black mb-4">
              Certificate
            </h1>
            <p className="text-xl md:text-2xl font-bold uppercase tracking-[0.3em] text-[#4F7DF3] mb-12">
              Of Completion
            </p>

            <p className="text-lg font-bold text-muted-foreground uppercase tracking-widest mb-4">
              This is proudly presented to
            </p>
            
            <h2 className="text-5xl md:text-6xl font-black mb-4 pb-2 border-b-4 border-black inline-block px-12">
              {certificate.user.name}
            </h2>

            <p className="text-lg font-bold text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-8 mb-12">
              For successfully completing the course requirements and demonstrating exceptional proficiency in:
              <br />
              <span className="text-3xl font-black text-black mt-4 block">{certificate.title.replace("Certificate of Completion: ", "")}</span>
            </p>

            {/* Footer Signatures */}
            <div className="w-full max-w-4xl flex justify-between items-end mt-12 px-12">
              <div className="flex flex-col items-center">
                <div className="w-48 border-b-4 border-black mb-2 flex justify-center pb-2">
                  <span className="font-script text-3xl opacity-80">Skill Sphere Admin</span>
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

      {/* Global Print Styles to make it look perfect when printing */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          /* Show only the certificate wrapper and its children */
          .relative.w-full.max-w-5xl, .relative.w-full.max-w-5xl * {
            visibility: visible;
          }
          .relative.w-full.max-w-5xl {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border: 8px solid black !important;
          }
          /* Force background colors to print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: landscape;
            margin: 0mm;
          }
        }
      `}</style>
    </div>
  );
}
