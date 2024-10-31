### Usuário

| Campo     | Tipo     |
|-----------|----------|
| idUsuario | int pk   |
| nome      | string   |
| email     | string   |
| senha     | string   |

### Categoria

| Campo      | Tipo    |
|------------|---------|
| idCategoria| int pk  |
| nome       | string  |
| descricao  | string  |

### Evento

| Campo       | Tipo        |
|-------------|---------    |
| idEvento    | int pk      |
| idUsuario   | int fk      |
| idCategoria | int         |
| titulo      | string      |
| descricao   | string      |
| data_inicio | datetime    |
| data_fim    | datetime    |

**Referências:**

- `idUsuario` refere-se ao ID do usuário da tabela **Usuário**
- `idCategoria` refere-se ao ID da categoria da tabela **Categoria**
