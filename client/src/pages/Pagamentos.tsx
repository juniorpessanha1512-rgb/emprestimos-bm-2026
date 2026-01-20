import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEmprestimos } from '@/contexts/EmprestimosContext';
import { formatarMoeda, formatarData, calcularJuros } from '@/lib/utils-emprestimos';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function Pagamentos() {
  const {
    dados,
    registrarPagamentoEmprestimo,
    obterClientePorId,
    obterPagamentosEmprestimo,
  } = useEmprestimos();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    emprestimoId: '',
    tipo: 'juros-amortizacao' as 'apenas-juros' | 'juros-amortizacao' | 'quitacao-total',
    valorAmortizacao: '',
  });

  const emprestimoSelecionado = dados.emprestimos.find((e) => e.id === formData.emprestimoId);
  const jurosCalculado = emprestimoSelecionado
    ? calcularJuros(emprestimoSelecionado.saldoDevedor, emprestimoSelecionado.taxaJuros)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.emprestimoId) {
      toast.error('Selecione um empréstimo!');
      return;
    }

    if (!emprestimoSelecionado) {
      toast.error('Empréstimo não encontrado!');
      return;
    }

    let valorAmortizacao = 0;

    if (formData.tipo === 'apenas-juros') {
      valorAmortizacao = 0;
    } else if (formData.tipo === 'juros-amortizacao') {
      valorAmortizacao = parseFloat(formData.valorAmortizacao);
      if (isNaN(valorAmortizacao) || valorAmortizacao <= 0) {
        toast.error('Digite um valor de amortização válido!');
        return;
      }
      if (valorAmortizacao > emprestimoSelecionado.saldoDevedor) {
        toast.error('O valor de amortização não pode ser maior que o saldo devedor!');
        return;
      }
    } else if (formData.tipo === 'quitacao-total') {
      valorAmortizacao = emprestimoSelecionado.saldoDevedor;
    }

    registrarPagamentoEmprestimo(
      formData.emprestimoId,
      jurosCalculado,
      valorAmortizacao,
      formData.tipo
    );

    setFormData({
      emprestimoId: '',
      tipo: 'juros-amortizacao',
      valorAmortizacao: '',
    });
    setMostrarFormulario(false);
    toast.success('Pagamento registrado com sucesso!');
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#1a365d] mb-2">Pagamentos</h1>
          <p className="text-gray-600">Registrar pagamentos de empréstimos</p>
        </div>
        <Button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-[#1a365d] hover:bg-[#0f1f3a] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Pagamento
        </Button>
      </div>

      {/* Formulário */}
      {mostrarFormulario && (
        <Card className="p-6 border-2 border-[#d4af37] shadow-md">
          <h2 className="text-2xl font-bold text-[#1a365d] mb-6">Registrar Pagamento</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emprestimo" className="text-[#1a365d] font-semibold">
                  Empréstimo *
                </Label>
                <Select
                  value={formData.emprestimoId}
                  onValueChange={(value) => setFormData({ ...formData, emprestimoId: value })}
                >
                  <SelectTrigger className="border-[#d4af37] focus:border-[#1a365d]">
                    <SelectValue placeholder="Selecione um empréstimo" />
                  </SelectTrigger>
                  <SelectContent>
                    {dados.emprestimos
                      .filter((e) => e.status !== 'quitado')
                      .map((emprestimo) => {
                        const cliente = obterClientePorId(emprestimo.clienteId);
                        return (
                          <SelectItem key={emprestimo.id} value={emprestimo.id}>
                            {cliente?.nome} - {formatarMoeda(emprestimo.saldoDevedor)}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-[#1a365d] font-semibold">
                  Tipo de Pagamento *
                </Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      tipo: value as 'apenas-juros' | 'juros-amortizacao' | 'quitacao-total',
                    })
                  }
                >
                  <SelectTrigger className="border-[#d4af37] focus:border-[#1a365d]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apenas-juros">Apenas Juros</SelectItem>
                    <SelectItem value="juros-amortizacao">Juros + Amortização</SelectItem>
                    <SelectItem value="quitacao-total">Quitação Total</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Informações do Empréstimo */}
            {emprestimoSelecionado && (
              <div className="p-4 bg-[#1a365d]/5 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Saldo Devedor:</span>
                  <span className="font-bold text-[#1a365d]">
                    {formatarMoeda(emprestimoSelecionado.saldoDevedor)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Juros (10% a.m.):</span>
                  <span className="font-bold text-[#d4af37]">{formatarMoeda(jurosCalculado)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-300">
                  <span className="text-gray-600">Total com Juros:</span>
                  <span className="font-bold text-[#1a365d]">
                    {formatarMoeda(emprestimoSelecionado.saldoDevedor + jurosCalculado)}
                  </span>
                </div>
              </div>
            )}

            {/* Campo de Amortização */}
            {formData.tipo === 'juros-amortizacao' && emprestimoSelecionado && (
              <div className="space-y-2">
                <Label htmlFor="amortizacao" className="text-[#1a365d] font-semibold">
                  Valor de Amortização (R$) *
                </Label>
                <Input
                  id="amortizacao"
                  type="number"
                  placeholder="100.00"
                  value={formData.valorAmortizacao}
                  onChange={(e) => setFormData({ ...formData, valorAmortizacao: e.target.value })}
                  className="border-[#d4af37] focus:border-[#1a365d]"
                  step="0.01"
                  min="0"
                  max={emprestimoSelecionado.saldoDevedor}
                />
                <p className="text-xs text-gray-500">
                  Máximo: {formatarMoeda(emprestimoSelecionado.saldoDevedor)}
                </p>
              </div>
            )}

            {/* Resumo do Pagamento */}
            {emprestimoSelecionado && (
              <div className="p-4 bg-[#d4af37]/10 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Resumo do Pagamento:</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Juros:</span>
                    <span className="font-bold">{formatarMoeda(jurosCalculado)}</span>
                  </div>
                  {formData.tipo === 'apenas-juros' && (
                    <div className="flex justify-between">
                      <span>Amortização:</span>
                      <span className="font-bold">R$ 0,00</span>
                    </div>
                  )}
                  {formData.tipo === 'juros-amortizacao' && (
                    <div className="flex justify-between">
                      <span>Amortização:</span>
                      <span className="font-bold">
                        {formatarMoeda(parseFloat(formData.valorAmortizacao) || 0)}
                      </span>
                    </div>
                  )}
                  {formData.tipo === 'quitacao-total' && (
                    <div className="flex justify-between">
                      <span>Amortização:</span>
                      <span className="font-bold">
                        {formatarMoeda(emprestimoSelecionado.saldoDevedor)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-[#d4af37] pt-2 flex justify-between font-bold text-[#1a365d]">
                    <span>Total:</span>
                    <span>
                      {formatarMoeda(
                        jurosCalculado +
                          (formData.tipo === 'apenas-juros'
                            ? 0
                            : formData.tipo === 'juros-amortizacao'
                            ? parseFloat(formData.valorAmortizacao) || 0
                            : emprestimoSelecionado.saldoDevedor)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1 bg-[#1a365d] hover:bg-[#0f1f3a] text-white">
                Registrar Pagamento
              </Button>
              <Button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Histórico de Pagamentos */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[#1a365d]">Histórico de Pagamentos</h2>
        {dados.emprestimos.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">Nenhum pagamento registrado ainda.</p>
          </Card>
        ) : (
          dados.emprestimos.map((emprestimo) => {
            const pagamentos = obterPagamentosEmprestimo(emprestimo.id);
            const cliente = obterClientePorId(emprestimo.clienteId);

            if (pagamentos.length === 0) return null;

            return (
              <Card key={emprestimo.id} className="p-6 shadow-md">
                <h3 className="text-lg font-bold text-[#1a365d] mb-4">
                  {cliente?.nome} - {formatarMoeda(emprestimo.valorPrincipal)}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#1a365d] text-white">
                        <th className="px-4 py-2 text-left">Data</th>
                        <th className="px-4 py-2 text-right">Juros</th>
                        <th className="px-4 py-2 text-right">Amortização</th>
                        <th className="px-4 py-2 text-right">Total</th>
                        <th className="px-4 py-2 text-left">Tipo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagamentos.map((pagamento) => (
                        <tr key={pagamento.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3">{formatarData(pagamento.dataPagamento)}</td>
                          <td className="px-4 py-3 text-right text-[#d4af37] font-semibold">
                            {formatarMoeda(pagamento.valorJuros)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {formatarMoeda(pagamento.valorAmortizacao)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-[#1a365d]">
                            {formatarMoeda(pagamento.valorTotal)}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs bg-[#1a365d]/10 text-[#1a365d] px-2 py-1 rounded">
                              {pagamento.tipo === 'apenas-juros' && 'Apenas Juros'}
                              {pagamento.tipo === 'juros-amortizacao' && 'Juros + Amortização'}
                              {pagamento.tipo === 'quitacao-total' && 'Quitação Total'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
