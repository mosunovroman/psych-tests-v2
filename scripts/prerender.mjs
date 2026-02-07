#!/usr/bin/env node
/**
 * Prerender script for generating static HTML pages
 * Run after build: node scripts/prerender.mjs
 *
 * This improves SEO by creating pre-rendered HTML for search engines
 */

import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

// Routes to prerender
const routes = [
  '/',
  '/tests',
  '/relax',
  '/mood',
  '/history',
  '/progress',
  '/nutrition',
  '/nutrition/calculator',
  '/nutrition/diary',
  '/nutrition/recipes',
  '/tests/phq9',
  '/tests/gad7',
  '/tests/mbti',
  '/tests/big5',
  '/tests/iq',
  '/tests/eq',
  '/tests/rorschach',
  '/tests/rosenberg',
  '/tests/pss',
  '/tests/who5',
  '/tests/bdi2',
  '/tests/eqi',
  '/tests/mdq',
  '/tests/bpd',
  '/tests/ptsd',
  '/tests/schizophrenia'
];

// Simple static file server
function createStaticServer(port) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let filePath = join(distDir, req.url === '/' ? 'index.html' : req.url);

      // SPA fallback
      if (!existsSync(filePath) || !filePath.includes('.')) {
        filePath = join(distDir, 'index.html');
      }

      try {
        const content = readFileSync(filePath);
        const ext = filePath.split('.').pop();
        const contentTypes = {
          html: 'text/html',
          js: 'application/javascript',
          css: 'text/css',
          svg: 'image/svg+xml',
          json: 'application/json'
        };
        res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
        res.end(content);
      } catch (e) {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(port, () => {
      console.log(`Static server running on http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function prerender() {
  const port = 4173;
  const server = await createStaticServer(port);

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const route of routes) {
    console.log(`Prerendering: ${route}`);

    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}${route}`, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for React to render
    await page.waitForSelector('#root > *', { timeout: 10000 });

    // Get the rendered HTML
    const html = await page.content();

    // Determine output path
    const outputPath = route === '/'
      ? join(distDir, 'index.html')
      : join(distDir, route, 'index.html');

    // Create directory if needed
    const outputDir = dirname(outputPath);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Write the prerendered HTML
    writeFileSync(outputPath, html);
    console.log(`  -> Saved: ${outputPath}`);

    await page.close();
  }

  await browser.close();
  server.close();

  console.log('\nPrerendering complete!');
  console.log(`Prerendered ${routes.length} routes.`);
}

prerender().catch(console.error);
