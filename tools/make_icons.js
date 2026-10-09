// Renders the Little Fishing web/PWA icons (bear cub in the yellow sun hat over sky + water) as opaque PNGs.
// Usage: npm i puppeteer-core && node tools/make_icons.js   (needs Google Chrome; CHROME env var overrides the path)
// Then flatten to RGB (no alpha): python3 tools/flatten_png.py
const puppeteer = require('puppeteer-core');
const fs = require('fs'), path = require('path');
const PAGE = `<!doctype html><canvas id=c></canvas><script>
const TAU = Math.PI * 2;
function bg(g) {           // 108x108 units: sky, sun, water with a wave (same as the vector background)
  g.fillStyle = '#8ED8FF'; g.fillRect(0, 0, 108, 108);
  g.fillStyle = '#FFE066'; g.beginPath(); g.arc(84, 24, 10, 0, TAU); g.fill();
  g.fillStyle = '#FFFFFF'; for (const [x, y, r] of [[18, 28, 6], [25, 25, 8], [33, 28, 6]]) { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
  g.fillStyle = '#3BA9F0'; g.beginPath(); g.moveTo(0, 70); g.bezierCurveTo(18, 64, 36, 76, 54, 70); g.bezierCurveTo(72, 64, 90, 76, 108, 70); g.lineTo(108, 108); g.lineTo(0, 108); g.closePath(); g.fill();
  g.fillStyle = '#2B8FDB'; g.beginPath(); g.moveTo(0, 88); g.bezierCurveTo(18, 83, 36, 93, 54, 88); g.bezierCurveTo(72, 83, 90, 93, 108, 88); g.lineTo(108, 108); g.lineTo(0, 108); g.closePath(); g.fill();
}
function bear(g, mono) {   // foreground: bear cub head + vest, centred in the adaptive-icon safe zone
  const R = 20, x = 54, y = 57, fur = mono ? '#000' : '#C68E5F', C = c => mono ? '#000' : c;
  g.fillStyle = C('#FF9F43'); g.beginPath(); g.moveTo(x - 24, 108); g.lineTo(x - 22, y + 24); g.quadraticCurveTo(x, y + 12, x + 22, y + 24); g.lineTo(x + 24, 108); g.closePath(); g.fill();
  if (!mono) { g.fillStyle = '#FFE08A'; g.fillRect(x - 13, y + 18, 5, 40); g.fillRect(x + 8, y + 18, 5, 40); }
  g.fillStyle = fur; g.beginPath(); g.arc(x, y, R, 0, TAU); g.fill();
  if (!mono) { g.strokeStyle = '#9A6A43'; g.lineWidth = 1.2; g.stroke(); }
  const cut = mono ? (fn => { g.save(); g.globalCompositeOperation = 'destination-out'; fn(); g.restore(); }) : (fn => fn());
  if (!mono) { g.fillStyle = '#F6DEC4'; g.beginPath(); g.ellipse(x, y + 6.5, 9.5, 7, 0, 0, TAU); g.fill();
    g.fillStyle = 'rgba(255,120,150,.5)'; g.beginPath(); g.ellipse(x - 12, y + 5, 3.6, 2.2, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(x + 12, y + 5, 3.6, 2.2, 0, 0, TAU); g.fill(); }
  cut(() => { g.fillStyle = '#3a2418'; g.beginPath(); g.ellipse(x, y + 3, 3.2, 2.2, 0, 0, TAU); g.fill();
    for (const ex of [x - 7, x + 7]) { g.beginPath(); g.arc(ex, y - 2, 2.4, 0, TAU); g.fill(); }
    g.strokeStyle = '#3a2418'; g.lineWidth = 1.5; g.lineCap = 'round'; g.beginPath(); g.arc(x, y + 6.5, 3.2, .15 * Math.PI, .85 * Math.PI); g.stroke(); });
  if (!mono) { g.fillStyle = '#fff'; for (const ex of [x - 7, x + 7]) { g.beginPath(); g.arc(ex + .9, y - 2.9, .9, 0, TAU); g.fill(); } }
  // sun hat with ears poking out
  g.fillStyle = C('#FFD43B'); g.beginPath(); g.moveTo(x - 17, y - 10); g.bezierCurveTo(x - 16.5, y - 27.5, x + 16.5, y - 27.5, x + 17, y - 10); g.closePath(); g.fill();
  for (const sx of [-1, 1]) { g.fillStyle = fur; g.beginPath(); g.arc(x + sx * 11, y - 20.5, 5, 0, TAU); g.fill();
    if (!mono) { g.fillStyle = '#F4B6A6'; g.beginPath(); g.arc(x + sx * 11, y - 20, 2.5, 0, TAU); g.fill(); } }
  if (!mono) { g.fillStyle = '#FF6B6B'; g.beginPath(); g.roundRect(x - 16.4, y - 14, 32.8, 3.6, 1.8); g.fill(); }
  g.fillStyle = C('#FFC300'); g.beginPath(); g.ellipse(x, y - 10.4, 25.6, 4.8, 0, 0, TAU); g.fill();
}
function render(px, kind) {
  const c = document.getElementById('c'); c.width = c.height = px; const g = c.getContext('2d');
  g.fillStyle = '#8ED8FF'; g.fillRect(0, 0, px, px);
  if (kind === 'maskable') { g.scale(px / 108, px / 108); }          // full 108-unit art, bear inside the safe zone
  else { const k = px / 76; g.scale(k, k); g.translate(-16, -16); } // zoomed like the launcher icon
  bg(g); bear(g, false);
  return c.toDataURL('image/png');
}
</script>`;
(async () => {
  const b = await puppeteer.launch({executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox']});
  const p = await b.newPage(); await p.setContent(PAGE);
  const out = async (file, px, kind) => { const d = await p.evaluate((px, kind) => render(px, kind), px, kind);
    fs.writeFileSync(path.join(__dirname, '..', file), Buffer.from(d.split(',')[1], 'base64')); };
  await out('apple-touch-icon.png', 180, 'any');
  await out('icon-192.png', 192, 'any');
  await out('icon-512.png', 512, 'any');
  await out('icon-maskable-512.png', 512, 'maskable');
  await out('favicon-32.png', 32, 'any');
  await b.close(); console.log('icons written');
})();
