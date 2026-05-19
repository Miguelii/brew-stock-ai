import Link from 'next/link'

export default function Logo() {
    return (
        <Link className="flex items-center gap-2 justify-start" href="/" prefetch={false}>
            <div className="font-bold text-lg tracking-tight">
                <span>StockBrew</span>
                <span className="text-accent-blue font-mono">AI</span>
            </div>
        </Link>
    )
}
