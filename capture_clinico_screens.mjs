import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const landingPath = 'file:///' + path.resolve('c:/Projetos/Psicogestão/landing/index.html').replace(/\\/g, '/');
const outputDir = path.resolve('public/clinico_images');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000, deviceScaleFactor: 2 });
  await page.goto(landingPath, { waitUntil: 'networkidle0' });

  // 1. Capture Agenda
  await page.evaluate(() => {
    if (typeof switchMicroDemo === 'function') switchMicroDemo('agenda');
  });
  await new Promise(r => setTimeout(r, 500));
  const elAgenda = await page.$('#demoView-agenda');
  if (elAgenda) {
    await elAgenda.screenshot({ path: path.join(outputDir, 'clinico_agenda_inteligente.png') });
    console.log('✅ Captured Agenda');
  }

  // 2. Capture Financeiro / Fiscal
  await page.evaluate(() => {
    if (typeof switchMicroDemo === 'function') switchMicroDemo('fiscal');
  });
  await new Promise(r => setTimeout(r, 500));
  const elFiscal = await page.$('#demoView-fiscal');
  if (elFiscal) {
    await elFiscal.screenshot({ path: path.join(outputDir, 'clinico_financeiro_fiscal.png') });
    console.log('✅ Captured Financeiro/Fiscal');
  }

  // 3. Capture Laudo Neuropsicológico
  await page.evaluate(() => {
    if (typeof switchMicroDemo === 'function') switchMicroDemo('neuro');
  });
  await new Promise(r => setTimeout(r, 500));
  const elNeuro = await page.$('#demoView-neuro');
  if (elNeuro) {
    await elNeuro.screenshot({ path: path.join(outputDir, 'clinico_laudo_neuropsicologico.png') });
    console.log('✅ Captured Laudo Neuropsicológico');
  }

  await browser.close();
  console.log('🎉 All 3 Clinico screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Error capturing:', err);
  process.exit(1);
});
