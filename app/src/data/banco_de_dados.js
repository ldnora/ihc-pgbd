const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('node:path');

async function open_banco_de_dados() {
    const dbPath = path.resolve(__dirname, 'banco_de_dados.db');
    return sqlite.open({
        filename: dbPath,
        driver: sqlite3.Database
    });
}

async function init_banco_de_dados() {
    const banco_de_dados = await open_banco_de_dados();

    // tabela de usuários 
    await banco_de_dados.run(`
        CREATE TABLE IF NOT EXISTS Usuario (
            usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome VARCHAR(30),
            email VARCHAR(30),
            senha VARCHAR(255)
        )
    `);

    // tabela de categorias
    await banco_de_dados.run(`
        CREATE TABLE IF NOT EXISTS Categoria (
            categoria_id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome VARCHAR(30),
            descricao VARCHAR(255)
        )
    `);

    // tabela de evento
    await banco_de_dados.run(`
        CREATE TABLE IF NOT EXISTS Evento (
            evento_id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            categoria_id INTEGER,
            nome VARCHAR(30) NOT NULL,
            descricao VARCHAR(255),
            data_inicio DATETIME NOT NULL,
            data_fim DATETIME NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id),
            FOREIGN KEY (categoria_id) REFERENCES categoria(categoria_id)
        )
    `);

    // trigger que impede a criação de dois ou mais eventos em um mesmo horário
    await banco_de_dados.run(`
        create trigger if not exists check_conflito_de_horarios_de_eventos_na_mesma_data
        before insert on Evento
        for each row
        begin
            if exists (
                select 1
                from Evento
                where (new.data_inicio between data_inicio and data_fim or
                       new.data_fim between data_inicio and data_fim or
                       (new.data_inicio <= data_inicio and new.data_fim >= data_fim))
            ) then 
                signal sqlstate '45000'
                set message_text = 'Conflito de horários detectado. Você não pode criar dois ou mais eventos no mesmo horário existente.'
            end if;
        end;
    `),

    await banco_de_dados.run(`
        create function consultar_eventos_por_semana(offset int)
        
    `)
}

module.exports = {
    open_banco_de_dados,
    init_banco_de_dados
}