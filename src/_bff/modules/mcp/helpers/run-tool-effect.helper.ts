import { Cause, Effect, Exit, Option } from 'effect'
import type { CallToolResult } from '@modelcontextprotocol/server'
import { Logger } from '@/_bff/lib/server-logger'

const textResult = (text: string, isError = false): CallToolResult => ({
    content: [{ type: 'text', text }],
    ...(isError && { isError: true }),
})

/**
 * MCP counterpart of `runEffect`: a failure becomes an `isError` tool result the
 * model can read and react to, instead of a thrown transport error.
 */
export async function runToolEffect<A, E extends { _tag: string; error_hash: string }>(
    effect: Effect.Effect<A, E>,
    context: string,
    toText: (value: A) => string,
    mapMessage: (error: E) => string
): Promise<CallToolResult> {
    const exit = await Effect.runPromiseExit(effect)

    if (Exit.isSuccess(exit)) return textResult(toText(exit.value))

    const maybeError = Cause.findErrorOption(exit.cause)

    if (Option.isNone(maybeError)) {
        const defects = exit.cause.reasons.filter(Cause.isDieReason).map((reason) => reason.defect)
        Logger({ level: 'error', prefix: context, message: 'defect', error: defects })
        return textResult('Unexpected server error. Try again later.', true)
    }

    const error = maybeError.value

    Logger({ level: 'error', prefix: context, error })

    return textResult(`${mapMessage(error)} (code ${error.error_hash})`, true)
}
