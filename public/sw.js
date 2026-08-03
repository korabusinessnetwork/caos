/**
 * Service Worker do Caos Diário — PWA instalável + Web Push (ADR-001).
 *
 * Sem libs (custo R$0): cache simples do shell + handlers de push e de clique.
 * Os 4 toques diários (7h/12h/20h/22h) chegam aqui pelo evento 'push', enviados
 * por uma Edge Function com service_role — o cliente nunca dispara push.
 *
 * Suba a versão do cache (CAOS_CACHE) a cada mudança de shell pra invalidar.
 */

const CAOS_CACHE = 'caos-shell-v1';
const SHELL = ['/', '/index.html', '/icon.svg', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  // Pré-cacheia o shell; se algum recurso falhar, não trava a instalação.
  event.waitUntil(
    caches
      .open(CAOS_CACHE)
      .then((cache) => cache.addAll(SHELL))
      .catch(() => {}),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Limpa caches de versões antigas e assume o controle das abas abertas.
  event.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(
          chaves.filter((k) => k !== CAOS_CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Não intercepta terceiros (Supabase, TikTok) — deixa a rede resolver.
  if (url.origin !== self.location.origin) return;

  // Navegação: rede primeiro; offline cai pro shell em cache (nunca tela em branco).
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(
        () =>
          caches.match('/index.html').then((r) => r || caches.match('/')),
      ),
    );
    return;
  }

  // Estáticos (nome com hash = imutáveis): cache primeiro, popula em background.
  event.respondWith(
    caches.match(req).then((cacheado) => {
      if (cacheado) return cacheado;
      return fetch(req).then((resp) => {
        if (resp.ok && resp.type === 'basic') {
          const copia = resp.clone();
          caches.open(CAOS_CACHE).then((cache) => cache.put(req, copia));
        }
        return resp;
      });
    }),
  );
});

// --- Web Push: os 4 toques diários ---------------------------------------
self.addEventListener('push', (event) => {
  let dados = {};
  try {
    dados = event.data ? event.data.json() : {};
  } catch {
    dados = {};
  }

  const titulo = dados.titulo || 'Caos Diário';
  const opcoes = {
    body: dados.corpo || 'A quest de hoje caiu. Cumpra o caos.',
    icon: '/icon.svg',
    badge: '/icon.svg',
    tag: dados.tag || 'caos',
    renotify: true,
    data: { url: dados.url || '/' },
    vibrate: [80, 40, 80],
  };
  event.waitUntil(self.registration.showNotification(titulo, opcoes));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const destino =
    (event.notification.data && event.notification.data.url) || '/';

  // Foca uma aba já aberta (e navega) ou abre uma nova.
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientes) => {
        for (const c of clientes) {
          if ('focus' in c) {
            if ('navigate' in c) c.navigate(destino);
            return c.focus();
          }
        }
        return self.clients.openWindow(destino);
      }),
  );
});
