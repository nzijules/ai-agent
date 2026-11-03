const { chromium } = require('playwright');
const { spawn } = require('child_process');
(async () => {
  const [hash, out, page] = process.argv.slice(2);
  const fps = 25, b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + process.cwd() + '/' + (page || 'full.html') + hash);
  await p.waitForTimeout(3000);
  const ff = spawn('ffmpeg', ['-loglevel','error','-y','-f','image2pipe','-framerate',String(fps),'-c:v','mjpeg','-i','-','-c:v','libx264','-profile:v','high','-pix_fmt','yuv420p','-crf','19','-preset','medium','-r','25','-movflags','+faststart',out], { stdio: ['pipe','inherit','inherit'] });
  const n = Math.round(await p.evaluate(() => window.__DUR) * fps);
  for (let i = 0; i < n; i++) {
    await p.evaluate(tt => window.__render(tt), i / fps);
    const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('done', out);
})();
