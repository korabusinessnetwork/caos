/**
 * Validação da URL de TikTok colada pelo usuário (CLAUDE.md: validar input
 * antes de qualquer operação no banco; ADR-006: guardamos só a URL do post).
 *
 * Aceita apenas https e hostname do TikTok (tiktok.com ou subdomínio como
 * www./vm./vt.). Rejeita hosts que só contêm "tiktok" para enganar
 * (ex.: eviltiktok.com, tiktok.com.evil.com).
 */
export function ehUrlTikTokValida(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;

  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return false;
  }

  if (parsed.protocol !== 'https:') return false;

  const host = parsed.hostname.toLowerCase();
  return host === 'tiktok.com' || host.endsWith('.tiktok.com');
}
