import puppeteer from 'puppeteer';

export async function RoboInflacaoIPCA(req, res) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const urlDaInflacaoIPCA = `https://www.ibge.gov.br/explica/inflacao.php`;
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
        return document.querySelector('#dadoBrasil > .variavel > .variavel-dado').innerHTML;
      } catch(e) {
        console.log(e)
      }
    });
    
    if (!resultado) {
      throw new Error('Valor do IPCA (Inflação) do último mês não encontrado');
    }

    console.log(`IPCA (Inflação) do último mês: ${resultado}`);
    return res.status(200).json({status: true, response: [{ipca: resultado, message: `IPCA (Inflação) do último mês: ${resultado}`}]});

  } catch(err) {
    console.log(err.message);
    return res.status(400).json({status: false, response: [], log: err.message});
  }

  // await browser.close();
}