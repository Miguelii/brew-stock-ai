import { z } from 'zod'

const TrpcErrorSchema = z.object({ data: z.object({ code: z.string() }) })

/** The tRPC error code (e.g. `'PAYMENT_REQUIRED'`) carried by a failed call, if any. */
export const getTrpcErrorCode = (cause: unknown): string | undefined => {
    const parsed = TrpcErrorSchema.safeParse(cause)
    return parsed.success ? parsed.data.data.code : undefined
}
