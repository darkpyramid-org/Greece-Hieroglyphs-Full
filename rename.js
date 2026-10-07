const fs = require('fs');
const path = require('path');

const replacements = [
  // Casing specific
  { regex: /GREECE/g, replacement: 'GREECE' }, // GREECE for simplicity
  { regex: /Greece Hieroglyphs/g, replacement: 'Greece Hieroglyphs' },
  { regex: /Greece/g, replacement: 'Greece' },
  { regex: /greece-mobile/g, replacement: 'greece-mobile' },
  { regex: /greece-hieroglyphs-full/g, replacement: 'greece-hieroglyphs-full' },
  { regex: /greece-hieroglyphs.com/g, replacement: 'greece-hieroglyphs.com' },
  { regex: /greece-hieroglyphs.com/g, replacement: 'greece-hieroglyphs.com' },
  { regex: /greece/g, replacement: 'greece' },
  { regex: /جريس/g, replacement: 'جريس' }
];

const ignoreDirs = ['.git', 'node_modules', 'dist', '.expo', 'agent'];

function walkAndReplace(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!ignoreDirs.includes(file)) {
        walkAndReplace(fullPath);
      }
    } else {
      if (
        fullPath.endsWith('.ts') ||
        fullPath.endsWith('.tsx') ||
        fullPath.endsWith('.js') ||
        fullPath.endsWith('.md') ||
        fullPath.endsWith('.json') ||
        fullPath.endsWith('.css') ||
        fullPath.endsWith('.html') ||
        fullPath.endsWith('.yaml') ||
        fullPath.endsWith('.yml')
      ) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;
        
        for (const { regex, replacement } of replacements) {
          if (regex.test(content)) {
            content = content.replace(regex, replacement);
            modified = true;
          }
        }
        
        if (modified) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Updated ${fullPath}`);
        }
      }
    }
  }
}

walkAndReplace(__dirname);
