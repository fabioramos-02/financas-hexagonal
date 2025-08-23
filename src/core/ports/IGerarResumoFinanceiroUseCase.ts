import { ResumoFinanceiro, PeriodoResumo } from '../entities/ResumoFinanceiro';

export interface GerarResumoFinanceiroInput {
  mes: number;
  ano: number;
}

export interface GerarResumoFinanceiroOutput {
  resumo: ResumoFinanceiro;
  sucesso: boolean;
  mensagem: string;
}

export interface IGerarResumoFinanceiroUseCase {
  executar(input: GerarResumoFinanceiroInput): Promise<GerarResumoFinanceiroOutput>;
}