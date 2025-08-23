import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../infrastructure/database/prisma';
import { PrismaReceitaRepository } from '../../../../adapters/repositories/PrismaReceitaRepository';
import { PrismaDespesaRepository } from '../../../../adapters/repositories/PrismaDespesaRepository';
import { GerarResumoFinanceiroUseCase } from '../../../../core/use-cases/GerarResumoFinanceiroUseCase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { dataInicio, dataFim } = req.query;

      // Validação básica
      if (!dataInicio || !dataFim) {
        return res.status(400).json({
          erro: 'Parâmetros obrigatórios: dataInicio, dataFim'
        });
      }

      // Instanciar repositórios
      const receitaRepository = new PrismaReceitaRepository(prisma);
      const despesaRepository = new PrismaDespesaRepository(prisma);

      // Instanciar caso de uso
      const gerarResumo = new GerarResumoFinanceiroUseCase(
        receitaRepository,
        despesaRepository
      );

      // Executar caso de uso
      const resultado = await gerarResumo.executar({
        dataInicio: new Date(dataInicio as string),
        dataFim: new Date(dataFim as string)
      });

      if (!resultado.sucesso) {
        return res.status(400).json({
          erro: resultado.erro
        });
      }

      const resumo = resultado.resumo!;

      return res.status(200).json({
        sucesso: true,
        resumo: {
          totalReceitas: resumo.totalReceitas.valor,
          totalDespesas: resumo.totalDespesas.valor,
          saldo: resumo.saldo.valor,
          quantidadeReceitas: resumo.quantidadeReceitas,
          quantidadeDespesas: resumo.quantidadeDespesas,
          mediaReceitas: resumo.obterMediaReceitas().valor,
          mediaDespesas: resumo.obterMediaDespesas().valor,
          geradoEm: resumo.geradoEm,
          periodo: {
            inicio: resumo.dataInicio,
            fim: resumo.dataFim
          }
        }
      });
    } catch (error) {
      console.error('Erro ao gerar resumo financeiro:', error);
      return res.status(500).json({
        erro: 'Erro interno do servidor'
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      erro: `Método ${req.method} não permitido`
    });
  }
}