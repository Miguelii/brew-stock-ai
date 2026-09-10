import { cn } from '@/lib/utils'

type Props = {
    className?: string
}

/** Soft bubble clouds. Stretched edge to edge behind the hero. */
export function Clouds({ className }: Props) {
    return (
        <svg
            viewBox="0 0 1440 120"
            fill="none"
            aria-hidden="true"
            className={cn('block h-12 w-full', className)}
        >
            <g fill="#ffffff" opacity="0.92">
                <path d="M120 96c-24 0-44-16-44-36s20-36 44-36c8 0 15 2 21 6 8-16 25-26 45-26 26 0 47 19 50 43 16 3 28 16 28 32 0 10-5 17-5 17H120Z" />
                <path d="M760 96c-19 0-34-13-34-29s15-29 34-29c6 0 12 1 17 4 6-13 20-21 36-21 21 0 38 15 40 34 13 3 22 13 22 26 0 8-4 15-4 15H760Z" />
                <path d="M1180 96c-16 0-29-11-29-25s13-25 29-25c5 0 10 1 14 4 5-11 17-18 30-18 18 0 32 13 34 29 11 2 19 11 19 22 0 7-3 13-3 13h-94Z" />
            </g>
        </svg>
    )
}
