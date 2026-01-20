/**
 * Utilitários para cálculos de empréstimos com juros fixos
 * Modelo: Juros fixos com vencimento único
 */

import { Emprestimo, DadosApp, EstatisticasDashboard } from './types';

const STORAGE_KEY = 'emprestimos-bm-dados';

/**
 * Calcula a data de vencimento baseado no período
 */
export function calcularDataVencimento(dataInicio: string, periodoTipo: 'semana' | 'quinzena' | 'mes'): string {
  const data = new Date(dataInicio);
  
  switch (periodoTipo) {
    case 'semana':
      data.setDate(data.getDate() + 7);
      break;
    case 'quinzena':
      data.setDate(data.getDate() + 15);
      break;
    case 'mes':
      data.setMonth(data.getMonth() + 1);
      break;
  }
  
  return data.toISOString().split('T')[0];
}

/**
 * Calcula dias para vencer
 */
export function calcularDiasParaVencer(dataVencimento: string): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const vencimento = new Date(dataVencimento);
  vencimento.setHours(0, 0, 0, 0);
  
  const diferenca = vencimento.getTime() - hoje.getTime();
  return Math.ceil(diferenca / (1000 * 60 * 60 * 24));
}

/**
 * Determina o status baseado na data de vencimento
 */
export function determinarStatus(dataVencimento: string, pago: boolean): 'pendente' | 'pago' | 'vencido' | 'proximo' {
  if (pago) return 'pago';
  
  const diasParaVencer = calcularDiasParaVencer(dataVencimento);
  
  if (diasParaVencer < 0) {
    return 'vencido';
  } else if (diasParaVencer <= 7) {
    return 'proximo';
  } else {
    return 'pendente';
  }
}

/**
 * Calcula o valor dos juros
 */
export function calcularJuros(valorPrincipal: number, percentual: number): number {
  return (valorPrincipal * percentual) / 100;
}

/**
 * Formata moeda brasileira
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

/**
 * Formata data para padrão brasileiro (DD/MM/YYYY)
 */
export function formatarData(data: string): string {
  return new Date(data).toLocaleDateString('pt-BR');
}

/**
 * Formata data para ISO (YYYY-MM-DD)
 */
export function formatarDataISO(data: Date | string): string {
  if (typeof data === 'string') return data;
  return data.toISOString().split('T')[0];
}

/**
 * Calcula estatísticas do dashboard
 */
export function calcularEstatisticas(dados: DadosApp): EstatisticasDashboard {
  const emprestimos = dados.emprestimos;
  
  const totalEmprestados = emprestimos.reduce((sum, e) => sum + e.valorPrincipal, 0);
  const totalRecebido = emprestimos
    .filter(e => e.status === 'pago')
    .reduce((sum, e) => sum + (e.valorTotalPago || e.valorTotal), 0);
  
  const totalEmAberto = emprestimos
    .filter(e => e.status !== 'pago')
    .reduce((sum, e) => sum + e.saldoDevedor, 0);
  
  const totalVencidos = emprestimos
    .filter(e => e.status === 'vencido')
    .reduce((sum, e) => sum + e.valorTotal, 0);
  
  const totalProximosAVencer = emprestimos
    .filter(e => e.status === 'proximo')
    .reduce((sum, e) => sum + e.valorTotal, 0);

  return {
    totalClientes: dados.clientes.length,
    totalEmprestados,
    totalRecebido,
    totalEmAberto,
    totalVencidos,
    totalProximosAVencer,
    emprestimosPorStatus: {
      pendente: emprestimos.filter(e => e.status === 'pendente').length,
      pago: emprestimos.filter(e => e.status === 'pago').length,
      vencido: emprestimos.filter(e => e.status === 'vencido').length,
      proximo: emprestimos.filter(e => e.status === 'proximo').length,
    },
  };
}

/**
 * Gera ID único
 */
export function gerarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Obtém período em dias
 */
export function obterPeriodoEmDias(periodoTipo: 'semana' | 'quinzena' | 'mes'): number {
  switch (periodoTipo) {
    case 'semana':
      return 7;
    case 'quinzena':
      return 15;
    case 'mes':
      return 30;
  }
}

/**
 * Obtém label do período
 */
export function obterLabelPeriodo(periodoTipo: 'semana' | 'quinzena' | 'mes'): string {
  switch (periodoTipo) {
    case 'semana':
      return '1 Semana';
    case 'quinzena':
      return '15 Dias';
    case 'mes':
      return '1 Mês';
  }
}

/**
 * Carrega dados do localStorage
 */
export function carregarDados(): DadosApp {
  const dados = localStorage.getItem(STORAGE_KEY);
  if (!dados) {
    return {
      clientes: [],
      emprestimos: [],
      pagamentos: [],
    };
  }
  return JSON.parse(dados);
}

/**
 * Salva dados no localStorage
 */
export function salvarDados(dados: DadosApp): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}


/**
 * Calcula o total de juros previstos para o mês atual
 */
export function calcularJurosPrevistosDoMes(emprestimos: Emprestimo[]): number {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  return emprestimos
    .filter(e => {
      // Verifica se o empréstimo não foi pago ainda
      if (e.status === 'pago') return false;

      // Verifica se o vencimento é neste mês
      const dataVencimento = new Date(e.dataVencimento);
      return dataVencimento.getMonth() === mesAtual && dataVencimento.getFullYear() === anoAtual;
    })
    .reduce((sum, e) => sum + e.valorJurosAtual, 0);
}

/**
 * Calcula o total de juros já recebidos no mês
 */
export function calcularJurosRecebidosDoMes(emprestimos: Emprestimo[], pagamentos: any[]): number {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  return pagamentos
    .filter(p => {
      const dataPagamento = new Date(p.dataPagamento);
      return dataPagamento.getMonth() === mesAtual && dataPagamento.getFullYear() === anoAtual;
    })
    .reduce((sum, p) => {
      // Usa jurosAbatidos do pagamento diretamente
      return sum + p.jurosAbatidos;
    }, 0);
}
