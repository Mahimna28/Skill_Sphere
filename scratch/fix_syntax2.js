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

  // Fix broken leftovers
  content = content.replace(/\}\s*:\s*false\}/g, '');
  content = content.replace(/\}\s*:\s*\{\}\}/g, '');
  content = content.replace(/\s*:\s*false\}/g, '');
  content = content.replace(/\s*:\s*\{\}\}/g, '');

  content = content.replace(/,\s*ease:\s*config\.ease\s*\}/g, '');
  content = content.replace(/,\s*boxShadow:\s*"[^"]+"\s*\}/g, '');
  content = content.replace(/,\s*y:\s*[-0-9]+\s*\}/g, '');
  
  // also clean up any lone `}` on lines by themselves that look like errors
  // but be careful not to break valid blocks.
  
  // Let's just fix the specific leftovers:
  content = content.replace(/\} \? \{ opacity: 1, y: 0 \} : false/g, '');
  content = content.replace(/\} \? \{ opacity: 0, y: -10 \} : false/g, '');
  
  // actually, many lines might look like:
  // `             : false}`
  // Let's remove any line that is just whitespace and `: false}` or `: {}}`
  const lines = content.split('\n');
  const fixedLines = [];
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    // if line matches things like `} : false}` or just `: false}` etc
    if (line.match(/^\s*(?:(?:[a-zA-Z0-9_]+\.)?[a-zA-Z0-9_]+)?\s*:?\s*(?:false|\{\})\s*\}?\s*$/)) {
      // skip it
      continue;
    }
    // Also skip `} : {}}` or similar
    if (line.match(/^\s*\}\s*:\s*(?:false|\{\})\s*\}\s*$/)) {
      continue;
    }
    // And `? { opacity: 0, scale: 0.95 } : false}` where `initial={` was stripped
    if (line.match(/^\s*\?\s*\{[^}]+\}\s*:\s*(?:false|\{\})\s*\}\s*$/)) {
      continue;
    }
    // And `, ease: config.ease }`
    if (line.match(/^\s*,\s*ease:\s*config\.ease\s*\}\s*$/)) {
      continue;
    }
    fixedLines.push(line);
  }
  
  content = fixedLines.join('\n');
  
  // also replace any remaining `<div >` or similar with `<div>`
  content = content.replace(/<div\s+>/g, '<div>');
  content = content.replace(/<span\s+>/g, '<span>');
  
  fs.writeFileSync(file, content);
}
console.log("Fixed lines.");
