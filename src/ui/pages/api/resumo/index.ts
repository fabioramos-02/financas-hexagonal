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
      const { mes, ano } = req.query;

      // Se não fornecidos, usar mês/ano atual
      const hoje = new Date();
      const mesAtual = mes ? parseInt(mes as string) : hoje.getMonth() + 1;
      const anoAtual = ano ? parseInt(ano as string) : hoje.getFullYear();

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
        mes: mesAtual,
        ano: anoAtual
      });

      if (!resultado.sucesso) {
        return res.status(400).json({
          erro: resultado.mensagem
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
          mediaReceitas: resumo.mediaReceitas.valor,
          mediaDespesas: resumo.mediaDespesas.valor,
          geradoEm: resumo.geradoEm,
          periodo: {
            mes: resumo.periodo.mes,
            ano: resumo.periodo.ano
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