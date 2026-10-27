import 'react'

// CSS custom properties set through inline `style` and read by Tailwind arbitrary values
declare module 'react' {
    interface CSSProperties {
        '--track-distance'?: string
        '--track-x'?: string
        '--stack-transform'?: string
        '--stack-top'?: string
    }
}
