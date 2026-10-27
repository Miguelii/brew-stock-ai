import 'server-only'

import { after } from 'next/server'
import { createDBAdminClient } from '@/_bff/core/db'
import { z } from 'zod'
import { getIsDev } from '@/_bff/core/utils/env.utils'

type LogLevel = 'log' | 'warn' | 'error' | 'info'

// JSON-safe value printed to the console and persisted to `logs.metadata` (jsonb)
type LogValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | LogValue[]
    | { [key: string]: LogValue }

type LogMetadata = { [key: string]: LogValue }

type LogDetails = {
    timestamp: string
    userId?: string
    error?: LogValue
    metadata?: LogMetadata
}

type Props = {
    level: LogLevel
    prefix: string
    error?: unknown
    message?: string
    metadata?: LogMetadata
    userId?: string
}

// Decodes whatever was thrown or failed into a JSON-safe value
function serializeError(cause: unknown): LogValue {
    if (cause == null) return cause

    // Effect TaggedError: has _tag, skip the Effect fiber stack
    if (cause instanceof Error && '_tag' in cause) {
        const { stack: _, ...fields } = cause
        return {
            ...Object.fromEntries(
                Object.entries(fields).map(([key, value]) => [key, serializeError(value)])
            ),
            // cause is non-enumerable on Data.TaggedError so it won't appear
            // in the spread, access it directly via property lookup instead
            cause: serializeError(cause.cause),
        }
    }

    // Standard Error: trim stack to first 4 lines
    if (cause instanceof Error) {
        return {
            name: cause.name,
            message: cause.message || String(cause),
            cause: cause.cause ? serializeError(cause.cause) : undefined,
            stack: cause.stack?.split('\n').slice(0, 4).join('\n'),
        }
    }

    const json = z.json().safeParse(cause)
    return json.success ? json.data : String(cause)
}

export function Logger(props: Props): void {
    const { level, prefix, error, message, metadata, userId } = props

    const isDev = getIsDev()

    const parsedPrefix = isDev ? `[DEV] ${prefix}` : prefix

    const header = message ? `[${parsedPrefix}] ${message}` : `[${parsedPrefix}]`
    const details: LogDetails = { timestamp: new Date().toISOString() }

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
    const supabase = createDBAdminClient()

    const combinedMetadata =
        props.error === undefined
            ? { ...props.metadata }
            : { ...props.metadata, error: serializeError(props.error) }

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
