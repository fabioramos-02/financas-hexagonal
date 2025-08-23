# Sistema de Gestão Financeira Pessoal

## 📋 Descrição

Sistema de gestão financeira pessoal desenvolvido com **arquitetura hexagonal (Clean Architecture)**, utilizando **Next.js**, **TypeScript**, **Prisma ORM**, **PostgreSQL** e **Material-UI**. O sistema permite o controle de receitas, despesas e geração de relatórios financeiros.

## 🏗️ Arquitetura

O projeto segue os princípios da **Arquitetura Hexagonal** (Ports and Adapters), garantindo:

- **Separação de responsabilidades**
- **Independência de frameworks**
- **Facilidade de testes**
- **Flexibilidade para mudanças**

### Estrutura de Pastas

```
src/
├── core/                    # Camada de domínio
│   ├── domain/
│   │   ├── entities/        # Entidades do negócio
│   │   ├── value-objects/   # Objetos de valor
│   │   └── services/        # Serviços de domínio
│   ├── ports/              # Interfaces (contratos)
│   │   ├── repositories/    # Contratos dos repositórios
│   │   └── use-cases/      # Contratos dos casos de uso
│   └── use-cases/          # Implementação dos casos de uso
├── adapters/               # Camada de adaptadores
│   ├── repositories/       # Implementação dos repositórios
│   └── mappers/           # Mapeadores de dados
├── infrastructure/         # Camada de infraestrutura
│   └── database/          # Configurações do banco
└── ui/                    # Camada de interface
    ├── components/        # Componentes React
    ├── pages/            # Páginas Next.js
    └── lib/              # Utilitários da UI
```

## 🚀 Tecnologias

- **Frontend**: Next.js 14, React 18, TypeScript, Material-UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Banco de Dados**: PostgreSQL
- **Containerização**: Docker, Docker Compose
- **Testes**: Jest, Testing Library
- **Linting**: ESLint, TypeScript

## 📦 Funcionalidades

### ✅ Implementadas

- **Gestão de Receitas**
  - Cadastro de receitas
  - Listagem de receitas
  - Associação com tags

- **Gestão de Despesas**
  - Cadastro de despesas
  - Listagem de despesas
  - Associação com tags

- **Sistema de Tags**
  - Criação de tags personalizadas
  - Cores personalizáveis
  - Categorização de transações

- **Relatórios Financeiros**
  - Resumo financeiro por período
  - Cálculo de saldo
  - Médias de receitas e despesas

- **Interface de Usuário**
  - Dashboard principal
  - Formulários de cadastro
  - Listagem de transações
  - Design responsivo

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Git

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd financas-hexagonal
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL="postgresql://financas_user:financas_password@localhost:5432/financas"
NEXTAUTH_SECRET="seu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Instalação com Docker (Recomendado)

```bash
# Subir os serviços
docker-compose up -d

# Executar migrações
docker-compose exec app npx prisma migrate deploy

# Popular banco com dados iniciais (opcional)
docker-compose exec app npx prisma db seed
```

### 4. Instalação Local

```bash
# Instalar dependências
npm install

# Subir apenas o banco de dados
docker-compose up -d db

# Executar migrações
npx prisma migrate deploy

# Gerar cliente Prisma
npx prisma generate

# Popular banco (opcional)
npx prisma db seed

# Iniciar aplicação
npm run dev
```

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linting
npm run type-check   # Verifica tipos TypeScript

# Banco de dados
npm run db:migrate   # Executa migrações
npm run db:seed      # Popula banco com dados iniciais
npm run db:studio    # Abre Prisma Studio
npm run db:reset     # Reseta banco de dados

# Testes
npm run test         # Executa testes
npm run test:watch   # Executa testes em modo watch
npm run test:coverage # Executa testes com coverage

# Docker
npm run docker:up    # Sobe containers
npm run docker:down  # Para containers
npm run docker:logs  # Visualiza logs
```

## 🌐 Endpoints da API

### Receitas
- `GET /api/receitas` - Lista todas as receitas
- `POST /api/receitas` - Cria nova receita

### Despesas
- `GET /api/despesas` - Lista todas as despesas
- `POST /api/despesas` - Cria nova despesa

### Tags
- `GET /api/tags` - Lista todas as tags
- `POST /api/tags` - Cria nova tag

### Resumo
- `GET /api/resumo?dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD` - Gera resumo financeiro

## 🧪 Testes

O projeto utiliza **Jest** e **Testing Library** para testes:

```bash
# Executar todos os testes
npm run test

# Testes em modo watch
npm run test:watch

# Coverage dos testes
npm run test:coverage
```

### Estrutura de Testes

- **Testes Unitários**: Entidades, Value Objects, Use Cases
- **Testes de Integração**: Repositórios, API Routes
- **Testes de Componentes**: Componentes React

## 📊 Monitoramento

### Prisma Studio

Para visualizar e gerenciar dados do banco:

```bash
npx prisma studio
```

### Adminer (Docker)

Acesse `http://localhost:8080` quando usar Docker Compose.

## 🔧 Desenvolvimento

### Adicionando Nova Funcionalidade

1. **Criar entidade** em `src/core/domain/entities/`
2. **Definir porta** em `src/core/ports/`
3. **Implementar caso de uso** em `src/core/use-cases/`
4. **Criar adaptador** em `src/adapters/`
5. **Adicionar rota API** em `src/ui/pages/api/`
6. **Criar interface** em `src/ui/pages/`

### Padrões de Código

- **ESLint** para linting
- **Prettier** para formatação
- **TypeScript** para tipagem
- **Conventional Commits** para mensagens de commit

## 🚀 Deploy

### Docker

```bash
# Build da imagem
docker build -t financas-app .

# Executar container
docker run -p 3000:3000 financas-app
```

### Vercel

1. Conecte o repositório no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte:

- Abra uma [issue](../../issues)
- Entre em contato via email

---

**Desenvolvido com ❤️ usando Arquitetura Hexagonal**