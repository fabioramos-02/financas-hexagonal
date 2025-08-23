import { Despesa as PrismaDespesa, DespesaTag, Tag as PrismaTag } from '@prisma/client';
import { Despesa } from '../../core/entities/Despesa';
import { ValorMonetario } from '../../core/value-objects/ValorMonetario';
import { DataTransacao } from '../../core/value-objects/DataTransacao';
import { TagMapper } from './TagMapper';

type PrismaDespesaWithTags = PrismaDespesa & {
  tags: (DespesaTag & {
    tag: PrismaTag;
  })[];
};

export class DespesaMapper {
  /**
   * Converte uma entidade Despesa do domínio para o modelo do Prisma
   */
  static toPrisma(despesa: Despesa): Omit<PrismaDespesa, 'criadaEm' | 'atualizadaEm'> {
    return {
      id: despesa.id,
      descricao: despesa.descricao,
      valor: despesa.valor.toNumber(),
      data: despesa.data.data
    };
  }

  /**
   * Converte um modelo do Prisma para entidade Despesa do domínio
   */
  static toDomain(prismaDespesa: PrismaDespesaWithTags): Despesa {
    const valor = new ValorMonetario(Number(prismaDespesa.valor));
    const data = new DataTransacao(prismaDespesa.data);
    const tags = prismaDespesa.tags.map(dt => TagMapper.toDomain(dt.tag));

    return new Despesa(
      prismaDespesa.id,
      prismaDespesa.descricao,
      valor,
      data,
      tags,
      prismaDespesa.criadaEm,
      prismaDespesa.atualizadaEm
    );
  }

  /**
   * Converte uma lista de modelos do Prisma para entidades do domínio
   */
  static toDomainList(prismaDespesas: PrismaDespesaWithTags[]): Despesa[] {
    return prismaDespesas.map(despesa => DespesaMapper.toDomain(despesa));
  }

  /**
   * Converte dados para criação no Prisma
   */
  static toCreateData(despesa: Despesa): {
    data: Omit<PrismaDespesa, 'criadaEm' | 'atualizadaEm'>;
    tagIds: string[];
  } {
    return {
      data: {
        id: despesa.id,
        descricao: despesa.descricao,
        valor: despesa.valor.toNumber(),
        data: despesa.data.data
      },
      tagIds: despesa.tags.map(tag => tag.id)
    };
  }

  /**
   * Converte dados para atualização no Prisma
   */
  static toUpdateData(despesa: Despesa): {
    data: Partial<Pick<PrismaDespesa, 'descricao' | 'valor' | 'data'>>;
    tagIds: string[];
  } {
    return {
      data: {
        descricao: despesa.descricao,
        valor: despesa.valor.toNumber(),
        data: despesa.data.data
      },
      tagIds: despesa.tags.map(tag => tag.id)
    };
  }
}