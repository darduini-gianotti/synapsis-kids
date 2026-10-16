import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const fileUrl = 'file:///' + path.resolve('public/landing.html').replace(/\\/g, '/');

async function testScreens() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1.5 });
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Hero & Navbar
  await page.screenshot({ path: 'landing_check_hero.png', clip: { x: 0, y: 0, width: 1280, height: 600 } });

  // 2. Mascote Vitrine
  const mascoteEl = await page.$('#mascote');
  if (mascoteEl) {
    const box = await mascoteEl.boundingBox();
    if (box) {
      await page.screenshot({ path: 'landing_check_mascote.png', clip: { x: 0, y: box.y + 400, width: 1280, height: 500 } });
    }
  }

  // 3. Recursos Carousel
  const recursosEl = await page.$('#recursos');
  if (recursosEl) {
    const box = await recursosEl.boundingBox();
    if (box) {
      await page.screenshot({ path: 'landing_check_recursos.png', clip: { x: 0, y: box.y, width: 1280, height: 650 } });
    }
  }

  // 4. Bottom CTA & Footer
  const instalacaoEl = await page.$('#instalacao');
  if (instalacaoEl) {
    const box = await instalacaoEl.boundingBox();
    if (box) {
      await page.screenshot({ path: 'landing_check_bottom_cta.png', clip: { x: 0, y: box.y + box.height - 350, width: 1280, height: 650 } });
    }
  }

  // 5. Mobile Hero
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await mobilePage.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await mobilePage.screenshot({ path: 'landing_check_mobile_hero.png', clip: { x: 0, y: 0, width: 390, height: 550 } });

  await browser.close();
  console.log('✅ Screenshots capturados com sucesso!');
}

testScreens().catch(console.error);
