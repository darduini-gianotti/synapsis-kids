import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_DIR = 'C:\\Users\\Sergio DArduini\\.gemini\\antigravity\\brain\\54b764e2-1d67-424b-bc3e-76b1f5d7b46c\\manual_screens';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching Edge...');
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

  // 1. Tela Principal (Dark mode by default if system or toggle)
  console.log('Capturing Screen 1: Main...');
  await page.screenshot({ path: path.join(OUT_DIR, '01_tela_principal.png') });

  // 2. Modo TEA: Prancha Visual
  console.log('Switching to Visual Board (Modo TEA)...');
  // Find button with text or icon for board view
  const boardBtn = await page.$('button[id="view-mode-board"], button[title*="Prancha"], #view-mode-board');
  if (boardBtn) {
    await boardBtn.click();
  } else {
    // try evaluating click on the visual board button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find(btn => btn.textContent && (btn.textContent.includes('Prancha') || btn.textContent.includes('Cartões')));
      if (b) b.click();
    });
  }
  await new Promise(r => setTimeout(r, 1500));
  console.log('Capturing Screen 2: Board View (Modo TEA)...');
  await page.screenshot({ path: path.join(OUT_DIR, '02_prancha_tea.png') });

  // 3. Modal de Foco TEA (com Passos Grandes)
  console.log('Opening Large Card Focus Modal for Ir ao Banheiro...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#pecs-cards-grid > div'));
    const target = cards.find(c => c.textContent && c.textContent.includes('Banheiro')) || cards[1];
    if (target) target.click();
  });
  await page.waitForSelector('#large-card-focus-modal', { timeout: 4000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1500));
  console.log('Capturing Screen 3: Focus Modal (Passos TEA)...');
  await page.screenshot({ path: path.join(OUT_DIR, '03_modal_foco_passos.png') });

  // Close focus modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('#large-card-focus-modal button[aria-label="Fechar"], #large-card-focus-modal button');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // 4. Modal Compartilhar / Link Mágico
  console.log('Opening Share / Magic Link Modal...');
  await page.evaluate(() => {
    const shareBtn = document.querySelector('#open-share-routine-btn') || Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Enviar / Importar'));
    if (shareBtn) shareBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  console.log('Capturing Screen 4: Share Routine Modal...');
  await page.screenshot({ path: path.join(OUT_DIR, '04_compartilhar_link.png') });

  // Switch to Import Tab inside Share modal
  await page.evaluate(() => {
    const importTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Importar no Meu App'));
    if (importTab) importTab.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  console.log('Capturing Screen 4b: Import Tab...');
  await page.screenshot({ path: path.join(OUT_DIR, '04b_importar_link.png') });

  // Close Share modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('#share-routine-modal button');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // 5. Modal Lembretes no Celular (Calendário)
  console.log('Opening Export Calendar Modal...');
  await page.evaluate(() => {
    const bellBtn = document.querySelector('#open-export-calendar-btn') || Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('Calendário'));
    if (bellBtn) bellBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  console.log('Capturing Screen 5: Calendar Export Modal...');
  await page.screenshot({ path: path.join(OUT_DIR, '05_lembretes_celular.png') });

  // Close Calendar modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('#export-calendar-modal button');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // 6. Modal Configurações & Vozes
  console.log('Opening Settings Modal...');
  await page.evaluate(() => {
    const gearBtn = document.querySelector('#open-settings-btn') || Array.from(document.querySelectorAll('button')).find(b => b.title && b.title.includes('Configurações'));
    if (gearBtn) gearBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  console.log('Capturing Screen 6: Settings Modal...');
  await page.screenshot({ path: path.join(OUT_DIR, '06_configuracoes.png') });

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
