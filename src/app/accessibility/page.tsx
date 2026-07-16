
import Link from "next/link";

export const metadata = {
  title: "Accessibility - Skill Sphere",
  description: "Read about Skill Sphere's commitment to web accessibility.",
};

export default function AccessibilityPage() {
  return (
    <div className="py-20 px-4 md:px-8 font-sans">
      <div className="max-w-[800px] mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
          
          <Link href="/" className="inline-block text-[#C9A96E] hover:underline font-medium mb-8">
            ← Back
          </Link>
          
          <p className="text-sm text-[#8E8E93] mb-4">Last updated: July 16, 2026</p>
          
          <h1 className="font-heading text-4xl text-[#1E1B2E] mb-12">Accessibility Statement</h1>

          <div className="text-[#6B6B6B] leading-[1.7] space-y-8">
            
            <section>
              <h2 className="font-heading text-xl text-[#1E1B2E] mb-4">1. Commitment to Accessibility</h2>
              <p>
                Skill Sphere is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to our platform.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-[#1E1B2E] mb-4">2. Standards We Follow</h2>
              <p>
                We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-[#1E1B2E] mb-4">3. Known Limitations</h2>
              <p>
                While we strive for WCAG 2.1 Level AA conformance, there may be some third-party components or older user-generated content that do not fully meet these standards. We are actively working to identify and resolve these issues.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-[#1E1B2E] mb-4">4. Feedback and Reporting Issues</h2>
              <p>
                We welcome your feedback on the accessibility of Skill Sphere. If you encounter accessibility barriers, please let us know by contacting our support team at <a href="mailto:accessibility@skillsphere.com" className="text-[#C9A96E] hover:underline">accessibility@skillsphere.com</a>. We try to respond to feedback within 2 business days.
              </p>
            </section>

          </div>
        </div>
    </div>
  );
}
