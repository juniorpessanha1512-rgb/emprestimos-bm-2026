import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmprestimos } from '@/contexts/EmprestimosContext';
import { formatarMoeda, formatarData, calcularJurosPrevistosDoMes, calcularJurosRecebidosDoMes } from '@/lib/utils-emprestimos';
import { AlertCircle, Clock, CheckCircle2, Zap } from 'lucide-react';

export default function Dashboard() {
  const { dados, estatisticas } = useEmprestimos();

  // Separar empréstimos por status
  const vencidos = dados.emprestimos.filter(e => e.status === 'vencido');
  const proximosAVencer = dados.emprestimos.filter(e => e.status === 'proximo');
  const emDia = dados.emprestimos.filter(e => e.status === 'pendente');

  // Calcular juros do mês
  const jurosPrevistosDoMes = calcularJurosPrevistosDoMes(dados.emprestimos);
  const jurosRecebidosDoMes = calcularJurosRecebidosDoMes(dados.emprestimos, dados.pagamentos);

  return (
    <div className="space-y-8">
      {/* Estatísticas Principais com Juros do Mês */}
      <div className="grid grid-cols-5 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition bg-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 font-medium">Total Emprestado</p>
              <p className="text-2xl font-bold text-slate-900 mt-3">{formatarMoeda(estatisticas.totalEmprestados)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition bg-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 font-medium">Total Recebido</p>
              <p className="text-2xl font-bold text-green-600 mt-3">{formatarMoeda(estatisticas.totalRecebido)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition bg-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 font-medium">Em Aberto</p>
              <p className="text-2xl font-bold text-orange-600 mt-3">{formatarMoeda(estatisticas.totalEmAberto)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Zap className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-sm text-amber-700 font-medium">Juros Previstos (Mês)</p>
              <p className="text-2xl font-bold text-amber-600 mt-3">{formatarMoeda(jurosPrevistosDoMes)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-green-700 font-medium">Juros Recebidos (Mês)</p>
              <p className="text-2xl font-bold text-green-600 mt-3">{formatarMoeda(jurosRecebidosDoMes)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Vencimentos */}
      <div className="grid grid-cols-3 gap-6">
        {/* Vencidos */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition overflow-hidden">
          <div className="h-1 bg-red-500"></div>
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
                    <p className="text-sm font-bold text-red-600 mt-2">{formatarMoeda(e.valorTotal)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Próximos a Vencer */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition overflow-hidden">
          <div className="h-1 bg-amber-500"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
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
                  <div key={e.id} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="font-bold text-sm text-slate-900">{e.clienteNome}</p>
                    <p className="text-xs text-slate-600">Vencimento: {formatarData(e.dataVencimento)}</p>
                    <p className="text-xs text-amber-600 font-bold">Em {e.diasParaVencer} dia(s)</p>
                    <p className="text-sm font-bold text-amber-600 mt-2">{formatarMoeda(e.valorTotal)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Em Dia */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition overflow-hidden">
          <div className="h-1 bg-blue-500"></div>
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
                    <p className="text-sm font-bold text-blue-600 mt-2">{formatarMoeda(e.valorTotal)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Status */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Resumo de Empréstimos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-3xl font-bold text-slate-900">{estatisticas.emprestimosPorStatus.pendente}</p>
              <p className="text-sm text-slate-600 mt-2 font-medium">Pendentes</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-3xl font-bold text-green-600">{estatisticas.emprestimosPorStatus.pago}</p>
              <p className="text-sm text-slate-600 mt-2 font-medium">Quitados</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-3xl font-bold text-amber-600">{estatisticas.emprestimosPorStatus.proximo}</p>
              <p className="text-sm text-slate-600 mt-2 font-medium">Próximos a Vencer</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-3xl font-bold text-red-600">{estatisticas.emprestimosPorStatus.vencido}</p>
              <p className="text-sm text-slate-600 mt-2 font-medium">Vencidos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
