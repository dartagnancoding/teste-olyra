import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
})

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'node_modules/**',
      // Worktrees do Claude Code guardam uma cópia inteira do projeto,
      // `node_modules` inclusive. Sem esta linha o lint varre o projeto duas
      // vezes e afoga o resultado real em milhares de avisos de dependência.
      '.claude/**',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.test.ts'],
    rules: {
      // Descartar campo por desestruturação (`const { x: _x, ...resto }`) é o
      // jeito idiomático de montar um objeto sem uma chave — e é exatamente o
      // que os testes de contrato precisam fazer.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
]

export default eslintConfig
