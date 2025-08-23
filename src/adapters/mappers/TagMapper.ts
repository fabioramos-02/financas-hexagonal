import { Tag as PrismaTag } from '@prisma/client';
import { Tag } from '../../core/entities/Tag';

export class TagMapper {
  /**
   * Converte uma entidade Tag do domínio para o modelo do Prisma
   */
  static toPrisma(tag: Tag): Omit<PrismaTag, 'id' | 'criadaEm'> & { id?: string } {
    return {
      id: tag.id,
      nome: tag.nome,
      cor: tag.cor,
      criadaEm: tag.criadaEm
    };
  }

  /**
   * Converte um modelo do Prisma para entidade Tag do domínio
   */
  static toDomain(prismaTag: PrismaTag): Tag {
    return new Tag(
      prismaTag.id,
      prismaTag.nome,
      prismaTag.cor,
      prismaTag.criadaEm
    );
  }

  /**
   * Converte uma lista de modelos do Prisma para entidades do domínio
   */
  static toDomainList(prismaTags: PrismaTag[]): Tag[] {
    return prismaTags.map(tag => TagMapper.toDomain(tag));
  }

  /**
   * Converte dados para criação no Prisma
   */
  static toCreateData(tag: Tag): Omit<PrismaTag, 'criadaEm'> {
    return {
      id: tag.id,
      nome: tag.nome,
      cor: tag.cor
    };
  }

  /**
   * Converte dados para atualização no Prisma
   */
  static toUpdateData(tag: Tag): Partial<Pick<PrismaTag, 'nome' | 'cor'>> {
    return {
      nome: tag.nome,
      cor: tag.cor
    };
  }
}