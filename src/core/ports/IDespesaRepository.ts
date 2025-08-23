import { Despesa } from '../entities/Despesa';
import { PeriodoResumo } from '../entities/ResumoFinanceiro';

export interface IDespesaRepository {
  /**
   * Salva uma nova despesa ou atualiza uma existente
   */
  salvar(despesa: Despesa): Promise<void>;

  /**
   * Busca uma despesa pelo ID
   */
  buscarPorId(id: string): Promise<Despesa | null>;

  /**
   * Lista todas as despesas
   */
  listarTodas(): Promise<Despesa[]>;

  /**
   * Lista despesas por período (mês/ano)
   */
  listarPorPeriodo(periodo: PeriodoResumo): Promise<Despesa[]>;

  /**
   * Lista despesas por tag
   */
  listarPorTag(tagId: string): Promise<Despesa[]>;

  /**
   * Lista despesas com paginação
   */
  listarComPaginacao(
    pagina: number,
    itensPorPagina: number
  ): Promise<{
    despesas: Despesa[];
    total: number;
    pagina: number;
    totalPaginas: number;
  }>;

  /**
   * Busca despesas por descrição (busca parcial)
   */
  buscarPorDescricao(termo: string): Promise<Despesa[]>;

  /**
   * Remove uma despesa pelo ID
   */
  remover(id: string): Promise<void>;

  /**
   * Verifica se existe uma despesa com o ID especificado
   */
  existe(id: string): Promise<boolean>;

  /**
   * Conta o total de despesas
   */
  contar(): Promise<number>;

  /**
   * Conta despesas por período
   */
  contarPorPeriodo(periodo: PeriodoResumo): Promise<number>;
}