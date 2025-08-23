import { ValorMonetario } from '../value-objects/ValorMonetario';
import { Receita } from './Receita';
import { Despesa } from './Despesa';

export interface PeriodoResumo {
  mes: number;
  ano: number;
}

export class ResumoFinanceiro {
  private readonly _periodo: PeriodoResumo;
  private readonly _totalReceitas: ValorMonetario;
  private readonly _totalDespesas: ValorMonetario;
  private readonly _saldo: ValorMonetario;
  private readonly _quantidadeReceitas: number;
  private readonly _quantidadeDespesas: number;
  private readonly _geradoEm: Date;

  constructor(
    periodo: PeriodoResumo,
    totalReceitas: ValorMonetario,
    totalDespesas: ValorMonetario,
    quantidadeReceitas: number,
    quantidadeDespesas: number,
    geradoEm?: Date
  ) {
    this.validarPeriodo(periodo);
    this.validarQuantidades(quantidadeReceitas, quantidadeDespesas);

    this._periodo = { ...periodo };
    this._totalReceitas = totalReceitas;
    this._totalDespesas = totalDespesas;
    this._saldo = this.calcularSaldo(totalReceitas, totalDespesas);
    this._quantidadeReceitas = quantidadeReceitas;
    this._quantidadeDespesas = quantidadeDespesas;
    this._geradoEm = geradoEm || new Date();
  }

  get periodo(): PeriodoResumo {
    return { ...this._periodo };
  }

  get totalReceitas(): ValorMonetario {
    return this._totalReceitas;
  }

  get totalDespesas(): ValorMonetario {
    return this._totalDespesas;
  }

  get saldo(): ValorMonetario {
    return this._saldo;
  }

  get quantidadeReceitas(): number {
    return this._quantidadeReceitas;
  }

  get quantidadeDespesas(): number {
    return this._quantidadeDespesas;
  }

  get geradoEm(): Date {
    return new Date(this._geradoEm.getTime());
  }

  get temSaldoPositivo(): boolean {
    return this._saldo.valor > 0;
  }

  get temSaldoNegativo(): boolean {
    return this._saldo.valor < 0;
  }

  get temSaldoZerado(): boolean {
    return this._saldo.valor === 0;
  }

  get mediaReceitas(): ValorMonetario {
    if (this._quantidadeReceitas === 0) {
      return ValorMonetario.zero();
    }
    return new ValorMonetario(this._totalReceitas.valor / this._quantidadeReceitas);
  }

  get mediaDespesas(): ValorMonetario {
    if (this._quantidadeDespesas === 0) {
      return ValorMonetario.zero();
    }
    return new ValorMonetario(this._totalDespesas.valor / this._quantidadeDespesas);
  }

  private calcularSaldo(receitas: ValorMonetario, despesas: ValorMonetario): ValorMonetario {
    const diferenca = receitas.valor - despesas.valor;
    return new ValorMonetario(Math.abs(diferenca));
  }

  private validarPeriodo(periodo: PeriodoResumo): void {
    if (!periodo) {
      throw new Error('Período é obrigatório');
    }
    
    if (periodo.mes < 1 || periodo.mes > 12) {
      throw new Error('Mês deve estar entre 1 e 12');
    }
    
    if (periodo.ano < 1900 || periodo.ano > new Date().getFullYear() + 10) {
      throw new Error('Ano deve ser válido');
    }
  }

  private validarQuantidades(receitas: number, despesas: number): void {
    if (receitas < 0 || despesas < 0) {
      throw new Error('Quantidades não podem ser negativas');
    }
    
    if (!Number.isInteger(receitas) || !Number.isInteger(despesas)) {
      throw new Error('Quantidades devem ser números inteiros');
    }
  }

  toJSON(): object {
    return {
      periodo: this._periodo,
      totalReceitas: this._totalReceitas.toNumber(),
      totalDespesas: this._totalDespesas.toNumber(),
      saldo: this._saldo.toNumber(),
      quantidadeReceitas: this._quantidadeReceitas,
      quantidadeDespesas: this._quantidadeDespesas,
      temSaldoPositivo: this.temSaldoPositivo,
      temSaldoNegativo: this.temSaldoNegativo,
      mediaReceitas: this.mediaReceitas.toNumber(),
      mediaDespesas: this.mediaDespesas.toNumber(),
      geradoEm: this._geradoEm.toISOString()
    };
  }

  static gerarResumo(
    receitas: Receita[],
    despesas: Despesa[],
    periodo: PeriodoResumo
  ): ResumoFinanceiro {
    const receitasDoPeriodo = receitas.filter(r => 
      r.data.mes === periodo.mes && r.data.ano === periodo.ano
    );
    
    const despesasDoPeriodo = despesas.filter(d => 
      d.data.mes === periodo.mes && d.data.ano === periodo.ano
    );

    const totalReceitas = receitasDoPeriodo.reduce(
      (total, receita) => total.somar(receita.valor),
      ValorMonetario.zero()
    );

    const totalDespesas = despesasDoPeriodo.reduce(
      (total, despesa) => total.somar(despesa.valor),
      ValorMonetario.zero()
    );

    return new ResumoFinanceiro(
      periodo,
      totalReceitas,
      totalDespesas,
      receitasDoPeriodo.length,
      despesasDoPeriodo.length
    );
  }
}