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
import { Plus, Check, X } from 'lucide-react';
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
      toast.error(`Valor não pode ser maior que R$ ${formatarMoeda(emprestimoSelecionado.valorTotal)}`);
      return;
    }

    adicionarPagamento({
      emprestimoId: formData.emprestimoId,
      clienteNome: emprestimoSelecionado.clienteNome,
      valorPago,
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pagamentos</h1>
          <p className="text-slate-600">Registrar pagamentos de empréstimos</p>
        </div>
        <Button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-slate-900 hover:bg-slate-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Pagamento
        </Button>
      </div>

      {/* Formulário */}
      {mostrarFormulario && (
        <Card className="border-2 border-gold-500">
          <CardHeader>
            <CardTitle>Registrar Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emprestimo">Empréstimo *</Label>
                  <Select value={formData.emprestimoId} onValueChange={(value) => setFormData({ ...formData, emprestimoId: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione um empréstimo" />
                    </SelectTrigger>
                    <SelectContent>
                      {dados.emprestimos
                        .filter(e => e.status !== 'pago')
                        .map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.clienteNome} - {formatarMoeda(e.valorTotal)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo de Pagamento *</Label>
                  <Select value={formData.tipo} onValueChange={(value: any) => setFormData({ ...formData, tipo: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="total">Pagamento Total</SelectItem>
                      <SelectItem value="parcial">Pagamento Parcial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {emprestimoSelecionado && (
                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Valor Principal:</span>
                    <span className="font-bold">{formatarMoeda(emprestimoSelecionado.valorPrincipal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Juros ({emprestimoSelecionado.percentualJuros}%):</span>
                    <span className="font-bold text-orange-600">{formatarMoeda(emprestimoSelecionado.valorJuros)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-slate-600 font-bold">Total a Pagar:</span>
                    <span className="font-bold text-lg">{formatarMoeda(emprestimoSelecionado.valorTotal)}</span>
                  </div>
                </div>
              )}

              {formData.tipo === 'parcial' && (
                <div>
                  <Label htmlFor="valor">Valor do Pagamento (R$) *</Label>
                  <Input
                    id="valor"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={formData.valorPago}
                    onChange={(e) => setFormData({ ...formData, valorPago: e.target.value })}
                    className="mt-2"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="bg-slate-900 hover:bg-slate-800">
                  <Check className="w-4 h-4 mr-2" />
                  Registrar Pagamento
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMostrarFormulario(false)}
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
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Histórico de Pagamentos</h2>
        {pagamentosRegistrados.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-slate-600">
              Nenhum pagamento registrado ainda
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pagamentosRegistrados.map((pagamento) => (
              <Card key={pagamento.id} className="hover:shadow-md transition">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{pagamento.clienteNome}</p>
                      <p className="text-sm text-slate-600">{formatarData(pagamento.dataPagamento)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">{formatarMoeda(pagamento.valorPago)}</p>
                      <p className="text-xs text-slate-600">
                        {pagamento.tipo === 'total' ? '✓ Quitado' : '◐ Parcial'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
