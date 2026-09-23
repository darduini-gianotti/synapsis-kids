import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ARTIFACT_DIR = 'C:/Users/Sergio DArduini/.gemini/antigravity/brain/54b764e2-1d67-424b-bc3e-76b1f5d7b46c';
const DOCS_DIR = path.join(process.cwd(), 'docs', 'manual_images');

if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

async function run() {
  console.log('Launching browser for studio annotations...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 892, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  console.log('Opening app...');
  await page.goto('https://synapsis-kids.vercel.app', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Helper to composite image + gutters + SVG badges
  async function compositeAndSave(screenBase64, callouts, filename) {
    const compPage = await browser.newPage();
    const ML = 85; // margin left
    const MR = 85; // margin right
    const MT = 38; // margin top
    const MB = 38; // margin bottom
    const totalW = ML + 412 + MR; // 582
    const totalH = MT + 892 + MB; // 968

    await compPage.setViewport({ width: totalW, height: totalH, deviceScaleFactor: 2 });

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
        <img src="data:image/png;base64,${screenBase64}">
      </div>
      <svg id="callout-svg"></svg>
    </body>
    </html>
    `;

    await compPage.setContent(html);

    // Render SVG callouts inside composite page
    await compPage.evaluate(({ callouts, ML, MT, totalW, totalH }) => {
      const svg = document.getElementById('callout-svg');

      for (const c of callouts) {
        if (!c || c.targetX === undefined || c.targetY === undefined) continue;

        // Target coordinates in composite canvas
        const tx = ML + c.targetX;
        const ty = MT + c.targetY;

        let bx = c.badgeX;
        let by = c.badgeY;

        // Auto placement if not given
        if (c.side === 'left') {
          bx = 42;
          by = ty + (c.offsetY || 0);
        } else if (c.side === 'right') {
          bx = totalW - 42;
          by = ty + (c.offsetY || 0);
        } else if (c.side === 'top') {
          bx = tx + (c.offsetX || 0);
          by = 18;
        } else if (c.side === 'bottom') {
          bx = tx + (c.offsetX || 0);
          by = totalH - 18;
        }

        const color = c.color || '#4F46E5';

        // 1. Leader Line
        const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        shadow.setAttribute('x1', bx);
        shadow.setAttribute('y1', by);
        shadow.setAttribute('x2', tx);
        shadow.setAttribute('y2', ty);
        shadow.setAttribute('stroke', 'rgba(0,0,0,0.6)');
        shadow.setAttribute('stroke-width', '4');
        shadow.setAttribute('stroke-linecap', 'round');
        svg.appendChild(shadow);

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', bx);
        line.setAttribute('y1', by);
        line.setAttribute('x2', tx);
        line.setAttribute('y2', ty);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', '2.2');
        line.setAttribute('stroke-linecap', 'round');
        svg.appendChild(line);

        // 2. Target dot on the element's border (clean small pin, does not hide content)
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
        dotFg.setAttribute('fill', color);
        svg.appendChild(dotFg);

        // 3. Numbered Badge (completely outside in gutter, never clipped)
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
        bMain.setAttribute('fill', color);
        svg.appendChild(bMain);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', bx);
        text.setAttribute('y', by + 4.5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#FFFFFF');
        text.setAttribute('font-size', '12px');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
        text.textContent = c.num;
        svg.appendChild(text);
      }
    }, { callouts, ML, MT, totalW, totalH });

    const p1 = path.join(ARTIFACT_DIR, filename);
    const p2 = path.join(DOCS_DIR, filename);
    await compPage.screenshot({ path: p1 });
    fs.copyFileSync(p1, p2);
    console.log(`Saved ${filename} with outer gutters to artifact and docs!`);
    await compPage.close();
  }

  // ==========================================
  // FIGURA 1: TELA PRINCIPAL (15 pontos)
  // ==========================================
  console.log('Capturing Screen 1 data...');
  await page.evaluate(() => {
    const tues = document.querySelector('#day-tab-2');
    if (tues) tues.click();
    const listBtn = document.querySelector('#view-mode-list-btn');
    if (listBtn) listBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const screen1Data = await page.evaluate(() => {
    function getBorderPoint(el, anchor = 'left') {
      if (!el) return { x: 206, y: 400 };
      const r = el.getBoundingClientRect();
      let x = r.left + r.width / 2;
      let y = r.top + r.height / 2;
      if (anchor === 'left') { x = r.left; y = r.top + r.height / 2; }
      if (anchor === 'right') { x = r.right; y = r.top + r.height / 2; }
      if (anchor === 'top') { x = r.left + r.width / 2; y = r.top; }
      if (anchor === 'bottom') { x = r.left + r.width / 2; y = r.bottom; }
      return { x, y };
    }

    return {
      h1: getBorderPoint(document.querySelector('header h1, header span.font-bold'), 'left'),
      progress: getBorderPoint(Array.from(document.querySelectorAll('header *')).find(e => e.textContent && e.textContent.includes('/') && e.children.length === 0) || document.querySelector('header span[class*="text-xs"]'), 'right'),
      newTask: getBorderPoint(document.querySelector('#header-new-task-btn'), 'left'),
      themeBtn: getBorderPoint(document.querySelector('#quick-theme-toggle-btn'), 'top'),
      soundBtn: getBorderPoint(Array.from(document.querySelectorAll('header button')).find(b => b.title && b.title.includes('Som')) || document.querySelectorAll('header button')[2], 'top'),
      lockBtn: getBorderPoint(document.querySelector('#parent-lock-status-btn'), 'top'),
      settingsBtn: getBorderPoint(document.querySelector('#open-settings-modal-btn'), 'right'),
      templatesBtn: getBorderPoint(document.querySelector('#open-clinical-templates-btn'), 'left'),
      shareBtn: getBorderPoint(document.querySelector('#open-share-routine-btn'), 'left'),
      calBtn: getBorderPoint(document.querySelector('#open-export-calendar-btn'), 'right'),
      copyBtn: getBorderPoint(document.querySelector('#open-copy-routine-modal-btn'), 'right'),
      dayTab: getBorderPoint(document.querySelector('#day-tab-2'), 'left'),
      viewBoard: getBorderPoint(document.querySelector('#view-mode-board-btn'), 'right'),
      firstThen: getBorderPoint(Array.from(document.querySelectorAll('*')).find(e => e.textContent && e.textContent.includes('Primeiro') && e.textContent.includes('Depois') && e.classList.contains('rounded-2xl')), 'left'),
      firstCard: getBorderPoint(document.querySelector('#task-card-task-1') || document.querySelectorAll('.space-y-3 > div')[1], 'left'),
    };
  });

  const screen1Shot = await page.screenshot({ encoding: 'base64' });

  const fig1Callouts = [
    { num: 1, targetX: screen1Data.h1.x, targetY: screen1Data.h1.y, side: 'left', color: '#4F46E5' },
    { num: 2, targetX: screen1Data.progress.x, targetY: screen1Data.progress.y, side: 'right', color: '#4F46E5' },
    { num: 3, targetX: screen1Data.newTask.x, targetY: screen1Data.newTask.y, side: 'left', color: '#4F46E5' },
    { num: 4, targetX: screen1Data.themeBtn.x, targetY: screen1Data.themeBtn.y, side: 'top', color: '#4F46E5' },
    { num: 5, targetX: screen1Data.soundBtn.x, targetY: screen1Data.soundBtn.y, side: 'top', color: '#4F46E5' },
    { num: 6, targetX: screen1Data.lockBtn.x, targetY: screen1Data.lockBtn.y, side: 'top', color: '#4F46E5' },
    { num: 7, targetX: screen1Data.settingsBtn.x, targetY: screen1Data.settingsBtn.y, side: 'right', color: '#4F46E5' },
    { num: 8, targetX: screen1Data.templatesBtn.x, targetY: screen1Data.templatesBtn.y, side: 'left', color: '#4F46E5' },
    { num: 9, targetX: screen1Data.shareBtn.x, targetY: screen1Data.shareBtn.y, badgeX: 180, badgeY: 198, color: '#4F46E5' },
    { num: 10, targetX: screen1Data.calBtn.x, targetY: screen1Data.calBtn.y, side: 'right', offsetY: -12, color: '#4F46E5' },
    { num: 11, targetX: screen1Data.copyBtn.x, targetY: screen1Data.copyBtn.y, side: 'right', offsetY: 16, color: '#4F46E5' },
    { num: 12, targetX: screen1Data.dayTab.x, targetY: screen1Data.dayTab.y, side: 'left', color: '#4F46E5' },
    { num: 13, targetX: screen1Data.viewBoard.x, targetY: screen1Data.viewBoard.y, side: 'right', color: '#4F46E5' },
    { num: 14, targetX: screen1Data.firstThen.x, targetY: screen1Data.firstThen.y, side: 'left', color: '#4F46E5' },
    { num: 15, targetX: screen1Data.firstCard.x, targetY: screen1Data.firstCard.y, side: 'left', color: '#4F46E5' },
  ];

  await compositeAndSave(screen1Shot, fig1Callouts, 'manual_figura_1_tela_principal.png');

  // ==========================================
  // FIGURA 2: MODO TEA & PRANCHA (7 pontos)
  // ==========================================
  console.log('Capturing Screen 2 data...');
  await page.evaluate(() => {
    const boardBtn = document.querySelector('#view-mode-board-btn');
    if (boardBtn) boardBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  const screen2Data = await page.evaluate(() => {
    function getBorderPoint(el, anchor = 'left') {
      if (!el) return { x: 206, y: 400 };
      const r = el.getBoundingClientRect();
      let x = r.left + r.width / 2;
      let y = r.top + r.height / 2;
      if (anchor === 'left') { x = r.left; y = r.top + r.height / 2; }
      if (anchor === 'right') { x = r.right; y = r.top + r.height / 2; }
      if (anchor === 'top') { x = r.left + r.width / 2; y = r.top; }
      if (anchor === 'bottom') { x = r.left + r.width / 2; y = r.bottom; }
      return { x, y };
    }

    const firstCard = document.querySelectorAll('#pecs-cards-grid > div')[0];

    return {
      selectorMode: getBorderPoint(document.querySelector('#view-mode-board-btn'), 'left'),
      teaBadge: getBorderPoint(Array.from(document.querySelectorAll('*')).find(e => e.textContent && e.textContent.includes('Modo TEA') && e.children.length === 0), 'right'),
      time: getBorderPoint(firstCard?.querySelector('span.font-mono, span.font-bold, .text-xs, [class*="mono"]') || firstCard?.firstElementChild?.firstElementChild, 'left'),
      sound: getBorderPoint(firstCard?.querySelector('button[title*="Ouvir"], button'), 'right'),
      icon: getBorderPoint(firstCard?.querySelector('img, svg, .text-5xl, .text-6xl, .my-auto') || firstCard?.children[1] || firstCard, 'left'),
      title: getBorderPoint(firstCard?.querySelector('h3, h4, .font-bold.text-lg, .font-bold') || firstCard?.children[2] || firstCard, 'left'),
      doneBtn: getBorderPoint(firstCard?.querySelector('button[title*="Concluir"], button:last-child'), 'bottom'),
    };
  });

  const screen2Shot = await page.screenshot({ encoding: 'base64' });

  const fig2Callouts = [
    { num: 1, targetX: screen2Data.selectorMode.x, targetY: screen2Data.selectorMode.y, side: 'left', color: '#059669' },
    { num: 2, targetX: screen2Data.teaBadge.x, targetY: screen2Data.teaBadge.y, side: 'right', color: '#059669' },
    { num: 3, targetX: screen2Data.time.x, targetY: screen2Data.time.y, side: 'left', color: '#059669' },
    { num: 4, targetX: screen2Data.sound.x, targetY: screen2Data.sound.y, side: 'right', color: '#059669' },
    { num: 5, targetX: screen2Data.icon.x, targetY: screen2Data.icon.y, side: 'left', color: '#059669' },
    { num: 6, targetX: screen2Data.title.x, targetY: screen2Data.title.y, side: 'left', color: '#059669' },
    { num: 7, targetX: screen2Data.doneBtn.x, targetY: screen2Data.doneBtn.y, side: 'bottom', color: '#059669' },
  ];

  await compositeAndSave(screen2Shot, fig2Callouts, 'manual_figura_2_prancha_tea.png');

  // ==========================================
  // FIGURA 3: MODAL DE FOCO NA ATIVIDADE (8 pontos)
  // ==========================================
  console.log('Capturing Screen 3 data...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#pecs-cards-grid > div'));
    const target = cards.find(c => c.textContent && c.textContent.includes('Banheiro')) || cards[1];
    if (target) target.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  const screen3Data = await page.evaluate(() => {
    function getBorderPoint(el, anchor = 'left') {
      if (!el) return { x: 206, y: 400 };
      const r = el.getBoundingClientRect();
      let x = r.left + r.width / 2;
      let y = r.top + r.height / 2;
      if (anchor === 'left') { x = r.left; y = r.top + r.height / 2; }
      if (anchor === 'right') { x = r.right; y = r.top + r.height / 2; }
      if (anchor === 'top') { x = r.left + r.width / 2; y = r.top; }
      if (anchor === 'bottom') { x = r.left + r.width / 2; y = r.bottom; }
      return { x, y };
    }

    return {
      backBtn: getBorderPoint(document.querySelector('#large-card-focus-modal button[aria-label="Fechar"], #large-card-focus-modal button'), 'left'),
      time: getBorderPoint(document.querySelector('#large-card-focus-modal span.font-mono, #large-card-focus-modal .text-amber-500, #large-card-focus-modal .text-sm'), 'right'),
      iconBox: getBorderPoint(document.querySelector('#large-card-focus-modal button.p-6, #large-card-focus-modal .text-7xl, #large-card-focus-modal .text-8xl')?.closest('button') || document.querySelector('#large-card-focus-modal .text-7xl')?.parentElement, 'left'),
      title: getBorderPoint(document.querySelector('#large-card-focus-modal h2, #large-card-focus-modal h3, #large-card-focus-modal .font-black'), 'left'),
      stepsHeader: getBorderPoint(Array.from(document.querySelectorAll('#large-card-focus-modal *')).find(e => e.textContent && e.textContent.includes('Passos') && e.children.length === 0), 'left'),
      firstStepText: getBorderPoint(document.querySelector('#large-card-focus-modal .space-y-3 button, #large-card-focus-modal .space-y-2 button, #large-card-focus-modal label')?.querySelector('span:last-child, p') || document.querySelector('#large-card-focus-modal .space-y-3 > div, #large-card-focus-modal .space-y-2 > div'), 'left'),
      firstStepCheck: getBorderPoint(document.querySelector('#large-card-focus-modal .space-y-3 button input, #large-card-focus-modal .space-y-3 button div[class*="border"], #large-card-focus-modal .space-y-2 button div[class*="border"]') || document.querySelectorAll('#large-card-focus-modal button')[2], 'right'),
      doneAllBtn: getBorderPoint(Array.from(document.querySelectorAll('#large-card-focus-modal button')).find(b => b.textContent && b.textContent.includes('Tudo Feito')) || document.querySelector('#large-card-focus-modal button.bg-emerald-500, #large-card-focus-modal button.bg-emerald-600'), 'bottom'),
    };
  });

  const screen3Shot = await page.screenshot({ encoding: 'base64' });

  const fig3Callouts = [
    { num: 1, targetX: screen3Data.backBtn.x, targetY: screen3Data.backBtn.y, side: 'left', color: '#D97706' },
    { num: 2, targetX: screen3Data.time.x, targetY: screen3Data.time.y, side: 'right', color: '#D97706' },
    { num: 3, targetX: screen3Data.iconBox.x, targetY: screen3Data.iconBox.y, side: 'left', color: '#D97706' },
    { num: 4, targetX: screen3Data.title.x, targetY: screen3Data.title.y, side: 'left', color: '#D97706' },
    { num: 5, targetX: screen3Data.stepsHeader.x, targetY: screen3Data.stepsHeader.y, side: 'left', color: '#D97706' },
    { num: 6, targetX: screen3Data.firstStepText.x, targetY: screen3Data.firstStepText.y, side: 'left', color: '#D97706' },
    { num: 7, targetX: screen3Data.firstStepCheck.x, targetY: screen3Data.firstStepCheck.y, side: 'right', color: '#D97706' },
    { num: 8, targetX: screen3Data.doneAllBtn.x, targetY: screen3Data.doneAllBtn.y, side: 'bottom', color: '#D97706' },
  ];

  await compositeAndSave(screen3Shot, fig3Callouts, 'manual_figura_3_modal_foco_passos.png');

  // Close focus modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('#large-card-focus-modal button[aria-label="Fechar"], #large-card-focus-modal button');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // ==========================================
  // FIGURA 4: COMPARTILHAR LINK MÁGICO (7 pontos)
  // ==========================================
  console.log('Capturing Screen 4 data...');
  await page.evaluate(() => {
    const shareBtn = document.querySelector('#open-share-routine-btn');
    if (shareBtn) shareBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  const screen4Data = await page.evaluate(() => {
    function getBorderPoint(el, anchor = 'left') {
      if (!el) return { x: 206, y: 400 };
      const r = el.getBoundingClientRect();
      let x = r.left + r.width / 2;
      let y = r.top + r.height / 2;
      if (anchor === 'left') { x = r.left; y = r.top + r.height / 2; }
      if (anchor === 'right') { x = r.right; y = r.top + r.height / 2; }
      if (anchor === 'top') { x = r.left + r.width / 2; y = r.top; }
      if (anchor === 'bottom') { x = r.left + r.width / 2; y = r.bottom; }
      return { x, y };
    }

    return {
      shareTab: getBorderPoint(Array.from(document.querySelectorAll('#share-routine-modal button, .fixed button')).find(b => b.textContent && b.textContent.includes('Compartilhar Rotina')), 'top'),
      importTab: getBorderPoint(Array.from(document.querySelectorAll('#share-routine-modal button, .fixed button')).find(b => b.textContent && b.textContent.includes('Importar no Meu App')), 'top'),
      dayScope: getBorderPoint(Array.from(document.querySelectorAll('#share-routine-modal button, .fixed button')).find(b => b.textContent && (b.textContent.includes('Apenas') || b.textContent.includes('Terça'))), 'left'),
      summary: getBorderPoint(document.querySelector('#share-routine-modal .max-h-48, #share-routine-modal .overflow-y-auto, .fixed .max-h-48'), 'left'),
      whatsBtn: getBorderPoint(Array.from(document.querySelectorAll('#share-routine-modal button, .fixed button')).find(b => b.textContent && b.textContent.includes('WhatsApp')), 'left'),
      copyMsgBtn: getBorderPoint(Array.from(document.querySelectorAll('#share-routine-modal button, .fixed button')).find(b => b.textContent && b.textContent.includes('Copiar Mensagem')), 'left'),
      copyLinkBtn: getBorderPoint(Array.from(document.querySelectorAll('#share-routine-modal button, .fixed button')).find(b => b.textContent && b.textContent.includes('Copiar Apenas')), 'bottom'),
    };
  });

  const screen4Shot = await page.screenshot({ encoding: 'base64' });

  const fig4Callouts = [
    { num: 1, targetX: screen4Data.shareTab.x, targetY: screen4Data.shareTab.y, side: 'top', color: '#0D9488' },
    { num: 2, targetX: screen4Data.importTab.x, targetY: screen4Data.importTab.y, side: 'top', color: '#0D9488' },
    { num: 3, targetX: screen4Data.dayScope.x, targetY: screen4Data.dayScope.y, side: 'left', color: '#0D9488' },
    { num: 4, targetX: screen4Data.summary.x, targetY: screen4Data.summary.y, side: 'left', color: '#0D9488' },
    { num: 5, targetX: screen4Data.whatsBtn.x, targetY: screen4Data.whatsBtn.y, side: 'left', color: '#0D9488' },
    { num: 6, targetX: screen4Data.copyMsgBtn.x, targetY: screen4Data.copyMsgBtn.y, side: 'left', color: '#0D9488' },
    { num: 7, targetX: screen4Data.copyLinkBtn.x, targetY: screen4Data.copyLinkBtn.y, side: 'bottom', color: '#0D9488' },
  ];

  await compositeAndSave(screen4Shot, fig4Callouts, 'manual_figura_4_compartilhar_link.png');

  // ==========================================
  // FIGURA 4b: IMPORTAR LINK MÁGICO (4 pontos)
  // ==========================================
  console.log('Capturing Screen 4b data...');
  await page.evaluate(() => {
    const importTab = Array.from(document.querySelectorAll('#share-routine-modal button, .fixed button')).find(b => b.textContent && b.textContent.includes('Importar no Meu App'));
    if (importTab) importTab.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const screen4bData = await page.evaluate(() => {
    function getBorderPoint(el, anchor = 'left') {
      if (!el) return { x: 206, y: 400 };
      const r = el.getBoundingClientRect();
      let x = r.left + r.width / 2;
      let y = r.top + r.height / 2;
      if (anchor === 'left') { x = r.left; y = r.top + r.height / 2; }
      if (anchor === 'right') { x = r.right; y = r.top + r.height / 2; }
      if (anchor === 'top') { x = r.left + r.width / 2; y = r.top; }
      if (anchor === 'bottom') { x = r.left + r.width / 2; y = r.bottom; }
      return { x, y };
    }

    return {
      activeTab: getBorderPoint(Array.from(document.querySelectorAll('#share-routine-modal button, .fixed button')).find(b => b.textContent && b.textContent.includes('Importar no Meu App')), 'top'),
      pasteBtn: getBorderPoint(Array.from(document.querySelectorAll('#share-routine-modal button, .fixed button')).find(b => b.textContent && b.textContent.includes('Colar Link Copiado')), 'left'),
      inputBox: getBorderPoint(document.querySelector('#share-routine-modal input, #share-routine-modal textarea, .fixed input'), 'left'),
      verifyBtn: getBorderPoint(Array.from(document.querySelectorAll('#share-routine-modal button, .fixed button')).find(b => b.textContent && (b.textContent.includes('Verificar') || b.textContent.includes('Carregar'))), 'right'),
    };
  });

  const screen4bShot = await page.screenshot({ encoding: 'base64' });

  const fig4bCallouts = [
    { num: 1, targetX: screen4bData.activeTab.x, targetY: screen4bData.activeTab.y, side: 'top', color: '#6366F1' },
    { num: 2, targetX: screen4bData.pasteBtn.x, targetY: screen4bData.pasteBtn.y, side: 'left', color: '#6366F1' },
    { num: 3, targetX: screen4bData.inputBox.x, targetY: screen4bData.inputBox.y, side: 'left', color: '#6366F1' },
    { num: 4, targetX: screen4bData.verifyBtn.x, targetY: screen4bData.verifyBtn.y, side: 'right', color: '#6366F1' },
  ];

  await compositeAndSave(screen4bShot, fig4bCallouts, 'manual_figura_4b_importar_link.png');

  // Close share modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('#share-routine-modal button, .fixed button');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // ==========================================
  // FIGURA 5: LEMBRETES NO CELULAR / CALENDÁRIO (5 pontos)
  // ==========================================
  console.log('Capturing Screen 5 data...');
  await page.evaluate(() => {
    const calBtn = document.querySelector('#open-export-calendar-btn');
    if (calBtn) calBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  const screen5Data = await page.evaluate(() => {
    function getBorderPoint(el, anchor = 'left') {
      if (!el) return { x: 206, y: 400 };
      const r = el.getBoundingClientRect();
      let x = r.left + r.width / 2;
      let y = r.top + r.height / 2;
      if (anchor === 'left') { x = r.left; y = r.top + r.height / 2; }
      if (anchor === 'right') { x = r.right; y = r.top + r.height / 2; }
      if (anchor === 'top') { x = r.left + r.width / 2; y = r.top; }
      if (anchor === 'bottom') { x = r.left + r.width / 2; y = r.bottom; }
      return { x, y };
    }

    return {
      allWeek: getBorderPoint(Array.from(document.querySelectorAll('#export-calendar-modal button, .fixed button')).find(b => b.textContent && b.textContent.includes('Semana Toda')), 'left'),
      oneDay: getBorderPoint(Array.from(document.querySelectorAll('#export-calendar-modal button, .fixed button')).find(b => b.textContent && (b.textContent.includes('Apenas Terça') || b.textContent.includes('Apenas'))), 'right'),
      alarmSelect: getBorderPoint(document.querySelector('#export-calendar-modal select, .fixed select'), 'left'),
      instructions: getBorderPoint(document.querySelector('#export-calendar-modal .space-y-3, #export-calendar-modal .bg-slate-50, #export-calendar-modal .border-slate-200, .fixed .space-y-3'), 'left'),
      downloadBtn: getBorderPoint(Array.from(document.querySelectorAll('#export-calendar-modal button, .fixed button')).find(b => b.textContent && (b.textContent.includes('Baixar') || b.textContent.includes('.ics'))), 'bottom'),
    };
  });

  const screen5Shot = await page.screenshot({ encoding: 'base64' });

  const fig5Callouts = [
    { num: 1, targetX: screen5Data.allWeek.x, targetY: screen5Data.allWeek.y, side: 'left', color: '#E11D48' },
    { num: 2, targetX: screen5Data.oneDay.x, targetY: screen5Data.oneDay.y, side: 'right', color: '#E11D48' },
    { num: 3, targetX: screen5Data.alarmSelect.x, targetY: screen5Data.alarmSelect.y, side: 'left', color: '#E11D48' },
    { num: 4, targetX: screen5Data.instructions.x, targetY: screen5Data.instructions.y, side: 'left', color: '#E11D48' },
    { num: 5, targetX: screen5Data.downloadBtn.x, targetY: screen5Data.downloadBtn.y, side: 'bottom', color: '#E11D48' },
  ];

  await compositeAndSave(screen5Shot, fig5Callouts, 'manual_figura_5_lembretes_celular.png');

  // Close calendar modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('#export-calendar-modal button, .fixed button');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // ==========================================
  // FIGURA 6: CONFIGURAÇÕES & VOZES (8 pontos)
  // ==========================================
  console.log('Capturing Screen 6 data...');
  await page.evaluate(() => {
    const setBtn = document.querySelector('#open-settings-modal-btn');
    if (setBtn) setBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  const screen6Data = await page.evaluate(() => {
    function getBorderPoint(el, anchor = 'left') {
      if (!el) return { x: 206, y: 400 };
      const r = el.getBoundingClientRect();
      let x = r.left + r.width / 2;
      let y = r.top + r.height / 2;
      if (anchor === 'left') { x = r.left; y = r.top + r.height / 2; }
      if (anchor === 'right') { x = r.right; y = r.top + r.height / 2; }
      if (anchor === 'top') { x = r.left + r.width / 2; y = r.top; }
      if (anchor === 'bottom') { x = r.left + r.width / 2; y = r.bottom; }
      return { x, y };
    }

    return {
      theme: getBorderPoint(document.querySelector('#settings-modal .grid-cols-3, .fixed .grid-cols-3'), 'left'),
      volume: getBorderPoint(document.querySelector('#settings-modal input[type="range"], .fixed input[type="range"]'), 'left'),
      ttsToggle: getBorderPoint(document.querySelector('#settings-modal input[type="checkbox"], .fixed button[role="switch"], .fixed label[class*="cursor-pointer"]'), 'right'),
      voiceSelect: getBorderPoint(document.querySelector('#settings-modal select, .fixed select'), 'left'),
      persona: getBorderPoint(Array.from(document.querySelectorAll('#settings-modal button, .fixed button')).find(b => b.textContent && b.textContent.includes('Mascote'))?.parentElement, 'left'),
      speechRate: getBorderPoint(Array.from(document.querySelectorAll('#settings-modal button, .fixed button')).find(b => b.textContent && (b.textContent.includes('Calma') || b.textContent.includes('TEA'))), 'left'),
      testBtn: getBorderPoint(Array.from(document.querySelectorAll('#settings-modal button, .fixed button')).find(b => b.textContent && b.textContent.includes('Testar Apresentação')), 'left'),
      saveBtn: getBorderPoint(Array.from(document.querySelectorAll('#settings-modal button, .fixed button')).find(b => b.textContent && (b.textContent.includes('Salvar Preferências') || b.textContent.includes('Salvar'))), 'bottom'),
    };
  });

  const screen6Shot = await page.screenshot({ encoding: 'base64' });

  const fig6Callouts = [
    { num: 1, targetX: screen6Data.theme.x, targetY: screen6Data.theme.y, side: 'left', color: '#8B5CF6' },
    { num: 2, targetX: screen6Data.volume.x, targetY: screen6Data.volume.y, side: 'left', color: '#8B5CF6' },
    { num: 3, targetX: screen6Data.ttsToggle.x, targetY: screen6Data.ttsToggle.y, side: 'right', color: '#8B5CF6' },
    { num: 4, targetX: screen6Data.voiceSelect.x, targetY: screen6Data.voiceSelect.y, side: 'left', color: '#8B5CF6' },
    { num: 5, targetX: screen6Data.persona.x, targetY: screen6Data.persona.y, side: 'left', color: '#8B5CF6' },
    { num: 6, targetX: screen6Data.speechRate.x, targetY: screen6Data.speechRate.y, side: 'left', color: '#8B5CF6' },
    { num: 7, targetX: screen6Data.testBtn.x, targetY: screen6Data.testBtn.y, side: 'left', color: '#8B5CF6' },
    { num: 8, targetX: screen6Data.saveBtn.x, targetY: screen6Data.saveBtn.y, side: 'bottom', color: '#8B5CF6' },
  ];

  await compositeAndSave(screen6Shot, fig6Callouts, 'manual_figura_6_configuracoes_vozes.png');

  await browser.close();
  console.log('ALL 7 FIGURES GENERATED PERFECTLY WITH GUTTERS AND UNOBSTRUCTED ELEMENTS!');
}

run().catch(err => {
  console.error('Error during execution:', err);
  process.exit(1);
});
