# Guia de Deploy na Vercel - Empréstimos BM 2026

## Sobre a Aplicação

**Empréstimos BM 2026** é uma aplicação web estática para cálculo de juros simples. Ela não requer banco de dados e funciona completamente no navegador do usuário.

- **Autenticação**: Protegida por senha (`151612bm`)
- **Armazenamento**: Usa localStorage do navegador para manter histórico de cálculos
- **Tipo**: Aplicação estática (React + Tailwind CSS)
- **Tecnologia**: Vite, React 19, TypeScript

---

## Pré-requisitos

Antes de fazer o deploy, você precisa de:

1. **Conta na Vercel**: Crie uma em [vercel.com](https://vercel.com)
2. **Conta no GitHub**: Crie uma em [github.com](https://github.com) (opcional, mas recomendado)
3. **Git instalado**: Para fazer push do código

---

## Opção 1: Deploy via GitHub (Recomendado)

### Passo 1: Criar repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Crie um novo repositório chamado `emprestimos-bm-2026`
3. **NÃO** inicialize com README (vamos fazer isso localmente)
4. Clique em "Create repository"

### Passo 2: Fazer push do código para GitHub

No seu terminal, dentro da pasta do projeto:

```bash
# Inicializar git (se ainda não estiver)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit: Empréstimos BM 2026"

# Adicionar remote do GitHub
git remote add origin https://github.com/SEU_USUARIO/emprestimos-bm-2026.git

# Fazer push para main
git branch -M main
git push -u origin main
```

### Passo 3: Conectar Vercel ao GitHub

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em "Add New..." → "Project"
3. Selecione "Import Git Repository"
4. Procure por `emprestimos-bm-2026`
5. Clique em "Import"

### Passo 4: Configurar projeto na Vercel

1. **Project Name**: `emprestimos-bm-2026`
2. **Framework Preset**: Selecione "Vite"
3. **Root Directory**: `./` (raiz do projeto)
4. **Build Command**: `npm run build` (já configurado no package.json)
5. **Output Directory**: `dist` (já configurado)
6. Clique em "Deploy"

A Vercel fará o build automaticamente e seu site estará online em poucos minutos!

---

## Opção 2: Deploy via Vercel CLI

### Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Passo 2: Fazer login na Vercel

```bash
vercel login
```

### Passo 3: Fazer deploy

```bash
vercel
```

Siga as instruções interativas. A Vercel criará um projeto e fará o deploy automaticamente.

---

## Opção 3: Deploy Manual (Sem GitHub)

### Passo 1: Fazer build local

```bash
npm run build
```

Isso criará uma pasta `dist/` com os arquivos prontos para produção.

### Passo 2: Fazer upload na Vercel

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em "Add New..." → "Project"
3. Selecione "Deploy from Git" ou "Vercel for Git"
4. Siga as instruções para conectar seu repositório

---

## Verificar o Deploy

Após o deploy ser concluído:

1. Acesse a URL fornecida pela Vercel (ex: `emprestimos-bm-2026.vercel.app`)
2. Digite a senha: `151612bm`
3. Teste o cálculo de juros
4. Verifique o histórico

---

## Domínio Customizado (Opcional)

Para usar seu próprio domínio:

1. Na Vercel, vá para **Settings** → **Domains**
2. Clique em "Add Domain"
3. Digite seu domínio (ex: `emprestimos.com`)
4. Siga as instruções para apontar o DNS

---

## Variáveis de Ambiente

Esta aplicação não requer variáveis de ambiente. Todos os dados são armazenados localmente no navegador.

---

## Troubleshooting

### Erro: "Build failed"

**Solução**: Certifique-se de que:
- Você está na pasta raiz do projeto
- Todos os arquivos foram commitados
- Não há erros de TypeScript: `npm run check`

### Senha não funciona

**Solução**: A senha é `151612bm` (sem espaços). Certifique-se de que:
- Caps Lock está desligado
- Você digitou exatamente: `151612bm`

### Histórico de cálculos não persiste

**Solução**: O histórico é armazenado em `localStorage`. Se você limpar o cache do navegador, o histórico será perdido. Isso é comportamento esperado.

---

## Atualizar o Deploy

Após fazer mudanças no código:

1. Faça commit e push para GitHub:
   ```bash
   git add .
   git commit -m "Descrição das mudanças"
   git push origin main
   ```

2. A Vercel detectará automaticamente as mudanças e fará o deploy novamente.

---

## Suporte

Para dúvidas sobre Vercel, consulte:
- [Documentação Vercel](https://vercel.com/docs)
- [Suporte Vercel](https://vercel.com/support)

Para dúvidas sobre a aplicação, verifique o código em `client/src/pages/Home.tsx`.

---

## Resumo Rápido

| Método | Tempo | Dificuldade |
|--------|-------|-------------|
| GitHub + Vercel | 5 min | Fácil |
| Vercel CLI | 3 min | Médio |
| Manual | 10 min | Difícil |

**Recomendação**: Use a **Opção 1 (GitHub + Vercel)** para melhor controle de versão e deploys automáticos.
