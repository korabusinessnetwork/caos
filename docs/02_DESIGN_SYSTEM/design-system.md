# Design System — Caos Diário

> Fonte: CAOS_FUNDACAO.md §9. Estética "Atmosfera Viral".
> Princípio nº1 de UX: **INTUITIVIDADE** (sem manual). Ver CLAUDE.md.
> Última atualização: 2026-07-24.

## Princípio de ouro

**O card da quest tem que ser reconhecível em 0,5s no feed — o card É o marketing.**
Toda decisão visual serve a: (1) reconhecimento instantâneo no scroll do TikTok,
(2) emoção sobre informação.

## Paleta

| Token | Valor (referência) | Uso |
|---|---|---|
| `--caos-preto` | preto profundo (#0A0A0A aprox.) | fundo dominante |
| `--caos-branco` | branco (#F5F5F5 aprox.) | texto principal, contraste |
| `--caos-vermelho` | vermelho escuro (#8B0000 aprox.) | Sábado do Caos, raras, alertas, acento |

> Valores exatos a fechar no primeiro protótipo; manter só estes três como base —
> paleta enxuta reforça o reconhecimento.

## Atmosfera

- **Grain / haze:** textura granulada, leve névoa — cinematográfico, não "app limpo".
- **Texto mínimo:** o card fala por imagem; o enunciado cabe em 3 segundos de leitura.
- **Emoção sobre informação:** sente antes de explicar.
- **Assinatura 「亡者」** (mōja) nos marcos de 90 dias (temporada, fogo branco, título máximo).

## Tom de voz (aplicado à UI)

Seco, imperativo, provocador, cúmplice. Ver `memory/identity.md` → Tom de Voz.
- ✅ "A QUEST DE HOJE CAIU." / "8.412 já cumpriram. Você não."
- ❌ "Sua missão diária está disponível! Complete para ganhar pontos."

## Anatomia do card do Caos

- Marca "Caos" **fixa** no canto (watermark inegociável — nunca removível, ADR-008).
- 1 palavra/título grande + arte da carta.
- Selo de raridade legível à distância: Comum (P&B) · Rara (vermelha) · Lendária · Secreta.
- Selo de estado: `CUMPRI` (honra) vs `PROVADO` (com link do TikTok).

## Raridades (linguagem visual)

| Raridade | Gatilho | Visual |
|---|---|---|
| Comum | dia normal | preto & branco |
| Rara | Sábado do Caos | borda/acento vermelho |
| Lendária | semana completa sem falhar; 30d de fogo | destaque especial (foil no CAOS+) |
| Secreta | easter egg (cumprir antes das 8h, aniversário do app…) | oculta até desbloquear |

## Intuitividade (princípio nº1)

- Tela inicial = a quest de hoje, sem onboarding obrigatório.
- 1 ação primária por tela (ex: **CUMPRI**).
- Estados sempre visíveis: `loading` · `empty` · `error` · `success` (ver `memory/patterns.md`).
- Zero jargão; zero tela de tutorial. Se precisa de manual, o design falhou.

## Acessibilidade mínima

- Contraste do texto sobre preto profundo dentro de AA.
- Alvos de toque ≥ 44px (contexto mobile/PWA).
- Não depender só de cor pra comunicar raridade (usar também rótulo/forma).

## Ligações
- `docs/06_COMPONENTES` — as 6 telas e componentes compartilhados.
- `memory/patterns.md` — padrão do card e estados de UI.
- `src/styles/` — implementação (CSS separado do JSX).
