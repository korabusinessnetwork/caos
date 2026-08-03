# CAOS DIÁRIO — Documento-Mestre de Fundação
> Entrada oficial para a skill `fundacao-de-projeto`. Todas as decisões abaixo já foram
> tomadas e validadas — o intake deve usar este arquivo como resposta, não reperguntar.
> Origem: sessão de concepção Matheus × Claude, 24/07/2026.

---

## 1. VISÃO (→ docs/00_VISAO + memory/identity.md)

**Uma frase:** Todo dia às 7h, o Brasil inteiro recebe a mesma quest absurda. Você cumpre,
filma, posta no TikTok com a hashtag do dia. Streak de quem sobrevive ao caos.

**Categoria:** content-first app — o app existe para gerar vídeo; o vídeo no TikTok é o
canal de aquisição (CAC zero). O app é a camada de jogo por cima do TikTok, nunca um
concorrente dele.

**Diferencial central:** quest SINCRONIZADA nacional — todos recebem a MESMA quest no
MESMO dia. O sync é o produto (hashtag concentrada, feed de comparação, evento coletivo).

**Público:** 16–30 anos, usuários pesados de TikTok, Brasil.

**Venture:** Kora Business Network. Curadoria de quests: Matheus + Guilherme + Macedo.
Canal de lançamento: Atmosfera Viral (primeiros vídeos = fundadores cumprindo quests).

---

## 2. O LOOP CENTRAL

1. **7h** — push: "A QUEST DE HOJE CAIU"
2. Abre o app → card estético revela a quest
3. Cumpre no mundo real → filma no celular
4. Posta no TikTok com a hashtag do dia (ex: `#CaosDia47`)
5. Volta → marca **CUMPRI** → streak +1 → ganha a carta do dia
6. Feed do TikTok enche da mesma cena → quem vê baixa o app
7. Repete amanhã

**Ritmo: 1 quest/dia. DECISÃO FECHADA — não é 1 a cada 4h** (ver ADR-005).

**4 toques diários sem quest extra:**
- 7h — revelação da quest
- 12h — contador social ("8.412 já cumpriram, você não")
- 20h — alerta de fogo ("Guilherme ainda não cumpriu")
- 22h — última chamada ("2h pro caos fechar")

---

## 3. TELAS (v1 = 6 telas)

1. **Quest do Dia** — card cinematográfico, hashtag, contador social, CUMPRI/PULEI.
   Antes das 7h: countdown ("o caos chega em 02:14:33")
2. **Streak** — número gigante, calendário do mês, melhor streak, vida disponível
3. **Ranking** — top streaks BR + fogos mais longos (fase 2 pode adiar)
4. **Arquivo do Caos** — quests passadas (FOMO retroativo)
5. **Álbum do Caos** — grid de cartas conquistadas + silhuetas das faltantes
6. **Perfil** — nome, título por streak, fogos ativos, card compartilhável

---

## 4. MECÂNICAS DE RETENÇÃO

### 4.1 Streak + Vidas
- Streak diário com perda real
- **1 vida a cada 24h**: falhou → vida absorve, streak sobrevive, MAS não ganha a carta
- Falhou de novo no ciclo sem vida → streak zera
- Vida extra comprável = streak freeze pago (ver monetização)

### 4.2 Cartas do Caos (colecionável)
- Cada quest cumprida = 1 carta única daquela quest (arte estilo Atmosfera Viral)
- Raridades: **Comum** (dia normal, P&B) · **Rara** (Sábado do Caos, vermelha) ·
  **Lendária** (semana completa sem falhar) · **Secreta** (easter eggs: antes das 8h,
  aniversário do app, etc.)
- Quest perdida = carta perdida (repescagem paga 1x/ano)
- **Temporadas de 90 dias** — visual novo de cartas por temporada
- Selo **PROVADO**: versão superior da carta para quem colou o link do TikTok
- Carta de dupla: 30 dias de fogo = lendária no álbum dos dois
- Fase 3: cartas físicas (sinergia com engine de colecionáveis do Casa Coffee Colab)

### 4.3 Fogo do Caos (streak em dupla, estilo Snapchat)
- Você + amigo: fogo aceso se AMBOS cumprirem no mesmo dia; um falha, apaga dos dois
- Adicionar por código/link (link de convite = aquisição)
- Marcos: 7d fogo normal → 30d azul → 90d branco 亡者
- Máx. 5 fogos simultâneos na v1
- Notificação 20h faz um usuário cobrar o outro (retenção terceirizada)

### 4.4 Títulos por streak
3d "Iniciado" → 7d "Agente do Caos" → 30d "Lenda" → 90d "亡者 do Caos"

---

## 5. VERIFICAÇÃO DE QUEST (DECISÃO FECHADA — ADR-006)

**Nunca hospedar vídeo próprio. Nunca live. Nunca feed interno.**
(custo de infra explode + moderação legal insustentável + canibaliza o post no TikTok)

Sistema em 3 camadas, custo ~zero:
1. **Honor system** — CUMPRI vale por si; streak + carta comum
2. **Prova leve** — colar link do TikTok (opcional) → carta com selo PROVADO
   (armazena só a URL; incentivo aponta pro post público = aquisição)
3. **Contestação social (fase 2)** — parceiro de fogo tem botão "duvido"; contestado
   precisa do link pra manter o dia. Rankings oficiais só contam dias provados.

Benchmark: Duolingo/BeReal/Snapchat não verificam nada e funcionam — quem trapaceia
um jogo cujo prêmio é a diversão sai sozinho em 2 semanas.

---

## 6. SISTEMA DE QUESTS

### 6.1 Padrão oficial de escrita (OBRIGATÓRIO)
```
TÍTULO CURTO
Comando de 1 linha.
Regra: 1 restrição que cria a dificuldade (e o momento engraçado do vídeo).
```
Lê em 3 segundos no feed. Cabe no card.

### 6.2 Regras de curadoria (inegociáveis)
- Nada ilegal, perigoso, ou que humilhe terceiros sem consentimento
- Alvo da piada é sempre o usuário, nunca o estranho
- Nada que dependa de dinheiro pra cumprir
- Executável em < 10 min · filmável na vertical (15–60s)
- Teste final: "eu faria isso sóbrio?" — se "quase", tá no ponto

### 6.3 Calendário semanal
Segunda leve → escala durante a semana → **SÁBADO DO CAOS** (a mais insana, carta rara).
Categorias em rotação: Social · Performance · Criativa · Caos doméstico (dias de chuva).

### 6.4 Banco inicial — 10 quests aprovadas

**001 — Modo Narrador** (Social, leve)
Narre sua vida em voz alta, em terceira pessoa, por 5 min em público.
Regra: não pode explicar pra ninguém o que está fazendo.
Carta: "O Narrador" — microfone antigo flutuando.

**002 — Aplauso Solo** (Performance, leve)
Aplauda de pé algo banal em público.
Regra: mínimo 10 segundos de palma.
Carta: "O Entusiasta" — mãos com raios.

**003 — Câmera Lenta** (Performance, médio)
Atravesse o corredor do mercado em câmera lenta.
Regra: riu, recomeça.
Carta: "O Protagonista" — cabelo ao vento congelado.

**004 — Terceira Pessoa** (Social, médio)
Peça algo no balcão falando de você em terceira pessoa.
Regra: até o fim do atendimento, sem quebrar.
Carta: "O Ilustre" — figura com placa "ELE".

**005 — Jantar Reverso** (Caos doméstico, leve)
Jante de costas pra mesa.
Regra: garfo por cima do ombro, sem olhar.
Carta: "O Contorcionista" — garfo sobre o ombro.

**006 — GPS Humano** (Social, médio)
Peça informação de um lugar que está na sua frente.
Regra: ouça a explicação inteira e agradeça.
Carta: "O Perdido" — seta de GPS apontando pro próprio pé.

**007 — Trilha Sonora** (Performance, médio)
Faça uma tarefa banal como cena de filme, com música épica no fone.
Regra: seriedade total, do início ao fim.
Carta: "O Épico" — fone em chamas.

**008 — Elogio Sniper** (Social, leve)
Elogie 3 estranhos em 10 minutos.
Regra: elogio específico, nada de "legal seu estilo".
Carta: "O Sniper do Bem" — coração na mira.

**009 — Entrevista Coletiva** (Caos doméstico/social, médio)
Responda todas as perguntas do dia como coletiva de imprensa.
Regra: vale o dia inteiro.
Carta: "O Ministro" — púlpito com 47 microfones.

**010 — SÁBADO DO CAOS: O Pedido** (Insana, rara)
Pergunte numa loja se vendem um item absurdo.
Regra: cara séria até sair da loja.
Carta: "O Cliente Misterioso" — sacola com interrogação, borda vermelha.

**Meta pré-lançamento:** banco de 90 quests (3 meses) escritas pelos 3 fundadores.
Quests são CURADAS, não geradas por IA em tempo real (ADR-004 — elimina custo de API
e melhora qualidade/segurança).

---

## 7. MONETIZAÇÃO (→ ADR própria)

**Princípio:** o loop principal é grátis pra sempre. Cobra-se proteção, status e extra —
nunca o caos. O usuário grátis É o marketing.

| Camada | Item | Preço | Nota |
|---|---|---|---|
| 1 | Vida extra (freeze) | R$ 4,90 | Compra emocional às 22h |
| 1 | Freeze de Fogo (salva a dupla) | R$ 6,90 | Compra por culpa |
| 2 | **CAOS+** assinatura | R$ 9,90/mês · R$ 79/ano | 2 vidas/mês, Modo Insano (quest extra diária), cartas foil, molduras/títulos exclusivos, estatísticas |
| 3 | Passe de Temporada | R$ 14,90/90d | Cosmético; destrava só cumprindo |
| 3 | Repescagem anual | R$ 9,90/evento | Recuperar cartas perdidas, 1x/ano |
| 3 | Carta física | R$ 19,90 + frete | Só lendárias; sinergia Casa Coffee |
| 4 | Quest patrocinada | negociado | Máx 1/semana, só com 50k+ MAU, quest tem que ser boa por si |

**CAOS+ NUNCA inclui:** ver quest antes das 7h · carta sem cumprir · remover marca do card.
**NUNCA fazer:** banner/interstitial · pay-to-win na coleção · paywall no loop básico.

**Sequência:** v1 100% grátis → vidas pagas quando existirem streaks >14d → CAOS+ →
temporadas/marcas.

**Âncora de expectativa:** 10k MAU ≈ R$ 4–5k/mês. O modelo só escala o que o TikTok
trouxer — a aposta é o viral.

---

## 8. STACK & CUSTO (→ ADR-001)

- **Frontend:** React + TypeScript + Vite — **PWA** na v1 (sem app store)
- **Backend:** Supabase free (auth, Postgres, RLS obrigatória em toda tabela)
- **Deploy:** Vercel free, deploy automático no push para main
- **Push:** Web Push via service worker (grátis)
- **Vídeo:** ZERO infra de vídeo — TikTok faz esse trabalho
- **Custo mensal alvo da v1: R$ 0** (único custo real = tempo criativo das quests)
- Convenções Kora: SQL snake_case · JS camelCase · componentes PascalCase ·
  migrations `YYYYMMDD_descricao.sql`

---

## 9. IDENTIDADE VISUAL (→ docs/02_DESIGN_SYSTEM)

Estética Atmosfera Viral: preto profundo, branco, vermelho escuro, grain/haze,
texto mínimo, emoção sobre informação. Assinatura 「亡者」 nos marcos de 90 dias.
**O card da quest tem que ser reconhecível em 0,5s no feed — o card É o marketing.**

---

## 10. ROADMAP

| Fase | Escopo |
|---|---|
| **v1 (MVP)** | Quest do dia + streak + vidas + cartas comuns/raras + álbum + CUMPRI com link opcional + 4 pushes. 100% grátis. |
| **v2** | Fogo do Caos completo + contestação "duvido" + ranking oficial (dias provados) + monetização camadas 1–2 + Modo Insano |
| **v3** | Passe de temporada + repescagem + quests colab (ver §11) + cartas físicas + quests patrocinadas + Semana Turbo (evento 2 quests/dia, 1x/temporada) |

---

## 11. PARKING LOT — Quests Colab (fase 3, NÃO construir antes)

Depende do grafo social que o Fogo constrói primeiro. Três formatos:
- **Dupla** — quest que exige duas pessoas no mesmo vídeo (desbloqueada por fogo ativo)
- **Squad** — 3–8 amigos; Sábado do Caos vira quest de squad com streak coletivo;
  carta de squad = a mais rara do jogo
- **Sync nacional** — quest com horário marcado (flashmob distribuído; exige massa crítica)
Validação: honor system + vídeo com hashtag (igual individual).

---

## 12. ADRs A REGISTRAR NA FUNDAÇÃO

| ADR | Decisão | Motivo |
|---|---|---|
| 001 | Stack React+TS+Vite+Supabase+Vercel, PWA, tier gratuito | Padrão Kora, custo zero |
| 002 | 1 quest/dia sincronizada nacional | Sync é o produto; 6/dia dilui hashtag, inviabiliza execução física e sextuplica curadoria |
| 003 | Cartas colecionáveis por quest + temporadas 90d | Retenção de longo prazo pós-quebra de streak |
| 004 | Quests curadas por humanos, não geradas por IA | Custo zero de API, qualidade, segurança legal |
| 005 | Sistema de vidas (1/24h) em vez de freeze mensal | Mais claro, decisão dramática diária, monetiza melhor |
| 006 | Verificação: honor system + link TikTok opcional + contestação social. Nunca hospedar vídeo | Custo, moderação legal, e o post externo é o canal de aquisição |
| 007 | Fogo do Caos (streak em dupla) | Culpa social > disciplina individual; retenção terceirizada |
| 008 | Monetização: proteção/status/extra; loop grátis pra sempre | Usuário grátis é o marketing; watermark nunca à venda |
| 009 | Nome oficial: **Caos Diário** · hashtag `#CaosDia{N}` · universo de marca na família "Caos" (Sábado do Caos, Fogo do Caos, Cartas do Caos, CAOS+) | Nome carrega o universo inteiro de forma coesa. Alternativa "Duvidei!!!" foi considerada e descartada (registro histórico) |

---

## 13. MÉTRICAS-NORTE

1. **% que cumpre a quest do dia** (< 30% = quest errada, não usuário errado)
2. Retenção D7 / D30
3. **% de usuários com ≥1 fogo ativo** (aposta: maior preditor de D30)
4. Coeficiente viral: vídeos com hashtag ÷ downloads
5. Cartas/usuário · % de CUMPRI com link (taxa de prova)

---

## COMO USAR ESTE ARQUIVO

1. Criar a pasta do projeto e colocar este arquivo na raiz
2. Abrir Claude Code na pasta e rodar a skill `fundacao-de-projeto`
3. No intake, apontar este documento como fonte — as respostas estão todas aqui
   (produto §1 · público §1 · stack/custo §8 · segurança §8 · decisões §12)
4. Multi-tenant: **NÃO** na v1 — produto B2C único, sem white-label
   (registrar como exceção consciente ao padrão em ADR)
5. Após scaffold: preencher memory/identity.md e docs/00_VISAO a partir do §1,
   ADRs do §12, backlog do §10
6. Nenhuma linha de código antes do checklist de validação da fundação passar
