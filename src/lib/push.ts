/**
 * Serviço de Web Push — os 4 toques diários (7h/12h/20h/22h). Web Push nativo =
 * custo R$0 (ADR-001).
 *
 * Fluxo: detectar suporte → pedir permissão → criar a inscrição do navegador
 * (PushSubscription, com a VAPID pública de import.meta.env) → PERSISTIR na
 * tabela push_subscriptions (RLS por auth.uid()). O DISPARO dos toques roda no
 * servidor (Edge Function `enviar-toque` com service_role) — nunca no cliente.
 *
 * Segurança: nada de dado sensível em log; a inscrição só é salva com sessão.
 */
import { supabase } from './supabase';
import { usuarioAtual } from './auth';

const CAMINHO_SW = '/sw.js';

/** O navegador suporta Service Worker + Push + Notification? */
export function pushSuportado(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/** Estado atual da permissão de notificação. */
export function permissaoAtual(): NotificationPermission {
  if (typeof Notification === 'undefined') return 'denied';
  return Notification.permission;
}

/** Pede permissão de notificação (deve ser chamado num gesto do usuário). */
export async function pedirPermissao(): Promise<NotificationPermission> {
  if (!pushSuportado()) return 'denied';
  return Notification.requestPermission();
}

/**
 * Cria (ou reusa) a inscrição de push do navegador. Retorna a PushSubscription
 * — a persistência no backend fica em `salvarInscricao` (chamada por
 * `ativarNotificacoes`). Lança se não houver suporte, permissão negada ou VAPID ausente.
 */
export async function inscreverPush(): Promise<PushSubscription> {
  if (!pushSuportado()) {
    throw new Error('Seu navegador não suporta notificações.');
  }

  const chaveVapid = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (!chaveVapid) {
    throw new Error('Configuração de push ausente (VAPID).');
  }

  const permissao = await pedirPermissao();
  if (permissao !== 'granted') {
    throw new Error('Permissão de notificação negada.');
  }

  const registro = await navigator.serviceWorker.register(CAMINHO_SW);
  await navigator.serviceWorker.ready;

  const existente = await registro.pushManager.getSubscription();
  if (existente) return existente;

  return registro.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: base64UrlParaUint8Array(chaveVapid),
  });
}

/** Cancela a inscrição de push do navegador (opt-out). */
export async function cancelarPush(): Promise<boolean> {
  if (!pushSuportado()) return false;
  const registro = await navigator.serviceWorker.getRegistration(CAMINHO_SW);
  const inscricao = await registro?.pushManager.getSubscription();
  if (!inscricao) return false;
  return inscricao.unsubscribe();
}

/**
 * Persiste a inscrição do navegador na tabela push_subscriptions (RLS: dono).
 * Idempotente: o mesmo endpoint faz upsert, não duplica. Exige sessão.
 */
export async function salvarInscricao(inscricao: PushSubscription): Promise<void> {
  const dados = inscricao.toJSON();
  const endpoint = dados.endpoint;
  const p256dh = dados.keys?.p256dh;
  const auth = dados.keys?.auth;
  if (!endpoint || !p256dh || !auth) {
    throw new Error('Inscrição de push incompleta.');
  }

  const usuario = await usuarioAtual();
  if (!usuario) {
    throw new Error('Entre pra ativar as notificações.');
  }

  const { error } = await supabase
    .from('push_subscriptions')
    .upsert(
      { user_id: usuario.id, endpoint, p256dh, auth },
      { onConflict: 'endpoint' },
    );
  if (error) throw new Error('Não deu pra salvar a inscrição de push.');
}

/** Remove a inscrição do backend (opt-out completo). */
async function removerInscricao(endpoint: string): Promise<void> {
  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('endpoint', endpoint);
  if (error) throw new Error('Não deu pra remover a inscrição de push.');
}

/**
 * Liga as notificações de ponta a ponta: inscreve no navegador e persiste.
 * É o que a UI chama no "ativar" (ex.: oferta após o 1º CUMPRI — fluxos.md).
 */
export async function ativarNotificacoes(): Promise<void> {
  const inscricao = await inscreverPush();
  await salvarInscricao(inscricao);
}

/** Desliga as notificações: cancela no navegador e apaga do backend. */
export async function desativarNotificacoes(): Promise<void> {
  const registro = await navigator.serviceWorker.getRegistration(CAMINHO_SW);
  const inscricao = await registro?.pushManager.getSubscription();
  const endpoint = inscricao?.endpoint;
  await cancelarPush();
  if (endpoint) await removerInscricao(endpoint);
}

/** Converte a chave VAPID (base64url) no formato exigido pelo PushManager. */
function base64UrlParaUint8Array(base64Url: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, '+').replace(/_/g, '/');
  const bruto = atob(base64);
  const saida = new Uint8Array(new ArrayBuffer(bruto.length));
  for (let i = 0; i < bruto.length; i++) {
    saida[i] = bruto.charCodeAt(i);
  }
  return saida;
}
