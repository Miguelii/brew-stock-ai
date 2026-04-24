export {}

declare global {
    var dataLayer: unknown[]
    var gtag: (
        command: 'config' | 'set' | 'event' | 'consent',
        targetId: string,
        config?: Record<string, unknown>
    ) => void
}
