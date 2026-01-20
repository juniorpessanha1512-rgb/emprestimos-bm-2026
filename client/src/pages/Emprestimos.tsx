import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { formatarMoeda, formatarData, obterLabelPeriodo } from '@/lib/utils-emprestimos';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

export default function Emprestimos() {
  const { dados, adicionarEmprestimo, deletarEmprestimo } = useEmprestimos();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    clienteId: '',
    valorPrincipal: '',
    percentualJuros: '',
    periodoTipo: 'mes' as 'semana' | 'quinzena' | 'mes',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clienteId || !formData.valorPrincipal || !formData.percentualJuros) {
      toast.error('Preencha todos os campos!');
      return;
    }

    const cliente = dados.clientes.find(c => c.id === formData.clienteId);
    if (!cliente) {
      toast.error('Cliente não encontrado!');
      return;
    }

    adicionarEmprestimo({
      clienteId: formData.clienteId,
      clienteNome: cliente.nome,
      valorPrincipal: parseFloat(formData.valorPrincipal),
      percentualJuros: parseFloat(formData.percentualJuros),
      periodoTipo: formData.periodoTipo,
    });

    setFormData({ clienteId: '', valorPrincipal: '', percentualJuros: '', periodoTipo: 'mes' });
    setMostrarFormulario(false);
    toast.success('Empréstimo criado com sucesso!');
  };

  const toggleExpanded = (emprestimoId: string) => {
    const novo = new Set(expandidos);
    if (novo.has(emprestimoId)) {
      novo.delete(emprestimoId);
    } else {
      novo.add(emprestimoId);
    }
    setExpandidos(novo);
  };

  const handleDelete = (emprestimoId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este empréstimo?')) {
      deletarEmprestimo(emprestimoId);
      toast.success('Empréstimo deletado!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago':
        return 'bg-green-100 text-green-800';
      case 'vencido':
        return 'bg-red-100 text-red-800';
      case 'proximo':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pago':
        return '✓ Quitado';
      case 'vencido':
        return '⚠ Vencido';
      case 'proximo':
        return '⏰ Próximo a Vencer';
      default:
        return '◐ Pendente';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Empréstimos</h1>
          <p className="text-slate-600">Gerenciar empréstimos com juros fixos</p>
        </div>
        <Button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-slate-900 hover:bg-slate-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Empréstimo
        </Button>
      </div>

      {/* Formulário */}
      {mostrarFormulario && (
        <Card className="border-2 border-gold-500">
          <CardHeader>
            <CardTitle>Criar Empréstimo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cliente">Cliente *</Label>
                  <Select value={formData.clienteId} onValueChange={(value) => setFormData({ ...formData, clienteId: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {dados.clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="valor">Valor Principal (R$) *</Label>
                  <Input
                    id="valor"
                    type="number"
                    placeholder="1000.00"
                    step="0.01"
                    value={formData.valorPrincipal}
                    onChange={(e) => setFormData({ ...formData, valorPrincipal: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="juros">Taxa de Juros (%) *</Label>
                  <Input
                    id="juros"
                    type="number"
                    placeholder="30"
                    step="0.01"
                    value={formData.percentualJuros}
                    onChange={(e) => setFormData({ ...formData, percentualJuros: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="periodo">Período de Vencimento *</Label>
                  <Select value={formData.periodoTipo} onValueChange={(value: any) => setFormData({ ...formData, periodoTipo: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semana">1 Semana</SelectItem>
                      <SelectItem value="quinzena">15 Dias</SelectItem>
                      <SelectItem value="mes">1 Mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.valorPrincipal && formData.percentualJuros && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">Valor Principal:</span>
                    <span className="font-bold">{formatarMoeda(parseFloat(formData.valorPrincipal) || 0)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">Juros ({formData.percentualJuros}%):</span>
                    <span className="font-bold text-orange-600">
                      {formatarMoeda((parseFloat(formData.valorPrincipal) * parseFloat(formData.percentualJuros)) / 100 || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-slate-600 font-bold">Total a Receber:</span>
                    <span className="font-bold text-lg">
                      {formatarMoeda(
                        parseFloat(formData.valorPrincipal) +
                        (parseFloat(formData.valorPrincipal) * parseFloat(formData.percentualJuros)) / 100 ||
                        0
                      )}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="bg-slate-900 hover:bg-slate-800">
                  Criar Empréstimo
                </Button>
                <Button type="button" variant="outline" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Empréstimos */}
      <div>
        {dados.emprestimos.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-slate-600">
              Nenhum empréstimo cadastrado ainda
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {dados.emprestimos.map((emprestimo) => (
              <Card key={emprestimo.id} className="hover:shadow-md transition">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-bold text-slate-900">{emprestimo.clienteNome}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(emprestimo.status)}`}>
                          {getStatusLabel(emprestimo.status)}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Principal</p>
                          <p className="font-bold">{formatarMoeda(emprestimo.valorPrincipal)}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Juros ({emprestimo.percentualJuros}%)</p>
                          <p className="font-bold text-orange-600">{formatarMoeda(emprestimo.valorJuros)}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Total</p>
                          <p className="font-bold text-lg">{formatarMoeda(emprestimo.valorTotal)}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Vencimento</p>
                          <p className="font-bold">{formatarData(emprestimo.dataVencimento)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(emprestimo.id)}
                      >
                        {expandidos.has(emprestimo.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(emprestimo.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {expandidos.has(emprestimo.id) && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Data do Empréstimo</p>
                          <p className="font-bold">{formatarData(emprestimo.dataEmprestimo)}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Período</p>
                          <p className="font-bold">{obterLabelPeriodo(emprestimo.periodoTipo)}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Dias para Vencer</p>
                          <p className="font-bold">{emprestimo.diasParaVencer} dia(s)</p>
                        </div>
                        {emprestimo.valorPago && (
                          <div>
                            <p className="text-slate-600">Valor Pago</p>
                            <p className="font-bold text-green-600">{formatarMoeda(emprestimo.valorPago)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
