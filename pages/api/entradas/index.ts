import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../src/infrastructure/database/prisma';
import { PrismaReceitaRepository } from '../../../src/adapters/repositories/PrismaReceitaRepository';
import { PrismaTagRepository } from '../../../src/adapters/repositories/PrismaTagRepository';
import { CadastrarReceitaUseCase } from '../../../src/core/use-cases/CadastrarReceitaUseCase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { descricao, valor, data, tagIds } = req.body;

      // Validação básica
      if (!descricao || !valor || !data) {
        return res.status(400).json({
          erro: 'Campos obrigatórios: descricao, valor, data'
        });
      }

      // Instanciar repositórios
      const receitaRepository = new PrismaReceitaRepository(prisma);
      const tagRepository = new PrismaTagRepository(prisma);

      // Instanciar caso de uso
      const cadastrarReceita = new CadastrarReceitaUseCase(
        receitaRepository,
        tagRepository
      );

      // Executar caso de uso
      const resultado = await cadastrarReceita.executar({
        descricao,
        valor: Number(valor),
        data: new Date(data),
        tagIds: tagIds || []
      });

      if (!resultado.sucesso) {
        return res.status(400).json({
          erro: resultado.mensagem
        });
      }

      return res.status(201).json({
        sucesso: true,
        entrada: {
          id: resultado.receita!.id,
          descricao: resultado.receita!.descricao,
          valor: resultado.receita!.valor.valor,
          data: resultado.receita!.data.data,
          tags: resultado.receita!.tags.map(tag => ({
            id: tag.id,
            nome: tag.nome,
            cor: tag.cor,
            icone: tag.icone
          }))
        }
      });
    } catch (error) {
      console.error('Erro ao cadastrar entrada:', error);
      return res.status(500).json({
        erro: 'Erro interno do servidor'
      });
    }
  } else if (req.method === 'GET') {
    try {
      const receitaRepository = new PrismaReceitaRepository(prisma);
      const receitas = await receitaRepository.listarTodas();

      return res.status(200).json(
        receitas.map(receita => ({
          id: receita.id,
          descricao: receita.descricao,
          valor: receita.valor.valor,
          data: receita.data.data,
          tags: receita.tags.map(tag => ({
            id: tag.id,
            nome: tag.nome,
            cor: tag.cor,
            icone: tag.icone
          }))
        }))
      );
    } catch (error) {
      console.error('Erro ao listar entradas:', error);
      return res.status(500).json({
        erro: 'Erro interno do servidor'
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({
      erro: `Método ${req.method} não permitido`
    });
  }
}