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

  // Replace CountUp
  content = content.replace(/<CountUp target=\{([^}]+)\} suffix=\{([^}]+)\} \/>/g, '<span>{$1}{$2}</span>');
  content = content.replace(/<CountUp target=\{([^}]+)\} \/>/g, '<span>{$1}</span>');

  // Remove scaleX definition
  content = content.replace(/const scaleX = useScrollProgress\(\);\n?/g, '');
  content = content.replace(/const scaleX = useSpring\([^;]+;\n?/g, '');

  fs.writeFileSync(file, content);
}
console.log("CountUp replaced.");
