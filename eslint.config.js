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
        'error',
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/\\b(bg|text|border|ring|fill|stroke|outline|decoration|shadow|accent|caret|divide|placeholder|from|via|to)-(slate|zinc|gray|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/]",
          message:
            '[Theme] Raw Tailwind palette class detected. Use semantic tokens instead: bg-primary, text-success, bg-muted, text-destructive, etc. See docs/theme-system.md §8.',
        },
        {
          selector: "JSXOpeningElement[name.name='Card'] JSXAttribute[name.name='className'] Literal[value=/\\brounded-(lg|2xl)\\b/]",
          message: "[Theme] Cards must use rounded-xl per UX/UI guidelines. Do not use rounded-lg or rounded-2xl on Card components.",
        },
        {
          selector: "JSXAttribute[name.name='className'] Literal[value=/(?=.*\\bbg-card\\b)(?=.*\\brounded-(lg|2xl)\\b)/]",
          message: "[Theme] Card elements (containing bg-card) must use rounded-xl per UX/UI guidelines. Do not use rounded-lg or rounded-2xl.",
        },
        {
          selector: "JSXAttribute[name.name='className'] Literal[value=/\\b(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y)-(1|3|5|7|9|11|13|15)\\b/]",
          message: "[Theme] Spacing utilities must adhere to the 8-point grid (multiples of 2 in Tailwind, e.g. p-2, p-4, p-6). Odd-numbered spacing (p-1, p-3, gap-5) is not allowed.",
        }
      ],
    },
  },
])

