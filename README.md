# Frontend

Este repositório contém apenas o frontend da aplicação, desenvolvido em Nuxt 3 e Vue 3, consumindo uma API RESTful para gestão de participantes, salas e espaços de café.

## 📦 Tecnologias

* **Framework**: Nuxt 3 (Vue 3, TypeScript)
* **Estilização**: Tailwind CSS, Nuxt UI
* **Fetch**: composable `useApi`
* **Testes**: Vitest (unitários), Playwright/Cypress (E2E)
* **Containerização**: Docker, Dockerfile incluso

## 🚀 Pré-requisitos

* Node.js v16+ e npm
* (Opcional) Docker & Docker Compose

## 🛠️ Instalação

Execute:

```bash
npm install
```

## 🏃‍♂️ Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## 📦 Build e Preview

Para gerar o build e pré-visualizar:

```bash
npm run build
npm run preview
```

## 🐳 Docker (Frontend)

### Usando Dockerfile

```bash
docker build -t frontend-app .
docker run -d -p 3000:3000 frontend-app
```

## 🧪 Testes

### Testes Unitários (Vitest)

```bash
npm run test:unit
```
