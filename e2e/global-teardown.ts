import type { Server } from 'node:http'
import { stopMockSupabase } from './mock-server'

export default async function globalTeardown() {
    const server = (globalThis as unknown as Record<string, unknown>).__MOCK_SERVER__ as
        | Server
        | undefined

    if (server) {
        await stopMockSupabase(server)
        console.log('[globalTeardown] Mock Supabase server stopped')
    }
}
