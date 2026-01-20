import { Card } from '@/components/ui/card';
import { useEmprestimos } from '@/contexts/EmprestimosContext';
import { formatarMoeda } from '@/lib/utils-emprestimos';
import { DollarSign, Users, TrendingUp, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { calcularEstatisticas } = useEmprestimos();
  const stats = calcularEstatisticas();

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-4xl font-bold text-[#1a365d] mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu negócio de empréstimos</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Emprestado */}
        <Card className="p-6 border-l-4 border-[#1a365d] shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Emprestado</p>
              <p className="text-3xl font-bold text-[#1a365d] mt-2">
                {formatarMoeda(stats.totalEmprestados)}
              </p>
            </div>
            <div className="bg-[#1a365d]/10 rounded-lg p-3">
              <DollarSign className="w-8 h-8 text-[#1a365d]" />
            </div>
          </div>
        </Card>

        {/* Total Recebido */}
        <Card className="p-6 border-l-4 border-[#d4af37] shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Recebido</p>
              <p className="text-3xl font-bold text-[#d4af37] mt-2">
                {formatarMoeda(stats.totalRecebido)}
              </p>
            </div>
            <div className="bg-[#d4af37]/10 rounded-lg p-3">
              <TrendingUp className="w-8 h-8 text-[#d4af37]" />
            </div>
          </div>
        </Card>

        {/* Total em Aberto */}
        <Card className="p-6 border-l-4 border-orange-500 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Em Aberto</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {formatarMoeda(stats.totalEmAberto)}
              </p>
            </div>
            <div className="bg-orange-100 rounded-lg p-3">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </Card>

        {/* Total Clientes */}
        <Card className="p-6 border-l-4 border-green-600 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Clientes</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalClientes}</p>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Status de Empréstimos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Empréstimos por Status */}
        <Card className="p-6 shadow-md">
          <h2 className="text-2xl font-bold text-[#1a365d] mb-6">Empréstimos por Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="font-semibold text-[#1a365d]">Ativos</span>
              <span className="text-2xl font-bold text-[#1a365d]">
                {stats.emprestimosPorStatus.ativo}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="font-semibold text-green-700">Quitados</span>
              <span className="text-2xl font-bold text-green-700">
                {stats.emprestimosPorStatus.quitado}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <span className="font-semibold text-red-700">Atrasados</span>
              <span className="text-2xl font-bold text-red-700">
                {stats.emprestimosPorStatus.atrasado}
              </span>
            </div>
          </div>
        </Card>

        {/* Resumo Financeiro */}
        <Card className="p-6 shadow-md">
          <h2 className="text-2xl font-bold text-[#1a365d] mb-6">Resumo Financeiro</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <span className="text-gray-600">Total Emprestado:</span>
              <span className="font-bold text-[#1a365d]">
                {formatarMoeda(stats.totalEmprestados)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <span className="text-gray-600">Total Recebido:</span>
              <span className="font-bold text-[#d4af37]">
                {formatarMoeda(stats.totalRecebido)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <span className="text-gray-600">Ainda a Receber:</span>
              <span className="font-bold text-orange-600">
                {formatarMoeda(stats.totalEmAberto)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-[#1a365d] rounded-lg">
              <span className="text-white">Taxa de Retorno:</span>
              <span className="font-bold text-[#d4af37]">
                {stats.totalEmprestados > 0
                  ? ((stats.totalRecebido / stats.totalEmprestados) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Alertas */}
      {stats.totalAtrasado > 0 && (
        <Card className="p-6 border-l-4 border-red-600 bg-red-50 shadow-md">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-red-700 text-lg">Atenção: Pagamentos Atrasados</h3>
              <p className="text-red-600 mt-2">
                Você tem {formatarMoeda(stats.totalAtrasado)} em pagamentos atrasados.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
