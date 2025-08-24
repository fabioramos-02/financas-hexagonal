import { Receita as PrismaReceita, ReceitaTag, Tag as PrismaTag, Prisma } from '@prisma/client';
import { Receita } from '../../core/entities/Receita';
import { ValorMonetario } from '../../core/value-objects/ValorMonetario';
import { DataTransacao } from '../../core/value-objects/DataTransacao';
import { TagMapper } from './TagMapper';

type PrismaReceitaWithTags = PrismaReceita & {
  tags: (ReceitaTag & {
    tag: PrismaTag;
  })[];
};

export class ReceitaMapper {
  /**
   * Converte uma entidade Receita do domínio para o modelo do Prisma
   */
  static toPrisma(receita: Receita): Omit<PrismaReceita, 'criadaEm' | 'atualizadaEm'> {
    return {
      id: receita.id,
      descricao: receita.descricao,
      valor: receita.valor.toNumber(),
      data: receita.data.data
    };
  }

  /**
   * Converte um modelo do Prisma para entidade Receita do domínio
   */
  static toDomain(prismaReceita: PrismaReceitaWithTags): Receita {
    const valor = new ValorMonetario(Number(prismaReceita.valor));
    const data = new DataTransacao(prismaReceita.data);
    const tags = prismaReceita.tags.map(rt => TagMapper.toDomain(rt.tag));

    return new Receita(
      prismaReceita.id,
      prismaReceita.descricao,
      valor,
      data,
      tags,
      prismaReceita.criadaEm,
      prismaReceita.atualizadaEm
    );
  }

  /**
   * Converte uma lista de modelos do Prisma para entidades do domínio
   */
  static toDomainList(prismaReceitas: PrismaReceitaWithTags[]): Receita[] {
    return prismaReceitas.map(receita => ReceitaMapper.toDomain(receita));
  }

  /**
   * Converte dados para criação no Prisma
   */
  static toCreateData(receita: Receita): {
    data: Omit<PrismaReceita, 'criadaEm' | 'atualizadaEm'>;
    tagIds: string[];
  } {
    return {
      data: {
        id: receita.id,
        descricao: receita.descricao,
        valor: receita.valor.toNumber(),
        data: receita.data.data
      },
      tagIds: receita.tags.map(tag => tag.id)
    };
  }

  /**
   * Converte dados para atualização no Prisma
   */
  static toUpdateData(receita: Receita): {
    data: Partial<Pick<PrismaReceita, 'descricao' | 'valor' | 'data'>>;
    tagIds: string[];
  } {
    return {
      data: {
        descricao: receita.descricao,
        valor: receita.valor.toNumber(),
        data: receita.data.data
      },
      tagIds: receita.tags.map(tag => tag.id)
    };
  }
}