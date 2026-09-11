import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {
    linkToHome?: boolean
    className?: string
}

export default function Logo({ linkToHome = true, className }: Props) {
    return (
        <Link
            className={cn('font-display text-[20px] leading-none', className)}
            style={{ letterSpacing: 0 }}
            href={linkToHome ? '/' : '/analysis'}
            prefetch={false}
        >
            BrewStock<span className="text-blue">AI</span>
        </Link>
    )
}
