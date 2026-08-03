# Identidade do Produto — Caos Diário

## Objetivo
- Documentar a identidade, visão e diferencial do produto
- Guiar decisões de produto, design e comunicação
- Manter coerência em todos os pontos de contato com o usuário

## Contexto
- Mercado/vertical: Social / entretenimento / gamificação de hábito (Brasil)
- Estágio: MVP (ideação/MVP/crescimento/escala)
- Competidores diretos: BeReal, Duolingo, Snapchat (streaks) — nenhum com quest sincronizada nacional
- Venture: Kora Business Network. Curadoria de quests: Matheus + Guilherme + Macedo. Lançamento via Atmosfera Viral.

## Regras Gerais
- Identidade é fonte de verdade para mensagens, tone of voice, visual
- Personas e públicos-alvo devem guiar todo novo recurso
- Posicionamento não muda sem revisão de mercado (e ADR)
- A família de marca "Caos" é coesa: Sábado do Caos, Fogo do Caos, Cartas do Caos, CAOS+

## Validações
- Cada mensagem ao público alinha com a fórmula de posicionamento?
- Personas refletem o público real (16–30, TikTok pesado)?

## Permissões
- Dono do produto: Matheus (ajusta propósito, persona, roadmap)
- Design/marketing: aplica tom e identidade visual (Atmosfera Viral)

## Exceções
- Decisões de posicionamento exigem ADR

## Auditoria
- Revisar identidade trimestralmente contra mercado e métricas-norte

## Eventos
- `product.identity_defined`, `product.positioning_updated`, `persona.identified`

## Configurações Futuras
- Testes de posicionamento com usuários reais
- Pesquisa de marca (awareness, recall) pós-viral

## Casos de Uso
- Briefar novo membro do time (os 3 fundadores curadores)
- Validar novo recurso contra identidade
- Decidir se entra/sai roadmap

## Critérios de Aceite
- [x] Propósito central claro
- [x] Personas documentadas com dores reais
- [x] Tom de voz com exemplos ✅ e ❌
- [x] Roadmap definido até Fase 3

---

## Propósito Central

### Visão
Ser o **ritual diário coletivo do Brasil**: um evento nacional às 7h em que milhões
fazem a mesma coisa absurda no mesmo dia, e o TikTok inteiro vira feed de comparação.
Não um app de streak a mais — o jogo que existe **por cima** do TikTok e o alimenta.

### Propósito
O que Caos Diário faz e por quê
- **Problema que resolve:** apps de hábito/streak são solitários e sem alcance; o TikTok tem alcance mas nada transforma o desafio diário num jogo coletivo nacional.
- **Como resolvemos:** uma quest **sincronizada nacional** por dia — todos recebem a MESMA às 7h. O sync é o produto: hashtag concentrada (`#CaosDia{N}`), feed de comparação, evento coletivo. O app é a camada de jogo (streak, vidas, cartas); o vídeo no TikTok é o canal de aquisição (CAC zero).
- **Impacto esperado:** viralidade orgânica — cada usuário grátis vira marketing; o coeficiente viral (vídeos com hashtag ÷ downloads) é a alavanca de crescimento.

## Público-Alvo

| Segmento | Perfil | Contexto | Necessidade |
|---|---|---|---|
| Caçador de Streak | 16–30, disciplinado, competitivo | Já mantém streaks (Duolingo, Snap) | Não quebrar a sequência; status por consistência |
| Viralizador | 16–24, criador nato de TikTok | Posta todo dia, caça o vídeo que bomba | Material pronto e diário pra viralizar |
| Colecionador de Cartas | 16–30, gosta de coleção/completar | Fã de álbum, raridade, temporada | Completar o álbum; cartas raras/lendárias |

## Valores
- **O caos é grátis:** o loop nunca é pago. Cobra-se proteção/status/extra.
- **Emoção sobre informação:** o produto sente antes de explicar.
- **Alvo da piada é sempre o usuário**, nunca o estranho.
- **O usuário grátis é o marketing:** todo design serve à viralidade orgânica.

## Posicionamento

**Para** jovens de 16–30 pesados de TikTok / **que** cansaram de desafios solitários e sem plateia / **Caos Diário** é o jogo diário de quests absurdas sincronizadas com o Brasil inteiro / **que** entrega uma missão coletiva por dia e material pronto pra viralizar / **Diferente de** BeReal, Duolingo e streaks de Snapchat / **entrega** um evento nacional simultâneo com hashtag concentrada e coleção de cartas.

## Tom de Voz

**Princípios:** provocador, cúmplice, seco. Fala como o amigo que te empurra pro caos, não como app de produtividade.

**Exemplos:**
- ✅ "A QUEST DE HOJE CAIU."
- ✅ "8.412 já cumpriram. Você não."
- ❌ "Sua missão diária está disponível! Complete para ganhar pontos."

**Tom:** curto, urgente, um pouco cruel de leve. Zero jargão, zero corporativês.

## Manifesto (versão 1.0)
1. **O caos é coletivo** — a mesma quest, no mesmo dia, pro Brasil inteiro.
2. **Cumprir é o prêmio** — a diversão é o loot; quem trapaceia sai sozinho.
3. **O usuário e a diversão são soberanos** — nunca cobramos o caos, nunca vendemos o watermark.

## Personas (3)

### Bia, a Caçadora de Streak
- **Contexto:** 19 anos, faculdade, já tem 400 dias de Duolingo.
- **Dores:** medo de perder o streak; disciplina sem plateia é sem graça.
- **Objetivos:** manter a sequência, subir de título, ganhar a carta do dia.
- **Sucesso:** streak longo + álbum crescendo sem furos.

### Léo, o Viralizador
- **Contexto:** 22 anos, posta todo dia no TikTok, quer o vídeo que estoura.
- **Dores:** ficar sem ideia de conteúdo; algoritmo imprevisível.
- **Objetivos:** material diário pronto, hashtag concentrada, aparecer no feed coletivo.
- **Sucesso:** vídeo com a hashtag do dia bombando; selo PROVADO na carta.

### Duda, a Colecionadora
- **Contexto:** 17 anos, fã de álbum/figurinha, gosta de completar tudo.
- **Dores:** FOMO de carta perdida; álbum incompleto.
- **Objetivos:** completar a temporada, pegar as lendárias/secretas.
- **Sucesso:** álbum cheio, cartas raras, fogo de 90 dias com a amiga.

## Princípios do Produto
- Intuitividade acima de tudo (sem manual) — princípio nº1.
- O loop é grátis pra sempre; monetiza-se proteção/status/extra.
- O card é reconhecível em 0,5s no feed — o card é o marketing.
- Verificação por honra + link opcional; nunca hospedar vídeo.

## Identidade Visual (marca)
- **Cores primárias:** preto profundo, branco, vermelho escuro.
- **Tom visual:** grain/haze, texto mínimo, emoção sobre informação (estética Atmosfera Viral).
- **Assinatura:** 「亡者」 nos marcos de 90 dias.
- **Logo/símbolo:** universo "Caos"; card cinematográfico com marca fixa (watermark inegociável).

## Roadmap

- **Fase 0 (Ideação):** ✅ concepção + banco inicial de 10 quests; meta pré-lançamento de 90 quests.
- **Fase 1 (MVP):** Quest do dia + streak + vidas + cartas comuns/raras + álbum + CUMPRI com link opcional + 4 pushes. 100% grátis.
- **Fase 2:** Fogo do Caos completo + contestação "duvido" + ranking oficial (dias provados) + monetização camadas 1–2 + Modo Insano.
- **Fase 3:** Passe de temporada + repescagem + quests colab (dupla/squad/sync) + cartas físicas + quests patrocinadas + Semana Turbo.
