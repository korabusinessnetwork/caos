// =============================================================================
// _shared/dominio — kernel de regras puras REUSADO do app (fonte única de verdade)
// =============================================================================
// Estas são AS MESMAS funções puras de src/lib/dominio já cobertas pelos 32
// testes (CLAUDE.md: streak/vida/raridade nascem com teste; a regra vive num
// lugar só). O servidor não reimplementa a regra — importa a mesma.
//
// Por que dá pra importar do app aqui: streak.ts, tiktok.ts e datas.ts NÃO
// importam nada internamente, então o Deno resolve o grafo com extensão .ts
// explícita, sem esbarrar em imports sem extensão (só cartas.ts tem, e não é
// usado no servidor — a carta do dia vem de quests.carta_id).
//
// Se algum dia o Supabase CLI não empacotar imports acima de functions/, o
// conserto é copiar esses três arquivos puros pra cá — a regra continua uma só.
// =============================================================================

export { processarDia } from '../../../src/lib/dominio/streak.ts';
export type { EstadoStreak, ResultadoDia } from '../../../src/lib/dominio/streak.ts';
export { ehUrlTikTokValida } from '../../../src/lib/dominio/tiktok.ts';
export { chaveDiaCaos } from '../../../src/lib/dominio/datas.ts';
export { recarregarVidas, VIDAS_INTERVALO_MS } from '../../../src/lib/dominio/vidas.ts';
export type { EstadoVidas, ResultadoRecarga } from '../../../src/lib/dominio/vidas.ts';
