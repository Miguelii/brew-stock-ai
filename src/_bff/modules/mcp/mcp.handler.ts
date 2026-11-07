import 'server-only'
import { createMcpHandler, withMcpAuth } from 'mcp-handler'
import { z } from 'zod'
import { ServerEnv } from '@/env/server'
import { Logger, type LogValue } from '@/_bff/lib/server-logger'
import { verifyMcpToken } from '@/_bff/modules/mcp/helpers/verify-mcp-token.helper'
import { GET_ANALYSIS_BRIEF_TOOL } from '@/_bff/modules/mcp/tools/get-analysis-brief.tool'
import { LIST_ANALYSIS_TYPES_TOOL } from '@/_bff/modules/mcp/tools/list-analysis-types.tool'

type AuthRejectReason = 'missing_header' | 'not_bearer' | 'server_token_missing' | 'token_mismatch'

const LOGGED_TOOL = 'get_analysis_brief'

const mcpHandler = createMcpHandler(
    (server) => {
        LIST_ANALYSIS_TYPES_TOOL(server)
        GET_ANALYSIS_BRIEF_TOOL(server)
    },
    { serverInfo: { name: 'brewstock', version: '1.0.0' } }
)

// Vercel's edge sets these headers and overwrites any the client sends
const getClientOrigin = (req: Request) => ({
    ip:
        req.headers.get('x-real-ip') ??
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        null,
    country: req.headers.get('x-vercel-ip-country'),
})

const logAuthRejection = (req: Request, bearerToken: string | undefined) => {
    const authHeader = req.headers.get('authorization')

    let reason: AuthRejectReason = 'token_mismatch'
    if (!authHeader) reason = 'missing_header'
    else if (!bearerToken) reason = 'not_bearer'
    else if (!ServerEnv.NEXT_MCP_TOKEN) reason = 'server_token_missing'

    Logger({
        level: 'warn',
        prefix: 'mcpAuth',
        message: `auth rejected: ${reason}`,
        metadata: {
            // Raw header when it is not a Bearer one, so the caller's mistake is visible
            token: bearerToken ?? authHeader,
            ...getClientOrigin(req),
            userAgent: req.headers.get('user-agent'),
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

// Protocol chatter (initialize, tools/list, server/discover) is not worth a log row
const readLoggedToolArgs = async (req: Request): Promise<LogValue[]> => {
    if (req.method !== 'POST') return []

    const parsed = rpcBodySchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) return []

    const messages = Array.isArray(parsed.data) ? parsed.data : [parsed.data]

    return messages
        .filter(({ method, params }) => method === 'tools/call' && params?.name === LOGGED_TOOL)
        .map(({ params }) => params?.arguments ?? null)
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
    const loggedCalls = await readLoggedToolArgs(req.clone())

    const response = await authedMcpHandler(req)

    if (loggedCalls.length > 0) {
        Logger({
            level: 'info',
            prefix: 'mcp',
            message: LOGGED_TOOL,
            metadata: {
                status: response.status,
                durationMs: Date.now() - startedAt,
                ...getClientOrigin(req),
                userAgent: req.headers.get('user-agent'),
                args: loggedCalls,
            },
        })
    }

    return response
}
