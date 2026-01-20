import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmprestimos } from '@/contexts/EmprestimosContext';
import { formatarMoeda, formatarData } from '@/lib/utils-emprestimos';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const { dados, estatisticas } = useEmprestimos();

  // Separar empréstimos por status
  const vencidos = dados.emprestimos.filter(e => e.status === 'vencido');
  const proximosAVencer = dados.emprestimos.filter(e => e.status === 'proximo');
  const emDia = dados.emprestimos.filter(e => e.status === 'pendente');

  return (
    <div className="space-y-8">
      {/* Estatísticas Principais */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">Total Emprestado</p>
              <p className="text-3xl font-bold text-slate-900">{formatarMoeda(estatisticas.totalEmprestados)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">Total Recebido</p>
              <p className="text-3xl font-bold text-green-600">{formatarMoeda(estatisticas.totalRecebido)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">Em Aberto</p>
              <p className="text-3xl font-bold text-orange-600">{formatarMoeda(estatisticas.totalEmAberto)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">Total Clientes</p>
              <p className="text-3xl font-bold text-blue-600">{estatisticas.totalClientes}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Vencimentos */}
      <div className="grid grid-cols-3 gap-6">
        {/* Vencidos */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Vencidos
            </CardTitle>
            <CardDescription>{vencidos.length} empréstimo(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {vencidos.length === 0 ? (
              <p className="text-sm text-slate-600">Nenhum empréstimo vencido</p>
            ) : (
              <div className="space-y-3">
                {vencidos.map(e => (
                  <div key={e.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="font-bold text-sm text-slate-900">{e.clienteNome}</p>
                    <p className="text-xs text-slate-600">Vencimento: {formatarData(e.dataVencimento)}</p>
                    <p className="text-sm font-bold text-red-600 mt-1">{formatarMoeda(e.valorTotal)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Próximos a Vencer */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Clock className="w-5 h-5" />
              Próximos a Vencer
            </CardTitle>
            <CardDescription>{proximosAVencer.length} empréstimo(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {proximosAVencer.length === 0 ? (
              <p className="text-sm text-slate-600">Nenhum empréstimo próximo a vencer</p>
            ) : (
              <div className="space-y-3">
                {proximosAVencer.map(e => (
                  <div key={e.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="font-bold text-sm text-slate-900">{e.clienteNome}</p>
                    <p className="text-xs text-slate-600">Vencimento: {formatarData(e.dataVencimento)}</p>
                    <p className="text-xs text-orange-600 font-bold">Em {e.diasParaVencer} dia(s)</p>
                    <p className="text-sm font-bold text-orange-600 mt-1">{formatarMoeda(e.valorTotal)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Em Dia */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <CheckCircle2 className="w-5 h-5" />
              Em Dia
            </CardTitle>
            <CardDescription>{emDia.length} empréstimo(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {emDia.length === 0 ? (
              <p className="text-sm text-slate-600">Nenhum empréstimo em dia</p>
            ) : (
              <div className="space-y-3">
                {emDia.map(e => (
                  <div key={e.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="font-bold text-sm text-slate-900">{e.clienteNome}</p>
                    <p className="text-xs text-slate-600">Vencimento: {formatarData(e.dataVencimento)}</p>
                    <p className="text-xs text-blue-600 font-bold">Em {e.diasParaVencer} dia(s)</p>
                    <p className="text-sm font-bold text-blue-600 mt-1">{formatarMoeda(e.valorTotal)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Status */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Empréstimos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">{estatisticas.emprestimosPorStatus.pendente}</p>
              <p className="text-sm text-slate-600">Pendentes</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{estatisticas.emprestimosPorStatus.pago}</p>
              <p className="text-sm text-slate-600">Quitados</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{estatisticas.emprestimosPorStatus.proximo}</p>
              <p className="text-sm text-slate-600">Próximos a Vencer</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{estatisticas.emprestimosPorStatus.vencido}</p>
              <p className="text-sm text-slate-600">Vencidos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
