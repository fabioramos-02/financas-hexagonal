import { Receita } from '../entities/Receita';
import { ValorMonetario } from '../value-objects/ValorMonetario';
import { DataTransacao } from '../value-objects/DataTransacao';

export interface CadastrarReceitaInput {
  descricao: string;
  valor: number;
  data: string | Date;
  tagIds?: string[];
}

export interface CadastrarReceitaOutput {
  receita: Receita;
  sucesso: boolean;
  mensagem: string;
}

export interface ICadastrarReceitaUseCase {
  executar(input: CadastrarReceitaInput): Promise<CadastrarReceitaOutput>;
}