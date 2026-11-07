// Génère guide-vibe-motion-design-a-z.pdf : couverture pleine page + contenu numéroté.
// Usage : node generer-pdf.js   (depuis le dossier guide-a-z ; nécessite Playwright et pdfunite)
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
(async () => {
  const dir = __dirname;
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + path.join(dir, 'index.html'), { waitUntil: 'networkidle' });
  await p.emulateMedia({ media: 'print', colorScheme: 'light' });
  const base = { format: 'A4', printBackground: true, preferCSSPageSize: true };
  const cover = path.join(dir, '.couverture.pdf'), body = path.join(dir, '.contenu.pdf');
  await p.pdf({ ...base, path: cover, pageRanges: '1' });
  await p.pdf({ ...base, path: body, pageRanges: '2-', displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="font-size:8px;width:100%;text-align:center;color:#888;font-family:Inter,sans-serif">Réaliser le vibe motion design pas à pas avec Claude Code · AroSoft — <span class="pageNumber"></span></div>' });
  await b.close();
  execFileSync('pdfunite', [cover, body, path.join(dir, 'guide-vibe-motion-design-a-z.pdf')]);
  execFileSync('rm', ['-f', cover, body]);
})();
