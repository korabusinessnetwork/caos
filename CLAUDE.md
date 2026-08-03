# Diretrizes de Desenvolvimento — Caos Diário

> Constituição do projeto. Fonte de verdade acima de conveniência técnica.
> Intake completo em `respostas-intake.md`; decisões em `docs/08_DECISOES/`.

## Princípio nº 1 — INTUITIVIDADE (inegociável)

O foco principal do sistema é **abrir o app, entender a quest do dia e marcar
CUMPRI sem qualquer instrução** — o público (16–30, TikTok pesado) não lê manual.
Em qualquer decisão, priorize este princípio acima de conveniência técnica.

Regras práticas:

- **O card da quest tem que ser reconhecível em 0,5s no feed** — o card É o marketing (ver `docs/02_DESIGN_SYSTEM/`).
- Uma ação principal por tela; o botão CUMPRI/PULEI é sempre óbvio e sem fricção.
- Estados sempre visíveis: carregando, erro, vazio e sucesso com feedback humano (não "Error 500").
- Prevenção de erro > mensagem de erro. Antes das 7h, mostrar countdown — nunca tela vazia.
- Consistência total com o design system (`docs/02_DESIGN_SYSTEM/`).
- Emoção sobre informação: texto mínimo, impacto visual máximo (estética Atmosfera Viral).

## Fonte de verdade (leia antes de qualquer mudança relevante)

- **`memory/`** — identidade, decisões, padrões, aprendizados e restrições.
  Consultar **antes** de decisões de produto/arquitetura.
- **`docs/`** — regras de negócio (`03_REGRAS_DE_NEGOCIO/`), design system
  (`02_DESIGN_SYSTEM/`), fluxos (`05_FLUXOS/`), modelagem (`04_MODELAGEM/`),
  ADRs (`08_DECISOES/`) e o plano de segurança (`11_SEGURANCA/`).
- **ADR-001** define a stack vigente; toda decisão relevante virou ADR (001–010).
- Schema do banco: `supabase/schema.sql`.
- Se doc e código conflitarem, a documentação prevalece — e deve ser corrigida quando estiver errada.
- **Produto = B2C single-tenant (marca única "Caos").** Este projeto é uma
  **exceção consciente** ao padrão multi-tenant white-label da Kora, registrada em
  **ADR-010**. Aqui **não há tenant_id nem white-label**: a marca "Caos" é fixa e
  o watermark do card nunca sai (é o canal de aquisição). O isolamento de dados é
  **por usuário** (`auth.uid()` via RLS), não por estabelecimento. Se um dia o
  produto virar plataforma para terceiros, isso exige novo ADR revogando o 010.

## Regra de ouro do produto — o loop é sagrado

> O loop principal (quest → cumprir → filmar → postar no TikTok → CUMPRI → streak
> → carta) é **grátis pra sempre**. Cobra-se proteção, status e extra — nunca o
> caos. O usuário grátis **É** o marketing.

Nunca construir: banner/interstitial · pay-to-win na coleção · paywall no loop
básico · ver a quest antes das 7h · carta sem cumprir · remover a marca do card.

## Processo de trabalho

1. **Planejar TUDO antes de executar** — escopo fechado, sem retrabalho.
2. **Document-first** — regra de negócio e fluxo documentados antes de codar a feature.
3. Builds multi-parte → fan-out paralelo com **dono exclusivo por arquivo** (dois agentes nunca tocam o mesmo arquivo).
4. **Sintetizar e VALIDAR no fim** — revisar cada entrega, rodar testes e build.
5. Tarefa de peça única não ganha fan-out.
6. Ciclo padrão da casa: `spec` → `build` → `review` → `commit` (skills do projeto).

## Custo — priorizar o gratuito (bootstrap: alvo R$ 0/mês na v1)

Enquanto o projeto está pré-receita, **use sempre meios gratuitos** (tiers free de
Supabase, Vercel, Web Push, GitHub). Toda implementação com custo é **adiada por
padrão**, salvo decisão explícita do dono. Ao esbarrar em algo pago, apresente:
custo aproximado, alternativa gratuita, impacto e recomendação (agora × depois) —
o dono decide. **ZERO infra de vídeo**: o TikTok hospeda; nós guardamos só a URL.
Detalhes em `memory/restrictions.md`.

## Segurança (obrigatório em todo código novo)

- **Nunca** hardcodar chaves, URLs de API, secrets ou senhas — usar `import.meta.env.VITE_*`.
- **Nunca** expor a `service_role` do Supabase no front — só a chave `anon` (pública).
- **RLS obrigatória em toda tabela** (isolamento por `auth.uid()`) — é definition-of-done da tabela.
- **Nunca** `select *` em tabelas com dado pessoal — sempre campos explícitos.
- **Sempre** validar inputs do usuário (inclusive a URL de TikTok colada) antes de qualquer operação no banco.
- **Nunca** logar dados sensíveis (tokens, e-mail em texto claro).
- **Sempre** verificar autenticação antes de renderizar rota protegida.
- Público inclui menores (16+) → cuidado LGPD redobrado. Plano completo em `docs/11_SEGURANCA/`.

## Padrões de código

- **Componentes React (PascalCase) em arquivos separados**; CSS separado do JSX.
- Convenções Kora: **SQL snake_case · JS/TS camelCase · componentes PascalCase**.
- Migrations nomeadas `YYYYMMDD_descricao.sql` em `supabase/migrations/`.
- Variáveis/funções em português para nomes de domínio (`marcarCumpri`, `carta`, `fogo`), inglês para padrões técnicos (`handleSubmit`, `useEffect`).
- Toda chamada ao backend passa pela **camada de serviços** (`src/lib/`), nunca direto no componente.
- Sempre tratar erros do backend com `try/catch` ou checagem de `.error`.
- Logs de atividade fire-and-forget — nunca bloquear o loop principal.
- Rodar `npm test` antes de commitar; funções puras (streak, vida, raridade da carta) nascem com teste.

## Stack

- **React + TypeScript + Vite** — **PWA** na v1 (sem app store).
- **Supabase** (auth, Postgres, RLS obrigatória, Edge Functions para lógica sensível).
- **Vercel** (deploy automático no push para `main`).
- **Web Push** via service worker (os 4 toques diários: 7h/12h/20h/22h).
- **Vídeo:** ZERO infra própria — TikTok faz esse trabalho; guardamos só a URL do post.
- Sem Redux (Context API) · sem lib paga na v1.
