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
      // Erro ao excluir tag
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { nome, cor, icone } = req.body;

      // Validação básica
      if (!nome || !cor) {
        return res.status(400).json({
          erro: 'Campos obrigatórios: nome, cor'
        });
      }

      // Verificar se a tag existe
      const tagExistente = await tagRepository.buscarPorId(id);
      if (!tagExistente) {
        return res.status(404).json({ erro: 'Tag não encontrada' });
      }

      // Verificar se já existe outra tag com o mesmo nome
      const tagComMesmoNome = await tagRepository.buscarPorNome(nome);
      if (tagComMesmoNome && tagComMesmoNome.id !== id) {
        return res.status(400).json({
          erro: 'Já existe uma tag com este nome'
        });
      }

      // Atualizar a tag
      tagExistente.alterarNome(nome);
      tagExistente.alterarCor(cor);
      tagExistente.alterarIcone(icone || 'Category');
      
      await tagRepository.salvar(tagExistente);

      return res.status(200).json({
        sucesso: true,
        tag: {
          id: tagExistente.id,
          nome: tagExistente.nome,
          cor: tagExistente.cor,
          icone: tagExistente.icone,
          criadaEm: tagExistente.criadaEm
        }
      });
    } catch (error) {
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
      // Erro ao buscar tag
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  return res.status(405).json({ erro: 'Método não permitido' });
}