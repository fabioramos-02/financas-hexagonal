# Arquitetura do Sistema

## 📐 Visão Geral

O sistema de gestão financeira foi desenvolvido seguindo os princípios da **Arquitetura Hexagonal** (também conhecida como Ports and Adapters), criada por Alistair Cockburn. Esta arquitetura promove a separação clara entre a lógica de negócio e os detalhes de implementação externa.

## 🎯 Princípios Fundamentais

### 1. Inversão de Dependência
- O núcleo da aplicação não depende de frameworks externos
- Dependências apontam sempre para dentro (em direção ao domínio)
- Interfaces definem contratos que são implementados nas camadas externas

### 2. Separação de Responsabilidades
- **Domínio**: Regras de negócio puras
- **Aplicação**: Orquestração dos casos de uso
- **Infraestrutura**: Detalhes técnicos e frameworks
- **Interface**: Apresentação e interação com usuário

### 3. Testabilidade
- Lógica de negócio isolada e facilmente testável
- Mocks e stubs para dependências externas
- Testes unitários, integração e end-to-end

## 🏗️ Estrutura das Camadas

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Pages     │  │ Components  │  │   Styles    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ API Routes  │  │  Use Cases  │  │   Ports     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Domain Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Entities   │  │Value Objects│  │  Services   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Repositories│  │   Database  │  │   Mappers   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Detalhamento das Camadas

### 🎯 Core (Domínio + Aplicação)

#### Domain (`src/core/domain/`)
**Responsabilidade**: Contém as regras de negócio puras, independentes de qualquer framework.

- **Entities**: Objetos com identidade e ciclo de vida
  - `Receita`: Representa uma entrada financeira
  - `Despesa`: Representa uma saída financeira
  - `Tag`: Categoria para classificação
  - `ResumoFinanceiro`: Agregação de dados financeiros

- **Value Objects**: Objetos imutáveis sem identidade
  - `ValorMonetario`: Encapsula valores monetários com validações
  - `DataTransacao`: Representa datas de transações

- **Services**: Lógica de domínio que não pertence a uma entidade específica
  - `CalculadoraFinanceira`: Cálculos financeiros complexos

#### Ports (`src/core/ports/`)
**Responsabilidade**: Define contratos (interfaces) entre as camadas.

- **Repositories**: Contratos para persistência
  - `IReceitaRepository`: Interface para operações com receitas
  - `IDespesaRepository`: Interface para operações com despesas
  - `ITagRepository`: Interface para operações com tags

- **Use Cases**: Contratos para casos de uso
  - `ICadastrarReceita`: Interface para cadastro de receitas
  - `ICadastrarDespesa`: Interface para cadastro de despesas
  - `IGerarResumoFinanceiro`: Interface para geração de resumos

#### Use Cases (`src/core/use-cases/`)
**Responsabilidade**: Implementa os casos de uso da aplicação.

- `CadastrarReceitaUseCase`: Orquestra o cadastro de receitas
- `CadastrarDespesaUseCase`: Orquestra o cadastro de despesas
- `GerarResumoFinanceiroUseCase`: Gera relatórios financeiros
- `ListarTransacoesUseCase`: Lista transações com filtros

### 🔌 Adapters (Adaptadores)

#### Repositories (`src/adapters/repositories/`)
**Responsabilidade**: Implementa as interfaces de repositório usando tecnologias específicas.

- `PrismaReceitaRepository`: Implementação com Prisma ORM
- `PrismaDespesaRepository`: Implementação com Prisma ORM
- `PrismaTagRepository`: Implementação com Prisma ORM

#### Mappers (`src/adapters/mappers/`)
**Responsabilidade**: Converte dados entre diferentes representações.

- `ReceitaMapper`: Converte entre entidade e modelo Prisma
- `DespesaMapper`: Converte entre entidade e modelo Prisma
- `TagMapper`: Converte entre entidade e modelo Prisma

### 🏗️ Infrastructure (Infraestrutura)

#### Database (`src/infrastructure/database/`)
**Responsabilidade**: Configurações e conexões com banco de dados.

- `prisma.ts`: Cliente Prisma configurado
- `schema.prisma`: Schema do banco de dados
- `migrations/`: Migrações do banco

### 🖥️ UI (Interface do Usuário)

#### Pages (`src/ui/pages/`)
**Responsabilidade**: Páginas da aplicação Next.js.

- `index.tsx`: Dashboard principal
- `receitas/`: Páginas relacionadas a receitas
- `despesas/`: Páginas relacionadas a despesas
- `transacoes/`: Páginas de listagem
- `tags/`: Gerenciamento de tags
- `api/`: API Routes do Next.js

#### Components (`src/ui/components/`)
**Responsabilidade**: Componentes React reutilizáveis.

- Componentes de formulário
- Componentes de listagem
- Componentes de layout

## 🔄 Fluxo de Dados

### 1. Requisição HTTP
```
Usuário → UI Component → API Route → Use Case → Repository → Database
```

### 2. Resposta
```
Database → Repository → Use Case → API Route → UI Component → Usuário
```

### Exemplo: Cadastro de Receita

1. **UI**: Usuário preenche formulário de receita
2. **API Route**: `/api/receitas` recebe dados POST
3. **Use Case**: `CadastrarReceitaUseCase` valida e processa
4. **Repository**: `PrismaReceitaRepository` persiste no banco
5. **Response**: Retorna sucesso/erro para UI

## 🧪 Estratégia de Testes

### Pirâmide de Testes

```
        ┌─────────────┐
        │     E2E     │  ← Poucos, caros, lentos
        └─────────────┘
      ┌─────────────────┐
      │   Integration   │  ← Alguns, médio custo
      └─────────────────┘
    ┌───────────────────────┐
    │       Unit Tests      │  ← Muitos, baratos, rápidos
    └───────────────────────┘
```

### Tipos de Teste

#### Testes Unitários
- **Entidades**: Validações e comportamentos
- **Value Objects**: Imutabilidade e validações
- **Use Cases**: Lógica de negócio isolada
- **Services**: Cálculos e regras complexas

#### Testes de Integração
- **Repositories**: Integração com banco de dados
- **API Routes**: Endpoints da aplicação
- **Mappers**: Conversões de dados

#### Testes End-to-End
- **Fluxos completos**: Cadastro → Listagem → Relatórios
- **Cenários de usuário**: Jornadas críticas

## 🔒 Princípios de Segurança

### Validação de Dados
- **Input Validation**: Validação na camada de apresentação
- **Business Rules**: Validação na camada de domínio
- **Data Integrity**: Validação na camada de persistência

### Tratamento de Erros
- **Domain Exceptions**: Erros de regra de negócio
- **Infrastructure Exceptions**: Erros técnicos
- **User-Friendly Messages**: Mensagens apropriadas para UI

## 📈 Benefícios da Arquitetura

### ✅ Vantagens

1. **Testabilidade**: Lógica de negócio isolada
2. **Manutenibilidade**: Código organizado e desacoplado
3. **Flexibilidade**: Fácil troca de tecnologias
4. **Escalabilidade**: Estrutura preparada para crescimento
5. **Reutilização**: Componentes bem definidos

### ⚠️ Considerações

1. **Complexidade Inicial**: Mais arquivos e abstrações
2. **Curva de Aprendizado**: Requer conhecimento dos padrões
3. **Over-engineering**: Pode ser excessivo para projetos simples

## 🚀 Evolução da Arquitetura

### Próximos Passos

1. **CQRS**: Separação de comandos e consultas
2. **Event Sourcing**: Histórico de eventos
3. **Microservices**: Decomposição em serviços
4. **Domain Events**: Comunicação entre contextos

### Padrões Adicionais

- **Repository Pattern**: ✅ Implementado
- **Unit of Work**: 🔄 Planejado
- **Specification Pattern**: 🔄 Planejado
- **Observer Pattern**: 🔄 Planejado

---

**Esta arquitetura garante que o sistema seja robusto, testável e preparado para evolução contínua.**