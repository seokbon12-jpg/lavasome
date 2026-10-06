/* ═══════════════════════════════════════════════════════════════════
   상세페이지 섹션 내보내기 — 정지 JPG + 반복 GIF

   node tools/export.mjs [출력폴더] [--fps 12] [--scale 1] [--only s01,s07]

   · 정지 이미지: 모든 섹션을 ?still 상태(움직임이 다 된 화면)로 JPG 저장
   · GIF 프레임: [data-gif] 섹션만. 실시간으로 녹화하지 않고 페이지의 CSS
     애니메이션을 전부 멈춘 뒤 currentTime 을 한 프레임씩 옮겨 가며 찍는다.
     주기(6초)를 정확히 한 바퀴 담으므로 GIF 이음매가 생기지 않는다.
   · GIF 묶기는 같은 폴더의 make-gif.py 가 한다(Pillow 필요).

   Playwright 가 필요하다: npm i -D playwright (브라우저 포함)
   ═══════════════════════════════════════════════════════════════════ */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = (await import('/opt/node22/lib/node_modules/playwright/index.js')).default); }

const here = path.dirname(fileURLToPath(import.meta.url));
const page = 'file://' + path.resolve(here, '..', 'index.html');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
// 플래그(--x 값) 쌍을 걷어 내고 남은 첫 인자가 출력 폴더
const rest = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
const out = path.resolve(rest[0] || path.resolve(here, '..', 'export'));
const FPS = +opt('--fps', 12);
const SCALE = +opt('--scale', 1);
const ONLY = (opt('--only', '') || '').split(',').filter(Boolean);
const PERIOD = 6000;                       // style.css 의 --T 와 같아야 한다

fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 860, height: 1200 }, deviceScaleFactor: SCALE });

// ① 정지 JPG
{
  const p = await ctx.newPage();
  await p.goto(page + '?still', { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  for (const id of await p.$$eval('section[id]', s => s.map(x => x.id))) {
    if (ONLY.length && !ONLY.includes(id)) continue;
    await p.locator('#' + id).screenshot({ path: path.join(out, `${id}.jpg`), type: 'jpeg', quality: 92 });
    console.log('still', id);
  }
  await p.close();
}

// ② GIF 프레임
{
  const p = await ctx.newPage();
  await p.goto(page, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  const ids = await p.$$eval('section[data-gif]', s => s.map(x => x.id));
  const n = Math.round(PERIOD / 1000 * FPS);
  for (const id of ids) {
    if (ONLY.length && !ONLY.includes(id)) continue;
    const dir = path.join(out, `${id}-frames`);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir);
    await p.locator('#' + id).scrollIntoViewIfNeeded();
    for (let f = 0; f < n; f++) {
      await p.evaluate(t => document.getAnimations().forEach(a => { a.pause(); a.currentTime = t; }), f * PERIOD / n);
      await p.locator('#' + id).screenshot({ path: path.join(dir, String(f).padStart(3, '0') + '.png') });
    }
    console.log('frames', id, n);
    try {
      execFileSync('python3', ['-I', path.join(here, 'make-gif.py'), dir, path.join(out, `${id}.gif`), String(Math.round(1000 / FPS))], { stdio: 'inherit' });
    } catch { console.log('  (GIF 묶기는 건너뜀 — python3 + Pillow 필요)'); }
  }
  await p.close();
}
await browser.close();
