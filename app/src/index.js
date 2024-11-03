const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { createTables } = require('./tables');
const { createTriggers } = require('./triggers');
const { createViews } = require('./views');
const functions = require('./functions');
const queries = require('./queries');

// Criando conexão com o banco
const banco_de_dados_path = path.join(__dirname, 'database.sqlite');
const banco_de_dados = new sqlite3.Database(banco_de_dados_path, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco SQLite');
        
        // Inicializando estruturas do banco
        createTables(banco_de_dados);
        createTriggers(banco_de_dados);
        createViews(banco_de_dados);
    }
});

// Exportando banco configurado com todas as funcionalidades
module.exports = {
    banco_de_dados
};
