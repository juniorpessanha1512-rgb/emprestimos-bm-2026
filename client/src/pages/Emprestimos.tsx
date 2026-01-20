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
import { formatarMoeda, formatarData } from '@/lib/utils-emprestimos';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

export default function Emprestimos() {
  const {
    dados,
    adicionarEmprestimo,
    deletarEmprestimo,
    obterClientePorId,
    obterParcelasEmprestimo,
  } = useEmprestimos();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    clienteId: '',
    valorPrincipal: '',
    taxaJuros: '',
    periodo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clienteId || !formData.valorPrincipal || !formData.taxaJuros || !formData.periodo) {
      toast.error('Preencha todos os campos!');
      return;
    }

    adicionarEmprestimo(
      formData.clienteId,
      parseFloat(formData.valorPrincipal),
      parseFloat(formData.taxaJuros),
      parseInt(formData.periodo)
    );

    setFormData({
      clienteId: '',
      valorPrincipal: '',
      taxaJuros: '',
      periodo: '',
    });
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

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#1a365d] mb-2">Empréstimos</h1>
          <p className="text-gray-600">Gerenciar empréstimos e cronograma de parcelas</p>
        </div>
        <Button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-[#1a365d] hover:bg-[#0f1f3a] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Empréstimo
        </Button>
      </div>

      {/* Formulário */}
      {mostrarFormulario && (
        <Card className="p-6 border-2 border-[#d4af37] shadow-md">
          <h2 className="text-2xl font-bold text-[#1a365d] mb-6">Criar Empréstimo</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cliente" className="text-[#1a365d] font-semibold">
                  Cliente *
                </Label>
                <Select value={formData.clienteId} onValueChange={(value) => setFormData({ ...formData, clienteId: value })}>
                  <SelectTrigger className="border-[#d4af37] focus:border-[#1a365d]">
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

              <div className="space-y-2">
                <Label htmlFor="valor" className="text-[#1a365d] font-semibold">
                  Valor Principal (R$) *
                </Label>
                <Input
                  id="valor"
                  type="number"
                  placeholder="1000.00"
                  value={formData.valorPrincipal}
                  onChange={(e) => setFormData({ ...formData, valorPrincipal: e.target.value })}
                  className="border-[#d4af37] focus:border-[#1a365d]"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxa" className="text-[#1a365d] font-semibold">
                  Taxa de Juros (% ao mês) *
                </Label>
                <Input
                  id="taxa"
                  type="number"
                  placeholder="5"
                  value={formData.taxaJuros}
                  onChange={(e) => setFormData({ ...formData, taxaJuros: e.target.value })}
                  className="border-[#d4af37] focus:border-[#1a365d]"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodo" className="text-[#1a365d] font-semibold">
                  Período (Meses) *
                </Label>
                <Input
                  id="periodo"
                  type="number"
                  placeholder="12"
                  value={formData.periodo}
                  onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                  className="border-[#d4af37] focus:border-[#1a365d]"
                  step="1"
                  min="1"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1 bg-[#1a365d] hover:bg-[#0f1f3a] text-white">
                Criar Empréstimo
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

      {/* Lista de Empréstimos */}
      <div className="space-y-4">
        {dados.emprestimos.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500 text-lg">Nenhum empréstimo cadastrado ainda.</p>
          </Card>
        ) : (
          dados.emprestimos.map((emprestimo) => {
            const cliente = obterClientePorId(emprestimo.clienteId);
            const parcelas = obterParcelasEmprestimo(emprestimo.id);
            const isExpanded = expandidos.has(emprestimo.id);

            return (
              <Card key={emprestimo.id} className="shadow-md hover:shadow-lg transition-shadow">
                <div
                  className="p-6 border-l-4 border-[#d4af37] cursor-pointer"
                  onClick={() => toggleExpanded(emprestimo.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#1a365d]">{cliente?.nome}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-gray-600">Valor Principal</p>
                          <p className="font-semibold text-[#1a365d]">
                            {formatarMoeda(emprestimo.valorPrincipal)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Taxa</p>
                          <p className="font-semibold text-[#1a365d]">{emprestimo.taxaJuros}% a.m.</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Saldo Devedor</p>
                          <p className="font-semibold text-orange-600">
                            {formatarMoeda(emprestimo.saldoDevedor)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Pago</p>
                          <p className="font-semibold text-[#d4af37]">
                            {formatarMoeda(emprestimo.totalPago)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Status</p>
                          <p
                            className={`font-semibold ${
                              emprestimo.status === 'quitado'
                                ? 'text-green-600'
                                : emprestimo.status === 'atrasado'
                                ? 'text-red-600'
                                : 'text-blue-600'
                            }`}
                          >
                            {emprestimo.status === 'ativo' && 'Ativo'}
                            {emprestimo.status === 'quitado' && 'Quitado'}
                            {emprestimo.status === 'atrasado' && 'Atrasado'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-[#1a365d]" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-[#1a365d]" />
                      )}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletarEmprestimo(emprestimo.id);
                          toast.success('Empréstimo deletado!');
                        }}
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Cronograma de Parcelas */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-bold text-[#1a365d] mb-4">Cronograma de Parcelas</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-[#1a365d] text-white">
                              <th className="px-4 py-2 text-left">Parcela</th>
                              <th className="px-4 py-2 text-left">Vencimento</th>
                              <th className="px-4 py-2 text-right">Principal</th>
                              <th className="px-4 py-2 text-right">Juros</th>
                              <th className="px-4 py-2 text-right">Total</th>
                              <th className="px-4 py-2 text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {parcelas.map((parcela) => (
                              <tr key={parcela.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-3 font-semibold">{parcela.numeroParcela}</td>
                                <td className="px-4 py-3">{formatarData(parcela.dataVencimento)}</td>
                                <td className="px-4 py-3 text-right">
                                  {formatarMoeda(parcela.valorPrincipal)}
                                </td>
                                <td className="px-4 py-3 text-right text-[#d4af37] font-semibold">
                                  {formatarMoeda(parcela.jurosCalculado)}
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-[#1a365d]">
                                  {formatarMoeda(parcela.valorTotal)}
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      parcela.status === 'pago'
                                        ? 'bg-green-100 text-green-700'
                                        : parcela.status === 'atrasado'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}
                                  >
                                    {parcela.status === 'pago' && 'Pago'}
                                    {parcela.status === 'pendente' && 'Pendente'}
                                    {parcela.status === 'atrasado' && 'Atrasado'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
