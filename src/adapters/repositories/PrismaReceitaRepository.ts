import { PrismaClient } from '@prisma/client';
import { IReceitaRepository } from '../../core/ports/IReceitaRepository';
import { Receita } from '../../core/entities/Receita';
import { PeriodoResumo } from '../../core/entities/ResumoFinanceiro';
import { ReceitaMapper } from '../mappers/ReceitaMapper';

export class PrismaReceitaRepository implements IReceitaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async salvar(receita: Receita): Promise<void> {
    const { data, tagIds } = ReceitaMapper.toCreateData(receita);

    const existeReceita = await this.prisma.receita.findUnique({
      where: { id: receita.id }
    });

    if (existeReceita) {
      // Atualizar receita existente
      const { data: updateData, tagIds: newTagIds } = ReceitaMapper.toUpdateData(receita);
      
      const receitaAtualizada = await this.prisma.receita.update({
        where: { id: receita.id },
        data: updateData,
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        }
      });

      // Atualizar relacionamentos com tags
      await this.prisma.receitaTag.deleteMany({
        where: { receitaId: receita.id }
      });

      if (newTagIds.length > 0) {
        await this.prisma.receitaTag.createMany({
          data: newTagIds.map(tagId => ({
            receitaId: receita.id,
            tagId
          }))
        });
      }

      // Buscar receita com tags atualizadas
      const receitaFinal = await this.prisma.receita.findUnique({
        where: { id: receita.id },
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        }
      });

    } else {
      // Criar nova receita
      await this.prisma.receita.create({
        data,
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        }
      });

      // Criar relacionamentos com tags
      if (tagIds.length > 0) {
        await this.prisma.receitaTag.createMany({
          data: tagIds.map(tagId => ({
            receitaId: receita.id,
            tagId
          }))
        });
      }
    }
  }

  async buscarPorId(id: string): Promise<Receita | null> {
    const receita = await this.prisma.receita.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return receita ? ReceitaMapper.toDomain(receita) : null;
  }

  async listarTodas(): Promise<Receita[]> {
    const receitas = await this.prisma.receita.findMany({
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: { data: 'desc' }
    });

    return ReceitaMapper.toDomainList(receitas);
  }

  async listarPorPeriodo(periodo: PeriodoResumo): Promise<Receita[]> {
    const dataInicio = new Date(periodo.ano, periodo.mes - 1, 1);
    const dataFim = new Date(periodo.ano, periodo.mes, 0);
    
    const receitas = await this.prisma.receita.findMany({
      where: {
        data: {
          gte: dataInicio,
          lte: dataFim
        }
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: { data: 'desc' }
    });

    return ReceitaMapper.toDomainList(receitas);
  }

  async listarPorTag(tagId: string): Promise<Receita[]> {
    const receitas = await this.prisma.receita.findMany({
      where: {
        tags: {
          some: {
            tagId
          }
        }
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: { data: 'desc' }
    });

    return ReceitaMapper.toDomainList(receitas);
  }

  async listarComPaginacao(
    pagina: number,
    itensPorPagina: number
  ): Promise<{
    receitas: Receita[];
    total: number;
    pagina: number;
    totalPaginas: number;
  }> {
    const [receitas, total] = await Promise.all([
      this.prisma.receita.findMany({
        skip: (pagina - 1) * itensPorPagina,
        take: itensPorPagina,
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        },
        orderBy: { data: 'desc' }
      }),
      this.prisma.receita.count()
    ]);

    const totalPaginas = Math.ceil(total / itensPorPagina);

    return {
      receitas: ReceitaMapper.toDomainList(receitas),
      total,
      pagina,
      totalPaginas
    };
  }

  async buscarPorDescricao(descricao: string): Promise<Receita[]> {
    const receitas = await this.prisma.receita.findMany({
      where: {
        descricao: {
          contains: descricao,
          mode: 'insensitive'
        }
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: { data: 'desc' }
    });

    return ReceitaMapper.toDomainList(receitas);
  }

  async remover(id: string): Promise<void> {
    await this.prisma.receita.delete({
      where: { id }
    });
  }

  async existe(id: string): Promise<boolean> {
    const count = await this.prisma.receita.count({
      where: { id }
    });
    return count > 0;
  }

  async contar(): Promise<number> {
    return await this.prisma.receita.count();
  }

  async contarPorPeriodo(periodo: PeriodoResumo): Promise<number> {
    const inicioMes = new Date(periodo.ano, periodo.mes - 1, 1);
    const fimMes = new Date(periodo.ano, periodo.mes, 0, 23, 59, 59, 999);

    return await this.prisma.receita.count({
      where: {
        data: {
          gte: inicioMes,
          lte: fimMes
        }
      }
    });
  }
}