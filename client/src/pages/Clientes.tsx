import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEmprestimos } from '@/contexts/EmprestimosContext';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Clientes() {
  const { dados, adicionarCliente, deletarCliente } = useEmprestimos();
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
      toast.error('Preencha os campos obrigatórios!');
      return;
    }

    adicionarCliente({
      nome: formData.nome,
      cpf: formData.cpf,
      telefone: formData.telefone,
      email: formData.email,
      endereco: formData.endereco,
    });

    setFormData({ nome: '', cpf: '', telefone: '', email: '', endereco: '' });
    setMostrarFormulario(false);
    toast.success('Cliente adicionado com sucesso!');
  };

  const handleDelete = (clienteId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      deletarCliente(clienteId);
      toast.success('Cliente deletado!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
          <p className="text-slate-600">Gerenciar clientes e seus empréstimos</p>
        </div>
        <Button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-slate-900 hover:bg-slate-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Formulário */}
      {mostrarFormulario && (
        <Card className="border-2 border-gold-500">
          <CardHeader>
            <CardTitle>Adicionar Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    placeholder="Nome completo"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    placeholder="(11) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  placeholder="Rua, número, complemento"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-slate-900 hover:bg-slate-800">
                  Salvar Cliente
                </Button>
                <Button type="button" variant="outline" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Clientes */}
      <div>
        {dados.clientes.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-slate-600">
              Nenhum cliente cadastrado ainda
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {dados.clientes.map((cliente) => (
              <Card key={cliente.id} className="hover:shadow-md transition">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{cliente.nome}</p>
                      <p className="text-sm text-slate-600">{cliente.cpf} | {cliente.telefone}</p>
                      <p className="text-sm text-slate-600">{cliente.email}</p>
                      {cliente.endereco && <p className="text-xs text-slate-500">{cliente.endereco}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cliente.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
