import { Router } from 'express';
import { RoboTaxaCDI } from './api/services/cdi_rate';
import { RoboDolar } from './api/services/dollar_quote';
import { RoboInflacaoIPCA } from './api/services/inflation_ipca';

const routes = new Router();

routes.get("/taxa-cdi", RoboTaxaCDI);
routes.get("/dolar", RoboDolar);
routes.get("/inflacao", RoboInflacaoIPCA);

export default routes;