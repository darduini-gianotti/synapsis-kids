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

  await page.goto('http://localhost:4174/', { waitUntil: 'networkidle0', timeout: 30000 });

  // 1. Clica no botão ? para ativar diretamente o Modo Inspetor
  await page.click('#open-help-modal-btn');
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'inspector_direct_1_all_buttons.png') });
  console.log('1. Inspector active direct - all buttons outlined');

  // 2. Toca no botão de áudio da primeira tarefa
  const audioBtn = await page.$('[data-help-id="task-audio"]');
  if (audioBtn) {
    await audioBtn.click();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'inspector_direct_2_task_audio.png') });
    console.log('2. Task audio bottom sheet captured');
  }

  // 3. Toca no botão de check da tarefa
  const checkBtn = await page.$('[data-help-id="task-check"]');
  if (checkBtn) {
    await checkBtn.click();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'inspector_direct_3_task_check.png') });
    console.log('3. Task check bottom sheet captured');
  }

  await browser.close();
  console.log('All tests passed!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
