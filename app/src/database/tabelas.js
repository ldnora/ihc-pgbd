const createTables = (db) => {
    const tables = [
        `create table usuario (
            usuario_id int primary key not null autoincrement,
            nome varchar(30),
            email varchar(30),
            senha varchar(255)
        )`,
        `create table categoria (
            categoria_id int primary key not null autoincrement,
            nome varchar(30),
            descricao varchar(255)
        )`,
        `create table evento (
            evento_id int primary key not null autoincrement,
            usuario_id int,
            categoria_id int,
            nome varchar(30) not null,
            descricao varchar(255),
            data_inicio datetime not null,
            data_fim datetime not null,
            foreign key (usuario_id) references usuario(usuario_id),
            foreign key (categoria_id) references categoria(categoria_id)
        )`
    ];

    tables.forEach(table => {
        db.run(table, (err) => {
            if (err) {
                console.error('Erro ao criar tabela:', err);
            }
        });
    });
};

module.exports = { createTables };

