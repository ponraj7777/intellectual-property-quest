const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'src/pages/AdminDashboard.jsx',
  'src/pages/AdminLogin.jsx',
  'src/pages/QuestionManager.jsx'
];

const basePath = process.cwd();

// Order matters: replace longer classes first to prevent partial matches
const replacements = [
  { regex: /\btext-quest-text-dim\b/g, replacement: 'text-quest-muted' },
  { regex: /\btext-white(?!\/)\b/g, replacement: 'text-quest-text' },
  { regex: /\bbg-white\/5\b/g, replacement: 'dark:bg-white/5 bg-black/5' },
  { regex: /\bbg-white\/10\b/g, replacement: 'dark:bg-white/10 bg-black/10' },
  { regex: /\bborder-white\/10\b/g, replacement: 'dark:border-white/10 border-black/10' },
  { regex: /\bborder-white\/20\b/g, replacement: 'dark:border-white/20 border-black/20' },
  { regex: /\bdivide-white\/5\b/g, replacement: 'dark:divide-white/5 divide-black/5' },
  { regex: /\bbg-\[\#1a1a1a\]\b/g, replacement: 'bg-quest-card text-quest-text' },
  { regex: /\bhover:bg-white\/5\b/g, replacement: 'hover:bg-black/5 dark:hover:bg-white/5' },
  { regex: /\bhover:bg-white\/10\b/g, replacement: 'hover:bg-black/10 dark:hover:bg-white/10' },
  { regex: /\bhover:bg-white\/20\b/g, replacement: 'hover:bg-black/20 dark:hover:bg-white/20' }
];

filesToProcess.forEach(file => {
  const fullPath = path.join(basePath, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;
    
    replacements.forEach(({ regex, replacement }) => {
      content = content.replace(regex, replacement);
    });

    if (content !== original) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated ${file}`);
    } else {
      console.log(`No changes made to ${file}`);
    }
  } else {
    console.error(`File not found: ${fullPath}`);
  }
});
