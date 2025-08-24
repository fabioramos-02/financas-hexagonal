import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../src/infrastructure/database/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({
      erro: 'ID inválido'
    });
  }

  if (req.method === 'DELETE') {
    try {
      // Verificar se a receita existe
      const receita = await prisma.receita.findUnique({
        where: { id }
      });

      if (!receita) {
        return res.status(404).json({
          erro: 'Receita não encontrada'
        });
      }

      // Excluir a receita
      await prisma.receita.delete({
        where: { id }
      });

      return res.status(200).json({
        sucesso: true,
        mensagem: 'Entrada excluída com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir entrada:', error);
      return res.status(500).json({
        erro: 'Erro interno do servidor'
      });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({
      erro: `Método ${req.method} não permitido`
    });
  }
}