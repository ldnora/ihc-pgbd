const createTables = (db) => {
    const tables = [
        // código sqlite para a criação de tabelas
        // ex.:
        // `create table teste (
        //     id int primary key
        // )`, 
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

