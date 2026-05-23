import { defineConfig, devices } from '@playwright/test'

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
        storageState: './e2e/fixtures/auth-state.json',
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
        // Env vars point Next.js at the mock Supabase server started in globalSetup.
        command: [
            'PORT=3001',
            'NEXT_SUPABASE_URL=http://localhost:54321',
            'NEXT_SUPABASE_PUBLISHABLE_KEY=test-publishable-key',
            'NEXT_SUPABASE_SERVICE_ROLE_KEY=test-service-key',
            'pnpm dev',
        ].join(' '),
        url: 'http://localhost:3001',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
})
