# Backlog & Roadmap — Caos Diário

> Fonte: CAOS_FUNDACAO.md §10 e §11. Última atualização: 2026-07-24.

## Roadmap por fase

### v1 — MVP (100% grátis)
- [ ] Auth (Supabase) + perfil básico
- [ ] Quest do Dia (card + hashtag + contador social + countdown pré-7h)
- [ ] **CUMPRI** (idempotente) com link do TikTok opcional → selo PROVADO
- [ ] Streak (número + calendário + melhor streak + título por streak)
- [x] Vidas (1/24h): absorve falha, sem carta no dia salvo — `fechar-o-dia` (rodada 1); falta-antes-de-recarga (2ª falta consecutiva zera)
- [ ] Cartas comuns/raras + Álbum do Caos (grid + silhuetas)
- [ ] Arquivo do Caos (quests passadas)
- [ ] 4 pushes diários (Web Push): 7h / 12h / 20h / 22h
- [x] Edge Functions: publicar quest (`publicar-quest-do-dia`) · disparar push (`enviar-toque`) · fechar o dia (`fechar-o-dia`) · conceder carta (`processar-cumpri`)
- [ ] RLS em toda tabela · exclusão de conta (LGPD)
- [ ] Banco de 90 quests curadas (meta pré-lançamento)

### v2
- [ ] Fogo do Caos completo (duplas, marcos 7/30/90, máx. 5, cobrança 20h)
- [ ] Contestação social "duvido" (parceiro de fogo)
- [ ] Ranking oficial (só dias provados)
- [ ] Monetização camadas 1–2: vida extra, freeze de fogo, **CAOS+**
- [ ] Modo Insano (quest extra diária do CAOS+)

### v3
- [ ] Passe de Temporada (cosmético, destrava cumprindo)
- [ ] Repescagem anual de cartas
- [ ] Cartas físicas (só lendárias; sinergia Casa Coffee)
- [ ] Quests patrocinadas (máx 1/semana, só com 50k+ MAU)
- [ ] Semana Turbo (evento 2 quests/dia, 1×/temporada)
- [ ] Quests colab (ver Parking Lot)

## Parking Lot — Quests Colab (fase 3, NÃO construir antes)

Dependem do grafo social que o Fogo constrói primeiro. Três formatos:
- **Dupla** — quest que exige duas pessoas no mesmo vídeo (desbloqueada por fogo ativo).
- **Squad** — 3–8 amigos; Sábado do Caos vira quest de squad com streak coletivo; carta de squad = a mais rara do jogo.
- **Sync nacional** — quest com horário marcado (flashmob distribuído; exige massa crítica).

Validação: honor system + vídeo com hashtag (igual ao individual).

## Banco inicial de quests (10 aprovadas)

Já escritas (CAOS_FUNDACAO.md §6.4): 001 Modo Narrador · 002 Aplauso Solo ·
003 Câmera Lenta · 004 Terceira Pessoa · 005 Jantar Reverso · 006 GPS Humano ·
007 Trilha Sonora · 008 Elogio Sniper · 009 Entrevista Coletiva ·
010 SÁBADO DO CAOS: O Pedido (rara). **Faltam 80** para a meta de 90.

## Definição de pronto (por item de v1)
- RLS previsto na migration da tabela tocada.
- Estados `loading/empty/error/success` na tela.
- Sem `service_role` no front; sem log de dado sensível.
- Custo mantido em R$ 0 (tier gratuito).

## Ligações
- `docs/08_DECISOES` — ADRs que fecham o escopo.
- `memory/restrictions.md` — o que está adiado por custo.
- `docs/10_PROMPTS` — como escrever as 80 quests que faltam.
