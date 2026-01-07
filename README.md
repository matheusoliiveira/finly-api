# Finly API 💰

API backend da aplicação **Finly**, responsável pelo gerenciamento de dados,
regras de negócio e autenticação dos usuários.

---

## 🚀 Sobre o Projeto

O Finly é uma aplicação de gestão financeira que permite ao usuário controlar
receitas e despesas de forma organizada e segura.

Este repositório representa o **backend da aplicação**, responsável pela
autenticação, persistência de dados e exposição de uma API RESTful consumida
pelo frontend.

---

## 🛠️ Tecnologias Utilizadas

- Node.js
- TypeScript
- Fastify
- Prisma ORM
- MongoDB
- Zod
- Firebase Authentication
- Docker

---

## 🗄️ Banco de Dados

A aplicação utiliza **MongoDB** como banco de dados, integrado através do
**Prisma ORM**.

---

## ▶️ Como executar o projeto

```bash
# Clone o repositório
git clone https://github.com/matheusoliiveira/finly-api

# Acesse a pasta
cd api-finly

# Instale as dependências
npm install

# Gere o Prisma Client
npx prisma generate

# Inicie a aplicação
npm run dev
