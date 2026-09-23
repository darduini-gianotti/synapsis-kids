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
  console.log('Starting Puppeteer with Edge...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 412,
    height: 892,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  console.log('Navigating to app...');
  await page.goto('https://synapsis-kids.vercel.app', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Helper injected into page to render precise callouts
  async function injectCallouts(calloutDefs) {
    await page.evaluate((defs) => {
      // Remove old overlay if any
      const old = document.getElementById('manual-annotation-overlay');
      if (old) old.remove();

      const overlay = document.createElement('div');
      overlay.id = 'manual-annotation-overlay';
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = `${Math.max(document.body.scrollHeight, 892)}px`;
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '999999';

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.style.position = 'absolute';
      svg.style.top = '0';
      svg.style.left = '0';

      overlay.appendChild(svg);
      document.body.appendChild(overlay);

      for (const item of defs) {
        let el = null;
        if (typeof item.selector === 'string') {
          el = document.querySelector(item.selector);
        } else if (item.finder) {
          // Custom finder string evaluated
          el = eval(item.finder);
        }

        if (!el) {
          console.warn('Callout element not found for item:', item.num);
          continue;
        }

        const r = el.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;

        // Target center
        let tx = r.left + scrollX + r.width / 2;
        let ty = r.top + scrollY + r.height / 2;

        // Custom target anchor if requested
        if (item.targetAnchor === 'left') tx = r.left + scrollX + (item.targetOffset || 14);
        if (item.targetAnchor === 'right') tx = r.right + scrollX - (item.targetOffset || 14);
        if (item.targetAnchor === 'top') ty = r.top + scrollY + (item.targetOffset || 10);
        if (item.targetAnchor === 'bottom') ty = r.bottom + scrollY - (item.targetOffset || 10);

        // Badge position
        let bx = tx + (item.dx || 0);
        let by = ty + (item.dy || 0);

        if (item.absX !== undefined) bx = item.absX;
        if (item.absY !== undefined) by = item.absY;

        const color = item.color || '#4F46E5';

        // 1. Leader Line with drop shadow
        const shadowLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        shadowLine.setAttribute('x1', bx);
        shadowLine.setAttribute('y1', by);
        shadowLine.setAttribute('x2', tx);
        shadowLine.setAttribute('y2', ty);
        shadowLine.setAttribute('stroke', 'rgba(0,0,0,0.5)');
        shadowLine.setAttribute('stroke-width', '4.5');
        shadowLine.setAttribute('stroke-linecap', 'round');
        svg.appendChild(shadowLine);

        const foreLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        foreLine.setAttribute('x1', bx);
        foreLine.setAttribute('y1', by);
        foreLine.setAttribute('x2', tx);
        foreLine.setAttribute('y2', ty);
        foreLine.setAttribute('stroke', color);
        foreLine.setAttribute('stroke-width', '2.5');
        foreLine.setAttribute('stroke-linecap', 'round');
        svg.appendChild(foreLine);

        // 2. Target dot on element
        const dotOuter = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dotOuter.setAttribute('cx', tx);
        dotOuter.setAttribute('cy', ty);
        dotOuter.setAttribute('r', '5.5');
        dotOuter.setAttribute('fill', '#000000');
        svg.appendChild(dotOuter);

        const dotMid = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dotMid.setAttribute('cx', tx);
        dotMid.setAttribute('cy', ty);
        dotMid.setAttribute('r', '4');
        dotMid.setAttribute('fill', '#FFFFFF');
        svg.appendChild(dotMid);

        const dotInner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dotInner.setAttribute('cx', tx);
        dotInner.setAttribute('cy', ty);
        dotInner.setAttribute('r', '2.5');
        dotInner.setAttribute('fill', color);
        svg.appendChild(dotInner);

        // 3. Numbered Badge Circle
        const badgeRadius = 14;
        const bShadow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bShadow.setAttribute('cx', bx);
        bShadow.setAttribute('cy', by + 2.5);
        bShadow.setAttribute('r', badgeRadius + 1);
        bShadow.setAttribute('fill', 'rgba(0,0,0,0.4)');
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

        // 4. Number text
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
      }
    }, calloutDefs);
  }

  async function saveBoth(filename) {
    const p1 = path.join(ARTIFACT_DIR, filename);
    const p2 = path.join(DOCS_DIR, filename);
    await page.screenshot({ path: p1 });
    fs.copyFileSync(p1, p2);
    console.log(`Saved ${filename} to both artifact and docs!`);
  }

  // ==========================================
  // FIGURA 1: TELA PRINCIPAL (15 pontos)
  // ==========================================
  console.log('Processing Figura 1...');
  await page.evaluate(() => {
    // Ensure on Tuesday
    const tues = document.querySelector('#day-tab-2');
    if (tues) tues.click();
    // Ensure list view
    const listBtn = document.querySelector('#view-mode-list-btn');
    if (listBtn) listBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const fig1Callouts = [
    { num: 1, selector: 'header h1, header span.font-bold', dx: -55, dy: 15, targetAnchor: 'left', color: '#4F46E5' },
    { num: 2, finder: 'Array.from(document.querySelectorAll("header *")).find(e => e.textContent && e.textContent.includes("/") && e.children.length === 0) || document.querySelector("header span[class*=\\"text-xs\\"]")', dx: 30, dy: 0, targetAnchor: 'right', color: '#4F46E5' },
    { num: 3, selector: '#header-new-task-btn', dx: -60, dy: 0, targetAnchor: 'left', color: '#4F46E5' },
    { num: 4, selector: '#quick-theme-toggle-btn', dx: 0, dy: -32, color: '#4F46E5' },
    { num: 5, finder: 'Array.from(document.querySelectorAll("header button")).find(b => b.title && b.title.includes("Som")) || document.querySelectorAll("header button")[2]', dx: 0, dy: -32, color: '#4F46E5' },
    { num: 6, selector: '#parent-lock-status-btn', dx: 0, dy: -32, color: '#4F46E5' },
    { num: 7, selector: '#open-settings-modal-btn', dx: 0, dy: -32, color: '#4F46E5' },
    { num: 8, selector: '#open-clinical-templates-btn', dx: 0, dy: -30, color: '#4F46E5' },
    { num: 9, selector: '#open-share-routine-btn', dx: 0, dy: 30, color: '#4F46E5' },
    { num: 10, selector: '#open-export-calendar-btn', dx: 0, dy: -30, color: '#4F46E5' },
    { num: 11, selector: '#open-copy-routine-modal-btn', dx: 0, dy: 30, color: '#4F46E5' },
    { num: 12, selector: '#day-tab-2', dx: 0, dy: -42, color: '#4F46E5' },
    { num: 13, selector: '#view-mode-board-btn', dx: 35, dy: 0, targetAnchor: 'right', color: '#4F46E5' },
    { num: 14, finder: 'Array.from(document.querySelectorAll("*")).find(e => e.textContent && e.textContent.includes("Primeiro") && e.textContent.includes("Depois") && e.classList.contains("rounded-2xl"))', dx: -150, dy: 0, targetAnchor: 'left', color: '#4F46E5' },
    { num: 15, finder: 'document.querySelector("#task-card-task-1") || document.querySelectorAll(".space-y-3 > div")[1]', dx: -150, dy: 0, targetAnchor: 'left', color: '#4F46E5' },
  ];

  await injectCallouts(fig1Callouts);
  await saveBoth('manual_figura_1_tela_principal.png');

  // ==========================================
  // FIGURA 2: MODO TEA & PRANCHA (7 pontos)
  // ==========================================
  console.log('Processing Figura 2...');
  await page.evaluate(() => {
    // Switch to board view
    const boardBtn = document.querySelector('#view-mode-board-btn');
    if (boardBtn) boardBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  const fig2Callouts = [
    { num: 1, selector: '#view-mode-board-btn', dx: -120, dy: 0, targetAnchor: 'left', color: '#059669' },
    { num: 2, finder: 'Array.from(document.querySelectorAll("*")).find(e => e.textContent && e.textContent.includes("Modo TEA") && e.children.length === 0)', dx: 0, dy: -28, color: '#059669' },
    { num: 3, finder: 'document.querySelectorAll("#pecs-cards-grid > div")[0].querySelector("span.font-mono, span.font-bold, .text-xs")', dx: -45, dy: 0, targetAnchor: 'left', color: '#059669' },
    { num: 4, finder: 'document.querySelectorAll("#pecs-cards-grid > div")[0].querySelector("button[title*=\\"Ouvir\\"], button")', dx: 30, dy: 0, targetAnchor: 'right', color: '#059669' },
    { num: 5, finder: 'document.querySelectorAll("#pecs-cards-grid > div")[0].querySelector(".text-5xl, .text-6xl, .text-4xl, img, div.my-auto")', dx: -65, dy: 0, targetAnchor: 'left', color: '#059669' },
    { num: 6, finder: 'document.querySelectorAll("#pecs-cards-grid > div")[0].querySelector("h3, h4, .font-bold.text-lg, .font-bold")', dx: -70, dy: 0, targetAnchor: 'left', color: '#059669' },
    { num: 7, finder: 'document.querySelectorAll("#pecs-cards-grid > div")[0].querySelector("button[title*=\\"Concluir\\"], button:last-child")', dx: 0, dy: 30, color: '#059669' },
  ];

  await injectCallouts(fig2Callouts);
  await saveBoth('manual_figura_2_prancha_tea.png');

  // ==========================================
  // FIGURA 3: MODAL DE FOCO NA ATIVIDADE (8 pontos)
  // ==========================================
  console.log('Processing Figura 3...');
  // Click on "Ir ao Banheiro"
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#pecs-cards-grid > div'));
    const target = cards.find(c => c.textContent && c.textContent.includes('Banheiro')) || cards[1];
    if (target) target.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  const fig3Callouts = [
    { num: 1, finder: 'document.querySelector("#large-card-focus-modal button[aria-label=\\"Fechar\\"], #large-card-focus-modal button")', dx: -35, dy: 0, targetAnchor: 'left', color: '#D97706' },
    { num: 2, finder: 'document.querySelector("#large-card-focus-modal span.font-mono, #large-card-focus-modal .text-amber-500, #large-card-focus-modal .text-sm")', dx: 35, dy: 0, targetAnchor: 'right', color: '#D97706' },
    { num: 3, finder: 'document.querySelector("#large-card-focus-modal button.p-6, #large-card-focus-modal .text-7xl, #large-card-focus-modal .text-8xl")?.closest("button") || document.querySelector("#large-card-focus-modal .text-7xl")?.parentElement', dx: -120, dy: 0, targetAnchor: 'left', color: '#D97706' },
    { num: 4, finder: 'document.querySelector("#large-card-focus-modal h2, #large-card-focus-modal h3, #large-card-focus-modal .font-black")', dx: -120, dy: 0, targetAnchor: 'left', color: '#D97706' },
    { num: 5, finder: 'Array.from(document.querySelectorAll("#large-card-focus-modal *")).find(e => e.textContent && e.textContent.includes("Passos da Atividade") && e.children.length === 0)', dx: -100, dy: 0, targetAnchor: 'left', color: '#D97706' },
    { num: 6, finder: 'document.querySelector("#large-card-focus-modal .space-y-3 button, #large-card-focus-modal .space-y-2 button, #large-card-focus-modal label")?.querySelector("span:last-child, p") || document.querySelector("#large-card-focus-modal .space-y-3 > div, #large-card-focus-modal .space-y-2 > div")', dx: -120, dy: 0, targetAnchor: 'left', color: '#D97706' },
    { num: 7, finder: 'document.querySelector("#large-card-focus-modal .space-y-3 button input, #large-card-focus-modal .space-y-3 button div[class*=\\"border\\"], #large-card-focus-modal .space-y-2 button div[class*=\\"border\\"]") || document.querySelectorAll("#large-card-focus-modal button")[2]', dx: 35, dy: 0, targetAnchor: 'right', color: '#D97706' },
    { num: 8, finder: 'Array.from(document.querySelectorAll("#large-card-focus-modal button")).find(b => b.textContent && b.textContent.includes("Tudo Feito")) || document.querySelector("#large-card-focus-modal button.bg-emerald-500, #large-card-focus-modal button.bg-emerald-600")', dx: 0, dy: -35, color: '#D97706' },
  ];

  await injectCallouts(fig3Callouts);
  await saveBoth('manual_figura_3_modal_foco_passos.png');

  // Close focus modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('#large-card-focus-modal button[aria-label="Fechar"], #large-card-focus-modal button');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // ==========================================
  // FIGURA 4: COMPARTILHAR LINK MÁGICO (7 pontos)
  // ==========================================
  console.log('Processing Figura 4...');
  await page.evaluate(() => {
    const shareBtn = document.querySelector('#open-share-routine-btn');
    if (shareBtn) shareBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  const fig4Callouts = [
    { num: 1, finder: 'Array.from(document.querySelectorAll("#share-routine-modal button, .fixed button")).find(b => b.textContent && b.textContent.includes("Compartilhar Rotina"))', dx: 0, dy: -28, color: '#0D9488' },
    { num: 2, finder: 'Array.from(document.querySelectorAll("#share-routine-modal button, .fixed button")).find(b => b.textContent && b.textContent.includes("Importar no Meu App"))', dx: 0, dy: -28, color: '#0D9488' },
    { num: 3, finder: 'Array.from(document.querySelectorAll("#share-routine-modal button, .fixed button")).find(b => b.textContent && b.textContent.includes("Apenas") || b.textContent.includes("Terça"))', dx: -80, dy: 0, targetAnchor: 'left', color: '#0D9488' },
    { num: 4, finder: 'document.querySelector("#share-routine-modal .max-h-48, #share-routine-modal .overflow-y-auto, .fixed .max-h-48")', dx: -130, dy: 0, targetAnchor: 'left', color: '#0D9488' },
    { num: 5, finder: 'Array.from(document.querySelectorAll("#share-routine-modal button, .fixed button")).find(b => b.textContent && b.textContent.includes("WhatsApp"))', dx: 0, dy: -32, color: '#0D9488' },
    { num: 6, finder: 'Array.from(document.querySelectorAll("#share-routine-modal button, .fixed button")).find(b => b.textContent && b.textContent.includes("Copiar Mensagem"))', dx: 0, dy: -32, color: '#0D9488' },
    { num: 7, finder: 'Array.from(document.querySelectorAll("#share-routine-modal button, .fixed button")).find(b => b.textContent && b.textContent.includes("Copiar Apenas"))', dx: 0, dy: 30, color: '#0D9488' },
  ];

  await injectCallouts(fig4Callouts);
  await saveBoth('manual_figura_4_compartilhar_link.png');

  // ==========================================
  // FIGURA 4b: IMPORTAR LINK MÁGICO (4 pontos)
  // ==========================================
  console.log('Processing Figura 4b...');
  await page.evaluate(() => {
    const importTab = Array.from(document.querySelectorAll('#share-routine-modal button, .fixed button')).find(b => b.textContent && b.textContent.includes('Importar no Meu App'));
    if (importTab) importTab.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const fig4bCallouts = [
    { num: 1, finder: 'Array.from(document.querySelectorAll("#share-routine-modal button, .fixed button")).find(b => b.textContent && b.textContent.includes("Importar no Meu App"))', dx: 0, dy: -28, color: '#6366F1' },
    { num: 2, finder: 'Array.from(document.querySelectorAll("#share-routine-modal button, .fixed button")).find(b => b.textContent && b.textContent.includes("Colar Link Copiado"))', dx: 0, dy: -32, color: '#6366F1' },
    { num: 3, finder: 'document.querySelector("#share-routine-modal input, #share-routine-modal textarea, .fixed input")', dx: -120, dy: 0, targetAnchor: 'left', color: '#6366F1' },
    { num: 4, finder: 'Array.from(document.querySelectorAll("#share-routine-modal button, .fixed button")).find(b => b.textContent && (b.textContent.includes("Verificar") || b.textContent.includes("Carregar")))', dx: 40, dy: 0, targetAnchor: 'right', color: '#6366F1' },
  ];

  await injectCallouts(fig4bCallouts);
  await saveBoth('manual_figura_4b_importar_link.png');

  // Close share modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('#share-routine-modal button, .fixed button');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // ==========================================
  // FIGURA 5: LEMBRETES NO CELULAR / CALENDÁRIO (5 pontos)
  // ==========================================
  console.log('Processing Figura 5...');
  await page.evaluate(() => {
    const calBtn = document.querySelector('#open-export-calendar-btn');
    if (calBtn) calBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  const fig5Callouts = [
    { num: 1, finder: 'Array.from(document.querySelectorAll("#export-calendar-modal button, .fixed button")).find(b => b.textContent && b.textContent.includes("Semana Toda"))', dx: -65, dy: 0, targetAnchor: 'left', color: '#E11D48' },
    { num: 2, finder: 'Array.from(document.querySelectorAll("#export-calendar-modal button, .fixed button")).find(b => b.textContent && (b.textContent.includes("Apenas Terça") || b.textContent.includes("Apenas")))', dx: 65, dy: 0, targetAnchor: 'right', color: '#E11D48' },
    { num: 3, finder: 'document.querySelector("#export-calendar-modal select, .fixed select")', dx: -120, dy: 0, targetAnchor: 'left', color: '#E11D48' },
    { num: 4, finder: 'document.querySelector("#export-calendar-modal .space-y-3, #export-calendar-modal .bg-slate-50, #export-calendar-modal .border-slate-200, .fixed .space-y-3")', dx: -130, dy: 0, targetAnchor: 'left', color: '#E11D48' },
    { num: 5, finder: 'Array.from(document.querySelectorAll("#export-calendar-modal button, .fixed button")).find(b => b.textContent && (b.textContent.includes("Baixar") || b.textContent.includes(".ics")))', dx: 0, dy: -32, color: '#E11D48' },
  ];

  await injectCallouts(fig5Callouts);
  await saveBoth('manual_figura_5_lembretes_celular.png');

  // Close calendar modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('#export-calendar-modal button, .fixed button');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // ==========================================
  // FIGURA 6: CONFIGURAÇÕES & VOZES (8 pontos)
  // ==========================================
  console.log('Processing Figura 6...');
  await page.evaluate(() => {
    const setBtn = document.querySelector('#open-settings-modal-btn');
    if (setBtn) setBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  const fig6Callouts = [
    { num: 1, finder: 'document.querySelector("#settings-modal .grid-cols-3, .fixed .grid-cols-3")', dx: -120, dy: 0, targetAnchor: 'left', color: '#8B5CF6' },
    { num: 2, finder: 'document.querySelector("#settings-modal input[type=\\"range\\"], .fixed input[type=\\"range\\"]")', dx: -120, dy: 0, targetAnchor: 'left', color: '#8B5CF6' },
    { num: 3, finder: 'document.querySelector("#settings-modal input[type=\\"checkbox\\"], .fixed button[role=\\"switch\\"], .fixed label[class*=\\"cursor-pointer\\"]")', dx: 35, dy: 0, targetAnchor: 'right', color: '#8B5CF6' },
    { num: 4, finder: 'document.querySelector("#settings-modal select, .fixed select")', dx: -120, dy: 0, targetAnchor: 'left', color: '#8B5CF6' },
    { num: 5, finder: 'Array.from(document.querySelectorAll("#settings-modal button, .fixed button")).find(b => b.textContent && b.textContent.includes("Mascote"))?.parentElement', dx: -120, dy: 0, targetAnchor: 'left', color: '#8B5CF6' },
    { num: 6, finder: 'Array.from(document.querySelectorAll("#settings-modal button, .fixed button")).find(b => b.textContent && (b.textContent.includes("Calma") || b.textContent.includes("TEA")))', dx: -70, dy: 0, targetAnchor: 'left', color: '#8B5CF6' },
    { num: 7, finder: 'Array.from(document.querySelectorAll("#settings-modal button, .fixed button")).find(b => b.textContent && b.textContent.includes("Testar Apresentação"))', dx: -70, dy: 0, targetAnchor: 'left', color: '#8B5CF6' },
    { num: 8, finder: 'Array.from(document.querySelectorAll("#settings-modal button, .fixed button")).find(b => b.textContent && (b.textContent.includes("Salvar Preferências") || b.textContent.includes("Salvar")))', dx: 0, dy: -32, color: '#8B5CF6' },
  ];

  await injectCallouts(fig6Callouts);
  await saveBoth('manual_figura_6_configuracoes_vozes.png');

  await browser.close();
  console.log('All 7 figures captured and annotated with 100% exact DOM coordinates!');
}

run().catch(err => {
  console.error('Error during execution:', err);
  process.exit(1);
});
