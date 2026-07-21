import { defineConfig } from '@playwright/test'

// Dedicated config for the live Yahoo Finance contract test (e2e/tests/yahoo-contract.spec.ts).
// It hits the real Yahoo API (no web server/mock server/browser/auth needed).
export default defineConfig({
    testDir: './e2e/tests',
    testMatch: '**/yahoo-contract.spec.ts',
    fullyParallel: false,
    workers: 1,
    timeout: 60_000,
    retries: process.env.CI ? 2 : 0,
    reporter: [['list']],
})
