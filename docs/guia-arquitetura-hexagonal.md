# Guia da Arquitetura Hexagonal - Ports & Adapters

Este guia explica como trabalhar com cada camada do projeto seguindo a arquitetura hexagonal. É um manual prático para desenvolvedores que vão contribuir no projeto.

## 📁 /core - O Coração do Sistema

### entities/ - Entidades do Domínio

**O que são:** Classes que representam os conceitos principais do negócio (Receita, Despesa, Tag, ResumoFinanceiro).

**Quando criar:** Sempre que identificar um novo conceito importante do domínio que possui identidade própria.

**Como manter regras de negócio:**
```typescript
// ✅ Bom: regra dentro da entidade
class Receita {
  constructor(private valor: ValorMonetario, private data: DataTransacao) {
    if (valor.isNegative()) {
      throw new Error('Receita não pode ter valor negativo');
    }
  }
}

// ❌ Ruim: regra fora da entidade
if (receita.valor < 0) throw new Error('...');
```

### value-objects/ - Objetos de Valor

**O que são:** Objetos imutáveis que representam conceitos sem identidade (ValorMonetario, DataTransacao).

**Por que usar:** Garantem validação e comportamentos específicos do domínio.

```typescript
// ✅ Exemplo de Value Object
class ValorMonetario {
  constructor(private readonly valor: number) {
    if (valor < 0) throw new Error('Valor inválido');
  }
  
  somar(outro: ValorMonetario): ValorMonetario {
    return new ValorMonetario(this.valor + outro.valor);
  }
}
```

### use-cases/ - Casos de Uso

**O que são:** Orquestram o fluxo de negócio usando entidades e portas.

**Como chamar:**
```typescript
// No controller
const cadastrarReceita = new CadastrarReceita(receitaRepository);
const resultado = await cadastrarReceita.execute({
  valor: 1000,
  descricao: 'Salário',
  data: '2024-01-15'
});
```

**Fluxo típico:**
1. Recebe dados de entrada
2. Valida usando entidades/value objects
3. Chama repositório via porta
4. Retorna resultado

### ports/ - Interfaces (Contratos)

**O que são:** Definem contratos para comunicação com o mundo externo.

**Como definir uma nova porta:**
```typescript
// Interface no core
export interface ReceitaRepository {
  salvar(receita: Receita): Promise<void>;
  buscarPorId(id: string): Promise<Receita | null>;
  listarTodas(): Promise<Receita[]>;
}
```

## 🔌 /adapters - Conectores

### repositories/ - Implementações de Persistência

**O que fazem:** Implementam as portas definidas no core.

```typescript
// Implementação com Prisma
export class PrismaReceitaRepository implements ReceitaRepository {
  async salvar(receita: Receita): Promise<void> {
    const data = ReceitaMapper.toPrisma(receita);
    await prisma.receita.create({ data });
  }
}
```

**Quando criar:** Para cada nova forma de persistência (Prisma, memória, API externa).

### controllers/ - Entrada de Dados

**O que fazem:** Recebem requisições da UI/API e chamam casos de uso.

```typescript
// API Route do Next.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const controller = new ReceitaController(receitaRepository);
  const resultado = await controller.cadastrar(req.body);
  res.json(resultado);
}
```

### mappers/ - Conversores

**O que fazem:** Convertem entre entidades do domínio e DTOs.

```typescript
export class ReceitaMapper {
  static toPrisma(receita: Receita) {
    return {
      valor: receita.valor.toNumber(),
      descricao: receita.descricao,
      data: receita.data.toDate()
    };
  }
  
  static toDomain(prismaReceita: PrismaReceita): Receita {
    return new Receita(
      new ValorMonetario(prismaReceita.valor),
      new DataTransacao(prismaReceita.data)
    );
  }
}
```

## 🏗️ /infrastructure - Configurações Externas

**O que contém:** Configurações de banco, Docker, conexões externas.

**Como inicializar:**
```typescript
// database/prisma.ts
export const prisma = new PrismaClient();

// Injeção de dependência
const receitaRepository = new PrismaReceitaRepository(prisma);
const cadastrarReceita = new CadastrarReceita(receitaRepository);
```

**Como trocar implementações:**
```typescript
// Para testes: usar repositório em memória
const receitaRepository = new MemoryReceitaRepository();

// Para produção: usar Prisma
const receitaRepository = new PrismaReceitaRepository(prisma);
```

## 🎨 /ui - Interface do Usuário

### Container Components
**O que fazem:** Chamam casos de uso e gerenciam estado.

```typescript
// pages/receitas/cadastrar.tsx
function CadastrarReceitaPage() {
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (dados) => {
    setLoading(true);
    await fetch('/api/receitas', {
      method: 'POST',
      body: JSON.stringify(dados)
    });
    setLoading(false);
  };
  
  return <ReceitaForm onSubmit={handleSubmit} loading={loading} />;
}
```

### Presenter Components
**O que fazem:** Apenas renderizam dados, sem lógica de negócio.

```typescript
// components/ReceitaForm.tsx
interface Props {
  onSubmit: (dados: any) => void;
  loading: boolean;
}

function ReceitaForm({ onSubmit, loading }: Props) {
  return (
    <form onSubmit={onSubmit}>
      {/* Apenas UI */}
    </form>
  );
}
```

## 🧪 /tests - Testes

### unit/ - Testes Unitários
**O que testar:** Regras do domínio isoladas.

```typescript
// Testando entidade
describe('Receita', () => {
  it('deve rejeitar valor negativo', () => {
    expect(() => {
      new Receita(new ValorMonetario(-100), new DataTransacao('2024-01-01'));
    }).toThrow('Receita não pode ter valor negativo');
  });
});
```

### integration/ - Testes de Integração
**O que testar:** Fluxo completo com adapters.

```typescript
// Testando caso de uso com repositório
describe('CadastrarReceita', () => {
  it('deve salvar receita no banco', async () => {
    const repository = new MemoryReceitaRepository();
    const useCase = new CadastrarReceita(repository);
    
    await useCase.execute({ valor: 1000, descricao: 'Teste' });
    
    const receitas = await repository.listarTodas();
    expect(receitas).toHaveLength(1);
  });
});
```

## 🚀 Fluxo de Desenvolvimento

### Adicionando Nova Funcionalidade

1. **Core:** Crie entidade/value object se necessário
2. **Core:** Defina porta (interface) se precisar de persistência
3. **Core:** Implemente caso de uso
4. **Adapters:** Crie repositório/controller/mapper
5. **UI:** Crie página/componente
6. **Tests:** Escreva testes unitários e de integração

### Exemplo Prático: Adicionar Categoria

```typescript
// 1. Entidade (core/entities/Categoria.ts)
export class Categoria {
  constructor(public readonly nome: string) {
    if (!nome.trim()) throw new Error('Nome obrigatório');
  }
}

// 2. Porta (core/ports/CategoriaRepository.ts)
export interface CategoriaRepository {
  salvar(categoria: Categoria): Promise<void>;
}

// 3. Caso de uso (core/use-cases/CadastrarCategoria.ts)
export class CadastrarCategoria {
  constructor(private repository: CategoriaRepository) {}
  
  async execute(nome: string): Promise<void> {
    const categoria = new Categoria(nome);
    await this.repository.salvar(categoria);
  }
}
```

## 📋 Regras Importantes

- **Core nunca importa de Adapters/Infrastructure/UI**
- **Adapters podem importar do Core**
- **UI só chama Controllers, nunca Casos de Uso diretamente**
- **Testes unitários não usam banco real**
- **Sempre use Mappers para converter dados**
- **Mantenha regras de negócio nas Entidades**

Este guia deve ser sua referência para manter a arquitetura limpa e organizada!