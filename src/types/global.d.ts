export {}

declare global {
    var dataLayer: unknown[]
    var gtag: (
        command: 'config' | 'set' | 'event' | 'consent',
        targetId: string,
        config?: { [key: string]: string | number | boolean | undefined }
    ) => void
    var adsbygoogle: unknown[]
}
