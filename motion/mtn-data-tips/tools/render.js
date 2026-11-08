// Render index.html frame by frame (deterministic window.render(t)) and pipe to ffmpeg.
//   node tools/render.js video  out.mp4            full film, video only (audio is mixed by tools/audio.py)
//   node tools/render.js stills dir 1.2,5.5,...    PNG/JPEG stills at given times
//   node tools/render.js events out.json           dump SFX cue list + scene timings
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

(async () => {
  const [mode, out, extra] = process.argv.slice(2);
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('PAGE ERROR', e.message); });
  page.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
  await page.addInitScript(() => { window.__CAPTURE__ = true; });
  await page.goto('file://' + path.resolve(__dirname, '../index.html'));
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });
  await page.waitForFunction(() => [...document.images].every(i => i.complete));
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  const stage = await page.$('#stage');
  const info = await page.evaluate(() => ({ DURATION, FPS, TOTAL, events: SFX_EVENTS, scenes: SCENE_TIMES }));

  if (mode === 'events') {
    fs.writeFileSync(out, JSON.stringify(info, null, 1));
  } else if (mode === 'stills') {
    fs.mkdirSync(out, { recursive: true });
    for (const t of extra.split(',').map(Number)) {
      await page.evaluate(t => window.render(t), t);
      await stage.screenshot({ path: `${out}/t_${t.toFixed(2)}.jpg`, type: 'jpeg', quality: 85 });
    }
  } else if (mode === 'video') {
    const n = Math.round(info.DURATION * info.FPS);
    const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(info.FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(info.FPS), '-movflags', '+faststart', out],
      { stdio: ['pipe', 'ignore', 'inherit'] });
    const t0 = Date.now();
    for (let f = 0; f < n; f++) {
      await page.evaluate(t => window.render(t), f / info.FPS);
      const buf = await stage.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 90 === 0) process.stderr.write(`frame ${f}/${n}  ${((Date.now() - t0) / 1000).toFixed(0)}s\n`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
