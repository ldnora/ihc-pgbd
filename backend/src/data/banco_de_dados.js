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

    await banco_de_dados.run('pragma journal_mode = WAL');

    // Criação das tabelas
    await banco_de_dados.run(`
        create table if not exists Usuario (
            usuario_id integer primary key,
            nome varchar(30),
            email varchar(30),
            senha varchar(255)
        )
    `);

    await banco_de_dados.run(`
        create table if not exists Categoria (
            categoria_id integer primary key autoincrement,
            usuario_id integer not null,
            nome varchar(30),
            descricao varchar(255),
            foreign key (usuario_id) references Usuario(usuario_id) on delete cascade
        )
    `);

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

    // Triggers
    await banco_de_dados.run(`
        create trigger if not exists check_impedir_criar_eventos_em_um_mesmo_horario
        before insert on Evento
        for each row
        begin
            select raise(abort, 'Conflito de horários detectado. Você não pode criar dois ou mais eventos no mesmo horário existente.')
            where exists (
                select 1
                from Evento
                where (new.data_inicio between data_inicio and data_fim
                    or new.data_fim between data_inicio and data_fim
                    or (new.data_inicio <= data_inicio and new.data_fim >= data_fim))
            );
        end;
    `);

    // await banco_de_dados.run(`
    //     create trigger if not exists check_impedir_editar_eventos_em_um_mesmo_horario
    //     before update on Evento
    //     for each row 
    //     begin
    //         select raise(abort, 'Conflito de horários detectado. Você não pode ter dois ou mais eventos no mesmo horário existente.')
    //         where exists (
    //             select 1
    //             from Evento
    //             where (new.data_inicio between data_inicio and data_fim
    //                 or new.data_fim between data_inicio and data_fim
    //                 or (new.data_inicio <= data_inicio and new.data_fim >= data_fim))
    //         );
    //     end;
    // `);

    await banco_de_dados.run(`
        create trigger if not exists delete_categoria_evento
        before delete on Categoria
        for each row
        begin 
            update Evento
            set categoria_id = null
            where categoria_id = old.categoria_id;
        end;
    `);

    // Inserção de dados iniciais

    const usuarioExiste = await banco_de_dados.get(`SELECT COUNT(*) AS count FROM Usuario`);
    if (usuarioExiste.count === 0) {
        await banco_de_dados.run(`
            INSERT INTO Usuario(usuario_id, nome, email, senha)
            VALUES (1, 'Leandro', 'ldnora@inf.ufsm.br', '123')
        `);
    }

    // Verificar se já existem categorias
    const categoriaExiste = await banco_de_dados.get(`SELECT COUNT(*) AS count FROM Categoria`);
    if (categoriaExiste.count === 0) {
        await banco_de_dados.run(`
            INSERT INTO Categoria (usuario_id, nome, descricao)
            VALUES (1, 'Trabalho', 'Eventos relacionados ao trabalho')
        `);
        await banco_de_dados.run(`
            INSERT INTO Categoria (usuario_id, nome, descricao)
            VALUES (1, 'Pessoal', 'Eventos pessoais e familiares')
        `);
        await banco_de_dados.run(`
            INSERT INTO Categoria (usuario_id, nome, descricao)
            VALUES (1, 'Estudos', 'Eventos de estudo e aprendizado')
        `);
    }

    const eventoExiste = await banco_de_dados.get(`SELECT COUNT(*) AS count FROM Evento`);
    if (eventoExiste.count === 0) {
        await banco_de_dados.run(`
            INSERT INTO Evento (usuario_id, categoria_id, nome, descricao, data_inicio, data_fim)
            VALUES (1, 1, 'Reunião de Projeto', 'Discussão sobre o projeto X', '2024-12-10 10:00:00', '2024-12-10 11:00:00')
        `);
        await banco_de_dados.run(`
            INSERT INTO Evento (usuario_id, categoria_id, nome, descricao, data_inicio, data_fim)
            VALUES (1, 2, 'Aniversário', 'Festa de aniversário do João', '2024-12-12 18:00:00', '2024-12-12 21:00:00')
        `);
        await banco_de_dados.run(`
            INSERT INTO Evento (usuario_id, categoria_id, nome, descricao, data_inicio, data_fim)
            VALUES (1, 3, 'Aula de Matemática', 'Aula de álgebra linear', '2024-12-11 09:00:00', '2024-12-11 10:30:00')
        `);
        await banco_de_dados.run(`
            INSERT INTO Evento (usuario_id, categoria_id, nome, descricao, data_inicio, data_fim)
            VALUES (1, 1, 'Reunião de Equipe', 'Reunião semanal de acompanhamento', '2024-12-15 14:00:00', '2024-12-15 15:00:00')
        `);
        await banco_de_dados.run(`
            INSERT INTO Evento (usuario_id, categoria_id, nome, descricao, data_inicio, data_fim)
            VALUES (1, 2, 'Caminhada', 'Caminhada no parque', '2024-12-13 07:00:00', '2024-12-13 08:00:00')
        `);
    }

    console.log('Banco de dados inicializado com sucesso!');
};

module.exports = {
    open_banco_de_dados,
    init_banco_de_dados
};
