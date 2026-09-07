// Stitches sections/*.html (sorted by filename) into index.html between the
// ASSEMBLY markers, and rewrites the css/js include lists to match the files
// present. Run after any section changes: node assemble.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const sections = readdirSync(join(root, 'sections')).filter((f) => f.endsWith('.html')).sort();
const cssFiles = readdirSync(join(root, 'css')).filter((f) => f.endsWith('.css')).sort();
const jsFiles = readdirSync(join(root, 'js')).filter((f) => f.endsWith('.js')).sort();

const body = sections.map((f) => `<!-- ${f} -->\n${readFileSync(join(root, 'sections', f), 'utf8').trim()}`).join('\n\n');
const cssTags = cssFiles.map((f) => `  <link rel="stylesheet" href="css/${f}">`).join('\n');
const jsTags = jsFiles.map((f) => `  <script defer src="js/${f}"></script>`).join('\n');

let html = readFileSync(join(root, 'index.html'), 'utf8');
const inject = (name, content) => {
  const re = new RegExp(`(<!-- ${name}:START -->)[\\s\\S]*?(<!-- ${name}:END -->)`);
  if (!re.test(html)) throw new Error(`assemble: ${name}:START/END markers not found in index.html`);
  // function replacer: a plain string here would expand $-patterns ($&, $1, …)
  // occurring in section content and silently corrupt the output
  html = html.replace(re, (_, start, end) => `${start}\n${content}\n${end}`);
};
inject('SECTIONS', body);
inject('CSS', cssTags);
inject('JS', jsTags);
writeFileSync(join(root, 'index.html'), html);
console.log(`assembled: ${sections.length} sections, ${cssFiles.length} css, ${jsFiles.length} js`);
