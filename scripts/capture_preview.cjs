const puppeteer = require('puppeteer-core');
const path = require('path');

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--allow-file-access-from-files', '--disable-web-security']
  });

  const page = await browser.newPage();
  const fileUrl = 'file:///' + path.resolve('public/landing.html').replace(/\\/g, '/');
  
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));

  const mascoteElem = await page.$('section[id="mascote"]');
  if (mascoteElem) {
    await mascoteElem.screenshot({ path: 'landing_preview_mascote_desktop.png' });
    console.log('OK: landing_preview_mascote_desktop.png');
  }

  await page.setViewport({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  const mascoteElemMob = await page.$('section[id="mascote"]');
  if (mascoteElemMob) {
    await mascoteElemMob.screenshot({ path: 'landing_preview_mascote_mobile.png' });
    console.log('OK: landing_preview_mascote_mobile.png');
  }

  await browser.close();
}

capture().catch(console.error);
