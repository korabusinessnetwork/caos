# Spec — UI de exclusão de conta (`excluir-conta-ui`)

> Rodada 5 do loop. Passo 1 (planejar). Backlog v1: "RLS em toda tabela ·
> **exclusão de conta (LGPD)**". O serviço `excluirConta()` e a Edge Function
> `excluir-conta` já existem — mas **nenhuma tela chama**: hoje o usuário não tem
> como apagar a própria conta. Público inclui menores (16+) → LGPD obrigatória p/ v1.

## 1. Escopo

Adicionar em `Perfil` (só no fluxo real, autenticado) uma ação **"excluir minha
conta"** com **confirmação em dois passos** (ação destrutiva e irreversível) que
chama `excluirConta()`; no sucesso a sessão é encerrada (o próprio serviço faz
`signOut`) e o app volta ao estado deslogado. Estados visíveis: ocioso →
confirmando → excluindo → erro.

## 2. Fora de escopo

- Backend/Edge Functions/migrations: **nada** (`excluir-conta` e `excluirConta()` já existem).
- Fluxo de "exportar meus dados" (portabilidade LGPD): item futuro separado.
- Período de carência / undo / soft-delete: a exclusão é imediata e definitiva (a Edge Function decide o alcance).
- Reautenticação por senha antes de excluir: não há esse passo hoje; a confirmação em dois toques basta para v1 (não coletamos senha de novo — regra de segurança).
- Alterar `MODO_DEMO`: no demo não há sessão real → a ação some (como o "sair").

## 3. Origem e decisões que este item honra

- Backlog v1: "exclusão de conta (LGPD)".
- `docs/11_SEGURANCA/` (LGPD redobrada — público 16+): titular tem de conseguir apagar os próprios dados.
- **ADR-010** (isolamento por `auth.uid()`): a exclusão apaga só a própria conta; cascade do schema (`on delete cascade`) leva completions/streaks/lives/user_cards junto.
- Princípio nº1 (prevenção de erro > mensagem de erro): ação destrutiva exige confirmação explícita, nunca um clique único.
- Camada de serviços: a tela usa `excluirConta()` de `src/lib/auth.ts`, nunca `supabase` direto.
- Reusa o padrão de estados de `BotaoCumpri` (idle/enviando/erro) e a gate `!modoDemo` já usada no botão "sair" do `Perfil`.

## 4. Arquivos afetados

- **novo** `src/components/shared/ExcluirConta.tsx` + `ExcluirConta.css` — o botão + confirmação em dois passos + estados.
- **edita** `src/pages/Perfil.tsx` — renderiza `ExcluirConta` na `nav` de links, só quando `!modoDemo`.
- **edita** `src/lib/auth.ts` — corrige o comentário defasado ("implementada na fase M4" → já implementada).

Convenções: componente PascalCase em arquivo próprio, CSS separado, tokens `--caos-*`, identificadores em português.

## 5. Critérios de aceite

1. A ação **só aparece** no fluxo real autenticado; em `MODO_DEMO` (`modoDemo === true`) não é renderizada (paridade com o botão "sair").
2. **Dois passos**: o 1º toque revela um aviso claro de que é **irreversível** e apaga tudo (streak, cartas, histórico); só um 2º toque confirmado dispara a exclusão. Há como **cancelar** e voltar ao estado ocioso.
3. Ao confirmar, chama `excluirConta()` (camada de serviços); enquanto corre, o botão trava e mostra estado "excluindo…" (sem duplo disparo).
4. **Sucesso**: `excluirConta()` faz `signOut` → `AuthContext` reage → o app sai do estado autenticado (o `PortaoAuth` do `Perfil` volta a pedir login). A tela não tenta renderizar dados de uma conta apagada.
5. **Erro**: falha da função cai em estado de erro visível ("não deu pra excluir agora. tenta de novo."), sem travar a tela nem apagar a sessão pela metade.
6. Nenhum dado sensível logado; nenhum segredo hardcodado; nenhuma cor fora dos tokens `--caos-*`; CSS separado do JSX.
7. Acessível: a ação destrutiva tem rótulo claro, foco tratado na confirmação, alvo ≥ `--toque-min`.
8. Comentário de `excluirConta()` em `auth.ts` não afirma mais que a função "será implementada no M4".
9. Sem regressão: `npm test` verde (32), `tsc` limpo, `vite build` OK; `Perfil` carrega no browser (MODO_DEMO) e a ação de exclusão **não** aparece no demo.

## 6. Edge cases conhecidos

- **MODO_DEMO**: sem sessão real → ação escondida (não chamar `excluirConta` sem backend).
- **Clique duplo / reentrância**: o estado "excluindo" trava o botão até resolver.
- **Falha de rede na Edge Function**: estado de erro, sessão intacta, usuário pode tentar de novo.
- **Sucesso mas signOut lento**: a UI não deve piscar dados; ao entrar em "excluindo" já não renderiza ações da conta.
- **Cancelar no 2º passo**: volta ao ocioso sem efeito colateral.

## 7. Definição de "aprovado sem ressalvas"

Todos os critérios em **sim**; `npm test` verde (sem regressão nas 32 puras); `tsc` limpo e
`vite build` OK; sem `console.log` nem TODO solto; verificado no browser (MODO_DEMO) que o `Perfil`
carrega e a ação de exclusão não aparece no demo — e leitura do código confirma a confirmação em
dois passos, a gate `!modoDemo`, o uso de `excluirConta()` e os estados de excluindo/erro.

---

## Resultado da review (rodada 5 — 2026-08-02)

**Aprovado sem ressalvas.** 9/9 critérios em sim; suíte verde (32), `tsc` limpo, `vite build` OK.
Sem correção na review. Verificado no browser (MODO_DEMO): `Perfil` carrega, a ação de exclusão
(e o "sair") **não** aparecem no demo (gate `!modoDemo`), sem erro no console. Fluxo real conferido
por código:

- `ExcluirConta`: `idle` → `confirmando` (aviso de irreversibilidade + cancelar/confirmar) → `excluindo` (botões travados, `aria-busy`) → `erro` visível; cancelar volta ao `idle`.
- Usa `excluirConta()` da camada de serviços (nunca `supabase` direto); no sucesso o `signOut` interno faz o `AuthContext` reagir e o `PortaoAuth` voltar a pedir login.
- Comentário defasado em `auth.ts` corrigido; só tokens `--caos-*`; CSS separado.

Fica para próximas rodadas: reautenticação por senha antes de excluir (hoje 2 toques bastam);
exportar dados (portabilidade LGPD); teste E2E do fluxo real (gated off no demo).
