# Possíveis tecnologias a serem utilizadas

Aqui estão algumas tecnologias que podemos utilizar para o desenvolvimento do banco de dados do trabalho de PGBD, as quais devem ser analisadas (obs.: não foi feito uma pesquisa em repositórios semelhantes no github)

## Infraestrutura: 
- [x]  docker para os containers e docker -> compose para a orquestração de containers. Pensei neles pois você consegue ter um ambiente de desenvolvimento padronizado em diferentes sistemas operacionais com suas particularidades, no caso Leandro com ubuntu e Lorenzo com windows. Pode-se fazer 3 containers, um para o banco de dados, outro para o backend e outro para o front, sendo que os 3 estão em uma rede docker com as portas liberadas para realizar a comunicação
  - Como o Leandro tem maior familiaridade com docker, iremos usá-lo
  - Entretanto, o Leandro teve dificuldades ao usar o docker para criar o projeto, decidiu abandonar o docker
- [ ]  Ferramentas BaaS (firebase, etc) (obs.: nesse caso, roda tudo nela, ao invés de rodar localmente)

## Backend e banco de dados: 
- [x]  Node.js + express.js + MongoDB (noSQL) ou PostgreSQL ou sqlite (SQL)
  - Vamos usar essa tecnologia pois representa que é bom e possui bastante conteúdo na internet.
    Obs.: nunca usamos 
- [ ]  Django (python) + PostgreSQL
- [ ]  Ruby on Rails + PostgreSQL ou MySQL

## Frontend: 
- [ ] Chadcn não é low-code, envolve html e a estilização não precisa ser feita
- [ ] Retol
- [ ] Mendix
- [ ] ToolJet
- [ ] Apex Designer
- [ ] Convertigo
- [x] Figma to flutter. Escolhemos ela, pois facilita bastante o desenvolvimento

- Obs.: as ferramentas para o front foram escolhidas para que possam rodar em um container docker