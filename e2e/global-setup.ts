import { writeFileSync } from 'node:fs'
import { startMockSupabase } from './mock-server'

// @supabase/supabase-js derives the storage key as:
//   `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`
// For NEXT_SUPABASE_URL=http://localhost:54321 → 'sb-localhost-auth-token'
// @supabase/ssr chunks the value and names each chunk '<key>.<index>'
// A minimal session fits in one chunk → cookie name: 'sb-localhost-auth-token.0'

function b64url(str: string): string {
    return Buffer.from(str, 'utf8').toString('base64url')
}

function makeAccessToken(): string {
    const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = b64url(
        JSON.stringify({
            sub: 'pw-test-user-id',
            email: 'playwright@test.local',
            role: 'authenticated',
            aud: 'authenticated',
            exp: Math.floor(Date.now() / 1000) + 365 * 24 * 3600,
        })
    )
    // Signature is not validated (HS256 falls back to getUser() on mock server)
    return `${header}.${payload}.bW9jaw`
}

function makeSessionCookieValue(accessToken: string): string {
    const session = {
        access_token: accessToken,
        token_type: 'bearer',
        expires_in: 31536000,
        expires_at: Math.floor(Date.now() / 1000) + 31536000,
        refresh_token: 'mock-refresh-token',
        user: {
            id: 'pw-test-user-id',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'playwright@test.local',
        },
    }
    // @supabase/ssr encodes as: 'base64-' + stringToBase64URL(JSON.stringify(session))
    // Buffer.from().toString('base64url') produces the same output as stringToBase64URL
    return `base64-${Buffer.from(JSON.stringify(session), 'utf8').toString('base64url')}`
}

export default async function globalSetup() {
    const server = await startMockSupabase()

    if (server) {
        ;(globalThis as unknown as Record<string, unknown>).__MOCK_SERVER__ = server

        // Close the server immediately on SIGINT (Ctrl+C) or SIGTERM without
        // waiting for keep-alive connections to drain on their own.
        // process.once ensures we don't shadow Playwright's own signal handler —
        // ours fires first, closes the socket, then Playwright continues its shutdown.
        const forceClose = () => {
            server.closeAllConnections()
            server.close()
        }
        process.once('SIGINT', forceClose)
        process.once('SIGTERM', forceClose)
    }

    console.log('[globalSetup] Mock Supabase server listening on http://localhost:54321')

    const accessToken = makeAccessToken()
    const cookieValue = makeSessionCookieValue(accessToken)

    const authState = {
        cookies: [
            {
                name: 'sb-localhost-auth-token.0',
                value: cookieValue,
                domain: 'localhost',
                path: '/',
                expires: Math.floor(Date.now() / 1000) + 31536000,
                httpOnly: false,
                secure: false,
                sameSite: 'Lax',
            },
        ],
        origins: [],
    }

    writeFileSync('./e2e/fixtures/auth-state.json', JSON.stringify(authState, null, 2))
    console.log('[globalSetup] auth-state.json written')
}
