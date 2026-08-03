# Prompts & Curadoria de Quests — Caos Diário

> Quests são **curadas por humanos**, nunca geradas por IA em runtime (ADR-004).
> Um LLM pode ajudar a *rascunhar* na fase de curadoria — o humano aprova.
> Última atualização: 2026-07-24.

## Prompt-guia para rascunhar quests (uso interno da curadoria)

> Assistente ajuda a gerar ideias; **a decisão final é sempre humana** (Matheus/Guilherme/Macedo).

```
Você ajuda a rascunhar quests para o "Caos Diário": um jogo em que, todo dia às 7h,
o Brasil inteiro recebe a MESMA missão absurda, cumpre no mundo real, filma e posta
no TikTok. Gere N quests seguindo EXATAMENTE este formato:

TÍTULO CURTO
Comando de 1 linha.
Regra: 1 restrição que cria a dificuldade (e o momento engraçado do vídeo).

Regras inegociáveis:
- Nada ilegal, perigoso, ou que humilhe terceiros sem consentimento.
- O alvo da piada é SEMPRE o usuário, nunca o estranho.
- Nada que dependa de dinheiro para cumprir.
- Executável em < 10 min, filmável na vertical (15–60s).
- Lê em 3 segundos no feed; cabe no card.
- Teste final: "eu faria isso sóbrio?" — se "quase", está no ponto.

Categoria: [Social | Performance | Criativa | Caos doméstico].
Intensidade: [leve | médio | Sábado do Caos (insana)].
Para cada quest, sugira também o nome da carta e uma imagem-conceito.
```

## Checklist de aprovação (antes de agendar)

- [ ] Segue o formato (título + comando + 1 regra)?
- [ ] Passa nas regras de curadoria (legal, seguro, alvo = usuário, sem dinheiro)?
- [ ] Cumprível em < 10 min e filmável 15–60s vertical?
- [ ] Lê em 3s e cabe no card?
- [ ] Tem carta definida (nome + conceito + raridade)?
- [ ] Encaixa no calendário semanal (leve → escala → Sábado do Caos)?

## Exemplo aprovado (do banco inicial)

```
MODO NARRADOR
Narre sua vida em voz alta, em terceira pessoa, por 5 min em público.
Regra: não pode explicar pra ninguém o que está fazendo.
Carta: "O Narrador" — microfone antigo flutuando. (Social, leve)
```

## Anti-exemplos (reprovados)
- ❌ "Assuste um desconhecido." → alvo é terceiro.
- ❌ "Compre um café e..." → depende de dinheiro.
- ❌ "Vá a um estabelecimento e realize uma interação social prolongada..." → corporativês, não cabe no card.

## Ligações
- `memory/patterns.md` — padrão OBRIGATÓRIO de escrita de quest.
- `docs/03_REGRAS_DE_NEGOCIO` §6 — sistema de quests e calendário.
- `docs/09_BACKLOG` — meta de 90 quests.
