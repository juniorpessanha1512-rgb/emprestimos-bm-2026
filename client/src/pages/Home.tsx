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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        {/* Background pattern com dólares */}
        <div className="absolute inset-0 opacity-5">
          <div className="text-8xl font-bold text-gold-500 absolute top-10 left-10">$</div>
          <div className="text-8xl font-bold text-gold-500 absolute bottom-20 right-20">$</div>
          <div className="text-6xl font-bold text-gold-500 absolute top-1/2 left-1/4">$</div>
          <div className="text-6xl font-bold text-gold-500 absolute bottom-1/3 right-1/3">$</div>
        </div>

        <Card className="w-full max-w-md border-2 border-gold-500 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-slate-900 p-4 rounded-lg border-2 border-gold-500">
                <DollarSign className="w-8 h-8 text-gold-500" />
              </div>
            </div>
            <CardTitle className="text-2xl text-slate-900">Empréstimos BM 2026</CardTitle>
            <CardDescription className="text-slate-600">Gerenciador Profissional de Empréstimos</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="senha" className="text-slate-700 font-semibold">
                  Senha de Acesso
                </Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="mt-2 border-2 border-slate-300 focus:border-gold-500"
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2"
              >
                🔐 Acessar Sistema
              </Button>
            </form>
            <p className="text-xs text-slate-500 text-center mt-4">
              Sistema seguro de gestão de empréstimos
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-48 h-screen bg-slate-900 text-white p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-gold-500 p-2 rounded-lg">
            <DollarSign className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h1 className="font-bold text-sm">Empréstimos</h1>
            <p className="text-xs text-slate-400">BM 2026</p>
          </div>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setPaginaAtiva('dashboard')}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              paginaAtiva === 'dashboard'
                ? 'bg-gold-500 text-slate-900 font-bold'
                : 'hover:bg-slate-800'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setPaginaAtiva('clientes')}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              paginaAtiva === 'clientes'
                ? 'bg-gold-500 text-slate-900 font-bold'
                : 'hover:bg-slate-800'
            }`}
          >
            👥 Clientes
          </button>
          <button
            onClick={() => setPaginaAtiva('emprestimos')}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              paginaAtiva === 'emprestimos'
                ? 'bg-gold-500 text-slate-900 font-bold'
                : 'hover:bg-slate-800'
            }`}
          >
            💰 Empréstimos
          </button>
          <button
            onClick={() => setPaginaAtiva('pagamentos')}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              paginaAtiva === 'pagamentos'
                ? 'bg-gold-500 text-slate-900 font-bold'
                : 'hover:bg-slate-800'
            }`}
          >
            ✅ Pagamentos
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="w-full mt-8 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-48 p-8">
        {/* Quick Stats */}
        {paginaAtiva === 'dashboard' && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Emprestado</p>
                    <p className="text-2xl font-bold text-slate-900">
                      R$ {(estatisticas.totalEmprestados / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Recebido</p>
                    <p className="text-2xl font-bold text-slate-900">
                      R$ {(estatisticas.totalRecebido / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Próximos a Vencer</p>
                    <p className="text-2xl font-bold text-slate-900">{estatisticas.emprestimosPorStatus.proximo}</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Vencidos</p>
                    <p className="text-2xl font-bold text-slate-900">{estatisticas.emprestimosPorStatus.vencido}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-500 opacity-50" />
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
