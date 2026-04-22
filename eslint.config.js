'use strict'

const js = require('@eslint/js')
const globals = require('globals')

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'coverage/**',
      '.nyc_output/**',
      '.tap/**',
      'example/**',
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
  },
]
