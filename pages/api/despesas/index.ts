import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../src/infrastructure/database/prisma';
import { PrismaDespesaRepository } from '../../../src/adapters/repositories/PrismaDespesaRepository';
import { PrismaTagRepository } from '../../../src/adapters/repositories/PrismaTagRepository';
import { CadastrarDespesaUseCase } from '../../../src/core/use-cases/CadastrarDespesaUseCase';

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
      const despesaRepository = new PrismaDespesaRepository(prisma);
      const tagRepository = new PrismaTagRepository(prisma);

      // Instanciar caso de uso
      const cadastrarDespesa = new CadastrarDespesaUseCase(
        despesaRepository,
        tagRepository
      );

      // Executar caso de uso
      const resultado = await cadastrarDespesa.executar({
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
        despesa: {
          id: resultado.despesa!.id,
          descricao: resultado.despesa!.descricao,
          valor: resultado.despesa!.valor.valor,
          data: resultado.despesa!.data.data,
          tags: resultado.despesa!.tags.map(tag => ({
            id: tag.id,
            nome: tag.nome,
            cor: tag.cor
          }))
        }
      });
    } catch (error) {
      // Erro ao cadastrar despesa
      return res.status(500).json({
        erro: 'Erro interno do servidor'
      });
    }
  } else if (req.method === 'GET') {
    try {
      const despesaRepository = new PrismaDespesaRepository(prisma);
      const despesas = await despesaRepository.listarTodas();

      return res.status(200).json({
        despesas: despesas.map(despesa => ({
          id: despesa.id,
          descricao: despesa.descricao,
          valor: despesa.valor.valor,
          data: despesa.data.data,
          tags: despesa.tags.map(tag => ({
            id: tag.id,
            nome: tag.nome,
            cor: tag.cor
          }))
        }))
      });
    } catch (error) {
      // Erro ao listar despesas
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