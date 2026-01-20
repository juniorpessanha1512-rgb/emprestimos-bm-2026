# 🚀 Guia de Deploy na Vercel - Empréstimos BM 2026

## 📋 Pré-requisitos

- Conta no GitHub (para conectar o repositório)
- Conta na Vercel (gratuita em https://vercel.com)
- Git instalado localmente

## 🔧 Passo 1: Preparar o Projeto Localmente

### 1.1 Clonar ou fazer upload do projeto

Se você já tem o projeto localmente, certifique-se de que está na pasta correta:

```bash
cd /home/ubuntu/emprestimos-bm-2026
```

### 1.2 Verificar que o projeto está pronto

```bash
# Instalar dependências
pnpm install

# Testar build local
pnpm build

# Testar servidor de desenvolvimento
pnpm dev
```

## 📤 Passo 2: Fazer Upload para GitHub

### 2.1 Criar repositório no GitHub

1. Acesse https://github.com/new
2. Nome do repositório: `emprestimos-bm-2026`
3. Descrição: "Sistema de gestão de empréstimos com controle de juros e parcelas"
4. Deixe como **Privado** (recomendado para dados sensíveis)
5. Clique em "Create repository"

### 2.2 Fazer push do projeto para GitHub

```bash
cd /home/ubuntu/emprestimos-bm-2026

# Inicializar git (se não estiver já inicializado)
git init

# Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/emprestimos-bm-2026.git

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit: Sistema de empréstimos com controle de juros"

# Fazer push para main
git branch -M main
git push -u origin main
```

## 🌐 Passo 3: Deploy na Vercel

### 3.1 Conectar Vercel ao GitHub

1. Acesse https://vercel.com/dashboard
2. Clique em "Add New..." → "Project"
3. Clique em "Import Git Repository"
4. Procure por `emprestimos-bm-2026`
5. Clique em "Import"

### 3.2 Configurar o Projeto

Na página de configuração do Vercel:

**Framework Preset:** Selecione "Vite"

**Root Directory:** Deixe em branco (ou deixe como `.`)

**Build Command:** 
```
pnpm build
```

**Output Directory:** 
```
dist
```

**Environment Variables:** Nenhuma necessária para esta versão (dados armazenados localmente)

### 3.3 Deploy

Clique em "Deploy" e aguarde a conclusão (geralmente leva 2-3 minutos).

## ✅ Passo 4: Verificar o Deploy

Após o deploy ser concluído:

1. Você receberá um URL como: `https://emprestimos-bm-2026.vercel.app`
2. Acesse a URL e teste:
   - Login com senha: `151612bm`
   - Criar um cliente
   - Criar um empréstimo
   - Registrar um pagamento

## 🔐 Segurança e Dados

### ⚠️ Importante: Dados Locais

Este projeto armazena dados **localmente no navegador** (localStorage). Isso significa:

- ✅ Dados não são enviados para nenhum servidor
- ✅ Cada navegador/dispositivo tem seus próprios dados
- ⚠️ Se o usuário limpar o cache do navegador, os dados serão perdidos
- ⚠️ Dados não sincronizam entre dispositivos

### 💾 Recomendação para Produção

Se você precisar de:
- Sincronização entre dispositivos
- Backup automático
- Múltiplos usuários
- Dados persistentes

**Considere fazer upgrade para versão com banco de dados** (web-db-user).

## 🔄 Atualizações Futuras

Para fazer novas atualizações:

```bash
# Fazer mudanças no código
# ...

# Fazer commit e push
git add .
git commit -m "Descrição das mudanças"
git push

# Vercel fará deploy automático!
```

## 🆘 Troubleshooting

### Erro: "Build failed"

1. Verifique se todas as dependências estão instaladas: `pnpm install`
2. Teste o build localmente: `pnpm build`
3. Verifique os logs no Vercel dashboard

### Erro: "Página em branco"

1. Abra o console do navegador (F12)
2. Verifique se há erros JavaScript
3. Limpe o cache do navegador

### Dados desapareceram

1. Isso é normal se o cache foi limpo
2. Considere usar um banco de dados para dados persistentes

## 📞 Suporte

Para problemas com Vercel, visite: https://vercel.com/docs

## 🎉 Pronto!

Seu sistema de empréstimos está online! Acesse a URL fornecida pela Vercel e comece a usar.

**Senha de acesso:** `151612bm`

---

**Versão:** 1.0.0  
**Data:** Janeiro 2026  
**Projeto:** Empréstimos BM 2026
