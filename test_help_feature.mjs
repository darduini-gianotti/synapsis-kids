import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Sergio DArduini\\.gemini\\antigravity\\brain\\54b764e2-1d67-424b-bc3e-76b1f5d7b46c';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  // Abre o app
  await page.goto('http://localhost:4174/', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'help_test_1_main_screen.png') });
  console.log('1. Main screen captured');

  // Clica no botão de ajuda para abrir o HelpModal
  await page.click('#open-help-modal-btn');
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'help_test_2_help_modal.png') });
  console.log('2. Help modal captured');

  // Clica no Modo Inspetor
  const inspectorBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent && b.textContent.includes('Modo Inspetor'));
  });
  if (inspectorBtn) {
    await inspectorBtn.click();
  }
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'help_test_3_inspector_active.png') });
  console.log('3. Inspector mode active captured');

  // Clica no botão Nova Tarefa para abrir o Bottom Sheet
  await page.click('#header-new-task-btn');
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'help_test_4_explanation_sheet.png') });
  console.log('4. Explanation bottom sheet captured');

  // Fecha o bottom sheet e o modo inspetor
  const closeSheetBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent && b.textContent.includes('Encerrar Modo Ajuda'));
  });
  if (closeSheetBtn) {
    await closeSheetBtn.click();
  }
  await new Promise((r) => setTimeout(r, 500));

  // Reabre o menu de ajuda e clica em Guia Rápido
  await page.click('#open-help-modal-btn');
  await new Promise((r) => setTimeout(r, 500));
  const quickGuideBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent && b.textContent.includes('Guia Rápido'));
  });
  if (quickGuideBtn) {
    await quickGuideBtn.click();
  }
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'help_test_5_quick_guide.png') });
  console.log('5. Quick guide captured');

  await browser.close();
  console.log('Done all captures!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
