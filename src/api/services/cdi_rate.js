import { CronJob } from 'cron';
import puppeteer from 'puppeteer-extra';

import { saveAndReadFile } from '../../utils/state';

const contentFilePath = './src/api/data/cdi_rate/cdi_rate.json';

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

export async function RoboTaxaCDI(req, res) {
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });

  const page = (await browser.pages())[0];
  const urlDaTaxaCDI = `https://www.melhorcambio.com/cdi`;
  await page.goto(urlDaTaxaCDI, {waitUntil: 'domcontentloaded'});

  // disabling images or css
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    if (request.resourceType() === 'image') request.abort()
    else request.continue()
  })

  try {
    const resultado = await page.evaluate(() => {
      try {
        return document.querySelector('#inp-ano').value;
      } catch(e) {
        console.log(e)
      }
    });
    
    if (!resultado) {
      throw new Error('Taxa CDI do último ano não encontrada');
    }
    
    await browser.close();

    const contentCDIRate = saveAndReadFile(contentFilePath, 'resultado', resultado);

    return res.status(200).json({status: true, response: contentCDIRate});
    /* return res.status(200).json({status: true, response: [{cdi: resultado, message: `A Taxa CDI do último ano está valendo: ${resultado}`}]}); */

  } catch(err) {
    console.log(err.message);
    return res.status(400).json({status: false, response: [], log: err.message});
  }
}

new CronJob({
  cronTime: "0 0 1 * *", // At 12:00 AM, on day 1 of the month
  onTick: RoboTaxaCDI,
  start: true,
});