const queries  = {
    get_all_usuario: `
        select * 
        from usuario
    `,
    get_ususario_by_id: `
        select * 
        from usuario
        where usuario_id = ?
    `,
    insert_new_usuario: `
        insert into usuario(nome, email, senha) values (?, ?, ?)
    `,
    update_usuario: `
        update usuario 
        set nome = ?, email = ?, senha = ? 
        where usuario_id = ?
    `,
    delete_usuario: `
        delete from usuario 
        where usuario_id = ?
    `,


    get_all_categoria: `
        select * 
        from categoria 
    `,
    get_categoria_by_id: `
        select * 
        from categoria
        where categoria_id = ?
    `,
    insert_new_categoria: `
        insert into categoria (nome, descricao) values (?, ?)
    `,
    update_categoria: `
        update categoria
        set nome = ?, descricao = ?
        where categoria_id = ?
    `,
    delete_categoria: `
        delete from categoria
        where categoria_id = ?
    `,


    get_all_evento: `
        select *
        from evento
    `,
    get_evento_by_id: `
        select * 
        from evento
        where evento_id = ?
    `,
    get_evento_by_user_id: `
        select * 
        from evento 
        where user_id = ?
    `,
    insert_new_evento: `
        insert into evento (usuario_id, categoria_id, nome, descricao, data_inicio, data_fim) values (?, ?, ?, ?, ?, ?, )
    `,
    update_evento: `
        update evento
        set usuario_id = ?, categoria_id = ?, nome = ?, descricao = ?, data_inicio = ?, data_fim = ?
        where evento_id = ?
    `,
    delete_evento: `
        delete from evento
        where evento_id = ?
    `
};


module.exports = { queries };