# Sistema de Finanças Pessoais

Um sistema completo para gerenciamento de finanças pessoais desenvolvido com arquitetura hexagonal (Clean Architecture), utilizando Next.js, TypeScript, Prisma e PostgreSQL.

## 🚀 Funcionalidades

- ✅ Cadastro e listagem de receitas
- ✅ Cadastro e listagem de despesas  
- ✅ Sistema de tags para categorização
- ✅ Resumo financeiro com totais e médias
- ✅ Interface moderna com Material-UI
- ✅ API REST completa
- ✅ Validação de dados robusta
- ✅ Arquitetura hexagonal (Clean Architecture)

## 🏗️ Arquitetura

O projeto segue os princípios da **Arquitetura Hexagonal** (Clean Architecture), organizando o código em camadas bem definidas:

```
src/
├── core/           # Domínio da aplicação
│   ├── entities/    # Entidades de negócio
│   ├── value-objects/ # Objetos de valor
│   ├── ports/       # Interfaces (portas)
│   └── use-cases/   # Casos de uso
├── adapters/        # Adaptadores
│   ├── controllers/ # Controladores HTTP
│   ├── repositories/ # Implementação dos repositórios
│   └── mappers/     # Mapeadores de dados
├── infrastructure/  # Infraestrutura
│   ├── database/    # Configuração do banco
│   └── config/      # Configurações gerais
└── ui/             # Interface do usuário
    ├── components/  # Componentes React
    ├── pages/       # Páginas Next.js
    └── hooks/       # Hooks customizados
```

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Material-UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Banco de Dados**: PostgreSQL
- **Containerização**: Docker & Docker Compose
- **Testes**: Jest
- **Linting**: ESLint

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Docker e Docker Compose (opcional)
- PostgreSQL (se não usar Docker)

## 🚀 Como executar

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd financas-hexagonal
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL="postgresql://financas_user:financas_password@localhost:5432/financas"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Inicie o banco de dados (Docker)
```bash
docker compose up -d
```

### 5. Execute as migrações do banco
```bash
npx prisma migrate dev
npx prisma generate
```

### 6. Inicie a aplicação
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📊 Endpoints da API

### Receitas
- `GET /api/receitas` - Lista todas as receitas
- `POST /api/receitas` - Cria uma nova receita

### Despesas  
- `GET /api/despesas` - Lista todas as despesas
- `POST /api/despesas` - Cria uma nova despesa

### Tags
- `GET /api/tags` - Lista todas as tags
- `POST /api/tags` - Cria uma nova tag

### Resumo
- `GET /api/resumo` - Obtém resumo financeiro do período

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

## 🏗️ Build para produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

Para mais detalhes sobre a arquitetura, consulte:
- [Documentação da Arquitetura](docs/arquitetura.md)
- [Recursos do Sistema](docs/recursos-do-sistema.md)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.