# tmdigital case

<a alt="Terra Magna Logo" href="https://terramagna.com.br" target="_blank" rel="noreferrer"><img src="https://terramagna.com.br/wp-content/uploads/2024/05/TM_Logo_Reduzida_Monocromatica.png.webp" width="200"></a>

## Figma

Esse é um case baseado no seguinte Figma:
https://www.figma.com/design/AMAxQLWrxIotqB8NVkgGdB/tmdigital?node-id=0-1&t=UeBctpz8alWA32nb-1

## Requisitos

- É necessário ter o Node.js instalado, preferencialmente a versão 20+.
- É necessário ter o Nx instalado, preferencialmente a versão 10+.

## Stack e Arquitetura

- Nx
- Angular 19
- Tailwind CSS
- NestJS
- TypeScript
- NestJS
- Prisma
- SQLite

Como metodologia arquitetural para o front-end, foi utilizado o padrão [Feature Sliced Design](https://feature-sliced.design/) (obs: ainda estou experimentando o padrão).

Para a API, foi utilizado o padrão modular do NestJS com Prisma como ORM.

## Executando o projeto

Para executar o front-end, rode o seguinte comando:

```sh
npx nx serve tm
```

O front-end será executado na porta 4200.

Para executar a API, rode o seguinte comando:

```sh
npx nx serve api
```

A API será executada na porta 3000.

Também é possível executar o projeto inteiro com o seguinte comando:

```sh
npx nx run-many -t serve
```

## Demonstração

<img src="./tm-gif.gif" alt="Demonstração" />

Vídeo completo: https://drive.google.com/file/d/1njS6VXZ2XQkideB7Hmm7BqI0RqRIPBqi/view?usp=sharing

## A fazer

- [x] Setup do projeto com Nx e dependências (Tailwind, Lucide, etc)
- [x] Criar tela de login
- [x] Criar tela de cadastro
- [x] Criar tela de onboarding
- [x] Criar tela de análise de crédito
- [x] Navegação entre as telas
- [x] Fluxo funcional persistindo dados do localStorage
- [x] Criar guard de autenticação
- [x] Testes para os componentes de autenticação
- [ ] Testes para os componentes shared, onboarding e análise de crédito
- [x] API: POST /register
- [x] API: POST /login
- [x] API: POST /farms
- [x] API: GET /my-farm
- [ ] API: POST /analysis
- [ ] API: GET /analysis
- [x] Autenticação com JWT
- [ ] Criar testes da API
- [x] Integrar API com o front-end: Autenticação
- [x] Integrar API com o front-end: Propriedade
- [ ] Integrar API com o front-end: Análise de crédito
- [ ] Criar testes do Front-end para os serviços atualizados
