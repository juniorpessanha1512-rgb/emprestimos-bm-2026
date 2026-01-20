import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, LogOut, DollarSign, Calendar, TrendingUp, Clock } from 'lucide-react';
import { useEmprestimos } from '@/contexts/EmprestimosContext';
import Dashboard from './Dashboard';
import Clientes from './Clientes';
import Emprestimos from './Emprestimos';
import Pagamentos from './Pagamentos';

export default function Home() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [paginaAtiva, setPaginaAtiva] = useState<'dashboard' | 'clientes' | 'emprestimos' | 'pagamentos'>('dashboard');
  const { estatisticas } = useEmprestimos();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (senha === '151612bm') {
      setAutenticado(true);
      setSenha('');
    } else {
      alert('Senha incorreta!');
      setSenha('');
    }
  };

  const handleLogout = () => {
    setAutenticado(false);
    setSenha('');
    setPaginaAtiva('dashboard');
  };

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-amber-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <Card className="w-full max-w-md border-0 shadow-2xl relative z-10 bg-white">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-xl border border-amber-500/30 shadow-lg">
                <DollarSign className="w-8 h-8 text-amber-500" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Empréstimos BM 2026
            </CardTitle>
            <CardDescription className="text-slate-600 mt-2 font-medium">
              Gerenciador Profissional de Empréstimos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="senha" className="text-slate-700 font-semibold text-sm">
                  Senha de Acesso
                </Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="mt-2 border-2 border-slate-200 focus:border-amber-500 focus:ring-amber-500 bg-slate-50 text-slate-900 placeholder-slate-400"
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg"
              >
                🔐 Acessar Sistema
              </Button>
            </form>
            <p className="text-xs text-slate-500 text-center mt-6 font-medium">
              Sistema seguro e criptografado de gestão de empréstimos
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6 shadow-2xl border-r border-amber-500/10">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-lg shadow-lg">
            <DollarSign className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Empréstimos</h1>
            <p className="text-xs text-slate-400">BM 2026</p>
          </div>
        </div>

        <nav className="space-y-2 mb-8">
          <button
            onClick={() => setPaginaAtiva('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
              paginaAtiva === 'dashboard'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 shadow-lg'
                : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setPaginaAtiva('clientes')}
            className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
              paginaAtiva === 'clientes'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 shadow-lg'
                : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            👥 Clientes
          </button>
          <button
            onClick={() => setPaginaAtiva('emprestimos')}
            className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
              paginaAtiva === 'emprestimos'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 shadow-lg'
                : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            💰 Empréstimos
          </button>
          <button
            onClick={() => setPaginaAtiva('pagamentos')}
            className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
              paginaAtiva === 'pagamentos'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 shadow-lg'
                : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            ✅ Pagamentos
          </button>
        </nav>

        <div className="border-t border-slate-700 pt-6">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition flex items-center gap-2 font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Quick Stats */}
        {paginaAtiva === 'dashboard' && (
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Total Emprestado</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">
                      R$ {(estatisticas.totalEmprestados / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Total Recebido</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      R$ {(estatisticas.totalRecebido / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Próximos a Vencer</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{estatisticas.emprestimosPorStatus.proximo}</p>
                  </div>
                  <div className="bg-amber-100 p-4 rounded-lg">
                    <Clock className="w-8 h-8 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Vencidos</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{estatisticas.emprestimosPorStatus.vencido}</p>
                  </div>
                  <div className="bg-red-100 p-4 rounded-lg">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Conteúdo das páginas */}
        {paginaAtiva === 'dashboard' && <Dashboard />}
        {paginaAtiva === 'clientes' && <Clientes />}
        {paginaAtiva === 'emprestimos' && <Emprestimos />}
        {paginaAtiva === 'pagamentos' && <Pagamentos />}
      </div>
    </div>
  );
}
