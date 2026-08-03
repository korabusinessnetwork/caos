/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// PWA/service worker entram no M4 (vite-plugin-pwa). Aqui: base do app + testes.
// server.port honra a env PORT (o preview atribui uma porta livre) e cai na 5173
// só no dev manual; strictPort:false deixa procurar outra se estiver ocupada.
const porta = Number(process.env.PORT) || 5173;

export default defineConfig({
  plugins: [react()],
  server: {
    port: porta,
    strictPort: false,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
