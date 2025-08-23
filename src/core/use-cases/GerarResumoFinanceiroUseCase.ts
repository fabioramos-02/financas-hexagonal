import { ResumoFinanceiro, PeriodoResumo } from '../entities/ResumoFinanceiro';
import { IReceitaRepository } from '../ports/IReceitaRepository';
import { IDespesaRepository } from '../ports/IDespesaRepository';
import {
  IGerarResumoFinanceiroUseCase,
  GerarResumoFinanceiroInput,
  GerarResumoFinanceiroOutput
} from '../ports/IGerarResumoFinanceiroUseCase';

export class GerarResumoFinanceiroUseCase implements IGerarResumoFinanceiroUseCase {
  constructor(
    private readonly receitaRepository: IReceitaRepository,
    private readonly despesaRepository: IDespesaRepository
  ) {}

  async executar(input: GerarResumoFinanceiroInput): Promise<GerarResumoFinanceiroOutput> {
    try {
      // Validar entrada
      this.validarInput(input);

      // Criar período
      const periodo: PeriodoResumo = {
        mes: input.mes,
        ano: input.ano
      };

      // Buscar receitas e despesas do período
      const [receitas, despesas] = await Promise.all([
        this.receitaRepository.listarPorPeriodo(periodo),
        this.despesaRepository.listarPorPeriodo(periodo)
      ]);

      // Gerar resumo
      const resumo = ResumoFinanceiro.gerarResumo(receitas, despesas, periodo);

      return {
        resumo,
        sucesso: true,
        mensagem: 'Resumo financeiro gerado com sucesso'
      };
    } catch (error) {
      return {
        resumo: null as any,
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro desconhecido ao gerar resumo financeiro'
      };
    }
  }

  private validarInput(input: GerarResumoFinanceiroInput): void {
    if (!input) {
      throw new Error('Dados do período são obrigatórios');
    }

    if (!input.mes || input.mes < 1 || input.mes > 12) {
      throw new Error('Mês deve estar entre 1 e 12');
    }

    if (!input.ano || input.ano < 1900 || input.ano > new Date().getFullYear() + 10) {
      throw new Error('Ano deve ser válido');
    }

    // Validar se o período não é muito futuro
    const hoje = new Date();
    const periodoSolicitado = new Date(input.ano, input.mes - 1, 1);
    const proximoAno = new Date(hoje.getFullYear() + 1, hoje.getMonth(), 1);

    if (periodoSolicitado > proximoAno) {
      throw new Error('Não é possível gerar resumo para períodos muito futuros');
    }
  }
}