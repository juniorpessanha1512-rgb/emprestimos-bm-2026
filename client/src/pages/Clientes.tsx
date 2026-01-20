import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEmprestimos } from '@/contexts/EmprestimosContext';
import { Trash2, Plus, User } from 'lucide-react';
import { toast } from 'sonner';

export default function Clientes() {
  const { dados, adicionarCliente, deletarCliente, obterEmprestimosCliente } = useEmprestimos();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    endereco: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.cpf || !formData.telefone || !formData.email) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }

    adicionarCliente(
      formData.nome,
      formData.cpf,
      formData.telefone,
      formData.email,
      formData.endereco
    );

    setFormData({
      nome: '',
      cpf: '',
      telefone: '',
      email: '',
      endereco: '',
    });
    setMostrarFormulario(false);
    toast.success('Cliente adicionado com sucesso!');
  };

  const handleDelete = (clienteId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      deletarCliente(clienteId);
      toast.success('Cliente deletado com sucesso!');
    }
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#1a365d] mb-2">Clientes</h1>
          <p className="text-gray-600">Gerenciar clientes e seus empréstimos</p>
        </div>
        <Button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-[#1a365d] hover:bg-[#0f1f3a] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Formulário */}
      {mostrarFormulario && (
        <Card className="p-6 border-2 border-[#d4af37] shadow-md">
          <h2 className="text-2xl font-bold text-[#1a365d] mb-6">Adicionar Cliente</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-[#1a365d] font-semibold">
                  Nome *
                </Label>
                <Input
                  id="nome"
                  placeholder="Nome completo"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="border-[#d4af37] focus:border-[#1a365d]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-[#1a365d] font-semibold">
                  CPF *
                </Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="border-[#d4af37] focus:border-[#1a365d]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-[#1a365d] font-semibold">
                  Telefone *
                </Label>
                <Input
                  id="telefone"
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="border-[#d4af37] focus:border-[#1a365d]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1a365d] font-semibold">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-[#d4af37] focus:border-[#1a365d]"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="endereco" className="text-[#1a365d] font-semibold">
                  Endereço
                </Label>
                <Input
                  id="endereco"
                  placeholder="Rua, número, complemento"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  className="border-[#d4af37] focus:border-[#1a365d]"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-[#1a365d] hover:bg-[#0f1f3a] text-white"
              >
                Salvar Cliente
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

      {/* Lista de Clientes */}
      <div className="space-y-4">
        {dados.clientes.length === 0 ? (
          <Card className="p-8 text-center">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhum cliente cadastrado ainda.</p>
            <p className="text-gray-400">Clique em "Novo Cliente" para começar.</p>
          </Card>
        ) : (
          dados.clientes.map((cliente) => {
            const emprestimos = obterEmprestimosCliente(cliente.id);
            const totalDevendo = emprestimos.reduce((acc, e) => acc + e.saldoDevedor, 0);

            return (
              <Card key={cliente.id} className="p-6 border-l-4 border-[#d4af37] shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1a365d]">{cliente.nome}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-gray-600">CPF</p>
                        <p className="font-semibold text-[#1a365d]">{cliente.cpf}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Telefone</p>
                        <p className="font-semibold text-[#1a365d]">{cliente.telefone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Email</p>
                        <p className="font-semibold text-[#1a365d]">{cliente.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Empréstimos</p>
                        <p className="font-semibold text-[#d4af37]">{emprestimos.length}</p>
                      </div>
                    </div>
                    {totalDevendo > 0 && (
                      <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                        <p className="text-orange-700 font-semibold">
                          Total devendo: R$ {totalDevendo.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => handleDelete(cliente.id)}
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
