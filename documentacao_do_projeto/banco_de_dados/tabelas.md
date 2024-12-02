# Tabelas

## Usuário

| Campo         | Tipo     |
|-              |-         |
| usuario_id    | int pk   |
| nome          | string   |
| email         | string   |
| senha         | string   |

## Categoria

| Campo         | Tipo      |
|-              |-          |
| categoria_id  | int pk    |
| usuario_id    | int fk    |
| nome          | string    |
| descricao     | string    |

## Evento

| Campo         | Tipo        |
|-              |-            |
| evento_id     | int pk      |
| usuario_id    | int fk      |
| categoria_id  | int fk      |
| nome          | string      |
| descricao     | string      |
| data_inicio   | datetime    |
| data_fim      | datetime    |

**Referências:**

- `usuario_id` refere-se ao ID do usuário da tabela **Usuário**
- `categoria_id` refere-se ao ID da categoria da tabela **Categoria**
