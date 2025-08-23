export class ValorMonetario {
  private readonly _valor: number;

  constructor(valor: number) {
    if (valor < 0) {
      throw new Error('Valor monetário não pode ser negativo');
    }
    if (!Number.isFinite(valor)) {
      throw new Error('Valor monetário deve ser um número válido');
    }
    // Arredonda para 2 casas decimais para evitar problemas de precisão
    this._valor = Math.round(valor * 100) / 100;
  }

  get valor(): number {
    return this._valor;
  }

  somar(outro: ValorMonetario): ValorMonetario {
    return new ValorMonetario(this._valor + outro._valor);
  }

  subtrair(outro: ValorMonetario): ValorMonetario {
    const resultado = this._valor - outro._valor;
    if (resultado < 0) {
      throw new Error('Resultado da subtração não pode ser negativo');
    }
    return new ValorMonetario(resultado);
  }

  multiplicar(fator: number): ValorMonetario {
    if (fator < 0) {
      throw new Error('Fator de multiplicação não pode ser negativo');
    }
    return new ValorMonetario(this._valor * fator);
  }

  equals(outro: ValorMonetario): boolean {
    return this._valor === outro._valor;
  }

  toString(): string {
    return `R$ ${this._valor.toFixed(2).replace('.', ',')}`;
  }

  toNumber(): number {
    return this._valor;
  }

  static zero(): ValorMonetario {
    return new ValorMonetario(0);
  }

  static fromString(valor: string): ValorMonetario {
    // Remove símbolos de moeda e converte vírgula para ponto
    const numeroLimpo = valor
      .replace(/[R$\s]/g, '')
      .replace(',', '.');
    
    const numero = parseFloat(numeroLimpo);
    
    if (isNaN(numero)) {
      throw new Error('Formato de valor monetário inválido');
    }
    
    return new ValorMonetario(numero);
  }
}