import express from 'express';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3333;

app.get('/', (req, res) => {
  return res.json("Servidor funcionando com sucesso!");
});

app.use(routes);

app.listen(PORT, () => console.log("Servidor rodando na porta 3333"));