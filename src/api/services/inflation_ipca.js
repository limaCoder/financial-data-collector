import puppeteer from 'puppeteer';

export async function RoboInflacaoIPCA(req, res) {
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });

  const page = await browser.newPage();
  const urlDaInflacaoIPCA = `https://www.ibge.gov.br/indicadores`;
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
        return document.querySelector('#indicador-ipca td.dozemeses').innerText;
      } catch(e) {
        console.log(e)
      }
    });
    
    if (!resultado) {
      throw new Error('Valor do IPCA (Inflação) dos últimos 12 meses não encontrado');
    }

    await browser.close();
    console.log(`IPCA (Inflação) dos últimos 12 meses: ${resultado}`);
    return res.status(200).json({status: true, response: [{ipca: resultado, message: `IPCA (Inflação) dos últimos 12 meses: ${resultado}`}]});
    
  } catch(err) {
    console.log(err.message);
    return res.status(400).json({status: false, response: [], log: err.message});
  }
  
}