import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Theme enforcement: flag raw Tailwind palette classes in JSX className values.
      // Components must use semantic tokens (bg-primary, text-success, bg-muted, etc.)
      // instead of raw palette classes (bg-emerald-500, text-indigo-600, border-slate-200).
      // See docs/theme-system.md §16 for full rationale and upgrade path to 'error'.
      'no-restricted-syntax': [
        'warn',
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/\\b(bg|text|border|ring|fill|stroke|outline|decoration|shadow|accent|caret|divide|placeholder|from|via|to)-(slate|zinc|gray|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/]",
          message:
            '[Theme] Raw Tailwind palette class detected. Use semantic tokens instead: bg-primary, text-success, bg-muted, text-destructive, etc. See docs/theme-system.md §8.',
        },
        {
          selector:
            "JSXAttribute[name.name='className'] TemplateLiteral /\\b(bg|text|border|ring|fill|stroke)-(slate|zinc|gray|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/",
          message:
            '[Theme] Raw Tailwind palette class in template literal detected. Use semantic tokens instead. See docs/theme-system.md §8.',
        },
      ],
    },
  },
])

