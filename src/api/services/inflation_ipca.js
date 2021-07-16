import { CronJob } from 'cron';
import puppeteer from 'puppeteer-extra';

import { saveAndReadFile } from '../../utils/state';

const contentFilePath = './src/api/data/inflation_ipca/inflation_ipca.json';

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

export async function RoboInflacaoIPCA(req, res) {
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });

  const page = (await browser.pages())[0];
  const urlDaInflacaoIPCA = `https://www.bcb.gov.br`;
  await page.goto(urlDaInflacaoIPCA, {waitUntil: 'domcontentloaded'});

  // disabling images or css
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    if (request.resourceType() === 'image') request.abort()
    else request.continue()
  })

  try {
    const resultado = await page.evaluate(() => {
      try {
        return document.querySelector('div > .panorama .percentual').innerText;
      } catch(e) {
        console.log(e)
      }
    });
    
    if (!resultado) {
      throw new Error('Valor do IPCA (Inflação) dos últimos 12 meses não encontrado');
    }

    await browser.close();

    const contentInflationIPCA = saveAndReadFile(contentFilePath, 'resultado', resultado);

    console.log(`IPCA (Inflação) dos últimos 12 meses: ${resultado}`);

    return res.status(200).json({status: true, response: contentInflationIPCA});
    /* return res.status(200).json({status: true, response: [{ipca: resultado, message: `IPCA (Inflação) dos últimos 12 meses: ${resultado}`}]}); */
    
  } catch(err) {
    console.log(err.message);
    return res.status(400).json({status: false, response: [], log: err.message});
  }
}

new CronJob({
  cronTime: "0 0 1 * *", // At 12:00 AM, on day 1 of the month
  onTick: RoboInflacaoIPCA,
  start: true,
});