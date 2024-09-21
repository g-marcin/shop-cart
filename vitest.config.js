import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: './vitest.setup.js',
        exclude: ['node_modules', '**/tests/**/*.spec.js'],
    },
})
