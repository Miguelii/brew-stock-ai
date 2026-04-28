type LogLevel = 'log' | 'warn' | 'error' | 'info'

type Props = {
    level: LogLevel
    error?: unknown
    context?: string
    prefix?: string
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

export function Logger({ prefix = 'Logger', level, error, context }: Props): void {
    console[level](`[${prefix}]${context ? ` ${context}` : ''}`, {
        error: serializeError(error),
        timestamp: new Date().toISOString(),
    })
}
