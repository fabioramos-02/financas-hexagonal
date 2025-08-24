import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../src/infrastructure/database/prisma';
import { PrismaTagRepository } from '../../../src/adapters/repositories/PrismaTagRepository';

const tagRepository = new PrismaTagRepository(prisma);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ erro: 'ID da tag é obrigatório' });
  }

  if (req.method === 'DELETE') {
    try {
      // Verificar se a tag existe
      const tagExistente = await tagRepository.buscarPorId(id);
      if (!tagExistente) {
        return res.status(404).json({ erro: 'Tag não encontrada' });
      }

      // Excluir a tag
      await tagRepository.remover(id);
      
      return res.status(200).json({ mensagem: 'Tag excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir tag:', error);
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  if (req.method === 'GET') {
    try {
      const tag = await tagRepository.buscarPorId(id);
      
      if (!tag) {
        return res.status(404).json({ erro: 'Tag não encontrada' });
      }
      
      return res.status(200).json({ tag });
    } catch (error) {
      console.error('Erro ao buscar tag:', error);
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  return res.status(405).json({ erro: 'Método não permitido' });
}