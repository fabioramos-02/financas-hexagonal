import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../infrastructure/database/prisma';
import { PrismaTagRepository } from '../../../../adapters/repositories/PrismaTagRepository';
import { Tag } from '../../../../core/entities/Tag';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { nome, cor } = req.body;

      // Validação básica
      if (!nome || !cor) {
        return res.status(400).json({
          erro: 'Campos obrigatórios: nome, cor'
        });
      }

      // Instanciar repositório
      const tagRepository = new PrismaTagRepository(prisma);

      // Verificar se já existe uma tag com o mesmo nome
      const tagExistente = await tagRepository.buscarPorNome(nome);
      if (tagExistente) {
        return res.status(400).json({
          erro: 'Já existe uma tag com este nome'
        });
      }

      // Criar nova tag
      const novaTag = Tag.criar(nome, cor);
      const tagSalva = await tagRepository.salvar(novaTag);

      return res.status(201).json({
        sucesso: true,
        tag: {
          id: tagSalva.id,
          nome: tagSalva.nome,
          cor: tagSalva.cor,
          criadaEm: tagSalva.criadaEm
        }
      });
    } catch (error) {
      console.error('Erro ao cadastrar tag:', error);
      return res.status(500).json({
        erro: 'Erro interno do servidor'
      });
    }
  } else if (req.method === 'GET') {
    try {
      const tagRepository = new PrismaTagRepository(prisma);
      const tags = await tagRepository.listarTodas();

      return res.status(200).json({
        tags: tags.map(tag => ({
          id: tag.id,
          nome: tag.nome,
          cor: tag.cor,
          criadaEm: tag.criadaEm
        }))
      });
    } catch (error) {
      console.error('Erro ao listar tags:', error);
      return res.status(500).json({
        erro: 'Erro interno do servidor'
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({
      erro: `Método ${req.method} não permitido`
    });
  }
}