import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import noHardcodedArabic from './eslint-rules/no-hardcoded-arabic.js'

export default defineConfig([
  globalIgnores(['dist', 'generate-registry.js', 'eslint.config.js']),
  {
    plugins: {
      local: {
        rules: {
          'no-hardcoded-arabic': noHardcodedArabic
        }
      }
    },
    rules: {
      'local/no-hardcoded-arabic': 'error'
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
