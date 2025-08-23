import { Tag } from '../entities/Tag';

export interface ITagRepository {
  /**
   * Salva uma nova tag ou atualiza uma existente
   */
  salvar(tag: Tag): Promise<void>;

  /**
   * Busca uma tag pelo ID
   */
  buscarPorId(id: string): Promise<Tag | null>;

  /**
   * Busca uma tag pelo nome
   */
  buscarPorNome(nome: string): Promise<Tag | null>;

  /**
   * Lista todas as tags
   */
  listarTodas(): Promise<Tag[]>;

  /**
   * Lista tags com paginação
   */
  listarComPaginacao(
    pagina: number,
    itensPorPagina: number
  ): Promise<{
    tags: Tag[];
    total: number;
    pagina: number;
    totalPaginas: number;
  }>;

  /**
   * Busca tags por nome (busca parcial)
   */
  buscarPorNomeParcial(termo: string): Promise<Tag[]>;

  /**
   * Lista tags mais utilizadas
   */
  listarMaisUtilizadas(limite?: number): Promise<Tag[]>;

  /**
   * Remove uma tag pelo ID
   */
  remover(id: string): Promise<void>;

  /**
   * Verifica se existe uma tag com o ID especificado
   */
  existe(id: string): Promise<boolean>;

  /**
   * Verifica se existe uma tag com o nome especificado
   */
  existePorNome(nome: string): Promise<boolean>;

  /**
   * Conta o total de tags
   */
  contar(): Promise<number>;

  /**
   * Conta quantas vezes uma tag foi utilizada
   */
  contarUsos(tagId: string): Promise<number>;
}