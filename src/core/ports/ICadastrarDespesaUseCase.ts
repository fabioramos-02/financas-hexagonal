import { Despesa } from '../entities/Despesa';
import { ValorMonetario } from '../value-objects/ValorMonetario';
import { DataTransacao } from '../value-objects/DataTransacao';

export interface CadastrarDespesaInput {
  descricao: string;
  valor: number;
  data: string | Date;
  tagIds?: string[];
}

export interface CadastrarDespesaOutput {
  despesa: Despesa;
  sucesso: boolean;
  mensagem: string;
}

export interface ICadastrarDespesaUseCase {
  executar(input: CadastrarDespesaInput): Promise<CadastrarDespesaOutput>;
}