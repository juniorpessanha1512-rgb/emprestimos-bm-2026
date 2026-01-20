import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { formatarMoeda, formatarData } from '@/lib/utils-emprestimos';
import { Plus, Check, X, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

export default function Pagamentos() {
  const { dados, adicionarPagamento } = useEmprestimos();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    emprestimoId: '',
    tipo: 'total' as 'total' | 'parcial',
    valorPago: '',
  });

  const emprestimoSelecionado = dados.emprestimos.find((e) => e.id === formData.emprestimoId);

  // Calcular breakdown do pagamento
  const calcularBreakdown = () => {
    if (!emprestimoSelecionado) return null;

    const valorPago = formData.tipo === 'total' 
      ? emprestimoSelecionado.valorTotal 
      : parseFloat(formData.valorPago) || 0;

    const jurosAtuais = emprestimoSelecionado.valorJurosAtual;
    let jurosAbatidos = 0;
    let amortizacaoPrincipal = 0;

    if (valorPago >= jurosAtuais) {
      jurosAbatidos = jurosAtuais;
      amortizacaoPrincipal = valorPago - jurosAtuais;
    } else {
      jurosAbatidos = valorPago;
      amortizacaoPrincipal = 0;
    }

    const novoSaldoDevedor = Math.max(0, emprestimoSelecionado.saldoDevedor - amortizacaoPrincipal);

    return {
      jurosAbatidos,
      amortizacaoPrincipal,
      novoSaldoDevedor,
      valorPago,
    };
  };

  const breakdown = calcularBreakdown();

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

    const valorPago = formData.tipo === 'total' 
      ? emprestimoSelecionado.valorTotal 
      : parseFloat(formData.valorPago);

    if (isNaN(valorPago) || valorPago <= 0) {
      toast.error('Valor inválido!');
      return;
    }

    if (formData.tipo === 'parcial' && valorPago > emprestimoSelecionado.valorTotal) {
      toast.error(`Valor não pode ser maior que ${formatarMoeda(emprestimoSelecionado.valorTotal)}`);
      return;
    }

    const bd = calcularBreakdown();
    if (!bd) return;

    adicionarPagamento({
      emprestimoId: formData.emprestimoId,
      clienteNome: emprestimoSelecionado.clienteNome,
      valorPago,
      jurosAbatidos: bd.jurosAbatidos,
      amortizacaoPrincipal: bd.amortizacaoPrincipal,
      saldoDevedorApos: bd.novoSaldoDevedor,
      dataPagamento: new Date().toISOString().split('T')[0],
      tipo: formData.tipo,
    });

    toast.success('Pagamento registrado com sucesso!');
    setFormData({ emprestimoId: '', tipo: 'total', valorPago: '' });
    setMostrarFormulario(false);
  };

  const pagamentosRegistrados = dados.pagamentos.sort(
    (a, b) => new Date(b.dataPagamento).getTime() - new Date(a.dataPagamento).getTime()
  );

  const emprestimosPendentes = dados.emprestimos.filter(e => e.status !== 'pago');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pagamentos</h1>
          <p className="text-slate-600">Registrar pagamentos de empréstimos</p>
        </div>
        <Button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Pagamento
        </Button>
      </div>

      {mostrarFormulario && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100">
          <CardHeader>
            <CardTitle>Registrar Novo Pagamento</CardTitle>
            <CardDescription>Abate juros primeiro, depois desconta do principal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-slate-700 font-semibold">Selecione o Empréstimo</Label>
                <Select value={formData.emprestimoId} onValueChange={(value) => setFormData({ ...formData, emprestimoId: value })}>
                  <SelectTrigger className="mt-2 border-2 border-slate-300">
                    <SelectValue placeholder="Escolha um empréstimo" />
                  </SelectTrigger>
                  <SelectContent>
                    {emprestimosPendentes.map(e => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.clienteNome} - {formatarMoeda(e.saldoDevedor)} (Saldo)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {emprestimoSelecionado && (
                <>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg border border-slate-200">
                    <div>
                      <p className="text-xs text-slate-600 font-medium">Saldo Devedor</p>
                      <p className="text-xl font-bold text-slate-900">{formatarMoeda(emprestimoSelecionado.saldoDevedor)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">Juros Atuais</p>
                      <p className="text-xl font-bold text-amber-600">{formatarMoeda(emprestimoSelecionado.valorJurosAtual)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">Total a Pagar</p>
                      <p className="text-xl font-bold text-slate-900">{formatarMoeda(emprestimoSelecionado.valorTotal)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">Juros Cobrados</p>
                      <p className="text-xl font-bold text-green-600">{formatarMoeda(emprestimoSelecionado.valorJurosTotal)}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-700 font-semibold">Tipo de Pagamento</Label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tipo"
                          value="total"
                          checked={formData.tipo === 'total'}
                          onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'total' | 'parcial' })}
                          className="w-4 h-4"
                        />
                        <span className="text-slate-700 font-medium">Pagamento Total</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tipo"
                          value="parcial"
                          checked={formData.tipo === 'parcial'}
                          onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'total' | 'parcial' })}
                          className="w-4 h-4"
                        />
                        <span className="text-slate-700 font-medium">Pagamento Parcial</span>
                      </label>
                    </div>
                  </div>

                  {formData.tipo === 'parcial' && (
                    <div>
                      <Label className="text-slate-700 font-semibold">Valor a Pagar</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        value={formData.valorPago}
                        onChange={(e) => setFormData({ ...formData, valorPago: e.target.value })}
                        className="mt-2 border-2 border-slate-300 focus:border-amber-500"
                      />
                    </div>
                  )}

                  {breakdown && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-blue-600" />
                        Detalhamento do Pagamento
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-700">Valor a Pagar:</span>
                          <span className="font-bold text-slate-900">{formatarMoeda(breakdown.valorPago)}</span>
                        </div>
                        <div className="flex justify-between border-t border-blue-200 pt-2">
                          <span className="text-slate-700">Abater Juros:</span>
                          <span className="font-bold text-amber-600">{formatarMoeda(breakdown.jurosAbatidos)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-700">Amortizar Principal:</span>
                          <span className="font-bold text-green-600">{formatarMoeda(breakdown.amortizacaoPrincipal)}</span>
                        </div>
                        <div className="flex justify-between border-t border-blue-200 pt-2 bg-blue-100 p-2 rounded">
                          <span className="text-slate-900 font-bold">Novo Saldo Devedor:</span>
                          <span className="font-bold text-slate-900">{formatarMoeda(breakdown.novoSaldoDevedor)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-3">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                  <Check className="w-4 h-4 mr-2" />
                  Registrar Pagamento
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMostrarFormulario(false)}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Pagamentos */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>{pagamentosRegistrados.length} pagamento(s) registrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {pagamentosRegistrados.length === 0 ? (
            <p className="text-slate-600 text-center py-8">Nenhum pagamento registrado ainda</p>
          ) : (
            <div className="space-y-3">
              {pagamentosRegistrados.map(p => (
                <div key={p.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-slate-900">{p.clienteNome}</p>
                      <p className="text-xs text-slate-600">{formatarData(p.dataPagamento)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{formatarMoeda(p.valorPago)}</p>
                      <p className="text-xs text-slate-600 uppercase">{p.tipo === 'total' ? 'Total' : 'Parcial'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <p className="text-slate-600">Juros Abatido</p>
                      <p className="font-bold text-amber-600">{formatarMoeda(p.jurosAbatidos)}</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <p className="text-slate-600">Principal</p>
                      <p className="font-bold text-green-600">{formatarMoeda(p.amortizacaoPrincipal)}</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <p className="text-slate-600">Saldo Após</p>
                      <p className="font-bold text-slate-900">{formatarMoeda(p.saldoDevedorApos)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
