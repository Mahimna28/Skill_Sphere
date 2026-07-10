const fs = require('fs');
const path = require('path');

const classesDir = path.join(process.cwd(), 'src', 'app', 'api', 'classes');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.isFile() && entry.name === 'route.ts') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Skip if already processed (checkClassAccess is imported)
      if (content.includes('checkClassAccess')) continue;
      
      let modified = false;

      // Add import if needed
      if (content.includes('verifyToken')) {
        content = content.replace(
          'import { verifyToken } from "@/lib/auth";',
          'import { verifyToken } from "@/lib/auth";\nimport { checkClassAccess } from "@/lib/classroom";'
        );
      }

      // Find blocks checking isTeacher and add checkClassAccess
      const regex = /(const decoded:[^\n]*\n\s*if \(!decoded \|\| !isTeacher\(decoded\.role\)\) return NextResponse\.json\(\{ message: "Unauthorized" \}, \{ status: 401 \}\);)/g;
      
      content = content.replace(regex, (match) => {
        modified = true;
        
        // Ensure courseId is extracted if not already done before this point
        // Usually it's: const { id: courseId } = await params; before or after.
        // If it's before, we can just use courseId.
        
        return match + '\n\n    const courseIdForAccess = (await params).id;\n    const canEdit = await checkClassAccess(courseIdForAccess, decoded.id);\n    if (!canEdit) return NextResponse.json({ message: "Forbidden" }, { status: 403 });';
      });

      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(classesDir);
