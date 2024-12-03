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
        create table if not exists Usuario (
            usuario_id integer primary key autoincrement,
            nome varchar(30),
            email varchar(30),
            senha varchar(255)
        )
    `);

    // tabela de categorias com delete cascade quando exclui um usuario
    await banco_de_dados.run(`
        create table if not exists Categoria (
            categoria_id integer primary key autoincrement,
            usuario_id integer not null,
            nome varchar(30),
            descricao varchar(255),
            foreign key (usuario_id) references Usuario(usuario_id) on delete cascade
        )
    `);

    // tabela de evento com delete cascade quando exclui um usuario
    await banco_de_dados.run(`
        create table if not exists Evento (
            evento_id integer primary key autoincrement,
            usuario_id integer not null,
            categoria_id integer,
            nome varchar(30) not null,
            descricao varchar(255),
            data_inicio datetime not null,
            data_fim datetime not null,
            foreign key (usuario_id) references Usuario(usuario_id) on delete cascade,
            foreign key (categoria_id) references Categoria(categoria_id)
        )
    `);

    // trigger que impede a criação de dois ou mais eventos em um mesmo horário
    await banco_de_dados.run(`
        create trigger if not exists check_conflito_de_horarios_de_eventos_na_mesma_data
        before insert on Evento
        for each row
        begin
            select raise(abort, 'Conflito de horários detectado. você não pode criar dois ou mais eventos no mesmo horário existente.')
            where exists (
                select 1
                from evento
                where (new.data_inicio between data_inicio and data_fim
                    or new.data_fim between data_inicio and data_fim
                    or (new.data_inicio <= data_inicio and new.data_fim >= data_fim))
            );
        end;
    `);

    await banco_de_dados.run(`
        create trigger delete_categoria_evento
        before delete Categoria
        for each row
        begin 
            update Eventos
            set categoria_id = null
            where categoria_id = old.categoria_id;
        end;
    `);
    
    console.log('Banco de dados inicializado com sucesso!');
};

module.exports = {
    open_banco_de_dados,
    init_banco_de_dados
};