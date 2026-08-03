# Instalação & Setup — Caos Diário

> Guia da **fase de código** (após a fundação validada). A árvore de pastas já
> existe; o que falta é inicializar o app. Nada aqui roda antes do checklist da
> fundação passar (ver `CLAUDE.md`).

## Pré-requisitos

- Node.js LTS (18+) e npm
- Conta gratuita no [Supabase](https://supabase.com)
- Conta gratuita na [Vercel](https://vercel.com)

## Passos (primeira vez — fase de implementação)

1. **Inicializar o app Vite** na raiz (React + TS):
   ```bash
   npm create vite@latest . -- --template react-ts
   ```
2. Instalar dependências base:
   ```bash
   npm install @supabase/supabase-js
   ```
3. **Configurar variáveis de ambiente:** copie `.env.example` para `.env.local` e
   preencha com os dados do seu projeto Supabase (só chaves `VITE_*`; nunca `service_role`).
   ```bash
   cp .env.example .env.local
   ```
4. **Aplicar o schema:** rode as migrations de `supabase/migrations/` no seu projeto
   Supabase (via CLI do Supabase ou SQL editor). O alvo está em `supabase/schema.sql`.
   **Toda tabela com RLS habilitado.**
5. Rodar em desenvolvimento:
   ```bash
   npm run dev
   ```
6. **Testes:**
   ```bash
   npm test
   ```

## Deploy

Push para `main` → Vercel faz o deploy automático (ADR-001). Configure as mesmas
variáveis `VITE_*` no painel da Vercel. A `SUPABASE_SERVICE_ROLE_KEY` vai **apenas**
no ambiente das Edge Functions / servidor — nunca no front.

## Convenções (ver `memory/patterns.md`)

- SQL `snake_case` · JS/TS `camelCase` · componentes `PascalCase`.
- Migrations: `supabase/migrations/YYYYMMDD_descricao.sql`.
- Todo acesso ao Supabase passa por `src/lib/` (nenhum componente chama `supabase.from` direto).
- CSS separado do JSX.

## Segurança no setup (ver `docs/11_SEGURANCA`)

- `.env` / `.env.local` **nunca** versionados (já no `.gitignore`).
- Só `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no cliente.
- RLS habilitado e testado antes de qualquer deploy.
