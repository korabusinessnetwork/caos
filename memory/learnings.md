# Aprendizados — Caos Diário

## Objetivo
- Manter memória viva do que aprendemos construindo o produto
- Documentar raciocínios antes de virarem padrão ou decisão
- Evitar repetir o mesmo erro 6 meses depois

## Contexto
- Aprendizados vêm de: uso em produção, feedback de usuário, post-mortems, code review
- Aprendizado que consolida = migra para `memory/patterns.md` ou `memory/decisions.md`

## Regras Gerais
- Aprendizado é **observação real**, não especulação
- Data + contexto são obrigatórios
- Ação recomendada (implementar, pesquisar, descartar) sempre presente

## Validações
- Aprendizado veio de situação real (não teoria)?
- Tem recomendação de ação concreta?

## Permissões
- Qualquer um documenta aprendizado (PR adiciona linha)
- Tech lead: promove para padrão/decisão

## Exceções
- Aprendizado crítico (segurança/compliance): entra imediatamente mesmo in-progress

## Auditoria
- Revisar aprendizados mensalmente, promover consolidados
- Descartar aprendizados superados sem remorso

## Eventos
- `learning.documented`, `learning.promoted_to_pattern`, `learning.archived`

## Casos de Uso
- "Já testamos esse tipo de quest antes? Como foi o engajamento?"
- "Por que a retenção caiu na semana X?"
- Pesquisa de causa-raiz pós-incidente

## Critérios de Aceite
- [ ] Cada aprendizado tem data + contexto real
- [ ] Cada aprendizado linkado a issue/PR quando aplicável
- [ ] Ação clara (implementar agora / pesquisar / descartar)

---

> **Projeto em fundação (2026-07-24).** Ainda não há produção, então não há
> aprendizados observados. As tabelas abaixo nascem vazias de propósito — a
> primeira linha real entra quando houver dado de uso, feedback ou post-mortem.
> Não inventar aprendizado sem evidência.

## Aprendizados Técnicos

| Data | Aprendizado | Lição/Ação |
|---|---|---|
| 2026-08-02 | `fechar-o-dia`: recarga de vida (24h) na ordem **recarga→falta** com rollover diário torna o streak **imortal** — a vida volta a tempo de absorver a falta do dia seguinte, contra ADR-005 ("sem streak que nunca morre"). Pego no `/review`, não em produção. | Ordem correta: **falta-antes-de-recarga** (a 2ª falta consecutiva zera). Toda mecânica com timer de recarga ≈ cadência de perda precisa checar o caso-limite de sincronia dos dois relógios. |
| 2026-08-02 | Edge Functions Deno só reusam `src/lib/dominio` via `_shared/dominio.ts` para módulos **sem imports internos** (`streak`/`vidas`/`tiktok`/`datas`); Deno exige extensão `.ts` e `cartas.ts` importa `./tiktok` sem extensão → não dá pra reexportar pelo shim. | Reexportar pelo shim só os módulos-folha; regra que dependa de `cartas.ts` compõe-se **dentro** da função (como no `processar-cumpri`). |

## Aprendizados de Produto

| Data | Aprendizado | Lição/Ação |
|---|---|---|
| _(vazio — medir após 1ª quest ao vivo: taxa de CUMPRI, coeficiente viral)_ | | |

## Aprendizados de Processo

| Data | Aprendizado | Lição/Ação |
|---|---|---|
| _(vazio)_ | | |

## Aprendizados de Negócio

| Data | Aprendizado | Lição/Ação |
|---|---|---|
| _(vazio — validar hipótese de CAC-zero via TikTok antes de assumir)_ | | |

---

## Hipóteses de Fundação a Validar (não são aprendizados ainda)

> Registradas para não confundir crença com fato. Viram aprendizado só com dado.

| Hipótese | Como validar | Métrica-norte |
|---|---|---|
| O sync nacional gera hashtag concentrada suficiente pra viralizar | Rodar dias 1–7 e medir vídeos com `#CaosDia{N}` | Coeficiente viral = vídeos ÷ downloads |
| A carta diária puxa retenção (colecionador volta) | Comparar D1/D7 de quem ganhou carta vs. não | Retenção D7 |
| Verificação por honra é suficiente (fraude é irrelevante) | Observar % de contestação "duvido" na fase 2 | Taxa de contestação |

## Aprendizados Promovidos → Padrão

| Aprendizado Original | Data Promo | Padrão Resultado | Status |
|---|---|---|---|
| _(nenhum ainda)_ | — | — | — |

## Aprendizados Promovidos → Decisão

| Aprendizado Original | Data Promo | ADR Resultado | Status |
|---|---|---|---|
| _(nenhum ainda)_ | — | — | — |

## Limpeza Periódica

**Última revisão**: 2026-07-24 (fundação — nada a limpar)
