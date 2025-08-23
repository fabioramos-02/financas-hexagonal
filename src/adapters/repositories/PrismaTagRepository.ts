import { PrismaClient } from '@prisma/client';
import { ITagRepository } from '../../core/ports/ITagRepository';
import { Tag } from '../../core/entities/Tag';
import { TagMapper } from '../mappers/TagMapper';

export class PrismaTagRepository implements ITagRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async salvar(tag: Tag): Promise<Tag> {
    const existeTag = await this.prisma.tag.findUnique({
      where: { id: tag.id }
    });

    if (existeTag) {
      const tagAtualizada = await this.prisma.tag.update({
        where: { id: tag.id },
        data: TagMapper.toUpdateData(tag)
      });
      return TagMapper.toDomain(tagAtualizada);
    } else {
      const tagCriada = await this.prisma.tag.create({
        data: TagMapper.toCreateData(tag)
      });
      return TagMapper.toDomain(tagCriada);
    }
  }

  async buscarPorId(id: string): Promise<Tag | null> {
    const tag = await this.prisma.tag.findUnique({
      where: { id }
    });

    return tag ? TagMapper.toDomain(tag) : null;
  }

  async buscarPorNome(nome: string): Promise<Tag | null> {
    const tag = await this.prisma.tag.findUnique({
      where: { nome }
    });

    return tag ? TagMapper.toDomain(tag) : null;
  }

  async listarTodas(): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany({
      orderBy: { nome: 'asc' }
    });

    return TagMapper.toDomainList(tags);
  }

  async listarComPaginacao(pagina: number, tamanhoPagina: number): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany({
      skip: (pagina - 1) * tamanhoPagina,
      take: tamanhoPagina,
      orderBy: { nome: 'asc' }
    });

    return TagMapper.toDomainList(tags);
  }

  async buscarPorNomeParcial(nomeParcial: string): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany({
      where: {
        nome: {
          contains: nomeParcial,
          mode: 'insensitive'
        }
      },
      orderBy: { nome: 'asc' }
    });

    return TagMapper.toDomainList(tags);
  }

  async listarMaisUsadas(limite: number): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany({
      include: {
        _count: {
          select: {
            receitas: true,
            despesas: true
          }
        }
      },
      orderBy: [
        {
          receitas: {
            _count: 'desc'
          }
        },
        {
          despesas: {
            _count: 'desc'
          }
        }
      ],
      take: limite
    });

    return tags.map(tag => TagMapper.toDomain({
      id: tag.id,
      nome: tag.nome,
      cor: tag.cor,
      criadaEm: tag.criadaEm
    }));
  }

  async remover(id: string): Promise<void> {
    await this.prisma.tag.delete({
      where: { id }
    });
  }

  async existe(id: string): Promise<boolean> {
    const count = await this.prisma.tag.count({
      where: { id }
    });
    return count > 0;
  }

  async existePorNome(nome: string): Promise<boolean> {
    const count = await this.prisma.tag.count({
      where: { nome }
    });
    return count > 0;
  }

  async contar(): Promise<number> {
    return await this.prisma.tag.count();
  }

  async contarUsos(id: string): Promise<number> {
    const [receitasCount, despesasCount] = await Promise.all([
      this.prisma.receitaTag.count({ where: { tagId: id } }),
      this.prisma.despesaTag.count({ where: { tagId: id } })
    ]);

    return receitasCount + despesasCount;
  }
}