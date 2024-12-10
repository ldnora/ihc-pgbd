const express = require('express');
const cors = require('cors');
const { init_banco_de_dados } = require('./data/banco_de_dados');
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3001', 
    credentials: true, 
}));
app.use('/api', routes);

init_banco_de_dados();

if (require.main === module) {
    app.listen(3000, () => {
        console.log(`Servidor rodando na porta 3000`);
    });
}

module.exports = app;