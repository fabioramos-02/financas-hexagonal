import { Receita } from '../entities/Receita';
import { Tag } from '../entities/Tag';
import { ValorMonetario } from '../value-objects/ValorMonetario';
import { DataTransacao } from '../value-objects/DataTransacao';
import { IReceitaRepository } from '../ports/IReceitaRepository';
import { ITagRepository } from '../ports/ITagRepository';
import {
  ICadastrarReceitaUseCase,
  CadastrarReceitaInput,
  CadastrarReceitaOutput
} from '../ports/ICadastrarReceitaUseCase';

export class CadastrarReceitaUseCase implements ICadastrarReceitaUseCase {
  constructor(
    private readonly receitaRepository: IReceitaRepository,
    private readonly tagRepository: ITagRepository
  ) {}

  async executar(input: CadastrarReceitaInput): Promise<CadastrarReceitaOutput> {
    try {
      // Validar entrada
      this.validarInput(input);

      // Criar value objects
      const valor = new ValorMonetario(input.valor);
      const data = this.criarDataTransacao(input.data);

      // Buscar tags se fornecidas
      const tags = await this.buscarTags(input.tagIds || []);

      // Criar receita
      const receita = Receita.criar(input.descricao, valor, data, tags);

      // Salvar receita
      await this.receitaRepository.salvar(receita);

      return {
        receita,
        sucesso: true,
        mensagem: 'Receita cadastrada com sucesso'
      };
    } catch (error) {
      return {
        receita: null as any,
        sucesso: false,
        mensagem: error instanceof Error ? error.message : 'Erro desconhecido ao cadastrar receita'
      };
    }
  }

  private validarInput(input: CadastrarReceitaInput): void {
    if (!input) {
      throw new Error('Dados da receita são obrigatórios');
    }

    if (!input.descricao || input.descricao.trim().length === 0) {
      throw new Error('Descrição da receita é obrigatória');
    }

    if (input.valor === undefined || input.valor === null) {
      throw new Error('Valor da receita é obrigatório');
    }

    if (input.valor <= 0) {
      throw new Error('Valor da receita deve ser maior que zero');
    }

    if (!input.data) {
      throw new Error('Data da receita é obrigatória');
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