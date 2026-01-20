import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cliente, Emprestimo, Pagamento, DadosApp } from '@/lib/types';
import {
  carregarDados,
  salvarDados,
  gerarId,
  calcularJuros,
  calcularDataVencimento,
  calcularDiasParaVencer,
  determinarStatus,
  calcularEstatisticas,
} from '@/lib/utils-emprestimos';

interface EmprestimosContextType {
  dados: DadosApp;
  
  // Clientes
  adicionarCliente: (cliente: Omit<Cliente, 'id' | 'dataCriacao'>) => void;
  atualizarCliente: (id: string, cliente: Partial<Cliente>) => void;
  deletarCliente: (id: string) => void;
  
  // Empréstimos
  adicionarEmprestimo: (emprestimoData: {
    clienteId: string;
    clienteNome: string;
    valorPrincipal: number;
    percentualJuros: number;
    periodoTipo: 'semana' | 'quinzena' | 'mes';
  }) => void;
  atualizarEmprestimo: (id: string, emprestimo: Partial<Emprestimo>) => void;
  deletarEmprestimo: (id: string) => void;
  
  // Pagamentos
  adicionarPagamento: (pagamento: Omit<Pagamento, 'id'>) => void;
  
  // Estatísticas
  estatisticas: ReturnType<typeof calcularEstatisticas>;
}

const EmprestimosContext = createContext<EmprestimosContextType | undefined>(undefined);

export function EmprestimosProvider({ children }: { children: React.ReactNode }) {
  const [dados, setDados] = useState<DadosApp>(() => carregarDados());

  // Salvar dados sempre que mudam
  useEffect(() => {
    salvarDados(dados);
  }, [dados]);

  const adicionarCliente = (clienteData: Omit<Cliente, 'id' | 'dataCriacao'>) => {
    const novoCliente: Cliente = {
      ...clienteData,
      id: gerarId(),
      dataCriacao: new Date().toISOString().split('T')[0],
    };
    setDados(prev => ({
      ...prev,
      clientes: [...prev.clientes, novoCliente],
    }));
  };

  const atualizarCliente = (id: string, clienteAtualizado: Partial<Cliente>) => {
    setDados(prev => ({
      ...prev,
      clientes: prev.clientes.map(c => c.id === id ? { ...c, ...clienteAtualizado } : c),
    }));
  };

  const deletarCliente = (id: string) => {
    setDados(prev => ({
      ...prev,
      clientes: prev.clientes.filter(c => c.id !== id),
      emprestimos: prev.emprestimos.filter(e => e.clienteId !== id),
    }));
  };

  const adicionarEmprestimo = (emprestimoData: {
    clienteId: string;
    clienteNome: string;
    valorPrincipal: number;
    percentualJuros: number;
    periodoTipo: 'semana' | 'quinzena' | 'mes';
  }) => {
    const dataEmprestimo = new Date().toISOString().split('T')[0];
    const dataVencimento = calcularDataVencimento(dataEmprestimo, emprestimoData.periodoTipo);
    const valorJurosAtual = calcularJuros(emprestimoData.valorPrincipal, emprestimoData.percentualJuros);
    const diasParaVencer = calcularDiasParaVencer(dataVencimento);
    const status = determinarStatus(dataVencimento, false);

    const novoEmprestimo: Emprestimo = {
      id: gerarId(),
      clienteId: emprestimoData.clienteId,
      clienteNome: emprestimoData.clienteNome,
      valorPrincipal: emprestimoData.valorPrincipal,
      saldoDevedor: emprestimoData.valorPrincipal,
      percentualJuros: emprestimoData.percentualJuros,
      valorJurosAtual,
      valorJurosTotal: 0,
      valorTotal: emprestimoData.valorPrincipal + valorJurosAtual,
      periodoTipo: emprestimoData.periodoTipo,
      dataEmprestimo,
      dataVencimento,
      diasParaVencer,
      status,
      valorTotalPago: 0,
    };

    setDados(prev => ({
      ...prev,
      emprestimos: [...prev.emprestimos, novoEmprestimo],
    }));
  };

  const atualizarEmprestimo = (id: string, emprestimoAtualizado: Partial<Emprestimo>) => {
    setDados(prev => ({
      ...prev,
      emprestimos: prev.emprestimos.map(e => e.id === id ? { ...e, ...emprestimoAtualizado } : e),
    }));
  };

  const deletarEmprestimo = (id: string) => {
    setDados(prev => ({
      ...prev,
      emprestimos: prev.emprestimos.filter(e => e.id !== id),
      pagamentos: prev.pagamentos.filter(p => p.emprestimoId !== id),
    }));
  };

  const adicionarPagamento = (pagamentoData: Omit<Pagamento, 'id'>) => {
    const novoPagamento: Pagamento = {
      ...pagamentoData,
      id: gerarId(),
    };

    setDados(prev => {
      const emprestimoAtualizado = prev.emprestimos.find(e => e.id === pagamentoData.emprestimoId);
      
      if (emprestimoAtualizado) {
        // Lógica correta de pagamento:
        // 1. Abater juros primeiro
        // 2. Descontar o restante do principal
        // 3. Recalcular juros para o novo saldo

        const valorPago = pagamentoData.valorPago;
        const jurosAtuais = emprestimoAtualizado.valorJurosAtual;
        
        let jurosAbatidos = 0;
        let amortizacaoPrincipal = 0;

        if (valorPago >= jurosAtuais) {
          // Paga todos os juros e o restante vai para o principal
          jurosAbatidos = jurosAtuais;
          amortizacaoPrincipal = valorPago - jurosAtuais;
        } else {
          // Paga apenas parte dos juros
          jurosAbatidos = valorPago;
          amortizacaoPrincipal = 0;
        }

        const novoSaldoDevedor = Math.max(0, emprestimoAtualizado.saldoDevedor - amortizacaoPrincipal);
        const novosJuros = calcularJuros(novoSaldoDevedor, emprestimoAtualizado.percentualJuros);
        const novoValorTotal = novoSaldoDevedor + novosJuros;
        const novoStatus: 'pendente' | 'pago' | 'vencido' | 'proximo' = 
          novoSaldoDevedor === 0 ? 'pago' : emprestimoAtualizado.status;

        return {
          ...prev,
          pagamentos: [...prev.pagamentos, novoPagamento],
          emprestimos: prev.emprestimos.map(e => 
            e.id === pagamentoData.emprestimoId 
              ? {
                  ...e,
                  saldoDevedor: novoSaldoDevedor,
                  valorJurosAtual: novosJuros,
                  valorJurosTotal: (e.valorJurosTotal || 0) + jurosAbatidos,
                  valorTotal: novoValorTotal,
                  status: novoStatus,
                  dataPagamento: new Date().toISOString().split('T')[0],
                  valorTotalPago: (e.valorTotalPago || 0) + valorPago,
                }
              : e
          ),
        };
      }

      return prev;
    });
  };

  const estatisticas = calcularEstatisticas(dados);

  return (
    <EmprestimosContext.Provider
      value={{
        dados,
        adicionarCliente,
        atualizarCliente,
        deletarCliente,
        adicionarEmprestimo,
        atualizarEmprestimo,
        deletarEmprestimo,
        adicionarPagamento,
        estatisticas,
      }}
    >
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
