const puppeteer = require('puppeteer');

export async function RoboDolar() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const moedaBase = 'dolar';
    const moedaFinal = 'real';
    const urlDaMoeda = `https://www.google.com/search?q=${moedaBase}+para+${moedaFinal}`;
    await page.goto(urlDaMoeda);
    // await page.screenshot({ path: 'example.png' });
  
    try {
      const resultado = await page.evaluate(() => {
        try {
          return document.querySelector('.a61j6.vk_gy.vk_sh.Hg3mWc').value;
        } catch(e) {
          console.log(e)
        }
      });
      
      if (!resultado) {
        throw new Error('Cotação não encontrada');
      }

      console.log(`o valor de 1 ${moedaBase} em ${moedaFinal} é ${resultado}`)
      
    } catch(err) {
      console.log(err.message)
    }

    // await browser.close();
}