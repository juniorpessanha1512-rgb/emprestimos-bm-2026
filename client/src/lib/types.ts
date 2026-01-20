/**
 * Tipos e Interfaces para o Sistema de Empréstimos BM 2026
 * Modelo: Juros Fixos com Vencimento Único
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
  clienteNome: string;
  valorPrincipal: number; // Ex: 1000
  percentualJuros: number; // Ex: 30 para 30%
  valorJuros: number; // Valor calculado (ex: 300)
  valorTotal: number; // Principal + Juros (ex: 1300)
  periodoTipo: 'semana' | 'quinzena' | 'mes'; // Tipo de período
  dataEmprestimo: string; // Data de criação (ISO)
  dataVencimento: string; // Data de vencimento (ISO)
  diasParaVencer: number; // Calculado automaticamente
  status: 'pendente' | 'pago' | 'vencido' | 'proximo'; // proximo = próximo a vencer
  dataPagamento?: string; // Data quando foi pago
  valorPago?: number; // Valor pago
  notas?: string;
}

export interface Pagamento {
  id: string;
  emprestimoId: string;
  clienteNome: string;
  valorPago: number;
  dataPagamento: string;
  tipo: 'total' | 'parcial';
  notas?: string;
}

export interface DadosApp {
  clientes: Cliente[];
  emprestimos: Emprestimo[];
  pagamentos: Pagamento[];
}

export interface EstatisticasDashboard {
  totalClientes: number;
  totalEmprestados: number;
  totalRecebido: number;
  totalEmAberto: number;
  totalVencidos: number;
  totalProximosAVencer: number;
  emprestimosPorStatus: {
    pendente: number;
    pago: number;
    vencido: number;
    proximo: number;
  };
}
