import { createServer, type IncomingMessage, type ServerResponse, type Server } from 'node:http'
import { MOCK_REPORT, MOCK_STOCK_DATA } from './fixtures/mock-data'

const MOCK_USER = {
    id: 'pw-test-user-id',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'playwright@test.local',
    email_confirmed_at: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
}

function respond(res: ServerResponse, data: unknown, status = 200) {
    res.writeHead(status, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data))
}

function handle(req: IncomingMessage, res: ServerResponse) {
    const url = req.url ?? '/'
    const accept = req.headers['accept'] ?? ''
    const wantObject = accept.includes('application/vnd.pgrst.object+json')

    // Consume request body (required even if unused, prevents socket hang)
    req.resume()

    if (url.startsWith('/auth/v1/user')) {
        return respond(res, MOCK_USER)
    }

    if (url.startsWith('/auth/v1/')) {
        return respond(res, {})
    }

    if (url.startsWith('/rest/v1/reports')) {
        return respond(res, wantObject ? MOCK_REPORT : [MOCK_REPORT])
    }

    if (url.startsWith('/rest/v1/stock_data')) {
        return respond(res, wantObject ? MOCK_STOCK_DATA : [MOCK_STOCK_DATA])
    }

    if (url.startsWith('/rest/v1/')) {
        return respond(res, wantObject ? {} : [])
    }

    respond(res, {})
}

export function startMockSupabase(port = 54321): Promise<Server | null> {
    return new Promise((resolve, reject) => {
        const server = createServer(handle)
        server.on('error', (err: NodeJS.ErrnoException) => {
            if (err.code === 'EADDRINUSE') {
                // Port already occupied — a previous session left the server running.
                // Treat this as success so globalSetup doesn't block UI mode from showing tests.
                console.warn(`[mock-server] Port ${port} already in use — reusing existing server`)
                resolve(null)
            } else {
                reject(err)
            }
        })
        server.listen(port, '127.0.0.1', () => resolve(server))
    })
}

export function stopMockSupabase(server: Server): Promise<void> {
    return new Promise((resolve, reject) => {
        server.closeAllConnections()
        server.close((err) => (err ? reject(err) : resolve()))
    })
}
