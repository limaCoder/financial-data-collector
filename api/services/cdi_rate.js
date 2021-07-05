const puppeteer = require('puppeteer');

export async function RoboTaxaCDI() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const urlDaTaxaCDI = `https://www.melhorcambio.com/cdi`;
  await page.goto(urlDaTaxaCDI);

  try {
    const resultado = await page.evaluate(() => {
      try {
        return document.querySelector('#inp-mes').value;
      } catch(e) {
        console.log(e)
      }
    });
    
    if (!resultado) {
      throw new Error('Taxa CDI não encontrada');
    }

    console.log(`A Taxa CDI esse mês está valendo: ${resultado}`)

  } catch(err) {
    console.log(err.message)
  }

  // await browser.close();
}