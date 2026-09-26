// Which image is a page's share image: its own hero photo (case studies: the
// project image), else the homepage hero. Shared by assemble.mjs (og:image)
// and tools/share-images.mjs (the 1200x630 crops), so both agree.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { projects } from './site-data.mjs';

export const SHARE = { width: 1200, height: 630 };
export const shareSrc = key => `/assets/share/${key}-${SHARE.width}x${SHARE.height}.jpg`;
export const shareKey = (root, page) => (page.content.startsWith?.('project:') ? projects.find(p => p.slug === page.content.slice(8))?.image
  : (Array.isArray(page.content) ? page.content : [page.content]).map(f => { const src = readFileSync(join(root, f), 'utf8'); return src.match(/<page-hero\b[^>]*\bimage="([a-z0-9-]+)"/)?.[1] || src.match(/\{\{image:([a-z0-9-]+):hero\}\}/)?.[1]; }).find(Boolean)) || 'hero-flow';
