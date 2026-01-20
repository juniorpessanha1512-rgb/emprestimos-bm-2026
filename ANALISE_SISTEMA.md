# Análise do Sistema Jurista App e Plano de Melhorias

## Estrutura do Jurista App

O site Jurista App possui a seguinte estrutura de navegação:

### Módulos Principais
1. **Dashboard**: Visão geral com estatísticas do negócio
2. **Clientes**: Gerenciamento de clientes
3. **Empréstimos**: Criação e acompanhamento de empréstimos
4. **Pagamentos**: Registro de pagamentos recebidos
5. **Em Atraso**: Monitoramento de empréstimos vencidos

---

## Funcionalidades Identificadas

### 1. Gestão de Clientes
- Cadastro de clientes com informações pessoais
- Histórico de empréstimos por cliente
- Status de cada cliente (ativo, inativo, etc.)

### 2. Gestão de Empréstimos
- Criação de empréstimos com:
  - Valor principal
  - Taxa de juros (% ao mês/ano)
  - Período de empréstimo
  - Data de início
- Cálculo automático de juros

### 3. Sistema de Parcelas e Pagamentos
- Geração de cronograma de parcelas
- Cálculo de juros recorrentes (a cada período)
- Opções de pagamento:
  - Pagar apenas os juros (mantém a dívida principal)
  - Pagar juros + parte do principal
  - Pagar juros + principal total
- Recálculo automático de juros após cada pagamento

### 4. Monitoramento de Atrasos
- Identificação de empréstimos vencidos
- Cálculo de juros de mora
- Alertas de atraso

---

## Lógica de Cálculo de Juros (Conforme Descrito)

### Exemplo Prático
**Cenário**: Empréstimo de R$ 1.000 a 10% ao mês

**Mês 1**:
- Valor devido: R$ 1.000
- Juros: R$ 100 (10% de R$ 1.000)
- Opções de pagamento:
  - Opção A: Pagar R$ 1.100 (juros + principal) → Quitado
  - Opção B: Pagar R$ 100 (apenas juros) → Continua devendo R$ 1.000
  - Opção C: Pagar R$ 100 + R$ 200 = R$ 300 → Continua devendo R$ 800

**Mês 2** (se escolher Opção B):
- Valor devido: R$ 1.000 (principal não foi reduzido)
- Juros: R$ 100 (10% de R$ 1.000)
- Mesmas opções de pagamento

**Mês 2** (se escolher Opção C):
- Valor devido: R$ 800 (principal foi reduzido)
- Juros: R$ 80 (10% de R$ 800)
- Opções de pagamento:
  - Opção A: Pagar R$ 880 (juros + principal) → Quitado
  - Opção B: Pagar R$ 80 (apenas juros) → Continua devendo R$ 800
  - Opção C: Pagar R$ 80 + valor adicional → Reduz o principal

---

## Melhorias para o Empréstimos BM 2026

### 1. Funcionalidades Principais
- ✅ Gestão de clientes (nome, telefone, email, CPF)
- ✅ Criação de empréstimos com juros configuráveis
- ✅ Geração automática de cronograma de parcelas
- ✅ Registro de pagamentos com cálculo de juros recorrentes
- ✅ Opções flexíveis de pagamento (apenas juros, juros + amortização, quitação total)
- ✅ Recálculo automático de saldo devedor e juros
- ✅ Histórico completo de transações

### 2. Dashboard e Relatórios
- ✅ Dashboard com estatísticas (total emprestado, total recebido, em aberto)
- ✅ Gráficos de evolução de empréstimos
- ✅ Tabela de empréstimos com status
- ✅ Alertas de atrasos
- ✅ Exportação de relatórios

### 3. Interface Aprimorada
- ✅ Design corporativo premium (azul marinho + ouro)
- ✅ Sidebar de navegação
- ✅ Proteção por senha
- ✅ Responsividade mobile/desktop
- ✅ Armazenamento local (localStorage)

### 4. Cálculos Avançados
- ✅ Juros simples
- ✅ Juros compostos (opcional)
- ✅ Amortização com redução de principal
- ✅ Juros de mora para atrasos
- ✅ Simulações de pagamento

---

## Tecnologia

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Armazenamento**: localStorage (sem banco de dados)
- **Componentes**: shadcn/ui
- **Deploy**: Vercel

---

## Próximos Passos

1. Criar estrutura de dados para armazenar:
   - Clientes
   - Empréstimos
   - Parcelas
   - Pagamentos

2. Implementar lógica de cálculo de juros recorrentes

3. Criar interface para:
   - Cadastro de clientes
   - Criação de empréstimos
   - Registro de pagamentos
   - Visualização de cronograma

4. Adicionar dashboard com estatísticas

5. Implementar sistema de alertas para atrasos
