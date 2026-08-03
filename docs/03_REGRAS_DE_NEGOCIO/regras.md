# Regras de Negócio — Caos Diário

> Fonte: CAOS_FUNDACAO.md §2, §4, §5, §6, §7. Decisões em ADR-002/005/006/007/008.
> Última atualização: 2026-07-24.

## 1. O loop central (CAOS_FUNDACAO.md §2)

1. **7h** — push "A QUEST DE HOJE CAIU".
2. Abre o app → card estético revela a quest.
3. Cumpre no mundo real → filma no celular.
4. Posta no TikTok com a hashtag do dia (`#CaosDia{N}`).
5. Volta → marca **CUMPRI** → streak +1 → ganha a carta do dia.
6. Feed do TikTok enche da mesma cena → quem vê baixa o app.
7. Repete amanhã.

**Ritmo: 1 quest/dia sincronizada nacional (ADR-002).** Não é 1 a cada 4h.

### 4 toques diários (sem quest extra)
| Hora | Toque |
|---|---|
| 7h | revelação da quest |
| 12h | contador social ("8.412 já cumpriram, você não") |
| 20h | alerta de fogo ("Guilherme ainda não cumpriu") |
| 22h | última chamada ("2h pro caos fechar") |

## 2. Streak + Vidas (ADR-005)

- Streak diário com **perda real**.
- **1 vida a cada 24h.** Falhou → a vida absorve, o streak sobrevive, **mas não ganha a carta** do dia.
- Falhou de novo no ciclo **sem vida** → streak **zera**.
- Vida extra comprável = *streak freeze* pago (ver Monetização; não é v1).

### Títulos por streak (CAOS_FUNDACAO.md §4.4)
3d "Iniciado" → 7d "Agente do Caos" → 30d "Lenda" → 90d "亡者 do Caos".

## 3. Cartas do Caos (ADR-003)

- Cada quest cumprida = **1 carta única** daquela quest.
- Raridades: **Comum** (dia normal, P&B) · **Rara** (Sábado do Caos, vermelha) ·
  **Lendária** (semana completa sem falhar) · **Secreta** (easter eggs).
- Quest perdida = **carta perdida** (repescagem paga, 1×/ano).
- **Temporadas de 90 dias** — visual novo de cartas por temporada.
- Selo **PROVADO**: carta superior para quem colou o link do TikTok.
- Carta de dupla: 30 dias de fogo = lendária no álbum dos dois.
- Fase 3: cartas físicas.

## 4. Fogo do Caos — streak em dupla (ADR-007)

- Você + amigo: fogo aceso se **AMBOS** cumprirem no mesmo dia; um falha, apaga dos dois.
- Adicionar por código/link (link de convite = aquisição).
- Marcos: 7d fogo normal → 30d azul → 90d branco 亡者.
- **Máx. 5 fogos simultâneos** na v1.
- Push das 20h faz um cobrar o outro (retenção terceirizada).

## 5. Verificação de quest (ADR-006)

**Nunca hospedar vídeo próprio. Nunca live. Nunca feed interno.** Três camadas, custo ~zero:
1. **Honor system** — CUMPRI vale por si; concede streak + carta comum.
2. **Prova leve** — colar link do TikTok (opcional) → carta com selo **PROVADO** (guarda só a URL).
3. **Contestação social (fase 2)** — parceiro de fogo tem botão "duvido"; contestado precisa do link pra manter o dia. Rankings oficiais só contam dias **provados**.

Racional: Duolingo/BeReal/Snapchat não verificam nada e funcionam. Quem trapaceia um jogo cujo prêmio é a diversão sai sozinho.

## 6. Sistema de quests (CAOS_FUNDACAO.md §6)

### Padrão OBRIGATÓRIO de escrita
```
TÍTULO CURTO
Comando de 1 linha.
Regra: 1 restrição que cria a dificuldade (e o momento engraçado do vídeo).
```
Lê em 3 segundos no feed, cabe no card. (Detalhe em `memory/patterns.md`.)

### Regras de curadoria (inegociáveis)
- Nada ilegal, perigoso, ou que humilhe terceiros sem consentimento.
- **Alvo da piada é sempre o usuário**, nunca o estranho.
- Nada que dependa de dinheiro pra cumprir.
- Executável em < 10 min · filmável na vertical (15–60s).
- Teste final: *"eu faria isso sóbrio?"* — se "quase", tá no ponto.

### Calendário semanal
Segunda leve → escala na semana → **SÁBADO DO CAOS** (a mais insana, carta rara).
Categorias em rotação: Social · Performance · Criativa · Caos doméstico.
Quests **curadas por humanos**, nunca geradas por IA em runtime (ADR-004).

## 7. Monetização (ADR-008)

**O loop é grátis pra sempre.** Cobra-se proteção, status e extra — nunca o caos.

| Camada | Item | Preço |
|---|---|---|
| 1 | Vida extra (freeze) | R$ 4,90 |
| 1 | Freeze de Fogo (salva a dupla) | R$ 6,90 |
| 2 | **CAOS+** (2 vidas/mês, Modo Insano, cartas foil, molduras/títulos, stats) | R$ 9,90/mês · R$ 79/ano |
| 3 | Passe de Temporada (cosmético; destrava cumprindo) | R$ 14,90/90d |
| 3 | Repescagem anual | R$ 9,90/evento |
| 3 | Carta física (só lendárias) | R$ 19,90 + frete |
| 4 | Quest patrocinada (máx 1/semana, só com 50k+ MAU) | negociado |

**CAOS+ NUNCA inclui:** ver a quest antes das 7h · carta sem cumprir · remover a marca do card.
**NUNCA fazer:** banner/interstitial · pay-to-win na coleção · paywall no loop básico.
**Sequência:** v1 100% grátis → vidas pagas quando existirem streaks > 14d → CAOS+ → temporadas/marcas.

## Ligações
- `docs/04_MODELAGEM` + `supabase/schema.sql` — como as regras viram dados.
- `docs/05_FLUXOS` — o loop e os 4 toques como fluxo.
- `docs/08_DECISOES` — os ADRs que fecham cada regra.
