const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('node:path');

async function open_banco_de_dados() {
    const dbPath = path.resolve(__dirname, 'banco_de_dados.db');
    return sqlite.open({
        filename: dbPath,
        driver: sqlite3.Database
    });
};

async function init_banco_de_dados() {
    const banco_de_dados = await open_banco_de_dados();

    // tabela de usuários 
    await banco_de_dados.run(`
        create table if not exists usuario (
            usuario_id integer primary key autoincrement,
            nome varchar(30),
            email varchar(30),
            senha varchar(255)
        )
    `);

    // tabela de categorias
    await banco_de_dados.run(`
        create table if not exists categoria (
            categoria_id integer primary key autoincrement,
            nome varchar(30),
            descricao varchar(255)
        )
    `);

    // tabela de evento
    await banco_de_dados.run(`
        create table if not exists evento (
            evento_id integer primary key autoincrement,
            usuario_id integer,
            categoria_id integer,
            nome varchar(30) not null,
            descricao varchar(255),
            data_inicio datetime not null,
            data_fim datetime not null,
            foreign key (usuario_id) references usuario(usuario_id),
            foreign key (categoria_id) references categoria(categoria_id)
        )
    `);

    // trigger que impede a criação de dois ou mais eventos em um mesmo horário
    await banco_de_dados.run(`
        create trigger if not exists check_conflito_de_horarios_de_eventos_na_mesma_data
        before insert on Evento
        for each row
        begin
            select raise(abort, 'conflito de horários detectado. você não pode criar dois ou mais eventos no mesmo horário existente.')
            where exists (
                select 1
                from evento
                where (new.data_inicio between data_inicio and data_fim
                    or new.data_fim between data_inicio and data_fim
                    or (new.data_inicio <= data_inicio and new.data_fim >= data_fim))
            );
        end;
    `)
};

module.exports = {
    open_banco_de_dados,
    init_banco_de_dados
};