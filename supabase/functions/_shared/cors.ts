// Cabeçalhos CORS compartilhados pelas Edge Functions chamadas do navegador
// (ex.: excluir-conta). As funções de cron (enviar-toque, publicar-quest) não
// precisam, mas herdam sem prejuízo.

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/** Resposta JSON já com CORS. */
export function json(corpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
