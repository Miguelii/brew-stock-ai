import { TRPCError } from '@trpc/server'
import { Cause, Effect, Exit, Option } from 'effect'
import { Logger } from '@/lib/logger'
import { getCachedUserId } from '@/_backend/modules/auth/services/get-cached-user-id.service'

export async function runEffect<A, E extends { _tag: string; error_hash: string }>(
    effect: Effect.Effect<A, E>,
    context: string,
    mapCode: (error: E) => TRPCError['code']
): Promise<A> {
    const exit = await Effect.runPromiseExit(effect)

    if (Exit.isSuccess(exit)) return exit.value

    const userId = await getCachedUserId()

    const maybeError = Cause.failureOption(exit.cause)

    if (Option.isNone(maybeError)) {
        const defects = Cause.defects(exit.cause)
        Logger({ level: 'error', prefix: context, message: 'defect', error: defects, userId })
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'unexpected_defect' })
    }

    const error = maybeError.value

    Logger({ level: 'error', prefix: context, error, userId })

    throw new TRPCError({ code: mapCode(error), message: error.error_hash })
}
