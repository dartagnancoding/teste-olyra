import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      // O pacote `server-only` lança ao ser importado fora do contexto de
      // servidor do React — é justamente essa a barreira que impede um
      // componente client de arrastar a chave do Supabase junto.
      //
      // Em teste apontamos para o `empty.js` que o próprio pacote publica: o
      // mesmo arquivo que o Next resolve na condição `react-server`. O caminho
      // é direto porque o `exports` do pacote não expõe esse subcaminho.
      'server-only': fileURLToPath(
        new URL('./node_modules/server-only/empty.js', import.meta.url),
      ),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
