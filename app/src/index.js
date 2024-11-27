const express = require('express');
const port = 3000;

const { initializeDatabase } = require('./data/banco_de_dados');

const app = express();
app.use(express.json()); // Middleware para parse JSON

// Função para inicializar o banco e criar as tabelas
async function initializeDatabase() {
    try {
        await criar_tabelas(banco_de_dados);
        console.log('Tabelas criadas com sucesso!');
    } catch (err) {
        console.error('Erro ao criar tabelas:', err);
    }
}

initializeDatabase();

// Rota de teste
app.get('/', (req, res) => {
    res.send('API Agenda Digital funcionando!');
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
