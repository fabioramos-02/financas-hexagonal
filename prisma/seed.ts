import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar tags padrão
  const tags = [
    { nome: 'Alimentação', cor: '#ff5722' },
    { nome: 'Transporte', cor: '#2196f3' },
    { nome: 'Moradia', cor: '#4caf50' },
    { nome: 'Saúde', cor: '#f44336' },
    { nome: 'Educação', cor: '#9c27b0' },
    { nome: 'Lazer', cor: '#ff9800' },
    { nome: 'Trabalho', cor: '#607d8b' },
    { nome: 'Investimentos', cor: '#795548' },
    { nome: 'Compras', cor: '#e91e63' },
    { nome: 'Contas', cor: '#673ab7' },
  ];

  console.log('📝 Criando tags padrão...');
  const createdTags = [];
  
  for (const tag of tags) {
    const existingTag = await prisma.tag.findUnique({
      where: { nome: tag.nome }
    });
    
    if (!existingTag) {
      const createdTag = await prisma.tag.create({
        data: tag
      });
      createdTags.push(createdTag);
      console.log(`✅ Tag criada: ${tag.nome}`);
    } else {
      console.log(`⚠️  Tag já existe: ${tag.nome}`);
      createdTags.push(existingTag);
    }
  }

  // Criar algumas receitas de exemplo
  console.log('💰 Criando receitas de exemplo...');
  
  const trabalhoTag = createdTags.find(tag => tag.nome === 'Trabalho');
  const investimentosTag = createdTags.find(tag => tag.nome === 'Investimentos');
  
  if (trabalhoTag) {
    const existingReceita = await prisma.receita.findFirst({
      where: { descricao: 'Salário' }
    });
    
    if (!existingReceita) {
      const receita = await prisma.receita.create({
        data: {
          descricao: 'Salário',
          valor: 5000.00,
          data: new Date('2024-01-01'),
          tags: {
            create: [
              { tagId: trabalhoTag.id }
            ]
          }
        }
      });
      console.log('✅ Receita criada: Salário');
    }
  }
  
  if (investimentosTag) {
    const existingReceita = await prisma.receita.findFirst({
      where: { descricao: 'Dividendos' }
    });
    
    if (!existingReceita) {
      const receita = await prisma.receita.create({
        data: {
          descricao: 'Dividendos',
          valor: 150.00,
          data: new Date('2024-01-15'),
          tags: {
            create: [
              { tagId: investimentosTag.id }
            ]
          }
        }
      });
      console.log('✅ Receita criada: Dividendos');
    }
  }

  // Criar algumas despesas de exemplo
  console.log('💸 Criando despesas de exemplo...');
  
  const alimentacaoTag = createdTags.find(tag => tag.nome === 'Alimentação');
  const transporteTag = createdTags.find(tag => tag.nome === 'Transporte');
  const moradiaTag = createdTags.find(tag => tag.nome === 'Moradia');
  
  if (alimentacaoTag) {
    const existingDespesa = await prisma.despesa.findFirst({
      where: { descricao: 'Supermercado' }
    });
    
    if (!existingDespesa) {
      const despesa = await prisma.despesa.create({
        data: {
          descricao: 'Supermercado',
          valor: 350.00,
          data: new Date('2024-01-05'),
          tags: {
            create: [
              { tagId: alimentacaoTag.id }
            ]
          }
        }
      });
      console.log('✅ Despesa criada: Supermercado');
    }
  }
  
  if (transporteTag) {
    const existingDespesa = await prisma.despesa.findFirst({
      where: { descricao: 'Combustível' }
    });
    
    if (!existingDespesa) {
      const despesa = await prisma.despesa.create({
        data: {
          descricao: 'Combustível',
          valor: 200.00,
          data: new Date('2024-01-10'),
          tags: {
            create: [
              { tagId: transporteTag.id }
            ]
          }
        }
      });
      console.log('✅ Despesa criada: Combustível');
    }
  }
  
  if (moradiaTag) {
    const existingDespesa = await prisma.despesa.findFirst({
      where: { descricao: 'Aluguel' }
    });
    
    if (!existingDespesa) {
      const despesa = await prisma.despesa.create({
        data: {
          descricao: 'Aluguel',
          valor: 1200.00,
          data: new Date('2024-01-01'),
          tags: {
            create: [
              { tagId: moradiaTag.id }
            ]
          }
        }
      });
      console.log('✅ Despesa criada: Aluguel');
    }
  }

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });