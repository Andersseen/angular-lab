/**
 * Generate public/robots.txt and public/sitemap.xml from the mission catalog.
 * Run automatically as part of `pnpm build:prod` so new missions are picked up
 * without a manual step (see context.md "Adding a New Mission").
 *
 * Loads src/content/missions/index.ts through a throwaway Vite server (no
 * project config) so the TypeScript content module can be read without
 * depending on a specific Node TS-execution flag or extra dependency.
 */
import { writeFile } from 'node:fs/promises';
import { createServer } from 'vite';

const SITE_URL = 'https://angular-lab.pages.dev';

const DISALLOWED_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/dashboard',
];

async function loadMissionIds() {
  const server = await createServer({
    configFile: false,
    root: process.cwd(),
    logLevel: 'error',
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const mod = await server.ssrLoadModule('/src/content/missions/index.ts');
    return mod.MISSIONS.map((mission) => mission.id);
  } finally {
    await server.close();
  }
}

function buildRobotsTxt() {
  const disallow = DISALLOWED_ROUTES.map((route) => `Disallow: ${route}`).join(
    '\n'
  );
  return `User-agent: *\nAllow: /\n${disallow}\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

function buildSitemapXml(routes) {
  const urls = routes
    .map((route) => `  <url><loc>${SITE_URL}${route}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const missionIds = await loadMissionIds();
const routes = ['/', '/missions', ...missionIds.map((id) => `/mission/${id}`)];

await writeFile('public/robots.txt', buildRobotsTxt());
await writeFile('public/sitemap.xml', buildSitemapXml(routes));

console.log(
  `Generated public/robots.txt and public/sitemap.xml (${routes.length} routes).`
);
