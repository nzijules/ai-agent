// Usage : node render.js <html> <out.mp4> <durs> [fps] [maxSeconds]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
(async () => {
  const [html, out, durs, fpsArg, maxArg] = process.argv.slice(2);
  const fps = +(fpsArg || 30);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5, colorScheme: 'dark' });
  p.on('pageerror', e => console.error('pageerror', e.message));
  await p.goto(`file://${html}?render&durs=${durs}`);
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => window.__ready);
  const total = await p.evaluate(() => window.__totalMs);
  const frames = Math.floor(Math.min(total / 1000, +(maxArg || 1e9)) * fps);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = 0; i < frames; i++) {
    if (i > 0) await p.evaluate(ms => window.__advance(ms), 1000 / fps);
    const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`frame ${i}/${frames} — ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('total ms', total, 'frames', frames);
  await b.close();
})();
