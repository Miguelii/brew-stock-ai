import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sbProxy } from '@/lib/utils.server'
import { NextRequest } from 'next/server'

// Mock server-only
vi.mock('server-only', () => ({}))

vi.mock('@/env/server', () => ({
    ServerEnv: {
        NEXT_SUPABASE_URL: 'http://localhost:54321',
        NEXT_SUPABASE_PUBLISHABLE_KEY: 'test-anon-key',
        NEXT_SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
    },
}))

// Mock next/headers — cookies() and headers() require a Next.js request scope
// that doesn't exist in Vitest, so we stub them out.
vi.mock('next/headers', () => ({
    cookies: vi.fn(() =>
        Promise.resolve({
            getAll: vi.fn(() => []),
            set: vi.fn(),
        })
    ),
    headers: vi.fn(() => Promise.resolve(new Headers())),
}))

const mockSupabaseClient = {
    auth: {
        getClaims: vi.fn(),
    },
}

vi.mock('@supabase/ssr', () => ({
    createServerClient: vi.fn(() => mockSupabaseClient),
}))

describe('sbProxy', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should return a response when user is authenticated', async () => {
        mockSupabaseClient.auth.getClaims.mockResolvedValue({
            data: { claims: { sub: 'user-123' } },
        })

        const request = new NextRequest('http://localhost:3000/reports')
        const response = await sbProxy(request)

        expect(response.status).toBe(200)
    })

    it('should redirect unauthenticated users from /reports to /', async () => {
        mockSupabaseClient.auth.getClaims.mockResolvedValue({
            data: { claims: null },
        })

        const request = new NextRequest('http://localhost:3000/reports')
        const response = await sbProxy(request)

        expect(response.status).toBe(307)
        expect(new URL(response.headers.get('location')!).pathname).toBe('/')
    })

    it('should redirect unauthenticated users from /reports/[id] to /', async () => {
        mockSupabaseClient.auth.getClaims.mockResolvedValue({
            data: { claims: null },
        })

        const request = new NextRequest('http://localhost:3000/reports/uuid-12313-13')
        const response = await sbProxy(request)

        expect(response.status).toBe(307)
        expect(new URL(response.headers.get('location')!).pathname).toBe('/')
    })
})
