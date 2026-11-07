// Génère vibe-motion-design-claude-code.pdf : couverture pleine page (sans pied de page) + contenu numéroté.
// Usage : node generer-pdf.js <chemin absolu index.html> couverture.pdf contenu.pdf
//         puis : pdfunite couverture.pdf contenu.pdf vibe-motion-design-claude-code.pdf
const { chromium } = require('playwright');
const [,, html, coverOut, bodyOut] = process.argv;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + html, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.querySelectorAll('details').forEach(d => d.open = true));
  await p.emulateMedia({ media: 'print', colorScheme: 'light' });
  const base = { format: 'A4', printBackground: true, preferCSSPageSize: true };
  await p.pdf({ ...base, path: coverOut, pageRanges: '1' });
  await p.pdf({ ...base, path: bodyOut, pageRanges: '2-', displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="font-size:8px;width:100%;text-align:center;color:#888;font-family:Inter,sans-serif">Vibe Motion Design avec Claude Code — <span class="pageNumber"></span></div>' });
  await b.close();
})();
