const fs = require('fs');
const files = [
  "src/components/layout/Header.tsx",
  "src/components/layout/Footer.tsx",
  "src/components/home/LandingPageClient.tsx",
  "src/app/about/AboutPageClient.tsx",
  "src/app/courses/CoursesPageClient.tsx",
  "src/app/blog/BlogPageClient.tsx",
  "src/app/blog/[slug]/BlogPostClient.tsx"
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/\s*:\s*\{\}\}/g, '');
  content = content.replace(/\s*\?\s*\{[^}]+\}\s*:\s*false/g, '');
  content = content.replace(/\s*:\s*false\}/g, '');
  content = content.replace(/initial=\{[^}]+\?\s*false\s*:\s*/g, '');
  content = content.replace(/animate=\{[^}]+\?\s*false\s*:\s*/g, '');
  content = content.replace(/<div\s+\}\s+/g, '<div ');
  content = content.replace(/<div\s+\}\s*>/g, '<div>');
  content = content.replace(/<span\s+\}\s+/g, '<span ');
  content = content.replace(/<span\s+\}\s*>/g, '<span>');
  content = content.replace(/<section\s+\}\s+/g, '<section ');
  content = content.replace(/<section\s+\}\s*>/g, '<section>');
  content = content.replace(/<button\s+\}\s+/g, '<button ');
  content = content.replace(/<button\s+\}\s*>/g, '<button>');
  content = content.replace(/\?\s*\{[^}]+\}\s*:\s*false/g, '');
  content = content.replace(/\?\s*\{[^}]+\}\s*:\s*\{\}/g, '');
  content = content.replace(/<div\s+:\s*\{\}\s*>/g, '<div>');
  content = content.replace(/<div\s+:\s*false\s*>/g, '<div>');
  content = content.replace(/\sstyle=\{\{\s*y:\s*yParallax\s*\}\}/g, '');
  
  // also specifically clean whileHover leftovers like `? { y: -8, boxShadow: "0 12px 32px rgba(0,0,0,0.1)" } : {}`
  content = content.replace(/\?\s*\{[^}]+\}\s*:\s*\{\}/g, '');
  
  // and cleanup `<div : {} >`
  content = content.replace(/<div\s+:\s*\{\}\s*>/g, '<div>');
  
  // Clean empty lines to be neat
  content = content.replace(/\n\s*\n/g, '\n\n');

  fs.writeFileSync(file, content);
}
console.log("Fixed syntax errors.");
