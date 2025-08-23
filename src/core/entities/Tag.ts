export class Tag {
  private readonly _id: string;
  private _nome: string;
  private _cor: string;
  private readonly _criadaEm: Date;

  constructor(
    id: string,
    nome: string,
    cor: string = '#6B7280',
    criadaEm?: Date
  ) {
    this.validarId(id);
    this.validarNome(nome);
    this.validarCor(cor);

    this._id = id;
    this._nome = nome.trim();
    this._cor = cor;
    this._criadaEm = criadaEm || new Date();
  }

  get id(): string {
    return this._id;
  }

  get nome(): string {
    return this._nome;
  }

  get cor(): string {
    return this._cor;
  }

  get criadaEm(): Date {
    return new Date(this._criadaEm.getTime());
  }

  alterarNome(novoNome: string): void {
    this.validarNome(novoNome);
    this._nome = novoNome.trim();
  }

  alterarCor(novaCor: string): void {
    this.validarCor(novaCor);
    this._cor = novaCor;
  }

  equals(outra: Tag): boolean {
    return this._id === outra._id;
  }

  private validarId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error('ID da tag é obrigatório');
    }
  }

  private validarNome(nome: string): void {
    if (!nome || nome.trim().length === 0) {
      throw new Error('Nome da tag é obrigatório');
    }
    
    if (nome.trim().length > 50) {
      throw new Error('Nome da tag não pode ter mais de 50 caracteres');
    }
  }

  private validarCor(cor: string): void {
    if (!cor || cor.trim().length === 0) {
      throw new Error('Cor da tag é obrigatória');
    }
    
    // Valida formato hexadecimal (#RRGGBB)
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!hexRegex.test(cor)) {
      throw new Error('Cor deve estar no formato hexadecimal (#RRGGBB)');
    }
  }

  toJSON(): object {
    return {
      id: this._id,
      nome: this._nome,
      cor: this._cor,
      criadaEm: this._criadaEm.toISOString()
    };
  }

  static criar(nome: string, cor?: string): Tag {
    const id = crypto.randomUUID();
    return new Tag(id, nome, cor);
  }

  static fromJSON(data: any): Tag {
    return new Tag(
      data.id,
      data.nome,
      data.cor,
      new Date(data.criadaEm)
    );
  }
}