import { Receita } from '../entities/Receita';
import { PeriodoResumo } from '../entities/ResumoFinanceiro';

export interface IReceitaRepository {
  /**
   * Salva uma nova receita ou atualiza uma existente
   */
  salvar(receita: Receita): Promise<void>;

  /**
   * Busca uma receita pelo ID
   */
  buscarPorId(id: string): Promise<Receita | null>;

  /**
   * Lista todas as receitas
   */
  listarTodas(): Promise<Receita[]>;

  /**
   * Lista receitas por período (mês/ano)
   */
  listarPorPeriodo(periodo: PeriodoResumo): Promise<Receita[]>;

  /**
   * Lista receitas por tag
   */
  listarPorTag(tagId: string): Promise<Receita[]>;

  /**
   * Lista receitas com paginação
   */
  listarComPaginacao(
    pagina: number,
    itensPorPagina: number
  ): Promise<{
    receitas: Receita[];
    total: number;
    pagina: number;
    totalPaginas: number;
  }>;

  /**
   * Busca receitas por descrição (busca parcial)
   */
  buscarPorDescricao(termo: string): Promise<Receita[]>;

  /**
   * Remove uma receita pelo ID
   */
  remover(id: string): Promise<void>;

  /**
   * Verifica se existe uma receita com o ID especificado
   */
  existe(id: string): Promise<boolean>;

  /**
   * Conta o total de receitas
   */
  contar(): Promise<number>;

  /**
   * Conta receitas por período
   */
  contarPorPeriodo(periodo: PeriodoResumo): Promise<number>;
}