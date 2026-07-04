const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Update imports
content = content.replace(
  'import { Header } from "@/components/layout/Header";\nimport { Footer } from "@/components/layout/Footer";',
  'import { CommunityFeedbackSection } from "@/components/home/CommunityFeedback";'
);

// 2. Replace HeroSection
const heroMatch = content.match(/function HeroSection\(\) \{[\s\S]*?^\}/m);
if (heroMatch) {
  const newHero = `function HeroSection() {
  const appleEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center bg-[#1E1B2E] overflow-hidden">
      {/* Ken Burns animated background */}
      <motion.div
        initial={{ scale: 1.0 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 z-0 origin-center"
      >
        <img
          src="/images/hero-workspace.jpg"
          alt="Immersive workspace"
          className="w-full h-full object-cover opacity-40"
          onError={(e) => { e.currentTarget.src = "/images/hero-bg.jpg"; }}
        />
      </motion.div>

      {/* Centered content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: appleEase }}
          className="mb-8"
        >
          <span className="font-sans text-[12px] uppercase tracking-[0.15em] text-[#C9A96E]">
            AI-Powered Learning
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: appleEase }}
          className="font-heading font-bold text-[42px] md:text-[72px] lg:text-[96px] text-white leading-[0.95] mb-8 max-w-[1000px]"
        >
          Education, crafted for how you think.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: appleEase }}
          className="font-sans text-[17px] md:text-[20px] leading-[1.5] text-[#F5F1EB] mb-12 max-w-[560px]"
        >
          Unlock your potential with a premium learning platform designed for role-based education and real-time collaboration.
        </motion.p>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0, ease: appleEase }}
        >
          <motion.button
            onClick={() => window.location.href = '/courses'}
            whileHover={{ scale: 1.03, boxShadow: "0 6px 24px rgba(201,169,110,0.55)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-[#C9A96E] text-[#1E1B2E] font-sans font-medium text-[17px] rounded-full px-10 py-4 shadow-[0_4px_14px_rgba(201,169,110,0.4)]"
          >
            Explore Courses
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator line */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-[#C9A96E] to-transparent"
        />
      </div>
    </section>
  );
}`;
  content = content.replace(heroMatch[0], newHero);
}

// 3. Delete sections
const sectionsToDelete = ['ProblemSection', 'SuccessStoriesSection', 'TestimonialsSection', 'PricingSection'];
sectionsToDelete.forEach(section => {
  const pattern = new RegExp(\`function \${section}\\(\\) \\{[\\\\s\\\\S]*?^\\}\`, 'gm');
  content = content.replace(pattern, '');
});

// 4. Modify Homepage
const homepagePattern = /export default function Homepage\(\) \{[\s\S]*?^\}/m;
const homepageMatch = content.match(homepagePattern);
if (homepageMatch) {
  const newHomepage = `export default function Homepage() {
  return (
    <div className="min-h-screen bg-[#F5F1EB]">
      <main>
        <HeroSection />
        <SolutionSection />
        <FeaturesBentoSection />
        <HowItWorksSection />
        <BenefitsSection />
        <CoursesPreviewSection />
        <CommunityFeedbackSection />
        <FAQSection />
        <FinalCTASection />
      </main>
    </div>
  );
}`;
  content = content.replace(homepageMatch[0], newHomepage);
}

// 5. Add motion.section to the remaining sections
const sectionsToAnimate = ['SolutionSection', 'FeaturesBentoSection', 'HowItWorksSection', 'BenefitsSection', 'CoursesPreviewSection', 'FAQSection', 'FinalCTASection'];

sectionsToAnimate.forEach(section => {
  const pattern = new RegExp(\`(function \${section}\\(\\) \\{[\\\\s\\\\S]*?)(<section className="([^"]*)">)\`);
  content = content.replace(pattern, (match, prefix, sectionTag, classes) => {
    return \`\${prefix}<motion.section 
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="\${classes}"
    >\`;
  });
  
  // also replace the corresponding closing tag for this function
  const funcEndPattern = new RegExp(\`function \${section}\\(\\) \\{[\\\\s\\\\S]*?(</section>)\\s*\\}\`, 'm');
  const funcMatch = content.match(funcEndPattern);
  if (funcMatch) {
    const wholeFunc = funcMatch[0];
    // Find the last </section> and replace it
    const lastSectionIndex = wholeFunc.lastIndexOf('</section>');
    if (lastSectionIndex !== -1) {
      const replacedFunc = wholeFunc.substring(0, lastSectionIndex) + '</motion.section>' + wholeFunc.substring(lastSectionIndex + 10);
      content = content.replace(wholeFunc, replacedFunc);
    }
  }
});

// Clean up newlines
content = content.replace(/\\n{3,}/g, '\\n\\n');

fs.writeFileSync('src/app/page.tsx', content, 'utf8');
console.log('Updated page.tsx successfully.');
