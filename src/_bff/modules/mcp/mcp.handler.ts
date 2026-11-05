import 'server-only'
import { createHash } from 'node:crypto'
import { createMcpHandler, withMcpAuth } from 'mcp-handler'
import { z } from 'zod'
import { ServerEnv } from '@/env/server'
import { Logger, type LogValue } from '@/_bff/lib/server-logger'
import { verifyMcpToken } from '@/_bff/modules/mcp/helpers/verify-mcp-token.helper'
import { GET_ANALYSIS_BRIEF_TOOL } from '@/_bff/modules/mcp/tools/get-analysis-brief.tool'
import { LIST_ANALYSIS_TYPES_TOOL } from '@/_bff/modules/mcp/tools/list-analysis-types.tool'

type AuthRejectReason = 'missing_header' | 'not_bearer' | 'server_token_missing' | 'token_mismatch'

type RpcCall = {
    rpcMethod: string | null
    toolName: string | null
    toolArgs: LogValue
}

const mcpHandler = createMcpHandler(
    (server) => {
        LIST_ANALYSIS_TYPES_TOOL(server)
        GET_ANALYSIS_BRIEF_TOOL(server)
    },
    { serverInfo: { name: 'brewstock', version: '1.0.0' } }
)

const fingerprint = (value: string | undefined) =>
    value ? createHash('sha256').update(value).digest('hex').slice(0, 8) : null

const logAuthRejection = (req: Request, bearerToken: string | undefined) => {
    const authHeader = req.headers.get('authorization')
    const expectedToken = ServerEnv.NEXT_MCP_TOKEN

    let reason: AuthRejectReason = 'token_mismatch'
    if (!authHeader) reason = 'missing_header'
    else if (!bearerToken) reason = 'not_bearer'
    else if (!expectedToken) reason = 'server_token_missing'

    // Lengths and fingerprints only: Logger persists metadata to the logs table
    Logger({
        level: 'warn',
        prefix: 'mcpAuth',
        message: 'auth rejected',
        metadata: {
            reason,
            method: req.method,
            path: new URL(req.url).pathname,
            userAgent: req.headers.get('user-agent'),
            headerLength: authHeader?.length ?? 0,
            headerScheme: authHeader?.split(' ')[0] ?? null,
            receivedTokenLength: bearerToken?.length ?? 0,
            receivedTokenFingerprint: fingerprint(bearerToken),
            receivedTokenHasQuotes: bearerToken ? /^["']|["']$/u.test(bearerToken) : false,
            expectedTokenLength: expectedToken?.length ?? 0,
            expectedTokenFingerprint: fingerprint(expectedToken),
        },
    })
}

// Only the fields worth logging; the MCP SDK does the real validation
const rpcMessageSchema = z.object({
    method: z.string().optional(),
    params: z.object({ name: z.string().optional(), arguments: z.json().optional() }).optional(),
})

// A JSON-RPC body can be a single message or a batch
const rpcBodySchema = z.union([z.array(rpcMessageSchema), rpcMessageSchema])

const readRpcCalls = async (req: Request): Promise<RpcCall[]> => {
    if (req.method !== 'POST') return []

    const parsed = rpcBodySchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) return [{ rpcMethod: null, toolName: null, toolArgs: null }]

    const messages = Array.isArray(parsed.data) ? parsed.data : [parsed.data]

    return messages.map(({ method, params }) => {
        const isToolCall = method === 'tools/call'

        return {
            rpcMethod: method ?? null,
            toolName: isToolCall ? (params?.name ?? null) : null,
            toolArgs: isToolCall ? (params?.arguments ?? null) : null,
        }
    })
}

// Single shared token for now: every authorized caller is the owner
const authedMcpHandler = withMcpAuth(
    mcpHandler,
    (req, bearerToken) => {
        if (!bearerToken || !verifyMcpToken(bearerToken, ServerEnv.NEXT_MCP_TOKEN)) {
            logAuthRejection(req, bearerToken)
            return
        }

        return { token: bearerToken, clientId: 'owner', scopes: [] }
    },
    { required: true }
)

export const MCP_HANDLER = async (req: Request) => {
    const startedAt = Date.now()
    const calls = await readRpcCalls(req.clone())

    const response = await authedMcpHandler(req)

    Logger({
        level: 'info',
        prefix: 'mcp',
        message: calls.map((call) => call.toolName ?? call.rpcMethod).join(', ') || req.method,
        metadata: {
            httpMethod: req.method,
            status: response.status,
            durationMs: Date.now() - startedAt,
            userAgent: req.headers.get('user-agent'),
            calls,
        },
    })

    return response
}
