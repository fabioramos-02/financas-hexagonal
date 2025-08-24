# Sistema de Finanças Pessoais

Um sistema completo para gerenciamento de finanças pessoais desenvolvido com arquitetura hexagonal (Clean Architecture), utilizando Next.js, TypeScript, Prisma e SQLite.

## 🚀 Funcionalidades

### ✅ Funcionalidades Implementadas

#### 💰 Gestão Financeira
- **Receitas**: Cadastro, listagem e gerenciamento completo
- **Despesas**: Cadastro, listagem e controle de gastos
- **Transações**: Visualização unificada de todas as movimentações
- **Resumo Financeiro**: Dashboard com totais, médias e análises

#### 🏷️ Sistema de Categorização
- **Tags Personalizadas**: Criação e gerenciamento de categorias
- **Cores Customizáveis**: Sistema visual de identificação
- **Ícones**: Seleção de ícones para categorias
- **Associação Múltipla**: Múltiplas tags por transação

#### 🎨 Interface e Experiência
- **Design Responsivo**: Layout adaptável para todos os dispositivos
- **Material-UI**: Interface moderna e consistente
- **Navegação Intuitiva**: Menu lateral com indicadores visuais
- **Feedback Visual**: Estados de loading, erro e sucesso
- **Cards Interativos**: Hover effects e animações suaves

#### 🔧 Recursos Técnicos
- **API REST Completa**: Endpoints para todas as operações
- **Validação Robusta**: Client-side e server-side
- **Arquitetura Hexagonal**: Clean Architecture implementada
- **TypeScript**: Tipagem forte em todo o projeto
- **Testes Automatizados**: Cobertura de testes unitários e integração

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
- **Banco de Dados**: SQLite (desenvolvimento)
- **Containerização**: Docker & Docker Compose (opcional)
- **Testes**: Jest
- **Linting**: ESLint

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Docker e Docker Compose (opcional, para PostgreSQL em produção)

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

### 3. Configure o banco de dados
O projeto usa SQLite por padrão para desenvolvimento (não requer configuração adicional).

Para configurar variáveis de ambiente opcionais:
```bash
cp .env.example .env
```

### 4. Execute as migrações e popule o banco
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Inicie a aplicação
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📊 Endpoints da API

### 💰 Receitas
- `GET /api/receitas` - Lista todas as receitas cadastradas
- `POST /api/receitas` - Cria uma nova receita
  - **Body**: `{ descricao, valor, data, tagIds[] }`
  - **Validações**: Campos obrigatórios, valor positivo

### 💸 Despesas  
- `GET /api/despesas` - Lista todas as despesas cadastradas
- `POST /api/despesas` - Cria uma nova despesa
  - **Body**: `{ descricao, valor, data, tagIds[] }`
  - **Validações**: Campos obrigatórios, valor positivo

### 🏷️ Tags
- `GET /api/tags` - Lista todas as tags disponíveis
- `POST /api/tags` - Cria uma nova tag
  - **Body**: `{ nome, cor, icone }`
  - **Validações**: Nome único, cor em formato hex
- `PUT /api/tags/[id]` - Atualiza uma tag existente
- `DELETE /api/tags/[id]` - Remove uma tag

### 📊 Resumo Financeiro
- `GET /api/resumo` - Obtém resumo financeiro completo
  - **Retorna**: Totais, médias, balanço e estatísticas
  - **Cálculos**: Receitas, despesas, saldo atual

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