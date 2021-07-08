import puppeteer from 'puppeteer';

export async function RoboInflacaoIPCA(req, res) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const urlDaInflacaoIPCA = `https://www.ibge.gov.br/explica/inflacao.php`;
  await page.goto(urlDaInflacaoIPCA);

  const resultado = await page.evaluate(() => {
    return document.querySelector('#dadoBrasil > .variavel > .variavel-dado').innerHTML;
  });

  console.log(`IPCA (Inflação) do último mês: ${resultado}`);
  return res.status(200).json({status: true, response: [{ipca: resultado, message: `IPCA (Inflação) do último mês: ${resultado}`}]});
}