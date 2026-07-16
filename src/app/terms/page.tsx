
import Link from "next/link";

export const metadata = {
  title: "Terms of Service - Skill Sphere",
  description: "Read the terms and conditions for using Skill Sphere.",
};

export default function TermsOfServicePage() {
  return (
    <div className="py-20 px-4 md:px-8 font-sans">
      <div className="max-w-[800px] mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
          
          <Link href="/" className="inline-block text-[#C9A96E] hover:underline font-medium mb-8">
            ← Back
          </Link>
          
          <p className="text-sm text-[#8E8E93] mb-4">Last updated: July 16, 2026</p>
          
          <h1 className="font-heading text-4xl text-[#1E1B2E] mb-12">Terms of Service</h1>

          <div className="text-[#6B6B6B] leading-[1.7] space-y-8">
            
            <section>
              <h2 className="font-heading text-xl text-[#1E1B2E] mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Skill Sphere, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-[#1E1B2E] mb-4">2. User Accounts and Responsibilities</h2>
              <p>
                When you create an account, you must provide accurate and complete information. You are solely responsible for maintaining the confidentiality of your account password and for all activities that occur under your account. 
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-[#1E1B2E] mb-4">3. Content Ownership</h2>
              <p>
                Users retain full ownership rights to any content, assignments, or materials they submit to the platform. By submitting content, you grant Skill Sphere a non-exclusive license to use, display, and distribute said content solely for the purpose of operating the platform.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-[#1E1B2E] mb-4">4. Limitation of Liability</h2>
              <p>
                Skill Sphere and its affiliates will not be held liable for any damages arising out of the use or inability to use the materials on our platform, even if we have been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-[#1E1B2E] mb-4">5. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will always post the most current version on our site. By continuing to use the platform after changes become effective, you agree to be bound by the revised terms.
              </p>
            </section>

          </div>
        </div>
    </div>
  );
}
