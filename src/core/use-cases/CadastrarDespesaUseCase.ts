import { Despesa } from '../entities/Despesa';
import { Tag } from '../entities/Tag';
import { ValorMonetario } from '../value-objects/ValorMonetario';
import { DataTransacao } from '../value-objects/DataTransacao';
import { IDespesaRepository } from '../ports/IDespesaRepository';
import { ITagRepository } from '../ports/ITagRepository';
import {
  ICadastrarDespesaUseCase,
  CadastrarDespesaInput,
  CadastrarDespesaOutput
} from '../ports/ICadastrarDespesaUseCase';

export class CadastrarDespesaUseCase implements ICadastrarDespesaUseCase {
  constructor(
    private readonly despesaRepository: IDespesaRepository,
    private readonly tagRepository: ITagRepository
  ) {}

  async executar(input: CadastrarDespesaInput): Promise<CadastrarDespesaOutput> {
    try {
      // Validar entrada
      this.validarInput(input);

      // Criar value objects
      const valor = new ValorMonetario(input.valor);
      const data = this.criarDataTransacao(input.data);

      // Buscar tags se fornecidas
      const tags = await this.buscarTags(input.tagIds || []);

      // Criar despesa
      const despesa = Despesa.criar(input.descricao, valor, data, tags);

      // Salvar despesa
      await this.despesaRepository.salvar(despesa);

      return {
        despesa,
        sucesso: true,
        mensagem: 'Despesa cadastrada com sucesso'
      };
    } catch (error) {
      return {
        despesa: null as any,
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro desconhecido ao cadastrar despesa'
      };
    }
  }

  private validarInput(input: CadastrarDespesaInput): void {
    if (!input) {
      throw new Error('Dados da despesa são obrigatórios');
    }

    if (!input.descricao || input.descricao.trim().length === 0) {
      throw new Error('Descrição da despesa é obrigatória');
    }

    if (input.valor === undefined || input.valor === null) {
      throw new Error('Valor da despesa é obrigatório');
    }

    if (input.valor <= 0) {
      throw new Error('Valor da despesa deve ser maior que zero');
    }

    if (!input.data) {
      throw new Error('Data da despesa é obrigatória');
    }
  }

  private criarDataTransacao(data: string | Date): DataTransacao {
    if (typeof data === 'string') {
      return DataTransacao.fromString(data);
    }
    return new DataTransacao(data);
  }

  private async buscarTags(tagIds: string[]): Promise<Tag[]> {
    if (tagIds.length === 0) {
      return [];
    }

    const tags: Tag[] = [];
    
    for (const tagId of tagIds) {
      const tag = await this.tagRepository.buscarPorId(tagId);
      if (!tag) {
        throw new Error(`Tag com ID ${tagId} não encontrada`);
      }
      tags.push(tag);
    }

    return tags;
  }
}