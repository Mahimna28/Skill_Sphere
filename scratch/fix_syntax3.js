const fs = require('fs');

const files = [
  "src/app/about/AboutPageClient.tsx",
  "src/app/blog/BlogPageClient.tsx"
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Fix leftovers line by line
  const lines = content.split('\n');
  const fixedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // If line is just `}` or ` }` or `   }`
    if (line.match(/^\s*\}\s*$/)) {
      continue;
    }
    
    // If line has `: { scale: 0 }}` etc
    if (line.match(/^\s*:\s*\{[^}]+\}\s*\}\s*$/)) {
      continue;
    }

    // If line has `: { opacity: 0, x: isLeft ? -40 : 40 }}`
    if (line.match(/^\s*:\s*\{.*\}\}\s*$/)) {
      continue;
    }

    fixedLines.push(line);
  }
  
  content = fixedLines.join('\n');
  fs.writeFileSync(file, content);
}
console.log("Fixed final syntax errors.");
