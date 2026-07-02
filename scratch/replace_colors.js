const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '../src'));

let modifiedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replacements
  content = content.replace(/bg-\[#22C55E\]/g, 'bg-[#C9A96E]');
  content = content.replace(/bg-green-500/g, 'bg-[#C9A96E]');
  content = content.replace(/text-\[#22C55E\]/g, 'text-[#C9A96E]');
  content = content.replace(/text-green-500/g, 'text-[#C9A96E]');
  content = content.replace(/text-green-400/g, 'text-[#C9A96E]');
  content = content.replace(/text-green-700/g, 'text-[#C9A96E]');
  content = content.replace(/border-green-500/g, 'border-[#C9A96E]');
  content = content.replace(/bg-green-100/g, 'bg-[#C9A96E]/10');
  content = content.replace(/border-green-200/g, 'border-[#C9A96E]/20');
  content = content.replace(/rgba\(34,197,94,/g, 'rgba(201,169,110,');
  content = content.replace(/hover:bg-\[#16A34A\]/g, 'hover:bg-[#B8956A]');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedFiles++;
    console.log(`Modified: ${file}`);
  }
});

console.log(`Done! Modified ${modifiedFiles} files.`);
