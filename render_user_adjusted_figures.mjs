import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ARTIFACT_DIR = 'C:/Users/Sergio DArduini/.gemini/antigravity/brain/54b764e2-1d67-424b-bc3e-76b1f5d7b46c';
const DOCS_DIR = path.join(process.cwd(), 'docs', 'manual_images');
const COORDS_FILE = path.join(process.cwd(), 'docs', 'manual_coordinates.json');

const config = JSON.parse(fs.readFileSync(COORDS_FILE, 'utf8'));

async function run() {
  console.log('Rendering figures with user-adjusted coordinates...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  const ML = 85;
  const MT = 38;
  const totalW = ML + 412 + 85; // 582
  const totalH = MT + 892 + 38; // 968

  await page.setViewport({ width: totalW, height: totalH, deviceScaleFactor: 2 });

  for (const key of Object.keys(config)) {
    const fig = config[key];
    console.log(`Rendering ${fig.title} (${fig.filename})...`);

    // Clean screen image path
    const cleanImgPath = path.join(process.cwd(), 'docs', fig.image.replace('./', ''));
    const imgBase64 = fs.readFileSync(cleanImgPath).toString('base64');

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: ${totalW}px;
          height: ${totalH}px;
          background: #0F172A; /* dark studio background */
          overflow: hidden;
          font-family: system-ui, -apple-system, sans-serif;
          position: relative;
        }
        .phone-frame {
          position: absolute;
          left: ${ML}px;
          top: ${MT}px;
          width: 412px;
          height: 892px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.12);
        }
        .phone-frame img {
          width: 100%;
          height: 100%;
          display: block;
        }
        svg {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      <div class="phone-frame">
        <img src="data:image/png;base64,${imgBase64}">
      </div>
      <svg id="callout-svg"></svg>
    </body>
    </html>
    `;

    await page.setContent(html);

    await page.evaluate(({ fig, ML, MT }) => {
      const svg = document.getElementById('callout-svg');

      fig.items.forEach(item => {
        const tx = ML + item.tx;
        const ty = MT + item.ty;
        const bx = item.bx;
        const by = item.by;

        // 1. Leader Line Shadow
        const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        shadow.setAttribute('x1', bx);
        shadow.setAttribute('y1', by);
        shadow.setAttribute('x2', tx);
        shadow.setAttribute('y2', ty);
        shadow.setAttribute('stroke', 'rgba(0,0,0,0.6)');
        shadow.setAttribute('stroke-width', '4');
        shadow.setAttribute('stroke-linecap', 'round');
        svg.appendChild(shadow);

        // 2. Leader Line Foreground
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', bx);
        line.setAttribute('y1', by);
        line.setAttribute('x2', tx);
        line.setAttribute('y2', ty);
        line.setAttribute('stroke', fig.color);
        line.setAttribute('stroke-width', '2.2');
        line.setAttribute('stroke-linecap', 'round');
        svg.appendChild(line);

        // 3. Target Dot on the element
        const dotBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dotBg.setAttribute('cx', tx);
        dotBg.setAttribute('cy', ty);
        dotBg.setAttribute('r', '4.5');
        dotBg.setAttribute('fill', '#FFFFFF');
        dotBg.setAttribute('stroke', '#000000');
        dotBg.setAttribute('stroke-width', '1.5');
        svg.appendChild(dotBg);

        const dotFg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dotFg.setAttribute('cx', tx);
        dotFg.setAttribute('cy', ty);
        dotFg.setAttribute('r', '2.8');
        dotFg.setAttribute('fill', fig.color);
        svg.appendChild(dotFg);

        // 4. Numbered Badge in the margin
        const badgeRadius = 14;
        const bShadow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bShadow.setAttribute('cx', bx);
        bShadow.setAttribute('cy', by + 2.5);
        bShadow.setAttribute('r', badgeRadius + 1);
        bShadow.setAttribute('fill', 'rgba(0,0,0,0.5)');
        svg.appendChild(bShadow);

        const bBorder = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bBorder.setAttribute('cx', bx);
        bBorder.setAttribute('cy', by);
        bBorder.setAttribute('r', badgeRadius + 1.5);
        bBorder.setAttribute('fill', '#FFFFFF');
        svg.appendChild(bBorder);

        const bMain = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bMain.setAttribute('cx', bx);
        bMain.setAttribute('cy', by);
        bMain.setAttribute('r', badgeRadius);
        bMain.setAttribute('fill', fig.color);
        svg.appendChild(bMain);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', bx);
        text.setAttribute('y', by + 4.5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#FFFFFF');
        text.setAttribute('font-size', '12px');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
        text.textContent = item.num;
        svg.appendChild(text);
      });
    }, { fig, ML, MT });

    const p1 = path.join(ARTIFACT_DIR, fig.filename);
    const p2 = path.join(DOCS_DIR, fig.filename);
    await page.screenshot({ path: p1 });
    fs.copyFileSync(p1, p2);
    console.log(`Saved ${fig.filename} to both artifact and docs!`);
  }

  await browser.close();
  console.log('All 7 figures rendered and saved with user adjustments!');
}

run().catch(console.error);
