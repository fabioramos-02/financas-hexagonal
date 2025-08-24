export class DataTransacao {
  private readonly _data: Date;

  constructor(data: Date | string) {
    if (typeof data === 'string') {
      this._data = new Date(data);
    } else {
      this._data = new Date(data.getTime());
    }

    if (isNaN(this._data.getTime())) {
      throw new Error('Data de transação inválida');
    }

    // Verifica se a data não é futura
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999); // Final do dia atual
    
    if (this._data > hoje) {
      throw new Error('Data de transação não pode ser futura');
    }
  }

  get data(): Date {
    return new Date(this._data.getTime());
  }

  get ano(): number {
    return this._data.getFullYear();
  }

  get mes(): number {
    return this._data.getMonth() + 1; // getMonth() retorna 0-11
  }

  get dia(): number {
    return this._data.getDate();
  }

  equals(outra: DataTransacao): boolean {
    return this._data.getTime() === outra._data.getTime();
  }

  isMesmoMes(outra: DataTransacao): boolean {
    return this.ano === outra.ano && this.mes === outra.mes;
  }

  isMesmoAno(outra: DataTransacao): boolean {
    return this.ano === outra.ano;
  }

  isAnterior(outra: DataTransacao): boolean {
    return this._data < outra._data;
  }

  isPosterior(outra: DataTransacao): boolean {
    return this._data > outra._data;
  }

  toString(): string {
    return this._data.toLocaleDateString('pt-BR');
  }

  toISOString(): string {
    return this._data.toISOString();
  }

  static hoje(): DataTransacao {
    return new DataTransacao(new Date());
  }

  static fromString(dataString: string): DataTransacao {
    // Aceita formatos: YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY
    let data: Date;
    
    if (dataString.includes('/')) {
      const [dia, mes, ano] = dataString.split('/');
      if (!dia || !mes || !ano) {
        throw new Error('Formato de data inválido');
      }
      data = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    } else if (dataString.includes('-')) {
      if (dataString.length === 10 && dataString.indexOf('-') === 4) {
        // Formato YYYY-MM-DD
        data = new Date(dataString);
      } else {
        // Formato DD-MM-YYYY
        const [dia, mes, ano] = dataString.split('-');
        if (!dia || !mes || !ano) {
          throw new Error('Formato de data inválido');
        }
        data = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
      }
    } else {
      throw new Error('Formato de data não suportado');
    }
    
    return new DataTransacao(data);
  }
}