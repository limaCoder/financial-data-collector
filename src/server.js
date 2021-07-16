import express from 'express';
const app = express();

import routes from './routes';

import cors from 'cors';

app.use(cors());

const PORT = process.env.PORT || 5500;

app.get('/', (req, res) => {
  return res.json("Servidor funcionando com sucesso!");
});

app.use(routes);

app.listen(PORT, () => console.log("Servidor rodando na porta 5500"));