import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginVitest from 'eslint-plugin-vitest'

export default [
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.vitest,
            },
        },
    },
    pluginJs.configs.recommended,
    {
        plugins: {
            vitest: pluginVitest,
        },
        rules: {
            ...pluginVitest.configs.recommended.rules,
            ...pluginJs.configs.recommended.rules,
        },
    },
    {
        ignores: ['dist', 'node_modules'],
    },
]
