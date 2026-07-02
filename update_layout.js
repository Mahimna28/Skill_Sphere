const fs = require('fs');

let code = fs.readFileSync('src/app/dashboard/layout.tsx', 'utf8');

// 1. Remove the if (userRole === "student")
code = code.replace(/if\s*\(userRole\s*===\s*"student"\)\s*\{/, '');

// 2. Fix name fallback
code = code.replace(/\{userData\?\.name \|\| "Student User"\}/, '{userData?.name || "User"}');

// 3. Fix the hardcoded STUDENT badge
code = code.replace(
  /<span className="bg-\[rgba\(201,169,110,0\.15\)\] text-\[#C9A96E\] text-\[11px\] px-2\.5 py-1 rounded-full uppercase tracking-wider font-semibold">\s*STUDENT\s*<\/span>/g,
  '<span className="bg-[rgba(201,169,110,0.15)] text-[#C9A96E] text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">{userRole === "institute_admin" ? "INSTITUTE ADMIN" : userRole === "superadmin" ? "SUPER ADMIN" : userRole?.toUpperCase()}</span>'
);

// 4. Remove everything from the end of the premium layout to the end of the file
const endIndex = code.indexOf('    );\n  }\n\n  return (');
if (endIndex !== -1) {
  code = code.substring(0, endIndex) + '    );\n}\n';
}

fs.writeFileSync('src/app/dashboard/layout.tsx', code);
console.log("Updated layout.tsx successfully");
