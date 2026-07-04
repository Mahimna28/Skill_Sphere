import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
content = content.replace(
    'import { Header } from "@/components/layout/Header";\nimport { Footer } from "@/components/layout/Footer";',
    'import { CommunityFeedbackSection } from "@/components/home/CommunityFeedback";'
)

# 2. Replace HeroSection
old_hero = re.search(r'function HeroSection\(\) \{.*?^\}', content, re.MULTILINE | re.DOTALL).group(0)
new_hero = """function HeroSection() {
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
}"""
content = content.replace(old_hero, new_hero)

# 3. Delete sections
sections_to_delete = ['ProblemSection', 'SuccessStoriesSection', 'TestimonialsSection', 'PricingSection']
for section in sections_to_delete:
    pattern = r'function ' + section + r'\(\) \{.*?^\}'
    content = re.sub(pattern, '', content, flags=re.MULTILINE | re.DOTALL)

# 4. Modify Homepage
homepage_pattern = r'export default function Homepage\(\) \{.*?^\}'
old_homepage = re.search(homepage_pattern, content, flags=re.MULTILINE | re.DOTALL).group(0)

new_homepage = """export default function Homepage() {
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
}"""

content = content.replace(old_homepage, new_homepage)

# 5. Add motion.section to the remaining sections (Solution, Features, HowItWorks, Benefits, CoursesPreview, FAQ, FinalCTA)
sections_to_animate = ['SolutionSection', 'FeaturesBentoSection', 'HowItWorksSection', 'BenefitsSection', 'CoursesPreviewSection', 'FAQSection', 'FinalCTASection']

for section in sections_to_animate:
    # Find the function definition
    func_pattern = r'(function ' + section + r'\(\) \{[\s\S]*?)(<section className="([^"]*)">)'
    
    def replacer(match):
        prefix = match.group(1)
        classes = match.group(3)
        return f'{prefix}<motion.section \n      initial={{{{ opacity: 0, y: 24 }}}}\n      whileInView={{{{ opacity: 1, y: 0 }}}}\n      viewport={{{{ once: true, margin: "-100px" }}}}\n      transition={{{{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}}}\n      className="{classes}"\n    >'
    
    content = re.sub(func_pattern, replacer, content, count=1)
    
    # We also need to replace the closing </section> with </motion.section> for this function.
    # Since we don't want to replace *all* </section>, we could just replace all of them since only Hero doesn't use it, wait Hero also uses <section>.
    
# Actually, since all sections except Hero will be updated, let's just do a manual replacement in the functions
def animate_section(content, section_name):
    # Find the function
    match = re.search(r'function ' + section_name + r'\(\) \{([\s\S]*?)^\}', content, re.MULTILINE)
    if match:
        func_body = match.group(1)
        # Replace <section ...>
        func_body = re.sub(r'<section className="([^"]*)">', 
                           r'<motion.section \n      initial={{ opacity: 0, y: 24 }}\n      whileInView={{ opacity: 1, y: 0 }}\n      viewport={{ once: true, margin: "-100px" }}\n      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}\n      className="\1"\n    >', 
                           func_body)
        # Replace </section>
        func_body = func_body.replace('</section>', '</motion.section>')
        
        return content.replace(match.group(1), func_body)
    return content

for s in sections_to_animate:
    content = animate_section(content, s)

# Clean up multiple empty lines
content = re.sub(r'\n{3,}', '\n\n', content)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated page.tsx successfully.")
