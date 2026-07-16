
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - Skill Sphere",
  description: "Learn how Skill Sphere collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-20 px-4 md:px-8 font-sans">
      <div className="max-w-[800px] mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
          
          <Link href="/" className="inline-block text-[#C9A96E] hover:underline font-medium mb-8">
            ← Back
          </Link>
          
          <p className="text-sm text-[#8E8E93] mb-4">Last updated: July 16, 2026</p>
          
          <h1 className="font-heading text-4xl text-[#1E1B2E] mb-12">Privacy Policy</h1>

          <div className="text-[#6B6B6B] leading-[1.7] space-y-8">
            
            <section>
              <h2 className="font-heading text-xl text-[#1E1B2E] mb-4">1. What Data We Collect</h2>
              <p>
                When you use Skill Sphere, we collect basic personal information to provide and improve our services. This includes your name, email address, course progress, grades, and any messages or forum posts you create within the platform.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-[#1E1B2E] mb-4">2. How We Use Your Data</h2>
              <p>
                Your data is strictly used to facilitate platform functionality. We use it to track your academic progress, deliver personalized course content, manage your account, and send important service-related communications. We do not sell your personal data to any third-party advertisers.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-[#1E1B2E] mb-4">3. Data Storage and Security</h2>
              <p>
                We employ industry-standard security measures to protect your information from unauthorized access, disclosure, or alteration. Your data is stored on secure servers, and sensitive information like passwords are symmetrically encrypted.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-[#1E1B2E] mb-4">4. Contact Us</h2>
              <p>
                If you have any questions or concerns about this Privacy Policy or our data practices, please reach out to us at <a href="mailto:privacy@skillsphere.com" className="text-[#C9A96E] hover:underline">privacy@skillsphere.com</a>.
              </p>
            </section>

          </div>
        </div>
    </div>
  );
}
