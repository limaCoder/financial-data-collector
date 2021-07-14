import puppeteer from 'puppeteer';

export async function RoboTaxaCDI(req, res) {
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });

  const page = await browser.newPage();
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
    return res.status(200).json({status: true, response: [{cdi: resultado, message: `A Taxa CDI do último ano está valendo: ${resultado}`}]});

  } catch(err) {
    console.log(err.message);
    return res.status(400).json({status: false, response: [], log: err.message});
  }

}