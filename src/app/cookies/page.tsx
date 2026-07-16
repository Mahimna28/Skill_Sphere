
import Link from "next/link";

export const metadata = {
  title: "Cookie Policy - Skill Sphere",
  description: "Learn how and why Skill Sphere uses cookies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="py-20 px-4 md:px-8 font-sans">
      <div className="max-w-[800px] mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
          
          <Link href="/" className="inline-block text-[#C9A96E] hover:underline font-medium mb-8">
            ← Back
          </Link>
          
          <p className="text-sm text-[#8E8E93] mb-4">Last updated: July 16, 2026</p>
          
          <h1 className="font-heading text-4xl text-[#1E1B2E] mb-12">Cookie Policy</h1>

          <div className="text-[#6B6B6B] leading-[1.7] space-y-8">
            
            <section>
              <h2 className="font-heading text-xl text-[#1E1B2E] mb-4">1. What Cookies We Use</h2>
              <p>
                Skill Sphere uses cookies to enhance your browsing experience. These include:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic platform functionality, such as keeping you logged in.</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with the site by collecting anonymous information.</li>
                <li><strong>Preference Cookies:</strong> Allow the platform to remember choices you make (like your preferred language or region).</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl text-[#1E1B2E] mb-4">2. Third-Party Cookies</h2>
              <p>
                In some special cases, we also use cookies provided by trusted third parties, such as analytics providers. We do not use third-party tracking cookies for targeted advertising.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl text-[#1E1B2E] mb-4">3. How to Manage Cookies</h2>
              <p>
                You can prevent the setting of cookies by adjusting the settings on your browser. Be aware that disabling cookies may affect the functionality of this and many other websites that you visit. We recommend that you leave on all cookies if you are not sure whether you need them or not, in case they are used to provide a service that you use.
              </p>
            </section>

          </div>
        </div>
    </div>
  );
}
