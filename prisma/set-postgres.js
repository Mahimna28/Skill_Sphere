const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

schema = schema.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');

fs.writeFileSync(schemaPath, schema, 'utf8');
console.log('Successfully switched Prisma provider to postgresql');
