# BookBay — Backend

BookBay é uma plataforma de e-commerce para venda de livros usados, desenvolvida como um projeto fullstack para consolidar conhecimentos de frontend, backend e banco de dados.  
Esta é a parte **backend** da aplicação.

## Tecnologias utilizadas

- **Node.js** — Plataforma para execução do JavaScript no servidor
- **Express** — Framework para criação da API REST
- **MongoDB** — Banco de dados não relacional para armazenamento de dados
- **JWT (JSON Web Token)** — Autenticação e autorização de usuários
- **Bcrypt** — Criptografia de senhas
- **Nodemailer** — Envio de e-mails de notificação de pedidos
- **Dotenv** — Gerenciamento de variáveis de ambiente

## Funcionalidades

- ✅ CRUD de livros (com rotas protegidas para administradores)
- ✅ CRUD de pedidos (com rotas protegidas para administradores)
- ✅ Autenticação e registro de usuários com **JWT**  
- ✅ Criação e gerenciamento de pedidos  
- ✅ Envio automático de e-mails para novos pedidos  
- ✅ Filtragem de livros por gênero  
- ✅ Rotas protegidas para dados sensíveis  
- ✅ Integração direta com o **frontend** da aplicação  

## Integração com o frontend

O backend fornece a API consumida pelo **frontend** da **BookBay**, responsável por:

- Exibição do catálogo de livros
- Gerenciamento do carrinho de compras
- Criação e acompanhamento de pedidos
- Autenticação e autorização de usuários

Repositório do frontend: [BookBay Frontend](https://github.com/Caiorossi00/Bookbay-frontend)
