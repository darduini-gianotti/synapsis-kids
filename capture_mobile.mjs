import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Sergio DArduini/.gemini/antigravity/brain/54b764e2-1d67-424b-bc3e-76b1f5d7b46c';
const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:4174/landing.html', { waitUntil: 'networkidle0', timeout: 30000 });

  // 1. Hero Mobile
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_view_1_hero.png') });
  console.log('Saved hero screenshot');

  // 2. Open Mobile Menu
  await page.click('#mobile-menu-btn');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_view_2_menu.png') });
  console.log('Saved menu screenshot');

  // Close menu and scroll to install section
  await page.click('#mobile-menu-btn');
  await new Promise(r => setTimeout(r, 300));

  await page.evaluate(() => {
    document.getElementById('instalacao')?.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_view_3_instalacao.png') });
  console.log('Saved install screenshot');

  // 4. Recursos com telas
  await page.evaluate(() => {
    document.getElementById('recursos')?.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_view_4_recursos.png') });
  console.log('Saved recursos screenshot');

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch(console.error);
