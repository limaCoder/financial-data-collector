const express = require('express');
const app = express();

import { RoboTaxaCDI } from './api/services/cdi_rate';
import { RoboDolar } from './api/services/dollar_quote';
import { RoboInflacaoIPCA } from './api/services/inflation_ipca';

app.get('/', (req, res) => {
  return res.json ()
});

app.listen('3333');