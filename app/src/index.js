const express = require('express');
const { init_banco_de_dados } = require('./data/banco_de_dados');
const routes = require('./routes');

const app = express();
app.use(express.json());

app.use('/api', routes);

init_banco_de_dados();

app.listen(3000, () => {
    console.log(`Servidor rodando na porta 3000`);
});