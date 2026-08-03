# Componentes & Telas — Caos Diário

> Fonte: CAOS_FUNDACAO.md §3. v1 = 6 telas. Convenção: componentes PascalCase.
> Última atualização: 2026-07-24.

## As 6 telas da v1

| # | Tela | Conteúdo | Ação primária |
|---|---|---|---|
| 1 | **Quest do Dia** | card cinematográfico, hashtag, contador social. Antes das 7h: countdown | **CUMPRI** / PULEI |
| 2 | **Streak** | número gigante, calendário do mês, melhor streak, vida disponível | — |
| 3 | **Ranking** | top streaks BR + fogos mais longos (pode adiar p/ fase 2) | — |
| 4 | **Arquivo do Caos** | quests passadas (FOMO retroativo) | ver carta |
| 5 | **Álbum do Caos** | grid de cartas conquistadas + silhuetas das faltantes | — |
| 6 | **Perfil** | nome, título por streak, fogos ativos, card compartilhável | compartilhar |

## Árvore de componentes (proposta)

```
src/pages/
├── QuestDoDia.tsx        # tela 1 (rota inicial)
├── Streak.tsx            # tela 2
├── Ranking.tsx           # tela 3
├── ArquivoDoCaos.tsx     # tela 4
├── AlbumDoCaos.tsx       # tela 5
└── Perfil.tsx            # tela 6

src/components/shared/
├── CardDoCaos.tsx        # o card (reconhecível em 0,5s) — raridade, selo, watermark
├── ContadorSocial.tsx    # "8.412 já cumpriram. Você não."
├── Countdown.tsx         # "o caos chega em 02:14:33"
├── StreakBadge.tsx       # número + título por streak
├── BotaoCumpri.tsx       # ação primária + colar link opcional
├── VidaIndicator.tsx     # vida disponível / recarrega em
├── FogoBadge.tsx         # estado do Fogo do Caos (fase 2)
└── EstadoTela.tsx        # loading / empty / error wrapper
```

## Contratos-chave

### `CardDoCaos`
- Props: `carta` (nome, raridade, arte), `selo` (`'cumpri' | 'provado' | null`).
- **Sempre** renderiza a marca "Caos" fixa (watermark inegociável — ADR-008).
- Raridade legível à distância; não depender só de cor (rótulo/forma também).

### `BotaoCumpri`
- Estados: idle → enviando → sucesso (animação da carta) → erro (retry).
- Campo opcional "colar link do TikTok" → dispara selo PROVADO.
- Idempotente na UI: desabilita após 1º clique até resposta.

## Regras de UI (de `memory/patterns.md`)
- Toda tela trata `loading` · `empty` · `error` · `success` (via `EstadoTela`).
- 1 ação primária por tela.
- CSS separado do JSX (`src/styles/` ou `Componente.css`).
- Estado global (auth, tema, quest do dia) em `src/context/`.

## Ligações
- `docs/02_DESIGN_SYSTEM` — tokens visuais e anatomia do card.
- `docs/05_FLUXOS` — como as telas se conectam.
- `src/` — implementação (nenhuma linha antes do checklist de fundação passar).
