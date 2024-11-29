const request = require('supertest');
const app = require('../app');
const { open_banco_de_dados } = require('../data/banco_de_dados');

describe('Testes da API de Usuários', () => {
    let server;
    let db;

    beforeAll(async () => {
        server = app.listen(3001); // Inicia o servidor em uma porta específica
        db = await open_banco_de_dados();
    });

    afterAll(async () => {
        await server.close(); // Fecha o servidor após todos os testes
    });

    beforeEach(async () => {
        // Limpa a tabela de usuários antes de cada teste
        await db.run('DELETE FROM Usuario');
    });

    it('Deve criar um novo usuário', async () => {
        const response = await request(server)
            .post('/api/usuario/criar')
            .send({
                usuario_id: '1',
                nome: 'Lorenzo',
                email: 'lorenzo@email.com',
                senha: '123456',
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('success', true);
    });
});
