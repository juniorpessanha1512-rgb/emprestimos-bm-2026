/**
 * Utilitários para cálculos de empréstimos e gestão de dados
 */

import { Cliente, Emprestimo, Parcela, Pagamento, DadosApp } from './types';

const STORAGE_KEY = 'emprestimos-bm-dados';

/**
 * Gera um ID único
 */
export function gerarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Formata data para string YYYY-MM-DD
 */
export function formatarData(data: Date | string): string {
  if (typeof data === 'string') return data;
  return data.toISOString().split('T')[0];
}

/**
 * Formata valor em moeda brasileira
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

/**
 * Calcula juros simples para um período
 * Fórmula: J = P * (r/100) * (t/12) onde t é em meses
 */
export function calcularJuros(principal: number, taxaMensal: number): number {
  return principal * (taxaMensal / 100);
}

/**
 * Gera cronograma de parcelas para um empréstimo
 */
export function gerarCronograma(
  emprestimoId: string,
  valorPrincipal: number,
  taxaMensal: number,
  periodo: number,
  dataInicio: string
): Parcela[] {
  const parcelas: Parcela[] = [];
  const dataInicioObj = new Date(dataInicio);

  for (let i = 1; i <= periodo; i++) {
    const dataVencimento = new Date(dataInicioObj);
    dataVencimento.setMonth(dataVencimento.getMonth() + i);

    // Juros são calculados sobre o valor principal a cada mês
    const jurosCalculado = calcularJuros(valorPrincipal, taxaMensal);
    const valorTotal = jurosCalculado;

    parcelas.push({
      id: gerarId(),
      emprestimoId,
      numeroParcela: i,
      dataVencimento: formatarData(dataVencimento),
      valorPrincipal,
      jurosCalculado,
      valorTotal,
      status: 'pendente',
    });
  }

  return parcelas;
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
      parcelas: [],
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
 * Cria um novo cliente
 */
export function criarCliente(
  nome: string,
  cpf: string,
  telefone: string,
  email: string,
  endereco?: string
): Cliente {
  return {
    id: gerarId(),
    nome,
    cpf,
    telefone,
    email,
    endereco,
    dataCriacao: formatarData(new Date()),
  };
}

/**
 * Cria um novo empréstimo
 */
export function criarEmprestimo(
  clienteId: string,
  valorPrincipal: number,
  taxaJuros: number,
  periodo: number
): Emprestimo {
  return {
    id: gerarId(),
    clienteId,
    valorPrincipal,
    taxaJuros,
    dataInicio: formatarData(new Date()),
    periodo,
    status: 'ativo',
    saldoDevedor: valorPrincipal,
    totalPago: 0,
  };
}

/**
 * Registra um pagamento e atualiza o saldo devedor
 */
export function registrarPagamento(
  emprestimoId: string,
  parcelaId: string | undefined,
  valorJuros: number,
  valorAmortizacao: number,
  tipo: 'apenas-juros' | 'juros-amortizacao' | 'quitacao-total'
): Pagamento {
  return {
    id: gerarId(),
    emprestimoId,
    parcelaId,
    dataPagamento: formatarData(new Date()),
    valorJuros,
    valorAmortizacao,
    valorTotal: valorJuros + valorAmortizacao,
    tipo,
    saldoDevedorApos: 0, // Será calculado depois
  };
}

/**
 * Atualiza o saldo devedor de um empréstimo
 */
export function atualizarSaldoDevedor(
  emprestimo: Emprestimo,
  valorAmortizacao: number
): Emprestimo {
  const novoSaldo = Math.max(0, emprestimo.saldoDevedor - valorAmortizacao);
  return {
    ...emprestimo,
    saldoDevedor: novoSaldo,
    status: novoSaldo === 0 ? 'quitado' : emprestimo.status,
  };
}

/**
 * Calcula estatísticas do dashboard
 */
export function calcularEstatisticas(dados: DadosApp) {
  const totalClientes = dados.clientes.length;
  const totalEmprestados = dados.emprestimos.reduce(
    (acc, e) => acc + e.valorPrincipal,
    0
  );
  const totalRecebido = dados.pagamentos.reduce(
    (acc, p) => acc + p.valorTotal,
    0
  );
  const totalEmAberto = dados.emprestimos.reduce(
    (acc, e) => acc + e.saldoDevedor,
    0
  );

  const emprestimosPorStatus = {
    ativo: dados.emprestimos.filter((e) => e.status === 'ativo').length,
    quitado: dados.emprestimos.filter((e) => e.status === 'quitado').length,
    atrasado: dados.emprestimos.filter((e) => e.status === 'atrasado').length,
  };

  // Identifica atrasos (parcelas vencidas não pagas)
  const hoje = formatarData(new Date());
  const totalAtrasado = dados.parcelas
    .filter((p) => p.status === 'pendente' && p.dataVencimento < hoje)
    .reduce((acc, p) => acc + p.valorTotal, 0);

  return {
    totalClientes,
    totalEmprestados,
    totalRecebido,
    totalEmAberto,
    totalAtrasado,
    emprestimosPorStatus,
  };
}

/**
 * Obtém cliente por ID
 */
export function obterClientePorId(
  dados: DadosApp,
  clienteId: string
): Cliente | undefined {
  return dados.clientes.find((c) => c.id === clienteId);
}

/**
 * Obtém empréstimo por ID
 */
export function obterEmprestimoPorId(
  dados: DadosApp,
  emprestimoId: string
): Emprestimo | undefined {
  return dados.emprestimos.find((e) => e.id === emprestimoId);
}

/**
 * Obtém empréstimos de um cliente
 */
export function obterEmprestimosDoCliente(
  dados: DadosApp,
  clienteId: string
): Emprestimo[] {
  return dados.emprestimos.filter((e) => e.clienteId === clienteId);
}

/**
 * Obtém parcelas de um empréstimo
 */
export function obterParcelasDoEmprestimo(
  dados: DadosApp,
  emprestimoId: string
): Parcela[] {
  return dados.parcelas
    .filter((p) => p.emprestimoId === emprestimoId)
    .sort((a, b) => a.numeroParcela - b.numeroParcela);
}

/**
 * Obtém pagamentos de um empréstimo
 */
export function obterPagamentosDoEmprestimo(
  dados: DadosApp,
  emprestimoId: string
): Pagamento[] {
  return dados.pagamentos
    .filter((p) => p.emprestimoId === emprestimoId)
    .sort((a, b) => new Date(b.dataPagamento).getTime() - new Date(a.dataPagamento).getTime());
}

/**
 * Marca parcela como paga
 */
export function marcarParcelaComoPaga(
  parcela: Parcela,
  valorPago: number
): Parcela {
  return {
    ...parcela,
    status: 'pago',
    dataPagamento: formatarData(new Date()),
    valorPago,
  };
}

/**
 * Verifica se uma parcela está atrasada
 */
export function estaAtrasada(parcela: Parcela): boolean {
  if (parcela.status === 'pago') return false;
  const hoje = formatarData(new Date());
  return parcela.dataVencimento < hoje;
}
