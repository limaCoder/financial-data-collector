const puppeteer = require('puppeteer');

export async function RoboInflacaoIPCA() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const urlDaInflacaoIPCA = `https://www.ibge.gov.br/explica/inflacao.php`;
  await page.goto(urlDaInflacaoIPCA);

  try {
    const resultado = await page.evaluate(() => {
      try {
        return document.querySelector('#dadoBrasil > .variavel > .variavel-dado').innerHTML;
      } catch(e) {
        console.log(e)
      }
    });
    
    if (!resultado) {
      throw new Error('Valor do IPCA (Inflação) do último mês não encontrado');
    }

    console.log(`IPCA (Inflação) do último mês: ${resultado}`)

  } catch(err) {
    console.log(err.message)
  }

  // await browser.close();
}