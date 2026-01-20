import React, { createContext, useContext, useState, useEffect } from 'react';
import { DadosApp, Cliente, Emprestimo, Parcela, Pagamento } from '@/lib/types';
import {
  carregarDados,
  salvarDados,
  criarCliente,
  criarEmprestimo,
  gerarCronograma,
  registrarPagamento,
  atualizarSaldoDevedor,
  obterEmprestimosDoCliente,
  obterParcelasDoEmprestimo,
  obterPagamentosDoEmprestimo,
  marcarParcelaComoPaga,
  calcularEstatisticas,
} from '@/lib/utils-emprestimos';

interface EmprestimosContextType {
  dados: DadosApp;
  
  // Clientes
  adicionarCliente: (nome: string, cpf: string, telefone: string, email: string, endereco?: string) => void;
  atualizarCliente: (cliente: Cliente) => void;
  deletarCliente: (clienteId: string) => void;
  
  // Empréstimos
  adicionarEmprestimo: (clienteId: string, valorPrincipal: number, taxaJuros: number, periodo: number) => void;
  atualizarEmprestimo: (emprestimo: Emprestimo) => void;
  deletarEmprestimo: (emprestimoId: string) => void;
  
  // Pagamentos
  registrarPagamentoEmprestimo: (
    emprestimoId: string,
    valorJuros: number,
    valorAmortizacao: number,
    tipo: 'apenas-juros' | 'juros-amortizacao' | 'quitacao-total'
  ) => void;
  
  // Utilidades
  obterClientePorId: (clienteId: string) => Cliente | undefined;
  obterEmprestimoPorId: (emprestimoId: string) => Emprestimo | undefined;
  obterEmprestimosCliente: (clienteId: string) => Emprestimo[];
  obterParcelasEmprestimo: (emprestimoId: string) => Parcela[];
  obterPagamentosEmprestimo: (emprestimoId: string) => Pagamento[];
  calcularEstatisticas: () => ReturnType<typeof calcularEstatisticas>;
}

const EmprestimosContext = createContext<EmprestimosContextType | undefined>(undefined);

export function EmprestimosProvider({ children }: { children: React.ReactNode }) {
  const [dados, setDados] = useState<DadosApp>(() => carregarDados());

  // Salvar dados sempre que mudarem
  useEffect(() => {
    salvarDados(dados);
  }, [dados]);

  const adicionarCliente = (
    nome: string,
    cpf: string,
    telefone: string,
    email: string,
    endereco?: string
  ) => {
    const novoCliente = criarCliente(nome, cpf, telefone, email, endereco);
    setDados({
      ...dados,
      clientes: [...dados.clientes, novoCliente],
    });
  };

  const atualizarCliente = (cliente: Cliente) => {
    setDados({
      ...dados,
      clientes: dados.clientes.map((c) => (c.id === cliente.id ? cliente : c)),
    });
  };

  const deletarCliente = (clienteId: string) => {
    setDados({
      ...dados,
      clientes: dados.clientes.filter((c) => c.id !== clienteId),
      emprestimos: dados.emprestimos.filter((e) => e.clienteId !== clienteId),
      parcelas: dados.parcelas.filter(
        (p) => !dados.emprestimos.find((e) => e.clienteId === clienteId && e.id === p.emprestimoId)
      ),
    });
  };

  const adicionarEmprestimo = (
    clienteId: string,
    valorPrincipal: number,
    taxaJuros: number,
    periodo: number
  ) => {
    const novoEmprestimo = criarEmprestimo(clienteId, valorPrincipal, taxaJuros, periodo);
    const novasParcelas = gerarCronograma(
      novoEmprestimo.id,
      valorPrincipal,
      taxaJuros,
      periodo,
      novoEmprestimo.dataInicio
    );

    setDados({
      ...dados,
      emprestimos: [...dados.emprestimos, novoEmprestimo],
      parcelas: [...dados.parcelas, ...novasParcelas],
    });
  };

  const atualizarEmprestimo = (emprestimo: Emprestimo) => {
    setDados({
      ...dados,
      emprestimos: dados.emprestimos.map((e) => (e.id === emprestimo.id ? emprestimo : e)),
    });
  };

  const deletarEmprestimo = (emprestimoId: string) => {
    setDados({
      ...dados,
      emprestimos: dados.emprestimos.filter((e) => e.id !== emprestimoId),
      parcelas: dados.parcelas.filter((p) => p.emprestimoId !== emprestimoId),
      pagamentos: dados.pagamentos.filter((p) => p.emprestimoId !== emprestimoId),
    });
  };

  const registrarPagamentoEmprestimo = (
    emprestimoId: string,
    valorJuros: number,
    valorAmortizacao: number,
    tipo: 'apenas-juros' | 'juros-amortizacao' | 'quitacao-total'
  ) => {
    const emprestimo = dados.emprestimos.find((e) => e.id === emprestimoId);
    if (!emprestimo) return;

    const novoPagamento = registrarPagamento(
      emprestimoId,
      undefined,
      valorJuros,
      valorAmortizacao,
      tipo
    );

    const emprestimoAtualizado = atualizarSaldoDevedor(emprestimo, valorAmortizacao);
    emprestimoAtualizado.totalPago += valorJuros + valorAmortizacao;
    emprestimoAtualizado.dataUltimoPagamento = novoPagamento.dataPagamento;

    setDados({
      ...dados,
      emprestimos: dados.emprestimos.map((e) =>
        e.id === emprestimoId ? emprestimoAtualizado : e
      ),
      pagamentos: [...dados.pagamentos, novoPagamento],
    });
  };

  const obterClientePorId = (clienteId: string) => {
    return dados.clientes.find((c) => c.id === clienteId);
  };

  const obterEmprestimoPorId = (emprestimoId: string) => {
    return dados.emprestimos.find((e) => e.id === emprestimoId);
  };

  const obterEmprestimosCliente = (clienteId: string) => {
    return obterEmprestimosDoCliente(dados, clienteId);
  };

  const obterParcelasEmprestimo = (emprestimoId: string) => {
    return obterParcelasDoEmprestimo(dados, emprestimoId);
  };

  const obterPagamentosEmprestimo = (emprestimoId: string) => {
    return obterPagamentosDoEmprestimo(dados, emprestimoId);
  };

  const calcularStats = () => {
    return calcularEstatisticas(dados);
  };

  const value: EmprestimosContextType = {
    dados,
    adicionarCliente,
    atualizarCliente,
    deletarCliente,
    adicionarEmprestimo,
    atualizarEmprestimo,
    deletarEmprestimo,
    registrarPagamentoEmprestimo,
    obterClientePorId,
    obterEmprestimoPorId,
    obterEmprestimosCliente,
    obterParcelasEmprestimo,
    obterPagamentosEmprestimo,
    calcularEstatisticas: calcularStats,
  };

  return (
    <EmprestimosContext.Provider value={value}>
      {children}
    </EmprestimosContext.Provider>
  );
}

export function useEmprestimos() {
  const context = useContext(EmprestimosContext);
  if (!context) {
    throw new Error('useEmprestimos deve ser usado dentro de EmprestimosProvider');
  }
  return context;
}
