import { defineConfig, devices } from '@playwright/test'
import { existsSync, writeFileSync, mkdirSync } from 'node:fs'

// Ensure auth-state.json always exists so Playwright can load the config in --ui mode
// before globalSetup has had a chance to generate it.
const AUTH_STATE_PATH = './e2e/fixtures/auth-state.json'
if (!existsSync(AUTH_STATE_PATH)) {
    mkdirSync('./e2e/fixtures', { recursive: true })
    writeFileSync(AUTH_STATE_PATH, JSON.stringify({ cookies: [], origins: [] }, null, 2))
}

export default defineConfig({
    testDir: './e2e/tests',
    globalSetup: './e2e/global-setup.ts',
    globalTeardown: './e2e/global-teardown.ts',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: 'http://localhost:3001',
        storageState: AUTH_STATE_PATH,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        // Port 3001 keeps E2E isolated from the dev server on 3000.
        // Env vars point Next.js at the mock servers started in globalSetup.
        // In CI the app is already built (separate step) so we use `pnpm start`
        // for speed and to test the actual production bundle.
        // Locally we use `pnpm dev` so no build step is needed.
        command: [
            'PORT=3001',
            'NEXT_SUPABASE_URL=http://localhost:54321',
            'NEXT_SUPABASE_PUBLISHABLE_KEY=test-publishable-key',
            'NEXT_SUPABASE_SERVICE_ROLE_KEY=test-service-key',
            'NEXT_FINNHUB_BASE_URL=http://localhost:54321/api/v1',
            'NEXT_FINNHUB_API_KEY=test-key',
            process.env.CI ? 'pnpm start' : 'pnpm dev',
        ].join(' '),
        url: 'http://localhost:3001',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
})
