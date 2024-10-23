# Possíveis tecnologias a serem utilizadas

Aqui estão algumas tecnologias que podemos utilizar para o desenvolvimento do banco de dados do trabalho de PGBD, as quais devem ser analisadas (obs.: não foi feito uma pesquisa em repositórios semelhantes no github)

## Infraestrutura: 
- [x]  docker para os containers e docker -> compose para a orquestração de containers. Pensei neles pois você consegue ter um ambiente de desenvolvimento padronizado em diferentes sistemas operacionais com suas particularidades, no caso Leandro com ubuntu e Lorenzo com windows. Pode-se fazer 3 containers, um para o banco de dados, outro para o backend e outro para o front, sendo que os 3 estão em uma rede docker com as portas liberadas para realizar a comunicação
  - Como o Leandro tem maior familiaridade com docker, iremos usá-lo
- [ ]  Ferramentas BaaS (firebase, etc) (obs.: nesse caso, roda tudo nela, ao invés de rodar localmente)

## Backend e banco de dados: 
- [x]  Node.js + express.js + MongoDB (noSQL) ou PostgreSQL ou sqlite (SQL)
  - Vamos usar essa tecnologia pois representa que é bom e possui bastante conteúdo na internet
- [ ]  Django (python) + PostgreSQL
- [ ]  Ruby on Rails + PostgreSQL ou MySQL

## Frontend: 
- [ ] Chadcn não é low-code, envolve a programação, mas a estilização não precisa ser feita, apenas usar o html
- [ ] Retol
- [ ] Mendix
- [ ] 