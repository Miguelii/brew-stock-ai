import { cn } from '@/lib/utils'
import { type PropsWithChildren, lazy, Suspense } from 'react'

type Props = PropsWithChildren<{
    className?: string
    svgOptions?: {
        duration?: number
    }
}>

const LazySVG = lazy(() => import('@/modules/home/hero/svg').then((m) => ({ default: m.SVG })))

export const BackgroundLines = ({ children, className, svgOptions }: Props) => {
    return (
        <div className={cn('h-screen w-full bg-background', className)}>
            <Suspense fallback={null}>
                <LazySVG svgOptions={svgOptions} />
            </Suspense>
            {children}
        </div>
    )
}
