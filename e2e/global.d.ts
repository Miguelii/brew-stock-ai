import type { Server } from 'node:http'

declare global {
    // Mock Supabase server handed from globalSetup to globalTeardown
    var __MOCK_SERVER__: Server | undefined
}
