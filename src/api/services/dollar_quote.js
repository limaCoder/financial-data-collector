// puppeteer-extra is a wrapper around puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from 'puppeteer-extra';

import { CronJob } from 'cron';

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

export async function RoboDolar(req, res) {
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: [ // argumentos usados para o funcionamento do Puppeteer em ambiente de produção
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ]
  });

  const page = (await browser.pages())[0]; // esperando o browser abrir uma página no navegador
  const moedaBase = 'dolar';
  const moedaFinal = 'real';
  const urlDaMoeda = `https://www.google.com/search?q=${moedaBase}+para+${moedaFinal}`;
  await page.goto(urlDaMoeda, {waitUntil: 'domcontentloaded'}); // indo até o endereço para realizar scrapping

  // desabilitando imagens e css
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    if (request.resourceType() === 'image') request.abort()
    else request.continue()
  })

  // await page.screenshot({ path: 'example.png' });

  try {
    const resultado = await page.evaluate(() => {
      try {
        return document.querySelector('.a61j6.vk_gy.vk_sh.Hg3mWc').value; // capturando o dado
      } catch(e) {
        console.log(e)
      }
    });
    
    if (!resultado) { // para caso o dado não existir mais
      throw new Error('Cotação não encontrada');
    }

    await browser.close();
        
    console.log(`O valor de 1 ${moedaBase} em ${moedaFinal} é ${resultado}`);
            
    return res.status(200).json({status: true, response: [{moedaBase: moedaBase, moedaFinal: moedaFinal, resultado: resultado, message: `O valor de 1 ${moedaBase} em ${moedaFinal} é ${resultado}`}]});
    
  } catch(err) {
    console.log(err.message);
    return res.status(400).json({status: false, response: [], log: err.message});
  }
}

/* new CronJob({
  cronTime: "30 * * * *", // At 30 minutes past the hour
  onTick: RoboDolar,
  start: true,
}); */