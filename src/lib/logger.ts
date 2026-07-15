import 'server-only'

import { after } from 'next/server'
import { createSbAdminClient, getIsDev } from '@/lib/utils.server'

type LogLevel = 'log' | 'warn' | 'error' | 'info'

type Props = {
    level: LogLevel
    prefix: string
    error?: unknown
    message?: string
    metadata?: Record<string, unknown>
    userId?: string
}

function serializeError(error: unknown): unknown {
    if (error == null) return error

    // Effect TaggedError — has _tag, skip the Effect fiber stack
    if (typeof error === 'object' && '_tag' in error) {
        const e = error as Record<string, unknown>
        const { stack: _, ...fields } = e
        return {
            ...fields,
            // cause is non-enumerable on Data.TaggedError so it won't appear
            // in the spread — access it directly via property lookup instead
            cause: serializeError(e.cause),
        }
    }

    // Standard Error — trim stack to first 4 lines
    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message || String(error),
            cause: error.cause ? serializeError(error.cause) : undefined,
            stack: error.stack?.split('\n').slice(0, 4).join('\n'),
        }
    }

    return error
}

export function Logger(props: Props): void {
    const { level, prefix, error, message, metadata, userId } = props

    const isDev = getIsDev()

    const parsedPrefix = isDev ? `[DEV] ${prefix}` : prefix

    const header = message ? `[${parsedPrefix}] ${message}` : `[${parsedPrefix}]`
    const details: Record<string, unknown> = { timestamp: new Date().toISOString() }

    if (userId !== undefined) details.userId = userId

    if (error !== undefined) details.error = serializeError(error)

    if (metadata !== undefined) details.metadata = metadata

    console[level](header, details)

    const run = async () => {
        if (isDev) return
        await persistLog(props).catch((err) => {
            console.error('[Logger] persist failed', err instanceof Error ? err.message : err)
        })
    }

    try {
        after(run)
    } catch {
        // Not inside a Next.js request scope (e.g., Trigger.dev task).
        // Trigger.dev awaits the run function so the floating promise resolves.
        void run()
    }
}

async function persistLog(props: Props): Promise<void> {
    const supabase = createSbAdminClient()

    const combinedMetadata: Record<string, unknown> = { ...props.metadata }

    if (props.error !== undefined) combinedMetadata.error = serializeError(props.error)

    const hasMetadata = Object.keys(combinedMetadata).length > 0

    const { error } = await supabase.from('logs').insert({
        level: props.level,
        prefix: props.prefix,
        message: props.message ?? null,
        metadata: hasMetadata ? combinedMetadata : null,
        user_id: props?.userId ?? null,
    })

    if (error) {
        console.error('persistLog', { error })
        throw new Error(error.message)
    }
}
