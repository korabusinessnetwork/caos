# Restrições Permanentes — Caos Diário

## Objetivo
- Documentar limites e restrições que guiam decisões
- Evitar caminhos bloqueados (custo, legal, ético, técnico, produto)
- Forçar atualização de restrições vencidas

## Contexto
- Restrição = barreira dura; exceção exige ADR
- Revisão: trimestral (próxima: 2026-10-24)

## Regras Gerais
- Nenhuma restrição ignorada sem ADR formal de exceção
- Restrições legais/compliance têm prioridade máxima
- Restrição vencida é removida; não acumula dívida técnica

## Validações
- Restrição tem justificativa concreta?
- Data de revisão planejada está clara?

## Permissões
- Dono/compliance: aprova exceção de restrição legal
- Tech lead: aprova exceção técnica

## Exceções
- Restrição legal pode ser flexibilizada só por decisão explícita do dono com ADR (raro)

## Auditoria
- Revisar todas as restrições contra realidade trimestralmente
- Exceção aprovada vira ADR público

## Eventos
- `restriction.added`, `restriction.excepted`, `restriction.lifted`

## Casos de Uso
- "Posso hospedar o vídeo no app?" → NÃO (ver abaixo)
- "Posso vender remoção do watermark?" → NÃO
- "Posso gerar quest com IA em runtime?" → NÃO (ADR-004)

## Critérios de Aceite
- [x] Cada categoria tem ≥ 1 restrição preenchida
- [x] Restrições com data de revisão clara
- [x] Exceções aprovadas linkadas a ADR

---

## Restrições Técnicas

| Restrição | Detalhes | Revisão | Exceção |
|---|---|---|---|
| **ZERO infra de vídeo** | Nunca hospedar vídeo próprio, nunca live, nunca feed interno. Guardar só a URL do TikTok. | 2026-10-24 | Nunca. É o núcleo do ADR-006 |
| Só chave `anon` no front | `service_role` do Supabase jamais no cliente | 2026-10-24 | Nunca |
| Sem lib paga na v1 | Tudo em tier free (Supabase/Vercel/Web Push) | 2026-10-24 | ADR se escalar |
| Sem geração de quest por IA em runtime | Quests são curadas por humanos (ADR-004) | 2026-10-24 | ADR se mudar |

## Restrições Legais / Compliance

| Restrição | Detalhes | Prioridade | Revisão |
|---|---|---|---|
| **Público inclui menores (16+)** | Cuidado LGPD redobrado; nada de dado sensível além do necessário; consentimento claro | CRÍTICA | 2026-10-24 |
| LGPD: consentimento explícito | Opt-in antes de coletar e-mail e ao habilitar push | CRÍTICA | 2026-10-24 |
| Direito de exportar/excluir | Usuário pode exportar (streak, cartas) e apagar a conta a qualquer momento | CRÍTICA | 2026-10-24 |
| Quest nunca ilegal/perigosa | Curadoria proíbe: ilegal, perigoso, ou humilhar terceiros sem consentimento | CRÍTICA | 2026-10-24 |
| Sem hospedar UGC | Não guardamos vídeo → não somos plataforma de conteúdo → sem dever de moderação de vídeo | CRÍTICA | 2026-10-24 |

## Restrições de Custo (Fase Bootstrap)

**Diretriz Geral:** priorizar meios **gratuitos**. Toda implementação com custo relevante é **ADIADA por padrão**, salvo decisão explícita do dono. Alvo: **R$ 0/mês na v1**.

Ao esbarrar em algo pago, seguir o checklist: custo aproximado · alternativa gratuita · impacto · recomendação (agora × depois) · decisão do dono.

| Item | Custo Aprox | Alt Grátis | Impacto | Status |
|---|---|---|---|---|
| Gateway de pagamento (assinatura CAOS+) | ~% + fixo/tx | — (loop grátis na v1) | ALTA | [ADIADO → fase 2, quando existir streak >14d] |
| Push provider pago (OneSignal etc.) | R$ variável | Web Push nativo via service worker (grátis) | ALTA | [ADIADO, usar Web Push] |
| Hospedagem de vídeo/CDN | Alto | TikTok hospeda (grátis p/ nós) | CRÍTICA | [NUNCA — ADR-006] |
| Geração de arte de carta por IA paga | R$/img | Arte curada estilo Atmosfera Viral | MÉDIA | [ADIADO, curadoria manual] |
| Analytics pago (Mixpanel) | R$ 200+/mês | PostHog/Plausible grátis | MÉDIA | [ADIADO, usar grátis] |

## Restrições de Produto (inegociáveis)

| Restrição | Detalhes | Por quê | Exceção |
|---|---|---|---|
| **O loop é grátis pra sempre** | Quest → cumprir → filmar → postar → CUMPRI → streak → carta nunca tem paywall | Usuário grátis é o marketing | Nunca |
| **Watermark do card nunca à venda** | Não existe compra que remove a marca do card | O card É o canal de aquisição | Nunca |
| **Sem pay-to-win na coleção** | Não vender carta sem cumprir; não vender vantagem de ranking | Integridade do jogo | Nunca |
| **CAOS+ nunca inclui** | Ver quest antes das 7h · carta sem cumprir · remover marca | Quebraria o produto | Nunca |
| **1 quest/dia sincronizada** | Não fragmentar (não é 1 a cada 4h) | Sync é o produto (ADR-002/005) | ADR |
| **Single-tenant, marca única** | Sem tenant_id, sem white-label na v1 | B2C direto (ADR-010) | ADR-010 revoga |

## Restrições Éticas

| Restrição | Detalhes | Revisão |
|---|---|---|
| Alvo da piada = sempre o usuário | Nunca humilhar o estranho/terceiro no vídeo | Contínuo |
| Sem dark patterns | Cancelar assinatura é tão fácil quanto assinar; sem auto-renovação escondida | Contínuo |
| Notificação de culpa é jogo, não assédio | O "Guilherme ainda não cumpriu" é lúdico e desativável | Contínuo |
| Quest não depende de dinheiro | Nada que exija gastar pra cumprir | Contínuo |

---

## Plano de Revisão
- **Próxima revisão legal/compliance:** 2026-10-24
- **Próxima revisão técnica:** 2026-10-24
- **Próxima revisão de custo:** 2026-10-24
- **Proprietário de cada seção:** Matheus (dono)

## Exceções Aprovadas (ADRs)

| Restrição | ADR | Data Exceção | Contexto |
|---|---|---|---|
| Multi-tenant white-label (padrão Kora) | ADR-010 | 2026-07-24 | Produto B2C único; marca "Caos" fixa. Isolamento por usuário, não por tenant |
