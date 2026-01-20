/**
 * Tipos e Interfaces para o Sistema de Empréstimos BM 2026
 */

export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco?: string;
  dataCriacao: string;
}

export interface Emprestimo {
  id: string;
  clienteId: string;
  valorPrincipal: number;
  taxaJuros: number; // % ao mês
  dataInicio: string;
  periodo: number; // em meses
  status: 'ativo' | 'quitado' | 'atrasado';
  saldoDevedor: number;
  totalPago: number;
  dataUltimoPagamento?: string;
}

export interface Parcela {
  id: string;
  emprestimoId: string;
  numeroParcela: number;
  dataVencimento: string;
  valorPrincipal: number;
  jurosCalculado: number;
  valorTotal: number;
  status: 'pendente' | 'pago' | 'atrasado';
  dataPagamento?: string;
  valorPago?: number;
}

export interface Pagamento {
  id: string;
  emprestimoId: string;
  parcelaId?: string;
  dataPagamento: string;
  valorJuros: number;
  valorAmortizacao: number;
  valorTotal: number;
  tipo: 'apenas-juros' | 'juros-amortizacao' | 'quitacao-total';
  saldoDevedorApos: number;
}

export interface DadosApp {
  clientes: Cliente[];
  emprestimos: Emprestimo[];
  parcelas: Parcela[];
  pagamentos: Pagamento[];
}

export interface EstatisticasDashboard {
  totalClientes: number;
  totalEmprestados: number;
  totalRecebido: number;
  totalEmAberto: number;
  totalAtrasado: number;
  emprestimosPorStatus: {
    ativo: number;
    quitado: number;
    atrasado: number;
  };
}
