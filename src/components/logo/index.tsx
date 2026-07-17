import Link from 'next/link'

type Props = {
    linkToHome?: boolean
}

export default function Logo({ linkToHome = true }: Props) {
    return (
        <Link
            className="flex items-center gap-2 justify-start"
            href={linkToHome ? '/' : '/analysis'}
            prefetch={false}
        >
            <div className="font-bold text-lg tracking-tight">
                <span>BrewStock</span>
                <span className="text-accent-blue font-mono">AI</span>
            </div>
        </Link>
    )
}
