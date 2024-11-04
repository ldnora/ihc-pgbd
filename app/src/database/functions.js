const { banco_de_dados } = require("..");
const { queries } = require("./queries");

const funcitons = {
    criar_usuario: (banco_de_dados, {nome, email, senha}) => {
        return new Promise((resolve, reject) => {
            banco_de_dados.run(queries.insert_new_usuario, [nome, email, senha], function(err) {
                if(err)
                    reject(err);
                resolve ({ nome, email });
            });
        });
    },

    criar_categoria: (banco_de_dados, {nome, descricao}) => {
        return new Promise ((resolve, reject) => {
            banco_de_dados.run(queries.insert_new_categoria, [nome, descricao], function(err) {
                if(err)
                    reject(err)
                resolve ({nome, descricao});
            });
        });
    },

    criar_evento: (banco_de_dados, informacoes_evento) => {
        const {usuario_id, categoria_id, nome, descricao, data_inicio, data_fim} = informacoes_evento;
        
        return new Promise((resolve, reject) => {
            banco_de_dados.run(
                queries.insert_new_evento, 
                [usuario_id, categoria_id, nome, descricao, data_inicio, data_fim],
                function(err) {
                    if(err)
                        reject(err);
                    resolve (...informacoes_evento);
                }
            );
        });
    },

    buscar_eventos_do_usuario: (banco_de_dados, usuario_id) => {
        return new Promise((resolve, reject) => {
            banco_de_dados.all(queries.get_evento_by_user_id, [usuario_id], (err, row) => {
                if(err)
                    reject(err);
                resolve(row);
            });
        });
    }

};

module.exports = { funcitons };