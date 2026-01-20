import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Lock, LogOut, Home as HomeIcon, Users, FileText, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import Dashboard from '@/pages/Dashboard';
import Clientes from '@/pages/Clientes';
import Emprestimos from '@/pages/Emprestimos';
import Pagamentos from '@/pages/Pagamentos';
import { EmprestimosProvider } from '@/contexts/EmprestimosContext';

/**
 * Design: Corporativo Premium - Azul Marinho + Ouro
 * - Tipografia: Playfair Display (títulos), Inter (corpo)
 * - Cores: Azul Marinho (#1a365d), Ouro (#d4af37)
 * - Layout: Sidebar + Conteúdo Principal
 */

type Pagina = 'dashboard' | 'clientes' | 'emprestimos' | 'pagamentos';

function HomeContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [paginaAtual, setPaginaAtual] = useState<Pagina>('dashboard');

  // Verificar autenticação ao carregar
  useEffect(() => {
    const savedAuth = localStorage.getItem('emprestimos-bm-auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Lidar com login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '151612bm') {
      setIsAuthenticated(true);
      localStorage.setItem('emprestimos-bm-auth', 'true');
      setPassword('');
      toast.success('Bem-vindo ao Empréstimos BM 2026!');
    } else {
      toast.error('Senha incorreta!');
      setPassword('');
    }
  };

  // Lidar com logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('emprestimos-bm-auth');
    setPassword('');
    setPaginaAtual('dashboard');
    toast.success('Desconectado com sucesso!');
  };

  // Tela de Login
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: `url('/images/hero-background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Overlay escuro para melhor legibilidade */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 w-full max-w-md">
          <Card className="border-2 border-[#d4af37] shadow-2xl">
            <div className="p-8">
              {/* Logo/Título */}
              <div className="flex justify-center mb-8">
                <div className="bg-[#1a365d] rounded-lg p-4">
                  <DollarSign className="w-12 h-12 text-[#d4af37]" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-center text-[#1a365d] mb-2">
                Empréstimos BM 2026
              </h1>
              <p className="text-center text-gray-600 mb-8">
                Gerenciador Profissional de Empréstimos
              </p>

              {/* Formulário de Login */}
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#1a365d] font-semibold">
                    Senha de Acesso
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 border-[#d4af37] focus:border-[#1a365d]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#1a365d] hover:bg-[#0f1f3a] text-white font-semibold py-2 rounded-lg transition-all duration-300"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Acessar Sistema
                </Button>
              </form>

              {/* Rodapé */}
              <p className="text-center text-sm text-gray-500 mt-6">
                Sistema seguro de gestão de empréstimos
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Tela Principal (Autenticado)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-screen bg-[#1a365d] text-white shadow-lg flex flex-col overflow-y-auto">
        {/* Logo */}
        <div className="p-6 border-b border-[#2d5a8c]">
          <div className="flex items-center gap-3">
            <div className="bg-[#d4af37] rounded-lg p-2">
              <DollarSign className="w-6 h-6 text-[#1a365d]" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Empréstimos</h2>
              <p className="text-xs text-gray-300">BM 2026</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-6 space-y-2">
          <button
            onClick={() => setPaginaAtual('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              paginaAtual === 'dashboard'
                ? 'bg-[#d4af37] text-[#1a365d] font-semibold'
                : 'hover:bg-[#2d5a8c] text-white'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setPaginaAtual('clientes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              paginaAtual === 'clientes'
                ? 'bg-[#d4af37] text-[#1a365d] font-semibold'
                : 'hover:bg-[#2d5a8c] text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Clientes</span>
          </button>

          <button
            onClick={() => setPaginaAtual('emprestimos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              paginaAtual === 'emprestimos'
                ? 'bg-[#d4af37] text-[#1a365d] font-semibold'
                : 'hover:bg-[#2d5a8c] text-white'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Empréstimos</span>
          </button>

          <button
            onClick={() => setPaginaAtual('pagamentos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              paginaAtual === 'pagamentos'
                ? 'bg-[#d4af37] text-[#1a365d] font-semibold'
                : 'hover:bg-[#2d5a8c] text-white'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span>Pagamentos</span>
          </button>
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-[#2d5a8c]">
          <Button
            onClick={handleLogout}
            className="w-full bg-[#d4af37] hover:bg-[#c4941f] text-[#1a365d] font-semibold"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {paginaAtual === 'dashboard' && <Dashboard />}
          {paginaAtual === 'clientes' && <Clientes />}
          {paginaAtual === 'emprestimos' && <Emprestimos />}
          {paginaAtual === 'pagamentos' && <Pagamentos />}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <EmprestimosProvider>
      <HomeContent />
    </EmprestimosProvider>
  );
}
