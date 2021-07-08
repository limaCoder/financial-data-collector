import puppeteer from 'puppeteer';

export async function RoboDolar(req, res) {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const moedaBase = 'dolar';
    const moedaFinal = 'real';
    const urlDaMoeda = `https://www.google.com/search?q=${moedaBase}+para+${moedaFinal}`;
    await page.goto(urlDaMoeda);
    // await page.screenshot({ path: 'example.png' });
  
    const resultado = await page.evaluate(() => {
      return document.querySelector('.a61j6.vk_gy.vk_sh.Hg3mWc').value;
    });

    console.log(`O valor de 1 ${moedaBase} em ${moedaFinal} é ${resultado}`)
    return res.status(200).json({status: true, response: [{moedaBase: moedaBase, moedaFinal: moedaFinal, resultado: resultado, message: `O valor de 1 ${moedaBase} em ${moedaFinal} é ${resultado}`}]});
}