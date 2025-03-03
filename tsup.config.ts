import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/**/*.ts', '!src/**/*.test.*'],
    splitting: false,
    sourcemap: true,
    clean: true,
    format: ['cjs'],
    minify: true
});