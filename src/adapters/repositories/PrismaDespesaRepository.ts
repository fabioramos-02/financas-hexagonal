import { PrismaClient } from '@prisma/client';
import { IDespesaRepository } from '../../core/ports/IDespesaRepository';
import { Despesa } from '../../core/entities/Despesa';
import { PeriodoResumo } from '../../core/entities/ResumoFinanceiro';
import { DespesaMapper } from '../mappers/DespesaMapper';

export class PrismaDespesaRepository implements IDespesaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async salvar(despesa: Despesa): Promise<void> {
    const { data, tagIds } = DespesaMapper.toCreateData(despesa);

    const existeDespesa = await this.prisma.despesa.findUnique({
      where: { id: despesa.id }
    });

    if (existeDespesa) {
      // Atualizar despesa existente
      const { data: updateData, tagIds: newTagIds } = DespesaMapper.toUpdateData(despesa);
      
      const despesaAtualizada = await this.prisma.despesa.update({
        where: { id: despesa.id },
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
      await this.prisma.despesaTag.deleteMany({
        where: { despesaId: despesa.id }
      });

      if (newTagIds.length > 0) {
        await this.prisma.despesaTag.createMany({
          data: newTagIds.map(tagId => ({
            despesaId: despesa.id,
            tagId
          }))
        });
      }

      // Buscar despesa com tags atualizadas
      const despesaFinal = await this.prisma.despesa.findUnique({
        where: { id: despesa.id },
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        }
      });

    } else {
      // Criar nova despesa
      await this.prisma.despesa.create({
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
        await this.prisma.despesaTag.createMany({
          data: tagIds.map(tagId => ({
            despesaId: despesa.id,
            tagId
          }))
        });
      }
    }
  }

  async buscarPorId(id: string): Promise<Despesa | null> {
    const despesa = await this.prisma.despesa.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return despesa ? DespesaMapper.toDomain(despesa) : null;
  }

  async listarTodas(): Promise<Despesa[]> {
    const despesas = await this.prisma.despesa.findMany({
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: { data: 'desc' }
    });

    return DespesaMapper.toDomainList(despesas);
  }

  async listarPorPeriodo(periodo: PeriodoResumo): Promise<Despesa[]> {
    const dataInicio = new Date(periodo.ano, periodo.mes - 1, 1);
    const dataFim = new Date(periodo.ano, periodo.mes, 0);
    
    const despesas = await this.prisma.despesa.findMany({
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

    return DespesaMapper.toDomainList(despesas);
  }

  async listarPorTag(tagId: string): Promise<Despesa[]> {
    const despesas = await this.prisma.despesa.findMany({
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

    return DespesaMapper.toDomainList(despesas);
  }

  async listarComPaginacao(
    pagina: number,
    itensPorPagina: number
  ): Promise<{
    despesas: Despesa[];
    total: number;
    pagina: number;
    totalPaginas: number;
  }> {
    const [despesas, total] = await Promise.all([
      this.prisma.despesa.findMany({
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
      this.prisma.despesa.count()
    ]);

    const totalPaginas = Math.ceil(total / itensPorPagina);

    return {
      despesas: DespesaMapper.toDomainList(despesas),
      total,
      pagina,
      totalPaginas
    };
  }

  async buscarPorDescricao(descricao: string): Promise<Despesa[]> {
    const despesas = await this.prisma.despesa.findMany({
      where: {
        descricao: {
          contains: descricao
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

    return DespesaMapper.toDomainList(despesas);
  }

  async remover(id: string): Promise<void> {
    await this.prisma.despesa.delete({
      where: { id }
    });
  }

  async existe(id: string): Promise<boolean> {
    const count = await this.prisma.despesa.count({
      where: { id }
    });
    return count > 0;
  }

  async contar(): Promise<number> {
    return await this.prisma.despesa.count();
  }

  async contarPorPeriodo(periodo: PeriodoResumo): Promise<number> {
    const inicioMes = new Date(periodo.ano, periodo.mes - 1, 1);
    const fimMes = new Date(periodo.ano, periodo.mes, 0, 23, 59, 59, 999);

    return await this.prisma.despesa.count({
      where: {
        data: {
          gte: inicioMes,
          lte: fimMes
        }
      }
    });
  }
}