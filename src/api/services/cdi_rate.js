import puppeteer from 'puppeteer';

export async function RoboTaxaCDI(req, res) {
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

    return res.status(200).json({status: true, response: [{cdi: resultado, message: `A Taxa CDI esse mês está valendo: ${resultado}`}]});
  } catch(err) {
    console.log(err.message);
    return res.status(400).json({status: false, response: [], log: err.message});
  }

  // await browser.close();
}