import { ValorMonetario } from '../value-objects/ValorMonetario';
import { DataTransacao } from '../value-objects/DataTransacao';
import { Tag } from './Tag';

export class Receita {
  private readonly _id: string;
  private _descricao: string;
  private _valor: ValorMonetario;
  private _data: DataTransacao;
  private _tags: Tag[];
  private readonly _criadaEm: Date;
  private _atualizadaEm: Date;

  constructor(
    id: string,
    descricao: string,
    valor: ValorMonetario,
    data: DataTransacao,
    tags: Tag[] = [],
    criadaEm?: Date,
    atualizadaEm?: Date
  ) {
    this.validarId(id);
    this.validarDescricao(descricao);
    this.validarTags(tags);

    this._id = id;
    this._descricao = descricao.trim();
    this._valor = valor;
    this._data = data;
    this._tags = [...tags];
    this._criadaEm = criadaEm || new Date();
    this._atualizadaEm = atualizadaEm || new Date();
  }

  get id(): string {
    return this._id;
  }

  get descricao(): string {
    return this._descricao;
  }

  get valor(): ValorMonetario {
    return this._valor;
  }

  get data(): DataTransacao {
    return this._data;
  }

  get tags(): Tag[] {
    return [...this._tags];
  }

  get criadaEm(): Date {
    return new Date(this._criadaEm.getTime());
  }

  get atualizadaEm(): Date {
    return new Date(this._atualizadaEm.getTime());
  }

  alterarDescricao(novaDescricao: string): void {
    this.validarDescricao(novaDescricao);
    this._descricao = novaDescricao.trim();
    this._atualizadaEm = new Date();
  }

  alterarValor(novoValor: ValorMonetario): void {
    this._valor = novoValor;
    this._atualizadaEm = new Date();
  }

  alterarData(novaData: DataTransacao): void {
    this._data = novaData;
    this._atualizadaEm = new Date();
  }

  adicionarTag(tag: Tag): void {
    if (this._tags.some(t => t.equals(tag))) {
      throw new Error('Tag já está associada a esta receita');
    }
    this._tags.push(tag);
    this._atualizadaEm = new Date();
  }

  removerTag(tag: Tag): void {
    const index = this._tags.findIndex(t => t.equals(tag));
    if (index === -1) {
      throw new Error('Tag não está associada a esta receita');
    }
    this._tags.splice(index, 1);
    this._atualizadaEm = new Date();
  }

  possuiTag(tag: Tag): boolean {
    return this._tags.some(t => t.equals(tag));
  }

  equals(outra: Receita): boolean {
    return this._id === outra._id;
  }

  private validarId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error('ID da receita é obrigatório');
    }
  }

  private validarDescricao(descricao: string): void {
    if (!descricao || descricao.trim().length === 0) {
      throw new Error('Descrição da receita é obrigatória');
    }
    
    if (descricao.trim().length > 200) {
      throw new Error('Descrição da receita não pode ter mais de 200 caracteres');
    }
  }

  private validarTags(tags: Tag[]): void {
    if (tags.length > 10) {
      throw new Error('Uma receita não pode ter mais de 10 tags');
    }
  }

  toJSON(): object {
    return {
      id: this._id,
      descricao: this._descricao,
      valor: this._valor.toNumber(),
      data: this._data.toISOString(),
      tags: this._tags.map(tag => tag.toJSON()),
      criadaEm: this._criadaEm.toISOString(),
      atualizadaEm: this._atualizadaEm.toISOString()
    };
  }

  static criar(
    descricao: string,
    valor: ValorMonetario,
    data: DataTransacao,
    tags: Tag[] = []
  ): Receita {
    const id = crypto.randomUUID();
    return new Receita(id, descricao, valor, data, tags);
  }
}