// Render index.html frame-by-frame and pipe to ffmpeg.
// usage: node tools/capture.js out.mp4 [audio.wav]   |   node tools/capture.js --stills 1,2.5,4 dir
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const args = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.addInitScript(() => { window.__CAPTURE__ = true; });
  await page.goto('file://' + path.resolve(__dirname, '../index.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => [...document.images].every(i => i.complete));
  const stage = await page.$('#stage');
  if (args[0] === '--stills') {
    for (const t of args[1].split(',').map(Number)) {
      await page.evaluate(t => window.render(t), t);
      await stage.screenshot({ path: `${args[2]}/still_${t}.jpg`, type: 'jpeg', quality: 85 });
    }
    await browser.close(); return;
  }
  const [out, audio] = args;
  const { DURATION, FPS } = await page.evaluate(() => ({ DURATION: window.DURATION, FPS: window.FPS }));
  const n = Math.round(DURATION * FPS);
  const ff = ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-'];
  if (audio) ff.push('-i', audio);
  ff.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart');
  if (audio) ff.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
  ff.push(out);
  const p = spawn('ffmpeg', ff, { stdio: ['pipe', 'ignore', 'inherit'] });
  for (let f = 0; f < n; f++) {
    await page.evaluate(t => window.render(t), f / FPS);
    const buf = await stage.screenshot({ type: 'jpeg', quality: 94 });
    if (!p.stdin.write(buf)) await new Promise(r => p.stdin.once('drain', r));
    if (f % 60 === 0) process.stderr.write(`frame ${f}/${n}\n`);
  }
  p.stdin.end();
  await new Promise(r => p.on('close', r));
  await browser.close();
})();
