/**
 * Registro do Service Worker (PWA instalável, ADR-001).
 *
 * Só registra em produção: em dev o SW cacheia assets e atrapalha o HMR do Vite.
 * O app é 100% funcional sem o SW — ele é progressivo (installability + push).
 * A inscrição de push em si vive em `push.ts` e registra o SW sob demanda.
 */

const CAMINHO_SW = '/sw.js';

export function registrarServiceWorker(): void {
  if (!import.meta.env.PROD) return; // dev: não mexe com o HMR
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register(CAMINHO_SW).catch(() => {
      /* SW é progressivo: o app segue funcionando sem ele */
    });
  });
}
