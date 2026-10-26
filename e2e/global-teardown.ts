import { stopMockSupabase } from './mock-server'

export default async function globalTeardown() {
    const server = globalThis.__MOCK_SERVER__

    if (server) {
        await stopMockSupabase(server)
        console.log('[globalTeardown] Mock Supabase server stopped')
    }
}
